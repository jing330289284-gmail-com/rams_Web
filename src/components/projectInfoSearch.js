import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl, Modal, } from 'react-bootstrap';
import MyToast from './myToast';
import $ from 'jquery';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faLevelUpAlt, faSearch, faList, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as utils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import store from './redux/store';
axios.defaults.withCredentials = true;

class ProjectInfoSearch extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;//初期化
    }
    initialState = {
        //パラメータ
        actionType: "insert",
        backPage: "",//遷移元
        message: '',//toastのメッセージ
        type: '',//成功や失敗
        myToastShow: false,//toastのフラグ
        errorsMessageShow: false,///エラーのメッセージのフラグ
        errorsMessageValue: '',//エラーのメッセージ
        torokuText: '登録',//登録ボタンの文字
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//バックエンドのリンク
        selectedProjectNo:'',//選択した案件番号
        searchFlag:false,//検索フラグ
        //項目
        theSelectProjectperiodStatus: '',
        projectNo: '',
        keyWordOfLanagurue1: '',
        keyWordOfLanagurue2: '',
        keyWordOfLanagurue3: '',
        successRate: '',
        projectType: '',
        admissionPeriod: '',
        unitPriceRangeLowest: '',
        unitPriceRangeHighest: '',
        nationalityCode: '',
        japaneaseConversationLevel: '',
        experienceYear: '',
        projectPhaseStart: '',
        projectPhaseEnd: '',
        noOfInterviewCode: '',
        projectInfoList: [],
        //Drop
        projectNoDrop: store.getState().dropDown[51].slice(1),
        theSelectProjectperiodStatusDrop: store.getState().dropDown[58].slice(1),
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
            theSelectProjectperiodStatus: '',
            projectNo: '',
            keyWordOfLanagurue1: '',
            keyWordOfLanagurue2: '',
            keyWordOfLanagurue3: '',
            successRate: '',
            projectType: '',
            admissionPeriod: '',
            unitPriceRangeLowest: '',
            unitPriceRangeHighest: '',
            nationalityCode: '',
            japaneaseConversationLevel: '',
            experienceYear: '',
            projectPhaseStart: '',
            projectPhaseEnd: '',
            noOfInterviewCode: '',
        })
    }
    /**
 * 値を設定
 */
    giveValue = (projectInfoMod) => {
        this.setState({
            projectNo: projectInfoMod.projectNo,
            nationalityCode: projectInfoMod.nationalityCode,
            admissionPeriod: projectInfoMod.admissionPeriod,
            projectType: projectInfoMod.projectType,
            successRate: projectInfoMod.successRate,
            keyWordOfLanagurue1: projectInfoMod.keyWordOfLanagurue1,
            keyWordOfLanagurue2: projectInfoMod.keyWordOfLanagurue2,
            keyWordOfLanagurue3: projectInfoMod.keyWordOfLanagurue3,
            japaneaseConversationLevel: projectInfoMod.japaneaseConversationLevel,
            unitPriceRangeLowest: projectInfoMod.unitPriceRangeLowest,
            unitPriceRangeHighest: projectInfoMod.unitPriceRangeHighest,
            projectPhaseStart: projectInfoMod.projectPhaseStart,
            projectPhaseEnd: projectInfoMod.projectPhaseEnd,
            experienceYear: projectInfoMod.experienceYear,
            noOfInterviewCode: projectInfoMod.noOfInterviewCode,
        })
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
    getProjectNo = (event, values) => {
        if (values != null) {
            this.setState({
                projectNo: values.code,
            })
        } else {
            this.setState({
                projectNo: "",
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
    shuseiTo = (actionType) => {
        var path = {};
        const sendValue = {
            theSelectProjectperiodStatus:this.state.theSelectProjectperiodStatus,
            projectNo: this.state.projectNo,
            nationalityCode: this.state.nationalityCode,
            admissionPeriod: this.state.admissionPeriod,
            projectType: this.state.projectType,
            successRate: this.state.successRate,
            keyWordOfLanagurue1: this.state.keyWordOfLanagurue1,
            keyWordOfLanagurue2: this.state.keyWordOfLanagurue2,
            keyWordOfLanagurue3: this.state.keyWordOfLanagurue3,
            japaneaseConversationLevel: this.state.japaneaseConversationLevel,
            unitPriceRangeLowest: this.state.unitPriceRangeLowest,
            unitPriceRangeHighest: this.state.unitPriceRangeHighest,
            projectPhaseStart: this.state.projectPhaseStart,
            projectPhaseEnd: this.state.projectPhaseEnd,
            experienceYear: this.state.experienceYear,
            noOfInterviewCode: this.state.noOfInterviewCode,
        };
        switch (actionType) {
            case "update":
                path = {
                    pathname: '/subMenuManager/projectInfo',
                    state: {
                        actionType: 'update',
                        projectNo: this.state.selectedProjectNo,
                        backPage: "projectInfoSearch", 
                        sendValue: sendValue,
                        searchFlag: this.state.searchFlag
                    },
                }
                break;
            case "detail":
                path = {
                    pathname: '/subMenuManager/projectInfo',
                    state: {
                        actionType: 'detail',
                        projectNo: this.state.selectedProjectNo,
                        backPage: "projectInfoSearch", 
                        sendValue: sendValue,
                        searchFlag: this.state.searchFlag
                    },
                }
                break;
            case "insert":
                path = {
                    pathname: '/subMenuManager/projectInfo',
                    state: {
                        actionType: 'insert',
                        projectNo: this.state.selectedProjectNo,
                        backPage: "projectInfoSearch", 
                        sendValue: sendValue,
                        searchFlag: this.state.searchFlag
                    },
                }
                break;
            default:
        }
        this.props.history.push(path);
    }
    //行Selectファンクション
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
        } else {
        }
    }
    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
                {start}から  {to}まで , 総計{total}
            </p>
        );
    }
    //隠した削除ボタン
    createCustomDeleteButton = (onClick) => {
        return (
            <Button variant="info" id="deleteBtn" hidden onClick={onClick} >删除</Button>
        );
    }
    //隠した削除ボタンの実装
    onDeleteRow = (rows) => {
        const emp = {
            employeeNo: this.state.rowSelectEmployeeNo,
            resumeInfo1: this.state.resumeInfo1,
            resumeInfo2: this.state.resumeInfo2,
            residentCardInfo: this.state.residentCardInfo,
        };
        axios.post(this.state.serverIP + "employee/deleteEmployeeInfo", emp)
            .then(result => {
                if (result.data) {
                    this.searchEmployee();
                    //削除の後で、rowSelectEmployeeNoの値に空白をセットする
                    this.setState(
                        {
                            rowSelectEmployeeNo: ''
                        }
                    );
                    this.setState({ "myToastShow": true });
                    setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                } else {
                    this.setState({ "myToastShow": false });
                }
            })
            .catch(error=> {
                alert("删除错误，请检查程序");
            });
    }
    //　　削除前のデフォルトお知らせの削除
    customConfirm(next, dropRowKeys) {
        const dropRowKeysStr = dropRowKeys.join(',');
        next();
    }
    search=(sendValues)=>{
        var projectInfoMod = {
            theSelectProjectperiodStatus:this.state.theSelectProjectperiodStatus,
            projectNo: this.state.projectNo,
            nationalityCode: this.state.nationalityCode,
            admissionPeriod: this.state.admissionPeriod,
            projectType: this.state.projectType,
            successRate: this.state.successRate,
            keyWordOfLanagurue1: this.state.keyWordOfLanagurue1,
            keyWordOfLanagurue2: this.state.keyWordOfLanagurue2,
            keyWordOfLanagurue3: this.state.keyWordOfLanagurue3,
            japaneaseConversationLevel: this.state.japaneaseConversationLevel,
            unitPriceRangeLowest: this.state.unitPriceRangeLowest,
            unitPriceRangeHighest: this.state.unitPriceRangeHighest,
            projectPhaseStart: this.state.projectPhaseStart,
            projectPhaseEnd: this.state.projectPhaseEnd,
            experienceYear: this.state.experienceYear,
            noOfInterviewCode: this.state.noOfInterviewCode,
        };
        if(sendValues !== null && sendValues !== undefined){
            projectInfoMod = sendValues;
        }
        axios.post(this.state.serverIP + "projectInfoSearch/search", projectInfoMod)
        .then(result => {

        })
        .catch(error=> {
            alert("删除错误，请检查程序");
        });
    }
    render() {
        const {
            actionType,
            backPage,
            message,//toastのメッセージ
            type,//成功や失敗
            myToastShow,//toastのフラグ
            errorsMessageShow,///エラーのメッセージのフラグ
            errorsMessageValue,//エラーのメッセージ
            torokuText,//登録ボタンの文字
            //項目
            theSelectProjectperiodStatus,
            projectNo,
            keyWordOfLanagurue1,
            keyWordOfLanagurue2,
            keyWordOfLanagurue3,
            successRate,
            projectType,
            admissionPeriod,
            unitPriceRangeLowest,
            unitPriceRangeHighest,
            nationalityCode,
            japaneaseConversationLevel,
            experienceYear,
            projectPhaseStart,
            projectPhaseEnd,
            noOfInterviewCode,
            projectInfoList,
            //Drop 
            projectNoDrop,
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
            admissionPeriodDrop,
            typeOfIndustryDrop,
            theSelectProjectperiodStatusDrop,
        } = this.state;
        //テーブルの定義
        const options = {
            page: 1,
            sizePerPage: 5,
            pageStartIndex: 1,
            paginationSize: 3,
            prePage: '<',
            nextPage: '>',
            firstPage: '<<',
            lastPage: '>>',
            paginationShowsTotal: this.renderShowsTotal,
            hideSizePerPage: true,
            expandRowBgColor: 'rgb(165, 165, 165)',
            deleteBtn: this.createCustomDeleteButton,
            onDeleteRow: this.onDeleteRow,
            handleConfirmDeleteRow: this.customConfirm,
        };
        //テーブルの行の選択
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,
            clickToExpand: true,
            onSelect: this.handleRowSelect,
        };
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
                            <h2>案件検索</h2>
                        </Col>
                    </Row>
                    <br />
                    <Form id="projectInfoConditionForm">
                        <Form.Group>
                            <Row>
                                <Col sm={3}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>選択期間</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={theSelectProjectperiodStatus}
                                            name="theSelectProjectperiodStatus"
                                            onChange={this.valueChange}
                                        >
                                            {theSelectProjectperiodStatusDrop.map(date =>
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
                                            <InputGroup.Text>案件番号</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Autocomplete
                                            id="projectNo"
                                            name="projectNo"
                                            value={projectNoDrop.find(v => v.code === projectNo) || {}}
                                            options={projectNoDrop}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, values) => this.getProjectNo(event, values)}
                                            renderInput={(params) => (
                                                <div ref={params.InputProps.ref}>
                                                    <input placeholder="例：20200101" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-projectInfo"
                                                    />
                                                </div>
                                            )}
                                        />
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
                                        >
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
                                        >
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
                                        ></FormControl>{"~"}
                                        <FormControl
                                            maxLength="3"
                                            value={unitPriceRangeHighest}
                                            placeholder="例：123"
                                            name="unitPriceRangeHighest"
                                            onChange={(e) => this.vNumberChange(e, 'unitPriceRangeHighest')}
                                        ></FormControl>
                                    </InputGroup>
                                </Col>
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
                                        >
                                            {nationalityDrop.map(date =>
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
                                            <InputGroup.Text>日本語</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={japaneaseConversationLevel}
                                            name="japaneaseConversationLevel"
                                            onChange={this.valueChange}
                                        >
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
                                            <InputGroup.Text>年数要求</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            maxLength="2"
                                            placeholder="例：10"
                                            value={experienceYear}
                                            name="experienceYear"
                                            onChange={(e) => this.vNumberChange(e, 'experienceYear')}
                                        >
                                        </FormControl>{"年以上"}
                                    </InputGroup>
                                </Col>
                                <Col sm={2}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>作業工程</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={projectPhaseStart}
                                            name="projectPhaseStart"
                                            onChange={this.valueChange}
                                        >
                                            {projectPhaseDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>{"から"}
                                    </InputGroup>
                                </Col>
                                <Col sm={2}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>面談回数</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={noOfInterviewCode}
                                            name="noOfInterviewCode"
                                            onChange={this.valueChange}
                                        >
                                            {noOfInterviewDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col sm={2}>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="fiveKanji">確率</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            as="select"
                                            value={successRate}
                                            name="successRate"
                                            onChange={this.valueChange}
                                        >
                                            {successRateDrop.map(date =>
                                                <option key={date.code} value={date.code}>
                                                    {date.name}
                                                </option>
                                            )}
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                    <div style={{ "textAlign": "center" }}>
                        <Button size="sm" variant="info">
                            <FontAwesomeIcon icon={faSearch} /> 検索
                        </Button>{' '}
                        <Button size="sm" onClick={this.shuseiTo.bind(this, "insert")} variant="info">
                            <FontAwesomeIcon icon={faSave} /> 追加
                            </Button>{' '}
                        <Button size="sm" variant="info" type="reset" onClick={this.resetValue}>
                            <FontAwesomeIcon icon={faUndo} /> Reset
                        </Button>
                    </div>
                    <br />
                    <div>
                        <Row >
                            <Col sm={9}>
                            </Col>
                            <Col sm={3}>
                                <div style={{ "float": "right" }}>
                                    <Button size="sm" onClick={this.shuseiTo.bind(this, "detail")} name="clickButton" id="detail" variant="info"><FontAwesomeIcon icon={faList} />詳細</Button>{' '}
                                    <Button size="sm" onClick={this.shuseiTo.bind(this, "update")} name="clickButton" id="update" variant="info"><FontAwesomeIcon icon={faEdit} />修正</Button>{' '}
                                    <Button size="sm" variant="info" name="clickButton" id="delete" variant="info"><FontAwesomeIcon icon={faTrash} /> 削	除</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div >
                        <Row >
                            <Col sm={12}>
                                <BootstrapTable data={projectInfoList} pagination={true} options={options} deleteRow selectRow={selectRow} headerStyle={{ background: '#5599FF' }} striped hover condensed >
                                    <TableHeaderColumn width='95' tdStyle={{ padding: '.45em' }} dataField='rowNo' isKey>番号</TableHeaderColumn>
                                    <TableHeaderColumn width='90' tdStyle={{ padding: '.45em' }} dataField='employeeNo'>案件番号</TableHeaderColumn>
                                    <TableHeaderColumn width='120' tdStyle={{ padding: '.45em' }} dataField='employeeFristName'>確率</TableHeaderColumn>
                                    <TableHeaderColumn width='150' tdStyle={{ padding: '.45em' }} dataField='furigana'>入場時期</TableHeaderColumn>
                                    <TableHeaderColumn width='90' tdStyle={{ padding: '.45em' }} dataField='alphabetName'>日本語</TableHeaderColumn>
                                    <TableHeaderColumn width='95' tdStyle={{ padding: '.45em' }} dataField='birthday'>経験年数</TableHeaderColumn>
                                    <TableHeaderColumn width='90' tdStyle={{ padding: '.45em' }} dataField='intoCompanyYearAndMonth'>単価上限</TableHeaderColumn>
                                    <TableHeaderColumn width='125' tdStyle={{ padding: '.45em' }} dataField='phoneNo'>作業工程</TableHeaderColumn>
                                    <TableHeaderColumn width='120' tdStyle={{ padding: '.45em' }} dataField='stationName'>お客様</TableHeaderColumn>
                                    <TableHeaderColumn width='90' tdStyle={{ padding: '.45em' }} dataField='stayPeriod'>開発言語</TableHeaderColumn>
                                </BootstrapTable>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectInfoSearch;