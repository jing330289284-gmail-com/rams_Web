import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faListOl } from '@fortawesome/free-solid-svg-icons';
import store from './redux/store';
axios.defaults.withCredentials = true;
/**
 * 報告書送信画面対象社員
 */
class sendRepotAppend extends Component {
	initialState = {
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		judgmentlist: [{"code":"0","name":"✕"},{"code":"1","name":"〇"}],// 承認済み
																		// 送信済み
		currentPage: 1,// 該当page番号
		allEmployee: [],
		selectetRowIds: this.props.customer.mainChargeList!== undefined && this.props.customer.mainChargeList !== "" && this.props.customer.mainChargeList !== null ? this.props.customer.mainChargeList.split(','):[],
		selectetemployeeNo:this.props.customer.mainChargeList!== undefined && this.props.customer.mainChargeList !== "" && this.props.customer.mainChargeList !== null ? this.props.customer.mainChargeList.split(','):[],
		selectetemployeeName:this.props.customer.mainChargeList!== undefined && this.props.customer.mainChargeList !== "" && this.props.customer.mainChargeList !== null ? this.props.customer.mainChargeList.split(','):[],
		allSelectedFlag: false,
		allTargetemployeeNo: [],
		allRowId: [],
		parentSelectedInfo: this.props.customer,
		appendEmployeeMsg: {
			employeeNo2: '',
			employeeName2: '',
		}
	}
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
	}
	componentDidMount() {
		this.getTargetEmployees(this.props.customer.customerNo);
		this.props.customer.test = this.props.customer.test !== undefined && this.props.customer.test !== "" && this.props.customer.test !== null ? this.props.customer.test:this.props.customer.mainChargeList;
		let str = this.props.customer.test !== undefined && this.props.customer.test !== "" && this.props.customer.test !== null ? this.props.customer.test.split(',') : [];
		for(let i in str){
			str[i] = Number(str[i]);
		}
		this.refs.salesPersonTable.setState({
			selectedRowKeys: str,
		});
		this.refs.salesPersonTable.store.selected = str;
	}
	getTargetEmployees = (customerNo) => {
		axios.post(this.state.serverIP + "sendRepot/getTargetEmployees",{customerNo: customerNo})
		.then(result => {
			let targetEmployeeNoArray = new Array([]);
			let rowIdArray = new Array([]);
			for (let i in result.data) {
				targetEmployeeNoArray.push(result.data[i].employeeNo);
				rowIdArray.push(result.data[i].rowId);
			}
			this.setState({
				allEmployee: result.data,
				allTargetemployeeNo: targetEmployeeNoArray,
				allRowId: rowIdArray
			});
		})
		.catch(function (err) {
			alert(err)
		})
	}
handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState({
				selectetRowIds: this.state.selectetRowIds.concat([row.rowId]),
				selectetemployeeNo: this.state.selectetemployeeNo.concat([row.employeeNo]),
				selectetemployeeName: this.state.selectetemployeeName.concat([row.employeeName]),
				appendEmployeeMsg: {
					employeeNo2: this.state.selectetemployeeNo.join(","),
					employeeName2: this.state.selectetemployeeName.join(","),
				}
			})
		} else {
			let index = this.state.selectetRowIds.findIndex(item => item === String(row.rowId));
			this.state.selectetRowIds.splice(index, 1);
			index = this.state.selectetemployeeNo.findIndex(item => item === row.employeeNo);
			this.state.selectetemployeeNo.splice(index, 1);
			this.setState({
				selectetRowIds: this.state.selectetRowIds,
				selectetemployeeNo: this.state.selectetemployeeNo,
				selectetemployeeName: this.state.selectetemployeeName,
			})
		}
		if (this.state.allSelectedFlag) {
			this.refs.salesPersonTable.setState({
				selectedRowKeys: [],
			});
			this.setState({
				allSelectedFlag: !this.state.allSelectedFlag,
				selectetRowIds: [],
				selectetemployeeNo: [],
				employeeNo2: this.state.selectetemployeeNo.join(","),
					employeeName2: this.state.selectetemployeeName.join(","),
			});
		}
	}
	// 全て選択ボタン事件
	selectAllLists = () => {
		this.refs.salesPersonTable.store.selected = [];
		if (!this.state.allSelectedFlag) {
			this.refs.salesPersonTable.setState({
				selectedRowKeys: this.state.allTargetemployeeNo,
			})
			this.setState({
				allSelectedFlag: !this.state.allSelectedFlag,
				selectetRowIds: this.state.allTargetemployeeNo,
			})
		} else {
			this.refs.salesPersonTable.setState({
				selectedRowKeys: [],
			})
			this.setState({
				allSelectedFlag: !this.state.allSelectedFlag,
				selectetRowIds: [],
				selectetRowMails: [],
			})
		}
	}
