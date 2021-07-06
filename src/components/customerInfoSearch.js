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
        currPage:'',//今のページ
        emploryeesPerPage: 5,//毎ページの項目数
        customerNo: '',//選択した列のお客様番号
        rowNo: '',//選択した行番号
        businessStartDate: '',//取引開始の期日
        stationCode: "",
        topCustomerCode: "",
        stationCodeDrop: store.getState().dropDown[14].slice(1),//本社場所
        topCustomerDrop: store.getState().dropDown[35].slice(1),//上位お客様連想の数列
        levelDrop: store.getState().dropDown[18],
        companyNatureDrop: store.getState().dropDown[19],
        paymentsiteCodeDrop: store.getState().dropDown[21],
        message: '',
        type: '',
    	responseFlag: true,
        myToastShow: false,
        errorsMessageShow: false,
        errorsMessageValue: '',
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
        transactionStatusDrop: store.getState().dropDown[46].slice(1),
        customerDrop: store.getState().dropDown[53].slice(1),
        customerAbbreviationList: store.getState().dropDown[73].slice(1),
        basicContractStatus: store.getState().dropDown[72],
        responseStatus: store.getState().dropDown[72].slice(1),
        listedCompanyFlag: store.getState().dropDown[17],
        searchFlag: false,//検索ボタン押下フラグ
    	contactDateFlag: false,
        sendValue: {},
    }

    constructor(props) {
        super(props);
    }
    /**
     * 画面の初期化
     */
    componentDidMount() {
        $("#shusei").attr("disabled", true);
        $("#shosai").attr("disabled", true);
        $("#sakujo").attr("disabled", true);
        $("#response").val("");
        if (this.props.location.state !== undefined) {
            var sendValue = this.props.location.state.sendValue;
            var searchFlag = this.props.location.state.searchFlag;
            $("#capitalStockFront").val(utils.addComma(sendValue.capitalStockFront));
            $("#capitalStockBack").val(utils.addComma(sendValue.capitalStockBack));
            $("#companyNatureCode").val(utils.addComma(sendValue.companyNatureCode));
            $("#paymentsiteCode").val(utils.addComma(sendValue.paymentsiteCode));
            $("#levelCode").val(utils.addComma(sendValue.levelCode));
            $("#transactionStatus").val(utils.addComma(sendValue.transactionStatus));
            $("#traderPersonFront").val(utils.addComma(sendValue.traderPersonFront));
            $("#traderPersonBack").val(utils.addComma(sendValue.traderPersonBack));
            $("#representative").val(sendValue.representative);
            $("#listedCompanyFlag").val(sendValue.listedCompanyFlag);
            $("#basicContract").val(sendValue.basicContract);
            $("#response").val(sendValue.response);
            this.setState({
                customerNo: sendValue.customerNo,
                customerAbbreviation: sendValue.customerAbbreviation,
                customerNoForPageChange: this.props.location.state.customerNo,
                currPage: this.props.location.state.currPage,
                topCustomerCode: sendValue.topCustomerNo,
                stationCode: sendValue.stationCode,
                businessStartDate: utils.converToLocalTime(sendValue.businessStartDate, false),
                responseFlag: sendValue.basicContract !== "1" ? true : false,
                contactDateFlag: sendValue.response === "1" ? true : false,
            }, () => {
                if (searchFlag) {
                    this.search();
                }
            })
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
            keyLength = 7;
            if ((reg.test(num) && num.length < keyLength)) {
                num = utils.addComma(num);
                this.setState({
                    [key]: num
                })
            }
        } else {
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
        customerInfoMod["customerNo"] = this.state.customerNo;
        customerInfoMod["capitalStockFront"] = utils.deleteComma($("#capitalStockFront").val());
        customerInfoMod["capitalStockBack"] = utils.deleteComma($("#capitalStockBack").val());
        customerInfoMod["topCustomerNo"] = this.state.topCustomerCode;
        customerInfoMod["stationCode"] = this.state.stationCode;
        if(this.state.contactDateFlag){
            customerInfoMod["contactDate"] = utils.formateDate(this.state.businessStartDate, false);
            customerInfoMod["businessStartDate"] = "";  
        }else{
            customerInfoMod["businessStartDate"] = utils.formateDate(this.state.businessStartDate, false);  
            customerInfoMod["contactDate"] = "";  
        }
        customerInfoMod["basicContract"] = $("#basicContract").val() === "" ? null : $("#basicContract").val(); 
        customerInfoMod["response"] = $("#response").val() === "" ? null : $("#response").val(); 
        customerInfoMod["representative"] = $("#representative").val();
        customerInfoMod["listedCompanyFlag"] = $("#listedCompanyFlag").val();
        axios.post(this.state.serverIP + "customerInfoSearch/customerSearch", customerInfoMod)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    this.setState({
                        customerInfoData: result.data.resultList,
                        "errorsMessageShow": false,
                    }, () => {
                        if (this.state.customerNoForPageChange !== "" && this.state.customerNoForPageChange !== undefined) {
                            this.refs.customerInfoSearchTable.setState({
                                selectedRowKeys: this.state.customerNoForPageChange,
                                currPage:this.state.currPage,
                            })
                            $("#shusei").attr("disabled", false);
                            $("#shosai").attr("disabled", false);
                            $("#sakujo").attr("disabled", false);
                        } else {
                            this.refs.customerInfoSearchTable.setState({
                                selectedRowKeys: [],
                            })
                        }
                    })
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage, customerInfoData: [] });
                }
                this.setState({
                    searchFlag: true,
                })
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
            });
    }
    /**
      * 行Selectファンクション
      */
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            $("#shusei").attr("disabled", false);
            $("#shosai").attr("disabled", false);
            $("#sakujo").attr("disabled", false);
            this.setState({
                customerNoForPageChange: row.customerNo,
                rowNo: row.rowNo,
                currPage:this.refs.customerInfoSearchTable.state.currPage,
            })
        } else {
            $("#shusei").attr("disabled", true);
            $("#shosai").attr("disabled", true);
            $("#sakujo").attr("disabled", true);
            this.setState({
                customerNoForPageChange: '',
                rowNo: row.rowNo,
                currPage:'',
            })
        }
    }
    //隠した削除ボタンの実装
    onDeleteRow = () => {
        var a = window.confirm("削除していただきますか？");
        if (a) {
            var customerInfoMod = {};
            customerInfoMod["customerNo"] = this.state.customerNoForPageChange;
            axios.post(this.state.serverIP + "customerInfoSearch/delete", customerInfoMod)
                .then(result => {
                    if (result.data === 0) {
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
                        this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "削除成功" });
                        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                        store.dispatch({type:"UPDATE_STATE",dropName:"getCustomerName"});
                    } else if (result.data === 1) {
                        this.setState({ "myToastShow": true, "type": "fail", "errorsMessageShow": false, message: "削除失败" });
                        setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                    } else if (result.data === 2) {
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: "お客様が現場に使われました" });
                    } else if (result.data === 3) {
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: "上位お客様の下位お客様が複数ある" });
                    } else if (result.data === 4) {
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: "上位お客様の下位お客様が複数あるの場合でも、お客様の削除が失敗し" });
                    }
                })
                .catch(error => {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
                });
        }
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
    /**
     * 社員名連想
     * @param {} event 
     */
    getCustomer = (event, values) => {
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            let customerNo = null;
            if (values !== null) {
                customerNo = values.code;
            }
            this.setState({
                customerNo: customerNo,
                customerAbbreviation: customerNo,
            })
        })
    }
    /**
     * 社員名略称連想
     * @param {} event 
     */
    getCustomerAbbreviation = (event, values) => {
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {
            let customerAbbreviation = null;
            if (values !== null) {
            	customerAbbreviation = values.code;
            }
            this.setState({
                customerNo: customerAbbreviation,
                customerAbbreviation: customerAbbreviation,
            })
        })
    }
    addMarkCapitalStock = (cell, row) => {
        let capitalStock = utils.addComma(row.capitalStock);
        return capitalStock;
    }
    shuseiTo = (actionType) => {
        var path = {};
        var sendValue = {};
        var formArray = $("#conditionForm").serializeArray();
        $.each(formArray, function (i, item) {
            sendValue[item.name] = item.value;
        });
        sendValue["customerNo"] = this.state.customerNo;
        sendValue["customerAbbreviation"] = this.state.customerAbbreviation;
        sendValue["capitalStockFront"] = utils.deleteComma($("#capitalStockFront").val());
        sendValue["capitalStockBack"] = utils.deleteComma($("#capitalStockBack").val());
        sendValue["topCustomerNo"] = this.state.topCustomerCode;
        sendValue["stationCode"] = this.state.stationCode;
        sendValue["businessStartDate"] = utils.formateDate(this.state.businessStartDate, false);
        switch (actionType) {
            case "update":
                path = {
                    pathname: '/subMenuManager/customerInfo',
                    state: {
                        actionType: 'update',
                        customerNo: this.state.customerNoForPageChange,
                        backPage: "customerInfoSearch", sendValue: sendValue,
                        searchFlag: this.state.searchFlag,
                        currPage:this.state.currPage,
                    },
                }
                break;
            case "detail":
                path = {
                    pathname: '/subMenuManager/customerInfo',
                    state: {
                        actionType: 'detail',
                        customerNo: this.state.customerNoForPageChange,
                        backPage: "customerInfoSearch", sendValue: sendValue,
                        searchFlag: this.state.searchFlag,
                        currPage:this.state.currPage,
                    },
                }
                break;
            case "insert":
                path = {
                    pathname: '/subMenuManager/customerInfo',
                    state: {
                        actionType: 'insert',
                        customerNo: this.state.customerNoForPageChange,
                        backPage: "customerInfoSearch", sendValue: sendValue,
                        searchFlag: this.state.searchFlag,
                        currPage:this.state.currPage,
                    },
                }
                break;
            default:
        }
        this.props.history.push(path);
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
                topCustomerCode: values.code,
            })
        } else {
            this.setState({
                topCustomerCode: "",
            })
        }
    }
    
    basicContractChange = (event) => {
    	if(event.target.value === "1"){
            this.setState({
            	responseFlag: false,
            })
            $("#response").val("0");
    	}else{
            $("#response").val("");
            this.setState({
            	responseFlag: true,
            	contactDateFlag: false,
            })
    	}
    }
    
    responseChange = (event) => {
    	if(event.target.value === "1"){
            $("#traderPersonFront").val("");
            $("#traderPersonBack").val("");
            $("#transactionStatus").val("");
            this.setState({
            	traderPersonFront: "",
            	traderPersonBack: "",
            	contactDateFlag: true,
            })
    	}else{
            $("#transactionStatus").val("0");
            this.setState({
            	contactDateFlag: false,
            })
    	}
    }
    
    reset = () => {
        $("#traderPersonFront").val("");
        $("#traderPersonBack").val("");
        $("#transactionStatus").val("0");
        $("#paymentsiteCode").val("");
        $("#levelCode").val("");
        $("#companyNatureCode").val("");
        $("#representative").val("");
        $("#listedCompanyFlag").val("");
        $("#basicContract").val("");
        $("#response").val("");
        
        this.setState({
            customerNo:'',
            customerAbbreviation:'',
            topCustomerCode:"",
            stationCode:'',
            traderPersonFront:"",
            traderPersonBack:"",
            businessStartDate:'',
            capitalStockFront:'',
            capitalStockBack:'',
        	responseFlag: true,
        	contactDateFlag: false,
        })
    }
    // 鼠标悬停显示全文
    customerNameFormat = (cell) => {
		return <span title={cell}>{cell}</span>;
	}
    render() {
        const { customerInfoData, stationCode, topCustomerCode, message, type, errorsMessageValue, traderPersonFront, traderPersonBack, capitalStockFront, capitalStockBack
            , customerNo,customerAbbreviation } = this.state;
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
            noDataText: (<i>データなし</i>),
            page: 1,  // which page you want to show as default
            sizePerPage: 10,  // which size per page you want to locate as default
            pageStartIndex: 1, // where to start counting the pages
            paginationSize: 3,  // the pagination bar size.
            prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
            paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
            hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
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
                        <h2>お客様情報検索</h2>
                    </Col>
                </Row>
                <br />
                <Form id="conditionForm">
                    <Row>
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="fiveKanji">お客様名</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Autocomplete
                                    id="customerNo"
                                    name="customerNo"
                                    value={store.getState().dropDown[53].slice(1).find(v => v.code === this.state.customerNo) || ""}
                                    options={store.getState().dropDown[53].slice(1)}
                                    getOptionLabel={(option) => option.text ? option.text : ""}
                                    onChange={(event, values) => this.getCustomer(event, values)}
                                    renderOption={(option) => {
                                        return (
                                            <React.Fragment>
                                                {option.name}
                                            </React.Fragment>
                                        )
                                    }}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfoSearch"
                                            />
                                        </div>
                                    )}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                        <InputGroup size="sm" className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="fiveKanji">客様略称</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Autocomplete
                                id="customerAbbreviation"
                                name="customerAbbreviation"
                                value={this.state.customerAbbreviationList.find(v => v.code === this.state.customerAbbreviation) || ""}
                                options={this.state.customerAbbreviationList}
                                getOptionLabel={(option) => option.text ? option.text : ""}
                                onChange={(event, values) => this.getCustomer(event, values)}
                                renderOption={(option) => {
                                    return (
                                        <React.Fragment>
                                            {option.name}
                                        </React.Fragment>
                                    )
                                }}
                                renderInput={(params) => (
                                    <div ref={params.InputProps.ref}>
                                        <input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfoSearch"
                                        />
                                    </div>
                                )}
                            />
                        </InputGroup>
                        </Col>
                    </Row>
                    <Row>
	                    <Col sm={3}>
		                    <InputGroup size="sm" className="mb-2">
		                        <InputGroup.Prepend>
		                            <InputGroup.Text id="fiveKanji">代表</InputGroup.Text>
		                        </InputGroup.Prepend>
		                        <Form.Control placeholder="例：中山毛石" maxLength="20" id="representative" name="representative" />
		                    </InputGroup>
	                    </Col>
	                    <Col sm={3}>
	                    <InputGroup size="sm">
	                        <InputGroup.Prepend>
	                            <InputGroup.Text id="fiveKanji">会社性質</InputGroup.Text>
	                        </InputGroup.Prepend>
	                        <Form.Control as="select" id="companyNatureCode" name="companyNatureCode">
	                            {this.state.companyNatureDrop.map(date =>
	                                <option key={date.code} value={date.code}>
	                                    {date.name}
	                                </option>
	                            )}
	                        </Form.Control>
	                    </InputGroup>
	                    </Col>
	                    <Col sm={3}>
	                    <InputGroup size="sm">
	                        <InputGroup.Prepend>
	                            <InputGroup.Text id="fiveKanji">上場会社</InputGroup.Text>
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
                        <InputGroup size="sm" className="mb-2">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="fiveKanji">支払サイト</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="select" placeholder="支払サイト" id="paymentsiteCode" name="paymentsiteCode">
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
		                    <InputGroup size="sm">
		                        <InputGroup.Prepend>
		                            <InputGroup.Text id="fiveKanji" /*style={{ width: "8rem" }}*/>ランキング</InputGroup.Text>
		                        </InputGroup.Prepend>
		                        <Form.Control as="select" id="levelCode" name="levelCode">
		                            {this.state.levelDrop.map(date =>
		                                <option key={date.code} value={date.code}>
		                                    {date.name}
		                                </option>
		                            )}
		                        </Form.Control>
		                    </InputGroup>
	                    </Col>
	                    
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="fiveKanji">資本金</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control placeholder="例：100" id="capitalStockFront" name="capitalStockFront" value={capitalStockFront}
                                    onChange={(e) => this.vNumberChange(e, 'capitalStockFront')} />{"~"}
                                <Form.Control placeholder="例：100" id="capitalStockBack" name="capitalStockBack" value={capitalStockBack}
                                    onChange={(e) => this.vNumberChange(e, 'capitalStockBack')} />
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="twoKanji">百万</InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="fiveKanji">本社場所</InputGroup.Text>
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
                                        <input placeholder=" 例：秋葉原駅" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfoSearch"
                                        />
                                    </div>
                                )}
                            />
                        </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="fiveKanji">上位お客様</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Autocomplete
                                    disabled={this.state.actionType === "detail" ? true : false}
                                    id="topCustomer"
                                    name="topCustomer"
                                    value={this.state.topCustomerDrop.find(v => v.code === this.state.topCustomerCode) || {}}
                                    onChange={(event, values) => this.getTopCustomer(event, values)}
                                    options={this.state.topCustomerDrop}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                            <input placeholder=" 例：富士通" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfoSearch"
                                            />
                                        </div>
                                    )}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
	                    <Col sm={3}>
		                    <InputGroup size="sm" className="mb-2">
		                        <InputGroup.Prepend>
		                            <InputGroup.Text id="twoKanji">契約</InputGroup.Text>
		                        </InputGroup.Prepend>
		                        <Form.Control as="select" placeholder="契約" id="basicContract" name="basicContract" onChange={this.basicContractChange.bind(this)}>
		                        {this.state.basicContractStatus.map(date =>
		                            <option key={date.code} value={date.code}>
		                                {date.name}
		                            </option>
		                        )}
		                        </Form.Control>
		                        <InputGroup.Prepend>
		                            <InputGroup.Text id="twoKanji">返事</InputGroup.Text>
		                        </InputGroup.Prepend>
		                        <Form.Control as="select" placeholder="返事" id="response" name="response" onChange={this.responseChange.bind(this)} disabled={this.state.responseFlag} >
		                        {this.state.responseStatus.map(date =>
		                            <option key={date.code} value={date.code}>
		                                {date.name}
		                            </option>
		                        )}
		                        </Form.Control>
		                    </InputGroup>
	                    </Col>
                        
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="fiveKanji">{this.state.contactDateFlag ? "最終連絡日" : "取引開始日"}</InputGroup.Text>
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
                                    id="customerInfoDatePicker-customerInfoSearch"
                                    name="businessStartDate"
                                    locale="ja"
                                />
                            </InputGroup>
                        </Col>
                        <Col sm={3}>
	                        <InputGroup size="sm" className="mb-2">
	                            <InputGroup.Prepend>
	                                <InputGroup.Text id="fiveKanji">取引区分</InputGroup.Text>
	                            </InputGroup.Prepend>
	                            <Form.Control as="select" placeholder="取引区分" id="transactionStatus" name="transactionStatus" disabled={this.state.contactDateFlag} >
	                                {this.state.transactionStatusDrop.map(date =>
	                                    <option key={date.code} value={date.code}>
	                                        {date.name}
	                                    </option>
	                                )}
	                            </Form.Control>
	                        </InputGroup>
                        </Col>
                        <Col sm={3}>
                            <InputGroup size="sm" className="mb-2">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="fiveKanji">取引人月</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control placeholder="例：12" value={traderPersonFront} disabled={this.state.contactDateFlag}
                                    onChange={(e) => this.vNumberChange(e, 'traderPersonFront')} id="traderPersonFront" name="traderPersonFront" />{"~"}
                                <Form.Control placeholder="例：12" value={traderPersonBack} disabled={this.state.contactDateFlag}
                                    onChange={(e) => this.vNumberChange(e, 'traderPersonBack')} id="traderPersonBack" name="traderPersonBack" />
                            </InputGroup>
                        </Col>
                    </Row>
                    <div style={{ "textAlign": "center" }}>
                        <Button onClick={this.search} size="sm" variant="info">
                            <FontAwesomeIcon icon={faSearch} /> 検索
                            </Button>{' '}
                        <Button size="sm" onClick={this.shuseiTo.bind(this, "insert")} variant="info">
                            <FontAwesomeIcon icon={faSave} /> 追加
                            </Button>{' '}
                        <Button size="sm" variant="info" onClick={this.reset}>
                            <FontAwesomeIcon icon={faUndo} /> Reset
                            </Button>
                    </div>
                </Form>
                <Form>
                    <Row>
                        <Col sm={9}>
                        </Col>
                        <Col sm={3}>
                            <div style={{ "float": "right" }}>
                                <Button size="sm" onClick={this.shuseiTo.bind(this, "detail")} id="shosai" variant="info"><FontAwesomeIcon icon={faList} />詳細</Button>{' '}
                                <Button size="sm" onClick={this.shuseiTo.bind(this, "update")} id="shusei" variant="info"><FontAwesomeIcon icon={faEdit} />修正</Button>{' '}
                                <Button variant="info" size="sm" id="sakujo" onClick={this.onDeleteRow} > <FontAwesomeIcon icon={faTrash} />删除</Button>
                            </div>
                        </Col>
                    </Row>
                    <Col sm={12}>
                        <BootstrapTable selectRow={selectRow} pagination={true} data={customerInfoData} options={options} deleteRow
                            ref="customerInfoSearchTable"
                            headerStyle={{ background: '#5599FF' }} striped hover condensed>
                            <TableHeaderColumn dataField='rowNo' tdStyle={{ padding: '.45em' }} width='70'>番号</TableHeaderColumn>
                            <TableHeaderColumn isKey dataField='customerNo' tdStyle={{ padding: '.45em' }} width="90">客様番号</TableHeaderColumn>
                            <TableHeaderColumn dataField='customerName' tdStyle={{ padding: '.45em' }} width="260" dataFormat={this.customerNameFormat.bind(this)}>お客様名</TableHeaderColumn>
                            <TableHeaderColumn dataField='companyNatureName' tdStyle={{ padding: '.45em' }} width="110">会社性質</TableHeaderColumn>
                            <TableHeaderColumn dataField='representative' tdStyle={{ padding: '.45em' }} width="110">社長</TableHeaderColumn>
                            <TableHeaderColumn dataField='establishmentDate' tdStyle={{ padding: '.45em' }} width="80">設立</TableHeaderColumn>
                            <TableHeaderColumn dataField='stationName' tdStyle={{ padding: '.45em' }} width="150">本社</TableHeaderColumn>
                            <TableHeaderColumn dataField='capitalStock' tdStyle={{ padding: '.45em' }} width="126" dataFormat={this.addMarkCapitalStock}>資本金(百万)</TableHeaderColumn>
                            <TableHeaderColumn dataField='paymentSiteName' tdStyle={{ padding: '.45em' }} width="110">支払サイト</TableHeaderColumn>
                            <TableHeaderColumn dataField='businessStartDate' tdStyle={{ padding: '.45em' }} width="100">取引開始月</TableHeaderColumn>
                            <TableHeaderColumn dataField='traderPerson' tdStyle={{ padding: '.45em' }} width="100">取引総人月</TableHeaderColumn>
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