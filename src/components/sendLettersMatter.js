import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Form, Button, Col, Row, InputGroup, Modal, FormControl} from 'react-bootstrap';
import { faGlasses, faEnvelope, faUserPlus , faLevelUpAlt, faTrash, faFile} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import MailMatter from './mailMatter';
import store from './redux/store';
import SalesEmpAddPopup from './salesEmpAddPopup';
import $ from "jquery";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
axios.defaults.withCredentials = true;

/**
 * 営業送信お客確認画面
 */
class sendLettersMatter extends React.Component {
	constructor(props) {
		super(props);
		this.valueChange = this.valueChange.bind(this);
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
		greetinTtext:'弊社案件を御紹介致します。\n対応可能な方がいらっしゃいましたら是非ご連絡ください。',
		matterText:'',
		birthday: '',
		stationName: '',
		developLanguage: '',
		yearsOfExperience: '',
		japaneseLevelName: '',
		beginMonth: '',
		salesProgressCode: '',
		remark: '',
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
			if(this.props.location.state.projectNo !== null && this.props.location.state.projectNo !== undefined && this.props.location.state.projectNo !== ''){
				var projectInfoModel = {
			            projectNo: this.props.location.state.projectNo,
			            theSelectProjectperiodStatus: '0',
			        }
			        axios.post(this.state.serverIP + "projectInfoSearch/search", projectInfoModel)
			            .then(result => {
			                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
		                        var payOffRange = "";
		                        var unitPriceRange = "";
		                        var projectPhase = "";
		                        var keyWordOfLanagurueName = "";
			                	if(result.data.projectInfoList[0].payOffRangeLowest !== undefined && result.data.projectInfoList[0].payOffRangeLowest !== null && 
			                            result.data.projectInfoList[0].payOffRangeHighest !== undefined && result.data.projectInfoList[0].payOffRangeHighest !== null){
			                            payOffRange = (result.data.projectInfoList[0].payOffRangeLowest === "0" ? "固定" : result.data.projectInfoList[0].payOffRangeLowest) 
			                                                + "-" + (result.data.projectInfoList[0].payOffRangeHighest === "0" ? "固定" : result.data.projectInfoList[0].payOffRangeHighest) 
			                        }
			                    if(result.data.projectInfoList[0].unitPriceRangeLowest !== undefined && result.data.projectInfoList[0].unitPriceRangeLowest !== null && result.data.projectInfoList[0].unitPriceRangeLowest !== ''|| 
			                            result.data.projectInfoList[0].unitPriceRangeHighest !== undefined && result.data.projectInfoList[0].unitPriceRangeHighest !== null  && result.data.projectInfoList[0].unitPriceRangeHighest !== ''){
			                                unitPriceRange = result.data.projectInfoList[0].unitPriceRangeLowest + "万円~" + result.data.projectInfoList[0].unitPriceRangeHighest + "万円";
			                        }
			                    if(result.data.projectInfoList[0].projectPhaseStart !== undefined && result.data.projectInfoList[0].projectPhaseStart !== null && result.data.projectInfoList[0].projectPhaseStart !== ''){
			                            projectPhase = result.data.projectInfoList[0].projectPhaseNameStart + "~" + result.data.projectInfoList[0].projectPhaseNameEnd;
			                        }


			                    if(result.data.projectInfoList[0].keyWordOfLanagurueName1 !== undefined && result.data.projectInfoList[0].keyWordOfLanagurueName1 !== null && result.data.projectInfoList[0].keyWordOfLanagurueName1 !== ''){
			                    	keyWordOfLanagurueName += result.data.projectInfoList[0].keyWordOfLanagurueName1 + ",";
		                        }
			                    if(result.data.projectInfoList[0].keyWordOfLanagurueName2 !== undefined && result.data.projectInfoList[0].keyWordOfLanagurueName2 !== null && result.data.projectInfoList[0].keyWordOfLanagurueName2 !== ''){
			                    	keyWordOfLanagurueName += result.data.projectInfoList[0].keyWordOfLanagurueName2 + ",";
		                        }
			                    if(result.data.projectInfoList[0].keyWordOfLanagurueName3 !== undefined && result.data.projectInfoList[0].keyWordOfLanagurueName3 !== null && result.data.projectInfoList[0].keyWordOfLanagurueName3 !== ''){
			                    	keyWordOfLanagurueName += result.data.projectInfoList[0].keyWordOfLanagurueName3 + ",";
		                        }
			                    if(keyWordOfLanagurueName.length > 0){
			                    	keyWordOfLanagurueName = keyWordOfLanagurueName.substring(0,keyWordOfLanagurueName.lastIndexOf(","));
			                    }
			        			this.setState({
			        				matterText:
			        					"■業務名：" + result.data.projectInfoList[0].projectName + "\n" +
			        					"■業務内容：\n　" + result.data.projectInfoList[0].projectInfoDetail.replace(/\n/g,"\n　") + "\n" + "\n" +
			        					"■スキル要件：" + 
			        					(keyWordOfLanagurueName === "" ? "" : ("\n　· " + keyWordOfLanagurueName)) + 
			        					(result.data.projectInfoList[0].requiredItem1 === "" ? "" : ("\n　· " + result.data.projectInfoList[0].requiredItem1)) +
			        					(result.data.projectInfoList[0].requiredItem2 === "" ? "" : ("\n　· " + result.data.projectInfoList[0].requiredItem2)) +
			        					"\n" + 
			        					(unitPriceRange ===  "" ? "" : ("\n■月額単金：" + unitPriceRange)) +
			        					(payOffRange ===  "" ? "" : ("\n■清算範囲：" + payOffRange)) +
			        					((result.data.projectInfoList[0].recruitmentNumbers === null || result.data.projectInfoList[0].recruitmentNumbers ===  "") ? "" : ("\n■募集人数：" + (result.data.projectInfoList[0].recruitmentNumbers === null ? "" : result.data.projectInfoList[0].recruitmentNumbers))) +
			        					((result.data.projectInfoList[0].admissionPeriod === null || result.data.projectInfoList[0].admissionPeriod ===  "") && (result.data.projectInfoList[0].projectPeriodName === null || result.data.projectInfoList[0].projectPeriodName ===  "") ? "" : ("\n■稼動時期：" + result.data.projectInfoList[0].admissionPeriod + "~" + result.data.projectInfoList[0].projectPeriodName)) +
			        					((result.data.projectInfoList[0].siteLocationName === null || result.data.projectInfoList[0].siteLocationName ===  "") ? "" : ("\n■勤務地：" + (result.data.projectInfoList[0].siteLocationName === null ? "" : result.data.projectInfoList[0].siteLocationName))) +
			        					(projectPhase ===  "" ? "" : ("\n■作業工程：" + projectPhase)) +
			        					((result.data.projectInfoList[0].nationalityName === null || result.data.projectInfoList[0].nationalityName ===  "") && (result.data.projectInfoList[0].japaneaseConversationName === null || result.data.projectInfoList[0].japaneaseConversationName ===  "") ? "" : ("\n■国籍：" + (result.data.projectInfoList[0].nationalityName === null ? "" : (result.data.projectInfoList[0].nationalityName + "、" + result.data.projectInfoList[0].japaneaseConversationName))))  +
			        					((result.data.projectInfoList[0].noOfInterviewName === null || result.data.projectInfoList[0].noOfInterviewName ===  "") ? "" : ("\n■面談回数：" + (result.data.projectInfoList[0].noOfInterviewName === null ? "" : result.data.projectInfoList[0].noOfInterviewName))) +
			        					((result.data.projectInfoList[0].remark === null || result.data.projectInfoList[0].remark ===  "") ? "" : ("\n■備考：" + (result.data.projectInfoList[0].remark === null ? "" : result.data.projectInfoList[0].remark))),
			        				mailTitle: result.data.projectInfoList[0].projectName,
			        			})
			                } else {
			                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
			                }
			            })
			            .catch(error => {
			                alert("检索错误，请检查程序");
			            });
			}else{
				this.setState({
    				matterText:
    					"■業務名：" + "" + "\n" +
    					"■業務内容：\n　" + "\n" + "\n" +
    					"■スキル要件：\n　· " + "" + "\n" + "\n" +
    					"■月額単金：" + "" + "\n" +
    					"■清算範囲：" + "" + "\n" +
    					"■募集人数：" + "" + "\n" +
    					"■稼動時期：" + "" + "\n" +
    					"■勤務地：" + "" + "\n" +
    					"■作業工程：" + "" + "\n" +
    					"■国籍：" + ""  + "\n" +
    					"■面談回数：" + "" + "\n" +
    					"■備考：" + "",
    				mailTitle: "",
				})
			}
		}
		/* 要員追加機能の新規 20201216 張棟 END */
		// メールデータが取る
		this.getMail();
		this.getLoginUserInfo();

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
	
	// 送信処理
	beforeSendMailWithFile = () => {
		var mailText = this.state.matterText;
		mailText = mailText.replace(/\n/g,"<br>");        // i9及以上
		this.sendMailWithFile(mailText);

		// this.sendMailWithFile();
	}

	// 送信処理
	sendMailWithFile = (mailText) => {
		for(let i = 0; i < this.state.selectedCusInfos.length; i++){
			const mailConfirmContont = this.state.selectedCusInfos[i].customerName + `株式会社<br/>
				`+ this.state.selectedCusInfos[i].purchasingManagers + `様<br/>
				<br/>
				お世話になっております、LYC`+ this.state.loginUserInfo[0].employeeFristName + `です。<br/>
				<br/>`
				+ this.state.greetinTtext.replace(/\n/g,"<br>") +
				`<br/><br/>`
				+ mailText +`<br/><br/>
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
						selectedmail = this.state.selectedCusInfos[i].purchasingManagersMail/*
																							 * +
																							 * "," +
																							 * this.state.selectedCusInfos[i].purchasingManagersMail2
																							 */;
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
	
	openDaiolog = () => {
		this.setState({
			daiologShowFlag: true,
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
			initUnitPrice: '',
			initRemark: '',
			initWellUseLanguagss: [],
		});
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

	handleCtmSelect = (row, isSelected, e) => {
		this.setState({
			selectedCustomerName: isSelected ? row.customerName : '',
			selectedPurchasingManagers: isSelected ? row.purchasingManagers : '',
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

	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
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
		const {backPage, errorsMessageValue, message, type,} = this.state;
		
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

		const selectRow1 = {
			mode: "radio",
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			onSelect: this.handleCtmSelect,
		};
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
						<MailMatter personalInfo={this} />
					</Modal.Body>
				</Modal>
				<Row inline="true">
					<Col className="text-center">
						<h2>案件送信確認</h2>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
				<Row style={{ padding: "10px" }}>
					<Col sm={1}></Col>
					<Col sm={3}>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">タイトル</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl
	                            value={this.state.mailTitle}
	                            name="mailTitle"
	                            onChange={this.valueChange}
							></FormControl>
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
				<Row style={{ padding: "10px" }}><Col sm={1}></Col><Col sm={1}>案件情報</Col>

				</Row>
				<Row>
					<Col sm={1}></Col>
					<Col sm={10}>
						<InputGroup size="sm" className="mb-3">
							<textarea ref={(textarea) => this.textArea = textarea} value = {this.state.matterText}  id="matterText" name="matterText" 
								onChange={this.valueChange}
								style={{ height: '300px', width: '90%', resize: 'none'}}
							/>
						</InputGroup>
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
							<Button onClick={this.openDaiolog} size="sm" variant="info" name="clickButton" disabled={this.state.selectRow1Flag ? false:true}><FontAwesomeIcon icon={faGlasses} />メール確認</Button>{" "}
							<Button onClick={this.beforeSendMailWithFile} size="sm" variant="info" disabled={this.state.mailTitle === "" ? true:false}><FontAwesomeIcon icon={faEnvelope} /> {"送信"}</Button></div>
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
							<TableHeaderColumn width='17%' dataField='purchasingManagersOthers' editable={false}>追加者</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='sendOver' editable={false}>送信状況</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
			</div>

		);
	}
}
export default sendLettersMatter;