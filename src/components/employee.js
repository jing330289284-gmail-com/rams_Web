/* 社員を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import * as publicUtils from './utils/publicUtils.js';
import BankInfo from './accountInfo';
import BpInfoModel from './bpInfo';
import PasswordSet from './passwordSetManager';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import MyToast from './myToast';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';

axios.defaults.withCredentials = true;
class employee extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.insertEmployee = this.insertEmployee.bind(this);//登録
		this.radioChangeEmployeeType = this.radioChangeEmployeeType.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
	}
	//初期化
	initialState = {
		showBankInfoModal: false,//口座情報画面フラグ
		showpasswordSetModal: false,//PW設定
		showBpInfoModal: false,//bp情報
		retirementYearAndMonthDisabled: false,//退職年月の活性フラグ
		accountInfo: null,//口座情報のデータ
		subCostInfo: null,//諸費用のデータ
		bpInfoModel: null,//pb情報
		myToastShow: false,
		errorsMessageShow: false,
		developLanguage1: '',
		developLanguage2: '',
		developLanguage3: '',
		developLanguage4: '',
		developLanguage5: '',
		stationCode: '',
		residentCardInfoFlag: false,
	};
	//　　リセット
	resetBook = () => {
		window.location.href = window.location.href
	};
	//　　登録
	insertEmployee = (event) => {
		event.preventDefault();
		const formData = new FormData()
		const emp = {
			employeeNo: this.state.employeeNo,//社員番号
			bpEmployeeNo: this.state.employeeNo,//社員番号
			employeeFristName: this.state.employeeFristName,//社員氏
			employeeLastName: this.state.employeeLastName,//社員名
			furigana1: publicUtils.nullToEmpty(this.state.furigana1),//　　カタカナ
			furigana2: publicUtils.nullToEmpty(this.state.furigana2),//　　カタカナ
			alphabetName: publicUtils.nullToEmpty(this.state.alphabetName),//　　ローマ字
			birthday: publicUtils.formateDate(this.state.birthday, true),//年齢
			japaneseCalendar: publicUtils.nullToEmpty(this.state.japaneseCalendar),//和暦
			genderStatus: publicUtils.nullToEmpty(this.state.genderStatus),//性別
			intoCompanyCode: publicUtils.nullToEmpty(this.state.intoCompanyCode),//入社区分
			employeeFormCode: publicUtils.nullToEmpty(this.state.employeeFormCode),//社員形式
			occupationCode: publicUtils.nullToEmpty(this.state.occupationCode),//職種
			departmentCode: publicUtils.nullToEmpty(this.state.departmentCode),//部署
			companyMail: publicUtils.nullToEmpty(this.state.companyMail) === "" ? "" : this.state.companyMail + "@lyc.co.jp",//社内メール
			graduationUniversity: publicUtils.nullToEmpty(this.state.graduationUniversity),//卒業学校
			major: publicUtils.nullToEmpty(this.state.major),//専門
			graduationYearAndMonth: publicUtils.formateDate(this.state.graduationYearAndMonth, false),//卒業年月
			intoCompanyYearAndMonth: publicUtils.formateDate(this.state.intoCompanyYearAndMonth, false),//入社年月
			retirementYearAndMonth: publicUtils.formateDate(this.state.retirementYearAndMonth, false),//退職年月
			comeToJapanYearAndMonth: publicUtils.formateDate(this.state.comeToJapanYearAndMonth, false),//来日年月
			nationalityCode: publicUtils.nullToEmpty(this.state.nationalityCode),//出身地
			birthplace: publicUtils.nullToEmpty(this.state.birthplace),//出身県
			phoneNo: publicUtils.nullToEmpty(this.state.phoneNo),//携帯電話
			authorityCode: $('input:radio[name="employeeType"]:checked').val() === "0" ? $("#authorityCodeId").val() : "0",//権限
			japaneseLevelCode: publicUtils.nullToEmpty(this.state.japaneseLevelCode),//日本語
			englishLevelCode: publicUtils.nullToEmpty(this.state.englishLevelCode),//英語
			certification1: publicUtils.nullToEmpty(this.state.certification1),//資格1
			certification2: publicUtils.nullToEmpty(this.state.certification2),//資格2
			siteRoleCode: publicUtils.nullToEmpty(this.state.siteRoleCode),//役割
			postcode: publicUtils.nullToEmpty(this.refs.postcode.value),//郵便番号
			firstHalfAddress: publicUtils.nullToEmpty(this.refs.firstHalfAddress.value),
			lastHalfAddress: publicUtils.nullToEmpty(this.state.lastHalfAddress),
			stationCode: publicUtils.labelGetValue($("#stationCode").val(), this.state.station),
			developLanguage1: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage1").val(), this.props.developLanguageMaster)),
			developLanguage2: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage2").val(), this.props.developLanguageMaster)),
			developLanguage3: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage3").val(), this.props.developLanguageMaster)),
			developLanguage4: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage4").val(), this.props.developLanguageMaster)),
			developLanguage5: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage5").val(), this.props.developLanguageMaster)),
			residenceCode: publicUtils.nullToEmpty(this.state.residenceCode),//在留資格
			residenceCardNo: publicUtils.nullToEmpty(this.state.residenceCardNo),//在留カード
			stayPeriod: publicUtils.formateDate(this.state.stayPeriod, false),//在留期間
			employmentInsuranceNo: publicUtils.nullToEmpty(this.state.employmentInsuranceNo),//雇用保険番号
			myNumber: publicUtils.nullToEmpty(this.state.myNumber),//マイナンバー
			resumeRemark1: publicUtils.nullToEmpty(this.state.resumeRemark1),//履歴書備考1
			resumeRemark2: publicUtils.nullToEmpty(this.state.resumeRemark2),//履歴書備考1
			accountInfo: this.state.accountInfo,//口座情報
			subCostInfo: this.state.subCostInfo,//諸費用
			password: publicUtils.nullToEmpty(this.state.passwordSetInfo),//pw設定
			yearsOfExperience: publicUtils.formateDate(this.state.yearsOfExperience, false),//経験年数
			bpInfoModel: this.state.bpInfoModel,//pb情報
		};
		formData.append('emp', JSON.stringify(emp))
		formData.append('resumeInfo1', publicUtils.nullToEmpty($('#resumeInfo1').get(0).files[0]))
		formData.append('resumeInfo2', publicUtils.nullToEmpty($('#resumeInfo2').get(0).files[0]))
		formData.append('residentCardInfo', publicUtils.nullToEmpty($('#residentCardInfo').get(0).files[0]))
		formData.append('passportInfo', publicUtils.nullToEmpty($('#passportInfo').get(0).files[0]))
		axios.post(this.props.serverIP + "employee/insertEmployee", formData)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "post", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					window.location.reload();
					this.getNO("LYC");//採番番号
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};
	//更新ボタン
	updateEmployee = () => {
		const formData = new FormData()
		const emp = {
			employeeNo: this.state.employeeNo,//社員番号
			bpEmployeeNo: this.state.employeeNo,//社員番号
			employeeFristName: this.state.employeeFristName,//社員氏
			employeeLastName: this.state.employeeLastName,//社員名
			furigana1: publicUtils.nullToEmpty(this.state.furigana1),//　　カタカナ
			furigana2: publicUtils.nullToEmpty(this.state.furigana2),//　　カタカナ
			alphabetName: publicUtils.nullToEmpty(this.state.alphabetName),//　　ローマ字
			birthday: publicUtils.formateDate(this.state.birthday, true),//年齢
			japaneseCalendar: publicUtils.nullToEmpty(this.state.japaneseCalendar),//和暦
			genderStatus: publicUtils.nullToEmpty(this.state.genderStatus),//性別
			intoCompanyCode: publicUtils.nullToEmpty(this.state.intoCompanyCode),//入社区分
			employeeFormCode: publicUtils.nullToEmpty(this.state.employeeFormCode),//社員形式
			occupationCode: publicUtils.nullToEmpty(this.state.occupationCode),//職種
			departmentCode: publicUtils.nullToEmpty(this.state.departmentCode),//部署
			companyMail: publicUtils.nullToEmpty(this.state.companyMail),//社内メール
			graduationUniversity: publicUtils.nullToEmpty(this.state.graduationUniversity),//卒業学校
			major: publicUtils.nullToEmpty(this.state.major),//専門
			graduationYearAndMonth: publicUtils.formateDate(this.state.graduationYearAndMonth, false),//卒業年月
			intoCompanyYearAndMonth: publicUtils.formateDate(this.state.intoCompanyYearAndMonth, false),//入社年月
			retirementYearAndMonth: publicUtils.formateDate(this.state.retirementYearAndMonth, false),//退職年月
			comeToJapanYearAndMonth: publicUtils.formateDate(this.state.comeToJapanYearAndMonth, false),//来日年月
			nationalityCode: publicUtils.nullToEmpty(this.state.nationalityCode),//出身地
			birthplace: publicUtils.nullToEmpty(this.state.birthplace),//出身県
			phoneNo: publicUtils.nullToEmpty(this.state.phoneNo),//携帯電話
			authorityCode: $('input:radio[name="employeeType"]:checked').val() === "0" ? $("#authorityCodeId").val() : "0",//権限
			japaneseLevelCode: publicUtils.nullToEmpty(this.state.japaneseLevelCode),//日本語
			englishLevelCode: publicUtils.nullToEmpty(this.state.englishLevelCode),//英語
			certification1: publicUtils.nullToEmpty(this.state.certification1),//資格1
			certification2: publicUtils.nullToEmpty(this.state.certification2),//資格2
			siteRoleCode: publicUtils.nullToEmpty(this.state.siteRoleCode),//役割
			postcode: publicUtils.nullToEmpty(this.refs.postcode.value),//郵便番号
			firstHalfAddress: publicUtils.nullToEmpty(this.refs.firstHalfAddress.value),
			lastHalfAddress: publicUtils.nullToEmpty(this.state.lastHalfAddress),
			stationCode: publicUtils.labelGetValue($("#stationCode").val(), this.state.station),
			developLanguage1: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage1").val(), this.props.developLanguageMaster)),
			developLanguage2: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage2").val(), this.props.developLanguageMaster)),
			developLanguage3: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage3").val(), this.props.developLanguageMaster)),
			developLanguage4: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage4").val(), this.props.developLanguageMaster)),
			developLanguage5: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage5").val(), this.props.developLanguageMaster)),
			residenceCode: publicUtils.nullToEmpty(this.state.residenceCode),//在留資格
			residenceCardNo: publicUtils.nullToEmpty(this.state.residenceCardNo),//在留カード
			stayPeriod: publicUtils.formateDate(this.state.stayPeriod, false),//在留期間
			employmentInsuranceNo: publicUtils.nullToEmpty(this.state.employmentInsuranceNo),//雇用保険番号
			myNumber: publicUtils.nullToEmpty(this.state.myNumber),//マイナンバー
			resumeRemark1: publicUtils.nullToEmpty(this.state.resumeRemark1),//履歴書備考1
			resumeRemark2: publicUtils.nullToEmpty(this.state.resumeRemark2),//履歴書備考1
			accountInfo: this.state.accountInfo,//口座情報
			subCostInfo: this.state.subCostInfo,//諸費用
			password: publicUtils.nullToEmpty(this.state.passwordSetInfo),//pw設定
			yearsOfExperience: publicUtils.formateDate(this.state.yearsOfExperience, false),//経験年数
			bpInfoModel: this.state.bpInfoModel,//pb情報
		};
		formData.append('emp', JSON.stringify(emp))
		formData.append('resumeInfo1', publicUtils.nullToEmpty($('#resumeInfo1').get(0).files[0]))
		formData.append('resumeInfo2', publicUtils.nullToEmpty($('#resumeInfo2').get(0).files[0]))
		formData.append('residentCardInfo', publicUtils.nullToEmpty($('#residentCardInfo').get(0).files[0]))
		formData.append('passportInfo', publicUtils.nullToEmpty($('#passportInfo').get(0).files[0]))
		axios.post(this.props.serverIP + "employee/updateEmployee", formData)
			.then(response => {
				if (response.data != null) {
					this.setState({ "myToastShow": true, "method": "put" });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				} else {
					this.setState({ "myToastShow": false });
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
		/* var val = $('#nationalityCodeId').val();
		if (val === '3') {
			this.setState({
				japaneseLevelCode: 5,
			})
		} else if (val === '4') {
			this.setState({
				englishLevelCode: 8,
			})
		} */
	}
	//初期化メソッド
	componentDidMount() {
		this.props.fetchDropDown();
		this.radioChangeEmployeeType();
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
			this.getNO('LYC');//採番番号
		}
	}


	getAuthority = () => {
		var methodArray = ["getAuthority"]
		var data = publicUtils.getPublicDropDown(methodArray);
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
		axios.post(this.props.serverIP + "employee/getEmployeeByEmployeeNo", emp)
			.then(response => response.data)
			.then((data) => {
				this.setState({
					employeeNo: data.employeeNo,//社員番号
					bpEmployeeNo: data.employeeNo,//社員番号
					employeeFristName: data.employeeFristName,//社員氏
					employeeLastName: data.employeeLastName,//社員名
					furigana1: data.furigana1,//　　カタカナ
					furigana2: data.furigana2,//　　カタカナ
					alphabetName: data.alphabetName,//　　ローマ字
					birthday: publicUtils.converToLocalTime(data.birthday, true),//年齢
					temporary_age: publicUtils.converToLocalTime(data.birthday, true) === "" ? "" : Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(data.birthday, true).getTime()) / 31536000000),
					japaneseCalendar: data.japaneseCalendar,//和暦
					genderStatus: data.genderStatus,//性別
					intoCompanyCode: data.intoCompanyCode,//入社区分
					employeeFormCode: data.employeeFormCode,//社員形式
					retirementYearAndMonthDisabled: data.employeeFormCode === "3" ? true : false,
					occupationCode: data.occupationCode,//職種
					departmentCode: data.departmentCode,//部署
					companyMail: data.companyMail,//社内メール
					graduationUniversity: data.graduationUniversity,//卒業学校
					major: data.major,//専門
					graduationYearAndMonth: publicUtils.converToLocalTime(data.graduationYearAndMonth, false),//卒業年月
					temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.graduationYearAndMonth, false), new Date()),
					intoCompanyYearAndMonth: publicUtils.converToLocalTime(data.intoCompanyYearAndMonth, false),//入社年月
					temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.intoCompanyYearAndMonth, false), new Date()),
					retirementYearAndMonth: publicUtils.converToLocalTime(data.retirementYearAndMonth, false),//退職年月
					temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.retirementYearAndMonth, false), new Date()),
					comeToJapanYearAndMonth: publicUtils.converToLocalTime(data.comeToJapanYearAndMonth, false),//来日年月
					temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.comeToJapanYearAndMonth, false), new Date()),
					nationalityCode: data.nationalityCode,//出身地
					birthplace: data.birthplace,//出身県
					phoneNo: data.phoneNo,//携帯電話
					authorityCode: data.authorityCode,//権限
					japaneseLevelCode: data.japaneseLevelCode,//日本語
					englishLevelCode: data.englishLevelCode,//英語
					certification1: data.certification1,//資格1
					certification2: data.certification2,//資格2
					siteRoleCode: data.siteRoleCode,//役割
					postcode: ((data.postcode + "       ").replace("null", "")).substring(0, 3).replace("   ", ""),//郵便番号
					postcode2: ((data.postcode + "       ").replace("null", "")).substring(3, 4).replace("", ""),//郵便番号
					firstHalfAddress: data.firstHalfAddress,
					lastHalfAddress: data.lastHalfAddress,
					stationCode: data.stationCode,
					developLanguage1: data.developLanguage1,//　スキール1
					developLanguage2: data.developLanguage2,//スキール2
					developLanguage3: data.developLanguage3,//スキール3
					developLanguage4: data.developLanguage4,//スキール4
					developLanguage5: data.developLanguage5,//スキール5
					residenceCode: data.residenceCode,//在留資格
					residenceCardNo: data.residenceCardNo,//在留カード
					stayPeriod: publicUtils.converToLocalTime(data.stayPeriod, false),//在留期間
					temporary_stayPeriod: publicUtils.converToLocalTime(data.stayPeriod, false) === "" ? "" : publicUtils.getFullYearMonth(new Date(), publicUtils.converToLocalTime(data.stayPeriod, false)),
					employmentInsuranceNo: data.employmentInsuranceNo,//雇用保険番号
					myNumber: data.myNumber,//マイナンバー
					residentCardInfoFlag: data.residentCardInfo !== "" && data.residentCardInfo !== null && data.residentCardInfo !== undefined ? true : false,//在留カード
					resumeInfo1Flag: data.resumeInfo1 !== "" && data.resumeInfo1 !== null && data.resumeInfo1 !== undefined ? true : false,//履歴書
					resumeRemark1: data.resumeRemark1,//履歴書備考1
					resumeInfo2Flag: data.resumeInfo2 !== "" && data.resumeInfo2 !== null && data.resumeInfo2 !== undefined ? true : false,//履歴書2
					resumeRemark2: data.resumeRemark2,//履歴書備考1
					passportInfoFlag: data.passportInfo !== "" && data.passportInfo !== null && data.passportInfo !== undefined ? true : false,//パスポート
					yearsOfExperience: publicUtils.converToLocalTime(data.yearsOfExperience, false),//経験年数
					temporary_yearsOfExperience: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.yearsOfExperience, false), new Date()),
				});
			}
			);
	};

	//　採番番号
	getNO = (ｓｔｒ) => {
		const promise = Promise.resolve(publicUtils.getNO("employeeNo", ｓｔｒ, "T001Employee"));
		promise.then((value) => {
			this.setState(
				{
					employeeNo: value
				}
			);
		});
	};

	//　　年月開始
	//　　卒業年月
	state = {
		birthday: new Date(),
		intoCompanyYearAndMonth: new Date(),
		retirementYearAndMonth: new Date(),
		comeToJapanYearAndMonth: new Date(),
		yearsOfExperience: new Date(),
		stayPeriod: new Date(),
		graduationYearAndMonth: new Date(),
	};
	//　　年齢と和暦
	inactiveBirthday = date => {
		if (date !== undefined && date !== null && date !== "") {
			publicUtils.calApi(date);
			this.setState({
				birthday: date
			});
		} else {
			this.setState({
				temporary_age: "0",
				birthday: "",
				japaneseCalendar: ""
			});
		}
	};
	//　　卒業年月
	inactiveGraduationYearAndMonth = date => {
		this.setState(
			{
				graduationYearAndMonth: date,
				temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),
				temporary_yearsOfExperience: (this.state.yearsOfExperience === undefined) ? publicUtils.getFullYearMonth(date, new Date()) : this.state.temporary_yearsOfExperience
			}
		);
	};
	//　　入社年月
	inactiveintoCompanyYearAndMonth = (date) => {
		this.setState(
			{
				intoCompanyYearAndMonth: date,
				temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	//　　退職年月
	inactiveRetirementYearAndMonth = (date) => {
		this.setState(
			{
				retirementYearAndMonth: date,
				temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),

			}
		);
	};
	//　　来日年月
	inactiveComeToJapanYearAndMonth = date => {
		this.setState(
			{
				comeToJapanYearAndMonth: date,
				temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(date, new Date())

			}
		);
	};
	//　　経験年数
	inactiveyearsOfExperience = date => {
		this.setState(
			{
				yearsOfExperience: date,
				temporary_yearsOfExperience: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	//　　在留期間
	inactiveStayPeriod = date => {
		this.setState(
			{
				stayPeriod: date,
				temporary_stayPeriod: publicUtils.getFullYearMonth(new Date(), date)
			}
		);
	};
	//　　年月終了

	//社員タイプが違う時に、色々な操作をします。
	radioChangeEmployeeType = () => {
		let val = $('#employeeStatusId').val();
		if (val === '1') {
			this.setState({ companyMail: '', authorityCodes: []});
			this.getNO("BP");
		} else {
			this.getNO("LYC");
			this.getAuthority();
		}
	}

	/* 
		ポップアップ口座情報の取得
	 */
	accountInfoGet = (accountTokuro) => {
		this.setState({
			accountInfo: accountTokuro,
			showBankInfoModal: false,
		})
	}

	/* 
	ポップアップPW設定の取得
 　　　*/
	passwordSetInfoGet = (passwordSetTokuro) => {
		this.setState({
			passwordSetInfo: passwordSetTokuro,
			showPasswordSetModal: false,
		})
	}
	/* 
	ポップアップpb情報の取得
 　　　*/
	pbInfoGet = (pbInfoGetTokuro) => {
		this.setState({
			bpInfoModel: pbInfoGetTokuro,
			showBpInfoModal: false,
		})
	}
	/**
	* 小さい画面の閉め 
	*/
	handleHideModal = (kbn) => {
		if (kbn === "bankInfo") {//　　口座情報
			this.setState({ showBankInfoModal: false })
		} else if (kbn === "passwordSet") {//PW設定
			this.setState({ showPasswordSetModal: false })
		} else if (kbn === "bpInfoModel") {//pb情報
			this.setState({ showBpInfoModal: false })
		}
	}

	/**
 　　　* 小さい画面の開き
    */
	handleShowModal = (kbn) => {
		if (kbn === "bankInfo") {//　　口座情報
			this.setState({ showBankInfoModal: true })
		} else if (kbn === "passwordSet") {//PW設定
			this.setState({ showPasswordSetModal: true })
		} else if (kbn === "bpInfoModel") {//pb情報
			this.setState({ showBpInfoModal: true })
		}
	}

	valueChangeEmployeeFormCode = (event) => {
		const value = event.target.value;
		if (value === "3") {
			this.setState({ retirementYearAndMonthDisabled: true, employeeFormCode: event.target.value })
		} else {
			this.setState({ retirementYearAndMonthDisabled: false, retirementYearAndMonth: "", employeeFormCode: event.target.value, temporary_retirementYearAndMonth: "" })
		}
	}


	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (this.props.developLanguageMaster.find((v) => (v.name === value)) !== undefined ||
				this.props.station.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'developLanguage1':
						this.setState({
							developLanguage1: this.props.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage2':
						this.setState({
							developLanguage2: this.props.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage3':
						this.setState({
							developLanguage3: this.props.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage4':
						this.setState({
							developLanguage4: this.props.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage5':
						this.setState({
							developLanguage5: this.props.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'stationCode':
						this.setState({
							stationCode: this.props.station.find((v) => (v.name === value)).code,
						})
						break;
					default:
				}
			}
		}

	};

	changeFile = (event, name) => {
		var filePath = event.target.value;
		var arr = filePath.split('\\');
		var fileName = arr[arr.length - 1];
		if (name === "residentCardInfo") {
			this.setState({
				residentCardInfo: filePath,
				residentCardInfoName: fileName,
			})
		} else if (name === "resumeInfo1") {
			this.setState({
				resumeInfo1: filePath,
				resumeInfo1Name: fileName,
			})
		} else if (name === "resumeInfo2") {
			this.setState({
				resumeInfo2: filePath,
				resumeInfo2Name: fileName,
			})
		} else if
			(name === "passportInfo") {
			this.setState({
				passportInfo: filePath,
				passportInfoName: fileName,
			})
		}
	}
	render() {
		const { employeeNo, employeeFristName, employeeLastName, furigana1, furigana2, alphabetName, temporary_age, japaneseCalendar, genderStatus, major, intoCompanyCode,
			employeeFormCode, occupationCode, departmentCode, companyMail, graduationUniversity, nationalityCode, birthplace, phoneNo, authorityCode, japaneseLevelCode, englishLevelCode, residenceCode,
			residenceCardNo, employmentInsuranceNo, myNumber, certification1, certification2, siteRoleCode, postcode, firstHalfAddress, lastHalfAddress, resumeRemark1, resumeRemark2, temporary_stayPeriod, temporary_yearsOfExperience, temporary_intoCompanyYearAndMonth, temporary_comeToJapanYearAndMonth,
			retirementYearAndMonthDisabled, temporary_graduationYearAndMonth, temporary_retirementYearAndMonth, errorsMessageValue, employeeStatus
		} = this.state;
		const { accountInfo, passwordSetInfo, bpInfoModel, actionType } = this.state;
		const genderStatuss = this.props.genderStatuss;
		const employeeFormCodes = this.props.employeeFormCodes;
		const siteMaster = this.props.siteMaster;
		const intoCompanyCodes = this.props.intoCompanyCodes;
		const japaneaseLevelCodes = this.props.japaneaseLevelCodes;
		const residenceCodes = this.props.residenceCodes;
		const nationalityCodes = this.props.nationalityCodes;
		const developLanguageMaster = this.props.developLanguageMaster;
		const occupationCodes = this.props.occupationCodes;
		const departmentCodes = this.props.departmentCodes;
		const authorityCodes = this.props.authorityCodes;
		const englishLeveCodes = this.props.englishLeveCodes;
		const station = this.props.station;
		const employeeStatusS = this.props.employeeStatusS;
		return (
			<div>
				<FormControl value={actionType} name="actionType" hidden />
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.method === "put" ? "修正成功！." : "登録成功！"} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<Row inline="true">
					<Col className="text-center">
						<h2>社員情報登録</h2>
					</Col>
				</Row>
				<br />
				{/*　 開始 */}
				{/*　 口座情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bankInfo")} show={this.state.showBankInfoModal} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<BankInfo accountInfo={accountInfo} actionType={sessionStorage.getItem('actionType')} accountTokuro={this.accountInfoGet} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} />
					</Modal.Body>
				</Modal>
				{/*　 PW設定 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "passwordSet")} show={this.state.showPasswordSetModal} dialogClassName="modal-passwordSet">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<PasswordSet passwordSetInfo={passwordSetInfo} actionType={sessionStorage.getItem('actionType')} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} passwordToroku={this.passwordSetInfoGet} /></Modal.Body>
				</Modal>
				{/*　 pb情報*/}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bpInfoModel")} show={this.state.showBpInfoModal} dialogClassName="modal-pbinfoSet">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<BpInfoModel bpInfoModel={bpInfoModel} customer={this.state.customer} actionType={sessionStorage.getItem('actionType')} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} pbInfoTokuro={this.pbInfoGet} /></Modal.Body>
				</Modal>
				{/* 終了 */}
				<div style={{ "textAlign": "center" }}>
					<Button size="sm" id="bankInfo" onClick={this.handleShowModal.bind(this, "bankInfo")} >口座情報</Button>{' '}
					<Button size="sm" id="passwordSet" onClick={this.handleShowModal.bind(this, "passwordSet")} >PW設定</Button>{' '}
					<Button size="sm" id="bpInfoModel" onClick={this.handleShowModal.bind(this, "bpInfoModel")} >BP情報</Button>{' '}
				</div>
				<Form onReset={this.resetBook} enctype="multipart/form-data">
					<Form.Group>
						<Form.Label style={{ "color": "#00EE00" }}>基本情報</Form.Label>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.radioChangeEmployeeType.bind(this)}
										name="employeeStatus" value={employeeStatus}
										id="employeeStatusId"
										autoComplete="off">
										{employeeStatusS.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text></InputGroup.Prepend>
									<FormControl value={employeeNo} autoComplete="off" disabled onChange={this.valueChange} size="sm" name="employeeNo" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text></InputGroup.Prepend>
									<FormControl placeholder="社員氏" value={employeeFristName} autoComplete="off" onChange={this.valueChange}  size="sm" name="employeeFristName" maxlength="3" />{' '}
									<FormControl placeholder="社員名" value={employeeLastName} autoComplete="off" onChange={this.valueChange}  size="sm" name="employeeLastName" maxlength="3" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">カタカナ</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="カタカナ" value={furigana1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana1"  />{' '}
									<FormControl placeholder="カタカナ" value={furigana2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana2"  />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="ローマ字" value={alphabetName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="alphabetName"  />
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
										autoComplete="off" >
										{genderStatuss.map(date =>
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
										<InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.birthday}
											onChange={this.inactiveBirthday}
											autoComplete="off"
											locale="ja"
											yearDropdownItemNumber={25}
											scrollableYearDropdown
											maxDate={new Date()}
											
											className="form-control form-control-sm"
											showYearDropdown
											dateFormat="yyyy/MM/dd"
											
										/>
									</InputGroup.Append>
									<FormControl placeholder="0" id="temporary_age" value={temporary_age} autoComplete="off" onChange={this.valueChange} size="sm" name="temporary_age" disabled />
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
									<FormControl placeholder="和暦" value={japaneseCalendar} id="japaneseCalendar" autoComplete="off" onChange={this.valueChange} size="sm" name="japaneseCalendar" disabled />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="intoCompanyCode" value={intoCompanyCode}
										autoComplete="off" >
										{intoCompanyCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChangeEmployeeFormCode}
										name="employeeFormCode" value={employeeFormCode}
										autoComplete="off" >
										{employeeFormCodes.map(date =>
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
										autoComplete="off" >
										{departmentCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">職種</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="occupationCode" value={occupationCode}
										autoComplete="off" >
										{occupationCodes.map(date =>
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
										onChange={this.valueChange} size="sm" name="companyMail"  /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
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
										onChange={this.valueChange} size="sm" name="graduationUniversity"  />
									<FormControl placeholder="専門" value={major} autoComplete="off"
										onChange={this.valueChange} size="sm" name="major"  />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業年月</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.graduationYearAndMonth}
											onChange={this.inactiveGraduationYearAndMonth}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											
											className="form-control form-control-sm"
											autoComplete="off"
											
										/>
									</InputGroup.Append>
									<FormControl name="temporary_graduationYearAndMonth" value={temporary_graduationYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.intoCompanyYearAndMonth}
											onChange={this.inactiveintoCompanyYearAndMonth}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											
											className="form-control form-control-sm"
											autoComplete="off"
											
										/>
									</InputGroup.Append>
									<FormControl name="temporary_intoCompanyYearAndMonth" value={temporary_intoCompanyYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3" >
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">退職年月</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.retirementYearAndMonth}
											onChange={this.inactiveRetirementYearAndMonth}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											className="form-control form-control-sm"
											disabled={retirementYearAndMonthDisabled ? false : true}
											autoComplete="off"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_retirementYearAndMonth" value={temporary_retirementYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">来日年月</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.comeToJapanYearAndMonth}
											onChange={this.inactiveComeToJapanYearAndMonth}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											
											className="form-control form-control-sm"
											autoComplete="off"
											
										/>
									</InputGroup.Append>
									<FormControl name="temporary_comeToJapanYearAndMonth" value={temporary_comeToJapanYearAndMonth} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
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
										autoComplete="off" id="nationalityCodeId" >
										{nationalityCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<FormControl placeholder="出身地" value={birthplace} autoComplete="off"
										onChange={this.valueChange} size="sm" name="birthplace"  />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">携帯電話</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="携帯電話" value={phoneNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="phoneNo"  />
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
										autoComplete="off" id="authorityCodeId" >
										{authorityCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
						<Form.Label style={{ "color": "#00EE00" }}>スキール情報</Form.Label>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"
										onChange={this.valueChange} size="sm"
										name="japaneseLevelCode" value={japaneseLevelCode}
										autoComplete="off" id="japaneaseLevelCodeId" >
										{japaneaseLevelCodes.map(data =>
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
									<Form.Control as="select" onChange={this.valueChange} size="sm" name="englishLevelCode" value={englishLevelCode} autoComplete="off" id="englishLeveCodeId" >
										{englishLeveCodes.map(data =>
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
									<FormControl placeholder="資格1" value={certification1} autoComplete="off" onChange={this.valueChange} size="sm" name="certification1"  />
									<FormControl placeholder="資格2" value={certification2} autoComplete="off" onChange={this.valueChange} size="sm" name="certification2"  />
								</InputGroup>
							</Col>

							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" name="siteRoleCode" onChange={this.valueChange} value={siteRoleCode} autoComplete="off" >
										{siteMaster.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>

						</Row>
						<Row>
							<Col sm={9}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										
										value={developLanguageMaster.find((v) => (v.code === this.state.developLanguage1)) || {}}
										options={developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage1')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語1" type="text" {...params.inputProps} className="auto" id="developLanguage1"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
									<Autocomplete
										
										value={developLanguageMaster.find((v) => (v.code === this.state.developLanguage2)) || {}}
										options={developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage2')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語2" type="text" {...params.inputProps} className="auto" id="developLanguage2"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
									<Autocomplete
										
										value={developLanguageMaster.find((v) => (v.code === this.state.developLanguage3)) || {}}
										options={developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage3')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語3" type="text" {...params.inputProps} className="auto" id="developLanguage3"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
									<Autocomplete
										
										value={developLanguageMaster.find((v) => (v.code === this.state.developLanguage4)) || {}}
										options={developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage4')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語4" type="text" {...params.inputProps} className="auto" id="developLanguage4"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
									<Autocomplete
										
										value={developLanguageMaster.find((v) => (v.code === this.state.developLanguage5)) || {}}
										options={developLanguageMaster}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'developLanguage5')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語5" type="text" {...params.inputProps} className="auto" id="developLanguage5"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">経験年数</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.yearsOfExperience}
											onChange={this.inactiveyearsOfExperience}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											
											className="form-control form-control-sm"
											autoComplete="off"
											
										/>
									</InputGroup.Append>
									<FormControl name="temporary_yearsOfExperience" value={temporary_yearsOfExperience} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
						</Row>
						<Form.Label style={{ "color": "#00EE00" }}>住所情報</Form.Label>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">郵便番号：〒</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={postcode} autoComplete="off" onBlur={publicUtils.postcodeApi} ref="postcode" size="sm" name="postcode" id="postcode" maxlength="7"  />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">都道府県＋市区町村：</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={firstHalfAddress} autoComplete="off" size="sm" name="firstHalfAddress" id="firstHalfAddress" ref="firstHalfAddress" disabled />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">以降住所：</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={lastHalfAddress} autoComplete="off" onChange={this.valueChange} size="sm" name="lastHalfAddress" id="lastHalfAddress"  />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">最寄駅</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										
										value={station.find((v) => (v.code === this.state.stationCode)) || {}}
										options={station}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'stationCode')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  最寄駅" type="text" {...params.inputProps} className="auto" id="stationCode"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
						</Row>
						<Form.Label style={{ "color": "#00EE00" }}>個人関連情報</Form.Label>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留資格 </InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="residenceCode" value={residenceCode}
										autoComplete="off" >
										{residenceCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="在留カード" value={residenceCardNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="residenceCardNo"  />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留期間</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.stayPeriod}
											onChange={this.inactiveStayPeriod}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											
											className="form-control form-control-sm"
											autoComplete="off"
											
										/>
									</InputGroup.Append>
									<FormControl name="temporary_stayPeriod" value={temporary_stayPeriod} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">雇用保険番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="雇用保険番号" value={employmentInsuranceNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employmentInsuranceNo"  />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">マイナンバー</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="マイナンバー" value={myNumber} autoComplete="off"
										onChange={this.valueChange} size="sm" name="myNumber"  />
								</InputGroup>
							</Col>
						</Row>
						<Row>

							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm" >在留カード</InputGroup.Text>
										{this.state.residentCardInfoFlag  ? <InputGroup.Text id="inputGroup-sizing-sm" >添付済み</InputGroup.Text> :
											<Form.File id="residentCardInfo"
												label={this.state.residentCardInfo === undefined ? "在留カード" : this.state.residentCardInfoName} data-browse="添付" value={this.state.residentCardInfo} custom onChange={(event) => this.changeFile(event, 'residentCardInfo')}  />}
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm" >履歴書</InputGroup.Text>
										{this.state.resumeInfo1Flag  ? <InputGroup.Text id="inputGroup-sizing-sm" >添付済み</InputGroup.Text> :
											<Form.File id="resumeInfo1"
												label={this.state.resumeInfo1 === undefined ? "履歴書1" : this.state.resumeInfo1Name} data-browse="添付" value={this.state.resumeInfo1} custom onChange={(event) => this.changeFile(event, 'resumeInfo1')}  />}
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={1}>
								<InputGroup size="sm" className="mb-3">
									<FormControl placeholder="備考1" value={resumeRemark1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeRemark1"  />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書2</InputGroup.Text>
										{this.state.resumeInfo2Flag  ? <InputGroup.Text id="inputGroup-sizing-sm" >添付済み</InputGroup.Text> :
											<Form.File id="resumeInfo2"
												label={this.state.resumeInfo2 === undefined ? "履歴書2" : this.state.resumeInfo2Name} data-browse="添付" value={this.state.resumeInfo2} custom onChange={(event) => this.changeFile(event, 'resumeInfo2')}  />}
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={1}>
								<InputGroup size="sm" className="mb-3">
									<FormControl placeholder="備考2" value={resumeRemark2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeRemark2"  />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">パスポート</InputGroup.Text>
										{this.state.passportInfoFlag  ? <InputGroup.Text id="inputGroup-sizing-sm" >添付済み</InputGroup.Text> :
											<Form.File id="passportInfo"
												label={this.state.passportInfo === undefined ? "パスポート" : this.state.passportInfoName} data-browse="添付" value={this.state.passportInfo} custom onChange={(event) => this.changeFile(event, 'passportInfo')}  />}
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>

						{sessionStorage.getItem('actionType') === "detail" ? "" : <div style={{ "textAlign": "center" }}>
							<Button size="sm" variant="info" onClick={sessionStorage.getItem('actionType') === "update" ? this.updateEmployee : this.insertEmployee} type="button" on>
								<FontAwesomeIcon icon={faSave} /> {sessionStorage.getItem('actionType') === "update" ? "更新" : "登録"}
							</Button>{' '}
							<Button size="sm" variant="info" type="reset">
								<FontAwesomeIcon icon={faUndo} /> リセット
                        </Button>
						</div>}
					</Form.Group>
				</Form>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		genderStatuss: state.data.dataReques.length >= 1 ? state.data.dataReques[0] : [],
		intoCompanyCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[1] : [],
		employeeFormCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[2] : [],
		siteMaster: state.data.dataReques.length >= 1 ? state.data.dataReques[3] : [],
		employeeStatusS: state.data.dataReques.length >= 1 ? state.data.dataReques[4].slice(1) : [],
		japaneaseLevelCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[5] : [],
		residenceCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[6] : [],
		nationalityCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[7] : [],
		developLanguageMaster: state.data.dataReques.length >= 1 ? state.data.dataReques[8].slice(1) : [],
		employeeInfo: state.data.dataReques.length >= 1 ? state.data.dataReques[9].slice(1) : [],
		occupationCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[10] : [],
		departmentCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[11] : [],
		authorityCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[12].slice(1) : [],
		englishLeveCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[13] : [],
		station: state.data.dataReques.length >= 1 ? state.data.dataReques[14].slice(1) : [],
		customer: state.data.dataReques.length >= 1 ? state.data.dataReques[15].slice(1) : [],
		serverIP: state.data.dataReques[state.data.dataReques.length - 1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(employee);

