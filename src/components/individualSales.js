import React, { Component } from 'react';
import { Row, Col, InputGroup, Button, FormControl, Popover, OverlayTrigger, Table } from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
        textcolorCheck: '',
        employeeName: '',
        individualSales_startYearAndMonth: '',
        individualSales_endYearAndMonth: '',
        fiscalYear: '',

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
    feeTotal = () => {
        var totalgrosProfits = 0;
        var paymentTotal = 0;
        var paymentCal = 0;
        for (var i = 0; i < this.state.employeeInfoList.length; i++) {
            paymentCal = parseInt(this.state.employeeInfoList[i].salary) + parseInt(this.state.employeeInfoList[i].transportationExpenses) + parseInt(this.state.employeeInfoList[i].insuranceFeeAmount) + parseInt(this.state.employeeInfoList[i].bonusFee) + parseInt(this.state.employeeInfoList[i].deductionsAndOvertimePay) + parseInt(this.state.employeeInfoList[i].leaderAllowanceAmount) + parseInt(this.state.employeeInfoList[i].otherAllowanceAmount) + parseInt(this.state.employeeInfoList[i].housingAllowance)
            paymentTotal = parseInt(paymentTotal) + paymentCal
        }
        //this.setState({ totalgrosProfits: publicUtils.addComma(unitPriceTotal-paymentTotal, false) })
        this.setState({ paymentTotal: publicUtils.addComma(paymentTotal, false) })
        this.setState({ paymentTotalnoComma: paymentTotal })
    }

    componentDidMount() {
        var date = new Date();
        var year = date.getFullYear();
        $('#fiscalYear').append('<option value="">' + "" + '</option>');
        for (var i = 2019; i <= year; i++) {
            $('#fiscalYear').append('<option value="' + i + '">' + i + '</option>');
        }
        const { location } = this.props
        var actionType = '';
        var monthlySales_startYearAndMonth = '';
        var monthlySales_endYearAndMonth = '';
        var rowSelectemployeeNo = '';
        var rowSelectemployeeName = '';
        if (location.state) {
            actionType = location.state.actionType;
            sessionStorage.setItem('actionType', actionType);
            monthlySales_startYearAndMonth = location.state.monthlySales_startYearAndMonth;
            monthlySales_endYearAndMonth = location.state.monthlySales_endYearAndMonth;
            rowSelectemployeeNo = location.state.rowSelectemployeeNo;
            rowSelectemployeeName = location.state.rowSelectemployeeName;
            this.setState({
                individualSales_startYearAndMonth: monthlySales_startYearAndMonth,
                individualSales_endYearAndMonth: monthlySales_endYearAndMonth,
                employeeName: rowSelectemployeeName + "(" + rowSelectemployeeNo + ")"
            }, () =>
                this.searchEmployee()
            );
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
        if (this.state.fiscalYear !== '' || (this.state.individualSales_startYearAndMonth !== '' && this.state.individualSales_endYearAndMonth !== '')) {
            if (values != null) {
                this.setState({
                    employeeName: values.name,
                }, () =>
                    this.searchEmployee())

            } else {
                this.setState({
                    employeeName: '',
                })
            }
        } else {
            if (values != null) {
                this.setState({
                    employeeName: values.name,
                })

            } else {
                this.setState({
                    employeeName: '',
                })
            }

        }
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
                if (endDate.substring(0, 6) == empList[m].onlyYandM) {
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

    allowanceDetail = (cell, row) => {
        const listItems = row.empNameList.map((empNameList) =>
            <li>{empNameList}</li>
        );
        if (row.allowanceAmount === null) {
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
                                            <td >{publicUtils.addComma(row.housingAllowance, false)}</td>
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


    render() {
        const { errorsMessageValue, employeeInfo } = this.state;
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
                    <Col className="selectWidth">
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">年度</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="fiscalYear" name="fiscalYear" value={this.state.fiscalYear} as="select" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.yearAndMonthChange.bind(this)} />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <p id="individualSalesErrmsg" style={{ visibility: "hidden" }} class="font-italic font-weight-light text-danger"></p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" >
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
                                        <input placeholder="  社員名" type="text" {...params.inputProps} className="auto"
                                            style={{ width: 140, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
                                    </div>
                                )}
                            />
                            <font color="red" style={{ marginLeft: "15px" }}>★</font>
                            <InputGroup.Prepend style={{ marginLeft: "30px" }}>
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
                </Row>
                <Row style={{ marginTop: "10px" }}>
                    <Col sm={3}>
                        <label>稼働月数：</label>
                        <label>{this.state.workMonthCount}</label>
                    </Col>

                    <Col sm={3}>
                        <label>単価合計：</label>
                        <label>{this.state.unitPriceTotal} </label>
                    </Col>
                    <Col sm={3}>
                        <label>支払合計：</label>
                        <label>{this.state.paymentTotal} </label>
                    </Col>
                    <Col sm={3}>
                        <label>粗利合計：</label>
                        <label>{this.state.unitPriceTotalnoComma - this.state.paymentTotalnoComma ? publicUtils.addComma(this.state.unitPriceTotalnoComma - this.state.paymentTotalnoComma, false) : ''}</label>
                    </Col>
                </Row>
                <div >
                    <BootstrapTable data={this.state.employeeInfoList} pagination={true} headerStyle={{ background: '#5599FF' }} options={this.options} striped hover condensed >
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='onlyYandM' isKey width='80'>年月</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeFormName' width='120'>社員形式</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125' dataField='customerName'>所属客様</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='unitPrice' dataFormat={this.workDaysCal.bind(this)}>単価</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='deductionsAndOvertimePayOfUnitPrice' dataFormat={this.deductionsAndOvertimePayOfUnitPriceAddComma}>控除/残業(単価)</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='salary' dataFormat={this.salaryAddComma}>基本支給</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125' dataField='deductionsAndOvertimePay' dataFormat={this.deductionsAndOvertimePayAddComma.bind(this)} >控除/残業</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='insuranceFeeAmount' dataFormat={this.insuranceFeeAmountAddComma}>社会保険</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='bounsFee' dataFormat={this.scheduleOfBonusAmountAddComma}>ボーナス</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='allowanceAmount' dataFormat={this.allowanceDetail.bind(this)}>諸費用合計</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='grosProfits' width='120' dataFormat={this.grosProfitsAddComma} >粗利</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}
export default individualSales;