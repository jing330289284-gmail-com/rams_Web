/* 社員を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"
import * as dateUtils from './utils/dateUtils.js';
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


const promise = Promise.resolve(dateUtils.getNO("employeeNo", "LYC", "T001Employee"));

class manageSituation extends React.Component {
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
				<Form onSubmit={this.saveEmployee} onReset={this.resetBook}>
					<Form.Group>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="社員名" value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="time4" value={time4} name="time4" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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
								</InputGroup>
							</Col>
						</Row>
						<Row style={{padding:"10px"}}><Col sm={12}></Col></Row>
						<Row>
							<Col sm={6}>
								<Form.Label style={{ "color": "#FFD700" }}>面談情報1</Form.Label>
							</Col>
							<Col sm={6}>
								<Form.Label style={{ "color": "#FFD700" }}>面談情報2</Form.Label>
							</Col>
						</Row>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="time4" value={time4} name="time4" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="場所" value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="お客様" value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="time4" value={time4} name="time4" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="場所" value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="お客様" value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" />
								</InputGroup>
							</Col>
						</Row>
						<Row style={{padding:"10px"}}><Col sm={12}></Col></Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">希望単価</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="00" value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" />
									<font style={{ marginLeft: "10px", marginRight: "10px" }}>～</font>
									<FormControl placeholder="00" value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">優先度</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info">
							更新
                        </Button>
					</div>
					<Row >
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>合計：6人</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>確定：6人</font>
						</Col>
						<Col sm={6}></Col>
						<Col sm={4}>
							<div style={{ "float": "right" }}>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >個人情報</Button>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >現場情報</Button>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >履歴書1</Button>
								<Button size="sm" variant="info" name="clickButton" >履歴書2</Button>
							</div>
						</Col>
					</Row>
				</Form>
				<div >
					<BootstrapTable className={"bg-white text-dark"} options={this.options}>
						<TableHeaderColumn width='8%' dataField='rowNo' dataSort={true} caretRender={dateUtils.getCaret} isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='employeeNo'>社員番号</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='employeeFristName'>氏名</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='furigana'>役割</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='alphabetName' dataAlign='center'>開発言語</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='nearestStation'>寄り駅</TableHeaderColumn>
						<TableHeaderColumn width='5%' dataField='intoCompanyYearAndMonth'>単価</TableHeaderColumn>
						<TableHeaderColumn width='9%' dataField='phoneNo'>ステータス</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='nearestStation'>確定客様</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='nearestStation'>確定単価</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='nearestStation'>営業担当</TableHeaderColumn>

					</BootstrapTable>
				</div>


			</div>
		);
	}
}
export default manageSituation;
