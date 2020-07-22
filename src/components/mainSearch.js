import React from 'react';
import { Card, Button, Form, Col, Row } from 'react-bootstrap';
import MyToast from './myToast';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch } from '@fortawesome/free-solid-svg-icons';

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
		employeeNo: '',
		employeeFristName: '',
		emploryeeForm: '',
		genderCode: '',
		joinCompanyOfYear: '',
		ageFrom: '',
		ageTo: '',
		statusOfResidence: '',
		birthplaceOfcontroy: '',
		customer: '',
		japanease: '',
		developmentLanguageNo: '',
		salary: '',
		unitPriceFrom: '',
		unitPriceTo: '',
		nationalitys: [],
		japaneases: [],
		visas: [],
		staffForms: [],
		intoCompanys: [],
		japaneseLevels: [],
		value: '',
		suggestions: [],
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
		joinCompanyOfYear: '',
		ageFrom: '',
		ageTo: '',
		statusOfResidence: '',
		birthplaceOfcontroy: '',
		customer: '',
		japanease: '',
		developmentLanguageNo: '',
		salaryTo: '',
		unitPriceFrom: '',
		unitPriceTo: '',
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
		axios.post("http://localhost:8080/getTechnologyType", emp)
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
		axios.post("http://localhost:8080/getTechnologyType", emp)
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
		axios.post("http://localhost:8080/getTechnologyType", emp)
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

	//入社年月
	handleChange = date => {
		this.setState({
			joinCompanyOfYear: date
		});
	};

	//初期化メソッド
	componentDidMount() {
		this.getNationalitys();//全部の国籍
		this.getStaffForms();//社員形式
		this.getVisa();//在留資格
		this.getIntoCompany();//入社区分
		this.getJapaneseLevel();//日本語レベル
		this.getGender();//性別区別
		this.clickButtonDisabled();
		this.getSiteMaster();
	}


	//検索
	searchEmployee = () => {
		const emp = {
			employeeNo: this.state.employeeNo,
			employeeFristName: this.state.employeeFristName,
			emploryeeForm: this.state.emploryeeForm,
			genderCode: this.state.genderCode,
			joinCompanyOfYear: this.state.joinCompanyOfYear,
			ageFrom: this.state.ageFrom,
			ageTo: this.state.ageTo,
			statusOfResidence: this.state.statusOfResidence,
			birthplaceOfcontroy: this.state.birthplaceOfcontroy,
			customer: this.state.customer,
			japanease: this.state.japanease,
			developmentLanguageNo1: this.state.value,
			developmentLanguageNo2: this.state.value,
			developmentLanguageNo3: this.state.value,
			unitPriceFrom: this.state.unitPriceFrom,
			unitPriceTo: this.state.unitPriceTo,
		};
		axios.post("http://localhost:8080/getEmployeeInfo", emp)
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
		axios.post("http://localhost:8080/getNationalitys")
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						nationalitys: [{ code: '', name: '選択ください' }]
							.concat(data.map(na => {
								return { code: na.code, name: na.name }
							}))
					}
				);
			}
			);
	};



	//在留資格
	getVisa = () => {
		axios.post("http://localhost:8080/getVisa")
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						visas: [{ code: '', name: '選択ください' }]
							.concat(data.map(vi => {
								return { code: vi.code, name: vi.name }
							}))
					}
				);
			}
			);
	};
	/* 入社区分 */
	getIntoCompany = () => {
		axios.post("http://localhost:8080/getIntoCompany")
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						intoCompanys: [{ code: '', name: '選択ください' }]
							.concat(data.map(ic => {
								return { code: ic.code, name: ic.name }
							}))
					}
				);
			}
			);
	};

	/* 日本語レベル */
	getJapaneseLevel = () => {
		axios.post("http://localhost:8080/getJapaneseLevel")
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						japaneseLevels: [{ code: '', name: '選択ください' }]
							.concat(data.map(ja => {
								return { code: ja.code, name: ja.name }
							}))
					}
				);
			}
			);
	};

	/* 性別区別 */
	getGender = () => {
		axios.post("http://localhost:8080/getGender")
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						genders: [{ code: '', name: '選択ください' }]
							.concat(data.map(ge => {
								return { code: ge.code, name: ge.name }
							}))
					}
				);
			}
			);
	};


	/* 社員形式 */
	getStaffForms = () => {
		axios.post("http://localhost:8080/getStaffForms")//url,条件
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						staffForms: [{ code: '', name: '選択ください' }]
							.concat(data.map(st => {
								return { code: st.code, name: st.name }
							}))
					}
				);
			}
			);
	};

	/* 役割 */
	getSiteMaster = () => {
		axios.post("http://localhost:8080/getSiteMaster")//url,条件
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						siteMaster: [{ code: '', name: '選択ください' }]
							.concat(data.map(sm => {
								return { code: sm.code, name: sm.name }
							}))
					}
				);
			}
			);
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
			<p style={{ color: 'dark', "float": "left" }}  >
				From {start} to {to}, totals is {total}
			</p>
		);
	}
	render() {
		const { employeeNo, employeeFristName, emploryeeForm, genderCode,
			joinCompanyOfYear, ageFrom, ageTo, statusOfResidence, birthplaceOfcontroy,
			customer, japanease, siteRoleCode,
			kadou, unitPriceFrom, unitPriceTo,
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
				<div>
					<div style={{ "display": this.state.show ? "block" : "none" }} >
						<MyToast show={this.state.show} message={"delete success"} />
					</div>
				</div>

				<Card className="border border-dark bg-dark text-white" style={{ "textAlign": "center" }}>
					<Form id="bookFormID" inline >
						<div style={{ "width": "1050px", "height": "260px" }}>
							<Card.Body>
								<Form.Group as={Row}  >
									<Form.Label column="sm" lg={2.6}>
										社員番号
							<Col sm={4}>
											<Form.Control type="text"
												name="employeeNo" autoComplete="off"
												value={employeeNo} size="sm"
												onChange={this.valueChange}
												className={"optionCss bg-dark text-white"}
												placeholder="社員番号" />
										</Col>
									</Form.Label>
									<Form.Label column="sm" lg={2.6}>
										&emsp;社員名
							<Col sm={4}>
											<Form.Control type="text" name="employeeFristName"
												value={employeeFristName} autoComplete="off"
												onChange={this.valueChange} size="sm"
												className={"optionCss bg-dark text-white"}
												placeholder="社員名" />								</Col>
									</Form.Label>

									<Form.Label column="sm" lg={2.6}>
										社員形式
							<Col sm={4}>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="emploryeeForm" value={emploryeeForm}
												className={"optionCss bg-dark text-white"} autoComplete="off">
												{this.state.staffForms.map(st =>
													<option key={st.code} value={st.code}>
														{st.name}
													</option>
												)}
											</Form.Control>
										</Col>
									</Form.Label>
									<Form.Label column="sm" lg={2.6}>
										&emsp;&emsp;性別
							<Col sm={4}>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="genderCode" value={genderCode}
												className={"optionCss  bg-dark text-white"} autoComplete="off">
												{this.state.genders.map(gender =>
													<option key={gender.code} value={gender.code}>
														{gender.name}
													</option>
												)}
											</Form.Control>
										</Col>
									</Form.Label>
								</Form.Group>
								<br></br>
								<Form.Group as={Row} controlId="formGridstartDate">
									<Form.Label column="sm" lg={2.6}>
										入社年月
							<Col sm={4}>
											<nobr>
												<DatePicker
													dateFormat={"yyyy MM"}
													autoComplete="off"
													name="joinCompanyOfYear"
													value={joinCompanyOfYear} size="sm"
													locale="ja"
													onChange={this.handleChange}
													selected={this.state.joinCompanyOfYear}
													showMonthYearPicker
													showFullMonthYearPicker
													className={"optionCss bg-dark text-white form-control form-control-sm"}
												/>
											</nobr>
										</Col>
									</Form.Label>
									<Form.Label column="sm" lg={2.6}>
										&emsp;&emsp;年齢
							<Col sm={4}>
											<nobr>
												<Form.Control type="text" name="ageFrom"
													value={ageFrom} autoComplete="off"
													onChange={this.valueChange} size="sm"
													className={"fromToCss bg-dark text-white"}
												/> ～ <Form.Control type="text" name="ageTo"
													value={ageTo} autoComplete="off"
													onChange={this.valueChange} size="sm"
													className={"fromToCss bg-dark text-white"}
												/>
											</nobr>
										</Col>
									</Form.Label>
									<Form.Label column="sm" lg={2.6}>
										在留資格
							<Col sm={4}>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="statusOfResidence" value={statusOfResidence}
												className={"optionCss bg-dark text-white"}>　autoComplete="off"
												{this.state.visas.map(vi =>
													<option key={vi.code} value={vi.code}>
														{vi.name}
													</option>
												)}
											</Form.Control>
										</Col>
									</Form.Label>
									<Form.Label column="sm" lg={2.6}>
										&emsp;&emsp;国籍
							<Col sm={4}>
											<Form.Control as="select"
												onChange={this.valueChange} size="sm"
												name="birthplaceOfcontroy" value={birthplaceOfcontroy}
												className={"optionCss bg-dark text-white"}>　autoComplete="off"
												 {this.state.nationalitys.map(na =>
													<option key={na.code} value={na.code}>
														{na.name}
													</option>
												)}
											</Form.Control>
										</Col>
									</Form.Label>
								</Form.Group>
								<br></br>
								<Form.Group as={Row} >
									<Form.Label column="sm" lg={2.6}>
										お客様先
							<Col sm={4}>
											<Form.Control type="text"
												name="customer" autoComplete="off"
												value={customer} size="sm"
												onChange={this.valueChange}
												className={"optionCss bg-dark text-white"}
												placeholder="社お客様先" />
										</Col>
									</Form.Label>

									<Form.Label column="sm" lg={2.6}>
										入社区分
										<Col sm={4} >
											<Form.Control as="select"
												onChange={this.valueChange} size="sm"
												name="intoCompanyCode" value={intoCompanyCode}
												className={"optionCss bg-dark text-white"}>　autoComplete="off"
												{this.state.intoCompanys.map(ic =>
													<option key={ic.code} value={ic.code}>
														{ic.name}
													</option>
												)}
											</Form.Control>
										</Col>
									</Form.Label>

									<Form.Label column="sm" lg={2.6}>
										&emsp;日本語
							<Col sm={4}>
											<Form.Control as="select"
												onChange={this.valueChange} size="sm"
												name="japanease" value={japanease}
												className={"optionCss bg-dark text-white"}>　autoComplete="off"
														{this.state.japaneseLevels.map(ja =>
													<option key={ja.code} value={ja.code}>
														{ja.name}
													</option>
												)}
											</Form.Control>
										</Col>
									</Form.Label>

									<Form.Label column="sm" lg={2.6}>
										&emsp;&emsp;役割
							<Col sm={4}>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="siteRoleCode" value={siteRoleCode}
												className={"optionCss bg-dark text-white"} autoComplete="off">
												{this.state.siteMaster.map(sm =>
													<option key={sm.code} value={sm.code}>
														{sm.name}
													</option>
												)}
											</Form.Control>
										</Col>
									</Form.Label>
								</Form.Group>
								<br></br>
								<Form.Group as={Row} >
									<Form.Label column="sm" lg={2.6}>
										開発言語
                            <Col sm={3}>
											<Autosuggest
												suggestions={developement1Suggestions}
												onSuggestionsFetchRequested={this.onDlt1SuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDlt1SuggestionsClearRequested}
												onSuggestionSelected={this.onDlt1SuggestionSelected}
												getSuggestionValue={getSuggestionDlt1}
												renderSuggestion={renderSuggestion}
												inputProps={dlt1InputProps}
											/>
										</Col>
										<Col sm={3}>
											<Autosuggest
												suggestions={developement2Suggestions}
												onSuggestionsFetchRequested={this.onDlt2SuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDlt2SuggestionsClearRequested}
												onSuggestionSelected={this.onDlt2SuggestionSelected}
												getSuggestionValue={getSuggestionDlt2}
												renderSuggestion={renderSuggestion}
												inputProps={dlt2InputProps}
											/>
										</Col>
										<Col sm={2}>
											<Autosuggest
												suggestions={developement3Suggestions}
												onSuggestionsFetchRequested={this.onDlt3SuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDlt3SuggestionsClearRequested}
												onSuggestionSelected={this.onDlt3SuggestionSelected}
												getSuggestionValue={getSuggestionDlt3}
												renderSuggestion={renderSuggestion}
												inputProps={dlt3InputProps}
											/>
										</Col>
									</Form.Label>
									<Form.Label column="sm" lg={2.6}>
										単価範囲
							<Col sm={9}>
											<nobr>
												<Form.Control type="text" name="unitPriceFrom"
													value={unitPriceFrom} autoComplete="off"
													onChange={this.valueChange} size="sm"
													className={"fromToCss2 bg-dark text-white"}
												/> ～ <Form.Control type="text" name="unitPriceTo"
													value={unitPriceTo} autoComplete="off"
													onChange={this.valueChange} size="sm"
													className={"fromToCss2 bg-dark text-white"}
												/>
											</nobr>
										</Col>
									</Form.Label>
									<Form.Label column="sm" lg={2.6}>
										稼働
							<Col sm={9}>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="kadou" value={kadou}
												className={"optionCss  bg-dark text-white"}>　autoComplete="off"
												<option value=""　>選択ください</option>
												<option value="0">はい</option>
												<option value="1">いいえ</option>
											</Form.Control>
										</Col>
									</Form.Label>
								</Form.Group>
							</Card.Body>
						</div>
					</Form>
					<Card.Footer style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" type="submit" onClick={this.searchEmployee}>
							<FontAwesomeIcon icon={faSearch} /> 検索
                        </Button>{' '}
						<Button size="sm" variant="info" type="#">
							<FontAwesomeIcon icon={faSave} /> 追加
                        </Button>{' '}
						<Button size="sm" variant="info" type="reset" onClick={this.resetBook}>
							<FontAwesomeIcon icon={faUndo} /> Reset
                        </Button>
					</Card.Footer>

					<Card.Body>
						<div style={{ "float": "right" }} >
							<Button size="sm" variant="info" name="clickButton" onClick={this.employeeDetail} >詳細</Button>{' '}
							<Button size="sm" variant="info" name="clickButton" onClick={this.employeeUpdate} >修正</Button>{' '}
							<Button size="sm" variant="info" name="clickButton" onClick={this.employeeDelete} >削除</Button>
						</div>
						<div>
							<BootstrapTable data={employeeList} selectRow={selectRowProp} className={"bg-white text-dark"} pagination={true} options={this.options}>
								<TableHeaderColumn dataField='rowNo' dataSort={true} caretRender={getCaret} isKey>番号</TableHeaderColumn>
								<TableHeaderColumn dataField='employeeNo'>社員番号</TableHeaderColumn>
								<TableHeaderColumn dataField='employeeFristName'>社員名</TableHeaderColumn>
								<TableHeaderColumn dataField='furigana'>カタカナ</TableHeaderColumn>
								<TableHeaderColumn dataField='alphabetOfName'>ローマ字</TableHeaderColumn>
								<TableHeaderColumn dataField='age' dataSort={true} caretRender={getCaret}>年齢</TableHeaderColumn>
								<TableHeaderColumn dataField='joinCompanyOfYearandMonth'>入社年月</TableHeaderColumn>
								<TableHeaderColumn dataField='AdmissionStartDate'>入場年月</TableHeaderColumn>
								<TableHeaderColumn dataField='employeeFristName' dataSort={true} caretRender={getCaret} >単価(円)</TableHeaderColumn>
								<TableHeaderColumn dataField='employeeFristName'>稼動お客様</TableHeaderColumn>
								<TableHeaderColumn dataField='phoneNo'>電話番号</TableHeaderColumn>
								<TableHeaderColumn dataField='nearestStation'>寄り駅</TableHeaderColumn>
							</BootstrapTable>
						</div>
					</Card.Body>
				</Card>
			</div >
		);
	}
}
export default mainSearch;