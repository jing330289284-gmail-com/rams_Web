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
import SiteInformation from './siteInfo';
import '../asserts/css/style.css';


const promise = Promise.resolve(dateUtils.getNO("employeeNo", "LYC", "T001Employee"));

class employeeAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.saveEmployee = this.saveEmployee.bind(this);//登録
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
		developLanguage1: "",//　　スキール1
		developLanguage2: "",//　　スキール2
		developLanguage3: "",//　　スキール3
		developLanguage4: "",//　　スキール4
		developLanguage5: "",//　　スキール5
		residenceCardNo: "",//　　在留カード
		employmentInsuranceNo: "",//　　雇用保険番号
		myNumber: "",//　　マイナンバー
		certification1: "",//　　資格1
		certification2: "",//　　資格2
		resumeRemark1: "",//　　履歴書備考1
		resumeRemark2: "",//　　履歴書備考2
		stayPeriod: "",//　　stayPeriod


	};
	//登録
	saveEmployee = () => {
		const emp = {
			//employeeNo: this.state.employeeNo,//ピクチャ
			employeeStatus: $('input:radio[name="employeeType"]:checked').val(),//社員ステータス
			employeeNo: this.state.employeeNo,//社員番号
			employeeFristName: this.state.employeeFristName,//社員氏
			employeeLastName: this.state.employeeLastName,//社員名
			furigana: this.state.furigana1 + this.state.furigana2,//　　カタカナ
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
		axios.post("http://127.0.0.1:8080/employee/addEmployeeInfo", emp)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					alert(response.data)
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};
	//　　リセット
	resetBook = () => {
		this.setState(() => this.resetState);

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
		//var pro = this.props.location.state;
		//$("#shoriKbn").val(pro.split("-")[0]);
		//var pro = this.props.location.state;
		//$("#shoriKbn").val(pro.split("-")[0]);
	}

	//　性別区別
	getGender = () => {
		var data = dateUtils.getdropDown("getGender");
		this.setState(
			{
				genderStatuss: data
			}
		);
	};
	//　入社区分 

	getIntoCompany = () => {
		var data = dateUtils.getdropDown("getIntoCompany");
		this.setState(
			{
				intoCompanyCodes: data
			}
		);
	};
	//　 社員形式 
	getStaffForms = () => {
		var data = dateUtils.getdropDown("getStaffForms");
		this.setState(
			{
				employeeFormCodes: data
			}
		);
	};

	//　職種
	getOccupation = () => {
		var data = dateUtils.getdropDown("getOccupation");
		this.setState(
			{
				occupationCodes: data
			}
		);
	};

	//　 部署 
	getDepartment = () => {
		var data = dateUtils.getdropDown("getDepartment");
		this.setState(
			{
				departmentCodes: data
			}
		);
	};

	//　 権限 
	getAuthority = () => {
		var data = dateUtils.getdropDown("getAuthority");
		data.shift()
		this.setState(
			{
				authorityCodes: data
			}
		);
	};

	//　日本語 
	getJapaneseLevel = () => {
		var data = dateUtils.getdropDown("getJapaneseLevel");
		this.setState(
			{
				japaneaseLevelCodes: data
			}
		);
	};

	//　在留資格
	getVisa = () => {
		var data = dateUtils.getdropDown("getVisa");
		this.setState(
			{
				residenceCodes: data
			}
		);
	};
	//　英語
	getEnglishLevel = () => {
		var data = dateUtils.getdropDown("getEnglishLevel");
		this.setState(
			{
				englishLeveCodes: data
			}
		);
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

	//　 出身地国
	getNationalitys = () => {
		var data = dateUtils.getdropDown("getNationalitys");
		this.setState(
			{
				nationalityCodes: data
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
	//　　年月開始
	state = {
		raiseStartDate: new Date(),
	}
	//　　卒業年月
	inactiveGraduationYearAndMonth = date => {
		let month = date.getMonth() + 1;
		this.setState(
			{
				graduationYearAndMonth: date.getFullYear() + '' + (month < 10 ? '0' + month : month)
			}
		);
		dateUtils.getFullYearMonth("#time5", date);
	};
	//　　退職年月
	inactiveRetirementYearAndMonth = (date) => {
		let month = date.getMonth() + 1;
		this.setState(
			{
				retirementYearAndMonth: date.getFullYear() + '' + (month < 10 ? '0' + month : month)
			}
		);
	};
	//　　入社年月
	inactiveJoinCompanyOfYear = date => {
		let month = date.getMonth() + 1;
		this.setState(
			{
				intoCompanyYearAndMonth: date.getFullYear() + '' + (month < 10 ? '0' + month : month)
			}
		);
		dateUtils.getFullYearMonth("#time", date);
	};
	//　　来日年月
	inactiveComingToJapanOfYearAndMonthr = date => {
		let month = date.getMonth() + 1;
		this.setState(
			{
				comeToJapanYearAndMonth: date.getFullYear() + '' + (month < 10 ? '0' + month : month)
			}
		);
		dateUtils.getFullYearMonth("#time2", date);
	};
	//　　在留期間
	inactiveStayPeriod = date => {
		let month = date.getMonth() + 1;
		this.setState(
			{
				stayPeriod: date.getFullYear() + '' + (month < 10 ? '0' + month : month)
			}
		);
		dateUtils.getFullYearMonth("#time3", date);
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
	//テスト
	onModalRef = ref => {
		this.modal = ref
	}

	onCallback = msg => {
		alert(msg);
	}
	render() {

		const { employeeNo, employeeFristName, employeeLastName, furigana1, furigana2, alphabetName, age, japaneseCalendar,
			genderStatus, major, intoCompanyCode, employeeFormCode, occupationCode, departmentCode, companyMail,
			graduationUniversity, graduationYearAndMonth, intoCompanyYearAndMonth, retirementYearAndMonth, nationalityCode, birthplace,
			phoneNo, comeToJapanYearAndMonth, authorityCode, japaneseLevelCode, englishLevelCode,
			residenceCode, developLanguage1, developLanguage2, developLanguage3, developLanguage4, developLanguage5,
			residenceCardNo, stayPeriod, employmentInsuranceNo, myNumber, certification1, certification2, resumeRemark1, resumeRemark2, time4 } = this.state;
		return (
			<div>
				{/* <SubCost onRef={this.onModalRef} onCallback={this.onCallback} /> */}
				<input type="hidden" id="shoriKbn" name="shoriKbn" />
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
									<FormControl placeholder="ローマ字" value={alphabetName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="alphabetName" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="time4" value={time4} name="time4" placeholder="年齢" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
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
									<FormControl placeholder="0" id="age" value={age} autoComplete="off" onChange={this.valueChange} size="sm" name="age" readOnly />
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">歳</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="和暦" value={japaneseCalendar} autoComplete="off" onChange={this.valueChange} size="sm" name="japaneseCalendar" />
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
										{this.state.genderStatuss.map(date =>
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
										{this.state.intoCompanyCodes.map(date =>
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
										name="employeeFormCode" value={employeeFormCode}
										autoComplete="off" id="employeeFormCodeID">
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
							<Col sm={4}>
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
							<Col sm={4}>
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
							<Col sm={4}>
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
							<Col sm={4}>
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
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="graduationYearAndMonth" name="graduationYearAndMonth" value={graduationYearAndMonth} placeholder="卒業年月" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={this.state.raiseStartDate}
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
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="intoCompanyYearAndMonth" name="intoCompanyYearAndMonth" value={intoCompanyYearAndMonth} placeholder="入社年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
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
									<FormControl id="retirementYearAndMonth" name="retirementYearAndMonth" value={retirementYearAndMonth} placeholder="退職年月" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={this.state.raiseStartDate}
											onChange={this.inactiveRetirementYearAndMonth}
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
									<FormControl id="comeToJapanYearAndMonth" value={comeToJapanYearAndMonth} name="comeToJapanYearAndMonth" placeholder="来日年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
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
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">携帯電話</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="携帯電話" value={phoneNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="phoneNo" />
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
							<Col sm={4}>
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
							<Col sm={4}>
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
									<FormControl placeholder="スキール1" value={developLanguage1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developLanguage1" />
									<FormControl placeholder="スキール2" value={developLanguage2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developLanguage2" />
									<FormControl placeholder="スキール3" value={developLanguage3} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developLanguage3" />
									<FormControl placeholder="スキール4" value={developLanguage4} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developLanguage4" />
									<FormControl placeholder="スキール5" value={developLanguage5} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developLanguage5" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">経験年数</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="経験年数" autoComplete="off"
										onChange={this.valueChange} size="sm" name="ýearsExperience" />
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
										name="residenceCode" value={residenceCode}
										autoComplete="off">
										{this.state.residenceCodes.map(vi =>
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
									<FormControl placeholder="在留カード" value={residenceCardNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="residenceCardNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留期間</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="stayPeriod" value={stayPeriod} name="stayPeriod" placeholder="在留期間" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									<InputGroup.Append>
										<DatePicker
											selected={this.state.raiseStartDate}
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
							<Col sm={4}>
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
										<InputGroup.Text id="inputGroup-sizing-sm" >履歴書</InputGroup.Text><Form.File id="resumeInfo1" name="resumeInfo1" />
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
