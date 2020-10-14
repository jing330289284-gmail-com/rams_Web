import React, { Component } from 'react';
import { Row, Col, InputGroup, FormControl, Button, Navbar, Container, Form } from 'react-bootstrap';
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

class EnterPeriodSearch extends React.Component {
    state = {
        yearAndMonthDate: '',//年月
        enterPeriodKbn: '',//区分
        enterPeriodKbnDrop: [],//区分List
        enterPeriodList: [],//入社入場期限List
        employeeName: '',//社員名前
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
    }
    /**
     * 年月のonChange 
     */
    yearAndMonthDateChange = date => {
        if (date !== null) {
            this.setState({
                yearAndMonthDate: date,
            });
        } else {
            this.setState({
                yearAndMonthDate: '',
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
        })
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
        const getEnterPeriod = this.props.getEnterPeriod;
        const getEmployeeName = this.props.getEmployeeName;
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
                                    <InputGroup.Text id="inputGroup-sizing-sm">取引開始日</InputGroup.Text>
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
                                    // minDate={new Date()}
                                    showDisabledMonthNavigation
                                    className="form-control form-control-sm"
                                    id="enterPeriodSearchDatePicker"
                                    name="businessStartDate"
                                    locale="ja"
                                />
                                <font
                                    id="mark" color="red"
                                    style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
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
                                    {getEnterPeriod.map(data =>
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
                                    options={getEmployeeName}
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
                        <TableHeaderColumn isKey={true} dataField='period' tdStyle={{ padding: '.45em' }} >
                            番号</TableHeaderColumn>
                        <TableHeaderColumn dataField='employeeFormName' tdStyle={{ padding: '.45em' }} >
                            社員番号</TableHeaderColumn>
                        <TableHeaderColumn dataField='salary' tdStyle={{ padding: '.45em' }} >
                            氏名</TableHeaderColumn>
                        <TableHeaderColumn dataField='insuranceFeeAmount' tdStyle={{ padding: '.45em' }} >
                            基本支給</TableHeaderColumn>
                        <TableHeaderColumn dataField='transportationExpenses' tdStyle={{ padding: '.45em' }} >
                            社会保険</TableHeaderColumn>
                        <TableHeaderColumn dataField='leaderAllowanceAmount' tdStyle={{ padding: '.45em' }} >
                            直近調整年月</TableHeaderColumn>
                        <TableHeaderColumn dataField='housingAllowance' tdStyle={{ padding: '.45em' }} >
                            直近入場年月</TableHeaderColumn>
                        <TableHeaderColumn dataField='otherAllowanceName' tdStyle={{ padding: '.45em' }} >
                            非稼動期間</TableHeaderColumn>
                        <TableHeaderColumn dataField='otherAllowanceAmount' tdStyle={{ padding: '.45em' }} >
                            単価</TableHeaderColumn>
                        <TableHeaderColumn dataField='scheduleOfBonusAmount' tdStyle={{ padding: '.45em' }} >
                            ボーナス予定額</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
	return {
        getEnterPeriod:state.data.dataReques.length >= 1 ? state.data.dataReques[29] : [],
        getEmployeeName:state.data.dataReques.length >= 1 ? state.data.dataReques[9].slice(1) : [],
        serverIP: state.data.dataReques[state.data.dataReques.length-1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(EnterPeriodSearch);