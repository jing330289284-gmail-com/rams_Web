import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , Navbar , OverlayTrigger , Tooltip} from 'react-bootstrap';
import * as bankInfoJs from './accountInfoJs.js';
import $ from 'jquery';
import * as utils from './utils/publicUtils.js';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch } from '@fortawesome/free-solid-svg-icons';

class BankInfo extends Component {

    state = {
        actionType:'',//処理区分
    }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        if($("#customerNo").val() === '' || $("#customerNo").val() === null){//社員の場合
            $("#employeeOrCustomerNo").val($("#employeeNo").val())
            $("#accountBelongsStatus").val("0")
            document.getElementById("No").innerHTML  = "社員：" + $("#employeeName").val();
        }else if($("#employeeNo").val() === '' || $("#employeeNo").val() === null){//お客様の場合
            $("#employeeOrCustomerNo").val($("#customerNo").val())
            $("#accountBelongsStatus").val("1")
            document.getElementById("No").innerHTML  = "お客様：" + $("#customerName").val();
        }
        //銀行名
        var bankCode = utils.getdropDown("getBankInfo");
        bankCode[0].name = "銀行を選択してください";
        for(let i = 0;i<bankCode.length ; i++){
            $("#bankCode").append('<option value="'+bankCode[i].code+'">'+bankCode[i].name+'</option>');
        }
        var actionType = this.props.actionType;//父画面のパラメータ（処理区分）
        this.setState({
            actionType:actionType,//処理区分
        })
        var accountInfo = this.props.accountInfo;//父画面のパラメータ（画面既存口座情報）
        if(!$.isEmptyObject(accountInfo)){
            $("#bankBranchName").val(accountInfo["bankBranchName"]);
            $("#bankBranchCode").val(accountInfo["bankBranchCode"]);
            $("#accountNo").val(accountInfo["accountNo"]);
            $("#accountName").val(accountInfo["accountName"]);
            $("#bankCode").val(accountInfo["bankCode"]);   
            if(accountInfo["accountBelongsStatus"] !== null && accountInfo["accountBelongsStatus"] !== ''){
                $("#accountBelongsStatus").val(accountInfo["accountBelongsStatus"]);
            }
            if(accountInfo["accountTypeStatus"] === '0'){
                $("#futsu").attr("checked",true);
            }else if(accountInfo["accountTypeStatus"] === '1'){
                $("#toza").attr("checked",true);
            } 
            bankInfoJs.takeDisabled();
        }else{
            if(actionType !== "insert"){
                var onloadMol = {};
                onloadMol["employeeOrCustomerNo"] = $("#employeeOrCustomerNo").val();
                onloadMol["accountBelongsStatus"] = $("#accountBelongsStatus").val();
                onloadMol["actionType"] = actionType;
                //画面データの検索
                  axios.post("http://127.0.0.1:8080/bankInfo/onloadPage",onloadMol)
                  .then(function (resultMap) {
                    if(resultMap.data.accountInfoMod !== '' && resultMap.data.accountInfoMod !== null){
                        $("#bankBranchName").val(resultMap.data.accountInfoMod["bankBranchName"]);
                        $("#bankBranchCode").val(resultMap.data.accountInfoMod["bankBranchCode"]);
                        $("#accountNo").val(resultMap.data.accountInfoMod["accountNo"]);
                        $("#accountName").val(resultMap.data.accountInfoMod["accountName"]);
                        $("#bankCode").val(resultMap.data.accountInfoMod["bankCode"]);   
                        if(resultMap.data.accountInfoMod["accountBelongsStatus"] !== null && resultMap.data.accountInfoMod["accountBelongsStatus"] !== ''){
                          $("#accountBelongsStatus").val(resultMap.data.accountInfoMod["accountBelongsStatus"]);
                        }
                        if(resultMap.data.accountInfoMod["accountTypeStatus"] === '0'){
                          $("#futsu").attr("checked",true);
                        }else if(resultMap.data.accountInfoMod["accountTypeStatus"] === '1'){
                          $("#toza").attr("checked",true);
                        }
                        //修正の場合
                        if(actionType === 'update'){
                          $("#bankBranchName").attr("readonly",false);
                          $("#bankBranchCode").attr("readonly",false);
                          $("#accountNo").attr("readonly",false);
                          $("#accountName").attr("readonly",false);
                          $("#futsu").attr("disabled",false);
                          $("#toza").attr("disabled",false);
                        }
                      }
                  })
                  .catch(function (error) {
                  alert("口座情報获取错误，请检查程序");
                });  
                if(actionType === "detail"){//詳細の場合
                    $("#bankCode").attr("disabled",true);
                    $("#bankBranchName").attr("disabled",true);
                    $("#bankBranchCode").attr("disabled",true);
                    $("#accountNo").attr("disabled",true);
                    $("#accountName").attr("disabled",true);
                    $("#futsu").attr("disabled",true);
                    $("#toza").attr("disabled",true);
                    $("#accountToroku").attr("disabled",true);
                    $("#accountReset").attr("disabled",true);
                }
            }
        }
    }
    /**
     * 口座登録ボタン
     */
    accountTokuro(){
        var result = bankInfoJs.checkAccountName();
        if(result){
            var accountInfo = {};
            var formArray =$("#bankForm").serializeArray();
            $.each(formArray,function(i,item){
                accountInfo[item.name] = item.value;     
            });
            this.props.accountTokuro(accountInfo);
        }else{
            document.getElementById("bankInfoErorMsg").style = "visibility:visible";
            document.getElementById("bankInfoErorMsg").innerHTML = "口座名義人をカタカナで入力してください"
        }   
    }
    render() {
        const {actionType} =this.state;
        return (
            <div  >
            <div  >
                {/* <Row>
                        <Col sm={2}></Col>
                        <Col sm={7}>
                            <img className="mb-4" alt="title" src={title}/>
                        </Col>
                </Row> */}
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>口座情報</h2>
                    </Col>
                </Row>
                <Row>
                        <Col sm={2}>
                        </Col>
                        <Col sm={9}>
                        <p id="bankInfoErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">1</p>
                        </Col>
                </Row>
                <Form id="bankForm">
                <Row>
                        <Col>
                            <Navbar>
                                    <Navbar.Collapse>
                                        <Navbar.Text>
                                            <a id="No"></a>
                                        </Navbar.Text>
                                </Navbar.Collapse>
                            </Navbar>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">銀行名</InputGroup.Text>
                                </InputGroup.Prepend>
                                    <Form.Control id="bankCode" name="bankCode" as="select" onChange={bankInfoJs.canSelect}>
                                    </Form.Control>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Check disabled defaultChecked={true}　label="普通" inline="true" type="radio" id="futsu" name="accountTypeStatus" value="0"   />
                            <Form.Check disabled label="当座" inline="true" type="radio" name="accountTypeStatus" id="toza" value="1"   />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">支店名</InputGroup.Text>
                                </InputGroup.Prepend>
                                    <Form.Control readOnly 
                                    placeholder="例：浦和支店" 
                                    onBlur={bankInfoJs.getBankBranchInfo.bind(this,"bankBranchName")} 
                                    id="bankBranchName" maxLength="20" name="bankBranchName"/>
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">支店番号</InputGroup.Text>
                                </InputGroup.Prepend>
                                    <Form.Control placeholder="010" onBlur={bankInfoJs.getBankBranchInfo.bind(this,"bankBranchCode")} readOnly id="bankBranchCode" maxLength="3" name="bankBranchCode"/>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">口座番号</InputGroup.Text>
                                </InputGroup.Prepend>
                                    <Form.Control placeholder="123456" readOnly id="accountNo" maxLength="9" name="accountNo"/>
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">口座名義人</InputGroup.Text>
                                </InputGroup.Prepend>
                                <OverlayTrigger
                                    overlay={
                                    <Tooltip id="tips" >
                                        片仮名で入力してください
                                    </Tooltip>
                                    }
                                >
                                    <Form.Control placeholder="カタカナ" onChange={bankInfoJs.checkAccountName} readOnly id="accountName" maxLength="20" name="accountName"/>
                                </OverlayTrigger>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3}></Col>
                        <Col sm={3} className="text-center">
                        {actionType === "update" ? 
                        <Button size="sm" block onClick={this.toroku}  variant="info" id="toroku" type="button">
                            <FontAwesomeIcon icon={faSave} />更新
                        </Button>
                        :
                        <Button block size="sm" onClick={this.accountTokuro.bind(this)}  variant="info" id="accountToroku" type="button">
                        <FontAwesomeIcon icon={faSave} />登録
                        </Button>
                    }
                        </Col>
                        <Col sm={3} className="text-center">
                                <Button onClick={bankInfoJs.setDisabled} block variant="info" size="sm" type="reset" id="accountReset" value="Reset" >
                                <FontAwesomeIcon icon={faUndo} />リセット
                                </Button>
                        </Col>
                    </Row> 
                <input type="hidden" id="employeeOrCustomerNo" name="employeeOrCustomerNo"/>
                <input type="hidden" id="accountBelongsStatus" name="accountBelongsStatus"/>
                </Form>
            </div>
            </div>
        );
    }
}

export default BankInfo;