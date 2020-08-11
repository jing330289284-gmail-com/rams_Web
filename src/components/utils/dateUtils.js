const $ = require('jquery');
const axios = require('axios');


//　 時間段を取得
export function getFullYearMonth(date, now) {
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

/* 
export function getNO2(columnName, typeName, table) {
	var no;
	var mo = {
		columnName: columnName,
		typeName: typeName,
		name: table
	};
	$.ajax({
		type: "POST",
		data:mo,
		url: "http://127.0.0.1:8080/getNO",
		async: false,
		success: function (msg) {
			alert(msg)
				no = msg
		}
	});
	return　no;
} */
//　採番番号
export async function getNO(columnName, typeName, table) {
	var no;
	var mo = {
		columnName: columnName,
		typeName: typeName,
		name: table
	};
	await axios.post("http://127.0.0.1:8080/getNO", mo)
		.then(response => {
			if (response.data != null) {
				no = response.data
			}
		}).catch((error) => {
			console.error("Error - " + error);
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


