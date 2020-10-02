import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faEdit } from '@fortawesome/free-solid-svg-icons';
import ja from 'date-fns/locale/ja';
import '../asserts/css/style.css';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';

registerLocale('ja', ja);

class siteInfo extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}
	initialState = {
		payOffRange1: '0',
		payOffRange2: '0',
		workState: '0',
		siteMaster: [],
		payOffRangeStatus: [],
		topCustomerMaster: [],
		levelMaster: [],
		customerMaster: [],
		developLanguageMaster: [],
		typeOfIndustryMaster: [], // 業種
		employeeInfo: [],
		employeeName: '',
		getstations: [], // 場所
		myToastShow: false,
		errorsMessageShow: false,
		updateFlag: true,//修正flag
		insertFlag: true,//登陆flag

	};

	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	state = {
		admissionStartDate: new Date(),
		admissionEndDate: new Date()
	}
	//　入場年月
	admissionStartDate = (date) => {
		this.setState(
			{
				admissionStartDate: date,
				time: publicUtils.getFullYearMonth(date, new Date())
			}
		);
	};
	//　退場年月
	admissionEndDate = (date) => {
		this.setState(
			{
				admissionEndDate: date,
			}
		);
	};
	//全部のドロップダウン
	getDropDowns = () => {
		var methodArray = ["getPayOffRange", "getSiteMaster", "getLevel", "getCustomer", "getTopCustomer", "getDevelopLanguage", "getEmployeeName", "getTypeOfIndustry", "getStation"]
		var data = publicUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				payOffRangeStatus: data[0].slice(1),//　精算時間
				siteMaster: data[1],//　役割
				levelMaster: data[2],//　レベル
				customerMaster: data[3].slice(1),//お客様
				topCustomerMaster: data[4].slice(1),//トップお客様
				developLanguageMaster: data[5].slice(1),//開発言語
				employeeInfo: data[6].slice(1),//社員名
				typeOfIndustryMaster: data[7].slice(1),//業種
				getstations: data[8].slice(1),//　場所 
			}
		);
	};
	// 页面加载
	componentDidMount() {
		this.getDropDowns();//全部のドロップダウン
	}
	//reset
	reset = () => {
		this.setState(() => this.resetStates);
	};
	//リセット　reset
	resetStates = {
		admissionStartDate: '',
		admissionEndDate: '',
		systemName: '',
		location: '',
		customerNo: '',
		topCustomerNo: '',
		developLanguageCode: '',
		unitPrice: '',
		payOffRange1: '0',
		payOffRange2: '0',
		siteRoleCode: '',
		levelCode: '',
		siteManager: '',
		typeOfIndustryCode: '',
		remark: '',
		related1Employees: '',
		related2Employees: '',
		related3Employees: '',
		related4Employees: '',
		workState: '0'
	};

	// AUTOSELECT select事件
	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
				siteData: [],
			})
		} else {
			if (this.state.customerMaster.find((v) => (v.name === value)) !== undefined ||
				this.state.topCustomerMaster.find((v) => (v.name === value)) !== undefined ||
				this.state.getstations.find((v) => (v.name === value)) !== undefined ||
				this.state.typeOfIndustryMaster.find((v) => (v.name === value)) !== undefined ||
				this.state.developLanguageMaster.find((v) => (v.name === value)) !== undefined ||
				this.state.employeeInfo.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'employeeName':
						this.refs.table.setState({
							selectedRowKeys: []
						});
						axios.post("http://127.0.0.1:8080/getSiteInfo", { employeeName: publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo) })
							.then(response => {
								if (response.data != null) {
									this.setState({
										siteData: response.data,
										employeeName: value,
										insertFlag: false,
										updateFlag: true
									});
								}
							}).catch((error) => {
								console.error("Error - " + error);
							});
						break;
					case 'customerNo':
						this.setState({
							customerNo: value,
						})
						break;
					case 'topCustomerNo':
						this.setState({
							topCustomerNo: value,
						})
						break;
					case 'location':
						this.setState({
							location: value,
						})
						break;
					case 'typeOfIndustryCode':
						this.setState({
							typeOfIndustryCode: value,
						})
						break;
					case 'developLanguageCode':
						this.setState({
							developLanguageCode: value,
						})
						break;
					default:
				}
			}
		}

	};
	// レコードselect事件
	handleRowSelect = (row, isSelected) => {
		if (isSelected) {
			if (row.workDate === this.state.siteData[this.state.siteData.length - 1].workDate) {
				this.setState({
					admissionStartDate: row.admissionStartDate === null ? '' : new Date(publicUtils.converToLocalTime(row.admissionStartDate, true)),
					admissionEndDate: row.admissionEndDate === null ? '' : new Date(publicUtils.converToLocalTime(row.admissionEndDate, true)),
					workState: row.admissionEndDate === null ? '0' : '1',
					systemName: row.systemName === null ? '' : row.systemName,
					location: row.location === null ? '' : row.location,
					customerNo: row.customerName === null ? '' : row.customerName,
					topCustomerNo: row.topCustomerName === null ? '' : row.topCustomerName,
					developLanguageCode: row.developLanguageName === null ? '' : row.developLanguageName,
					unitPrice: row.unitPrice === null ? '' : row.unitPrice,
					payOffRange1: row.payOffRange1 === null ? '' : row.payOffRange1,
					payOffRange2: row.payOffRange2 === null ? '' : row.payOffRange2,
					siteRoleCode: row.siteRoleName === null ? '' : row.siteRoleCode,
					levelCode: row.levelName === null ? '' : row.levelCode,
					siteManager: row.siteManager === null ? '' : row.siteManager,
					typeOfIndustryCode: row.typeOfIndustryName === null ? '' : row.typeOfIndustryName,
					remark: row.remark === null ? '' : row.remark,
					related1Employees: row.related1Employees === null ? '' : row.related1Employees,
					related2Employees: row.related2Employees === null ? '' : row.related2Employees,
					related3Employees: row.related3Employees === null ? '' : row.related3Employees,
					related4Employees: row.related4Employees === null ? '' : row.related4Employees,
					updateFlag: false,
					insertFlag: true

				});
			}
			else {
				this.setState(() => this.resetStates);
				this.setState({
					updateFlag: true,
					insertFlag: false
				})
			}
		} else {
			this.setState(() => this.resetStates);
			this.setState({
				updateFlag: true,
				insertFlag: false
			})
		}
	}
	//登録処理
	tokuro = () => {
		var siteModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function(i, item) {
			siteModel[item.name] = item.value;
		});
		siteModel["customerNo"] = publicUtils.labelGetValue($("#customerNo").val(), this.state.customerMaster)
		siteModel["topCustomerNo"] = publicUtils.labelGetValue($("#topCustomerNo").val(), this.state.topCustomerMaster)
		siteModel["developLanguageCode"] = publicUtils.labelGetValue($("#developLanguageCode").val(), this.state.developLanguageMaster)
		siteModel["employeeNo"] = publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo)
		siteModel["location"] = publicUtils.labelGetValue($("#location").val(), this.state.getstations)
		siteModel["typeOfIndustryCode"] = publicUtils.labelGetValue($("#typeOfIndustryCode").val(), this.state.typeOfIndustryMaster)
		if (this.state.siteData.length > 0) {
			siteModel["checkDate"] = this.state.siteData[this.state.siteData.length - 1].admissionEndDate
		} else {
			siteModel["checkDate"] = "1";
		}
		axios.post("http://127.0.0.1:8080/insertSiteInfo", siteModel)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "post", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					window.location.reload();
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	}
	//修正処理
	update = () => {
		var siteModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function(i, item) {
			siteModel[item.name] = item.value;
		});
		siteModel["customerNo"] = publicUtils.labelGetValue($("#customerNo").val(), this.state.customerMaster)
		siteModel["topCustomerNo"] = publicUtils.labelGetValue($("#topCustomerNo").val(), this.state.topCustomerMaster)
		siteModel["developLanguageCode"] = publicUtils.labelGetValue($("#developLanguageCode").val(), this.state.developLanguageMaster)
		siteModel["employeeNo"] = publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo)
		siteModel["location"] = publicUtils.labelGetValue($("#location").val(), this.state.getstations)
		siteModel["typeOfIndustryCode"] = publicUtils.labelGetValue($("#typeOfIndustryCode").val(), this.state.typeOfIndustryMaster)
		if (this.state.siteData.length > 1) {
			siteModel["checkDate"] = this.state.siteData[this.state.siteData.length - 2].admissionEndDate
		} else {
			siteModel["checkDate"] = "1";
		}
		siteModel["workDate"] = this.state.siteData[this.state.siteData.length - 1].admissionStartDate
		axios.post("http://127.0.0.1:8080/updateSiteInfo", siteModel)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "put", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					window.location.reload();
				}
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
	render() {
		this.options = {
			page: 1,  // which page you want to show as default
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
		};
		const { payOffRange1, payOffRange2, workState, siteData, siteRoleCode, levelCode, time, errorsMessageValue, systemName, unitPrice, related1Employees, related2Employees, related3Employees, related4Employees, remark, siteManager } = this.state;
		//テーブルの列の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,  // click to select, default is false
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		return (
			<div style={{ "background": "#f5f5f5" }}>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.method === "put" ? "修正成功！" : "登録成功！"} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<div style={{ "background": "#f5f5f5" }}>
					<Form id="siteForm">
						<Form.Group>
							{/* <Row>
                    <Col sm={3}></Col>
                    <Col sm={7}> <img className="mb-4" alt="title" src={title}/> </Col>
                    </Row> */}
							<Row inline="true">
								<Col className="text-center">
									<h2>現場情報</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="employeeName"
											name="employeeName"
											options={this.state.employeeInfo}
											getOptionLabel={(option) => option.name}
											value={this.state.employeeInfo.find(v => v.name === this.state.employeeName) || {}}
											onSelect={(event) => this.handleTag(event, 'employeeName')}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：佐藤真一" type="text" {...params.inputProps} className="auto"
														style={{ width: 181, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>
									</InputGroup>
								</Col>
							</Row>

							<Row>
								<Col sm={4}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">入場年月日</InputGroup.Text>
										</InputGroup.Prepend>
										<InputGroup.Prepend>
											<DatePicker
												selected={this.state.admissionStartDate}
												onChange={this.admissionStartDate}
												dateFormat="yyyy/MM/dd"
												name="admissionStartDate"
												className="form-control form-control-sm"
												id="admissionStartDate"
												autoComplete="off"
												locale="ja"
												id={this.state.employeeName !== '' ? "admissionEndDate" : "siteDatePickerReadonlyDefault"}
												disabled={this.state.employeeName === '' ? true : false}
											/>
										</InputGroup.Prepend>
										<FormControl id="time" name="time" value={time} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
										<font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
									</InputGroup>
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">現場状態</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="workState" name="workState" value={workState}
											onChange={this.onchange} disabled={this.state.employeeName === '' ? true : false}>
											<option value="0">稼働中</option>
											<option value="1">終了</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">退場年月日</InputGroup.Text>
										</InputGroup.Prepend>
										<InputGroup.Prepend>
											<DatePicker
												selected={this.state.admissionEndDate}
												onChange={this.admissionEndDate}
												dateFormat="yyyy/MM/dd"
												name="admissionEndDate"
												className="form-control form-control-sm"
												id="admissionEndDate"
												locale="ja"
												autoComplete="off"
												id={this.state.workState !== "0" ? "admissionEndDate" : "siteDatePickerReadonlyDefault"}
												disabled={this.state.workState === "0" ? true : false}
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>

								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">システム名</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="systemName" name="systemName" type="text" placeholder="例：請求システム" onChange={this.onchange} value={systemName} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
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
											id="location"
											name="location"
											value={this.state.getstations.find(v => v.name === this.state.location) || {}}
											onSelect={(event) => this.handleTag(event, 'location')}
											options={this.state.getstations}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：秋葉原" type="text" {...params.inputProps} className="auto"
														style={{ width: 200, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": this.state.employeeName === '' ? "#e9ecef" : "" }} />
												</div>
											)}
											disabled={this.state.employeeName === '' ? true : false}
										/>
									</InputGroup>

								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="customerNo"
											name="customerNo"
											options={this.state.customerMaster}
											getOptionLabel={(option) => option.name}
											value={this.state.customerMaster.find(v => v.name === this.state.customerNo) || {}}
											onSelect={(event) => this.handleTag(event, 'customerNo')}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：ベース" type="text" {...params.inputProps} className="auto"
														style={{ width: 186, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": this.state.employeeName === '' ? "#e9ecef" : "" }} />
												</div>
											)}
											disabled={this.state.employeeName === '' ? true : false}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">トップお客様</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="topCustomerNo"
											name="topCustomerNo"
											value={this.state.topCustomerMaster.find(v => v.name === this.state.topCustomerNo) || {}}
											onSelect={(event) => this.handleTag(event, 'topCustomerNo')}
											options={this.state.topCustomerMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：富士通" type="text" {...params.inputProps} className="auto"
														style={{ width: 145, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": this.state.employeeName === '' ? "#e9ecef" : "" }} />
												</div>
											)}
											disabled={this.state.employeeName === '' ? true : false}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="developLanguageCode"
											name="developLanguageCode"
											value={this.state.developLanguageMaster.find(v => v.name === this.state.developLanguageCode) || {}}
											onSelect={(event) => this.handleTag(event, 'developLanguageCode')}
											options={this.state.developLanguageMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：Java" type="text" {...params.inputProps} className="auto"
														style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": this.state.employeeName === '' ? "#e9ecef" : "" }} />
												</div>
											)}
											disabled={this.state.employeeName === '' ? true : false}
										/>
									</InputGroup>
								</Col>
							</Row>

							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">&emsp;単&emsp;価&emsp;</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="unitPrice" name="unitPrice" type="text" placeholder="単価" onChange={this.onchange} value={unitPrice} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">万円</InputGroup.Text>
										</InputGroup.Prepend>
										<font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
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
											autoComplete="off" disabled={this.state.employeeName === '' ? true : false}>
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

								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="siteRoleCode" name="siteRoleCode" onChange={this.onchange} value={siteRoleCode} autoComplete="off" disabled={this.state.employeeName === '' ? true : false}>
											{this.state.siteMaster.map(date =>
												<option key={date.code} value={date.code}>
													{date.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">評価</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="levelCode" name="levelCode" onChange={this.onchange} value={levelCode} autoComplete="off" disabled={this.state.employeeName === '' ? true : false}>
											{this.state.levelMaster.map(date =>
												<option key={date.code} value={date.code}>
													{date.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">責任者</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="siteManager" name="siteManager" type="text" placeholder="例：田中" onChange={this.onchange} value={siteManager} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
									</InputGroup>
								</Col>
							</Row>

							<Row>
								<Col sm={6}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">関連社員</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="related1Employees" name="related1Employees" type="text" placeholder="例：田中" onChange={this.onchange} value={related1Employees} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
										<FormControl id="related2Employees" name="related2Employees" type="text" placeholder="例：田中" onChange={this.onchange} value={related2Employees} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
										<FormControl id="related3Employees" name="related3Employees" type="text" placeholder="例：田中" onChange={this.onchange} value={related3Employees} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
										<FormControl id="related4Employees" name="related4Employees" type="text" placeholder="例：田中" onChange={this.onchange} value={related4Employees} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">業種</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="typeOfIndustryCode"
											name="typeOfIndustryCode"
											value={this.state.typeOfIndustryMaster.find(v => v.name === this.state.typeOfIndustryCode) || {}}
											onSelect={(event) => this.handleTag(event, 'typeOfIndustryCode')}
											options={this.state.typeOfIndustryMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：保険" type="text" {...params.inputProps} className="auto"
														style={{ width: 200, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": this.state.employeeName === '' ? "#e9ecef" : "" }} />
												</div>
											)}
											disabled={this.state.employeeName === '' ? true : false}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="remark" name="remark" type="text" placeholder="例：java十年経験" onChange={this.onchange} value={remark} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
									</InputGroup>
								</Col>
							</Row>

							<div style={{ "textAlign": "center" }}>
								<Button size="sm" onClick={this.tokuro} variant="info" id="toroku" type="button" disabled={this.state.insertFlag === true ? true : false}>
									<FontAwesomeIcon icon={faSave} /> 登録
								</Button>{' '}
								<Button size="sm" type="reset" variant="info" onClick={this.reset}>
									<FontAwesomeIcon icon={faUndo} /> リセット
                                    </Button>
							</div>
						</Form.Group>
					</Form>
					<Row>
						<Col sm={10}>
						</Col>
						<Col sm={2}>
							<div style={{ "float": "right" }}>
								<Button variant="info" size="sm" id="revise" onClick={this.update} disabled={this.state.updateFlag === true ? true : false}><FontAwesomeIcon icon={faEdit} />修正</Button>
							</div>
						</Col>
					</Row>
					<div>
						<BootstrapTable selectRow={selectRow} data={siteData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn dataField='workDate' width='90' tdStyle={{ padding: '.45em' }} headerAlign='center' isKey>期間</TableHeaderColumn>
							<TableHeaderColumn dataField='systemName' width='58' tdStyle={{ padding: '.45em' }} headerAlign='center'>システム</TableHeaderColumn>
							<TableHeaderColumn dataField='location' width='45' tdStyle={{ padding: '.45em' }} headerAlign='center'>場所</TableHeaderColumn>
							<TableHeaderColumn dataField='customerName' width='58' tdStyle={{ padding: '.45em' }} headerAlign='center'>お客様</TableHeaderColumn>
							<TableHeaderColumn dataField='siteManager' width='60' tdStyle={{ padding: '.45em' }} headerAlign='center'>責任者</TableHeaderColumn>
							<TableHeaderColumn dataField='unitPrice' width='30' tdStyle={{ padding: '.45em' }}>単価</TableHeaderColumn>
							<TableHeaderColumn dataField='developLanguageName' width='50' tdStyle={{ padding: '.45em' }} headerAlign='center'>言語</TableHeaderColumn>
							<TableHeaderColumn dataField='siteRoleName' width='30' tdStyle={{ padding: '.45em' }}>役割</TableHeaderColumn>
							<TableHeaderColumn dataField='levelName' width='30' tdStyle={{ padding: '.45em' }}>評価</TableHeaderColumn>
							<TableHeaderColumn dataField='admissionStartDate' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='admissionEndDate' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='payOffRange1' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='payOffRange2' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='related1Employees' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='related2Employees' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='related3Employees' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='related4Employees' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='typeOfIndustryName' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='topCustomerName' hidden={true} ></TableHeaderColumn>
							<TableHeaderColumn dataField='remark' width='70' tdStyle={{ padding: '.45em' }} headerAlign='center'>備考</TableHeaderColumn>
						</BootstrapTable>
					</div>
				</div>
			</div >
		)
	}
}

export default siteInfo;

