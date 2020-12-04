import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl, Modal} from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker, {  } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faUndo, faFile } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
import OtherCostModel from './otherCost';
import * as utils from './utils/publicUtils.js';
axios.defaults.withCredentials = true;

/**
 * 費用登録画面
 */
class workTimeSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.searchWorkTime = this.searchWorkTime.bind(this);

	};

	componentDidMount() {
		let ThisYear = new Date();
		ThisYear = ThisYear.getFullYear();
		this.setYearAndMonth();
		this.searchWorkTime(publicUtils.converToLocalTime(ThisYear + "01", false), publicUtils.converToLocalTime(ThisYear + "12", false));
	}
	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	//　初期化データ
	initialState = {
		station: store.getState().dropDown[14],
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};
	//日付設定
	setYearAndMonth = () => {
		let ThisYear = new Date();
		ThisYear = ThisYear.getFullYear();
		this.setState({
			yearAndMonth1: publicUtils.converToLocalTime(ThisYear + "01", false),
			yearAndMonth2: publicUtils.converToLocalTime(ThisYear + "12", false),
		})
		
	};
	//　検索
	searchWorkTime = (yearAndMonth1, yearAndMonth2) => {
			let workTimeModel = {
				yearAndMonth1: yearAndMonth1 == "" ? publicUtils.formateDate(this.state.yearAndMonth1, false) : publicUtils.formateDate(yearAndMonth1, false),
				yearAndMonth2: yearAndMonth2 == "" ? publicUtils.formateDate(this.state.yearAndMonth2, false) : publicUtils.formateDate(yearAndMonth2, false),
			}
		axios.post(this.state.serverIP + "workTimeSearch/selectWorkTime", workTimeModel)
			.then(response => response.data)
			.then((data) => {
				var sumCost = 0;
				if (data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						data[i].rowNo = i+1;
					} 
				}
				this.setState({
					employeeList: data,
				})
			});
	};
		//　年月1
	inactiveYearAndMonth1 = (date) => {
		this.setState(
			{
				yearAndMonth1: date,
				changeFile: true,
			}
		);
		this.searchWorkTime(date, "");
	};
			//　年月2
	inactiveYearAndMonth2 = (date) => {
		this.setState(
			{
				yearAndMonth2: date,
			}
		);
		this.searchWorkTime("", date);
	};
	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}
	stationCode(code) {
		let station = this.state.station;
		for (var i in station) {
			if (station[i].code != "") {
				if (code == station[i].code) {
					return station[i].name;
				}
			}
		}
	};
	render() {
		const {employeeList} = this.state;
		const station = this.state.station;

		//　テーブルの行の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			clickToSelectAndEditCell: true,
			hideSelectColumn: true,
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		//　 テーブルの定義
		const options = {
			page: 1, 
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: 'Prev', // Previous page button text
			nextPage: 'Next', // Next page button text
			firstPage: 'First', // First page button text
			lastPage: 'Last', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
			expandRowBgColor: 'rgb(165, 165, 165)',
			approvalBtn: this.createCustomApprovalButton,
			onApprovalRow: this.onApprovalRow,
			handleConfirmApprovalRow: this.customConfirm,
			onDeleteRow: this.onDeleteRow,
		};
		const cellEdit = {
			mode: 'click',
			blurToSave: true,
			afterSaveCell: this.sumWorkTimeChange,
		}
		return (
			<div>
				<Form >
					<div>
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>作業時間検索</h2>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
					<Row>
						<Col sm={5}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">期間</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Prepend>
									<DatePicker
										selected={this.state.yearAndMonth1}
										onChange={this.inactiveYearAndMonth1}
										autoComplete="off"
										locale="ja"
										dateFormat="yyyy/MM"
										showMonthYearPicker
										id="datePicker"
										className="form-control form-control-sm"
										
									/>～
									<DatePicker
										selected={this.state.yearAndMonth2}
										onChange={this.inactiveYearAndMonth2}
										autoComplete="off"
										locale="ja"
										dateFormat="yyyy/MM"
										showMonthYearPicker
										id="datePicker"
										className="form-control form-control-sm"
									/>
								</InputGroup.Prepend>
							</InputGroup>	
						</Col>
					</Row>
				</div>
					<div><Col sm={12}>
						<BootstrapTable data={employeeList} ref='table' id="table" pagination={true} options={options} approvalRow selectRow={selectRow} headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='5%'　tdStyle={{ padding: '.45em' }} dataField='rowNo'  isKey>番号</TableHeaderColumn>
							<TableHeaderColumn width='10%' tdStyle={{ padding: '.45em' }} dataField='attendanceYearAndMonth' >年月</TableHeaderColumn>
							<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} dataField='systemName' >システム名</TableHeaderColumn>
						<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} dataField='stationName' dataFormat={this.stationCode.bind(this)}>場所</TableHeaderColumn>
							<TableHeaderColumn width='10%' tdStyle={{ padding: '.45em' }} dataField='payOffRange' >精算時間</TableHeaderColumn>
							<TableHeaderColumn width='5%' tdStyle={{ padding: '.45em' }} dataField='attendanceDays' >出勤日数</TableHeaderColumn>
							<TableHeaderColumn width='5%' tdStyle={{ padding: '.45em' }} dataField='sumWorkTime' >出勤時間</TableHeaderColumn>
							<TableHeaderColumn width='10%' tdStyle={{ padding: '.45em' }} dataField='averageSumWorkTime' >平均稼働</TableHeaderColumn>
							<TableHeaderColumn width='10%' tdStyle={{ padding: '.45em' }} dataField='workTimeRank' >稼動ランキング</TableHeaderColumn>
							<TableHeaderColumn width='10%' tdStyle={{ padding: '.45em' }} dataField='carCost' >交通費用</TableHeaderColumn>
							<TableHeaderColumn width='10%' tdStyle={{ padding: '.45em' }} dataField='otherCost' >他の費用</TableHeaderColumn>
						</BootstrapTable>
					</Col></div>
			</div >
		);
	}
}
export default workTimeSearch;