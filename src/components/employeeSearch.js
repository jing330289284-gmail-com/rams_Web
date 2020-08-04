import React from 'react';
import { Card, Button, Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch } from '@fortawesome/free-solid-svg-icons';
import * as dateUtils from './utils/dateUtils.js';

registerLocale("ja", ja);

function escapeRegexCharacters(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value, datas) {
	const escapedValue = escapeRegexCharacters(value.trim());
	const regex = new RegExp('^' + escapedValue, 'i');

	return datas.filter(data => regex.test(data.name));
}
function getSuggestionDlt1(suggestion) {
	return suggestion.name;
}

function getSuggestionDlt2(suggestion) {
	return suggestion.name;
}

function getSuggestionDlt3(suggestion) {
	return suggestion.name;
}

function renderSuggestion(suggestion) {
	return (
		<span>{suggestion.name}</span>
	);
}
function getCaret(direction) {
	if (direction === 'asc') {
		return (
			<span>▲</span>
		);
	}
	if (direction === 'desc') {
		return (
			<span>▼</span>
		);
	}
	return (
		<span>▲/▼</span>
	);
}


class mainSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.searchEmployee = this.searchEmployee.bind(this);
		this.employeeDetail = this.employeeDetail.bind(this);
		this.options = {
			defaultSortName: 'rowNo',
			defaultSortOrder: 'dsc',
			sizePerPage: 5,
			pageStartIndex: 1,
			paginationSize: 2,
			prePage: 'Prev',
			nextPage: 'Next',
			hideSizePerPage: true,
			alwaysShowAllBtns: true,
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function

		};
	};
	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	//リセット
	resetBook = () => {
		this.setState(() => this.initialStates);
	};

	//初期化データ
	initialState = {
		developement1Value: '',
		developement1Suggestions: [],
		developement2Value: '',
		developement2Suggestions: [],
		developement3Value: '',
		developement3Suggestions: [],
		employeeList: [],
		nationalitys: [],
		japaneases: [],
		visas: [],
		staffForms: [],
		intoCompanys: [],
		japaneseLevels: [],
		suggestions: [],
		employeeStatuss: [],
		genders: [],
		kadou: '',
		developmentLanguageNo1: '',
		developmentLanguageNo2: '',
		developmentLanguageNo3: '',
		siteMaster: [],

	};
	//リセット
	initialStates = {
		developement1Value: '',
		developement1Suggestions: [],
		developement2Value: '',
		developement2Suggestions: [],
		developement3Value: '',
		developement3Suggestions: [],
		employeeNo: '',
		employeeFristName: '',
		emploryeeForm: '',
		genderCode: '',
		employeeStatus: '',
		joinCompanyOfYearFrom: '',
		joinCompanyOfYearTo: '',
		ageFrom: '',
		ageTo: '',
		statusOfResidence: '',
		birthplaceOfcontroy: '',
		customer: '',
		japanease: '',
		developmentLanguageNo: '',
		value: '',
		suggestions: [],
		kadou: '',
		developmentLanguageNo1: '',
		developmentLanguageNo2: '',
		developmentLanguageNo3: '',

	};
	//開発言語　開始
	onDevelopement1Change = (event, { newValue }) => {
		this.setState({
			developement1Value: newValue
		});
	};

	onDevelopement2Change = (event, { newValue }) => {
		this.setState({
			developement2Value: newValue
		});
	};

	onDevelopement3Change = (event, { newValue }) => {
		this.setState({
			developement3Value: newValue
		});
	};

	onDlt1SuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo1: value
		};
		axios.post("http://127.0.0.1:8080/getTechnologyType", emp)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					this.setState({
						developement1Suggestions: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});


	};

	onDlt1SuggestionsClearRequested = () => {
		this.setState({
			developement1Suggestions: []
		});
	};

	onDlt1SuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developement1Value: suggestion.name
		});
	};

	onDlt2SuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo2: value
		};
		axios.post("http://127.0.0.1:8080/getTechnologyType", emp)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					this.setState({
						developement2Suggestions: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	onDlt3SuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo3: value
		};
		axios.post("http://127.0.0.1:8080/getTechnologyType", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						developement3Suggestions: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};


	onDlt2SuggestionsClearRequested = () => {
		this.setState({
			developement2Suggestions: []
		});
	};

	onDlt3SuggestionsClearRequested = () => {
		this.setState({
			developement3Suggestions: []
		});
	};

	onDlt2SuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developement2Value: suggestion.name
		});
	};

	onDlt3SuggestionSelected = (event, { suggestion }) => {
		this.setState({
			developement3Value: suggestion.name
		});
	};
	//開発言語　終了

	//初期化メソッド
	componentDidMount() {
		this.getNationalitys();//全部の国籍
		this.getStaffForms();//社員形式
		this.getVisa();//在留資格
		this.getIntoCompany();//入社区分
		this.getJapaneseLevel();//日本語レベル
		this.getGender();//性別区別
		this.getEmployee();//ステータス
		this.getSiteMaster();//役割
		this.clickButtonDisabled();
		

	}
	//検索
	searchEmployee = () => {
		const emp = {
			employeeNo: this.state.employeeNo,
			employeeFristName: this.state.employeeFristName,
			emploryeeForm: this.state.emploryeeForm,
			employeeStatus: this.state.employeeStatus,
			genderCode: this.state.genderCode,
			joinCompanyOfYearFrom: this.state.joinCompanyOfYearFrom,
			joinCompanyOfYearTo: this.state.joinCompanyOfYearTo,
			ageFrom: this.state.ageFrom,
			ageTo: this.state.ageTo,
			statusOfResidence: this.state.statusOfResidence,
			birthplaceOfcontroy: this.state.birthplaceOfcontroy,
			customer: this.state.customer,
			japanease: this.state.japanease,
			developmentLanguageNo1: this.state.developement1Value,
			developmentLanguageNo2: this.state.developement2Value,
			developmentLanguageNo3: this.state.developement3Value,
			unitPriceFrom: this.state.unitPriceFrom,
			unitPriceTo: this.state.unitPriceTo,
		};
		axios.post("http://127.0.0.1:8080/getEmployeeInfo", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({ employeeList: response.data })
				} else {
					alert("err")
				}
			}
			);
	}

	/* 国籍 */
	getNationalitys = () => {
		var data = dateUtils.getdropDown("getNationalitys");
		this.setState(
			{
				nationalitys: data
			}
		);
	};

	//在留資格
	getVisa = () => {
		var data = dateUtils.getdropDown("getVisa");
		this.setState(
			{
				visas: data
			}
		);
	};
	/* 入社区分 */
	getIntoCompany = () => {
		var data = dateUtils.getdropDown("getIntoCompany");
		this.setState(
			{
				intoCompanys: data
			}
		);
	};

	/* 日本語レベル */
	getJapaneseLevel = () => {
		var data = dateUtils.getdropDown("getJapaneseLevel");
		this.setState(
			{
				japaneseLevels: data
			}
		);
	};
    /* employeesステータス */
	getEmployee = () => {
		var data = dateUtils.getdropDown("getEmployee");
		this.setState(
			{
				employeeStatuss: data
			}
		);
	};

	/* 性別区別 */
	getGender = () => {
		var data = dateUtils.getdropDown("getGender");
		this.setState(
			{
				genders: data
			}
		);
	};


	/* 社員形式 */
	getStaffForms = () => {
		var data = dateUtils.getdropDown("getStaffForms");
		this.setState(
			{
				staffForms: data
			}
		);
	};

	/* 役割 */
	getSiteMaster = () => {
		var data = dateUtils.getdropDown("getSiteMaster");
		this.setState(
			{
				siteMaster: data
			}
		);
	};
	//年月開始
	state = {
		raiseStartDate: new Date(),
	}

	//入社年月
	inactiveJoinCompanyOfYearFrom = date => {
		$("#joinCompanyOfYearFrom").val(date.getFullYear() + "/" + (date.getMonth() + 1));
		dateUtils.getFullYearMonth("#time", date);
	};

	inactiveJoinCompanyOfYearTo = date => {
		$("#joinCompanyOfYearTo").val(date.getFullYear() + "/" + (date.getMonth() + 1));
		dateUtils.getFullYearMonth("#time", date);
	};

	//初期化の時、disabledをセットします
	clickButtonDisabled = () => {
		$('button[name="clickButton"]').prop('disabled', true);
	};

	//詳細ボタン
	employeeDetail = () => {
		alert("詳細画面");
	};

	//修正ボタン
	employeeUpdate = () => {
		if ($("input[type='checkbox']:checked").length > 1) {
			alert("一つだけお願いします");
		} else {
			alert("修正画面");

		}
	};
	//削除ボタン
	employeeDelete = () => {
		alert("削除画面");
	};
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			$('button[name="clickButton"]').prop('disabled', false);
		} else {
			$('button[name="clickButton"]').prop('disabled', true);
		}
	}

	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left","display":total>0 ? "block" : "none" }}  >
					から {start} まで {to}, 総計{total}				
			</p>
		);
	}
	render() {
		const { employeeNo, employeeFristName, emploryeeForm, genderCode,employeeStatus,
			joinCompanyOfYearFrom,joinCompanyOfYearTo, ageFrom, ageTo, statusOfResidence, birthplaceOfcontroy,
			customer, japanease, siteRoleCode,
			kadou, 
			intoCompanyCode, employeeList } = this.state;
		const {
			developement1Value,
			developement1Suggestions,
			developement2Value,
			developement2Suggestions,
			developement3Value,
			developement3Suggestions
		} = this.state;
		const dlt1InputProps = {
			placeholder: "開発言語1",
			value: developement1Value,
			onChange: this.onDevelopement1Change
		};
		const dlt2InputProps = {
			placeholder: "開発言語2",
			value: developement2Value,
			onChange: this.onDevelopement2Change
		};
		const dlt3InputProps = {
			placeholder: "開発言語3",
			value: developement3Value,
			onChange: this.onDevelopement3Change
		};
		const selectRowProp = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			onSelect: this.handleRowSelect
		};
		return (
			<div >					
					<Form   >
						<div >							
								  <Form.Group>
                                   <Row>
									<Col lg={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="inlineFormInputGroup"
												name="employeeNo" autoComplete="off"
												value={employeeNo} size="sm"
												onChange={this.valueChange}
												placeholder="社員番号" />
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="inlineFormInputGroup" name="employeeFristName"
												value={employeeFristName} autoComplete="off"
												onChange={this.valueChange} size="sm"
												placeholder="社員名" />
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="emploryeeForm" value={emploryeeForm}
												autoComplete="off">
												{this.state.staffForms.map(st =>
													<option key={st.code} value={st.code}>
														{st.name}
													</option>
												)}
											</Form.Control>
										</InputGroup>
									</Col>							
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">ステータス</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="employeeStatus" value={employeeStatus}
												autoComplete="off">
												{this.state.employeeStatuss.map(employeeStatus =>
													<option key={employeeStatus.code} value={employeeStatus.code}>
														{employeeStatus.name}
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
												<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="genderCode" value={genderCode}
												autoComplete="off">
												{this.state.genders.map(gender =>
													<option key={gender.code} value={gender.code}>
														{gender.name}
													</option>
												)}
											</Form.Control>
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
												<Form.Control type="text" name="ageFrom"
													value={ageFrom} autoComplete="off"
													onChange={this.valueChange} size="sm"
													className={"fromToCss"  }
												/> ～ <Form.Control type="text" name="ageTo"
													value={ageTo} autoComplete="off"
													onChange={this.valueChange} size="sm"
													className={"fromToCss"  }
												/>
											</InputGroup.Prepend>
										
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">在留資格</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="statusOfResidence" value={statusOfResidence}
												autoComplete="off">
												{this.state.visas.map(vi =>
													<option key={vi.code} value={vi.code}>
														{vi.name}
													</option>
												)}
											</Form.Control>
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">国籍</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select"
												onChange={this.valueChange} size="sm"
												name="birthplaceOfcontroy" value={birthplaceOfcontroy}
												autoComplete="off">
												{this.state.nationalitys.map(na =>
													<option key={na.code} value={na.code}>
														{na.name}
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
												<InputGroup.Text id="inputGroup-sizing-sm">お客様先</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control type="text"
												name="customer" autoComplete="off"
												value={customer} size="sm"
												onChange={this.valueChange}
												className={"optionCss"}
												placeholder="社お客様先" />
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select"
												onChange={this.valueChange} size="sm"
												name="intoCompanyCode" value={intoCompanyCode}
												autoComplete="off">
												{this.state.intoCompanys.map(ic =>
													<option key={ic.code} value={ic.code}>
														{ic.name}
													</option>
												)}
											</Form.Control>
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select"
												onChange={this.valueChange} size="sm"
												name="japanease" value={japanease}
												autoComplete="off">
												{this.state.japaneseLevels.map(ja =>
													<option key={ja.code} value={ja.code}>
														{ja.name}
													</option>
												)}
											</Form.Control>
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="siteRoleCode" value={siteRoleCode}
												autoComplete="off">
												{this.state.siteMaster.map(sm =>
													<option key={sm.code} value={sm.code}>
														{sm.name}
													</option>
												)}
											</Form.Control>
										</InputGroup>
									</Col>
									</Row>	
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm" >開発言語</InputGroup.Text>
											<Autosuggest
												suggestions={developement1Suggestions}
												onSuggestionsFetchRequested={this.onDlt1SuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDlt1SuggestionsClearRequested}
												onSuggestionSelected={this.onDlt1SuggestionSelected}
												getSuggestionValue={getSuggestionDlt1}
												renderSuggestion={renderSuggestion}
												inputProps={dlt1InputProps}
											/>
											<Autosuggest
												suggestions={developement2Suggestions}
												onSuggestionsFetchRequested={this.onDlt2SuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDlt2SuggestionsClearRequested}
												onSuggestionSelected={this.onDlt2SuggestionSelected}
												getSuggestionValue={getSuggestionDlt2}
												renderSuggestion={renderSuggestion}
												inputProps={dlt2InputProps}
											/>
											<Autosuggest
												suggestions={developement3Suggestions}
												onSuggestionsFetchRequested={this.onDlt3SuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDlt3SuggestionsClearRequested}
												onSuggestionSelected={this.onDlt3SuggestionSelected}
												getSuggestionValue={getSuggestionDlt3}
												renderSuggestion={renderSuggestion}
												inputProps={dlt3InputProps}
											/>
										</InputGroup.Prepend>
										<InputGroup.Prepend>										      
												<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="joinCompanyOfYearFrom" name="joinCompanyOfYearFrom" value={joinCompanyOfYearFrom} placeholder="入社年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
											<DatePicker
												selected={this.state.raiseStartDate}
												onChange={this.inactiveJoinCompanyOfYearFrom}
												autoComplete="on"
												className={"dateInput"}
												dateFormat={"yyyy MM"}
												showMonthYearPicker
												showFullMonthYearPicker
												showDisabledMonthNavigation
												locale="ja"
											/> ～ 
							                <FormControl id="joinCompanyOfYearTo" name="joinCompanyOfYearTo" value={joinCompanyOfYearTo} placeholder="入社年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
											<DatePicker
												selected={this.state.raiseStartDate}
												onChange={this.inactiveJoinCompanyOfYearTo}
												autoComplete="on"
												className={"dateInput"}
												dateFormat={"yyyy MM"}
												showMonthYearPicker
												showFullMonthYearPicker
												showDisabledMonthNavigation
												locale="ja"
											/>
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">稼働</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="kadou" value={kadou}
												autoComplete="off" >　
												<option value=""　>選択ください</option>
												<option value="0">はい</option>
												<option value="1">いいえ</option>
											</Form.Control>
									</InputGroup>		
								</Form.Group>		
						</div>						
					</Form>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" type="submit" onClick={this.searchEmployee}>
							<FontAwesomeIcon icon={faSearch} /> 検索
                        </Button>{' '}
						<Button size="sm" variant="info" type="#">
							<FontAwesomeIcon icon={faSave} /> 追加
                        </Button>{' '}
						<Button size="sm" variant="info" type="reset" onClick={this.resetBook}>
							<FontAwesomeIcon icon={faUndo} /> Reset
                        </Button>
					</div>
					
					<Card.Body>
						<div>
							 <Row >
								<Col sm={4}>
							        <Button size="sm" variant="info" name="clickButton" onClick={this.employeeDetail} >履歴書</Button>{' '}
							        <Button size="sm" variant="info" name="clickButton" onClick={this.employeeUpdate} >在留カード</Button>{' '}							
							    </Col>
								<Col sm={6}></Col>
								<Col sm={2}>
							        <Button size="sm" variant="info" name="clickButton" onClick={this.employeeDetail} >詳細</Button>{' '}
							        <Button size="sm" variant="info" name="clickButton" onClick={this.employeeUpdate} >修正</Button>{' '}
							    	<Button size="sm" variant="info" name="clickButton" onClick={this.employeeDelete} >削除</Button>
						        </Col>
						    </Row>
						</div>						
						<div >
							<BootstrapTable data={employeeList} selectRow={selectRowProp} className={"bg-white text-dark"} pagination={true} options={this.options}>
								<TableHeaderColumn width='95' dataField='rowNo' dataSort={true} caretRender={getCaret} isKey>番号</TableHeaderColumn>
								<TableHeaderColumn width='90' dataField='employeeNo'>社員番号</TableHeaderColumn>
								<TableHeaderColumn width='120' dataField='employeeFristName'>社員名</TableHeaderColumn>
								<TableHeaderColumn width='150'　dataField='furigana'>カタカナ</TableHeaderColumn>
								<TableHeaderColumn width='90' dataField='alphabetOfName'>ローマ字</TableHeaderColumn>
								<TableHeaderColumn width='95' dataField='age' dataSort={true} caretRender={getCaret}>年齢</TableHeaderColumn>
								<TableHeaderColumn width='90' dataField='joinCompanyOfYearandMonth'>入社年月</TableHeaderColumn>
								<TableHeaderColumn 　width='125'　dataField='phoneNo'>電話番号</TableHeaderColumn>
								<TableHeaderColumn width='120' dataField='nearestStation'>寄り駅</TableHeaderColumn>
								<TableHeaderColumn width='90' dataField='visaTime'>ビザ期間</TableHeaderColumn>
							</BootstrapTable>
						</div>
					</Card.Body>
				
			</div >
		);
	}
}
export default mainSearch;