employeeSelected = () => {
		let employeeNos = this.state.selectetemployeeNo.join(",");
		let employeeNames = this.state.selectetemployeeName.join(",");
		this.state.parentSelectedInfo.sendRepotsAppend = employeeNames;// 表示用
		this.state.parentSelectedInfo.sendRepotsAppend2 = employeeNos;
		let employeesOthers = this.state.selectetemployeeNo;
		employeesOthers.pop();
		if(this.props.customer.storageListName != null && this.props.customer.storageListName !== ""){
			axios.post(this.state.serverIP + "sendRepot/targetEmployeeListsUpdate", 
					{
						storageListName:this.props.customer.storageListName,
						customerNo:this.props.customer.customerNo,
						candidateInChargeList:employeeNos+"."+employeeNames,
					})
			.then(() => {
				})
				.catch(function (err) {
					alert(err)
				})
		}
		this.props.allState.saveTargetEmployees(this.state.parentSelectedInfo,this.state.appendEmployeeMsg);
	}
	stationsFormat = (cell) => {
		let stationStatus = this.props.stations;
		for (var i in stationStatus) {
			if (cell === stationStatus[i].code) {
				return stationStatus[i].name;
			}
		}
	}
	employeeStatusFormat = (cell) => {
		let employeeStatus = this.props.employeeStatusList;
		for (var i in employeeStatus) {
			if (cell === employeeStatus[i].code) {
				return employeeStatus[i].name;
			}
		}
	}
	Judgment(code) {
   		let judgmenStatuss = this.state.judgmentlist;
        for (var i in judgmenStatuss) {
            if (code === judgmenStatuss[i].code) {
                return judgmenStatuss[i].name;
            }
        }
    };
	render() {
		const selectRow = {
			mode: 'checkbox',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			clickToExpand: true,
			onSelect: this.handleRowSelect,
		};
		const options = {
			onPageChange: page => {
				this.setState({ currentPage: page });
			},
			page: this.state.currentPage,
			defaultSortOrder: 'dsc',
			sizePerPage: 5,
			pageStartIndex: 1,
			paginationSize: 2,
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			hideSizePerPage: true,
			alwaysShowAllBtns: true,
			paginationShowsTotal: this.renderShowsTotal,
		};
		return (
			<div >
				<Row inline="true">
					<Col className="text-center">
						<h2>対象社員</h2>
					</Col>
				</Row>
				<Form >
					<Row>
						<Col sm={4}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">会社名</InputGroup.Text></InputGroup.Prepend>
								<FormControl defaultValue={this.props.customer.customerName} disabled size="sm" />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col sm={4}>
						
							<Button size="sm" variant="info" name="clickButton" onClick={this.selectAllLists}
								disabled={0 !== this.state.allEmployee.length ? false : true}><FontAwesomeIcon icon={faListOl} />すべて選択</Button>
						</Col>
					</Row>
				</Form>
				<div >
					<Col>
					<BootstrapTable
						ref="salesPersonTable"
						data={this.state.allEmployee}
						pagination={true}
						options={options}
						selectRow={selectRow}
						trClassName="customClass"
						headerStyle={{ background: '#5599FF' }} striped hover condensed>
						<TableHeaderColumn width='7%' dataField='rowId' dataAlign='center' autoValue dataSort={true} editable={false}>番号</TableHeaderColumn>
						<TableHeaderColumn width='11%' dataField='employeeName'>氏名</TableHeaderColumn>
						<TableHeaderColumn width='9%' dataField='employeeStatus' dataFormat={this.employeeStatusFormat} >所属</TableHeaderColumn>
						<TableHeaderColumn width='9%' dataField='stationCode' dataFormat={this.stationsFormat}>現場</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='approvalStatus' dataFormat={this.Judgment.bind(this)} >承認済み</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='sentReportStatus' dataFormat={this.Judgment.bind(this)}>送信済み</TableHeaderColumn>
						<TableHeaderColumn width='11%' dataField='employeeNo' editable={false} isKey></TableHeaderColumn>
					</BootstrapTable>
					</Col>
				</div>
				<div>
					<div style={{ "textAlign": "center" }}><Button size="sm" variant="info" onClick={this.employeeSelected}>
						<FontAwesomeIcon icon={faSave} /> {"確定"}</Button></div>
				</div>
			</div>
		);
	}
}
export default sendRepotAppend;