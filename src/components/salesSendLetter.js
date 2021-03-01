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
		customerName: '', // おきゃく名前
		// customers: store.getState().dropDown[15],// 全部お客様 dropDowm用
		customers: store.getState().dropDown[53].slice(1),
		storageList: store.getState().dropDown[63].slice(1),
		personInCharge: store.getState().dropDown[64].slice(1),
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
		backPage: "manageSituation",
		searchFlag: true,
		sendValue: {},
		projectNo:'',
		selectedCustomers: '',
		isHidden:true,
		addCustomerCode: "",
	};
	
	componentDidMount() {
		if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
			this.setState({
				sendValue: this.props.location.state.sendValue,
				projectNo: this.props.location.state.projectNo,
				isHidden:false,
			})
			if(this.props.location.state.salesPersons === null || this.props.location.state.salesPersons === undefined || this.props.location.state.salesPersons === '' ||
				this.props.location.state.targetCusInfos === null || this.props.location.state.targetCusInfos === undefined || this.props.location.state.targetCusInfos === ''){
					this.setState({
						backPage: this.props.location.state.backPage,
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
		}
		this.getCustomers();
		this.getLists();
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
	getCustomers = () => {
		axios.post(this.state.serverIP + "salesSendLetters/getCustomers")
			.then(result => {
				let customerNoArray = new Array();
				for (let i in result.data) {
					customerNoArray.push(result.data[i].customerNo);
				}
				this.setState({
					allCustomer: result.data,
					customerTemp: [...result.data],
					allCustomerNo: customerNoArray,
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
					axios.post(this.state.serverIP + "salesSendLetters/getCustomersByNos", { ctmNos: values.code.split(',') })
					.then(result => {
				this.setState({
					allCustomer: result.data,
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
						sendLetterBtnFlag: true,
					})
					this.refs.customersTable.store.selected = [];
					this.refs.customersTable.setState({
						selectedRowKeys: [],
					})
				})

		} else {
			this.setState({
				allCustomer: [],
				sendLetterBtnFlag: true,
			})
			this.refs.customersTable.store.selected = [];
			this.refs.customersTable.setState({
				selectedRowKeys: [],
			})
		}
	}
	
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

	createList = () => {
		let { selectetRowIds, customerTemp, listName } = this.state;
		let selectedArray = new Array();
		for (let i in selectetRowIds) {
			selectedArray.push(customerTemp.find(v => v.rowId === selectetRowIds[i]));
		}
		let name = `送信対象${listName}`;
		let selectedNoArray = new Array();
		for (let i in selectedArray) {
			selectedNoArray.push(selectedArray[i].customerNo);
		}
		let code = selectedNoArray.join(',');
		axios.post(this.state.serverIP + "salesSendLetters/creatList", { name, code })
			.then(result => {
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
		axios.post(this.state.serverIP + "salesSendLetters/addNewList", { code:String(this.refs.customersTable.state.selectedRowKeys) })
		.then(result => {
			let newStorageListArray = this.state.storageList;
			let storageListTemp = {name:result.data,code:String(this.refs.customersTable.state.selectedRowKeys)};
			newStorageListArray.push(storageListTemp);
			this.setState({
				storageList: newStorageListArray,
				storageListName: result.data,
				storageListNameChange: result.data,
			})
		})
		axios.post(this.state.serverIP + "salesSendLetters/getCustomersByNos", { ctmNos: String(this.refs.customersTable.state.selectedRowKeys).split(',') })
				.then(result => {
					this.setState({
						allCustomer: result.data,
					});
				})
				.catch(function (err) {
					alert(err)
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
		if (this.state.storageListName !== '') {

		}
		else{
			
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
		this.setState({"errorsMessageShow": false });
		var allCustomerData = this.state.allCustomer;
		for (let k in allCustomerData) {
			if(allCustomerData[k].customerNo === this.state.addCustomerCode){
				this.setState({"errorsMessageShow": true });
				setTimeout(() => this.setState({ "errorsMessageShow": false }), 2000);
				return;
			}
		}
		if(this.state.storageListName === null || this.state.storageListName === ""){
			axios.post(this.state.serverIP + "salesSendLetters/getSalesCustomerByNo", { customerNo:this.state.addCustomerCode })
			.then(result => {
				var allCustomerModel = {};
				if(allCustomerData.length > 0){
					allCustomerModel["any"] = parseInt(allCustomerData[allCustomerData.length - 1].any) + 1;
				}else{
					allCustomerModel["any"] = 1;
				}
				allCustomerModel["customerNo"] = result.data[0].customerNo;
				allCustomerModel["customerName"] = result.data[0].customerName;
				allCustomerModel["purchasingManagers"] = result.data[0].purchasingManagers;
				allCustomerModel["customerDepartmentCode"] = result.data[0].customerDepartmentCode;
				allCustomerModel["positionCode"] = result.data[0].positionCode;
				allCustomerModel["purchasingManagersMail"] = result.data[0].purchasingManagersMail;
				allCustomerModel["levelCode"] = result.data[0].levelCode;
				allCustomerModel["monthCount"] = "";
				allCustomerModel["salesPersonsAppend"] = "";
				allCustomerModel["monthMailCount"] = "";
				allCustomerData.push(allCustomerModel);
				var currentPage = Math.ceil(allCustomerData.length / 10);
				this.setState({
					allCustomer: allCustomerData,
					currentPage: currentPage,
					purchasingManagers: '',
					customerCode: '',
				})
				this.refs.customersTable.setState({
					selectedRowKeys: []
				});
			})	
		}
		else{
			axios.post(this.state.serverIP + "salesSendLetters/customerListUpdate", 
					{
						storageListName:this.state.storageListName,
						customerList:this.state.addCustomerCode
					})
			.then(result => {
				axios.post(this.state.serverIP + "salesSendLetters/getCustomersByNos", { ctmNos: result.data.split(',') })
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
					});
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
							allCustomer: this.state.allCustomer.concat(customerInfo[k]).sort(function (a, b) {
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
		let rowNo = row.rowId;
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
		this.state.customerTemp[row.rowId].purchasingManagers2 = appendPersonMsg.purchasingManagers2;
		this.state.customerTemp[row.rowId].positionCode2 = appendPersonMsg.positionCode2;
		this.state.customerTemp[row.rowId].purchasingManagersMail2 = appendPersonMsg.purchasingManagersMail2;
		this.setState({
			daiologShowFlag: false,
		});
		this.CellFormatter(row.salesPersonsAppend, row);
	}
	changeName = () => {
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
		var salesSendLettersListNames = {
				storageListName: this.state.storageListNameChange
			};
		axios.post(this.state.serverIP + "salesSendLetters/deleteList", salesSendLettersListNames)
				.then(result => {
	                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
	                    this.setState({ "myToastShow": true, "type": "success", message: "処理成功" });
	                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						store.dispatch({type:"UPDATE_STATE",dropName:"getStorageListName"});
						window.location.reload();
	                } else {
	                    this.setState({errorsMessageValue: result.data.errorsMessage });
	                }
				})
				.catch(function (err) {
					alert(err)
				})
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
		axios.post(this.state.serverIP + "salesSendLetters/getCustomersByNos", { ctmNos: selectedNos.split(',') })
			.then(result => {
				this.setState({
					allCustomer: result.data,
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
			state: { searchFlag: this.state.searchFlag, sendValue: this.state.sendValue , selectedProjectNo:this.state.projectNo},
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
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={"お客様は存在しています、チェックしてください。"} type={"danger"} />
				</div>
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
				<br />
				<Form onSubmit={this.savealesSituation}>
					<Form.Group>
						<Row>
							{/*
								 * <Col sm={2}> <InputGroup size="sm"
								 * className="mb-3"> <InputGroup.Prepend>
								 * <InputGroup.Text
								 * id="inputGroup-sizing-sm">お客様番号</InputGroup.Text>
								 * </InputGroup.Prepend> <Autocomplete
								 * disabled={this.state.allCustomer.length ===
								 * this.state.customerTemp.length ? true :
								 * false} options={this.state.customers}
								 * getOptionLabel={(option) => option.code ?
								 * option.code : ""}
								 * value={this.state.customers.find(v => v.code
								 * === this.state.customerCode) || ""}
								 * onChange={(event, values) =>
								 * this.onTagsChange(event, values,
								 * 'customerCode')} renderInput={(params) => (
								 * <div ref={params.InputProps.ref}> <input
								 * type="text" {...params.inputProps}
								 * id="customerCode" className="auto
								 * form-control Autocompletestyle-salesSend" />
								 * </div> )} /> </InputGroup> </Col> <Col
								 * sm={2}> <InputGroup size="sm"
								 * className="mb-3"> <InputGroup.Prepend>
								 * <InputGroup.Text
								 * id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
								 * </InputGroup.Prepend> <Autocomplete
								 * disabled={this.state.allCustomer.length ===
								 * this.state.customerTemp.length ? true :
								 * false} options={this.state.customers}
								 * getOptionLabel={(option) => option.name ?
								 * option.name : ""}
								 * value={this.state.customers.find(v => v.code
								 * === this.state.customerCode) || ""}
								 * onChange={(event, values) =>
								 * this.onTagsChange(event, values,
								 * 'customerName')} renderInput={(params) => (
								 * <div ref={params.InputProps.ref}> <input
								 * type="text" {...params.inputProps}
								 * id="customerCode" className="auto
								 * form-control Autocompletestyle-salesSend" />
								 * </div> )} /> </InputGroup> </Col>
								 */}
							<Col sm={7}>
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
												id="customerCode" className="auto form-control Autocompletestyle-salesSend-customers"
												 />
										</div>
									)}
								/>
									{/*
										 * <InputGroup.Prepend> <InputGroup.Text
										 * id="twoKanji">部門</InputGroup.Text>
										 * </InputGroup.Prepend> <Autocomplete
										 * disabled={this.state.allCustomer.length
										 * === this.state.customerTemp.length ?
										 * true : false}
										 * options={this.state.customerDepartmentNameDrop}
										 * getOptionLabel={(option) =>
										 * option.name ? option.name : ""}
										 * value={this.state.customerDepartmentNameDrop.find(v =>
										 * v.code ===
										 * this.state.customerDepartmentCode) ||
										 * ""} onChange={(event, values) =>
										 * this.onTagsChange(event, values,
										 * 'customerDepartmentCode')}
										 * renderInput={(params) => ( <div
										 * ref={params.InputProps.ref}> <input
										 * type="text" {...params.inputProps}
										 * id="customerDepartmentName"
										 * className="auto form-control
										 * Autocompletestyle-salesSend" />
										 * </div> )} />
										 */}
								<InputGroup.Prepend>
									<InputGroup.Text id="sanKanji">担当者</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
								disabled={this.state.allCustomer.length === this.state.customerTemp.length ? true : false}
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
								<Button size="sm" variant="info" onClick={this.addClick} /*
																							 * disabled={this.state.allCustomer.length
																							 * ===
																							 * this.state.customerTemp.length ?
																							 * true :
																							 * false}
																							 */
								disabled={this.state.customerCode !== "" || this.state.purchasingManagers !== ""  ? false : true}>
									<FontAwesomeIcon icon={faPlusCircle} />追加</Button>
									</InputGroup>
							</Col>

							{/*
								 * <Col sm={5} style={{ "display":
								 * this.state.salesLists.length >= 1 ? "block" :
								 * "none" }}> <InputGroup size="sm"
								 * className="mb-3" style={{ position:
								 * 'relative' }}> <div style={{ "display":
								 * this.state.listShowFlag ? "contents" : "none"
								 * }}> 格納リスト： <Button size="sm" variant="info"
								 * onClick={this.showSelectedCtms.bind(this,
								 * this.state.selectedCtmNoStrs1, '1')} style={{
								 * "display": this.state.salesLists.length >= 1 ?
								 * "block" : "none" }}> <FontAwesomeIcon
								 * icon={faBookmark}
								 * />{this.state.salesLists.length >= 1 ? ' ' +
								 * this.state.listName1 : ''}</Button>{' '}
								 * <Button size="sm" variant="info"
								 * onClick={this.showSelectedCtms.bind(this,
								 * this.state.selectedCtmNoStrs2, '2')} style={{
								 * "display": this.state.salesLists.length >= 2 ?
								 * "block" : "none" }}> <FontAwesomeIcon
								 * icon={faBookmark}
								 * />{this.state.salesLists.length >= 2 ? ' ' +
								 * this.state.listName2 : ''}</Button>{' '}
								 * <Button size="sm" variant="info"
								 * onClick={this.showSelectedCtms.bind(this,
								 * this.state.selectedCtmNoStrs3, '3')} style={{
								 * "display": this.state.salesLists.length >= 3 ?
								 * "block" : "none" }}> <FontAwesomeIcon
								 * icon={faBookmark}
								 * />{this.state.salesLists.length >= 3 ? ' ' +
								 * this.state.listName3 : ''}</Button> </div>
								 * <span style={{ "display":
								 * !this.state.listShowFlag ? "contents" :
								 * "none" }}>格納リスト： <FormControl
								 * autoComplete="off"
								 * value={this.state.listName1}
								 * disabled={this.state.salesLists.length >= 1 ?
								 * false : true} size="sm" name="listName1"
								 * style={{ width: "85px" }}
								 * onChange={this.changeListName} />
								 * <FormControl autoComplete="off"
								 * value={this.state.listName2} size="sm"
								 * name="listName2" style={{ width: "85px",
								 * "display": this.state.salesLists.length >= 2 ?
								 * "block" : "none" }}
								 * onChange={this.changeListName} />
								 * <FormControl autoComplete="off"
								 * value={this.state.listName3} size="sm"
								 * name="listName3" style={{ width: "85px",
								 * "display": this.state.salesLists.length >= 3 ?
								 * "block" : "none" }}
								 * onChange={this.changeListName} />{' '}</span>
								 * <Button style={{ position: 'absolute', right:
								 * '0px' }} size="sm" variant="info"
								 * onClick={this.changeName}><FontAwesomeIcon
								 * icon={faPencilAlt} />{this.state.listShowFlag ?
								 * '対象名修正' : '対象名更新'}</Button> </InputGroup>
								 * </Col>
								 */}
							<Col sm={5}>
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
								<Form.Control placeholder="データ修正" id="storageListNameChange" name="storageListNameChange" value={this.state.storageListNameChange}
                                onChange={this.valueChange} className="auto form-control Autocompletestyle-salesSend-changeStorageList" />
								<Button style={{ marginLeft: "5px", marginRight: "5px" }} size="sm" variant="info" onClick={this.changeName}><FontAwesomeIcon icon={faPencilAlt} />更新</Button>
								<Button size="sm" variant="info" onClick={this.deleteList}><FontAwesomeIcon icon={faMinusCircle} />削除</Button>
							</InputGroup>
						</Col>
						</Row>
					</Form.Group>
					<Row>
						<Col sm={2}>
							<Button size="sm" variant="info" name="clickButton" onClick={this.selectAllLists}
								disabled={0 !== this.state.allCustomer.length ? false : true}
							><FontAwesomeIcon icon={faListOl} />すべて選択</Button>{" "}
							<Button
								size="sm"
								hidden={this.state.isHidden ? true : false}
								variant="info"
								onClick={this.back.bind(this)}
							>
								<FontAwesomeIcon icon={faLevelUpAlt} />戻る
                            </Button>
						</Col>
						<Col sm={4}>

						</Col>
						<Col sm={6}>
							<div style={{ "float": "right" }}>
								<Button size="sm" variant="info" name="clickButton"
									onClick={this.addNewList} disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true}><FontAwesomeIcon icon={faEdit} />リスト作成</Button>{' '}
								{/*
									 * <Button size="sm" variant="info"
									 * name="clickButton"
									 * onClick={this.clearLists}
									 * disabled={!this.state.sendLetterBtnFlag ?
									 * false : true}><FontAwesomeIcon
									 * icon={faBroom} />クリア</Button>{' '}
									 */}
								<Button size="sm" variant="info" name="clickButton"
									onClick={!this.state.sendLetterBtnFlag ? this.clearLists : this.deleteLists} disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true}><FontAwesomeIcon icon={faMinusCircle} />削除</Button>{' '}

										<Button size="sm" onClick={this.shuseiTo.bind(this,"sendLettersConfirm")} variant="info" name="clickButton" disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true}><FontAwesomeIcon icon={faEnvelope} />要員送信</Button>{' '}
										
										<Button size="sm" onClick={this.shuseiTo.bind(this,"sendLettersConfirm")} variant="info" name="clickButton" disabled={this.state.selectetRowIds.length !== 0 || !this.state.sendLetterBtnFlag ? false : true}><FontAwesomeIcon icon={faEnvelope} />案件送信</Button>
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
							<TableHeaderColumn width='8%' dataField='any' dataFormat={this.indexN} autoValue dataSort={true} editable={false}>番号</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='customerNo' isKey>お客様番号</TableHeaderColumn>
							<TableHeaderColumn width='10%' dataField='customerName' dataFormat={this.customerNameFormat}>お客様名</TableHeaderColumn>
							<TableHeaderColumn width='7%' dataField='purchasingManagers'>担当者</TableHeaderColumn>
							<TableHeaderColumn width='7%' dataField='customerDepartmentCode' dataFormat={this.customerDepartmentNameFormat}>所属</TableHeaderColumn>
							<TableHeaderColumn width='7%' dataField='positionCode' dataFormat={this.positionNameFormat}>職位</TableHeaderColumn>
							<TableHeaderColumn width='15%' dataField='purchasingManagersMail' >メール</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='levelCode' >ランキング</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='monthCount' >取引数(今月)</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='salesPersonsAppend' dataFormat={this.CellFormatter.bind(this)}>担当追加</TableHeaderColumn>
							<TableHeaderColumn width='12%' dataField='monthMailCount'>月送信回数</TableHeaderColumn>
							<TableHeaderColumn dataField='rowId' hidden={true} >ID</TableHeaderColumn>
						</BootstrapTable>
					</Col>
				</Row>
			</div>
		);
	}
}
export default salesSendLetter;
