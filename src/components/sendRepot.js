// 営業送信画面
import React from 'react';
import { Form, Button, Col, Row, InputGroup, Modal,FormControl,ListGroup } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import DatePicker, { } from "react-datepicker";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SalesAppend from './salesAppend';
import { Link } from "react-router-dom";
import store from './redux/store';
import { faPlusCircle, faEnvelope, faMinusCircle, faBroom, faListOl,faEdit,faPencilAlt ,faBookmark} from '@fortawesome/free-solid-svg-icons';
axios.defaults.withCredentials = true;

class sendRepot extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
	}
	//初期化
	initialState = {
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		customers: store.getState().dropDown[15],// 全部お客様　dropDowm用
		positions: store.getState().dropDown[20],//職位
		customerDepartmentNameDrop: store.getState().dropDown[22],//部門の連想数列
		approval: store.getState().dropDown[27],//承認ステータス
		workReportStatus: store.getState().dropDown[60],//作業報告書送信ステータス
		sendDay: '',
		sendTime: '',
		workReportStatusCode: '',
		allCustomer: [],// お客様レコード用
		customerName: '', // おきゃく名前
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
		selectedCusInfos: [],
		listName:1,
		salesLists: [],
		listName1:"",
		listName2:"",
		listName3:"",
		listShowFlag:true,
		oldListName1:"",
		oldListName2:"",
		oldListName3:"",
		selectedCtmNoStrs1:"",
		selectedCtmNoStrs2:"",
		selectedCtmNoStrs3:"",
		selectedlistName:"",
	};

	// 
	componentDidMount() {
		this.getCustomers();
		this.getLists();
	}
	//リスト取得
	getLists = () => {
		axios.post(this.state.serverIP + "sendRepot/getLists")
				.then(result => {
					this.setState({
						salesLists: result.data,
						listName:1+result.data.length,
						listName1:result.data.length>=1?result.data[0].name:'',
						listName2:result.data.length>=2?result.data[1].name:'',
						listName3:result.data.length>=3?result.data[2].name:'',
						oldListName1:result.data.length>=1?result.data[0].name:'',
						oldListName2:result.data.length>=2?result.data[1].name:'',
						oldListName3:result.data.length>=3?result.data[2].name:'',
						selectedCtmNoStrs1:result.data.length>=1?result.data[0].customerNo:'',
						selectedCtmNoStrs2:result.data.length>=2?result.data[1].customerNo:'',
						selectedCtmNoStrs3:result.data.length>=3?result.data[2].customerNo:'',
					});
				})
				.catch(function(err) {
					alert(err)
				})
	}
	//初期化お客様取る
	getCustomers = () => {
		axios.post(this.state.serverIP + "sendRepot/getCustomers")
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

	// 行番号？
	onTagsChange = (event, values, fieldName) => {
		if (values === null) {
			switch (fieldName) {
				case 'workReportStatusCode':
				case 'customerName':
					this.setState({
						workReportStatusCode: '',
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

	//職位
	positionNameFormat = (cell) => {
		let positionsTem = this.state.positions;
		for (var i in positionsTem) {
			if (cell === positionsTem[i].code) {
				return positionsTem[i].name;
			}
		}
	}
	//所属
	customerDepartmentNameFormat = (cell) => {
		let customerDepartmentNameDropTem = this.state.customerDepartmentNameDrop;
		for (var i in customerDepartmentNameDropTem) {
			if (cell === customerDepartmentNameDropTem[i].code) {
				return customerDepartmentNameDropTem[i].name;
			}
		}
	}
	// clearボタン事件 未使用
	clearLists = () => {
		if(this.state.selectedlistName!==''){
			axios.post(this.state.serverIP + "sendRepot/deleteList",{storageListName:this.state.selectedlistName})
		.then(result => {
		this.setState({
			allCustomer: this.state.customerTemp,
			sendLetterBtnFlag: true,
		})	
		this.refs.customersTable.store.selected = [];
		this.refs.customersTable.setState({
			selectedRowKeys: [],
		})
			this.getLists();
			
			})
				
		}else{
		this.setState({
			allCustomer: [],
			sendLetterBtnFlag: true,
		})
		this.refs.customersTable.store.selected = [];
		this.refs.customersTable.setState({
			selectedRowKeys: [],
		})}
	}
	// ？
	createList = () => {
		let {selectetRowIds,customerTemp,listName}=this.state;
		let selectedArray=new Array();
		for(let i in selectetRowIds){
			selectedArray.push(customerTemp.find(v => v.rowId === selectetRowIds[i]));
		}
		let name=`送信対象${listName}`;
		let selectedNoArray=new Array();
		for(let i in selectedArray){
			selectedNoArray.push(selectedArray[i].customerNo);
		}
		let code=selectedNoArray.join(',');
		axios.post(this.state.serverIP + "sendRepot/creatList",{name,code})
		.then(result => {
			this.refs.customersTable.store.selected = [];
			this.refs.customersTable.setState({
			selectedRowKeys: [],
		})
		this.setState({
			selectetRowIds:[],
		});
		this.getLists();
		})
	}
	// deleteボタン事件？
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
			let rowNo = customerRowIdArray[i];
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
	changeName=()=>{
		if(this.state.listShowFlag){
					this.setState({
			listShowFlag:!this.state.listShowFlag})
		}else{
			var sendRepotListNames={storageListName1:this.state.listName1,oldStorageListName1:this.state.oldListName1,
			storageListName2:this.state.listName2,oldStorageListName2:this.state.oldListName2,
			storageListName3:this.state.listName3,oldStorageListName3:this.state.oldListName3};
			if((this.state.listName1===''&&this.state.oldListName1!=="")||
			(this.state.listName2===''&&this.state.oldListName2!=="")||
			(this.state.listName3===''&&this.state.oldListName3!=="")){
				alert("対象名を入力してください")
				return;
			}
			axios.post(this.state.serverIP + "sendRepot/listNameUpdate",sendRepotListNames)
			.then(result => {
				this.getLists();
				this.setState({
					listShowFlag:true,
				})
				
			})
			.catch(function(err) {
				alert(err)
			})
		}

	}
	openFolder = () => {
				axios.post(this.state.serverIP + "sendRepot/openFolder")
	}
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	workReportStatusChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
		if (event.target.value == 1) {
			this.setState({
				sendTime: "",
				sendDay: "",
			})
        }
	}
	inactiveSendTime = (date) => {
		this.setState(
			{
				sendTime: date,
			}
		);
	};
	showSelectedCtms=(selectedNos,flag)=>{
		
		this.refs.customersTable.store.selected = [];
		this.setState({
			selectetRowIds: [],
		});
		this.refs.customersTable.setState({
			selectedRowKeys: [],
		})
		if(flag==='1'){
			this.setState({
					selectedlistName:this.state.listName1,
			})
		
		}else if(flag==='2'){
			this.setState({
					selectedlistName:this.state.listName2,
			})
		
		}else if(flag==='3'){
			this.setState({
					selectedlistName:this.state.listName3,
			})
		
		}
			axios.post(this.state.serverIP + "sendRepot/getCustomersByNos",{ctmNos:selectedNos.split(',')})
			.then(result => {
				this.setState({
					allCustomer:result.data,
				});
			})
			.catch(function(err) {
				alert(err)
			})
	}
	
	changeListName=(event)=>{
		this.setState({
			[event.target.name]:event.target.value})
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
						<h2>報告書送信</h2>
					</Col>
				</Row>
				<br/>
				<Form onSubmit={this.savealesSituation}>
					<Form.Group>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">送信区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"
										size="sm"
										name="workReportStatusCode"
										autoComplete="off"
										value={this.state.workReportStatusCode}
										onChange={this.workReportStatusChange}>
										{this.state.workReportStatus.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">送信日付設定</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Prepend>
										<Form.Control id="sendDay" as="select" size="sm" onChange={this.valueChange} name="sendDay" value={this.state.sendDay} disabled={this.state.workReportStatusCode == 1 ? true : false} autoComplete="off" >
											<option value=""></option>
											<option value="0">今月最終日</option>
											<option value="1">来月初日</option>
										</Form.Control>
									</InputGroup.Prepend>
									<InputGroup.Prepend>
										<DatePicker
											disabled={this.state.workReportStatusCode==1 ? true : false}
											selected={this.state.sendTime}
											value={this.state.sendTime}
											onChange={this.inactiveSendTime}
											autoComplete="off"
											locale="ja"
											dateFormat="HH:mm"
											showTimeSelect
											showTimeSelectOnly
											id="datePicker"
											className="form-control form-control-sm"
										/>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										options={this.state.customers}
										getOptionLabel={(option) => option.name ? option.name : ""}
										value={this.state.customers.find(v => v.code === this.state.customerCode) || ""}
										onChange={(event, values) => this.onTagsChange(event, values, 'customerName')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps}
													id="customerCode" className="auto form-control Autocompletestyle-salesSend"
												/>
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
										options={this.state.customerDepartmentNameDrop}
										getOptionLabel={(option) => option.name ? option.name : ""}
										value={this.state.customerDepartmentNameDrop.find(v => v.code === this.state.customerDepartmentCode) || ""}
										onChange={(event, values) => this.onTagsChange(event, values, 'customerDepartmentCode')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps}
													id="customerDepartmentName" className="auto form-control Autocompletestyle-salesSend"
													/>
											</div>
										)}
									/>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">担当者</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="text" value={this.state.purchasingManagers} name="purchasingManagers" autoComplete="off" size="sm" onChange={this.valueChange} placeholder="担当者" />
								</InputGroup>
							</Col>
							<Col sm={1}>
								<Button size="sm" variant="info" onClick={this.plusClick} disabled={this.state.allCustomer.length === this.state.customerTemp.length ? true : false}>
									<FontAwesomeIcon icon={faPlusCircle} />追加</Button>
							</Col>
							<Col sm={5} style={{ "display": this.state.salesLists.length>=1 ? "block" : "none" }}>
								<InputGroup size="sm" className="mb-3" style={{position: 'relative'}}>
									<div style={{  "display": this.state.listShowFlag ? "contents" : "none" }}>
									格納リスト：
									<Button size="sm" variant="info" onClick={this.showSelectedCtms.bind(this,this.state.selectedCtmNoStrs1,'1')} style={{"display": this.state.salesLists.length>=1? "block" : "none" }}>
									<FontAwesomeIcon icon={faBookmark} />{this.state.salesLists.length>=1?' '+this.state.listName1:''}</Button>{'　'}
									<Button size="sm" variant="info" onClick={this.showSelectedCtms.bind(this,this.state.selectedCtmNoStrs2,'2')} style={{"display": this.state.salesLists.length>=2? "block" : "none" }}>
									<FontAwesomeIcon icon={faBookmark} />{this.state.salesLists.length>=2?' '+this.state.listName2:''}</Button>{'　'}
									<Button size="sm" variant="info" onClick={this.showSelectedCtms.bind(this,this.state.selectedCtmNoStrs3,'3')} style={{"display": this.state.salesLists.length>=3? "block" : "none" }}>
									<FontAwesomeIcon icon={faBookmark} />{this.state.salesLists.length>=3?' '+this.state.listName3:''}</Button>
									</div>
										<span style={{ "display": !this.state.listShowFlag ? "contents" : "none" }}>格納リスト： <FormControl   autoComplete="off" value={this.state.listName1}
										disabled={this.state.salesLists.length>=1?false:true}
										size="sm" name="listName1" style={{width:"85px"}} onChange={this.changeListName}/>
										<FormControl   autoComplete="off" value={this.state.listName2}
										size="sm" name="listName2" style={{width:"85px","display": this.state.salesLists.length>=2? "block" : "none" }} onChange={this.changeListName}/>
										<FormControl   autoComplete="off" value={this.state.listName3}
										size="sm" name="listName3" style={{width:"85px","display": this.state.salesLists.length>=3? "block" : "none"}} onChange={this.changeListName}/>{'　　　'}</span>
									<Button style={{position:'absolute',right:'0px'}} size="sm" variant="info"  onClick={this.changeName}><FontAwesomeIcon icon={faPencilAlt} />{this.state.listShowFlag?'対象名修正':'対象名更新'}</Button>
									</InputGroup>

							</Col>
							
						</Row>
					</Form.Group>
					<Row>
						<Col sm={2}>
							<Button size="sm" variant="info" name="clickButton" onClick={this.selectAllLists}
								disabled={0 !== this.state.allCustomer.length ? false : true}
							><FontAwesomeIcon icon={faListOl} />すべて選択</Button>
						</Col>
						<Col sm={4}></Col>
						<Col sm={6}>
							<div style={{ "float": "right" }}>
								<Button size="sm" variant="info" name="clickButton" onClick={this.deleteLists} disabled={this.state.selectetRowIds.length === this.state.customerTemp.length || this.state.selectetRowIds.length === 0 ? true : false}><FontAwesomeIcon icon={faMinusCircle} />削除
								</Button>{' '}
								<Button size="sm" variant="info" name="clickButton" onClick={this.openFolder}><FontAwesomeIcon icon={faBroom} />作業報告書
								</Button>{' '}
								<Button size="sm" variant="info" name="clickButton" onClick={this.createList} disabled={this.state.selectetRowIds.length === this.state.customerTemp.length || this.state.selectetRowIds.length === 0 || this.state.salesLists.length === 3 ? true : false}><FontAwesomeIcon icon={faEdit} />リスト保存
								</Button>{' '}
								<Link to={{ pathname: '/subMenuManager/sendLettersConfirm', state: { salesPersons: this.state.selectedEmpNos, targetCusInfos: this.state.selectedCusInfos }}}>
								<Button size="sm" variant="info" name="clickButton" disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true}><FontAwesomeIcon icon={faEnvelope} />送信</Button></Link>
							</div>
						</Col>
					</Row>
				</Form>
				<Row>
					<Col sm={12}>
						<BootstrapTable
							ref="customersTable"
							data={this.state.allCustomer}
							pagination={true}
							options={options}
							selectRow={selectRow}
							trClassName="customClass"
							headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='8%' dataField='rowId' isKey>番号</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='customerNo' >お客様番号</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='customerName' dataFormat={this.customerNameFormat}>お客様名</TableHeaderColumn>
							<TableHeaderColumn width='7%' dataField='purchasingManagers'>担当者</TableHeaderColumn>
							<TableHeaderColumn width='7%' dataField='customerDepartmentCode' dataFormat={this.customerDepartmentNameFormat}>所属</TableHeaderColumn>
							<TableHeaderColumn width='7%' dataField='positionCode' dataFormat={this.positionNameFormat}>職位</TableHeaderColumn>
							<TableHeaderColumn width='15%' dataField='customerDepartmentMail' >メール(To)</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='a' >対象社員</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='b' >承認済み</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='c'>送信済み</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</Row>
			</div>
		);
	}
}
export default sendRepot;
