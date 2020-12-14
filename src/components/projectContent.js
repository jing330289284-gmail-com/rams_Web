import React, { Component } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { faSave, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from 'axios';
import Clipboard from 'clipboard';
import TextField from '@material-ui/core/TextField';
import MyToast from './myToast';
import store from './redux/store';
axios.defaults.withCredentials = true;

class ProjectContent extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState;
    }
    initState = {
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
        projectNo: '',
        projectName: '',
        admissionPeriod: '',
        keyWordOfLanagurue1: '',
        keyWordOfLanagurue2: '',
        keyWordOfLanagurue3: '',
        projectInfoDetail: '',
        japaneaseConversationLevel: '',
        unitPriceRangeLowest: '',
        unitPriceRangeHighest: '',
        projectPhaseStart: '',
        projectPhaseEnd: '',
        payOffRangeLowest: '',
        payOffRangeHighest: '',
        workStartPeriod: '',
        requiredItem1: '',
        requiredItem2: '',
        noOfInterviewName: '',
        recruitmentNumbers: '',
        remark: '',
        nationalityName: '',
    }
    giveValue =(projectInfo)=> {
        this.setState({
            projectNo: projectInfo.projectNo ,
            projectName: projectInfo.projectName ,
            admissionPeriod: projectInfo.admissionPeriod ,
            keyWordOfLanagurue1: projectInfo.keyWordOfLanagurue1 ,
            keyWordOfLanagurue2: projectInfo.keyWordOfLanagurue2 ,
            keyWordOfLanagurue3: projectInfo.keyWordOfLanagurue3 ,
            projectInfoDetail: projectInfo.projectInfoDetail ,
            japaneaseConversationLevel: projectInfo.japaneaseConversationLevel ,
            unitPriceRangeLowest: projectInfo.unitPriceRangeLowest ,
            unitPriceRangeHighest: projectInfo.unitPriceRangeHighest ,
            projectPhaseStart: projectInfo.projectPhaseStart ,
            projectPhaseEnd: projectInfo.projectPhaseEnd ,
            payOffRangeLowest: projectInfo.payOffRangeLowest ,
            payOffRangeHighest: projectInfo.payOffRangeHighest ,
            workStartPeriod: projectInfo.workStartPeriod ,
            requiredItem1: projectInfo.requiredItem1 ,
            requiredItem2: projectInfo.requiredItem2 ,
            noOfInterviewName: projectInfo.noOfInterviewName ,
            recruitmentNumbers: projectInfo.recruitmentNumbers ,
            remark: projectInfo.remark ,
            nationalityName: projectInfo.nationalityName ,
        })
    }
    search =(projectNo)=>{
        var projectInfoModel = {
            projectNo:projectNo,
            theSelectProjectperiodStatus:'0',
        }
        axios.post(this.state.serverIP + "projectInfoSearch/search", projectInfoModel)
            .then(result => {
                if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                    this.giveValue(result.data.projectInfoList[0]);
                } else {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                }
            })
            .catch(error => {
                alert("检索错误，请检查程序");
            });
    }
    componentDidMount(){
        this.setState({
            projectNo:this.props.projectNo
        },()=>{
            this.search(this.state.projectNo);
        })
    }
    render() {
        const {
            projectNo,
            projectName,
            admissionPeriod,
            requiredItem1,
            requiredItem2,
            keyWordOfLanagurue1,
            keyWordOfLanagurue2,
            keyWordOfLanagurue3,
            projectInfoDetail,
            japaneaseConversationLevel,
            unitPriceRangeLowest,
            unitPriceRangeHighest,
            projectPhaseStart,
            projectPhaseEnd,
            payOffRangeLowest,
            payOffRangeHighest,
            workStartPeriod,
            siteLoaction,
            noOfInterviewName,
            recruitmentNumbers,
            nationalityName,
            remark,
        } = this.state;
        return (
            <div>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myToastShow} message={"更新成功！"} type={"danger"} />
                </div>
                <ListGroup>
                    <ListGroup.Item>■NO_種別：{projectNo}</ListGroup.Item>
                    <ListGroup.Item>■案件名：{projectName}</ListGroup.Item>
                    <ListGroup.Item>■業務内容：{projectInfoDetail}</ListGroup.Item>
                    <ListGroup.Item>■スキル要件：{keyWordOfLanagurue1}{keyWordOfLanagurue2}{keyWordOfLanagurue3}{requiredItem1}{requiredItem2}</ListGroup.Item>
                    <ListGroup.Item>■月額単金：{unitPriceRangeLowest}~{unitPriceRangeHighest}</ListGroup.Item>
                    <ListGroup.Item>■清算範囲：{payOffRangeLowest}~{payOffRangeHighest}</ListGroup.Item>
                    <ListGroup.Item>■募集人数：{recruitmentNumbers}</ListGroup.Item>
                    <ListGroup.Item>■稼動時期：{admissionPeriod}~{workStartPeriod}</ListGroup.Item>
                    <ListGroup.Item>■勤務地：{siteLoaction}</ListGroup.Item>
                    <ListGroup.Item>■作業工程：{projectPhaseStart}~{projectPhaseEnd}</ListGroup.Item>
                    <ListGroup.Item>■国籍：{nationalityName}、{japaneaseConversationLevel}</ListGroup.Item>
                    <ListGroup.Item>■面談回数：{noOfInterviewName}</ListGroup.Item>
                    <ListGroup.Item>■備考：{remark}</ListGroup.Item>
                </ListGroup>
            </div>
        );
    }
}

export default ProjectContent;