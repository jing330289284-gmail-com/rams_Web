import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Form, Button, Col, Row, InputGroup, Modal, FormControl} from 'react-bootstrap';
import { faGlasses, faEnvelope, faUserPlus , faLevelUpAlt, faTrash, faFile} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import MailConfirm from './mailConfirm';
import store from './redux/store';
import SalesEmpAddPopup from './salesEmpAddPopup';
import $ from "jquery";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
axios.defaults.withCredentials = true;

/**
 * 営業送信お客確認画面
 */
class sendLettersConfirm extends React.Component {

	constructor(props) {
		super(props);
		this.valueChange = this.valueChange.bind(this);
		this.titleValueChange = this.titleValueChange.bind(this);
		this.state = this.initialState;// 初期化
	}

	// 初期化変数
	initialState = ({
		resumePath: '',
		resumeName: '',
		selectedmail: '',
		selectedEmps: '',
		mailTitle: '',
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		selectedEmpNos: this.props.location.state.salesPersons,
		selectedCusInfos: this.props.location.state.targetCusInfos,
		employeeInfo: [],
		employeeInfoAdd: [],
		employeeName: '',
		hopeHighestPrice: '',
		nationalityName: '',
		greetinTtext:'弊社営業中要員をご提案致します。見合う案件が御座いましたら、ご連絡頂けますと幸いです。',
		birthday: '',
		stationName: '',
		developLanguage: '',
		yearsOfExperience: '',
		japaneseLevelName: '',
		beginMonth: '',
		salesProgressCode: '',
		remark1: '',
		myToastShow: false,// 状態ダイアログ
		employeeNo: this.props.empNo,
		genderStatus: '',
		age: '',
		nearestStation: '',
		employeeStatus: '',
		japaneseLevelCode: '',
		englishLevelCode: '',
		japaneseLevellabal: '',
		englishLevellabal: '',
		siteRoleCode: '',
		siteRoleName: '',
		unitPrice: '',
		addDevelopLanguage: '',
		developLanguageCode6: null,
		developLanguageCode7: null,
		developLanguageCode8: null,
		developLanguageCode9: null,
		developLanguageCode10: null,
		genders: store.getState().dropDown[0].slice(1),
		employees: store.getState().dropDown[4].slice(1),
		japaneseLevels: store.getState().dropDown[5].slice(1),
		englishLevels: store.getState().dropDown[13].slice(1),
		salesProgresss: store.getState().dropDown[16].slice(1),
		japaneaseConversationLevels: store.getState().dropDown[43].slice(1),
		englishConversationLevels: store.getState().dropDown[44].slice(1),
		projectPhases: store.getState().dropDown[45].slice(1),
		stations: store.getState().dropDown[14].slice(1),
		developLanguages: store.getState().dropDown[8].slice(1),
		developLanguagesShow: store.getState().dropDown[8].slice(1),
		employeeStatusS: store.getState().dropDown[4].slice(1),
		positions: store.getState().dropDown[20],
		wellUseLanguagss: [],
		resumeInfoList: [],
		stationCode: '',
		disbleState: false,
		japaneaseConversationLevel: '',
		englishConversationLevel: '',
		projectPhaseCode: '0',
		empSelectedFlag: false,
		ctmSelectedFlag: false,
		selectedCustomerName: '',
		selectedPurchasingManagers: '',
		initAge: '',
		initNearestStation: '',
		initJapaneaseConversationLevel: '',
		initEnglishConversationLevel: '',
		initYearsOfExperience: '',
		initDevelopLanguageCode6: null,
		initDevelopLanguageCode7: null,
		initDevelopLanguageCode8: null,
		initDevelopLanguageCode9: null,
		initDevelopLanguageCode10: null,
		initUnitPrice: '',
		initRemark: '',
		disableFlag: true,
		initWellUseLanguagss: [],
		daiologShowFlag: false,
		empAdddaiologShowFlag: false,
		selectRow1Flag: false,
		selectRowFlag: false,
		mails: [],
		loginUserInfo: [],
		appendEmps: [],
		selectedMailCC: [],
		popupFlag: true,
		backPage: "",
		searchFlag: true,
		sendValue: {},
		/* 要員追加機能の新規 20201216 張棟 START */
		// 全部要員名前集合
		allEmployeeName: [],
		// 全部要員集合
		allEmployeeNameInfo: [],
		// 画面遷移初期化:true,要員追加ボタンを押下した:false
		initFlg: true,
		// 要員一覧テーブルのindex
		EmployeeNameIndex: 0,
		// ページ数
		currentPage: 1,
        // 選択されたのindex
        selectedColumnId: 0,
		// 提示情報
		errorsMessageShow: false,
		errorsMessageValue: '',
		message: '',
		type: '',
		// 履歴書のパス
		resumeInfo1: '',
		// 履歴書のテキスト名
		resumeInfo1Name: '',
		//
		employeeFlag: true,
		// 送信ボタン活性
		sendLetterButtonDisFlag: true,
		/* 要員追加機能の新規 20201216 張棟 END */
		sendLetterOverFlag: false,
		titleFlag: false,
	})
	
	componentDidMount() {
		console.log(this.props.location);
		if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
			this.setState({
				sendValue: this.props.location.state.sendValue,
				backPage: this.props.location.state.backPage,
				backbackPage: this.props.location.state.backbackPage,
				projectNo: this.props.location.state.projectNo,
			})
			
		}
		/* 要員追加機能の新規 20201216 張棟 START */
		// 営業状況確認一覧画面から選択された送信要員がある
		if (this.state.selectedEmpNos !== "" && this.state.selectedEmpNos !== null && this.state.selectedEmpNos !== undefined) {
			// 選択された送信要員の詳細データを取る
			this.searchEmpDetail();			
		}
		/* 要員追加機能の新規 20201216 張棟 END */
		// メールデータが取る
		this.getMail();
		this.getLoginUserInfo();
		this.getAllEmpsWithResume();
		/* 要員追加機能の新規 20201216 張棟 START */
		// 画面初期化する時、全部要員のデータを取る
		this.getAllEmployInfoName();
		/* 要員追加機能の新規 20201216 張棟 END */
		$("#deleteButton").attr("disabled",true);
		$("#bookButton").attr("disabled",true);

