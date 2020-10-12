import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE } from './dropDownTypes';
//import axios from 'axios';
const $ = require('jquery');

export const fetchDropDown = () => {
	return dispatch => {
		dispatch(fetchDropDownRequest());
		var methodNameList = ["getGender",//0.性別区別 
			"getIntoCompany",// 1入社区分 
			"getStaffForms", // 2 社員形式 
			"getOccupation",// 3役割
			"getEmployeeStatus",// 4社員区分
			"getJapaneseLevel",//5日本語
			"getVisa",//6在留資格
			"getNationalitys",// 7国籍 
			"getDevelopLanguage", // 8開発言語
			"getEmployeeName",// 9社員名
			"getOccupation",//10 職種
			"getDepartment",//11部署
			"getAuthority", // 12 権限 
			"getEnglishLevel",// 13英語
			"getStation",//14駅 
			"getCustomer",//15BP所属
			"getSalesProgress",//16営業状況
			"getListedCompany",// 17上場会社
			"getLevel",//18レベル
			"getCompanyNature",//　19性質
			"getPosition",//20職位
			"getPaymentsite",//21支払サイト
			"getDepartmentMasterDrop",//22部門名前
			"getNewMember",//23新人区分
			"getCustomerContractStatus",//24契約区分
			"getSalesPuttern", //25営業結果パタンー
			"getSpecialPoint",//26特別ポイント条件
			"getApproval",//27ステータスを取得する
			"getCheckSection",//28確認区分を取得する
			"getEnterPeriod",
		]
		var outArray = [];
		var serverIP = "http://127.0.0.1:8080/";
		//var serverIP = "http://13.58.173.66:8080/";
		var par = JSON.stringify(methodNameList);
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1:8080/initializationPage",
			data: par,
			async: false,
			contentType: "application/json",
			success: function (resultList) {
				for (let j = 0; j < resultList.length; j++) {
					var array = [{ code: '', name: '選択ください' }];
					var list = resultList[j];
					for (var i in list) {
						array.push(list[i])
					}
					outArray.push(array);
				}
			}
		});
		outArray.push(serverIP);
		dispatch(fetchDropDownSuccess(outArray));
	};
};

const fetchDropDownRequest = () => {
	return {
		type: FETCH_DATA_REQUEST
	};
};

const fetchDropDownSuccess = dataReques => {
	return {
		type: FETCH_DATA_SUCCESS,
		payload: dataReques
	};
};

const fetchDropDownFailure = error => {
	return {
		type: FETCH_DATA_FAILURE,
		payload: error
	};
};