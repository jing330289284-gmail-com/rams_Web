import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUndo } from '@fortawesome/free-solid-svg-icons';
import ja from 'date-fns/locale/ja';
import '../asserts/css/style.css';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';

registerLocale('ja', ja);

class siteSearch extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}
	//初期化
	initialState = {
		payOffRange1: '0',// 単価1
		payOffRange2: '0',// 単価2
		siteMaster: [],// 役割
		payOffRangeStatus: [],// 精算時間
		topCustomerMaster: [],// トップお客様
		customerMaster: [],// お客様
		developLanguageMaster: [], // 開発言語
		getstations: [], // 場所
		typeOfIndustryMaster: [], // 業種
		employeeStatuss: [], // 社員区分
		customerNo: '',
		topCustomerNo: '',
		employeeInfo: [],
		employeeName: '',

	};

	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	//时间入力框初始值
	state = {
		admissionStartDate: new Date(),
		admissionEndDate: new Date()
	}
	//　入場年月
	admissionStartDate = (date) => {
		this.setState(
			{
				admissionStartDate: date,
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
		var methodArray = ["getPayOffRange", "getSiteMaster", "getStation", "getCustomer", "getTopCustomer", "getDevelopLanguage", "getTypeOfIndustry", "getEmployee", "getEmployeeName"]
		var data = publicUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				payOffRangeStatus: data[0].slice(1),//　精算時間
				siteMaster: data[1],//　役割
				getstations: data[2].slice(1),//　場所 
				customerMaster: data[3].slice(1),//お客様
				topCustomerMaster: data[4].slice(1),//トップお客様
				developLanguageMaster: data[5].slice(1),//開発言語
				typeOfIndustryMaster: data[6].slice(1),//業種
				employeeStatuss: data[7],// 社員区分
				employeeInfo: data[8].slice(1)//社員名
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
		customerNo: '', topCustomerNo: '', bpCustomerNo: '', typeOfIndustryCode: '',
		developLanguageCode: '', stationCode: '', employeeName: ''
	};

	// AUTOSELECT select事件
	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
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
						this.setState({
							employeeName: value,
						})
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
					case 'bpCustomerNo':
						this.setState({
							bpCustomerNo: value,
						})
						break;
					case 'stationCode':
						this.setState({
							stationCode: value,
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
	//検索処理
	tokuro = () => {
		var SiteSearchModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function(i, item) {
			SiteSearchModel[item.name] = item.value;
		});
		SiteSearchModel["customerNo"] = publicUtils.labelGetValue($("#customerNo").val(), this.state.customerMaster)
		SiteSearchModel["topCustomerNo"] = publicUtils.labelGetValue($("#topCustomerNo").val(), this.state.topCustomerMaster)
		SiteSearchModel["developLanguageCode"] = publicUtils.labelGetValue($("#developLanguageCode").val(), this.state.developLanguageMaster)
		SiteSearchModel["employeeName"] = publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo)
		SiteSearchModel["bpCustomerNo"] = publicUtils.labelGetValue($("#bpCustomerNo").val(), this.state.customerMaster)
		SiteSearchModel["stationCode"] = publicUtils.labelGetValue($("#stationCode").val(), this.state.getstations)
		SiteSearchModel["typeOfIndustryCode"] = publicUtils.labelGetValue($("#typeOfIndustryCode").val(), this.state.typeOfIndustryMaster)
		if ($("#dataAcquisitionPeriod").val() === '1') {
			SiteSearchModel["dataAcquisitionPeriod"] = publicUtils.setFullYearMonth(new Date());
		}

		axios.post("http://127.0.0.1:8080/getSiteSearchInfo", SiteSearchModel)
			.then(response => {
				if (response.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
				}
				if (response.data.data != null) {
					this.setState({
						siteData: response.data.data, "errorsMessageShow": false
					});
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
		const { payOffRange1, payOffRange2, employeeStatus, employeeForm, siteData, siteRoleCode, dataAcquisitionPeriod, errorsMessageValue } = this.state;
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
			<div >
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<div >
					<Form id="siteForm">
						<Form.Group>
							{/* <Row>
                    <Col sm={3}></Col>
                    <Col sm={7}> <img className="mb-4" alt="title" src={title}/> </Col>
                    </Row> */}
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
											<InputGroup.Text id="inputGroup-sizing-sm">社員・BP名</InputGroup.Text>
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
														style={{ width: 140, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.onchange} name="employeeStatus" value={employeeStatus} autoComplete="off">
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
											<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="employeeForm" name="employeeForm" value={employeeForm}
											onChange={this.onchange}>
											<option value="">選択くだいさい</option>
											<option value="0">在職</option>
											<option value="1">離職済み</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
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
							</Row>

							<Row>
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
														style={{ width: 186, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
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
														style={{ width: 145, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
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
											value={this.state.customerMaster.find(v => v.name === this.state.bpCustomerNo) || {}}
											onSelect={(event) => this.handleTag(event, 'bpCustomerNo')}
											options={this.state.customerMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：ベース" type="text" {...params.inputProps} className="auto"
														style={{ width: 181, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="stationCode"
											name="stationCode"
											value={this.state.getstations.find(v => v.name === this.state.stationCode) || {}}
											onSelect={(event) => this.handleTag(event, 'stationCode')}
											options={this.state.getstations}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：秋葉原" type="text" {...params.inputProps} className="auto"
														style={{ width: 200, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
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
														style={{ width: 200, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>
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
										<FormControl id="unitPrice1" name="unitPrice1" type="text" placeholder="万円" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										〜
										<FormControl id="unitPrice2" name="unitPrice2" type="text" placeholder="万円" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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
														style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>
									</InputGroup>
								</Col>
							</Row>

							<Row>
								<Col sm={5}>
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
												locale="ja"
												autoComplete="off"
												disabled={this.state.dataAcquisitionPeriod === "1" ? true : false}
											/>〜
										<DatePicker
												selected={this.state.admissionEndDate}
												onChange={this.admissionEndDate}
												dateFormat="yyyy/MM/dd"
												name="admissionEndDate"
												className="form-control form-control-sm"
												id="admissionEndDate"
												locale="ja"
												autoComplete="off"
												disabled={this.state.dataAcquisitionPeriod === "1" ? true : false}
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">データ期間</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="dataAcquisitionPeriod" name="dataAcquisitionPeriod" value={dataAcquisitionPeriod}
											onChange={this.onchange}>
											<option value="">すべて</option>
											<option value="1">最新(システム年月)</option>
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>

							<div style={{ "textAlign": "center" }}>
								<Button size="sm" onClick={this.tokuro} variant="info" id="toroku" type="button" color={{ background: '#5599FF' }}>
									<FontAwesomeIcon icon={faSearch} /> 検索
									</Button>{' '}
								<Button size="sm" type="reset" variant="info" onClick={this.reset}>
									<FontAwesomeIcon icon={faUndo} /> リセット
                                    </Button>

							</div>
						</Form.Group>
					</Form>
					<div>
						<BootstrapTable selectRow={selectRow} data={siteData} pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn dataField='rowNo' width='58' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
							<TableHeaderColumn dataField='employeeFrom' width='80' tdStyle={{ padding: '.45em' }} headerAlign='center'>所属</TableHeaderColumn>
							<TableHeaderColumn dataField='workDate' width='203' tdStyle={{ padding: '.45em' }} headerAlign='center'>期間</TableHeaderColumn>
							<TableHeaderColumn dataField='employeeName' tdStyle={{ padding: '.45em' }} headerAlign='center'>氏名</TableHeaderColumn>
							<TableHeaderColumn dataField='systemName' tdStyle={{ padding: '.45em' }} width='120' eaderAlign='center'>システム名</TableHeaderColumn>
							<TableHeaderColumn dataField='station' tdStyle={{ padding: '.45em' }} eaderAlign='center'>場所</TableHeaderColumn>
							<TableHeaderColumn dataField='customerName' tdStyle={{ padding: '.45em' }} eaderAlign='center'>お客様</TableHeaderColumn>
							<TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }} width='70' eaderAlign='center'>単価</TableHeaderColumn>
							<TableHeaderColumn dataField='developLanguageName' tdStyle={{ padding: '.45em' }} eaderAlign='center'>言語</TableHeaderColumn>
							<TableHeaderColumn dataField='workTime' tdStyle={{ padding: '.45em' }} >勤務時間</TableHeaderColumn>
							<TableHeaderColumn dataField='siteRoleName' tdStyle={{ padding: '.45em' }} width='65' eaderAlign='center'>役割</TableHeaderColumn>
						</BootstrapTable>
					</div>
				</div>
			</div >
		)
	}
}

export default siteSearch;

