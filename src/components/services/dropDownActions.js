import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE } from './dropDownTypes';
//import axios from 'axios';
const $ = require('jquery');

export const fetchDropDown = () => {
	return dispatch => {
		dispatch(fetchDropDownRequest());
		/** 
		追加の時、コンテンツをお願い致します。
		0.性別区別   1入社区分  2 社員形式  3役割  4employeesステータス  
		5日本語  6在留資格  7国籍  8開発言語  9社員名
		10 職種  11部署  12 権限  13英語 14駅 15BP所属
		 */
		var methodNameList = ["getGender", "getIntoCompany", "getStaffForms", "getOccupation","getEmployee",
		 "getJapaneseLevel", "getVisa", "getNationalitys","getDevelopLanguage", "getEmployeeName", 
	    "getOccupation", "getDepartment", "getAuthority",  "getEnglishLevel","getStation", "getCustomer"]
		var outArray = [];
		var par = JSON.stringify(methodNameList);
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1:8080/initializationPage",
			data: par,
			async: false,
			contentType: "application/json",
			success: function(resultList) {
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
		dispatch(fetchDropDownSuccess(outArray));
		/*
		削除いけない
		*/
		/*axios.post("http://127.0.0.1:8080/initializationPage")
			.then(response => {
				dispatch(fetchDropDownSuccess(response.data));
			})
			.catch(error => {
				dispatch(fetchDropDownFailure(error.message));
			});*/
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