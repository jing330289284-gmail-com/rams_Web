import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUndo, faSave } from '@fortawesome/free-solid-svg-icons';
import ja from 'date-fns/locale/ja';
import '../asserts/css/style.css';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
axios.defaults.withCredentials = true;

registerLocale('ja', ja);

//現場情報検索
class siteSearch extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}
	//初期化
	initialState = {
		customerNo: '',
		topCustomerNo: '',
		employeeName: '',
		selectedEmployeeNo: '',
		searchFlag: false,
		sendValue: null,
		currPage: '',
		scheduledEndDate: '',
		dataAcquisitionPeriod: '0',
		payOffRangeStatus: store.getState().dropDown[33],//　精算時間
		siteMaster: store.getState().dropDown[34],//　役割
		customerMaster: store.getState().dropDown[15].slice(1),//お客様
		topCustomerMaster: store.getState().dropDown[35].slice(1),//トップお客様
		developLanguageMaster: store.getState().dropDown[8].slice(1),//開発言語
		employeeInfo: store.getState().dropDown[9].slice(1),//社員名
		typeOfIndustryMaster: store.getState().dropDown[36].slice(1),//業種
		getstations: store.getState().dropDown[14].slice(1),//　場所 
		employeeStatuss: store.getState().dropDown[4],//　社員区分 
		typteOfContractStatus: store.getState().dropDown[65].slice(1),// 契約形態
		employeeInfoAll: store.getState().dropDown[9].slice(1),
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};
	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	
	/**
	 * タイプが違う時に、色々な操作をします。
	 */
	employeeStatusChange = event => {
		const value = event.target.value;
		let employeeInfoList = this.state.employeeInfoAll;
		if(value === '0'){
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) !== "BP" && employeeInfoList[i].code.substring(0,2) !== "SP" && employeeInfoList[i].code.substring(0,2) !== "SC"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList , employeeName: "" });
		} else if (value === '1') {
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) === "BP"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList, employeeName: ""  });
		} else if (value === '2') {
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) === "SP"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList, employeeName: ""  });
		} else if (value === '3') {
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) === "SC"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList, employeeName: ""  });
		} else {
			this.setState({ employeeInfo: employeeInfoList });
		}
		this.setState({ employeeStatus: value });
	}
	
	onchangeDataAcquisitionPeriod = event => {
		this.setState({
			[event.target.name]: event.target.value
		}, () => {
			if (this.state.dataAcquisitionPeriod === "1") {
				this.setState({
					admissionEndDate: '',
					admissionStartDate: '',
				})
			}
		})
	}
	//时间入力框初始值
	state = {
		admissionStartDate: new Date(),
		admissionEndDate: new Date()
	}
	componentDidMount() {
		$("#siteInfo").attr('disabled', true);
		if (this.props.location.state !== undefined) {
			var sendValue = this.props.location.state.sendValue;
			var searchFlag = this.props.location.state.searchFlag;
			this.giveValue(sendValue);
			this.setState({
				selectedEmployeeNo: this.props.location.state.employeeNo,
				currPage:this.props.location.state.currPage,
			}, () => {
				if (searchFlag) {
					this.siteSearch(sendValue);
				}
			})
		}else{
			this.siteSearch();
		}
	}
	giveValue = (sendValue) => {
		this.setState({
			customerNo: sendValue.customerNo,
			topCustomerNo: sendValue.topCustomerNo,
			bpCustomerNo: sendValue.bpCustomerNo,
			typeOfIndustryCode: sendValue.typeOfIndustryCode,
			admissionStartDate: sendValue.admissionStartDate,
			admissionEndDate: sendValue.admissionEndDate,
			siteRoleCode: sendValue.siteRoleCode,
			employeeForm: sendValue.employeeForm,
			developLanguageCode: sendValue.developLanguageCode,
			stationCode: sendValue.stationCode,
			employeeName: sendValue.employeeNo,
			payOffRange1: sendValue.payOffRange1,
			payOffRange2: sendValue.payOffRange2,
			employeeStatus: sendValue.employeeStatus,
			dataAcquisitionPeriod: sendValue.dataAcquisitionPeriod,
			scheduledEndDate: sendValue.scheduledEndDate,
		})
	}
	//　入場年月
	admissionStartDate = (date) => {
		if (date !== null) {
			this.setState({
				admissionStartDate: date,
			});
		} else {
			this.setState({
				admissionStartDate: '',
			});
		}
	};
	//　入場年月
	scheduledEndDate = (date) => {
		if (date !== null) {
			this.setState({
				scheduledEndDate: date,
			});
		} else {
			this.setState({
				scheduledEndDate: '',
			});
		}
	};
	//　退場年月
	admissionEndDate = (date) => {
		if (date !== null) {
			this.setState({
				admissionEndDate: date,
			});
		} else {
			this.setState({
				admissionEndDate: '',
			});
		}
	};
	//reset
	reset = () => {
		this.setState(() => this.resetStates);
	};
	//リセット　reset
	resetStates = {
		customerNo: '', topCustomerNo: '', bpCustomerNo: '', typeOfIndustryCode: '', admissionStartDate: '', admissionEndDate: '', siteRoleCode: '', employeeForm: '',
		developLanguageCode: '', stationCode: '', employeeName: '', payOffRange1: '', payOffRange2: '', employeeStatus: '', dataAcquisitionPeriod: '', scheduledEndDate: '',
	};
	//検索処理
	siteSearch = (sendValue) => {
		var SiteSearchModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function (i, item) {
			SiteSearchModel[item.name] = item.value;
		});
		SiteSearchModel["customerNo"] = this.state.customerNo;
		SiteSearchModel["topCustomerNo"] = this.state.topCustomerNo;
		SiteSearchModel["developLanguageCode"] = this.state.developLanguageCode;
		SiteSearchModel["employeeNo"] = this.state.employeeName;
		SiteSearchModel["bpCustomerNo"] = this.state.bpCustomerNo;
		SiteSearchModel["stationCode"] = this.state.stationCode;
		SiteSearchModel["typeOfIndustryCode"] = this.state.typeOfIndustryCode;
		SiteSearchModel["dataAcquisitionPeriod"] = this.state.dataAcquisitionPeriod;
		SiteSearchModel["typteOfContractCode"] = this.state.typteOfContract;
		SiteSearchModel["admissionStartDate"] = publicUtils.formateDate(this.state.admissionStartDate, true);
		SiteSearchModel["admissionEndDate"] = publicUtils.formateDate(this.state.admissionEndDate, true);
		SiteSearchModel["scheduledEndDate"] = publicUtils.formateDate(this.state.scheduledEndDate, false);
		if (!$.isEmptyObject(sendValue)) {
			SiteSearchModel = sendValue;
		}
		axios.post(this.state.serverIP + "getSiteSearchInfo", SiteSearchModel)
			.then(response => {
				if (response.data.errorsMessage != null || response.data.errorsMessage != undefined) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
					this.setState({
						siteData: [],
					})
				} else {
					if (response.data.data != null) {
						this.setState({
							siteData: response.data.data, "errorsMessageShow": false
						}, () => {
							this.refs.siteSearchTable.setState({
								selectedRowKeys: [],
								currPage: 1,
							})
							$('button[name="clickButton"]').attr('disabled', true);
							if (this.props.location.state !== "" && this.props.location.state !== undefined && !$.isEmptyObject(sendValue)) {
								// if(sendValue.dataAcquisitionPeriod === "1"){

								// }
								this.refs.siteSearchTable.setState({
									selectedRowKeys: this.state.selectedEmployeeNo,
									currPage: this.state.currPage,
								})
								$('button[name="clickButton"]').attr('disabled', false);
							}
						});
					} else {
						this.setState({
							siteData: [],
						})
					}
				}
				this.setState({
					searchFlag: true,
				})
			}).catch((error) => {
				console.error("Error - " + error);
			});
	}
	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}
	shuseiTo = (actionType) => {
		var path = {};
		var SiteSearchModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function (i, item) {
			SiteSearchModel[item.name] = item.value;
		});
		SiteSearchModel["customerNo"] = this.state.customerNo;
		SiteSearchModel["topCustomerNo"] = this.state.topCustomerNo;
		SiteSearchModel["developLanguageCode"] = this.state.developLanguageCode;
		SiteSearchModel["employeeNo"] = this.state.employeeName;
		SiteSearchModel["bpCustomerNo"] = this.state.bpCustomerNo;
		SiteSearchModel["stationCode"] = this.state.stationCode;
		SiteSearchModel["typeOfIndustryCode"] = this.state.typeOfIndustryCode;
		SiteSearchModel["dataAcquisitionPeriod"] = this.state.dataAcquisitionPeriod;
		SiteSearchModel["admissionStartDate"] = this.state.admissionStartDate;
		SiteSearchModel["admissionEndDate"] = this.state.admissionEndDate;
		SiteSearchModel["scheduledEndDate"] = this.state.scheduledEndDate;
		const sendValue = SiteSearchModel;
		switch (actionType) {
			case "siteInfo":
				path = {
					pathname: '/subMenuManager/siteInfo',
					state: {
						employeeNo: this.state.selectedEmployeeNo,
						backPage: "siteSearch",
						sendValue: sendValue,
						currPage: this.state.currPage,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
	}
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		$("#siteInfo").attr('disabled', false);
		if (isSelected) {
			this.setState({
				selectedEmployeeNo: row.employeeNo,
				currPage: this.refs.siteSearchTable.state.currPage,
			})
		} else {
			$("#siteInfo").attr('disabled', true);
			this.setState({
				selectedEmployeeNo: "",
				currPage: '',
			})
		}
	}
	getEmployeeNo = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let employeeName = null;
			if (values !== null) {
				employeeName = values.code;
			}
			this.setState({
				employeeName: employeeName,
			})
		})
	}
	getTypteOfContract = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let typteOfContract = null;
			if (values !== null) {
				typteOfContract = values.code;
			}
			this.setState({
				typteOfContract: typteOfContract,
			})
		})
	}
	
	getCustomer = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let customerNo = null;
			if (values !== null) {
				customerNo = values.code;
			}
			this.setState({
				customerNo: customerNo,
			})
		})
	}
	getTopCustomer = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let topCustomerNo = null;
			if (values !== null) {
				topCustomerNo = values.code;
			}
			this.setState({
				topCustomerNo: topCustomerNo,
			})
		})
	}
	getBpCustomer = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let bpCustomerNo = null;
			if (values !== null) {
				bpCustomerNo = values.code;
			}
			this.setState({
				bpCustomerNo: bpCustomerNo,
			})
		})
	}
	getStation = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let stationCode = null;
			if (values !== null) {
				stationCode = values.code;
			}
			this.setState({
				stationCode: stationCode,
			})
		})
	}
	getIndustry = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let typeOfIndustryCode = null;
			if (values !== null) {
				typeOfIndustryCode = values.code;
			}
			this.setState({
				typeOfIndustryCode: typeOfIndustryCode,
			})
		})
	}
	getDevelopLanguage = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let developLanguageCode = null;
			if (values !== null) {
				developLanguageCode = values.code;
			}
			this.setState({
				developLanguageCode: developLanguageCode,
			})
		})
	}
	render() {
		this.options = {
			page: 1,  // which page you want to show as default
			sizePerPage: 10,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
		};
		const { payOffRange1, payOffRange2, employeeStatus, employeeForm, siteData, siteRoleCode, dataAcquisitionPeriod, errorsMessageValue } = this.state;
		//テーブルの列の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,  // click to select, default is false
			onSelect: this.handleRowSelect,
		};
		return (
			<div >
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<div >
					<Form id="siteForm">
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>現場情報検索</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.employeeStatusChange.bind(this)} name="employeeStatus" value={employeeStatus} autoComplete="off">
											{this.state.employeeStatuss.map(data =>
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
											<InputGroup.Text id="fiveKanji">社員名(BP)</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="employeeName"
											name="employeeName"
											options={this.state.employeeInfo}
											getOptionLabel={(option) => option.text}
											value={this.state.employeeInfo.find(v => v.code === this.state.employeeName) || {}}
											onChange={(event, values) => this.getEmployeeNo(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														{option.name}
													</React.Fragment>
												)
											}}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：佐藤真一" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfoSearch-employeeNo"
													/>
												</div>
											)}
										/>
									</InputGroup>
								</Col>
							</Row>

							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="employeeForm" name="employeeForm" value={employeeForm}
											onChange={this.onchange}>
											<option value=""></option>
											<option value="0">在職</option>
											<option value="1">離職済み</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
										<Autocomplete
											id="customerNo"
											name="customerNo"
											options={this.state.customerMaster}
											getOptionLabel={(option) => option.name}
											value={this.state.customerMaster.find(v => v.code === this.state.customerNo) || {}}
											onChange={(event, values) => this.getCustomer(event, values)}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：ベース" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfoSearch-customerNo"
													/>
												</div>
											)}
										/>
										{/*<InputGroup.Text id="twoKanji">形態</InputGroup.Text>
										<Autocomplete
											id="typteOfContractStatus"
											name="typteOfContractStatus"
											options={this.state.typteOfContractStatus}
											getOptionLabel={(option) => option.name}
											value={this.state.typteOfContractStatus.find(v => v.code === this.state.typteOfContract) || {}}
											onChange={(event, values) => this.getTypteOfContract(event, values)}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo-customer"
													/>
												</div>
											)}
										/>*/}
								</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="sixKanji">トップお客様</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="topCustomerNo"
											name="topCustomerNo"
											value={this.state.topCustomerMaster.find(v => v.code === this.state.topCustomerNo) || {}}
											onChange={(event, values) => this.getTopCustomer(event, values)}
											options={this.state.topCustomerMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：富士通" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfoSearch-topCustomer"
													/>
												</div>
											)}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">BP会社</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="bpCustomerNo"
											name="bpCustomerNo"
											value={this.state.customerMaster.find(v => v.code === this.state.bpCustomerNo) || {}}
											onChange={(event, values) => this.getBpCustomer(event, values)}
											options={this.state.customerMaster}
											disabled={employeeStatus === "0" ? true : false}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：ベース" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfoSearch-bpCustomerNo"
													/>
												</div>
											)}
										/>
									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="stationCode"
											name="stationCode"
											value={this.state.getstations.find(v => v.code === this.state.stationCode) || {}}
											onChange={(event, values) => this.getStation(event, values)}
											options={this.state.getstations}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：秋葉原" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfoSearch-station"
													/>
												</div>
											)}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										{/*<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">業種</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="typeOfIndustryCode"
											name="typeOfIndustryCode"
											value={this.state.typeOfIndustryMaster.find(v => v.code === this.state.typeOfIndustryCode) || {}}
											onChange={(event, values) => this.getIndustry(event, values)}
											options={this.state.typeOfIndustryMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：保険" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfoSearch-customerNo"
													/>
												</div>
											)}
										/>*/}
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">形態</InputGroup.Text>
									</InputGroup.Prepend>
										<Autocomplete
											id="typteOfContractStatus"
											name="typteOfContractStatus"
											options={this.state.typteOfContractStatus}
											getOptionLabel={(option) => option.name}
											value={this.state.typteOfContractStatus.find(v => v.code === this.state.typteOfContract) || {}}
											onChange={(event, values) => this.getTypteOfContract(event, values)}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfoSearch-customerNo"
													/>
												</div>
											)}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm">
									<InputGroup.Prepend>
											<InputGroup.Text id="siteInfo-siteRoleCode">言語</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="developLanguageCode"
											name="developLanguageCode"
											value={this.state.developLanguageMaster.find(v => v.code === this.state.developLanguageCode) || {}}
											onChange={(event, values) => this.getDevelopLanguage(event, values)}
											options={this.state.developLanguageMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：vb" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfoSearch-developLanguageCode"
													/>
												</div>
											)}
										/>
										<InputGroup.Prepend>
											<InputGroup.Text id="siteInfo-siteRoleCode">役割</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="siteRoleCode" name="siteRoleCode" onChange={this.onchange} value={siteRoleCode} autoComplete="off">
											{this.state.siteMaster.map(date =>
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
											<InputGroup.Text id="fiveKanji">予定終了月</InputGroup.Text>
										</InputGroup.Prepend>
										<InputGroup.Prepend>
											<DatePicker
												selected={this.state.scheduledEndDate}
												onChange={this.scheduledEndDate}
												dateFormat="yyyy/MM"
												name="scheduledEndDate"
												showMonthYearPicker
												showFullMonthYearPicker
												showDisabledMonthNavigation
												className="form-control form-control-sm"
												id="scheduledEndDate"
												locale="ja"
												autoComplete="off"
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm">
										<InputGroup.Prepend>
											<InputGroup.Text id="fiveKanji">入場年月日</InputGroup.Text>
										</InputGroup.Prepend>
										<InputGroup.Prepend>
											<DatePicker
												selected={this.state.admissionStartDate}
												onChange={this.admissionStartDate}
												dateFormat="yyyy/MM/dd"
												name="admissionStartDate"
												className="form-control form-control-sm"
												id={this.state.dataAcquisitionPeriod === "1" ? "admissionStartDateReadOnly" : "admissionStartDate"}
												locale="ja"
												autoComplete="off"
												readOnly={this.state.dataAcquisitionPeriod === "1" ? true : false}
											/>〜
										<DatePicker
												selected={this.state.admissionEndDate}
												onChange={this.admissionEndDate}
												dateFormat="yyyy/MM/dd"
												name="admissionEndDate"
												className="form-control form-control-sm"
												id={this.state.dataAcquisitionPeriod === "1" ? "admissionStartDateReadOnly" : "admissionStartDate"}
												locale="ja"
												autoComplete="off"
												readOnly={this.state.dataAcquisitionPeriod === "1" ? true : false}
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">精算</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select"
											onChange={this.onchange}
											id="payOffRange1" name="payOffRange1" value={payOffRange1}
											autoComplete="off">
											{this.state.payOffRangeStatus.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
										〜
											<Form.Control as="select"
											onChange={this.onchange}
											id="payOffRange2" name="payOffRange2" value={payOffRange1 === '0' ? '0' : payOffRange2}
											autoComplete="off" disabled={payOffRange1 === '0' ? true : false} >
											{this.state.payOffRangeStatus.map(data =>
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
											<InputGroup.Text id="inputGroup-sizing-sm">単価</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl  maxLength="3"
										id="unitPrice1" name="unitPrice1" type="text" placeholder="万円" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										〜
										<FormControl  maxLength="3"
										id="unitPrice2" name="unitPrice2" type="text" placeholder="万円" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="fiveKanji">データ期間</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="dataAcquisitionPeriod" name="dataAcquisitionPeriod" value={dataAcquisitionPeriod}
											onChange={this.onchangeDataAcquisitionPeriod}>
											<option value="0">すべて</option>
											<option value="1">最新</option>
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>

							<div style={{ "textAlign": "center" }}>
								<Button size="sm" onClick={this.siteSearch.bind(this, null)} variant="info" id="toroku" type="button" color={{ background: '#5599FF' }}>
									<FontAwesomeIcon icon={faSearch} /> 検索
									</Button>{' '}
								<Button size="sm" type="reset" variant="info" onClick={this.reset}>
									<FontAwesomeIcon icon={faUndo} /> リセット
                                    </Button>

							</div>
						</Form.Group>
					</Form>
					<div>
						<Row >
							<Col sm={12}>
								<div style={{ "float": "left" }}>
									<Button size="sm" onClick={this.shuseiTo.bind(this, "siteInfo")} name="clickButton" id="siteInfo" variant="info"><FontAwesomeIcon icon={faSave} />現場情報登録</Button>
								</div>
							</Col>
						</Row>
					</div>
					<div>
						<Col sm={12}>
							<BootstrapTable ref="siteSearchTable"
								selectRow={selectRow} data={siteData} pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
								<TableHeaderColumn dataField='employeeNo' width='58' tdStyle={{ padding: '.45em' }} hidden isKey>社員番号</TableHeaderColumn>
								<TableHeaderColumn dataField='rowNo' width='58' tdStyle={{ padding: '.45em' }}>番号</TableHeaderColumn>
								<TableHeaderColumn dataField='employeeName' width="100" tdStyle={{ padding: '.45em' }} >氏名</TableHeaderColumn>
								<TableHeaderColumn dataField='employeeFrom' width='120' tdStyle={{ padding: '.45em' }}>所属</TableHeaderColumn>
								<TableHeaderColumn dataField='workDate' width='195' tdStyle={{ padding: '.45em' }} >期間</TableHeaderColumn>
								<TableHeaderColumn dataField='systemName' tdStyle={{ padding: '.45em' }} width='220'>システム名</TableHeaderColumn>
								<TableHeaderColumn dataField='station' width="90" tdStyle={{ padding: '.45em' }} >場所</TableHeaderColumn>
								<TableHeaderColumn dataField='customerName' width="150" tdStyle={{ padding: '.45em' }} >お客様</TableHeaderColumn>
								<TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }} width='70' >単価</TableHeaderColumn>
								<TableHeaderColumn dataField='developLanguageName' width="110" tdStyle={{ padding: '.45em' }} >言語</TableHeaderColumn>
								<TableHeaderColumn dataField='workTime' width="100" tdStyle={{ padding: '.45em' }} >勤務月数</TableHeaderColumn>
								<TableHeaderColumn dataField='siteRoleName' tdStyle={{ padding: '.45em' }} width='65' >役割</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</div>
				</div>
			</div >
		)
	}
}

export default siteSearch;
