// @ts-expect-error PrismJS's types somehow don't work here
import { highlight, languages } from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.min.css";

export const getUsageCodeSnippet = () => {
	const code = `import Workflow from 'wdl';
    
// Get the workflow definition using the Builder
const workflow = new Workflow(workflowDefinition).loadCurrentState();

// Use other workflow library functions to validate steps, run actions and move between state-machine stages
workflow.validateStepAction(...);
workflow.processCurrentStep(...);
workflow.goToStep(...);
workflow.goAhead();
workflow.goBack();
workflow.setStepMetadata(...);
workflow.registerResolver(...);

// Store this in your DB for use across your apps and stacks. Use this to resume a workflow from this point later.
const currentWorkflowState = workflow.getCurrentState();
`;

	return highlight(code, languages.js);
};

export const getInstallationCodeSnippet = () => {
	const code = `npm i wdl`;

	return highlight(code, languages.shell);
};
