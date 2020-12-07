import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';
import MyToast from './myToast';
import $ from 'jquery';
import ErrorsMessageToast from './errorsMessageToast';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons';
import * as utils from './utils/publicUtils.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import store from './redux/store';

registerLocale('ja', ja);
axios.defaults.withCredentials = true;
/**
 * 諸費用画面
 */
class ExpensesInfo extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;//初期化
    }
    initialState = {
        employeeNo: '',//社員番号
        expensesReflectStartDate: '',//反映年月開始年月
        expensesReflectYearAndMonth: '',//反映年月
        transportationExpenses: '',//交通費
        otherAllowanceName: '',//他の手当名称
        otherAllowanceAmount: '',//他の手当
        leaderAllowanceAmount: '',//リーダー手当
        housingStatus: '',//住宅ステータス
        housingAllowance: '',//住宅手当
        message: '',//toastのメッセージ
        type: '',//成功や失敗
        myToastShow: false,//toastのフラグ
        errorsMessageShow: false,///エラーのメッセージのフラグ
        errorsMessageValue: '',//エラーのメッセージ
        actionType: 'insert',//処理区分
        housingStatusDrop: [],//住宅ステータスselect
        expensesInfoModels: [],//諸費用履歴
        btnText: '登録',//ボタン文字
        kadouCheck: true,//稼働フラグ
        relatedEmployees: '',//要員
        leaderCheck:false,//リーダーフラグ
        siteRoleCode:'',//役割
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
    }
    componentDidMount() {
        this.setState({
            housingStatusDrop: utils.getdropDown("getHousing", this.state.serverIP),
            employeeNo: this.props.employeeNo,
            expensesInfoModels: this.props.expensesInfoModels,
            kadouCheck: this.props.kadouCheck,
            relatedEmployees: this.props.relatedEmployees.relatedEmployees,
            leaderCheck:this.props.leaderCheck,
        })
        if (this.props.expensesInfoModel !== null) {
            this.giveValue(this.props.expensesInfoModel);
            this.setState({
                actionType: 'update',
            })
        }
    }
    /**
     * 昇給期日の変化
     */
    expensesReflectStartDateChange = date => {
        if (date !== null) {
            this.setState({
                expensesReflectStartDate: date,
            });
        } else {
            this.setState({
                expensesReflectStartDate: '',
            });
        }
    };
    /**
     * 値を設定
     */
    giveValue = (expensesInfoMod) => {
        this.setState({
            expensesReflectStartDate: utils.converToLocalTime(expensesInfoMod.expensesReflectYearAndMonth, false),
            transportationExpenses: expensesInfoMod.transportationExpenses,
            otherAllowanceName: expensesInfoMod.otherAllowanceName,
            otherAllowanceAmount: expensesInfoMod.otherAllowanceAmount,
            leaderAllowanceAmount: expensesInfoMod.leaderAllowanceAmount,
            housingStatus: expensesInfoMod.housingStatus,
            housingAllowance: expensesInfoMod.housingAllowance,
        })
    }
    /**
     * 値をリセット
     */
    resetValue = () => {
        this.setState({
            expensesReflectStartDate: '',
            transportationExpenses: '',
            otherAllowanceName: '',
            otherAllowanceAmount: '',
            leaderAllowanceAmount: '',
            housingStatus: '',
            housingAllowance: '',
        })
    }
    //onchange
    valueChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }
    expensesInfoToroku() {
        var expensesInfoModel = {};
        var formArray = $("#expensesInfoForm").serializeArray();
        $.each(formArray, function (i, item) {
            expensesInfoModel[item.name] = item.value;
        });
        expensesInfoModel["actionType"] = this.state.actionType;
        expensesInfoModel["employeeNo"] = this.state.employeeNo;
        expensesInfoModel["expensesReflectYearAndMonth"] = utils.formateDate(this.state.expensesReflectStartDate, false);
        axios.post(this.state.serverIP + "expensesInfo/toroku", expensesInfoModel)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: result.data.message });
                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                    var seikou = "success";
                    this.props.expensesInfoToroku(seikou);
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                }
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
            });
    }

    /**
     * 行Selectファンクション
     */
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            if (row.expensesPeriod.length <= 7) {
                this.giveValue(row);
                this.setState({
                    actionType: 'update',
                    btnText: '更新',
                })
            } else {
                this.resetValue();
                this.setState({
                    actionType: 'insert',
                    btnText: '登録',
                })
            }
        } else {
            this.resetValue();
            this.setState({
                actionType: 'insert',
                btnText: '登録',
            })
        }
    }
    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
                {start}から  {to}まで , 総計{total}
            </p>
        );
    }
    render() {
        const {
            transportationExpenses,
            otherAllowanceName,
            otherAllowanceAmount,
            leaderAllowanceAmount,
            housingStatus,
            housingAllowance,
            message,
            type,
            errorsMessageValue,
            actionType,
            housingStatusDrop,
            expensesInfoModels,
            btnText,
            kadouCheck,
            leaderCheck,
            relatedEmployees } = this.state;
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
                <div id="HomePage">
                    <Row inline="true">
                        <Col className="text-center">
                            <h2>諸費用</h2>
                        </Col>
                    </Row>
                    <br />
                    <Form id="expensesInfoForm">
                        <Row>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>交通費</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        maxLength="5"
                                        value={transportationExpenses}
                                        name="transportationExpenses"
                                        onChange={this.valueChange}
                                        disabled={actionType === "detail" ? true : false}
                                        placeholder="例：12000" />
                                </InputGroup>
                            </Col>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="sixKanji">リーダー手当</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        maxLength="6"
                                        value={leaderAllowanceAmount}
                                        name="leaderAllowanceAmount"
                                        onChange={this.valueChange}
                                        readOnly={kadouCheck && !leaderCheck}
                                        disabled={actionType === "detail" ? true : false}
                                        placeholder="例：112000" />
                                    <OverlayTrigger
                                        placement={'top'}
                                        overlay={
                                            <Tooltip>
                                                {relatedEmployees}
                                            </Tooltip>
                                        }
                                    >
                                        <Button size="sm" disabled={kadouCheck}>要員</Button>
                                    </OverlayTrigger>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>他の手当</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        maxLength="20"
                                        value={otherAllowanceName}
                                        name="otherAllowanceName"
                                        onChange={this.valueChange}
                                        disabled={actionType === "detail" ? true : false}
                                        placeholder="例：12000" />
                                </InputGroup>
                            </Col>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>費用</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        maxLength="6"
                                        value={otherAllowanceAmount}
                                        name="otherAllowanceAmount"
                                        onChange={this.valueChange}
                                        disabled={actionType === "detail" ? true : false}
                                        placeholder="例：112000" />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="sevenKanji">住宅ステータス</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        maxLength="5"
                                        as="select"
                                        value={housingStatus}
                                        name="housingStatus"
                                        onChange={this.valueChange}
                                        disabled={actionType === "detail" ? true : false}>
                                        {housingStatusDrop.map(date =>
                                            <option key={date.code} value={date.code}>
                                                {date.name}
                                            </option>
                                        )}
                                    </FormControl>
                                </InputGroup>
                            </Col>
                            <Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text> 住宅手当</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        maxLength="5"
                                        value={housingAllowance}
                                        readOnly={housingStatus === "2" ? false : true}
                                        name="housingAllowance"
                                        onChange={this.valueChange}
                                        disabled={actionType === "detail" ? true : false}
                                        placeholder="例：10000" />
                                </InputGroup>
                            </Col>
                            <Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>反映年月</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <InputGroup.Append>
                                        <DatePicker
                                            selected={this.state.expensesReflectStartDate}
                                            onChange={this.expensesReflectStartDateChange}
                                            dateFormat={"yyyy MM"}
                                            autoComplete="off"
                                            locale="pt-BR"
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            // minDate={new Date()}
                                            showDisabledMonthNavigation
                                            className="form-control form-control-sm"
                                            id="expensesInfoDatePicker"
                                            dateFormat={"yyyy/MM"}
                                            name="expensesReflectYearAndMonth"
                                            locale="ja"
                                            disabled={actionType === "detail" ? true : false}
                                        /><font id="mark" color="red"
                                            style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                        </Row>
                        <div style={{ "textAlign": "center" }}>
                            <Button
                                size="sm"
                                disabled={actionType === "detail" ? true : false}
                                variant="info"
                                onClick={this.expensesInfoToroku.bind(this)}>
                                <FontAwesomeIcon icon={faSave} />{btnText}
                            </Button>{" "}
                            <Button
                                size="sm"
                                disabled={actionType === "detail" ? true : false}
                                type="reset"
                                variant="info"
                                value="Reset" >
                                <FontAwesomeIcon icon={faUndo} />リセット
                            </Button>
                        </div>
                        <div>
                            <Col sm={12}>
                                <BootstrapTable
                                    selectRow={actionType !== "detail" ? selectRow : selectRowDetail}
                                    pagination={true}
                                    options={options}
                                    data={expensesInfoModels}
                                    headerStyle={{ background: '#5599FF' }}
                                    striped>
                                    <TableHeaderColumn isKey={true} dataField='expensesPeriod' tdStyle={{ padding: '.45em' }} width="230">諸費用期間</TableHeaderColumn>
                                    <TableHeaderColumn dataField='transportationExpenses' tdStyle={{ padding: '.45em' }} >交通代</TableHeaderColumn>
                                    <TableHeaderColumn dataField='leaderAllowanceAmount' tdStyle={{ padding: '.45em' }} >リーダー</TableHeaderColumn>
                                    <TableHeaderColumn dataField='housingAllowance' tdStyle={{ padding: '.45em' }} >住宅</TableHeaderColumn>
                                    <TableHeaderColumn dataField='otherAllowanceAmount' tdStyle={{ padding: '.45em' }} >他</TableHeaderColumn>
                                </BootstrapTable>
                            </Col>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}
export default ExpensesInfo;