		if (this.state.employeeInfo.length === 0) {
			this.setState({
				employeeFlag : false,
			})
		}
		this.setSelectedCusInfos("未");
	}
	
	setSelectedCusInfos = (text) => {
		let selectedCusInfos = this.props.location.state.targetCusInfos;
		for(let i = 0; i < selectedCusInfos.length; i++){
			selectedCusInfos[i].rowNo = i + 1;
			selectedCusInfos[i].sendOver = text;
		}
		this.setState({
			selectedCusInfos : selectedCusInfos,
		})
	}

	/* 要員追加機能の新規 20201216 張棟 START */
	getAllEmployInfoName = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getAllEmployInfoName")
			.then(result => {
				// 全部要員名前集合
				let arr = [];
				if (result.data.length !== 0) {
					for (var i=0 ; i < result.data.length ; i++) {
						arr[i] = result.data[i].employeeName;
					}
				}
				this.setState({
					// 全部所属
					allEmployeeName : arr,
					allEmployeeNameInfo: result.data,
					// 履歴書
				});
		}).catch(function(error) {
			alert(error);
		});
	}
	/* 要員追加機能の新規 20201216 張棟 END */
	
	// 共用CCメールを操作
	onTagsChange = (event, values, fieldName) => {
		if (values.length === 2) {
			this.setState({
				disbleState: true,
			});
		} else {
			this.setState({
				disbleState: false,
			});
		}
		this.setState({
			selectedMailCC: [this.fromMailToEmp(values.length >= 1 ? values[0].companyMail : ''),
			this.fromMailToEmp(values.length >= 2 ? values[1].companyMail : '')].filter(function(s) {
				return s;
			}),
		});
	}

	fromMailToEmp = (mail) => {
		if (mail === "" || mail === null) {
			return '';
		} else {
			return this.state.mails.find((v) => (v.companyMail === mail));
		}
	}
	
	getMail = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getMail")
			.then(result => {
				this.setState({
					mails: result.data,
				})
			})
			.catch(function(error) {
				alert(error);
			});

	}
	/*
	 * this.setState({ employeeName: result.data[0].employeeFullName,
	 * genderStatus: this.state.genders.find((v) => (v.code ===
	 * result.data[0].genderStatus)).name, nationalityName:
	 * result.data[0].nationalityName, age:
	 * publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
	 * Math.ceil((new Date().getTime() -
	 * publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) /
	 * 31536000000), developLanguage: result.data[0].developLanguage,
	 * yearsOfExperience: result.data[0].yearsOfExperience, beginMonth: new
	 * Date("2020/09").getTime(), salesProgressCode: '2', nearestStation:
	 * result.data[0].employeeStatus === null ? "" :
	 * result.data[0].nearestStation, stationCode: result.data[0].employeeStatus
	 * === null ? "" : result.data[0].nearestStation, employeeStatus:
	 * result.data[0].employeeStatus === null || result.data[0].employeeStatus
	 * ===""?"":this.state.employees.find((v) => (v.code ===
	 * result.data[0].employeeStatus)).name, japaneseLevelCode:
	 * result.data[0].japaneseLevelCode === null ||
	 * result.data[0].japaneseLevelCode
	 * ===""?"":this.state.japaneseLevels.find((v) => (v.code ===
	 * result.data[0].japaneseLevelCode)).name, englishLevelCode:
	 * result.data[0].englishLevelCode === null ||
	 * result.data[0].englishLevelCode === "" ?
	 * "":this.state.englishLevels.find((v) => (v.code ===
	 * result.data[0].englishLevelCode)).name, siteRoleCode:
	 * result.data[0].siteRoleCode === null || result.data[0].siteRoleCode === "" ?
	 * "":result.data[0].siteRoleCode, siteRoleName: result.data[0].siteRoleCode
	 * === null || result.data[0].siteRoleCode === "" ?
	 * "":result.data[0].siteRoleName, initAge:
	 * publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
	 * Math.ceil((new Date().getTime() -
	 * publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) /
	 * 31536000000), initNearestStation: result.data[0].nearestStation,
	 * initJapaneaseConversationLevel: '', initEnglishConversationLevel: '',
	 * initYearsOfExperience: result.data[0].yearsOfExperience,
	 * initDevelopLanguageCode6: null, initDevelopLanguageCode7: null,
	 * initDevelopLanguageCode8: null, initDevelopLanguageCode9: null,
	 * initDevelopLanguageCode10: null, initUnitPrice: '', initRemark: '',
	 * initWellUseLanguagss: [], unitPrice: hopeHighestPrice !== null &&
	 * hopeHighestPrice !== "" && hopeHighestPrice !== undefined ?
	 * hopeHighestPrice : result.data[0].unitPrice , employeeInfo : index !==
	 * undefined ? employeeInfo : this.state.employeeInfo, })
	 */
	// 送信処理
	beforeSendMailWithFile = () => {
		this.setSelectedCusInfos("○");
		let mailText = ``;
		var time;
		for(let i = 0 ; i < this.state.employeeInfo.length;i++){
			if(this.state.employeeInfo[i].employeeNo !== ""){
				// alert(this.state.employeeInfo[i].resumeInfo1Name)
				axios.post(this.state.serverIP + "salesSituation/getPersonalSalesInfo", { employeeNo: String(this.state.employeeInfo[i].employeeNo) })
				.then(result => {		
					mailText += `<br/>
					【名　　前】：`+ result.data[0].employeeFullName + `　` + result.data[0].nationalityName + `　` + this.state.genders.find((v) => (v.code === result.data[0].genderStatus)).name + `<br/>
					【所　　属】：`+ (result.data[0].employeeStatus === null || result.data[0].employeeStatus ===""?"":this.state.employees.find((v) => (v.code === result.data[0].employeeStatus)).name) + (result.data[0].age === null || result.data[0].age === ""?(publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :`<br	/>
					【年　　齢】：`):`<br	/>
					【年　　齢】：`)+ (result.data[0].age === null || result.data[0].age === ""?(publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
					Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) / 31536000000) + `歳`):result.data[0].age + `歳`) + (result.data[0].nearestStation === null || result.data[0].nearestStation === ""?"":`<br	/>
					【最寄り駅】：`)+ (result.data[0].nearestStation === null || result.data[0].nearestStation === ""?"":this.state.stations.find((v) => (v.code === result.data[0].nearestStation)).name) + (result.data[0].japaneaseConversationLevel === null || result.data[0].japaneaseConversationLevel === ""?"":`<br	/>
					【日本　語】：`)+ (result.data[0].japaneaseConversationLevel === null || result.data[0].japaneaseConversationLevel === ""?"":this.state.japaneaseConversationLevels.find((v) => (v.code === result.data[0].japaneaseConversationLevel)).name) + (result.data[0].englishConversationLevel === null || result.data[0].englishConversationLevel === ""?"":`<br	/>
					【英　　語】：`)+ (result.data[0].englishConversationLevel === null || result.data[0].englishConversationLevel === ""?"":this.state.englishConversationLevels.find((v) => (v.code === result.data[0].englishConversationLevel)).name) + (result.data[0].yearsOfExperience === null || result.data[0].yearsOfExperience === ""?"":`<br	/>
					【業務年数】：`)+ (result.data[0].yearsOfExperience === null || result.data[0].yearsOfExperience === ""?"":result.data[0].yearsOfExperience + `年`) + (result.data[0].siteRoleName === null || result.data[0].siteRoleName === ""?"":`<br	/>
					【対応工程】：`)+ (result.data[0].siteRoleName === null || result.data[0].siteRoleName === ""?"":result.data[0].siteRoleName) + (result.data[0].developLanguage === null || result.data[0].developLanguage === ""?"":`<br	/>
					【得意言語】：`)+ (result.data[0].developLanguage === null || result.data[0].developLanguage === ""?"":result.data[0].developLanguage) + (((this.state.employeeInfo[i].hopeHighestPrice === null || this.state.employeeInfo[i].hopeHighestPrice === "") && (result.data[0].unitPrice === null || result.data[0].unitPrice === ""))?"":`<br	/>
					【単　　価】：`)+ ((((this.state.employeeInfo[i].hopeHighestPrice === null || this.state.employeeInfo[i].hopeHighestPrice === "")?"":this.state.employeeInfo[i].hopeHighestPrice + `万円`) === "" ? ((result.data[0].unitPrice === null || result.data[0].unitPrice === "") ? "" : result.data[0].unitPrice + `万円`):this.state.employeeInfo[i].hopeHighestPrice + `万円`)) + (result.data[0].theMonthOfStartWork === undefined || result.data[0].theMonthOfStartWork === "" || result.data[0].theMonthOfStartWork === null?"":`<br	/>
					【稼働開始】：`) + (result.data[0].theMonthOfStartWork === undefined || result.data[0].theMonthOfStartWork === "" || result.data[0].theMonthOfStartWork === null ? "":result.data[0].theMonthOfStartWork) + (result.data[0].salesProgressCode === null || result.data[0].salesProgressCode === ""?"":`<br	/>
					【営業状況】：`)+ (result.data[0].salesProgressCode === null || result.data[0].salesProgressCode === ""?"":this.state.salesProgresss.find((v) => (v.code === result.data[0].salesProgressCode)).name) + (result.data[0].remark1 === null || result.data[0].remark1 === ""?"":`<br	/>
					【備　　考】：`)+ (result.data[0].remark1 === null || result.data[0].remark1 === ""?"":result.data[0].remark1)		
					+ `<br/>`
					clearTimeout(time)
			        time=setTimeout(()=>{
						this.sendMailWithFile(mailText);
			        },1000)

				})
				.catch(function(error) {
					alert(error);
				});
			}
		}

		// this.sendMailWithFile();
	}

	// 送信処理
	sendMailWithFile = (mailText) => {
/*
 * 【名 前】：`+ this.state.employeeName + ` ` + this.state.nationalityName + ` ` +
 * this.state.genderStatus + `<br/> 【所 属】：`+ this.state.employeeStatus +
 * (this.state.age === ""?"":`<br	/> 【年 齢】：`)+ this.state.age + (this.state.age
 * === ""?"":`歳<br/>`) + (this.state.nearestStation !== "" &&
 * this.state.nearestStation !== null ?` 【最寄り駅】：`:"")+
 * (this.state.nearestStation !== "" && this.state.nearestStation !== null ?
 * this.state.stations.find((v) => (v.code === this.state.nearestStation)).name :
 * '') + `<br/> 【日本 語】：`+ (this.state.japaneaseConversationLevel !== "" ?
 * this.state.japaneaseConversationLevels.find((v) => (v.code ===
 * this.state.japaneaseConversationLevel)).name : '') + `<br/> 【英 語】：`+
 * (this.state.englishConversationLevel !== "" ?
 * this.state.englishConversationLevels.find((v) => (v.code ===
 * this.state.englishConversationLevel)).name : '') + `<br/> 【業務年数】：`+
 * this.state.yearsOfExperience + `年<br/> 【対応工程】：`+ this.state.siteRoleName + `<br/>
 * 【得意言語】：`+ this.state.developLanguage + `<br/> 【単 価】：`+ this.state.unitPrice +
 * `万円<br/> 【稼働開始】：2020/09<br/> 【営業状況】：`+ (this.state.salesProgressCode !== "" ?
 * this.state.salesProgresss.find((v) => (v.code ===
 * this.state.salesProgressCode)).name : '') + `<br/> 【備 考】：`+
 * this.state.remark + `<br/> <br/>
 */
		for(let i = 0; i < this.state.selectedCusInfos.length; i++){
			const mailConfirmContont = this.state.selectedCusInfos[i].customerName + `株式会社<br/>
				`+ (this.state.selectedCusInfos[i].purchasingManagers === "" ? "ご担当者" : this.state.selectedCusInfos[i].purchasingManagers) + `様<br/>
				<br/>
				お世話になっております、LYC`+ this.state.loginUserInfo[0].employeeFristName + `です。<br/>
				<br/>`
				+ this.state.greetinTtext +
				`<br/>`
				+ mailText +`<br/>
				以上、よろしくお願いいたします。<br/>
				<br/>
				******************************************************************<br/>
				LYC株式会社 `+ this.state.loginUserInfo[0].employeeFristName + ` ` + this.state.loginUserInfo[0].employeeLastName + `<br/>
				〒:101-0032 東京都千代田区岩本町3-3-3サザンビル3F <br/> 
				http://www.lyc.co.jp/   <br/>
				TEL：03-6908-5796  携帯：`+ this.state.loginUserInfo[0].phoneNo + `(優先）<br/>
				Email：`+ this.state.loginUserInfo[0].companyMail + ` 営業共通：eigyou@lyc.co.jp <br/>
				労働者派遣事業許可番号　派遣許可番号　派13-306371<br/>
				ＩＳＭＳ：MSA-IS-385<br/>
				*****************************************************************`;
						const { resumeName, mailTitle, resumePath, selectedmail } = this.state;
						selectedmail = this.state.selectedCusInfos[i].purchasingManagersMail/* + "," + this.state.selectedCusInfos[i].purchasingManagersMail2*/;
						let selectedMailCC = [this.state.selectedMailCC.length >= 1 ? this.state.selectedMailCC[0].companyMail : '',
						this.state.selectedMailCC.length >= 2 ? this.state.selectedMailCC[1].companyMail:''].filter(function(s) {
							return s;
						});
						console.log(selectedMailCC);
						let mailFrom = this.state.loginUserInfo[0].companyMail;
						axios.post(this.state.serverIP + "sendLettersConfirm/sendMailWithFile", { resumeName, mailTitle, resumePath, mailConfirmContont, selectedmail, selectedMailCC, mailFrom })
							.then(result => {
								/*
								 * this.setState({ mails: result.data, })
								 */
								this.setSelectedCusInfos("済み");
								this.setState({
									sendLetterOverFlag: true,
								})
							})
							.catch(function(error) {
								alert(error);
							});
		}	
	}

	getLoginUserInfo = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
			.then(result => {
				this.setState({
					loginUserInfo: result.data,
				})
			})
			.catch(function(error) {
				alert(error);
			});
	}

	getAllEmpsWithResume = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getAllEmpsWithResume")
			.then(result => {
				this.setState({
					appendEmps: result.data,
				})
			})
			.catch(function(error) {
				alert(error);
			});
	}

	/**
	 * @param now
	 *            当前日期 格式:yyyy-MM
	 * @param addMonths
	 *            传-1 上个月,传1 下个月
	 */
	getNextMonth = (addMonths) => {
		var dd = new Date();
		var m = dd.getMonth() + 1;
		var y = dd.getMonth() + 1 + addMonths > 12 ? (dd.getFullYear() + 1) : dd.getFullYear();
		if (m + addMonths == 0) {
			y = y - 1;
			m = 12;
		} else {
			if (m + addMonths > 12) {
				m = '01';
			} else {
				m = m + 1 < 10 ? '0' + (m + addMonths) : (m + addMonths);
			}
		}
		return y + "/" + m;
	}
	
	fromCodeToNameLanguage = (code) => {
		if (code === "" || code === null) {
			return;
		} else {
			return this.state.developLanguages.find((v) => (v.code === code)).name;
		}
	}

	fromCodeToListLanguage = (code) => {
		if (code === "" || code === null) {
			return '';
		} else {
			return this.state.developLanguages.find((v) => (v.code === code));
		}
	}
	
	openDaiolog = () => {
		this.setState({
			daiologShowFlag: true,
		});
	}

	onAfterSaveCell = (row, cellName, cellValue) => {
		axios.post(this.state.serverIP + "sendLettersConfirm/updateSalesSentence", { employeeNo:row.employeeNo, unitPrice:cellValue })
		.then(result => {
			this.setState({
				unitPrice: cellValue,
			})
		})
		.catch(function(error) {
			alert(error);
		});
	}
	
	getHopeHighestPrice = (result) => {
		var tempEmployeeInfo = this.state.employeeInfo;
		for(let i = 0;i < tempEmployeeInfo.length;i++){
			tempEmployeeInfo[i].hopeHighestPrice = result.data[i].unitPrice
		}

		this.setState({
			employeeInfo:tempEmployeeInfo,
		});
	}
	
	positionNameFormat = (cell) => {
		let positionsTem = this.state.positions;
		for (var i in positionsTem) {
			if (cell === positionsTem[i].code) {
				return positionsTem[i].name;
			}
		}
	}
	
	sendOverFormat = (cell) => {
		if(cell === "○"){
			return <div class='donut'></div>;
		}
		return cell;
	}
	
	searchPersonnalDetail = (employeeNo,hopeHighestPrice,index) => {
		var employeeInfo = this.state.employeeInfo;
		axios.post(this.state.serverIP + "salesSituation/getPersonalSalesInfo", { employeeNo: employeeNo })
			.then(result => {
				if(index != undefined){
					employeeInfo[index-1].hopeHighestPrice = result.data[0].unitPrice;
					employeeInfo[index-1].resumeInfoList = result.data[0].resumeInfoList;
					if(result.data[0].resumeInfoList.length > 0){
						employeeInfo[index-1].resumeInfoName = result.data[0].resumeInfoList[0];
					}else{
						employeeInfo[index-1].resumeInfoName = "";
					}
				}
				if (result.data.length === 0 || result.data[0].age === "") {
					this.setState({
						employeeName: result.data[0].employeeFullName,
						genderStatus: this.state.genders.find((v) => (v.code === result.data[0].genderStatus)).name,
						nationalityName: result.data[0].nationalityName,
						age: publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
							Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) / 31536000000),
						developLanguage: result.data[0].developLanguage,
						yearsOfExperience: result.data[0].yearsOfExperience,
						beginMonth: new Date("2020/09").getTime(),
						salesProgressCode: result.data[0].salesProgressCode === null ? "" : result.data[0].salesProgressCode,
						nearestStation: result.data[0].employeeStatus === null ? "" : result.data[0].nearestStation,
						stationCode: result.data[0].employeeStatus === null ? "" : result.data[0].nearestStation,
						employeeStatus: result.data[0].employeeStatus === null || result.data[0].employeeStatus ===""?"":this.state.employees.find((v) => (v.code === result.data[0].employeeStatus)).name,
						japaneseLevelCode: result.data[0].japaneseLevelCode === null || result.data[0].japaneseLevelCode ===""?"":this.state.japaneseLevels.find((v) => (v.code === result.data[0].japaneseLevelCode)).name,
						englishLevelCode: result.data[0].englishLevelCode === null || result.data[0].englishLevelCode === "" ? "":this.state.englishLevels.find((v) => (v.code === result.data[0].englishLevelCode)).name,
						siteRoleCode: result.data[0].siteRoleCode === null || result.data[0].siteRoleCode === "" ? "":result.data[0].siteRoleCode,
						siteRoleName: result.data[0].siteRoleCode === null || result.data[0].siteRoleCode === "" ? "":result.data[0].siteRoleName,
						initAge: publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
							Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) / 31536000000),
						initNearestStation: result.data[0].nearestStation,
						initJapaneaseConversationLevel: '',
						initEnglishConversationLevel: '',
						initYearsOfExperience: result.data[0].yearsOfExperience,
						initDevelopLanguageCode6: null,
						initDevelopLanguageCode7: null,
						initDevelopLanguageCode8: null,
						initDevelopLanguageCode9: null,
						initDevelopLanguageCode10: null,
						initUnitPrice: '',
						initRemark: '',
						initWellUseLanguagss: [],
						unitPrice: hopeHighestPrice !== null && hopeHighestPrice !== "" && hopeHighestPrice !== undefined ? hopeHighestPrice : result.data[0].unitPrice ,
						employeeInfo : index !== undefined ? employeeInfo : this.state.employeeInfo,
						theMonthOfStartWork: result.data[0].theMonthOfStartWork === undefined || result.data[0].theMonthOfStartWork === null || result.data[0].theMonthOfStartWork === "" ? "":result.data[0].theMonthOfStartWork,
						resumeInfoList: result.data[0].resumeInfoList,
					})
				} else {
					this.setState({
						employeeName: result.data[0].employeeFullName,
						genderStatus: this.state.genders.find((v) => (v.code === result.data[0].genderStatus)).name,
						nationalityName: result.data[0].nationalityName,
						age: result.data[0].age,
						developLanguageCode6: result.data[0].developLanguage1,
						developLanguageCode7: result.data[0].developLanguage2,
						developLanguageCode8: result.data[0].developLanguage3,
						developLanguageCode9: result.data[0].developLanguage4,
						developLanguageCode10: result.data[0].developLanguage5,
						wellUseLanguagss: [this.fromCodeToListLanguage(result.data[0].developLanguage1),
						this.fromCodeToListLanguage(result.data[0].developLanguage2),
						this.fromCodeToListLanguage(result.data[0].developLanguage3),
						this.fromCodeToListLanguage(result.data[0].developLanguage4),
						this.fromCodeToListLanguage(result.data[0].developLanguage5)].filter(function(s) {
							return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
						}),
						// disbleState:
						// this.fromCodeToListLanguage(result.data[0].developLanguage5)
						// === '' ? false : true,
						developLanguage: [this.fromCodeToNameLanguage(result.data[0].developLanguage1),
						this.fromCodeToNameLanguage(result.data[0].developLanguage2),
						this.fromCodeToNameLanguage(result.data[0].developLanguage3),
						this.fromCodeToNameLanguage(result.data[0].developLanguage4),
						this.fromCodeToNameLanguage(result.data[0].developLanguage5)].filter(function(s) {
							return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
						}).join('、'),
						yearsOfExperience: result.data[0].yearsOfExperience,
						japaneaseConversationLevel: result.data[0].japaneaseConversationLevel,
						englishConversationLevel: result.data[0].englishConversationLevel,
						beginMonth: new Date("2020/09").getTime(),
						salesProgressCode: result.data[0].salesProgressCode === null ? "" : result.data[0].salesProgressCode,
						// salesProgressCode: result.data[0].salesProgressCode,
						nearestStation: result.data[0].employeeStatus === null ? "" : result.data[0].nearestStation,
						stationCode: result.data[0].employeeStatus === null ? "" : result.data[0].nearestStation,
						employeeStatus: result.data[0].employeeStatus === null || result.data[0].employeeStatus ===""?"":this.state.employees.find((v) => (v.code === result.data[0].employeeStatus)).name,
						japaneseLevelCode: result.data[0].japaneseLevelCode === null || result.data[0].japaneseLevelCode ===""?"":this.state.japaneseLevels.find((v) => (v.code === result.data[0].japaneseLevelCode)).name,
						englishLevelCode: result.data[0].englishLevelCode === null || result.data[0].englishLevelCode === ""?"":this.state.englishLevels.find((v) => (v.code === result.data[0].englishLevelCode)).name,
						siteRoleCode: result.data[0].siteRoleCode === null || result.data[0].siteRoleCode === "" ? "":result.data[0].siteRoleCode,
						siteRoleName: result.data[0].siteRoleCode === null || result.data[0].siteRoleCode === "" ? "":result.data[0].siteRoleName,
						unitPrice: hopeHighestPrice !== null && hopeHighestPrice !== "" && hopeHighestPrice !== undefined ? hopeHighestPrice : result.data[0].unitPrice ,
						remark1: result.data[0].remark1,
						initAge: result.data[0].age,
						employeeInfo : index !== undefined ? employeeInfo : this.state.employeeInfo,
						initNearestStation: result.data[0].nearestStation,
						initJapaneaseConversationLevel: result.data[0].japaneaseConversationLevel,
						initEnglishConversationLevel: result.data[0].englishConversationLevel,
						initYearsOfExperience: result.data[0].yearsOfExperience,
						initDevelopLanguageCode6: result.data[0].developLanguage1,
						initDevelopLanguageCode7: result.data[0].developLanguage2,
						initDevelopLanguageCode8: result.data[0].developLanguage3,
						initDevelopLanguageCode9: result.data[0].developLanguage4,
						initDevelopLanguageCode10: result.data[0].developLanguage5,
						initUnitPrice: result.data[0].unitPrice,
						initRemark: result.data[0].remark1,
						resumeInfoList: result.data[0].resumeInfoList,
						theMonthOfStartWork: result.data[0].theMonthOfStartWork === null || result.data[0].theMonthOfStartWork === "" ? "":result.data[0].theMonthOfStartWork,
						initWellUseLanguagss: [this.fromCodeToListLanguage(result.data[0].developLanguage1),
						this.fromCodeToListLanguage(result.data[0].developLanguage2),
						this.fromCodeToListLanguage(result.data[0].developLanguage3),
						this.fromCodeToListLanguage(result.data[0].developLanguage4),
						this.fromCodeToListLanguage(result.data[0].developLanguage5)].filter(function(s) {
							return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
						}),
					})
				}
			})
			.catch(function(error) {
				alert(error);
			});
	}

	initPersonnalDetail = () => {
		this.setState({
			employeeName: "empty",
			genderStatus: "",
			nationalityName: "",
			age: "",
			developLanguage: "",
			yearsOfExperience: "",
			beginMonth: "",
			salesProgressCode: "",
			nearestStation: "",
			stationCode: "",
			employeeStatus: "",
			japaneseLevelCode: "",
			englishLevelCode: "",
			siteRoleCode: "",
			siteRoleName:"",
			initAge: "",
			initNearestStation: "",
			initJapaneaseConversationLevel: '',
			initEnglishConversationLevel: '',
			initYearsOfExperience: "",
			initDevelopLanguageCode6: null,
			initDevelopLanguageCode7: null,
			initDevelopLanguageCode8: null,
			initDevelopLanguageCode9: null,
			initDevelopLanguageCode10: null,
			initUnitPrice: '',
			initRemark: '',
			initWellUseLanguagss: [],
		});
	}
	
	searchEmpDetail = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getSalesEmps", { employeeNos: this.state.selectedEmpNos })
			.then(result => {
				this.setState({
					employeeInfo: result.data,
					/* 要員追加機能の新規 20201216 張棟 START */
					// 営業状況確認一覧画面から遷移した後で、要員画面初期化して要員一覧のindex初期化
					EmployeeNameIndex : result.data.length,
					/* 要員追加機能の新規 20201216 張棟 END */
				})
				this.getHopeHighestPrice(result);
			})
			.catch(function(error) {
				alert(error);
			});
		this.searchPersonnalDetail(this.state.selectedEmpNos[0]);
	}

	renderShowsTotal = (start, to, total) => {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

	closeDaiolog = () => {
		this.setState({
			daiologShowFlag: false,
		})
	}

	closeEmpAddDaiolog = () => {
		this.setState({
			empAdddaiologShowFlag: false,
		})
	}

	handleCtmSelect = (row, isSelected, e) => {
		this.setState({
			selectedCustomerName: isSelected ? row.customerName : '',
			selectedPurchasingManagers: isSelected ? row.purchasingManagers : '',
			// selectedSalesPerson: isSelected ? row.customerName : '',
			selectedmail: isSelected ? row.purchasingManagersMail : '',
		})
		if (isSelected) {
			this.setState({
           	 	selectRow1Flag: true,
			})
		}else{
			this.setState({
           	 	selectRow1Flag: false,
			})
		}
	}

	openEmpAddDaiolog = (flag) => {
		this.setState({
			empAdddaiologShowFlag: true,
			popupFlag: flag,
		});
	}
	
	handleEmpSelect = (row, isSelected, e) => {
		this.setState({
			selectedEmps: row,
		})

		this.searchPersonnalDetail(row.employeeNo);
	}
	/* 要員追加機能の新規 20201216 張棟 START */
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState({
           	 	selectedColumnId: row.index,
           	 	employeeFlag: true,
           	 	selectRowFlag: true,
           	 	resumeName: this.state.employeeInfo[row.index - 1].resumeInfoName,
			})
			$("#bookButton").attr("disabled",false);
			$("#deleteButton").attr("disabled",false);
		} else {
			$("#deleteButton").attr("disabled",true);
			$("#bookButton").attr("disabled",true);
			this.setState({
           	 	selectRowFlag: false,
			})
		}
		if (row.employeeNo !== "" && row.employeeNo !== null) {
			this.searchPersonnalDetail(row.employeeNo,row.hopeHighestPrice);
		}
	};
	formatEmpStatus = (cell, row, enumObject, index) => {
		return cell !== null && cell!== ""?this.state.employees.find((v) => (v.code === cell)).name:"";
	}
	/* 要員追加機能の新規 20201216 張棟 END */
	// formatResume(cell, row, enumObject, index) {
	// return (<div>
	// <Form.Control as="select" size="sm"
	// onChange={this.resumeValueChange.bind(this, row)}
	// name="resumeName"
	// autoComplete="off">
	// <option ></option>
	//
	// <option >{row.resumeInfo1 == null ? "" :
	// row.resumeInfo1.split('/')[4]}</option>
	// <option >{row.resumeInfo2 == null ? "" :
	// row.resumeInfo2.split('/')[4]}</option>
	// </Form.Control>
	// </div>);
	// }
	
	formatResumeInfoList(cell, row, enumObject, index) {
		if(cell === "" || cell === null || cell === undefined){
			return cell;
		}
		else{
			return (<div>
			<Form.Control as="select" size="sm"
						  onChange={this.resumeInfoListChange.bind(this, row)}
						  name="resumeInfoList"
						  autoComplete="off">
				{cell.map(data =>
					<option value={data}>
					{data.split("_").length > 1 ? data.split("_")[data.split("_").length - 1] : data}
					</option>
				)}
			</Form.Control>
		</div>);
		}
	}
	
	/* 要員追加機能の新規 20201216 張棟 START */
	// 要員名前処理
	formatEmployeeName(cell, row, enumObject, index) {
		var flg = true;
		var name = cell;

		for (var v=0 ; v< this.state.employeeInfo.length; v++) {
			if (this.state.employeeInfo[v].employeeName === cell) {
				flg = this.state.employeeInfo[v].initFlg === undefined ? true : this.state.employeeInfo[v].initFlg;
				name = this.state.employeeInfo[v].employeeName;
			}
		}

		if (flg) {
			return name;
		} else {
			if (cell === "" || cell === null) {
				return (<div>
					<Form.Control as="select" size="sm"
								  onChange={this.employeeNameChange.bind(this, row)}
								  name="employeeName"
								  autoComplete="off">
							<option value=""></option>
						{this.state.allEmployeeName.map(data =>

							<option value={data}>
							{data}
							</option>
						)}
					</Form.Control>
				</div>);
			} else {
				return (<div>
					<Form.Control as="select" size="sm"
								  onChange={this.employeeNameChange.bind(this, row)}
								  name="employeeName"
								  value={cell}
								  autoComplete="off">
						<option value=""></option>
						{this.state.allEmployeeName.map(data =>

							<option value={data}>
								{data}
							</option>
						)}
					</Form.Control>
				</div>);
			}
		}
	}
	
	resumeInfoListChange = (row, event) => {
		var employeeInfo = this.state.employeeInfo;
		employeeInfo[row.index - 1].resumeInfoName = event.target.value;
		this.setState({
			employeeInfo: employeeInfo,
		})
	}
	
	// 要員名前触発されるイベント
	employeeNameChange = (row, event) => {
		if(event.target.value !== ""){
			var employeeInfo = this.state.employeeInfo;
			var employeeNoTemp;

			for (let i=0; i < this.state.employeeInfo.length; i++) {
				if (row.index !== this.state.employeeInfo[i].index
				&& event.target.value === this.state.employeeInfo[i].employeeName) {
					this.setState({"myToastShow": true,
						type: false,
						errorsMessageShow: false,
						message: "同じ名前は選択されている。",
						sendLetterButtonDisFlag:true});
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					// window.location.reload();
					return;
				}
			}
			employeeInfo[row.index-1].employeeName  = event.target.value;
// this.setState({
// [event.target.name]: event.target.value,
// employeeInfo: employeeInfo,
// })
			for (var i =0 ;i<this.state.allEmployeeNameInfo.length;i++) {
				if (event.target.value === this.state.allEmployeeNameInfo[i].employeeName) {
					employeeNoTemp = this.state.allEmployeeNameInfo[i].employeeNo;
					employeeInfo[row.index-1].employeeNo = employeeNoTemp;
					if (employeeNoTemp.match("LYC")) {
						// 社員
						employeeInfo[row.index-1].employeeStatus = "0";
						this.setState({
							employeeInfo : employeeInfo,
							employeeFlag: true,
						});
					} else if (employeeNoTemp.match("BP")){
						// 協力
						employeeInfo[row.index-1].employeeStatus = "1";
						this.setState({
							employeeInfo : employeeInfo,
							employeeFlag: true,
						});
					}
					break;
				}
			}
			this.searchPersonnalDetail(employeeNoTemp,employeeInfo[row.index-1].hopeHighestPrice,row.index);
			var disabledFlg = true;
			for (var j=0; j<this.state.employeeInfo.length; j++) {
				if (this.state.employeeInfo[j].employeeName === ""|| this.state.employeeInfo[j].employeeName === null) {
					disabledFlg = false;
					break;
				}
			}
			if (disabledFlg) {
				// 全ての要員明細の名前を入力した後で、追加ボタンが活性になる
				$("#addButton").attr("disabled",false);
			}
			if(this.state.mailTitle !== ""){
				this.setState({
					sendLetterButtonDisFlag: false,
				})
			}
		}
		else{
			
		}
	};
	/* 要員追加機能の新規 20201216 張棟 END */
	
	resumeValueChange = (row, event) => {
		this.setState({
			[event.target.name]: event.target.value,
		})
		if (event.target.selectedIndex === 1) {
			this.setState({
				resumePath: row.resumeInfo1,
			})
		} else if (event.target.selectedIndex === 2) {
			this.setState({
				resumePath: row.resumeInfo2,
			})
		}
	};
	
	// 要員追加機能の新規 20201216 張棟 START
	/**
	 * 行追加処理
	 */
	insertRow = () => {
		var employeeInfo= this.state.employeeInfo;
		var employeeInfoModel = {};
		employeeInfoModel["employeeNo"] = "";
		employeeInfoModel["employeeName"] = "";
		employeeInfoModel["employeeStatus"] = "";
		employeeInfoModel["hopeHighestPrice"] = "";
		employeeInfoModel["resumeInfo1"] = "";
		employeeInfoModel["resumeInfo1Name"] = "";
		employeeInfoModel["resumeInfo2"] = "";
		employeeInfoModel["resumeInfo2Name"] = "";
		employeeInfoModel["resumeInfoName"] = "";
		employeeInfoModel["initFlg"] = false;
		employeeInfoModel["index"] = ++this.state.EmployeeNameIndex;
		employeeInfo.push(employeeInfoModel);
		var currentPage = Math.ceil(employeeInfo.length / 5);
		this.setState({
			employeeInfo: employeeInfo,
			currentPage: currentPage,
		})
		this.refs.table.setState({
			selectedRowKeys: []
		});
		// 追加した後で、追加ボタンが非活性になる
		$("#addButton").attr("disabled",true);
		// for (let m = 0; m < this.state.employeeInfo.length; m++) {
		// for (let i = 0; i< this.state.allEmployeeName.length; i++) {
		// if (this.state.allEmployeeName[i] ===
		// this.state.employeeInfo[m].employeeName) {
		// this.state.allEmployeeName.splice(i,1);
		// break;
		// }
		// }
		// }
	}
	/**
	 * 行削除処理
	 */

	// 削除前のデフォルトお知らせの削除
	customConfirm(next, dropRowKeys) {
		const dropRowKeysStr = dropRowKeys.join(',');
		next();
	}
	deleteRow　= () => {
		var deleteFlg = window.confirm("削除していただきますか？");
		if (deleteFlg) {
			$("#delectBtn").click();
		}
	}

	// 隠した削除ボタン
	createCustomDeleteButton = (onClick) => {
		return (
			<Button variant="info" id="delectBtn" hidden onClick={onClick} >删除</Button>
		);
	}

	// 隠した削除ボタンの実装
	onDeleteRow = (row) => {
		var id = this.state.selectedColumnId;
		var employeeInfoList = this.state.employeeInfo;
		for (let i = employeeInfoList.length -1; i>=0; i--) {
			if (employeeInfoList[i].index === id) {
				employeeInfoList.splice(i,1);
			}
		}
		if (employeeInfoList.length !== 0) {
			for (let i = employeeInfoList.length - 1; i >= 0; i--) {
				employeeInfoList[i].index = (i + 1);
			}
		}
		var currentPage = Math.ceil(employeeInfoList.length / 5);
		this.setState({
			currentPage: currentPage,
			employeeInfo: employeeInfoList,
			selectRowFlag: false,
			// rowNo: '',
			// customerDepartmentNameValue: '',
			// customerDepartmentName: '',
		})
		// TODO 要員を削除した後で、営業文章の表示について
		// this.searchPersonnalDetail("");
		$("#deleteButton").attr("disabled",true);
		$("#bookButton").attr("disabled",true);
		this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "削除成功" });
		setTimeout(() => this.setState({ "myToastShow": false }), 3000);

		var disabledFlg = true;
		for (var j=0; j<this.state.employeeInfo.length; j++) {
			if (this.state.employeeInfo[j].employeeName === ""|| this.state.employeeInfo[j].employeeName === null) {
				disabledFlg = false;
				break;
			}
		}
		if (this.state.employeeInfo.length === 0||disabledFlg) {
			// 全ての要員明細の名前を入力した後で、追加ボタンが活性になる
			$("#addButton").attr("disabled",false);
		}

		if (this.state.employeeInfo.length === 0 || this.state.employeeInfo[0].employeeNo === "") {
			this.setState({
				EmployeeNameIndex: 0,
				employeeFlag: false,
				sendLetterButtonDisFlag : true,
			});
			this.initPersonnalDetail();
		} else {
			this.searchPersonnalDetail(this.state.employeeInfo[0].employeeNo);
		}

		--this.state.EmployeeNameIndex;
	};

	/**
	 * ファイルを処理
	 * 
	 * @param {*}
	 *            event
	 * @param {*}
	 *            name
	 */
	addFile = (event, name) => {
		$("#" + name).click();
	}

	changeFile = (event, name) => {
		var filePath = event.target.value;
		var arr = filePath.split('\\');
		var fileName = arr[arr.length - 1];
		if (name === "resumeInfo1") {
			var employeeInfo1 = this.state.employeeInfo;
			
			var resumeInfoListTemp = employeeInfo1[this.state.selectedColumnId-1].resumeInfoList;
			if(!(fileName === null || fileName === "" || fileName === undefined)){
				resumeInfoListTemp.push(fileName);
			}
			
			employeeInfo1[this.state.selectedColumnId-1].resumeInfo1 = filePath;
			employeeInfo1[this.state.selectedColumnId-1].resumeInfoList = resumeInfoListTemp;
			employeeInfo1[this.state.selectedColumnId-1].resumeInfo1Name = fileName;
			this.setState({
				employeeInfo: employeeInfo1,
				resumeInfo1: "",
				resumeInfo1Name: fileName,
				resumePath: filePath,
				resumeName: fileName,
				selectedColumnId: this.state.selectedColumnId,
			})
		} else if (name === "image") {
			if (publicUtils.nullToEmpty($('#image').get(0).files[0]) === "") {
				return
			};
			var reader = new FileReader();
			reader.readAsDataURL(publicUtils.nullToEmpty($('#image').get(0).files[0]));
			reader.onload = function() {
				document.getElementById("imageId").src = reader.result;
			};
		}
	}

	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	
	titleValueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
		if(event.target.value !== ""){
			this.setState({
				sendLetterButtonDisFlag : false,
			})
		}else{
			this.setState({
				sendLetterButtonDisFlag : true,
			})
		}
	}
	
	titleChange = () => {
		this.setState({
			titleFlag: !this.state.titleFlag,
			mailTitle: "",
			sendLetterButtonDisFlag: true,
		})
	}

	// 要員追加機能の新規 20201216 張棟 END
	/**
	 * 戻るボタン
	 */
	back = () => {
		var path = {};
		path = {
			pathname: this.state.backPage,
			state: { 
				searchFlag: this.state.searchFlag, 
				sendValue: this.state.sendValue ,
				salesPersons: this.state.selectedEmpNos,
				// targetCusInfos: this.state.selectedCusInfos,
				backbackPage: this.state.backbackPage,
				projectNo: this.state.projectNo,
			},
		}
		this.props.history.push(path);
	}
	render() {
		const {backPage, errorsMessageValue, message, type, resumeInfo1, resumeInfo1Name} = this.state;
		
		// ページネーション
		const options = {
			onPageChange : page => {
				this.setState({ currentPage: page});
			},
			page: this.state.currentPage,
			noDataText: (<i className="" style={{ 'fontSize': '24px' }}>データなし</i>),
			defaultSortOrder: 'dsc',
			sizePerPage: 5,
			pageStartIndex: 1,
			paginationSize: 2,
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			hideSizePerPage: true,
			paginationShowsTotal: this.renderShowsTotal,
			//
			expandRowBgColor: 'rgb(165, 165, 165)',
			deleteBtn: this.createCustomDeleteButton,
			onDeleteRow: this.onDeleteRow,
			handleConfirmDeleteRow: this.customConfirm
			//
		};
		
		// 要員一覧表の入力框
		const cellEdit = {
				mode: 'click',
				blurToSave: true,
				afterSaveCell: this.onAfterSaveCell,
			};


		const selectRow = {
			mode: "radio",
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			// clickToExpand: true,
			// onSelect: this.handleEmpSelect,
			onSelect: this.handleRowSelect,
			clickToSelectAndEditCell: true,
		};

		const selectRow1 = {
			mode: "radio",
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			onSelect: this.handleCtmSelect,
		};
		const mailContent = `【名　　前】：` + this.state.employeeName + `　` + this.state.nationalityName + `　` + this.state.genderStatus + `
【所　　属】：`+ this.state.employeeStatus + 
(this.state.age !== null && this.state.age !== ""?`
【年　　齢】：`:"")+ (this.state.age !== null && this.state.age !== ""? this.state.age : "") + (this.state.age !== null && this.state.age !== ""?`歳`:"") +
(this.state.nearestStation !== "" && this.state.nearestStation !== null?`
【最寄り駅】：`:"")
+ (this.state.nearestStation !== "" && this.state.nearestStation !== null? this.state.stations.find((v) => (v.code === this.state.nearestStation)).name : '') + 
(this.state.japaneaseConversationLevel !== "" && this.state.japaneaseConversationLevel !== null ?`
【日本　語】：`:"")+ (this.state.japaneaseConversationLevel !== "" && this.state.japaneaseConversationLevel !== null ? this.state.japaneaseConversationLevels.find((v) => (v.code === this.state.japaneaseConversationLevel)).name : '')
+(this.state.englishConversationLevel !== "" && this.state.englishConversationLevel !== null?`
【英　　語】：`:"")+ (this.state.englishConversationLevel !== "" && this.state.englishConversationLevel !== null? this.state.englishConversationLevels.find((v) => (v.code === this.state.englishConversationLevel)).name : '') +
(this.state.yearsOfExperience !== null && this.state.yearsOfExperience !== "" ? `
【業務年数】：`:"")+ (this.state.yearsOfExperience !== null && this.state.yearsOfExperience !== "" ? this.state.yearsOfExperience:"") + (this.state.yearsOfExperience !== null && this.state.yearsOfExperience !== "" ?`年`:"")+
			(this.state.siteRoleName !=="" && this.state.siteRoleName !== null ? `
【対応工程】：`:"")+ (this.state.siteRoleName !=="" && this.state.siteRoleName !==null ? this.state.siteRoleName:"") +
			(this.state.developLanguage !=="" && this.state.developLanguage !==null ?`
【得意言語】：`:"")+ (this.state.developLanguage !=="" && this.state.developLanguage !==null ?this.state.developLanguage:"") +
			(this.state.unitPrice !== "" && this.state.unitPrice !== null? `
【単　　価】：`:"")+ (this.state.unitPrice !== "" && this.state.unitPrice !== null?this.state.unitPrice:"") +
			(this.state.unitPrice !== "" && this.state.unitPrice !== null? `万円`:"") + (this.state.theMonthOfStartWork !== "" && this.state.theMonthOfStartWork !== null ? `
【稼働開始】：`:"") + (this.state.theMonthOfStartWork !== "" && this.state.theMonthOfStartWork !== null ? this.state.theMonthOfStartWork:"") + (this.state.salesProgressCode === "" || this.state.salesProgressCode === null || this.state.salesProgressCode === undefined ? "":`
【営業状況】：`)+ (this.state.salesProgressCode !== "" ? this.state.salesProgresss.find((v) => (v.code === this.state.salesProgressCode)).name : '') +
(this.state.remark1 !== "" && this.state.remark1 !== null?`
【備　　考】：`:"")+ (this.state.remark1 !== "" && this.state.remark1 !== null ? this.state.remark1 : "");
		return (
			<div>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeDaiolog} show={this.state.daiologShowFlag} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton><Col className="text-center">
						<h2>メール内容確認</h2>
					</Col></Modal.Header>
					<Modal.Body >
						<MailConfirm personalInfo={this} />
					</Modal.Body>
				</Modal>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeEmpAddDaiolog} show={this.state.empAdddaiologShowFlag} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton><Col className="text-center">
						<h2>履歴書選択</h2>
					</Col></Modal.Header>
					<Modal.Body>
						<SalesEmpAddPopup personalInfo={this} />
					</Modal.Body>
				</Modal>
				<Row inline="true">
					<Col className="text-center">
						<h2>要員送信確認</h2>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
				<Row style={{ padding: "10px" }}>
					<Col sm={1}></Col>
					<Col sm={3}>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm" onClick={this.titleChange}>タイトル</InputGroup.Text>
							</InputGroup.Prepend>
							{this.state.titleFlag ? 
							<FormControl
		                            value={this.state.mailTitle}
		                            name="mailTitle"
		                            onChange={this.valueChange}
								></FormControl>
							:
							<Form.Control as="select" size="sm" onChange={this.titleValueChange} name="mailTitle" >
								<option></option>
								<option>{this.getNextMonth(1)}の要員提案に関して</option>
								<option>即日要員提案に関して</option>
								<option>{this.getNextMonth(2)}の要員提案に関して</option>
							</Form.Control>
							}
						</InputGroup>
					</Col>
					<Col sm={5}>
						<InputGroup size="sm" className="mb-3">
							{/*
								 * <InputGroup.Prepend> <InputGroup.Text
								 * id="inputGroup-sizing-sm">共用CCメール</InputGroup.Text>
								 * </InputGroup.Prepend>
								 */}
							<Autocomplete
								multiple
								size="small"
								id="tags-standard"
								options={this.state.mails}
								getOptionDisabled={option => this.state.disbleState}
								value={this.state.selectedMailCC}
								getOptionLabel={(option) => option.companyMail ? option.companyMail : ""}
								onChange={(event, values) => this.onTagsChange(event, values)}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="standard"
										/* label="共用CCメール" */
										placeholder="共用CCメール"
										style={{ width: "680px", float: "right" }}
									/>
								)}
							/>
						</InputGroup>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}>
					<Col sm={1}></Col>
					<Col sm={10}>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">挨拶文章</InputGroup.Text>
							</InputGroup.Prepend>
							<textarea ref={(textarea) => this.textArea = textarea} maxLength="100" value = {this.state.greetinTtext}  id="greetinTtext" name="greetinTtext" 
								onChange={this.valueChange}
								style={{ height: '60px', width: '84%', resize: 'none', overflow: 'hidden' }}
							/>
						</InputGroup>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={1}></Col><Col sm={1}>要員一覧</Col>
					<Col sm={4}>
						<div style={{ "float": "right" }}>
							<Button size="sm" variant="info" id="bookButton" name="bookButton" onClick={(event) => this.addFile(event, 'resumeInfo1')}><FontAwesomeIcon icon={faFile} />履歴書</Button>{" "}
							<Button size="sm" variant="info" id="addButton" name="addButton" onClick={this.insertRow}><FontAwesomeIcon icon={faUserPlus} />要員追加</Button>{" "}
							<Button size="sm" variant="info" id="deleteButton" name="deleteButton" onClick={this.deleteRow}><FontAwesomeIcon icon={faTrash} />要員削除</Button>{" "}
						</div>
					</Col>
					<Col sm={2}>{'　'}営業文章</Col></Row>
				<Row>
					<Col sm={1}></Col>
					<Col sm={5}>
						<BootstrapTable
							options={options}
							insertRow={true}
							deleteRow data={this.state.employeeInfo}
							selectRow={selectRow}
							ref='table'
							pagination={true}
							cellEdit={cellEdit}
							data={this.state.employeeInfo}
							// className={"bg-white text-dark"}
							trClassName="customClass"
							headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='12%'　tdStyle={{ padding: '.45em'}} dataField='employeeName' dataFormat={this.formatEmployeeName.bind(this)} autoValue editable={false} isKey>名前</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='employeeStatus' dataFormat={this.formatEmpStatus.bind(this)} editable={false} >所属</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='hopeHighestPrice' editColumnClassName="dutyRegistration-DataTableEditingCell">単価</TableHeaderColumn>
							{/*
								 * <TableHeaderColumn dataField='resumeInfo1'
								 * hidden={true}>履歴書1</TableHeaderColumn>
								 */}
							{/*
								 * <TableHeaderColumn dataField='resumeInfo2'
								 * hidden={true}>履歴書2</TableHeaderColumn>
								 */}
							<TableHeaderColumn dataField='employeeNo' hidden={true}></TableHeaderColumn>
							<TableHeaderColumn placeholder="履歴書名"  width='19%' dataField='resumeInfoList' value={resumeInfo1} dataFormat={this.formatResumeInfoList.bind(this)} editable={false} onChange={this.valueChange}>履歴書</TableHeaderColumn>
							<TableHeaderColumn dataField='resumeInfoName' hidden={true}>resumeInfoName</TableHeaderColumn>
						</BootstrapTable>
							<Form.File id="resumeInfo1" hidden={true} data-browse="添付" value={resumeInfo1} custom onChange={(event) => this.changeFile(event, 'resumeInfo1')} />
					</Col>

					<Col sm={4}>
						<textarea ref={(textarea) => this.textArea = textarea} disabled
							style={{ height: '340px', width: '100%', resize: 'none', overflow: 'hidden' }}
							// value={mailContent}
							value={this.state.employeeName === "empty" || this.state.employeeName === ""? "要員追加してください。":(this.state.employeeFlag? mailContent:"要員追加してください。") }
						/>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}>
				
				</Col></Row>
				<Row>
					<Col sm={1}></Col>
					<Col sm={3}>
					<Button size="sm"
						hidden={backPage === "" ? true : false}
						variant="info"
						onClick={this.back.bind(this)}
					>
						<FontAwesomeIcon icon={faLevelUpAlt} />戻る
                    </Button>{" "}
                    </Col>
					<Col sm={6}>
						<div style={{ "float": "right" }}>
							<Button onClick={this.openDaiolog} size="sm" variant="info" name="clickButton" disabled={this.state.selectRowFlag && this.state.selectRow1Flag ? false : true}><FontAwesomeIcon icon={faGlasses} />メール確認</Button>{" "}
							<Button onClick={this.beforeSendMailWithFile} size="sm" variant="info" disabled={this.state.mailTitle === "" || this.state.sendLetterOverFlag ? true : false}><FontAwesomeIcon icon={faEnvelope} /> {"送信"}</Button></div>
					</Col>
				</Row>
				<Row>
					<Col sm={1}></Col>
					<Col sm={9}>
						<BootstrapTable
							options={options}
							selectRow={selectRow1}
							ref='table1'
							data={this.state.selectedCusInfos}
							pagination={true}
							trClassName="customClass"
							headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='8%' dataField='rowNo' editable={false} isKey>番号</TableHeaderColumn>
							<TableHeaderColumn width='15%' dataField='customerName' dataAlign='center' autoValue editable={false}>お客様名</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='purchasingManagers' editable={false}>担当者</TableHeaderColumn>
							<TableHeaderColumn width='13%' dataField='positionCode' dataFormat={this.positionNameFormat} editable={false}>職位</TableHeaderColumn>
							<TableHeaderColumn width='25%' dataField='purchasingManagersMail' editable={false}>メール</TableHeaderColumn>
							{/*<TableHeaderColumn width='8%' dataField='purchasingManagers2' editable={false}>担当者</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='positionCode2' dataFormat={this.positionNameFormat} editable={false}>職位</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagersMail2' editable={false}>メール</TableHeaderColumn>*/}
							<TableHeaderColumn width='17%' dataField='purchasingManagersOthers' editable={false}>追加者</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='sendOver' dataFormat={this.sendOverFormat} editable={false}>送信状況</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
			</div>
		);
	}
}
export default sendLettersConfirm;