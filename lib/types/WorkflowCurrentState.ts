export type WorkflowCurrentState = {
	currentStep: string;
	metadata: {
		// For entire workflow level metadata
		general: any;

		// For step level metadata
		[stepId: string]: {
			// Client-side
			inputs?: Record<string, any>;
			[key: string]: any;
		};
	};
	// Stack of steps executed
	executionSequence: string[];
};
