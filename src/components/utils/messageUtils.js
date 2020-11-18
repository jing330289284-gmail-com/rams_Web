import * as publicUtils from './publicUtils.js';
/**
 * フロントサイトしか使わないメッセージ
 * 20201019 謝
 */
export function getMessage(key, option, isNextLine) {
	let returnMessage = "";
	let message = {};
	message["E0001"] = "day {{{0}}} work content is null";
	message["E0002"] = "day {{{0}}} startTime >= endTime";
	message["E0003"] = "day {{{0}}} startTime is null";
	message["E0004"] = "day {{{0}}} endTime is null";
	message["E0005"] = "day {{{0}}} startTime is be not normative";
	message["E0006"] = "day {{{0}}} endTime is be not normative";
	returnMessage = message[key];
	if (!publicUtils.isNull(option)) {
		if (Array.isArray(option)) {
			for (let i = 0; i < option.length; i++) {
				returnMessage = returnMessage.replace("{{{" + i + "}}}", option[i]);
			}
		}
		returnMessage = returnMessage.replace("{{{0}}}", option);
	}
	if (!publicUtils.isNull(isNextLine) && isNextLine === true) {
		returnMessage += "\n";
	}
	return returnMessage;
}

