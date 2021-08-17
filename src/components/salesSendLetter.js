// 営業送信画面
import React from 'react';
import { Form, Button, Col, Row, InputGroup, Modal, FormControl, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SalesAppend from './salesAppend';
import MyToast from './myToast';
import { Link } from "react-router-dom";
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
import { faPlusCircle, faEnvelope, faMinusCircle, faBroom, faListOl, faEdit, faPencilAlt, faBookmark, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
axios.defaults.withCredentials = true;


class salesSendLetter extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.valueChange = this.valueChange.bind(this);
	}
	// 初期化
	initialState = {
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		allCustomer: [],// お客様レコード用
		allCustomerTemp: [],// お客様レコード用
		customerNo: "",
		customerName: '', // おきゃく名前
		// customers: store.getState().dropDown[15],// 全部お客様 dropDowm用
		customers: store.getState().dropDown[77].slice(1),
		storageList: store.getState().dropDown[63].slice(1),
		storageListAll: store.getState().dropDown[63].slice(1),
		personInCharge: store.getState().dropDown[78].slice(1),
        proposeClassification: [{code: "0",name: "すべて"},{code: "1",name: "案件"},{code: "2",name: "要員"}],
		errorsMessageShow: false,
		purchasingManagers: '',
		customerDepartmentNameDrop: store.getState().dropDown[22],// 部門の連想数列
		customerCode: '',
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
		selectedCustomer: {},
		daiologShowFlag: false,
		positions: store.getState().dropDown[20],
		selectedEmpNos: (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') ? this.props.location.state.selectetRowIds : [],
		selectedCusInfos: [],
		listName: 1,
		salesLists: [],
		listName1: "",
		listName2: "",
		listName3: "",
		listShowFlag: true,
		oldListName1: "",
		oldListName2: "",
		oldListName3: "",
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
		isHidden:true,
		addCustomerCode: "",
		backbackPage: "",
		proposeClassificationCode: "0",
	};
	
	componentDidMount() {
		if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
			this.setState({
				sendValue: this.props.location.state.sendValue,
				projectNo: this.props.location.state.projectNo,
				proposeClassificationCode: this.props.location.state.sendValue.proposeClassificationCode,
			})
			this.setStorageList(this.props.location.state.sendValue.proposeClassificationCode);
		
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
			switch (this.props.location.state.sendValue.proposeClassificationCode) {
			case "1":
				this.getCustomers("projectInfoSearch");
				break;
			case "2":
				this.getCustomers("manageSituation");	
				break;
			default:
				break;
		}
		}else{
			this.setStorageList("0");
			this.getCustomers("all");
		}
		this.getLists();
	}
	
	setStorageList = (proposeClassificationCode) => {
		let newStorageList = [];
		let storageList = this.state.storageListAll;
		for(let i in storageList){
			if(storageList[i].text === proposeClassificationCode){
				newStorageList.push(storageList[i]);
			}
		}
		this.setState({
			storageList: newStorageList,
		})
	}

	getLists = () => {
		axios.post(this.state.serverIP + "salesSendLetters/getLists")
			.then(result => {
				this.setState({
					salesLists: result.data,
					listName: 1 + result.data.length,
					listName1: result.data.length >= 1 ? result.data[0].name : '',
					listName2: result.data.length >= 2 ? result.data[1].name : '',
					listName3: result.data.length >= 3 ? result.data[2].name : '',
					oldListName1: result.data.length >= 1 ? result.data[0].name : '',
					oldListName2: result.data.length >= 2 ? result.data[1].name : '',
					oldListName3: result.data.length >= 3 ? result.data[2].name : '',
					selectedCtmNoStrs1: result.data.length >= 1 ? result.data[0].customerNo : '',
					selectedCtmNoStrs2: result.data.length >= 2 ? result.data[1].customerNo : '',
					selectedCtmNoStrs3: result.data.length >= 3 ? result.data[2].customerNo : '',
				});
			})
			.catch(function (err) {
				alert(err)
			})
	}

	// 初期化お客様取る
	getCustomers = (proposeClassificationCode) => {
		let backPage = (proposeClassificationCode === null || proposeClassificationCode === undefined || proposeClassificationCode === "" ? this.state.backPage : proposeClassificationCode);
		axios.post(this.state.serverIP + "salesSendLetters/getCustomers")
			.then(result => {
				let customerNoArray = new Array();
				let dataArray = new Array();
				for (let i in result.data) {
					customerNoArray.push(result.data[i].customerNo);
					switch (backPage) {
					case "manageSituation":
						if(result.data[i].proposeClassificationCode === null || result.data[i].proposeClassificationCode === "2" || result.data[i].proposeClassificationCode === "3")
							dataArray.push(result.data[i]);
						break;
					case "projectInfoSearch":
						if(result.data[i].proposeClassificationCode === null || result.data[i].proposeClassificationCode === "1" || result.data[i].proposeClassificationCode === "3")
							dataArray.push(result.data[i]);
						break;
					default:
						dataArray.push(result.data[i]);
						break;
					}
				}
				for (let i in dataArray) {
					dataArray[i].rowId = i;
				}
				this.setState({
					allCustomer: dataArray,
					allCustomerTemp: dataArray,
					customerTemp: [...dataArray],
					allCustomerNo: customerNoArray,
					allCustomerNum: dataArray.length,
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
			.catch(function (err) {
				alert(err)
			})
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
				case 'storageList':
					this.setState({
						storageListName: '',
						storageListNameChange: '',
						selectedCustomers: '',
					})
					switch (this.state.proposeClassificationCode) {
						case "0":
							this.getCustomers("all");
							break;
						case "1":
							this.getCustomers("projectInfoSearch");
							break;
						case "2":
							this.getCustomers("manageSituation");	
							break;
						default:
							break;
					}
					break;	
				case 'personInCharge':
					this.setState({
						purchasingManagers: '',
						addCustomerCode: '',
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
					})
					axios.post(this.state.serverIP + "salesSendLetters/getCustomersByNos", { ctmNos: values.code.split(','),storageListName:values.name,})
					.then(result => {
						let dataArray = new Array();
						for (let i in result.data) {
							switch (this.state.backPage) {
							case "manageSituation":
								if(result.data[i].proposeClassificationCode === null || result.data[i].proposeClassificationCode === "2" || result.data[i].proposeClassificationCode === "3")
									dataArray.push(result.data[i]);
								break;
							case "projectInfoSearch":
								if(result.data[i].proposeClassificationCode === null || result.data[i].proposeClassificationCode === "1" || result.data[i].proposeClassificationCode === "3")
									dataArray.push(result.data[i]);
								break;
							default:
								dataArray.push(result.data[i]);
								break;
							}
						}
						for (let i in dataArray) {
							dataArray[i].rowId = i;
						}
				this.setState({
					allCustomer: dataArray,
					allCustomerTemp: dataArray,
					customerTemp: [...dataArray],
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
	
	businessCountFormat = (cell) => {
		if(cell === "0")
			return "";
		else
			return cell;
	}
	
	mailListFormat = (cell,row, enumObject, index) => {
		if(cell !== null){
			if(cell.length > 1){
				return (<div>
				<Form.Control as="select" size="sm"
							  onChange={this.mailChange.bind(this, row)}
							  name="mail"
							  autoComplete="off">
					{cell.map(data =>
						<option value={data}>{data}</option>
					)}
				</Form.Control>
			</div>);
			}
			else{
				return cell;
			}
		}
	}
	
	mailChange = (row, event) => {
		var allCustomer = this.state.allCustomer;
		allCustomer[row.rowId].purchasingManagersMail = event.target.value;
		this.setState({
			allCustomer: allCustomer,
		})
	}
	
    // 鼠标悬停显示全文
    customerNameFormat = (cell) => {
		return <span title={cell}>{cell}</span>;
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
		var a = window.confirm("削除していただきますか？");
		if(a){
			if (this.state.storageListName !== '') {
				axios.post(this.state.serverIP + "salesSendLetters/deleteCustomerList", { storageListName: this.state.storageListName })
					.then(result => {
						let newStorageListArray = new Array();
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
				        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
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
		        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
			}
		}
	}
	
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	
	proposeClassificationCodeChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
			storageListName: "",
			storageListNameChange: "",
		})
		this.setStorageList(event.target.value);
		switch (event.target.value) {
		case "0":
			this.getCustomers("all");
			break;
		case "1":
			this.getCustomers("projectInfoSearch");
			break;
		case "2":
			this.getCustomers("manageSituation");	
			break;
		default:
			break;
		}
	}
	
	addNewList = () => {
		let newAllCtmNos = "";
		for (let i in this.state.allCustomer){
			newAllCtmNos += this.state.allCustomer[i].customerNo + ",";
		}
		newAllCtmNos = newAllCtmNos.substring(0, newAllCtmNos.lastIndexOf(','));
		axios.post(this.state.serverIP + "salesSendLetters/addNewList", { proposeClassificationCode: this.state.proposeClassificationCode, code:(this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys): newAllCtmNos) })
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
			axios.post(this.state.serverIP + "salesSendLetters/getCustomersByNos", { ctmNos:(this.state.sendLetterBtnFlag ? String(this.refs.customersTable.state.selectedRowKeys).split(','): newAllCtmNos.split(',')),storageListName:result.data,})
				.then(result => {
					this.setState({
						allCustomer: result.data,
						allCustomerTemp: result.data,
					});
				    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
			        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
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
				axios.post(this.state.serverIP + "salesSendLetters/deleteCustomerListByNo",
						{
							oldCtmNos: String(this.state.selectedCustomers).split(','),
							deleteCtmNos: String(this.refs.customersTable.state.selectedRowKeys).split(','),
							storageListName: this.state.storageListName
						})
				.then(result => {
					let newStorageListArray = new Array();
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
			        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
				})
				.catch(function (err) {
					alert(err)
				})
			}else{
			    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
		        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
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
	// addClick
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
			axios.post(this.state.serverIP + "salesSendLetters/getCustomersByNos", { ctmNos: newAllCtmNos.split(','),storageListName:this.state.storageListName, })
			.then(result => {
				let newStorageListArray = new Array();
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
		        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
			})
			.catch(function (err) {
				alert(err)
			})
		}
		else{
			axios.post(this.state.serverIP + "salesSendLetters/customerListUpdate", 
					{
						storageListName:this.state.storageListName,
						customerList:this.state.addCustomerCode
					})
			.then(result => {
				axios.post(this.state.serverIP + "salesSendLetters/getCustomersByNos", { ctmNos: result.data.split(','),storageListName:this.state.storageListName, })
				.then(result => {
					let newStorageListArray = new Array();
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
			        store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
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
				customerNo: row.customerNo,
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
				customerNo: "",
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

	saveSalesPersons = (row, appendPersonMsg) => {
/*		this.state.customerTemp[row.rowId].purchasingManagers2 = appendPersonMsg.purchasingManagers2;
		this.state.customerTemp[row.rowId].positionCode2 = appendPersonMsg.positionCode2;
		this.state.customerTemp[row.rowId].purchasingManagersMail2 = appendPersonMsg.purchasingManagersMail2;*/
		this.state.customerTemp[row.rowId].purchasingManagersOthers = appendPersonMsg.purchasingManagersOthers;
		this.setState({
			daiologShowFlag: false,
		});
		this.CellFormatter(row.salesPersonsAppend, row);
	}
	changeName = () => {
		for (let i in this.state.storageListAll) {
			if(this.state.storageListAll[i].name === this.state.storageListNameChange){
                this.setState({ "errorsMessageShow": true, message: "同名なリストが存在しています、チェックしてください。" });
                setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
				return;
			}
		}
		var salesSendLettersListNames = {
				storageListName: this.state.storageListNameChange, oldStorageListName:this.state.storageListName,
			};
			axios.post(this.state.serverIP + "salesSendLetters/listNameUpdate", salesSendLettersListNames)
				.then(result => {
	                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
	                    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
	                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
						
						let newStorageListArray = new Array();
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
			axios.post(this.state.serverIP + "salesSendLetters/deleteList", salesSendLettersListNames)
					.then(result => {
		                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
							let newStorageListArray = new Array();
							for (let i in this.state.storageList) {
								if(this.state.storageList[i].name === this.state.storageListName){
								}
								else{
									newStorageListArray.push(this.state.storageList[i]);
								}
							}
							let newStorageListAllArray = new Array();
							for (let i in this.state.storageListAll) {
								if(this.state.storageListAll[i].name === this.state.storageListName){
								}
								else{
									newStorageListAllArray.push(this.state.storageListAll[i]);
								}
							}
							this.setState({
								storageList: newStorageListArray,
								storageListAll: newStorageListAllArray,
								sendLetterBtnFlag: true,
								storageListNameChange: "",
								storageListName: "",
							})
		                    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
		                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
							store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
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
		axios.post(this.state.serverIP + "salesSendLetters/getCustomersByNos", { ctmNos: selectedNos.split(','),storageListName:this.state.storageListName, })
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

	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = this.state.sendValue;
		switch (actionType) {
			case "sendLettersConfirm":
				path = {
					pathname: '/subMenuManager/sendLettersConfirm',
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
			case "update":
                path = {
                    pathname: '/subMenuManager/customerInfo',
                    state: {
                        actionType: 'update',
                        customerNo: this.state.customerNo,
                        backPage: "salesSendLetter", sendValue: sendValue,
						backbackPage: this.state.backPage,
                        searchFlag: this.state.searchFlag,
						projectNo: this.state.projectNo,
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
				<Row inline="true">
					<Col className="text-center">
						<h2>{"お客様選択"+ (this.state.backPage === "" ? "" : this.state.backPage === "manageSituation" ? "（要員送信）" : "（案件送信）")}</h2>
					</Col>
				</Row>
				<br />
				<Form onSubmit={this.savealesSituation}>
					<Row>
					<Col sm={3}>
						<InputGroup size="sm" className="mb-3">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text>提案区分</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <Form.Control as="select" placeholder="提案区分" id="proposeClassificationCode" name="proposeClassificationCode"
		                    	onChange={this.proposeClassificationCodeChange} disabled={this.state.backPage !== "" ? true : false}
		                    	value={this.state.proposeClassificationCode} >
		                        {this.state.proposeClassification.map(date =>
		                            <option key={date.code} value={date.code}>
		                                {date.name}
		                            </option>
		                        )}
		                    </Form.Control>
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
								
							</InputGroup>
							</Col>

							<Col sm={3}>
							<div style={{position:'absolute',left:'0px',marginLeft:"-22px"}}>
							<Button size="sm" variant="info" onClick={this.addClick} /*
							 * disabled={this.state.allCustomer.length
							 * ===
							 * this.state.customerTemp.length ?
							 * true :
							 * false}
							 */
							disabled={this.state.customerCode !== "" || this.state.purchasingManagers !== ""  ? false : true}>
							<FontAwesomeIcon icon={faPlusCircle} />追加</Button>
							</div>
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
					<Row>
						<Col sm={6}>
							<Button size="sm" variant="info" name="clickButton" onClick={this.selectAllLists}
								disabled={0 !== this.state.allCustomer.length ? false : true}
							><FontAwesomeIcon icon={faListOl} />すべて選択</Button>{" "}
							<Button size="sm" onClick={this.shuseiTo.bind(this,"sendLettersConfirm")} variant="info" name="clickButton" hidden={(this.state.backPage !== "" && this.state.backPage !== "manageSituation") ? true : false} disabled={(this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true) || (this.state.backPage !== "" && this.state.backPage !== "manageSituation") ? true : false}><FontAwesomeIcon icon={faEnvelope} />要員送信</Button>{' '}
							
							<Button size="sm" onClick={this.shuseiTo.bind(this,"sendLettersMatter")} variant="info" name="clickButton" hidden={(this.state.backPage !== "" && this.state.backPage !== "projectInfoSearch") ? true : false} disabled={(this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true) || (this.state.backPage !== "" && this.state.backPage !== "projectInfoSearch") ? true : false}><FontAwesomeIcon icon={faEnvelope} />案件送信</Button>{' '}
                            <Button size="sm" onClick={this.shuseiTo.bind(this, "update")} disabled={this.state.selectetRowIds.length !== 1 ? true : false} variant="info"><FontAwesomeIcon icon={faEdit} />お客様情報</Button>{' '}
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
									onClick={this.addNewList} disabled={(this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true) || !(this.state.storageListName === null || this.state.storageListName === "") ? true : false}><FontAwesomeIcon icon={faEdit} />リスト作成</Button>{' '}
								{/*
									 * <Button size="sm" variant="info"
									 * name="clickButton"
									 * onClick={this.clearLists}
									 * disabled={!this.state.sendLetterBtnFlag ?
									 * false : true}><FontAwesomeIcon
									 * icon={faBroom} />クリア</Button>{' '}
									 */}
								<Button size="sm" variant="info" name="clickButton"
									onClick={!this.state.sendLetterBtnFlag ? this.clearLists : this.deleteLists} disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true}><FontAwesomeIcon icon={faMinusCircle} />削除</Button>	
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
							<TableHeaderColumn width='6%' dataField='any' dataFormat={this.indexN} autoValue editable={false}>番号</TableHeaderColumn>
							<TableHeaderColumn width='11%' dataField='customerNo' hidden isKey>お客様番号</TableHeaderColumn>
							<TableHeaderColumn width='22%' dataField='customerName' dataFormat={this.customerNameFormat.bind(this)}>お客様名</TableHeaderColumn>
							<TableHeaderColumn width='9%' dataField='purchasingManagers'>担当者</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='customerDepartmentCode' dataFormat={this.customerDepartmentNameFormat} hidden>部門</TableHeaderColumn>
							<TableHeaderColumn width='9%' dataField='positionCode' dataFormat={this.positionNameFormat}>職位</TableHeaderColumn>
							<TableHeaderColumn width='25%' dataField='mailList' dataFormat={this.mailListFormat.bind(this)}>メール</TableHeaderColumn>
							<TableHeaderColumn width='25%' dataField='purchasingManagersMail' hidden></TableHeaderColumn>
							<TableHeaderColumn width='11%' dataField='levelCode' hidden >ランキング</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='businessCount' dataFormat={this.businessCountFormat}>取引数</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='salesPersonsAppend' dataFormat={this.CellFormatter.bind(this)}>担当追加</TableHeaderColumn>
							<TableHeaderColumn width='11%' dataField='monthMailCount'>月送信回数</TableHeaderColumn>
							<TableHeaderColumn dataField='rowId' hidden={true} >ID</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</Row>
			</div>
		);
	}
}
export default salesSendLetter;
