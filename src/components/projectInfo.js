import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl, Modal, } from 'react-bootstrap';
import MyToast from './myToast';
import $ from 'jquery';
import ErrorsMessageToast from './errorsMessageToast';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons';
import * as utils from './utils/publicUtils.js';
import { BootstrapTable, TableHeaderColumn, BSTable } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import store from './redux/store';
registerLocale('ja', ja);
axios.defaults.withCredentials = true;

class projectInfo extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;//初期化
    }
    initialState = {
        //項目
        projectNo: '',
        projectName: '',
        nationalityCode: '',
        admissionPeriod: '',
        projectType: '',
        successRate: '',
        customerNo: '',
        personInCharge: '',
        mail: '',
        keyWordOfLanagurue1: '',
        keyWordOfLanagurue2: '',
        keyWordOfLanagurue3: '',
        typeOfIndustry: '',
        projectInfoDetail: '',
        japaneaseConversationLevel: '',
        unitPriceRangeLowest: '',
        unitPriceRangeHighest: '',
        ageClassificationCode: '',
        projectPhaseStart: '',
        projectPhaseEnd: '',
        payOffRangeLowest: '',
        payOffRangeHighest: '',
        workStartPeriod: '',
        requiredItem1: '',
        requiredItem2: '',
        noOfInterviewCode: '',
        //パラメータ
        actionType: "insert",
        nowNum: "0",
        message: '',//toastのメッセージ
        type: '',//成功や失敗
        myToastShow: false,//toastのフラグ
        errorsMessageShow: false,///エラーのメッセージのフラグ
        errorsMessageValue: '',//エラーのメッセージ
        torokuText: '登録',//登録ボタンの文字
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//バックエンドのリンク
        //Drop 
        projectTypeDrop: store.getState().dropDown[52],
        payOffRangeDrop: store.getState().dropDown[33].slice(1),
        nationalityDrop: store.getState().dropDown[7],
        japaneaseConversationLevelDrop: store.getState().dropDown[43],
        projectPhaseDrop: store.getState().dropDown[45],
        noOfInterviewDrop: store.getState().dropDown[50],
        customerDrop: store.getState().dropDown[15],
        personInChargeDrop: store.getState().dropDown[0],
        mailDrop: store.getState().dropDown[0],
        stationDrop: store.getState().dropDown[14],
        successRateDrop: store.getState().dropDown[48],
        developLanguageDrop: store.getState().dropDown[8].slice(1),
        ageClassificationDrop: store.getState().dropDown[49],
        admissionPeriodDrop: store.getState().dropDown[51],
        typeOfIndustryDrop: store.getState().dropDown[36],
    }
    //onchange
    valueChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }
    //リセット
    resetValue = () => {
        this.setState({
            projectName: '',
            nationalityCode: '',
            admissionPeriod: '',
            projectType: '',
            successRate: '',
            customerNo: '',
            personInCharge: '',
            mail: '',
            phoneNo: '',
            keyWordOfLanagurue1: '',
            keyWordOfLanagurue2: '',
            keyWordOfLanagurue3: '',
            typeOfIndustry: '',
            projectInfoDetail: '',
            japaneaseConversationLevel: '',
            unitPriceRangeLowest: '',
            unitPriceRangeHighest: '',
            ageClassificationCode: '',
            projectPhaseStart: '',
            projectPhaseEnd: '',
            payOffRangeLowest: '',
            payOffRangeHighest: '',
            workStartPeriod: '',
            requiredItem1: '',
            requiredItem2: '',
            noOfInterviewCode: '',
        })
    }
    /**
     * 値を設定
     */
    giveValue = (projectInfoMod) => {
        this.setState({
            projectName: projectInfoMod.projectName,
            nationalityCode: projectInfoMod.nationalityCode,
            admissionPeriod: projectInfoMod.admissionPeriod,
            projectType: projectInfoMod.projectType,
            successRate: projectInfoMod.successRate,
            customerNo: projectInfoMod.customerNo,
            personInCharge: projectInfoMod.personInCharge,
            mail: projectInfoMod.mail,
            phoneNo: projectInfoMod.phoneNo,
            keyWordOfLanagurue1: projectInfoMod.keyWordOfLanagurue1,
            keyWordOfLanagurue2: projectInfoMod.keyWordOfLanagurue2,
            keyWordOfLanagurue3: projectInfoMod.keyWordOfLanagurue3,
            typeOfIndustry: projectInfoMod.typeOfIndustry,
            projectInfoDetail: projectInfoMod.projectInfoDetail,
            japaneaseConversationLevel: projectInfoMod.japaneaseConversationLevel,
            unitPriceRangeLowest: projectInfoMod.unitPriceRangeLowest,
            unitPriceRangeHighest: projectInfoMod.unitPriceRangeHighest,
            ageClassificationCode: projectInfoMod.ageClassificationCode,
            projectPhaseStart: projectInfoMod.projectPhaseStart,
            projectPhaseEnd: projectInfoMod.projectPhaseEnd,
            payOffRangeLowest: projectInfoMod.payOffRangeLowest,
            payOffRangeHighest: projectInfoMod.payOffRangeHighest,
            workStartPeriod: projectInfoMod.workStartPeriod,
            requiredItem1: projectInfoMod.requiredItem1,
            requiredItem2: projectInfoMod.requiredItem2,
            noOfInterviewCode: projectInfoMod.noOfInterviewCode,
        })
    }
    /**
     * お客様の自動提示
     */
    getCustomer = (event, values) => {
        if (values != null) {
            this.setState({
                customerNo: values.code,
            })
        } else {
            this.setState({
                customerNo: "",
            })
        }
    }
    /**
     * 開発言語の自動提示
     * @param {*} event 
     * @param {*} values 
     */
    getJapanese1 = (event, values) => {
        if (values != null) {
            this.setState({
                keyWordOfLanagurue1: values.code,
            })
        } else {
            this.setState({
                keyWordOfLanagurue1: "",
            })
        }
    }
    getJapanese2 = (event, values) => {
        if (values != null) {
            this.setState({
                keyWordOfLanagurue2: values.code,
            })
        } else {
            this.setState({
                keyWordOfLanagurue2: "",
            })
        }
    }
    getJapanese3 = (event, values) => {
        if (values != null) {
            this.setState({
                keyWordOfLanagurue3: values.code,
            })
        } else {
            this.setState({
                keyWordOfLanagurue3: "",
            })
        }
    }
    getStation = (event, values) => {
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
    /**
     * 数字のみ入力
     */
    vNumberChange = (e, key) => {
        const { value } = e.target;
        var num = value;
        const reg = /^[0-9]*$/;
        num = utils.deleteComma(num);
        var keyLength = 2;
        if ((reg.test(num) && num.length < keyLength)) {
            this.setState({
                [key]: num
            })
        }
    }
    numLimit = () => {
        var text = this.state.projectInfoDetail;
        this.setState({
            nowNum: text.length,
        })
    }
    render() {
        const {
            projectNo,
            projectName,
            nationalityCode,
            admissionPeriod,
            projectType,
            successRate,
            customerNo,
            personInCharge,
            mail,
            keyWordOfLanagurue1,
            keyWordOfLanagurue2,
            keyWordOfLanagurue3,
            typeOfIndustry,
            projectInfoDetail,
            japaneaseConversationLevel,
            unitPriceRangeLowest,
            unitPriceRangeHighest,
            ageClassificationCode,
            projectPhaseStart,
            projectPhaseEnd,
            payOffRangeLowest,
            payOffRangeHighest,
            workStartPeriod,
            requiredItem1,
            requiredItem2,
            stationCode,
            noOfInterviewCode,
            experienceYear,
            actionType,
            nowNum,
            message,//toastのメッセージ
            type,//成功や失敗
            myToastShow,//toastのフラグ
            errorsMessageShow,///エラーのメッセージのフラグ
            errorsMessageValue,//エラーのメッセージ
            torokuText,//登録ボタンの文字
            serverIP,//バックエンドのリンク
            //Drop 
            projectTypeDrop,
            payOffRangeDrop,
            nationalityDrop,
            japaneaseConversationLevelDrop,
            projectPhaseDrop,
            noOfInterviewDrop,
            customerDrop,
            personInChargeDrop,
            mailDrop,
            stationDrop,
            successRateDrop,
            developLanguageDrop,
            ageClassificationDrop,
            admissionPeriodDrop,
            typeOfIndustryDrop,
        } = this.state;
        return (
            <div>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
                </div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <div id="Home">
                    <Row inline="true">
                        <Col className="text-center">
                            <h2>案件登録</h2>
                        </Col>
                    </Row>
                    <br />
                    <Form id="projectInfoForm">
                        <Form.Group>
                            <Row>
                                <Col sm={2}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>案件番号</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="8"
                                            value={projectNo}
                                            name="projectNo"
                                            onChange={this.valueChange}
                                            readOnly
                                            disabled={actionType === "detail" ? true : false}></FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={4}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>案件名</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="20"
                                            value={projectName}
                                            name="projectName"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}
                                            placeholder="例：123システム"></FormControl>
                                        <font
                                            id="mark" color="red"
                                            style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>案件種別</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={projectType}
                                            name="projectType"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {projectTypeDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                            <font
                                                id="mark" color="red"
                                                style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={1}>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>入場時期</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={admissionPeriod}
                                            name="admissionPeriod"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {admissionPeriodDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                            <font
                                                id="mark" color="red"
                                                style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={1}>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>単価範囲</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="3"
                                            value={unitPriceRangeLowest}
                                            name="unitPriceRangeLowest"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}></FormControl>{"~"}
                                        <FormControl
                                            maxLength="3"
                                            value={unitPriceRangeHighest}
                                            name="unitPriceRangeHighest"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}></FormControl>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>国籍制限</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={nationalityCode}
                                            name="nationalityCode"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {nationalityDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>日本語</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={japaneaseConversationLevel}
                                            name="japaneaseConversationLevel"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {japaneaseConversationLevelDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>清算範囲</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={payOffRangeLowest}
                                            name="payOffRangeLowest"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {payOffRangeDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>{"~"}
                                        <FormControl
                                            as="select"
                                            value={payOffRangeHighest}
                                            name="payOffRangeHighest"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {payOffRangeDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>年齢制限</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={ageClassificationCode}
                                            name="ageClassificationCode"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {ageClassificationDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>作業工程</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={projectPhaseStart}
                                            name="projectPhaseStart"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {projectPhaseDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>{"~"}
                                        <FormControl
                                            as="select"
                                            value={projectPhaseEnd}
                                            name="projectPhaseEnd"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {projectPhaseDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>現場場所</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Autocomplete
                                            id="stationCode"
                                            name="stationCode"
                                            value={stationDrop.find(v => v.code === stationCode) || {}}
                                            options={stationDrop}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, values) => this.getStation(event, values)}
                                            renderInput={(params) => (
                                                <div ref={params.InputProps.ref}>
                                                    <input placeholder="例：秋葉原" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-projectInfo"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>年数要求</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="2"
                                            value={experienceYear}
                                            name="experienceYear"
                                            onChange={this.vNumberChange}
                                            disabled={actionType === "detail" ? true : false}>
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>面談回数</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={noOfInterviewCode}
                                            name="noOfInterviewCode"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {noOfInterviewDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>作業期限</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={workStartPeriod}
                                            name="workStartPeriod"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {admissionPeriodDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>業種制限</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            maxLength="2"
                                            value={typeOfIndustry}
                                            name="typeOfIndustry"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {typeOfIndustryDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={6}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>開発言語</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Autocomplete
                                            id="keyWordOfLanagurue1"
                                            name="keyWordOfLanagurue1"
                                            value={developLanguageDrop.find(v => v.code === keyWordOfLanagurue1) || {}}
                                            options={developLanguageDrop}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, values) => this.getJapanese1(event, values)}
                                            renderInput={(params) => (
                                                <div ref={params.InputProps.ref}>
                                                    <input placeholder="例：JAVA" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-projectInfo"
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Autocomplete
                                            id="keyWordOfLanagurue2"
                                            name="keyWordOfLanagurue2"
                                            value={developLanguageDrop.find(v => v.code === keyWordOfLanagurue2) || {}}
                                            options={developLanguageDrop}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, values) => this.getJapanese2(event, values)}
                                            renderInput={(params) => (
                                                <div ref={params.InputProps.ref}>
                                                    <input placeholder="例：JAVA" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-projectInfo"
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Autocomplete
                                            id="keyWordOfLanagurue3"
                                            name="keyWordOfLanagurue3"
                                            value={developLanguageDrop.find(v => v.code === keyWordOfLanagurue3) || {}}
                                            options={developLanguageDrop}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, values) => this.getJapanese3(event, values)}
                                            renderInput={(params) => (
                                                <div ref={params.InputProps.ref}>
                                                    <input placeholder="例：JAVA" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-projectInfo"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="fiveKanji">必須事項1</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="50"
                                            value={requiredItem1}
                                            name="requiredItem1"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={6}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="fiveKanji">必須事項2</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="50"
                                            value={requiredItem2}
                                            name="requiredItem2"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="fiveKanji">お客様</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Autocomplete
                                            id="customerNo"
                                            name="customerNo"
                                            value={customerDrop.find(v => v.code === customerNo) || {}}
                                            options={customerDrop}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, values) => this.getCustomer(event, values)}
                                            renderInput={(params) => (
                                                <div ref={params.InputProps.ref}>
                                                    <input placeholder="例：ベース" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-projectInfo"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="fiveKanji">担当者</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            value={personInCharge}
                                            name="personInCharge"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="fiveKanji">メール</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            value={mail}
                                            name="mail"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="fiveKanji">確率</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={successRate}
                                            name="successRate"
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}>
                                            {successRateDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <a className="projectInfoDetailTitle">案件詳細：</a>
                            </Row>
                            <Row>
                                <p className="textNum">入力した字数：{projectInfoDetail.length}/500</p>
                                <FormControl
                                    maxLength="500"
                                    cols="10"
                                    rows="8"
                                    value={projectInfoDetail}
                                    onChange={this.valueChange}
                                    name="projectInfoDetail"
                                    as="textarea">
                                </FormControl>
                            </Row>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        );
    }
}

export default projectInfo;