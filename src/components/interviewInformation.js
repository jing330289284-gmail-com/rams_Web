import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"
import * as publicUtils from './utils/publicUtils.js';
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEnvelope, faIdCard, faListOl, faBuilding, faDownload, faBook, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import TableSelect from './TableSelect';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import SalesContent from './salesContent';
import store from './redux/store';
axios.defaults.withCredentials = true;
/**
 * 営業状況画面
 */
class interviewInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
	}

	// 初期化
	initialState = {
		yearMonth: '',
		interviewLists: [],
		interviewClassificationCode: '0',
		interviewNumbers: '',　// 面接1回数
		interviewDateShow: '',　// 面接1日付
		interviewDate: '',　// 面接1日付
		stationCode: '',　// 面接1場所
		interviewCustomer: '',　// 面接1客様
		interviewInfo: '',
		interviewURL: '',
		employeeNo: '',
		row: '',
		getstations: store.getState().dropDown[14], // 全部場所
		customers: store.getState().dropDown[15],// 全部お客様 画面入力用
		interviewClassification: store.getState().dropDown[76].slice(1),// 全部お客様 画面入力用
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};

	// 初期表示のレコードを取る
	componentDidMount() {
		this.getInterviewLists();
	}
	
	getInterviewLists = () => {
		let employeeNoList = [];
		for(let i = 0;i < this.props.sendValue.interviewLists.length;i++){
			employeeNoList.push(this.props.sendValue.interviewLists[i].employeeNo);
		}
		axios.post(this.state.serverIP + "salesSituation/getInterviewLists", employeeNoList)
		.then(result => {
			if (result.data != null) {
				this.setState({
					interviewLists: result.data,
					yearMonth: this.getNextMonth(new Date(), 1),
				})
			} else {
				alert("FAIL");
			}
		})
		.catch(function (error) {
			alert("ERR");
		});
	}
	
	getNextMonth = (date, addMonths) => {
		// var dd = new Date();
		var m = date.getMonth() + 1;
		var y = date.getMonth() + 1 + addMonths > 12 ? (date.getFullYear() + 1) : date.getFullYear();
		if (m + addMonths == 0) {
			y = y - 1;
			m = 12;
		} else {
			if (m + addMonths > 12) {
				m = '01';
			} else {
				m = m + 1 <= 10 ? '0' + (m + addMonths) : (m + addMonths);
			}
		}
		return y + "" + m;
	}
	
	update = () => {
		let interviewModel = {};
		interviewModel["employeeNo"] = this.state.employeeNo;
		interviewModel["salesYearAndMonth"] = this.state.yearMonth;
		if(this.state.row.interviewClassificationCode1 !== undefined && this.state.row.interviewClassificationCode1 !== null && this.state.row.interviewClassificationCode1 !== ""){
			interviewModel["interviewClassificationCode2"] = this.state.interviewClassificationCode;
			interviewModel["interviewDate2"] = this.state.interviewDate;
			interviewModel["stationCode2"] = this.state.stationCode;
			interviewModel["interviewCustomer2"] = this.state.interviewCustomer;
			interviewModel["interviewInfo2"] = this.state.interviewInfo;
			interviewModel["interviewUrl2"] = this.state.interviewURL;
		}else{
			interviewModel["interviewClassificationCode1"] = this.state.interviewClassificationCode;
			interviewModel["interviewDate1"] = this.state.interviewDate;
			interviewModel["stationCode1"] = this.state.stationCode;
			interviewModel["interviewCustomer1"] = this.state.interviewCustomer;
			interviewModel["interviewInfo1"] = this.state.interviewInfo;
			interviewModel["interviewUrl1"] = this.state.interviewURL;
		}
		axios.post(this.state.serverIP + "salesSituation/updateInterviewLists", interviewModel)
		.then(result => {
			if (result.data != null) {
				this.getInterviewLists();
			} else {
				alert("FAIL");
			}
		})
		.catch(function (error) {
			alert("ERR");
		});
	}
	
	// onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	};
	
	// setinterviewDate1
	setinterviewDate = (date) => {
		this.setState({
			interviewDateShow: date,
			interviewDate: publicUtils.timeToStr(date)
		});
	}
	
	// AUTOSELECT select事件
	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (fieldName === "station" && this.state.getstations.find((v) => (v.name === value)) !== undefined) {
				switch (id) {
					case 'stationCode':
						this.setState({
							stationCode: this.state.getstations.find((v) => (v.name === value)).code,
						})
						break;
					default:
				}
			} else if (fieldName === "interviewCustomer" && this.state.customers.find((v) => (v.name === value)) !== undefined) {
				switch (id) {
					case 'interviewCustomer':
						this.setState({
							interviewCustomer: this.state.customers.find((v) => (v.name === value)).code,
						})
						break;
					default:
				}
			}
		}
	};
	
	// レコードselect事件
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState({
				row: row,
				employeeNo: row.employeeNo,
			});
		}else{
			this.setState({
				row: '',
				employeeNo: '',
			});
		}
	}
	
	// TABLE共通
	renderShowsTotal = (start, to, total) => {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}
	
	// 面談回数
	formatInterviewClassificationCode = (cell,row) => {
		var interviewClassification = this.state.interviewClassification;
		for (var i in interviewClassification) {
			if (cell === interviewClassification[i].code) {
				return interviewClassification[i].name;
			}
		}
	}

	// 日付
	formatInterviewDate = (cell,row) => {
		if(cell != undefined && cell != null && cell != ""){
			return cell.substring(0,4) + "/" + cell.substring(4,6) + "/" + cell.substring(6,8) + " " + cell.substring(8,10) + ":" + cell.substring(10,12);
		}
	}
	
	// お客様
	formatInterviewCustomer = (cell,row) => {
		var customers = this.state.customers;
		for (var i in customers) {
			if (cell === customers[i].code) {
				return customers[i].name;
			}
		}
	}
	
	// 場所
	formatStationCode = (cell,row) => {
		var getstations = this.state.getstations;
		for (var i in getstations) {
			if (cell === getstations[i].code) {
				return getstations[i].name;
			}
		}
	}

	render() {
		const selectRow = {
				mode: 'radio',
				bgColor: 'pink',
				clickToSelectAndEditCell: true,
				hideSelectColumn: true,
				clickToSelect: true,
				clickToExpand: true,
				onSelect: this.handleRowSelect,
			};
			
		const options = {
				noDataText: (<i className="" style={{ 'fontSize': '24px' }}>show what you want to show!</i>),
				defaultSortOrder: 'dsc',
				sizePerPage: 10,
				pageStartIndex: 1,
				paginationSize: 3,
				prePage: '<', // Previous page button text
				nextPage: '>', // Next page button text
				firstPage: '<<', // First page button text
				lastPage: '>>', // Last page button text
				hideSizePerPage: true,
				alwaysShowAllBtns: true,
				paginationShowsTotal: this.renderShowsTotal,
			};
		return (			
			<div>
			<Row>
			<Col sm={3}>
				<InputGroup size="sm" className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="inputGroup-sizing-sm">面談回数</InputGroup.Text>
					</InputGroup.Prepend>
					<Form.Control as="select" size="sm"
						onChange={this.valueChange}
						name="interviewClassificationCode" value={this.state.interviewClassificationCode}
						autoComplete="off" >
						{this.state.interviewClassification.map(date =>
							<option key={date.code} value={date.code}>
								{date.name}
							</option>
						)}
					</Form.Control>
				</InputGroup>
			</Col>
			<Col sm={3}>
				<InputGroup size="sm" className="mb-3" style={{ flexFlow: "nowrap", width: "200%" }}>
				<InputGroup.Prepend>
					<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
				</InputGroup.Prepend>
				<InputGroup.Append>
					<DatePicker
						selected={this.state.interviewDateShow}
						onChange={this.setinterviewDate}
						autoComplete="off"
						locale="ja"
						showTimeSelect
						className="form-control form-control-sm"
						dateFormat="MM/dd HH:mm"
						minDate={new Date()}
						id={'datePicker'}
					/>
				</InputGroup.Append>
			</InputGroup>
			</Col>
			<Col sm={3}>
				<InputGroup size="sm" className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
					</InputGroup.Prepend>
					<Autocomplete
						name="stationCode"
						options={this.state.getstations}
						getOptionLabel={(option) => option.name ? option.name : ""}
						value={this.state.getstations.find(v => v.code === this.state.stationCode) || ""}
						onSelect={(event) => this.handleTag(event, 'station')}
						renderInput={(params) => (
							<div ref={params.InputProps.ref}>
								<input type="text" {...params.inputProps}
									id="stationCode" className="auto form-control Autocompletestyle"
								/>
							</div>
						)}
					/>
				</InputGroup>
			</Col>
			<Col sm={3}>
				<InputGroup size="sm" className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
					</InputGroup.Prepend>
					<Autocomplete
						disabled={this.state.readFlag}
						name="interviewCustomer"
						options={this.state.customers}
						getOptionLabel={(option) => option.name ? option.name : ""}
						value={this.state.customers.find(v => v.code === this.state.interviewCustomer) || ""}
						onSelect={(event) => this.handleTag(event, 'interviewCustomer')}
						renderInput={(params) => (
							<div ref={params.InputProps.ref}>
								<input type="text" {...params.inputProps}
									id="interviewCustomer" className="auto form-control Autocompletestyle"
								/>
							</div>
						)}
					/>
				</InputGroup>
			</Col>
			</Row>
			<Row>
			<Col sm={6}>
				<InputGroup size="sm" className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="inputGroup-sizing-sm">面談情報</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl value={this.state.interviewInfo} autoComplete="off" name="interviewInfo" maxLength="100" onChange={this.valueChange} size="sm" />
				</InputGroup>
			</Col>
			<Col sm={6}>
				<InputGroup size="sm" className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="inputGroup-sizing-sm">URL</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl value={this.state.interviewURL} autoComplete="off" name="interviewURL" maxLength="100" onChange={this.valueChange} size="sm" />
				</InputGroup>
			</Col>
			</Row>
			<Row>
			<Col sm={12}>
				<div>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" name="clickButton" onClick = {this.update} disabled = {this.state.employeeNo === '' ? true : false} ><FontAwesomeIcon icon={faSave} /> 更新</Button>{' '}
					</div>
				</div>
			</Col>
			</Row>
				<Form onSubmit={this.savealesSituation}>
					<Row>
						<Col sm={12}>
							<BootstrapTable
								ref='table'
								data={this.state.interviewLists}
								pagination
								options={options}
								selectRow={selectRow}
								trClassName="customClass"
								headerStyle={{ background: '#5599FF' }} striped hover condensed>
								<TableHeaderColumn row='1' dataField='employeeNo' hidden isKey>社員番号</TableHeaderColumn>
								<TableHeaderColumn row='0' ></TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='employeeName' >氏名</TableHeaderColumn>
								<TableHeaderColumn row='0' cellSpan='2' >面談情報1</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewClassificationCode1' dataFormat={this.formatInterviewClassificationCode} >面談回数</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewDate1' dataFormat={this.formatInterviewDate} >日付</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewCustomer1' dataFormat={this.formatInterviewCustomer} >お客様</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='stationCode1' dataFormat={this.formatStationCode} >場所</TableHeaderColumn>
								<TableHeaderColumn row='0' >面談情報2</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewClassificationCode2' dataFormat={this.formatInterviewClassificationCode} >面談回数</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewDate2' dataFormat={this.formatInterviewDate} > 日付</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewCustomer2' dataFormat={this.formatInterviewCustomer} >お客様</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='stationCode2' dataFormat={this.formatStationCode} >場所</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}
export default interviewInformation;

