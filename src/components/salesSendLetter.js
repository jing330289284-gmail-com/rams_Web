// 営業送信画面
import React from 'react';
import { Form, Button, Col, Row, InputGroup, Modal } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import * as publicUtils from './utils/publicUtils.js';
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SalesAppend from './salesAppend';
import { Link } from "react-router-dom";
import { faPlusCircle, faEnvelope, faMinusCircle, faBroom, faListOl } from '@fortawesome/free-solid-svg-icons';
axios.defaults.withCredentials = true;

class salesSendLetter extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
	}
	//初期化
	initialState = {
		allCustomer: [],// お客様レコード用
		customerName: '', // おきゃく名前
		customers: [],// 全部お客様　dropDowm用
		customerDepartmentNameDrop: [],//部門の連想数列
		customerCode: '',
		customerDepartmentName: '',
		allCustomerNo: [],
		currentPage: 1,//　該当page番号
		selectetRowIds: [],
		customerTemp: [],
		sendLetterBtnFlag: true,
		tableClickColumn: '0',
		linkDetail: '担当追加',
		selectedCustomer: {},
		daiologShowFlag: false,
		positions: [],
		selectedEmpNos:this.props.location.state.selectetRowIds,
		selectedCusInfos: [],
	};

	// 
	componentDidMount() {
		this.getCustomers();
		this.getDropDowns();
	}

	//初期化お客様取る
	getCustomers = () => {
		axios.post("http://127.0.0.1:8080/salesSendLetters/getCustomers")
			.then(result => {
				let customerNoArray = new Array();
				for (let i in result.data) {
					customerNoArray.push(result.data[i].customerNo);
				}
				this.setState({
					allCustomer: result.data,
					customerTemp: [...result.data],
					allCustomerNo: customerNoArray,
				});
			})
			.catch(function(err) {
				alert(err)
			})
	}

	//dropdown
	getDropDowns = () => {
		var methodArray = ["getCustomer", "getDepartmentMasterDrop", "getPosition"]
		var data = publicUtils.getPublicDropDown(methodArray);
		data[0].shift();
		data[1].shift();
		data[2].shift();
		this.setState(
			{
				customers: data[0],// 全部お客様　dropDowm用
				customerDepartmentNameDrop: data[1],//部門の連想数列
				positions: data[2],
			}
		);
	}

	// 行番号
	indexN = (cell, row, enumObject, index) => {
		let rowNumber = (this.state.currentPage - 1) * 10 + (index + 1);
		return (<div>{rowNumber}</div>);
	}

	onTagsChange = (event, values, fieldName) => {
		if (values === null) {
			switch (fieldName) {
				case 'customerCode':
				case 'customerName':
					this.setState({
						customerCode: '',
					})
					break;
				case 'customerDepartmentCode':
					this.setState({
						customerDepartmentCode: '',
					})
					break;
				default:
			}
		} else {
			switch (fieldName) {
				case 'customerCode':
				case 'customerName':
					this.setState({
						customerCode: values.code,
					})
					break;
				case 'customerDepartmentCode':
					this.setState({
						customerDepartmentCode: values.code,
					})
					break;
				default:
			}
		}
	}

	// customerDepartmentNameFormat
	positionNameFormat = (cell) => {
		let positionsTem = this.state.positions;
		for (var i in positionsTem) {
			if (cell === positionsTem[i].code) {
				return positionsTem[i].name;
			}
		}
	}

	customerDepartmentNameFormat = (cell) => {
		let customerDepartmentNameDropTem = this.state.customerDepartmentNameDrop;
		for (var i in customerDepartmentNameDropTem) {
			if (cell === customerDepartmentNameDropTem[i].code) {
				return customerDepartmentNameDropTem[i].name;
			}
		}
	}

	// clearボタン事件 
	clearLists = () => {
		this.setState({
			allCustomer: [],
			sendLetterBtnFlag: true,
		})
		this.refs.customersTable.store.selected = [];
		this.refs.customersTable.setState({
			selectedRowKeys: [],
		})
	}

	// deleteボタン事件
	deleteLists = () => {
		let selectedIndex = this.state.selectetRowIds;
		let newCustomer = this.state.allCustomer;
		for (let i in selectedIndex) {
			for (let k in newCustomer) {
				if (selectedIndex[i] === newCustomer[k].rowId) {
					newCustomer.splice(k, 1);
					break;
				}
			}
		}
		this.refs.customersTable.store.selected = [];
		this.setState({
			selectedCusInfos: [],
			allCustomer: newCustomer,
			selectetRowIds: [],
		});
		this.refs.customersTable.setState({
			selectedRowKeys: [],
		})
	}

	// 全て選択ボタン事件
	selectAllLists = () => {
		this.refs.customersTable.store.selected = [];
		this.refs.customersTable.setState({
			selectedRowKeys: this.refs.customersTable.state.selectedRowKeys.length !== this.state.allCustomerNo.length ? this.state.allCustomerNo : [],
		})
		let customerRowIdArray = new Array();
				for (let i in this.state.allCustomer) {
					customerRowIdArray.push(this.state.allCustomer[i].rowId);
				};
				let targetCustomer = new Array();
				for (let i in customerRowIdArray) {
					let rowNo=customerRowIdArray[i];
					targetCustomer.push(this.state.customerTemp[rowNo]);
				};
		this.setState({
			selectedCusInfos: targetCustomer,
			sendLetterBtnFlag: !this.state.sendLetterBtnFlag,
			selectetRowIds: [],
			currentPage: 1,//　該当page番号
		})
	}

	// plusClick
	plusClick = () => {
		let customerNo = this.state.customerCode;
		let customerDepartmentCode = this.state.customerDepartmentCode;
		let customers = this.state.allCustomer;
		let customerInfo = this.state.customerTemp;
		var sameFlag = false;
		if (customers.length !== 0) {
			for (let k in customers) {
				if (customerNo === customers[k].customerNo &&
					customerDepartmentCode === customers[k].customerDepartmentCode) {
					alert("err---the same record");
					sameFlag = true;
				}
			}
			if (!sameFlag) {
				for (let k in customerInfo) {
					if (customerNo === customerInfo[k].customerNo &&
						customerDepartmentCode === customerInfo[k].customerDepartmentCode) {
						this.setState({
							allCustomer: this.state.allCustomer.concat(customerInfo[k]).sort(function(a, b) {
								return a.rowId - b.rowId
							}),
						})
					}
				}
			}
		} else {
			for (let k in customerInfo) {
				if (customerNo === customerInfo[k].customerNo &&
					customerDepartmentCode === customerInfo[k].customerDepartmentCode) {
					this.setState({
						allCustomer: this.state.allCustomer.concat(customerInfo[k]),
					})
				}
			}
		}
	}

	renderShowsTotal = (start, to, total) => {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

	handleRowSelect = (row, isSelected, e) => {
		if (this.refs.customersTable.state.selectedRowKeys.length === this.state.allCustomer.length) {
			this.refs.customersTable.setState({
				selectedRowKeys: [],
			})
		}
		let rowNo=row.rowId;
		if (isSelected) {
			//alert(this.refs.customersTable.state.selectedRowKeys); selectedCusInfos
			this.setState({
				sendLetterBtnFlag: true,
				selectetRowIds: this.state.selectetRowIds.concat([rowNo]),
				selectedCusInfos: this.state.selectedCusInfos.concat(this.state.customerTemp[rowNo]),
			})
		} else {
			let index = this.state.selectetRowIds.findIndex(item => item === rowNo);
			this.state.selectetRowIds.splice(index, 1);
			let index2 = this.state.selectedCusInfos.findIndex(item => item.rowId === rowNo);
			this.state.selectedCusInfos.splice(index2, 1);
			this.setState({
				selectedCusInfos: this.state.selectedCusInfos,
				sendLetterBtnFlag: true,
				selectetRowIds: this.state.selectetRowIds,
			})
		}
	}

	CellFormatter(cell, row) {
		if (cell !== "" && cell !== null) {
			return (<a href="javascript:void(0);" onClick={this.getSalesPersons.bind(this, row)}>{cell}</a>);
		} else {
			return (<a href="javascript:void(0);" onClick={this.getSalesPersons.bind(this, row)}>{this.state.linkDetail}</a>);
		}
	}

	getSalesPersons = (selectedCustomer) => {
		console.log(selectedCustomer.salesPersonsAppend !== null);
		this.setState({
			selectedCustomer: selectedCustomer,
			daiologShowFlag: true,
		})
	}

	closeDaiolog = () => {
		this.setState({
			daiologShowFlag: false,
		})
	}

	saveSalesPersons = (row,appendPersonMsg) => {
		this.state.customerTemp[row.rowId].purchasingManagers2=appendPersonMsg.purchasingManagers2;
		this.state.customerTemp[row.rowId].positionCode2=appendPersonMsg.positionCode2;
		this.state.customerTemp[row.rowId].purchasingManagersMail2=appendPersonMsg.purchasingManagersMail2;
		this.setState({
			daiologShowFlag: false,
		});
		this.CellFormatter(row.salesPersonsAppend, row);
	}

	render() {
		const selectRow = {
			mode: 'checkbox',
			bgColor: 'pink',
			/*bgColor: (row, isSelect) => {
				if(isSelect){
					if (this.state.tableClickColumn === 9 || this.state.tableClickColumn === undefined){
						this.refs.customersTable.store.selected.pop();
					this.refs.customersTable.state.selectedRowKeys.pop();
					return 'pink';
					}
					
				}
				if (this.state.tableClickColumn === 9 || this.state.tableClickColumn === undefined) return '';
				else return 'pink';
			},*/
			hideSelectColumn: true,
			clickToSelect: true,
			clickToExpand: true,
			onSelect: this.handleRowSelect,
			/*(row, isSelected, e) => {
				let getCurrentCellIndex = e.target.cellIndex;
				this.setState({
					tableClickColumn: getCurrentCellIndex,
				});
				if (getCurrentCellIndex === 9 || getCurrentCellIndex === undefined) {
					console.log(`----> ${JSON.stringify(row)}`);
					e.preventDefault();
					e.stopPropagation();
				} else {
					this.handleRowSelect(row, isSelected, e);
				}
			},*/
		};

		const options = {
			onPageChange: page => {
				this.setState({ currentPage: page });
			},
			page: this.state.currentPage,
			defaultSortOrder: 'dsc',
			sizePerPage: 10,
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
			<div>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeDaiolog} show={this.state.daiologShowFlag} dialogClassName="modal-pbinfoSet">
					<Modal.Header closeButton></Modal.Header>
					<Modal.Body >
						<SalesAppend customer={this.state.selectedCustomer} depart={this.state.customerDepartmentNameDrop}
							allState={this} positions={this.state.positions} />
					</Modal.Body>
				</Modal>
				<Row inline="true">
					<Col className="text-center">
						<h2>お客様選択（要員送信）</h2>
					</Col>
				</Row>
				<Form onSubmit={this.savealesSituation}>
					<Form.Group>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様番号</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										disabled={this.state.allCustomer.length === this.state.customerTemp.length ? true : false}
										options={this.state.customers}
										getOptionLabel={(option) => option.code ? option.code : ""}
										value={this.state.customers.find(v => v.code === this.state.customerCode) || ""}
										onChange={(event, values) => this.onTagsChange(event, values, 'customerCode')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps}
													id="customerCode" className="auto"
													style={{ width: 110, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", backgroundColor: this.state.allCustomer.length === this.state.customerTemp.length ? "#e9ecef" : "white" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										disabled={this.state.allCustomer.length === this.state.customerTemp.length ? true : false}
										options={this.state.customers}
										getOptionLabel={(option) => option.name ? option.name : ""}
										value={this.state.customers.find(v => v.code === this.state.customerCode) || ""}
										onChange={(event, values) => this.onTagsChange(event, values, 'customerName')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps}
													id="customerCode" className="auto"
													style={{ width: 120, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", backgroundColor: this.state.allCustomer.length === this.state.customerTemp.length ? "#e9ecef" : "white" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">部門</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										disabled={this.state.allCustomer.length === this.state.customerTemp.length ? true : false}
										options={this.state.customerDepartmentNameDrop}
										getOptionLabel={(option) => option.name ? option.name : ""}
										value={this.state.customerDepartmentNameDrop.find(v => v.code === this.state.customerDepartmentCode) || ""}
										onChange={(event, values) => this.onTagsChange(event, values, 'customerDepartmentCode')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps}
													id="customerDepartmentName" className="auto"
													style={{ width: 120, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", backgroundColor: this.state.allCustomer.length === this.state.customerTemp.length ? "#e9ecef" : "white" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<Button size="sm" variant="info" onClick={this.plusClick} disabled={this.state.allCustomer.length === this.state.customerTemp.length ? true : false}>
									<FontAwesomeIcon icon={faPlusCircle} />追加</Button>
							</Col>
						</Row>
					</Form.Group>
					<Row>
						<Col sm={2}>
							<Button size="sm" variant="info" name="clickButton" onClick={this.selectAllLists}
								disabled={0 !== this.state.allCustomer.length ? false : true}
							><FontAwesomeIcon icon={faListOl} />すべて選択</Button>
						</Col>
						<Col sm={5}></Col>
						<Col sm={5}>
							<div style={{ "float": "right" }}>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" onClick={this.clearLists}
									disabled={!this.state.sendLetterBtnFlag ? false : true}><FontAwesomeIcon icon={faBroom} />クリア</Button>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton"
									onClick={this.deleteLists} disabled={this.state.selectetRowIds.length === this.state.customerTemp.length || this.state.selectetRowIds.length === 0 ? true : false}><FontAwesomeIcon icon={faMinusCircle} />削除</Button>
								<Link to={{ pathname: '/subMenuManager/sendLettersConfirm', state: { salesPersons: this.state.selectedEmpNos, targetCusInfos: this.state.selectedCusInfos } }}>
								<Button size="sm" variant="info" name="clickButton" disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true}
								><FontAwesomeIcon icon={faEnvelope} />送信</Button></Link>
							</div>
						</Col>
					</Row>
				</Form>
				<div >
					<BootstrapTable
						ref="customersTable"
						
						data={this.state.allCustomer}
						pagination={true}
						options={options}
						selectRow={selectRow}
						trClassName="customClass"
						headerStyle={{ background: '#5599FF' }} striped hover condensed>
						<TableHeaderColumn width='8%' dataField='any' dataFormat={this.indexN} dataAlign='center' autoValue dataSort={true} caretRender={publicUtils.getCaret} editable={false}>番号</TableHeaderColumn>
						<TableHeaderColumn width='10%' dataField='customerNo' isKey>お客様番号</TableHeaderColumn>
						<TableHeaderColumn width='10%' dataField='customerName' dataFormat={this.customerNameFormat}>お客様名</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='purchasingManagers'>担当者</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='customerDepartmentCode' dataFormat={this.customerDepartmentNameFormat}>所属</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='positionCode' dataFormat={this.positionNameFormat}>職位</TableHeaderColumn>
						<TableHeaderColumn width='15%' dataField='purchasingManagersMail' >メール</TableHeaderColumn>
						<TableHeaderColumn width='12%' dataField='levelCode' >ランキング</TableHeaderColumn>
						<TableHeaderColumn width='12%' dataField='monthCount' >取引数(今月)</TableHeaderColumn>
						<TableHeaderColumn width='12%' dataField='salesPersonsAppend' dataFormat={this.CellFormatter.bind(this)}>担当追加</TableHeaderColumn>
						<TableHeaderColumn dataField='rowId' hidden={true} >ID</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		);
	}
}
export default salesSendLetter;
