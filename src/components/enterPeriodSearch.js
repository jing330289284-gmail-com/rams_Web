import React, { Component } from 'react';
import { Row, Col, InputGroup, FormControl, Button, Table, OverlayTrigger, Form , Popover } from 'react-bootstrap';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from 'date-fns/locale/ja';
import Autocomplete from '@material-ui/lab/Autocomplete';
import $ from 'jquery';
import axios from 'axios';
import * as utils from './utils/publicUtils.js';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
import { BootstrapTable, TableHeaderColumn, BSTable } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
registerLocale('ja', ja);
axios.defaults.withCredentials = true;
/**
 * 入社入場期限検索画面
 */
class EnterPeriodSearch extends React.Component {
    state = {
        yearAndMonthDate: new Date('' + (new Date().getMonth() === 11 ? (new Date().getFullYear() + 1) : new Date().getFullYear()) + ' ' + 
        (new Date().getMonth() === 11 ? 1 : new Date().getMonth() + 2) + ''),//今の期日より一月後の年月
        enterPeriodKbn: '0',//区分
        enterPeriodKbnDrop: [],//区分List
        enterPeriodList: [],//入社入場期限List
        actionType: '',//処理区分
        employeeNameDrop: [],//社員名Drop
        message: '',
        type: '',
        myToastShow: false,
        errorsMessageShow: false,
        errorsMessageValue: '',
    }
    componentDidMount(){
        this.props.fetchDropDown();
        this.setState({
            employeeNameDrop:this.props.getEmployeeName,
            enterPeriodKbnDrop:this.props.getEnterPeriod,
        })
        this.search(utils.formateDate(this.state.yearAndMonthDate,false),this.state.enterPeriodKbn,utils.labelGetValue($("#employeeName").val(),this.state.employeeNameDrop));
    }
    /**
     * 年月のonChange 
     */
    yearAndMonthDateChange = date => {
        if (date !== null) {
            this.setState({
                yearAndMonthDate: date,
            }, () => {
                this.search(utils.formateDate(this.state.yearAndMonthDate,false),this.state.enterPeriodKbn,utils.labelGetValue($("#employeeName").val(),this.state.employeeNameDrop));
            });
        } else {
            this.setState({
                yearAndMonthDate: new Date('' + (new Date().getMonth() === 11 ? (new Date().getFullYear() + 1) : new Date().getFullYear()) + ' ' + 
                (new Date().getMonth() === 11 ? 1 : new Date().getMonth() + 2) + ''),
            }, () => {
                this.search(utils.formateDate(this.state.yearAndMonthDate,false) ,
                    this.state.enterPeriodKbn,
                        utils.labelGetValue($("#employeeName").val() , this.state.employeeNameDrop));
            });
        }
    }
    /**
     * 社員名連想
     * @param {} event 
     */
    getEmployeeName = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        },()=>{
            this.search(utils.formateDate(this.state.yearAndMonthDate,false) ,
                    this.state.enterPeriodKbn,
                        utils.labelGetValue($("#employeeName").val() , this.state.employeeNameDrop));
        })
    }
    /**
     * 検索メソッド
     * @param {} yearAndMonth 画面の年月
     * @param {*} enterPeriodKbn 区分
     * @param {*} employeeNo 社員番号
     */
    search=(yearAndMonth,enterPeriodKbn,employeeNo)=>{
        var enterPeriodSearchModel = {};
        enterPeriodSearchModel["yearAndMonth"] = yearAndMonth;
        enterPeriodSearchModel["employeeNo"] = employeeNo;
        enterPeriodSearchModel["enterPeriodKbn"] = enterPeriodKbn;
            axios.post(this.props.serverIP + "enterPeriodSearch/selectEnterPeriodData", enterPeriodSearchModel)
                .then(result => {
                    if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                        this.setState({
                            enterPeriodList: result.data.enterPeriodList,
                        })
                    } else {
                        this.setState({
                            enterPeriodList: [],
                        })
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                        setTimeout(() => this.setState({ "errorsMessageValue": false }), 3000);
                    }
                })
    }
    /**
     * テーブルの下もの
     * @param {} start 
     * @param {*} to 
     * @param {*} total 
     */
    renderShowsTotal(start, to, total) {
        if (total === 0) {
            return (<></>);
        } else {
            return (
                <p>
                    ページ： { start} /{ to}, トータル件数： { total}&nbsp;&nbsp;
                </p>
            );
        }
    }
    //onchange
    valueChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        },()=>{
            this.search(utils.formateDate(this.state.yearAndMonthDate,false) ,
                    this.state.enterPeriodKbn,
                        utils.labelGetValue($("#employeeName").val() , this.state.employeeNameDrop));
        })
    }
    periodButton=(cell,row)=>{
        let returnItem = cell;
        const options = {
            noDataText: (<i className="" style={{ 'fontSize': '24px' }}>データなし</i>),
            page: 1,  // which page you want to show as default
            sizePerPage: 5,  // which size per page you want to locate as default
            pageStartIndex: 1, // where to start counting the pages
            paginationSize: 3,  // the pagination bar size.
            prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
            expandRowBgColor: 'rgb(165, 165, 165)',
            hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
            expandRowBgColor: 'rgb(165, 165, 165)',
        };
        returnItem = 
        <OverlayTrigger
            trigger="click"
            placement={"left"}
            overlay={
            <Popover>
                <Popover.Content>
                <div>
                    <BootstrapTable
                        pagination={true}
                        options={options}
                        data={row.nonSitePeriodsList}
                        headerStyle={{ background: '#C1FFC1' }}
                        striped
                        hover
                        condensed>
                        <TableHeaderColumn isKey={true} dataField='nonSitePeriod' tdStyle={{ padding: '.45em' }} >
                        非稼働期間</TableHeaderColumn>
                        <TableHeaderColumn dataField='nonSiteMonths' tdStyle={{ padding: '.45em' }} width="40%">
                        非稼働月数</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                </Popover.Content>
            </Popover>
            }
        >
        <Button variant="warning" size="sm" className="hikadoButton">非稼働期間</Button>
      </OverlayTrigger>
        return returnItem;
    }
    //以下の四つは金額マークの追加
    addMarkSalary=(cell,row)=>{
        let salary = utils.addComma(row.salary,false);
        return salary;
    }
    addMarkInsuranceFeeAmount=(cell,row)=>{
        let insuranceFeeAmount = utils.addComma(row.insuranceFeeAmount,false);
        return insuranceFeeAmount;
    }
    addMarkUnitPrice=(cell,row)=>{
        let unitPrice = utils.addComma(row.unitPrice,false);
        return unitPrice;
    }
    addMarkScheduleOfBonusAmount=(cell,row)=>{
        let scheduleOfBonusAmount = utils.addComma(row.scheduleOfBonusAmount,false);
        return scheduleOfBonusAmount;
    }
    //以下の二つは期日に/の追加
    addMarkReflectYearAndMonth=(cell,row)=>{
        let reflectYearAndMonth = utils.dateFormate(row.reflectYearAndMonth);
        return reflectYearAndMonth;
    }
    addMarkAdmissionStartDate=(cell,row)=>{
        let admissionStartDate = utils.dateFormate(row.admissionStartDate);
        return admissionStartDate;
    }
    render() {
        const {
            yearAndMonthDate,
            employeeNameDrop,
            enterPeriodKbnDrop,
            enterPeriodKbn,
            employeeName,
            actionType,
            message,
            type,
            errorsMessageValue,
            enterPeriodList, } = this.state;
        //テーブルの定義
        const options = {
            noDataText: (<i className="" style={{ 'fontSize': '24px' }}>データなし</i>),
            page: 1,  // which page you want to show as default
            sizePerPage: 5,  // which size per page you want to locate as default
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
                <Row inline="true">
                    <Col className="text-center">
                        <h2>入社入場期限一覧</h2>
                    </Col>
                </Row>
                <br />
                <Form id="enterPeriodForm">
                    <Row>
                        <Col sm="3">
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
                                </InputGroup.Prepend>
                                <DatePicker
                                    selected={yearAndMonthDate}
                                    onChange={this.yearAndMonthDateChange}
                                    dateFormat={"yyyy/MM"}
                                    autoComplete="off"
                                    locale="pt-BR"
                                    showYearDropdown
                                    yearDropdownItemNumber={15}
                                    scrollableYearDropdown
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    minDate={new Date()}
                                    showDisabledMonthNavigation
                                    className="form-control form-control-sm"
                                    id="enterPeriodSearchDatePicker"
                                    name="businessStartDate"
                                    locale="ja"
                                />
                            </InputGroup>
                        </Col>
                        <Col sm="2">
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>区分</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    as="select"
                                    disabled={actionType === "detail" ? true : false}
                                    name="enterPeriodKbn"
                                    onChange={this.valueChange}
                                    value={enterPeriodKbn}>
                                    {this.state.enterPeriodKbnDrop.map(data =>
                                        <option key={data.code} value={data.code}>
                                            {data.name}
                                        </option>
                                    )}
                                </FormControl>
                            </InputGroup>
                        </Col>
                        <Col sm="3">
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>社員名</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Autocomplete
                                    id="employeeName"
                                    name="employeeName"
                                    value={employeeName}
                                    options={this.state.employeeNameDrop}
                                    getOptionLabel={(option) => option.name}
                                    onChange={this.getEmployeeName}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <input placeholder="  例：田中" type="text" {...params.inputProps} className="auto"
                                                style={{ width: 150, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
                                        </div>
                                    )}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                </Form>
                <div>
                    <BootstrapTable
                        pagination={true}
                        options={options}
                        data={enterPeriodList}
                        headerStyle={{ background: '#5599FF' }}
                        striped
                        hover
                        condensed>
                        <TableHeaderColumn isKey={true} dataField='rowNo' tdStyle={{ padding: '.45em' }} >
                            番号</TableHeaderColumn>
                        <TableHeaderColumn dataField='employeeNo' tdStyle={{ padding: '.45em' }} >
                            社員番号</TableHeaderColumn>
                        <TableHeaderColumn dataField='employeeName' tdStyle={{ padding: '.45em' }} >
                            氏名</TableHeaderColumn>
                        <TableHeaderColumn dataField='salary' tdStyle={{ padding: '.45em' }} dataFormat={this.addMarkSalary}>
                            基本支給</TableHeaderColumn>
                        <TableHeaderColumn dataField='insuranceFeeAmount' tdStyle={{ padding: '.45em' }} dataFormat={this.addMarkInsuranceFeeAmount}>
                            社会保険</TableHeaderColumn>
                        <TableHeaderColumn dataField='reflectYearAndMonth' tdStyle={{ padding: '.45em' }} dataFormat={this.addMarkReflectYearAndMonth}>
                            直近調整年月</TableHeaderColumn>
                        <TableHeaderColumn dataField='admissionStartDate' tdStyle={{ padding: '.45em' }} dataFormat={this.addMarkAdmissionStartDate}>
                            直近入場年月日</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataFormat={this.periodButton.bind(this)}>
                            非稼動月数</TableHeaderColumn>
                        <TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }} dataFormat={this.addMarkUnitPrice}>
                            単価</TableHeaderColumn>
                        <TableHeaderColumn dataField='scheduleOfBonusAmount' tdStyle={{ padding: '.45em' }} dataFormat={this.addMarkScheduleOfBonusAmount}>
                            ボーナス予定額</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
	return {
        getEnterPeriod:state.data.dataReques.length >= 1 ? state.data.dataReques[29].slice(1) : [],
        getEmployeeName:state.data.dataReques.length >= 1 ? state.data.dataReques[38].slice(1) : [],
        serverIP: state.data.dataReques[state.data.dataReques.length-1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(EnterPeriodSearch);