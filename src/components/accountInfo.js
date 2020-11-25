import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as bankInfoJs from './accountInfoJs.js';
import $ from 'jquery';
import * as utils from './utils/publicUtils.js';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';

axios.defaults.withCredentials = true;
/**
 * 口座情報画面
 */
class BankInfo extends Component {

    state = {
        actionType: '',//処理区分
        message: '',
        type: '',
        accountInfoName:'', 
        bankCode:'', 
        bankBranchName:'', 
        bankBranchCode:'',  
        accountNo:'', 
        employeeOrCustomerNo:'',
        accountBelongsStatus:"0",
        accountName:'', 
        myToastShow: false,
        errorsMessageShow: false,
        errorsMessageValue: '',
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var employeeOrCustomerNo = "";
        var accountBelongsStatus = this.state.accountBelongsStatus;
        if (this.props.employeeNo !== null && this.props.employeeNo !== undefined) {//社員の場合
            employeeOrCustomerNo = this.props.employeeNo;
            var employeeName = this.props.employeeFristName + "" + this.props.employeeLastName;
            if(this.props.employeeFristName === undefined && this.props.employeeLastName === undefined){
                employeeName = "";
            }
            this.setState({
                employeeOrCustomerNo:this.props.employeeNo,
                accountInfoName:"社員：" + employeeName,
            })
        } else{//お客様の場合
            employeeOrCustomerNo = this.props.customerNo;
            accountBelongsStatus = "1";
            this.setState({
                employeeOrCustomerNo:this.props.customerNo,
                accountInfoName:"お客様：" + $("#customerName").val(),
                accountBelongsStatus:"1",
            })
        }
        //銀行名
        var bankCode = utils.getdropDown("getBankInfo", this.state.serverIP);
        bankCode[0].name = "銀行を選択してください";
        for (let i = 0; i < bankCode.length; i++) {
            $("#bankCode").append('<option value="' + bankCode[i].code + '">' + bankCode[i].name + '</option>');
        }
        var actionType = this.props.actionType;//父画面のパラメータ（処理区分）
        this.setState({
            actionType: actionType,//処理区分
        })
        var accountInfo = this.props.accountInfo;//父画面のパラメータ（画面既存口座情報）
        if (!$.isEmptyObject(accountInfo)) {
            this.giveValue(accountInfo);
            bankInfoJs.takeDisabled();
        } else {
            if (actionType !== "insert") {
                var onloadMol = {};
                onloadMol["employeeOrCustomerNo"] = employeeOrCustomerNo;
                onloadMol["accountBelongsStatus"] = accountBelongsStatus;
                onloadMol["actionType"] = actionType;
                //画面データの検索
                axios.post(this.state.serverIP + "bankInfo/init", onloadMol)
                    .then(resultMap=> {
                        if(resultMap.data.accountInfoMod !== null){
                            this.giveValue(resultMap.data.accountInfoMod);
                            if (resultMap.data.accountInfoMod["accountTypeStatus"] === '0') {
                                $("#futsu").attr("checked", true);
                            } else if (resultMap.data.accountInfoMod["accountTypeStatus"] === '1') {
                                $("#toza").attr("checked", true);
                            }
                        }
                        //修正の場合
                        if (actionType === 'update' && resultMap.data.accountInfoMod !== null) {
                            $("#bankBranchName").attr("readonly", false);
                            $("#bankBranchCode").attr("readonly", false);
                            $("#accountNo").attr("readonly", false);
                            $("#accountName").attr("readonly", false);
                            $("#futsu").attr("disabled", false);
                            $("#toza").attr("disabled", false);
                        }
                    })
                    .catch(function (error) {
                        alert("口座情報获取错误，请检查程序");
                    });
                if (actionType === "detail") {//詳細の場合
                    $("#bankCode").attr("disabled", true);
                    $("#bankBranchName").attr("disabled", true);
                    $("#bankBranchCode").attr("disabled", true);
                    $("#accountNo").attr("disabled", true);
                    $("#accountName").attr("disabled", true);
                    $("#futsu").attr("disabled", true);
                    $("#toza").attr("disabled", true);
                    $("#accountToroku").attr("disabled", true);
                    $("#accountReset").attr("disabled", true);
                }
            }
        }
    }
    giveValue=(accountInfoMod)=>{
        this.setState({
            bankCode:accountInfoMod.bankCode, 
            bankBranchName:accountInfoMod.bankBranchName, 
            bankBranchCode:accountInfoMod.bankBranchCode,  
            accountNo:accountInfoMod.accountNo, 
            employeeOrCustomerNo:accountInfoMod.employeeOrCustomerNo,
            accountName:accountInfoMod.accountName, 
        })
        if (accountInfoMod.accountTypeStatus === '0') {
            $("#futsu").attr("checked", true);
        } else if (accountInfoMod.accountTypeStatus === '1') {
            $("#toza").attr("checked", true);
        }

    }
    /**
     * 支店名と支店番号の検索
     * param 項目のid
     */
    getBankBranchInfo(noORname) {
        var sendMap = {};
        sendMap[noORname] = $('#' + noORname + '').val();
        sendMap["bankCode"] = $('#bankCode').val();
        if ($('#' + noORname + '').val() !== "") {

            axios.post(this.state.serverIP + "getBankBranchInfo", sendMap)
                .then(resultMap=>{
                    if (resultMap.data.length !== 0) {
                        this.setState({
                            bankBranchCode:resultMap.data[0].code,
                            bankBranchName:resultMap.data[0].name,
                        })
                    } else {
                        this.setState({
                            bankBranchCode:"",
                            bankBranchName:"",
                        })
                    }

                })
                .catch(error=> {
                    alert("支店信息获取错误，请检查程序");
                });
        } else {
            $('#bankBranchCode').val("");
            $('#bankBranchName').val("");
        }
    }
    //onchange
    valueChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }
    /**
     * 口座登録ボタン
     */
    accountTokuro() {
        var result = bankInfoJs.checkAccountName();
        if (result && bankInfoJs.torokuCheck()) {
            var accountInfo = {};
            var formArray = $("#bankForm").serializeArray();
            $.each(formArray, function (i, item) {
                accountInfo[item.name] = item.value;
            });
            this.props.accountTokuro(accountInfo);
        } else if (!result) {
            this.setState({ "errorsMessageShow": true, errorsMessageValue: '口座名義人をカタカナで入力してください' });
        } else if (!bankInfoJs.torokuCheck()) {
            this.setState({ "errorsMessageShow": true, errorsMessageValue: '銀行関連を入力してください' });
        }
    }
    /**
 * 銀行の選択と項目の活性
 */
