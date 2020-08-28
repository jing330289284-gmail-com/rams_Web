import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl , OverlayTrigger , Popover , Navbar} from 'react-bootstrap';
import * as SubCostJs from './costInfoJs.js';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch , faEdit } from '@fortawesome/free-solid-svg-icons';
import {BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import axios from 'axios';
import * as utils from './utils/publicUtils.js';
registerLocale('ja', ja);

class SubCost extends Component {

    state = {
        bonusStartDate: '',//ボーナスの期日
        raiseStartDate: '',//昇給の期日
        reflectStartDate: '',//反映年月
        RelatedEmployees:'',//要員
        subCostList:[],//テーブルのデータ
        subCostInfo:'',//入力データ
        actionType:'',//処理区分
    }
    /**
     * ボーナス期日の変化
     */
    bonusChange = date => {
        if(date !== null){
            this.setState({
                bonusStartDate: date,
            });
        }else{
            this.setState({
                bonusStartDate: '',
            });
        }
    };
    /**
     * 昇給期日の変化
     */
    raiseChange = date => {
        if(date !== null){
            this.setState({
                raiseStartDate: date,
            });
        }else{
            this.setState({
                raiseStartDate: '',
            });
        }
    };
    /**
     * 昇給期日の変化
     */
    reflectStartDateChange = date => {
        if(date !== null){
            this.setState({
                reflectStartDate: date,
            });
        }else{
            this.setState({
                reflectStartDate: '',
            });
        }
    };
     /**
     * 画面の初期化
     */
    componentDidMount(){
    var actionType = this.props.actionType;//父画面のパラメータ（処理区分）
    var subCostInfo = this.props.subCostInfo;//父画面のパラメータ（画面既存諸費用情報）
    var employeeNo = this.props.employeeNo;//父画面のパラメータ（画面既存諸費用情報）
    var methodArray = ["getInsurance","getBonus","getStaffForms","getHousing"];
    //選択肢を取得
    var selectList = utils.getPublicDropDown(methodArray);
    //社会保険フラグ
    var SocialInsuranceFlag  = selectList[0];
    //ボーナスフラグ
    var bonusFlag = selectList[1];
    //社員形式
    var subCostEmployeeFormCode = selectList[2];
    //住宅ステータス
    var housingStatus = selectList[3];
    $("#shusei").attr("disabled",true);
    document.getElementById("employeeName").innerHTML  = (this.props.employeeFristName === undefined ? '' : this.props.employeeFristName) + '' + (this.props.employeeLastName === undefined ? '' : this.props.employeeLastName);
    //document.getElementById("employeeName").innerHTML  = (isNaN(this.props.employeeName) ? '' : this.props.employeeName);
    for(let i = 1;i<SocialInsuranceFlag.length ; i++){
        $("#SocialInsuranceFlag").append('<option value="'+SocialInsuranceFlag[i].code+'">'+SocialInsuranceFlag[i].name+'</option>');
    }
    for(let i = 1;i<bonusFlag.length ; i++){
        $("#bonusFlag").append('<option value="'+bonusFlag[i].code+'">'+bonusFlag[i].name+'</option>');
    }
    for(let i = 0;i<subCostEmployeeFormCode.length ; i++){
        $("#subCostEmployeeFormCode").append('<option value="'+subCostEmployeeFormCode[i].code+'">'+subCostEmployeeFormCode[i].name+'</option>');
    }
    for(let i = 0;i<housingStatus.length ; i++){
        $("#housingStatus").append('<option value="'+housingStatus[i].code+'">'+housingStatus[i].name+'</option>');
    }
    if(!$.isEmptyObject(subCostInfo)){
        $("#salary").val(subCostInfo.salary);
        $("#SocialInsuranceFlag").val(subCostInfo.SocialInsuranceFlag);
        $("#welfarePensionAmount").val(subCostInfo.welfarePensionAmount);
        $("#healthInsuranceAmount").val(subCostInfo.healthInsuranceAmount);
        $("#insuranceFeeAmount").val(subCostInfo.insuranceFeeAmount);
        $("#transportationExpenses").val(subCostInfo.transportationExpenses);
        $("#bonusFlag").val(subCostInfo.bonusFlag);
        if($("#bonusFlag").val() === "1"){
          $("#lastTimeBonusAmount").attr('readOnly' , false);
          $("#scheduleOfBonusAmount").attr('readOnly' , false);
        }
        $("#lastTimeBonusAmount").val(subCostInfo.lastTimeBonusAmount);
        $("#scheduleOfBonusAmount").val(subCostInfo.scheduleOfBonusAmount);
        $("#waitingCost").val(subCostInfo.waitingCost);
        this.setState({
            bonusStartDate:utils.converToLocalTime(subCostInfo.nextBonusMonth,false),
            raiseStartDate:utils.converToLocalTime(subCostInfo.nextRaiseMonth,false),
            reflectStartDate:utils.converToLocalTime(subCostInfo.reflectYearAndMonth,false),
        })
        $("#leaderAllowanceAmount").val(subCostInfo.leaderAllowanceAmount);
        $("#otherAllowance").val(subCostInfo.otherAllowance);
        $("#otherAllowanceAmount").val(subCostInfo.otherAllowanceAmount);
        $("#subCostRemark").val(subCostInfo.remark);
        $("#totalAmount").val(subCostInfo.totalAmount);
        $("#subCostEmployeeFormCode").val(subCostInfo.employeeFormCode);
        $("#housingStatus").val(subCostInfo.housingStatus);
        $("#housingAllowance").val(subCostInfo.housingAllowance);
    }else{
        if(actionType !== "insert"){
            var costModel = {};
            costModel["employeeNo"] = employeeNo;
            axios.post("http://127.0.0.1:8080/subCost/onload", costModel)
            .then(resultMap => {
                this.setState({
                    subCostList:resultMap.data.subCostList,
                })
            })
            .catch(function (error) {
                alert("查询错误，请检查程序");
            });
            if(actionType === "detail"){
                SubCostJs.setDisabled();
                this.setState({
                    actionType:"detail"
                })
            }
        }else if (actionType === "insert"){
            $("#subCostEmployeeFormCode").val($("#employeeFormCode").val());
        }
    }
    }
    /**
     * 要員の内容
     */
    setYouin=()=>{
        this.setState({
            RelatedEmployees:$("#RelatedEmployees").val()
        })
    }
    renderShowsTotal(start, to, total) {
        if(total === 0){
            return (<></>);
        }else{
            return (
                <p>
                ページ： { start } /{ to }, トータル件数： { total }&nbsp;&nbsp;
                </p>
            );
            }
      }
    /**
     * 登録ボタン
     */
    subCostTokuro(){
        if($("#totalAmount").val() !== '' && 
            $("#totalAmount").val() !== null && !isNaN($("#totalAmount").val()) &&
            this.state.reflectStartDate !== ''){
            var subCostInfo = {};
            var formArray =$("#costForm").serializeArray();
            $.each(formArray,function(i,item){
                subCostInfo[item.name] = item.value;     
            });
            subCostInfo["updatedReflectYearAndMonth"] = $("#updatedReflectYearAndMonth").val();
            subCostInfo["reflectYearAndMonth"] = utils.formateDate(this.state.reflectStartDate,false);
            subCostInfo["nextBonusMonth"] = utils.formateDate(this.state.bonusStartDate,false);
            subCostInfo["nextRaiseMonth"] = utils.formateDate(this.state.raiseStartDate,false);
            subCostInfo["employeeFormCode"] = $("#subCostEmployeeFormCode").val();
            subCostInfo["remark"] = $("#subCostRemark").val();
            this.props.subCostTokuro(subCostInfo);
        }else{
            if($("#totalAmount").val() === '' || 
            $("#totalAmount").val() === null || isNaN($("#totalAmount").val())){
                document.getElementById("subCostErorMsg").innerHTML = "入力してあるデータに不正があるため、チェックしてください！";
                document.getElementById("subCostErorMsg").style = "visibility:visible";    
            } else if(this.state.reflectStartDate === ''){
                document.getElementById("subCostErorMsg").innerHTML = "反映年月を入力してください！";
                document.getElementById("subCostErorMsg").style = "visibility:visible";    
            }
        }   
    }
     /**
     * 行Selectファンクション
     */
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            if(row.datePeriod === this.state.subCostList[this.state.subCostList.length - 1].datePeriod){
                this.setState({
                    subCostInfo:row,
                })
                $("#shusei").attr("disabled",false);
            }
        }
    }
    /**
     * 明細修正ボタン
     */
    meisaiShusei=()=>{
        var subCostInfo = this.state.subCostInfo;
        $("#salary").val(subCostInfo.salary);
        $("#SocialInsuranceFlag").val(subCostInfo.SocialInsuranceFlag);
        $("#welfarePensionAmount").val(subCostInfo.welfarePensionAmount);
        $("#healthInsuranceAmount").val(subCostInfo.healthInsuranceAmount);
        $("#insuranceFeeAmount").val(subCostInfo.insuranceFeeAmount);
        $("#transportationExpenses").val(subCostInfo.transportationExpenses);
        $("#bonusFlag").val(subCostInfo.bonusFlag);
        if($("#bonusFlag").val() === "1"){
          $("#lastTimeBonusAmount").attr('readOnly' , false);
          $("#scheduleOfBonusAmount").attr('readOnly' , false);
        }
        this.setState({
            bonusStartDate:utils.converToLocalTime(subCostInfo.nextBonusMonth,false),
            raiseStartDate:utils.converToLocalTime(subCostInfo.nextRaiseMonth,false),
            reflectStartDate:utils.converToLocalTime(subCostInfo.reflectYearAndMonth,false),
        })
        $("#lastTimeBonusAmount").val(subCostInfo.lastTimeBonusAmount);
        $("#scheduleOfBonusAmount").val(subCostInfo.scheduleOfBonusAmount);
        $("#waitingCost").val(subCostInfo.waitingCost);
        $("#leaderAllowanceAmount").val(subCostInfo.leaderAllowanceAmount);
        $("#otherAllowance").val(subCostInfo.otherAllowance);
        $("#otherAllowanceAmount").val(subCostInfo.otherAllowanceAmount);
        $("#subCostRemark").val(subCostInfo.remark);
        $("#totalAmount").val(subCostInfo.totalAmount);
        $("#subCostEmployeeFormCode").val(subCostInfo.employeeFormCode);
        $("#housingStatus").val(subCostInfo.housingStatus);
        $("#housingAllowance").val(subCostInfo.housingAllowance);
        $("#updatedReflectYearAndMonth").val(subCostInfo.reflectYearAndMonth);
        $("#shusei").attr("disabled",true);
    }
    render() {
        const {RelatedEmployees , subCostList , actionType} = this.state;
        //テーブルの列の選択
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,  // click to select, default is false
            clickToExpand: true,// click to expand row, default is false
            onSelect:this.handleRowSelect,
        };
        //テーブルの列の選択(詳細)
        const selectRowDetail = {
        };
        //テーブルの定義
        const options = {
        page: 1,  // which page you want to show as default
        sizePerPage: 5,  // which size per page you want to locate as default
        pageStartIndex: 1, // where to start counting the pages
        paginationSize: 3,  // the pagination bar size.
        prePage: 'Prev', // Previous page button text
        nextPage: 'Next', // Next page button text
        firstPage: 'First', // First page button text
        lastPage: 'Last', // Last page button text
        paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
        hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
        expandRowBgColor: 'rgb(165, 165, 165)',
        };
        return (
          <div >
          <div >
            <Form id="costForm">
              <Form.Group>
              {/* <Row>
                    <Col sm={3}></Col>
                    <Col sm={7}>
                        <img className="mb-4" alt="title" src={title}/>
                    </Col>
              </Row> */}
              <Row inline="true">
                <Col  className="text-center">
                 <h2>諸費用</h2>
                </Col>
              </Row>
              <Row>
                        <Col sm={3}>
                        </Col>
                        <Col sm={7}>
                        <p id="subCostErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★</p>
                        </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                    <Row>
                        <Col>
                            <Navbar>
                                    <Navbar.Collapse>
                                        <Navbar.Text>
                                            社員名：<a id="employeeName"></a>
                                        </Navbar.Text>
                                </Navbar.Collapse>
                            </Navbar>
                        </Col>
                    </Row>
                    <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社員給料</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="salary" name="salary" maxLength="6" 
                            onChange={SubCostJs.totalKeisan} placeholder="例：220000" aria-label="Small" aria-describedby="inputGroup-sizing-sm" /><font id="mark" color="red"
				                style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社会保険</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="select" id="SocialInsuranceFlag" name="SocialInsuranceFlag" onChange={SubCostJs.jidoujisan}>
                            </FormControl>
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">厚生</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="welfarePensionAmount" onChange={SubCostJs.totalKeisan} name="welfarePensionAmount" readOnly maxLength="5" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">健康</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="healthInsuranceAmount" onChange={SubCostJs.totalKeisan} name="healthInsuranceAmount" readOnly aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">総額</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="insuranceFeeAmount" onChange={SubCostJs.totalKeisan} name="insuranceFeeAmount" readOnly aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">交通費</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="transportationExpenses" onChange={SubCostJs.totalKeisan} name="transportationExpenses" maxLength="5" type="text" placeholder="例：13000" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">ボーナス：</InputGroup.Text>
                            </InputGroup.Prepend>
                                <FormControl as="select" id="bonusFlag" name="bonusFlag" onChange={SubCostJs.bonusCanInput}> 
                                </FormControl>
                            </InputGroup>
                    </Col>
                    <Col sm={5}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">前回額</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="lastTimeBonusAmount" onChange={SubCostJs.totalKeisan} readOnly name="lastTimeBonusAmount" maxLength="7" placeholder="例：400000" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">予定額</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="scheduleOfBonusAmount" onChange={SubCostJs.totalKeisan} readOnly name="scheduleOfBonusAmount" maxLength="7" placeholder="例：400000" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">非稼働費用</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="waitingCost" onChange={SubCostJs.totalKeisan} readOnly name="waitingCost" placeholder="例：400000" maxLength="6" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">次のボーナス月</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Append>
                            <InputGroup.Prepend>
                            <DatePicker
                                selected={this.state.bonusStartDate}
                                onChange={this.bonusChange}  
                                autoComplete="off"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                minDate={new Date()}
                                showDisabledMonthNavigation
                                placeholderText="期日を選択してください"
                                className="form-control form-control-sm"
                                id="customerInfoDatePicker"
                                name="nextBonusMonth"
                                dateFormat={"yyyy/MM"}
                                locale="ja"
                                disabled={actionType === "detail" ? true : false}
                                />
                                </InputGroup.Prepend>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">次回に昇給月</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Append>
                            <DatePicker
                                selected={this.state.raiseStartDate}
                                onChange={this.raiseChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="on"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                minDate={new Date()}
                                showDisabledMonthNavigation
                                placeholderText="期日を選択してください"
                                className="form-control form-control-sm"
                                id="customerInfoDatePicker"
                                dateFormat={"yyyy/MM"}
                                name="nextRaiseMonth"
                                locale="ja"
                                disabled={actionType === "detail" ? true : false}
                                />
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">リーダ手当</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="leaderAllowanceAmount" placeholder="例：400000" onChange={SubCostJs.totalKeisan} readOnly maxLength="6" name="leaderAllowanceAmount" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <OverlayTrigger
                                trigger="click"
                                key={"top"}
                                placement={"top"}
                                overlay={
                                    <Popover>
                                    <Popover.Content>
                                        <a >{RelatedEmployees}</a>
                                    </Popover.Content>
                                    </Popover>
                                }
                                >
                                <Button size="sm" id="youin" onClick={this.setYouin}>要員</Button>
                            </OverlayTrigger>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">他の手当</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="otherAllowance" placeholder="例：時間外手当" maxLength="20" name="otherAllowance" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <FormControl id="otherAllowanceAmount" placeholder="例：13000" onChange={SubCostJs.totalKeisan} maxLength="6" name="otherAllowanceAmount" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">円</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="select" id="subCostEmployeeFormCode" name="subCostEmployeeFormCode" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">住宅ステータス</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="select" id="housingStatus" name="housingStatus" onClick={SubCostJs.housingAllowanceCanInput} type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">住宅手当</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="housingAllowance" placeholder="例：23000" name="housingAllowance" readOnly type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">総額</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="totalAmount" maxLength="7" readOnly name="totalAmount" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">円</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">反映年月</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Append>
                            <DatePicker
                                selected={this.state.reflectStartDate}
                                onChange={this.reflectStartDateChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="off"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                // minDate={new Date()}
                                showDisabledMonthNavigation
                                className="form-control form-control-sm"
                                id="customerInfoDatePicker"
                                placeholderText="期日を選択してください"
                                dateFormat={"yyyy/MM"}
                                name="reflectYearAndMonth"
                                locale="ja"
                                disabled={actionType === "detail" ? true : false}
                                /><font id="mark" color="red"
				                style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="subCostRemark" placeholder="例：XXXXX" name="subCostRemark" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}></Col>
                    <Col sm={2} className="text-center">
                            <Button block size="sm" onClick = {this.subCostTokuro.bind(this)} variant="info" id="toroku" className="col-offset-1" type="button">
                            <FontAwesomeIcon icon={faSave} />登録
                            </Button>
                    </Col>
                    <Col sm={2} className="text-center">
                            <Button block size="sm" type="reset" id="reset" variant="info" value="Reset" >
                            <FontAwesomeIcon icon={faSave} />リセット
                            </Button>
                            
                    </Col>
                </Row>
            </Form.Group>
                <Row>
                    <Col sm={11}>
                    </Col>
                    <Col sm={1}>
                        <div style={{ "float": "right" }}>
                            <Button variant="info" size="sm" onClick={this.meisaiShusei} id="shusei"><FontAwesomeIcon icon={faEdit} />修正</Button>
                        </div>
                    </Col>
                </Row>
            <div>
                <BootstrapTable selectRow={actionType !== "detail" ? selectRow : selectRowDetail} pagination={ true } options={ options } data={subCostList}>
                    <TableHeaderColumn isKey dataField='datePeriod' headerAlign='center' dataAlign='center' width='190'>年月</TableHeaderColumn>
                    <TableHeaderColumn dataField='employeeFormName' headerAlign='center' dataAlign='center' width="130">社員形式</TableHeaderColumn>
                    <TableHeaderColumn dataField='salary' headerAlign='center' dataAlign='center' width="230">給料</TableHeaderColumn>
                    <TableHeaderColumn dataField='insuranceFeeAmount' headerAlign='center' dataAlign='center' width="290">社会保険</TableHeaderColumn>
                    <TableHeaderColumn dataField='remark' headerAlign='center' dataAlign='center'>備考</TableHeaderColumn>
                </BootstrapTable>
            </div>
            <input type="hidden" id="employeeNo" name="employeeNo"/>
            <input type="hidden" id="actionType" name="actionType"/>
            <input type="hidden" id="RelatedEmployees" name="RelatedEmployees"/>
            <input type="hidden" id="updatedReflectYearAndMonth" name="updatedReflectYearAndMonth"/>
          </Form>
          </div>
          </div>
        )
    }
}

export default SubCost;

