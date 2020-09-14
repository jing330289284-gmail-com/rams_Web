const $ = require('jquery');
const axios = require('axios');


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
	} else {
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
		success: function(msg) {
			for (var i in msg) {
				array.push(msg[i])
			}
		}
	});
	return array;
}
//　ドロップダウン  多くメソッド
export function getPublicDropDown(methodNameList) {
	var outArray = [];
	var par = JSON.stringify(methodNameList);
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8080/initializationPage",
		data:par,
		async: false,
		contentType:"application/json",
		success: function(resultList) {
			for(let j = 0;j < resultList.length; j++){
				var array = [{ code: '', name: '選択ください' }];
				var list = resultList[j];
				for (var i in list) {
					array.push(list[i])
				}
				outArray.push(array);
			}
		}
	});
	return outArray;
}

//　ドロップダウン  多くメソッド react-bootstrap-table---->select専用
export function getPublicDropDownRtBtSpTleOnly(methodArray) {
	var outArray = [];
	for (var i = 0; i < methodArray.length; i++) {
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1:8080/" + methodArray[i],
			async: false,
			success: function(msg) {
				var array = [{ value: '', text: '選択ください' }];
				for (var k in msg) {
					var arrayDetail1 = { value: '', text: '' }
					if (msg[k].code !== null) {
						arrayDetail1 = { value: msg[k].code, text: msg[k].name }
					} else {
						arrayDetail1 = { value: msg[k].value, text: msg[k].label }
					}
					array.push(arrayDetail1)
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
		success: function(data) {
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

export function timeToStr(date) {
	if (date !== undefined && date !== null && date !== "") {
		function addDateZero(num) {
			return (num < 10 ? "0" + num : num);
		}
		let d = new Date(date);
		return d.getFullYear() + '' + addDateZero(d.getMonth() + 1) + '' + addDateZero(d.getDate()) + '' +
			addDateZero(d.getHours()) + '' + addDateZero(d.getMinutes());
	} else {
		return "";
	}
};

// yyyymmddhhmm→yyyy/mm/dd hh:mm
export function strToTime(datetime) {
	if (datetime !== undefined && datetime !== null && datetime !== "") {
		var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/;
		return datetime.replace(pattern, '$1/$2/$3 $4:$5');
	} else {
		return "";
	}
};

//誕生日ー年齢計算
export function birthday_age(age) {
	if (age !== undefined && age !== null && age !== "") {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var value = (year - age) + '' + (month < 10 ? '0' + month : month) + '' + (day < 10 ? '0' + day : day);
	}
	return value;
}
/**
 * 联想框label的value取得
 * @param {*} name name的值
 * @param {*} list 后台传来的下拉框数组
 * @return name对应的code值
 */
export function labelGetValue(name, list) {
	for (var i in list) {
		if (name === list[i].name) {
			return list[i].code;
		}
	}
}

//Download 方法
// param path  備考：ファイルのフォーマットは下記です
// src/main/resources/file/LYC078_姜下載/姜下載_履歴書1.xlsx
export function handleDownload(path) {
	if (path !== undefined && path !== null && path !== "") {
		console.log(path);
		//src/main/resources/file/
		var NewPath = new Array();
		NewPath = path.split("/");
		var pathInfo = NewPath.slice(-3);
		var strPath = pathInfo.join('/');
		console.log(NewPath);
		var xhr = new XMLHttpRequest();
		xhr.open('post', 'http://127.0.0.1:8080/download', true);
		xhr.responseType = 'blob';
		xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
		xhr.onload = function() {
			if (this.status === 200) {
				var blob = this.response;
				if (blob.size === 0) {
					alert('no resume');
				} else {
					var a = document.createElement('a');
					var url = window.URL.createObjectURL(blob);
					a.href = url;
					//设置文件名称
					a.download = NewPath[5];
					a.click();
					a.remove();
				}
			}
		}
		xhr.send(JSON.stringify({
			"name": strPath,
		}));
	}

}

/**
//http://zipcloud.ibsnet.co.jp/doc/api 郵便番号検索API
* 郵便番号のApi
*/
export async function postcodeApi() {
	var postcode = document.getElementById("postcode").value;
	if (postcode !== undefined && postcode !== null && postcode !== "") {
		await axios.post("/postcodeApi/search?zipcode=" + postcode)
			.then(function(result) {
				if (result.data.status === 200) {
					$("#firstHalfAddress").val(result.data.results[0].address1 + result.data.results[0].address2 + result.data.results[0].address3);
				} else {
					alert("必須パラメータが指定されていません。")//一時的な情報、後で修正します。
				}

			}).catch((error) => {
				console.error("Error - " + error);
			});
	} else {
	}
}

//　　年齢と和暦
export async function calApi(date) {
	var birthDayTime = date.getTime();
	var nowTime = new Date().getTime();
	$("#temporary_age").val(Math.ceil((nowTime - birthDayTime) / 31536000000));
	//http://ap.hutime.org/cal/ 西暦と和暦の変換
	const ival = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	await axios.get("/cal?method=conv&ical=101.1&itype=date&ival=" + ival + "&ocal=1001.1").then(function(result) {
		console.log(result.data);
		if (result.data != null) {
			$("#japaneseCalendar").val(result.data);
		}
	}).catch((error) => {
		console.error("Error - " + error);
	});

};


