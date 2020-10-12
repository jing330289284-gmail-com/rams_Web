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
import { faSave, faUndo, faTrash } from '@fortawesome/free-solid-svg-icons';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TableSelect from './TableSelect';
axios.defaults.withCredentials = true;
registerLocale('ja', ja);

class CustomerInfo extends Component {
    state = {
        showBankInfoModal: false,//口座情報画面フラグ
        showCustomerInfoModal: false,//上位お客様情報画面フラグ
        establishmentDate: '',//設立の期日
        businessStartDate: '',//取引開始の期日
        topCustomerDrop: [],//上位お客様連想の数列
        topCustomerName: '',//上位お客様のname
        rowNo: '',//行のコード
        customerDepartmentName: '',//部門コード
        customerDepartmentNameDrop: [],//部門の連想数列
        customerDepartmentList: [],//部門情報数列
        accountInfo: null,//口座情報のデータ
        actionType: '',//処理区分
        topCustomerInfo: null,//上位お客様情報データ
        stationCodeDrop: [],//本社場所
        myToastShow: false,
        errorsMessageShow: false,
        errorsMessageValue: '',
        stationCode: '',
        message: '',
        type: '',
        topCustomer: '',
        positionDrop: [],
        typeOfIndustryDrop: [],
        developLanguageDrop: [],
        currentPage:1,//今のページ
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
        this.setState({
            actionType: this.props.location.state.actionType,
        })
        $("#customerNo").val(this.props.location.state.customerNo);
        $("#sakujo").attr("disabled", true);
        var methodArray = ["getListedCompany", "getLevel", "getCompanyNature", "getPosition", "getPaymentsite", "getTopCustomer", "getDepartmentMasterDrop", "getStation",
            "getTypeOfIndustry", "getDevelopLanguage"]
        var selectDataList = utils.getPublicDropDown(methodArray);
        //上場会社
        var listedCompanyFlag = selectDataList[0];
        //お客様ランキン
        var levelCode = selectDataList[1];
        //会社性質
        var companyNature = selectDataList[2];
        //職位
        var positionCode = selectDataList[3];
        //支払サイト
        var paymentsiteCode = selectDataList[4];
        var topCustomerDrop = [];
        var customerDepartmentNameDrop = [];
        var stationCodeDrop = [];
        var typeOfIndustryDrop = selectDataList[8];
        var developLanguageDrop = selectDataList[9];
        topCustomerDrop = selectDataList[5];
        topCustomerDrop.shift();
        customerDepartmentNameDrop = selectDataList[6];
        customerDepartmentNameDrop.shift();
        stationCodeDrop = selectDataList[7];
        stationCodeDrop.shift();
        this.setState({
            topCustomerDrop: topCustomerDrop,
            customerDepartmentNameDrop: customerDepartmentNameDrop,
            stationCodeDrop: stationCodeDrop,
            positionDrop: positionCode,
            typeOfIndustryDrop: typeOfIndustryDrop,
            developLanguageDrop: developLanguageDrop,
        })
        for (let i = 1; i < listedCompanyFlag.length; i++) {
            $("#listedCompanyFlag").append('<option value="' + listedCompanyFlag[i].code + '">' + listedCompanyFlag[i].name + '</option>');
        }
        for (let i = 0; i < levelCode.length; i++) {
            $("#levelCode").append('<option value="' + levelCode[i].code + '">' + levelCode[i].name + '</option>');
        }
        for (let i = 0; i < companyNature.length; i++) {
            $("#companyNatureCode").append('<option value="' + companyNature[i].code + '">' + companyNature[i].name + '</option>');
        }
        for (let i = 0; i < positionCode.length; i++) {
            $("#positionCode").append('<option value="' + positionCode[i].code + '">' + positionCode[i].name + '</option>');
        }
        for (let i = 0; i < paymentsiteCode.length; i++) {
            $("#paymentsiteCode").append('<option value="' + paymentsiteCode[i].code + '">' + paymentsiteCode[i].name + '</option>');
        }
        if (this.state.actionType !== "update") {
            $("#toBankInfo").attr("disabled", true);
        }
        var customerInfoMod = {};
        customerInfoMod["customerNo"] = $("#customerNo").val();
        customerInfoMod["actionType"] = this.props.location.state.actionType;
        await axios.post("http://127.0.0.1:8080/customerInfo/onloadPage", customerInfoMod)
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
        customerInfoMod["topCustomerNo"] = utils.labelGetValue($("#topCustomer").val(), this.state.topCustomerDrop);
        customerInfoMod["establishmentDate"] = utils.formateDate(this.state.establishmentDate, false);
        customerInfoMod["businessStartDate"] = utils.formateDate(this.state.businessStartDate, false);
        customerInfoMod["actionType"] = this.state.actionType;
        customerInfoMod["customerDepartmentList"] = this.state.customerDepartmentList;
        customerInfoMod["accountInfo"] = this.state.accountInfo;
        customerInfoMod["stationCode"] = utils.labelGetValue($("#stationCode").val(), this.state.stationCodeDrop);;
        customerInfoMod["topCustomerInfo"] = this.state.topCustomerInfo;
        axios.post("http://127.0.0.1:8080/customerInfo/toroku", customerInfoMod)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "処理成功" });
                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                    window.location.reload();
                }else {
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
        var currentPage = Math.ceil(departmentList.length/5);
        this.setState({
            currentPage:currentPage,
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
            axios.post("http://127.0.0.1:8080/customerInfo/customerDepartmentdelete", customerDepartmentInfoModel)
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
    }
    //削除前のデフォルトお知らせの削除
    customConfirm(next, dropRowKeys) {
        const dropRowKeysStr = dropRowKeys.join(',');
        next();
    }
    handleTag = ({ target }, fieldName) => {
        const { value, id } = target;
        if (value === '') {
            this.setState({
                [id]: '',
            })
        } else {
            if (this.state.customerDepartmentNameDrop.find((v) => (v.name === value)) !== undefined ||
                this.state.topCustomerDrop.find((v) => (v.name === value)) !== undefined ||
                this.state.stationCodeDrop.find((v) => (v.name === value)) !== undefined) {
                switch (fieldName) {
                    case 'customerDepartment':
                        this.setState({
                            customerDepartmentName: this.state.customerDepartmentNameDrop.find((v) => (v.name === value)).code,
                        })
                        break;
                    case 'topCustomer':
                        this.setState({
                            topCustomer: this.state.topCustomerDrop.find((v) => (v.name === value)).code,
                        })
                        break;
                    case 'stationCode':
                        this.setState({
                            stationCode: this.state.stationCodeDrop.find((v) => (v.name === value)).code,
                        })
                        break;
                    default:
                }
            }
        }
    };
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
        var stationCodeDrop = this.state.stationCodeDrop;
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
    insertRow=()=>{
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
        var currentPage = Math.ceil(customerDepartmentList.length/5);
        this.setState({
            customerDepartmentList:customerDepartmentList,
            currentPage:currentPage,
        })
    }
    /**
     * リセットブタン
     */
    reset=()=>{
        this.setState({
            stationCode:'',
            topCustomer:'',
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
        $("#toBankInfo").attr("disabled",true);
    }
    render() {
        const { topCustomerInfo, stationCode, customerDepartmentList, accountInfo
            , actionType, topCustomer, errorsMessageValue, message, type, positionDrop } = this.state;
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
                            <BankInfo accountInfo={accountInfo} actionType={actionType} accountTokuro={this.accountInfoGet} />
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
                    <br/>
                    <Form id="customerForm">
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">お客様番号</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="6" placeholder="お客様番号" id="customerNo" name="customerNo" readOnly />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="例：LYC株式会社" maxLength="50" id="customerName" onChange={customerInfoJs.toDisabed} name="customerName" /><font color="red"
                                        style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">略称</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="LYC" maxLength="20" id="customerAbbreviation" name="customerAbbreviation" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">代表取締役</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="例：中山毛石" maxLength="20" id="representative" name="representative" />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">本社場所</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Autocomplete
                                        disabled={this.state.actionType === "detail" ? true : false}
                                        id="stationCode"
                                        name="stationCode"
                                        value={this.state.stationCodeDrop.find((v) => (v.code === this.state.stationCode)) || {}}
                                        onSelect={(event) => this.handleTag(event, 'stationCode')}
                                        options={this.state.stationCodeDrop}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <input placeholder="  例：秋葉原駅" type="text" {...params.inputProps} className="auto"
                                                    style={{ width: 245, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
                                            </div>
                                        )}
                                    />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">設立</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <DatePicker
                                        selected={this.state.establishmentDate}
                                        onChange={this.establishmentDateChange}
                                        dateFormat="yyyy/MM"
                                        autoComplete="off"
                                        locale="pt-BR"
                                        id="customerInfoDatePicker"
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
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">取引開始日</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <DatePicker
                                        selected={this.state.businessStartDate}
                                        onChange={this.businessStartDateChange}
                                        dateFormat="yyyy/MM"
                                        autoComplete="off"
                                        locale="pt-BR"
                                        id="customerInfoDatePicker"
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
                                        <InputGroup.Text id="inputGroup-sizing-sm">上位お客様</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Autocomplete
                                        disabled={this.state.actionType === "detail" ? true : false}
                                        id="topCustomer"
                                        name="topCustomer"
                                        value={this.state.topCustomerDrop.find((v) => (v.code === this.state.topCustomer)) || {}}
                                        onSelect={(event) => this.handleTag(event, 'topCustomer')}
                                        options={this.state.topCustomerDrop}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <input placeholder="  例：富士通" type="text" {...params.inputProps} className="auto"
                                                    style={{ width: 230, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
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
                                        <InputGroup.Text id="inputGroup-sizing-sm">お客様ランキング</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" placeholder="お客様ランキング" id="levelCode" name="levelCode" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">上場会社</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" placeholder="上場会社" id="listedCompanyFlag" name="listedCompanyFlag">
                                    </Form.Control>
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">会社性質</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" placeholder="会社性質" id="companyNatureCode" name="companyNatureCode" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">URL</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="" placeholder="www.lyc.co.jp" id="url" name="url" />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">購買担当</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="20" placeholder="例：田中" id="purchasingManagers" name="purchasingManagers" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">メール</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="50" placeholder="xxxxxxxxx@xxx.xxx.com" id="purchasingManagersMail" name="purchasingManagersMail" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">支払サイト</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control as="select" placeholder="支払サイト" id="paymentsiteCode" name="paymentsiteCode" />
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="50" placeholder="備考" id="remark" name="remark" />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">資本金</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="5" placeholder="例：1000" id="capitalStock" name="capitalStock" />
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>万円</InputGroup.Text>
                                    </InputGroup.Prepend>
                                </InputGroup>
                            </Col>
                            <Col sm={7}>
                            </Col>
                            <Col className="text-right">
                                <Button size="sm" variant="info" id="reset" onClick={this.reset} >
                                    <FontAwesomeIcon icon={faUndo} />リセット
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <hr style={{ height: "1px", border: "none", borderTop: "1px solid #555555" }} />
                    <Form.Text style={{ "color": "#FFD700" }}>部門情報</Form.Text>
                        <Row>
                            <Col sm={10}></Col>
                            <Col sm={2}>
                                <div style={{ "float": "right" }}>
                                    <Button size="sm" variant="info" onClick={this.insertRow} id="insertRow" type="button">
                                        <FontAwesomeIcon icon={faSave} />追加
                        </Button>{" "}
                                    <Button size="sm" onClick={this.listDelete} variant="info" id="sakujo" type="button">
                                        <FontAwesomeIcon icon={faTrash} />删除
                        </Button>
                                </div>
                            </Col>
                        </Row>
                        <div>
                            <BootstrapTable selectRow={actionType !== "detail" ? selectRow : selectRowDetail}
                                pagination={true}
                                options={options}
                                deleteRow data={customerDepartmentList}
                                insertRow
                                cellEdit={cellEdit}
                                headerStyle={{ background: '#5599FF' }} striped hover condensed>
                                <TableHeaderColumn row='0' rowSpan='2' isKey dataField='rowNo' tdStyle={{ padding: '.45em' }}  width='90'>番号</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='responsiblePerson' tdStyle={{ padding: '.45em' }}  width="130">責任者</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='customerDepartmentCode' tdStyle={{ padding: '.45em' }}  width="230"
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
                        </div>
                        <input type="hidden" id="employeeNo" name="employeeNo" />
                </div>
                <div style={{ "textAlign": "center" }}>
                        <Button size="sm" onClick={this.toroku} variant="info" id="toroku" type="button">
                            <FontAwesomeIcon icon={faSave} />{actionType === "update" ? "更新" : "登録"}
                        </Button>
                </div>
            </div>
        );
    }
}

export default CustomerInfo;