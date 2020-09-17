import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl , OverlayTrigger , Tooltip} from 'react-bootstrap';
import MyToast from './myToast';
import $ from 'jquery';
import ErrorsMessageToast from './errorsMessageToast';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave , faEdit , faUndo } from '@fortawesome/free-solid-svg-icons';
import * as utils from './utils/publicUtils.js';
import {BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
registerLocale('ja', ja);
axios.defaults.withCredentials=true;

class ExpensesInfo extends Component {
    constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
    }
    initialState = {
        employeeNo:'',//社員番号
        expensesReflectStartDate:'',//反映年月開始年月
        expensesReflectYearAndMonth:'',//反映年月
        transportationExpenses:'',//交通費
        otherAllowanceName:'',//他の手当名称
        otherAllowanceAmount:'',//他の手当
        leaderAllowanceAmount:'',//リーダー手当
        housingStatus:'',//住宅ステータス
        housingAllowance:'',//住宅手当
        message:'',//toastのメッセージ
        type:'',//成功や失敗
        myToastShow: false,//toastのフラグ
        errorsMessageShow: false,///エラーのメッセージのフラグ
        errorsMessageValue:'',//エラーのメッセージ
        actionType:'insert',//処理区分
        leaderMember:'',//leaderの要員
        housingStatusDrop:[],//住宅ステータスselect
    }
    componentDidMount(){
        this.setState({
            housingStatusDrop:utils.getdropDown("getHousingStatus"),
            employeeNo:this.props.employeeNo,
        })
        if(this.props.expensesInfoModel !== null){
            this.giveValue(this.props.expensesInfoModel);
            this.setState({
                actionType:'update',
            })
        }
    }
    /**
     * 昇給期日の変化
     */
    expensesReflectStartDateChange = date => {
        if(date !== null){
            this.setState({
                expensesReflectStartDate: date,
            });
        }else{
            this.setState({
                expensesReflectStartDate: '',
            });
        }
    };
    /**
     * 値を設定
     */
    giveValue=(expensesInfoMod)=>{
        this.setState({
            expensesReflectStartDate:utils.converToLocalTime(expensesInfoMod.expensesReflectYearAndMonth,false),
            transportationExpenses:expensesInfoMod.transportationExpenses,
            otherAllowanceName:expensesInfoMod.otherAllowanceName,
            otherAllowanceAmount:expensesInfoMod.otherAllowanceAmount,
            leaderAllowanceAmount:expensesInfoMod.leaderAllowanceAmount,
            housingStatus:expensesInfoMod.housingStatus,
            housingAllowance:expensesInfoMod.housingAllowance,
            leaderMember:expensesInfoMod.leaderMember,
        })
    }
    //onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
    }
    expensesInfoToroku(){
        var expensesInfoModel = {};
        var formArray =$("#expensesInfoForm").serializeArray();
        $.each(formArray,function(i,item){
            expensesInfoModel[item.name] = item.value;     
        });
        expensesInfoModel["actionType"] = this.state.actionType;
        expensesInfoModel["employeeNo"] = this.state.employeeNo;
        expensesInfoModel["expensesReflectYearAndMonth"] = utils.formateDate(this.state.expensesReflectStartDate,false);
        axios.post("http://127.0.0.1:8080/expensesInfo/toroku", expensesInfoModel)
        .then(result => {
            if(result.data.errorsMessage === null || result.data.errorsMessage === undefined){
                this.setState({ "myToastShow": true, "type": "success","errorsMessageShow": false,message:result.data.message});
                setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                var seikou = "success";
                this.props.expensesInfoToroku(seikou);
            }else{
                this.setState({ "errorsMessageShow": true,errorsMessageValue:result.data.errorsMessage});
            }
        })
        .catch(error=> {
            this.setState({ "errorsMessageShow": true,errorsMessageValue:"程序错误"});
        });
    }
    render() {
        const {
            transportationExpenses ,
            otherAllowanceName ,
            otherAllowanceAmount ,
            leaderAllowanceAmount ,
            housingStatus ,
            housingAllowance ,
            message ,
            type ,
            errorsMessageValue ,
            actionType ,
            leaderMember ,
            housingStatusDrop } = this.state;
        return (
            <div>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
				</div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
                <div id="HomePage">
                    <Row inline="true">
                        <Col  className="text-center">
                            <h2>諸費用</h2>
                        </Col>
                    </Row>
                    <Form id="expensesInfoForm">
                        <Row>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>交通費</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    maxLength="5" 
                                    value={transportationExpenses}
                                    name="transportationExpenses"
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    placeholder="例：12000"/>
                                </InputGroup>
                            </Col>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>リーダー手当</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    maxLength="6" 
                                    value={leaderAllowanceAmount}
                                    name="leaderAllowanceAmount"
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    placeholder="例：112000"/>
                                    <OverlayTrigger
                                        placement={'top'}
                                        overlay={
                                            <Tooltip>
                                                {leaderMember}
                                            </Tooltip>
                                        }
                                        >
                                        <Button size="sm">要員</Button>
                                        </OverlayTrigger>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>他の手当</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    maxLength="20" 
                                    value={otherAllowanceName}
                                    name="otherAllowanceName"
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    placeholder="例：12000"/>
                                </InputGroup>
                            </Col>
                            <Col sm={6}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>費用</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    maxLength="6" 
                                    value={otherAllowanceAmount}
                                    name="otherAllowanceAmount"
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    placeholder="例：112000"/>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>住宅ステータス</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    maxLength="5" 
                                    as="select"
                                    value={housingStatus}
                                    name="housingStatus"
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}>
                                        {housingStatusDrop.map(date =>
                                            <option key={date.code} value={date.code}>
                                                {date.name}
                                            </option>
                                        )}
                                    </FormControl>
                                </InputGroup>
                            </Col>
                            <Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text> 住宅手当</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    maxLength="5" 
                                    value={housingAllowance}
                                    name="housingAllowance"
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    placeholder="例：10000"/>
                                </InputGroup>
                            </Col>
                            <Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>反映年月</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <InputGroup.Append>
                                    <DatePicker
                                        selected={this.state.expensesReflectStartDate}
                                        onChange={this.expensesReflectStartDateChange}
                                        dateFormat={"yyyy MM"}
                                        autoComplete="off"
                                        locale="pt-BR"
                                        showMonthYearPicker
                                        showFullMonthYearPicker
                                        // minDate={new Date()}
                                        showDisabledMonthNavigation
                                        className="form-control form-control-sm"
                                        id="expensesInfoDatePicker"
                                        placeholderText="期日を選択してください"
                                        dateFormat={"yyyy/MM"}
                                        name="expensesReflectYearAndMonth"
                                        locale="ja"
                                        disabled={actionType === "detail" ? true : false}
                                        /><font id="mark" color="red"
                                        style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}></Col>
                            <Col sm={2} className="text-center">
                                    <Button 
                                    block 
                                    size="sm"
                                    disabled={actionType === "detail" ? true : false}
                                    variant="info"
                                    onClick={this.expensesInfoToroku.bind(this)}>
                                        <FontAwesomeIcon icon={faSave} />{actionType === "update" ? "更新" : "登録"}
                                    </Button>
                            </Col>
                            <Col sm={2} className="text-center">
                                    <Button 
                                    block 
                                    size="sm" 
                                    disabled={actionType === "detail" ? true : false}
                                    type="reset"
                                    variant="info" 
                                    value="Reset" >
                                        <FontAwesomeIcon icon={faUndo} />リセット
                                    </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}

export default ExpensesInfo;