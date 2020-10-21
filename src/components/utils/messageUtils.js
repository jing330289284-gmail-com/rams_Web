import * as publicUtils from './publicUtils.js';
/**
 * フロントサイトしか使わないメッセージ
 * 20201019 謝
 */
export function getMessage(key, option, isNextLine) {
	let returnMessage = "";
	let message = {};
	message["E0001"] = "day {{{0}}} work content";
	returnMessage = message[key];
	if (!publicUtils.isNull(option))	{
		if (Array.isArray(option))	{
			for (let i = 0; i < option.length; i++)	{
				returnMessage = returnMessage.replace("{{{" + i + "}}}", option[i]);
			}
		}
		returnMessage = returnMessage.replace("{{{0}}}", option);
	}
	if (!publicUtils.isNull(isNextLine) && isNextLine === true)	{
		returnMessage += "\n";
	}	
	return returnMessage;
}

