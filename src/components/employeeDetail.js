/* 
社員を明細
 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal, Image } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import * as publicUtils from './utils/publicUtils.js';
import BankInfo from './accountInfo';
import BpInfoModel from './bpInfo';
import PasswordSet from './passwordSetManager';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';

axios.defaults.withCredentials = true;
class employeeUpdate extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.handleShowModal = this.handleShowModal.bind(this);
	}
	//初期化
	initialState = {
		showBankInfoModalFlag: false,//口座情報画面フラグ
		showpasswordSetModalFlag: false,//PW設定
		showBpInfoModalFlag: false,//bp情報
		retirementYearAndMonthDisabled: false,//退職年月の活性フラグ
		accountInfo: null,//口座情報のデータ
		bpInfoModel: null,//pb情報
		myToastShow: false,
		errorsMessageShow: false,
		developLanguage1: '',
		developLanguage2: '',
		developLanguage3: '',
		developLanguage4: '',
		developLanguage5: '',
		stationCode: '',
		employeeStatusFlag: true,
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
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛テスト
	};


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
		this.getEmployeeByEmployeeNo(location.state.id);
	}
	getEmployeeByEmployeeNo = employeeNo => {
		const emp = {
			employeeNo: employeeNo
		};
		axios.post(this.state.serverIP + "employee/getEmployeeByEmployeeNo", emp)
			.then(response => response.data)
			.then((data) => {
				this.setState({
					employeeStatus: data.employeeStatus,//社員区分
					employeeNo: data.employeeNo,//社員番号
					bpEmployeeNo: data.employeeNo,//社員番号
					employeeFristName: data.employeeFristName,//社員氏
					employeeLastName: data.employeeLastName,//社員名
					furigana1: data.furigana1,//カタカナ
					furigana2: data.furigana2,//カタカナ
					alphabetName: data.alphabetName,//ローマ字
					birthday: publicUtils.converToLocalTime(data.birthday, true),//年齢
					temporary_age: publicUtils.converToLocalTime(data.birthday, true) === "" ? "" : Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(data.birthday, true).getTime()) / 31536000000),
					japaneseCalendar: data.japaneseCalendar,//和暦
					genderStatus: data.genderStatus,//性別
					intoCompanyCode: data.intoCompanyCode,//入社区分
					employeeFormCode: data.employeeFormCode,//社員形式
					retirementYearAndMonthDisabled: data.employeeFormCode === "3" ? true : false,
					occupationCode: data.occupationCode,//職種
					departmentCode: data.departmentCode,//部署
					companyMail: data.companyMail !== null && data.companyMail !== "" && data.companyMail !== undefined ? data.companyMail.match(/(\S*)@/)[1] : "",//社内メール　data.companyMail.match(/(\S*)@/)[1]
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
					phoneNo1: publicUtils.nullToEmpty(data.phoneNo).slice(0, 3),//携帯電話
					phoneNo2: publicUtils.nullToEmpty(data.phoneNo).slice(3, 7),//携帯電話
					phoneNo3: publicUtils.nullToEmpty(data.phoneNo).slice(7, 11),//携帯電話							
					authorityCode: data.authorityCode,//権限
					japaneseLevelCode: data.japaneseLevelCode,//日本語
					englishLevelCode: data.englishLevelCode,//英語
					certification1: data.certification1,//資格1
					certification2: data.certification2,//資格2
					siteRoleCode: data.siteRoleCode,//役割
					postcode: data.postcode,//郵便番号
					firstHalfAddress: data.firstHalfAddress,
					lastHalfAddress: data.lastHalfAddress,
					stationCode: data.stationCode,
					developLanguage1: data.developLanguage1,//スキール1
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
					residentCardInfoURL: publicUtils.nullToEmpty(data.residentCardInfo),//在留カード
					resumeInfo1URL: publicUtils.nullToEmpty(data.resumeInfo1),//履歴書
					resumeName1: data.resumeName1,//履歴書備考1
					resumeInfo2URL: publicUtils.nullToEmpty(data.resumeInfo2),//履歴書2
					resumeName2: data.resumeName2,//履歴書備考1
					passportInfoURL: publicUtils.nullToEmpty(data.passportInfo),//パスポート
					yearsOfExperience: publicUtils.converToLocalTime(data.yearsOfExperience, false),//経験年数
					temporary_yearsOfExperience: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.yearsOfExperience === "" ? data.graduationYearAndMonth : data.yearsOfExperience, false), new Date()),
					image: data.picInfo

				});
			}
			);
	};


	//年月開始
	//卒業年月
	state = {
		birthday: new Date(),
		intoCompanyYearAndMonth: new Date(),
		retirementYearAndMonth: new Date(),
		comeToJapanYearAndMonth: new Date(),
		yearsOfExperience: new Date(),
		stayPeriod: new Date(),
		graduationYearAndMonth: new Date(),
	};
	//卒業年月
	inactiveGraduationYearAndMonth = date => {
		this.setState(
			{
				graduationYearAndMonth: date,
				temporary_graduationYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),
				temporary_yearsOfExperience: (this.state.yearsOfExperience === undefined) ? publicUtils.getFullYearMonth(date, new Date()) : this.state.temporary_yearsOfExperience
			}
		);
	};
	//入社年月
	inactiveintoCompanyYearAndMonth = (date) => {
		this.setState(
			{
				intoCompanyYearAndMonth: date,
				temporary_intoCompanyYearAndMonth: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	//退職年月
	inactiveRetirementYearAndMonth = (date) => {
		this.setState(
			{
				retirementYearAndMonth: date,
				temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),

			}
		);
	};
	//来日年月
	inactiveComeToJapanYearAndMonth = date => {
		this.setState(
			{
				comeToJapanYearAndMonth: date,
				temporary_comeToJapanYearAndMonth: publicUtils.getFullYearMonth(date, new Date())

			}
		);
	};
	//経験年数
	inactiveyearsOfExperience = date => {
		this.setState(
			{
				yearsOfExperience: date,
				temporary_yearsOfExperience: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	//在留期間
	inactiveStayPeriod = date => {
		this.setState(
			{
				stayPeriod: date,
				temporary_stayPeriod: publicUtils.getFullYearMonth(new Date(), date)
			}
		);
	};
	//年月終了


	/* 
		ポップアップ口座情報の取得
	 */
	accountInfoGet = (accountTokuro) => {
		this.setState({
			accountInfo: accountTokuro,
			showBankInfoModalFlag: false,
		})
	}

	/* 
	ポップアップPW設定の取得
 */
	passwordSetInfoGet = (passwordSetTokuro) => {
		this.setState({
			passwordSetInfo: passwordSetTokuro,
			showpasswordSetModalFlag: false,
		})
	}
	/* 
	ポップアップpb情報の取得
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
		if (kbn === "bankInfo") {//口座情報
			this.setState({ showBankInfoModalFlag: false })
		} else if (kbn === "passwordSet") {//PW設定
			this.setState({ showpasswordSetModalFlag: false })
		} else if (kbn === "bpInfoModel") {//pb情報
			this.setState({ showBpInfoModalFlag: false })
		}
	}

	/**
 * 小さい画面の開き
    */
	handleShowModal = (kbn) => {
		if (kbn === "bankInfo") {//口座情報
			this.setState({ showBankInfoModalFlag: true })
		} else if (kbn === "passwordSet") {//PW設定
			this.setState({ showpasswordSetModalFlag: true })
		} else if (kbn === "bpInfoModel") {//pb情報
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
	back = () => {
		let backPage = this.state.backPage
		if (backPage !== null && backPage !== undefined && backPage !== '') {
			return this.props.history.push("/subMenuManager/" + backPage);
		} else {
			return this.props.history.push("/subMenuManager/employeeInsert");
		}
	};
	render() {
		const { employeeNo, employeeFristName, employeeLastName, furigana1, furigana2, alphabetName, temporary_age, japaneseCalendar, genderStatus, major, intoCompanyCode,
			employeeFormCode, occupationCode, departmentCode, companyMail, graduationUniversity, nationalityCode, birthplace, phoneNo1, phoneNo2, phoneNo3, authorityCode, japaneseLevelCode, englishLevelCode, residenceCode,
			residenceCardNo, employmentInsuranceNo, myNumber, certification1, certification2, siteRoleCode, postcode, firstHalfAddress, lastHalfAddress, resumeName1, resumeName2, temporary_stayPeriod, temporary_yearsOfExperience, temporary_intoCompanyYearAndMonth, temporary_comeToJapanYearAndMonth,
			temporary_graduationYearAndMonth, temporary_retirementYearAndMonth, errorsMessageValue, employeeStatus
		} = this.state;
		const { accountInfo, passwordSetInfo, bpInfoModel, actionType } = this.state;
		return (
			<div>
				<FormControl value={actionType} name="actionType" hidden />
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<Row inline="true">
					<Col className="text-center">
						<h2>社員情報明細</h2>
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
				{/* pb情報*/}
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
					<Button size="sm" id="passwordSet" onClick={this.handleShowModal.bind(this, "passwordSet")} disabled>PW設定</Button>{' '}
					<Button size="sm" id="bpInfoModel" onClick={this.handleShowModal.bind(this, "bpInfoModel")} disabled={employeeStatus === "0" ? true : false}>BP情報</Button>{' '}
				</div>
				<Form onReset={this.resetBook} enctype="multipart/form-data">
					<Form.Group>
						<Form.Label style={{ "color": "#000000" }}>基本情報</Form.Label>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3" >
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										name="employeeStatus" value={employeeStatus}
										disabled>
										{this.state.employeeStatusS.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員名 </InputGroup.Text></InputGroup.Prepend>
									<FormControl value={employeeFristName} size="sm" name="employeeFristName" maxlength="3" disabled />{' '}
									<FormControl value={employeeLastName} size="sm" name="employeeLastName" maxlength="3" disabled /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
								{/*// line*/}
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										name="genderStatus" value={genderStatus}
										disabled>
										{this.state.genderStatuss.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>

								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										name="intoCompanyCode" value={intoCompanyCode}
										disabled>
										{this.state.intoCompanyCodes.map(date =>
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
										disabled>
										{this.state.employeeFormCodes.map(date =>
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
									<FormControl value={employeeNo} disabled size="sm" name="employeeNo" />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">カタカナ</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={furigana1}
										size="sm" name="furigana1" disabled />{' '}
									<FormControl value={furigana2}
										size="sm" name="furigana2" disabled />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">年齢 </InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.birthday}
											onChange={this.inactiveBirthday}
											yearDropdownItemNumber={25}
											scrollableYearDropdown
											maxDate={new Date()}
											id="datePickerReadonlyDefault"
											className="form-control form-control-sm"
											showYearDropdown
											dateFormat="yyyy/MM/dd"
											disabled
										/>
									</InputGroup.Append>
									<FormControl id="temporary_age" value={temporary_age} size="sm" name="temporary_age" disabled />
									<FormControl value="歳" size="sm" disabled />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="twoKanji">部署 </InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										name="departmentCode" value={departmentCode}
										disabled>
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
										name="occupationCode" value={occupationCode}
										disabled>
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
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={alphabetName}
										size="sm" name="alphabetName" disabled />
								</InputGroup>

								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={alphabetName}
										size="sm" name="alphabetName" disabled />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={japaneseCalendar} id="japaneseCalendar" size="sm" name="japaneseCalendar" disabled />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">メール</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="email" value={companyMail} disabled
										size="sm" name="companyMail" /><FormControl value="@lyc.co.jp" size="sm" disabled />
									<font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<Image src={this.state.image} id="imageId" rounded width="180" height="160" />
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
									<FormControl value={graduationUniversity}
										size="sm" name="graduationUniversity" disabled />
									<FormControl value={major}
										size="sm" name="major" disabled />
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
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePickerReadonlyDefault"
											className="form-control form-control-sm"
											disabled
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
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePickerReadonlyDefault"
											className="form-control form-control-sm"
											disabled
										/>
									</InputGroup.Append>
									<FormControl name="temporary_intoCompanyYearAndMonth" value={temporary_intoCompanyYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
									<font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>								</InputGroup>
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
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											className="form-control form-control-sm"
											id="datePickerReadonlyDefault"
											disabled
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
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePickerReadonlyDefault"
											className="form-control form-control-sm"
											disabled
										/>
									</InputGroup.Append>
									<FormControl name="temporary_comeToJapanYearAndMonth" value={temporary_comeToJapanYearAndMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出身地</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										name="nationalityCode" value={nationalityCode}
										disabled>
										{this.state.nationalityCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
									<FormControl value={birthplace} autoComplete="off"
										onChange={this.valueChange} size="sm" name="birthplace" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">携帯電話</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={phoneNo1}
										size="sm" name="phoneNo" disabled />～
											<FormControl value={phoneNo2}
										size="sm" name="phoneNo" disabled />～
											<FormControl value={phoneNo3}
										size="sm" name="phoneNo" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">権限</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										name="authorityCode" value={authorityCode}
										disabled >
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
										size="sm"
										name="japaneseLevelCode" value={japaneseLevelCode}
										disabled >
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
										<InputGroup.Text id="inputGroup-sizing-sm">英語 </InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm" name="englishLevelCode" value={englishLevelCode} disabled >
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

									<Form.Control as="select"　disabled name="certification1" onChange={this.valueChange} value={certification1} autoComplete="off" >
										{this.state.qualification.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<Form.Control as="select"　disabled name="certification2" onChange={this.valueChange} value={certification2} autoComplete="off" >
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
									<Form.Control as="select" name="siteRoleCode" value={siteRoleCode} disabled>
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
									<Autocomplete disabled
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage1)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto" id="developLanguage1"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": "#e9ecef" }} />
											</div>
										)}
									/>
									<Autocomplete disabled
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage2)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto" id="developLanguage2"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": "#e9ecef" }} />
											</div>
										)}
									/>
									<Autocomplete disabled
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage3)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto" id="developLanguage3"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": "#e9ecef" }} />
											</div>
										)}
									/>
									<Autocomplete disabled
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage4)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto" id="developLanguage4"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": "#e9ecef" }} />
											</div>
										)}
									/>
									<Autocomplete disabled
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage5)) || {}}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto" id="developLanguage5"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": "#e9ecef" }} />
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
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											className="form-control form-control-sm"
											id="datePickerReadonlyDefault"
											disabled
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
									<FormControl value={postcode} size="sm" name="postcode" id="postcode" maxlength="7" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">都道府県</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={firstHalfAddress} size="sm" name="firstHalfAddress" id="firstHalfAddress" ref="firstHalfAddress" disabled />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">以降住所</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={lastHalfAddress} size="sm" name="lastHalfAddress" id="lastHalfAddress" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">最寄駅</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										disabled
										value={this.state.station.find((v) => (v.code === this.state.stationCode)) || {}}
										options={this.state.station}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto" id="stationCode"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": "#e9ecef" }} />
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
										name="residenceCode" value={residenceCode}
										disabled>
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
									<FormControl value={residenceCardNo}
										size="sm" name="residenceCardNo" disabled />
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
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePickerReadonlyDefault"
											className="form-control form-control-sm"
											disabled
										/>
									</InputGroup.Append>
									<FormControl name="temporary_stayPeriod" value={temporary_stayPeriod} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="sixKanji">雇用保険番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={employmentInsuranceNo}
										size="sm" name="employmentInsuranceNo" disabled />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="sixKanji">マイナンバー</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={myNumber}
										size="sm" name="myNumber" disabled />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="fiveKanji" >在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<Button size="sm" disabled ><FontAwesomeIcon icon={faFile} /> {this.state.residentCardInfoURL !== "" ? " 添付済み" : " 添付"}</Button>
									<Form.File id="residentCardInfo" hidden data-browse="添付" value={this.state.residentCardInfo} custom onChange={(event) => this.changeFile(event, 'residentCardInfo')} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm" >履歴書1</InputGroup.Text>
									</InputGroup.Prepend>
									<Button size="sm" disabled  ><FontAwesomeIcon icon={faFile} /> {this.state.resumeInfo1URL !== "" ? " 添付済み" : " 添付"}</Button>
									<FormControl value={resumeName1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeName1" disabled />
									<Form.File id="resumeInfo1" hidden data-browse="添付" value={this.state.resumeInfo1} custom onChange={(event) => this.changeFile(event, 'resumeInfo1')} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書2</InputGroup.Text>
									</InputGroup.Prepend>
									<Button size="sm" disabled  ><FontAwesomeIcon icon={faFile} /> {this.state.resumeInfo2URL !== "" ? " 添付済み" : " 添付"}</Button>
									<FormControl value={resumeName2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeName2" disabled />
									<Form.File id="resumeInfo2" hidden data-browse="添付" value={this.state.resumeInfo2} custom onChange={(event) => this.changeFile(event, 'resumeInfo2')} />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="fiveKanji" >パスポート</InputGroup.Text>
									</InputGroup.Prepend>
									<Button size="sm" disabled  ><FontAwesomeIcon icon={faFile} /> {this.state.passportInfoURL !== "" ? " 添付済み" : " 添付"}</Button>
								</InputGroup>
							</Col>
						</Row>
						<div style={{ "textAlign": "center" }}>
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


export default employeeUpdate;

