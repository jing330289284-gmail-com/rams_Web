import React,{Component} from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import * as TopCustomerInfoJs from '../components/topCustomerInfoJs.js';
import $ from 'jquery';
import axios from 'axios';
import * as utils from './utils/dateUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch } from '@fortawesome/free-solid-svg-icons';

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


class Kyuukei extends Component {
	constructor() {
		super();
		this.state = {
	        actionType:'',//処理区分
			kyuukeiDayHourStart: [],//　　お昼時から
			kyuukeiDayMinuteStart: [],//　　お昼分から
			kyuukeiDayHourEnd: [],//　　お昼時まで
			kyuukeiDayMinuteEnd: [],//　　お昼分まで
			kyuukeiNightHourStart: [],//　　お昼時から
			kyuukeiNightMinuteStart: [],//　　お昼分から
			kyuukeiNightHourEnd: [],//　　お昼時まで
			kyuukeiNightMinuteEnd: [],//　　お昼分まで
		};
		for (var i = 0; i < 24; i++)	{
			this.state.kyuukeiDayHourStart[i] = i.toString();
			this.state.kyuukeiDayHourEnd[i] = i.toString();
			this.state.kyuukeiNightHourStart[i] = i.toString();
			this.state.kyuukeiNightHourEnd[i] = i.toString();
		}
		for (var i = 0; i < 60; i+=15)	{
			this.state.kyuukeiDayMinuteStart[i] = i.toString();
			this.state.kyuukeiDayMinuteEnd[i] = i.toString();
			this.state.kyuukeiNightMinuteStart[i] = i.toString();
			this.state.kyuukeiNightMinuteEnd[i] = i.toString();
		}
	}
    /**
     * 画面の初期化
     */
    componentDidMount(){
        var actionType = this.props.actionType;//父画面のパラメータ（処理区分）
        var topCustomerNo = this.props.topCustomerNo;//父画面のパラメータ（画面既存上位お客様情報）
		$("#kyuukeiUser").val(sessionStorage.getItem("userLastName"));
        var topCustomerInfo = this.props.topCustomerInfo;
		console.log(topCustomerInfo);
//        if(!$.isEmptyObject(topCustomerInfo)){//上位お客様追加でも修正したい場合
//            document.getElementById("topCustomerNo").innerHTML = topCustomerInfo.topCustomerNo;
//            $("#topCustomerName").val(topCustomerInfo.topCustomerName);
//            $("#topCustomerAbbreviation").val(topCustomerInfo.topCustomerAbbreviation);
//            $("#topUrl").val(topCustomerInfo.url);
//            $("#topRemark").val(topCustomerInfo.remark);
//            this.setState({
//                actionType:'insert',
//            })
//        }else{
//            if(topCustomerNo !== null && topCustomerNo !== '' && topCustomerNo !== undefined){
//                var topCustomerMod = {};
//                topCustomerMod["topCustomerNo"] = topCustomerNo;
//                axios.post("http://127.0.0.1:8080/topCustomerInfo/onloadPage", topCustomerMod)
//                    .then(resultMap => {
//                        topCustomerMod = resultMap.data.topCustomerMod;
//                        document.getElementById("topCustomerNo").innerHTML = topCustomerMod.topCustomerNo;
//                        $("#topCustomerName").val(topCustomerMod.topCustomerName);
//                        $("#topCustomerAbbreviation").val(topCustomerMod.topCustomerAbbreviation);
//                        $("#topUrl").val(topCustomerMod.url);
//                        $("#topRemark").val(topCustomerMod.remark);
//                        this.setState({
//                            actionType:'update',
//                        })
//                    })
//                    .catch(function(){
//                        alert("页面加载错误，请检查程序");
//                    })
//            }else{
//                var topCustomerNo = "";
//                const promise = Promise.resolve(utils.getNO("topCustomerNo", "T", "T008TopCustomerInfo"));
//                promise.then((value) => {
//                    console.log(value);
//                            topCustomerNo = value;
//                            document.getElementById("topCustomerNo").innerHTML = topCustomerNo;
//                });
//                this.setState({
//                    actionType:'insert',
//                })
//            }
//        }
//        if(actionType === "detail"){
//            TopCustomerInfoJs.setDisabled();
//        }
    }
    /**-
     * 上位お客様情報登録ボタン
     */
    topCustomerToroku(){
        if($("#topCustomerName").val() !== "" && $("#topCustomerName").val() != null){
            var topCustomerInfo = {};
            var actionType = this.state.actionType;
            topCustomerInfo["topCustomerNo"] = document.getElementById("topCustomerNo").innerHTML;
            topCustomerInfo["topCustomerAbbreviation"] = $("#topCustomerAbbreviation").val();
            topCustomerInfo["topCustomerName"] = $("#topCustomerName").val();
            topCustomerInfo["url"] = $("#topUrl").val();
            topCustomerInfo["remark"] = $("#topRemark").val();
            topCustomerInfo["updateUser"] = sessionStorage.getItem('employeeNo');
            if(actionType === "update"){
                topCustomerInfo["actionType"] = "update";
                axios.post("http://127.0.0.1:8080/topCustomerInfo/toroku", topCustomerInfo)
                .then(resultMap => {
                    if(resultMap.data){
                        alert("更新成功");
                        var methodArray = ["getTopCustomerDrop"]
                        var selectDataList = utils.getPublicDropDown(methodArray);
                        var topCustomerDrop = selectDataList[0];
                        this.props.topCustomerToroku(topCustomerDrop);
                    }else{
                        alert("更新失败");
                    }
                })
                .catch(function(){
                    alert("更新错误，请检查程序");
                })
            }else if(actionType === "insert"){
                this.props.topCustomerToroku(topCustomerInfo);
            }
        }else{
            if($("#topCustomerName").val() === "" || $("#topCustomerName").val() === null){
                document.getElementById("topCustomerInfoErorMsg").style = "visibility:visible";
                document.getElementById("topCustomerInfoErorMsg").innerHTML = "★がついてる項目を入力してください！"
            }
            
        } 
    }
    render() {
        const {actionType} = this.state;
        return (
            <div >
            <div >
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>現場休憩時間入力</h2>
                    </Col>
                </Row>
                <Form id="topCustomerInfoForm">
                <Row inline="true" className="justify-content-md-center">
                    <Col xs lg="7" className="text-center">
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">休憩時間固定</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control id="isConst" name="isConst" as="select" >
									<option>1</option>
									<option>2</option>
                                </Form.Control>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
	                        <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">氏名</InputGroup.Text>
	                        </InputGroup.Prepend>
                            <Form.Control readOnly id="kyuukeiUser" name="kyuukeiUser" />
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
	                        <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
	                        </InputGroup.Prepend>
							<InputGroup.Append>
								<DatePicker
									selected={new Date()} 
									locale="ja"
									dateFormat="yyyy/MM"
									showMonthYearPicker
									showFullMonthYearPicker
									id="kyuukeiDate"
									className="form-control form-control-sm"
									autoComplete="off"
									readonly
								/>
							</InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お昼</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiDayHourStart" name="kyuukeiDayHourStart" as="select" >
								{this.state.kyuukeiDayHourStart.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiDayMinuteStart" name="kyuukeiDayMinuteStart" as="select" >
								{this.state.kyuukeiDayMinuteStart.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">分</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">~</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiDayHourEnd" name="kyuukeiDayHourEnd" as="select" >
								{this.state.kyuukeiDayHourEnd.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiDayMinuteEnd" name="kyuukeiDayMinuteEnd" as="select" >
								{this.state.kyuukeiDayMinuteEnd.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">分</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">休憩時間</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiDayKyuukeiHour" name="kyuukeiDayKyuukeiHour" as="select" >
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">夜　</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiNightHourStart" name="kyuukeiNightHourStart" as="select" >
								{this.state.kyuukeiNightHourStart.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiNightMinuteStart" name="kyuukeiNightMinuteStart" as="select" >
								{this.state.kyuukeiNightMinuteStart.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">分</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">~</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiNightHourEnd" name="kyuukeiNightHourEnd" as="select" >
								{this.state.kyuukeiNightHourEnd.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiNightMinuteEnd" name="kyuukeiNightMinuteEnd" as="select" >
								{this.state.kyuukeiNightMinuteEnd.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">分</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">休憩時間</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiNightKyuukeiHour" name="kyuukeiNightKyuukeiHour" as="select" >
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={8}>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">合計</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="kyuukeiNightKyuukeiHour" name="kyuukeiNightKyuukeiHour" as="select" >
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}></Col>
                    {actionType === "update" ? 
                        <Col sm={3} className="text-center">
                            <Button block size="sm" onClick={this.topCustomerToroku.bind(this)} variant="info" id="update" type="button">
                            <FontAwesomeIcon icon={faSave} />更新
                            </Button>
                        </Col>
                        :
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={this.topCustomerToroku.bind(this)} variant="info" id="toroku" type="button">
                                <FontAwesomeIcon icon={faSave} /> 登録
                                </Button>
                        </Col>
                }
                        <Col sm={3} className="text-center">
                                <Button  block size="sm" variant="info" id="reset" onClick={TopCustomerInfoJs.reset} >
                                <FontAwesomeIcon icon={faUndo} /> リセット
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

export default Kyuukei;