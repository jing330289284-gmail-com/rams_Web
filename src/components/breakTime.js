import React,{Component} from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import * as TopCustomerInfoJs from '../components/topCustomerInfoJs.js';
import $ from 'jquery';
import axios from 'axios';
import * as utils from './utils/publicUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch } from '@fortawesome/free-solid-svg-icons';

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


class BreakTime extends Component {
	constructor() {
		super();
		this.state = {
	        actionType:'',//処理区分
			breakTimeDate: new Date(),
			breakTimeDayHourStart: [],//　　お昼時から
			breakTimeDayMinuteStart: [],//　　お昼分から
			breakTimeDayHourEnd: [],//　　お昼時まで
			breakTimeDayMinuteEnd: [],//　　お昼分まで
			breakTimeNightHourStart: [],//　　お昼時から
			breakTimeNightMinuteStart: [],//　　お昼分から
			breakTimeNightHourEnd: [],//　　お昼時まで
			breakTimeNightMinuteEnd: [],//　　お昼分まで
		};
		
		for (var i = 0; i <= 14; i++)	{
			this.state.breakTimeDayHourStart[i] = i.toString();
			this.state.breakTimeDayHourEnd[i] = i.toString();
		}
		for (var i = 15; i < 24; i++)	{
			this.state.breakTimeNightHourStart[i] = i.toString();
			this.state.breakTimeNightHourEnd[i] = i.toString();
		}
		for (var i = 0; i < 60; i+=15)	{
			this.state.breakTimeDayMinuteStart[i] = i.toString();
			this.state.breakTimeDayMinuteEnd[i] = i.toString();
			this.state.breakTimeNightMinuteStart[i] = i.toString();
			this.state.breakTimeNightMinuteEnd[i] = i.toString();
		}
		
	}
    /**
     * 画面の初期化
     */
    componentDidMount(){
        var actionType = this.props.actionType;//父画面のパラメータ（処理区分）
        var topCustomerNo = this.props.topCustomerNo;//父画面のパラメータ（画面既存上位お客様情報）
		$("#breakTimeUser").val(sessionStorage.getItem("employeeName"));
		this.calculateTime();
		console.log(sessionStorage);
        var topCustomerInfo = this.props.topCustomerInfo;
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
	calculateTime ()	{
		var breakTimeDayHourStart = Number($("#breakTimeDayHourStart").val());
		var breakTimeDayHourEnd = Number($("#breakTimeDayHourEnd").val());
		var breakTimeDayMinuteStart = Number($("#breakTimeDayMinuteStart").val());
		var breakTimeDayMinuteEnd = Number($("#breakTimeDayMinuteEnd ").val());
		var breakTimeNightHourStart = Number($("#breakTimeNightHourStart").val());
		var breakTimeNightHourEnd = Number($("#breakTimeNightHourEnd").val());
		var breakTimeNightMinuteStart = Number($("#breakTimeNightMinuteStart").val());
		var breakTimeNightMinuteEnd = Number($("#breakTimeNightMinuteEnd ").val());
		
		var breakTimeDaybreakTimeHour = breakTimeDayHourEnd * 60 + breakTimeDayMinuteEnd - breakTimeDayHourStart * 60 - breakTimeDayMinuteStart;
		var breakTimeNightbreakTimeHour = breakTimeNightHourEnd * 60 + breakTimeNightMinuteEnd - breakTimeNightHourStart * 60 - breakTimeNightMinuteStart;

		$("#breakTimeDaybreakTimeHour").val(breakTimeDaybreakTimeHour / 60);
		$("#breakTimeNightbreakTimeHour").val(breakTimeNightbreakTimeHour / 60);
		$("#breakTimeSumHour").val(Number($("#breakTimeDaybreakTimeHour").val()) + Number($("#breakTimeNightbreakTimeHour").val()));
	}
    /**-
     * 登録ボタン
     */
    breakTimeRegister(){
        var breakTimeInfo = {};
        var actionType = this.state.actionType;
        breakTimeInfo["employeeNo"] = $("#breakTimeUser").val();
        breakTimeInfo["breakTimeIsConst"] = $("#isConst").val();
        breakTimeInfo["breakTimeYearMonth"] = utils.formateDate($("#breakTimeDate").val(), false);
        breakTimeInfo["breakTimeDayStart"] = $("#breakTimeDayHourStart").val().padStart(2,"0") + $("#breakTimeDayMinuteStart").val().padEnd(2,"0");
        breakTimeInfo["breakTimeDayEnd"] = $("#breakTimeDayHourEnd").val().padStart(2,"0") + $("#breakTimeDayMinuteEnd").val().padEnd(2,"0");
        breakTimeInfo["breakTimeNightStart"] = $("#breakTimeNightHourStart").val().padStart(2,"0") + $("#breakTimeNightMinuteStart").val().padEnd(2,"0");
        breakTimeInfo["breakTimeNightEnd"] = $("#breakTimeNightHourEnd").val().padStart(2,"0") + $("#breakTimeNightMinuteEnd").val().padEnd(2,"0");
        breakTimeInfo["breakTimeDaybreakTimeHour"] = $("#breakTimeDaybreakTimeHour").val();
        breakTimeInfo["breakTimeNightbreakTimeHour"] = $("#breakTimeNightbreakTimeHour").val();
        breakTimeInfo["breakTimeSumHour"] = $("#breakTimeSumHour").val();
        breakTimeInfo["updateUser"] = sessionStorage.getItem('employeeNo');
		console.log(breakTimeInfo);
		actionType = "insert";
        if(actionType === "insert"){
            breakTimeInfo["actionType"] = "insert";
            axios.post("http://127.0.0.1:8080/dutyRegistration/breakTimeInsert", breakTimeInfo)
            .then(resultMap => {
                if(resultMap.data){
                    alert("更新成功");
                }else{
                    alert("更新失败");
                }
            })
            .catch(function(){
                alert("更新错误，请检查程序");
            })
        }    
	}
	isConst ()	{
		var isConst = $("#isConst").val();
		var isDisable = false;
		if (isConst == 0)	{
			isDisable = true;
		}
		else if (isConst == 1)	{
			isDisable = false;
		}
		$("#breakTimeDate").prop( "disabled", isDisable );
		$("#breakTimeDayHourStart").prop( "disabled", isDisable );
		$("#breakTimeDayMinuteStart").prop( "disabled", isDisable );
		$("#breakTimeDayHourEnd").prop( "disabled", isDisable );
		$("#breakTimeDayMinuteEnd").prop( "disabled", isDisable );
		$("#breakTimeNightHourStart").prop( "disabled", isDisable );
		$("#breakTimeNightMinuteStart").prop( "disabled", isDisable );
		$("#breakTimeNightHourEnd").prop( "disabled", isDisable );
		$("#breakTimeNightMinuteEnd").prop( "disabled", isDisable );
		$("#toroku").prop( "disabled", isDisable );
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
                    <Col xs lg="4" className="text-center">
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">休憩時間固定</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control id="isConst" name="isConst" as="select" onChange={this.isConst} >
									<option value="1">はい</option>
									<option value="0">いいえ</option>
                                </Form.Control>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
	                        <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">氏名</InputGroup.Text>
	                        </InputGroup.Prepend>
                            <Form.Control readOnly id="breakTimeUser" name="breakTimeUser" />
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
	                        <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
	                        </InputGroup.Prepend>
							<InputGroup.Append>
								<DatePicker
									selected={this.state.breakTimeDate}
									onChange={date => {this.setState({breakTimeDate: date});}} 
									locale="ja"
									dateFormat="yyyy/MM"
									showMonthYearPicker
									id="breakTimeDate"
									className="form-control form-control-sm"
									autoComplete="off"
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
                            <Form.Control id="breakTimeDayHourStart" name="breakTimeDayHourStart" as="select" onChange={this.calculateTime} >
								{this.state.breakTimeDayHourStart.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="breakTimeDayMinuteStart" name="breakTimeDayMinuteStart" as="select" onChange={this.calculateTime} >
								{this.state.breakTimeDayMinuteStart.map(data =>
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
                            <Form.Control id="breakTimeDayHourEnd" name="breakTimeDayHourEnd" as="select" onChange={this.calculateTime} >
								{this.state.breakTimeDayHourEnd.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="breakTimeDayMinuteEnd" name="breakTimeDayMinuteEnd" as="select" onChange={this.calculateTime} >
								{this.state.breakTimeDayMinuteEnd.map(data =>
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
                            <Form.Control readOnly id="breakTimeDaybreakTimeHour" name="breakTimeDaybreakTimeHour" />
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
                            <Form.Control id="breakTimeNightHourStart" name="breakTimeNightHourStart" as="select" onChange={this.calculateTime} >
								{this.state.breakTimeNightHourStart.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="breakTimeNightMinuteStart" name="breakTimeNightMinuteStart" as="select" onChange={this.calculateTime} >
								{this.state.breakTimeNightMinuteStart.map(data =>
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
                            <Form.Control id="breakTimeNightHourEnd" name="breakTimeNightHourEnd" as="select" onChange={this.calculateTime} >
								{this.state.breakTimeNightHourEnd.map(data =>
									<option value={data}>
										{data}
									</option>
								)}
                            </Form.Control>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">時</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="breakTimeNightMinuteEnd" name="breakTimeNightMinuteEnd" as="select" onChange={this.calculateTime} >
								{this.state.breakTimeNightMinuteEnd.map(data =>
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
                            <Form.Control readOnly id="breakTimeNightbreakTimeHour" name="breakTimeNightbreakTimeHour" />
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
                            <Form.Control readOnly id="breakTimeSumHour" name="breakTimeSumHour" />
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
                            <Button block size="sm" onClick={this.breakTimeRegister.bind(this)} variant="info" id="update" type="button">
                            <FontAwesomeIcon icon={faSave} />更新
                            </Button>
                        </Col>
                        :
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={this.breakTimeRegister.bind(this)} variant="info" id="toroku" type="button">
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

export default BreakTime;