import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, Table } from 'react-bootstrap';
import $ from 'jquery';
import axios from "axios";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import * as utils from './utils/publicUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch, faEdit, faTrash, faList } from '@fortawesome/free-solid-svg-icons';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';

registerLocale('ja', ja);
axios.defaults.withCredentials = true;
/**
 * お客様情報検索画面
 */
class CustomerInfoSearch extends Component {
    state = {
        customerInfoData: [],//テーブルのデータ
        currentPage: 1,//テーブルの第一ページ
        emploryeesPerPage: 5,//毎ページの項目数
        customerNo: '',//選択した列のお客様番号
        rowNo: '',//選択した行番号
        businessStartDate: '',//取引開始の期日
        stationCode: [],//本社場所
        topCustomerDrop: [],//上位お客様連想の数列
        message: '',
        type: '',
        myToastShow: false,
        errorsMessageShow: false,
        errorsMessageValue: '',
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
        transactionStatusDrop: store.getState().dropDown[46],
    }
    /**
     * 画面の初期化
     */
    componentDidMount() {
        document.getElementById('shusei').className += " disabled";
        document.getElementById('shosai').className += " disabled";
        $("#sakujo").attr("disabled", true);
        var methodArray = ["getLevel", "getCompanyNature", "getPaymentsite", "getStation", "getTopCustomer"]
        var selectDataList = utils.getPublicDropDown(methodArray, this.state.serverIP);
        //お客様ランキン
        var level = selectDataList[0];
        //会社性質
        var companyNature = selectDataList[1];
        //支払サイト
        var paymentsiteCode = selectDataList[2];
        var stationCode = selectDataList[3];
        stationCode.shift();
        var topCustomerDrop = selectDataList[4];
        topCustomerDrop.shift();
        var transactionStatusDrop = this.state.transactionStatusDrop;
        this.setState({
            stationCode: stationCode,
            topCustomerDrop: topCustomerDrop,
        })
        for (let i = 0; i < level.length; i++) {
            $("#levelCode").append('<option value="' + level[i].code + '">' + level[i].name + '</option>');
        }
        for (let i = 0; i < companyNature.length; i++) {
            $("#companyNatureCode").append('<option value="' + companyNature[i].code + '">' + companyNature[i].name + '</option>');
        }
        for (let i = 0; i < paymentsiteCode.length; i++) {
            $("#paymentsiteCode").append('<option value="' + paymentsiteCode[i].code + '">' + paymentsiteCode[i].name + '</option>');
        }
        for (let i = 1; i < transactionStatusDrop.length; i++) {
            $("#transactionStatus").append('<option value="' + transactionStatusDrop[i].code + '">' + transactionStatusDrop[i].name + '</option>');
        }
    }
    /**
     * 数字チェック
     * @param {*} e 
     * @param {*} key 
     */
    vNumberChange = (e, key) => {
        const { value } = e.target;
        var num = value;
        const reg = /^[0-9]*$/;
        num = utils.deleteComma(num);
        var keyLength = 5;
        if (key === "capitalStockFront" || key === "capitalStockBack") {
            keyLength = 6;
            if ((reg.test(num) && num.length < keyLength)) {
                num = utils.addComma(num);
                this.setState({
                    [key]: num
                })
            }
        }else{
            if ((reg.test(num) && num.length < keyLength)) {
                this.setState({
                    [key]: num
                })
            }
        }
    }
    /**
      * 検索ボタン
      */
    search = () => {
        var customerInfoMod = {};
        var formArray = $("#conditionForm").serializeArray();
        $.each(formArray, function (i, item) {
            customerInfoMod[item.name] = item.value;
        });
        customerInfoMod["capitalStockFront"] = utils.deleteComma($("#capitalStockFront").val());
        customerInfoMod["capitalStockBack"] = utils.deleteComma($("#capitalStockBack").val());
        customerInfoMod["topCustomerNo"] = utils.labelGetValue($("#topCustomer").val(), this.state.topCustomerDrop);
        customerInfoMod["stationCode"] = utils.labelGetValue($("#stationCode").val(), this.state.stationCode);
        customerInfoMod["businessStartDate"] = utils.dateFormate(this.state.businessStartDate, false);
        axios.post(this.state.serverIP + "customerInfoSearch/customerSearch", customerInfoMod)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    this.setState({
                        customerInfoData: result.data.resultList,
                        "errorsMessageShow": false,
                    })
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage, customerInfoData: [] });
                }
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
            });
    }
    /**
      * 稼働テーブルの開き
      */
    isExpandableRow(row) {
        if (row.employeeNameList !== null) return true;
        else return false;
    }
    /**
      * 稼働テーブル開きアイコン
      */
    expandColumnComponent({ isExpandableRow, isExpanded }) {
        let content = '';

        if (isExpandableRow) {
            content = (isExpanded ? '(-)' : '(+)');
        } else {
            content = ' ';
        }
        return (
            <div> { content} </div>
        );
    }
    /**
      * 行Selectファンクション
      */
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            document.getElementById('shusei').className = "btn btn-sm btn-info";
            document.getElementById('shosai').className = "btn btn-sm btn-info";
            $("#sakujo").attr("disabled", false);
            this.setState({
                customerNo: row.customerNo,
                rowNo: row.rowNo,
            })
        } else {
            document.getElementById('shusei').className = "btn btn-sm btn-info disabled";
            document.getElementById('shosai').className = "btn btn-sm btn-info disabled";
            $("#sakujo").attr("disabled", true);
            this.setState({
                customerNo: '',
                rowNo: row.rowNo,
            })
        }
    }
    /**
     * 行の削除
     */
    listDelete = () => {
        //将id进行数据类型转换，强制转换为数字类型，方便下面进行判断。
        var a = window.confirm("削除していただきますか？");
        if (a) {
            $("#delectBtn").click();
        }
    }
    //隠した削除ボタン
    createCustomDeleteButton = (onClick) => {
        return (
            <Button variant="info" id="delectBtn" hidden onClick={onClick} >删除</Button>
        );
    }
    //隠した削除ボタンの実装
    onDeleteRow = (rows) => {
        var id = this.state.rowNo;
        var customerInfoList = this.state.customerInfoData;
        for (let i = customerInfoList.length - 1; i >= 0; i--) {
            if (customerInfoList[i].rowNo === id) {
                customerInfoList.splice(i, 1);
            }
        }
        if (customerInfoList.length !== 0) {
            for (let i = customerInfoList.length - 1; i >= 0; i--) {
                customerInfoList[i].rowNo = (i + 1);
            }
        }
        this.setState({
            customerInfoData: customerInfoList,
            rowNo: '',
        })
        var customerInfoMod = {};
        customerInfoMod["customerNo"] = this.state.customerNo;
        axios.post(this.state.serverIP + "customerInfoSearch/delete", customerInfoMod)
            .then(result => {
                if (result.data === 0) {
                    this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "削除成功" });
                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                } else if (result.data === 1) {
                    this.setState({ "myToastShow": true, "type": "fail", "errorsMessageShow": false, message: "削除失败" });
                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                } else if (result.data === 2) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: "お客様が現場に使っている" });
                } else if (result.data === 3) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: "上位お客様の下位お客様が複数ある" });
                } else if (result.data === 4) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: "上位お客様の下位お客様が複数あるの場合でも、お客様の削除が失敗し" });
                }
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
            });
    }
    //削除前のデフォルトお知らせの削除
    customConfirm(next, dropRowKeys) {
        const dropRowKeysStr = dropRowKeys.join(',');
        next();
    }
    /**
     * 取引開始のonChange 
     */
    businessStartDateChange = date => {
        if (date !== null) {
            this.setState({
                businessStartDate: date,
            });
        } else {
            this.setState({
                businessStartDate: '',
            });
        }
    }
    reset = () => {
        $("#topCustomer").val("");
        $("#stationCode").val("");
        $("#customerNo").val("");
        $("#customerName").val("");
        $("#paymentsiteCode").val("");
        $("#levelCode").val("");
        $("#companyNatureCode").val("");
    }
    /**
    * 稼働テーブル
    */
    expandComponent(row) {
        return (
            <div>
                <Table>
                    <thead>
                        <th>稼動者</th>
                        <th>現場</th>
                        <th>責任者</th>
                        <th>単価</th>
                    </thead>
                    <tbody>
                        {row.employeeNameList === null ? null : row.employeeNameList.map((employeeName, index) =>
                            <tr key={row.rowNo} align="center">
                                <td>{employeeName}</td>
                                <td>{row.locationList[index]}</td>
                                <td>{row.siteManagerList[index]}</td>
                                <td>{row.unitPriceList[index]}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
    addMarkCapitalStock=(cell,row)=>{
        let capitalStock = utils.addComma(row.capitalStock);
        return capitalStock;
    }
    render() {
        const { customerInfoData, stationCodeValue, topCustomerValue, message, type, errorsMessageValue, traderPersonFront, traderPersonBack, capitalStockFront, capitalStockBack } = this.state;
        //画面遷移のパラメータ（追加）
        var tsuikaPath = {
            pathname: '/subMenuManager/customerInfo', state: { actionType: 'insert' },
        }
        //画面遷移のパラメータ（修正）
        var shuseiPath = {
            pathname: '/subMenuManager/customerInfo', state: { actionType: 'update', customerNo: this.state.customerNo },
        }
        var shosaiPath = {
            pathname: '/subMenuManager/customerInfo', state: { actionType: 'detail', customerNo: this.state.customerNo },
        }
        //テーブルの行の選択
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,  // click to select, default is false
            clickToExpand: true,// click to expand row, default is false
            onSelect: this.handleRowSelect,
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
            paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
            hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
            expandRowBgColor: 'rgb(165, 165, 165)',
            deleteBtn: this.createCustomDeleteButton,
            onDeleteRow: this.onDeleteRow,
            handleConfirmDeleteRow: this.customConfirm,
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
                        <h2>お客様・協力情報検索</h2>
                    </Col>
                </Row>
                <br />
                <Form id="conditionForm">
                    <Row>
                        <Col sm={3}>
                            <InputGroup size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="fiveKanji">お客様番号</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control placeholder="例：C001" id="customerNo" name="customerNo" />
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control placeholder="例：LYC株式会社" id="customerName" name="customerName" />
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">会社性質</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control as="select" id="companyNatureCode" name="companyNatureCode">
                                </Form.Control>
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text style={{width:"8rem"}}>お客様ランキング</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control as="select" id="levelCode" name="levelCode">
                                </Form.Control>
                            </InputGroup>
                        </Col>


                    </Row>
                    <br />
                    <Row>
                        <Col sm={3}>
                            <InputGroup size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">資本金</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control placeholder="資本金" id="capitalStockFront" name="capitalStockFront" value={capitalStockFront}
                                    onChange={(e) => this.vNumberChange(e, 'capitalStockFront')} />{"~"}
                                <Form.Control placeholder="資本金" id="capitalStockBack" name="capitalStockBack" value={capitalStockBack}
                                    onChange={(e) => this.vNumberChange(e, 'capitalStockBack')} />
                                <InputGroup.Prepend>
                                    <InputGroup.Text>百万円</InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="fiveKanji">上位お客様</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Autocomplete
                                    id="topCustomer"
                                    name="topCustomer"
                                    value={topCustomerValue}
                                    options={this.state.topCustomerDrop}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <input placeholder="上位お客様名" type="text" {...params.inputProps} className="auto"
                                                style={{ width: 230, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
                                        </div>
                                    )}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">本社場所</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Autocomplete
                                    id="stationCode"
                                    name="stationCode"
                                    value={stationCodeValue}
                                    options={this.state.stationCode}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <input placeholder="例：秋葉原駅" type="text" {...params.inputProps} className="auto"
                                                style={{ width: 230, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
                                        </div>
                                    )}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="fiveKanji">支払サイト</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="支払サイト" id="paymentsiteCode" name="paymentsiteCode" />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">取引区分</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="取引区分" id="transactionStatus" name="transactionStatus" />
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="fiveKanji">取引開始日</InputGroup.Text>
                                </InputGroup.Prepend>
                                <DatePicker
                                    selected={this.state.businessStartDate}
                                    onChange={this.businessStartDateChange}
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
                                    id="customerInfoSearchDatePicker"
                                    name="businessStartDate"
                                    locale="ja"
                                />
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">取引人月</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control placeholder="取引人月" value={traderPersonFront}
                                    onChange={(e) => this.vNumberChange(e, 'traderPersonFront')} id="traderPersonFront" name="traderPersonFront" />{"~"}
                                <Form.Control placeholder="取引人月" value={traderPersonBack}
                                    onChange={(e) => this.vNumberChange(e, 'traderPersonBack')} id="traderPersonBack" name="traderPersonBack" />
                            </InputGroup>
                        </Col>
                    </Row>
                    <br />
                    <div style={{ "textAlign": "center" }}>
                        <Button onClick={this.search} size="sm" variant="info">
                            <FontAwesomeIcon icon={faSearch} /> 検索
                            </Button>{' '}
                        <Link to={tsuikaPath} className="btn btn-sm btn-info">
                            <FontAwesomeIcon icon={faSave} />追加
                            </Link>{' '}
                        <Button size="sm" variant="info" onClick={this.reset}>
                            <FontAwesomeIcon icon={faUndo} /> Reset
                            </Button>
                    </div>
                </Form>
                <Form>
                    <br />
                    <Row>
                        <Col sm={10}>
                        </Col>
                        <Col sm={2}>
                            <div style={{ "float": "right" }}>
                                <Link to={shosaiPath} className="btn btn-sm btn-info" id="shosai"><FontAwesomeIcon icon={faList} />詳細</Link>{' '}
                                <Link to={shuseiPath} className="btn btn-sm btn-info" id="shusei"><FontAwesomeIcon icon={faEdit} />修正</Link>{' '}
                                <Button variant="info" size="sm" id="sakujo" onClick={this.listDelete} > <FontAwesomeIcon icon={faTrash} />删除</Button>
                            </div>
                        </Col>
                    </Row>
                    <Col sm={12}>
                        <BootstrapTable selectRow={selectRow} pagination={true} data={customerInfoData} options={options} deleteRow
                            headerStyle={{ background: '#5599FF' }} striped hover condensed>
                            <TableHeaderColumn isKey dataField='rowNo' tdStyle={{ padding: '.45em' }} width='70'>番号</TableHeaderColumn>
                            <TableHeaderColumn dataField='customerNo' tdStyle={{ padding: '.45em' }} width="110">お客様番号</TableHeaderColumn>
                            <TableHeaderColumn dataField='customerName' tdStyle={{ padding: '.45em' }} width="160">お客様名</TableHeaderColumn>
                            <TableHeaderColumn dataField='levelName' tdStyle={{ padding: '.45em' }} width="110">ランキング</TableHeaderColumn>
                            <TableHeaderColumn dataField='stationName' tdStyle={{ padding: '.45em' }} >本社場所</TableHeaderColumn>
                            <TableHeaderColumn dataField='companyNatureName' tdStyle={{ padding: '.45em' }} width="110">会社性質</TableHeaderColumn>
                            <TableHeaderColumn dataField='paymentSiteName' tdStyle={{ padding: '.45em' }} width="160">支払サイト</TableHeaderColumn>
                            <TableHeaderColumn dataField='capitalStock' tdStyle={{ padding: '.45em' }} width="160" dataFormat={this.addMarkCapitalStock}>資本金(百万円)</TableHeaderColumn>
                            <TableHeaderColumn dataField='purchasingManagers' tdStyle={{ padding: '.45em' }} width="160">営業担当者</TableHeaderColumn>
                            <TableHeaderColumn dataField='traderPerson' tdStyle={{ padding: '.45em' }} width="160">取引総人月</TableHeaderColumn>
                        </BootstrapTable>
                    </Col>
                </Form>
            </div>
        );
    }
    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
                {start}から  {to}まで , 総計{total}
            </p>
        );
    }
}
export default CustomerInfoSearch;