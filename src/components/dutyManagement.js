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
import * as publicUtils from './utils/publicUtils.js';
import { Link } from "react-router-dom";
import MyToast from './myToast';


registerLocale("ja", ja);
class dutyManagement extends React.Component {
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
	//初期化データ
	initialState = {
		employeeNo:'',employeeName:'', customerName:'', stationName:'', payOffRange:'', workTime:'', workTotalTimeHaveData:'', employeeWorkTimeHaveData:'', updateTime:'',status:'',employeeList: [],
	};
	//初期化の時、disabledをセットします
	clickButtonDisabled = () => {
		$('button[name="clickButton"]').prop('disabled', true);
	};

	//検索s
	searchEmployee = () => {
		const emp = {
			employeeNo: this.state.employeeNo,
			employeeName: this.state.employeeName,
			customerName: this.state.customerName,
			stationName: this.state.stationName,
			payOffRange: this.state.payOffRange,
			workTime: this.state.workTime,
			workTotalTimeHaveData: this.state.workTotalTimeHaveData,
			employeeWorkTimeHaveData: this.state.employeeWorkTimeHaveData,
			updateTime: this.state.updateTime,
			status: this.state.status,
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
		yearAndMonth: new Date()
	};

	//　入社年月form
	inactiveYearAndMonth = (date) => {
		this.setState(
			{
				yearAndMonth: date
			}
		);
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
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

	render() {
		const {employeeNo, employeeName, customerName, stationName, payOffRange, workTime, workTotalTimeHaveData,
			employeeWorkTimeHaveData, updateTime, status,employeeList} = this.state;
		//テーブルの行の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,  // click to select, default is false
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		//テーブルの定義
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
			deleteBtn: this.createCustomDeleteButton,
			onDeleteRow: this.onDeleteRow,
			handleConfirmDeleteRow: this.customConfirm,
		};

		return (
			<div>
				<FormControl id="rowSelectEmployeeNo" name="rowSelectEmployeeNo" hidden />
				<Form >
					<div>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
												selected={this.state.yearAndMonth}
												onChange={this.inactiveYearAndMonth}
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
											<InputGroup.Text id="inputGroup-sizing-sm">時間登録ステータス</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="status" value={status} autoComplete="off" >
											<option value="0">すべて</option>
											<option value="1">未</option>
											<option value="2">済み</option>
											<option value="3">総時間のみ</option>
											<option value="4">登録のみ</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<Button size="sm" variant="info" type="submit" onClick={this.searchEmployee}>
										<FontAwesomeIcon icon={faSearch} /> 検索
				                    </Button>{' '}
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
					<BootstrapTable data={employeeList} className={"bg-white text-dark"} pagination={true} options={options} deleteRow selectRow={selectRow} headerStyle={ { background: '#B1F9D0'} } striped hover condensed >
						<TableHeaderColumn width='95'　tdStyle={ { padding: '.45em' } }  dataField='rowNo' dataSort={true} caretRender={publicUtils.getCaret} isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='90'　tdStyle={ { padding: '.45em' } } 　 dataField='employeeNo'>社員番号</TableHeaderColumn>
						<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } }  dataField='employeeName'>氏名</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }  dataField='customerName'>所属お客様</TableHeaderColumn>
						<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } }  dataField='stationName'>場所</TableHeaderColumn>
						<TableHeaderColumn width='95' tdStyle={ { padding: '.45em' } }  dataField='payOffRange'>精算範囲</TableHeaderColumn>
						<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } }  dataField='workTime'>稼働時間</TableHeaderColumn>
						<TableHeaderColumn width='125' tdStyle={ { padding: '.45em' } }  dataField='workTotalTimeHaveData'>アップロード</TableHeaderColumn>
						<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } }  dataField='employeeWorkTimeHaveData'>登録済み</TableHeaderColumn>
						<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } }  dataField='updateTime'>更新日付</TableHeaderColumn>
						<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } }  dataField='status'>ステータス</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div >
		);
	}
}
export default dutyManagement;