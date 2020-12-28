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
import SendRepotAppend from './sendRepotAppend';
import SendRepotAppend2 from './sendRepotAppend2';
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
		customerDepartments: [],
		purchasingManagers: [],
		approval: store.getState().dropDown[27],//承認ステータス
		workReportStatus: store.getState().dropDown[60],//作業報告書送信ステータス
		sendReportOfDateSeting: store.getState().dropDown[61],//送信日付設定ステータス
		linkDetail: '担当追加',
		linkDetail2: '対象社員',
		customerCode: '',//お客様コード
		customerDepartmentCode: '',//部門コード
		selectedCustomer: {},//担当追加リスト
		sendDay: '',
		sendTime: '',
		workReportStatusCode: '',
		allCustomer: [],// お客様レコード用
		customerName: '', // おきゃく名前
		customerDepartmentName: '',
		allCustomerNo: [],
		currentPage: 1,//　該当page番号
		selectetRowKeys: [],
		customerTemp: [],
		sendLetterBtnFlag: false,
		tableClickColumn: '0',
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
		this.getSalesPersonsLists();
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
	//担当メールをキーにした担当リスト
	getSalesPersonsLists = () => {
		axios.post(this.state.serverIP + "sendRepot/getSalesPersonsLists")
			.then(result => {
		this.setState({
			salesPersonsLists: result.data,
		});
	})
	.catch(function (err) {
		alert(err)
	})
	}
	//初期化お客様取る
	getCustomers = () => {
		axios.post(this.state.serverIP + "sendRepot/getCustomers")
			.then(result => {
				let customerNoArray = new Array();
				//theKey設定
				if (result.data.length > 0) {
					for (var i = 0; i < result.data.length; i++) {
						result.data[i].rowId = i + 1;
						result.data[i].theKey = result.data[i].customerNo + result.data[i].customerDepartmentCode + result.data[i].responsiblePerson;
						customerNoArray.push(result.data[i].theKey);
					}
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

	// セレクトボックス変更
	onTagsChange = (event, values, fieldName) => {
		if (values === null) {
			switch (fieldName) {
				case 'customerCode':
					this.setState({
						workReportStatusCode: '',
						customerDepartmentCode: '',
						purchasingManagersCode: '',
					})
					break;
				case 'customerDepartmentCode':
					this.setState({
						customerDepartmentCode: '',
						purchasingManagersCode: '',
					})
					break;
				case 'purchasingManagersCode':
					this.setState({
						purchasingManagersCode: '',
					})
					break;
				default:
			}
		} else {
			switch (fieldName) {
				case 'customerCode':
					this.setState({
						customerCode: values.code,
						customerDepartmentCode: '',
						purchasingManagersCode: '',
					})
					const model = {
						customerNo: values.code,
					};
					axios.post(this.state.serverIP + "sendRepot/getCustomerDepartmentCode", model)
						.then(result => {
							this.setState({
								customerDepartments: result.data,
							});
						})
						.catch(function (err) {
							alert(err)
						})
					break;
				case 'customerDepartmentCode':
					this.setState({
						customerDepartmentCode:values.code,
						purchasingManagersCode: '',
					})
					const model2 = {
						customerNo: this.state.customerCode,
						customerDepartmentCode: values.code,
					};
					axios.post(this.state.serverIP + "sendRepot/getPurchasingManagersCode", model2)
						.then(result => {
							this.setState({
								purchasingManagers: result.data,
							});
						})
						.catch(function (err) {
							alert(err)
						})
					break;
				case 'purchasingManagersCode':
					this.setState({
						purchasingManagersCode: values.code,
					})
					break;
				default:
			}
		}
	}
	//お客様
	customerNameFormat = (cell) => {
		let customers = this.state.customers;
		for (var i in customers) {
			if (cell === customers[i].code) {
				return customers[i].name;
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
	//担当追加
	CellFormatter(cell, row) {
		if (cell !== "" && cell !== null) {
			return (<a href="javascript:void(0);" onClick={this.getSalesPersons.bind(this, row)}>{cell}</a>);
		} else {
			return (<a href="javascript:void(0);" onClick={this.getSalesPersons.bind(this, row)}>{this.state.linkDetail}</a>);
		}
	}
	//担当追加名前取得
	getSalesPersons = (selectedCustomer) => {
		this.setState({
			selectedCustomer: selectedCustomer,
			daiologShowFlag: true,
		})
	}
	//担当追加保存
	saveSalesPersons = (row, appendPersonMsg) => {
		this.state.customerTemp[row.rowId].purchasingManagers2 = appendPersonMsg.purchasingManagers2;
		this.state.customerTemp[row.rowId].positionCode2 = appendPersonMsg.positionCode2;
		this.state.customerTemp[row.rowId].purchasingManagersMail2 = appendPersonMsg.purchasingManagersMail2;
		this.setState({
			daiologShowFlag: false,
		});
		this.CellFormatter(row.salesPersonsAppend, row);
	}
	//対象社員
	CellFormatter2(cell, row) {
		if (cell !== "" && cell !== null) {
			return (<a href="javascript:void(0);" onClick={this.getTargetEmployees.bind(this, row)}>{cell}</a>);
		} else {
			return (<a href="javascript:void(0);" onClick={this.getTargetEmployees.bind(this, row)}>{this.state.linkDetail2}</a>);
		}
	}
	//対象社員名前取得
	getTargetEmployees = (selectedTargetEmployees) => {
		this.setState({
			selectedTargetEmployees: selectedTargetEmployees,
			daiologShowFlag: true,
		})
	}
	//対象社員追加保存
	saveTargetEmployees = (row, targetEmployeesMsg) => {
		this.state.targetEmployeesTemp[row.rowId].purchasingManagers2 = targetEmployeesMsg.purchasingManagers2;
		this.state.targetEmployeesTemp[row.rowId].positionCode2 = targetEmployeesMsg.positionCode2;
		this.state.targetEmployeesTemp[row.rowId].purchasingManagersMail2 = targetEmployeesMsg.purchasingManagersMail2;
		this.setState({
			daiologShowFlag: false,
		});
		this.CellFormatter(row.salesPersonsAppend, row);
	}

	// clearボタン事件
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
				this.getCustomers();
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
	//リスト保存ボタン
	createList = () => {
		let {selectetRowKeys,customerTemp,listName}=this.state;
		let selectedArray = new Array();
		let name = `送信対象`
		let i=1
		while (true) {
			if (name + i ==  this.state.listName1  || name + i ==  this.state.listName2 || name + i == this.state.listName3) {
				i =  i+1
			} else {
				name = name + i
				break;
			}
		}
		for(let i in selectetRowKeys){
			selectedArray.push(customerTemp.find(v => v.theKey === selectetRowKeys[i]));
		}
		let customerListArray = new Array();
		let mainChargeListArray = new Array();
		let departmentCodeListArray = new Array();
		let positionCodeListArray = new Array();
		let mainChargeMailListArray = new Array();
		let subChargeMailArray = new Array();
		for(let i in selectedArray){
			customerListArray.push(selectedArray[i].customerNo);//お客様番号リスト
			mainChargeListArray.push(selectedArray[i].responsiblePerson);//メイン担当者リスト
			departmentCodeListArray.push(selectedArray[i].customerDepartmentCode);//部門リスト
			positionCodeListArray.push(selectedArray[i].positionCode);//職位リスト
			mainChargeMailListArray.push(selectedArray[i].purchasingManagersMail);//メール(To)リスト
			subChargeMailArray.push(selectedArray[i].salesPersonsAppend);//候補担当メールリスト
		}
		let customerList = customerListArray.join(',');
		let mainChargeList = mainChargeListArray.join(',');
		let departmentCodeList = departmentCodeListArray.join(',');
		let positionCodeList = positionCodeListArray.join(',');
		let mainChargeMailList = mainChargeMailListArray.join(',');
		let subChargeMailList = subChargeMailArray.join(',');
		let Model = {
			name: name,
			customerList: customerList,
			mainChargeList: mainChargeList,
			departmentCodeList: departmentCodeList,
			positionCodeList: positionCodeList,
			mainChargeMailList: mainChargeMailList,
			subChargeMailList: subChargeMailList,
		}
		axios.post(this.state.serverIP + "sendRepot/creatList", Model)
		.then(result => {
			this.refs.customersTable.store.selected = [];
			this.refs.customersTable.setState({
			selectedRowKeys: [],
		})
		this.setState({
			selectetRowKeys:[],
		});
		this.getLists();
		})
	}
	// 削除ボタン
	deleteLists = () => {
		let selectetRowKeys = this.state.selectetRowKeys;
		let newCustomer = this.state.allCustomer;
		for (let i in selectetRowKeys) {
			for (let k in newCustomer) {
				if (selectetRowKeys[i] === newCustomer[k].theKey) {
					newCustomer.splice(k, 1);
					break;
				}
			}
		}
		this.refs.customersTable.store.selected = [];
		this.setState({
			selectedCusInfos: [],
			allCustomer: newCustomer,
			selectetRowKeys: [],
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
		},()=>{
			console.log(this.refs.customersTable.state.selectedRowKeys);
		})
		let customerRowIdArray = new Array();
		for (let i in this.state.allCustomer) {
			customerRowIdArray.push(this.state.allCustomer[i].theKey);
		};
		let targetCustomer = new Array();
		for (let i in customerRowIdArray) {
			let theKey = customerRowIdArray[i];
			targetCustomer.push(this.state.customerTemp[theKey]);
		};
		this.setState({
			selectedCusInfos: targetCustomer,
			sendLetterBtnFlag: !this.state.sendLetterBtnFlag,
			selectetRowKeys: [],
			currentPage: 1,//　該当page番号
		})
	}

	// 追加
	plusClick = () => {
		let customerNo = this.state.customerCode;//お客様名
		let customerDepartmentCode = this.state.customerDepartmentCode;//部門
		let purchasingManagers = this.state.purchasingManagers;//担当者
		let customers = this.state.allCustomer;
		let customerInfo = this.state.customerTemp;
		var sameFlag = false;
		if (customers.length !== 0) {
			for (let i in customers) {
				if (customerNo === customers[i].customerNo &&
					customerDepartmentCode === customers[i].customerDepartmentCode &&
					purchasingManagers === customers[i].purchasingManagers) {
					alert("err---the same record");
					sameFlag = true;
				}
			}
			if (!sameFlag) {
				for (let i in customerInfo) {
					if (customerNo === customerInfo[i].customerNo &&
						customerDepartmentCode === customerInfo[i].customerDepartmentCode) {
						this.setState({
							allCustomer: this.state.allCustomer.concat(customerInfo[i]).sort(function(a, b) {
								return a.rowId - b.rowId
							}),
						})
					}
				}
			}
		} else {
			for (let i in customerInfo) {
				if (customerNo === customerInfo[i].customerNo &&
					customerDepartmentCode === customerInfo[i].customerDepartmentCode) {
					this.setState({
						allCustomer: this.state.allCustomer.concat(customerInfo[i]),
					})
				}
			}
		}
	}
	//
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
		let theKey = row.theKey;
		if (isSelected) {
			this.setState({
				sendLetterBtnFlag: true,
				selectetRowKeys: this.state.selectetRowKeys.concat([theKey]),
				selectedCusInfos: this.state.selectedCusInfos.concat(this.state.customerTemp[theKey]),
			})
		} else {
			let index = this.state.selectetRowKeys.findIndex(item => item === theKey);
			this.state.selectetRowKeys.splice(index, 1);
			let index2 = this.state.selectedCusInfos.findIndex(item => item === theKey);
			this.state.selectedCusInfos.splice(index2, 1);
			this.setState({
				selectedCusInfos: this.state.selectedCusInfos,
				sendLetterBtnFlag: true,
				selectetRowKeys: this.state.selectetRowKeys,
			})
		}
	}

	//サブ画面
	closeDaiolog = () => {
		this.setState({
			daiologShowFlag: false,
		})
	}
	closeDaiolog2 = () => {
		this.setState({
			daiologShowFlag2: false,
		})
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
	//作業報告書ボタン
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
		if (event.target.value == 0) {
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
	showSelectedCtms = (selectedNos, name)=>{
		this.refs.customersTable.store.selected = [];
		this.setState({
			selectetRowKeys: [],
		});
		this.refs.customersTable.setState({
			selectedRowKeys: [],
		})
		this.setState({
			name: name,
		})
		let Model = {
			name:name,
		}
		axios.post(this.state.serverIP + "sendRepot/getListByName",Model)
			.then(result => {
				let TheList = result.data;
				let allCustomer = new Array();
				let customerList = new Array();
				let mainChargeList = new Array();
				let departmentCodeList = new Array();
				let positionCodeList = new Array();
				let mainChargeMailList = new Array();
				let subChargeMailList = new Array();
			//	let targetEmployeeList = new Array();
				customerList = TheList.customerList.split(',')
				mainChargeList = TheList.mainChargeList.split(',')
				departmentCodeList = TheList.departmentCodeList.split(',')
				positionCodeList = TheList.positionCodeList.split(',')
				mainChargeMailList = TheList.mainChargeMailList.split(',')
				subChargeMailList = TheList.subChargeMailList.split(',')
				//targetEmployeeList = TheList.targetEmployeeList.split(',')
				//theKey設定
				for (var i = 0; i < customerList.length; i++) {
					allCustomer[i] = {
						"theKey": customerList[i] + departmentCodeList[i] + mainChargeList[i],
						"rowId": i + 1,
						"customerNo": customerList[i],
						"responsiblePerson": mainChargeList[i],
						"customerDepartmentCode": departmentCodeList[i],
						"positionCode": positionCodeList[i],
						"purchasingManagersMail": mainChargeMailList[i],
						"salesPersonsAppend": subChargeMailList[i],
					//	"targetEmployee": targetEmployeeList[i]
					};
				}
				this.setState({
					allCustomer: allCustomer,
					customerTemp: [...allCustomer],
					selectedlistName: name,
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
						<SendRepotAppend customer={this.state.selectedCustomer} depart={this.state.customerDepartmentNameDrop}
							allState={this} positions={this.state.positions} />
					</Modal.Body>
				</Modal>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeDaiolog2} show={this.state.daiologShowFlag2} dialogClassName="modal-pbinfoSet">
					<Modal.Header closeButton></Modal.Header>
					<Modal.Body >
						<SendRepotAppend2 customer={this.state.selectedCustomer} depart={this.state.customerDepartmentNameDrop}
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
										<Form.Control id="sendDay" as="select" size="sm" onChange={this.valueChange} name="sendDay" value={this.state.sendDay} disabled={this.state.workReportStatusCode == 0 ? true : false} autoComplete="off" >
											{this.state.sendReportOfDateSeting.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup.Prepend>
									<InputGroup.Prepend>
										<DatePicker
											disabled={this.state.workReportStatusCode==0 ? true : false}
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
										onChange={(event, values) => this.onTagsChange(event, values, 'customerCode')}
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
										disabled={this.state.customerCode == "" ? true: false}
										options={this.state.customerDepartments}
										getOptionLabel={(option) => option.name ? option.name : ""}
										value={this.state.customerDepartments.find(v => v.code === this.state.customerDepartmentCode) || ""}
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
									<Autocomplete
										disabled={this.state.customerDepartmentCode == "" ? true : false}
										options={this.state.purchasingManagers}
										getOptionLabel={(option) => option.name ? option.name : ""}
										value={this.state.purchasingManagers.find(v => v.code === this.state.purchasingManagersCode) || ""}
										onChange={(event, values) => this.onTagsChange(event, values, 'purchasingManagersCode')}
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
							<Col sm={1}>
								<Button size="sm" variant="info" onClick={this.plusClick} disabled={this.state.customerCode == ""? true : false}>
									<FontAwesomeIcon icon={faPlusCircle} />追加</Button>
							</Col>
							<Col sm={5} style={{ "display": this.state.salesLists.length>=1 ? "block" : "none" }}>
								<InputGroup size="sm" className="mb-3" style={{position: 'relative'}}>
									<div style={{  "display": this.state.listShowFlag ? "contents" : "none" }}>
										格納リスト：
									<Button size="sm" variant="info" onClick={this.showSelectedCtms.bind(this, this.state.selectedCtmNoStrs1, this.state.listName1)} style={{"display": this.state.salesLists.length>=1? "block" : "none" }}>
									<FontAwesomeIcon icon={faBookmark} />{this.state.salesLists.length>=1?' '+this.state.listName1:''}</Button>{'　'}
										<Button size="sm" variant="info" onClick={this.showSelectedCtms.bind(this, this.state.selectedCtmNoStrs2, this.state.listName2)} style={{"display": this.state.salesLists.length>=2? "block" : "none" }}>
									<FontAwesomeIcon icon={faBookmark} />{this.state.salesLists.length>=2?' '+this.state.listName2:''}</Button>{'　'}
										<Button size="sm" variant="info" onClick={this.showSelectedCtms.bind(this, this.state.selectedCtmNoStrs3, this.state.listName3)} style={{"display": this.state.salesLists.length>=3? "block" : "none" }}>
										<FontAwesomeIcon icon={faBookmark} />{this.state.salesLists.length >= 3 ? ' ' + this.state.listName3 : ''}</Button>{'　'}
									</div>
										<span style={{ "display": !this.state.listShowFlag ? "contents" : "none" }}>格納リスト： <FormControl   autoComplete="off" value={this.state.listName1}
										disabled={this.state.salesLists.length>=1?false:true} 
										size="sm" name="listName1" style={{ width: "85px" }} onChange={this.changeListName}/>
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
							<Button size="sm" variant="info" name="clickButton" onClick={this.selectAllLists.bind(this)}
								disabled={0 !== this.state.allCustomer.length ? false : true}
							><FontAwesomeIcon icon={faListOl} />すべて選択</Button>
						</Col>
						<Col sm={4}></Col>
						<Col sm={6}>
							<div style={{ "float": "right" }}>
								<Button size="sm" variant="info" name="clickButton" onClick={this.deleteLists} disabled={this.state.selectetRowKeys.length === this.state.customerTemp.length || this.state.selectetRowKeys.length === 0 ? true : false}><FontAwesomeIcon icon={faMinusCircle} />削除
								</Button>{' '}
								<Button size="sm" variant="info" name="clickButton" onClick={this.clearLists} disabled={0 !== this.state.allCustomer.length ? false : true}><FontAwesomeIcon icon={faMinusCircle} />クリア
								</Button>{' '}
								<Button size="sm" variant="info" name="clickButton" onClick={this.openFolder}><FontAwesomeIcon icon={faBroom} />作業報告書
								</Button>{' '}
								<Button size="sm" variant="info" name="clickButton" onClick={this.createList} disabled={this.state.selectetRowKeys.length === this.state.customerTemp.length || this.state.selectetRowKeys.length === 0 || this.state.salesLists.length === 3 ? true : false}><FontAwesomeIcon icon={faEdit} />リスト保存
								</Button>{' '}
								<Button size="sm" variant="info" name="clickButton" onClick={this.mailCheck} disabled={true}><FontAwesomeIcon icon={faMinusCircle} />メール確認
								</Button>{' '}
								<Link to={{ pathname: '/subMenuManager/sendLettersConfirm', state: { salesPersons: this.state.selectedEmpNos, targetCusInfos: this.state.selectedCusInfos }}}>
								<Button size="sm" variant="info" name="clickButton" disabled={this.state.sendLetterBtnFlag}><FontAwesomeIcon icon={faEnvelope} />送信</Button></Link>
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
							<TableHeaderColumn width='10%' dataField='theKey' isKey></TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='rowId' >番号</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='customerNo' dataFormat={this.customerNameFormat}>お客様名</TableHeaderColumn>
							<TableHeaderColumn width='7%' dataField='responsiblePerson'>担当者</TableHeaderColumn>
							<TableHeaderColumn width='7%' dataField='customerDepartmentCode' dataFormat={this.customerDepartmentNameFormat}>部門</TableHeaderColumn>
							<TableHeaderColumn width='7%' dataField='positionCode' dataFormat={this.positionNameFormat}>職位</TableHeaderColumn>
							<TableHeaderColumn width='15%' dataField='purchasingManagersMail' >メール(To)</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='salesPersonsAppend' dataFormat={this.CellFormatter.bind(this)}>担当追加</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='targetEmployee' dataFormat={this.CellFormatter2.bind(this)}>対象社員</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='approvalStatus' >承認済み</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='sentReportStatus'>送信済み</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</Row>
			</div>
		);
	}
}
export default sendRepot;
