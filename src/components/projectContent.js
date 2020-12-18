import React, { Component } from 'react';
import { Form, Button, ListGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
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
        projectType: '',
        projectTypeName:'',
        projectName: '',
        admissionPeriod: '',
        projectPeriodName:'',
        keyWordOfLanagurue1: '',
        keyWordOfLanagurue2: '',
        keyWordOfLanagurue3: '',
        projectInfoDetail: '',
        japaneaseConversationLevel: '',
        japaneaseConversationName:'',
        unitPriceRangeLowest: '',
        unitPriceRangeHighest: '',
        projectPhaseStart: '',
        projectPhaseEnd: '',
        projectPhase:'',
        projectPhaseNameStart:'',
        projectPhaseNameEnd:'',
        payOffRangeLowest: '',
        payOffRangeHighest: '',
        workStartPeriod: '',
        requiredItem1: '',
        requiredItem2: '',
        noOfInterviewName: '',
        recruitmentNumbers: '',
        siteLocation:'',
        siteLocationName:'',
        remark: '',
        nationalityName: '',
        payOffRange:'',
        unitPriceRange:'',
        keyWordOfLanagurueName1:'',
        keyWordOfLanagurueName2:'',
        keyWordOfLanagurueName3:'',
    }
    giveValue = (projectInfo) => {
        this.setState({
            projectNo: projectInfo.projectNo,
            projectType: projectInfo.projectType,
            projectTypeName:projectInfo.projectTypeName,
            projectName: projectInfo.projectName,
            siteLocation:projectInfo.siteLocation,
            siteLocationName:projectInfo.siteLocationName,
            admissionPeriod: projectInfo.admissionPeriod,
            projectPeriodName:projectInfo.projectPeriodName,
            keyWordOfLanagurue1: projectInfo.keyWordOfLanagurue1,
            keyWordOfLanagurue2: projectInfo.keyWordOfLanagurue2,
            keyWordOfLanagurue3: projectInfo.keyWordOfLanagurue3,
            projectInfoDetail: projectInfo.projectInfoDetail,
            japaneaseConversationLevel: projectInfo.japaneaseConversationLevel,
            japaneaseConversationName:projectInfo.japaneaseConversationName,
            unitPriceRangeLowest: projectInfo.unitPriceRangeLowest,
            unitPriceRangeHighest: projectInfo.unitPriceRangeHighest,
            projectPhaseStart: projectInfo.projectPhaseStart,
            projectPhaseEnd: projectInfo.projectPhaseEnd,
            projectPhaseNameStart:projectInfo.projectPhaseNameStart,
            projectPhaseNameEnd:projectInfo.projectPhaseNameEnd,
            payOffRangeLowest: projectInfo.payOffRangeLowest,
            payOffRangeHighest: projectInfo.payOffRangeHighest,
            workStartPeriod: projectInfo.workStartPeriod,
            requiredItem1: projectInfo.requiredItem1,
            requiredItem2: projectInfo.requiredItem2,
            noOfInterviewName: projectInfo.noOfInterviewName,
            recruitmentNumbers: projectInfo.recruitmentNumbers,
            remark: projectInfo.remark,
            nationalityName: projectInfo.nationalityName,
            keyWordOfLanagurueName1:projectInfo.keyWordOfLanagurueName1,
            keyWordOfLanagurueName2:projectInfo.keyWordOfLanagurueName2,
            keyWordOfLanagurueName3:projectInfo.keyWordOfLanagurueName3,
        })
        if(projectInfo.payOffRangeLowest !== undefined && projectInfo.payOffRangeLowest !== null && 
            projectInfo.payOffRangeHighest !== undefined && projectInfo.payOffRangeHighest !== null){
            var payOffRange = '';
            payOffRange = (projectInfo.payOffRangeLowest === "0" ? "固定" : projectInfo.payOffRangeLowest) 
                                + "-" + (projectInfo.payOffRangeHighest === "0" ? "固定" : projectInfo.payOffRangeHighest) 
            this.setState({
                payOffRange:payOffRange,
            })
        }
        if(projectInfo.unitPriceRangeLowest !== undefined && projectInfo.unitPriceRangeLowest !== null && projectInfo.unitPriceRangeLowest !== ''|| 
            projectInfo.unitPriceRangeHighest !== undefined && projectInfo.unitPriceRangeHighest !== null  && projectInfo.unitPriceRangeHighest !== ''){
                var unitPriceRange = '';
                unitPriceRange = projectInfo.unitPriceRangeLowest + "万円~" + projectInfo.unitPriceRangeHighest + "万円";
                this.setState({
                    unitPriceRange:unitPriceRange,
                })
        }
        if(projectInfo.projectPhaseStart !== undefined && projectInfo.projectPhaseStart !== null && projectInfo.projectPhaseStart !== ''){
                var projectPhase = '';
                projectPhase = projectInfo.projectPhaseNameStart + "~" + projectInfo.projectPhaseNameEnd;
                this.setState({
                    projectPhase:projectPhase,
                })
        }
    }
    search = (projectNo) => {
        var projectInfoModel = {
            projectNo: projectNo,
            theSelectProjectperiodStatus: '0',
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
    componentDidMount() {
        this.setState({
            projectNo: this.props.projectNo
        }, () => {
            this.search(this.state.projectNo);
        })
    }
    render() {
        const {
            projectNo,
            projectType,
            projectTypeName,
            projectName,
            admissionPeriod,
            projectPeriodName,
            siteLocationName,
            siteLocation,
            requiredItem1,
            requiredItem2,
            keyWordOfLanagurue1,
            keyWordOfLanagurue2,
            keyWordOfLanagurue3,
            keyWordOfLanagurueName1,
            keyWordOfLanagurueName2,
            keyWordOfLanagurueName3,
            projectInfoDetail,
            japaneaseConversationLevel,
            japaneaseConversationName,
            unitPriceRangeLowest,
            unitPriceRangeHighest,
            projectPhaseStart,
            projectPhaseEnd,
            projectPhase,
            projectPhaseNameStart,
            projectPhaseNameEnd,
            payOffRangeLowest,
            payOffRangeHighest,
            workStartPeriod,
            noOfInterviewName,
            recruitmentNumbers,
            nationalityName,
            remark,
            payOffRange,
            unitPriceRange,
        } = this.state;
        return (
            <div>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myToastShow} message={"更新成功！"} type={"danger"} />
                </div>
                <ListGroup>
                    <ListGroup.Item>■NO_種別：No.{projectNo}_{projectTypeName}</ListGroup.Item>
                    <ListGroup.Item>■案件名：{projectName}</ListGroup.Item>
                    <ListGroup.Item>■業務内容：<br />                              
                    <FormControl
                        maxLength="500"
                        cols="10"
                        rows="8"
                        value={projectInfoDetail}
                        as="textarea"
                        disabled
                        className="projectContentDetail">
                    </FormControl></ListGroup.Item>
                    <ListGroup.Item>■スキル要件：
                    <br/>·{keyWordOfLanagurueName1}，{keyWordOfLanagurueName2}，{keyWordOfLanagurueName3}
                    <br/>
                    ·{requiredItem1}
                    <br/>
                    ·{requiredItem2}</ListGroup.Item>
                    <ListGroup.Item>■月額単金：{unitPriceRange}</ListGroup.Item>
                    <ListGroup.Item>■清算範囲：{payOffRange}</ListGroup.Item>
                    <ListGroup.Item>■募集人数：{recruitmentNumbers}</ListGroup.Item>
                    <ListGroup.Item>■稼動時期：{admissionPeriod}~{projectPeriodName}</ListGroup.Item>
                    <ListGroup.Item>■勤務地：{siteLocationName}</ListGroup.Item>
                    <ListGroup.Item>■作業工程：{projectPhase}</ListGroup.Item>
                    <ListGroup.Item>■国籍：{nationalityName === null ? "" : nationalityName + "、" + japaneaseConversationName}</ListGroup.Item>
                    <ListGroup.Item>■面談回数：{noOfInterviewName}</ListGroup.Item>
                    <ListGroup.Item>■備考：{remark}</ListGroup.Item>
                </ListGroup>
            </div>
        );
    }
}

export default ProjectContent;