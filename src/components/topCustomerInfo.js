import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button } from 'react-bootstrap';
import * as TopCustomerInfoJs from '../components/topCustomerInfoJs.js';
import $ from 'jquery';
import axios from 'axios';
import * as utils from './utils/publicUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import ErrorsMessageToast from './errorsMessageToast';
import MyToast from './myToast';
import store from './redux/store';
axios.defaults.withCredentials = true;
/**
 * 上位お客様画面（社員用）
 */
class TopCustomerInfo extends Component {
    state = {
        actionType: '',//処理区分
        errorsMessageShow: false,
        errorsMessageValue: '',
        myToastShow: false,
        message: '',
        type: '',
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
    }
    /**
     * 画面の初期化
     */
    componentDidMount() {
        var actionType = this.props.actionType;//父画面のパラメータ（処理区分）
        var topCustomerNo = this.props.topCustomer;//父画面のパラメータ（画面既存上位お客様情報）
        console.log($("#topCustomerNameShita").val());
        var topCustomerInfo = this.props.topCustomerInfo;
        if (!$.isEmptyObject(topCustomerInfo)) {//上位お客様追加でも修正したい場合
            document.getElementById("topCustomerNo").innerHTML = topCustomerInfo.topCustomerNo;
            $("#topCustomerName").val(topCustomerInfo.topCustomerName);
            $("#topCustomerAbbreviation").val(topCustomerInfo.topCustomerAbbreviation);
            $("#topUrl").val(topCustomerInfo.url);
            $("#topRemark").val(topCustomerInfo.remark);
            this.setState({
                actionType: 'insert',
            })
        } else {
            if (topCustomerNo !== null && topCustomerNo !== '' && topCustomerNo !== undefined) {
                var topCustomerMod = {};
                topCustomerMod["topCustomerNo"] = topCustomerNo;
                axios.post(this.state.serverIP + "topCustomerInfo/init", topCustomerMod)
                    .then(resultMap => {
                        topCustomerMod = resultMap.data.topCustomerMod;
                        document.getElementById("topCustomerNo").innerHTML = topCustomerMod.topCustomerNo;
                        $("#topCustomerName").val(topCustomerMod.topCustomerName);
                        $("#topCustomerAbbreviation").val(topCustomerMod.topCustomerAbbreviation);
                        $("#topUrl").val(topCustomerMod.url);
                        $("#topRemark").val(topCustomerMod.remark);
                        this.setState({
                            actionType: 'update',
                        })
                    })
                    .catch(error => {
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
                    })
            } else {
                var topCustomerNo = "";
                const promise = Promise.resolve(utils.getNO("topCustomerNo", "T", "T008TopCustomerInfo", this.state.serverIP));
                promise.then((value) => {
                    console.log(value);
                    topCustomerNo = value;
                    document.getElementById("topCustomerNo").innerHTML = topCustomerNo;
                });
                this.setState({
                    actionType: 'insert',
                })
            }
        }
        if (actionType === "detail") {
            TopCustomerInfoJs.setDisabled();
        }
    }
    /**-
     * 上位お客様情報登録ボタン
     */
    topCustomerToroku() {
        if ($("#topCustomerName").val() !== "" && $("#topCustomerName").val() != null) {
            var topCustomerInfo = {};
            var actionType = this.state.actionType;
            topCustomerInfo["topCustomerNo"] = document.getElementById("topCustomerNo").innerHTML;
            topCustomerInfo["topCustomerAbbreviation"] = $("#topCustomerAbbreviation").val();
            topCustomerInfo["topCustomerName"] = $("#topCustomerName").val();
            topCustomerInfo["url"] = $("#topUrl").val();
            topCustomerInfo["remark"] = $("#topRemark").val();
            if (actionType === "update") {
                topCustomerInfo["actionType"] = "update";
                axios.post(this.state.serverIP + "topCustomerInfo/toroku", topCustomerInfo)
                    .then(resultMap => {
                        if (resultMap.data) {
                            this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "更新成功" });
                            setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                            var methodArray = ["getTopCustomerDrop"]
                            var selectDataList = utils.getPublicDropDown(methodArray, this.state.serverIP);
                            var topCustomerDrop = selectDataList[0];
                            this.props.topCustomerToroku(topCustomerDrop);
                        } else {
                            this.setState({ "myToastShow": true, "type": "fail", "errorsMessageShow": false, message: "更新失败" });
                            setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                        }
                    })
                    .catch(function () {
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
                    })
            } else if (actionType === "insert") {
                this.props.topCustomerToroku(topCustomerInfo);
            }
        } else {
            if ($("#topCustomerName").val() === "" || $("#topCustomerName").val() === null) {
                this.setState({ "myToastShow": true, "type": "fail", "errorsMessageShow": false, message: "上位お客様名前を入力してください！" });
                setTimeout(() => this.setState({ "myToastShow": false }), 3000);
            }

        }
    }
    render() {
        const { actionType, errorsMessageValue, message, type } = this.state;
        return (
            <div >
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
                </div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <div >
                    <Row inline="true">
                        <Col className="text-center">
                            <h2>上位お客様情報</h2>
                        </Col>
                    </Row>
                    <br />
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
                                    <Form.Control placeholder="例：富士通" id="topCustomerName" name="topCustomerName" /><font color="red"
                                        style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
                                </InputGroup>
                            </Col>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">略称</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="略称" id="topCustomerAbbreviation" name="topCustomerAbbreviation" />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">URL</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder="www.123321.com" id="topUrl" name="topUrl" />
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
                            <Col className="text-center">
                                {actionType === "update" ?
                                    <Button size="sm" onClick={this.topCustomerToroku.bind(this)} variant="info" id="update" type="button">
                                        <FontAwesomeIcon icon={faSave} />更新
                            </Button>
                                    :
                                    <Button size="sm" onClick={this.topCustomerToroku.bind(this)} variant="info" id="toroku" type="button">
                                        <FontAwesomeIcon icon={faSave} /> 登録
                                </Button>
                                }
                                {" "}<Button size="sm" variant="info" id="reset" onClick={TopCustomerInfoJs.reset} >
                                    <FontAwesomeIcon icon={faUndo} /> リセット
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <input type="hidden" id="actionType" name="actionType" />
                </div>
            </div>
        );
    }
}
export default TopCustomerInfo;