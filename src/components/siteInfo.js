import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faTrash, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import ja from 'date-fns/locale/ja';
import '../asserts/css/style.css';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
axios.defaults.withCredentials = true;
registerLocale('ja', ja);

/* 
  現場情報
 */
class siteInfo extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}
	initialState = {
		workStateFlag: true,
		payOffRange1: '0',
		payOffRange2: '0',
		workState: '0',
		employeeName: '',
		myToastShow: false,
		message: '',
		workDate: '',
		employeeNo: '',
		currPage: '',
		errorsMessageShow: false,
		updateFlag: true,//修正登録状態フラグ
		disabledFlag: true,//活性非活性フラグ
		deleteFlag: true,//活性非活性フラグ
		dailyCalculationStatusFlag: true,//日割フラグ
		dailyCalculationStatus: false,
		payOffRangeStatus: store.getState().dropDown[33].slice(1),//　精算時間
		siteMaster: store.getState().dropDown[34],//　役割
		customerMaster: store.getState().dropDown[15].slice(1),//お客様
		topCustomerMaster: store.getState().dropDown[35].slice(1),//トップお客様
		developLanguageMaster: store.getState().dropDown[8].slice(1),//開発言語
		employeeInfo: store.getState().dropDown[9].slice(1),//社員名
		typeOfIndustryMaster: store.getState().dropDown[36].slice(1),//業種
		getstations: store.getState().dropDown[14].slice(1),//　場所 
		levelMaster: store.getState().dropDown[18],//　レベル
		siteStateStatus: store.getState().dropDown[40].slice(1),//現場状態\
		backPage: "",
		searchFlag: false,
		sendValue: [],
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};

	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	onchangeworkState = event => {
		if (event.target.value === '0') {
			this.setState({
				workStateFlag: true,
				levelCode: '',
				[event.target.name]: event.target.value
			})
		} else {
			this.setState({
				workStateFlag: false,
				[event.target.name]: event.target.value
			})
		}
	}
	onchangeSiteRoleCode = event => {
		if (event.target.value === '1' || event.target.value === '0') {
			this.setState({
				relatedEmployeesFlag: true,
				[event.target.name]: event.target.value
			})
		} else {
			this.setState({
				relatedEmployeesFlag: false,
				related1Employees: '',
				related2Employees: '',
				related3Employees: '',
				related4Employees: '',
				[event.target.name]: event.target.value
			})
		}
	}
	state = {
		admissionStartDate: new Date(),
		admissionEndDate: new Date()
	}
	//　入場年月
	admissionStartDate = (date) => {
		this.setState({
			admissionStartDate: date,
			time: publicUtils.getFullYearMonth(date, new Date()),
		});
		if (date !== null) {
			if (date.getDate() > 2) {
				this.setState({
					dailyCalculationStatusFlag: false
				});
			} else {
				if (this.state.admissionEndDate !== '' && this.state.admissionEndDate !== undefined) {
					if (new Date(this.state.admissionEndDate.getFullYear(), this.state.admissionEndDate.getMonth() + 1, 0).getDate() - this.state.admissionEndDate.getDate() > 2) {
						this.setState({
							dailyCalculationStatusFlag: false
						});
					} else {
						this.setState({
							dailyCalculationStatusFlag: true
						});
					}
				}
			}
		} else {
			if (this.state.admissionEndDate !== '' && this.state.admissionEndDate !== undefined) {
				if (new Date(this.state.admissionEndDate.getFullYear(), this.state.admissionEndDate.getMonth() + 1, 0).getDate() - this.state.admissionEndDate.getDate() > 2) {
					this.setState({
						dailyCalculationStatusFlag: false
					});
				} else {
					this.setState({
						dailyCalculationStatusFlag: true
					});
				}
			} else {
				this.setState({
					dailyCalculationStatusFlag: true
				});
			}
		}
	};
	//　退場年月
	admissionEndDate = (date) => {
		this.setState(
			{
				admissionEndDate: date,
			}
		);
		if (date !== null) {
			if (new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() - date.getDate() > 2) {
				this.setState({
					dailyCalculationStatusFlag: false
				});
			} else {
				if (this.state.admissionStartDate !== '' && this.state.admissionStartDate !== undefined) {
					if (this.state.admissionStartDate.getDate() > 2) {
						this.setState({
							dailyCalculationStatusFlag: false
						});
					} else {
						this.setState({
							dailyCalculationStatusFlag: true
						});
					}
				}
			}
		} else {
			if (this.state.admissionStartDate !== '' && this.state.admissionStartDate !== undefined) {
				if (this.state.admissionStartDate.getDate() > 2) {
					this.setState({
						dailyCalculationStatusFlag: false
					});
				} else {
					this.setState({
						dailyCalculationStatusFlag: true
					});
				}
			} else {
				this.setState({
					dailyCalculationStatusFlag: true
				});
			}
		}
	};

	dailyCalculationStatusChange = () => {
		this.setState(
			{
				dailyCalculationStatus: !this.state.dailyCalculationStatus,
			}
		);
	}

	// 页面加载
	componentDidMount() {
		console.log(this.props.location);
		if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
			let employeeNo = this.props.location.state.employeeNo
			this.setState({
				backPage: this.props.location.state.backPage,
				sendValue: this.props.location.state.sendValue,
				searchFlag: this.props.location.state.searchFlag,
			})
			if (this.props.location.state.currPage !== null && this.props.location.state.currPage !== undefined && this.props.location.state.currPage !== '') {
				this.setState({
					currPage: this.props.location.state.currPage,
					employeeNo: this.props.location.state.employeeNo,
				})
			}
			axios.post(this.state.serverIP + "getSiteInfo", { employeeName: employeeNo })
				.then(response => {
					if (response.data.errorsMessage === null || response.data.errorsMessage === undefined) {
						this.setState({
							siteData: response.data.siteList,
							employeeName: publicUtils.valueGetLabel(employeeNo, this.state.employeeInfo),
							disabledFlag: false,
						});
					}else{
						this.setState({ errorsMessageShow: true, errorsMessageValue: response.data.errorsMessage});
						this.setState({
							employeeName: publicUtils.valueGetLabel(employeeNo, this.state.employeeInfo),
							siteData:[],
							disabledFlag: false,
						});
						setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
					}
				}).catch((error) => {
					console.error("Error - " + error);
				});
		}
	}
	//reset
	reset = () => {
		this.setState(() => this.resetStates);
	};
	//リセット　reset
	resetStates = {
		admissionStartDate: '',
		time: '',
		admissionEndDate: '',
		systemName: '',
		location: '',
		customerNo: '',
		workState: '0',
		topCustomerNo: '',
		developLanguageCode: '',
		unitPrice: '',
		payOffRange1: '0',
		payOffRange2: '0',
		siteRoleCode: '',
		levelCode: '',
		siteManager: '',
		typeOfIndustryCode: '',
		remark: '',
		related1Employees: '',
		related2Employees: '',
		related3Employees: '',
		related4Employees: '',
		workState: '0',
		dailyCalculationStatus: false,
		dailyCalculationStatusFlag: true
	};

	// AUTOSELECT select事件
	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
			if (fieldName === 'employeeName') {
				this.setState({
					siteData: [],
				})
			}
		} else {
			if (this.state.customerMaster.find((v) => (v.name === value)) !== undefined ||
				this.state.topCustomerMaster.find((v) => (v.name === value)) !== undefined ||
				this.state.getstations.find((v) => (v.name === value)) !== undefined ||
				this.state.typeOfIndustryMaster.find((v) => (v.name === value)) !== undefined ||
				this.state.developLanguageMaster.find((v) => (v.name === value)) !== undefined ||
				this.state.employeeInfo.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'employeeName':
						axios.post(this.state.serverIP + "getSiteInfo", { employeeName: publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo) })
							.then(response => {
								if (response.data.errorsMessage === null || response.data.errorsMessage === undefined) {
									this.setState({
										siteData: response.data.siteList,
										employeeName: value,
										disabledFlag: false,
									});
								}else{
									this.setState({ errorsMessageShow: true, errorsMessageValue: response.data.errorsMessage});
									this.setState({
										employeeName: value,
										siteData:[],
										disabledFlag: false,
									});
									setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
								}
							}).catch((error) => {
								console.error("Error - " + error);
							});
						break;
					case 'customerNo':
						this.setState({
							customerNo: value,
						})
						break;
					case 'topCustomerNo':
						this.setState({
							topCustomerNo: value,
						})
						break;
					case 'location':
						this.setState({
							location: value,
						})
						break;
					case 'typeOfIndustryCode':
						this.setState({
							typeOfIndustryCode: value,
						})
						break;
					case 'developLanguageCode':
						this.setState({
							developLanguageCode: value,
						})
						break;
					default:
				}
			}
		}
	};
	// レコードselect事件
	handleRowSelect = (row, isSelected) => {
		if (isSelected) {
			if (row.workDate === this.state.siteData[this.state.siteData.length - 1].workDate) {
				this.setState({
					admissionStartDate: row.admissionStartDate === null ? '' : new Date(publicUtils.converToLocalTime(row.admissionStartDate, true)),
					time: publicUtils.getFullYearMonth(new Date(publicUtils.converToLocalTime(row.admissionStartDate, true)), new Date()),
					admissionEndDate: row.admissionEndDate === null ? '' : new Date(publicUtils.converToLocalTime(row.admissionEndDate, true)),
					workState: row.workState === null ? '' : row.workState,
					dailyCalculationStatus: row.dailyCalculationStatus === '0' ? true : false,
					systemName: row.systemName === null ? '' : row.systemName,
					location: row.location === null ? '' : row.location,
					customerNo: row.customerName === null ? '' : row.customerName,
					topCustomerNo: row.topCustomerName === null ? '' : row.topCustomerName,
					developLanguageCode: row.developLanguageName === null ? '' : row.developLanguageName,
					unitPrice: row.unitPrice === null ? '' : row.unitPrice,
					payOffRange1: row.payOffRange1 === null ? '' : row.payOffRange1,
					payOffRange2: row.payOffRange2 === null ? '' : row.payOffRange2,
					siteRoleCode: row.siteRoleName === null ? '' : row.siteRoleCode,
					levelCode: row.levelName === null ? '' : row.levelCode,
					siteManager: row.siteManager === null ? '' : row.siteManager,
					typeOfIndustryCode: row.typeOfIndustryName === null ? '' : row.typeOfIndustryName,
					remark: row.remark === null ? '' : row.remark,
					related1Employees: (row.relatedEmployees === null ? '' : publicUtils.textGetValue(row.relatedEmployees.split(",")[0], this.state.employeeInfo)),
					related2Employees: (row.relatedEmployees === null ? '' : row.relatedEmployees.split(",")[1] === undefined ? '' : publicUtils.textGetValue(row.relatedEmployees.split(",")[1], this.state.employeeInfo)),
					related3Employees: (row.relatedEmployees === null ? '' : row.relatedEmployees.split(",")[2] === undefined ? '' : publicUtils.textGetValue(row.relatedEmployees.split(",")[2], this.state.employeeInfo)),
					related4Employees: (row.relatedEmployees === null ? '' : row.relatedEmployees.split(",")[3] === undefined ? '' : publicUtils.textGetValue(row.relatedEmployees.split(",")[3], this.state.employeeInfo)),
					updateFlag: false,
					disabledFlag: false,
					deleteFlag: false,
					relatedEmployeesFlag: row.siteRoleCode === "0" ? true : row.siteRoleCode === "1" ? true : false,
					workDate: row.workDate,
				});
				if (publicUtils.converToLocalTime(row.admissionStartDate, true).getDate() > 2 ) {
					this.setState({
						dailyCalculationStatusFlag: false,
						deleteFlag: false,
					});
				}else if(row.admissionEndDate !== null && row.admissionEndDate !== undefined){
					if(new Date(publicUtils.converToLocalTime(row.admissionEndDate, true).getFullYear(), publicUtils.converToLocalTime(row.admissionEndDate, true).getMonth() + 1, 0).getDate() - publicUtils.converToLocalTime(row.admissionEndDate, true).getDate() > 2){
						this.setState({
							dailyCalculationStatusFlag: false,
							deleteFlag: false,
						});
					}
				}
			} else {
				this.setState(() => this.resetStates);
				this.setState({
					updateFlag: true,
					disabledFlag: false
				})
			}
		} else {
			this.setState(() => this.resetStates);
			this.setState({
				updateFlag: true,
				disabledFlag: false,
				deleteFlag: true,
				relatedEmployeesFlag: false,
				workDate: '',
			})
		}
	}
	//登録処理
	tokuro = () => {
		var siteModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function (i, item) {
			siteModel[item.name] = item.value;
		});
		siteModel["related1Employees"] = publicUtils.valueGetText(this.state.related1Employees, this.state.employeeInfo);
		siteModel["related2Employees"] = publicUtils.valueGetText(this.state.related2Employees, this.state.employeeInfo);
		siteModel["related3Employees"] = publicUtils.valueGetText(this.state.related3Employees, this.state.employeeInfo);
		siteModel["related4Employees"] = publicUtils.valueGetText(this.state.related4Employees, this.state.employeeInfo);
		siteModel["customerNo"] = publicUtils.labelGetValue($("#customerNo").val(), this.state.customerMaster)
		siteModel["topCustomerNo"] = publicUtils.labelGetValue($("#topCustomerNo").val(), this.state.topCustomerMaster)
		siteModel["developLanguageCode"] = publicUtils.labelGetValue($("#developLanguageCode").val(), this.state.developLanguageMaster)
		siteModel["employeeNo"] = publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo)
		siteModel["location"] = publicUtils.labelGetValue($("#location").val(), this.state.getstations)
		siteModel["typeOfIndustryCode"] = publicUtils.labelGetValue($("#typeOfIndustryCode").val(), this.state.typeOfIndustryMaster)
		if (this.state.siteData.length > 0) {
			siteModel["checkDate"] = this.state.siteData[this.state.siteData.length - 1].admissionEndDate
		} else {
			siteModel["checkDate"] = "1";
		}
		axios.post(this.state.serverIP + "insertSiteInfo", siteModel)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "post", message: "登録成功", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					this.refs.table.setState({
						selectedRowKeys: []
					});
					axios.post(this.state.serverIP + "getSiteInfo", { employeeName: publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo) })
						.then(response => {
							if (response.data.errorsMessage === null || response.data.errorsMessage === undefined) {
								this.setState({
									siteData: response.data.siteList,
								});
								// this.handleRowSelect();
								this.reset();
							}else{
								this.setState({ errorsMessageShow: true, errorsMessageValue: response.data.errorsMessage});
								setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
							}
						}).catch((error) => {
							console.error("Error - " + error);
						});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	}
	//修正処理
	update = () => {
		var siteModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function (i, item) {
			siteModel[item.name] = item.value;
		});
		siteModel["related1Employees"] = publicUtils.valueGetText(this.state.related1Employees, this.state.employeeInfo);
		siteModel["related2Employees"] = publicUtils.valueGetText(this.state.related2Employees, this.state.employeeInfo);
		siteModel["related3Employees"] = publicUtils.valueGetText(this.state.related3Employees, this.state.employeeInfo);
		siteModel["related4Employees"] = publicUtils.valueGetText(this.state.related4Employees, this.state.employeeInfo);
		siteModel["customerNo"] = publicUtils.labelGetValue($("#customerNo").val(), this.state.customerMaster)
		siteModel["topCustomerNo"] = publicUtils.labelGetValue($("#topCustomerNo").val(), this.state.topCustomerMaster)
		siteModel["developLanguageCode"] = publicUtils.labelGetValue($("#developLanguageCode").val(), this.state.developLanguageMaster)
		siteModel["employeeNo"] = publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo)
		siteModel["location"] = publicUtils.labelGetValue($("#location").val(), this.state.getstations)
		siteModel["typeOfIndustryCode"] = publicUtils.labelGetValue($("#typeOfIndustryCode").val(), this.state.typeOfIndustryMaster)
		if (this.state.siteData.length > 1) {
			siteModel["checkDate"] = this.state.siteData[this.state.siteData.length - 2].admissionEndDate
		} else {
			siteModel["checkDate"] = "1";
		}
		siteModel["workDate"] = this.state.siteData[this.state.siteData.length - 1].admissionStartDate
		axios.post(this.state.serverIP + "updateSiteInfo", siteModel)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "put", message: "修正成功", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					this.refs.table.setState({
						selectedRowKeys: []
					});
					axios.post(this.state.serverIP + "getSiteInfo", { employeeName: publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo) })
						.then(response => {
							if (response.data.errorsMessage === null || response.data.errorsMessage === undefined) {
								this.setState({
									siteData: response.data.siteList,
								});
								this.setState({
									updateFlag: true,
									disabledFlag: false
								})
								this.setState(() => this.resetStates);
							}else{
								this.setState({ errorsMessageShow: true, errorsMessageValue: response.data.errorsMessage});
								setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
							}
						}).catch((error) => {
							console.error("Error - " + error);
						});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	}
	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

	siteInfoeDelete = () => {
		//将id进行数据类型转换，强制转换为数字类型，方便下面进行判断。
		var a = window.confirm("削除していただきますか？");
		if (a) {
			$("#deleteBtn").click();
		}
	}
	//隠した削除ボタン
	createCustomDeleteButton = (onClick) => {
		return (
			<Button variant="info" id="deleteBtn" hidden onClick={onClick} >删除</Button>
		);
	}
	//隠した削除ボタンの実装
	onDeleteRow = (rows) => {
		var workDate = this.state.workDate;
		var siteData = this.state.siteData;
		for (let i = siteData.length - 1; i >= 0; i--) {
			if (siteData[i].workDate === workDate) {
				siteData.splice(i, 1);
			}
		}
		this.setState({
			siteData: siteData,
			rowNo: '',
			updateFlag:true,
		})
		axios.post(this.state.serverIP + "deleteSiteInfo", {
			employeeNo: publicUtils.labelGetValue($("#employeeName").val(), this.state.employeeInfo),
			admissionStartDate: publicUtils.formateDate(this.state.admissionStartDate, true),
		})
			.then(result => {
				if (result.data) {
					this.setState({ "myToastShow": true, message: "削除成功", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					this.refs.table.setState({
						selectedRowKeys: []
					});
					this.reset();
				} else {
					this.setState({ "myToastShow": true, "method": "success", message: "削除失敗", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				}
			})
			.catch(function (error) {
				alert("删除错误，请检查程序");
			});
	}
	//　　削除前のデフォルトお知らせの削除
	customConfirm(next, dropRowKeys) {
		const dropRowKeysStr = dropRowKeys.join(',');
		next();
	}

	/**
	 * 社員名連想
	 * @param {} event 
	 */
	getRelated1Employees = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let related1Employees = null;
			if (values !== null) {
				related1Employees = values.code;
			}
			this.setState({
				related1Employees: related1Employees,
			})
		})
	}
	getRelated2Employees = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let related2Employees = null;
			if (values !== null) {
				related2Employees = values.code;
			}
			this.setState({
				related2Employees: related2Employees,
			})
		})
	}
	getRelated3Employees = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let related3Employees = null;
			if (values !== null) {
				related3Employees = values.code;
			}
			this.setState({
				related3Employees: related3Employees,
			})
		})
	}
	getRelated4Employees = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let related4Employees = null;
			if (values !== null) {
				related4Employees = values.code;
			}
			this.setState({
				related4Employees: related4Employees,
			})
		})
	}
	/**
	 * 戻るボタン
	 */
	back = () => {
		var path = {};
		path = {
			pathname: this.state.backPage,
			state: {
				searchFlag: this.state.searchFlag,
				sendValue: this.state.sendValue,
				currPage: this.state.currPage,
				employeeNo: this.state.employeeNo,
			},
		}
		this.props.history.push(path);
	}
	render() {
		this.options = {
			page: 1,  // which page you want to show as default
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
			deleteBtn: this.createCustomDeleteButton,
			onDeleteRow: this.onDeleteRow,
			handleConfirmDeleteRow: this.customConfirm,

		};
		const { payOffRange1, payOffRange2, workState, siteData, siteRoleCode, levelCode, time, errorsMessageValue, systemName, unitPrice, related1Employees, related2Employees,
			related3Employees, related4Employees, remark, siteManager, workStateFlag, backPage } = this.state;		//テーブルの列の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,  // click to select, default is false
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		return (
			<div>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.message} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<div>
					<Form id="siteForm">
						<Form.Group>
							{/* <Row>
                    <Col sm={3}></Col>
                    <Col sm={7}> <img className="mb-4" alt="title" src={title}/> </Col>
                    </Row> */}
							<Row inline="true">
								<Col className="text-center">
									<h2>現場情報</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="employeeName"
											name="employeeName"
											options={this.state.employeeInfo}
											getOptionLabel={(option) => option.name}
											value={this.state.employeeInfo.find(v => v.name === this.state.employeeName) || {}}
											onSelect={(event) => this.handleTag(event, 'employeeName')}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto Autocompletestyle-siteInfo form-control"
													/>
												</div>
											)}
										/>
									</InputGroup>
								</Col>
							</Row>

							<Row>
								<Col sm={4}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="fiveKanji">入場年月日</InputGroup.Text>
										</InputGroup.Prepend>
										<InputGroup.Prepend>
											<DatePicker
												selected={this.state.admissionStartDate}
												onChange={this.admissionStartDate.bind(this)}
												dateFormat="yyyy/MM/dd"
												name="admissionStartDate"
												className="form-control form-control-sm"
												id="admissionStartDate"
												autoComplete="off"
												locale="ja"
												id={this.state.employeeName !== '' ? "admissionEndDate" : "siteDatePickerReadonlyDefault"}
												disabled={this.state.employeeName === '' ? true : false}
											/>
										</InputGroup.Prepend>
										<FormControl id="time" name="time" value={time} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
										<font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
									</InputGroup>
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">現場状態</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="workState" name="workState" value={workState}
											onChange={this.onchangeworkState} disabled={this.state.employeeName === '' ? true : false}>
											{this.state.siteStateStatus.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="fiveKanji">退場年月日</InputGroup.Text>
										</InputGroup.Prepend>
										<InputGroup.Prepend>
											<DatePicker
												selected={this.state.admissionEndDate}
												onChange={this.admissionEndDate.bind(this)}
												dateFormat="yyyy/MM/dd"
												name="admissionEndDate"
												className="form-control form-control-sm"
												id="admissionEndDate"
												locale="ja"
												autoComplete="off"
												id={this.state.workState !== "0" ? "admissionEndDate" : "siteDatePickerReadonlyDefault"}
												disabled={this.state.employeeName === '' ?  true : this.state.workState === "0" ? true : false}
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>

								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="fiveKanji">システム名</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="systemName" name="systemName" type="text" onChange={this.onchange} value={systemName} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
									</InputGroup>
								</Col>
							</Row>

							<Row>

								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="location"
											name="location"
											value={this.state.getstations.find(v => v.name === this.state.location) || {}}
											onSelect={(event) => this.handleTag(event, 'location')}
											options={this.state.getstations}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo"
													/>
												</div>
											)}
											disabled={this.state.employeeName === '' ? true : false}
										/>
									</InputGroup>

								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
											<Autocomplete
												id="customerNo"
												name="customerNo"
												options={this.state.customerMaster}
												getOptionLabel={(option) => option.name}
												value={this.state.customerMaster.find(v => v.name === this.state.customerNo) || {}}
												onSelect={(event) => this.handleTag(event, 'customerNo')}
												renderInput={(params) => (
													<div ref={params.InputProps.ref}>
														<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo"
														/>
													</div>
												)}
												disabled={this.state.employeeName === '' ? true : false}
											/><font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="sixKanji">トップお客様</InputGroup.Text>
											<Autocomplete
												id="topCustomerNo"
												name="topCustomerNo"
												value={this.state.topCustomerMaster.find(v => v.name === this.state.topCustomerNo) || {}}
												onSelect={(event) => this.handleTag(event, 'topCustomerNo')}
												options={this.state.topCustomerMaster}
												getOptionLabel={(option) => option.name}
												renderInput={(params) => (
													<div ref={params.InputProps.ref}>
														<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo"
														/>
													</div>
												)}
												disabled={this.state.employeeName === '' ? true : false}
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="developLanguageCode"
											name="developLanguageCode"
											value={this.state.developLanguageMaster.find(v => v.name === this.state.developLanguageCode) || {}}
											onSelect={(event) => this.handleTag(event, 'developLanguageCode')}
											options={this.state.developLanguageMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo"
														style={{ "backgroundColor": this.state.employeeName === '' ? "#e9ecef" : "" }} />
												</div>
											)}
											disabled={this.state.employeeName === '' ? true : false}
										/>
									</InputGroup>
								</Col>
							</Row>

							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">単価</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="unitPrice" name="unitPrice" type="text" onChange={this.onchange} value={unitPrice} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
										<InputGroup.Prepend>
											<InputGroup.Text className="cssNikanji">日割</InputGroup.Text>
											<InputGroup.Checkbox className="cssNikanji" name="dailyCalculationStatus" checked={this.state.dailyCalculationStatus} onChange={this.dailyCalculationStatusChange} disabled={this.state.dailyCalculationStatusFlag === true ? true : false} />
											<font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">精算</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select"
											onChange={this.onchange}
											id="payOffRange1" name="payOffRange1" value={payOffRange1}
											autoComplete="off" disabled={this.state.employeeName === '' ? true : false}>
											{this.state.payOffRangeStatus.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
										〜
											<Form.Control as="select"
											onChange={this.onchange}
											id="payOffRange2" name="payOffRange2" value={payOffRange1 === '0' ? '0' : payOffRange2}
											autoComplete="off" disabled={payOffRange1 === '0' ? true : false} >
											{this.state.payOffRangeStatus.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>

								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="siteRoleCode" name="siteRoleCode" onChange={this.onchangeSiteRoleCode} value={siteRoleCode} autoComplete="off" disabled={this.state.employeeName === '' ? true : false}>
											{this.state.siteMaster.map(date =>
												<option key={date.code} value={date.code}>
													{date.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">評価</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="levelCode" name="levelCode" onChange={this.onchange} value={levelCode} autoComplete="off" disabled={this.state.employeeName === '' || workStateFlag ? true : false}>
											{this.state.levelMaster.map(date =>
												<option key={date.code} value={date.code}>
													{date.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">責任者</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="siteManager" name="siteManager" type="text" onChange={this.onchange} value={siteManager} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
									</InputGroup>
								</Col>
							</Row>

							<Row>
								<Col sm={6}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">関連社員</InputGroup.Text>
										</InputGroup.Prepend>

										<Autocomplete
											id="employeeName"
											name="employeeName"
											value={this.state.employeeInfo.find(v => v.code === this.state.related1Employees) || ""}
											options={this.state.employeeInfo}
											getOptionLabel={(option) => option.text ? option.text : ""}
											disabled={this.state.relatedEmployeesFlag ? false : true}
											onChange={(event, values) => this.getRelated1Employees(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														<p >{option.name}</p>
													</React.Fragment>
												)
											}}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo-relatedEmployees"
													/>
												</div>
											)}
										/>
										<Autocomplete
											id="employeeName"
											name="employeeName"
											value={this.state.employeeInfo.find(v => v.code === this.state.related2Employees) || ""}
											options={this.state.employeeInfo}
											disabled={this.state.relatedEmployeesFlag ? false : true}
											getOptionLabel={(option) => option.text ? option.text : ""}
											onChange={(event, values) => this.getRelated2Employees(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														<p >{option.name}</p>
													</React.Fragment>
												)
											}}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo-relatedEmployees"
													/>
												</div>
											)}
										/>
										<Autocomplete
											id="employeeName"
											name="employeeName"
											value={this.state.employeeInfo.find(v => v.code === this.state.related3Employees) || ""}
											options={this.state.employeeInfo}
											disabled={this.state.relatedEmployeesFlag ? false : true}
											getOptionLabel={(option) => option.text ? option.text : ""}
											onChange={(event, values) => this.getRelated3Employees(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														<p >{option.name}</p>
													</React.Fragment>
												)
											}}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo-relatedEmployees"
													/>
												</div>
											)}
										/>

										<Autocomplete
											id="employeeName"
											name="employeeName"
											value={this.state.employeeInfo.find(v => v.code === this.state.related4Employees) || ""}
											options={this.state.employeeInfo}
											disabled={this.state.relatedEmployeesFlag ? false : true}
											getOptionLabel={(option) => option.text ? option.text : ""}
											onChange={(event, values) => this.getRelated4Employees(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														<p >{option.name}</p>
													</React.Fragment>
												)
											}}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo-relatedEmployees"
													/>
												</div>
											)}
										/>



									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">業種</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="typeOfIndustryCode"
											name="typeOfIndustryCode"
											value={this.state.typeOfIndustryMaster.find(v => v.name === this.state.typeOfIndustryCode) || {}}
											onSelect={(event) => this.handleTag(event, 'typeOfIndustryCode')}
											options={this.state.typeOfIndustryMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo"
													/>
												</div>
											)}
											disabled={this.state.employeeName === '' ? true : false}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="remark" name="remark" type="text" onChange={this.onchange} value={this.state.workState === '2' ? "単金調整" : remark} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={this.state.employeeName === '' ? true : false} />
									</InputGroup>
								</Col>
							</Row>

							<div style={{ "textAlign": "center" }}>
								<Button size="sm" onClick={this.state.updateFlag === true ? this.tokuro : this.update} variant="info" id="toroku" type="button" disabled={this.state.disabledFlag === true ? true : false}>
									<FontAwesomeIcon icon={faSave} /> {this.state.updateFlag === true ? '登録' : '修正'}
								</Button>{' '}
								<Button size="sm" type="reset" variant="info" onClick={this.reset}>
									<FontAwesomeIcon icon={faUndo} /> リセット
                                    </Button>{" "}
								<Button
									size="sm"
									hidden={backPage === "" ? true : false}
									variant="info"
									onClick={this.back.bind(this)}
								>
									<FontAwesomeIcon icon={faLevelUpAlt} />戻る
                            </Button>
							</div>
						</Form.Group>
					</Form>
					<Row >
						<Col sm={12}>
							<div style={{ "float": "right" }}>
								<Button size="sm" onClick={this.siteInfoeDelete} variant="info" type="button" disabled={this.state.deleteFlag === true ? true : false}>
									<FontAwesomeIcon icon={faTrash} /> 削除</Button>
							</div>
						</Col>
					</Row>
					<Row>
						<Col sm={12}>
							<BootstrapTable selectRow={selectRow} data={siteData} ref='table' deleteRow pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
								<TableHeaderColumn dataField='workDate' width='90' tdStyle={{ padding: '.45em' }} isKey>期間</TableHeaderColumn>
								<TableHeaderColumn dataField='systemName' width='58' tdStyle={{ padding: '.45em' }} >システム</TableHeaderColumn>
								<TableHeaderColumn dataField='location' width='45' tdStyle={{ padding: '.45em' }} >場所</TableHeaderColumn>
								<TableHeaderColumn dataField='customerName' width='58' tdStyle={{ padding: '.45em' }} >お客様</TableHeaderColumn>
								<TableHeaderColumn dataField='siteManager' width='60' tdStyle={{ padding: '.45em' }} >責任者</TableHeaderColumn>
								<TableHeaderColumn dataField='unitPrice' width='30' tdStyle={{ padding: '.45em' }}>単価</TableHeaderColumn>
								<TableHeaderColumn dataField='developLanguageName' width='50' tdStyle={{ padding: '.45em' }} >言語</TableHeaderColumn>
								<TableHeaderColumn dataField='siteRoleName' width='30' tdStyle={{ padding: '.45em' }}>役割</TableHeaderColumn>
								<TableHeaderColumn dataField='levelName' width='30' tdStyle={{ padding: '.45em' }}>評価</TableHeaderColumn>
								<TableHeaderColumn dataField='admissionStartDate' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='admissionEndDate' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='payOffRange1' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='payOffRange2' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='related1Employees' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='related2Employees' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='related3Employees' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='related4Employees' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='typeOfIndustryName' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='topCustomerName' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='workState' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='dailyCalculationStatus' hidden={true} ></TableHeaderColumn>
								<TableHeaderColumn dataField='remark' width='70' tdStyle={{ padding: '.45em' }} headerAlign='center'>備考</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</Row>
				</div>
			</div >
		)
	}
}

export default siteInfo;
