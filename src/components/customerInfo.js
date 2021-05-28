import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, Modal, Card } from 'react-bootstrap';
import * as customerInfoJs from '../components/customerInfoJs.js';
import $ from 'jquery';
import BankInfo from './accountInfo';
import '../asserts/css/login.css';
// import TopCustomerInfo from './topCustomerInfo';
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
        currPage: '',
        customerDepartmentCode2: '',
        positionCode2: '',
        customerDepartmentName: '',//部門コード
        customerDepartmentNameDrop: store.getState().dropDown[55].slice(1),//部門の連想数列
        customerDepartmentList: [],//部門情報数列
        accountInfo: null,//口座情報のデータ
        actionType: '',//処理区分
        customerNoForPageChange: "",
        // topCustomerInfo: null,//上位お客様情報データ
        stationCodeDrop: store.getState().dropDown[14].slice(1),//本社場所
        listedCompanyFlag: store.getState().dropDown[17],
        levelCodeDrop: store.getState().dropDown[18],
        companyNatureDrop: store.getState().dropDown[19],
        paymentsiteCodeDrop: store.getState().dropDown[21],
        searchFlag: true,
        sendValue: {},
        customerNo: '',
        backPage: "",//遷移元
        myMessageShow: false,
        myUpdateShow: false,
        myDeleteShow: false,
        errorsMessageShow: false,
        errorsMessageValue: '',
        stationCode: '',
        stationCode2: '',
        message: '',
        type: '',
        topCustomer: '',
        insertFlag: false,
        urlDisable: false,
        positionDrop: store.getState().dropDown[20].slice(1),
        typeOfIndustryDrop: store.getState().dropDown[36].slice(1),
        developLanguageDrop: store.getState().dropDown[8].slice(1),
        basicContractStatus: store.getState().dropDown[72].slice(1),
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
            currPage: this.props.location.state.currPage,
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
                        urlDisable: false,
                    })
                } else {
                    $("#customerName").val(customerInfoMod.customerName);
                    $("#customerAbbreviation").val(customerInfoMod.customerAbbreviation);
                    this.setState({
                        stationCode2: customerInfoMod.stationCode,
                        topCustomer: customerInfoMod.topCustomerNo,
                        urlDisable: false,
                    })
                    $("#levelCode").val(customerInfoMod.levelCode);
                    $("#listedCompanyFlag").val(customerInfoMod.listedCompanyFlag);
                    $("#companyNatureCode").val(customerInfoMod.companyNatureCode);
                    $("#representative").val(customerInfoMod.representative);
                    $("#paymentsiteCode").val(customerInfoMod.paymentsiteCode);
                    $("#purchasingManagersMail").val(customerInfoMod.purchasingManagersMail);
                    $("#remark").val(customerInfoMod.remark);
                    $("#purchasingManagers").val(customerInfoMod.purchasingManagers);
                    $("#capitalStock").val(customerInfoMod.capitalStock);
                    $("#url").val(customerInfoMod.url);
                    $("#remark").val(customerInfoMod.remark);
                    $("#basicContract").val(customerInfoMod.basicContract);
                    this.setState({
                        businessStartDate: utils.converToLocalTime(customerInfoMod.businessStartDate, false),
                        establishmentDate: utils.converToLocalTime(customerInfoMod.establishmentDate, false),
                        customerDepartmentList: resultMap.data.customerDepartmentInfoList,
                        customerDepartmentCode2: customerInfoMod.customerDepartmentCode,
                        positionCode2: customerInfoMod.positionCode,
                    })
                    if (resultMap.data.customerDepartmentInfoList.length === 0) {
                        $("#meisaiToroku").attr("disabled", true);
                    }
                    $("#toBankInfo").attr("disabled", false);
                    if (actionType === 'detail') {
                        customerInfoJs.setDisabled();
                        this.setState({
                            urlDisable: true,
                        })
                    }
                }
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
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
        customerInfoMod["customerDepartmentCode"] = this.state.customerDepartmentCode2;
        customerInfoMod["positionCode"] = this.state.positionCode2;
        customerInfoMod["stationCode"] = utils.labelGetValue($("#stationCode").val(), this.state.stationCodeDrop);
        customerInfoMod["basicContract"] = $("#basicContract").val();
        // customerInfoMod["topCustomerInfo"] = this.state.topCustomerInfo;
        axios.post(this.state.serverIP + "customerInfo/toroku", customerInfoMod)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    store.dispatch({type:"UPDATE_STATE",dropName:"getCustomerName"});
                    store.dispatch({type:"UPDATE_STATE",dropName:"getCustomer"});
                    store.dispatch({type:"UPDATE_STATE",dropName:"getCustomerAbbreviation"});
                    if (this.state.actionType === "insert") {
                        this.setState({
                            actionType:"update",
                        })
                    }
                	this.setState({ "myMessageShow": true, "type": "success", "errorsMessageShow": false,"myUpdateShow":false,"myDeleteShow":false, message: "処理成功" });
                    setTimeout(() => this.setState({ "myMessageShow": false }), 3000);
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                }
            })
            .catch(error => {
                console.log(error)
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
            });
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
                customerDepartmentCode: row.customerDepartmentCode,
                positionCode: row.positionCode,
                typeOfIndustryCode: row.typeOfIndustryCode,
                topCustomerCode:row.topCustomerCode,
                stationCode: row.stationCode,
                developLanguageCode1: row.developLanguageCode1,
                developLanguageCode2: row.developLanguageCode2,
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
    // /**
    //  * ポップアップ上位お客様情報の取得
    //  */
    // topCustomerInfoGet = (topCustomerToroku) => {
    //     if (this.state.topCustomer !== null && this.state.topCustomer !== '' && this.state.topCustomer !== undefined) {
    //         console.log(topCustomerToroku);//上位お客様更新の場合
    //         var topCustomerDrop = this.state.topCustomerDrop;
    //         this.setState({
    //             topCustomerDrop: topCustomerToroku.slice(1),
    //             topCustomerInfo: null,
    //             showCustomerInfoModal: false,
    //         }, () => {
    //             this.setState({
    //                 topCustomer: this.state.topCustomer,
    //             })
    //         })
    //     } else {//上位お客様追加の場合
    //         var ModelClass = {};
    //         ModelClass["code"] = topCustomerToroku.topCustomerNo;
    //         ModelClass["name"] = topCustomerToroku.topCustomerName;
    //         this.setState({
    //             topCustomer: topCustomerToroku.topCustomerNo,
    //             topCustomerDrop: [...this.state.topCustomerDrop, ModelClass],
    //             topCustomerInfo: topCustomerToroku,
    //             showCustomerInfoModal: false,
    //         })
    //     }
    // }
    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
                {start}から  {to}まで , 総計{total}
            </p>
        );
    }
    //隠した削除ボタンの実装
    onDeleteRow = (rows) => {
        // ...
        var a = window.confirm("削除していただきますか？");
        if (a) {
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
            customerDepartmentInfoModel["positionCode"] = this.state.positionCode;
            if (this.state.actionType === "update") {
                axios.post(this.state.serverIP + "customerInfo/customerDepartmentdelete", customerDepartmentInfoModel)
                    .then(result => {
                        if (result.data) {
                            this.setState({ "myDeleteShow": true, "type": "success", "errorsMessageShow": false,"myMessageShow":false,"myUpdateShow":false, message: "削除成功" });
                            setTimeout(() => this.setState({ "myDeleteShow": false }), 3000);
                        } else {
                            this.setState({ "myDeleteShow": true, "type": "fail", "errorsMessageShow": false,"myMessageShow":false,"myUpdateShow":false, message: '削除失敗' });
                            setTimeout(() => this.setState({ "myDeleteShow": false }), 3000);
                        }
                    })
                    .catch(function (error) {
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
                    });
            }
            $("#sakujo").attr("disabled", true);
            if (this.state.customerDepartmentList.length === 0) {
                $("#meisaiToroku").attr("disabled", true);
            }
        }
    }
    getStationCode = (event, values) => {
        if (values != null) {
            this.setState({
                stationCode2: values.code,
            })
        } else {
            this.setState({
                stationCode2: "",
            })
        }
    }
    getTopCustomer = (event, values) => {
        // if (values != null) {
        //     if (this.state.topCustomerInfo !== null) {
        //         this.setState({
        //             topCustomerDrop: this.state.topCustomerDrop.slice(0, this.state.topCustomerDrop.length - 2)
        //         })
        //     }
        //     this.setState({
        //         topCustomer: values.code,
        //         topCustomerInfo: null,
        //     })
        // } else {
        //     if (this.state.topCustomerInfo !== null) {
        //         this.setState({
        //             topCustomerDrop: this.state.topCustomerDrop.slice(0, this.state.topCustomerDrop.length - 2)
        //         })
        //     }
        //     this.setState({
        //         topCustomer: "",
        //         topCustomerInfo: null,
        //     })
        // }
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
    getPosition2 = (event, values) => {
        if (values != null) {
            this.setState({
                positionCode2: values.code,
            })
        } else {
            this.setState({
                positionCode2: "",
            })
        }
    }
    getCustomerDepartment2 = (event, values) => {
        if (values != null) {
            this.setState({
                customerDepartmentCode2: values.code,
            })
        } else {
            this.setState({
                customerDepartmentCode2: "",
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
    formatTopCustomer = (cell) => {
        var topCustomerDrop = this.state.topCustomerDrop;
        if (cell === '') {
            return '';
        } else {
            for (var i in topCustomerDrop) {
                if (cell === topCustomerDrop[i].code) {
                    return topCustomerDrop[i].name;
                }
            }
        }
    }
    getTopCustomer1 = (no) => {
        this.state.customerDepartmentList[this.state.rowNo - 1].topCustomerCode = no;
        this.formatTopCustomer(no);
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
        this.setState({
            stationCode: no,
        })
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
        customerDepartment["topCustomerCode"] = "";
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
                    this.setState({ "myUpdateShow": true, "type": "success", "errorsMessageShow": false,"myMessageShow":false,"myDeleteShow":false, message: "明細登録成功", customerDepartmentList: result.data.customerDepartmentList });
                    setTimeout(() => this.setState({ "myUpdateShow": false }), 3000);
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                }
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
            });
    }
    /**
     * リセットブタン
     */
    reset = () => {
        this.setState({
            stationCode2: '',
            topCustomer: '',
            establishmentDate: '',
            businessStartDate: '',
        })
        $("#customerName").val("");
        $("#stationCode").val("");
        $("#establishmentDate").val("");
        $("#levelCode").val("");
        $("#listedCompanyFlag").val("");
        $("#companyNatureCode").val("");
        $("#paymentsiteCode").val("");
        $("#purchasingManagersMail").val("");
        $("#remark").val("");
        $("#basicContract").val("");
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
    
    urlClick = (event) => {
    	let href = "http://" + event.target.value;
    	window.open(href);
    }
    /**
     * 戻るボタン
     */
    back = () => {
        var path = {};
        path = {
            pathname: this.state.backPage,
            state: {
                searchFlag: this.state.searchFlag, sendValue: this.state.sendValue, customerNo: this.state.customerNoForPageChange,
                currPage: this.state.currPage,
            },
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
            noDataText: (<i>データなし</i>),
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
        };
        const tableSelect1 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={5} onUpdate={onUpdate} {...props} />);
        const tableSelect2 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={6} onUpdate={onUpdate} {...props} />);
        const tableSelect3 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={7} onUpdate={onUpdate} {...props} />);
        const tableSelect4 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={8} onUpdate={onUpdate} {...props} />);
        const tableSelect5 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={9} onUpdate={onUpdate} {...props} />);
        const tableSelect6 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={10} onUpdate={onUpdate} {...props} />);
        const tableSelect11 = (onUpdate, props) => (<TableSelect dropdowns={this} flag={11} onUpdate={onUpdate} {...props} />);
        return (
            <div>
                <div style={{ "display": this.state.myMessageShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myMessageShow} message={message} type={type} />
                </div>
                <div style={{ "display": this.state.myUpdateShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myUpdateShow} message={message} type={type} />
                </div>
                <div style={{ "display": this.state.myDeleteShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myDeleteShow} message={message} type={type} />
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
                    {/* <Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" dialogClassName="modal-topCustomerInfo"
                        onHide={this.handleHideModal.bind(this, "customerInfo")} show={this.state.showCustomerInfoModal}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                            <TopCustomerInfo topCustomer={topCustomer} topCustomerInfo={topCustomerInfo} actionType={actionType} topCustomerToroku={this.topCustomerInfoGet.bind(this)} />
                        </Modal.Body>
                    </Modal> */}
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
                        {/* <Button size="sm" id="toCustomerInfo" onClick={this.handleShowModal.bind(this, "customerInfo")}>
                            上位お客様
                        </Button> */}
                    </div>
                    <br />
                    <Form id="customerForm">
                        <Row>
	                        <Col sm={3}>
		                        <InputGroup size="sm" className="mb-3">
		                            <InputGroup.Prepend>
		                                <InputGroup.Text>基本契約</InputGroup.Text>
		                            </InputGroup.Prepend>
		                            <Form.Control as="select" placeholder="基本契約" id="basicContract" name="basicContract" >
		                            {this.state.basicContractStatus.map(date =>
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
                                        <InputGroup.Text >お客様名</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="例：LYC株式会社" maxLength="50" id="customerName" onChange={customerInfoJs.toDisabed} name="customerName" /><font color="red"
                                        style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="fiveKanji">お客様番号</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="6" id="customerNo" name="customerNo" readOnly />
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
                                    <Form.Control maxLength="7" placeholder="例：1000" id="capitalStock" name="capitalStock" onChange={(e) => this.moneyChange(e)} />
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="twoKanji">万円</InputGroup.Text>
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
                                        id={actionType === "detail" ? "customerInfoDatePickerReadOnly-establishmentDate" : "customerInfoDatePicker-establishmentDate"}
                                        className="form-control form-control-sm"
                                        showMonthYearPicker
                                        showFullMonthYearPicker
                                        showDisabledMonthNavigation
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
                                        value={this.state.stationCodeDrop.find(v => v.code === this.state.stationCode2) || {}}
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
                                        <InputGroup.Text id="fiveKanji">取引開始月</InputGroup.Text>
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
                                                <input placeholder=" 例：富士通" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfo-topCustomer"
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
                                    {
                                    	(this.state.urlDisable) ?
                                    <Form.Control maxLength="" placeholder="例：www.lyc.co.jp" id="url" name="url" onClick={this.urlClick} />
                                    	: 
                                    <Form.Control maxLength="" placeholder="例：www.lyc.co.jp" id="url" name="url"/>
                                    }
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
                                        <InputGroup.Text id="fiveKanji">購買・営業</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control maxLength="20" placeholder="例：田中" id="purchasingManagers" name="purchasingManagers" />
                                </InputGroup>
                            </Col>
                            {/*<Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>部門</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Autocomplete
                                        disabled={this.state.actionType === "detail" ? true : false}
                                        id="customerDepartmentCode"
                                        name="customerDepartmentCode"
                                        value={this.state.customerDepartmentNameDrop.find(v => v.code === this.state.customerDepartmentCode2) || {}}
                                        onChange={(event, values) => this.getCustomerDepartment2(event, values)}
                                        options={this.state.customerDepartmentNameDrop}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <input placeholder=" 例：第一営業部" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfo"
                                                />
                                            </div>
                                        )}
                                    />
                                </InputGroup>
                            </Col>*/}
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>職位</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Autocomplete
                                        disabled={this.state.actionType === "detail" ? true : false}
                                        id="positionCode"
                                        name="positionCode"
                                        value={this.state.positionDrop.find(v => v.code === this.state.positionCode2) || {}}
                                        onChange={(event, values) => this.getPosition2(event, values)}
                                        options={this.state.positionDrop}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <div ref={params.InputProps.ref}>
                                                <input placeholder=" 例：部長" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfo"
                                                />
                                            </div>
                                        )}
                                    />
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
	                                <Form.Control maxLength="50" placeholder="備考" id="remark" name="remark" />
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
                    <Row>
                        <Col sm={8}>
                            <Form.Label style={{ "color": "#000000" }}>部門情報</Form.Label>
                        </Col>
                        <Col sm={4}>
                            <div style={{ "float": "right" }}>
                                <Button size="sm" variant="info" onClick={this.insertRow} id="insertRow" type="button" disabled={this.state.actionType === "update" ? false : true}>
                                    <FontAwesomeIcon icon={faSave} />追加
                        </Button>{" "}
                                <Button size="sm" onClick={this.meisaiToroku} variant="info" id="meisaiToroku" type="button" disabled={this.state.actionType === "update" ? false : true}>
                                    <FontAwesomeIcon icon={faArrowCircleUp} />明細更新
                        </Button>{" "}
                                <Button size="sm" onClick={this.onDeleteRow} variant="info" id="sakujo" type="button">
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
                                <TableHeaderColumn isKey dataField='rowNo' tdStyle={{ padding: '.45em' }} width="6%">番号</TableHeaderColumn>
                                <TableHeaderColumn dataField='responsiblePerson' tdStyle={{ padding: '.45em' }} width="8%">責任者</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerDepartmentCode' tdStyle={{ padding: '.45em' }} width="15%"
                                    dataFormat={this.formatCustomerDepartment.bind(this)} customEditor={{ getElement: tableSelect1 }}>部門</TableHeaderColumn>
                                <TableHeaderColumn dataField='positionCode'  tdStyle={{ padding: '.45em' }}  
                                    dataFormat={this.formatPosition.bind(this)} customEditor={{ getElement: tableSelect2 }} width="12%">職位</TableHeaderColumn>
                                <TableHeaderColumn dataField='customerDepartmentMail'  tdStyle={{ padding: '.45em' }} width="15%">メール</TableHeaderColumn>
                                <TableHeaderColumn dataField='typeOfIndustryCode'  tdStyle={{ padding: '.45em' }}  
                                    dataFormat={this.formatIndustry.bind(this)} customEditor={{ getElement: tableSelect3 }} width="10%">業種</TableHeaderColumn>
                                <TableHeaderColumn dataField='topCustomerCode'  tdStyle={{ padding: '.45em' }}  width="11%"
                                    dataFormat={this.formatTopCustomer.bind(this)} customEditor={{ getElement: tableSelect11 }}>Top客様</TableHeaderColumn>
                                <TableHeaderColumn dataField='stationCode'  tdStyle={{ padding: '.45em' }}
                                    dataFormat={this.formatStation.bind(this)} customEditor={{ getElement: tableSelect4 }} width="12%">拠点</TableHeaderColumn>
                                <TableHeaderColumn thStyle={{padding:'.10em'}} dataField='developLanguageCode1' tdStyle={{ padding: '.45em' }} width="11%"
                                    dataFormat={this.formatLanguage.bind(this)} customEditor={{ getElement: tableSelect5 }} >メイン言語</TableHeaderColumn>
                                {/*<TableHeaderColumn row='0' rowSpan='1' colSpan='2' dataField=''  tdStyle={{ padding: '.45em' }} thStyle={{padding:'.10em'}} width="12rem">メイン言語</TableHeaderColumn>
                                <TableHeaderColumn row='1' rowSpan='1' thStyle={{padding:'.10em'}} dataField='developLanguageCode2' tdStyle={{ padding: '.45em' }} 
                                    dataFormat={this.formatLanguage.bind(this)} customEditor={{ getElement: tableSelect6 }} >B</TableHeaderColumn>*/}
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