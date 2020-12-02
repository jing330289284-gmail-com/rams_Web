import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, Modal, Card } from 'react-bootstrap';
import * as customerInfoJs from '../components/customerInfoJs.js';
import $ from 'jquery';
import BankInfo from './accountInfo';
import '../asserts/css/login.css';
import TopCustomerInfo from './topCustomerInfo';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import axios from 'axios';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import * as utils from './utils/publicUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faTrash, faArrowCircleUp, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TableSelect from './TableSelect';
import store from './redux/store';
axios.defaults.withCredentials = true;
registerLocale('ja', ja);
/**
 * お客様情報登録画面
 */
class CustomerInfo extends Component {
    state = {
        showBankInfoModal: false,//口座情報画面フラグ
        showCustomerInfoModal: false,//上位お客様情報画面フラグ
        establishmentDate: '',//設立の期日
        businessStartDate: '',//取引開始の期日
        topCustomerDrop: store.getState().dropDown[35].slice(1),
        topCustomerName: '',//上位お客様のname
        rowNo: '',//行のコード
        customerDepartmentName: '',//部門コード
        customerDepartmentNameDrop: store.getState().dropDown[55].slice(1),//部門の連想数列
        customerDepartmentList: [],//部門情報数列
        accountInfo: null,//口座情報のデータ
        actionType: '',//処理区分
        customerNoForPageChange: "",
        topCustomerInfo: null,//上位お客様情報データ
        stationCodeDrop: store.getState().dropDown[14].slice(1),//本社場所
        stationCodeDrop2: store.getState().dropDown[14],//本社場所
        listedCompanyFlag: store.getState().dropDown[17],
        levelCodeDrop: store.getState().dropDown[18],
        companyNatureDrop: store.getState().dropDown[19],
        paymentsiteCodeDrop: store.getState().dropDown[21],
        searchFlag: true,
        sendValue: {},
        customerNo: '',
        backPage: "",//遷移元
        myToastShow: false,
        errorsMessageShow: false,
        errorsMessageValue: '',
        stationCode: '',
        message: '',
        type: '',
        topCustomer: '',
        insertFlag: false,
        positionDrop: store.getState().dropDown[20],
        typeOfIndustryDrop: store.getState().dropDown[36],
        developLanguageDrop: store.getState().dropDown[8],
        currentPage: 1,//今のページ
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
    }
    /**
     *  設立のonChange
     */
    establishmentDateChange = date => {
        if (date !== null) {
            this.setState({
                establishmentDate: date,
            });
        } else {
            this.setState({
                establishmentDate: '',
            });
        }
    };
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
    };
    constructor(props) {
        super(props);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
    }
    /**
    * 小さい画面の閉め 
    */
    handleHideModal = (Kbn) => {
        if (Kbn === "bankInfo") {
            this.setState({ showBankInfoModal: false })
        } else if (Kbn === "customerInfo") {
            this.setState({ showCustomerInfoModal: false })
        }
    }
    /**
    *  小さい画面の開き
    */
    handleShowModal = (Kbn) => {
        if (Kbn === "bankInfo") {
            this.setState({ showBankInfoModal: true })
        } else if (Kbn === "customerInfo") {
            this.setState({ showCustomerInfoModal: true })
        }
    }
    /**
    * 画面の初期化 
    */
    async componentDidMount() {
        console.log(this.props.history);
        this.setState({
            actionType: this.props.location.state.actionType,
            backPage: this.props.location.state.backPage,
            sendValue: this.props.location.state.sendValue,
            searchFlag: this.props.location.state.searchFlag,
            customerNoForPageChange: this.props.location.state.customerNo,
        })
        $("#customerNo").val(this.props.location.state.customerNo);
        this.setState({
            customerNo: this.props.location.state.customerNo,
        })
        $("#sakujo").attr("disabled", true);
        if (this.state.actionType !== "update") {
            $("#toBankInfo").attr("disabled", true);
        }
        var customerInfoMod = {};
        customerInfoMod["customerNo"] = $("#customerNo").val();
        customerInfoMod["actionType"] = this.props.location.state.actionType;
        await axios.post(this.state.serverIP + "customerInfo/onloadPage", customerInfoMod)
            .then(resultMap => {
                var customerInfoMod;
                var actionType = this.state.actionType;
                customerInfoMod = resultMap.data.customerInfoMod;
                if (actionType === "insert") {
                    var customerNoSaiBan = resultMap.data.customerNoSaiBan;
                    $("#customerNo").val(customerNoSaiBan);
                    $("#customerNo").attr("readOnly", true);
                    this.setState({
                        customerDepartmentList: resultMap.data.customerDepartmentInfoList,
                        customerNo: customerNoSaiBan,
                    })
                } else {
                    $("#customerName").val(customerInfoMod.customerName);
                    $("#customerAbbreviation").val(customerInfoMod.customerAbbreviation);
                    this.setState({
                        stationCode: customerInfoMod.stationCode,
                        topCustomer: customerInfoMod.topCustomerNo,
                    })
                    $("#levelCode").val(customerInfoMod.levelCode);
                    $("#listedCompanyFlag").val(customerInfoMod.listedCompanyFlag);
                    $("#companyNatureCode").val(customerInfoMod.companyNatureCode);
                    $("#representative").val(customerInfoMod.representative);
                    $("#paymentsiteCode").val(customerInfoMod.paymentsiteCode);
                    $("#purchasingManagersMail").val(customerInfoMod.purchasingManagersMail);
                    $("#purchasingManagers").val(customerInfoMod.purchasingManagers);
                    $("#capitalStock").val(customerInfoMod.capitalStock);
                    $("#url").val(customerInfoMod.url);
                    $("#remark").val(customerInfoMod.remark);
                    this.setState({
                        businessStartDate: utils.converToLocalTime(customerInfoMod.businessStartDate, false),
                        establishmentDate: utils.converToLocalTime(customerInfoMod.establishmentDate, false),
                        customerDepartmentList: resultMap.data.customerDepartmentInfoList,
                    })
                    if (resultMap.data.customerDepartmentInfoList.length === 0) {
                        $("#meisaiToroku").attr("disabled", true);
                    }
                    $("#toBankInfo").attr("disabled", false);
                    if (actionType === 'detail') {
                        customerInfoJs.setDisabled();
                    }
                }
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
            });
    }
    /**
     * 登録ボタン
     */
    toroku = () => {
        var customerInfoMod = {};
        var formArray = $("#customerForm").serializeArray();
        $.each(formArray, function (i, item) {
            customerInfoMod[item.name] = item.value;
        });
        customerInfoMod["capitalStock"] = utils.deleteComma($("#capitalStock").val());
        customerInfoMod["topCustomerNo"] = utils.labelGetValue($("#topCustomer").val(), this.state.topCustomerDrop);
        customerInfoMod["establishmentDate"] = utils.formateDate(this.state.establishmentDate, false);
        customerInfoMod["businessStartDate"] = utils.formateDate(this.state.businessStartDate, false);
        customerInfoMod["actionType"] = this.state.actionType;
        // customerInfoMod["customerDepartmentList"] = this.state.customerDepartmentList;
        customerInfoMod["accountInfo"] = this.state.accountInfo;
        customerInfoMod["stationCode"] = utils.labelGetValue($("#stationCode").val(), this.state.stationCodeDrop);;
        customerInfoMod["topCustomerInfo"] = this.state.topCustomerInfo;
        axios.post(this.state.serverIP + "customerInfo/toroku", customerInfoMod)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "処理成功" });
                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                    if (this.state.actionType === "insert") {
                        window.location.reload();
                    }
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                }
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
            });
    }
    /**
     * 行の削除
     */
    listDelete = () => {
        var a = window.confirm("削除していただきますか？");
        if (a) {
            $("#delectBtn").click();
        }
    }

    /**
     * 行Selectファンクション
     */
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            $("#positionCode").val(row.positionCode);
            $("#customerDepartmentName").val(row.customerDepartmentName);
            $("#responsiblePerson").val(row.responsiblePerson);
            $("#customerDepartmentMail").val(row.customerDepartmentMail);
            this.setState({
                rowNo: row.rowNo,
                customerDepartmentName: row.customerDepartmentCode,
            })
            $("#sakujo").attr("disabled", false);
        } else {
            $("#positionCode").val('');
            $("#responsiblePerson").val('');
            $("#customerDepartmentMail").val('');
            $("#customerDepartmentName").val('');
            this.setState({
                customerDepartmentValue: '',
                customerDepartmentName: '',
            })
            $("#sakujo").attr("disabled", true);
        }
    }
    /**
     * ポップアップ口座情報の取得
     */
    accountInfoGet = (accountTokuro) => {
        this.setState({
            accountInfo: accountTokuro,
            showBankInfoModal: false,
        })
        console.log(accountTokuro);
    }
    /**
     * ポップアップ上位お客様情報の取得
     */
    topCustomerInfoGet = (topCustomerToroku) => {
        if (this.state.topCustomer !== null && this.state.topCustomer !== '' && this.state.topCustomer !== undefined) {
            console.log(topCustomerToroku);//上位お客様更新の場合
            var topCustomerDrop = this.state.topCustomerDrop;
            for (let i = topCustomerDrop.length - 1; i >= 0; i--) {
                if (topCustomerDrop[i].code === topCustomerToroku.topCustomerNo) {
                    var top = {};
                    top["code"] = topCustomerToroku.topCustomerNo;
                    top["name"] = topCustomerToroku.topCustomerName;
                    topCustomerDrop[i] = top;
                    this.setState({
                        topCustomer: topCustomerToroku.topCustomerNo,
                    })
                }
            }
            this.setState({
                topCustomerDrop: topCustomerDrop,
                topCustomerInfo: topCustomerToroku,
                showCustomerInfoModal: false,
            })
        } else {//上位お客様追加の場合
            var ModelClass = {};
            ModelClass["code"] = topCustomerToroku.topCustomerNo;
            ModelClass["name"] = topCustomerToroku.topCustomerName;
            this.setState({
                topCustomer: topCustomerToroku.topCustomerNo,
                topCustomerDrop: [...this.state.topCustomerDrop, ModelClass],
                topCustomerInfo: topCustomerToroku,
                showCustomerInfoModal: false,
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
    //隠した削除ボタン
    createCustomDeleteButton = (onClick) => {
        return (
            <Button variant="info" id="delectBtn" hidden onClick={onClick} >删除</Button>
        );
    }
    //隠した削除ボタンの実装
    onDeleteRow = (rows) => {
        // ...
        var id = this.state.rowNo;
        var departmentList = this.state.customerDepartmentList;
        for (let i = departmentList.length - 1; i >= 0; i--) {
            if (departmentList[i].rowNo === id) {
                departmentList.splice(i, 1);
            }
        }
        if (departmentList.length !== 0) {
            for (let i = departmentList.length - 1; i >= 0; i--) {
                departmentList[i].rowNo = (i + 1);
            }
        }
        var currentPage = Math.ceil(departmentList.length / 5);
        this.setState({
            currentPage: currentPage,
            customerDepartmentList: departmentList,
            rowNo: '',
            customerDepartmentNameValue: '',
            customerDepartmentName: '',
        })
        $("#positionCode").val('');
        $("#responsiblePerson").val('');
        $("#customerDepartmentMail").val('');
        var customerDepartmentInfoModel = {};
        customerDepartmentInfoModel["customerNo"] = $("#customerNo").val();
        customerDepartmentInfoModel["customerDepartmentCode"] = this.state.customerDepartmentName;
        if (this.state.actionType === "update") {
            axios.post(this.state.serverIP + "customerInfo/customerDepartmentdelete", customerDepartmentInfoModel)
                .then(result => {
                    if (result.data === true) {
                        this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "削除成功" });
                        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                    } else {
                        this.setState({ "myToastShow": true, "type": "fail", "errorsMessageShow": false, message: '削除失敗' });
                        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                    }
                })
                .catch(function (error) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
                });
        }
        $("#sakujo").attr("disabled", true);
        if (this.state.customerDepartmentList.length === 0) {
            $("#meisaiToroku").attr("disabled", true);
        }
    }
    //削除前のデフォルトお知らせの削除
    customConfirm(next, dropRowKeys) {
        const dropRowKeysStr = dropRowKeys.join(',');
        next();
    }
    getStationCode = (event, values) => {
        if (values != null) {
            this.setState({
                stationCode: values.code,
            })
        } else {
            this.setState({
                stationCode: "",
            })
        }
    }
    getTopCustomer = (event, values) => {
        if (values != null) {
            this.setState({
                topCustomer: values.code,
            })
        } else {
            this.setState({
                topCustomer: "",
            })
        }
    }
    // レコードおきゃく表示
    formatCustomerDepartment = (cell) => {
        var customerDepartmentNameDrop = this.state.customerDepartmentNameDrop;
        if (cell === '') {
            return '';
        } else {
            for (var i in customerDepartmentNameDrop) {
                if (cell === customerDepartmentNameDrop[i].code) {
                    return customerDepartmentNameDrop[i].name;
                }
            }
        }
    }

    getCustomerDepartment = (no) => {
        this.state.customerDepartmentList[this.state.rowNo - 1].customerDepartmentCode = no;
        this.formatCustomerDepartment(no);
    }

    // レコードおきゃく表示
    formatPosition = (cell) => {
        var positionDrop = this.state.positionDrop;
        if (cell === '') {
            return '';
        } else {
            for (var i in positionDrop) {
                if (cell === positionDrop[i].code) {
                    return positionDrop[i].name;
                }
            }
        }
    }

    getPosition = (no) => {
        this.state.customerDepartmentList[this.state.rowNo - 1].positionCode = no;
        this.formatPosition(no);
    }
    // レコードおきゃく表示
    formatIndustry = (cell) => {
        var typeOfIndustryDrop = this.state.typeOfIndustryDrop;
        if (cell === '') {
            return '';
        } else {
            for (var i in typeOfIndustryDrop) {
                if (cell === typeOfIndustryDrop[i].code) {
                    return typeOfIndustryDrop[i].name;
                }
            }
        }
    }

    getIndustry = (no) => {
        this.state.customerDepartmentList[this.state.rowNo - 1].typeOfIndustryCode = no;
        this.formatIndustry(no);
    }
    // レコードおきゃく表示
    formatStation = (cell) => {
        var stationCodeDrop = this.state.stationCodeDrop2;
        if (cell === '') {
            return '';
        } else {
            for (var i in stationCodeDrop) {
                if (cell === stationCodeDrop[i].code) {
                    return stationCodeDrop[i].name;
                }
            }
        }
    }

    getStation = (no) => {
        this.state.customerDepartmentList[this.state.rowNo - 1].stationCode = no;
        this.formatStation(no);
    }
    // レコードおきゃく表示
    formatLanguage = (cell) => {
        var developLanguageDrop = this.state.developLanguageDrop;
        if (cell === '') {
            return '';
        } else {
            for (var i in developLanguageDrop) {
                if (cell === developLanguageDrop[i].code) {
                    return developLanguageDrop[i].name;
                }
            }
        }
    }

    getLanguage1 = (no) => {
        this.state.customerDepartmentList[this.state.rowNo - 1].developLanguageCode1 = no;
        this.formatLanguage(no);
    }
    getLanguage2 = (no) => {
        this.state.customerDepartmentList[this.state.rowNo - 1].developLanguageCode2 = no;
        this.formatLanguage(no);
    }
    /**
     * 行追加
     */
    insertRow = () => {
        var customerDepartmentList = this.state.customerDepartmentList;
        var customerDepartment = {};
        customerDepartment["rowNo"] = customerDepartmentList.length + 1;
        customerDepartment["responsiblePerson"] = "";
        customerDepartment["customerDepartmentCode"] = "";
        customerDepartment["positionCode"] = "";
        customerDepartment["customerDepartmentMail"] = "";
        customerDepartment["typeOfIndustryCode"] = "";
        customerDepartment["stationCode"] = "";
        customerDepartment["developLanguageCode1"] = "";
        customerDepartment["developLanguageCode2"] = "";
        customerDepartmentList.push(customerDepartment);
        var currentPage = Math.ceil(customerDepartmentList.length / 5);
        this.setState({
            customerDepartmentList: customerDepartmentList,
            currentPage: currentPage,
        })
        $("#meisaiToroku").attr("disabled", false);
        this.refs.table.setState({
            selectedRowKeys: []
        });
    }
    /**
     * 明細登録
     */
    meisaiToroku = () => {
        var customerInfoMod = {};
        customerInfoMod["customerNo"] = $("#customerNo").val();
        customerInfoMod["actionType"] = this.state.actionType;
        customerInfoMod["customerDepartmentList"] = this.state.customerDepartmentList;
        axios.post(this.state.serverIP + "customerInfo/toroku", customerInfoMod)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "明細登録成功", customerDepartmentList: result.data.customerDepartmentList });
                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                }
            })
            .catch(error=> {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
            });
    }
    /**
     * リセットブタン
     */
    reset = () => {
        this.setState({
            stationCode: '',
            topCustomer: '',
            establishmentDate: '',
            businessStartDate: '',
        })
        $("#customerName").val("");
        $("#stationCode").val("");
        $("#establishmentDate").val("");
        $("#levelCode").val("");
        $("#listedCompanyFlag").val("0");
        $("#companyNatureCode").val("");
        $("#paymentsiteCode").val("");
        $("#purchasingManagersMail").val("");
        $("#purchasingManagers").val("");
        $("#capitalStock").val("");
        $("#customerAbbreviation").val("");
        $("#representative").val("");
        $("#url").val("");
        $("#remark").val("");
        $("#toBankInfo").attr("disabled", true);
    }
    moneyChange = (e) => {
        var id = e.target.id;
        var money = document.getElementById(id).value;
        $("#" + id + "").val(utils.addComma(money));
    }
    /**
     * 戻るボタン
     */
    back = () => {
        var path = {};
        path = {
            pathname: this.state.backPage,
            state: { searchFlag: this.state.searchFlag, sendValue: this.state.sendValue, customerNo: this.state.customerNoForPageChange },
        }
        this.props.history.push(path);
    }
    render() {
        const { topCustomerInfo, stationCode, customerDepartmentList, accountInfo
            , actionType, topCustomer, errorsMessageValue, message, type, positionDrop, customerNo, backPage } = this.state;
        const accountPath = {
            pathName: `${this.props.match.url}/`, state: this.state.accountInfo,
        }
        //テーブルの列の選択
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            clickToSelectAndEditCell: true,
            hideSelectColumn: true,
            clickToSelect: true,  // click to select, default is false
            clickToExpand: true,// click to expand row, default is false
            onSelect: this.handleRowSelect,
        };
        //テーブルの列の選択
        const selectRowDetail = {
        };
        const cellEdit = {
            mode: 'click',
            blurToSave: true,
        }
        const cellEditDetail = {
        }
        //テーブルの定義
        const options = {
            onPageChange: page => {
                this.setState({ currentPage: page });
            },
            page: this.state.currentPage,
            noDataText: (<i className="" style={{ 'fontSize': '24px' }}>データなし</i>),
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
        const tableSelect1 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={5} onUpdate={onUpdate} {...props} />);
        const tableSelect2 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={6} onUpdate={onUpdate} {...props} />);
        const tableSelect3 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={7} onUpdate={onUpdate} {...props} />);
        const tableSelect4 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={8} onUpdate={onUpdate} {...props} />);
        const tableSelect5 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={9} onUpdate={onUpdate} {...props} />);
        const tableSelect6 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={10} onUpdate={onUpdate} {...props} />);
        return (
            <div>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
                </div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <div>
                    <Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" dialogClassName="modal-accountInfo"
                        onHide={this.handleHideModal.bind(this, "bankInfo")} show={this.state.showBankInfoModal}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body >
                            <BankInfo accountInfo={accountInfo} actionType={actionType} customerNo={customerNo} accountTokuro={this.accountInfoGet} />
                        </Modal.Body>
                    </Modal>
                    <Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" dialogClassName="modal-topCustomerInfo"
                        onHide={this.handleHideModal.bind(this, "customerInfo")} show={this.state.showCustomerInfoModal}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                            <TopCustomerInfo topCustomer={topCustomer} topCustomerInfo={topCustomerInfo} actionType={actionType} topCustomerToroku={this.topCustomerInfoGet} />
                        </Modal.Body>
                    </Modal>
                    <Row inline="true">
                        <Col className="text-center">
                            <h2>お客様情報</h2>
                        </Col>
                    </Row>
                    <br />
                    <div style={{ "textAlign": "center" }}>
                        <Button size="sm" id="toBankInfo" onClick={this.handleShowModal.bind(this, "bankInfo")}>
                            お客様口座情報
                        </Button>{' '}
                        <Button size="sm" id="toCustomerInfo" onClick={this.handleShowModal.bind(this, "customerInfo")}>
                            上位お客様
                        </Button>
                    </div>
                    <br />
                    <Form id="customerForm">
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="fiveKanji">お客様番号</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="6" id="customerNo" name="customerNo" readOnly />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text >お客様名</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="例：LYC株式会社" maxLength="50" id="customerName" onChange={customerInfoJs.toDisabed} name="customerName" /><font color="red"
                                        style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>略称</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="例：LYC" maxLength="20" id="customerAbbreviation" name="customerAbbreviation" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="fiveKanji">代表取締役</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="例：中山毛石" maxLength="20" id="representative" name="representative" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>資本金</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="6" placeholder="例：1000" id="capitalStock" name="capitalStock" onChange={(e) => this.moneyChange(e)} />
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>百万円</InputGroup.Text>
                                    </InputGroup.Prepend>
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>設立</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <DatePicker
                                        selected={this.state.establishmentDate}
                                        onChange={this.establishmentDateChange}
                                        dateFormat="yyyy/MM"
                                        autoComplete="off"
                                        locale="pt-BR"
                                        id={actionType === "detail" ? "customerInfoDatePickerReadOnly" : "customerInfoDatePicker"}
                                        yearDropdownItemNumber={15}
                                        scrollableYearDropdown
                                        showMonthYearPicker
                                        showFullMonthYearPicker
                                        showDisabledMonthNavigation
                                        className="form-control form-control-sm"
                                        name="establishmentDate"
                                        locale="ja"
                                        disabled={actionType === "detail" ? true : false}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>本社場所</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Autocomplete
                                        disabled={this.state.actionType === "detail" ? true : false}
                                        id="stationCode"
                                        name="stationCode"
                                        value={this.state.stationCodeDrop.find(v => v.code === this.state.stationCode) || {}}
                                        onChange={(event, values) => this.getStationCode(event, values)}
                                        options={this.state.stationCodeDrop}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <input placeholder=" 例：秋葉原駅" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfo"
                                                />
                                            </div>
                                        )}
                                    />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>会社性質</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" placeholder="会社性質" id="companyNatureCode" name="companyNatureCode">
                                        {this.state.companyNatureDrop.map(date =>
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
                                        <InputGroup.Text id="fiveKanji">取引開始日</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <DatePicker
                                        selected={this.state.businessStartDate}
                                        onChange={this.businessStartDateChange}
                                        dateFormat="yyyy/MM"
                                        autoComplete="off"
                                        locale="pt-BR"
                                        id={actionType === "detail" ? "customerInfoDatePickerReadOnly" : "customerInfoDatePicker"}
                                        yearDropdownItemNumber={15}
                                        scrollableYearDropdown
                                        showMonthYearPicker
                                        showFullMonthYearPicker
                                        showDisabledMonthNavigation
                                        name="businessStartDate"
                                        className="form-control form-control-sm"
                                        locale="ja"
                                        disabled={actionType === "detail" ? true : false}
                                    />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="fiveKanji">上位お客様</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Autocomplete
                                        disabled={this.state.actionType === "detail" ? true : false}
                                        id="topCustomer"
                                        name="topCustomer"
                                        value={this.state.topCustomerDrop.find(v => v.code === this.state.topCustomer) || {}}
                                        onChange={(event, values) => this.getTopCustomer(event, values)}
                                        options={this.state.topCustomerDrop}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <input placeholder=" 例：富士通" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfo"
                                                />
                                            </div>
                                        )}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text style={{ width: "8rem" }}>お客様ランキング</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" placeholder="お客様ランキング" id="levelCode" name="levelCode">
                                        {this.state.levelCodeDrop.map(date =>
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
                                        <InputGroup.Text>上場会社</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" placeholder="上場会社" id="listedCompanyFlag" name="listedCompanyFlag">
                                        {this.state.listedCompanyFlag.map(date =>
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
                                        <InputGroup.Text>URL</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="" placeholder="例：www.lyc.co.jp" id="url" name="url" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="fiveKanji">支払サイト</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" placeholder="支払サイト" id="paymentsiteCode" name="paymentsiteCode" >
                                        {this.state.paymentsiteCodeDrop.map(date =>
                                            <option key={date.code} value={date.code}>
                                                {date.name}
                                            </option>
                                        )}
                                    </Form.Control>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>購買担当</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="20" placeholder="例：田中" id="purchasingManagers" name="purchasingManagers" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>メール</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="50" placeholder="例：xxxxxxxxx@xxx.xxx.com" id="purchasingManagersMail" name="purchasingManagersMail" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>備考</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="50" placeholder="例：備考" id="remark" name="remark" />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div style={{ "textAlign": "center" }}>
                            <Button size="sm" onClick={this.toroku} variant="info" id="toroku" type="button">
                                <FontAwesomeIcon icon={faSave} />{actionType === "update" ? "更新" : "登録"}
                            </Button>{" "}
                            <Button size="sm" variant="info" id="reset" onClick={this.reset} >
                                <FontAwesomeIcon icon={faUndo} />リセット
                                </Button>{" "}
                            <Button
                                size="sm"
                                hidden={backPage !== "customerInfoSearch" ? true : false}
                                variant="info"
                                onClick={this.back}
                            >
                                <FontAwesomeIcon icon={faLevelUpAlt} />戻る
                            </Button>
                        </div>
                    </Form>
                    <hr style={{ height: "1px", border: "none", borderTop: "1px solid #555555" }} />
                    <Form.Text style={{ "color": "#FFD700" }}>部門情報</Form.Text>
                    <Row>
                        <Col sm={8}></Col>
                        <Col sm={4}>
                            <div style={{ "float": "right" }}>
                                <Button size="sm" variant="info" onClick={this.insertRow} id="insertRow" type="button" disabled={this.state.actionType === "update" ? false : true}>
                                    <FontAwesomeIcon icon={faSave} />追加
                        </Button>{" "}
                                <Button size="sm" onClick={this.meisaiToroku} variant="info" id="meisaiToroku" type="button" disabled={this.state.actionType === "update" ? false : true}>
                                    <FontAwesomeIcon icon={faArrowCircleUp} />明細修正
                        </Button>{" "}
                                <Button size="sm" onClick={this.listDelete} variant="info" id="sakujo" type="button">
                                    <FontAwesomeIcon icon={faTrash} />删除
                        </Button>
                            </div>
                        </Col>
                    </Row>
                    <div>
                        <Col sm={12}>
                            <BootstrapTable selectRow={actionType !== "detail" ? selectRow : selectRowDetail}
                                pagination={true}
                                options={options}
                                deleteRow data={customerDepartmentList}
                                insertRow
                                ref='table'
                                cellEdit={actionType !== "detail" ? cellEdit : cellEditDetail}
                                headerStyle={{ background: '#5599FF' }} striped hover condensed>
                                <TableHeaderColumn row='0' rowSpan='2' isKey dataField='rowNo' tdStyle={{ padding: '.45em' }} width='90'>番号</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='responsiblePerson' tdStyle={{ padding: '.45em' }} width="130">責任者</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='customerDepartmentCode' tdStyle={{ padding: '.45em' }} width="230"
                                    dataFormat={this.formatCustomerDepartment.bind(this)} customEditor={{ getElement: tableSelect1 }}>部門</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='positionCode' headerAlign='center' tdStyle={{ padding: '.45em' }} dataAlign='center' width="190"
                                    dataFormat={this.formatPosition.bind(this)} customEditor={{ getElement: tableSelect2 }}>職位</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='customerDepartmentMail' headerAlign='center' tdStyle={{ padding: '.45em' }} dataAlign='center' width="190">メール</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='typeOfIndustryCode' headerAlign='center' tdStyle={{ padding: '.45em' }} dataAlign='center' width="130"
                                    dataFormat={this.formatIndustry.bind(this)} customEditor={{ getElement: tableSelect3 }}>業種</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='stationCode' headerAlign='center' tdStyle={{ padding: '.45em' }} dataAlign='center' width="130"
                                    dataFormat={this.formatStation.bind(this)} customEditor={{ getElement: tableSelect4 }}>メイン拠点</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='1' colSpan='2' dataField='' headerAlign='center' tdStyle={{ padding: '.45em' }} dataAlign='center'>メイン言語</TableHeaderColumn>
                                <TableHeaderColumn row='1' rowSpan='1' dataField='developLanguageCode1' headerAlign='center' tdStyle={{ padding: '.45em' }} dataAlign='center'
                                    dataFormat={this.formatLanguage.bind(this)} customEditor={{ getElement: tableSelect5 }}></TableHeaderColumn>
                                <TableHeaderColumn row='1' rowSpan='1' dataField='developLanguageCode2' headerAlign='center' tdStyle={{ padding: '.45em' }} dataAlign='center'
                                    dataFormat={this.formatLanguage.bind(this)} customEditor={{ getElement: tableSelect6 }}></TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </div>
                    <input type="hidden" id="employeeNo" name="employeeNo" />
                </div>
            </div>
        );
    }
}
export default CustomerInfo;