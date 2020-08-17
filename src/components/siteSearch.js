import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import '../asserts/css/style.css';
import axios from 'axios';
import * as dateUtils from './utils/dateUtils.js';
import Select from 'react-select';

registerLocale('ja', ja);

class siteSearch extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}
	initialState = {
		payOffRange1: '',
		payOffRange2: '',
		siteMaster: [],
		payOffRangeStatus: [],
		topCustomerMaster: [],
		levelMaster: [],
		customerMaster: [],
		developLanguageMaster: []
	};
	//联想框用
	handleChange = selectedOption => {
		this.setState({ selectedOption });
		console.log(`Option selected:`, selectedOption);
	};
	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	fixed = event => {
		$("#payOffRange2").prop('disabled', false);
		this.onchange(event);

		if (event.target.value == 0) {
			this.setState({ "payOffRange2": event.target.value })
			$("#payOffRange2").prop('disabled', true);
		}
	}
	workState = event => {
		$("#endDateCalendar").toggle(true);
		this.onchange(event);
		if (event.target.value == 1) {
			$("#endDateCalendar").toggle(false);
		}
	}
	state = {
		admissionStartDate: new Date(),
		admissionEndDate: new Date(),
	}
	//　入場年月
	admissionStartDate = (date) => {
		this.setState(
			{
				admissionStartDate: date,
				time: dateUtils.getFullYearMonth(date, new Date())
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
		var methodArray = ["getPayOffRange", "getSiteMaster", "getLevel", "getCustomer", "getTopCustomer", "getDevelopLanguage"]
		var data = dateUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				payOffRangeStatus: data[0],//　精算時間
				siteMaster: data[1],//　役割
				levelMaster: data[2],//　レベル
				customerMaster: data[3],//お客様
				topCustomerMaster: data[4],//トップお客様
				developLanguageMaster: data[5],//開発言語

			}
		);
	};
	// 页面加载
	componentDidMount() {
		this.getDropDowns();//全部のドロップダウン
		axios.post("http://127.0.0.1:8080/getSiteInfo", { employeeNo: "LYC001" })
			.then(response => {
				if (response.data != null) {
					this.setState({
						products: response.data
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
			if ($("#payOffRange2").val() == $("#payOffRange1").val()) {
				alert("固定を選択してくださいます");
				return false;
			}
		}
		var siteModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function(i, item) {
			siteModel[item.name] = item.value;
		});
		siteModel["updateUser"] = sessionStorage.getItem('employeeNo');
		axios.post("http://127.0.0.1:8080/insertSiteInfo", siteModel)
			.then(function(result) {
				if (result.data == true) {
					alert("登录完成");
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
			sizePerPage: 5,
			pageStartIndex: 1,
			paginationSize: 2,
			prePage: '<<',
			nextPage: '>>',
			hideSizePerPage: true,
			alwaysShowAllBtns: true,
		};
		const { payOffRange1, payOffRange2, workState, products, siteRoleCode, levelCode, customer, topCustomer, developLanguage, time } = this.state;

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

									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">システム名</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="systemName" name="systemName" type="text" placeholder="例：請求システム" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									</InputGroup>
								</Col>

								<Col sm={3}>

									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="location" name="location" placeholder="例：秋葉原" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									</InputGroup>

								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
										</InputGroup.Prepend>
										<Select
											name="customerNo"
											value={customer}
											onChange={this.handleChange}
											options={this.state.customerMaster}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">トップお客様</InputGroup.Text>
										</InputGroup.Prepend>
										<Select
											name="topCustomerNo"
											value={topCustomer}
											onChange={this.handleChange}
											options={this.state.topCustomerMaster}
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
										<FormControl id="unitPrice" name="unitPrice" type="text" placeholder="単価" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">万円</InputGroup.Text>
										</InputGroup.Prepend>
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
											autoComplete="off">
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
											<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
										</InputGroup.Prepend>
										<Select
											name="developLanguageCode"
											value={developLanguage}
											onChange={this.handleChange}
											options={this.state.developLanguageMaster}
										/>
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
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">責任者</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="siteManager" name="siteManager" type="text" placeholder="例：田中" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									</InputGroup>
								</Col>

								<Col sm={4}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">入場年月日</InputGroup.Text>
										</InputGroup.Prepend>
										<DatePicker
											selected={this.state.admissionStartDate}
											onChange={this.admissionStartDate}
											dateFormat="yyyy/MM/dd"
											name="admissionStartDate"
											className="form-control form-control-sm"
											id="datePicker"
											locale="ja"
										/>
										<FormControl id="time" name="time" value={time} placeholder="0年0月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">現場状態</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="workState" name="workState" value={workState} onChange={this.workState}>
											<option value="0">終了</option>
											<option value="1">稼働中</option>
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
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={6}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">関連社員</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="related1Employees" name="related1Employees" type="text" placeholder="例：田中" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										<FormControl id="related2Employees" name="related2Employees" type="text" placeholder="例：田中" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										<FormControl id="related3Employees" name="related3Employees" type="text" placeholder="例：田中" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									</InputGroup>

								</Col>

								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">評価</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="levelCode" name="levelCode" onChange={this.onchange} value={levelCode} autoComplete="off">
											{this.state.levelMaster.map(date =>
												<option key={date.code} value={date.code}>
													{date.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>

								</Col>

							</Row>
							<Row>
								<Col sm={4}></Col>
								<Col sm={2} className="text-center">
									<Button block size="sm" type="reset" id="reset" value="Reset" >
										リセット
                            </Button>

								</Col>
								<Col sm={2} className="text-center">
									<Button block size="sm" onClick={this.tokuro} variant="primary" id="toroku" className="col-offset-1" type="button">
										登録
                            </Button>
								</Col>

							</Row>
						</Form.Group>
					</Form>
					<BootstrapTable
						data={products} pagination={true} options={this.options}
						pagination>
						<TableHeaderColumn width='210' dataField='workDate' isKey>期間</TableHeaderColumn>
						<TableHeaderColumn dataField='systemName'>システム</TableHeaderColumn>
						<TableHeaderColumn width='130' dataField='location'>場所</TableHeaderColumn>
						<TableHeaderColumn dataField='customerName'>お客様</TableHeaderColumn>
						<TableHeaderColumn dataField='topCustomerName'>トップ客様</TableHeaderColumn>
						<TableHeaderColumn width='60' dataField='unitPrice'>単価</TableHeaderColumn>
						<TableHeaderColumn width='90' dataField='developLanguageName'>言語</TableHeaderColumn>
						<TableHeaderColumn width='60' dataField='siteRoleName'>役割</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		)
	}
}

export default siteSearch;

