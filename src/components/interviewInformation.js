import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"
import * as publicUtils from './utils/publicUtils.js';
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEnvelope, faIdCard, faListOl, faBuilding, faDownload, faBook, faCopy, faSync } from '@fortawesome/free-solid-svg-icons';
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
		interviewInfoNum: '1',
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
			if(this.props.sendValue.interviewLists[i].salesProgressCode !== "0" && this.props.sendValue.interviewLists[i].salesProgressCode !== "1")
				employeeNoList.push(this.props.sendValue.interviewLists[i].employeeNo);
		}
		if(employeeNoList.length > 0){
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
/*		if(this.state.row.interviewClassificationCode1 !== undefined && this.state.row.interviewClassificationCode1 !== null && this.state.row.interviewClassificationCode1 !== ""){
			if(this.state.row.interviewClassificationCode2 !== undefined && this.state.row.interviewClassificationCode2 !== null && this.state.row.interviewClassificationCode2 !== ""){
				this.setState({ "errorsMessageShow": true, errorsMessageValue: "面談情報二つが入力されて、それ以上入力できません。" });
				return;
			}else{
				interviewModel["interviewClassificationCode2"] = this.state.interviewClassificationCode;
				interviewModel["interviewDate2"] = this.state.interviewDate;
				interviewModel["stationCode2"] = this.state.stationCode;
				interviewModel["interviewCustomer2"] = this.state.interviewCustomer;
				interviewModel["interviewInfo2"] = this.state.interviewInfo;
				interviewModel["interviewUrl2"] = this.state.interviewURL;
			}
		}else{
			interviewModel["interviewClassificationCode1"] = this.state.interviewClassificationCode;
			interviewModel["interviewDate1"] = this.state.interviewDate;
			interviewModel["stationCode1"] = this.state.stationCode;
			interviewModel["interviewCustomer1"] = this.state.interviewCustomer;
			interviewModel["interviewInfo1"] = this.state.interviewInfo;
			interviewModel["interviewUrl1"] = this.state.interviewURL;
		}*/
		if(this.state.interviewInfoNum === "1"){
			interviewModel["interviewClassificationCode1"] = this.state.interviewClassificationCode;
			interviewModel["interviewDate1"] = this.state.interviewDate;
			interviewModel["stationCode1"] = this.state.stationCode;
			interviewModel["interviewCustomer1"] = this.state.interviewCustomer;
			interviewModel["interviewInfo1"] = this.state.interviewInfo;
			interviewModel["interviewUrl1"] = this.state.interviewURL;
			
			interviewModel["interviewClassificationCode2"] = this.state.row.interviewClassificationCode2 === null ? "" : this.state.row.interviewClassificationCode2;
			interviewModel["interviewDate2"] = this.state.row.interviewDate2 === null ? "" : this.state.row.interviewDate2;
			interviewModel["stationCode2"] = this.state.row.stationCode2 === null ? "" : this.state.row.stationCode2;
			interviewModel["interviewCustomer2"] = this.state.row.interviewCustomer2 === null ? "" : this.state.row.interviewCustomer2;
			interviewModel["interviewInfo2"] = this.state.row.interviewInfo2 === null ? "" : this.state.row.interviewInfo2;
			interviewModel["interviewUrl2"] = this.state.row.interviewURL2 === null ? "" : this.state.row.interviewURL2;
		}else if(this.state.interviewInfoNum === "2"){
			interviewModel["interviewClassificationCode1"] = this.state.row.interviewClassificationCode1;
			interviewModel["interviewDate1"] = this.state.row.interviewDate1;
			interviewModel["stationCode1"] = this.state.row.stationCode1;
			interviewModel["interviewCustomer1"] = this.state.row.interviewCustomer1;
			interviewModel["interviewInfo1"] = this.state.row.interviewInfo1;
			interviewModel["interviewUrl1"] = this.state.row.interviewURL1;
			
			interviewModel["interviewClassificationCode2"] = this.state.interviewClassificationCode;
			interviewModel["interviewDate2"] = this.state.interviewDate;
			interviewModel["stationCode2"] = this.state.stationCode;
			interviewModel["interviewCustomer2"] = this.state.interviewCustomer;
			interviewModel["interviewInfo2"] = this.state.interviewInfo;
			interviewModel["interviewUrl2"] = this.state.interviewURL;
		}
		axios.post(this.state.serverIP + "salesSituation/updateInterviewLists", interviewModel)
		.then(result => {
			if (result.data != null) {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ myToastShow: true, errorsMessageShow: false, errorsMessageValue: '' });
					setTimeout(() => this.setState({ myToastShow: false }), 3000);
					this.getInterviewLists();
				}
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
							interviewURL: '',
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
				interviewClassificationCode: row.interviewClassificationCode1 === null ? '0' : row.interviewClassificationCode1,
				interviewDateShow: row.interviewDate1 === null ? '' : new Date(publicUtils.strToTime(row.interviewDate1)).getTime(),
				interviewDate: row.interviewDate1 === null ? '' : row.interviewDate1,
				stationCode: row.stationCode1 === null ? '' : row.stationCode1,
				interviewCustomer: row.interviewCustomer1 === null ? '' : row.interviewCustomer1,
				interviewInfo: row.interviewInfo1 === null ? '' : row.interviewInfo1,
				interviewURL: row.interviewUrl1 === null ? '' : row.interviewUrl1,
				interviewInfoNum: "1",
			});
		}else{
			this.setState({
				row: '',
				employeeNo: '',
				interviewClassificationCode: '0',
				interviewDateShow: '',
				interviewDate: '',
				stationCode: '',
				interviewCustomer: '',
				interviewInfo: '',
				interviewURL: '',
				interviewInfoNum: "1",
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
	
	changeInterviewInfo = (row) => {
		if(this.state.interviewInfoNum === "1"){
			this.setState({
				interviewClassificationCode: row.interviewClassificationCode2 === null || row.interviewClassificationCode2 === "" ? '0' : row.interviewClassificationCode2,
				interviewDateShow: row.interviewDate2 === null ? '' : new Date(publicUtils.strToTime(row.interviewDate2)).getTime(),
				interviewDate: row.interviewDate2 === null ? '' : row.interviewDate2,
				stationCode: row.stationCode2 === null ? '' : row.stationCode2,
				interviewCustomer: row.interviewCustomer2 === null ? '' : row.interviewCustomer2,
				interviewInfo: row.interviewInfo2 === null ? '' : row.interviewInfo2,
				interviewURL: row.interviewUrl2 === null ? '' : row.interviewUrl2,
				interviewInfoNum: "2",
			});
		}else{
			this.setState({
				interviewClassificationCode: row.interviewClassificationCode1 === null || row.interviewClassificationCode1 === "" ? '0' : row.interviewClassificationCode1,
				interviewDateShow: row.interviewDate1 === null ? '' : new Date(publicUtils.strToTime(row.interviewDate1)).getTime(),
				interviewDate: row.interviewDate1 === null ? '' : row.interviewDate1,
				stationCode: row.stationCode1 === null ? '' : row.stationCode1,
				interviewCustomer: row.interviewCustomer1 === null ? '' : row.interviewCustomer1,
				interviewInfo: row.interviewInfo1 === null ? '' : row.interviewInfo1,
				interviewURL: row.interviewUrl1 === null ? '' : row.interviewUrl1,
				interviewInfoNum: "1",
			});
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
			<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
				<MyToast myToastShow={this.state.myToastShow} message={"更新成功！"} type={"success"} />
			</div>
			<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
				<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={this.state.errorsMessageValue} type={"success"} />
			</div>
			<Row>
			<Col sm={3}>
				<InputGroup size="sm" className="mb-3">
					<Button size="sm" variant="info" name="clickButton" onClick={this.changeInterviewInfo.bind(this,this.state.row)} disabled = {this.state.employeeNo === '' ? true : false} ><FontAwesomeIcon icon={faSync} /></Button>{' '}
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
						timeIntervals={15}
						className="form-control form-control-sm"
						dateFormat="MM/dd HH:mm"
						minDate={new Date()}
						id={'datePicker-interview'}
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
									id="stationCode" className="auto form-control Autocompletestyle-interview-station"
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
						name="interviewCustomer"
						options={this.state.customers}
						getOptionLabel={(option) => option.name ? option.name : ""}
						value={this.state.customers.find(v => v.code === this.state.interviewCustomer) || ""}
						onSelect={(event) => this.handleTag(event, 'interviewCustomer')}
						renderInput={(params) => (
							<div ref={params.InputProps.ref}>
								<input type="text" {...params.inputProps}
									id="interviewCustomer" className="auto form-control Autocompletestyle-interview"
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
					<textarea ref={(textarea) => this.textArea = textarea} maxLength="100" value = {this.state.interviewInfo}  id="interviewInfo" name="interviewInfo" 
						onChange={this.valueChange} maxLength="100" 
						style={{ height: '80px', width: '81%', resize: 'none', overflow: 'hidden' }}
					/>
				</InputGroup>
			</Col>
			<Col sm={6}>
				<InputGroup size="sm" className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="inputGroup-sizing-sm">URL</InputGroup.Text>
					</InputGroup.Prepend>
					<textarea ref={(textarea) => this.textArea = textarea} maxLength="100" value = {this.state.interviewURL}  id="interviewURL" name="interviewURL" 
						onChange={this.valueChange} maxLength="100" disabled={this.state.stationCode === null || this.state.stationCode === "" ? false : true}
						style={{ height: '80px', width: '81%', resize: 'none', overflow: 'hidden' }}
					/>
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
								<TableHeaderColumn dataField='employeeNo' hidden isKey>社員番号</TableHeaderColumn>
								<TableHeaderColumn width='10%' row='0' rowSpan="2" dataField='employeeName'>{<div style={{ "textAlign": "center" }} >氏名</div>}</TableHeaderColumn>
								<TableHeaderColumn row='0' colSpan='4' >{<div style={{ "textAlign": "center" }} >面談情報1</div>}</TableHeaderColumn>
								<TableHeaderColumn width='7%' row='1' dataField='interviewClassificationCode1' dataFormat={this.formatInterviewClassificationCode} >回数</TableHeaderColumn>
								<TableHeaderColumn width='17%' row='1' dataField='interviewDate1' dataFormat={this.formatInterviewDate} >日付</TableHeaderColumn>
								<TableHeaderColumn width='11%' row='1' dataField='interviewCustomer1' dataFormat={this.formatInterviewCustomer} >お客様</TableHeaderColumn>
								<TableHeaderColumn width='11%' row='1' dataField='stationCode1' dataFormat={this.formatStationCode} >場所</TableHeaderColumn>
								<TableHeaderColumn row='0' colSpan='4' >{<div style={{ "textAlign": "center" }} >面談情報2</div>}</TableHeaderColumn>
								<TableHeaderColumn width='7%' row='1' dataField='interviewClassificationCode2' dataFormat={this.formatInterviewClassificationCode} >回数</TableHeaderColumn>
								<TableHeaderColumn width='17%' row='1' dataField='interviewDate2' dataFormat={this.formatInterviewDate} > 日付</TableHeaderColumn>
								<TableHeaderColumn width='11%' row='1' dataField='interviewCustomer2' dataFormat={this.formatInterviewCustomer} >お客様</TableHeaderColumn>
								<TableHeaderColumn width='11%' row='1' dataField='stationCode2' dataFormat={this.formatStationCode} >場所</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}
export default interviewInformation;

