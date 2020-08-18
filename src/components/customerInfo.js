import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , Modal , Card} from 'react-bootstrap';
import * as customerInfoJs from '../components/customerInfoJs.js';
import $ from 'jquery';
import BankInfo from './bankInfo';
import Autosuggest from 'react-autosuggest';
import '../asserts/css/login.css';
import TopCustomerInfo from './topCustomerInfo';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker ,　{registerLocale} from "react-datepicker"
import ja from 'date-fns/locale/ja';
import axios from 'axios';
import {BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import * as utils from './utils/dateUtils.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

registerLocale('ja', ja);

class CustomerInfo extends Component {
    state = {
        showBankInfoModal:false,//口座情報画面フラグ
        showCustomerInfoModal:false,//上位お客様情報画面フラグ
        establishmentDate: '',//設立の期日
        businessStartDate: '',//取引開始の期日
        topCustomerDrop:[],//上位お客様連想の数列
        topCustomerName:'',//上位お客様のname
        rowNo:'',//行のコード
        customerDepartmentCode:'',//部門コード
        customerDepartmentName:'',//部門のname
        customerDepartmentNameDrop:[],//部門の連想数列
        customerDepartmentList:[],//部門情報数列
        accountInfo:null,//口座情報のデータ
        actionType:'',//処理区分
        topCustomerInfo:null,//上位お客様情報データ
     }
    /**
     *  設立のonChange
     */
    establishmentDateChange = date => {
        if(date !== null){
            this.setState({
                establishmentDate: date,
            });
        }else{
            this.setState({
                establishmentDate: '',
            });
        }
    };
    /**
     * 取引開始のonChange 
     */
    businessStartDateChange = date => {
        if(date !== null){
            this.setState({
                businessStartDate: date,
            });
        }else{
            this.setState({
                businessStartDate: '',
            });
        }
        };
     constructor(props){
         super(props);
         this.handleShowModal = this.handleShowModal.bind(this);
         this.handleShowModal = this.handleShowModal.bind(this);
     }
     /**
     * 小さい画面の閉め 
     */
     handleHideModal=(Kbn)=>{
         if(Kbn === "bankInfo"){
            this.setState({showBankInfoModal:false})
         }else if(Kbn === "customerInfo"){
            this.setState({showCustomerInfoModal:false})
         }
     }
     /**
     *  小さい画面の開き
     */
     handleShowModal=(Kbn)=>{
        if(Kbn === "bankInfo"){
            this.setState({showBankInfoModal:true})
         }else if(Kbn === "customerInfo"){
            this.setState({showCustomerInfoModal:true})
         }
     }
     /**
     * 画面の初期化 
     */
    async componentDidMount(){
        var pro = this.props.location.state;
        $("#actionType").val( pro.actionType);
        $("#customerNo").val( pro.customerNo);
        $("#sakujo").attr("disabled",true);
        var methodArray = ["getListedCompany", "getLevel", "getCompanyNature", "getPosition", "getPaymentsite" , "getTopCustomerDrop" , "getDepartmentMasterDrop"]
        var selectDataList = utils.getPublicDropDown(methodArray);
        //上場会社
        var listedCompanyFlag = selectDataList[0];
        //お客様ランキン
        var levelCode = selectDataList[1];
        //会社性質
        var companyNature = selectDataList[2];
        //職位
        var positionCode = selectDataList[3];
        //支払サイト
        var paymentsiteCode = selectDataList[4];
        var topCustomerDrop = [];
        var customerDepartmentNameDrop = [];
        topCustomerDrop = selectDataList[5];
        topCustomerDrop.shift();
        customerDepartmentNameDrop = selectDataList[6];
        customerDepartmentNameDrop.shift();
        this.setState({
            topCustomerDrop:topCustomerDrop,
            customerDepartmentNameDrop:customerDepartmentNameDrop,
        })
        for(let i = 1;i<listedCompanyFlag.length ; i++){
            $("#listedCompanyFlag").append('<option value="'+listedCompanyFlag[i].code+'">'+listedCompanyFlag[i].name+'</option>');
        }
        for(let i = 0;i<levelCode.length ; i++){
            $("#levelCode").append('<option value="'+levelCode[i].code+'">'+levelCode[i].name+'</option>');
        }
        for(let i = 0;i<companyNature.length ; i++){
            $("#companyNatureCode").append('<option value="'+companyNature[i].code+'">'+companyNature[i].name+'</option>');
        }
        for(let i = 0;i<positionCode.length ; i++){
            $("#positionCode").append('<option value="'+positionCode[i].code+'">'+positionCode[i].name+'</option>');
        }
        for(let i = 0;i<paymentsiteCode.length ; i++){
            $("#paymentsiteCode").append('<option value="'+paymentsiteCode[i].code+'">'+paymentsiteCode[i].name+'</option>');
        }
        if($("#actionType").val() !== "update"){
            $("#toBankInfo").attr("disabled",true);
          }
        this.setState({
            actionType:$("#actionType").val(),
        })
        var customerInfoMod = {};
        customerInfoMod["customerNo"] = $("#customerNo").val();
        customerInfoMod["actionType"] = $("#actionType").val();
        await axios.post("http://127.0.0.1:8080/customerInfo/onloadPage" , customerInfoMod)
        .then(resultMap => {
            var customerInfoMod;
            var actionType = $("#actionType").val();
            customerInfoMod = resultMap.data.customerInfoMod;
            if(actionType === 'insert'){
                var customerNoSaiBan = resultMap.data.customerNoSaiBan;
                $("#customerNo").val(customerNoSaiBan);
                $("#customerNo").attr("readOnly",true);
                this.setState({
                    customerDepartmentList:resultMap.data.customerDepartmentInfoList,
                })
            }else{
                $("#customerName").val(customerInfoMod.customerName);
                $("#customerAbbreviation").val(customerInfoMod.customerAbbreviation);
                $("#stationCode").val(customerInfoMod.stationCode);
                $("#levelCode").val(customerInfoMod.levelCode);
                $("#listedCompanyFlag").val(customerInfoMod.listedCompanyFlag);
                $("#companyNatureCode").val(customerInfoMod.companyNatureCode);
                $("#representative").val(customerInfoMod.representative);
                $("#paymentsiteCode").val(customerInfoMod.paymentsiteCode);
                $("#purchasingManagersMail").val(customerInfoMod.purchasingManagersMail);
                $("#purchasingManagers").val(customerInfoMod.purchasingManagers);
                $("#url").val(customerInfoMod.url);
                $("#remark").val(customerInfoMod.remark);
                var topCustomerValue = {};
                topCustomerValue["value"] = customerInfoMod.topCustomerNo;
                topCustomerValue["label"] = customerInfoMod.topCustomerName;
                this.setState({
                    topCustomerValue:topCustomerValue,
                    businessStartDate:utils.converToLocalTime(customerInfoMod.businessStartDate,false),
                    establishmentDate:utils.converToLocalTime(customerInfoMod.establishmentDate,false),
                    customerDepartmentList:resultMap.data.customerDepartmentInfoList,
                })
                if(actionType === 'detail'){
                    customerInfoJs.setDisabled();
                }
            }
        })
        .catch(function (error) {
            alert("select框内容获取错误，请检查程序");
        });  
    }
    
    /**
     *  部門連想のデータ取得
     */
    meisaiToroku =()=>{
        var customerDepartmentInfoModel = {};
        var positionCode=document.getElementById("positionCode");
        var index=positionCode.selectedIndex;
        var formArray =$("#customerDepartmentForm").serializeArray();
        $.each(formArray,function(i,item){
            customerDepartmentInfoModel[item.name] = item.value;     
        });
        customerDepartmentInfoModel["actionType"] = $("#actionType").val();
        customerDepartmentInfoModel["updateUser"] = sessionStorage.getItem('employeeNo');
        customerDepartmentInfoModel['customerNo'] = $("#customerNo").val();
        customerDepartmentInfoModel['customerDepartmentName'] = $("#customerDepartmentName").val();
        customerDepartmentInfoModel['positionName'] = (positionCode.options[index].text === "選択ください" ? '' : positionCode.options[index].text);
        customerDepartmentInfoModel["rowNo"] = (this.state.customerDepartmentList.length === 0 ? 1 : this.state.customerDepartmentList.length + 1);
        if($("#customerDepartmentName").val() !== '' && $("#positionCode").val() !== ''){
            if(this.state.rowNo !== null && this.state.rowNo !== ''){//行更新
                let rowNo = this.state.rowNo;
                var departmentList = this.state.customerDepartmentList;
                customerDepartmentInfoModel.rowNo = rowNo;
                for(let i=departmentList.length-1; i>=0; i--){
                    if(departmentList[i].rowNo === rowNo){
                        departmentList[i] = customerDepartmentInfoModel;
                    }
                }
                if($("#actionType").val() ==="update"){
                    axios.post("http://127.0.0.1:8080/customerInfo/meisaiUpdate", customerDepartmentInfoModel)
                    .then(result => {
                        if(result.data === 0){
                            this.setState({
                                customerDepartmentList:departmentList,
                            })
                        }else if(result.data === 2){
                            alert("部門が部門マスタに存在しません");
                        }else{
                            alert("更新が失敗しました");
                        }
                    })
                }else{
                    this.setState({
                        customerDepartmentList:departmentList,
                    })
                }
            }else{//行追加
                this.setState({
                    customerDepartmentList:[...this.state.customerDepartmentList,customerDepartmentInfoModel],
                })
                this.setState({
                    customerDepartmentNameValue:'',
                })
                $("#positionCode").val('');
                $("#responsiblePerson").val('');
                $("#customerDepartmentMail").val('');
            }
        }
    }
    /**
     * 登録ボタン
     */
    toroku=()=>{
        if($("#customerName").val() !== "" && $("#customerName").val() != null){
            var customerInfoMod = {};
            var formArray =$("#customerForm").serializeArray();
            $.each(formArray,function(i,item){
                customerInfoMod[item.name] = item.value;     
            });
            customerInfoMod["topCustomerName"] = $("#topCustomerNameShita").val();
            customerInfoMod["establishmentDate"] = utils.formateDate(this.state.establishmentDate,false);
            customerInfoMod["businessStartDate"] = utils.formateDate(this.state.businessStartDate,false);
            customerInfoMod["updateUser"] = sessionStorage.getItem('employeeNo');
            customerInfoMod["actionType"] = $("#actionType").val();
            customerInfoMod["customerDepartmentList"] = this.state.customerDepartmentList;
            customerInfoMod["accountInfo"] = this.state.accountInfo;
            customerInfoMod["topCustomerInfo"] = this.state.topCustomerInfo;
            axios.post("http://127.0.0.1:8080/customerInfo/toroku", customerInfoMod)
            .then(function (result) {
            if(result.data === 0){
                alert("登录完成");
                window.location.reload();
            }else if(result.data === 1){
                alert("登录错误，请检查程序");
            }else if(result.data === 2){
                alert("上位お客様名前がお客様情報テーブルに存じません，データをチェックしてください");
            }else if(result.data === 3){
                alert("部署が登録失敗しました。");
            }else if(result.data === 4){
                alert("部署が部署マスタに存在しません。");
            }
            })
            .catch(function (error) {
            alert("登录错误，请检查程序");
            });
        }else{
            if($("#customerName").val() === "" || $("#customerName").val() === null){
                document.getElementById("erorMsg").style = "visibility:visible";
            } 
        }  
    }
    /**
     * 行の削除
     */
    listDelete=()=>{
        var a = window.confirm("削除していただきますか？");
        if(a){
            var id = this.state.rowNo;
            var departmentList = this.state.customerDepartmentList;
            for(let i=departmentList.length-1; i>=0; i--){
                if(departmentList[i].rowNo === id){
                    departmentList.splice(i,1);
                }
            }
            if(departmentList.length !== 0){
                for(let i=departmentList.length-1; i>=0; i--){
                    departmentList[i].rowNo = (i + 1);
                }  
            }
            this.setState({
                customerDepartmentList:departmentList,
                rowNo:'',
                customerDepartmentNameValue:'',
                customerDepartmentCode:'',
            })
            $("#positionCode").val('');
            $("#responsiblePerson").val('');
            $("#customerDepartmentMail").val('');
            var customerDepartmentInfoModel = {};
            customerDepartmentInfoModel["customerNo"] = $("#customerNo").val();
            customerDepartmentInfoModel["customerDepartmentCode"] = this.state.customerDepartmentCode;
            if($("#actionType").val() === "update"){
                axios.post("http://127.0.0.1:8080/customerInfo/customerDepartmentdelete", customerDepartmentInfoModel)
                .then(function (result) {
                    if(result.data === true){
                        alert("删除成功");
                    }else{
                        alert("删除失败");
                    }
                })
                .catch(function (error) {
                    alert("删除失败，请检查程序");
                });
            }
        }    
    }
        /**
     * 連想チェンジ
     */
    topCustomerHandleChange = selectedOption => {
        this.setState({ 
            topCustomerValue:selectedOption,
            topCustomerNo:selectedOption.value,
        });
		console.log(`Option selected:`, selectedOption);
    };
    
        /**
     * 連想チェンジ
     */
    handleChange = selectedOption => {
        this.setState({ 
            customerDepartmentValue:selectedOption,
        });
		console.log(`Option selected:`, selectedOption);
	};
    /**
     * 行Selectファンクション
     */
     handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            $("#positionCode").val(row.positionCode);
            $("#responsiblePerson").val(row.responsiblePerson);
            $("#customerDepartmentMail").val(row.customerDepartmentMail);
            var customerDepartmentDrop = {};
            customerDepartmentDrop["value"] = row.customerDepartmentCode;
            customerDepartmentDrop["label"] = row.customerDepartmentName;
            this.setState({
                customerDepartmentValue:customerDepartmentDrop,
                rowNo:row.rowNo,
                customerDepartmentCode:row.customerDepartmentCode,
            })
            $("#sakujo").attr("disabled",false);
        } else {
            $("#positionCode").val('');
            $("#responsiblePerson").val('');
            $("#customerDepartmentMail").val('');
            $("#customerDepartmentName").val('');
            var customerDepartmentValue = {};
            customerDepartmentValue["label"] = "";
            customerDepartmentValue["value"] = "";
            this.setState({
                customerDepartmentValue:customerDepartmentValue,
                rowNo:'',
                customerDepartmentCode:'',
            })
            $("#sakujo").attr("disabled",true);
        }
    }
    /**
     * ポップアップ口座情報の取得
     */
    accountInfoGet=(accountTokuro)=>{
        this.setState({
            accountInfo:accountTokuro,
            showBankInfoModal:false,
        })
        console.log(accountTokuro);
    }
    /**
     * ポップアップ上位お客様情報の取得
     */
    topCustomerInfoGet=(topCustomerToroku)=>{
        if(this.state.topCustomerNo !== null && this.state.topCustomerNo !== '' && this.state.topCustomerNo !== undefined){
            console.log(topCustomerToroku);//上位お客様更新の場合
            this.setState({
                topCustomerDrop:topCustomerToroku,
                showCustomerInfoModal:false,
            })
        }else{//上位お客様追加の場合
            var ModelClass = {};
            ModelClass["value"] = topCustomerToroku.topCustomerNo;
            ModelClass["label"] = topCustomerToroku.topCustomerName;
            this.setState({
                topCustomerDrop:[...this.state.topCustomerDrop,ModelClass],
                topCustomerInfo:topCustomerToroku,
                topCustomerValue:ModelClass,
                showCustomerInfoModal:false,
            })
        }
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
    render() {
        const { topCustomerValue , topCustomerInfo , customerDepartmentNameValue , selectedValue , customerDepartmentList , accountInfo
         , actionType , topCustomerNo} = this.state;
        const accountPath = {
            pathName:`${this.props.match.url}/`,state:this.state.accountInfo,
        }
        //テーブルの列の選択
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,  // click to select, default is false
            clickToExpand: true,// click to expand row, default is false
            onSelect:this.handleRowSelect,
        };
        //テーブルの列の選択
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

            <div style={{"background":"#f5f5f5"}}>
            <div>
                <Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" 
                onHide={this.handleHideModal.bind(this,"bankInfo")} show={this.state.showBankInfoModal}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body >
                            <BankInfo accountInfo={accountInfo} actionType={actionType} accountTokuro={this.accountInfoGet}/>
                </Modal.Body>
                </Modal>
                <Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" 
                onHide={this.handleHideModal.bind(this,"customerInfo")} show={this.state.showCustomerInfoModal}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                            <TopCustomerInfo topCustomerNo={topCustomerNo} topCustomerInfo={topCustomerInfo} actionType={actionType} topCustomerToroku={this.topCustomerInfoGet}/>
                </Modal.Body>
                </Modal>
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>お客様情報</h2>
                    </Col> 
                </Row>
                <Row>
                    <Col sm={5}></Col>
                    <Col sm={2}>
                        <Button size="sm" id="toBankInfo" onClick={this.handleShowModal.bind(this,"bankInfo")}>
                            お客様口座情報
                        </Button>{' '}
                        <Button size="sm" id="toCustomerInfo" onClick={this.handleShowModal.bind(this,"customerInfo")}>
                            上位お客様
                        </Button>
                    </Col>
                    <Col sm={2}>
                        
                    </Col>
                </Row>
                <Row>
                        <Col sm={4}>
                        </Col>
                        <Col sm={7}>
                            <p id="erorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★がついてる項目を入力してください！</p>
                        </Col>
                </Row>
                <Form id="customerForm">
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様番号</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control maxLength="6" placeholder="お客様番号" id="customerNo" name="customerNo" readOnly/>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="例：LYC株式会社" maxLength="50" id="customerName" onChange={customerInfoJs.toDisabed} name="customerName" /><font  color="red"
				style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">略称</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="LYC" maxLength="20" id="customerAbbreviation" name="customerAbbreviation" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">代表取締役</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="例：中山毛石" maxLength="20" id="representative" name="representative" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">本社場所</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="例：秋葉原駅" maxLength="20" id="stationCode" name="stationCode" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">設立</InputGroup.Text>
                            </InputGroup.Prepend>
                                <DatePicker
                                selected={this.state.establishmentDate}
                                onChange={this.establishmentDateChange}
                                dateFormat="yyyy/MM"
                                autoComplete="off"
                                locale="pt-BR"
                                id="customerInfoDatePicker"
                                yearDropdownItemNumber={15}
                                scrollableYearDropdown
                                showMonthYearPicker
                                showFullMonthYearPicker
                                showDisabledMonthNavigation
                                className="form-control form-control-sm"
                                name="establishmentDate"
                                locale="ja"
                                />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">取引開始日</InputGroup.Text>
                            </InputGroup.Prepend>
                                <DatePicker
                                selected={this.state.businessStartDate}
                                onChange={this.businessStartDateChange}
                                dateFormat="yyyy/MM"
                                autoComplete="off"
                                locale="pt-BR"
                                id="customerInfoDatePicker"
                                yearDropdownItemNumber={15}
                                scrollableYearDropdown
                                showMonthYearPicker
                                showFullMonthYearPicker
                                showDisabledMonthNavigation
                                name="businessStartDate"
                                className="form-control form-control-sm"
                                locale="ja"
                                />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">上位お客様</InputGroup.Text>
                            </InputGroup.Prepend>
                                {/* <Autosuggest
                                    suggestions={topCustomerSuggestions}
                                    onSuggestionsFetchRequested={this.onDlt1SuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onDlt1SuggestionsClearRequested}
                                    onSuggestionSelected={this.onDlt1SuggestionSelected}
                                    getSuggestionValue={getSuggestionDlt1}
                                    renderSuggestion={renderSuggestion}
                                    inputProps={topcustomerInputProps}                                    
                                /> */}
                                <Select
                                    inputId="topCustomer"
                                    name="topCustomer"
                                    value={topCustomerValue}
                                    onChange={this.topCustomerHandleChange}
                                    options={this.state.topCustomerDrop}
                                />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様ランキング</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="お客様ランキング" id="levelCode" name="levelCode" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">上場会社</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="上場会社" id="listedCompanyFlag" name="listedCompanyFlag">
                                </Form.Control>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">会社性質</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="会社性質" id="companyNatureCode" name="companyNatureCode" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">URL</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control maxLength="" placeholder="www.lyc.co.jp" id="url" name="url" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">購買担当</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control maxLength="20" placeholder="例：田中" id="purchasingManagers" name="purchasingManagers" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">メール</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control maxLength="50" placeholder="xxxxxxxxx@xxx.xxx.com" id="purchasingManagersMail" name="purchasingManagersMail" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">支払サイト</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="支払サイト" id="paymentsiteCode" name="paymentsiteCode" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control maxLength="50" placeholder="備考" id="remark" name="remark" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={5}></Col>
                        <Col sm={11} className="text-center">
                                
                        </Col>
                        <Col sm={1} className="text-center">
                                <Button  block size="sm" variant="info" id="reset" onClick={customerInfoJs.reset} >
                                <FontAwesomeIcon icon={faUndo} />リセット
                                </Button>
                        </Col>
                </Row>
                </Form>
                <hr style={{height:"1px",border:"none",borderTop:"1px solid #555555"}} /> 
                <Form.Text className="text-muted">部門情報</Form.Text>
                <Form id="customerDepartmentForm">
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">部門</InputGroup.Text>
                            </InputGroup.Prepend>
                                {/* <Autosuggest
                                        suggestions={customerDepartmentNameSuggestions}
                                        onSuggestionsFetchRequested={this.onDltDepartmentSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onDltDepartmentSuggestionsClearRequested}
                                        onSuggestionSelected={this.onDltDepartmentSuggestionSelected}
                                        getSuggestionValue={getSuggestionDlt1}
                                        renderSuggestion={renderSuggestion}
                                        inputProps={customerDepartmentNameInputProps}                                    
                                    /> */}
                                <Select
                                    inputId="customerDepartmentName"
                                    name="customerDepartmentName"
                                    value={this.state.customerDepartmentValue !== null ? this.state.customerDepartmentValue : customerDepartmentNameValue}
                                    onChange={this.handleChange}
                                    options={this.state.customerDepartmentNameDrop}
                                />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">職位</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="例：部長" id="positionCode" name="positionCode" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">責任者</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control maxLength="20" placeholder="例：田中一郎" id="responsiblePerson" name="responsiblePerson" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">メール</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control maxLength="50" placeholder="xxxxxx@xx.com" id="customerDepartmentMail" name="customerDepartmentMail" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={5}></Col>
                        <Col sm={1} className="text-center">
                                <Button block size="sm" onClick={this.meisaiToroku} variant="info" id="meisaiToroku" type="button">
                                <FontAwesomeIcon icon={faSave} />部署登録
                                </Button>
                        </Col>
                        <Col sm={1} className="text-center">
                                <Button  block size="sm" variant="info" id="meisaiReset" >
                                <FontAwesomeIcon icon={faUndo} />リセット
                                </Button>
                        </Col>
                </Row>
                <Card.Body>
                <Row>
                    <Col sm={11}></Col>
                    <Col sm={1}>
                    <Button size="sm" block onClick={this.listDelete} variant="info" id="sakujo" type="button">
                        删除
                    </Button>
                    </Col>
                </Row>
                    <div>
                    <BootstrapTable selectRow={actionType !== "detail" ? selectRow : selectRowDetail} pagination={ true } options={ options } data={customerDepartmentList} className={"bg-white text-dark"}>
                        <TableHeaderColumn isKey dataField='rowNo' headerAlign='center' dataAlign='center' width='90'>番号</TableHeaderColumn>
                        <TableHeaderColumn dataField='responsiblePerson' headerAlign='center' dataAlign='center' width="130">名前</TableHeaderColumn>
                        <TableHeaderColumn dataField='customerDepartmentName' headerAlign='center' dataAlign='center' width="230">部門</TableHeaderColumn>
                        <TableHeaderColumn dataField='positionName' headerAlign='center' dataAlign='center' width="190">職位</TableHeaderColumn>
                        <TableHeaderColumn dataField='customerDepartmentMail' headerAlign='center' dataAlign='center'>メール</TableHeaderColumn>
                        <TableHeaderColumn dataField='companyNatureName' headerAlign='center' dataAlign='center' width="140">取引人数</TableHeaderColumn>
                    </BootstrapTable>
                    </div>
                </Card.Body>
                <input type="hidden" id="employeeNo" name="employeeNo"/>
                <input type="hidden" id="actionType" name="actionType"/>
                </Form>
            </div>
                <Row>
                    <Col sm={11}></Col>
                    <Col sm={1}>
                        {actionType === "update" ? 
                        <Button size="sm" block onClick={this.toroku}  variant="info" id="toroku" type="button">
                            <FontAwesomeIcon icon={faSave} />更新
                        </Button>
                        :
                        <Button size="sm" block onClick={this.toroku}  variant="info" id="toroku" type="button">
                            <FontAwesomeIcon icon={faSave} />登録
                        </Button>
                    }
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CustomerInfo;