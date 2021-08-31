import React from 'react';
import { Form, Button,ListGroup} from 'react-bootstrap';
import { faSave, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as publicUtils from './utils/publicUtils.js';
import * as utils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from 'axios';
import Clipboard from 'clipboard';
import TextField from '@material-ui/core/TextField';
import MyToast from './myToast';
import store from './redux/store';
import ErrorsMessageToast from './errorsMessageToast';
axios.defaults.withCredentials = true;

/**
 * 営業文章画面
 */
class salesContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initState;
	}

	initState = ({
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		myToastShow: false,// 状態ダイアログ
		employeeNo: this.props.sendValue.empNo,
		employeeName: '',
		genderStatus: '',
		nationalityName: '',
		age: '',
		developLanguage: '',
		yearsOfExperience: '',
		japaneseLevelName: '',
		hopeHighestPrice: '',
		beginMonth: '',
		salesProgressCode: this.props.sendValue.salesProgressCode,
		nearestStation: '',
		employeeStatus: '',
		japaneseLevelCode: '',
		englishLevelCode: '',
		japaneseLevellabal: '',
		englishLevellabal: '',
		siteRoleCode: '',
		unitPrice: this.props.sendValue.unitPrice,
		unitPriceShow: utils.addComma(this.props.sendValue.unitPrice),
		addDevelopLanguage: '',
		developLanguageCode6: null,
		developLanguageCode7: null,
		developLanguageCode8: null,
		developLanguageCode9: null,
		developLanguageCode10: null,
		developLanguageCode11: null,
		genders: store.getState().dropDown[0],
		employees: store.getState().dropDown[4],
		japaneseLevels: store.getState().dropDown[5],
		englishLevels: store.getState().dropDown[13],
		salesProgresss: store.getState().dropDown[16],
		japaneaseConversationLevels: store.getState().dropDown[43],
		englishConversationLevels: store.getState().dropDown[44],
		projectPhases: store.getState().dropDown[45],
		stations: store.getState().dropDown[14],
		developLanguages: store.getState().dropDown[8],
		developLanguagesShow: store.getState().dropDown[8],
		frameWorkShow: store.getState().dropDown[71],
		wellUseLanguagss: [],
		stationCode: '',
		disbleState: false,
		japaneaseConversationLevel: '',
		englishConversationLevel: '',
		projectPhaseCode: '0',
		remark: this.props.sendValue.remark,
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
		initDevelopLanguageCode11: null,
		initUnitPrice: '',
		initRemark: '',
		disableFlag: true,
		initWellUseLanguagss: [],
		projectPhase: '',
        errorsMessageShow: false,
        errorsMessageValue: '',
        message: '',
        type: '',
        tempDate:'',
		interviewDate: this.props.sendValue.salesProgressCode === "3" ? this.props.sendValue.interviewDate : "",
		admissionEndDate: this.props.sendValue.admissionEndDate,
	})
	
	componentDidMount() {
		this.setNewDevelopLanguagesShow();
		this.copyToClipboard();
		
		if(this.state.interviewDate !== ""){
			var myDate = new Date();
			myDate = myDate.getFullYear() + this.padding1((myDate.getMonth() + 1),2) + this.padding1(myDate.getDate(),2)
			if(this.state.interviewDate.substring(0,8) >= myDate){
				this.setState({
					interviewDate: " " + this.state.interviewDate.substring(4,6) + "/" + this.state.interviewDate.substring(6,8)
					+ " " + this.state.interviewDate.substring(8,10) + ":" + this.state.interviewDate.substring(10,12),
				})
			}else{
				this.setState({
					interviewDate: "",
				})
			}
		}
	}
	
	setNewDevelopLanguagesShow = () => {
		let developLanguagesTemp = [];
		for(let i = 0; i < this.state.developLanguagesShow.length; i++){
			developLanguagesTemp.push(this.state.developLanguagesShow[i]);
		}
		let frameWorkTemp = [];
		for(let i = 1; i < this.state.frameWorkShow.length; i++){
			developLanguagesTemp.push({code:String((Number(this.state.frameWorkShow[i].code) + 1) * -1),name:this.state.frameWorkShow[i].name});
		}
		let employees = [];
		for(let i in this.state.employees){
			employees.push(this.state.employees[i]);
		}
		if(this.props.sendValue.empNo.search("BP") !== -1){
			employees.push({code:String(this.state.employees.length),name:"1社先の社員"});
		}
		
		this.setState({
			developLanguagesShow: developLanguagesTemp,
			employees:employees,
		},()=>{
			this.init();
		});
    }
	
    padding1 = (num, length) => {
        for(var len = (num + "").length; len < length; len = num.length) {
            num = "0" + num;            
        }
        return num;
    }
	
	getNextMonth = (date, addMonths) => {
		// var dd = new Date();
		var m = date.getMonth() + 1;
		var y = date.getMonth() + 1 + addMonths > 12 ? (date.getFullYear() + 1) : date.getFullYear();
		if (m + addMonths == 0) {
			y = y - 1;
			m = 12;
		} else {
			if (m + addMonths > 12) {
				m = '01';
			} else {
				m = m + 1 <= 10 ? '0' + (m + addMonths) : (m + addMonths);
			}
		}
		return y + "/" + m;
	}
	
	// valueChange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	};

	// コピー
	copyToClipboard = () => {
		var clipboard = new Clipboard('#copyUrl', {
			text: function() {
				return document.getElementById('snippet').value.replace("　　　　営業文章\n","");
			}
		});
		clipboard.on('success', function() {
			console.log("已复制到剪贴板！");

		});
		clipboard.on('error', function() {
			console.log("err！");
		});
	};
	
	// 更新ボタン
	updateSalesSentence = () => {
		this.setState({tempDate:publicUtils.formateDate(this.state.beginMonth, false)},()=>{
			axios.post(this.state.serverIP + "salesSituation/updateSalesSentence", this.state)
			.then(result => {
				this.setNewDevelopLanguagesShow();
				this.setState({ 
					beginMonth: new Date(this.state.beginMonth).getTime(),
					myToastShow: true ,
					unitPrice: this.state.unitPriceShow,
					"type": "success", 
					"errorsMessageShow": false, 
					message: "処理成功"
					});
				setTimeout(() => this.setState({ myToastShow: false }), 3000);
			})
			.catch(function(error) {
				alert(error);
			});
		});
		this.props.allState.setValue(this.state.unitPrice,this.state.yearsOfExperience);
	}
	
	getStation = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let nearestStation = null;
			if (values !== null) {
				nearestStation = values.code;
			}
			this.setState({
				nearestStation: nearestStation,
				stationCode: nearestStation,
			})
		})
	}

	// 駅LOST FOCUS
	updateAddress = event => {
		this.setState({
			[event.target.name]: event.target.value,
			stationCode: event.target.value,
		})
		axios.post(this.state.serverIP + "salesSituation/updateEmployeeAddressInfo", { employeeNo: this.props.sendValue.empNo, stationCode: event.target.value })
			.then(result => {
				this.setState({ myToastShow: true });
				setTimeout(() => this.setState({ myToastShow: false }), 3000);
			})
			.catch(function(error) {
				alert(error);
			});
	};

	fromCodeToNameLanguage = (code) => {
		if (code === "" || code === null) {
			return;
		} else {
			return this.state.developLanguagesShow.find((v) => (v.code === code)).name;
		}
	}

	fromCodeToListLanguage = (code) => {
		if (code === "" || code === null) {
			return '';
		} else {
			return this.state.developLanguagesShow.find((v) => (v.code === code));
		}
	}

	getProjectPhase = (siteRoleCode) => {
		if (siteRoleCode === '2') {
			return '1';
		} else if (siteRoleCode === '3') {
			return '2';
		}
	}
	
	init = () => {
		axios.post(this.state.serverIP + "salesSituation/getPersonalSalesInfo", { employeeNo: this.props.sendValue.empNo })
			.then(result => {
				console.log(result.data);
				this.setState({
					employeeName: result.data[0].employeeFullName,
					projectPhase: result.data[0].projectPhase === null || result.data[0].projectPhase === "" || result.data[0].projectPhase === undefined ? this.getProjectPhase(result.data[0].siteRoleCode) : result.data[0].projectPhase,
					genderStatus: this.state.genders.find((v) => (v.code === result.data[0].genderStatus)).name,
					nationalityName: result.data[0].nationalityName,
					age: result.data[0].age === null || result.data[0].age === undefined ? "" : result.data[0].age,
					developLanguageCode6: result.data[0].developLanguage1,
					developLanguageCode7: result.data[0].developLanguage2,
					developLanguageCode8: result.data[0].developLanguage3,
					developLanguageCode9: result.data[0].developLanguage4,
					developLanguageCode10: result.data[0].developLanguage5,
					developLanguageCode11: result.data[0].developLanguage6,
					wellUseLanguagss: [this.fromCodeToListLanguage(result.data[0].developLanguage1),
					this.fromCodeToListLanguage(result.data[0].developLanguage2),
					this.fromCodeToListLanguage(result.data[0].developLanguage3),
					this.fromCodeToListLanguage(result.data[0].developLanguage4),
					this.fromCodeToListLanguage(result.data[0].developLanguage5),
					this.fromCodeToListLanguage(result.data[0].developLanguage6)].filter(function(s) {
						return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
					}),
					disbleState: this.fromCodeToListLanguage(result.data[0].developLanguage5) === '' ? false : true,
					developLanguage: [this.fromCodeToNameLanguage(result.data[0].developLanguage1),
					this.fromCodeToNameLanguage(result.data[0].developLanguage2),
					this.fromCodeToNameLanguage(result.data[0].developLanguage3),
					this.fromCodeToNameLanguage(result.data[0].developLanguage4),
					this.fromCodeToNameLanguage(result.data[0].developLanguage5),
					this.fromCodeToNameLanguage(result.data[0].developLanguage6)].filter(function(s) {
						return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
					}).join('、'),
					yearsOfExperience: result.data[0].yearsOfExperience === null || result.data[0].yearsOfExperience === undefined ? "" : result.data[0].yearsOfExperience,
					japaneaseConversationLevel: result.data[0].japaneaseConversationLevel,
					englishConversationLevel: result.data[0].englishConversationLevel,
					beginMonth: result.data[0].theMonthOfStartWork === null || result.data[0].theMonthOfStartWork === "" ? (!(this.state.admissionEndDate === null || this.state.admissionEndDate === undefined || this.state.admissionEndDate === "") ? new Date(this.getNextMonth(publicUtils.converToLocalTime(this.state.admissionEndDate, false),1)).getTime() : new Date(result.data[0].theMonthOfStartWork).getTime()) : new Date(result.data[0].theMonthOfStartWork).getTime(),
					nearestStation: result.data[0].nearestStation,
					stationCode: result.data[0].nearestStation,
					employeeStatus: result.data[0].employeeStatus,
					japaneseLevelCode: this.state.japaneseLevels.find((v) => (v.code === result.data[0].japaneseLevelCode)).name,
					englishLevelCode: this.state.englishLevels.find((v) => (v.code === result.data[0].englishLevelCode)).name,
					siteRoleCode: result.data[0].siteRoleCode,
					unitPrice: result.data[0].unitPrice === null || result.data[0].unitPrice=== "" || result.data[0].unitPrice=== undefined ? this.state.unitPrice : result.data[0].unitPrice,
					remark: result.data[0].remark === null || result.data[0].remark=== "" || result.data[0].remark=== undefined ? this.state.remark : result.data[0].remark,
					initAge: result.data[0].age,
					initNearestStation: result.data[0].nearestStation,
					initJapaneaseConversationLevel: result.data[0].japaneaseConversationLevel,
					initEnglishConversationLevel: result.data[0].englishConversationLevel,
					initYearsOfExperience: result.data[0].yearsOfExperience,
					initDevelopLanguageCode6: result.data[0].developLanguage1,
					initDevelopLanguageCode7: result.data[0].developLanguage2,
					initDevelopLanguageCode8: result.data[0].developLanguage3,
					initDevelopLanguageCode9: result.data[0].developLanguage4,
					initDevelopLanguageCode10: result.data[0].developLanguage5,
					initDevelopLanguageCode11: result.data[0].developLanguage6,
					initUnitPrice: result.data[0].unitPrice,
					initRemark: result.data[0].remark,
					initWellUseLanguagss: [this.fromCodeToListLanguage(result.data[0].developLanguage1),
					this.fromCodeToListLanguage(result.data[0].developLanguage2),
					this.fromCodeToListLanguage(result.data[0].developLanguage3),
					this.fromCodeToListLanguage(result.data[0].developLanguage4),
					this.fromCodeToListLanguage(result.data[0].developLanguage5),
					this.fromCodeToListLanguage(result.data[0].developLanguage6)].filter(function(s) {
						return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
					}),
				})
			})
	}

	setEndDate = (date) => {
		this.setState({
			beginMonth: date,
		});
	}
	
	onTagsChange = (event, values, fieldName) => {
		if (values.length === 6) {
			this.setState({
				disbleState: true,
			});
		} else {
			this.setState({
				disbleState: false,
			});
		}
		this.setState({
			developLanguageCode6: values.length >= 1 ? values[0].code : null,
			developLanguageCode7: values.length >= 2 ? values[1].code : null,
			developLanguageCode8: values.length >= 3 ? values[2].code : null,
			developLanguageCode9: values.length >= 4 ? values[3].code : null,
			developLanguageCode10: values.length >= 5 ? values[4].code : null,
			developLanguageCode11: values.length >= 6 ? values[5].code : null,
			wellUseLanguagss: [this.fromCodeToListLanguage(values.length >= 1 ? values[0].code : ''),
			this.fromCodeToListLanguage(values.length >= 2 ? values[1].code : ''),
			this.fromCodeToListLanguage(values.length >= 3 ? values[2].code : ''),
			this.fromCodeToListLanguage(values.length >= 4 ? values[3].code : ''),
			this.fromCodeToListLanguage(values.length >= 5 ? values[4].code : ''),
			this.fromCodeToListLanguage(values.length >= 6 ? values[5].code : '')].filter(function(s) {
				return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
			}),
		})
	}
	
    valueChangeMoney = event => {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            this.setState({
                [name]: utils.addComma(value),
                unitPrice: utils.deleteComma(value)
            });
        }
        )
    }

	render() {
		const { topCustomerInfo, stationCode, customerDepartmentList, accountInfo
            , actionType, topCustomer, errorsMessageValue, message, type, positionDrop, customerNo, backPage } = this.state;
		return (
			<div>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
	                 <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
	            </div>
{				<ListGroup>
					<ListGroup.Item style={{padding:".3rem 1.25rem"}}>【名　　前】：{this.state.employeeName}{'　'}{this.state.nationalityName}{'　'}{this.state.genderStatus}</ListGroup.Item>
					{/*<ListGroup.Item style={{padding:".3rem 1.25rem"}}>【所　　属】：{this.state.employeeStatus === "子会社社員" ? "社員" : this.state.employeeStatus}</ListGroup.Item>*/}
					<ListGroup.Item style={{padding:".3rem 1.25rem"}}>
					<span style={{ flexFlow: "nowrap" }}>【所　　属】：
				    <Form.Control as="select" style={{ display: "inherit", width: "150px", height: "30px" }} onChange={this.valueChange}
							name="employeeStatus" value={this.state.employeeStatus}
						>
							{this.state.employees.map(date =>
								<option key={date.code} value={date.code}>
									{date.name}
								</option>
							)}
						</Form.Control></span>
					</ListGroup.Item>
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item style={{padding:".3rem 1.25rem"}}>【年　　齢】：<input value={this.state.age} name="age"
						style={{ width: "45px" }} onChange={this.valueChange} className="inputWithoutBorder" />
					歳</ListGroup.Item></span>
					<ListGroup.Item style={{padding:".3rem 1.25rem"}}>
						<span style={{ flexFlow: "nowrap" }}>【最寄り駅】：
						<Autocomplete
						id="nearestStation"
						name="nearestStation"
						value={this.state.stations.find(v => v.code === this.state.nearestStation) || {}}
						onChange={(event, values) => this.getStation(event, values)}
						options={this.state.stations}
						getOptionLabel={(option) => option.name}
						renderInput={(params) => (
							<div ref={params.InputProps.ref}>
								<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-salesContent-station"
								/>
							</div>
						)}
					/>
				    </span>
					</ListGroup.Item>
					<ListGroup.Item style={{padding:".3rem 1.25rem"}}>
						<span style={{ flexFlow: "nowrap" }}>【日本　語】：
					    <Form.Control as="select" style={{ display: "inherit", width: "150px", height: "30px" }} onChange={this.valueChange}
								name="japaneaseConversationLevel" value={this.state.japaneaseConversationLevel}>
								{this.state.japaneaseConversationLevels.map(date =>
									<option key={date.code} value={date.code}>
										{date.name}
									</option>
								)}
							</Form.Control></span>
							&nbsp;&nbsp;{this.state.japaneseLevelCode}</ListGroup.Item>
					<ListGroup.Item style={{padding:".3rem 1.25rem"}}>
						<span style={{ flexFlow: "nowrap" }}>【英　　語】：
					    <Form.Control as="select" style={{ display: "inherit", width: "150px", height: "30px" }} onChange={this.valueChange}
								name="englishConversationLevel" value={this.state.englishConversationLevel}
							>
								{this.state.englishConversationLevels.map(date =>
									<option key={date.code} value={date.code}>
										{date.name}
									</option>
								)}
							</Form.Control></span>
						&nbsp;&nbsp;{this.state.englishLevelCode}</ListGroup.Item>
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item style={{padding:".3rem 1.25rem"}}>【業務年数】：<input value={this.state.yearsOfExperience} name="yearsOfExperience"
						style={{ width: "45px" }} onChange={this.valueChange} className="inputWithoutBorder" />
					年</ListGroup.Item></span>
					{<ListGroup.Item style={{padding:".3rem 1.25rem"}} hidden>【対応工程】：{this.state.projectPhase}</ListGroup.Item>}
					<ListGroup.Item style={{padding:".3rem 1.25rem"}}>
					<span style={{ flexFlow: "nowrap" }}>【対応工程】：
				    <Form.Control as="select" style={{ display: "inherit", width: "150px", height: "30px" }} onChange={this.valueChange}
							name="projectPhase" value={this.state.projectPhase}
						>
							{this.state.projectPhases.map(date =>
								<option key={date.code} value={date.code}>
									{date.name}
								</option>
							)}
						</Form.Control></span>
						&nbsp;&nbsp;{"から"}
					</ListGroup.Item>
					<ListGroup.Item style={{padding:".3rem 1.25rem"}}>【得意言語】：{this.state.developLanguage}
						<Autocomplete
							multiple
							id="tags-standard"
							options={this.state.developLanguagesShow}
							getOptionDisabled={option => this.state.disbleState}
							// getOptionDisabled={(option) => option ===
							// this.state.developLanguagesShow[0] || option ===
							// this.state.developLanguagesShow[2]}
							value={this.state.wellUseLanguagss}
							getOptionLabel={(option) => option.name ? option.name : ""}
							onChange={(event, values) => this.onTagsChange(event, values, 'customerName')}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="standard"
									label="言語追加"
									placeholder="言語追加"
									style={{ width: "400px", float: "right" }}
								/>
							)}
						/>
					</ListGroup.Item>
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item style={{padding:".3rem 1.25rem"}}>【単　　価】：<input value={this.state.unitPriceShow} name="unitPriceShow"
						style={{ width: "80px" }} onChange={this.valueChangeMoney} className="inputWithoutBorder" />円</ListGroup.Item></span>
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item style={{padding:".3rem 1.25rem"}}>【稼働開始】：
					{	
					(Number(this.state.admissionEndDate) + 1) < (this.getNextMonth(new Date(),1).replace("/","")) ? "即日":
					<DatePicker
							selected={this.state.beginMonth}
							onChange={this.setEndDate}
							autoComplete="off"
							locale="ja"
							showMonthYearPicker
							showFullMonthYearPicker
							className="form-control form-control-sm"
							dateFormat="yyyy/MM"
							id="datePicker"
							//disabled
						/>
					}
					</ListGroup.Item></span>
					<ListGroup.Item style={{padding:".3rem 1.25rem"}}><span style={{ flexFlow: "nowrap" }}>【営業状況】：
					    <Form.Control as="select" disabled style={{ display: "inherit", width: "145px", height: "30px" }} onChange={this.valueChange}
							name="salesProgressCode" value={this.state.salesProgressCode}
						>
							{this.state.salesProgresss.map(date =>
								<option key={date.code} value={date.code}>
									{date.name}
								</option>
							)}
						</Form.Control></span>
						{this.state.interviewDate}
					</ListGroup.Item>
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item style={{padding:".3rem 1.25rem"}}>【備　　考】：<input value={this.state.remark} name="remark"
						style={{ width: "60%" }} onChange={this.valueChange} className="inputWithoutBorder" /></ListGroup.Item></span>
				</ListGroup>}
				<div style={{ "display": "none" }}>
					<textarea ref={(textarea) => this.textArea = textarea} id="snippet"
						value={`　　　　営業文章
【名　　前】：`+ this.state.employeeName + `　` + this.state.nationalityName + `　` + this.state.genderStatus + `
【所　　属】：`+ (this.state.employeeStatus === "子会社社員" ? "社員" : this.state.employeeStatus) + (this.state.age === "" ? "" : `
【年　　齢】：`+ this.state.age + `歳`) + (this.state.nearestStation === "" || this.state.nearestStation === null ? "" :  `
【最寄り駅】：`+ (this.state.nearestStation !== "" && this.state.nearestStation !== null ? this.state.stations.find((v) => (v.code === this.state.nearestStation)).name : '')) + (this.state.japaneaseConversationLevel === "" || this.state.japaneaseConversationLevel === null ? "" :  `
【日本　語】：`+ (this.state.japaneaseConversationLevel !== "" && this.state.japaneaseConversationLevel !== null? this.state.japaneaseConversationLevels.find((v) => (v.code === this.state.japaneaseConversationLevel)).name : '')) + (this.state.englishConversationLevel === "" || this.state.englishConversationLevel === null ? "" :  `
【英　　語】：`+ (this.state.englishConversationLevel !== "" && this.state.englishConversationLevel !== null? this.state.englishConversationLevels.find((v) => (v.code === this.state.englishConversationLevel)).name : '')) +  (this.state.yearsOfExperience === "" ? "" : `
【業務年数】：`+ this.state.yearsOfExperience + `年`) + (this.state.projectPhase === "" || this.state.projectPhase === null  || this.state.projectPhase === undefined ? "" :  `
【対応工程】：`+ (this.state.projectPhase !== "" && this.state.projectPhase !== null && this.state.projectPhase !== undefined ? this.state.projectPhases.find((v) => (v.code === this.state.projectPhase)).name : '') + `から`) + (this.state.developLanguage === "" ? "" : `
【得意言語】：`+ this.state.developLanguage) + (this.state.unitPrice === "" ? "" : `
【単　　価】：`+ this.state.unitPrice + `万円`) + `
【稼働開始】：`+ /*(this.state.beginMonth !== "" && this.state.beginMonth !== null ? publicUtils.formateDate(this.state.beginMonth, false).substring(0,4) + "/" + */
((Number(this.state.admissionEndDate) + 1) < (this.getNextMonth(new Date(),1).replace("/","")) ? "即日":(publicUtils.formateDate(this.state.beginMonth, false).substring(4,6).replace(/\b(0+)/gi,"") + "月")) + (this.state.salesProgressCode === "" || this.state.salesProgressCode === null ? "" :  `
【営業状況】：`+ (this.state.salesProgressCode !== "" && this.state.salesProgressCode !== null ? this.state.salesProgresss.find((v) => (v.code === this.state.salesProgressCode)).name : '') + this.state.interviewDate) + (this.state.remark === " " ? "" : `
【備　　考】：`+ (this.state.remark !== " " && this.state.remark !== null ? this.state.remark : ''))}
					/></div>
				<div>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" onClick={this.updateSalesSentence.bind(this)} disabled={this.state.age !== this.state.initAge ||
							this.state.nearestStation !== this.state.initNearestStation ||
							this.state.japaneaseConversationLevel !== this.state.initJapaneaseConversationLevel ||
							this.state.englishConversationLevel !== this.state.initEnglishConversationLevel ||
							this.state.yearsOfExperience !== this.state.initYearsOfExperience ||
							this.state.unitPrice !== this.state.initUnitPrice ||
							this.state.remark !== this.state.initRemark ||
							this.state.wellUseLanguagss.sort().toString() !== this.state.initWellUseLanguagss.sort().toString() ? false : false}>
							<FontAwesomeIcon icon={faSave} /> {"更新"}</Button>{' '}
						<Button id='copyUrl' size="sm" variant="info" /* onClick={this.copyToClipboard} */>
							<FontAwesomeIcon icon={faCopy} /> {"コピー"}</Button></div>
				</div>
			</div>
		);
	}
}
export default salesContent;