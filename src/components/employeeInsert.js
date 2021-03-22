/* 
社員を登録
 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal, Image } from 'react-bootstrap';
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
import { faSave, faUndo, faFile, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import MyToast from './myToast';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';

axios.defaults.withCredentials = true;
class employeeInsert extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.valueChange = this.valueChange.bind(this);
		this.insertEmployee = this.insertEmployee.bind(this);// 登録
		this.employeeStatusChange = this.employeeStatusChange.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
	}

	/**
	 * 初期化
	 */
	initialState = {
		showBankInfoModalFlag: false,// 口座情報画面フラグ
		showpasswordSetModalFlag: false,// PW設定
		showBpInfoModalFlag: false,// bp情報
		intoCompanyYearAndMonthDisabled: false,// 入社年月の活性フラグ
		retirementYearAndMonthDisabled: false,// 退職年月の活性フラグ
		residenceTimeDisabled: false,// 在留期間の活性フラグ
		image:"https://images.669pic.com/element_pic/54/25/82/94/d2825498dd97a2594c35d633e8454d19.jpg_w700wb",
		myToastShow: false,
		errorsMessageShow: false,
		accountInfo: null,// 口座情報のデータ
		bpInfoModel: null,// pb情報
		developLanguage1: '',
		developLanguage2: '',
		developLanguage3: '',
		developLanguage4: '',
		developLanguage5: '',
		stationCode: '',
		employeeStatus: "0",
		authorityCode: '1',
		genderStatuss: store.getState().dropDown[0],
		intoCompanyCodes: store.getState().dropDown[1],
		employeeFormCodes: store.getState().dropDown[2],
		siteMaster: store.getState().dropDown[3],
		employeeStatusS: store.getState().dropDown[4].slice(1),
		japaneaseLevelCodes: store.getState().dropDown[5],
		residenceCodes: store.getState().dropDown[6],
		nationalityCodes: store.getState().dropDown[7],
		developLanguageMaster: store.getState().dropDown[8].slice(1),
		employeeInfo: store.getState().dropDown[9].slice(1),
		occupationCodes: store.getState().dropDown[10],
		departmentCodes: store.getState().dropDown[11],
		authorityCodes: store.getState().dropDown[12].slice(1),
		englishLeveCodes: store.getState().dropDown[13],
		station: store.getState().dropDown[14].slice(1),
		customer: store.getState().dropDown[15].slice(1),
		qualification: store.getState().dropDown[54],
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],// 劉林涛テスト
	};
	/**
	 * リセット
	 */
	resetBook = () => {
		window.location.href = window.location.href
	};
	/**
	 * 登録
	 */
	insertEmployee = (event) => {
		event.preventDefault();
		const formData = new FormData()
		let obj = document.getElementById("imageId");
		let imgSrc = obj.getAttribute("src");
		const emp = {
			employeeStatus: this.state.employeeStatus,// 社員区分
			employeeNo: this.state.employeeNo,// 社員番号
			bpEmployeeNo: this.state.employeeNo,// 社員番号
			employeeFristName: this.state.employeeFristName,// 社員氏
			employeeLastName: this.state.employeeLastName,// 社員名
			furigana1: publicUtils.nullToEmpty(this.state.furigana1),// カタカナ
			furigana2: publicUtils.nullToEmpty(this.state.furigana2),// カタカナ
			alphabetName1: publicUtils.nullToEmpty(this.state.alphabetName1) ,
			alphabetName2:  publicUtils.nullToEmpty(this.state.alphabetName2) ,
			alphabetName3:  publicUtils.nullToEmpty(this.state.alphabetName3) ,
			birthday: publicUtils.formateDate(this.state.birthday, true),// 年齢
			japaneseCalendar: publicUtils.nullToEmpty(this.state.japaneseCalendar),// 和暦
			genderStatus: publicUtils.nullToEmpty(this.state.genderStatus),// 性別
			intoCompanyCode: publicUtils.nullToEmpty(this.state.intoCompanyCode),// 入社区分
			employeeFormCode: publicUtils.nullToEmpty(this.state.employeeFormCode),// 社員形式
			occupationCode: publicUtils.nullToEmpty(this.state.occupationCode),// 職種
			departmentCode: publicUtils.nullToEmpty(this.state.departmentCode),// 部署
			companyMail: publicUtils.nullToEmpty(this.state.companyMail) === "" ? "" : this.state.companyMail + "@lyc.co.jp",// 社内メール
			graduationUniversity: publicUtils.nullToEmpty(this.state.graduationUniversity),// 卒業学校
			major: publicUtils.nullToEmpty(this.state.major),// 専門
			graduationYearAndMonth: publicUtils.formateDate(this.state.graduationYearAndMonth, false),// 卒業年月
			intoCompanyYearAndMonth: this.state.employeeStatus==='0' ? publicUtils.formateDate(this.state.intoCompanyYearAndMonth, false):' ',// 入社年月
			retirementYearAndMonth: publicUtils.formateDate(this.state.retirementYearAndMonth, false),// 退職年月
			comeToJapanYearAndMonth: publicUtils.formateDate(this.state.comeToJapanYearAndMonth, false),// 来日年月
			nationalityCode: publicUtils.nullToEmpty(this.state.nationalityCode),// 出身地
			birthplace: publicUtils.nullToEmpty(this.state.birthplace),// 出身県
			phoneNo: publicUtils.nullToEmpty(this.state.phoneNo1) + publicUtils.nullToEmpty(this.state.phoneNo2) + publicUtils.nullToEmpty(this.state.phoneNo3),// 携帯電話
			authorityCode: this.state.authorityCode,// 権限
			japaneseLevelCode: publicUtils.nullToEmpty(this.state.japaneseLevelCode),// 日本語
			englishLevelCode: publicUtils.nullToEmpty(this.state.englishLevelCode),// 英語
			certification1: publicUtils.nullToEmpty(this.state.certification1),// 資格1
			certification2: publicUtils.nullToEmpty(this.state.certification2),// 資格2
			siteRoleCode: publicUtils.nullToEmpty(this.state.siteRoleCode),// 役割
			postcode: publicUtils.nullToEmpty(this.state.postcode),// 郵便番号
			firstHalfAddress: publicUtils.nullToEmpty(this.refs.firstHalfAddress.value),
			lastHalfAddress: publicUtils.nullToEmpty(this.state.lastHalfAddress),
			stationCode: publicUtils.labelGetValue($("#stationCode").val(), this.state.station),
			developLanguage1: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage1").val(), this.state.developLanguageMaster)),
			developLanguage2: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage2").val(), this.state.developLanguageMaster)),
			developLanguage3: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage3").val(), this.state.developLanguageMaster)),
			developLanguage4: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage4").val(), this.state.developLanguageMaster)),
			developLanguage5: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage5").val(), this.state.developLanguageMaster)),
			residenceCode: publicUtils.nullToEmpty(this.state.residenceCode),// 在留資格
			residenceCardNo: publicUtils.nullToEmpty(this.state.residenceCardNo),// 在留カード
			stayPeriod: publicUtils.formateDate(this.state.stayPeriod, false),// 在留期間
			contractDeadline: publicUtils.formateDate(this.state.contractDeadline, false),// 契約期限
			employmentInsuranceNo: publicUtils.nullToEmpty(this.state.employmentInsuranceNo),// 雇用保険番号
			myNumber: publicUtils.nullToEmpty(this.state.myNumber),// マイナンバー
			resumeName1: publicUtils.nullToEmpty(this.state.resumeName1),// 履歴書備考1
			resumeName2: publicUtils.nullToEmpty(this.state.resumeName2),// 履歴書備考1
			accountInfo: this.state.accountInfo,// 口座情報
			password: publicUtils.nullToEmpty(this.state.passwordSetInfo),// pw設定
			yearsOfExperience: publicUtils.formateDate(this.state.yearsOfExperience, false),// 経験年数
			bpInfoModel: this.state.bpInfoModel,// pb情報
			picInfo: imgSrc,// pb情報
		};
		formData.append('emp', JSON.stringify(emp))
		formData.append('resumeInfo1', publicUtils.nullToEmpty(this.state.resumeName1) === "" ? null : publicUtils.nullToEmpty($('#resumeInfo1').get(0).files[0]))
		formData.append('resumeInfo2', publicUtils.nullToEmpty(this.state.resumeName2) === "" ? null : publicUtils.nullToEmpty($('#resumeInfo2').get(0).files[0]))
		formData.append('residentCardInfo', publicUtils.nullToEmpty($('#residentCardInfo').get(0).files[0]))
		formData.append('passportInfo', publicUtils.nullToEmpty($('#passportInfo').get(0).files[0]))
		axios.post(this.state.serverIP + "employee/insertEmployee", formData)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "post", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					window.location.reload();
					this.getNO("LYC");// 採番番号
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	// onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	/**
	 * 出身地に変更する時、日本語ラベルとEnglishラベルを変更する
	 */
	changeNationalityCodes = event => {
		let value = event.target.value;
		this.setState({
			nationalityCode: value,
		})
		if (value === '2') {
			this.setState({
				japaneseLevelCode: '5',
			})
		} else if (value === '3' || value === '4' || value === '5') {
			this.setState({
				englishLevelCode: '8',
			})
		}
	}

    /**
	 * 初期化メソッド
	 */
	componentDidMount() {
		const { location } = this.props
		this.setState(
			{
				actionType: location.state.actionType,
				backPage: location.state.backPage,
			}
		);
		this.getNO('LYC');// 採番番号
	}

	/**
	 * 採番番号
	 */
	getNO = (NO) => {
		const promise = Promise.resolve(publicUtils.getNO("employeeNo", NO, "T001Employee", this.state.serverIP));
		promise.then((value) => {
			this.setState(
				{
					employeeNo: value
				}
			);
		});
	};

	/**
	 * 卒業年月
	 */
	state = {
		birthday: new Date(),
		intoCompanyYearAndMonth: new Date(),
		retirementYearAndMonth: new Date(),
		comeToJapanYearAndMonth: new Date(),
		yearsOfExperience: new Date(),
		stayPeriod: new Date(),
		contractDeadline: new Date(),
		graduationYearAndMonth: new Date(),
	};
	/**
	 * 年齢と和暦
	 */
	inactiveBirthday = date => {
		if (date !== undefined && date !== null && date !== "") {
			const promise = Promise.resolve(publicUtils.calApi(date));
			promise.then((data) => {
				this.setState(
					{
						birthday: date,
						japaneseCalendar: data[0][0].text,
						temporary_age: data[1],
					}
				);
			});
		} else {
			this.setState({
				temporary_age: "",
				birthday: "",
				japaneseCalendar: ""
			});
		}
	};

	/**
	 * 漢字をカタカナに変更する
	 */
	katakanaApiChange = event => {
		let name = event.target.name
		let value = event.target.value;
		let promise = Promise.resolve(publicUtils.katakanaApi(value));
		promise.then((date) => {
			switch (name) {
				case 'employeeFristName':
					this.setState({
						furigana1: date,
						employeeFristName: value,
					})
					break;
				case 'employeeLastName':
					this.setState({
						furigana2: date,
						employeeLastName: value,
					})
					break;
				default:
			}
		});
	};
	/**
	 * 卒業年月
	 */
	inactiveGraduationYearAndMonth = date => {
		this.setState(
			{
				graduationYearAndMonth: date,
				temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),
				temporary_yearsOfExperience: (this.state.yearsOfExperience === undefined) ? publicUtils.getFullYearMonth(date, new Date()) : this.state.temporary_yearsOfExperience
			}
		);
	};
	/**
	 * 入社年月
	 */
	inactiveintoCompanyYearAndMonth = (date) => {
		this.setState(
			{
				intoCompanyYearAndMonth: date,
				temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	/**
	 * 退職年月
	 */
	inactiveRetirementYearAndMonth = (date) => {
		this.setState(
			{
				retirementYearAndMonth: date,
				temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),
			}
		);
	};
	/**
	 * 来日年月
	 */
	inactiveComeToJapanYearAndMonth = date => {
		this.setState(
			{
				comeToJapanYearAndMonth: date,
				temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(date, new Date())

			}
		);
	};
	/**
	 * 経験年数
	 */
	inactiveyearsOfExperience = date => {
		this.setState(
			{
				yearsOfExperience: date,
				temporary_yearsOfExperience: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};

	/**
	 * 在留期間
	 */
	inactiveStayPeriod = date => {
		this.setState(
			{
				stayPeriod: date,
				temporary_stayPeriod: publicUtils.getFullYearMonth(new Date(), date)
			}
		);
	};
	
	/**
	 * 契約期限
	 */
	inactiveContractDeadline = date => {
		this.setState(
			{
				contractDeadline: date,
				temporary_contractDeadline: publicUtils.getFullYearMonth(new Date(), date)
			}
		);
	};

	/**
	 * タイプが違う時に、色々な操作をします。
	 */
	employeeStatusChange = event => {
		const value = event.target.value;
		if (value === '1') {
			this.setState({ companyMail: '', authorityCode: "0", employeeStatus: '1', intoCompanyCode: '', departmentCode: '', retirementYearAndMonth: '',occupationCode: '3',intoCompanyYearAndMonth:'',temporary_intoCompanyYearAndMonth:'',employeeFormCode:'',temporary_retirementYearAndMonth:'',retirementYearAndMonthDisabled:false  });
			this.getNO("BP");
		} else {
			this.getNO("LYC");
			this.setState({ employeeStatus: "0" });
		}
	}

	/*
	 * ポップアップ口座情報の取得
	 */
	accountInfoGet = (accountTokuro) => {
		this.setState({
			accountInfo: accountTokuro,
			showBankInfoModalFlag: false,
		})
	}

	/*
	 * ポップアップPW設定の取得
	 */
	passwordSetInfoGet = (passwordSetTokuro) => {
		this.setState({
			passwordSetInfo: passwordSetTokuro,
			showpasswordSetModalFlag: false,
		})
	}
	/*
	 * ポップアップpb情報の取得
	 */
	pbInfoGet = (pbInfoGetTokuro) => {
		this.setState({
			bpInfoModel: pbInfoGetTokuro,
			showBpInfoModalFlag: false,
		})
	}


	/**
	 * 小さい画面の閉め
	 */
	handleHideModal = (kbn) => {
		if (kbn === "bankInfo") {// 口座情報
			this.setState({ showBankInfoModalFlag: false })
		} else if (kbn === "passwordSet") {// PW設定
			this.setState({ showpasswordSetModalFlag: false })
		} else if (kbn === "bpInfoModel") {// pb情報
			this.setState({ showBpInfoModalFlag: false })
		}
	}

	/**
	 * 小さい画面の開き
	 */
	handleShowModal = (kbn) => {
		if (kbn === "bankInfo") {// 口座情報
			this.setState({ showBankInfoModalFlag: true })
		} else if (kbn === "passwordSet") {// PW設定
			this.setState({ showpasswordSetModalFlag: true })
		} else if (kbn === "bpInfoModel") {// pb情報
			this.setState({ showBpInfoModalFlag: true })
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
	
	valueChangeResidenceCodeFormCode = (event) => {
		const value = event.target.value;
		if (value === "5") {
			this.setState({ residenceTimeDisabled: true, stayPeriod: "", residenceCode: event.target.value, temporary_stayPeriod: ""  })
		} else {
			this.setState({ residenceTimeDisabled: false , residenceCode: event.target.value})
		}
	}

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
		} else if (name === "passportInfo") {
			this.setState({
				passportInfo: filePath,
				passportInfoName: fileName,
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

	back = () => {
		let backPage = this.state.backPage
		if (backPage !== null && backPage !== undefined && backPage !== '') {
			return this.props.history.push("/subMenuManager/" + backPage);
		} else {
			return this.props.history.push("/subMenuManager/employeeSearch");
		}
	};
	
	/**
	 * 郵便番号API
	 */
	postApi = event => {
		let value = event.target.value;
		const promise = Promise.resolve(publicUtils.postcodeApi(value));
		promise.then((data) => {
			if (data !== undefined && data !== null && data !== ""){
				this.setState({ firstHalfAddress: data })
			}else{
				this.setState({ firstHalfAddress: "" ,lastHalfAddress:  "" })
			}
		});
	};
	render() {
		const { employeeNo, employeeFristName, employeeLastName, furigana1, furigana2, alphabetName1, alphabetName2, alphabetName3, temporary_age, japaneseCalendar, genderStatus, major, intoCompanyCode,
			employeeFormCode, occupationCode, departmentCode, companyMail, graduationUniversity, nationalityCode, birthplace, phoneNo1, phoneNo2, phoneNo3, authorityCode, japaneseLevelCode, englishLevelCode, residenceCode,
			residenceCardNo, employmentInsuranceNo, myNumber, certification1, certification2, siteRoleCode, postcode, firstHalfAddress, lastHalfAddress, resumeName1, resumeName2, temporary_stayPeriod,temporary_contractDeadline, temporary_yearsOfExperience, temporary_intoCompanyYearAndMonth, temporary_comeToJapanYearAndMonth,
			retirementYearAndMonthDisabled,residenceTimeDisabled, temporary_graduationYearAndMonth, temporary_retirementYearAndMonth, errorsMessageValue, employeeStatus, stationCodeValue, developLanguage1Value, developLanguage2Value, developLanguage3Value, developLanguage4Value, developLanguage5Value,
		} = this.state;
		const { accountInfo, passwordSetInfo, bpInfoModel } = this.state;
		return (
			<div>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={"登録成功！"} type={"success"} />
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
				{/* 開始 */}
				{/* 口座情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bankInfo")} show={this.state.showBankInfoModalFlag} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<BankInfo accountInfo={accountInfo} actionType={this.state.actionType} employeeNo={this.state.employeeNo} accountTokuro={this.accountInfoGet} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} />
					</Modal.Body>
				</Modal>
				{/* PW設定 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "passwordSet")} show={this.state.showpasswordSetModalFlag} dialogClassName="modal-passwordSet">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<PasswordSet passwordSetInfo={passwordSetInfo} actionType={this.state.actionType} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} passwordToroku={this.passwordSetInfoGet} /></Modal.Body>
				</Modal>
				{/* pb情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bpInfoModel")} show={this.state.showBpInfoModalFlag} dialogClassName="modal-pbinfoSet">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<BpInfoModel bpInfoModel={bpInfoModel} customer={this.state.customer} actionType={this.state.actionType} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} pbInfoTokuro={this.pbInfoGet} /></Modal.Body>
				</Modal>
				{/* 終了 */}
				<div style={{ "textAlign": "center" }}>
					<Button size="sm" id="bankInfo" onClick={this.handleShowModal.bind(this, "bankInfo")} disabled={employeeStatus === "0" ? false : true} >口座情報</Button>{' '}
					<Button size="sm" id="passwordSet" onClick={this.handleShowModal.bind(this, "passwordSet")} disabled={employeeStatus === "0" ? false : true}>PW設定</Button>{' '}
					<Button size="sm" id="bpInfoModel" onClick={this.handleShowModal.bind(this, "bpInfoModel")} disabled={employeeStatus === "0" ? true : false}>BP情報</Button>{' '}

				</div>
				<Form onReset={this.resetBook} enctype="multipart/form-data">
					<Form.Group>
						<Form.Label style={{ "color": "#000000" }}>基本情報</Form.Label>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.employeeStatusChange.bind(this)}
										name="employeeStatus" value={employeeStatus}
										autoComplete="off">
										{this.state.employeeStatusS.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text></InputGroup.Prepend>
									<FormControl placeholder="社員氏" value={employeeFristName} autoComplete="off" onChange={this.valueChange} onBlur={this.katakanaApiChange.bind(this)} size="sm" name="employeeFristName" maxlength="6" />{' '}
									<FormControl placeholder="社員名" value={employeeLastName} autoComplete="off" onChange={this.valueChange} onBlur={this.katakanaApiChange.bind(this)} size="sm" name="employeeLastName" maxlength="6" /><font color="red" className="site-mark">★</font>
								</InputGroup>

								<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control as="select" size="sm"
								onChange={this.valueChangeEmployeeFormCode}
								name="employeeFormCode" value={employeeFormCode}
								autoComplete="off" id="Autocompletestyle-employeeInsert-employeeFormCode" disabled={employeeStatus === "0" ? false : true}>
								{this.state.employeeFormCodes.map(date =>
									<option key={date.code} value={date.code}>
										{date.name}
									</option>
								)}
							</Form.Control>
									<InputGroup.Prepend>
										<InputGroup.Text id="twoKanji">性別</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="genderStatus" value={genderStatus}
										autoComplete="off" >
										{this.state.genderStatuss.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<font color="red" className="site-mark">★</font>
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="intoCompanyCode" value={intoCompanyCode}
										autoComplete="off" disabled={employeeStatus === "0" ? false : true}>
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
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text></InputGroup.Prepend>
									<FormControl value={employeeNo} autoComplete="off" disabled onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={alphabetName1} autoComplete="off"  placeholder="first" 
										onChange={this.valueChange} size="sm" name="alphabetName1" />{' '}<font color="red" className="site-mark"> </font>
									<FormControl value={alphabetName2} autoComplete="off" placeholder=" last" 
										onChange={this.valueChange} size="sm" name="alphabetName2" />
									<FormControl value={alphabetName3} autoComplete="off" placeholder=" last" 
										onChange={this.valueChange} size="sm" name="alphabetName3" /><font color="red" className="site-mark">★</font>
								</InputGroup>
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
											id="datePicker"
											className="form-control form-control-sm"
											showYearDropdown
											dateFormat="yyyy/MM/dd"
										/>
									</InputGroup.Append>
									<FormControl id="temporary_age" value={temporary_age} autoComplete="off" onChange={this.valueChange} size="sm" name="temporary_age" disabled />
									<FormControl value="歳" size="sm" disabled />

								</InputGroup>

								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="twoKanji">部署</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="departmentCode" value={departmentCode}
										autoComplete="off" disabled={employeeStatus === "0" ? false : true}>
										{this.state.departmentCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<InputGroup.Prepend>
										<InputGroup.Text id="twoKanji">職種</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="occupationCode" value={occupationCode}
										/*
										 * disabled={occupationCode === "3" ?
										 * true : false}
										 */>
										autoComplete="off" >
										{this.state.occupationCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3" style={{ visibility: "hidden" }}>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm"></InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl
										size="sm" disabled />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">カタカナ</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="カタカナ" value={furigana1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana1" />{' '}
									<FormControl placeholder="カタカナ" value={furigana2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana2" />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="和暦" value={japaneseCalendar} id="japaneseCalendar" autoComplete="off" size="sm" name="japaneseCalendar" disabled />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">メール</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="email" placeholder="メール" value={companyMail} autoComplete="off" disabled={employeeStatus === "0" ? false : true}
										onChange={this.valueChange} size="sm" name="companyMail" /><FormControl value="@lyc.co.jp" size="sm" disabled />
									<font color="red" className="site-mark">★</font>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<Image src={this.state.image} id="imageId" rounded width="180" height="160" onClick={(event) => this.addFile(event, 'image')} />
									</InputGroup.Prepend>
									<Form.File id="image" hidden data-browse="添付" custom onChange={(event) => this.changeFile(event, 'image')} accept="image/png, image/jpeg"></Form.File>
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
									<InputGroup.Append>
										<DatePicker
											selected={this.state.graduationYearAndMonth}
											onChange={this.inactiveGraduationYearAndMonth}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePicker"
											className="form-control form-control-sm"
											autoComplete="off"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_graduationYearAndMonth" value={temporary_graduationYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
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
											disabled={employeeStatus === "0" ? false : true}
											id={employeeStatus === "0" ? "datePicker" : "datePickerReadonlyDefault"}
										/>
									</InputGroup.Append>
									<FormControl name="temporary_intoCompanyYearAndMonth" value={temporary_intoCompanyYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
									<font color="red" className="site-mark">★</font>
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
											id={retirementYearAndMonthDisabled ? "datePicker" : "datePickerReadonlyDefault"}
										/>
									</InputGroup.Append>
									<FormControl name="temporary_retirementYearAndMonth" value={temporary_retirementYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
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
											id="datePicker"
											className="form-control form-control-sm"
											autoComplete="off"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_comeToJapanYearAndMonth" value={temporary_comeToJapanYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">国籍</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.changeNationalityCodes}
										name="nationalityCode" value={nationalityCode}
										autoComplete="off"  >
										{this.state.nationalityCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control><font color="red" style={{ marginLeft: "0px", marginRight: "0px" }}>★</font>
									<FormControl placeholder="県" value={birthplace} autoComplete="off"
										onChange={this.valueChange} size="sm" name="birthplace" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">携帯電話</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={phoneNo1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="phoneNo1" maxlength="3" />—
											<FormControl value={phoneNo2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="phoneNo2" maxlength="4" />—
											<FormControl value={phoneNo3} autoComplete="off"
										onChange={this.valueChange} size="sm" name="phoneNo3" maxlength="4" />
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
										autoComplete="off" id="authorityCodeId" disabled={employeeStatus === "0" ? false : true} >
										{this.state.authorityCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
						<Form.Label style={{ "color": "#000000" }}>スキール情報</Form.Label>
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
									<Form.Control as="select" onChange={this.valueChange} size="sm" name="englishLevelCode" value={englishLevelCode} autoComplete="off" id="englishLeveCodeId" >
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
									<Form.Control as="select" name="certification1" onChange={this.valueChange} value={certification1} autoComplete="off" >
										{this.state.qualification.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<Form.Control as="select" name="certification2" onChange={this.valueChange} value={certification2} autoComplete="off" >
										{this.state.qualification.map(date =>
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
										<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" name="siteRoleCode" onChange={this.valueChange} value={siteRoleCode} autoComplete="off" >
										{this.state.siteMaster.map(date =>
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
										id="developLanguage1"
										name="developLanguage1"
										value={developLanguage1Value}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語1" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage1" />
											</div>
										)}
									/>
									<Autocomplete
										id="developLanguage2"
										name="developLanguage2"
										value={developLanguage2Value}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語2" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage2" />
											</div>
										)}
									/>
									<Autocomplete
										id="developLanguage3"
										name="developLanguage3"
										value={developLanguage4Value}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語3" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage3" />
											</div>
										)}
									/>
									<Autocomplete
										id="developLanguage4"
										name="developLanguage4"
										value={developLanguage4Value}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語4" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage4" />
											</div>
										)}
									/>
									<Autocomplete
										id="developLanguage5"
										name="developLanguage5"
										value={developLanguage5Value}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  開発言語5" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-employeeInsert-developLanguage" id="developLanguage5" />
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
											id="datePicker"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_yearsOfExperience" value={temporary_yearsOfExperience} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
						</Row>
						<Form.Label style={{ "color": "#000000" }}>住所情報</Form.Label>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">郵便番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={postcode} autoComplete="off" onChange={this.valueChange} onBlur=　{this.postApi.bind(this)}  size="sm" name="postcode" id="postcode" maxlength="7" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">都道府県</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={firstHalfAddress} autoComplete="off" onChange={this.valueChange} size="sm" name="firstHalfAddress" id="firstHalfAddress" ref="firstHalfAddress" disabled />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">以降住所</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="以降住所" value={lastHalfAddress} autoComplete="off"
										onChange={this.valueChange} size="sm" name="lastHalfAddress" maxlength="12" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">最寄駅</InputGroup.Text>
									</InputGroup.Prepend>

									<Autocomplete
										id="stationCode"
										name="stationCode"
										value={stationCodeValue}
										options={this.state.station}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="例：秋葉原駅" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfo"
												/>
											</div>
										)}
									/>
								</InputGroup>
							</Col>
						</Row>
						<Form.Label style={{ "color": "#000000" }}>個人関連情報</Form.Label>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留資格 </InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChangeResidenceCodeFormCode}
										name="residenceCode" value={residenceCode}
										autoComplete="off" >
										{this.state.residenceCodes.map(data =>
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
										<InputGroup.Text id="fiveKanji">在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="在留カード" value={residenceCardNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="residenceCardNo" maxlength="12" />
								</InputGroup>
							</Col>
							
							<Col sm={5}>
								<InputGroup size="sm" className="mb-3">
									
									<InputGroup.Prepend>
										<InputGroup.Text id="sixKanji">マイナンバー</InputGroup.Text>
									</InputGroup.Prepend>
										<FormControl placeholder="マイナンバー" value={myNumber} autoComplete="off"
										onChange={this.valueChange} size="sm" name="myNumber" maxlength="12" />
									<font style={{ marginLeft: "15px", marginRight: "15px" }}></font>
									<InputGroup.Prepend>
										<InputGroup.Text id="sixKanji">雇用保険番号</InputGroup.Text>
									</InputGroup.Prepend>
										<FormControl placeholder="雇用保険番号" value={employmentInsuranceNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employmentInsuranceNo" maxlength="12"/>
									<font style={{ marginLeft: "5px", marginRight: "0px" }}></font>
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
										minDate={new Date()}
										disabled={residenceTimeDisabled ? true : false}
										id={residenceTimeDisabled ? "datePickerReadonlyDefault" : "datePicker"}
									/>
								</InputGroup.Append>
								<FormControl name="temporary_stayPeriod" value={temporary_stayPeriod} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
							</InputGroup>
						</Col>
						</Row>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="fiveKanji" >在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									
									<Autocomplete
									getOptionLabel={(option) => option.name}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
										<Button size="sm" className="auto form-control Autocompletestyle-employeeInsert-upload" onClick={(event) => this.addFile(event, 'residentCardInfo')} ><FontAwesomeIcon icon={faFile} /> {this.state.residentCardInfo !== undefined ? "済み" : "添付"}</Button>
										</div>
									)}
								/>
									
									<Form.File id="residentCardInfo" hidden data-browse="添付" value={this.state.residentCardInfo} custom onChange={(event) => this.changeFile(event, 'residentCardInfo')} />
								</InputGroup>
							</Col>
							<Col sm={2}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="fiveKanji">パスポート</InputGroup.Text>
									
								</InputGroup.Prepend>
									
									<Autocomplete
									getOptionLabel={(option) => option.name}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
										<Button size="sm" className="auto form-control Autocompletestyle-employeeInsert-upload" onClick={(event) => this.addFile(event, 'passportInfo')}  ><FontAwesomeIcon icon={faFile} /> {this.state.passportInfo !== undefined ? "済み" : "添付"}</Button>
										</div>
									)}
								/>
									<Form.File id="passportInfo" hidden data-browse="添付" value={this.state.passportInfo} custom onChange={(event) => this.changeFile(event, 'passportInfo')} />
							</InputGroup>
						</Col>
						
							<Col sm={5}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書1</InputGroup.Text>
									</InputGroup.Prepend>
									<Button size="sm" onClick={(event) => this.addFile(event, 'resumeInfo1')} ><FontAwesomeIcon icon={faFile} /> {this.state.resumeInfo1 !== undefined ? "済み" : "添付"}</Button>
									<FormControl placeholder="履歴書1名" value={resumeName1} autoComplete="off" maxlength="30" id="Autocompletestyle-employeeInsert-resumeInfo"
										onChange={this.valueChange} size="sm" name="resumeName1" />
									<Form.File id="resumeInfo1" hidden data-browse="添付" value={this.state.resumeInfo1} custom onChange={(event) => this.changeFile(event, 'resumeInfo1')} />
									<font style={{ marginLeft: "10px", marginRight: "15px" }}></font>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書2</InputGroup.Text>
									</InputGroup.Prepend>
									<Button size="sm" onClick={(event) => this.addFile(event, 'resumeInfo2')} ><FontAwesomeIcon icon={faFile} /> {this.state.resumeInfo2 !== undefined ? "済み" : "添付"}</Button>
									<FormControl placeholder="履歴書2名" value={resumeName2} autoComplete="off"  maxlength="30" id="Autocompletestyle-employeeInsert-resumeInfo"
										onChange={this.valueChange} size="sm" name="resumeName2" />
									<Form.File id="resumeInfo2" hidden data-browse="添付" value={this.state.resumeInfo2} custom onChange={(event) => this.changeFile(event, 'resumeInfo2')} />
								</InputGroup>
							</Col>
							<Col sm={3}>
							<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">契約期限</InputGroup.Text>
							</InputGroup.Prepend>
							<InputGroup.Append>
								<DatePicker
									selected={this.state.contractDeadline}
									onChange={this.inactiveContractDeadline}
									locale="ja"
									dateFormat="yyyy/MM"
									showMonthYearPicker
									showFullMonthYearPicker
									className="form-control form-control-sm"
									autoComplete="off"
									minDate={new Date()}
									id="datePicker"
								/>
							</InputGroup.Append>
							<FormControl name="temporary_contractDeadline" value={temporary_contractDeadline} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
						</InputGroup>
						</Col>
						</Row>
						<div style={{ "textAlign": "center" }}>
							<Button size="sm" variant="info" onClick={this.insertEmployee} type="button" on>
								<FontAwesomeIcon icon={faSave} /> 登録
							</Button>{' '}
							<Button size="sm" variant="info" type="reset">
								<FontAwesomeIcon icon={faUndo} /> リセット
                        </Button>{' '}
							<Button size="sm" variant="info" type="button" onClick={this.back}>
								<FontAwesomeIcon icon={faLevelUpAlt} /> 戻る
                        </Button>
						</div>
					</Form.Group>
				</Form>
			</div>
		);
	}
}

export default employeeInsert;

