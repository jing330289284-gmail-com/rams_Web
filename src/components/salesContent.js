import React from 'react';
import { Form, Button,ListGroup} from 'react-bootstrap';
import { faSave, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as publicUtils from './utils/publicUtils.js';
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
*営業文章画面
 */
class salesContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initState;
	}

	initState = ({
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		myToastShow: false,// 状態ダイアログ
		employeeNo: this.props.empNo,
		employeeName: '',
		genderStatus: '',
		nationalityName: '',
		age: '',
		developLanguage: '',
		yearsOfExperience: '',
		japaneseLevelName: '',
		hopeHighestPrice: '',
		beginMonth: '',
		salesProgressCode: '',
		nearestStation: '',
		employeeStatus: '',
		japaneseLevelCode: '',
		englishLevelCode: '',
		japaneseLevellabal: '',
		englishLevellabal: '',
		siteRoleCode: '',
		unitPrice: '',
		addDevelopLanguage: '',
		developLanguageCode6: null,
		developLanguageCode7: null,
		developLanguageCode8: null,
		developLanguageCode9: null,
		developLanguageCode10: null,
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
		wellUseLanguagss: [],
		stationCode: '',
		disbleState: false,
		japaneaseConversationLevel: '',
		englishConversationLevel: '',
		projectPhaseCode: '0',
		remark: '',
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
		projectPhase: '',
        errorsMessageShow: false,
        errorsMessageValue: '',
        message: '',
        type: '',
        tempDate:'',
	})
	
	componentDidMount() {
		this.init();
		var clipboard2 = new Clipboard('#copyUrl', {
			text: function() {
				return document.getElementById('snippet').value.replace("　　　　営業文章\n","");
			}
		});
		clipboard2.on('success', function() {
			console.log("已复制到剪贴板！");

		});
		clipboard2.on('error', function() {
			console.log("err！");
		});
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
	
	//　valueChange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	};

	//　コピー
	copyToClipboard = () => {
		let tempValue = this.textArea.value;
		var clipboard2 = new Clipboard('#copyUrl', {
			text: function() {
				return document.getValueById('snippet');
			}
		});
		clipboard2.on('success', function() {
			console.log("已复制到剪贴板！");

		});
		clipboard2.on('error', function() {
			console.log("已复制qqqqqqqqqqqqqqqqqqqq剪贴板！");
		});
	};

	//　更新ボタン
	updateSalesSentence = () => {
		this.setState({tempDate:publicUtils.formateDate(this.state.beginMonth, false)},()=>{
			axios.post(this.state.serverIP + "salesSituation/updateSalesSentence", this.state)
			.then(result => {
				this.init();
				this.setState({ 
					beginMonth: new Date(this.state.beginMonth).getTime(),
					myToastShow: true ,
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
	}

	//　駅LOST FOCUS
	updateAddress = event => {
		this.setState({
			[event.target.name]: event.target.value,
			stationCode: event.target.value,
		})
		axios.post(this.state.serverIP + "salesSituation/updateEmployeeAddressInfo", { employeeNo: this.props.empNo, stationCode: event.target.value })
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

	getProjectPhase = (siteRoleCode) => {
		if (siteRoleCode === '2') {
			this.setState({
				projectPhase: '基本設計',
			})
		} else if (siteRoleCode === '3') {
			this.setState({
				projectPhase: '詳細設計',
			})
		}
	}
	
	init = () => {
		axios.post(this.state.serverIP + "salesSituation/getPersonalSalesInfo", { employeeNo: this.props.empNo })
			.then(result => {
				console.log(result.data);
				if (result.data[0].age === "") {
					this.getProjectPhase(result.data[0].siteRoleCode);
					this.setState({
						employeeName: result.data[0].employeeFullName,
						genderStatus: this.state.genders.find((v) => (v.code === result.data[0].genderStatus)).name,
						nationalityName: result.data[0].nationalityName,
						age: publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
							Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) / 31536000000),
						developLanguage: result.data[0].developLanguage,
						yearsOfExperience: result.data[0].yearsOfExperience,
						beginMonth: new Date(this.getNextMonth(new Date(),1)).getTime(),
						salesProgressCode: result.data[0].salesProgressCode,
						nearestStation: result.data[0].nearestStation,
						stationCode: result.data[0].nearestStation,
						employeeStatus: result.data[0].employeeStatus === ""? "":this.state.employees.find((v) => (v.code === result.data[0].employeeStatus)).name,
						japaneseLevelCode: result.data[0].japaneseLevelCode === "" ?"":this.state.japaneseLevels.find((v) => (v.code === result.data[0].japaneseLevelCode)).name,
						englishLevelCode: result.data[0].englishLevelCode === ""? "":this.state.englishLevels.find((v) => (v.code === result.data[0].englishLevelCode)).name,
						siteRoleCode: result.data[0].siteRoleCode,
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
					})
				} else {
					this.getProjectPhase(result.data[0].siteRoleCode);
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
						disbleState: this.fromCodeToListLanguage(result.data[0].developLanguage5) === '' ? false : true,
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
						beginMonth: new Date(result.data[0].theMonthOfStartWork).getTime(),
						salesProgressCode: result.data[0].salesProgressCode,
						nearestStation: result.data[0].nearestStation,
						stationCode: result.data[0].nearestStation,
						employeeStatus: this.state.employees.find((v) => (v.code === result.data[0].employeeStatus)).name,
						japaneseLevelCode: this.state.japaneseLevels.find((v) => (v.code === result.data[0].japaneseLevelCode)).name,
						englishLevelCode: this.state.englishLevels.find((v) => (v.code === result.data[0].englishLevelCode)).name,
						siteRoleCode: result.data[0].siteRoleCode,
						unitPrice: result.data[0].unitPrice,
						remark: result.data[0].remark,
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
						initUnitPrice: result.data[0].unitPrice,
						initRemark: result.data[0].remark,
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
	}

	setEndDate = (date) => {
		this.setState({
			beginMonth: date,
		});
	}
	
	onTagsChange = (event, values, fieldName) => {
		if (values.length === 5) {
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
			wellUseLanguagss: [this.fromCodeToListLanguage(values.length >= 1 ? values[0].code : ''),
			this.fromCodeToListLanguage(values.length >= 2 ? values[1].code : ''),
			this.fromCodeToListLanguage(values.length >= 3 ? values[2].code : ''),
			this.fromCodeToListLanguage(values.length >= 4 ? values[3].code : ''),
			this.fromCodeToListLanguage(values.length >= 5 ? values[4].code : '')].filter(function(s) {
				return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
			}),
		})
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
				<ListGroup>
					<ListGroup.Item width="200px">【名　　前】：{this.state.employeeName}{'　　　'}{this.state.nationalityName}{'　　　'}{this.state.genderStatus}</ListGroup.Item>
					<ListGroup.Item>【所　　属】：{this.state.employeeStatus}</ListGroup.Item>
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item>【年　　齢】：<input value={this.state.age} name="age"
						style={{ width: "25px" }} onChange={this.valueChange} className="inputWithoutBorder" />
					歳</ListGroup.Item></span>
					<ListGroup.Item>
						<span style={{ flexFlow: "nowrap" }}>【最寄り駅】：
					    <Form.Control as="select" style={{ display: "inherit", width: "150px", height: "35px" }} onChange={this.updateAddress}
								name="nearestStation" value={this.state.nearestStation}>
								{this.state.stations.map(date =>
									<option key={date.code} value={date.code}>
										{date.name}
									</option>
								)}
							</Form.Control></span>
					</ListGroup.Item>
					<ListGroup.Item>
						<span style={{ flexFlow: "nowrap" }}>【日本　語】：
					    <Form.Control as="select" style={{ display: "inherit", width: "150px", height: "35px" }} onChange={this.valueChange}
								name="japaneaseConversationLevel" value={this.state.japaneaseConversationLevel}>
								{this.state.japaneaseConversationLevels.map(date =>
									<option key={date.code} value={date.code}>
										{date.name}
									</option>
								)}
							</Form.Control></span>
							&nbsp;&nbsp;{this.state.japaneseLevelCode}</ListGroup.Item>
					<ListGroup.Item>
						<span style={{ flexFlow: "nowrap" }}>【英　　語】：
					    <Form.Control as="select" style={{ display: "inherit", width: "150px", height: "35px" }} onChange={this.valueChange}
								name="englishConversationLevel" value={this.state.englishConversationLevel}
							>
								{this.state.englishConversationLevels.map(date =>
									<option key={date.code} value={date.code}>
										{date.name}
									</option>
								)}
							</Form.Control></span>
						&nbsp;&nbsp;{this.state.englishLevelCode}</ListGroup.Item>
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item>【業務年数】：<input value={this.state.yearsOfExperience} name="yearsOfExperience"
						style={{ width: "25px" }} onChange={this.valueChange} className="inputWithoutBorder" />
					年</ListGroup.Item></span>
					<ListGroup.Item>【対応工程】：{this.state.projectPhase}</ListGroup.Item>
					<ListGroup.Item width="200px">【得意言語】：{this.state.developLanguage}
						<Autocomplete
							multiple
							id="tags-standard"
							options={this.state.developLanguagesShow}
							getOptionDisabled={option => this.state.disbleState}
							//getOptionDisabled={(option) => option === this.state.developLanguagesShow[0] || option === this.state.developLanguagesShow[2]}
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
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item width="200px">【単　　価】：<input value={this.state.unitPrice} name="unitPrice"
						style={{ width: "30px" }} onChange={this.valueChange} className="inputWithoutBorder" />万円</ListGroup.Item></span>
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item>【稼働開始】：
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
						/>
					</ListGroup.Item></span>
					<ListGroup.Item><span style={{ flexFlow: "nowrap" }}>【営業状況】：
					    <Form.Control as="select" disabled style={{ display: "inherit", width: "145px", height: "35px" }} onChange={this.valueChange}
							name="salesProgressCode" value={this.state.salesProgressCode}
						>
							{this.state.salesProgresss.map(date =>
								<option key={date.code} value={date.code}>
									{date.name}
								</option>
							)}
						</Form.Control></span>
					</ListGroup.Item>
					<span style={{ flexFlow: "nowrap" }}><ListGroup.Item>【備　　考】：<input value={this.state.remark} name="remark"
						style={{ width: "60%" }} onChange={this.valueChange} className="inputWithoutBorder" /></ListGroup.Item></span>
				</ListGroup>
				<div style={{ "display": "none" }}>
					<textarea ref={(textarea) => this.textArea = textarea} id="snippet"
						value={`　　　　営業文章
【名　　前】：`+ this.state.employeeName + `　　　` + this.state.nationalityName + `　　　` + this.state.genderStatus + `
【所　　属】：`+ this.state.employeeStatus + `
【年　　齢】：`+ this.state.age + `歳
【最寄り駅】：`+ (this.state.nearestStation !== "" && this.state.nearestStation !== null? this.state.stations.find((v) => (v.code === this.state.nearestStation)).name : '') + `
【日本　語】：`+ (this.state.japaneaseConversationLevel !== "" && this.state.japaneaseConversationLevel !== null? this.state.japaneaseConversationLevels.find((v) => (v.code === this.state.japaneaseConversationLevel)).name : '') + `
【英　　語】：`+ (this.state.englishConversationLevel !== "" && this.state.englishConversationLevel !== null? this.state.englishConversationLevels.find((v) => (v.code === this.state.englishConversationLevel)).name : '') + `
【業務年数】：`+ this.state.yearsOfExperience + `年
【対応工程】：`+ this.state.projectPhase + `
【得意言語】：`+ this.state.developLanguage + `
【単　　価】：`+ this.state.unitPrice + `万円
【稼働開始】：2020/09
【営業状況】：`+ (this.state.salesProgressCode !== "" && this.state.salesProgressCode !== null ? this.state.salesProgresss.find((v) => (v.code === this.state.salesProgressCode)).name : '') + `
【備　　考】：`+ this.state.remark}
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
							this.state.wellUseLanguagss.sort().toString() !== this.state.initWellUseLanguagss.sort().toString() ? false : false/*false : true*/}>
							<FontAwesomeIcon icon={faSave} /> {"更新"}</Button>{' '}
						<Button id='copyUrl' size="sm" variant="info" /*onClick={this.copyToClipboard}*/>
							<FontAwesomeIcon icon={faCopy} /> {"コピー"}</Button></div>
				</div>
			</div>
		);
	}
}
export default salesContent;