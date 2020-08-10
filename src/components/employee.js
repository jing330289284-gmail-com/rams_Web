/* 社員を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import ImageUploader from "react-images-upload";
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import * as dateUtils from './utils/dateUtils.js';
import { BrowserRouter as Router, Route } from "react-router-dom";
import BankInfo from './bankInfo';
import SubCost from './subCost';
import SiteInformation from './siteInfo';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import Autosuggest from 'react-autosuggest';


const promise = Promise.resolve(dateUtils.getNO("employeeNo", "LYC", "T001Employee"));

class employee extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.insertEmployee = this.insertEmployee.bind(this);//登録
		this.onDrop = this.onDrop.bind(this);//ImageUploaderを処理
		this.radioChangeEmployeeType = this.radioChangeEmployeeType.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
	}
	//初期化
	initialState = {
		showBankInfoModal: false,//口座情報画面フラグ
		showSubCostModal: false,//諸費用
		showSiteInformationModal: false,//現場情報
		pictures: [],//ImageUploader
		genderStatuss: [],//性別
		intoCompanyCodes: [],//　　入社区分
		employeeFormCodes: [],//　　社員形式
		occupationCodes: [],//　　職種
		departmentCodes: [],//　　部署
		authorityCodes: [],//　　権限
		japaneaseLevelCodes: [],//　　日本語
		residenceCodes: [],//　　在留資格
		englishLeveCodes: [],//　　英語
		nationalityCodes: [],//　　出身地 
		developement1Value: '', developement1Suggestions: [], developement2Value: '', developement2Suggestions: [], developement3Value: '', developement3Suggestions: [],
		developement4Value: '', developement4Suggestions: [], developement5Value: '', developement5Suggestions: [],
		suggestions: [], developmentLanguageNo1: '', developmentLanguageNo2: '', developmentLanguageNo3: '', developmentLanguageNo4: '', developmentLanguageNo5: '',
		retirementYearAndMonthDisabled: false,//退職年月の活性フラグ
	};
	//　　リセット
	resetBook = () => {
		this.setState(() => this.resetState);
	};
	//リセット化
	resetState = {
		employeeFristName: '',//　　社員氏
		employeeLastName: '',//　　社員名
		furigana1: '',//　　カタカナ1
		furigana2: '',//　　カタカナ2
		alphabetName: '',//　　ローマ字
		age: '',//　　年齢
		time4: '',//　　年齢
		japaneseCalendar: "",　　//和暦
		companyMail: "",　　//社内メール
		graduationUniversity: "",　　//学校
		major: "",//　　専門
		graduationYearAndMonth: "",//　　卒業年月
		intoCompanyYearAndMonth: "",//　　入社年月
		retirementYearAndMonth: "",//　　退職年月
		comeToJapanYearAndMonth: "",//　　来日年月
		//intoCompanyYearAndMonth: "",//出身地TODO
		nationalityCode: "",//　　出身地(県)
		phoneNo: "",//携帯電話
		residenceCardNo: "",//　　在留カード
		employmentInsuranceNo: "",//　　雇用保険番号
		myNumber: "",//　　マイナンバー
		certification1: "",//　　資格1
		certification2: "",//　　資格2
		resumeRemark1: "",//　　履歴書備考1
		resumeRemark2: "",//　　履歴書備考2
		stayPeriod: "",//　　stayPeriod
		temporary_comeToJapanYearAndMonth: "",
		temporary_intoCompanyYearAndMonth: "",
		temporary_stayPeriod: "",
		temporary_age: "",
		developement1Value: '', developement1Suggestions: [], developement2Value: '', developement2Suggestions: [], developement3Value: '', developement3Suggestions: [],
		developement4Value: '', developement4Suggestions: [], developement5Value: '', developement5Suggestions: [],
		developmentLanguageNo1: '', developmentLanguageNo2: '', developmentLanguageNo3: '', developmentLanguageNo4: '', developmentLanguageNo5: '', value: '', suggestions: [],
		experienceYears: "",//　経験年数
		temporary_experienceYears: "",
	};
	//　　登録
	insertEmployee = () => {
		const emp = {
			//employeeNo: this.state.employeeNo,//ピクチャ
			employeeStatus: $('input:radio[name="employeeType"]:checked').val(),//社員ステータス
			employeeNo: this.state.employeeNo,//社員番号
			employeeFristName: this.state.employeeFristName,//社員氏
			employeeLastName: this.state.employeeLastName,//社員名
			furigana1: this.state.furigana1,//　　カタカナ
			furigana2: this.state.furigana2,//　　カタカナ
			alphabetName: this.state.alphabetName,//　　ローマ字
			age: this.state.age,//年齢
			japaneseCalendar: this.state.japaneseCalendar,//和暦
			genderStatus: this.state.genderStatus,//性別
			intoCompanyCode: this.state.intoCompanyCode,//入社区分
			employeeFormCode: this.state.employeeFormCode,//社員形式
			occupationCode: this.state.occupationCode,//職種
			departmentCode: this.state.departmentCode,//部署
			companyMail: this.state.companyMail,//社内メール
			graduationUniversity: this.state.graduationUniversity,//卒業学校
			major: this.state.major,//専門
			graduationYearAndMonth: this.state.graduationYearAndMonth,//卒業年月
			intoCompanyYearAndMonth: this.state.intoCompanyYearAndMonth,//入社年月
			retirementYearAndMonth: this.state.retirementYearAndMonth,//退職年月
			comeToJapanYearAndMonth: this.state.comeToJapanYearAndMonth,//来日年月
			nationalityCode: this.state.nationalityCode,//出身地
			birthplace: this.state.birthplace,//出身県
			phoneNo: this.state.phoneNo,//携帯電話
			authorityCode: $("#authorityCodeId").val(),//権限
			japaneseLevelCode: this.state.japaneseLevelCode,//日本語
			englishLevelCode: this.state.englishLevelCode,//英語
			certification1: this.state.certification1,//資格1
			certification2: this.state.certification2,//資格2
			developLanguage1: this.state.developLanguage1,//スキール1
			developLanguage2: this.state.developLanguage2,//スキール2
			developLanguage3: this.state.developLanguage3,//スキール3
			developLanguage4: this.state.developLanguage4,//スキール4
			developLanguage5: this.state.developLanguage5,//スキール5
			residenceCode: this.state.residenceCode,//在留資格
			residenceCardNo: this.state.residenceCardNo,//在留カード
			stayPeriod: this.state.stayPeriod,//在留期間
			employmentInsuranceNo: this.state.employmentInsuranceNo,//雇用保険番号
			myNumber: this.state.myNumber,//マイナンバー
			residentCardInfo: $("#residentCardInfo").val(),//在留カード
			resumeInfo1: $("#residentCardInfo").val(),//履歴書
			resumeRemark1: this.state.resumeRemark1,//履歴書備考1
			resumeInfo2: $("#residentCardInfo").val(),//履歴書2
			resumeRemark2: this.state.resumeRemark2,//履歴書備考1
			passportInfo: this.state.passportInfo,//パスポート
			updateUser: sessionStorage.getItem('employeeName'),//更新者
		};
		axios.post("http://127.0.0.1:8080/employee/insertEmployee", emp)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					alert(response.data)
					window.location.reload();
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};
　　　　//更新ボタン
	updateEmployee = () => {
		alert(1)
		const emp = {
			//employeeNo: this.state.employeeNo,//ピクチャ
			employeeStatus: $('input:radio[name="employeeType"]:checked').val(),//社員ステータス
			employeeNo: this.state.employeeNo,//社員番号
			employeeFristName: this.state.employeeFristName,//社員氏
			employeeLastName: this.state.employeeLastName,//社員名
			furigana1: this.state.furigana1,//　　カタカナ
			furigana2: this.state.furigana2,//　　カタカナ
			alphabetName: this.state.alphabetName,//　　ローマ字
			age: this.state.age,//年齢
			japaneseCalendar: this.state.japaneseCalendar,//和暦
			genderStatus: this.state.genderStatus,//性別
			intoCompanyCode: this.state.intoCompanyCode,//入社区分
			employeeFormCode: this.state.employeeFormCode,//社員形式
			occupationCode: this.state.occupationCode,//職種
			departmentCode: this.state.departmentCode,//部署
			companyMail: this.state.companyMail,//社内メール
			graduationUniversity: this.state.graduationUniversity,//卒業学校
			major: this.state.major,//専門
			graduationYearAndMonth: this.state.graduationYearAndMonth,//卒業年月
			intoCompanyYearAndMonth: this.state.intoCompanyYearAndMonth,//入社年月
			retirementYearAndMonth: this.state.retirementYearAndMonth,//退職年月
			comeToJapanYearAndMonth: this.state.comeToJapanYearAndMonth,//来日年月
			nationalityCode: this.state.nationalityCode,//出身地
			birthplace: this.state.birthplace,//出身県
			phoneNo: this.state.phoneNo,//携帯電話
			authorityCode: $("#authorityCodeId").val(),//権限
			japaneseLevelCode: this.state.japaneseLevelCode,//日本語
			englishLevelCode: this.state.englishLevelCode,//英語
			certification1: this.state.certification1,//資格1
			certification2: this.state.certification2,//資格2
			developLanguage1: this.state.developLanguage1,//スキール1
			developLanguage2: this.state.developLanguage2,//スキール2
			developLanguage3: this.state.developLanguage3,//スキール3
			developLanguage4: this.state.developLanguage4,//スキール4
			developLanguage5: this.state.developLanguage5,//スキール5
			residenceCode: this.state.residenceCode,//在留資格
			residenceCardNo: this.state.residenceCardNo,//在留カード
			stayPeriod: this.state.stayPeriod,//在留期間
			employmentInsuranceNo: this.state.employmentInsuranceNo,//雇用保険番号
			myNumber: this.state.myNumber,//マイナンバー
			residentCardInfo: $("#residentCardInfo").val(),//在留カード
			resumeInfo1: $("#residentCardInfo").val(),//履歴書
			resumeRemark1: this.state.resumeRemark1,//履歴書備考1
			resumeInfo2: $("#residentCardInfo").val(),//履歴書2
			resumeRemark2: this.state.resumeRemark2,//履歴書備考1
			passportInfo: this.state.passportInfo,//パスポート
			updateUser: sessionStorage.getItem('employeeName'),//更新者
		};
		axios.post("http://127.0.0.1:8080/employee/updateEmployee", emp)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					alert(response.data)
					window.location.reload();
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
		var val = $('#nationalityCodeId').val();
		if (val === '3') {
			this.setState({
				japaneseLevelCode: 5,
			})
		} else if (val === '4') {
			this.setState({
				englishLevelCode: 8,
			})
		}
	}
	//初期化メソッド
	async componentDidMount() {
		this.getDropDownｓ();//全部のドロップダウン
		const { location } = this.props
		var actionType = '';
		var id = '';
		if (location.state) {
			actionType = location.state.actionType;
			sessionStorage.setItem('actionType', actionType);
			id = location.state.id;
			sessionStorage.setItem('id', id);
		} else {
			actionType = sessionStorage.getItem('actionType');
			id = sessionStorage.getItem('id');
		}
		if (actionType === 'update') {
			this.getEmployeeByEmployeeNo(id);
		} else if (actionType === 'detail') {
			this.getEmployeeByEmployeeNo(id);
		} else {
			this.getNO();//採番番号
		}
	}

	getDropDownｓ = () => {
		var methodArray = ["getGender", "getIntoCompany", "getStaffForms", "getOccupation", "getDepartment", "getAuthority", "getJapaneseLevel", "getVisa", "getEnglishLevel", "getNationalitys"]
		var data = dateUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				genderStatuss: data[0],//　性別区別
				intoCompanyCodes: data[1],//　入社区分 
				employeeFormCodes: data[2],//　 社員形式 
				occupationCodes: data[3],//　職種
				departmentCodes: data[4],//　 部署 
				authorityCodes: data[5].slice(1),//　 権限 
				japaneaseLevelCodes: data[6],//　日本語  
				residenceCodes: data[7],//　在留資格
				englishLeveCodes: data[8],//　英語
				nationalityCodes: data[9]//　 出身地国
			}
		);
	};

	getAuthority = () => {
		var methodArray = ["getAuthority"]
		var data = dateUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				authorityCodes: data[0].slice(1),//　 権限 
			}
		);
	};

	getEmployeeByEmployeeNo = employeeNo => {
		const emp = {
			employeeNo: employeeNo
		};
		axios.post("http://127.0.0.1:8080/employee/getEmployeeByEmployeeNo", emp)
			.then(response => response.data)
			.then((data) => {
				this.setState({
					//employeeNo: date.employeeNo,//ピクチャ
					employeeStatus: $('input:radio[name="employeeType"]:checked').val(),//社員ステータス
					employeeNo: data.employeeNo,//社員番号
					employeeFristName: data.employeeFristName,//社員氏
					employeeLastName: data.employeeLastName,//社員名
					furigana1: data.furigana1,//　　カタカナ
					furigana2: data.furigana2,//　　カタカナ
					alphabetName: data.alphabetName,//　　ローマ字
					age: data.age,//年齢
					japaneseCalendar: data.japaneseCalendar,//和暦
					genderStatus: data.genderStatus,//性別
					intoCompanyCode: data.intoCompanyCode,//入社区分
					employeeFormCode: data.employeeFormCode,//社員形式
					occupationCode: data.occupationCode,//職種
					departmentCode: data.departmentCode,//部署
					companyMail: data.companyMail,//社内メール
					graduationUniversity: data.graduationUniversity,//卒業学校
					major: data.major,//専門
					graduationYearAndMonth: data.graduationYearAndMonth,//卒業年月
					intoCompanyYearAndMonth: data.intoCompanyYearAndMonth,//入社年月
					retirementYearAndMonth: data.retirementYearAndMonth,//退職年月
					comeToJapanYearAndMonth: data.comeToJapanYearAndMonth,//来日年月
					nationalityCode: data.nationalityCode,//出身地
					birthplace: data.birthplace,//出身県
					phoneNo: data.phoneNo,//携帯電話
					authorityCode: $("#authorityCodeId").val(),//権限
					japaneseLevelCode: data.japaneseLevelCode,//日本語
					englishLevelCode: data.englishLevelCode,//英語
					certification1: data.certification1,//資格1
					certification2: data.certification2,//資格2
					developLanguage1: data.developLanguage1,//　スキール1
					developLanguage2: data.developLanguage2,//スキール2
					developLanguage3: data.developLanguage3,//スキール3
					developLanguage4: data.developLanguage4,//スキール4
					developLanguage5: data.developLanguage5,//スキール5
					residenceCode: data.residenceCode,//在留資格
					residenceCardNo: data.residenceCardNo,//在留カード
					stayPeriod: data.stayPeriod,//在留期間
					employmentInsuranceNo: data.employmentInsuranceNo,//雇用保険番号
					myNumber: data.myNumber,//マイナンバー
					residentCardInfo: data.residentCardInfo,//在留カード
					//resumeInfo1: "rrr",//履歴書
					resumeRemark1: data.resumeRemark1,//履歴書備考1
					resumeInfo2: data.resumeInfo2,//履歴書2
					resumeRemark2: data.resumeRemark2,//履歴書備考1
					passportInfo: data.passportInfo,//パスポート
					updateUser: sessionStorage.getItem('employeeName'),//更新者
				});
			});
	};

	//　採番番号
	getNO = () => {
		promise.then((value) => {
			this.setState(
				{
					employeeNo: value
				}
			);
		});
	};

	//ImageUploaderを処理　開始
	onDrop(picture) {
		this.setState({
			pictures: this.state.pictures.concat(picture),
		});
	}
	//ImageUploaderを処理　終了
	//　　年月開始
	//　　卒業年月
	inactiveGraduationYearAndMonth = date => {
		this.setState(
			{
				graduationYearAndMonth: dateUtils.setFullYearMonth(date),
				temporary_experienceYears: (this.state.temporary_experienceYears === undefined) ? dateUtils.getFullYearMonth(date, new Date()) : this.state.temporary_experienceYears
			}
		);
	};
	//　　経験年数
	inactiveYearsExperience = date => {
		this.setState(
			{
				experienceYears: dateUtils.setFullYearMonth(date),
				temporary_experienceYears: dateUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	//　　退職年月
	inactiveRetirementYearAndMonth = (date) => {
		this.setState(
			{
				retirementYearAndMonth: dateUtils.setFullYearMonth(date)
			}
		);
	};
	//　　入社年月
	inactiveJoinCompanyOfYear = date => {
		this.setState(
			{
				intoCompanyYearAndMonth: dateUtils.setFullYearMonth(date),
				temporary_intoCompanyYearAndMonth: dateUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	//　　来日年月
	inactiveComingToJapanOfYearAndMonthr = date => {
		this.setState(
			{
				comeToJapanYearAndMonth: dateUtils.setFullYearMonth(date),
				temporary_comeToJapanYearAndMonth: dateUtils.getFullYearMonth(date, new Date())

			}
		);
	};
	//　　在留期間
	inactiveStayPeriod = date => {
		this.setState(
			{
				stayPeriod: dateUtils.setFullYearMonth(date),
				temporary_stayPeriod: dateUtils.getFullYearMonth(new Date(), date)
			}
		);

	};
	//　　年齢と和暦
	inactiveAge = date => {
		var birthDayTime = date.getTime();
		var nowTime = new Date().getTime();
		this.setState({
			age: Math.ceil((nowTime - birthDayTime) / 31536000000),
			time4: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
		});
		//http://ap.hutime.org/cal/ 西暦と和暦の変換
		const ival = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
		axios.get("http://ap.hutime.org/cal/?method=conv&ical=101.1&itype=date&ival=" + ival + "&ocal=1001.1")
			.then(response => {
				if (response.data != null) {
					this.setState({
						japaneseCalendar: response.data
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	//　　年月終了

	//社員タイプが違う時に、色々な操作をします。
	radioChangeEmployeeType = () => {
		var val = $('input:radio[name="employeeType"]:checked').val();
		if (val === '1') {
			this.setState({ employeeNo: '', companyMail: '', authorityCodes: [] });
			$('input[type="email"]').prop('disabled', true);
			$('#authorityCodeId').prop('disabled', true);
		} else {
			this.getNO();
			this.getAuthority();
			$('input[type="email"]').prop('disabled', false);
			$('#authorityCodeId').prop('disabled', false);
		}
	}

	/**
	* 小さい画面の閉め 
	*/
	handleHideModal = (Kbn) => {
		if (Kbn === "bankInfo") {//　　口座情報
			this.setState({ showBankInfoModal: false })
		} else if (Kbn === "subCost") {//　　諸費用
			this.setState({ showSubCostModal: false })
		} else if (Kbn === "siteInformation") {//　　現場情報
			this.setState({ showSiteInformationModal: false })
		} else if (Kbn === "権限・PW設置") {//権限・PW設置TODO
			this.setState({ showSubCostModal: false })
		} else if (Kbn === "住所情報") {//　　住所情報
			this.setState({ showSubCostModal: false })
		}
	}

	/**
 　　　* 小さい画面の開き
    */
	handleShowModal = (Kbn) => {
		if (Kbn === "bankInfo") {//　　口座情報
			this.setState({ showBankInfoModal: true })
		} else if (Kbn === "subCost") {//　　諸費用
			this.setState({ showSubCostModal: true })
		} else if (Kbn === "siteInformation") {//　　現場情報
			this.setState({ showSiteInformationModal: true })
		} else if (Kbn === "権限・PW設置") {//権限・PW設置TODO
			this.setState({ showSubCostModal: true })
		} else if (Kbn === "住所情報") {//　　住所情報
			this.setState({ showSubCostModal: true })
		}
	}
	//　　開発言語　開始
	onDevelopement1Change = (event, { newValue }) => {
		this.setState({
			developement1Value: newValue
		});
	};

	onDevelopement2Change = (event, { newValue }) => {
		this.setState({
			developement2Value: newValue
		});
	};

	onDevelopement3Change = (event, { newValue }) => {
		this.setState({
			developement3Value: newValue
		});
	};

	onDevelopement4Change = (event, { newValue }) => {
		this.setState({
			developement4Value: newValue
		});
	};

	onDevelopement5Change = (event, { newValue }) => {
		this.setState({
			developement5Value: newValue
		});
	};


	onDlt1SuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo1: value
		};
		axios.post("http://127.0.0.1:8080/getTechnologyType", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						developement1Suggestions: dateUtils.getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	onDlt1SuggestionsClearRequested = () => {
		this.setState({
			developement1Suggestions: []
		});
	};

	onDlt1SuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developement1Value: suggestion.name
		});
	};

	onDlt2SuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo2: value
		};
		axios.post("http://127.0.0.1:8080/getTechnologyType", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						developement2Suggestions: dateUtils.getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	onDlt3SuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo3: value
		};
		axios.post("http://127.0.0.1:8080/getTechnologyType", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						developement3Suggestions: dateUtils.getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};
	onDlt4SuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo4: value
		};
		axios.post("http://127.0.0.1:8080/getTechnologyType", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						developement4Suggestions: dateUtils.getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};
	onDlt5SuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo5: value
		};
		axios.post("http://127.0.0.1:8080/getTechnologyType", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						developement5Suggestions: dateUtils.getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	onDlt2SuggestionsClearRequested = () => {
		this.setState({
			developement2Suggestions: []
		});
	};

	onDlt3SuggestionsClearRequested = () => {
		this.setState({
			developement3Suggestions: []
		});
	};

	onDlt4SuggestionsClearRequested = () => {
		this.setState({
			developement4Suggestions: []
		});
	};

	onDlt5SuggestionsClearRequested = () => {
		this.setState({
			developement5Suggestions: []
		});
	};

	onDlt2SuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developement2Value: suggestion.name
		});
	};

	onDlt3SuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developement3Value: suggestion.name
		});
	};

	onDlt4SuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developement4Value: suggestion.name
		});
	};

	onDlt5SuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developement5Value: suggestion.name
		});
	};
	//　　開発言語　終了


	valueChangeEmployeeFormCode = (event) => {
		const value = event.target.value;
		if (value === "3") {
			this.setState({ retirementYearAndMonthDisabled: true })
		} else {
			this.setState({ retirementYearAndMonthDisabled: false, retirementYearAndMonth: "" })
		}
	}
	render() {
		const { employeeNo, employeeFristName, employeeLastName, furigana1, furigana2, alphabetName, age, japaneseCalendar, genderStatus, major, intoCompanyCode,
			employeeFormCode, occupationCode, departmentCode, companyMail, graduationUniversity, graduationYearAndMonth, intoCompanyYearAndMonth, retirementYearAndMonth,
			nationalityCode, birthplace, phoneNo, comeToJapanYearAndMonth, authorityCode, japaneseLevelCode, englishLevelCode, residenceCode,
			residenceCardNo, stayPeriod, employmentInsuranceNo, myNumber, certification1, certification2, resumeRemark1, resumeRemark2,
			time4, temporary_stayPeriod, temporary_experienceYears, experienceYears, temporary_intoCompanyYearAndMonth, temporary_comeToJapanYearAndMonth,
			developement1Value, developement1Suggestions, developement2Value, developement2Suggestions,
			developement3Value, developement3Suggestions, developement4Value, developement4Suggestions, developement5Value, developement5Suggestions, retirementYearAndMonthDisabled
		} = this.state;
		const dlt1InputProps = {
			placeholder: "開発言語1",
			value: developement1Value,
			onChange: this.onDevelopement1Change
		};
		const dlt2InputProps = {
			placeholder: "開発言語2",
			value: developement2Value,
			onChange: this.onDevelopement2Change
		};
		const dlt3InputProps = {
			placeholder: "開発言語3",
			value: developement3Value,
			onChange: this.onDevelopement3Change
		};
		const dlt4InputProps = {
			placeholder: "開発言語4",
			value: developement4Value,
			onChange: this.onDevelopement4Change
		};
		const dlt5InputProps = {
			placeholder: "開発言語5",
			value: developement5Value,
			onChange: this.onDevelopement5Change
		};
		return (
			<div>
				<input type="hidden" id="shoriKbn" name="shoriKbn" />
				<input type="hidden" id="update" name="update" />
				{/*　 開始 */}
				{/*　 住所情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bankInfo")} show={this.state.showBankInfoModal} dialogClassName="modal-jusho">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body className="show-grid">
						<div key={this.props.location.key} >
							<Router>
							</Router>
						</div>
					</Modal.Body>
				</Modal>
				{/*　 口座情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bankInfo")} show={this.state.showBankInfoModal} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body className="show-grid">
						<div key={this.props.location.key} >
							<Router>
								<Route exact path={`${this.props.match.url}/`} component={BankInfo} />
							</Router>
						</div>
					</Modal.Body>
				</Modal>
				{/*　 諸費用 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "subCost")} show={this.state.showSubCostModal} dialogClassName="modal-subCost">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body className="show-grid">
						<div key={this.props.location.key} >
							<Router>
								<Route exact path={`${this.props.match.url}/`} component={SubCost} />
							</Router>
						</div>
					</Modal.Body>
				</Modal>
				{/*　 現場情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "siteInformation")} show={this.state.showSiteInformationModal} dialogClassName="modal-siteInfo">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body className="show-grid">
						<div key={this.props.location.key} >
							<Router>
								<Route exact path={`${this.props.match.url}/`} component={SiteInformation} />
							</Router>
						</div>
					</Modal.Body>
				</Modal>
				{/*　 権限・PW設置*/}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "customerInfo")} dialogClassName="modal-kengen">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body className="show-grid">
						<div key={this.props.location.key} >
							<Router>
							</Router>
						</div>
					</Modal.Body>
				</Modal>
				{/*　 終了 */}
				{/* 権限・PW設置*/}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "customerInfo")} show={this.state.showCustomerInfoModal} dialogClassName="modal-kengen">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body className="show-grid">
						<div key={this.props.location.key} >
							<Router>
							</Router>
						</div>
					</Modal.Body>
				</Modal>
				{/* 終了 */}
				<div style={{ "textAlign": "center" }}>
					<Button size="sm" >住所情報</Button>{' '}
					<Button size="sm" onClick={this.handleShowModal.bind(this, "bankInfo")}>口座情報</Button>{' '}
					<Button size="sm" onClick={this.handleShowModal.bind(this, "subCost")}>諸費用</Button>{' '}
					<Button size="sm" onClick={this.handleShowModal.bind(this, "siteInformation")}>現場情報</Button>{' '}
					<Button size="sm" >権限・PW設置</Button>
					<div>
						<Form.Label>社員</Form.Label><Form.Check defaultChecked={true} onChange={this.radioChangeEmployeeType.bind(this)} inline type="radio" name="employeeType" value="0" />
						<Form.Label>協力</Form.Label><Form.Check onChange={this.radioChangeEmployeeType.bind(this)} inline type="radio" name="employeeType" value="1" />
					</div>
				</div>
				<Form onSubmit={sessionStorage.getItem('id') ? this.updateEmployee : this.insertEmployee} onReset={this.resetBook}>
					<Form.Label style={{ "color": "#FFD700" }}>基本情報</Form.Label>
					<Form.Group>
						<ImageUploader
							withIcon={false}
							withPreview={true}
							label=""
							buttonText="Upload Images"
							onChange={this.onDrop}
							imgExtension={[".jpg", ".gif", ".png", ".gif", ".svg"]}
							maxFileSize={1048576}
							fileSizeError=" file size is too big"
						/>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={employeeNo} autoComplete="off" disabled
										onChange={this.valueChange} size="sm" name="employeeNo" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="社員氏" value={employeeFristName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeFristName" maxlength="3" />{' '}
									<FormControl placeholder="社員名" value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">カタカナ</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="カタカナ" value={furigana1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana1" />{' '}
									<FormControl placeholder="カタカナ" value={furigana2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana2" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="ローマ字" value={alphabetName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="alphabetName" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="time4" value={time4} name="time4" placeholder="年齢" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveAge}
											autoComplete="on"
											locale="ja"
											showYearDropdown
											yearDropdownItemNumber={25}
											scrollableYearDropdown
											className={"dateInput"}
											maxDate={new Date()}
										/>
									</InputGroup.Append>
									<FormControl placeholder="0" id="age" value={age} autoComplete="off" onChange={this.valueChange} size="sm" name="age" readOnly />
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">歳</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="和暦" value={japaneseCalendar} autoComplete="off" onChange={this.valueChange} size="sm" name="japaneseCalendar" readOnly />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="genderStatus" value={genderStatus}
										autoComplete="off">
										{this.state.genderStatuss.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="intoCompanyCode" value={intoCompanyCode}
										autoComplete="off">
										{this.state.intoCompanyCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChangeEmployeeFormCode}
										name="employeeFormCode" value={employeeFormCode}
										autoComplete="off" >
										{this.state.employeeFormCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">職種</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="occupationCode" value={occupationCode}
										autoComplete="off">
										{this.state.occupationCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">部署</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="departmentCode" value={departmentCode}
										autoComplete="off">
										{this.state.departmentCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社内メール</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="email" placeholder="社内メール" value={companyMail} autoComplete="off"
										onChange={this.valueChange} size="sm" name="companyMail" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業学校</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="学校" value={graduationUniversity} autoComplete="off"
										onChange={this.valueChange} size="sm" name="graduationUniversity" />
									<FormControl placeholder="専門" value={major} autoComplete="off"
										onChange={this.valueChange} size="sm" name="major" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="graduationYearAndMonth" name="graduationYearAndMonth" value={graduationYearAndMonth} placeholder="卒業年月" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveGraduationYearAndMonth}
											autoComplete="on"
											className={"dateInput"}
											dateFormat={"yyyy MM"}
											showMonthYearPicker
											showFullMonthYearPicker
											showDisabledMonthNavigation
											locale="ja"
										/>
									</InputGroup.Append>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="intoCompanyYearAndMonth" name="intoCompanyYearAndMonth" value={intoCompanyYearAndMonth} placeholder="入社年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveJoinCompanyOfYear}
											autoComplete="on"
											className={"dateInput"}
											dateFormat={"yyyy MM"}
											showMonthYearPicker
											showFullMonthYearPicker
											showDisabledMonthNavigation
											locale="ja"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_intoCompanyYearAndMonth" value={temporary_intoCompanyYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3" >
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">退職年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="retirementYearAndMonth" name="retirementYearAndMonth" value={retirementYearAndMonth} placeholder="退職年月" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveRetirementYearAndMonth}
											autoComplete="on"
											className={"dateInput"}
											dateFormat={"yyyy MM"}
											showMonthYearPicker
											showFullMonthYearPicker
											showDisabledMonthNavigation
											locale="ja"
											id="retirementDateId"
											disabled={retirementYearAndMonthDisabled ? false : true}
										/>
									</InputGroup.Append>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">来日年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="comeToJapanYearAndMonth" value={comeToJapanYearAndMonth} name="comeToJapanYearAndMonth" placeholder="来日年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveComingToJapanOfYearAndMonthr}
											autoComplete="on"
											className={"dateInput"}
											dateFormat={"yyyy MM"}
											showMonthYearPicker
											showFullMonthYearPicker
											showDisabledMonthNavigation
											locale="ja"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_comeToJapanYearAndMonth" value={temporary_comeToJapanYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出身地</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="nationalityCode" value={nationalityCode}
										autoComplete="off" id="nationalityCodeId">
										{this.state.nationalityCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<FormControl placeholder="出身地" value={birthplace} autoComplete="off"
										onChange={this.valueChange} size="sm" name="birthplace" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">携帯電話</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="携帯電話" value={phoneNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="phoneNo" />
								</InputGroup>
							</Col>

							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">権限</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="authorityCode" value={authorityCode}
										autoComplete="off" id="authorityCodeId">
										{this.state.authorityCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<Form.Label style={{ "color": "#FFD700" }}>スキール情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"
										onChange={this.valueChange} size="sm"
										name="japaneseLevelCode" value={japaneseLevelCode}
										autoComplete="off" id="japaneaseLevelCodeId">
										{this.state.japaneaseLevelCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">英語</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"
										onChange={this.valueChange} size="sm"
										name="englishLevelCode" value={englishLevelCode}
										autoComplete="off" id="englishLeveCodeId">
										{this.state.englishLeveCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">資格</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="資格1" value={certification1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="certification1" />
									<FormControl placeholder="資格2" value={certification2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="certification2" />
								</InputGroup>
							</Col>

						</Row>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
										<Autosuggest
											suggestions={developement1Suggestions}
											onSuggestionsFetchRequested={this.onDlt1SuggestionsFetchRequested}
											onSuggestionsClearRequested={this.onDlt1SuggestionsClearRequested}
											onSuggestionSelected={this.onDlt1SuggestionSelected}
											getSuggestionValue={dateUtils.getSuggestionDlt}
											renderSuggestion={dateUtils.renderSuggestion}
											inputProps={dlt1InputProps}
										/>
										<Autosuggest
											suggestions={developement2Suggestions}
											onSuggestionsFetchRequested={this.onDlt2SuggestionsFetchRequested}
											onSuggestionsClearRequested={this.onDlt2SuggestionsClearRequested}
											onSuggestionSelected={this.onDlt2SuggestionSelected}
											getSuggestionValue={dateUtils.getSuggestionDlt}
											renderSuggestion={dateUtils.renderSuggestion}
											inputProps={dlt2InputProps}
										/>
										<Autosuggest
											suggestions={developement3Suggestions}
											onSuggestionsFetchRequested={this.onDlt3SuggestionsFetchRequested}
											onSuggestionsClearRequested={this.onDlt3SuggestionsClearRequested}
											onSuggestionSelected={this.onDlt3SuggestionSelected}
											getSuggestionValue={dateUtils.getSuggestionDlt}
											renderSuggestion={dateUtils.renderSuggestion}
											inputProps={dlt3InputProps}
										/>

										<Autosuggest
											suggestions={developement4Suggestions}
											onSuggestionsFetchRequested={this.onDlt4SuggestionsFetchRequested}
											onSuggestionsClearRequested={this.onDlt4SuggestionsClearRequested}
											onSuggestionSelected={this.onDlt4SuggestionSelected}
											getSuggestionValue={dateUtils.getSuggestionDlt}
											renderSuggestion={dateUtils.renderSuggestion}
											inputProps={dlt4InputProps}
										/>
										<Autosuggest
											suggestions={developement5Suggestions}
											onSuggestionsFetchRequested={this.onDlt5SuggestionsFetchRequested}
											onSuggestionsClearRequested={this.onDlt5SuggestionsClearRequested}
											onSuggestionSelected={this.onDlt5SuggestionSelected}
											getSuggestionValue={dateUtils.getSuggestionDlt}
											renderSuggestion={dateUtils.renderSuggestion}
											inputProps={dlt5InputProps}
										/>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">経験年数</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="experienceYears" value={experienceYears} name="experienceYears" placeholder="経験年数" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveYearsExperience}
											autoComplete="on"
											className={"dateInput"}
											dateFormat={"yyyy MM"}
											showMonthYearPicker
											showFullMonthYearPicker
											showDisabledMonthNavigation
											locale="ja"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_experienceYears" value={temporary_experienceYears} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>

						</Row>
					</Form.Group>

					<Form.Label style={{ "color": "#FFD700" }}>個人関連情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留資格 </InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="residenceCode" value={residenceCode}
										autoComplete="off">
										{this.state.residenceCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="在留カード" value={residenceCardNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="residenceCardNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留期間</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="stayPeriod" value={stayPeriod} name="stayPeriod" placeholder="在留期間" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveStayPeriod}
											autoComplete="on"
											className={"dateInput"}
											dateFormat={"yyyy MM"}
											showMonthYearPicker
											showFullMonthYearPicker
											showDisabledMonthNavigation
											locale="ja"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_stayPeriod" value={temporary_stayPeriod} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">雇用保険番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="雇用保険番号" value={employmentInsuranceNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employmentInsuranceNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">マイナンバー</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="マイナンバー" value={myNumber} autoComplete="off"
										onChange={this.valueChange} size="sm" name="myNumber" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text><Form.File id="residentCardInfo" name="residentCardInfo" />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm" >履歴書</InputGroup.Text><input type="file" id="resumeInfo1 " name="resumeInfo1" ></input>
									</InputGroup.Prepend>

									<FormControl placeholder="備考1" value={resumeRemark1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeRemark1" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書2</InputGroup.Text><Form.File id="resumeInfo2" name="resumeInfo2" />
									</InputGroup.Prepend>
									<FormControl placeholder="備考2" value={resumeRemark2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeRemark2" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">パスポート</InputGroup.Text><Form.File id="passportInfo" name="passportInfo" />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" type="submit">
							<FontAwesomeIcon icon={faSave} /> 登録
                        </Button>{' '}
						<Button size="sm" variant="info" type="reset">
							<FontAwesomeIcon icon={faUndo} /> リセット
                        </Button>
					</div>
				</Form>
			</div>
		);
	}
}
export default employee;
