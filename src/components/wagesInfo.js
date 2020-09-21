import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl , Modal , Table , Navbar} from 'react-bootstrap';
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
import {BootstrapTable, TableHeaderColumn , BSTable } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import ExpensesInfo from "./expensesInfo.js"
import Autocomplete from '@material-ui/lab/Autocomplete';
registerLocale('ja', ja);
axios.defaults.withCredentials=true;

class WagesInfo extends Component {

    constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
    }
    
    initialState = { 
        employeeNo:'',//社員番号
        reflectYearAndMonth:'',//反映年月
        socialInsuranceFlag:'',//社会保険フラグ
        salary:'',//給料
        waitingCost:'',//非稼動費用
        welfarePensionAmount:'',//厚生年金
        healthInsuranceAmount:'',//健康保険
        insuranceFeeAmount:'',//保険総額
        lastTimeBonusAmount:'',//ボーナス前回額
        scheduleOfBonusAmount:'',//ボーナス予定額
        bonusFlag:'',//ボーナスフラグ
        nextBonusMonth:'',//次ボーナス月
        nextRaiseMonth:'',//次回昇給月
        totalAmount:'',//総額
        employeeFormCode:'',//社員形式
        remark:'',//備考
        bonusStartDate: '',//ボーナスの期日
        raiseStartDate: '',//昇給の期日
        reflectStartDate: '',//反映年月
        costInfoShow:false,//諸費用画面フラグ
        message:'',//toastのメッセージ
        type:'',//成功や失敗
        myToastShow: false,//toastのフラグ
        errorsMessageShow: false,///エラーのメッセージのフラグ
        errorsMessageValue:'',//エラーのメッセージ
        actionType:'insert',//処理区分
        socialInsuranceFlagDrop:[],//社会保険フラグselect
        bonusFlagDrop:[],//ボーナスフラグselect
        EmployeeFormCodeDrop:[],//社員性質select
        employeeNameDrop:[],//社員名select
        wagesInfoList:[],//給料明細テーブル
        waitingFlag:false,//稼働フラグ
        selectedWagesInfo:{},//選択された行
        expensesInfoModel:null,//諸費用データ
        torokuText:'登録',//登録ボタンの文字
     }
    //onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
    }
    //onchange(金額)
	valueChangeMoney = event => {
		this.setState({
			[event.target.name]: event.target.value,
        },()=>{
            this.totalKeisan();
          }
        )
    }
    //onchange(金額)
	valueChangeInsurance = event => {
		this.setState({
			[event.target.name]: event.target.value,
        },()=>{
            this.hokenKeisan();
          }
        )
	}
     componentDidMount(){
        this.getDropDowns();
        $("#shusei").attr("disabled",true);
        $("#expensesInfoBtn").attr("disabled",true);
     }
     /**
      * select取得
      */
     getDropDowns = () => {
		var methodArray = ["getInsurance", "getBonus", "getStaffForms","getEmployeeName"]
		var data = utils.getPublicDropDown(methodArray);
		this.setState(
			{
				socialInsuranceFlagDrop: data[0].slice(1),
				bonusFlagDrop: data[1].slice(1), 
                EmployeeFormCodeDrop: data[2], 
                employeeNameDrop:data[3].slice(1),
			}
		);
    };
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
    * 総計の計算
    */
    totalKeisan=()=>{
        var sum = 0;
        if(this.state.waitingCost !== '' && this.state.waitingCost !== null){
             sum += parseInt(this.state.waitingCost);
        }else if(this.state.salary !== '' && this.state.salary !== null){
             sum += parseInt(this.state.salary);
        }
        sum = sum + parseInt((this.state.insuranceFeeAmount === '' ? 0 : this.state.insuranceFeeAmount)) 
                + Math.floor((this.state.scheduleOfBonusAmount === '' ? 0 : this.state.scheduleOfBonusAmount)/12);
        this.setState({
         totalAmount:(isNaN(sum) ? '' : (sum === 0 ? '' : sum)),
        })
    }
    /**
     * 値を設定
     */
    giveValue=(wagesInfoMod)=>{
        this.setState({ 
            socialInsuranceFlag:wagesInfoMod.socialInsuranceFlag , 
            salary:wagesInfoMod.salary , 
            waitingCost:wagesInfoMod.waitingCost , 
            welfarePensionAmount:wagesInfoMod.welfarePensionAmount , 
            healthInsuranceAmount:wagesInfoMod.healthInsuranceAmount , 
            insuranceFeeAmount:wagesInfoMod.insuranceFeeAmount , 
            lastTimeBonusAmount:wagesInfoMod.lastTimeBonusAmount , 
            scheduleOfBonusAmount:wagesInfoMod.scheduleOfBonusAmount , 
            bonusFlag:wagesInfoMod.bonusFlag , 
            totalAmount:wagesInfoMod.totalAmount , 
            employeeFormCode:wagesInfoMod.employeeFormCode , 
            remark:wagesInfoMod.remark , 
            bonusStartDate:utils.converToLocalTime(wagesInfoMod.nextBonusMonth,false),
            raiseStartDate:utils.converToLocalTime(wagesInfoMod.nextRaiseMonth,false),
            reflectStartDate:utils.converToLocalTime(wagesInfoMod.reflectYearAndMonth,false),
        })
    }
    /**
     * 値をリセット
     */
    resetValue=()=>{
        this.setState({ 
            socialInsuranceFlag:'', 
            salary:'', 
            waitingCost:'', 
            welfarePensionAmount:'', 
            healthInsuranceAmount:'' , 
            insuranceFeeAmount:'', 
            lastTimeBonusAmount:'', 
            scheduleOfBonusAmount:'', 
            bonusFlag:'', 
            totalAmount:'', 
            employeeFormCode:'', 
            remark:'', 
            bonusStartDate:'',
            raiseStartDate:'',
            reflectStartDate:'',
        })
    }
    getWagesInfo= (event) =>{
        this.setState({
			[event.target.name]: event.target.value,
        },()=>{
            var wagesInfoMod = {
                "employeeNo":utils.labelGetValue($("#employeeName").val(), this.state.employeeNameDrop),
            }
            this.setState({
                employeeNo:wagesInfoMod.employeeNo,
            })
            axios.post("http://127.0.0.1:8080/wagesInfo/getWagesInfo",wagesInfoMod)
            .then(result=> {
                if(result.data.errorsMessage === null || result.data.errorsMessage === undefined){
                    $("#expensesInfoBtn").attr("disabled",false);
                    this.setState({
                        wagesInfoList:result.data.wagesInfoList,
                        lastTimeBonusAmount:result.data.wagesInfoList[result.data.wagesInfoList.length-1].scheduleOfBonusAmount,
                        "errorsMessageShow": false,
                    })
                }else{
                    $("#expensesInfoBtn").attr("disabled",true);
                    this.setState({
                        wagesInfoList:[],
                    })
                    this.setState({ "errorsMessageShow": true,errorsMessageValue:result.data.errorsMessage});
                }
            })
        }
        )
    }

    /**
     * 行Selectファンクション
     */
    handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            if(row.reflectYearAndMonth === this.state.wagesInfoList[this.state.wagesInfoList.length - 1].reflectYearAndMonth){
                this.setState({
                    selectedWagesInfo:row,
                })
                $("#shusei").attr("disabled",false);
            }else{
                this.resetValue();
                $("#shusei").attr("disabled",true);
            }
        }else{
            this.resetValue();
            this.setState({
                actionType:'insert',
                torokuText:'登録',
            })
            $("#shusei").attr("disabled",true);
        }
    }
    /**
     * 修正ボタン
     */
    shuseiBtn=()=>{
        var selectedWagesInfo = this.state.selectedWagesInfo;
        this.setState({
            actionType:"update",
            torokuText:'更新',
        })
        this.giveValue(selectedWagesInfo);
    }
     /**
      * https://asia-northeast1-tsunagi-all.cloudfunctions.net/
     * 社会保険計算
     */
    async hokenKeisan(){
        var salary = this.state.salary;
        if(this.state.socialInsuranceFlag === "1"){
            if(salary === ''){
                this.setState({ errorsMessageShow: true,errorsMessageValue:"給料を入力してください",socialInsuranceFlag:"0",});   
                setTimeout(() => this.setState({ errorsMessageValue: false }), 3000);
            }else if(salary === '0'){
                this.setState({ errorsMessageShow: true,errorsMessageValue:"給料を0以上に入力してください",socialInsuranceFlag:"0",});  
                setTimeout(() => this.setState({ errorsMessageValue: false }), 3000); 
            }else{
                await axios.post("/api/getSocialInsurance202003?salary="+salary+"&kaigo=0")
                .then(result=> {
                    this.setState({
                        welfarePensionAmount:result.data.pension.payment,
                        healthInsuranceAmount:result.data.insurance.payment,
                        insuranceFeeAmount:result.data.insurance.payment + result.data.pension.payment,
                    })
                })
                .catch(error=> {
                    this.setState({ errorsMessageShow: true,errorsMessageValue:"程序错误",socialInsuranceFlag:"0",});
                    setTimeout(() => this.setState({ errorsMessageValue: false }), 3000);
                });
            }
        this.totalKeisan();
        }else{
            this.setState({
                welfarePensionAmount:'',
                healthInsuranceAmount:'',
                insuranceFeeAmount:'',
            },()=>{
                this.totalKeisan();
              }
            )
        }
    }
    getExpensesInfo=(expensesInfoToroku)=>{
        if(expensesInfoToroku === "success"){
            this.setState({
                costInfoShow:false,
            },()=>{
                var wagesInfoMod = {
                    "employeeNo":utils.labelGetValue($("#employeeName").val(), this.state.employeeNameDrop),
                }
                axios.post("http://127.0.0.1:8080/wagesInfo/getWagesInfo",wagesInfoMod)
                .then(result=> {
                    if(result.data.errorsMessage === null || result.data.errorsMessage === undefined){
                        $("#expensesInfoBtn").attr("disabled",false);
                        this.setState({
                            wagesInfoList:result.data.wagesInfoList,
                            lastTimeBonusAmount:result.data.wagesInfoList[result.data.wagesInfoList.length-1].scheduleOfBonusAmount,
                        })
                    }else{
                        $("#expensesInfoBtn").attr("disabled",true);
                        this.setState({
                            wagesInfoList:[],
                        })
                        this.setState({ "errorsMessageShow": true,errorsMessageValue:result.data.errorsMessage});
                    }
                })
            }
            )
        }
        console.log(expensesInfoToroku);
    }
    /**
     * 登録ボタン
     */
    toroku=()=>{
        var wagesInfoModel = {};
        var formArray =$("#wagesInfoForm").serializeArray();
        $.each(formArray,function(i,item){
            wagesInfoModel[item.name] = item.value;     
        });
        wagesInfoModel["employeeNo"] = utils.labelGetValue($("#employeeName").val(), this.state.employeeNameDrop);
        wagesInfoModel["nextRaiseMonth"] = utils.formateDate(this.state.raiseStartDate,false);
        wagesInfoModel["nextBonusMonth"] = utils.formateDate(this.state.bonusStartDate,false);
        wagesInfoModel["reflectYearAndMonth"] = utils.formateDate(this.state.reflectStartDate,false);
        wagesInfoModel["actionType"] = this.state.actionType;
        wagesInfoModel["expensesInfoModel"] = this.state.expensesInfoModel;
        axios.post("http://127.0.0.1:8080/wagesInfo/toroku", wagesInfoModel)
        .then(result => {
            if(result.data.errorsMessage === null || result.data.errorsMessage === undefined){
                this.setState({ "myToastShow": true, "type": "success","errorsMessageShow": false,message:result.data.message});
                setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                window.location.reload();
            }else{
                this.setState({ "errorsMessageShow": true,errorsMessageValue:result.data.errorsMessage});
            }
        })
        .catch(error=> {
            this.setState({ "errorsMessageShow": true,errorsMessageValue:"程序错误"});
        });
    }
    /**
     * 小さい画面の閉め 
     */
    handleHideModal=(Kbn)=>{
        this.setState({costInfoShow:false})
    }
    /**
    *  小さい画面の開き
    */
    handleShowModal=(Kbn)=>{
        this.setState({costInfoShow:true})
    }
    /**
     * select
     * @param {*} param0 
     * @param {*} fieldName 
     */
    handleTag = ({ target }) => {
        const { value , id} = target;
        if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
            if (this.state.employeeNameDrop.find((v) => (v.name === value)) !== undefined) {
                this.setState({
                    employeeName: this.state.employeeNameDrop.find((v) => (v.name === value)).code,
                })
            }
        }
	};
    /**
     * テーブルの下もの
     * @param {} start 
     * @param {*} to 
     * @param {*} total 
     */
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
     * 諸費用テーブルの開き
     */
    isExpandableRow(row) {
        if (row.expensesInfoModels!== null) return true;
        else return false;
    }
    /**
     * 諸費用テーブルの開きアイコン
     */
     expandColumnComponent({ isExpandableRow, isExpanded }) {
        let content = '';

        if (isExpandableRow) {
        content = (isExpanded ? '(-)' : '(+)' );
        } else {
        content = ' ';
        }
        return (
        <div> { content } </div>
        );
    }
    /**
     * 諸費用テーブル
     */
    expandComponent(row){
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,  // click to select, default is false
            clickToExpand: true,// click to expand row, default is false
        };
        return (
            <div>
                 <BootstrapTable 
                 selectRow={selectRow} 
                 data={row.expensesInfoModels}
                 striped>
                        <TableHeaderColumn isKey={true} dataField='expensesPeriod' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center' width="230">諸費用期間</TableHeaderColumn>
                        <TableHeaderColumn dataField='transportationExpenses' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>交通代</TableHeaderColumn>
                        <TableHeaderColumn dataField='leaderAllowanceAmount' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>リーダー</TableHeaderColumn>
                        <TableHeaderColumn dataField='housingAllowance' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>住宅</TableHeaderColumn>
                        <TableHeaderColumn dataField='otherAllowanceAmount' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>他</TableHeaderColumn>
                    </BootstrapTable>
            </div>
        );
        }
    render() {
        const {        
            employeeNo ,
            employeeName , 
            socialInsuranceFlag , 
            salary , 
            waitingCost , 
            welfarePensionAmount , 
            healthInsuranceAmount , 
            insuranceFeeAmount , 
            lastTimeBonusAmount , 
            scheduleOfBonusAmount , 
            bonusFlag , 
            totalAmount , 
            employeeFormCode , 
            remark , 
            raiseStartDate , 
            costInfoShow ,
            message , 
            type ,
            errorsMessageValue ,
            actionType ,
            socialInsuranceFlagDrop ,
            bonusFlagDrop ,
            EmployeeFormCodeDrop ,
            wagesInfoList ,
            waitingFlag ,
            employeeNameDrop ,
            torokuText } = this.state;
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
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
            expandRowBgColor: 'rgb(165, 165, 165)',
            paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
            hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
            expandRowBgColor: 'rgb(165, 165, 165)',
            };
        return (
            <div>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
				</div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
                <div id="Home">
                    <Modal 
                    centered 
                    backdrop="static" 
                    onHide={this.handleHideModal} 
                    show={costInfoShow}
                    dialogClassName="modal-expensesInfo">
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body >
                                    <ExpensesInfo employeeNo={employeeNo} expensesInfoModel={this.state.expensesInfoModel} expensesInfoToroku={this.getExpensesInfo}/>
                        </Modal.Body>
                    </Modal>
                    <Row inline="true">
                        <Col  className="text-center">
                            <h2>給料情報</h2>
                        </Col>
                    </Row>
                    <Form id="wagesInfoForm">
                        <Form.Group>
                        <Row>
                            <Col sm={3}>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>社員名</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Autocomplete
                                    id="employeeName"
									name="employeeName"
									value={employeeName}
									options={this.state.employeeNameDrop}
                                    getOptionLabel={(option) => option.name}
                                    onChange = {this.getWagesInfo}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input placeholder="  例：田中" type="text" {...params.inputProps}
												style={{ width: 150, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
										</div>
                                    )}
                                />
                                <InputGroup.Prepend>
                                    <InputGroup.Text>円</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <font id="mark" color="red"
                                        style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                                </InputGroup>
                            </Col>
                            <Col sm={8}></Col>
                            <Col sm={1}>
                                <Button 
                                block 
                                size="sm"
                                id="expensesInfoBtn"
                                disabled={actionType === "detail" ? true : false}
                                onClick={this.handleShowModal}>
                                    諸費用</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>給料</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    maxLength="6" 
                                    value={salary}
                                    name="salary"
                                    onChange={this.valueChangeMoney}
                                    disabled={actionType === "detail" ? true : false}
                                    placeholder="例：220000"/>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>円</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <font id="mark" color="red"
                                        style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                                </InputGroup>
                            </Col>
                            <Col sm={2}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>非稼動費用</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    maxLength="6"
                                    disabled={actionType === "detail" ? true : !waitingFlag}
                                    name="waitingCost"
                                    value={waitingCost}
                                    onChange={this.valueChangeMoney}
                                    placeholder="例：220000"/>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>円</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <font hidden id="mark" color="red"
                                        style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                                </InputGroup>
                            </Col>
                            <Col sm={2}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>社会保険</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    as="select"
                                    disabled={actionType === "detail" ? true : false}
                                    name="socialInsuranceFlag"
                                    onChange={this.valueChangeInsurance}
                                    value={socialInsuranceFlag}>
                                        {socialInsuranceFlagDrop.map(date =>
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
                                    <InputGroup.Text>厚生</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    readOnly 
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    name="welfarePensionAmount"
                                    value={welfarePensionAmount}/>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>健康</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    readOnly 
                                    disabled={actionType === "detail" ? true : false}
                                    name="healthInsuranceAmount"
                                    onChange={this.valueChange}
                                    value={healthInsuranceAmount}/>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>総額</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    readOnly
                                    onChange={this.valueChangeMoney}
                                    disabled={actionType === "detail" ? true : false}
                                    name="insuranceFeeAmount"
                                    value={insuranceFeeAmount}/>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>次回に昇給月</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <InputGroup.Append>
                                    <DatePicker
                                        selected={raiseStartDate}
                                        onChange={this.raiseChange}
                                        dateFormat={"yyyy MM"}
                                        autoComplete="off"
                                        locale="pt-BR"
                                        showMonthYearPicker
                                        showFullMonthYearPicker
                                        minDate={new Date()}
                                        showDisabledMonthNavigation
                                        placeholderText="期日を選択してください"
                                        className="form-control form-control-sm"
                                        id="wagesInfoDatePicker"
                                        dateFormat={"yyyy/MM"}
                                        name="nextRaiseMonth"
                                        locale="ja"
                                        disabled={actionType === "detail" ? true : false}
                                        />
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                            <Col sm={2}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>ボーナス：</InputGroup.Text>
                                    </InputGroup.Prepend>
                                        <FormControl 
                                        as="select"
                                        disabled={actionType === "detail" ? true : false}
                                        name="bonusFlag"
                                        onChange={this.valueChange}
                                        value={bonusFlag}> 
                                            {bonusFlagDrop.map(date =>
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
                                    <InputGroup.Text>前回額</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    name="lastTimeBonusAmount"
                                    maxLength="7"
                                    readOnly
                                    placeholder="例：400000"
                                    value={lastTimeBonusAmount}/>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>予定額</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    readOnly = {bonusFlag === "1" ? false : true}
                                    onChange={this.valueChangeMoney}
                                    disabled={actionType === "detail" ? true : false}
                                    name="scheduleOfBonusAmount"
                                    maxLength="7" 
                                    placeholder="例：400000"
                                    value={scheduleOfBonusAmount}/>
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
                                        id="wagesInfoDatePicker"
                                        name="nextBonusMonth"
                                        dateFormat={"yyyy/MM"}
                                        locale="ja"
                                        disabled={actionType === "detail" ? true : false}
                                        />
                                        </InputGroup.Prepend>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>総額</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    maxLength="7" 
                                    readOnly
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    name="totalAmount"
                                    value={totalAmount}/>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>円</InputGroup.Text>
                                    </InputGroup.Prepend>
                                </InputGroup>
                            </Col>
                            <Col sm={3}>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>反映年月</InputGroup.Text>
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
                                        id="wagesInfoDatePicker"
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
                                    <InputGroup.Text>社員形式</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    as="select"
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    name="employeeFormCode"
                                    value={employeeFormCode}>
                                        {EmployeeFormCodeDrop.map(date =>
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
                                    <InputGroup.Text>備考</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    name="remark"
                                    onChange={this.valueChange}
                                    disabled={actionType === "detail" ? true : false}
                                    placeholder="例：XXXXX"
                                    value={remark}/>
                                </InputGroup>
                            </Col>
                        </Row>
                        <div style={{ "textAlign": "center" }}>
                            <Button 
                                size="sm"
                                disabled={actionType === "detail" ? true : false}
                                variant="info"
                                onClick={this.toroku}>
                                    <FontAwesomeIcon icon={faSave} />{torokuText}
                            </Button>{" "}
                            <Button 
                                size="sm" 
                                disabled={actionType === "detail" ? true : false}
                                onClick={this.resetValue}
                                variant="info" 
                                value="Reset" >
                                    <FontAwesomeIcon icon={faUndo} />リセット
                            </Button>
                        </div>
                        </Form.Group>
                    </Form>
                    <Form.Text style={{ "color": "#FFD700" }}>給料変動一覧</Form.Text>
                    <Row>
                        <Col sm={11}>
                        </Col>
                        <Col sm={1}>
                            <div style={{ "float": "right" }}>
                                <Button 
                                variant="info" 
                                size="sm" 
                                id="shusei"
                                onClick={this.shuseiBtn}
                                >
                                    <FontAwesomeIcon icon={faEdit}/>修正
                                </Button>
                            </div>
                        </Col>
                    </Row>
                <div>
                    <BootstrapTable 
                    selectRow={actionType !== "detail" ? selectRow : selectRowDetail} 
                    pagination={ true } 
                    options={ options } 
                    data={wagesInfoList}
                    headerStyle={{ background: '#5599FF' }}
                    expandColumnOptions={ {
                        expandColumnVisible: true,
                        expandColumnComponent: this.expandColumnComponent,
                        columnWidth: 50,
                        text:"諸費用",
                      } } 
                    expandableRow={ this.isExpandableRow }
                    expandComponent={ this.expandComponent }
                    striped>
                        <TableHeaderColumn isKey={true} dataField='period' headerAlign='center' dataAlign='center' width='190'>給料期間</TableHeaderColumn>
                        {/* <TableHeaderColumn dataField='' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center' width="130">最新の諸費用反映年月</TableHeaderColumn> */}
                        <TableHeaderColumn dataField='employeeFormName' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center' width="230">社員形式</TableHeaderColumn>
                        <TableHeaderColumn dataField='salary' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center' width="290">給料</TableHeaderColumn>
                        {/* <TableHeaderColumn dataField='transportationExpenses' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>交通代</TableHeaderColumn>
                        <TableHeaderColumn dataField='leaderAllowanceAmount' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>リーダー</TableHeaderColumn>
                        <TableHeaderColumn dataField='housingAllowance' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>住宅</TableHeaderColumn>
                        <TableHeaderColumn dataField='otherAllowanceAmount' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>他</TableHeaderColumn> */}
                        <TableHeaderColumn dataField='scheduleOfBonusAmount' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>ボーナス</TableHeaderColumn>
                        <TableHeaderColumn dataField='remark' tdStyle={{ padding: '.45em' }} headerAlign='center' dataAlign='center'>備考</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                </div>
            </div>
        );
    }
}

export default WagesInfo;