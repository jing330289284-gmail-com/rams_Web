import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faListOl } from '@fortawesome/free-solid-svg-icons';
import store from './redux/store';
axios.defaults.withCredentials = true;
/** 
*報告書送信画面対象社員
 */
class sendRepotAppend extends Component {
	initialState = {
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		positions: store.getState().dropDown[14],//駅
		employeeStatusList: store.getState().dropDown[4],//社員区分
		judgmentlist: [{"code":"0","name":"✕"},{"code":"1","name":"〇"}],//承認済み 送信済み
		currentPage: 1,//　該当page番号
		allSalesPersons: [],
		selectetRowIds: this.props.customer.test !== undefined && this.props.customer.test !== "" && this.props.customer.test !== null ? this.props.customer.test.split(',') : (this.props.customer.mainChargeList!== undefined && this.props.customer.mainChargeList !== "" && this.props.customer.mainChargeList !== null ? this.props.customer.mainChargeList.split(','):[] ),
		//selectetEmployeesNo: this.props.customer.sendRepotAppend !== "" && this.props.customer.sendRepotAppend !== null ? this.props.customer.sendRepotAppend.split(',') : [],
		allSelectedFlag: false,
		allTargetEmployeesNo: [],
		allRowId: [],
		parentSelectedInfo: this.props.customer,
		appendPersonMsg: {
			purchasingManagers2: '',
			positionCode2: '',
			purchasingManagersMail2: '',
		}
	}
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
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
				allSalesPersons: result.data,
				allTargetEmployeesNo: targetEmployeeNoArray,
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
				selectetEmployeesNo: this.state.selectetEmployeesNo.concat([row.responsiblePerson]),
				appendPersonMsg: {
					purchasingManagers2: row.responsiblePerson,
					positionCode2: row.positionCode,
					purchasingManagersMail2: row.customerDepartmentMail,
				}
			})
		} else {
			let index = this.state.selectetRowIds.findIndex(item => item === String(row.rowId));
			this.state.selectetRowIds.splice(index, 1);
			index = this.state.selectetEmployeesNo.findIndex(item => item === row.responsiblePerson);
			this.state.selectetEmployeesNo.splice(index, 1);
			this.setState({
				selectetRowIds: this.state.selectetRowIds,
				selectetEmployeesNo: this.state.selectetEmployeesNo,
			})
		}
		if (this.state.allSelectedFlag) {
			this.refs.salesPersonTable.setState({
				selectedRowKeys: [],
			});
			this.setState({
				allSelectedFlag: !this.state.allSelectedFlag,
				selectetRowIds: [],
				selectetEmployeesNo: [],
			});
		}
	}
	// 全て選択ボタン事件
	selectAllLists = () => {
		this.refs.salesPersonTable.store.selected = [];
		if (!this.state.allSelectedFlag) {
			this.refs.salesPersonTable.setState({
				selectedRowKeys: this.state.allTargetEmployeesNo,
			})
			this.setState({
				allSelectedFlag: !this.state.allSelectedFlag,
				selectetRowIds: this.state.allTargetEmployeesNo,
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
	salesSelected = () => {
		let salesPersons = this.state.selectetEmployeesNo.join(",");
		this.state.parentSelectedInfo.sendRepotAppend = salesPersons;
		let salesRowsId = this.state.selectetRowIds.join(",");
		this.state.parentSelectedInfo.test = salesRowsId;
		this.state.parentSelectedInfo.mainChargeList = salesRowsId;
		let purchasingManagersOthers = this.state.selectetEmployeesNo;
		purchasingManagersOthers.pop();
		this.state.appendPersonMsg.purchasingManagersOthers = salesPersons;
		if(this.props.customer.storageListName != null && this.props.customer.storageListName != ""){
			axios.post(this.state.serverIP + "sendRepot/salesPersonsListsUpdate", 
					{
						storageListName:this.props.customer.storageListName,
						customerNo:this.props.customer.customerNo,
						mainChargeList:salesRowsId,
						departmentCodeList:salesPersons,
					})
			.then(() => {
				})
				.catch(function (err) {
					alert(err)
				})
		}
		this.props.allState.saveSalesPersons(this.state.parentSelectedInfo,this.state.appendPersonMsg);
	}
	positionsFormat = (cell) => {
		let positionStatus = this.state.positions;
		for (var i in positionStatus) {
			if (cell === positionStatus[i].code) {
				return positionStatus[i].name;
			}
		}
	}
	employeeStatusFormat = (cell) => {
		let employeeStatus = this.state.employeeStatusList;
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
								disabled={0 !== this.state.allSalesPersons.length ? false : true}><FontAwesomeIcon icon={faListOl} />すべて選択</Button>
						</Col>
					</Row>
				</Form>
				<div >
					<BootstrapTable
						ref="salesPersonTable"
						data={this.state.allSalesPersons}
						pagination={true}
						options={options}
						selectRow={selectRow}
						trClassName="customClass"
						headerStyle={{ background: '#5599FF' }} striped hover condensed>
						<TableHeaderColumn width='7%' dataField='rowId' dataAlign='center' autoValue dataSort={true} editable={false} isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='11%' dataField='employeeName'>氏名</TableHeaderColumn>
						<TableHeaderColumn width='9%' dataField='employeeStatus' dataFormat={this.employeeStatusFormat} >所属</TableHeaderColumn>
						<TableHeaderColumn width='9%' dataField='stationCode'dataFormat={this.positionsFormat}>現場</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='approvalStatus'dataFormat={this.Judgment.bind(this)} >承認済み</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='sentReportStatus'dataFormat={this.Judgment.bind(this)}>送信済み</TableHeaderColumn>
						<TableHeaderColumn width='11%' dataField='employeeNo' hidden></TableHeaderColumn>
					</BootstrapTable>
				</div>
				<div>
					<div style={{ "textAlign": "center" }}><Button size="sm" variant="info" onClick={this.salesSelected}>
						<FontAwesomeIcon icon={faSave} /> {"確定"}</Button></div>
				</div>
			</div>
		);
	}
}
export default sendRepotAppend;