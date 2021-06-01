/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
// 営業送信画面
import React from 'react';
import { Form, Button, Col, Row, InputGroup, Modal } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import SendRepotAppend from './sendRepotAppend';
import SalesAppend from './salesAppend';
import DatePicker, { } from "react-datepicker";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
import MailReport from './mailReport';
import { faPlusCircle, faEnvelope, faMinusCircle, faBroom, faListOl,faEdit,faPencilAlt ,faLevelUpAlt} from '@fortawesome/free-solid-svg-icons';
axios.defaults.withCredentials = true;

class sendRepot extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
	}
	//初期化
	initialState = {
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		allCustomer: [],// お客様レコード用
		loginUserInfo: [],
		customerName: '', // おきゃく名前
		positions: store.getState().dropDown[20],
		customerDepartmentNameDrop: store.getState().dropDown[22],// 部門の連想数列
		stations: store.getState().dropDown[14],//駅
		employeeStatusList: store.getState().dropDown[4],//社員区分
		customers: store.getState().dropDown[53].slice(1),
		workReportStatus: store.getState().dropDown[60],//作業報告書送信ステータス
		sendReportOfDateSeting: store.getState().dropDown[61],//送信日付設定ステータス
		personInCharge: store.getState().dropDown[64].slice(1),
		storageList: store.getState().dropDown[69].slice(1),//報告書送信対象格納リスト
		judgmentlist: [{"code":"0","name":"✕"},{"code":"1","name":"〇"}],//承認済み 送信済み
		errorsMessageShow: false,
		purchasingManagers: '',
		customerCode: '',
		sendDay: '',
		sendTime: '',
		workReportStatusCode: '',
		customerDepartmentName: '',
		allCustomerNo: [],
		currentPage: 1,// 該当page番号
		selectetRowIds: [],
		customerTemp: [],
		sendLetterBtnFlag: true,
		myToastShow: false,
		tableClickColumn: '0',
		message: '',
		type: '',
		linkDetail: '担当追加',
		linkDetail2: '社員追加',
		selectedCustomer: {},
		selectedTargetEmployee: {},
		daiologShowFlag: false,
		mailShowFlag: false,
		selectedEmpNos: (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') ? this.props.location.state.selectetRowIds : [],
		selectedCusInfos: [],
		listName: 1,
		salesLists: [],
		listShowFlag: true,
		selectedCtmNoStrs1: "",
		selectedCtmNoStrs2: "",
		selectedCtmNoStrs3: "",
		selectedlistName: "",
		storageListName:"",
		storageListNameChange:"",
		backPage: "",
		searchFlag: true,
		sendValue: {},
		projectNo:'',
		selectedCustomers: '',
		selectedTargetEmployees: '',
		isHidden:true,
		addCustomerCode: "",
		backbackPage: "",
	};

	// 
	componentDidMount() {
		if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
			this.setState({
				sendValue: this.props.location.state.sendValue,
				projectNo: this.props.location.state.projectNo,
			})
			if(this.props.location.state.salesPersons === null || this.props.location.state.salesPersons === undefined || this.props.location.state.salesPersons === '' ||
				this.props.location.state.targetCusInfos === null || this.props.location.state.targetCusInfos === undefined || this.props.location.state.targetCusInfos === ''){
					this.setState({
						backPage: this.props.location.state.backPage,
						isHidden:false,
					})
			}
			if(this.props.location.state.salesPersons !== null && this.props.location.state.salesPersons !== undefined && this.props.location.state.salesPersons !== ''){
				this.setState({
					selectedEmpNos: this.props.location.state.salesPersons,
				})
			}
			if(this.props.location.state.targetCusInfos !== null && this.props.location.state.targetCusInfos !== undefined && this.props.location.state.targetCusInfos !== ''){
				this.setState({
					selectedCusInfos: this.props.location.state.targetCusInfos,
				})
			}
			if(this.props.location.state.backbackPage !== null && this.props.location.state.backbackPage !== undefined){
				this.setState({
					backPage: this.props.location.state.backbackPage,
					isHidden:true,
				})
			}
		}
		this.getCustomers();
		this.getLoginUserInfo();
	}
	
	getLoginUserInfo = () => {
		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
			.then(result => {
				this.setState({
					loginUserInfo: result.data,
				})
			})
			.catch(function(error) {
				alert(error);
			});
	}

	//初期化お客様取る
	getCustomers = () => {
		axios.post(this.state.serverIP + "sendRepot/getCustomers")
			.then(result => {
				let customerNoArray = new Array([]);
				for (let i in result.data) {
					customerNoArray.push(result.data[i].customerNo);
				}
				this.setState({
					allCustomer: result.data,
					allCustomerTemp: result.data,
					customerTemp: [...result.data],
					allCustomerNo: customerNoArray,
					allCustomerNum: result.data.length,
				},()=>{
					if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
					if (this.props.location.state.targetCusInfos !== null && this.props.location.state.targetCusInfos !== undefined && this.props.location.state.targetCusInfos !== '') {
						this.refs.customersTable.setState({
							selectedRowKeys: this.props.location.state.targetCusInfos,
						});
					}
					}
				});
			})
			.catch(function(err) {
				alert(err)
			})
	}
	Judgment(code) {
		if(this.state.storageListName === "" ){
			return "";
		}
		else{
			let judgmenStatuss = this.state.judgmentlist;
			for (var i in judgmenStatuss) {
				if (code === judgmenStatuss[i].code) {
					return judgmenStatuss[i].name;
				}
			}
		}
	}
	// 行番号
	indexN = (cell, row, enumObject, index) => {
		let rowNumber = (this.state.currentPage - 1) * 10 + (index + 1);
		return (<div>{rowNumber}</div>);
	}
	
	// セレクトボックス変更
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
				case 'storageList':
					this.setState({
						storageListName: '',
						storageListNameChange: '',
						selectedCustomers: '',
					})
					break;	
				case 'personInCharge':
					this.setState({
						purchasingManagers: '',
						addCustomerCode: '',
					})
					break;
				case 'storageList2':
					this.setState({
						storageListName2: '',
						storageListNameChange2: '',
						selectedTargetEmployee: '',
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
						purchasingManagers: '',
						addCustomerCode: values.code,
					})
					break;
				case 'customerDepartmentCode':
					this.setState({
						customerDepartmentCode: values.code,
					})
					break;
				case 'storageList':
					this.setState({
						storageListName:  values.name,
						storageListNameChange: values.name,
						selectedCustomers: values.code,
						allCustomer: [],
					})
					axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos: values.code.split(','),storageListName:values.name,})
					.then(result => {
				this.setState({
					allCustomer: result.data,
					customerTemp: [...result.data],
					selectetRowIds: [],
					selectedCusInfos: [],
				});
				this.refs.customersTable.setState({
					selectedRowKeys: [],
				})
			})
			.catch(function (err) {
				alert(err)
			})
					break;	
				case 'personInCharge':
					this.setState({
						purchasingManagers: values.text,
						customerCode: '',
						addCustomerCode: values.code,
					})
					break;

					//社員追加
				case 'storageList2':
					this.setState({
						storageListName:  values.name,
						storageListNameChange: values.name,
						selectedCustomers: values.code,
					})
					axios.post(this.state.serverIP + "sendRepot/getTargetEmployeeByNos", { ctmNos: values.code.split(','),storageListName:values.name,})
					.then(result => {
					this.setState({
						selectedTargetEmployee: result.data,
						targetEmployeeTemp: [...result.data],
						selectetRowIds: [],
						selectedCusInfos: [],
					});
					this.refs.customersTable.setState({
						selectedRowKeys: [],
					})
				})
				.catch(function (err) {
					alert(err)
				})
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
// customerDepartmentNameFormat
	positionNameFormat = (cell) => {
		let positionsTem = this.state.positions;
		for (var i in positionsTem) {
			if (cell === positionsTem[i].code) {
				return positionsTem[i].name;
			}
		}
	}
	
	workReportStatusChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
		if (event.target.value === '0'||event.target.value === '') {
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
		var a = window.confirm("削除していただきますか？");
		if(a){
			if (this.state.storageListName !== '') {
				axios.post(this.state.serverIP + "sendRepot/deleteCustomerList", { storageListName: this.state.storageListName })
					.then(() => {
						let newStorageListArray = new Array([]);
						for (let i in this.state.storageList) {
							if(this.state.storageList[i].name === this.state.storageListName){
								let storageListTemp = {name:this.state.storageList[i].name,code:''};
								newStorageListArray.push(storageListTemp);
							}
							else{
								newStorageListArray.push(this.state.storageList[i]);
							}
						}
						this.setState({
							storageList: newStorageListArray,
							allCustomer: [],
							customerTemp: [],
							selectedCusInfos: [],
							sendLetterBtnFlag: true,
						})
						this.refs.customersTable.store.selected = [];
						this.refs.customersTable.setState({
							selectedRowKeys: [],
						})
					    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
				        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName0"});
					})
			} else {
				this.setState({
					allCustomer: [],
					customerTemp: [],
					selectedCusInfos: [],
					sendLetterBtnFlag: true,
				})
				this.refs.customersTable.store.selected = [];
				this.refs.customersTable.setState({
					selectedRowKeys: [],
				})
				this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
		        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName0"});
			}
		}
	}
		valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

	createList = () => {
		let { selectetRowIds, customerTemp, listName } = this.state;
		let selectedArray = new Array([]);
		for (let i in selectetRowIds) {
			selectedArray.push(customerTemp.find(v => v.rowId === selectetRowIds[i]));
		}
		let name = `送信対象${listName}`;
		let selectedNoArray = new Array([]);
		for (let i in selectedArray) {
			selectedNoArray.push(selectedArray[i].customerNo);
		}
		let code = selectedNoArray.join(',');
		axios.post(this.state.serverIP + "sendRepot/creatList", { name, code })
			.then(() => {
				this.refs.customersTable.store.selected = [];
				this.refs.customersTable.setState({
					selectedRowKeys: [],
				})
				/* listName=listName+1; */
				this.setState({
					selectetRowIds: [],
				});
				this.getLists();
			})
	}
	
	addNewList = () => {
		let newAllCtmNos = "";
		for (let i in this.state.allCustomer){
			newAllCtmNos += this.state.allCustomer[i].customerNo + ",";
		}
		newAllCtmNos = newAllCtmNos.substring(0, newAllCtmNos.lastIndexOf(','));
		axios.post(this.state.serverIP + "sendRepot/addNewList", { code:(this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys): newAllCtmNos) })
		.then(result => {
			let newStorageListArray = this.state.storageList;
			let storageListTemp = {name:result.data,code:(this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys): newAllCtmNos) };
			newStorageListArray.push(storageListTemp);
			this.setState({
				storageList: newStorageListArray,
				storageListName: result.data,
				storageListNameChange: result.data,
				selectedCustomers: (this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys): newAllCtmNos),
				currentPage: 1,
			})
			axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos:(this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys).split(','): newAllCtmNos.split(',')),storageListName:result.data,})
				.then(result => {
					this.setState({
						allCustomer: result.data,
						allCustomerTemp: result.data,
					});
				    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
			        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName0"});
				})
				.catch(function (err) {
					alert(err)
				})
		})	
	}

	// deleteボタン事件
	deleteLists = () => {
		var a = window.confirm("削除していただきますか？");
		if(a){
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
			for (let i in newCustomer) {
				newCustomer[i].rowId = i;
			}
			this.refs.customersTable.store.selected = [];
			this.setState({
				selectedCusInfos: [],
				allCustomer: newCustomer,
				allCustomerTemp: newCustomer,
				customerTemp: newCustomer,
				selectetRowIds: [],
			});
			this.refs.customersTable.setState({
				selectedRowKeys: [],
			})
			if (this.state.storageListName !== '') {
				axios.post(this.state.serverIP + "sendRepot/deleteCustomerListByNo",
						{
							oldCtmNos: String(this.state.selectedCustomers).split(','),
							deleteCtmNos: String(this.refs.customersTable.state.selectedRowKeys).split(','),
							storageListName: this.state.storageListName
						})
				.then(result => {
					let newStorageListArray = new Array([]);
					for (let i in this.state.storageList) {
						if(this.state.storageList[i].name === this.state.storageListName){
							let storageListTemp = {name:this.state.storageList[i].name,code:result.data};
							newStorageListArray.push(storageListTemp);
						}
						else{
							newStorageListArray.push(this.state.storageList[i]);
						}
					}
					this.setState({
						selectedCustomers: result.data,
						storageList: newStorageListArray,
					})
				    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
			        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName0"});
				})
				.catch(function (err) {
					alert(err)
				})
			}else{
			    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
		        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName0"});
			}
		}
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
			currentPage: 1,// 該当page番号
		})
	}
	// 追加
	addClick = () => {
		this.setState({"errorsMessageShow": false});
		var allCustomerData = this.state.allCustomer;
		for (let k in allCustomerData) {
			if(allCustomerData[k].customerNo === this.state.addCustomerCode){
				this.setState({"errorsMessageShow": true , message: "お客様は存在しています、チェックしてください。" });
				setTimeout(() => this.setState({ "errorsMessageShow": false }), 2000);
				return;
			}
		}
		if(this.state.storageListName === null || this.state.storageListName === ""){
			let newAllCtmNos = "";
			for (let i in this.state.allCustomer){
				newAllCtmNos += this.state.allCustomer[i].customerNo + ",";
			}
			newAllCtmNos += this.state.addCustomerCode;
			axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos: newAllCtmNos.split(','),storageListName:this.state.storageListName, })
			.then(result => {
				let newStorageListArray = new Array([]);
				for (let i in this.state.storageList) {
					if(this.state.storageList[i].name === this.state.storageListName){
						let storageListTemp = {name:this.state.storageList[i].name,code:this.state.storageList[i].code + ',' + this.state.addCustomerCode};
						newStorageListArray.push(storageListTemp);
					}
					else{
						newStorageListArray.push(this.state.storageList[i]);

					}
				}
				this.setState({
					storageList: newStorageListArray,
					storageListName: this.state.storageListNameChange,
					allCustomer: result.data,
					allCustomerTemp: result.data,
					customerTemp: result.data,
				});
			    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
		        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName0"});
			})
			.catch(function (err) {
				alert(err)
			})
		}
		else{
			axios.post(this.state.serverIP + "sendRepot/customerListUpdate", 
					{
						storageListName:this.state.storageListName,
						customerList:this.state.addCustomerCode
					})
			.then(result => {
				axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos: result.data.split(','),storageListName:this.state.storageListName, })
				.then(result => {
					let newStorageListArray = new Array([]);
					for (let i in this.state.storageList) {
						if(this.state.storageList[i].name === this.state.storageListName){
							let storageListTemp = {name:this.state.storageList[i].name,code:this.state.storageList[i].code + ',' + this.state.addCustomerCode};
							newStorageListArray.push(storageListTemp);
						}
						else{
							newStorageListArray.push(this.state.storageList[i]);

						}
					}
					this.setState({
						storageList: newStorageListArray,
						storageListName: this.state.storageListNameChange,
						allCustomer: result.data,
						allCustomerTemp: result.data,
						customerTemp: result.data,
					});
				    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
			        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName0"});
				})
				.catch(function (err) {
					alert(err)
				})
			})
			.catch(function (err) {
				alert(err)
			})
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
		let rowNo = row.rowId;
		if (isSelected) {
			this.setState({
				sendLetterBtnFlag: true,
				selectetRowIds: this.state.selectetRowIds.concat([rowNo]),
				selectedCusInfos: this.state.selectedCusInfos.concat(this.state.customerTemp[rowNo]),
				purchasingManagersMail: row.purchasingManagersMail,
				customerName: row.customerName,
				purchasingManagers: row.purchasingManagers,
				sendRepotsAppend: row.sendRepotsAppend,
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
				purchasingManagersMail: "",
				customerName: "",
				purchasingManagers: "",
				sendRepotsAppend: "",
			})
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
	getSalesPersons = (selectedCustomer) => {
		console.log(selectedCustomer.salesPersonsAppend !== null);
		this.setState({
			selectedCustomer: selectedCustomer,
			daiologShowFlag: true,
		})
	}
	saveSalesPersons = (row, appendPersonMsg) => {
		this.state.customerTemp[row.rowId].purchasingManagersOthers = appendPersonMsg.purchasingManagersOthers;
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
	getTargetEmployees = (selectedCustomer) => {
		console.log(selectedCustomer.sendRepotsAppend !== null);
		this.setState({
			selectedCustomer: selectedCustomer,
			daiologShowFlag2: true,
		})
	}
	saveTargetEmployees = (row, appendEmployeeMsg) => {
		this.state.customerTemp[row.rowId].employeesOthers = appendEmployeeMsg.employeesOthers;
		this.setState({
			daiologShowFlag2: false,
		});
		this.CellFormatter2(row.sendRepotsAppend, row);
	}
//サブ画面クローズ
	closeDaiolog = () => {
		this.setState({
			daiologShowFlag: false,
			daiologShowFlag2: false,
		})
	}
	
	changeName = () => {
		for (let i in this.state.storageList) {
			if(this.state.storageListNameChange === ""){
                this.setState({ "errorsMessageShow": true, message: "リスト名を入力してください。" });
                setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
				return;
			}
			if(this.state.storageList[i].name === this.state.storageListNameChange){
                this.setState({ "errorsMessageShow": true, message: "同名なリストが存在しています、チェックしてください。" });
                setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
				return;
			}
		}
		var salesSendLettersListNames = {
				storageListName: this.state.storageListNameChange, oldStorageListName:this.state.storageListName,
			};
			axios.post(this.state.serverIP + "sendRepot/listNameUpdate", salesSendLettersListNames)
				.then(result => {
	                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
	                    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
	                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName0"});
						
						let newStorageListArray = new Array([]);
						for (let i in this.state.storageList) {
							if(this.state.storageList[i].name === this.state.storageListName){
								let storageListTemp = {name:this.state.storageListNameChange,code:this.state.storageList[i].code};
								newStorageListArray.push(storageListTemp);
							}
							else{
								newStorageListArray.push(this.state.storageList[i]);

							}
						}
						this.setState({
							storageList: newStorageListArray,
							storageListName: this.state.storageListNameChange,
						})
						
	                } else {
	                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
	                }
				})
				.catch(function (err) {
					alert(err)
				})
	}
	
	deleteList = () => {
		var a = window.confirm("削除していただきますか？");
		if(a){
			var salesSendLettersListNames = {
					storageListName: this.state.storageListNameChange
				};
			axios.post(this.state.serverIP + "sendRepot/deleteList", salesSendLettersListNames)
					.then(result => {
		                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
							let newStorageListArray = new Array([]);
							for (let i in this.state.storageList) {
								if(this.state.storageList[i].name === this.state.storageListName){
								}
								else{
									newStorageListArray.push(this.state.storageList[i]);
								}
							}
							this.setState({
								storageList: newStorageListArray,
								sendLetterBtnFlag: true,
								storageListNameChange: "",
								storageListName: "",
							})
		                    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
							store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName0"});
		                } else {
		                    this.setState({errorsMessageValue: result.data.errorsMessage });
		                }
		                this.getCustomers();
					})
					.catch(function (err) {
						alert(err)
					})
		}
	}

	showSelectedCtms = (selectedNos, flag) => {
		this.refs.customersTable.store.selected = [];
		this.setState({
			selectetRowIds: [],
		});
		this.refs.customersTable.setState({
			selectedRowKeys: [],
		})
		if (flag === '1') {
			this.setState({
				selectedlistName: this.state.listName1,
			})
		} else if (flag === '2') {
			this.setState({
				selectedlistName: this.state.listName2,
			})
		} else if (flag === '3') {
			this.setState({
				selectedlistName: this.state.listName3,
			})
		}
		axios.post(this.state.serverIP + "sendRepot/getCustomersByNos", { ctmNos: selectedNos.split(','),storageListName:this.state.storageListName, })
			.then(result => {
				this.setState({
					allCustomer: result.data,
					allCustomerTemp: result.data,
				});
			})
			.catch(function (err) {
				alert(err)
			})
	}

	changeListName = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	/**
	 * 戻るボタン
	 */
	back = () => {
		var path = {};
		path = {
			pathname: this.state.backPage,
			state: { searchFlag: this.state.searchFlag, sendValue: this.state.sendValue , selectedProjectNo:this.state.projectNo,projectNo:this.state.projectNo,},
		}
		this.props.history.push(path);
	}
	//作業報告書ボタン
	openFolder = () => {
				axios.post(this.state.serverIP + "sendRepot/openFolder")
	}
	
	openMail = () => {
		this.setState({
			mailShowFlag: true,
		});
	}
	
	closeMail = () => {
		this.setState({
			mailShowFlag: false,
		})
	}
	
	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = this.state.sendValue;
		switch (actionType) {
			case "sendRepotConfirm":
				path = {
					pathname: '/subMenuManager/sendRepotConfirm',
					state: {
						salesPersons: (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') ? this.state.selectedEmpNos : null,
						targetCusInfos: this.state.selectedCusInfos,
						backPage: 'salesSendLetter',
						projectNo: this.state.projectNo,
						backbackPage: this.state.backPage,
						sendValue: sendValue,
					},
				}
				break;
			case "sendLettersMatter":
				path = {
					pathname: '/subMenuManager/sendLettersMatter',
					state: {
						targetCusInfos: this.state.selectedCusInfos,
						backPage: 'salesSendLetter',
						projectNo: this.state.projectNo,
						backbackPage: this.state.backPage,
						sendValue: sendValue,
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
	}
	render() {
		const { backPage,message,type } = this.state;

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
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={message} type={"danger"} />
				</div>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeDaiolog} show={this.state.daiologShowFlag} dialogClassName="modal-purchasingManagersSet">
					<Modal.Header closeButton></Modal.Header>
					<Modal.Body >
						<SalesAppend customer={this.state.selectedCustomer} depart={this.state.customerDepartmentNameDrop}
							allState={this} positions={this.state.positions} />
					</Modal.Body>
				</Modal>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeDaiolog} show={this.state.daiologShowFlag2} dialogClassName="modal-purchasingManagersSet">
					<Modal.Header closeButton></Modal.Header>
					<Modal.Body >
						<SendRepotAppend customer={this.state.selectedCustomer} allState={this} employeeStatusList={this.state.employeeStatusList}
							stations={this.state.stations}/>
					</Modal.Body>
				</Modal>
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeMail} show={this.state.mailShowFlag} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton><Col className="text-center">
						<h2>メール内容確認</h2>
					</Col></Modal.Header>
					<Modal.Body >
						<MailReport personalInfo={this} />
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
 										disabled = {this.state.storageListName === "" ? true : false}
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
 							<Col sm={10}>
 								<InputGroup size="sm" className="mb-3">
 									<InputGroup.Prepend>
 										<InputGroup.Text id="inputGroup-sizing-sm"　style={{ width: "7rem" }}>送信日付設定</InputGroup.Text>
 									</InputGroup.Prepend>
 									<InputGroup.Prepend>
 										<Form.Control id="sendDay" as="select" size="sm" onChange={this.valueChange} name="sendDay" value={this.state.sendDay} disabled={this.state.workReportStatusCode === '1' ?  false:true } autoComplete="off" >
 											{this.state.sendReportOfDateSeting.map(data =>
 												<option key={data.code} value={data.code}>
 													{data.name}
 												</option>
 											)}
 										</Form.Control>
 									</InputGroup.Prepend>
 									<InputGroup.Prepend>
 										<DatePicker
 											disabled={this.state.workReportStatusCode=== '1' ?  false:true}
 											selected={this.state.sendTime}
 											value={this.state.sendTime}
 											onChange={this.inactiveSendTime}
 											autoComplete="off"
 											locale="ja"
 											dateFormat="HH:mm"
 											showTimeSelect
 											showTimeSelectOnly
 											id={this.state.workReportStatusCode=== '1' ?  "datePicker":"datePickerReadonlyDefault"}
 											className="form-control form-control-sm"
 										/>
 									</InputGroup.Prepend>
 								</InputGroup>
 							</Col>
 						</Row>
						<Row>
							<Col sm={6}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
									disabled={this.state.allCustomer.length === this.state.allCustomerNum ? true : false}
									options={this.state.customers}
									getOptionLabel={(option) => option.name ? option.name : ""}
									value={this.state.customers.find(v => v.code === this.state.customerCode) || ""}
									onChange={(event, values) => this.onTagsChange(event, values, 'customerName')}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input type="text" {...params.inputProps}
												id="customerCode" className="auto form-control Autocompletestyle-salesSend-customers"
												 />
										</div>
									)}
								/>
								<InputGroup.Prepend>
									<InputGroup.Text id="sanKanji">担当者</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
								disabled={this.state.allCustomer.length === this.state.allCustomerNum ? true : false}
								options={this.state.personInCharge}
								getOptionLabel={(option) => option.text ? option.text : ""}
								value={this.state.personInCharge.find(v => v.text === this.state.purchasingManagers) || ""}
								onChange={(event, values) => this.onTagsChange(event, values, 'personInCharge')}
								renderInput={(params) => (
									<div ref={params.InputProps.ref}>
										<input type="text" {...params.inputProps}
											id="personInCharge" className="auto form-control Autocompletestyle-salesSend-personInCharge"
											 />
									</div>
								)}
							/>
								<Button size="sm" variant="info" onClick={this.addClick}
								disabled={this.state.customerCode !== "" || this.state.purchasingManagers !== ""  ? false : true}>
									<FontAwesomeIcon icon={faPlusCircle} />追加</Button>
									</InputGroup>
							</Col>
							<Col sm={3}>
							<div style={{position:'absolute',right:'0px'}}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="fiveKanji">格納リスト</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
									options={this.state.storageList}
									getOptionLabel={(option) => option.name ? option.name : ""}
									disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? true : false}
									value={this.state.storageList.find(v => v.name === this.state.storageListName) || ""}
									onChange={(event, values) => this.onTagsChange(event, values, 'storageList')}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input type="text" {...params.inputProps}
												id="storageList" className="auto form-control Autocompletestyle-salesSend-storageList" 
												 />
										</div>
									)}
								/>
							</InputGroup>
							</div>
							</Col>
							<Col sm={3}>
							<InputGroup size="sm" className="mb-3">
								<Form.Control placeholder="データ修正" id="storageListNameChange" name="storageListNameChange" value={this.state.storageListNameChange}
                                onChange={this.valueChange} />
								<Button style={{ marginLeft: "5px", marginRight: "5px" }} size="sm" variant="info" onClick={this.changeName}><FontAwesomeIcon icon={faPencilAlt} />更新</Button>
								<Button size="sm" variant="info" onClick={this.deleteList}><FontAwesomeIcon icon={faMinusCircle} />削除</Button>
							</InputGroup>
						</Col>
						</Row>
					</Form.Group>
					<Row>
						<Col sm={6}>
							<Button size="sm" variant="info" name="clickButton" onClick={this.selectAllLists}
								disabled={0 !== this.state.allCustomer.length ? false : true}
							><FontAwesomeIcon icon={faListOl} />すべて選択</Button>{" "}
							<Button
								size="sm"
								hidden={(this.state.backPage === "" ||  this.state.backPage === null ? true : false)}
								variant="info"
								onClick={this.back.bind(this)}
							>
								<FontAwesomeIcon icon={faLevelUpAlt} />戻る
                            </Button>
						</Col>
						<Col sm={6}>
							<div style={{ "float": "right" }}>
								<Button size="sm" variant="info" name="clickButton"
									onClick={!this.state.sendLetterBtnFlag ? this.clearLists : this.deleteLists} disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true}><FontAwesomeIcon icon={faMinusCircle} />削除</Button>	{' '}
								<Button size="sm" variant="info" name="clickButton" onClick={this.openFolder}><FontAwesomeIcon icon={faBroom} />作業報告書</Button>{' '}
								<Button size="sm" variant="info" name="clickButton"
									onClick={this.addNewList} disabled={(this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true) || !(this.state.storageListName === null || this.state.storageListName === "") ? true : false}><FontAwesomeIcon icon={faEdit} />リスト作成</Button>{' '}
								<Button size="sm" onClick={this.openMail} variant="info" name="clickButton"
									disabled={((this.state.sendRepotsAppend !== "" || !this.state.sendLetterBtnFlag ? false : true) || (this.state.backPage !== "" && this.state.backPage !== "manageSituation") ? true : false)}>
								<FontAwesomeIcon icon={faEnvelope} />メール確認</Button>{' '}
								<Button size="sm" onClick={this.shuseiTo.bind(this,"sendLettersMatter")} variant="info" name="clickButton"
									disabled={((this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true) || (this.state.backPage !== "" && this.state.backPage !== "projectInfoSearch") ? true : false) || this.state.storageListName === "" ? true : false }>
								<FontAwesomeIcon icon={faEnvelope} />送信</Button>{' '}
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
							<TableHeaderColumn width='8%' dataField='any' dataFormat={this.indexN} autoValue editable={false}>番号</TableHeaderColumn>
							<TableHeaderColumn width='11%' dataField='customerNo' hidden isKey>お客様番号</TableHeaderColumn>
							<TableHeaderColumn width='20%' dataField='customerName' dataFormat={this.customerNameFormat}>お客様名</TableHeaderColumn>
							<TableHeaderColumn width='9%' dataField='purchasingManagers'>担当者</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='customerDepartmentCode' dataFormat={this.customerDepartmentNameFormat}>部門</TableHeaderColumn>
							<TableHeaderColumn width='9%' dataField='positionCode' dataFormat={this.positionNameFormat}>職位</TableHeaderColumn>
							<TableHeaderColumn width='14%' dataField='purchasingManagersMail' >メール</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='salesPersonsAppend' dataFormat={this.CellFormatter.bind(this)}>担当追加</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='sendRepotsAppend' dataFormat={this.CellFormatter2.bind(this)}>対象社員</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='approvalStatus'dataFormat={this.Judgment.bind(this)}>承認済み</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='sentReportStatus'dataFormat={this.Judgment.bind(this)}>送信済み</TableHeaderColumn>
							<TableHeaderColumn dataField='rowId' hidden={true} >ID</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</Row>
			</div>
		);
	}
}
export default sendRepot;
