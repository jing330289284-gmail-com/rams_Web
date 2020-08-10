import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button } from 'react-bootstrap';
import * as TopCustomerInfoJs from '../components/topCustomerInfoJs.js';
import $ from 'jquery';
import axios from 'axios';

class TopCustomerInfo extends Component {
    state = {  }
    /**
     * 画面の初期化
     */
    componentDidMount(){
        var actionType = this.props.actionType;//父画面のパラメータ（処理区分）
        var topCustomerInfo = this.props.topCustomerInfo;//父画面のパラメータ（画面既存上位お客様情報）
        if(!$.isEmptyObject(topCustomerInfo)){
            document.getElementById("topCustomerNo").innerHTML = topCustomerInfo.topCustomerNo;
            $("#topCustomerAbbreviation").val(topCustomerInfo.topCustomerAbbreviation);
            $("#topCustomerName").val(topCustomerInfo.topCustomerName);
            $("#topUrl").val(topCustomerInfo.url);
            $("#topRemark").val(topCustomerInfo.remark);
        }else if($.isEmptyObject(topCustomerInfo)){
            var topCustomerMod = {};
            topCustomerMod["actionType"] = $("#actionType").val();
            topCustomerMod["topCustomerNo"] = $("#topCustomerNo").val();
            axios.post("http://127.0.0.1:8080/topCustomerInfo/onloadPage", topCustomerMod)
            .then(function (resultMap) {
                var topCustomerMod = resultMap.data.topCustomerMod;
                if(actionType === 'addTo'){
                    var TopCustomerNoSaiBan = resultMap.data.TopCustomerNoSaiBan;
                    TopCustomerNoSaiBan =  parseInt(TopCustomerNoSaiBan.substring(1,4)) + 1;
                    if(TopCustomerNoSaiBan < 10){
                        TopCustomerNoSaiBan = 'T00' + TopCustomerNoSaiBan;
                    }else if(TopCustomerNoSaiBan >= 10 && TopCustomerNoSaiBan < 100){
                        TopCustomerNoSaiBan = 'T0' + TopCustomerNoSaiBan;
                    }else if(TopCustomerNoSaiBan >=100){
                        TopCustomerNoSaiBan = 'T' + TopCustomerNoSaiBan;
                    }
                    document.getElementById("topCustomerNo").innerHTML = TopCustomerNoSaiBan;
                    $("#topCustomerNo").attr("readOnly",true);
                }else{
                    document.getElementById("topCustomerNo").innerHTML = topCustomerMod.topCustomerNo;
                    $("#topCustomerName").val(topCustomerMod.topCustomerName);
                    $("#topCustomerAbbreviation").val(topCustomerMod.topCustomerAbbreviation);
                    $("#topUrl").val(topCustomerMod.url);
                    $("#topRemark").val(topCustomerMod.remark);
                    if(actionType === 'sansho'){
                        TopCustomerInfoJs.setDisabled();
                    }
                }
            })
            .catch(function(){
                alert("页面加载错误，请检查程序");
            })
            }
    }
    /**-
     * 上位お客様情報登録ボタン
     */
    topCustomerToroku(){
        if($("#topCustomerName").val() !== "" && $("#topCustomerName").val() != null){
            var topCustomerInfo = {};
            topCustomerInfo["topCustomerNo"] = document.getElementById("topCustomerNo").innerHTML;
            topCustomerInfo["topCustomerAbbreviation"] = $("#topCustomerAbbreviation").val();
            topCustomerInfo["topCustomerName"] = $("#topCustomerName").val();
            topCustomerInfo["url"] = $("#topUrl").val();
            topCustomerInfo["remark"] = $("#topRemark").val();
            this.props.topCustomerToroku(topCustomerInfo);
        }else{
            if($("#topCustomerName").val() === "" || $("#topCustomerName").val() === null){
                document.getElementById("topCustomerInfoErorMsg").style = "visibility:visible";
                document.getElementById("topCustomerInfoErorMsg").innerHTML = "★がついてる項目を入力してください！"
            }
            
        } 
    }
    render() {
        return (
            <div >
            <div >
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>上位お客様情報</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                    </Col>
                    <Col sm={7}>
                    <p id="topCustomerInfoErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★</p>
                    </Col>
                </Row>
                <Form id="topCustomerInfoForm">
                <Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                                上位お客様番号：                            
                                    <a id="topCustomerNo" name="topCustomerNo"></a>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="例：富士通" id="topCustomerName" name="topCustomerName" /><font  color="red"
				                style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">略称</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="略称" id="topCustomerAbbreviation" name="topCustomerAbbreviation"/>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">URL</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="www.123321.com" id="topUrl" name="topUrl"/>
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="備考" id="topRemark" name="topRemark" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}></Col>
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={this.topCustomerToroku.bind(this)} variant="primary" id="toroku" type="button">
                                    登録
                                </Button>
                        </Col>
                        <Col sm={3} className="text-center">
                                <Button  block size="sm" id="reset" onClick={TopCustomerInfoJs.reset} >
                                    リセット
                                </Button>
                        </Col>
                </Row>
                </Form>
                <input type="hidden" id="actionType" name="actionType"/>
            </div>
            </div>
        );
    }
}

export default TopCustomerInfo;