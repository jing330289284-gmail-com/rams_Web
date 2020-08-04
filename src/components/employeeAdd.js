/* 社員を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import ImageUploader from "react-images-upload";
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"
import * as dateUtils from './utils/dateUtils.js';
import { BrowserRouter as Router, Route } from "react-router-dom";
import BankInfo from './bankInfo';
import SubCost from './subCost';
import SiteInformation from './SiteInformation';
import CustomerInfo from './CustomerInfo';
import '../asserts/css/style.css';

const promise = Promise.resolve(dateUtils.getNO("employeeNo", "LYC", "T001Employee"));

class employeeAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.saveEmployee = this.saveEmployee.bind(this);//登録
		//this.onDrop = this.onDrop.bind(this);//ImageUploaderを処理
		this.radioChangeEmployeeType = this.radioChangeEmployeeType.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);

	}
	//初期化
	initialState = {
		showBankInfoModal: false,//口座情報画面フラグ
		showSubCostModal: false,//諸費用
		showSiteInformationModal: false,//現場情報
		showCustomerInfoModal: false,//上位お客様情報
		//showCustomerInfoModal: false,//権限・PW設置

		pictures: [],//ImageUploader
		genders: [],//性別
		intoCompanys: [],//入社区分
		staffForms: [],//社員形式
		occupation: [],//職種
		department: [],//部署
		authority: [],//権限
		japaneseLevels: [],//日本語
		residence: [],//在留資格
		englishLevel: [],//英語
		nationality: [],//出身地
	};
	//リセット化
	resetState = {
		employeeFristName: '',//社員氏
		employeeLastName: '',//社員名
		furigana1: '',//カタカナ1
		furigana2: '',//カタカナ2
		alphabetOfName: '',//ローマ字
		age: '',//年齢
		japaneseCalendar: "",//和暦
		companyMailAddress: "",//社内メール
		graduationUniversity: "",//学校
		subjectOfStudy: "",//専門
		graduationDate: "",//卒業年月
		joinCompanyOfYear: "",//入社年月
		retirementDate: "",//退職年月
		comingToJapanOfYearAndMonth: "",//来日年月
		//joinCompanyOfYear: "",//出身地TODO
		birthplaceOfPrefecture: "",//出身地(県)
		phone: "",//携帯電話
		developmentLanguageNo1: "",//スキール1
		developmentLanguageNo2: "",//スキール2
		developmentLanguageNo3: "",//スキール3
		residenceCardNoCode: "",//在留カード
		employmentInsuranceNo: "",//雇用保険番号
		myNumber: "",//マイナンバー
		certification1: "",//資格1
		certification2: "",//資格2
	};
	saveEmployee = () => {
		alert(1);
	};
	//リセット
	resetBook = () => {
		this.setState(() => this.resetState);
	};
	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	//初期化メソッド
	componentDidMount() {
		this.getGender();//性別区別
		this.getIntoCompany();//入社区分
		this.getStaffForms();//社員形式
		this.getOccupation();//職種
		this.getDepartment();//部署
		this.getAuthority();//権限
		this.getJapaneseLevel();//日本語レベル
		this.getVisa();//在留資格
		this.getEnglishLevel();//英語
		this.getNO();//採番番号
		this.getNationalitys();//採番番号
	}

	/* 性別区別 */
	getGender = () => {
		var data = dateUtils.getdropDown("getGender");
		this.setState(
			{
				genders: data
			}
		);
	};
	/* 入社区分 */
	getIntoCompany = () => {
		var data = dateUtils.getdropDown("getIntoCompany");
		this.setState(
			{
				intoCompanys: data
			}
		);
	};
	/* 社員形式 */
	getStaffForms = () => {
		var data = dateUtils.getdropDown("getStaffForms");
		this.setState(
			{
				staffForms: data
			}
		);
	};

	/* 職種*/
	getOccupation = () => {
		var data = dateUtils.getdropDown("getOccupation");
		this.setState(
			{
				occupation: data
			}
		);
	};

	/* 部署 */
	getDepartment = () => {
		var data = dateUtils.getdropDown("getDepartment");
		this.setState(
			{
				department: data
			}
		);
	};

	/* 権限 */
	getAuthority = () => {
		var data = dateUtils.getdropDown("getAuthority");
		data.shift()
		this.setState(
			{
				authority: data
			}
		);
	};

	/* 日本語 */
	getJapaneseLevel = () => {
		var data = dateUtils.getdropDown("getJapaneseLevel");
		this.setState(
			{
				japaneseLevels: data
			}
		);
	};

	//在留資格
	getVisa = () => {
		var data = dateUtils.getdropDown("getVisa");
		this.setState(
			{
				residence: data
			}
		);
	};
	//英語
	getEnglishLevel = () => {
		var data = dateUtils.getdropDown("getEnglishLevel");
		this.setState(
			{
				englishLevel: data
			}
		);
	};
	//採番番号
	getNO = () => {
		promise.then((value) => {
			this.setState(
				{
					employeeNo: value
				}
			);
		});
	};

	/* 出身地国 */
	getNationalitys = () => {
		var data = dateUtils.getdropDown("getNationalitys");
		this.setState(
			{
				nationality: data
			}
		);

	};
	//ImageUploaderを処理　開始
	onDrop(picture) {
		this.setState({
			pictures: this.state.pictures.concat(picture),
		});
	}
	//ImageUploaderを処理　終了
	//年月開始
	state = {
		raiseStartDate: new Date(),
	}
	//卒業年月
	inactiveGraduationDate = date => {
		$("#graduationDate").val(date.getFullYear() + "/" + (date.getMonth() + 1));
		dateUtils.getFullYearMonth("#time5", date);

	};
	//退職年月
	inactiveRetirementDate = (date) => {
		$("#retirementDate").val(date.getFullYear() + "/" + (date.getMonth() + 1));
	};
	//入社年月
	inactiveJoinCompanyOfYear = date => {
		$("#joinCompanyOfYear").val(date.getFullYear() + "/" + (date.getMonth() + 1));
		dateUtils.getFullYearMonth("#time", date);
	};
	//来日年月
	inactiveComingToJapanOfYearAndMonthr = date => {
		$("#comingToJapanOfYearAndMonth").val(date.getFullYear() + "/" + (date.getMonth() + 1));
		dateUtils.getFullYearMonth("#time2", date);
	};
	//在留期間
	inactivePeriodOfStayr = date => {
		$("#periodOfStay").val(date.getFullYear() + "/" + (date.getMonth() + 1));
		dateUtils.getFullYearMonth("#time3", date);
	};
	//年齢と和暦
	inactiveAge = date => {
		$("#time4").val("0歳");
		$("#age").val(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
		var birthDayTime = date.getTime();
		var nowTime = new Date().getTime();
		$("#time4").val(Math.ceil((nowTime - birthDayTime) / 31536000000) + "歳");
		//http://ap.hutime.org/cal/ 西暦と和暦の変換
		var ival = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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
	//年月終了

	//社員タイプが違う時に、色々な操作をします。
	radioChangeEmployeeType = () => {
		var val = $('input:radio[name="employeeType"]:checked').val();
		if (val === '1') {
			this.setState({ employeeNo: '', companyMailAddress: '', authority: [] });
			$('input[type="email"]').prop('disabled', true);
			$('#authorityCodeId').prop('disabled', true);
		} else {
			this.getNO();
			this.getAuthority();
			$('input[type="email"]').prop('disabled', false);
			$('#authorityCodeId').prop('disabled', false);
		}
	}

	//削除確認され？
	valueChangeEmploryeeFormCode = () => {
		var val = $('#emploryeeFormCodeID').val();
		if (val === '3') {
			$('#retirementDateId').prop('disabled', false);
		} else {
			$('#retirementDateId').prop('disabled', true);
		}
	}

	valueChangeNationality = () => {
		var val = $('#nationalityCodeId').val();
		if (val === '3') {
			$('#japaneaseLeveCodeId').val("5");
		}
	}

	/**
	* 小さい画面の閉め 
	*/
	handleHideModal = (Kbn) => {
		if (Kbn === "bankInfo") {//口座情報
			this.setState({ showBankInfoModal: false })
		} else if (Kbn === "subCost") {//諸費用
			this.setState({ showSubCostModal: false })
		} else if (Kbn === "siteInformation") {//現場情報
			this.setState({ showSiteInformationModal: false })
		} else if (Kbn === "customerInfo") {//お客様
			this.setState({ showCustomerInfoModal: false })
		} else if (Kbn === "権限・PW設置") {//権限・PW設置TODO
			this.setState({ showSubCostModal: false })
		} else if (Kbn === "住所情報") {//住所情報
			this.setState({ showSubCostModal: false })
		}
	}

	/**
 *  小さい画面の開き
 */
	handleShowModal = (Kbn) => {
		if (Kbn === "bankInfo") {//口座情報
			this.setState({ showBankInfoModal: true })
		} else if (Kbn === "subCost") {//諸費用
			this.setState({ showSubCostModal: true })
		} else if (Kbn === "siteInformation") {//現場情報
			this.setState({ showSiteInformationModal: true })
		} else if (Kbn === "customerInfo") {//お客様
			this.setState({ showCustomerInfoModal: true })
		} else if (Kbn === "権限・PW設置") {//権限・PW設置TODO
			this.setState({ showSubCostModal: true })
		} else if (Kbn === "住所情報") {//住所情報
			this.setState({ showSubCostModal: true })
		}
	}
	render() {
		const { employeeNo, employeeFristName, employeeLastName, furigana1, furigana2, alphabetOfName, age, japaneseCalendar,
			genderStatus, intoCompanyCode, emploryeeFormCode, occupationCode, departmentCode, companyMailAddress,
			graduationUniversity, graduationDate, joinCompanyOfYear, retirementDate, nationalityCode, birthplaceOfPrefecture,
			phone, comingToJapanOfYearAndMonth, authorityCode, japaneaseLeveCode, englishLeveCode,
			residenceOfCode, developmentLanguageNo1, developmentLanguageNo2, developmentLanguageNo3,
			residenceCardNoCode, periodOfStay, employmentInsuranceNo, myNumber,
			subjectOfStudy, certification1, certification2 } = this.state;
		return (
			<div>
				{/* 開始 */}
				{/* 住所情報 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "bankInfo")} show={this.state.showBankInfoModal} dialogClassName="modal-jusho">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body className="show-grid">
						<div key={this.props.location.key} >
							<Router>
								{/* <Route exact path={`${this.props.match.url}/`} component={BankInfo} /> */}
							</Router>
						</div>
					</Modal.Body>
				</Modal>
				{/* 口座情報 */}
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
				{/* 諸費用 */}
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
				{/* 現場情報 */}
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
				{/* お客様 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "customerInfo")} show={this.state.showCustomerInfoModal} dialogClassName="modal-customerInfo">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body className="show-grid">
						<div key={this.props.location.key} >
							<Router>
								<Route exact path={`${this.props.match.url}/`} component={CustomerInfo} />
							</Router>
						</div>
					</Modal.Body>
				</Modal>
				{/* 権限・PW設置*/}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "customerInfo")} show={this.state.showCustomerInfoModal} dialogClassName="modal-kengen">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body className="show-grid">
						<div key={this.props.location.key} >
							<Router>
								{/* <Route exact path={`${this.props.match.url}/`} component={TopCustomerInfo} /> */}
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
					<Button size="sm" onClick={this.handleShowModal.bind(this, "customerInfo")} >お客様</Button>{' '}
					<Button size="sm" >権限・PW設置</Button>
					<div>
						<Form.Label>社員</Form.Label><Form.Check defaultChecked={true} onChange={this.radioChangeEmployeeType.bind(this)} inline type="radio" name="employeeType" value="0" />
						<Form.Label>協力</Form.Label><Form.Check onChange={this.radioChangeEmployeeType.bind(this)} inline type="radio" name="employeeType" value="1" />
					</div>
				</div>
				<Form onSubmit={this.saveEmployee} onReset={this.resetBook}>
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
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={employeeNo} autoComplete="off" disabled
										onChange={this.valueChange} size="sm" name="employeeNo" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
							<Col sm={4}>
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
							<Col sm={4}>
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
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="ローマ字" value={alphabetOfName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="alphabetOfName" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="age" value={age} name="age" placeholder="年齢" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={this.state.raiseStartDate}
											onChange={this.inactiveAge}
											autoComplete="on"
											locale="ja"
											showYearDropdown
											yearDropdownItemNumber={25}
											scrollableYearDropdown
											className={"dateInput"}
										/>
									</InputGroup.Append>
									<FormControl id="time4" name="time4" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="和暦" value={japaneseCalendar} autoComplete="off"
										onChange={this.valueChange} size="sm" name="japaneseCalendar" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="genderStatus" value={genderStatus}
										autoComplete="off">
										{this.state.genders.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="intoCompanyCode" value={intoCompanyCode}
										autoComplete="off">
										{this.state.intoCompanys.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="emploryeeFormCode" value={emploryeeFormCode}
										autoComplete="off" id="emploryeeFormCodeID">
										{this.state.staffForms.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">職種</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="occupationCode" value={occupationCode}
										autoComplete="off">
										{this.state.occupation.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">部署</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="departmentCode" value={departmentCode}
										autoComplete="off">
										{this.state.department.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社内メール</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="email" placeholder="社内メール" value={companyMailAddress} autoComplete="off"
										onChange={this.valueChange} size="sm" name="companyMailAddress" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業学校</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="学校" value={graduationUniversity} autoComplete="off"
										onChange={this.valueChange} size="sm" name="graduationUniversity" />
									<FormControl placeholder="専門" value={subjectOfStudy} autoComplete="off"
										onChange={this.valueChange} size="sm" name="subjectOfStudy" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="graduationDate" name="graduationDate" value={graduationDate} placeholder="卒業年月" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={this.state.raiseStartDate}
											onChange={this.inactiveGraduationDate}
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
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="joinCompanyOfYear" name="joinCompanyOfYear" value={joinCompanyOfYear} placeholder="入社年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={this.state.raiseStartDate}
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
									<FormControl id="time" name="time" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>

						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3" >
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">退職年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="retirementDate" name="retirementDate" value={retirementDate} placeholder="退職年月" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={this.state.raiseStartDate}
											onChange={this.inactiveRetirementDate}
											autoComplete="on"
											className={"dateInput"}
											dateFormat={"yyyy MM"}
											showMonthYearPicker
											showFullMonthYearPicker
											showDisabledMonthNavigation
											locale="ja"
											id="retirementDateId"
										/>
									</InputGroup.Append>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">来日年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="comingToJapanOfYearAndMonth" value={comingToJapanOfYearAndMonth} name="comingToJapanOfYearAndMonth" placeholder="来日年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={this.state.raiseStartDate}
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
									<FormControl id="time2" name="time2" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出身地</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChangeNationality}
										name="nationalityCode" value={nationalityCode}
										autoComplete="off" id="nationalityCodeId">
										{this.state.nationality.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
									<FormControl placeholder="出身地" value={birthplaceOfPrefecture} autoComplete="off"
										onChange={this.valueChange} size="sm" name="birthplaceOfPrefecture" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">携帯電話</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="携帯電話" value={phone} autoComplete="off"
										onChange={this.valueChange} size="sm" name="phone" />
								</InputGroup>
							</Col>

							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">権限</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="authorityCode" value={authorityCode}
										autoComplete="off" id="authorityCodeId">
										{this.state.authority.map(date =>
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
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"
										onChange={this.valueChange} size="sm"
										name="japaneaseLeveCode" value={japaneaseLeveCode}
										autoComplete="off" id="japaneaseLeveCodeId">
										{this.state.japaneseLevels.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">英語</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"
										onChange={this.valueChange} size="sm"
										name="englishLeveCode" value={englishLeveCode}
										autoComplete="off">
										{this.state.englishLevel.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={4}>
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
							<Col sm={8}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">スキール</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="スキール" value={developmentLanguageNo1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developmentLanguageNo1" />
									<FormControl placeholder="スキール" value={developmentLanguageNo2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developmentLanguageNo2" />
									<FormControl placeholder="スキール" value={developmentLanguageNo3} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developmentLanguageNo3" />
									<FormControl placeholder="スキール" value={developmentLanguageNo3} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developmentLanguageNo4" />
									<FormControl placeholder="スキール" value={developmentLanguageNo3} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developmentLanguageNo5" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">経験年数</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="経験年数" autoComplete="off"
										onChange={this.valueChange} size="sm" name="ýearsOfExperience" />
									<FormControl id="time5" name="time5" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>

					<Form.Label style={{ "color": "#FFD700" }}>個人関連情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留資格 </InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="residenceOfCode" value={residenceOfCode}
										autoComplete="off">
										{this.state.residence.map(vi =>
											<option key={vi.code} value={vi.code}>
												{vi.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="在留カード" value={residenceCardNoCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="residenceCardNoCode" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留期間</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="periodOfStay" value={periodOfStay} name="periodOfStay" placeholder="在留期間" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={this.state.raiseStartDate}
											onChange={this.inactivePeriodOfStayr}
											autoComplete="on"
											className={"dateInput"}
											dateFormat={"yyyy MM"}
											showMonthYearPicker
											showFullMonthYearPicker
											showDisabledMonthNavigation
											locale="ja"
										/>
									</InputGroup.Append>
									<FormControl id="time3" name="time3" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">雇用保険番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="雇用保険番号" value={employmentInsuranceNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employmentInsuranceNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">マイナンバー</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="マイナンバー" value={myNumber} autoComplete="off"
										onChange={this.valueChange} size="sm" name="myNumber" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書</InputGroup.Text><Form.File id="exampleFormControlFile1" />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text><Form.File id="exampleFormControlFile1" />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">パスポート</InputGroup.Text><Form.File id="exampleFormControlFile1" />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>

					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="success" type="submit">
							登録
                        </Button>{' '}
						<Button size="sm" type="reset" variant="success"  >
							リセット
                        </Button>
					</div>
				</Form>
			</div>
		);
	}
}
export default employeeAdd;
