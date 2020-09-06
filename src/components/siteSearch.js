import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import ja from 'date-fns/locale/ja';
import '../asserts/css/style.css';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';

registerLocale('ja', ja);

class siteSearch extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}
	initialState = {
		payOffRange1: '',// 単価1
		payOffRange2: '',// 単価2
		siteMaster: [],// 役割
		payOffRangeStatus: [],// 精算時間
		topCustomerMaster: [],// トップお客様
		customerMaster: [],// お客様
		developLanguageMaster: [], // 開発言語
		getstations: [], // 場所
		typeOfIndustryMaster: [], // 業種
		employeeStatuss: [], // 社員区分
		customer:''
	};

	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	fixed = event => {
		$("#payOffRange2").prop('disabled', false);
		this.onchange(event);
		if (event.target.value === "0") {
			this.setState({ "payOffRange2": event.target.value })
			$("#payOffRange2").prop('disabled', true);
		}
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
		var methodArray = ["getPayOffRange", "getSiteMaster", "getStation", "getCustomer", "getTopCustomer", "getDevelopLanguage", "getTypeOfIndustry", "getEmployee"]
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

			}
		);
	};
	// 页面加载
	componentDidMount() {
		var employeeName = this.props.employeeName//父画面のパラメータ（社員名）
		this.setState({ "employeeName": employeeName })
		this.getDropDowns();//全部のドロップダウン
		axios.post("http://127.0.0.1:8080/getSiteInfo", { employeeNo: "LYC001" })
			.then(response => {
				if (response.data != null) {
					this.setState({
						siteData: response.data
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	}
	//登録処理
	tokuro = () => {
		if ($("#payOffRange2").val() < $("#payOffRange1").val()) {
			alert("正しい期間を選択してください");
			return false;
		}
		if ('0' != $("#payOffRange1").val()) {
			if ($("#payOffRange2").val() === $("#payOffRange1").val()) {
				alert("固定を選択してくださいます");
				return false;
			}
		}
		var siteModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function(i, item) {
			siteModel[item.name] = item.value;
		});
		siteModel["customerNo"] = publicUtils.labelGetValue($("#customerNo").val(), this.state.customerMaster)
		siteModel["topCustomerNo"] = publicUtils.labelGetValue($("#topCustomerNo").val(), this.state.topCustomerMaster)
		siteModel["developLanguageCode"] = publicUtils.labelGetValue($("#developLanguageCode").val(), this.state.developLanguageMaster)
		siteModel["updateUser"] = sessionStorage.getItem('employeeNo');
		siteModel["employeeNo"] = this.props.employeeNo;
		axios.post("http://127.0.0.1:8080/insertSiteInfo", siteModel)
			.then(function(result) {
				if (result.data === true) {
					alert("登录完成");
					sessionStorage.setItem('actionType', 'update');
				} else {
					alert("登录错误，请检查程序");
				}
			})
			.catch(function(error) {
				alert("登录错误，请检查程序");
			});
	}
	render() {
		this.options = {
			page: 1,  // which page you want to show as default
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: 'まえ', // Previous page button text
			nextPage: 'つぎ', // Next page button text
			firstPage: '最初', // First page button text
			lastPage: '最後', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
		};
		const { payOffRange1, payOffRange2, employeeStatus, employeeForm, siteData, employeeName, siteRoleCode, customer, topCustomer, developLanguage, stationCode, typeOfIndustryCode, dataAcquisitionPeriod } = this.state;
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
				<div style={{ "background": "#f5f5f5" }}>
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
										<FormControl id="employeeName" name="employeeName" placeholder="例：田中" value={employeeName} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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
											<option>選択してくだいさい</option>
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
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="お客様名" type="text" {...params.inputProps}
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
											value={topCustomer}
											options={this.state.topCustomerMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="トップお客様名" type="text" {...params.inputProps}
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
											id="customerNo"
											name="customerNo"
											value={customer}
											options={this.state.customerMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="BP会社名" type="text" {...params.inputProps}
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
											value={stationCode}
											onChange={this.onchange}
											options={this.state.getstations}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="駅名" type="text" {...params.inputProps}
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
											value={typeOfIndustryCode}
											onChange={this.onchange}
											options={this.state.typeOfIndustryMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="業種" type="text" {...params.inputProps}
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
											onChange={this.fixed}
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
											id="payOffRange2" name="payOffRange2" value={payOffRange2}
											autoComplete="off" disabled>
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
											<InputGroup.Text id="inputGroup-sizing-sm">&emsp;単&emsp;価&emsp;</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="unitPrice" name="unitPrice" type="text" placeholder="万円" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										〜
										<FormControl id="unitPrice" name="unitPrice" type="text" placeholder="万円" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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
											value={developLanguage}
											options={this.state.developLanguageMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="開発言語" type="text" {...params.inputProps}
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
											/>〜
										<DatePicker
												selected={this.state.admissionEndDate}
												onChange={this.admissionEndDate}
												dateFormat="yyyy/MM/dd"
												name="admissionEndDate"
												className="form-control form-control-sm"
												id="admissionEndDate"
												locale="ja"
												disabled={this.state.workState === "0" ? true : false}
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
											<option value="0">すべて</option>
											<option value="1">最新(システム年月)</option>
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>

							<Row>
								<Col sm={4}></Col>
								<Col sm={2} className="text-center">
									<Button size="sm" type="reset" variant="info" >
										<FontAwesomeIcon icon={faUndo} /> リセット
                                    </Button>
								</Col>
								<Col sm={2} className="text-center">
									<Button size="sm" onClick={this.tokuro} variant="info" id="toroku" type="button">
										<FontAwesomeIcon icon={faSave} /> 検索
									</Button>
								</Col>
							</Row>
						</Form.Group>
					</Form>
					<div>
						<BootstrapTable selectRow={selectRow} data={siteData} pagination={true} options={this.options} >
							<TableHeaderColumn dataField='No' width='58' isKey>番号</TableHeaderColumn>
							<TableHeaderColumn dataField='No' width='80' headerAlign='center'>所属</TableHeaderColumn>
							<TableHeaderColumn dataField='workDate' width='203' headerAlign='center'>期間</TableHeaderColumn>
							<TableHeaderColumn dataField='employeeName' headerAlign='center'>氏名</TableHeaderColumn>
							<TableHeaderColumn dataField='systemName' width='120'>システム・評価</TableHeaderColumn>
							<TableHeaderColumn dataField='station'>場所</TableHeaderColumn>
							<TableHeaderColumn dataField='customerName'>お客様</TableHeaderColumn>
							<TableHeaderColumn dataField='unitPrice' width='70'>単価</TableHeaderColumn>
							<TableHeaderColumn dataField='developLanguageName'>言語</TableHeaderColumn>
							<TableHeaderColumn dataField='workTime'>勤務時間</TableHeaderColumn>
							<TableHeaderColumn dataField='siteRoleName' width='65'>役割</TableHeaderColumn>
						</BootstrapTable>
					</div>
				</div>
			</div >
		)
	}
}

export default siteSearch;

