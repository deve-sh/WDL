import { useEffect, useState } from "react";

import { type WorkflowDefinitionSchema } from "lib/dist";
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

	if (
		template.steps.find(
			(step) => step.id === (currentNode.data.userEnteredId || currentNode.id)
		)
	)
		// Already added this block to our list of steps
		return template;

	let block: WorkflowDefinitionSchema["steps"][number];

	const commonBlockInputs = {
		name: currentNode.data.stepName || "",
		heading: currentNode.data.heading || "",
		description: currentNode.data.description || "",
		id: currentNode.data.userEnteredId || currentNode.data.id || currentNode.id,
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
				condition: currentNode.data.condition || "",
				onTrue: { targetStep: onTrueNode ? onTrueNode.target : "" },
				onFalse: { targetStep: onFalseNode ? onFalseNode.target : "" },
			};
	}
	if (currentNode.type === "interactive-input") {
		// Interactive steps can split multiple ways depending on the number of actions
		block = {
			...commonBlockInputs,
			type: "interactive-step",
			actions: [],
			inputs: [],
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
				expression: currentNode.data.expression || "",
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
					endpoint: currentNode.data.requestProps?.endpoint || "",
					body: currentNode.data.requestProps?.body || {},
					headers: currentNode.data.requestProps?.headers || {},
					onSuccess: { targetStep: onSuccessEdge?.target || "" },
					onError: { targetStep: onErrorEdge?.target || "" },
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
