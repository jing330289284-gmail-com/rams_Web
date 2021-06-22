import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl, Modal, } from 'react-bootstrap';
import MyToast from './myToast';
import $ from 'jquery';
import ErrorsMessageToast from './errorsMessageToast';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash, faUndo, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import * as utils from './utils/publicUtils.js';
import { BootstrapTable, TableHeaderColumn, BSTable } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import ExpensesInfo from "./expensesInfo.js"
import Autocomplete from '@material-ui/lab/Autocomplete';
import store from './redux/store';
registerLocale('ja', ja);
axios.defaults.withCredentials = true;
/**
 * 給料情報画面（社員用）
 */
class WagesInfo extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;//初期化
    }

    initialState = {
        employeeNo: '',//社員番号
        newEmployeeNo: '',//社員番号
        employeeName:"",
        reflectYearAndMonth: '',//反映年月
        socialInsuranceFlag: '',//社会保険フラグ
        salary: '',//給料
        waitingCost: '',//非稼動費用
        welfarePensionAmount: '',//厚生年金
        healthInsuranceAmount: '',//健康保険
        insuranceFeeAmount: '',//保険総額
        lastTimeBonusAmount: '',//ボーナス前回額
        scheduleOfBonusAmount: '',//ボーナス予定額
        bonusFlag: '',//ボーナスフラグ
        nextBonusMonth: '',//次ボーナス月
        nextRaiseMonth: '',//次回昇給月
        totalAmount: '',//総額
        employeeFormCode: '',//社員形式
        remark: '',//備考
        bonusStartDate: '',//ボーナスの期日
        raiseStartDate: '',//昇給の期日
        reflectStartDate: '',//反映年月
        lastTimeBonusAmountForInsert: "",//前回のボーナス額（）
        employeeFormCodeStart: "",
        bonus: null,//ボーナス
        costInfoShow: false,//諸費用画面フラグ
        message: '',//toastのメッセージ
        type: '',//成功や失敗
        myToastShow: false,//toastのフラグ
        errorsMessageShow: false,///エラーのメッセージのフラグ
        errorsMessageValue: '',//エラーのメッセージ
        actionType: 'detail',//処理区分
        socialInsuranceFlagDrop: [],//社会保険フラグselect
        bonusFlagDrop: [],//ボーナスフラグselect
        EmployeeFormCodeDrop: [],//社員性質select
        employeeNameDrop: [],//社員名select
        wagesInfoList: [],//給料明細テーブル
        selectedWagesInfo: {},//選択された行
        expensesInfoModel: null,//諸費用データ
        torokuText: '登録',//登録ボタンの文字
        expensesInfoModels: [],//諸費用履歴
        kadouCheck: true,//稼働フラグ
        leaderCheck: false,//リーダーフラグ
        backPage: "",
        searchFlag: true,
        sendValue: {},
        relatedEmployees: '',//要員
        allExpensesInfoList:[],
        deleteFlag:true,
        hatsunyubaFlag:true,
        employeeStatus: '',
		employeeStatuss: store.getState().dropDown[4],
		newEmployeeStatus: '',
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
    }
    //onchange
    valueChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }
    //onchange
    valueChangeBonus = event => {
        var value = event.target.value;
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            if (value === "0") {
                this.setState({
                    scheduleOfBonusAmount: '',
                    bonusStartDate: '',
                }, () => {
                    this.totalKeisan();
                })
            }
        })
    }
    //onchange(金額)
    valueChangeMoney = event => {
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            if (this.state.socialInsuranceFlag === "1") {
                this.hokenKeisan();
            } else {
                this.totalKeisan();
            }
            this.setState({
                [name]: utils.addComma(value)
            });
        }
        )
    }
    //onchange(保険)
    valueChangeInsurance = event => {
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            this.hokenKeisan();
        }
        )
    }
    componentDidMount() {
		axios.post(this.state.serverIP + "subMenu/getCompanyDate")
		.then(response => {
				this.setState({
					empNoHead: response.data.empNoHead,
				})
		}).catch((error) => {
			console.error("Error - " + error);
		});
    	this.setEmployeeStatuss();
        this.getDropDowns();
        console.log(this.props.history);
        $("#expensesInfoBtn").attr("disabled", true);
        if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
            var employeeNo = this.props.location.state.employeeNo;
            var wagesInfo = {};
            wagesInfo["employeeNo"] = employeeNo;
            this.setState({
                sendValue: this.props.location.state.sendValue,
                searchFlag: this.props.location.state.searchFlag,
                actionType: this.props.location.state.actionType,
                employeeName: employeeNo,
                employeeNo: employeeNo,
                backPage: this.props.location.state.backPage,
            })
            this.search(wagesInfo);
        }
    }
    
    getemployeeStatus = (employeeNo) =>{
    	if(employeeNo === null){
            this.setState({newEmployeeStatus:"",});
    	}
    	else if(employeeNo.substring(0,2)==="SP"){
            this.setState({newEmployeeStatus:2,});
    	}
    	else if(employeeNo.substring(0,2)==="SC"){
            this.setState({newEmployeeStatus:3,});
    	}
    	else{
            this.setState({newEmployeeStatus:0,});
    	}
    }
    
    setEmployeeStatuss = () => {
    	let employeeStatuss = [];
    	for(let i = 0; i < this.state.employeeStatuss.length; i++){
    		if(String(this.state.employeeStatuss[i].code) === "" || String(this.state.employeeStatuss[i].code) === "0" || 
    			String(this.state.employeeStatuss[i].code) === "2" || String(this.state.employeeStatuss[i].code) === "3"){
    			employeeStatuss.push(this.state.employeeStatuss[i]);
    		}
    	}
        this.setState(
                {
                	employeeStatuss:employeeStatuss,
                }
            );
    }
    
    /**
     * select取得
     */
    getDropDowns = () => {
        var methodArray = ["getInsurance", "getBonus", "getEmployeeForm", "getEmployeeNameNoBP"]
        var data = utils.getPublicDropDown(methodArray, this.state.serverIP);
        this.setState(
            {
                socialInsuranceFlagDrop: data[0].slice(1),
                bonusFlagDrop: data[1].slice(1),
                EmployeeFormCodeDrop: data[2],
                employeeNameDrop: data[3].slice(1),
                employeeInfo: data[3].slice(1),
            }
        );
    };
    /**
    * ボーナス期日の変化
    */
    bonusChange = date => {
        if (date !== null) {
            this.setState({
                bonusStartDate: date,
            });
        } else {
            this.setState({
                bonusStartDate: '',
            });
        }
    };
    /**
     * 昇給期日の変化
     */
    raiseChange = date => {
        if (date !== null) {
            this.setState({
                raiseStartDate: date,
            });
        } else {
            this.setState({
                raiseStartDate: '',
            });
        }
    };
    /**
     * 昇給期日の変化
     */
    reflectStartDateChange = date => {
        if (date !== null) {
            this.setState({
                reflectStartDate: date,
            });
        } else {
            this.setState({
                reflectStartDate: '',
            });
        }
    };
    /**
    * 総計の計算
    */
    totalKeisan = () => {
        var sum = 0;
        var salary = utils.deleteComma(this.state.salary);
        var waitingCost = utils.deleteComma(this.state.waitingCost);
        var insuranceFeeAmount = utils.deleteComma(this.state.insuranceFeeAmount);
        var scheduleOfBonusAmount = utils.deleteComma(this.state.scheduleOfBonusAmount);

        if (waitingCost !== '' && waitingCost !== null) {
            sum += parseInt(waitingCost);
        } else if (salary !== '' && salary !== null) {
            sum += parseInt(salary);
        }
        sum = sum + parseInt((insuranceFeeAmount === '' ? 0 : insuranceFeeAmount))
            + Math.floor((scheduleOfBonusAmount === '' ? 0 : scheduleOfBonusAmount) / 12);
        //var totalAmount = (isNaN(sum) ? '' : (sum === 0 ? '' : sum));
        var totalAmount = (isNaN(sum) ? '' : sum);
        this.setState({
            totalAmount: utils.addComma(totalAmount),
        })
    }
    /**
     * 値を設定
     */
    giveValue = (wagesInfoMod) => {
        this.setState({
            socialInsuranceFlag: wagesInfoMod.socialInsuranceFlag,
            salary: utils.addComma(wagesInfoMod.salary),
            waitingCost: utils.addComma(wagesInfoMod.waitingCost),
            welfarePensionAmount: utils.addComma(wagesInfoMod.welfarePensionAmount),
            healthInsuranceAmount: utils.addComma(wagesInfoMod.healthInsuranceAmount),
            insuranceFeeAmount: utils.addComma(wagesInfoMod.insuranceFeeAmount),
            lastTimeBonusAmount: utils.addComma(wagesInfoMod.lastTimeBonusAmount),
            scheduleOfBonusAmount: utils.addComma(wagesInfoMod.scheduleOfBonusAmount),
            bonusFlag: wagesInfoMod.bonusFlag,
            totalAmount: utils.addComma(wagesInfoMod.totalAmount),
            employeeFormCode: wagesInfoMod.employeeFormCode,
            remark: wagesInfoMod.remark,
            bonusStartDate: utils.converToLocalTime(wagesInfoMod.nextBonusMonth, false),
            raiseStartDate: utils.converToLocalTime(wagesInfoMod.nextRaiseMonth, false),
            reflectStartDate: utils.converToLocalTime(wagesInfoMod.reflectYearAndMonth, false),
        })
    }
    /**
     * 値をリセット
     */
    resetValue = () => {
        if (this.state.bonus !== null && this.state.bonus !== undefined) {
            this.setState({
                socialInsuranceFlag: '',
                salary: '',
                waitingCost: '',
                welfarePensionAmount: '',
                healthInsuranceAmount: '',
                insuranceFeeAmount: '',
                lastTimeBonusAmount: '',
                totalAmount: '',
                employeeFormCode: this.state.employeeFormCodeStart,
                remark: '',
                raiseStartDate: '',
                reflectStartDate: '',
                bonusFlag: this.state.bonus.bonusFlag,
                scheduleOfBonusAmount: utils.addComma(this.state.bonus.scheduleOfBonusAmount),
                bonusStartDate: utils.converToLocalTime(this.state.bonus.nextBonusMonth, false),
            },()=>{
                this.totalKeisan();
            })
        } else {
            this.setState({
                socialInsuranceFlag: '',
                salary: '',
                waitingCost: '',
                welfarePensionAmount: '',
                healthInsuranceAmount: '',
                insuranceFeeAmount: '',
                lastTimeBonusAmount: '',
                totalAmount: '',
                employeeFormCode: this.state.employeeFormCodeStart,
                remark: '',
                raiseStartDate: '',
                reflectStartDate: '',
                bonusFlag: '',
                scheduleOfBonusAmount: '',
                bonusStartDate: '',
            },()=>{
                this.totalKeisan();
            })
        }
        this.getemployeeStatus(this.state.employeeNo);
    }
    
	/**
	 * タイプが違う時に、色々な操作をします。
	 */
	employeeStatusChange = event => {
		const value = event.target.value;
		let employeeInfoList = this.state.employeeInfo;
		if(value === '0'){
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) !== "BP" && employeeInfoList[i].code.substring(0,2) !== "SP" && employeeInfoList[i].code.substring(0,2) !== "SC"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeNameDrop: newEmpInfoList , employeeName: "" });
		}else if (value === '2') {
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) === "SP"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeNameDrop: newEmpInfoList, employeeName: ""  });
		} else if (value === '3') {
			let newEmpInfoList = [];
			for(let i in employeeInfoList){
				if(employeeInfoList[i].code.substring(0,2) === "SC"){
					newEmpInfoList.push(employeeInfoList[i]);
				}
			}
			this.setState({ employeeNameDrop: newEmpInfoList, employeeName: ""  });
		}else {
			this.setState({ employeeNameDrop: employeeInfoList });
		}
		this.setState({ employeeStatus: value });
	}
    
    getWagesInfo = (event, values) => {
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            var employeeNo = null;
            if (values !== null) {
                employeeNo = values.code;
                this.setState({
                    actionType:"insert",
                })
            }else{
                this.setState({
                    actionType:"detail",
                    employeeFormCodeStart:"",
                })
            }
            var wagesInfoMod = {
                "employeeNo": employeeNo,
            }
            this.setState({
                employeeNo: employeeNo,
                employeeName: employeeNo,
            })
            this.search(wagesInfoMod);
            if (values !== null) {
                this.setState({
                    actionType:"insert",
                },()=>{
                    this.resetValue();
                })
            }else{
                this.setState({
                    actionType:"detail",
                    employeeFormCodeStart:"",
                },()=>{
                    this.resetValue();
                })
            }
            this.getemployeeStatus(employeeNo);
        })
    }
    search = (wagesInfoMod) => {
        axios.post(this.state.serverIP + "wagesInfo/getWagesInfo", wagesInfoMod)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    $("#expensesInfoBtn").attr("disabled", false);
                    this.setState({
                        wagesInfoList: result.data.wagesInfoList,
                        kadouCheck: result.data.kadouCheck,
                        leaderCheck: result.data.leaderCheck,
                        relatedEmployees: result.data.kadouList,
                        employeeFormCode: result.data.employeeFormCode,
                        employeeFormCodeStart: result.data.employeeFormCode,
                        bonus: result.data.bonus,
                        hatsunyubaFlag:result.data.hatsunyubaFlag,
                        "errorsMessageShow": false,
                        allExpensesInfoList:result.data.allExpensesInfoList,
                        expensesInfoModels: result.data.allExpensesInfoList,
                    })
                    if (result.data.bonus !== null) {
                        this.setState({
                            bonusFlag: result.data.bonus.bonusFlag,
                            lastTimeBonusAmount: utils.addComma(result.data.bonus.lastTimeBonusAmount),
                            lastTimeBonusAmountForInsert: utils.addComma(result.data.bonus.lastTimeBonusAmount),
                            scheduleOfBonusAmount: utils.addComma(result.data.bonus.scheduleOfBonusAmount),
                            bonusStartDate: utils.converToLocalTime(result.data.bonus.nextBonusMonth, false),
                        }, () => {
                            this.totalKeisan();
                        })
                    } else {
                        this.setState({
                            bonusFlag: '',
                            scheduleOfBonusAmount: '',
                            bonusStartDate: '',
                        }, () => {
                            this.totalKeisan();
                        })
                    }
                } else {
                    $("#expensesInfoBtn").attr("disabled", true);
                    this.setState({
                        wagesInfoList: [],
                        allExpensesInfoList:[],
                        expensesInfoModels: [],
                        kadouCheck: result.data.kadouCheck,
                        relatedEmployees: result.data.kadouList,
                        leaderCheck: result.data.leaderCheck,
                        employeeFormCode: result.data.employeeFormCode,
                        employeeFormCodeStart: result.data.employeeFormCode,
                        lastTimeBonusAmount: '',
                        lastTimeBonusAmountForInsert: '',
                        bonus: result.data.bonus,
                        bonusFlag: '',
                        scheduleOfBonusAmount: '',
                        bonusStartDate: '',
                        hatsunyubaFlag:true,
                    }, () => {
                        this.totalKeisan();
                    })
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
            });
    }
    /**
     * 行Selectファンクション
     */
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            this.shuseiBtn(row);
            if (row.reflectYearAndMonth === this.state.wagesInfoList[this.state.wagesInfoList.length - 1].reflectYearAndMonth) {
                this.setState({
                    torokuText: '更新',
                    deleteFlag:false,
                })
            } else {
                // this.resetValue();
                this.setState({
                    actionType: "detail",
                    torokuText: '登録',
                    deleteFlag:true,
                })            }
            if (row.expensesInfoModels != null) {
                this.setState({
                    expensesInfoModels: row.expensesInfoModels,
                })
            } else {
                this.setState({
                    expensesInfoModels: [],
                })
            }
        } else {
            this.resetValue();
            this.setState({
                actionType: 'insert',
                torokuText: '登録',
                expensesInfoModels: this.state.allExpensesInfoList,
                deleteFlag:true,
            })
        }
    }
    /**
     * 修正ボタン
     */
    shuseiBtn = (selectedWagesInfo) => {
        var selectedWagesInfo = selectedWagesInfo;
        var salary = "";
        if (selectedWagesInfo.waitingCost !== '' && selectedWagesInfo.waitingCost !== null && selectedWagesInfo.waitingCost !== undefined) {
            salary = selectedWagesInfo.salary;
            selectedWagesInfo["salary"] = "";
        }
        this.setState({
            actionType: "update",
        })
        this.giveValue(selectedWagesInfo);
        if (selectedWagesInfo.waitingCost !== '' && selectedWagesInfo.waitingCost !== null && selectedWagesInfo.waitingCost !== undefined) {
            selectedWagesInfo["salary"] = salary;
        }
    }
    /**
     * https://asia-northeast1-tsunagi-all.cloudfunctions.net/
    * 社会保険計算
    */
    async hokenKeisan() {
        var salary = utils.deleteComma(this.state.salary);
        if (this.state.socialInsuranceFlag === "1") {
            if (salary === '') {
                this.setState({ errorsMessageShow: true, errorsMessageValue: "給料を入力してください", socialInsuranceFlag: "0", healthInsuranceAmount: '', welfarePensionAmount: '', insuranceFeeAmount: '' });
                setTimeout(() => this.setState({ "errorsMessageValue": false }), 3000);
            } else if (salary === '0') {
                this.setState({ errorsMessageShow: true, errorsMessageValue: "給料を0以上に入力してください", socialInsuranceFlag: "0", healthInsuranceAmount: '', welfarePensionAmount: '', insuranceFeeAmount: '' });
                setTimeout(() => this.setState({ "errorsMessageValue": false }), 3000);
            } else {
                await axios.post("/api/getSocialInsurance202003?salary=" + salary + "&kaigo=0")
                    .then(result => {
                        var welfarePensionAmount = utils.addComma(result.data.pension.payment);
                        var healthInsuranceAmount = utils.addComma(result.data.insurance.payment);
                        var insuranceFeeAmount = utils.addComma(result.data.insurance.payment + result.data.pension.payment);
                        this.setState({
                            welfarePensionAmount: welfarePensionAmount,
                            healthInsuranceAmount: healthInsuranceAmount,
                            insuranceFeeAmount: insuranceFeeAmount,
                        })
                    })
                    .catch(error => {
                        this.setState({ errorsMessageShow: true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください", socialInsuranceFlag: "0", });
                        setTimeout(() => this.setState({ "errorsMessageValue": false }), 3000);
                    });
            }
            this.totalKeisan();
        } else {
            this.setState({
                welfarePensionAmount: '',
                healthInsuranceAmount: '',
                insuranceFeeAmount: '',
            }, () => {
                this.totalKeisan();
            }
            )
        }
    }
    getExpensesInfo = (expensesInfoToroku) => {
        if (expensesInfoToroku === "success") {
            this.setState({
                costInfoShow: false,
            }, () => {
                var wagesInfoMod = {
                    "employeeNo": this.state.employeeNo,
                }
                this.search(wagesInfoMod);
                this.refs.wagesInfoTable.setState({
                    selectedRowKeys:[],
                })
            }
            )
        }
        console.log(expensesInfoToroku);
    }
    /**
     * 登録ボタン
     */
    toroku = () => {
        var wagesInfoModel = {};
        $("#socialInsuranceFlag").attr("disabled", false);
        $("#bonusFlag").attr("disabled", false);
        var formArray = $("#wagesInfoForm").serializeArray();
        $.each(formArray, function (i, item) {
            wagesInfoModel[item.name] = item.value;
        });
        wagesInfoModel["salary"] = utils.deleteComma(this.state.salary);
        wagesInfoModel["waitingCost"] = utils.deleteComma(this.state.waitingCost);
        wagesInfoModel["welfarePensionAmount"] = utils.deleteComma(this.state.welfarePensionAmount);
        wagesInfoModel["healthInsuranceAmount"] = utils.deleteComma(this.state.healthInsuranceAmount);
        wagesInfoModel["insuranceFeeAmount"] = utils.deleteComma(this.state.insuranceFeeAmount);
        wagesInfoModel["scheduleOfBonusAmount"] = utils.deleteComma(this.state.scheduleOfBonusAmount);
        wagesInfoModel["lastTimeBonusAmount"] = utils.deleteComma(this.state.lastTimeBonusAmount);
        wagesInfoModel["totalAmount"] = utils.deleteComma(this.state.totalAmount);
        wagesInfoModel["employeeNo"] = this.state.employeeNo;
        wagesInfoModel["nextRaiseMonth"] = utils.formateDate(this.state.raiseStartDate, false);
        wagesInfoModel["nextBonusMonth"] = utils.formateDate(this.state.bonusStartDate, false);
        wagesInfoModel["reflectYearAndMonth"] = utils.formateDate(this.state.reflectStartDate, false);
        wagesInfoModel["actionType"] = this.state.actionType;
        wagesInfoModel["expensesInfoModel"] = this.state.expensesInfoModel;
        wagesInfoModel["newEmployeeNo"] = this.state.newEmployeeNo;
        wagesInfoModel["employeeStatus"] = this.state.newEmployeeStatus;
        if (this.state.employeeFormCode === "3") {
            $("#socialInsuranceFlag").attr("disabled", true);
            $("#bonusFlag").attr("disabled", true);
        }
        axios.post(this.state.serverIP + "wagesInfo/toroku", wagesInfoModel)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: result.data.message });
                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                    if(this.state.newEmployeeNo !== ""){
    					store.dispatch({type:"UPDATE_STATE",dropName:"getEmployeeName"});
    					this.getNewEmployeeNameDrop(wagesInfoModel["employeeNo"],this.state.newEmployeeNo);
                        wagesInfoModel["employeeNo"] = this.state.newEmployeeNo;
                    }
                    this.search(wagesInfoModel);
                    this.resetValue();
                    this.refs.wagesInfoTable.setState({
                        selectedRowKeys: [],
                    });
                    this.setState({
                        torokuText: "登録",
                        deleteFlag:true,
                    })
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                }
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
            });
    }
    
    getNewEmployeeNameDrop = (employeeNo,newEmployeeNo) =>{
    	let employeeNameDrop = this.state.employeeNameDrop;
    	for(let i = 0;i < employeeNameDrop.length;i++){
    		if(employeeNameDrop[i].code === employeeNo){
    			employeeNameDrop[i].code = newEmployeeNo;
    			employeeNameDrop[i].name = employeeNameDrop[i].text + "(" + newEmployeeNo + ")";
    		}
    	}
        this.setState({ employeeNameDrop: employeeNameDrop,employeeName:newEmployeeNo,employeeNo: newEmployeeNo, });
    }
    
    /**
     * 小さい画面の閉め 
     */
    handleHideModal = (Kbn) => {
        this.setState({ costInfoShow: false })
    }
    /**
    *  小さい画面の開き
    */
    handleShowModal = (Kbn) => {
        this.setState({ costInfoShow: true })
    }
    /**
     * テーブルの下もの
     * @param {} start 
     * @param {*} to 
     * @param {*} total 
     */
    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
                {start}から  {to}まで , 総計{total}
            </p>
        );
    }
    addMarkSalary = (cell, row) => {   
        let salary = utils.addComma(row.salary.split("(")[0]);
        let str = utils.addComma(row.salary.split("(")[1]);
        if(str.length > 0){
            salary = salary + "(非)"
        }
        return salary;
    }
    addMarkInsuranceFeeAmount = (cell, row) => {
        let insuranceFeeAmount = utils.addComma(row.insuranceFeeAmount);
        return insuranceFeeAmount;
    }
    addMarkTransportationExpenses = (cell, row) => {
        let transportationExpenses = utils.addComma(row.transportationExpenses);
        return transportationExpenses;
    }
    addMarkLeaderAllowanceAmount = (cell, row) => {
        let leaderAllowanceAmount = utils.addComma(row.leaderAllowanceAmount);
        return leaderAllowanceAmount;
    }
    addMarkintroductionAllowance = (cell, row) => {
        let introductionAllowance = utils.addComma(row.introductionAllowance);
        return introductionAllowance;
    }
    addMarkOtherAllowanceAmount = (cell, row) => {
        let otherAllowanceAmount = utils.addComma(Number(row.otherAllowanceAmount) + Number(row.leaderAllowanceAmount) + Number(row.introductionAllowance));
        return otherAllowanceAmount === "0" ? "" : otherAllowanceAmount;
    }
    addMarkScheduleOfBonusAmount = (cell, row) => {
        let scheduleOfBonusAmount = utils.addComma(row.scheduleOfBonusAmount);
        return scheduleOfBonusAmount;
    }
    /**
     * 戻るボタン
     */
    back = () => {
        var path = {};
        path = {
            pathname: this.state.backPage,
            state: { searchFlag: this.state.searchFlag, sendValue: this.state.sendValue },
        }
        this.props.history.push(path);
    }
    
    newEmployeeStatusChange = event => {
    	this.setState({
            [event.target.name]: event.target.value,
        });
    	let employeeNo = this.state.employeeNo;
    	if(employeeNo != null){
        	switch (event.target.value) {
    		case "":
    	    	this.setState({ newEmployeeNo :"", });
    			break;
    		case "0":	//社員
    			if(employeeNo.substring(0,2) !== "SP" && employeeNo.substring(0,2) !== "SC"){
    				this.setState({ newEmployeeNo :"", });
    			}else if(employeeNo.substring(0,2) === "SP"){
    				this.getNO(this.state.empNoHead);
    			}else if(employeeNo.substring(0,2) === "SC"){
    				this.getNO(this.state.empNoHead);
    			}
    			break;
    		case "2":	//個人事業主
    			if(employeeNo.substring(0,2) !== "SP" && employeeNo.substring(0,2) !== "SC"){
    				this.getNO("SP");
    			}else if(employeeNo.substring(0,2) === "SP"){
    				this.setState({ newEmployeeNo :"", });
    			}else if(employeeNo.substring(0,2) === "SC"){
    				this.getNO("SP");
    			}    	
    			break;
    		case "3":	//子会社社員
    			if(employeeNo.substring(0,2) !== "SP" && employeeNo.substring(0,2) !== "SC"){
    				this.getNO("SC");
    			}else if(employeeNo.substring(0,2) === "SP"){
    				this.getNO("SC");
    			}else if(employeeNo.substring(0,2) === "SC"){
    				this.setState({ newEmployeeNo :"", });
    			}    			
    			break;
    		default:
    			break;
    		}
    	}else{
	    	this.setState({ newEmployeeNo :"", });
    	}
    }
    
	/**
	 * 採番番号
	 */
	getNO = (NO) => {
		const promise = Promise.resolve(publicUtils.getNO("employeeNo", NO, "T001Employee", this.state.serverIP));
		promise.then((value) => {
			this.setState(
				{
					newEmployeeNo: value
				}
			);
		});
	};
    
    employeeFormChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            if (this.state.employeeFormCode === "3") {
                this.setState({
                    socialInsuranceFlag: "0",
                    welfarePensionAmount: "",
                    healthInsuranceAmount: "",
                    insuranceFeeAmount: "",
                    bonusFlag: "0",
                    scheduleOfBonusAmount: "",
                    bonusStartDate: '',
                }, () => {
                    this.totalKeisan();
                })
            } else {
                if (this.state.bonus !== null) {
                    this.setState({
                        bonusStartDate: utils.converToLocalTime(this.state.bonus.nextBonusMonth, false),
                        bonusFlag: this.state.bonus.bonusFlag,
                        scheduleOfBonusAmount: utils.addComma(this.state.bonus.scheduleOfBonusAmount),
                    }, () => {
                        this.totalKeisan();
                    })
                }
            }
        })
    }
    delete = () => {
        var a = window.confirm("削除していただきますか？");
        if (a) {
            var deleteMod = {};
            deleteMod["employeeNo"] = this.state.employeeName;
            deleteMod["reflectYearAndMonth"] = utils.formateDate(this.state.reflectStartDate);
            axios.post(this.state.serverIP + "wagesInfo/delete", deleteMod)
                .then(result => {
                    if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                        this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "削除成功" });
                        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                        var wagesInfoMod = {};
                        wagesInfoMod["employeeNo"] = this.state.employeeName;
                        this.resetValue();
                        this.search(wagesInfoMod);
                        this.setState({
                            actionType: 'insert',
                            torokuText: '登録',
                            expensesInfoModels: [],
                            deleteFlag:true,
                        })
                    } else {
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                        setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
                    }
                })
                .catch(error => {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
                });
        }
    }
    shuseiTo = (actionType) => {
        var path = {};
		switch (actionType) {
			case "employeeInfo":
				path = {
					pathname: '/subMenuManager/employeeDetailNew',
					state: {
						id: this.state.employeeName,
						backPage: "wagesInfo",
						sendValue: [],
                        searchFlag: true,
                        actionType:"detail",
                        backbackPage: this.state.backPage,
					},
				}
				break;
			case "siteInfo":
				path = {
					pathname: '/subMenuManager/siteInfo',
					state: {
						employeeNo: this.state.employeeName,
						backPage: "wagesInfo",
						sendValue: [],
						searchFlag: true,
                        backbackPage: this.state.backPage,
					},
				}
				break;
			default:
		}
        this.props.history.push(path);
    }
    render() {
        const {
            employeeNo,
            employeeName,
            socialInsuranceFlag,
            salary,
            waitingCost,
            welfarePensionAmount,
            healthInsuranceAmount,
            insuranceFeeAmount,
            lastTimeBonusAmount,
            scheduleOfBonusAmount,
            bonusFlag,
            bonus,
            totalAmount,
            employeeFormCode,
            newEmployeeStatus,
            remark,
            raiseStartDate,
            costInfoShow,
            message,
            type,
            errorsMessageValue,
            actionType,
            socialInsuranceFlagDrop,
            bonusFlagDrop,
            EmployeeFormCodeDrop,
            wagesInfoList,
            employeeNameDrop,
            torokuText,
            expensesInfoModels,
            kadouCheck,
            leaderCheck,
            relatedEmployees,
            backPage ,
            hatsunyubaFlag ,
            deleteFlag } = this.state;
        //テーブルの列の選択
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,  // click to select, default is false
            clickToExpand: true,// click to expand row, default is false
            onSelect: this.handleRowSelect,
        };
        //テーブルの列の選択(詳細)
        const selectRowDetail = {
        };
        //テーブルの定義
        const options = {
            noDataText: (<i>データなし</i>),
            page: 1,  // which page you want to show as default
            sizePerPage: 8,  // which size per page you want to locate as default
            pageStartIndex: 1, // where to start counting the pages
            paginationSize: 3,  // the pagination bar size.
            prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
            expandRowBgColor: 'rgb(165, 165, 165)',
            paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
            hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
            expandRowBgColor: 'rgb(165, 165, 165)',
        };
        return (
            <div>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
                </div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <div id="Home">
                    <Modal
                        centered
                        backdrop="static"
                        onHide={this.handleHideModal}
                        show={costInfoShow}
                        dialogClassName="modal-expensesInfo">
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body >
                            <ExpensesInfo
                                kadouCheck={kadouCheck}
                                leaderCheck={leaderCheck}
                                relatedEmployees={relatedEmployees}
                                expensesInfoModels={expensesInfoModels}
                                employeeNo={employeeNo}
                                expensesInfoModel={this.state.expensesInfoModel}
                                expensesInfoToroku={this.getExpensesInfo} 
                                actionType={expensesInfoModels === this.state.allExpensesInfoList ? "detail" : "insert"}/>
                        </Modal.Body>
                    </Modal>
                    <Row inline="true">
                        <Col className="text-center">
                            <h2>給料情報</h2>
                        </Col>
                    </Row>
                    <br />
                    <Form id="wagesInfoForm">
                        <Form.Group>
                            <Row>
	                            <Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.employeeStatusChange.bind(this)} name="employeeStatus" value={this.state.employeeStatus} autoComplete="off">
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
                                            <InputGroup.Text>社員名</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Autocomplete
                                            id="employeeName"
                                            name="employeeName"
                                            value={this.state.employeeNameDrop.find(v => v.code === this.state.employeeName) || {}}
                                            options={this.state.employeeNameDrop}
                                            getOptionDisabled={(option) => option.name}
                                            getOptionLabel={(option) => option.text}
                                            onChange={(event, values) => this.getWagesInfo(event, values)}
                                            renderOption={(option) => {
                                                return (
                                                    <React.Fragment>
                                                        {option.name}
                                                    </React.Fragment>
                                                )
                                            }}
                                            renderInput={(params) => (
                                                <div ref={params.InputProps.ref}>
                                                    <input placeholder="  例：佐藤真一" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-wagesInfo-employeeName" />
                                                </div>
                                            )}
                                        />
                                        <font
                                            id="mark" color="red"
                                            className="site-mark">★</font>
                                    </InputGroup>
                                </Col>
                                <Col sm={5}></Col>
                                <Col sm={1}>
                                    <Button
                                        block
                                        size="sm"
                                        id="expensesInfoBtn"
                                        // disabled={actionType === "detail" ? true : false}
                                        onClick={this.handleShowModal}>
                                        諸費用</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>給料</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="7"
                                            value={salary}
                                            name="salary"
                                            onChange={this.valueChangeMoney}
                                            readOnly={kadouCheck}
                                            disabled={actionType === "detail" ? true : false}
                                            placeholder="例：220000" />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text style={{ width: "2rem" }}>円</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <font
                                            hidden={kadouCheck}
                                            id="mark" color="red"
                                            className="site-mark">★</font>{" "}
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="fiveKanji">非稼動費用</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="7"
                                            readOnly={!kadouCheck}
                                            disabled={actionType === "detail" ? true : false}
                                            name="waitingCost"
                                            value={waitingCost}
                                            onChange={this.valueChangeMoney}
                                            placeholder="例：220000" />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text style={{ width: "2rem" }}>円</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <font
                                            hidden={!kadouCheck}
                                            id="mark" color="red"
                                            className="site-mark">★</font>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>社会保険</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            disabled={actionType === "detail" ? true : kadouCheck === true ? true : employeeFormCode === "3" ? true : false}
                                            name="socialInsuranceFlag"
                                            id="socialInsuranceFlag"
                                            onChange={this.valueChangeInsurance}
                                            value={socialInsuranceFlag}>
                                            {socialInsuranceFlagDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="niKanji">厚生</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            readOnly
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}
                                            name="welfarePensionAmount"
                                            value={welfarePensionAmount} />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="niKanji">健康</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            readOnly
                                            disabled={actionType === "detail" ? true : false}
                                            name="healthInsuranceAmount"
                                            onChange={this.valueChange}
                                            value={healthInsuranceAmount} />
                                        <InputGroup.Prepend hidden>
                                            <InputGroup.Text id="niKanji">総額</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            readOnly
                                            onChange={this.valueChangeMoney}
                                            disabled={actionType === "detail" ? true : false}
                                            name="insuranceFeeAmount"
                                            value={insuranceFeeAmount}
                                            hidden />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col hidden>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>社員形式</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            onChange={this.employeeFormChange}
                                            disabled={actionType === "detail" ? true : false}
                                            name="employeeFormCode"
                                            value={employeeFormCode}>
                                            {EmployeeFormCodeDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
	                                <InputGroup size="sm" className="mb-3">
	                                    <InputGroup.Prepend>
	                                        <InputGroup.Text>社員区分</InputGroup.Text>
	                                    </InputGroup.Prepend>
	                                    <FormControl
	                                        as="select"
	                                        onChange={this.newEmployeeStatusChange}
	                                        disabled={actionType === "detail" ? true : false}
	                                        name="newEmployeeStatus"
	                                        value={newEmployeeStatus}>
	                                        {this.state.employeeStatuss.map(date =>
	                                            <option key={date.code} value={date.code}>
	                                                {date.name}
	                                            </option>
	                                        )}
	                                    </FormControl>
	                                </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>ボーナス</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            disabled={actionType === "detail" ? true : employeeFormCode === "3" ? true : false}
                                            name="bonusFlag"
                                            id="bonusFlag"
                                            onChange={this.valueChangeBonus}
                                            value={bonusFlag}>
                                            {bonusFlagDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text style={{ width: "7.5rem" }}>次ボーナス月</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <InputGroup.Append>
                                            <InputGroup.Prepend>
                                                <DatePicker
                                                    selected={this.state.bonusStartDate}
                                                    onChange={this.bonusChange}
                                                    autoComplete="off"
                                                    locale="pt-BR"
                                                    showMonthYearPicker
                                                    showFullMonthYearPicker
                                                    // minDate={new Date()}
                                                    showDisabledMonthNavigation
                                                    className="form-control form-control-sm"
                                                    id={actionType === "detail" ? "wagesInfoDatePickerReadOnly" : bonusFlag !== "1" ? "wagesInfoDatePickerReadOnly" : "wagesInfoDatePicker"}
                                                    name="nextBonusMonth"
                                                    dateFormat={"yyyy/MM"}
                                                    locale="ja"
                                                    readOnly={bonusFlag !== "1" ? true : false}
                                                    disabled={actionType === "detail" ? true : false}
                                                />
                                            </InputGroup.Prepend>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="sanKanji">前回額</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}
                                            name="lastTimeBonusAmount"
                                            maxLength="7"
                                            readOnly
                                            placeholder="例：400000"
                                            value={lastTimeBonusAmount === "" ? this.state.lastTimeBonusAmountForInsert : lastTimeBonusAmount} />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="sanKanji">予定額</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            readOnly={bonusFlag === "1" ? false : true}
                                            onChange={this.valueChangeMoney}
                                            disabled={actionType === "detail" ? true : false}
                                            name="scheduleOfBonusAmount"
                                            maxLength="8"
                                            placeholder="例：400000"
                                            value={scheduleOfBonusAmount} />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3}>
                                    <InputGroup size="sm">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="sixKanji">次回昇給月</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <InputGroup.Append>
                                            <DatePicker
                                                selected={raiseStartDate}
                                                onChange={this.raiseChange}
                                                autoComplete="off"
                                                locale="pt-BR"
                                                showMonthYearPicker
                                                showFullMonthYearPicker
                                                minDate={new Date(new Date().getFullYear(), new Date().getMonth())}
                                                showDisabledMonthNavigation
                                                className="form-control form-control-sm"
                                                id={actionType === "detail" ? "wagesInfoDatePicker-nextRaiseMonth-readOnly" : "wagesInfoDatePicker-nextRaiseMonth"}
                                                dateFormat={"yyyy/MM"}
                                                name="nextRaiseMonth"
                                                locale="ja"
                                                disabled={actionType === "detail" ? true : false}
                                            />
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>開始年月</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <InputGroup.Append>
                                            <DatePicker
                                                selected={this.state.reflectStartDate}
                                                onChange={this.reflectStartDateChange}
                                                dateFormat={"yyyy MM"}
                                                autoComplete="off"
                                                locale="pt-BR"
                                                showMonthYearPicker
                                                showFullMonthYearPicker
                                                // minDate={new Date()}
                                                showDisabledMonthNavigation
                                                className="form-control form-control-sm"
                                                id={actionType === "detail" ? "wagesInfoDatePicker-reflectYearAndMonth-readOnly" : "wagesInfoDatePicker-reflectYearAndMonth"}
                                                dateFormat={"yyyy/MM"}
                                                name="reflectYearAndMonth"
                                                locale="ja"
                                                disabled={actionType === "detail" ? true : false}
                                            /><font id="mark" color="red"
                                                className="site-mark">★</font>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>総額</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="7"
                                            readOnly
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}
                                            name="totalAmount"
                                            value={totalAmount} />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text style={{ width: "2rem" }}>円</InputGroup.Text>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>備考</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            name="remark"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}
                                            placeholder="例：XXXXX"
                                            value={remark} />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <div style={{ "textAlign": "center" }}>
                                <Button
                                    size="sm"
                                    disabled={actionType === "detail" ? true : false}
                                    variant="info"
                                    onClick={this.toroku}>
                                    <FontAwesomeIcon icon={faSave} />{torokuText}
                                </Button>{" "}
                                <Button
                                    size="sm"
                                    disabled={actionType === "detail" ? true : false}
                                    onClick={this.resetValue}
                                    variant="info"
                                    value="Reset" >
                                    <FontAwesomeIcon icon={faUndo} />リセット
                            </Button>{" "}
                                <Button
                                    size="sm"
                                    hidden={backPage === "" ? true : false}
                                    variant="info"
                                    onClick={this.back}
                                >
                                    <FontAwesomeIcon icon={faLevelUpAlt} />戻る
                            </Button>
                            </div>
                        </Form.Group>
                    </Form>
                    <Row>
                        <Col sm={4}>
                            <div style={{ "float": "left" }}>
                                <Button size="sm" onClick={this.shuseiTo.bind(this, "employeeInfo")} disabled={this.state.employeeName === "" ? true : false} variant="info" id="employeeInfo">個人情報</Button>{' '}
                                <Button size="sm" onClick={this.shuseiTo.bind(this, "siteInfo")} disabled={this.state.employeeName === "" ? true : false} variant="info" id="siteInfo">現場情報</Button>{' '}
                            </div>
                        </Col>
                        <Col sm={7}>
                        </Col>
                        <Col sm={1}>
                            <div style={{ "float": "right" }}>
                                <Button
                                    variant="info"
                                    size="sm"
                                    id="delete"
                                    onClick={this.delete}
                                    disabled={deleteFlag}
                                >
                                    <FontAwesomeIcon icon={faTrash} />削除
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <div>
                        <Col sm={12}>
                            <BootstrapTable
                                selectRow={selectRow}
                                pagination={true}
                                options={options}
                                data={wagesInfoList}
                                headerStyle={{ background: '#5599FF' }}
                                striped
                                hover
                                ref="wagesInfoTable"
                                condensed>
                                <TableHeaderColumn isKey={true} dataField='period' tdStyle={{ padding: '.45em' }} width='13%'>給料期間</TableHeaderColumn>
                                <TableHeaderColumn dataField='employeeFormName' tdStyle={{ padding: '.45em' }} width="10%">社員形式</TableHeaderColumn>
                                <TableHeaderColumn dataField='salary' tdStyle={{ padding: '.45em' }} width="100" width="10%" dataFormat={this.addMarkSalary}>給料</TableHeaderColumn>
                                <TableHeaderColumn dataField='insuranceFeeAmount' tdStyle={{ padding: '.45em' }} width="10%" dataFormat={this.addMarkInsuranceFeeAmount}>社会保険</TableHeaderColumn>
                                <TableHeaderColumn dataField='transportationExpenses' tdStyle={{ padding: '.45em' }} width="10%" dataFormat={this.addMarkTransportationExpenses}>交通代</TableHeaderColumn>
                                <TableHeaderColumn dataField='leaderAllowanceAmount' tdStyle={{ padding: '.45em' }} dataFormat={this.addMarkLeaderAllowanceAmount}　hidden >リーダー手当</TableHeaderColumn>
                                <TableHeaderColumn dataField='introductionAllowance' tdStyle={{ padding: '.45em' }} dataFormat={this.addMarkintroductionAllowance}　hidden >特別手当</TableHeaderColumn>
                                <TableHeaderColumn dataField='otherAllowanceName' tdStyle={{ padding: '.45em' }}　hidden >他の手当</TableHeaderColumn>
                                <TableHeaderColumn dataField='otherAllowanceAmount' tdStyle={{ padding: '.45em' }} width="10%" dataFormat={this.addMarkOtherAllowanceAmount}>手当合計</TableHeaderColumn>
                                <TableHeaderColumn dataField='scheduleOfBonusAmount' tdStyle={{ padding: '.45em' }} width="10%" dataFormat={this.addMarkScheduleOfBonusAmount}>ボーナス</TableHeaderColumn>
                                <TableHeaderColumn dataField='remark' tdStyle={{ padding: '.45em' }} width="27%" >備考</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </div>
                </div>
            </div>
        );
    }
}
export default WagesInfo;