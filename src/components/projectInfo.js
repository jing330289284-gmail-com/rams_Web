import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl, Modal, } from 'react-bootstrap';
import MyToast from './myToast';
import $ from 'jquery';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import * as utils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import store from './redux/store';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
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
        actionType: this.props.location.state.actionType,
        backPage: "",//遷移元
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
        customerDrop: store.getState().dropDown[15].slice(1),
        personInChargeDrop: [],
        stationDrop: store.getState().dropDown[14].slice(1),
        successRateDrop: store.getState().dropDown[48],
        developLanguageDrop: store.getState().dropDown[8].slice(1),
        ageClassificationDrop: store.getState().dropDown[49],
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
            personInChargeDrop: [],
            experienceYear: '',
            siteLoaction: '',
        })
    }
    /**
     * 値を設定
     */
    giveValue = (projectInfoMod) => {
        this.setState({
            projectNo: projectInfoMod.projectNo,
            projectName: projectInfoMod.projectName,
            nationalityCode: projectInfoMod.nationalityCode,
            admissionPeriod:utils.converToLocalTime(projectInfoMod.admissionPeriod,false),
            projectType: projectInfoMod.projectType,
            successRate: projectInfoMod.successRate,
            customerNo: projectInfoMod.customerNo,
            personInCharge: utils.labelGetValue(projectInfoMod.personInCharge, this.state.personInChargeDrop),
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
            experienceYear: projectInfoMod.experienceYear,
            noOfInterviewCode: projectInfoMod.noOfInterviewCode,
            siteLoaction: projectInfoMod.siteLoaction,
        })
    }
    /**
     * お客様の自動提示
     */
    getCustomer = (event, values) => {
        if (values != null) {
            this.setState({
                customerNo: values.code,
            }, () => {
                var projectInfoModel = {
                    customerNo: this.state.customerNo,
                }
                axios.post(this.state.serverIP + "projectInfo/getPersonInCharge", projectInfoModel)
                    .then(result => {
                        this.setState({
                            personInChargeDrop: result.data.personInChargeDrop,
                            personInCharge: '',
                            mail: '',
                        })
                    })
                    .catch(error => {
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
                    });
            })
        } else {
            this.setState({
                customerNo: "",
                personInChargeDrop: [],
                personInCharge: '',
                mail: '',
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
                siteLoaction: values.code,
            })
        } else {
            this.setState({
                siteLoaction: "",
            })
        }
    }
    getPersonInChange = (event, values) => {
        if (values != null) {
            this.setState({
                personInCharge: values.code,
                mail: values.mail,
            })
        } else {
            this.setState({
                personInCharge: "",
                mail: "",
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
        var keyLength = 3;
        if (key === "unitPriceRangeLowest" || key === "unitPriceRangeHighest") {
            keyLength = 4;
        }
        if ((reg.test(num) && num.length < keyLength)) {
            this.setState({
                [key]: num
            })
        }
    }
    componentDidMount() {
        var projectNo = "";
        if (this.props.location.state !== null && this.props.location.state !== undefined) {
            this.setState({
                projectNo: this.props.location.state.selectedProjectNo,
                backPage: this.props.location.state.backPage,
            })
            projectNo = this.props.location.state.selectedProjectNo;
        }
        var projectInfoModel = {
            actionType: this.state.actionType,
            projectNo: projectNo,
        }
        axios.post(this.state.serverIP + "projectInfo/init", projectInfoModel)
            .then(result => {
                if (this.state.actionType === "insert") {
                    this.setState({
                        projectNo: result.data.projectNo,
                        torokuText: "登録",
                    })
                } else {
                    var customerNo = result.data.resultList[0].customerNo;
                    var projectInfoMod = result.data.resultList[0];
                    var projectInfoModel = {
                        customerNo: customerNo,
                    }
                    axios.post(this.state.serverIP + "projectInfo/getPersonInCharge", projectInfoModel)
                        .then(result => {
                            this.setState({
                                personInChargeDrop: result.data.personInChargeDrop,
                            }, () => {
                                this.giveValue(projectInfoMod);
                            })
                        })
                        .catch(error => {
                            this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
                        });
                    if (this.state.actionType === "update") {
                        this.setState({
                            torokuText: "更新",
                        })
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
        $("#toroku").attr("disabled", true);
        var projectInfoModel = {};
        var formArray = $("#projectInfoForm").serializeArray();
        $.each(formArray, function (i, item) {
            projectInfoModel[item.name] = item.value;
        });
        projectInfoModel["admissionPeriod"] = utils.formateDate(this.state.admissionPeriod,false);
        projectInfoModel["personInCharge"] = utils.valueGetLabel(this.state.personInCharge, this.state.personInChargeDrop);
        projectInfoModel["siteLoaction"] = this.state.siteLoaction;
        projectInfoModel["keyWordOfLanagurue1"] = this.state.keyWordOfLanagurue1;
        projectInfoModel["keyWordOfLanagurue2"] = this.state.keyWordOfLanagurue2;
        projectInfoModel["keyWordOfLanagurue3"] = this.state.keyWordOfLanagurue3;
        projectInfoModel["customerNo"] = this.state.customerNo;
        projectInfoModel["actionType"] = this.state.actionType;
        axios.post(this.state.serverIP + "projectInfo/toroku", projectInfoModel)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: result.data.message });
                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                    if (this.state.actionType === "insert") {
                        window.location.reload();
                    }
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                    $("#toroku").attr("disabled", false);
                }
            })
            .catch(error => {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
                $("#toroku").attr("disabled", false);
            });
    }
    admissionPeriodChange= date =>{
        if (date !== null) {
            this.setState({
                admissionPeriod: date,
            });
        } else {
            this.setState({
                admissionPeriod: '',
            });
        }
    }
    /**
 * 戻るボタン
 */
    back = () => {
        var path = {};
        path = {
            pathname: this.state.backPage,
            state: { searchFlag: this.state.searchFlag, sendValue: this.state.sendValue, selectedProjectNo: this.state.projectNo },
        }
        this.props.history.push(path);
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
            siteLoaction,
            noOfInterviewCode,
            experienceYear,
            actionType,
            backPage,
            message,//toastのメッセージ
            type,//成功や失敗
            myToastShow,//toastのフラグ
            errorsMessageShow,///エラーのメッセージのフラグ
            errorsMessageValue,//エラーのメッセージ
            torokuText,//登録ボタンの文字
            //Drop 
            projectTypeDrop,
            payOffRangeDrop,
            nationalityDrop,
            japaneaseConversationLevelDrop,
            projectPhaseDrop,
            noOfInterviewDrop,
            customerDrop,
            personInChargeDrop,
            stationDrop,
            successRateDrop,
            developLanguageDrop,
            ageClassificationDrop,
            typeOfIndustryDrop,
        } = this.state;
        return (
            <div>
                <div style={{ "display": myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={myToastShow} message={message} type={type} />
                </div>
                <div style={{ "display": errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={errorsMessageShow} message={errorsMessageValue} type={"danger"} />
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
                                        </FormControl>
                                        <font
                                            id="mark" color="red"
                                            style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
                                    </InputGroup>
                                </Col>
                                <Col sm={1}>
                                </Col>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>入場時期</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <DatePicker
                                            selected={admissionPeriod}
                                            onChange={this.admissionPeriodChange}
                                            autoComplete="off"
                                            locale="pt-BR"
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            minDate={new Date()}
                                            showDisabledMonthNavigation
                                            className="form-control form-control-sm"
                                            id="wagesInfoDatePicker"
                                            dateFormat={"yyyy/MM"}
                                            name="admissionPeriod"
                                            locale="ja"
                                            disabled={actionType === "detail" ? true : false}
                                        />
                                        <font
                                            id="mark" color="red"
                                            style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
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
                                            placeholder="例：123"
                                            name="unitPriceRangeLowest"
                                            onChange={(e) => this.vNumberChange(e, 'unitPriceRangeLowest')}
                                            disabled={actionType === "detail" ? true : false}></FormControl>{"~"}
                                        <FormControl
                                            maxLength="3"
                                            value={unitPriceRangeHighest}
                                            placeholder="例：123"
                                            name="unitPriceRangeHighest"
                                            onChange={(e) => this.vNumberChange(e, 'unitPriceRangeHighest')}
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
                                            id="siteLoaction"
                                            name="siteLoaction"
                                            value={stationDrop.find(v => v.code === siteLoaction) || {}}
                                            options={stationDrop}
                                            getOptionLabel={(option) => option.name}
                                            disabled={actionType === "detail" ? true : false}
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
                                            placeholder="例：10"
                                            value={experienceYear}
                                            name="experienceYear"
                                            onChange={(e) => this.vNumberChange(e, 'experienceYear')}
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
                                            disabled={actionType === "detail" ? true : false}
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
                                            disabled={actionType === "detail" ? true : false}
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
                                            disabled={actionType === "detail" ? true : false}
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
                                            placeholder="例：リーダー経験がある、springboot経験がある"
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
                                            placeholder="例：リーダー経験がある、springboot経験がある"
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
                                            disabled={actionType === "detail" ? true : false}
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
                                        <Autocomplete
                                            id="personInCharge"
                                            name="personInCharge"
                                            value={personInChargeDrop.find(v => v.code === personInCharge) || {}}
                                            options={personInChargeDrop}
                                            getOptionLabel={(option) => option.name}
                                            disabled={actionType === "detail" ? true : false}
                                            onChange={(event, values) => this.getPersonInChange(event, values)}
                                            renderInput={(params) => (
                                                <div ref={params.InputProps.ref}>
                                                    <input placeholder="例：田中" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-projectInfo"
                                                    />
                                                </div>
                                            )}
                                        />
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
                                            placeholder="例：XXXXXXXXXXX@gmail.com"
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
                                    disabled={actionType === "detail" ? true : false}
                                    onChange={this.valueChange}
                                    name="projectInfoDetail"
                                    as="textarea">
                                </FormControl>
                            </Row>
                            <br />
                            <div style={{ "textAlign": "center" }}>
                                <Button
                                    size="sm"
                                    hidden={actionType === "detail" ? true : false}
                                    onClick={this.toroku}
                                    id="toroku"
                                    variant="info"
                                >
                                    <FontAwesomeIcon icon={faSave} />{torokuText}
                                </Button>{" "}
                                <Button
                                    size="sm"
                                    hidden={actionType === "detail" ? true : false}
                                    onClick={this.resetValue}
                                    variant="info"
                                    value="Reset" >
                                    <FontAwesomeIcon icon={faUndo} />リセット
                            </Button>{" "}
                                <Button
                                    size="sm"
                                    hidden={backPage === "" ? true : false}
                                    variant="info"
                                    onClick={this.back}
                                >
                                    <FontAwesomeIcon icon={faLevelUpAlt} />戻る
                            </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        );
    }
}

export default projectInfo;