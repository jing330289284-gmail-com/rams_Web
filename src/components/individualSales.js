import React, { Component } from 'react';
import { Row, Col, InputGroup, Button, Form, FormControl, Popover, OverlayTrigger, Table } from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
axios.defaults.withCredentials = true;
class individualSales extends React.Component {//個人売上検索
    state = {
        actionType: '',
        fiscalYear: '',
        employeeName: '',
        employeeNo: '',
        bpFlag: false,
        individualSales_startYearAndMonth: '',
        individualSales_endYearAndMonth: '',
        monthlySales_startYearAndMonth: '',
        monthlySales_endYearAndMonth: '',
        calStatus: '',
        dailyCalculationStatus: '',
        dailySalary: '',
        paymentTotalnoComma: '',
        unitPriceTotalnoComma: '',
    }

    constructor(props) {
        super(props);
        this.state = this.initialState;//初期化
        this.options = {
            sizePerPage: 12,
            pageStartIndex: 1,
            paginationSize: 2,
            prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
            hideSizePerPage: true,
            alwaysShowAllBtns: true,
            paginationShowsTotal: this.renderShowsTotal,
        }
    }
    initialState = {
        employeeInfo: store.getState().dropDown[9].slice(1),
        workingEmployeeInfo: store.getState().dropDown[79].slice(1),
        notWorkingEmployeeInfo: store.getState().dropDown[80].slice(1),
		employeeInfoAll: store.getState().dropDown[9].slice(1),
		employeeStatuss: store.getState().dropDown[4],
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
        textcolorCheck: '',
        employeeName: '',
        employeeNo: '',
        employeeStatus: '',
        kadou: '',
        individualSales_startYearAndMonth: '',
        individualSales_endYearAndMonth: '',
        fiscalYear: '',
        backPage:'',
        sendFlag:'',
        utilPricefront:'',
        utilPriceback:'',
    }