canSelect=event=>{
	var val = $("#bankCode").val();
	if(val !== ''){
        $("#bankBranchName").attr("readonly",false);
        $("#bankBranchCode").attr("readonly",false);
        $("#accountNo").attr("readonly",false);
        $("#accountName").attr("readonly",false);
        $("#futsu").attr("disabled",false);
        $("#toza").attr("disabled",false);
        $("#futsu").attr("checked",true);
    }else{
        $("#bankBranchName").attr("readonly",true);
        $("#bankBranchCode").attr("readonly",true);
        $("#accountNo").attr("readonly",true);
        $("#accountName").attr("readonly",true);
        $("#futsu").attr("disabled",true);
        $("#toza").attr("disabled",true);
        $("#futsu").attr("checked",true);
    }
    $("#bankBranchName").val("");
    $("#bankBranchCode").val("");
    $("#accountNo").val("");
    $("#accountName").val("");
    $("#futsu").attr("checked",true);
    this.setState({
        [event.target.name]: event.target.value,
    })
}
    render() {
        const { actionType, errorsMessageValue, accountInfoName, bankCode, bankBranchName, bankBranchCode, accountNo, accountName } = this.state;
        return (
            <div  >
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <div  >
                    <Row inline="true">
                        <Col className="text-center">
                            <h2>口座情報</h2>
                        </Col>
                    </Row>
                    <Form id="bankForm">
                        <Row>
                            <Col>
                                <Navbar>
                                    <Navbar.Collapse>
                                        <Navbar.Text>
                                            <a>{accountInfoName}</a>
                                        </Navbar.Text>
                                    </Navbar.Collapse>
                                </Navbar>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>銀行名</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control id="bankCode" name="bankCode" value={bankCode} as="select" onChange={this.canSelect}>
                                    </Form.Control>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Check disabled defaultChecked={true} label="普通" inline="true" type="radio" id="futsu" name="accountTypeStatus" value="0" />
                                <Form.Check disabled label="当座" inline="true" type="radio" name="accountTypeStatus" id="toza" value="1" />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>支店名</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control readOnly
                                        placeholder="例：浦和支店"
                                        onBlur={this.getBankBranchInfo.bind(this, "bankBranchName")}
                                        id="bankBranchName" maxLength="20" name="bankBranchName" value={bankBranchName} onChange={this.valueChange}/>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">支店番号</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="例：010" onBlur={this.getBankBranchInfo.bind(this, "bankBranchCode")} readOnly
                                        id="bankBranchCode" maxLength="3" name="bankBranchCode" value={bankBranchCode} onChange={this.valueChange}/>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">口座番号</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="例：123456" readOnly id="accountNo" maxLength="7" name="accountNo"
                                        value={accountNo} onChange={this.valueChange}/>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="fiveKanji">口座名義人</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="tips" >
                                                片仮名で入力してください
                                    </Tooltip>
                                        }
                                    >
                                        <Form.Control placeholder="例：カタカナ" onChange={bankInfoJs.checkAccountName} readOnly
                                            id="accountName" maxLength="20" name="accountName" value={accountName} onChange={this.valueChange}/>
                                    </OverlayTrigger>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center">
                                {actionType === "update" ?
                                    <Button size="sm" onClick={this.accountTokuro.bind(this)} variant="info" id="toroku" type="button">
                                        <FontAwesomeIcon icon={faSave} />更新
                        </Button>
                                    :
                                    <Button size="sm" onClick={this.accountTokuro.bind(this)} variant="info" id="accountToroku" type="button">
                                        <FontAwesomeIcon icon={faSave} />登録
                        </Button>
                                }
                                {" "}<Button onClick={bankInfoJs.setDisabled} variant="info" size="sm" type="reset" id="accountReset" value="Reset" >
                                    <FontAwesomeIcon icon={faUndo} />リセット
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}
export default BankInfo;