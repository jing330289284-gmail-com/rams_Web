import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch, faEdit, faTrash, faDownload, faList } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import { Link } from "react-router-dom";
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';

registerLocale("ja", ja);
class employeeSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.searchEmployee = this.searchEmployee.bind(this);
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
		employeeList: [], resumeInfo1: '', resumeInfo2: '', residentCardInfo: '',

	};
	//リセット　reset
	resetStates = {
		employeeNo: null, employeeName: null, employeeFormCode: null, employeeStatus: null, genderStatus: null,
		ageFrom: null, ageTo: null, residenceCode: null, nationalityCode: null, customer: null,
		intoCompanyCode: null, japaneaseLeveCode: null, siteRoleCode: null, intoCompanyYearAndMonthFrom: null, intoCompanyYearAndMonthTo: null,
		kadou: null, developLanguage1: null, developLanguage2: null, developLanguage3: null,
	};

	//初期化メソッド
	componentDidMount() {
		this.props.fetchDropDown();
		this.clickButtonDisabled();
	}

	//初期化の時、disabledをセットします
	clickButtonDisabled = () => {
		$('button[name="clickButton"]').prop('disabled', true);
	};

	//検索s
	searchEmployee = () => {
		const emp = {
			employeeNo: this.state.employeeNo,
			employeeFristName: this.state.employeeName,
			employeeFormCode: this.state.employeeFormCode,
			employeeStatus: this.state.employeeStatus,
			genderStatus: this.state.genderStatus,
			ageFrom: publicUtils.birthday_age(this.state.ageFrom),
			ageTo: publicUtils.birthday_age(this.state.ageTo),
			residenceCode: this.state.residenceCode,
			nationalityCode: this.state.nationalityCode,
			customer: this.state.customer,
			intoCompanyCode: this.state.intoCompanyCode,
			japaneaseLeveCode: this.state.japaneaseLeveCode,
			siteRoleCode: this.state.siteRoleCode,
			developLanguage1: publicUtils.labelGetValue($("#developLanguageCode1").val(), this.props.developLanguageMaster),
			developLanguage2: publicUtils.labelGetValue($("#developLanguageCode2").val(), this.props.developLanguageMaster),
			developLanguage3: publicUtils.labelGetValue($("#developLanguageCode3").val(), this.props.developLanguageMaster),
			intoCompanyYearAndMonthFrom: this.state.intoCompanyYearAndMonthFrom,
			intoCompanyYearAndMonthTo: this.state.intoCompanyYearAndMonthTo,
			kadou: this.state.kadou,
		};
		//axios.post("http://127.0.0.1:8080/employee/getEmployeeInfo", emp)
		axios.post(this.props.serverIP + "employee/getEmployeeInfo", emp)
			.then(response => {
				if (response.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
				} else {
					this.setState({ employeeList: response.data.data, "errorsMessageShow": false })
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
	employeeDelete = () => {
		//将id进行数据类型转换，强制转换为数字类型，方便下面进行判断。
		var a = window.confirm("削除していただきますか？");
		if (a) {
			$("#deleteBtn").click();
		}
	}
	//隠した削除ボタン
	createCustomDeleteButton = (onClick) => {
		return (
			<Button variant="info" id="deleteBtn" hidden onClick={onClick} >删除</Button>
		);
	}
	//隠した削除ボタンの実装
	onDeleteRow = (rows) => {
		const emp = {
			employeeNo: this.state.rowSelectEmployeeNo,
			resumeInfo1: this.state.resumeInfo1,
			resumeInfo2: this.state.resumeInfo2,
			residentCardInfo: this.state.residentCardInfo,
		};
		axios.post(this.props.serverIP +"employee/deleteEmployeeInfo", emp)
			.then(result => {
				if (result.data) {
					this.searchEmployee();
					//削除の後で、rowSelectEmployeeNoの値に空白をセットする
					this.setState(
						{
							rowSelectEmployeeNo: ''
						}
					);
					this.setState({ "myToastShow": true });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				} else {
					this.setState({ "myToastShow": false });
				}
			})
			.catch(function (error) {
				alert("删除错误，请检查程序");
			});
	}
	//　　削除前のデフォルトお知らせの削除
	customConfirm(next, dropRowKeys) {
		const dropRowKeysStr = dropRowKeys.join(',');
		next();
	}

	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState(
				{
					rowSelectEmployeeNo: row.employeeNo,
					residentCardInfo: row.residentCardInfo,
					resumeInfo1: row.resumeInfo1,
					resumeInfo2: row.resumeInfo2,
				}
			);
			$('#resumeInfo1').prop('disabled', false);
			$('#resumeInfo2').prop('disabled', false);
			$('#residentCardInfo').prop('disabled', false);
			$('#update').removeClass('disabled');
			$('#detail').removeClass('disabled');
			$('#delete').removeClass('disabled');
		} else {
			this.setState(
				{
					rowSelectEmployeeNo: ''
				}
			);
			$('#resumeInfo1').prop('disabled', true);
			$('#resumeInfo2').prop('disabled', true);
			$('#residentCardInfo').prop('disabled', true);
			$('#update').addClass('disabled');
			$('#detail').addClass('disabled');
			$('#delete').addClass('disabled');
		}
	}

	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

	formatBrthday(birthday) {
		let value = publicUtils.converToLocalTime(birthday, true) === "" ? "" : Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(birthday, true).getTime()) / 31536000000);
		return value;
	}

	formatStayPeriod(stayPeriod) {
		let value = publicUtils.converToLocalTime(stayPeriod, false) === "" ? "" : publicUtils.getFullYearMonth(new Date(), publicUtils.converToLocalTime(stayPeriod, false));
		return value;
	}

	// AUTOSELECT select事件
	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (this.props.developLanguageMaster.find((v) => (v.name === value)) !== undefined ||
				this.props.employeeInfo.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'developLanguage1':
						this.setState({
							developLanguage1: this.props.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage2':
						this.setState({
							developLanguage2: this.props.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'developLanguage3':
						this.setState({
							developLanguage3: this.props.developLanguageMaster.find((v) => (v.name === value)).code,
						})
						break;
					case 'employeeName':
						this.setState({
							employeeName: value,
						})
						break;
					default:
				}
			}
		}
	};

	render() {
		const { employeeNo, employeeFormCode, genderStatus, employeeStatus, ageFrom, ageTo,
			residenceCode, nationalityCode, customer, japaneaseLeveCode, siteRoleCode, kadou, intoCompanyCode,
			employeeList, errorsMessageValue } = this.state;
		//テーブルの行の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			clickToExpand: true,
			onSelect: this.handleRowSelect,
		};
		//テーブルの定義
		const options = {
			page: 1,
			sizePerPage: 5,
			pageStartIndex: 1,
			paginationSize: 3,
			prePage: '<',
			nextPage: '>',
			firstPage: '<<',
			lastPage: '>>',
			paginationShowsTotal: this.renderShowsTotal,
			hideSizePerPage: true,
			expandRowBgColor: 'rgb(165, 165, 165)',
			deleteBtn: this.createCustomDeleteButton,
			onDeleteRow: this.onDeleteRow,
			handleConfirmDeleteRow: this.customConfirm,
		};

		const genderStatuss = this.props.genderStatuss;
		const intoCompanyCodes = this.props.nationalityCodes;
		const employeeFormCodes = this.props.employeeFormCodes;
		const siteMaster = this.props.siteMaster;
		const employeeStatuss = this.props.employeeStatuss;
		const japaneaseLevelCodes = this.props.japaneaseLevelCodes;
		const residenceCodes = this.props.residenceCodes;
		const nationalityCodes = this.props.nationalityCodes;
		const developLanguageMaster = this.props.developLanguageMaster;
		const employeeInfo = this.props.employeeInfo;

		return (
			<div >
				<FormControl id="rowSelectEmployeeNo" name="rowSelectEmployeeNo" hidden />
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={"削除成功！"} type={"danger"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<Row inline="true">
					<Col className="text-center">
						<h2>社員情報検索</h2>
					</Col>
				</Row>
				<br />
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
										<Autocomplete
											id="employeeName"
											name="employeeName"
											options={employeeInfo}
											getOptionLabel={(option) => option.name}
											value={employeeInfo.find(v => v.name === this.state.employeeName) || {}}
											onSelect={(event) => this.handleTag(event, 'employeeName')}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  社員名" type="text" {...params.inputProps} className="auto"
														style={{ width: 140, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>
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
											{employeeFormCodes.map(data =>
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
											{employeeStatuss.map(data =>
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
											{genderStatuss.map(data =>
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
										</InputGroup.Prepend>
										<Form.Control type="text" name="ageFrom" value={ageFrom} autoComplete="off" onChange={this.valueChange} size="sm"
										/> ～ <Form.Control type="text" name="ageTo" value={ageTo} autoComplete="off" onChange={this.valueChange} size="sm" />

									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">在留資格</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="residenceCode" value={residenceCode} autoComplete="off">
											{residenceCodes.map(data =>
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
											{nationalityCodes.map(data =>
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
											{intoCompanyCodes.map(data =>
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
											{japaneaseLevelCodes.map(data =>
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
											{siteMaster.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={6}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm" >開発言語</InputGroup.Text>
										</InputGroup.Prepend>

										<Autocomplete
											id="developLanguageCode1"
											name="developLanguageCode1"
											options={developLanguageMaster}
											getOptionLabel={(option) => option.name}
											value={developLanguageMaster.find(v => v.code === this.state.developLanguage1) || {}}
											onSelect={(event) => this.handleTag(event, 'developLanguage1')}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  開発言語1" type="text" {...params.inputProps} className="auto"
														style={{ width: 140, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>
										<Autocomplete
											id="developLanguageCode2"
											name="developLanguageCode2"
											options={developLanguageMaster}
											getOptionLabel={(option) => option.name}
											value={developLanguageMaster.find(v => v.code === this.state.developLanguage2) || {}}
											onSelect={(event) => this.handleTag(event, 'developLanguage2')}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  開発言語2" type="text" {...params.inputProps} className="auto"
														style={{ width: 140, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>
										<Autocomplete
											id="developLanguageCode3"
											name="developLanguageCode3"
											options={developLanguageMaster}
											getOptionLabel={(option) => option.name}
											value={developLanguageMaster.find(v => v.code === this.state.developLanguage3) || {}}
											onSelect={(event) => this.handleTag(event, 'developLanguage3')}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  開発言語3" type="text" {...params.inputProps} className="auto"
														style={{ width: 140, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>

									</InputGroup>
								</Col>

								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
											<DatePicker
												selected={this.state.intoCompanyYearAndMonthFrom}
												onChange={this.inactiveintoCompanyYearAndMonthFrom}
												locale="ja"
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												id="datePicker"
												className="form-control form-control-sm"
												autoComplete="off"
											/>～<DatePicker
												selected={this.state.intoCompanyYearAndMonthTo}
												onChange={this.inactiveintoCompanyYearAndMonthTo}
												locale="ja"
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												id="datePicker"
												className="form-control form-control-sm"
												autoComplete="off"
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
					<Link to={{ pathname: '/subMenuManager/employeeInsert', state: { actionType: 'insert' } }} size="sm" variant="info" className="btn btn-info btn-sm" ><FontAwesomeIcon icon={faSave} /> 追加</Link>{' '}
					<Button size="sm" variant="info" type="reset" onClick={this.resetBook}>
						<FontAwesomeIcon icon={faUndo} /> Reset
                        </Button>
				</div>

				<div>
					<Row >
						<Col sm={4}>
							<Button size="sm" variant="info" name="clickButton" id="resumeInfo1" onClick={publicUtils.handleDownload.bind(this, this.state.resumeInfo1, this.props.serverIP)} ><FontAwesomeIcon icon={faDownload} /> 履歴書1</Button>{' '}
							<Button size="sm" variant="info" name="clickButton" id="resumeInfo2" onClick={publicUtils.handleDownload.bind(this, this.state.resumeInfo2, this.props.serverIP)} ><FontAwesomeIcon icon={faDownload} /> 履歴書2</Button>{' '}
							<Button size="sm" variant="info" name="clickButton" id="residentCardInfo" onClick={publicUtils.handleDownload.bind(this, this.state.residentCardInfo, this.props.serverIP)} ><FontAwesomeIcon icon={faDownload} /> 在留カード</Button>{' '}
						</Col>
						<Col sm={6}></Col>
						<Col sm={2}>
							<div style={{ "float": "right" }}>
								<Link to={{ pathname: '/subMenuManager/employee', state: { actionType: 'detail', id: this.state.rowSelectEmployeeNo } }} className="btn btn-info btn-sm disabled" id="detail"><FontAwesomeIcon icon={faList} /> 詳細</Link>{' '}
								<Link to={{ pathname: '/subMenuManager/employee', state: { actionType: 'update', id: this.state.rowSelectEmployeeNo } }} className="btn btn-info btn-sm disabled" id="update"><FontAwesomeIcon icon={faEdit} /> 修正</Link>{' '}
								<Link className="btn btn-info btn-sm disabled" onClick={this.employeeDelete} id="delete"><FontAwesomeIcon icon={faTrash} /> 削除</Link>
							</div>
						</Col>
					</Row>
				</div>
				<div >
					<Row >


						<Col sm={12}>
							<BootstrapTable data={employeeList} pagination={true} options={options} deleteRow selectRow={selectRow} headerStyle={{ background: '#5599FF' }} striped hover condensed >
								<TableHeaderColumn width='95' tdStyle={{ padding: '.45em' }} dataField='rowNo' isKey>番号</TableHeaderColumn>
								<TableHeaderColumn width='90' tdStyle={{ padding: '.45em' }} dataField='employeeNo'>社員番号</TableHeaderColumn>
								<TableHeaderColumn width='120' tdStyle={{ padding: '.45em' }} dataField='employeeFristName'>社員名</TableHeaderColumn>
								<TableHeaderColumn width='150' tdStyle={{ padding: '.45em' }} dataField='furigana'>カタカナ</TableHeaderColumn>
								<TableHeaderColumn width='90' tdStyle={{ padding: '.45em' }} dataField='alphabetName'>ローマ字</TableHeaderColumn>
								<TableHeaderColumn width='95' tdStyle={{ padding: '.45em' }} dataField='birthday' dataFormat={this.formatBrthday.bind(this)}>年齢</TableHeaderColumn>
								<TableHeaderColumn width='90' tdStyle={{ padding: '.45em' }} dataField='intoCompanyYearAndMonth'>入社年月</TableHeaderColumn>
								<TableHeaderColumn width='125' tdStyle={{ padding: '.45em' }} dataField='phoneNo'>電話番号</TableHeaderColumn>
								<TableHeaderColumn width='120' tdStyle={{ padding: '.45em' }} dataField='stationName'>寄り駅</TableHeaderColumn>
								<TableHeaderColumn width='90' tdStyle={{ padding: '.45em' }} dataField='stayPeriod' dataFormat={this.formatStayPeriod.bind(this)}>ビザ期間</TableHeaderColumn>
								<TableHeaderColumn dataField='resumeInfo1' hidden={true}>履歴書1</TableHeaderColumn>
								<TableHeaderColumn dataField='resumeInfo2' hidden={true}>履歴書2</TableHeaderColumn>
								<TableHeaderColumn dataField='residentCardInfo' hidden={true}>在留カード</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</Row>
				</div>
			</div >
		);
	}
}


const mapStateToProps = state => {
	return {
		genderStatuss: state.data.dataReques.length >= 1 ? state.data.dataReques[0] : [],
		intoCompanyCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[1] : [],
		employeeFormCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[2] : [],
		siteMaster: state.data.dataReques.length >= 1 ? state.data.dataReques[3] : [],
		employeeStatuss: state.data.dataReques.length >= 1 ? state.data.dataReques[4] : [],
		japaneaseLevelCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[5] : [],
		residenceCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[6] : [],
		nationalityCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[7] : [],
		developLanguageMaster: state.data.dataReques.length >= 1 ? state.data.dataReques[8].slice(1) : [],
		employeeInfo: state.data.dataReques.length >= 1 ? state.data.dataReques[9].slice(1) : [],
		serverIP: state.data.dataReques[state.data.dataReques.length-1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(employeeSearch);