    searchEmployee = () => {

        const empInfo = {
            employeeName: this.state.employeeName,
            fiscalYear: this.state.fiscalYear,
            startYearAndMonth: publicUtils.formateDate(this.state.individualSales_startYearAndMonth, false),
            endYearAndMonth: publicUtils.formateDate(this.state.individualSales_endYearAndMonth, false),
            status: "0",
        };

        axios.post(this.state.serverIP + "personalSales/searchEmpDetails", empInfo)
            .then(response => {
                if (response.data.errorsMessage != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
                    this.setState({ employeeInfoList: [] });
                } else if (response.data.noData != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.noData });
                    this.setState({ employeeInfoList: [] });
                    this.setState({ workMonthCount: '' })
                    this.setState({ unitPriceTotal: '' })
                    this.setState({ paymentTotal: '' })
                    this.setState({ totalgrosProfits: '' })
                }
                else {
                    this.setState({ "errorsMessageShow": false })
                    this.setState({ employeeInfoList: response.data.data })
                    this.setState({ workMonthCount: this.state.employeeInfoList[0].workMonthCount })
                    this.feeTotal();
                    this.unitPriceTotalCal(response.data.data);


                }
            }).catch((error) => {
                console.error("Error - " + error);
            });
    }
    yearAndMonthChange = event => {
        if (this.state.employeeName !== '') {
            this.setState({ individualSales_endYearAndMonth: '' })
            this.setState({ individualSales_startYearAndMonth: '' })
            this.setState({
                [event.target.name]: event.target.value
            }, () => this.searchEmployee())
        } else {
            this.setState({ individualSales_endYearAndMonth: '' })
            this.setState({ individualSales_startYearAndMonth: '' })
            this.setState({
                [event.target.name]: event.target.value
            })
        }


    }

    //onchange
    valueChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })

    }

    back = () => {
		var path = {};
		path = {
			pathname: this.state.backPage,
            state: {
            sendFlag :true,
            monthlySales_startYearAndMonth: this.state.individualSales_startYearAndMonth,
            monthlySales_endYearAndMonth:this.state.individualSales_endYearAndMonth,
            employeeClassification:this.state.employeeClassification === "" ? undefined :this.state.employeeClassification,
            employeeFormCodes:this.state.employeeFormCodes === "" ? undefined :this.state.employeeFormCodes,
            occupationCodes:this.state.occupationCodes === "" ? undefined :this.state.occupationCodes,
            kadou:this.state.kadou === "" ? undefined :this.state.kadou,
            utilPricefront:this.state.utilPricefront === "" ? undefined :this.state.utilPricefront,
            utilPriceback: this.state.utilPriceback === "" ? undefined :this.state.utilPriceback,
            salaryfront:this.state.salaryfront === "" ? undefined :this.state.salaryfront,
            salaryback:this.state.salaryback === "" ? undefined :this.state.salaryback,
            grossProfitFront:this.state.grossProfitFront === "" ? undefined :this.state.grossProfitFront,
            grossProfitBack:this.state.grossProfitBack === "" ? undefined :this.state.grossProfitBack,
          
		}   	
	}
    this.props.history.push(path);
}
    feeTotal = () => {
        var totalgrosProfits = 0;
        var paymentTotal = 0;
        var paymentCal = 0;
        for (var i = 0; i < this.state.employeeInfoList.length; i++) {
            paymentCal = parseInt(this.state.employeeInfoList[i].salary) + parseInt(this.state.employeeInfoList[i].transportationExpenses) + parseInt(this.state.employeeInfoList[i].insuranceFeeAmount) + parseInt(this.state.employeeInfoList[i].bonusFee) + parseInt(this.state.employeeInfoList[i].deductionsAndOvertimePay) + parseInt(this.state.employeeInfoList[i].leaderAllowanceAmount) + parseInt(this.state.employeeInfoList[i].otherAllowanceAmount) + parseInt(this.state.employeeInfoList[i].introductionAllowance)
            paymentTotal = parseInt(paymentTotal) + paymentCal
        }
        //this.setState({ totalgrosProfits: publicUtils.addComma(unitPriceTotal-paymentTotal, false) })
        this.setState({ paymentTotal: publicUtils.addComma(paymentTotal, false) })
        this.setState({ paymentTotalnoComma: paymentTotal })
    }
    
    clickButtonDisabled = () => {
        $('button[name="backToMonthly"]').prop('disabled', true);
    };
    
    setValue = () => {
    	let employeeInfoAll = [];
    	for(let i in this.state.employeeInfoAll){
    		if(this.state.employeeInfoAll[i].code.search("BPR") === -1){
        		employeeInfoAll.push(this.state.employeeInfoAll[i]);
    		}
    	}
    	
    	let employeeStatuss = [];
    	for(let i in this.state.employeeStatuss){
    		if(this.state.employeeStatuss[i].code !== "4"){
    			employeeStatuss.push(this.state.employeeStatuss[i]);
    		}
    	}
    	
    	this.setState({
    		employeeInfo: employeeInfoAll,
    		employeeInfoAll: employeeInfoAll,
    		employeeStatuss: employeeStatuss,
    	})
    }
    componentDidMount() {
        this.setValue();
    	this.clickButtonDisabled();  
        var date = new Date();
        var year = date.getFullYear();
        $('#fiscalYear').append('<option value="">' + "" + '</option>');
        for (var i = year - 1; i <= year + 1; i++) {
            $('#fiscalYear').append('<option value="' + i + '">' + i + '</option>');
        }
		if (this.props.location.state !== undefined) {
			if (this.props.location.state.sendValue !== undefined) {
	            var sendValue = this.props.location.state.sendValue;
	            this.setState({
	    			fiscalYear: sendValue.fiscalYear,
	    			kadou: sendValue.kadou,
	    			employeeStatus: sendValue.employeeStatus,
	    			employeeName: sendValue.employeeName,
	    			individualSales_startYearAndMonth: sendValue.individualSales_startYearAndMonth,
	    			individualSales_endYearAndMonth: sendValue.individualSales_endYearAndMonth,
	    			employeeInfoList: sendValue.employeeInfoList,
	    			workMonthCount: sendValue.workMonthCount,
	    			unitPriceTotal: sendValue.unitPriceTotal,
	    			paymentTotal: sendValue.paymentTotal,
					employeeNo: sendValue.employeeNo,
					employeeInfo: sendValue.employeeInfo,
	            }, () =>
                	this.searchEmployee()
	            );
			}else{
		        const { location } = this.props
		        var actionType = '';
		        var backPage ='';
		        var monthlySales_startYearAndMonth = '';
		        var monthlySales_endYearAndMonth = '';
		        var rowSelectemployeeNo = '';
		        var rowSelectemployeeName = '';
		        var utilPricefront ='';
		        var utilPriceback ='';
		        var salaryfront='';
		        var salaryback ='';
		        var grossProfitFront='';
		        var grossProfitBack='';
		        var employeeClassification='';
		        if (location.state) {
		            actionType = location.state.actionType;
		            backPage= location.state.backPage;
		            this.setState({backPage:backPage});
		            sessionStorage.setItem('actionType', actionType);
		            monthlySales_startYearAndMonth = location.state.monthlySales_startYearAndMonth;
		            monthlySales_endYearAndMonth = location.state.monthlySales_endYearAndMonth;
		            rowSelectemployeeNo = location.state.rowSelectemployeeNo;
		            rowSelectemployeeName = location.state.rowSelectemployeeName;
		            utilPricefront =location.state.utilPricefront;
		            utilPriceback =location.state.utilPriceback;
		            salaryfront =location.state.salaryfront;
		            salaryback =location.state.salaryback;
		            grossProfitFront =location.state.grossProfitFront;
		            grossProfitBack =location.state.grossProfitBack;
		            $('#backToMonthly').removeClass('disabled');
		            this.setState({
		                individualSales_startYearAndMonth: monthlySales_startYearAndMonth,
		                individualSales_endYearAndMonth: monthlySales_endYearAndMonth,
		                employeeName: rowSelectemployeeName + "(" + rowSelectemployeeNo + ")",
		                utilPricefront:utilPricefront,
		                utilPriceback:utilPriceback,
		                salaryfront:salaryfront,
		                salaryback:salaryback,
		                grossProfitFront:grossProfitFront,
		                grossProfitBack:grossProfitBack,
		            }, () =>
		                this.searchEmployee()
		            );
		        }else{
		            $('#backToMonthly').addClass('disabled');
		        }
			}
		}
    }
    individualSalesStartYearAndMonthChange = date => {
        if (this.state.employeeName !== '') {
            if (date !== null) {
                if(this.state.individualSales_endYearAndMonth!==''){
                    this.setState({
                        individualSales_startYearAndMonth: date,
                        fiscalYear: '',
                    }, () =>
                        this.searchEmployee());
                }
                else{
                    this.setState({
                        individualSales_startYearAndMonth: date,
                        fiscalYear: '',
                    });   
                }
                
            } else {
                this.setState({
                    individualSales_startYearAndMonth: date,
                    fiscalYear: '',
                });
            }
        } else {
            if (date !== null) {
                this.setState({
                    individualSales_startYearAndMonth: date,
                    fiscalYear: '',
                });
            } else {
                this.setState({
                    individualSales_startYearAndMonth: '',

                });
            }
        }
    };

    individualSalesEndYearAndMonthChange = date => {
        if (this.state.employeeName !== '') {
            if (date !== null) {
                if(this.state.individualSales_startYearAndMonth!==''){
                    this.setState({
                        individualSales_endYearAndMonth: date,
                        fiscalYear: '',
                    }, () =>
                        this.searchEmployee());
                }else{
                    this.setState({
                        individualSales_endYearAndMonth: date,
                        fiscalYear: '',
                    });
                }
                
            } else {
                this.setState({
                    individualSales_endYearAndMonth: date,
                    fiscalYear: '',
                });
            }

        } else {
            if (date !== null) {
                this.setState({
                    individualSales_endYearAndMonth: date,
                    fiscalYear: '',
                });
            } else {
                this.setState({
                    individualSales_endYearAndMonth: '',
                });
            }
        }
    };

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
                {start}から  {to}まで , 総計{total}
            </p>
        );
    }
    unitPriceAddComma(cell, row) {
        if (row.unitPrice === null) {
            return
        } else {

            let formatUprice = publicUtils.addComma(row.unitPrice, false);
            return formatUprice;
        }
    }

    salaryAddComma(cell, row) {
        if (row.salary === null || row.salary === "0") {
            return
        } else {
            let formatSalary = publicUtils.addComma(row.salary, false);
            return formatSalary;
        }

    }
    deductionsAndOvertimePayOfUnitPriceAddComma(cell, row) {
        if (row.deductionsAndOvertimePayOfUnitPrice === null || row.deductionsAndOvertimePayOfUnitPrice === "0") {
            return
        } else {
            let formatDeductionsAndOvertimePayOfUnitPrice = publicUtils.addComma(row.deductionsAndOvertimePayOfUnitPrice, false);
            if (row.deductionsAndOvertimePayOfUnitPrice < 0) {
                return (<div style={{ color: 'red' }}>{formatDeductionsAndOvertimePayOfUnitPrice}</div>);
            }
            return formatDeductionsAndOvertimePayOfUnitPrice;
        }
    }

    insuranceFeeAmountAddComma(cell, row) {
        if (row.insuranceFeeAmount === null || row.insuranceFeeAmount === "0") {
            return
        } else {
            let formatInsuranceFeeAmount = publicUtils.addComma(row.insuranceFeeAmount, false);
            return formatInsuranceFeeAmount;
        }
    }

    scheduleOfBonusAmountAddComma(cell, row) {
        if (row.bonusFee === null || row.bonusFee === "0") {
            return
        } else {
            let formatScheduleOfBonusAmount = publicUtils.addComma(row.bonusFee, false);
            return formatScheduleOfBonusAmount;
        }
    }

    deductionsAndOvertimePayAddComma = (cell, row) => {
        if (row.deductionsAndOvertimePay === null || row.deductionsAndOvertimePay === "0") {
            return
        } else {
            let formatDeductionsAndOvertimePay = publicUtils.addComma(row.deductionsAndOvertimePay, false);
            if (row.deductionsAndOvertimePay < 0) {
                return (<div style={{ color: 'red' }}>{formatDeductionsAndOvertimePay}</div>);
            } else {
                return formatDeductionsAndOvertimePay;
            }
        }
    }

    AllowanceAmountAddComma(cell, row) {
        if (row.allowanceAmount === null || row.allowanceAmount === "0") {
            return
        } else {
            let formatAllowanceAmount = publicUtils.addComma(row.allowanceAmount, false);
            return formatAllowanceAmount;
        }
    }

    grosProfitsAddComma(cell, row) {
        if (row.grosProfits === null || row.grosProfits === "0") {
            return
        } else {
            var holidayCount = 0;
            var workdayCount = 0;
            var totalholidayCount = 0;
            var totalworkdayCount = 0;
            if (row.dailyCalculationStatus == "0") {
                if (row.admissionStartDate.substring(0, 6) == row.onlyYandM) {
                    if (row.admissionStartDate.substring(6, 8) == "01") {
                        let returnItem = cell;
                        returnItem = publicUtils.addComma(row.grosProfits, false);
                        if (row.grosProfits < 0) {
                            return (<div style={{ color: 'red' }}>{returnItem}</div>);
                        }
                        if (returnItem == 0) {
                            returnItem = '';
                        }
                        return returnItem;

                    }
                    var monthDayCount = new Date(row.admissionStartDate.substring(0, 4), row.admissionStartDate.substring(4, 6), 0).getDate();
                    var a = row.admissionStartDate.substring(0, 4);
                    var b = row.admissionStartDate.substring(4, 6);
                    for (var i = row.admissionStartDate.substring(6, 8); i <= monthDayCount; i++) {
                        if (i < 10) {
                            i = "0" + i
                        }
                        if (publicUtils.isHoliday(row.admissionStartDate.substring(0, 4), row.admissionStartDate.substring(4, 6), i)) {
                            holidayCount++;
                        }
                        else {
                            workdayCount++;
                        }
                    }
                    for (var j = 1; j <= monthDayCount; j++) {
                        if (j < 10) {
                            j = "0" + j
                        }
                        if (publicUtils.isHoliday(row.admissionStartDate.substring(0, 4), row.admissionStartDate.substring(4, 6), j)) {
                            totalholidayCount++;
                        }
                        else {
                            totalworkdayCount++;
                        }
                    }
                    var dailySalary = parseInt(workdayCount / totalworkdayCount * row.unitPrice)

                    var dailySalayCal = dailySalary

                    var calgrosProfits = parseInt(dailySalayCal) + parseInt(row.deductionsAndOvertimePayOfUnitPrice) - (parseInt(row.salary) + parseInt(row.insuranceFeeAmount) + parseInt(row.bonusFee) + parseInt(row.allowanceAmount) + parseInt(row.deductionsAndOvertimePay))
                    let returnItem = cell;
                    returnItem = publicUtils.addComma(calgrosProfits, false);
                    if (calgrosProfits < 0) {
                        return (<div style={{ color: 'red' }}>{returnItem}</div>);
                    }
                    if (returnItem == 0) {
                        returnItem = '';
                    }
                    return returnItem;
                }
                if (row.admissionEndDate !== null && row.admissionEndDate.substring(0, 6) === row.onlyYandM) {
                    var monthDayCount = new Date(row.admissionEndDate.substring(0, 4), row.admissionEndDate.substring(4, 6), 0).getDate();
                    if (row.admissionEndDate.substring(6, 8) === monthDayCount) {
                        let returnItem = cell;
                        returnItem = publicUtils.addComma(row.grosProfits, false);
                        if (row.grosProfits < 0) {
                            return (<div style={{ color: 'red' }}>{returnItem}</div>);
                        }
                        if (returnItem == 0) {
                            returnItem = '';
                        }
                        return returnItem;

                    }
                    else {
                        for (var i = 0; i <= row.admissionEndDate.substring(6, 8); i++) {
                            if (i < 10) {
                                i = "0" + i
                            }
                            if (publicUtils.isHoliday(row.admissionEndDate.substring(0, 4), row.admissionEndDate.substring(4, 6), i)) {
                                holidayCount++;
                            }
                            else {
                                workdayCount++;
                            }
                        }
                        for (var j = 1; j <= monthDayCount; j++) {
                            if (j < 10) {
                                j = "0" + j
                            }
                            if (publicUtils.isHoliday(row.admissionEndDate.substring(0, 4), row.admissionEndDate.substring(4, 6), j)) {
                                totalholidayCount++;
                            }
                            else {
                                totalworkdayCount++;
                            }
                        }
                        var dailySalary = parseInt(workdayCount / totalworkdayCount * row.unitPrice)
                        var dailySalayCal = dailySalary
                        var calgrosProfits = parseInt(dailySalayCal) + parseInt(row.deductionsAndOvertimePayOfUnitPrice) - (parseInt(row.salary) + parseInt(row.insuranceFeeAmount) + parseInt(row.bonusFee) + parseInt(row.allowanceAmount) + parseInt(row.deductionsAndOvertimePay))
                        let returnItem = cell;
                        returnItem = publicUtils.addComma(calgrosProfits, false);
                        if (calgrosProfits < 0) {
                            return (<div style={{ color: 'red' }}>{returnItem}</div>);
                        }
                        if (returnItem == 0) {
                            returnItem = '';
                        }
                        return returnItem;
                    }
                }
                else {
                    var dailySalary = row.grosProfits
                    let returnItem = cell;
                    returnItem = publicUtils.addComma(dailySalary, false);
                    if (dailySalary < 0) {
                        return (<div style={{ color: 'red' }}>{returnItem}</div>);
                    }
                    if (returnItem == 0) {
                        returnItem = '';
                    }
                    return returnItem;
                }

            }

            else {
                var dailySalary = row.grosProfits
                let returnItem = cell;
                returnItem = publicUtils.addComma(dailySalary, false);
                if (dailySalary < 0) {
                    return (<div style={{ color: 'red' }}>{returnItem}</div>);
                }
                if (returnItem == 0) {
                    returnItem = '';
                }
                return returnItem;
            }
        }
    }

    handleTag = (event, values) => {
    	let bpFlag = false;
    	if (this.state.fiscalYear !== '' || (this.state.individualSales_startYearAndMonth !== '' && this.state.individualSales_endYearAndMonth !== '')) {
            if (values != null) {
            	if(String(values.code).search("BP") !== -1){
            		bpFlag = true;
            	}
                this.setState({
                    employeeName: values.name,
                    employeeNo: values.code,
                    bpFlag: bpFlag,
                }, () =>
                    this.searchEmployee())

            } else {
                this.setState({
                    employeeName: '',
                    employeeNo: '',
                    bpFlag: bpFlag,
                })
            }
        } else {
            if (values != null) {
            	if(String(values.code).search("BP") !== -1){
            		bpFlag = true;
            	}
                this.setState({
                    employeeName: values.name,
                    employeeNo: values.code,
                    bpFlag: bpFlag,
                })

            } else {
                this.setState({
                    employeeName: '',
                    employeeNo: '',
                    bpFlag: bpFlag,
                })
            }

        }
    }
    
	kadouChange = event => {
		let value = event.target.value;
		let employeeInfoList = this.state.employeeInfoAll;
		let tempEmployeeList = [];
		if(this.state.employeeStatus !== ""){
			if(this.state.employeeStatus === '0'){
				for(let i in employeeInfoList){
					if(employeeInfoList[i].code.substring(0,2) !== "BP" && employeeInfoList[i].code.substring(0,2) !== "SP" && employeeInfoList[i].code.substring(0,2) !== "SC"){
						tempEmployeeList.push(employeeInfoList[i]);
					}
				}
			} else if (this.state.employeeStatus === '1') {
				for(let i in employeeInfoList){
					if(employeeInfoList[i].code.substring(0,2) === "BP"){
						tempEmployeeList.push(employeeInfoList[i]);
					}
				}
			} else if (this.state.employeeStatus === '2') {
				for(let i in employeeInfoList){
					if(employeeInfoList[i].code.substring(0,2) === "SP"){
						tempEmployeeList.push(employeeInfoList[i]);
					}
				}
			} else if (this.state.employeeStatus === '3') {
				for(let i in employeeInfoList){
					if(employeeInfoList[i].code.substring(0,2) === "SC"){
						tempEmployeeList.push(employeeInfoList[i]);
					}
				}
			} else if (this.state.employeeStatus === '4') {
				for(let i in employeeInfoList){
					if(employeeInfoList[i].code.substring(0,3) === "BPR"){
						tempEmployeeList.push(employeeInfoList[i]);
					}
				}
			} else if (this.state.employeeStatus === '5') {
				for(let i in employeeInfoList){
					if(!(employeeInfoList[i].code.substring(0,2) === "BP")){
						tempEmployeeList.push(employeeInfoList[i]);
					}
				}
			}
		}
		else{
			for(let i in employeeInfoList){
				tempEmployeeList.push(employeeInfoList[i]);
			}
		}
		
		let workingEmployeeInfo = this.state.workingEmployeeInfo;
		let notWorkingEmployeeInfo = this.state.notWorkingEmployeeInfo;
		if(value === '0'){
			let newEmpInfoList = [];
			for(let i in tempEmployeeList){
				for(let j in workingEmployeeInfo){
					if(workingEmployeeInfo[j].code === tempEmployeeList[i].code){
						newEmpInfoList.push(tempEmployeeList[i]);
						break;
					}
				}
			}
			this.setState({ employeeInfo: newEmpInfoList , employeeName: "" });
		}
		else if(value === '1'){
			let newEmpInfoList = [];
			for(let i in tempEmployeeList){
				for(let j in notWorkingEmployeeInfo){
					if(notWorkingEmployeeInfo[j].code === tempEmployeeList[i].code){
						newEmpInfoList.push(tempEmployeeList[i]);
						break;
					}
				}
			}
			this.setState({ employeeInfo: newEmpInfoList , employeeName: "" });
		} else {
			this.setState({ employeeInfo: tempEmployeeList });
		}
		this.setState({ kadou: value });
	}
    
	/**
	 * タイプが違う時に、色々な操作をします。
	 */
	employeeStatusChange = event => {
		let value = event.target.value;
		let employeeInfoList = this.state.employeeInfoAll;
		let tempEmployeeList = [];
		if(this.state.kadou !== ""){
			let workingEmployeeInfo = this.state.workingEmployeeInfo;
			let notWorkingEmployeeInfo = this.state.notWorkingEmployeeInfo;
			if(this.state.kadou === '0'){
				for(let i in employeeInfoList){
					for(let j in workingEmployeeInfo){
						if(workingEmployeeInfo[j].code === employeeInfoList[i].code){
							tempEmployeeList.push(employeeInfoList[i]);
							break;
						}
					}
				}
			}
			else if(this.state.kadou === '1'){
				for(let i in employeeInfoList){
					for(let j in notWorkingEmployeeInfo){
						if(notWorkingEmployeeInfo[j].code === employeeInfoList[i].code){
							tempEmployeeList.push(employeeInfoList[i]);
							break;
						}
					}
				}
			} 
		}else{
			for(let i in employeeInfoList){
				tempEmployeeList.push(employeeInfoList[i]);
			}
		}
		
		if(value === '0'){
			let newEmpInfoList = [];
			for(let i in tempEmployeeList){
				if(tempEmployeeList[i].code.substring(0,2) !== "BP" && tempEmployeeList[i].code.substring(0,2) !== "SP" && tempEmployeeList[i].code.substring(0,2) !== "SC"){
					newEmpInfoList.push(tempEmployeeList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList , employeeName: "" });
		} else if (value === '1') {
			let newEmpInfoList = [];
			for(let i in tempEmployeeList){
				if(tempEmployeeList[i].code.substring(0,2) === "BP"){
					newEmpInfoList.push(tempEmployeeList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList , employeeName: "" });
		} else if (value === '2') {
			let newEmpInfoList = [];
			for(let i in tempEmployeeList){
				if(tempEmployeeList[i].code.substring(0,2) === "SP"){
					newEmpInfoList.push(tempEmployeeList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList, employeeName: ""  });
		} else if (value === '3') {
			let newEmpInfoList = [];
			for(let i in tempEmployeeList){
				if(tempEmployeeList[i].code.substring(0,2) === "SC"){
					newEmpInfoList.push(tempEmployeeList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList, employeeName: ""  });
		} else if (value === '4') {
			let newEmpInfoList = [];
			for(let i in tempEmployeeList){
				if(tempEmployeeList[i].code.substring(0,3) === "BPR"){
					newEmpInfoList.push(tempEmployeeList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList , employeeName: "" });
		} else if (value === '5') {
			let newEmpInfoList = [];
			for(let i in tempEmployeeList){
				if(!(tempEmployeeList[i].code.substring(0,2) === "BP")){
					newEmpInfoList.push(tempEmployeeList[i]);
				}
			}
			this.setState({ employeeInfo: newEmpInfoList, employeeName: ""  });
		} else {
			this.setState({ employeeInfo: tempEmployeeList });
		}
		this.setState({ employeeStatus: value });
	}

    workDaysCal = (cell, row) => {
        var holidayCount = 0;
        var workdayCount = 0;
        var totalholidayCount = 0;
        var totalworkdayCount = 0;
        if (row.dailyCalculationStatus == "0") {
            if (row.admissionStartDate.substring(0, 6) == row.onlyYandM) {
                if (row.admissionStartDate.substring(6, 8) == "01") {
                    var dailySalayCal = parseInt(row.unitPrice)
                    var addComma = publicUtils.addComma(dailySalayCal, false);
                    let returnItem = cell;
                    returnItem = addComma;
                    if (returnItem == 0) {
                        returnItem = '';
                    }
                    return returnItem;

                }
                var monthDayCount = new Date(row.admissionStartDate.substring(0, 4), row.admissionStartDate.substring(4, 6), 0).getDate();
                var a = row.admissionStartDate.substring(0, 4);
                var b = row.admissionStartDate.substring(4, 6);
                for (var i = row.admissionStartDate.substring(6, 8); i <= monthDayCount; i++) {
                    if (i < 10) {
                        i = "0" + i
                    }
                    if (publicUtils.isHoliday(row.admissionStartDate.substring(0, 4), row.admissionStartDate.substring(4, 6), i)) {
                        holidayCount++;
                    }
                    else {
                        workdayCount++;
                    }
                }
                for (var j = 1; j <= monthDayCount; j++) {
                    if (j < 10) {
                        j = "0" + j
                    }
                    if (publicUtils.isHoliday(row.admissionStartDate.substring(0, 4), row.admissionStartDate.substring(4, 6), j)) {
                        totalholidayCount++;
                    }
                    else {
                        totalworkdayCount++;
                    }
                }
                var dailySalary = parseInt(workdayCount / totalworkdayCount * row.unitPrice)

                var dailySalayCal = dailySalary

                var addC = publicUtils.addComma(dailySalayCal, false)
                var addComma = <div>{addC}<font color="red">(日割)</font></div>
                let returnItem = cell;
                returnItem = addComma;
                if (returnItem == 0) {
                    returnItem = '';
                }
                return returnItem;
            }
            if (row.admissionEndDate !== null && row.admissionEndDate.substring(0, 6) === row.onlyYandM) {
                var monthDayCount = new Date(row.admissionEndDate.substring(0, 4), row.admissionEndDate.substring(4, 6), 0).getDate();
                var endDate = parseInt(row.admissionEndDate.substring(6, 8))
                if (endDate === monthDayCount) {
                    var salary = publicUtils.addComma(row.unitPrice, false)
                    let returnItem = cell;
                    returnItem = salary;
                    if (returnItem == 0) {
                        returnItem = '';
                    }
                    return returnItem;

                }
                else {

                    for (var i = 1; i <= row.admissionEndDate.substring(6, 8); i++) {
                        if (i < 10) {
                            i = "0" + i
                        }
                        if (publicUtils.isHoliday(row.admissionEndDate.substring(0, 4), row.admissionEndDate.substring(4, 6), i)) {
                            holidayCount++;
                        }
                        else {
                            workdayCount++;
                        }
                    }
                    for (var j = 1; j <= monthDayCount; j++) {
                        if (j < 10) {
                            j = "0" + j
                        }
                        if (publicUtils.isHoliday(row.admissionEndDate.substring(0, 4), row.admissionEndDate.substring(4, 6), j)) {
                            totalholidayCount++;
                        }
                        else {
                            totalworkdayCount++;
                        }
                    }
                    var dailySalay = parseInt(workdayCount / totalworkdayCount * row.unitPrice)

                    var addC = publicUtils.addComma(dailySalay, false);
                    var addComma = <div>{addC}<font color="red">(日割)</font></div>
                    let returnItem = cell;
                    returnItem = addComma;
                    if (returnItem == 0) {
                        returnItem = '';
                    }
                    return returnItem;
                }
            }
            else {

                var dailySalay = row.unitPrice

                var dailySalay = publicUtils.addComma(dailySalay, false)
                let returnItem = cell;
                returnItem = dailySalay;
                if (returnItem == 0) {
                    returnItem = '';
                }
                return returnItem;
            }

        }

        else {

            var dailySalay = row.unitPrice

            var dailySalay = publicUtils.addComma(dailySalay, false)
            let returnItem = cell;
            var date = new Date;
            var month = date.getMonth() + 1;
            var yearAndMonth = String(date.getFullYear()) + String(month.toString()[1] ? month : "0" + month);
            if(row.onlyYandM > yearAndMonth && dailySalay != 0)
            	dailySalay += "(予)";
            returnItem = dailySalay;
            if (returnItem == 0) {
                returnItem = '';
            }
            return returnItem;
        }

    }

    unitPriceTotalCal = (empList) => {

        var unitPriceTotal = 0;
        var dailySalary = 0;
        var totalunitPrice = 0;
        for (var m = 0; m < empList.length; m++) {
            var holidayCount = 0;
            var workdayCount = 0;
            var totalholidayCount = 0;
            var totalworkdayCount = 0;
            var startDate = empList[m].admissionStartDate;
            var endDate = empList[m].admissionEndDate;
            var unPrice = empList[m].unitPrice;
            if (empList[m].unitPrice == null) {
                unPrice = 0;
            }
            if (empList[m].unitPrice == "") {
                unPrice = 0;
            }
            var deductionsAndOver = empList[m].deductionsAndOvertimePayOfUnitPrice;

            if (empList[m].dailyCalculationStatus == "0") {
                if (startDate.substring(0, 6) == empList[m].onlyYandM) {
                    if (startDate.substring(6, 8) == "01") {
                        if (deductionsAndOver != null) {
                            unitPriceTotal = parseInt(unitPriceTotal) + parseInt(unPrice) + parseInt(deductionsAndOver)
                        } else {
                            unitPriceTotal = parseInt(unitPriceTotal) + parseInt(unPrice)
                        }

                    }
                    else {
                        var monthDayCount = new Date(startDate.substring(0, 4), startDate.substring(4, 6), 0).getDate();
                        for (var i = startDate.substring(6, 8); i <= monthDayCount; i++) {
                            if (i < 10) {
                                i = "0" + i
                            }
                            if (publicUtils.isHoliday(startDate.substring(0, 4), startDate.substring(4, 6), i)) {
                                holidayCount++;
                            }
                            else {
                                workdayCount++;
                            }
                        }
                        for (var j = 1; j <= monthDayCount; j++) {
                            if (j < 10) {
                                j = "0" + j
                            }
                            if (publicUtils.isHoliday(startDate.substring(0, 4), startDate.substring(4, 6), j)) {
                                totalholidayCount++;
                            }
                            else {
                                totalworkdayCount++;
                            }
                        }
                        dailySalary = parseInt(workdayCount / totalworkdayCount * unPrice)
                        if (deductionsAndOver != null) {
                            var dailySalayCal = parseInt(dailySalary) + parseInt(deductionsAndOver);
                            unitPriceTotal = parseInt(unitPriceTotal) + parseInt(dailySalayCal)
                        } else {
                            var dailySalayCal = parseInt(dailySalary)
                            unitPriceTotal = parseInt(unitPriceTotal) + parseInt(dailySalayCal)
                        }


                    }
                }
                if (endDate!==null&&startDate.substring(0,6)!==endDate.substring(0, 6) &&endDate.substring(0, 6) == empList[m].onlyYandM) {
                    var monthDayCount = new Date(endDate.substring(0, 4), endDate.substring(4, 6), 0).getDate();
                    if (endDate.substring(6, 8) == monthDayCount) {
                        unitPriceTotal = parseInt(unitPriceTotal) + parseInt(unPrice)
                    }
                    else {
                        for (var i = 0; i <= endDate.substring(6, 8); i++) {
                            if (i < 10) {
                                i = "0" + i
                            }
                            if (publicUtils.isHoliday(endDate.substring(0, 4), endDate.substring(4, 6), i)) {
                                holidayCount++;
                            }
                            else {
                                workdayCount++;
                            }
                        }
                        for (var j = 1; j <= monthDayCount; j++) {
                            if (j < 10) {
                                j = "0" + j
                            }
                            if (publicUtils.isHoliday(endDate.substring(0, 4), endDate.substring(4, 6), j)) {
                                totalholidayCount++;
                            }
                            else {
                                totalworkdayCount++;
                            }
                        }
                        dailySalary = parseInt(workdayCount / totalworkdayCount * unPrice)
                        var dailySalarys
                        if (deductionsAndOver != null) {
                            dailySalarys = parseInt(dailySalary) + parseInt(deductionsAndOver);
                            unitPriceTotal = parseInt(unitPriceTotal) + parseInt(dailySalarys)
                        } else {

                            unitPriceTotal = parseInt(unitPriceTotal) + parseInt(dailySalary)
                        }
                    }
                }
                if (startDate.substring(0, 6) != empList[m].onlyYandM && endDate.substring(0, 6) != empList[m].onlyYandM) {

                    if (deductionsAndOver != null) {
                        dailySalary = parseInt(unPrice) + parseInt(deductionsAndOver);
                        unitPriceTotal = parseInt(unitPriceTotal) + parseInt(dailySalary)
                    } else {
                        dailySalary = parseInt(unPrice)
                        unitPriceTotal = parseInt(unitPriceTotal) + parseInt(dailySalary)
                    }

                }
            }
            else if (empList[m].dailyCalculationStatus == "1") {

                if (deductionsAndOver != null) {
                    dailySalary = parseInt(unPrice) + parseInt(deductionsAndOver);
                    unitPriceTotal = parseInt(unitPriceTotal) + parseInt(dailySalary)
                } else {
                    dailySalary = parseInt(unPrice)
                    unitPriceTotal = parseInt(unitPriceTotal) + parseInt(dailySalary)
                }

            }


        }
        this.setState({ unitPriceTotal: publicUtils.addComma(unitPriceTotal, false) })
        this.setState({ unitPriceTotalnoComma: unitPriceTotal })

    }
    
    bpBelongCustomerDetail = (cell, row) => {
    	if(cell === null || cell === "" || cell === undefined){
    		return "";
    	}
    	else{
    		return store.getState().dropDown[53].slice(1).find(v => v.code === cell).text;
    	}
    }

    allowanceDetail = (cell, row) => {
        const listItems = row.empNameList.map((empNameList) =>
            <li>{empNameList}</li>
        );
        if (row.allowanceAmount === null || row.allowanceAmount === "0") {
            return
        } else {

            let formatAllowanceAmount = publicUtils.addComma(row.allowanceAmount, false);
            let returnItem = cell;
            returnItem =
                <OverlayTrigger
                    trigger={"focus"}
                    placement={"left"}
                    overlay={
                        <Popover >
                            <Popover.Content>
                                <strong>
                                    <Table id="detailTable" striped bordered hover
                                        data={row.employeeInfoList}>
                                        <tr>
                                            <td >手当名称</td>
                                            <td >費用</td>
                                        </tr>
                                        <tr>
                                            <td>交通費</td>
                                            <td>{publicUtils.addComma(row.transportationExpenses, false)}</td>
                                        </tr>
                                        <tr>
                                            <td >{row.otherAllowanceName}</td>
                                            <td >{publicUtils.addComma(row.otherAllowanceAmount, false)}</td>
                                        </tr>

                                        <tr>
                                            <td >住宅</td>
                                            <td >{publicUtils.addComma(row.introductionAllowance, false)}</td>
                                        </tr>
                                        <tr>
                                            <td >リーダー</td>
                                            <td >{publicUtils.addComma(row.leaderAllowanceAmount, false)}</td>
                                        </tr>
                                        <tr>
                                            <td >関連社員</td>
                                            <td>{listItems}</td>

                                        </tr>
                                    </Table>
                                </strong>
                            </Popover.Content>
                        </Popover>
                    }
                >
                    <button style={{ outline: 'none', border: 'none', background: 'none', width: "110px", textAlign: "left" }}>{formatAllowanceAmount}</button>
                </OverlayTrigger>
            return returnItem;
        }
    }
    
	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = {
				fiscalYear: this.state.fiscalYear,
				kadou: this.state.kadou,
				employeeStatus: this.state.employeeStatus,
				employeeName: this.state.employeeName,
				individualSales_startYearAndMonth: this.state.individualSales_startYearAndMonth,
				individualSales_endYearAndMonth: this.state.individualSales_endYearAndMonth,
				employeeInfoList: this.state.employeeInfoList,
				workMonthCount: this.state.workMonthCount,
				unitPriceTotal: this.state.unitPriceTotal,
				paymentTotal: this.state.paymentTotal,
				employeeNo: this.state.employeeNo,
				employeeInfo: this.state.employeeInfo,
		};
		switch (actionType) {
			case "wagesInfo":
				path = {
					pathname: '/subMenuManager/wagesInfo',
					state: {
						employeeNo: this.state.employeeNo,
						backPage: "individualSales",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			case "siteInfo":
				path = {
					pathname: '/subMenuManager/siteInfo',
					state: {
						employeeNo: this.state.employeeNo,
						backPage: "individualSales",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
	}

    render() {
        const { errorsMessageValue, employeeInfo } = this.state;
        const { backPage } = this.state;
        //テーブルの行の選択
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
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <Row inline="true">
                    <Col className="text-center">
                        <h2>個人売上検索</h2>
                    </Col>
                </Row>
                <Row>
            		<Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">年度</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="fiscalYear" name="fiscalYear" value={this.state.fiscalYear} as="select" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.yearAndMonthChange.bind(this)} />
                        </InputGroup>
                    </Col>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
                    <Col>
                        <p id="individualSalesErrmsg" style={{ visibility: "hidden" }} class="font-italic font-weight-light text-danger"></p>
                    </Col>
                </Row>
                <Row>
	        		<Col>
						<InputGroup size="sm" className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text id="inputGroup-sizing-sm">稼働区分</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control as="select" size="sm" onChange={this.kadouChange.bind(this)} name="kadou" value={this.state.kadou} autoComplete="off" >
							<option value=""　></option>
							<option value="0">はい</option>
							<option value="1">いいえ</option>
						</Form.Control>
						</InputGroup>
	                </Col>
	        		<Col>
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
	        		<Col>
	                	<InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text></InputGroup.Prepend>
                            <Autocomplete
                                id="employeeName"
                                name="employeeName"
                                options={employeeInfo}
                                getOptionLabel={(option) => option.name}
                                value={employeeInfo.find(v => v.name === this.state.employeeName) || {}}
                                onChange={(event, values) => this.handleTag(event, values)}
                                renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
										<input placeholder="  社員名" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-individualSales"/>
                                    </div>
                                )}
                            />
                        </InputGroup>
                    </Col>
        	        <Col>
    	                <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                        	<font color="red" style={{ marginLeft: "-25px" , marginRight: "10px" }}>★</font>
                                <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
                                    selected={this.state.individualSales_startYearAndMonth}
                                    onChange={this.individualSalesStartYearAndMonthChange.bind(this)}
                                    dateFormat={"yyyy MM"}
                                    autoComplete="off"
                                    locale="pt-BR"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    showDisabledMonthNavigation
                                    className="form-control form-control-sm"
                                    id="personalsalesSearchDatePicker"
                                    dateFormat={"yyyy/MM"}
                                    name="individualSales_startYearAndMonth"
                                    locale="ja" />
                                <font id="mark">～</font><DatePicker
                                    selected={this.state.individualSales_endYearAndMonth}
                                    onChange={this.individualSalesEndYearAndMonthChange.bind(this)}
                                    dateFormat={"yyyy MM"}
                                    autoComplete="off"
                                    locale="pt-BR"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    showDisabledMonthNavigation
                                    className="form-control form-control-sm"
                                    id="personalsalesSearchBackDatePicker"
                                    dateFormat={"yyyy/MM"}
                                    name="individualSales_endYearAndMonth"
                                    locale="ja" />
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
        	        <Col>
                    </Col>
                </Row>
                <Row>
            		<Col style={{ padding: "0px",marginLeft: "15px",marginRight: "15px" }}>
		                <Button
						size="sm"
	                    id="backToMonthly"
						variant="info"
	                    className="btn btn-info btn-sm disabled"
						onClick={this.back}
		                >
						<FontAwesomeIcon icon={faLevelUpAlt} />戻る
						</Button>
		                <font style={{ marginLeft: "2px" , marginRight: "2px" }}></font>
						<Button size="sm" onClick={this.shuseiTo.bind(this, "siteInfo")} disabled={this.state.employeeNo === '' ? true : false} className="individualSalesButtom" name="clickButton" variant="info" id="siteInfo">現場情報</Button>
		                <font style={{ marginLeft: "2px" , marginRight: "2px" }}></font>
		                <Button size="sm" onClick={this.shuseiTo.bind(this, "wagesInfo")}  disabled={this.state.employeeNo === '' ? true : false} className="individualSalesButtom" name="clickButton" variant="info" id="wagesInfo">給料情報</Button>
		            </Col>
            		<Col>
		                <InputGroup size="sm">
	                    	<InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">稼働月数</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
	                        value={this.state.workMonthCount}
	                        disabled/>
	                    </InputGroup>
                    </Col>

            		<Col>
                        <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">単価合計</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
	                        value={this.state.unitPriceTotal}
	                        disabled/>
	                    </InputGroup>
                    </Col>
            		<Col>
                        <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">支払合計</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
	                        value={this.state.paymentTotal}
	                        disabled/>
	                    </InputGroup>
	                </Col>
            		<Col>
                        <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">粗利合計</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
	                        value={this.state.unitPriceTotalnoComma - this.state.paymentTotalnoComma ? publicUtils.addComma(this.state.unitPriceTotalnoComma - this.state.paymentTotalnoComma, false) : ''}
	                        disabled/>
		                    
						</InputGroup>
	                 </Col>
                </Row>
        		<Col>
	                <div>
	                    <BootstrapTable selectRow={selectRow} data={this.state.employeeInfoList} pagination={true} headerStyle={{ background: '#5599FF' }} options={this.options} striped hover condensed >
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='onlyYandM' isKey width='75'>年月</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeFormName' width='100'>社員区分</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='100' dataField='customerName'>客様</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='unitPrice' width='110' dataFormat={this.workDaysCal.bind(this)}>単価</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='deductionsAndOvertimePayOfUnitPrice'  width='108' dataFormat={this.deductionsAndOvertimePayOfUnitPriceAddComma}>控/残(単価)</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='salary'  width='110' dataFormat={this.salaryAddComma}>基本支給</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='90' dataField='deductionsAndOvertimePay' dataFormat={this.deductionsAndOvertimePayAddComma.bind(this)} >控/残</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} hidden={this.state.bpFlag} dataField='insuranceFeeAmount'width='100' dataFormat={this.insuranceFeeAmountAddComma}>社会保険</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} hidden={this.state.bpFlag} dataField='bounsFee' width='100' dataFormat={this.scheduleOfBonusAmountAddComma}>ボーナス</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} hidden={this.state.bpFlag} dataField='allowanceAmount' width='90' dataFormat={this.allowanceDetail.bind(this)}>諸費用</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} hidden={!this.state.bpFlag} dataField='bpBelongCustomer' width='290' dataFormat={this.bpBelongCustomerDetail.bind(this)}>所属会社</TableHeaderColumn>
	                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='grosProfits' width='90' dataFormat={this.grosProfitsAddComma} >粗利</TableHeaderColumn>
	                    </BootstrapTable>
	                </div>
	           </Col>
            </div>
        );
    }
}
export default individualSales;