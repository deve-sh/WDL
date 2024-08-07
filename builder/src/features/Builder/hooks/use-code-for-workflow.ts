import { useEffect, useState } from "react";

import { type WorkflowDefinitionSchema } from "wdl";
import { type Edge, type Node, getOutgoers } from "reactflow";

import {
	getEdgesForNode,
	isNodeConnectedToAnyOtherNodes,
} from "../utils/flowHelpers";

import useWorkflowStore, { workflowStore } from "../store";

const recursivelyCreateWorkflowTemplate = (
	currentNode: Node,
	nodes: Node[],
	edges: Edge[],
	workflow?: WorkflowDefinitionSchema
) => {
	const template = workflow || {
		id: "workflow",
		steps: [],
	};

	const getFieldFromNodeMetadata = (field: string) => {
		return currentNode.data ? currentNode.data[field] : null;
	};

	const getUserEnteredIdOfNode = (nodeId?: string) => {
		if (!nodeId) return "";

		const foundNode = nodes.find((node) => node.id === nodeId);
		if (!foundNode) return "";

		return (
			foundNode.data?.["userEnteredId"] ||
			foundNode.data?.["id"] ||
			foundNode.id
		).replace("-", "_");
	};

	if (
		template.steps.find(
			(step) => step.id === getUserEnteredIdOfNode(currentNode.id)
		)
	)
		// Already added this block to our list of steps
		return template;

	let block: WorkflowDefinitionSchema["steps"][number];

	const commonBlockInputs = {
		name: getFieldFromNodeMetadata("stepName") || "",
		heading: getFieldFromNodeMetadata("heading") || "",
		description: getFieldFromNodeMetadata("description") || "",
		id: getUserEnteredIdOfNode(currentNode.id),
	};

	const edgesForThisBlock = getEdgesForNode(currentNode, edges);

	if (currentNode.type === "if-else") {
		// Conditional nodes can split two ways
		const onTrueNode = edgesForThisBlock.find(
			(edge) => edge.sourceHandle === "onTrue"
		);
		const onFalseNode = edgesForThisBlock.find(
			(edge) => edge.sourceHandle === "onFalse"
		);

		if (
			onTrueNode ||
			onFalseNode ||
			isNodeConnectedToAnyOtherNodes(currentNode, edges)
		)
			block = {
				...commonBlockInputs,
				type: "condition",
				condition: getFieldFromNodeMetadata("condition") || "",
				onTrue: {
					targetStep: onTrueNode
						? getUserEnteredIdOfNode(onTrueNode.target)
						: "",
				},
				onFalse: {
					targetStep: onFalseNode
						? getUserEnteredIdOfNode(onFalseNode.target)
						: "",
				},
			};
	}
	if (currentNode.type === "interactive-input") {
		// Interactive steps can split multiple ways depending on the number of actions
		block = {
			...commonBlockInputs,
			type: "interactive-step",
			actions: currentNode.data.actions ? currentNode.data.actions : [],
			blocks: currentNode.data.blocks ? currentNode.data.blocks : [],
		};
	}
	if (currentNode.type === "resolver") {
		// Simple outgoers that need to connect to one another
		block = {
			...commonBlockInputs,
			type: "request-or-resolver",
			action: { type: "resolver" },
		};
	}
	if (currentNode.type === "evaluate") {
		const onCompleteEdge = edgesForThisBlock[0];
		if (onCompleteEdge)
			block = {
				...commonBlockInputs,
				type: "evaluation",
				expression: getFieldFromNodeMetadata("expression") || "",
				onComplete: { targetStep: onCompleteEdge.target },
			};
	}
	if (currentNode.type === "request") {
		const onSuccessEdge = edgesForThisBlock.find(
			(edge) => edge.sourceHandle === "onSuccess"
		);
		const onErrorEdge = edgesForThisBlock.find(
			(edge) => edge.sourceHandle === "onError"
		);

		let requestBody = {},
			requestHeaders = {};

		try {
			requestBody = JSON.parse(getFieldFromNodeMetadata("body") || "{}");
			requestHeaders = JSON.parse(getFieldFromNodeMetadata("headers") || "{}");
		} catch {
			//
		}

		if (
			onSuccessEdge ||
			onErrorEdge ||
			isNodeConnectedToAnyOtherNodes(currentNode, edges)
		) {
			block = {
				...commonBlockInputs,
				type: "request-or-resolver",
				action: {
					type: "request",
					endpoint: getFieldFromNodeMetadata("endpoint") || "",
					body: requestBody || {},
					method: getFieldFromNodeMetadata("method") || "GET",
					headers: requestHeaders || {},
					onSuccess: {
						targetStep: getUserEnteredIdOfNode(onSuccessEdge?.target) || "",
					},
					onError: {
						targetStep: getUserEnteredIdOfNode(onErrorEdge?.target) || "",
					},
				},
			};
		}
	}

	// @ts-expect-error We have covered all cases
	// But this will show an error as there is no fallback condition
	// in case no conditions match for block generation
	if (block) template.steps.push(block);

	// Continue adding further nodes originating or connected to this node
	const outgoersFromCurrentNode = getOutgoers(currentNode, nodes, edges);
	if (outgoersFromCurrentNode.length) {
		for (const outgoingNode of outgoersFromCurrentNode) {
			recursivelyCreateWorkflowTemplate(outgoingNode, nodes, edges, template);
		}
	}

	return template;
};

const initWorkflowTemplate = { id: "sample-workflow", steps: [] };

const useCodeForWorkflow = () => {
	const store = useWorkflowStore();

	const [computedTemplate, setComputedTemplate] =
		useState<WorkflowDefinitionSchema>(initWorkflowTemplate);

	const computeTemplate = () => {
		const workflowNodes = workflowStore.getState().nodes;
		const workflowEdges = workflowStore.getState().edges;

		const startNode = workflowNodes.find((node) => node.type === "start");

		if (!startNode)
			return "Add a start block to your workflow to see automatic code generated here.";

		const computedWorkflowTemplateDefintion = recursivelyCreateWorkflowTemplate(
			startNode,
			workflowNodes,
			workflowEdges,
			JSON.parse(JSON.stringify(initWorkflowTemplate))
		);

		setComputedTemplate(computedWorkflowTemplateDefintion);
	};

	useEffect(() => {
		// Debounce
		const timeout = setTimeout(computeTemplate, 250);
		return () => clearTimeout(timeout);
	}, [store]);

	useEffect(() => {
		// Initializer
		computeTemplate();
	}, []);

	return JSON.stringify(computedTemplate, null, 2);
};

export default useCodeForWorkflow;
