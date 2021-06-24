import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faTrash, faLevelUpAlt, faIdCard } from '@fortawesome/free-solid-svg-icons';
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
 * 現場情報
 */
class siteInfo extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
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
		siteData:[],
		scheduledEndDate:'',
		scheduledEndDateForSave:'',
		pageDisabledFlag: true,// 画面非活性フラグ
		errorsMessageShow: false,
		updateFlag: true,// 修正登録状態フラグ
		disabledFlag: true,// 活性非活性フラグ
		deleteFlag: true,// 活性非活性フラグ
		dailyCalculationStatusFlag: true,// 日割フラグ
		dailyCalculationStatus: false,
		payOffRangeStatus: store.getState().dropDown[33].slice(1),// 精算時間
		siteMaster: store.getState().dropDown[34],// 役割
		customerMaster: store.getState().dropDown[15].slice(1),// お客様
		topCustomerMaster: store.getState().dropDown[35].slice(1),// トップお客様
		developLanguageMaster: store.getState().dropDown[8].slice(1),// 開発言語
		employeeInfo: store.getState().dropDown[9].slice(1),// 社員名
		typeOfIndustryMaster: store.getState().dropDown[36].slice(1),// 業種
		getstations: store.getState().dropDown[14].slice(1),// 場所
		levelMaster: store.getState().dropDown[18],// レベル
		siteStateStatus: store.getState().dropDown[40].slice(1),// 現場状態\
		typteOfContractStatus: store.getState().dropDown[65].slice(1),// 契約形態
		employeeInfoAll: store.getState().dropDown[9].slice(1),
		employeeStatuss: store.getState().dropDown[4],//　社員区分 
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
	
	/**
	 * タイプが違う時に、色々な操作をします。
	 */
	employeeStatusChange = event => {
		const value = event.target.value;
		let employeeInfoList = this.state.employeeInfoAll;
		if(value === '0'){
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) !== "BP" && employeeInfoList[i].code.substring(0,2) !== "SP" && employeeInfoList[i].code.substring(0,2) !== "SC"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList});
		} else if (value === '1') {
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) === "BP"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList});
		} else if (value === '2') {
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) === "SP"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList});
		} else if (value === '3') {
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) === "SC"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList});
		} else {
			this.setState({ employeeInfo: employeeInfoList });
		}
		this.refs.table.setState({
			selectedRowKeys: []
		});
		this.setState({
			employeeStatus: value,
			pageDisabledFlag: true,
			updateFlag:true,
			siteData: [],
			employeeName: "",
		})
	}
	
	onchangeworkState = event => {
		if (event.target.value === '0') {
			this.setState({
				workStateFlag: true,
				levelCode: '',
				[event.target.name]: event.target.value,
				scheduledEndDate:this.state.scheduledEndDateForSave,
				admissionEndDate:'',
			})
		}else if(event.target.value === '2'){
			this.setState({
				[event.target.name]: event.target.value,
				workStateFlag: false,
				remark:"単金調整",
				scheduledEndDate:this.state.scheduledEndDateForSave
			})
		} else {
			this.setState({
				workStateFlag: false,
				[event.target.name]: event.target.value,
				scheduledEndDate:'',
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
	// 入場年月
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
				} else {
					this.setState({
						dailyCalculationStatusFlag: true
					});
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
	// 退場年月
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
				} else {
					this.setState({
						dailyCalculationStatusFlag: true
					});
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
	// 入場年月
	scheduledEndDate = (date) => {
		if (date !== null) {
			this.setState({
				scheduledEndDate: date,
			});
		} else {
			this.setState({
				scheduledEndDate: '',
			});
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
				pageDisabledFlag:false,
				searchFlag: this.props.location.state.searchFlag,
				backbackPage : this.props.location.state.backbackPage,
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
							employeeName: employeeNo,
							disabledFlag: false,
						});
					} else {
						this.setState({ errorsMessageShow: true, errorsMessageValue: response.data.errorsMessage });
						this.setState({
							employeeName: employeeNo,
							siteData: [],
							disabledFlag: false,
						});
						setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
					}
				}).catch((error) => {
					console.error("Error - " + error);
				});
		}
	}
	// reset
	reset = () => {
		this.setState(() => this.resetStates);
	};
	// リセット reset
	resetStates = {
		admissionStartDate: '',
		time: '',
		admissionEndDate: '',
		systemName: '',
		location: '',
		customerNo: '',
		typteOfContract: '',
		workState: '0',
		topCustomerNo: '',
		developLanguageCode: '',
		developLanguageCode2: '',
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
		scheduledEndDate:'',
		scheduledEndDateForSave:'',
		dailyCalculationStatus: false,
		dailyCalculationStatusFlag: true
	};

	getEmployeeNo = (event, values) => {
		this.setState(() => this.resetStates);
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let employeeName = null;
			if (values !== null) {
				employeeName = values.code;
				this.setState({
					pageDisabledFlag: false,
				})
			} else {
				this.setState({
					pageDisabledFlag: true,
					updateFlag:true,
				})
				this.refs.table.setState({
					selectedRowKeys: []
				});
			}
			this.setState({
				employeeName: employeeName,
			}, () => {
				axios.post(this.state.serverIP + "getSiteInfo", { employeeName: this.state.employeeName })
					.then(response => {
						if (response.data.errorsMessage === null || response.data.errorsMessage === undefined) {
							this.setState({
								siteData: response.data.siteList,
								disabledFlag: false,
								deleteFlag:true,
								workStateFlag: true,
								updateFlag: true,
							});
						} else {
							this.setState({ errorsMessageShow: true, errorsMessageValue: response.data.errorsMessage });
							this.setState({
								siteData: [],
								disabledFlag: false,
								deleteFlag:true,
								workStateFlag: true,
								updateFlag: true,
							});
							setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
						}
					}).catch((error) => {
						console.error("Error - " + error);
					});
			})
		})
	}
	
	getTypteOfContract = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let typteOfContract = null;
			if (values !== null) {
				typteOfContract = values.code;
			}
			this.setState({
				typteOfContract: typteOfContract,
			})
		})
	}
	
	getCustomer = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let customerNo = null;
			if (values !== null) {
				customerNo = values.code;
			}
			this.setState({
				customerNo: customerNo,
			})
		})
	}
	getStation = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let location = null;
			if (values !== null) {
				location = values.code;
			}
			this.setState({
				location: location,
			})
		})
	}
	getTopCustomer = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let topCustomerNo = null;
			if (values !== null) {
				topCustomerNo = values.code;
			}
			this.setState({
				topCustomerNo: topCustomerNo,
			})
		})
	}
	getIndustry = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let typeOfIndustryCode = null;
			if (values !== null) {
				typeOfIndustryCode = values.code;
			}
			this.setState({
				typeOfIndustryCode: typeOfIndustryCode,
			})
		})
	}
	getDevelopLanguage = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let developLanguageCode = null;
			if (values !== null) {
				developLanguageCode = values.code;
			}
			this.setState({
				developLanguageCode: developLanguageCode,
			})
		})
	}
	
	getDevelopLanguage2 = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let developLanguageCode = null;
			if (values !== null) {
				developLanguageCode = values.code;
			}
			this.setState({
				developLanguageCode2: developLanguageCode,
			})
		})
	}
	// レコードselect事件
	handleRowSelect = (row, isSelected) => {
		if (isSelected) {
			this.setState({
				admissionStartDate: row.admissionStartDate === null ? '' : new Date(publicUtils.converToLocalTime(row.admissionStartDate, true)),
				time: publicUtils.getFullYearMonth(new Date(publicUtils.converToLocalTime(row.admissionStartDate, true)), new Date()),
				admissionEndDate: row.admissionEndDate === null ? '' : new Date(publicUtils.converToLocalTime(row.admissionEndDate, true)),
				workState: row.workState === null ? '' : row.workState,
				dailyCalculationStatus: row.dailyCalculationStatus === '0' ? true : false,
				systemName: row.systemName === null ? '' : row.systemName,
				location: row.stationCode === null ? '' : row.stationCode,
				customerNo: row.customerNo === null ? '' : row.customerNo,
				topCustomerNo: row.topCustomerNo === null ? '' : row.topCustomerNo,
				developLanguageCode: row.developLanguageCode === null ? '' : row.developLanguageCode,
				developLanguageCode2: row.developLanguageCode2 === null ? '' : row.developLanguageCode2,
				unitPrice: row.unitPrice === null ? '' : row.unitPrice,
				payOffRange1: row.payOffRange1 === null ? '' : row.payOffRange1,
				payOffRange2: row.payOffRange2 === null ? '' : row.payOffRange2,
				siteRoleCode: row.siteRoleName === null ? '' : row.siteRoleCode,
				levelCode: row.levelName === null ? '' : row.levelCode,
				siteManager: row.siteManager === null ? '' : row.siteManager,
				typeOfIndustryCode: row.typeOfIndustryCode === null ? '' : row.typeOfIndustryCode,
				typteOfContract: row.typteOfContractCode === null ? '' : row.typteOfContractCode,
				remark: row.remark === null ? '' : row.remark,
				scheduledEndDate:row.scheduledEndDate === null ? '' : publicUtils.converToLocalTime(row.scheduledEndDate,false),
				scheduledEndDateForSave:row.scheduledEndDate === null ? '' : publicUtils.converToLocalTime(row.scheduledEndDate,false),
				related1Employees: (row.relatedEmployees === null ? '' : publicUtils.textGetValue(row.relatedEmployees.split(",")[0], this.state.employeeInfoAll)),
				related2Employees: (row.relatedEmployees === null ? '' : row.relatedEmployees.split(",")[1] === undefined ? '' : publicUtils.textGetValue(row.relatedEmployees.split(",")[1], this.state.employeeInfoAll)),
				related3Employees: (row.relatedEmployees === null ? '' : row.relatedEmployees.split(",")[2] === undefined ? '' : publicUtils.textGetValue(row.relatedEmployees.split(",")[2], this.state.employeeInfoAll)),
				related4Employees: (row.relatedEmployees === null ? '' : row.relatedEmployees.split(",")[3] === undefined ? '' : publicUtils.textGetValue(row.relatedEmployees.split(",")[3], this.state.employeeInfoAll)),
				updateFlag: false,
				relatedEmployeesFlag: row.siteRoleCode === "0" ? true : row.siteRoleCode === "1" ? true : false,
				workDate: row.workDate,
			});
			if (publicUtils.converToLocalTime(row.admissionStartDate, true).getDate() > 2) {
				this.setState({
					dailyCalculationStatusFlag: false,
					deleteFlag: false,
				});
			} else if (row.admissionEndDate !== null && row.admissionEndDate !== undefined) {
				if (new Date(publicUtils.converToLocalTime(row.admissionEndDate, true).getFullYear(), publicUtils.converToLocalTime(row.admissionEndDate, true).getMonth() + 1, 0).getDate() - publicUtils.converToLocalTime(row.admissionEndDate, true).getDate() > 2) {
					this.setState({
						dailyCalculationStatusFlag: false,
						deleteFlag: false,
					});
				}
			}
			if (row.workState === "1") {
				this.setState({
					workStateFlag: false,
				})
			}else if(row.workState === "2"){
				this.setState({
					workStateFlag: false,
				})
			} else {
				this.setState({
					workStateFlag: true,
				})
			}
			if (row.workDate === this.state.siteData[this.state.siteData.length - 1].workDate) {
				this.setState({
					pageDisabledFlag: false,
					disabledFlag: false,
					deleteFlag: false,
				})
				$('button[name="button"]').attr('disabled', false);
			} else {
				this.setState({
					updateFlag: true,
					disabledFlag: false,
					pageDisabledFlag: true,
				})
				$('button[name="button"]').attr('disabled', true);
			}
		} else {
			this.setState(() => this.resetStates);
			this.setState({
				updateFlag: true,
				disabledFlag: false,
				deleteFlag: true,
				relatedEmployeesFlag: false,
				workDate: '',
				pageDisabledFlag: false,
				workStateFlag: true,
			})
			$('button[name="button"]').attr('disabled', false);
		}
	}
	// 登録処理
	tokuro = () => {
		var siteModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function (i, item) {
			siteModel[item.name] = item.value;
		});
		siteModel["related1Employees"] = publicUtils.valueGetText(this.state.related1Employees, this.state.employeeInfoAll);
		siteModel["related2Employees"] = publicUtils.valueGetText(this.state.related2Employees, this.state.employeeInfoAll);
		siteModel["related3Employees"] = publicUtils.valueGetText(this.state.related3Employees, this.state.employeeInfoAll);
		siteModel["related4Employees"] = publicUtils.valueGetText(this.state.related4Employees, this.state.employeeInfoAll);
		siteModel["customerNo"] = this.state.customerNo;
		siteModel["topCustomerNo"] = this.state.topCustomerNo;
		siteModel["developLanguageCode"] = this.state.developLanguageCode;
		siteModel["developLanguageCode2"] = this.state.developLanguageCode2;
		siteModel["employeeNo"] = this.state.employeeName;
		siteModel["location"] = this.state.location;
		siteModel["typeOfIndustryCode"] = this.state.typeOfIndustryCode;
		siteModel["scheduledEndDate"] = publicUtils.formateDate(this.state.scheduledEndDate,false);
		siteModel["typteOfContractCode"] = this.state.typteOfContract;
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
					axios.post(this.state.serverIP + "getSiteInfo", { employeeName: this.state.employeeName })
						.then(response => {
							if (response.data.errorsMessage === null || response.data.errorsMessage === undefined) {
								this.setState({
									siteData: response.data.siteList,
									workStateFlag: true,
								});
								this.reset();
							} else {
								this.setState({ errorsMessageShow: true, errorsMessageValue: response.data.errorsMessage });
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
	// 修正処理
	update = () => {
		var siteModel = {};
		var formArray = $("#siteForm").serializeArray();
		$.each(formArray, function (i, item) {
			siteModel[item.name] = item.value;
		});
		siteModel["related1Employees"] = publicUtils.valueGetText(this.state.related1Employees, this.state.employeeInfoAll);
		siteModel["related2Employees"] = publicUtils.valueGetText(this.state.related2Employees, this.state.employeeInfoAll);
		siteModel["related3Employees"] = publicUtils.valueGetText(this.state.related3Employees, this.state.employeeInfoAll);
		siteModel["related4Employees"] = publicUtils.valueGetText(this.state.related4Employees, this.state.employeeInfoAll);
		siteModel["customerNo"] = this.state.customerNo;
		siteModel["topCustomerNo"] = this.state.topCustomerNo;
		siteModel["developLanguageCode"] = this.state.developLanguageCode;
		siteModel["developLanguageCode2"] = this.state.developLanguageCode2;
		siteModel["employeeNo"] = this.state.employeeName;
		siteModel["location"] = this.state.location;
		siteModel["typeOfIndustryCode"] = this.state.typeOfIndustryCode;
		siteModel["scheduledEndDate"] = publicUtils.formateDate(this.state.scheduledEndDate,false);
		siteModel["typteOfContractCode"] = this.state.typteOfContract;
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
					axios.post(this.state.serverIP + "getSiteInfo", { employeeName: this.state.employeeName })
						.then(response => {
							if (response.data.errorsMessage === null || response.data.errorsMessage === undefined) {
								this.setState({
									siteData: response.data.siteList,
								});
								this.setState({
									updateFlag: true,
									disabledFlag: false,
									workStateFlag: true,
									deleteFlag:true,
								})
								this.setState(() => this.resetStates);
							} else {
								this.setState({ errorsMessageShow: true, errorsMessageValue: response.data.errorsMessage });
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

	// siteInfoeDelete = () => {
	// //将id进行数据类型转换，强制转换为数字类型，方便下面进行判断。
	// var a = window.confirm("削除していただきますか？");
	// if (a) {
	// $("#deleteBtn").click();
	// }
	// }
	// //隠した削除ボタン
	// createCustomDeleteButton = (onClick) => {
	// return (
	// <Button variant="info" id="deleteBtn" hidden onClick={onClick}
	// >删除</Button>
	// );
	// }
	// 隠した削除ボタンの実装
	onDeleteRow = (rows) => {
		var a = window.confirm("削除していただきますか？");
		if (a) {
			axios.post(this.state.serverIP + "deleteSiteInfo", {
				employeeNo: this.state.employeeName,
				admissionStartDate: publicUtils.formateDate(this.state.admissionStartDate, true),
			})
				.then(result => {
					if (result.data) {
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
							updateFlag: true,
							"myToastShow": true, 
							message: "削除成功", 
							"errorsMessageShow": false
						})
						setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						this.refs.table.setState({
							selectedRowKeys: []
						});
						this.reset();
					} else if(!result.data){
						this.setState({ errorsMessageValue: "現場は終了のため、削除できない", "errorsMessageShow": true });
						setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
					}else{
						this.setState({ "myToastShow": true, "method": "success", message: "削除失敗", "errorsMessageShow": false });
						setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					}
				})
				.catch(function (error) {
					alert("删除错误，请检查程序");
				});
		}
	}
	// // 削除前のデフォルトお知らせの削除
	// customConfirm(next, dropRowKeys) {
	// const dropRowKeysStr = dropRowKeys.join(',');
	// next();
	// }

	/**
	 * 社員名連想
	 * 
	 * @param {}
	 *            event
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
				employeeNo: this.state.employeeName,
				backPage:this.state.backbackPage
			},
		}
		this.props.history.push(path);
	}
	
	shuseiTo = (actionType) => {
		var path = {};
		switch (actionType) {
			case "detail":
				path = {
					pathname: '/subMenuManager/employeeDetailNew',
					state: {
						actionType: 'detail',
						id: String(this.state.employeeName),
						backPage: 'siteInfo',
						sendValue: this.state.sendValue,
						backbackPage: this.state.backPage,
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
	}
	
	render() {
		this.options = {
			page: 1,  // which page you want to show as default
			sizePerPage: 10,  // which size per page you want to locate as
								// default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or
															// function
			hideSizePerPage: true, // > You can hide the dropdown for
									// sizePerPage
			// deleteBtn: this.createCustomDeleteButton,
			// onDeleteRow: this.onDeleteRow,
			// handleConfirmDeleteRow: this.customConfirm,

		};
		const { payOffRange1, payOffRange2, workState, siteData, siteRoleCode, levelCode, time, errorsMessageValue, systemName, unitPrice, related1Employees, related2Employees,
			related3Employees, related4Employees, remark, siteManager, workStateFlag, backPage, pageDisabledFlag,employeeStatus } = this.state;		// テーブルの列の選択
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
							{/*
								 * <Row> <Col sm={3}></Col> <Col sm={7}> <img
								 * className="mb-4" alt="title" src={title}/>
								 * </Col> </Row>
								 */}
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
											<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.employeeStatusChange.bind(this)} name="employeeStatus" value={employeeStatus} autoComplete="off">
											{this.state.employeeStatuss.map(data =>
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
											<InputGroup.Text id="sixKanji">社員名(BP名)</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="employeeName"
											name="employeeName"
											options={this.state.employeeInfo}
											getOptionLabel={(option) => option.text}
											value={this.state.employeeInfo.find(v => v.code === this.state.employeeName) || {}}
											onChange={(event, values) => this.getEmployeeNo(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														{option.name}
													</React.Fragment>
												)
											}}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto Autocompletestyle-siteInfo-employeeNo form-control"
													/>
												</div>
											)}
										/>
									</InputGroup>
								</Col>
								<Col sm={2} lg={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">現場状態</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control className="auto form-control siteInfo-workState"
										as="select" id="workState" name="workState" value={workState}
											onChange={this.onchangeworkState} disabled={pageDisabledFlag}>
											{this.state.siteStateStatus.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm">
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
												autoComplete="off"
												locale="ja"
												id={pageDisabledFlag ? "siteAdmissionStartReadonlyDefault" : "siteAdmissionStart"}
												disabled={pageDisabledFlag}
											/>
										</InputGroup.Prepend>
										<FormControl className="auto form-control siteTime" id="time" name="time" value={time} disabled />
										<font color="red" className="site-mark">★</font>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="cssNikanji">単価</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl maxLength="3"
										id="unitPrice" name="unitPrice" type="text" onChange={this.onchange} value={unitPrice} disabled={pageDisabledFlag} />
										<InputGroup.Prepend id="checkBox">
											<InputGroup.Text className="hiwari">日割</InputGroup.Text>
											<InputGroup.Checkbox className="hiwari" name="dailyCalculationStatus"
												checked={this.state.dailyCalculationStatus}
												onChange={this.dailyCalculationStatusChange}
												disabled={this.state.dailyCalculationStatusFlag === true ? true : pageDisabledFlag ? true : false} />
											<font className="site-mark" color="red">★</font>
										</InputGroup.Prepend>
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
												locale="ja"
												autoComplete="off"
												id={this.state.workState !== "0" ? pageDisabledFlag ? "siteDatePickerReadonlyDefault" : "admissionEndDate" : "siteDatePickerReadonlyDefault"}
												disabled={this.state.employeeName === '' ? true : this.state.workState === "0" ? true : pageDisabledFlag ? true : false}
											/>
											<font color="red" hidden={this.state.workState === "0" ? true : false} className="site-mark">★</font>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="fiveKanji">システム名</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl  maxLength="20" id="systemName" name="systemName" type="text" onChange={this.onchange} value={systemName} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={pageDisabledFlag} />
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
											value={this.state.getstations.find(v => v.code === this.state.location) || {}}
											onChange={(event, values) => this.getStation(event, values)}
											options={this.state.getstations}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo"
													/>
												</div>
											)}
											disabled={pageDisabledFlag}
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
												value={this.state.customerMaster.find(v => v.code === this.state.customerNo) || {}}
												onChange={(event, values) => this.getCustomer(event, values)}
												renderInput={(params) => (
													<div ref={params.InputProps.ref}>
														<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo"
														/>
													</div>
												)}
												disabled={pageDisabledFlag}
											/>
										<font color="red" className="site-mark">★</font>
									</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">形態</InputGroup.Text>
									<Autocomplete
										id="typteOfContractStatus"
										name="typteOfContractStatus"
										options={this.state.typteOfContractStatus}
										getOptionLabel={(option) => option.name}
										value={this.state.typteOfContractStatus.find(v => v.code === this.state.typteOfContract) || {}}
										onChange={(event, values) => this.getTypteOfContract(event, values)}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo"
												/>
											</div>
										)}
										disabled={pageDisabledFlag}
									/>
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
										value={this.state.topCustomerMaster.find(v => v.code === this.state.topCustomerNo) || {}}
										onChange={(event, values) => this.getTopCustomer(event, values)}
										options={this.state.topCustomerMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo-topCustomer"
												/>
											</div>
										)}
										disabled={pageDisabledFlag}
									/>
								</InputGroup.Prepend>
							</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={3}>
										{/*<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">業種</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="typeOfIndustryCode"
											name="typeOfIndustryCode"
											value={this.state.typeOfIndustryMaster.find(v => v.code === this.state.typeOfIndustryCode) || {}}
											onChange={(event, values) => this.getIndustry(event, values)}
											options={this.state.typeOfIndustryMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo"
													/>
												</div>
											)}
											disabled={pageDisabledFlag}
										/>
									</InputGroup>*/}
										<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="developLanguageCode"
											name="developLanguageCode"
											value={this.state.developLanguageMaster.find(v => v.code === this.state.developLanguageCode) || {}}
											onChange={(event, values) => this.getDevelopLanguage(event, values)}
											options={this.state.developLanguageMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo-developLanguageCode"
														style={{ "backgroundColor": this.state.employeeName === '' ? "#e9ecef" : "" }} />
												</div>
											)}
											disabled={pageDisabledFlag}
										/>
										<Autocomplete
										id="developLanguageCode2"
										name="developLanguageCode2"
										value={this.state.developLanguageMaster.find(v => v.code === this.state.developLanguageCode2) || {}}
										onChange={(event, values) => this.getDevelopLanguage2(event, values)}
										options={this.state.developLanguageMaster}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-siteInfo-developLanguageCode"
													style={{ "backgroundColor": this.state.employeeName === '' ? "#e9ecef" : "" }} />
											</div>
										)}
										disabled={pageDisabledFlag}
									/>
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
											autoComplete="off" disabled={pageDisabledFlag}>
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
											autoComplete="off" disabled={payOffRange1 === '0' ? true : pageDisabledFlag ? true : false} >
											{this.state.payOffRangeStatus.map(data =>
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
											<InputGroup.Text id="siteInfo-siteRoleCode">役割</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control className="auto form-control siteInfo-siteRoleCode" 
										as="select" id="siteRoleCode" name="siteRoleCode" onChange={this.onchangeSiteRoleCode} value={siteRoleCode} autoComplete="off"
											disabled={pageDisabledFlag}>
											{this.state.siteMaster.map(date =>
												<option key={date.code} value={date.code}>
													{date.name}
												</option>
											)}
										</Form.Control>
										<InputGroup.Prepend>
											<InputGroup.Text id="siteInfo-siteRoleCode">評価</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control className="auto form-control siteInfo-siteRoleCode" 
										as="select" id="levelCode" name="levelCode" onChange={this.onchange} value={levelCode} autoComplete="off"
											disabled={pageDisabledFlag ? true : workStateFlag ? true : false}>
											{this.state.levelMaster.map(date =>
												<option key={date.code} value={date.code}>
													{date.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">責任者</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl maxLength="20" id="siteManager" name="siteManager" type="text" onChange={this.onchange} value={siteManager} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={pageDisabledFlag} />
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
											value={this.state.employeeInfoAll.find(v => v.code === this.state.related1Employees) || ""}
											options={this.state.employeeInfoAll}
											getOptionLabel={(option) => option.text ? option.text : ""}
											disabled={this.state.relatedEmployeesFlag ? pageDisabledFlag ? true : false : true}
											onChange={(event, values) => this.getRelated1Employees(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														{option.name}
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
											value={this.state.employeeInfoAll.find(v => v.code === this.state.related2Employees) || ""}
											options={this.state.employeeInfoAll}
											disabled={this.state.relatedEmployeesFlag ? pageDisabledFlag ? true : false : true}
											getOptionLabel={(option) => option.text ? option.text : ""}
											onChange={(event, values) => this.getRelated2Employees(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														{option.name}
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
											value={this.state.employeeInfoAll.find(v => v.code === this.state.related3Employees) || ""}
											options={this.state.employeeInfoAll}
											disabled={this.state.relatedEmployeesFlag ? pageDisabledFlag ? true : false : true}
											getOptionLabel={(option) => option.text ? option.text : ""}
											onChange={(event, values) => this.getRelated3Employees(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														{option.name}
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
											value={this.state.employeeInfoAll.find(v => v.code === this.state.related4Employees) || ""}
											options={this.state.employeeInfoAll}
											disabled={this.state.relatedEmployeesFlag ? pageDisabledFlag ? true : false : true}
											getOptionLabel={(option) => option.text ? option.text : ""}
											onChange={(event, values) => this.getRelated4Employees(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														{option.name}
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
											<InputGroup.Text id="fiveKanji">予定終了月</InputGroup.Text>
										</InputGroup.Prepend>
										<InputGroup.Prepend>
											<DatePicker
												selected={this.state.scheduledEndDate}
												onChange={this.scheduledEndDate}
												dateFormat="yyyy/MM"
												name="scheduledEndDate"
												showMonthYearPicker
												showFullMonthYearPicker
												showDisabledMonthNavigation
												className="form-control form-control-sm"
												id="scheduledEndDate-siteInfo"
												locale="ja"
												autoComplete="off"
												disabled={pageDisabledFlag}
												id={pageDisabledFlag ? "scheduledEndDate-siteInfoReadOnly" : this.state.workState === "1" ?  "scheduledEndDate-siteInfoReadOnly" : "scheduledEndDate-siteInfo"}
												disabled={pageDisabledFlag ? true : this.state.workState === "1" ? true : false}
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl maxLength="50" id="remark" name="remark" type="text" onChange={this.onchange} value={remark} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled={pageDisabledFlag} />
									</InputGroup>
								</Col>
							</Row>
							<div style={{ "textAlign": "center" }}>
								<Button name="button" size="sm" onClick={this.state.updateFlag === true ? this.tokuro : this.update} variant="info" id="toroku" type="button" disabled={pageDisabledFlag}>
									<FontAwesomeIcon icon={faSave} /> {this.state.updateFlag === true ? '登録' : '修正'}
								</Button>{' '}
								<Button size="sm" type="reset" variant="info" onClick={this.reset} name="button">
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
					<Col sm={6}>
						<Button onClick={this.shuseiTo.bind(this, "detail")} size="sm" variant="info" name="clickButton" disabled={pageDisabledFlag}><FontAwesomeIcon icon={faIdCard} /> 個人情報</Button>
					</Col>
						<Col sm={6}>
							<div style={{ "float": "right" }}>
								<Button name="button" size="sm" onClick={this.onDeleteRow} variant="info" type="button" disabled={this.state.deleteFlag}>
									<FontAwesomeIcon icon={faTrash} /> 削除</Button>
							</div>
						</Col>
					</Row>
					<Row>
						<Col sm={12}>
							<BootstrapTable selectRow={selectRow} data={siteData} ref='table' deleteRow pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
								<TableHeaderColumn dataField='workDate' width='150' tdStyle={{ padding: '.45em' }} isKey>期間</TableHeaderColumn>
								<TableHeaderColumn dataField='systemName' width='220' tdStyle={{ padding: '.45em' }} >システム</TableHeaderColumn>
								<TableHeaderColumn dataField='location' width='90' tdStyle={{ padding: '.45em' }} >場所</TableHeaderColumn>
								<TableHeaderColumn dataField='customerName' width='150' tdStyle={{ padding: '.45em' }} >お客様</TableHeaderColumn>
								<TableHeaderColumn dataField='siteManager' width='60' tdStyle={{ padding: '.45em' }} >責任者</TableHeaderColumn>
								<TableHeaderColumn dataField='unitPrice' width='60' tdStyle={{ padding: '.45em' }}>単価</TableHeaderColumn>
								<TableHeaderColumn dataField='developLanguageName' width='110' tdStyle={{ padding: '.45em' }} >言語</TableHeaderColumn>
								<TableHeaderColumn dataField='siteRoleName' width='50' tdStyle={{ padding: '.45em' }}>役割</TableHeaderColumn>
								<TableHeaderColumn dataField='levelName' width='50' tdStyle={{ padding: '.45em' }}>評価</TableHeaderColumn>
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
								<TableHeaderColumn dataField='remark' width='90' tdStyle={{ padding: '.45em' }}>備考</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</Row>
				</div>
			</div >
		)
	}
}

export default siteInfo;
