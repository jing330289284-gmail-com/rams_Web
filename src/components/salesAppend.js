import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faListOl } from '@fortawesome/free-solid-svg-icons';
import store from './redux/store';
axios.defaults.withCredentials = true;
/** 
*営業送信画面お客営業追加
 */
class salesAppend extends Component {

	initialState = {
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		currentPage: 1,//　該当page番号
		allSalesPersons: [],
		selectetRowIds: this.props.customer.test !== undefined && this.props.customer.test !== "" && this.props.customer.test !== null ? this.props.customer.test.split(',') : (this.props.customer.mainChargeList!== undefined && this.props.customer.mainChargeList !== "" && this.props.customer.mainChargeList !== null ? this.props.customer.mainChargeList.split(','):[] ),
		selectetPersonsName: this.props.customer.salesPersonsAppend !== "" && this.props.customer.salesPersonsAppend !== null ? this.props.customer.salesPersonsAppend.split(',') : [],
		allSelectedFlag: false,
		allSalesPersonsName: [],
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
		//this.props.customer.salesPersonsAppend!=="" && this.props.customer.salesPersonsAppend!==null?this.props.customer.salesPersonsAppend.split(','):[],
	}

	componentDidMount() {
		this.getSalesPersons(this.props.customer.customerNo);
		this.props.customer.test = this.props.customer.test !== undefined && this.props.customer.test !== "" && this.props.customer.test !== null ? this.props.customer.test:this.props.customer.mainChargeList;
		let str = this.props.customer.test !== undefined && this.props.customer.test !== "" && this.props.customer.test !== null ? this.props.customer.test.split(',') : [];
		for(let i in str){
			str[i] = Number(str[i]);
		}
		this.refs.salesPersonTable.setState({
			selectedRowKeys: str,
		});
		this.refs.salesPersonTable.store.selected = str;
		//this.props.customer.test !== undefined ? alert(this.props.customer.test.split(',')) : alert(this.props.customer.test)
	}

	getSalesPersons = (customerNo) => {
		axios.post(this.state.serverIP + "salesSendLetters/getSalesPersons", { customerNo: customerNo })
			.then(result => {
				let salesPersonsNameArray = new Array();
				let salesRowIdArray = new Array();
				for (let i in result.data) {
					salesPersonsNameArray.push(result.data[i].responsiblePerson);
					salesRowIdArray.push(result.data[i].rowId);
				}
				this.setState({
					allSalesPersons: result.data,
					allSalesPersonsName: salesPersonsNameArray,
					allRowId: salesRowIdArray
				});
			})
			.catch(function(err) {
				alert(err)
			})
	}

	// customerDepartmentNameFormat
	customerDepartmentNameFormat = (cell) => {
		let customerDepartmentNameDropTem = this.props.depart;
		for (var i in customerDepartmentNameDropTem) {
			if (cell === customerDepartmentNameDropTem[i].code) {
				return customerDepartmentNameDropTem[i].name;
			}
		}
	}

	// customerDepartmentNameFormat
	positionNameFormat = (cell) => {
		let positionsTem = this.props.positions;
		for (var i in positionsTem) {
			if (cell === positionsTem[i].code) {
				return positionsTem[i].name;
			}
		}
	}

	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState({
				selectetRowIds: this.state.selectetRowIds.concat([row.rowId]),
				selectetPersonsName: this.state.selectetPersonsName.concat([row.responsiblePerson]),
				appendPersonMsg: {
			purchasingManagers2: row.responsiblePerson,
			positionCode2: row.positionCode,
			purchasingManagersMail2: row.customerDepartmentMail,
		}
			})
		} else {
			let index = this.state.selectetRowIds.findIndex(item => item === String(row.rowId));
			this.state.selectetRowIds.splice(index, 1);
			index = this.state.selectetPersonsName.findIndex(item => item === row.responsiblePerson);
			this.state.selectetPersonsName.splice(index, 1);
			this.setState({
				selectetRowIds: this.state.selectetRowIds,
				selectetPersonsName: this.state.selectetPersonsName,
			})
		}
		if (this.state.allSelectedFlag) {
			this.refs.salesPersonTable.setState({
				selectedRowKeys: [],
			});
			this.setState({
				allSelectedFlag: !this.state.allSelectedFlag,
				selectetRowIds: [],
				selectetPersonsName: [],
			});
		}
	}

	// 全て選択ボタン事件
	selectAllLists = () => {
		this.refs.salesPersonTable.store.selected = [];
		if (!this.state.allSelectedFlag) {
			this.refs.salesPersonTable.setState({
				selectedRowKeys: this.state.allRowId,
			})
			this.setState({
				allSelectedFlag: !this.state.allSelectedFlag,
				selectetPersonsName: this.state.allSalesPersonsName,
				selectetRowIds: this.state.allRowId,
			})
		} else {
			this.refs.salesPersonTable.setState({
				selectedRowKeys: [],
			})
			this.setState({
				allSelectedFlag: !this.state.allSelectedFlag,
				selectetPersonsName: [],
				selectetRowIds: [],
			})
		}
	}

	salesSelected = () => {
		let salesPersons = this.state.selectetPersonsName.join(",");
		this.state.parentSelectedInfo.salesPersonsAppend = salesPersons;
		let salesRowsId = this.state.selectetRowIds.join(",");
		this.state.parentSelectedInfo.test = salesRowsId;
		this.state.parentSelectedInfo.mainChargeList = salesRowsId;
		let purchasingManagersOthers = this.state.selectetPersonsName;
		purchasingManagersOthers.pop();
		//this.state.appendPersonMsg.purchasingManagersOthers = purchasingManagersOthers;
		this.state.appendPersonMsg.purchasingManagersOthers = salesPersons;
		if(this.props.customer.storageListName != null && this.props.customer.storageListName != ""){
			axios.post(this.state.serverIP + "salesSendLetters/customerSendMailStorageListUpdate", 
					{
						storageListName:this.props.customer.storageListName,
						customerNo:this.props.customer.customerNo,
						mainChargeList:salesRowsId,
						departmentCodeList:salesPersons,
					})
			.then(result => {
					
				})
				.catch(function (err) {
					alert(err)
				})
		}
		this.props.allState.saveSalesPersons(this.state.parentSelectedInfo,this.state.appendPersonMsg);
	}
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
						<h2>部門担当者選択(要員送信)</h2>
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
				<div style={{ marginLeft: "15px", marginRight: "15px" }}>
					<BootstrapTable
						ref="salesPersonTable"
						
						data={this.state.allSalesPersons}
						pagination={true}
						options={options}
						selectRow={selectRow}
						trClassName="customClass"
						headerStyle={{ background: '#5599FF' }} striped hover condensed>
						<TableHeaderColumn width='7%' dataField='rowId' dataAlign='center' autoValue dataSort={true} editable={false} isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='11%' dataField='customerDepartmentCode' dataFormat={this.customerDepartmentNameFormat}>部門</TableHeaderColumn>
						<TableHeaderColumn width='9%' dataField='positionCode' dataFormat={this.positionNameFormat}>職位</TableHeaderColumn>
						<TableHeaderColumn width='9%' dataField='responsiblePerson' >名前</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='customerDepartmentMail' >メール</TableHeaderColumn>
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
export default salesAppend;