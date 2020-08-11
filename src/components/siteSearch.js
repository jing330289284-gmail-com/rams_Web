import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Autosuggest from 'react-autosuggest';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import '../asserts/css/style.css';
import '../asserts/css/development.css';
import axios from 'axios';

registerLocale('ja', ja);

function escapeRegexCharacters(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value, datas) {
	const escapedValue = escapeRegexCharacters(value.trim());
	const regex = new RegExp('^' + escapedValue, 'i');
	return datas.filter(data => regex.test(data.name));
}
function getSuggestionDlt(suggestion) {
	return suggestion.name;
}

function getSuggestionCtm(suggestion) {
	return suggestion.name;
}

function getSuggestionTcm(suggestion) {
	return suggestion.name;
}

function renderSuggestion(suggestion) {
	return (
		<span>{suggestion.name}</span>
	);
}
class siteSearch extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.onchange = this.onchange.bind(this);
	}
	initialState = {
		time_1: '',
		time_2: '',
		siteMaster: [],
		payMaster: [],
		topCustomer: [],
		levelMaster: [],
		customerMaster: [],
		developementValue: '',
		topCustomerValue: '',
		customerValue: '',
		developementSuggestions: [],
		customerSuggestions: [],
		topCustomerSuggestions: [],
		developmentLanguageNo: '',
		customerNo: '',
		topCustomerNo: '',
		suggestions: []
	};

	// 输入框取值
	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	// 精算下拉框1选择固定时，下拉框2自动变成固定
	fixed = event => {
		$("#time_2").prop('disabled', false);
		this.onchange(event);

		if (event.target.value === 0) {
			this.setState({ "time_2": event.target.value })
			$("#time_2").prop('disabled', true);
		}
	}

	// お客様 開始
	onCustomerChange = (event, { newValue }) => {
		this.setState({
			customerValue: newValue
		});
	};

	onCtmSuggestionsFetchRequested = ({ value }) => {
		const emp = {
			customerNo: value
		};
		axios.post("http://localhost:8080/getCustomer", emp)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					this.setState({
						customerSuggestions: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	onCtmSuggestionsClearRequested = () => {
		this.setState({
			customerSuggestions: []
		});
	};

	onCtmSuggestionSelected = (event, { suggestion }) => {
		this.setState({
			customerValue: suggestion.name
		});
	};

	// お客様 終了

	// トップお客様 開始
	onTopCustomerChange = (event, { newValue }) => {
		this.setState({
			topCustomerValue: newValue
		});
	};

	onTcmSuggestionsFetchRequested = ({ value }) => {
		const emp = {
			topCustomerNo: value
		};
		axios.post("http://localhost:8080/getTopCustomer", emp)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					this.setState({
						topCustomerSuggestions: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	onTcmSuggestionsClearRequested = () => {
		this.setState({
			topCustomerSuggestions: []
		});
	};

	onTcmSuggestionSelected = (event, { suggestion }) => {
		this.setState({
			topCustomerValue: suggestion.name
		});
	};

	// トップお客様 終了

	// 開発言語 開始
	onDevelopementChange = (event, { newValue }) => {
		this.setState({
			developementValue: newValue
		});
	};

	onDltSuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo: value
		};
		axios.post("http://localhost:8080/getTechnologyType", emp)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					this.setState({
						onDltSuggestionsClearRequested: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	onDltSuggestionSelected = () => {
		this.setState({
			developementSuggestions: []
		});
	};

	onDltSuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developementValue: suggestion.name
		});
	};

	// 開発言語 終了

	/* 役割 */
	getSiteMaster = () => {
		axios.post("http://127.0.0.1:8080/getSiteMaster")// url,条件
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						siteMaster: [{ code: '', name: '選択してください' }]
							.concat(data.map(sm => {
								return { code: sm.code, name: sm.name }
							}))
					}
				);
			}
			);
	};

	/* 精算時間 */
	getPayMaster = () => {
		axios.post("http://127.0.0.1:8080/getPayMaster")// url,条件
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						payMaster: [{ code: '', name: '選択してください' }]
							.concat(data.map(tm => {
								return { code: tm.code, name: tm.name }
							}))
					}
				);
			}
			);
	};

	state = {
		bonusStartDate: new Date(),
		raiseStartDate: new Date(),
	}

	// 日期更改
	inactive = date => {
		$("#time").val("0年0月");
		this.setState({
			bonusStartDate: date,
		});
		$("#admissionStartDate").val(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
		var today = new Date();
		var year = today.getFullYear() - date.getFullYear();
		var month = today.getMonth() - date.getMonth();
		var day = today.getDate() - date.getDate();
		if (year >= 0) {
			if (year > 0 && month < 0) {
				if (day > 0) {
					$("#time").val((year - 1) + "年" + (month + 12) + "月");
				}
				else {
					$("#time").val((year - 1) + "年" + (month + 11) + "月");
				}
			}
			if (month >= 0) {

				if (day >= 0) {
					$("#time").val(year + "年" + month + "月");
				}
				else {
					if (year === 0 && month === 0) {
						$("#time").val("0年0月");
					}
					else {
						$("#time").val(year + "年" + (month - 1) + "月");
					}
				}
			}
		}
	};
	// 日期更改
	raiseChange = date => {
		this.setState({
			raiseStartDate: date,
		});
		$("#admissionEndDate").val(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
	};
	// 页面加载
	componentDidMount() {
		// 下拉框加载
		this.getSiteMaster();
		this.getPayMaster();
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
		const { time_1, time_2, workState, products, siteRoleCode, developementValue, customerValue, topCustomerValue, developementSuggestions, customerSuggestions, topCustomerSuggestions } = this.state;
		const dltInputProps = {
			placeholder: "開発言語",
			value: developementValue,
			onChange: this.onDevelopementChange
		};
		const cmtInputProps = {
			placeholder: "お客様",
			value: customerValue,
			onChange: this.onCustomerChange
		};
		const tcmInputProps = {
			placeholder: "トップお客様",
			value: topCustomerValue,
			onChange: this.onTopCustomerChange
		};
		return (
			<div style={{ "background": "#f5f5f5" }}>
				<div style={{ "background": "#f5f5f5" }}>
					<Form id="siteForm">
						<Form.Group>
							{/*
								 * <Row> <Col sm={3}></Col> <Col sm={7}> <img
								 * className="mb-4" alt="title" src={title}/>
								 * </Col> </Row>
								 */}
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
											<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="employeeName" name="employeeName" type="text" placeholder="例：田中" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員ステータス</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="workState" name="workState" value={workState} onChange={this.workState}>
											<option value="0">社員</option>
											<option value="1">協力</option>
										</Form.Control>
									</InputGroup>

								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="workState" name="workState" value={workState} onChange={this.workState}>
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
											{this.state.siteMaster.map(sm =>
												<option key={sm.code} value={sm.code}>
													{sm.name}
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
											<InputGroup.Text id="inputGroup-sizing-sm">お客様　</InputGroup.Text>
											<Autosuggest
												suggestions={customerSuggestions}
												onSuggestionsFetchRequested={this.onCtmSuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onCtmSuggestionsClearRequested}
												onSuggestionSelected={this.onCtmSuggestionSelected}
												getSuggestionValue={getSuggestionCtm}
												renderSuggestion={renderSuggestion}
												inputProps={cmtInputProps}
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">トップお客様</InputGroup.Text>
											<Autosuggest
												suggestions={topCustomerSuggestions}
												onSuggestionsFetchRequested={this.onTcmSuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onTcmSuggestionsClearRequested}
												onSuggestionSelected={this.onTcmSuggestionSelected}
												getSuggestionValue={getSuggestionTcm}
												renderSuggestion={renderSuggestion}
												inputProps={tcmInputProps}
											/>
										</InputGroup.Prepend>
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
											<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
											<Autosuggest
												suggestions={developementSuggestions}
												onSuggestionsFetchRequested={this.onDltSuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDltSuggestionsClearRequested}
												onSuggestionSelected={this.onDltSuggestionSelected}
												getSuggestionValue={getSuggestionDlt}
												renderSuggestion={renderSuggestion}
												inputProps={dltInputProps}
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
							</Row>
							<Row>

								<Col sm={4}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">稼働期間</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="admissionStartDate" name="admissionStartDate" placeholder="YYYY/MM/DD" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.onchange} readOnly />
										<InputGroup.Append>
											<DatePicker
												selected={this.state.raiseStartDate}
												onChange={this.inactive}
												autoComplete="on"
												className={"dateInput"}
												id="beginDate"
												locale="ja"
											/>
										</InputGroup.Append>〜
										<FormControl id="admissionEndDate" name="admissionEndDate" placeholder="YYYY/MM/DD" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.onchange} readOnly />
										<InputGroup.Append>
											<DatePicker
												selected={this.state.raiseStartDate}
												onChange={this.raiseChange}
												autoComplete="on"
												className={"dateInput"}
												id="endDateCalendar"
												locale="ja"
											/>
										</InputGroup.Append>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">

										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">精算</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select"
											onChange={this.fixed}
											id="time_1" name="time_1" value={time_1}
											autoComplete="off">
											{this.state.payMaster.map(tm =>
												<option key={tm.code} value={tm.code}>
													{tm.name}
												</option>
											)}
										</Form.Control>
										〜
												<Form.Control as="select"
											onChange={this.onchange}
											id="time_2" name="time_2" value={time_2}
											autoComplete="off">
											{this.state.payMaster.map(tm =>
												<option key={tm.code} value={tm.code}>
													{tm.name}
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
										<FormControl id="unitPrice" name="unitPrice" type="text" placeholder="万円" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />～
										<FormControl id="unitPrice" name="unitPrice" type="text" placeholder="万円" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />

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
									<Button block size="sm" onClick={this.onchange} variant="primary" id="toroku" className="col-offset-1" type="button">
										検索
                            </Button>
								</Col>
							</Row>
						</Form.Group>
					</Form>

				</div>
			</div >
		)
	}
}

export default siteSearch;

