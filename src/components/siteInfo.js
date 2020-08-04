import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Autosuggest from 'react-autosuggest';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import '../asserts/css/SiteInformation.css';
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

function renderSuggestion(suggestion) {
	return (
		<span>{suggestion.name}</span>
	);
}
class siteInfo extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
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
		developementSuggestions: [],
		developmentLanguageNo: '',
		suggestions: []
	};

	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	fixed = event => {
		$("#time_2").prop('disabled', false);
		this.onchange(event);

		if (event.target.value == 0) {
			this.setState({ "time_2": event.target.value })
			$("#time_2").prop('disabled', true);
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
		bonusStartDate: new Date(),
		raiseStartDate: new Date(),
	}
	//開発言語　開始
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
						developementSuggestions: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});


	};

	onDltSuggestionsClearRequested = () => {
		this.setState({
			developementSuggestions: []
		});
	};

	onDltSuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developementValue: suggestion.name
		});
	};

	//開発言語　終了
	/* 役割 */
	getSiteMaster = () => {
		axios.post("http://127.0.0.1:8080/getSiteMaster")//url,条件
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
	/* トップお客様 */
	getTopCustomer = () => {
		axios.post("http://127.0.0.1:8080/getTopCustomer")//url,条件
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						topCustomer: [{ code: '', name: '選択してください' }]
							.concat(data.map(tc => {
								return { code: tc.code, name: tc.name }
							}))
					}
				);
			}
			);
	};
	/* レベル */
	getLevel = () => {
		axios.post("http://127.0.0.1:8080/getLevel")//url,条件
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						levelMaster: [{ code: '', name: '選択してください' }]
							.concat(data.map(lm => {
								return { code: lm.code, name: lm.name }
							}))
					}
				);
			}
			);
	};
	/* お客様 */
	getCustomerMaster = () => {
		axios.post("http://127.0.0.1:8080/getCustomerMaster")//url,条件
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						customerMaster: [{ code: '', name: '選択してください' }]
							.concat(data.map(cm => {
								return { code: cm.code, name: cm.name }
							}))
					}
				);
			}
			);
	};
	/* 精算時間 */
	getPayMaster = () => {
		axios.post("http://127.0.0.1:8080/getPayMaster")//url,条件
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
	//日期更改
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
					if (year == 0 && month == 0) {
						$("#time").val("0年0月");
					}
					else {
						$("#time").val(year + "年" + (month - 1) + "月");
					}
				}
			}
		}
	};
	//日期更改
	raiseChange = date => {
		this.setState({
			raiseStartDate: date,
		});
		$("#admissionEndDate").val(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
	};
	// 页面加载
	componentDidMount() {
		this.getSiteMaster();
		this.getPayMaster();
		this.getTopCustomer();
		this.getCustomerMaster();
		this.getLevel();
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
		if ($("#time_2").val() < $("#time_1").val()) {
			alert("正しい期間を選択してください");
			return false;
		}
		if ('0' != $("#time_1").val()) {
			if ($("#time_2").val() == $("#time_1").val()) {
				alert("固定を選択してくださいます");
				return false;
			}
		}
		var siteModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function(i, item) {
			siteModel[item.name] = item.value;
		});
		siteModel["developLanguage"] = this.state.developementValue;
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
		const { time_1, time_2, workState, products, siteRoleCode,levelCode, developementValue, developementSuggestions } = this.state;
		const dltInputProps = {
			placeholder: "開発言語",
			value: developementValue,
			onChange: this.onDevelopementChange
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
										<Form.Control as="select" id="customerNo" name="customerNo" onChange={this.onchange} >
											{this.state.customerMaster.map(cm =>
												<option key={cm.code} value={cm.code}>
													{cm.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">トップお客様</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="topCustomerNo" name="topCustomerNo" onChange={this.onchange} >
											{this.state.topCustomer.map(tc =>
												<option key={tc.code} value={tc.code}>
													{tc.name}
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
											<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
										</InputGroup.Prepend>
										<Autosuggest
											suggestions={developementSuggestions}
											onSuggestionsFetchRequested={this.onDltSuggestionsFetchRequested}
											onSuggestionsClearRequested={this.onDltSuggestionsClearRequested}
											onSuggestionSelected={this.onDltSuggestionSelected}
											getSuggestionValue={getSuggestionDlt}
											renderSuggestion={renderSuggestion}
											inputProps={dltInputProps}
										/>
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
										<FormControl id="admissionStartDate" name="admissionStartDate" placeholder="YYYY/MM/DD" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.onchange} readOnly />
										<InputGroup.Append>
											<DatePicker
												selected={this.state.raiseStartDate}
												onChange={this.inactive}
												autoComplete="on"
												locale="pt-BR"
												className={"dateInput"}
												id="beginDate"
												locale="ja"
											/>
										</InputGroup.Append>
										<FormControl id="time" name="time" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
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
										<FormControl id="admissionEndDate" name="admissionEndDate" placeholder="YYYY/MM/DD" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.onchange} readOnly />
										<InputGroup.Append>
											<DatePicker
												selected={this.state.raiseStartDate}
												onChange={this.raiseChange}
												autoComplete="on"
												locale="pt-BR"
												className={"dateInput"}
												id="endDateCalendar"
												locale="ja"
											/>
										</InputGroup.Append>
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
											{this.state.levelMaster.map(lm =>
												<option key={lm.code} value={lm.code}>
													{lm.name}
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
						<TableHeaderColumn width='90' dataField='developLanguage'>言語</TableHeaderColumn>
						<TableHeaderColumn width='60' dataField='siteRoleName'>役割</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		)
	}
}

export default siteInfo;

