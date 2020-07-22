import React from 'react';
import { Card, Table, Button, Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import MyToast from './myToast';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './style.css';
import $ from 'jquery'


import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faSave, faUndo, faEdit, faTrash, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch } from '@fortawesome/free-solid-svg-icons';
registerLocale("ja", ja);

const getSuggestions = (value, languages) => {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;

	return inputLength === 0 ? [] : languages.filter(lang =>
		lang.name.toLowerCase().slice(0, inputLength) === inputValue
	);
};
//valueを取得
const getSuggestionValue = suggestion => suggestion.name;
//valueを取得するのをセット
const renderSuggestion = suggestion => (
	<div>
		{suggestion.name}
	</div>
);


class mainSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.searchEmployee = this.searchEmployee.bind(this);
		this.employeeDetail = this.employeeDetail.bind(this);
		this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);

	};
	//初期化データ
	initialState = {
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
		currentPage: 1,
		emploryeesPerPage: 5,
		nationalitys: [],
		japaneases: [],
		visas: [],
		staffForms: [],
		sortToggleSalary: true,
		customers: [],
		intoCompanys: [],
		japaneseLevels: [],
		technologyTypes: [],
		value: '',
		suggestions: [],
		genders: [],
		kadou: '',
		developmentLanguageNo1: '',
		developmentLanguageNo2: '',
		developmentLanguageNo3: '',
		checkboxDisabled: true,

	};
	//リセット
	initialStates = {
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
		authorityCode: '',
		japanease: '',
		developmentLanguageNo: '',
		salaryFrom: '',
		salaryTo: '',
		unitPriceFrom: '',
		unitPriceTo: '',
		currentPage: 1,
		emploryeesPerPage: 5,
		value: '',
		suggestions: [],
		kadou: '',
		developmentLanguageNo1: '',
		developmentLanguageNo2: '',
		developmentLanguageNo3: '',

	};
	//年月日　開始
	sortData = () => {
		this.setState({ sortToggleSalary: !this.state.sortToggleSalary });
		this.searchEmployee(!this.state.sortToggleSalary);
	}

	changNot = () => {
	}

	handleChange = date => {
		this.setState({
			joinCompanyOfYear: date
		});
	};
	//年月日　終了

	//初期化メソッド
	componentDidMount() {
		this.getNationalitys();//全部の国籍
		this.getStaffForms();//社員形式
		this.getVisa();//在留資格
		this.getCustomer();//お客様
		this.getIntoCompany();//入社区分
		this.getJapaneseLevel();//日本語レベル
		this.getGender();//性別区別
		this.checkboxload()//
	}
	//リセット
	resetBook = () => {
		this.setState(() => this.initialStates);
	};

	searchEmployee = (sortToggleSalaryFlag) => {
		let sortToggleSalary = sortToggleSalaryFlag ? "desc" : "";//
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
			authorityCode: this.state.authorityCode,
			japanease: this.state.japanease,
			developmentLanguageNo1: this.state.value,
			salaryFrom: this.state.salaryFrom,
			salaryTo: this.state.salaryTo,
			unitPriceFrom: this.state.unitPriceFrom,
			unitPriceTo: this.state.unitPriceTo,
			sortToggleSalary: sortToggleSalary
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

	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	//ページネーション　開始
	firstPage = () => {
		if (this.state.currentPage > 1) {
			this.setState({
				currentPage: 1
			});
		}
	};
	changePage = event => {
		this.setState({
			[event.target.name]: isNaN(parseInt(event.target.value)) ? "1" : parseInt(event.target.value)
		});
	};
	prevPage = () => {
		if (this.state.currentPage > 1) {
			this.setState({
				currentPage: this.state.currentPage - 1
			});
		}
	};

	lastPage = () => {
		if (this.state.currentPage < Math.ceil(this.state.employeeList.length / this.state.emploryeesPerPage)) {
			this.setState({
				currentPage: Math.ceil(this.state.employeeList.length / this.state.emploryeesPerPage)
			});
		}
	};

	nextPage = () => {
		if (this.state.currentPage < Math.ceil(this.state.employeeList.length / this.state.emploryeesPerPage)) {
			this.setState({
				currentPage: this.state.currentPage + 1
			});
		}
	};
	//ページネーション　終了

	//削除ボタン
	deleteEmployee = (employeeNo) => {
		const emp = {//条件
			employeeNo: employeeNo,
		};
		axios.post("http://localhost:8080/getEmployeeInfo", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({ "show": true });
					setTimeout(() => {
						this.setState({ "show": false })
					}, 3000);
					this.setState({
						employeeList: this.state.employeeList.filter(data => data.employeeNo !== employeeNo)
					});
				} else {
					this.setState({ "show": false });
				}
			}
			);
	};
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

	//お客様先
	getCustomer = () => {
		axios.post("http://localhost:8080/getCustomer")
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						customers: [{ code: '', name: '選択ください' }]
							.concat(data.map(cu => {
								return { code: cu.code, name: cu.name }
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

	//開発言語　開始
	onSuggestionsFetchRequested = ({ value }) => {
		const emp = {
			developmentLanguageNo: value
		};
		axios.post("http://localhost:8080/getTechnologyType", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						suggestions: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});

	};
	//クリア
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
	};



	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue
		});
	};
	//技術種別　終了

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
	//初期化の時、disabledをセットします
	checkboxload = () => {
		$('button[name="checkboxButton"]').prop('disabled', true);
	};

	// チェックボックス
	 	handleChangeCheckbox = () => {
			$('input:checkbox').each(function () {
				//alert(111);
				if ($('input:checkbox').is(':checked')) {
					//alert(1)
					$('button[name="checkboxButton"]').prop('disabled', false);
					return true;
				} else {
					//alert(2)
					$('button[name="checkboxButton"]').prop('disabled', true);
				}
			});
		};
	 
	//詳細ボタン
	employeeDetail = () => {
		if ($("input[type='checkbox']:checked").length > 1) {
			alert("一つだけお願いします");
		} else {
			alert("詳細画面");
		}
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
		if ($("input[type='checkbox']:checked").length > 1) {
			alert("一つだけお願いします");
		} else {
			alert("削除画面");
		}
	};


	render() {
		const { employeeNo, employeeFristName, emploryeeForm, genderCode,
			joinCompanyOfYear, ageFrom, ageTo, statusOfResidence, birthplaceOfcontroy,
			customer, japanease, value, suggestions,
			kadou, siteRole, unitPriceFrom, unitPriceTo,
			intoCompanyCode, employeeList, currentPage, emploryeesPerPage } = this.state;
		const lastIndex = currentPage * emploryeesPerPage;
		const firstIndex = lastIndex - emploryeesPerPage;
		const currentEmployees = employeeList.slice(firstIndex, lastIndex);
		const totalPages = Math.ceil(employeeList.length / emploryeesPerPage);
		const inputProps = {
			placeholder: '開発言語',
			value,
			onChange: this.onChange
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
											<Form.Control type="text"
												name="siteRole" autoComplete="off"
												value={siteRole} size="sm"
												onChange={this.valueChange}
												className={"optionCss bg-dark text-white"}
												placeholder="役割" />
										</Col>
									</Form.Label>
								</Form.Group>
								<br></br>
								<Form.Group as={Row} >
									<Form.Label column="sm" lg={2.6}>
										開発言語
                            <Col sm={3}>
											<Autosuggest id="autosuggest1"
												suggestions={suggestions}
												onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onSuggestionsClearRequested}
												getSuggestionValue={getSuggestionValue}
												renderSuggestion={renderSuggestion}
												inputProps={inputProps} />
										</Col>
										<Col sm={3}>
											<Autosuggest
												suggestions={suggestions}
												onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onSuggestionsClearRequested}
												getSuggestionValue={getSuggestionValue}
												renderSuggestion={renderSuggestion}
												inputProps={inputProps}
											/>
										</Col>
										<Col sm={2}>
											<Autosuggest
												suggestions={suggestions}
												onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onSuggestionsClearRequested}
												getSuggestionValue={getSuggestionValue}
												renderSuggestion={renderSuggestion}
												inputProps={inputProps}
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
						<div style={{ "float": "right" }}  >
							<Button size="sm" variant="info" name="checkboxButton" onClick={this.employeeDetail}><FontAwesomeIcon icon={faList} />詳細</Button>{' '}
							<Button size="sm" variant="info" name="checkboxButton" onClick={this.employeeUpdate}><FontAwesomeIcon icon={faEdit} />修正</Button>{' '}
							<Button size="sm" variant="info" name="checkboxButton" onClick={this.employeeDelete}><FontAwesomeIcon icon={faTrash} />削除</Button>
						</div>
						<Table striped bordered hover variant="dark">
							<thead>
								<tr align="center">
									<th>番号</th>
									<th>社員番号</th>
									<th>社員名</th>
									<th>カタカナ</th>
									<th>年齢</th>
									<th>入社年月</th>
									<th onClick={employeeList.length === 0 ? this.changNot : this.sortData}>給料(円)<div className={this.state.sortToggleSalary ? "arrow arrow-up" : "arrow arrow-down"}> </div></th>
									<th>お客様</th>
									<th>電話番号</th>
									<th>寄り駅</th>
									{/* <th>詳細</th>
									<th>修正</th>
									<th>削除</th> */}
								</tr>
							</thead>
							<tbody>
								{employeeList.length === 0 ?
									<tr align="center">
										<td colSpan="13">データがなし</td>
									</tr> :
									currentEmployees.map(data =>
										<tr key={data.rowNo} className="background" name="background" onClick={this.handleChangeCheckbox.bind(this, data.employeeNo)}>
											{/* <td><Form.Check type="checkbox" id="checkbox" /></td> */}
											<td>{data.rowNo}</td>
											<td>{data.employeeNo}</td>
											<td>{data.employeeFristName}</td>
											<td>{data.employeeLastName}</td>
											<td>{data.age}</td>
											<td>{data.joinCompanyOfYear}{data.joinCompanyOfMonth}</td>
											<td>{data.salary}</td>
											<td>{data.customer}</td>
											<td>{data.phoneNo}</td>
											<td>{data.nearestStation}</td>
											{/* <td>
												<Button size="sm" variant="outline-info" ><FontAwesomeIcon icon={faList} /></Button>
											</td>
											<td>
												<Link to={"edit/" + data.employeeNo} className="btn btn-sm btn-outline-primary"><FontAwesomeIcon icon={faEdit} /></Link>
											</td>
											<td>
												<Button size="sm" variant="outline-danger" onClick={this.deleteEmployee.bind(this, data.employeeNo)}><FontAwesomeIcon icon={faTrash} /></Button>
											</td> */}
										</tr>
									)
								}
							</tbody>
						</Table>
					</Card.Body>
					{employeeList.length > 0 ?
						<Card.Footer>
							<div style={{ "float": "left" }}>
								Showing Page {currentPage} of {totalPages},トータル人数：{employeeList.length}
							</div>
							<div style={{ "float": "right" }}  >
								<InputGroup size="sm">
									<InputGroup.Prepend>
										<Button type="button" variant="outline-info" onClick={this.firstPage} disabled={currentPage === 1 ? true : false}>
											<FontAwesomeIcon icon={faFastBackward} /> First</Button>
										<Button type="button" variant="outline-info" onClick={this.prevPage} disabled={currentPage === 1 ? true : false}>
											<FontAwesomeIcon icon={faStepBackward} /> Prev</Button>
									</InputGroup.Prepend>
									<FormControl className={"pageNumCss bg-dark"} name="currentPage" value={currentPage}
										onChange={this.changePage} />
									<InputGroup.Append>
										<Button type="button" variant="outline-info" onClick={this.nextPage} disabled={currentPage === totalPages ? true : false}>
											<FontAwesomeIcon icon={faStepForward} /> Next</Button>
										<Button type="button" variant="outline-info" onClick={this.lastPage} disabled={currentPage === totalPages ? true : false}>
											<FontAwesomeIcon icon={faFastForward} /> Last</Button>
									</InputGroup.Append>
								</InputGroup>
							</div>
						</Card.Footer>
						: null
					}
				</Card>
			</div >
		);
	}
}
export default mainSearch;