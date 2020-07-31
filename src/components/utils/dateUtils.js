const $ = require('jquery');
const axios = require('axios');


//年月を取得
export function getFullYearMonth(id, date) {
	$(id).val("0年0月");
	var today = new Date();
	var year = today.getFullYear() - date.getFullYear();
	var month = today.getMonth() - date.getMonth();
	var day = today.getDate() - date.getDate();
	if (year >= 0) {
		if (year > 0 && month < 0) {
			if (day > 0) {
				$(id).val((year - 1) + "年" + (month + 12) + "月");
			}
			else {
				$(id).val((year - 1) + "年" + (month + 11) + "月");
			}
		}
		if (month >= 0) {

			if (day >= 0) {
				$(id).val(year + "年" + month + "月");
			}
			else {
				if (year === 0 && month === 0) {
					$(id).val("0年0月");
				}
				else {
					$(id).val(year + "年" + (month - 1) + "月");
				}
			}
		}
	}
}

//ドロップダウン
export function getdropDown(method) {
	var array = [{ code: '', name: '選択ください' }];
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8080/"+method,
		async: false,
		success: function (msg) {
			for (let i in msg) {
				array.push(msg[i])
			}
		}
	});
	return array;
}