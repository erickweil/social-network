import { VerboseReporter } from "@jest/reporters";

// https://github.com/jestjs/jest/issues/4156
export default class Reporter extends VerboseReporter {
	constructor() {
		super(...arguments);
	}

	printTestFileHeader(testPath, config, result) {
		const cconsole = result.console;

		if(result.numFailingTests === 0 && !result.testExecError) {
            console.log(cconsole);
			result.console = null;
		}

		super.printTestFileHeader(...arguments);

		result.console = cconsole;
	}
}