const $ = require('jquery');


//　 時間段を取得
export function getFullYearMonth(date, now) {
	if (date !== undefined && date !== null && date !== "") {
		var returnYears = 0;
		var returnMonths = 0;
		var yearmonth = -1;
		var keyYear = date.getFullYear();
		var keyMonth = date.getMonth();
		var keyDay = date.getDate();
		var nowYear = now.getFullYear();
		var nowMonth = now.getMonth() + 1;
		var nowDay = now.getDate();
		var yearDiff = nowYear - keyYear;
		var monthDiff = nowMonth - keyMonth;
		var dayDiff = nowDay - keyDay;

		if (yearDiff < 0) {
			return "0年0月";
		}

		if (yearDiff === 0 && monthDiff < 0) {
			return "0年0月";
		}

		if (yearDiff === 0 && monthDiff === 0 && dayDiff < 0) {
			return "0年0月";
		}

		returnYears = yearDiff;
		if (monthDiff < 0) {
			returnYears = returnYears - 1;
			monthDiff = 12 + monthDiff;
		}

		returnMonths = monthDiff
		if (dayDiff < 0) {
			returnMonths = returnMonths - 1;
		}
		yearmonth = returnYears + "年" + returnMonths + "月";
		return yearmonth;
	}else {
		return "";
	}


}


//　ド時間プラグインの値をセット
export function setFullYearMonth(date) {
	var month = date.getMonth() + 1;
	var value = date.getFullYear() + '' + (month < 10 ? '0' + month : month);
	return value;
}


//　ドロップダウン
export function getdropDown(method) {
	var array = [{ code: '', name: '選択ください' }];
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8080/" + method,
		async: false,
		success: function (msg) {
			for (var i in msg) {
				array.push(msg[i])
			}
		}
	});
	return array;
}
//　ドロップダウン  多くメソッド
export function getPublicDropDown(methodArray) {
	var outArray = [];
	for (var i = 0; i < methodArray.length; i++) {
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1:8080/" + methodArray[i],
			async: false,
			success: function (msg) {
				var array = [{ code: '', name: '選択ください' }];
				for (var i in msg) {
					array.push(msg[i])
				}
				outArray.push(array);
			}
		});
	}
	return outArray;
}

//　採番番号
export async function getNO(columnName, typeName, table) {
	var no;
	var mo = {
		columnName: columnName,
		typeName: typeName,
		name: table
	};
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8080/getNO",
		data: JSON.stringify(mo),
		contentType: "application/json",
		async: false,
		success: function (data) {
			if (data != null) {
				no = data
			}
		}
	});
	return no;
}


export function escapeRegexCharacters(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getSuggestionDlt(suggestion) {
	return suggestion.name;
}
export function getSuggestions(value, datas) {
	const escapedValue = escapeRegexCharacters(value.trim());
	const regex = new RegExp('^' + escapedValue, 'i');
	return datas.filter(data => regex.test(data.name));
}
export function renderSuggestion(suggestion) {
	return (
		suggestion.name
	);
}

//　　　テーブルのsort
export function getCaret(direction) {
	if (direction === 'asc') {
		return "▲";
	}
	if (direction === 'desc') {
		return "▼"
			;
	}
	return "▲/▼";
}
/**
 * 前到后时间格式
 * @param {*} datetime 日本时间时间戳
 * @param {*} flag 判断是年月(false)还是年月日(true)
 * @return 年月或年月日（没有/）或空
 */
export function formateDate(datetime, flag) {
	if (datetime !== undefined && datetime !== null && datetime !== "") {
		function addDateZero(num) {
			return (num < 10 ? "0" + num : num);
		}
		let d = new Date(datetime);
		let formatdatetime
		if (flag === true) {
			formatdatetime = d.getFullYear() + '' + addDateZero(d.getMonth() + 1) + '' + addDateZero(d.getDate());
		} else {
			formatdatetime = d.getFullYear() + '' + addDateZero(d.getMonth() + 1);
		}
		return formatdatetime;
	} else {
		return "";
	}
}
/**
 * 后到前时间格式
 * @param {*} serverDate 数据库的时间
 * @param {*} flag 判断是年月(false)还是年月日(true)
 * @retur 日本时间戳
 */
export function converToLocalTime(serverDate, flag) {
	if (serverDate !== undefined && serverDate !== null && serverDate !== "") {
		if (flag === true) {
			var pattern = /(\d{4})(\d{2})(\d{2})/;
			var dt = new Date(serverDate.replace(pattern, '$1-$2-$3'));
			return dt;
		} else {
			var pattern = /(\d{4})(\d{2})/;
			var dt = new Date(serverDate.replace(pattern, '$1-$2'));
			return dt;
		}
	} else {
		return "";
	}


}

//誕生日ー年齢計算
export function birthday_age(age) {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var value = (year-age) + '' + (month < 10 ? '0' + month : month)+ '' +(day < 10 ? '0' + day : day);
	return value;
}