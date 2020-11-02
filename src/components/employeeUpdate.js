/* 
社員を修正
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
import { faEdit, faUndo, faFile } from '@fortawesome/free-solid-svg-icons';
import MyToast from './myToast';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
import ImageUploader from "react-images-upload";


axios.defaults.withCredentials = true;
class employeeUpdate extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.onDrop = this.onDrop.bind(this);
	}

	onDrop(pictureFiles, pictureDataURLs) {
		this.setState({
			pictures: this.state.pictures.concat(pictureFiles)
		});
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
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛テスト
	};
	//リセット
	resetBook = () => {
		window.location.href = window.location.href
	};

	//更新ボタン
	updateEmployee = () => {
		const formData = new FormData()
		let obj = document.getElementById("imageId");
		let imgSrc = obj.getAttribute("src");
		const emp = {
			employeeNo: this.state.employeeNo,//社員番号
			bpEmployeeNo: this.state.employeeNo,//社員番号s
			employeeFristName: this.state.employeeFristName,//社員氏
			employeeLastName: this.state.employeeLastName,//社員名
			furigana1: publicUtils.nullToEmpty(this.state.furigana1),//カタカナ
			furigana2: publicUtils.nullToEmpty(this.state.furigana2),//カタカナ
			alphabetName: publicUtils.nullToEmpty(this.state.alphabetName),//ローマ字
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
			authorityCode: this.state.authorityCode,//権限
			japaneseLevelCode: publicUtils.nullToEmpty(this.state.japaneseLevelCode),//日本語
			englishLevelCode: publicUtils.nullToEmpty(this.state.englishLevelCode),//英語
			certification1: publicUtils.nullToEmpty(this.state.certification1),//資格1
			certification2: publicUtils.nullToEmpty(this.state.certification2),//資格2
			siteRoleCode: publicUtils.nullToEmpty(this.state.siteRoleCode),//役割
			postcode: publicUtils.nullToEmpty(this.refs.postcode.value),//郵便番号
			firstHalfAddress: publicUtils.nullToEmpty(this.refs.firstHalfAddress.value),
			lastHalfAddress: publicUtils.nullToEmpty(this.state.lastHalfAddress),
			stationCode: publicUtils.labelGetValue($("#stationCode").val(), this.state.station),
			developLanguage1: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage1").val(), this.state.developLanguageMaster)),
			developLanguage2: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage2").val(), this.state.developLanguageMaster)),
			developLanguage3: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage3").val(), this.state.developLanguageMaster)),
			developLanguage4: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage4").val(), this.state.developLanguageMaster)),
			developLanguage5: publicUtils.nullToEmpty(publicUtils.labelGetValue($("#developLanguage5").val(), this.state.developLanguageMaster)),
			residenceCode: publicUtils.nullToEmpty(this.state.residenceCode),//在留資格
			residenceCardNo: publicUtils.nullToEmpty(this.state.residenceCardNo),//在留カード
			stayPeriod: publicUtils.formateDate(this.state.stayPeriod, false),//在留期間
			employmentInsuranceNo: publicUtils.nullToEmpty(this.state.employmentInsuranceNo),//雇用保険番号
			myNumber: publicUtils.nullToEmpty(this.state.myNumber),//マイナンバー
			resumeName1: publicUtils.nullToEmpty(this.state.resumeName1),//履歴書備考1
			resumeName2: publicUtils.nullToEmpty(this.state.resumeName2),//履歴書備考1
			accountInfo: this.state.accountInfo,//口座情報
			password: publicUtils.nullToEmpty(this.state.passwordSetInfo),//pw設定
			yearsOfExperience: publicUtils.formateDate(this.state.yearsOfExperience, false),//経験年数
			bpInfoModel: this.state.bpInfoModel,//pb情報
			picInfo: imgSrc,//pb情報

		};
		formData.append('emp', JSON.stringify(emp))
		formData.append('resumeInfo1', publicUtils.nullToEmpty($('#resumeInfo1').get(0).files[0]))
		formData.append('resumeInfo2', publicUtils.nullToEmpty($('#resumeInfo2').get(0).files[0]))
		formData.append('residentCardInfo', publicUtils.nullToEmpty($('#residentCardInfo').get(0).files[0]))
		formData.append('passportInfo', publicUtils.nullToEmpty($('#passportInfo').get(0).files[0]))

		formData.append('resumeInfo1URL', this.state.resumeInfo1URL)
		formData.append('resumeInfo2URL', this.state.resumeInfo2URL)
		formData.append('residentCardInfoURL', this.state.residentCardInfoURL)
		formData.append('passportInfoURL', this.state.passportInfoURL)
		axios.post(this.state.serverIP + "employee/updateEmployee", formData)
			.then(response => {
				if (response.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					window.location.reload();
					this.getNO("LYC");//採番番号
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
	}
	/**
	 * 出身地に変更する時、日本語ラベルとEnglishラベルを変更する
	 */
	changeNationalityCodes = event => {
		let value = event.target.value;
		this.setState({
			nationalityCode: value,
		})
		if (value === '3') {
			this.setState({
				japaneseLevelCode: 5,
			})
		} else if (value === '4' || value === '5' || value === '6') {
			this.setState({
				englishLevelCode: 8,
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
					companyMail: data.companyMail !== null && data.companyMail !== "" ? data.companyMail.match(/(\S*)@/)[1] : "",//社内メール　data.companyMail.match(/(\S*)@/)[1]
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
					temporary_yearsOfExperience: publicUtils.getFullYearMonth(publicUtils.converToLocalTime(data.yearsOfExperience, false), new Date()),
					image: data.picInfo
				});
			}
			);
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

	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (this.state.developLanguageMaster.find((v) => (v.name === value)) !== undefined ||
				this.state.station.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'developLanguage1':
						this.setState({
							developLanguage1: this.state.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage2':
						this.setState({
							developLanguage2: this.state.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage3':
						this.setState({
							developLanguage3: this.state.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage4':
						this.setState({
							developLanguage4: this.state.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage5':
						this.setState({
							developLanguage5: this.state.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'stationCode':
						this.setState({
							stationCode: this.state.station.find((v) => (v.name === value)).code,
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
			reader.onload = function () {
				document.getElementById("imageId").src = reader.result;
			};
		}
	}

	/**
	 * ファイルを処理
	 * @param {*} event 
	 * @param {*} name 
	 */
	addFile = (event, name) => {
		$("#" + name).click();
	}
	render() {
		const { employeeNo, employeeFristName, employeeLastName, furigana1, furigana2, alphabetName, temporary_age, japaneseCalendar, genderStatus, major, intoCompanyCode,
			employeeFormCode, occupationCode, departmentCode, companyMail, graduationUniversity, nationalityCode, birthplace, phoneNo, authorityCode, japaneseLevelCode, englishLevelCode, residenceCode,
			residenceCardNo, employmentInsuranceNo, myNumber, certification1, certification2, siteRoleCode, postcode, firstHalfAddress, lastHalfAddress, resumeName1, resumeName2, temporary_stayPeriod, temporary_yearsOfExperience, temporary_intoCompanyYearAndMonth, temporary_comeToJapanYearAndMonth,
			retirementYearAndMonthDisabled, temporary_graduationYearAndMonth, temporary_retirementYearAndMonth, errorsMessageValue, employeeStatus
		} = this.state;
		const { accountInfo, passwordSetInfo, bpInfoModel, actionType } = this.state;
		return (
			<div>
				<FormControl value={actionType} name="actionType" hidden />
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={"修正成功！"} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<Row inline="true">
					<Col className="text-center">
						<h2>社員情報修正</h2>
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
						<BankInfo accountInfo={accountInfo} actionType={this.state.actionType} accountTokuro={this.accountInfoGet} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} />
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
					<Button size="sm" id="bankInfo" onClick={this.handleShowModal.bind(this, "bankInfo")} disabled={this.state.employeeStatusFlag ? false : true} >口座情報</Button>{' '}
					<Button size="sm" id="passwordSet" onClick={this.handleShowModal.bind(this, "passwordSet")} disabled={this.state.employeeStatusFlag ? false : true}>PW設定</Button>{' '}
					<Button size="sm" id="bpInfoModel" onClick={this.handleShowModal.bind(this, "bpInfoModel")} disabled={this.state.employeeStatusFlag ? true : false}>BP情報</Button>{' '}
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
										name="employeeStatus" value={employeeStatus}
										autoComplete="off" disabled="true">
										{this.state.employeeStatusS.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text></InputGroup.Prepend>
									<FormControl placeholder="社員氏" value={employeeFristName} autoComplete="off" onChange={this.valueChange} onBlur={this.katakanaApiChange.bind(this)} size="sm" name="employeeFristName" maxlength="3" />{' '}
									<FormControl placeholder="社員名" value={employeeLastName} autoComplete="off" onChange={this.valueChange} onBlur={this.katakanaApiChange.bind(this)} size="sm" name="employeeLastName" maxlength="3" /><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
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
									</Form.Control><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="intoCompanyCode" value={intoCompanyCode}
										autoComplete="off" >
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
										autoComplete="off" >
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
									<FormControl value={employeeNo} autoComplete="off" disabled onChange={this.valueChange} size="sm" name="employeeNo" />
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
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">歳</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">部署</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="departmentCode" value={departmentCode}
										autoComplete="off" >
										{this.state.departmentCodes.map(date =>
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
									<FormControl
										size="sm" disabled />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="ローマ字" value={alphabetName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="alphabetName" />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="和暦" value={japaneseCalendar} id="japaneseCalendar" autoComplete="off" onChange={this.valueChange} size="sm" name="japaneseCalendar" disabled />
								</InputGroup>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">メール</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="email" placeholder="メール" value={companyMail} autoComplete="off" disabled={this.state.employeeStatusFlag ? false : true}
										onChange={this.valueChange} size="sm" name="companyMail" /><FormControl value="@lyc.co.jp" size="sm" disabled />
									<font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<Button size="sm" variant="info" onClick={(event) => this.addFile(event, 'image')} type="button" on><FontAwesomeIcon icon={faFile} /> 写真</Button>
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
											id="datePicker"
											className="form-control form-control-sm"
											autoComplete="off"
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
										<InputGroup.Text id="inputGroup-sizing-sm">出身地</InputGroup.Text>
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
									</Form.Control><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
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
										autoComplete="off" id="authorityCodeId" disabled={this.state.employeeStatusFlag ? false : true} >
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
									<FormControl placeholder="資格1" value={certification1} autoComplete="off" onChange={this.valueChange} size="sm" name="certification1" />
									<FormControl placeholder="資格2" value={certification2} autoComplete="off" onChange={this.valueChange} size="sm" name="certification2" />
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
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage1)) || {}}
										options={this.state.developLanguageMaster}
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
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage2)) || {}}
										options={this.state.developLanguageMaster}
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
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage3)) || {}}
										options={this.state.developLanguageMaster}
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
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage4)) || {}}
										options={this.state.developLanguageMaster}
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
										value={this.state.developLanguageMaster.find((v) => (v.code === this.state.developLanguage5)) || {}}
										options={this.state.developLanguageMaster}
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
										<InputGroup.Text id="inputGroup-sizing-sm">郵便番号：〒</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={postcode} autoComplete="off" onChange={this.valueChange} onBlur={publicUtils.postcodeApi} ref="postcode" size="sm" name="postcode" id="postcode" maxlength="7" />
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
									<FormControl value={lastHalfAddress} autoComplete="off" onChange={this.valueChange} size="sm" name="lastHalfAddress" id="lastHalfAddress" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">最寄駅</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={this.state.station.find((v) => (v.code === this.state.stationCode)) || {}}
										options={this.state.station}
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
						<Form.Label style={{ "color": "#000000" }}>個人関連情報</Form.Label>
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
									<InputGroup.Append>
										<DatePicker
											selected={this.state.stayPeriod}
											onChange={this.inactiveStayPeriod}
											locale="ja"
											dateFormat="yyyy/MM"
											showMonthYearPicker
											showFullMonthYearPicker
											id="datePicker"
											className="form-control form-control-sm"
											autoComplete="off"
										/>
									</InputGroup.Append>
									<FormControl name="temporary_stayPeriod" value={temporary_stayPeriod} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
								</InputGroup>
							</Col>
							<Col sm={2}>
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
						</Row>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm" >在留カード</InputGroup.Text>
										<InputGroup.Text id="inputGroup-sizing-sm" onClick={(event) => this.addFile(event, 'residentCardInfo')} ><FontAwesomeIcon icon={faFile} /> {this.state.residentCardInfoURL !== "" || this.state.residentCardInfo !== undefined ? "添付済み" : "添付"}</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
								<Form.File id="residentCardInfo" hidden data-browse="添付" value={this.state.residentCardInfo} custom onChange={(event) => this.changeFile(event, 'residentCardInfo')} />
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm" >履歴書</InputGroup.Text>
										<InputGroup.Text id="inputGroup-sizing-sm" onClick={(event) => this.addFile(event, 'resumeInfo1')} ><FontAwesomeIcon icon={faFile} /> {this.state.resumeInfo1URL !== "" || this.state.resumeInfo1 !== undefined ? "添付済み" : "添付"}</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.File id="resumeInfo1" hidden data-browse="添付" value={this.state.resumeInfo1} custom onChange={(event) => this.changeFile(event, 'resumeInfo1')} />
								</InputGroup>
							</Col>
							<Col sm={1}>
								<InputGroup size="sm" className="mb-3">
									<FormControl placeholder="履歴書1名" value={resumeName1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeName1" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書2</InputGroup.Text>
										<InputGroup.Text id="inputGroup-sizing-sm" onClick={(event) => this.addFile(event, 'resumeInfo2')} ><FontAwesomeIcon icon={faFile} /> {this.state.resumeInfo2URL !== "" || this.state.resumeInfo2 !== undefined ? "添付済み" : "添付"}</InputGroup.Text>
										<Form.File id="resumeInfo2" hidden data-browse="添付" value={this.state.resumeInfo2} custom onChange={(event) => this.changeFile(event, 'resumeInfo2')} />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={1}>
								<InputGroup size="sm" className="mb-3">
									<FormControl placeholder="履歴書2名" value={resumeName2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="resumeName2" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">パスポート</InputGroup.Text>
										<InputGroup.Text id="inputGroup-sizing-sm" onClick={(event) => this.addFile(event, 'passportInfo')} ><FontAwesomeIcon icon={faFile} /> {this.state.passportInfoURL !== "" || this.state.passportInfo !== undefined ? "添付済み" : "添付"}</InputGroup.Text>
										<Form.File id="passportInfo" hidden data-browse="添付" value={this.state.passportInfo} custom onChange={(event) => this.changeFile(event, 'passportInfo')} />
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
						<div style={{ "textAlign": "center" }}>
							<Button size="sm" variant="info" onClick={this.updateEmployee} type="button" on>
								<FontAwesomeIcon icon={faEdit} /> 更新
							</Button>{' '}
							<Button size="sm" variant="info" type="reset">
								<FontAwesomeIcon icon={faUndo} /> リセット
                        </Button>
						</div>
					</Form.Group>
				</Form>
			</div>
		);
	}
}

export default employeeUpdate;

