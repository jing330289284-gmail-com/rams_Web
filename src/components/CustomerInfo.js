import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , Modal , Card} from 'react-bootstrap';
import * as customerInfoJs from '../components/CustomerInfoJs.js';
import $ from 'jquery';
import BankInfo from './bankInfo';
import Autosuggest from 'react-autosuggest';
import '../asserts/css/login.css';
import TopCustomerInfo from './topCustomerInfo';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker ,　{registerLocale} from "react-datepicker"
import ja from 'date-fns/locale/ja';
import axios from 'axios';
import {BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import * as utils from './utils/dateUtils.js';

registerLocale('ja', ja);
/**
 * 以下の四つメソッドは連想検索
 */
function escapeRegexCharacters(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function getSuggestions(value, datas) {
	const escapedValue = escapeRegexCharacters(value.trim());
	const regex = new RegExp('^' + escapedValue, 'i');

	return datas.filter(data => regex.test(data.name));
}
function getSuggestionDlt1(suggestion) {
	return suggestion.name;
}
function renderSuggestion(suggestion) {
	return (
		<span>{suggestion.name}</span>
	);
}
var oldForm_data;//画面初期のデータ
var oldForm_dataJson;//画面初期のデータのjson
var newForm_data;//登録の際データ
var newForm_dataJson;//登録の際データのjson

class CustomerInfo extends Component {
    state = {
        showBankInfoModal:false,//口座情報画面フラグ
        showCustomerInfoModal:false,//上位お客様情報画面フラグ
        establishmentDate: new Date(),//設立の期日
        businessStartDate: new Date(),//取引開始の期日
        topCustomerSuggestions:[],//上位お客様連想の数列
        topCustomerValue:'',//上位お客様項目の値
        topCustomerName:'',//上位お客様のname
        rowNo:'',//行のコード
        customerDepartmentCode:'',//部門コード
        customerDepartmentName:'',//部門のname
        customerDepartmentNameValue:'',//部門の項目値
        customerDepartmentNameSuggestions:[],//部門の連想数列
        customerDepartmentList:[],//部門情報数列
     }
    /**
     *  設立のonChange
     */
    establishmentDateChange = date => {
    this.setState({
        establishmentDate: date,
    });
        let month = date.getMonth() + 1;
        $("#establishmentDate").val(date.getFullYear() + '' + (month < 10 ? '0'+month: month));
    
    };
    /**
     * 取引開始のonChange 
     */
    businessStartDateChange = date => {
        this.setState({
            businessStartDate: date,
        });
            let month = date.getMonth() + 1;
            $("#businessStartDate").val(date.getFullYear() + '' + (month < 10 ? '0'+month: month));
        
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
        $("#shoriKbn").val( pro.split("-")[0]);
        $("#customerNo").val( pro.split("-")[1]);
        $("#sakujo").attr("disabled",true);
        //上場会社
        var listedCompany = utils.getdropDown("getListedCompany");
        //お客様ランキン
        var customerRanking = utils.getdropDown("getLevel");
        //会社性質
        var companyNature = utils.getdropDown("getCompanyNature");
        //職位
        var positionCode = utils.getdropDown("getPosition");
        for(let i = 0;i<listedCompany.length ; i++){
            $("#listedCompany").append('<option value="'+listedCompany[i].code+'">'+listedCompany[i].name+'</option>');
        }
        for(let i = 0;i<customerRanking.length ; i++){
            $("#customerRankingCode").append('<option value="'+customerRanking[i].code+'">'+customerRanking[i].name+'</option>');
        }
        for(let i = 0;i<companyNature.length ; i++){
            $("#companyNatureCode").append('<option value="'+companyNature[i].code+'">'+companyNature[i].name+'</option>');
        }
        for(let i = 0;i<positionCode.length ; i++){
            $("#positionCode").append('<option value="'+positionCode[i].code+'">'+positionCode[i].name+'</option>');
        }
        if($("#shoriKbn").val() !== "shusei"){
            $("#toBankInfo").attr("disabled",true);
            $("#toCustomerInfo").attr("disabled",true);
          }
        var customerInfoMod = {};
        customerInfoMod["customerNo"] = $("#customerNo").val();
        customerInfoMod["shoriKbn"] = $("#shoriKbn").val();
        await axios.post("http://127.0.0.1:8080/customerInfo/onloadPage" , customerInfoMod)
        .then(resultMap => {
            var customerInfoMod;
            var shoriKbn = $("#shoriKbn").val();
            customerInfoMod = resultMap.data.customerInfoMod;
            if(shoriKbn === 'tsuika'){
                var customerNoSaiBan = resultMap.data.customerNoSaiBan;
                $("#customerNo").val(customerNoSaiBan);
                $("#customerNo").attr("readOnly",true);
                this.setState({
                    customerDepartmentList:resultMap.data.customerDepartmentInfoList,
                })
            }else{
                $("#customerName").val(customerInfoMod.customerName);
                $("#topCustomerNameShita").val(customerInfoMod.topCustomerName);
                $("#customerAbbreviation").val(customerInfoMod.customerAbbreviation);
                $("#businessStartDate").val(customerInfoMod.businessStartDate);
                $("#headOffice").val(customerInfoMod.headOffice);
                $("#establishmentDate").val(customerInfoMod.establishmentDate);
                $("#customerRankingCode").val(customerInfoMod.customerRankingCode);
                $("#listedCompany").val(customerInfoMod.listedCompany);
                $("#companyNatureCode").val(customerInfoMod.companyNatureCode);
                $("#url").val(customerInfoMod.url);
                $("#remark").val(customerInfoMod.remark);
                this.setState({
                    customerDepartmentList:resultMap.data.customerDepartmentInfoList,
                })
                if(resultMap.data.customerInfoMod.topCustomerName !== '' && resultMap.data.customerInfoMod.topCustomerName !== null){
                    this.setState({
                        topCustomerValue:resultMap.data.customerInfoMod.topCustomerName,
                    })
                }
                oldForm_data = $("#customerForm").serializeArray();
                oldForm_dataJson = JSON.stringify({ dataform: oldForm_data });
                if(shoriKbn === 'sansho'){
                    customerInfoJs.setDisabled();
                }
            }
        })
        .catch(function (error) {
            alert("select框内容获取错误，请检查程序");
        });  
    }
     /**
     * 上位お客様連想のデータ取得 
     */   
	onDlt1SuggestionsFetchRequested = ({ value }) => {
		const model = {
			name: value
		};
		axios.post("http://127.0.0.1:8080/getTopCustomerDrop", model)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					this.setState({
						topCustomerSuggestions: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
    };
     /**
     * 部門連想のデータ取得 
     */   
	onDltDepartmentSuggestionsFetchRequested = ({ value }) => {
		const model = {
			name: value
		};
		axios.post("http://127.0.0.1:8080/getDepartmentMaster", model)
			.then(response => {
				console.log(response);
				if (response.data != null) {
					this.setState({
						customerDepartmentNameSuggestions: getSuggestions(value, response.data)
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
    };
    /**
     *  上位お客様連想のデータのクリア
     */
    onDlt1SuggestionsClearRequested = () => {
		this.setState({
			topCustomerSuggestions: []
		});
    };
    /**
     *  部門連想のデータのクリア
     */
    onDltDepartmentSuggestionsClearRequested = () => {
		this.setState({
			customerDepartmentNameSuggestions: []
		});
    };
    /**
     *  上位お客様連想のデータの選択
     */
    onDlt1SuggestionSelected = (event, { suggestion }) => {
		this.setState({
			topCustomerValue: suggestion.name
		});
    };
    /**
     *  部門連想のデータの選択
     */
    onDltDepartmentSuggestionSelected = (event, { suggestion }) => {
		this.setState({
			customerDepartmentNameValue: suggestion.name,
		});
    };
    /**
     *  上位お客様連想のデータの変化
     */
    onDevelopement1Change = (event, { newValue }) => {
		this.setState({
			topCustomerValue: newValue
		});
    };
    /**
     *  上位お客様連想のデータの変化
     */
    onDevelopementDepartmentChange = (event, { newValue }) => {
		this.setState({
			customerDepartmentNameValue: newValue
		});
    };
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
        customerDepartmentInfoModel["updateUser"] = sessionStorage.getItem('employeeNo');
        customerDepartmentInfoModel['customerNo'] = $("#customerNo").val();
        customerDepartmentInfoModel['customerDepartmentName'] = $("#customerDepartmentName").val();
        customerDepartmentInfoModel['positionName'] = (positionCode.options[index].text === "選択ください" ? '' : positionCode.options[index].text);
        customerDepartmentInfoModel["rowNo"] = this.state.customerDepartmentList.length + 1;
        if($("#customerDepartmentName").val() !== '' && $("#positionCode").val() !== ''){
            this.setState({
                customerDepartmentList:[...this.state.customerDepartmentList,customerDepartmentInfoModel],
            })
        }
        this.setState({
            customerDepartmentNameValue:'',
        })
        $("#positionCode").val('');
        $("#responsiblePerson").val('');
        $("#customerDepartmentMail").val('');
    }
    /**
     * 登録ボタン
     */
    toroku=()=>{
        newForm_data = $("#customerForm").serializeArray();
        newForm_dataJson = JSON.stringify({ dataform: newForm_data });
        if(newForm_dataJson !== oldForm_dataJson && $("#customerName").val() !== "" && $("#customerName").val() != null){
            var customerInfoMod = {};
            var formArray =$("#customerForm").serializeArray();
            $.each(formArray,function(i,item){
                customerInfoMod[item.name] = item.value;     
            });
            customerInfoMod["topCustomerName"] = $("#topCustomerNameShita").val();
            customerInfoMod["updateUser"] = sessionStorage.getItem('employeeNo');
            customerInfoMod["shoriKbn"] = $("#shoriKbn").val();
            customerInfoMod["customerDepartmentList"] = this.state.customerDepartmentList;
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
            if(newForm_dataJson === oldForm_dataJson){
                alert("修正してありません!");
            }else if($("#customerName").val() === "" || $("#customerName").val() === null){
                document.getElementById("erorMsg").style = "visibility:visible";
            } 
        }  
    }
    /**
     * 行の削除
     */
    listDelete=()=>{
        //将id进行数据类型转换，强制转换为数字类型，方便下面进行判断。
        var id = this.state.rowNo;
        var departmentList = this.state.customerDepartmentList;
        for(let i=departmentList.length-1; i>=0; i--){
            if(departmentList[i].rowNo === id){
                departmentList.splice(i,1);
            }
            if(departmentList.length !== 0){
                departmentList[i].rowNo = (i + 1);
            }
        }
        this.setState({
            customerDepartmentList:departmentList,
        })
        var customerDepartmentInfoModel = {};
        customerDepartmentInfoModel["customerNo"] = $("#customerNo").val();
        customerDepartmentInfoModel["customerDepartmentCode"] = this.state.customerDepartmentCode;
        if($("#shoriKbn").val() === "tsuika"){
            axios.post("http://127.0.0.1:8080/customerInfo/customerDepartmentdelect", customerDepartmentInfoModel)
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
        /**
     * 行Selectファンクション
     */
     handleRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            $("#positionCode").val(row.positionCode);
            $("#responsiblePerson").val(row.responsiblePerson);
            $("#customerDepartmentMail").val(row.customerDepartmentMail);
            this.setState({
                customerDepartmentNameValue:row.customerDepartmentName,
                rowNo:row.rowNo,
                customerDepartmentCode:row.customerDepartmentCode,
            })
            $("#sakujo").attr("disabled",false);
        } else {
            $("#positionCode").val('');
            $("#responsiblePerson").val('');
            $("#customerDepartmentMail").val('');
            this.setState({
                customerDepartmentNameValue:'',
                rowNo:'',
                customerDepartmentCode:'',
            })
            $("#sakujo").attr("disabled",true);
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
        const {topCustomerSuggestions , topCustomerValue , customerDepartmentNameSuggestions , customerDepartmentNameValue , customerDepartmentList} = this.state;
        //上位お客様連想
        const topcustomerInputProps = {
			placeholder: "例：富士通",
			value: topCustomerValue,
            onChange: this.onDevelopement1Change,
            id:"topCustomerNameShita",
            
        };
        //部門の連想
        const customerDepartmentNameInputProps = {
			placeholder: "例：第一事業部",
			value: customerDepartmentNameValue,
            onChange: this.onDevelopementDepartmentChange,
            id:"customerDepartmentName",
            
        };
        //テーブルの列の選択
        const selectRow = {
            mode: 'radio',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,  // click to select, default is false
            clickToExpand: true,// click to expand row, default is false
            onSelect:this.handleRowSelect,
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
        deleteBtn: this.createCustomDeleteButton,
        onDeleteRow: this.onDeleteRow,
        };
        return (
            <div style={{"background":"#f5f5f5"}}>
            <div style={{"background":"#f5f5f5"}}>
                <Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" 
                onHide={this.handleHideModal.bind(this,"bankInfo")} show={this.state.showBankInfoModal}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body >
                <div key={this.props.location.key} >
                                <Router>
                                    <Route exact path={`${this.props.match.url}/`} component={BankInfo} />
                                </Router>
                            </div>
                </Modal.Body>
                </Modal>
                <Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" 
                onHide={this.handleHideModal.bind(this,"customerInfo")} show={this.state.showCustomerInfoModal}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body className="show-grid">
                <div key={this.props.location.key} >
                                <Router>
                                    <Route exact path={`${this.props.match.url}/`} component={TopCustomerInfo} />
                                </Router>
                            </div>
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
                                <Form.Control placeholder="例：秋葉原駅" maxLength="20" id="headOffice" name="headOffice" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">設立</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="yyyydd" id="establishmentDate" readOnly name="establishmentDate" />
                                <DatePicker
                                selected={this.state.establishmentDate}
                                onChange={this.establishmentDateChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="on"
                                locale="pt-BR"
                                showYearDropdown
                                yearDropdownItemNumber={15}
                                scrollableYearDropdown
                                showMonthYearPicker
                                showFullMonthYearPicker
                                // minDate={new Date()}
                                showDisabledMonthNavigation
                                className={"dateInput"}
                                id="establishmentDateSelect"
                                locale="ja"
                                />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">取引開始日</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="yyyydd" id="businessStartDate" readOnly name="businessStartDate" />
                                <DatePicker
                                selected={this.state.businessStartDate}
                                onChange={this.businessStartDateChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="on"
                                locale="pt-BR"
                                showYearDropdown
                                yearDropdownItemNumber={15}
                                scrollableYearDropdown
                                showMonthYearPicker
                                showFullMonthYearPicker
                                // minDate={new Date()}
                                showDisabledMonthNavigation
                                className={"dateInput"}
                                id="businessStartDateSelect"
                                locale="ja"
                                />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">上位お客様</InputGroup.Text>
                            </InputGroup.Prepend>
                                {/* <Form.Control placeholder="上位お客様" id="topCustomer" name="topCustomer" /> */}
                                <Autosuggest
                                    suggestions={topCustomerSuggestions}
                                    onSuggestionsFetchRequested={this.onDlt1SuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onDlt1SuggestionsClearRequested}
                                    onSuggestionSelected={this.onDlt1SuggestionSelected}
                                    getSuggestionValue={getSuggestionDlt1}
                                    renderSuggestion={renderSuggestion}
                                    inputProps={topcustomerInputProps}                                    
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
                                <Form.Control as="select" placeholder="お客様ランキング" id="customerRankingCode" name="customerRankingCode" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">上場会社</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="上場会社" id="listedCompany" name="listedCompany">
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
                                <Form.Control maxLength="20" placeholder="例：田中" id="PurchasingManagers" name="PurchasingManagers" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">メール</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control maxLength="50" placeholder="xxxxxxxxx@xxx.xxx.com" id="PurchasingManagersOfmail" name="PurchasingManagersOfmail" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">支払サイト</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="支払サイト" id="paymentsiteCode" name="paymentsiteCode" />
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
                                <Button  block size="sm" id="reset" onClick={customerInfoJs.reset} >
                                    リセット
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
                                <Autosuggest
                                        suggestions={customerDepartmentNameSuggestions}
                                        onSuggestionsFetchRequested={this.onDltDepartmentSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onDltDepartmentSuggestionsClearRequested}
                                        onSuggestionSelected={this.onDltDepartmentSuggestionSelected}
                                        getSuggestionValue={getSuggestionDlt1}
                                        renderSuggestion={renderSuggestion}
                                        inputProps={customerDepartmentNameInputProps}                                    
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
                                <Button block size="sm" onClick={this.meisaiToroku} variant="primary" id="meisaiToroku" type="button">
                                    部署登録
                                </Button>
                        </Col>
                        <Col sm={1} className="text-center">
                                <Button  block size="sm" id="meisaiReset" >
                                    リセット
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
                    <BootstrapTable selectRow={ selectRow } pagination={ true } options={ options } data={customerDepartmentList}>
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
                <input type="hidden" id="shoriKbn" name="shoriKbn"/>
                </Form>
            </div>
                <Row>
                    <Col sm={11}></Col>
                    <Col sm={1}>
                        <Button size="sm" block onClick={this.toroku}  variant="primary" id="toroku" type="button">
                            登録
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CustomerInfo;