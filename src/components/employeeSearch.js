import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
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
import { faSave, faUndo, faSearch, faEdit, faTrash, faDownload, faList } from '@fortawesome/free-solid-svg-icons';
import * as dateUtils from './utils/dateUtils.js';
import { Link } from "react-router-dom";

registerLocale("ja", ja);
class employeeSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.searchEmployee = this.searchEmployee.bind(this);
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
			paginationShowsTotal: this.renderShowsTotal,

		};
	};
	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	//reset
	resetBook = () => {
		this.setState(() => this.resetStates);
	};

	//初期化データ
	initialState = {
		employeeFormCodes: [], employeeStatuss: [], genderStatuss: [], residenceCodes: [], nationalityCodes: [], intoCompanyCodes: [], japaneaseLevelCodes: [], siteMaster: [],
		developement1Value: '', developement1Suggestions: [], developement2Value: '', developement2Suggestions: [], developement3Value: '', developement3Suggestions: [],
		suggestions: [], developmentLanguageNo1: '', developmentLanguageNo2: '', developmentLanguageNo3: '', employeeList: [],
	};
	//リセット　reset
	resetStates = {
		employeeNo: '', employeeFristName: '', employeeFormCode: '', employeeStatus: '', genderStatus: '', ageFrom: '', ageTo: '', residenceCode: '',
		nationalityCode: '', customer: '', intoCompanyCode: '', japaneaseLeveCode: '', siteRoleCode: '', intoCompanyYearAndMonthFrom: '', intoCompanyYearAndMonthTo: '', kadou: '',
		developement1Value: '', developement1Suggestions: [], developement2Value: '', developement2Suggestions: [], developement3Value: '', developement3Suggestions: [],
		developmentLanguageNo1: '', developmentLanguageNo2: '', developmentLanguageNo3: '', value: '', suggestions: [],
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
				if (response.data != null) {
					this.setState({
						developement1Suggestions: dateUtils.getSuggestions(value, response.data)
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
				if (response.data != null) {
					this.setState({
						developement2Suggestions: dateUtils.getSuggestions(value, response.data)
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
						developement3Suggestions: dateUtils.getSuggestions(value, response.data)
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
		this.getDropDownｓ();//全部のドロップダウン
		this.clickButtonDisabled();
	}
	//全部のドロップダウン
	getDropDownｓ = () => {
		var methodArray = ["getGender", "getIntoCompany", "getStaffForms", "getOccupation", "getEmployee", "getJapaneseLevel", "getVisa", "getNationalitys"]
		var data = dateUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				genderStatuss: data[0],//　性別区別
				intoCompanyCodes: data[1],//　入社区分 
				employeeFormCodes: data[2],//　 社員形式 
				siteMaster: data[3],//　　役割
				employeeStatuss: data[4],//　 employeesステータス
				japaneaseLevelCodes: data[5],//　日本語  
				residenceCodes: data[6],//　在留資格
				nationalityCodes: data[7]//　 出身地国
			}
		);
	};

	//初期化の時、disabledをセットします
	clickButtonDisabled = () => {
		$('button[name="clickButton"]').prop('disabled', true);
	};

	//検索s
	searchEmployee = () => {
		const emp = {
			employeeNo: this.state.employeeNo,
			employeeFristName: this.state.employeeFristName,
			employeeFormCode: this.state.employeeFormCode,
			employeeStatus: this.state.employeeStatus,
			genderStatus: this.state.genderStatus,
			ageFrom: this.state.ageFrom,
			ageTo: this.state.ageTo,
			residenceCode: this.state.residenceCode,
			nationalityCode: this.state.nationalityCode,
			customer: this.state.customer,
			intoCompanyCode: this.state.intoCompanyCode,
			japaneaseLeveCode: this.state.japaneaseLeveCode,
			siteRoleCode: this.state.siteRoleCode,
			developLanguage1: this.state.developement1Value,
			developLanguage2: this.state.developement2Value,
			developLanguage3: this.state.developement3Value,
			intoCompanyYearAndMonthFrom: this.state.intoCompanyYearAndMonthFrom,
			intoCompanyYearAndMonthTo: this.state.intoCompanyYearAndMonthTo ,
			kadou: this.state.kadou,
		};
		axios.post("http://127.0.0.1:8080/employee/getEmployeeInfo", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({ employeeList: response.data })
				} else {
					alert("err")
				}
			}
			);
	}
     
	state = {
		intoCompanyYearAndMonthFrom: new Date(),
		intoCompanyYearAndMonthTo: new Date()
	};

	//　入社年月form
	inactiveintoCompanyYearAndMonthFrom = (date) => {
		this.setState(
			{
			intoCompanyYearAndMonthFrom: date
			}
		);
	};
	//　入社年月To
	inactiveintoCompanyYearAndMonthTo = (date) => {
		this.setState(
			{
			intoCompanyYearAndMonthTo: date
			}
		);
	};
	//　　削除ボタン
	employeeDelete = () => {
		const emp = {
			employeeNo: this.state.rowSelectEmployeeNo,
		};
		axios.post("http://127.0.0.1:8080/employee/deleteEmployeeInfo", emp)
			.then(result => {
				if (result.data) {
					alert("数据删除成功");
					this.searchEmployee();
					//削除の後で、rowSelectEmployeeNoの値に空白をセットする
					this.setState(
						{
							rowSelectEmployeeNo: ''
						}
					);
				} else {
					alert("数据删除失败");
				}
			})
			.catch(function (error) {
				alert("删除错误，请检查程序");
			});
	};

	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState(
				{
					rowSelectEmployeeNo: row.employeeNo
				}
			);
			$('button[name="clickButton"]').prop('disabled', false);
			$('#update').removeClass('disabled');
			$('#detail').removeClass('disabled');
			$('#delete').removeClass('disabled');
		} else {
			this.setState(
				{
					rowSelectEmployeeNo: ''
				}
			);
			$('button[name="clickButton"]').prop('disabled', true);
			$('#update').addClass('disabled');
			$('#detail').addClass('disabled');
			$('#delete').addClass('disabled');

		}
	}

	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				から {start} まで {to}, 総計{total}
			</p>
		);
	}

	render() {
		const { employeeNo, employeeFristName, employeeFormCode, genderStatus, employeeStatus,ageFrom, ageTo,
			residenceCode, nationalityCode, customer, japaneaseLeveCode, siteRoleCode, kadou, intoCompanyCode, employeeList } = this.state;
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
				<FormControl id="rowSelectEmployeeNo" name="rowSelectEmployeeNo" hidden />
				<Form >
					<div >
						<Form.Group>
							<Row>
								<Col lg={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl name="employeeNo" autoComplete="off" value={employeeNo} size="sm" onChange={this.valueChange} placeholder="社員番号" />
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl name="employeeFristName" value={employeeFristName} autoComplete="off" onChange={this.valueChange} size="sm" placeholder="社員名" />
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm"
											onChange={this.valueChange}
											name="employeeFormCode" value={employeeFormCode}
											autoComplete="off">
											{this.state.employeeFormCodes.map(data =>
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
											<InputGroup.Text id="inputGroup-sizing-sm">ステータス</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="employeeStatus" value={employeeStatus} autoComplete="off">
											{this.state.employeeStatuss.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
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
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="genderStatus" value={genderStatus} autoComplete="off">
											{this.state.genderStatuss.map(data =>
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
											<InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
											<Form.Control type="text" name="ageFrom" value={ageFrom} autoComplete="off" onChange={this.valueChange} size="sm" 
											/> ～ <Form.Control type="text" name="ageTo" value={ageTo} autoComplete="off" onChange={this.valueChange} size="sm"  />
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">在留資格</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="residenceCode" value={residenceCode} autoComplete="off">
											{this.state.residenceCodes.map(data =>
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
											<InputGroup.Text id="inputGroup-sizing-sm">国籍</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" onChange={this.valueChange} size="sm" name="nationalityCode" value={nationalityCode} autoComplete="off">
											{this.state.nationalityCodes.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
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
										<Form.Control type="text" name="customer" autoComplete="off" value={customer} size="sm" onChange={this.valueChange} className={"optionCss"} placeholder="社お客様先" />
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" onChange={this.valueChange} size="sm" name="intoCompanyCode" value={intoCompanyCode} autoComplete="off">
											{this.state.intoCompanyCodes.map(data =>
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
											<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" onChange={this.valueChange} size="sm" name="japaneaseLeveCode" value={japaneaseLeveCode} autoComplete="off">
											{this.state.japaneaseLevelCodes.map(data =>
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
											<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="siteRoleCode" value={siteRoleCode} autoComplete="off">
											{this.state.siteMaster.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
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
											<InputGroup.Text id="inputGroup-sizing-sm" >開発言語</InputGroup.Text>
											<Autosuggest
												suggestions={developement1Suggestions}
												onSuggestionsFetchRequested={this.onDlt1SuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDlt1SuggestionsClearRequested}
												onSuggestionSelected={this.onDlt1SuggestionSelected}
												getSuggestionValue={dateUtils.getSuggestionDlt}
												renderSuggestion={dateUtils.renderSuggestion}
												inputProps={dlt1InputProps}
											/>
											<Autosuggest
												suggestions={developement2Suggestions}
												onSuggestionsFetchRequested={this.onDlt2SuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDlt2SuggestionsClearRequested}
												onSuggestionSelected={this.onDlt2SuggestionSelected}
												getSuggestionValue={dateUtils.getSuggestionDlt}
												renderSuggestion={dateUtils.renderSuggestion}
												inputProps={dlt2InputProps}
											/>
											<Autosuggest
												suggestions={developement3Suggestions}
												onSuggestionsFetchRequested={this.onDlt3SuggestionsFetchRequested}
												onSuggestionsClearRequested={this.onDlt3SuggestionsClearRequested}
												onSuggestionSelected={this.onDlt3SuggestionSelected}
												getSuggestionValue={dateUtils.getSuggestionDlt}
												renderSuggestion={dateUtils.renderSuggestion}
												inputProps={dlt3InputProps}
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>

								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text><DatePicker
												selected={this.state.intoCompanyYearAndMonthFrom}
												onChange={this.inactiveintoCompanyYearAndMonthFrom}
												locale="ja"
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												id="datePicker"
												className="form-control form-control-sm"
											/>～<DatePicker
												selected={this.state.intoCompanyYearAndMonthTo}
												onChange={this.inactiveintoCompanyYearAndMonthTo}
												locale="ja"
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												id="datePicker"
												className="form-control form-control-sm"
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">稼働</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="kadou" value={kadou} autoComplete="off" >
											<option value=""　>選択ください</option>
											<option value="0">はい</option>
											<option value="1">いいえ</option>
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div style={{ "textAlign": "center" }}>
					<Button size="sm" variant="info" type="submit" onClick={this.searchEmployee}>
						<FontAwesomeIcon icon={faSearch} /> 検索
                        </Button>{' '}
					<Link to={{ pathname: '/subMenu/employee', state: { actionType: 'insert' } }} size="sm" variant="info" className="btn btn-info btn-sm" ><FontAwesomeIcon icon={faSave} /> 追加</Link>{' '}
					<Button size="sm" variant="info" type="reset" onClick={this.resetBook}>
						<FontAwesomeIcon icon={faUndo} /> Reset
                        </Button>
				</div>

				<div>
					<Row >
						<Col sm={4}>
							<Button size="sm" variant="info" name="clickButton" onClick={this.employeeDetail} ><FontAwesomeIcon icon={faDownload} /> 履歴書</Button>{' '}
							<Button size="sm" variant="info" name="clickButton" onClick={this.employeeUpdate} ><FontAwesomeIcon icon={faDownload} /> 在留カード</Button>{' '}
						</Col>
						<Col sm={6}></Col>
						<Col sm={2}>
							<div style={{ "float": "right" }}>
								<Link to={{ pathname: '/subMenu/employee', state: { actionType: 'detail', id: this.state.rowSelectEmployeeNo } }} className="btn btn-info btn-sm disabled" id="detail"><FontAwesomeIcon icon={faList} /> 詳細</Link>{' '}
								<Link to={{ pathname: '/subMenu/employee', state: { actionType: 'update', id: this.state.rowSelectEmployeeNo } }} className="btn btn-info btn-sm disabled" id="update"><FontAwesomeIcon icon={faEdit} /> 修正</Link>{' '}
								<Link className="btn btn-info btn-sm disabled" onClick={e => window.confirm("Are you sure you wish to delete this item?") && this.employeeDelete()} id="delete"><FontAwesomeIcon icon={faTrash} /> 削除</Link>
							</div>
						</Col>
					</Row>
				</div>
				<div >
					<BootstrapTable data={employeeList} selectRow={selectRowProp} className={"bg-white text-dark"} pagination={true} options={this.options}>
						<TableHeaderColumn width='95' dataField='rowNo' dataSort={true} caretRender={dateUtils.getCaret} isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='90' dataField='employeeNo'>社員番号</TableHeaderColumn>
						<TableHeaderColumn width='120' dataField='employeeFristName'>社員名</TableHeaderColumn>
						<TableHeaderColumn width='150' dataField='furigana'>カタカナ</TableHeaderColumn>
						<TableHeaderColumn width='90' dataField='alphabetName'>ローマ字</TableHeaderColumn>
						<TableHeaderColumn width='95' dataField='age' dataSort={true} caretRender={dateUtils.getCaret}>年齢</TableHeaderColumn>
						<TableHeaderColumn width='90' dataField='intoCompanyYearAndMonth'>入社年月</TableHeaderColumn>
						<TableHeaderColumn width='125' dataField='phoneNo'>電話番号</TableHeaderColumn>
						<TableHeaderColumn width='120' dataField='nearestStation'>寄り駅</TableHeaderColumn>
						<TableHeaderColumn width='90' dataField='stayPeriod'>ビザ期間</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div >
		);
	}
}
export default employeeSearch;