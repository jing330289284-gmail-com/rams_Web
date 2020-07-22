import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl , OverlayTrigger , Tooltip , Container , Modal} from 'react-bootstrap';
import * as customerInfoJs from '../components/CustomerInfoJs.js';
import $ from 'jquery';
import BankInfo from './bankInfo';
import TopCustomerInfo from './topCustomerInfo';
import { BrowserRouter as Router, Route, Link ,Switch } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';

class CustomerInfo extends Component {
    state = {
        showBankInfoModal:false,
        showCustomerInfoModal:false,
        establishmentDate: new Date(),
        businessStartDate: new Date(),
     }
    //日期更改
    establishmentDateChange = date => {
    this.setState({
        establishmentDate: date,
    });
        let month = date.getMonth() + 1;
        $("#establishmentDate").val(date.getFullYear() + '' + (month < 10 ? '0'+month: month));
    
    };
    businessStartDateChange = date => {
        this.setState({
            businessStartDate: date,
        });
            let month = date.getMonth() + 1;
            let day = date.getDate();
            $("#businessStartDate").val(date.getFullYear() + '' + (month < 10 ? '0'+month: month) + '' + (day < 10 ? '0'+day: day));
        
        };
     constructor(props){
         super(props);
         this.handleShowModal = this.handleShowModal.bind(this);
         this.handleShowModal = this.handleShowModal.bind(this);
     }
     handleHideModal=(Kbn)=>{
         if(Kbn === "bankInfo"){
            this.setState({showBankInfoModal:false})
         }else if(Kbn === "customerInfo"){
            this.setState({showCustomerInfoModal:false})
         }
     }
     handleShowModal=(Kbn)=>{
        if(Kbn === "bankInfo"){
            this.setState({showBankInfoModal:true})
         }else if(Kbn === "customerInfo"){
            this.setState({showCustomerInfoModal:true})
         }
     }
    componentDidMount(){
        $("#shoriKbn").val( this.props.location.state);
        $("#customerNo").val('C002');
        customerInfoJs.onload();
    }
    render() {
        console.log(this.props)
        return (
            <div className="container col-8" style={{"background":"#f5f5f5"}}>
            <div className="container col-10" style={{"background":"#f5f5f5"}}>
                <Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" 
                onHide={this.handleHideModal.bind(this,"bankInfo")} show={this.state.showBankInfoModal}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body className="show-grid">
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
                    <Col sm={3}>
                        <Button size="sm" id="toBankInfo" onClick={this.handleShowModal.bind(this,"bankInfo")}>
                            お客様口座情報
                        </Button>
                    </Col>
                    <Col sm={2}>
                        <Button size="sm" id="toCustomerInfo" onClick={this.handleShowModal.bind(this,"customerInfo")}>
                            上位お客様
                        </Button>
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
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様番号</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="お客様番号" id="customerNo" name="customerNo" readOnly/>
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="お客様名" id="customerName" onChange={customerInfoJs.toDisabed} name="customerName" /><font  color="red"
				style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">本社場所</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="本社場所" id="headOffice" name="headOffice" />
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">設立</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="設立" id="establishmentDate" readOnly name="establishmentDate" />
                                <DatePicker
                                selected={this.state.establishmentDate}
                                onChange={this.establishmentDateChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="on"
                                locale="pt-BR"
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
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">取引開始日</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="取引開始日" id="businessStartDate" readOnly name="businessStartDate" />
                                <DatePicker
                                selected={this.state.businessStartDate}
                                onChange={this.businessStartDateChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="on"
                                locale="pt-BR"
                                showFullMonthYearPicker
                                // minDate={new Date()}
                                showDisabledMonthNavigation
                                className={"dateInput"}
                                id="businessStartDateSelect"
                                locale="ja"
                                />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様ランキング</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="お客様ランキング" id="customerRankingCode" name="customerRankingCode" />
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">上場会社</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="上場会社" id="listedCompany" name="listedCompany">
                                <option value="0">はい</option>
                                <option value="1">いいえ</option>
                                </Form.Control>
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">会社性質</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control as="select" placeholder="会社性質" id="companyNatureCode" name="companyNatureCode" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">URL</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="URL" id="url" name="url" />
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">上位お客様</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="上位お客様" id="topCustomer" name="topCustomer" />
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="備考" id="remark" name="remark" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}></Col>
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={customerInfoJs.toroku}  variant="primary" id="toroku" type="button">
                                    登録
                                </Button>
                        </Col>
                        <Col sm={3} className="text-center">
                                <Button  block size="sm" id="reset" onClick={customerInfoJs.reset} >
                                    リセット
                                </Button>
                        </Col>
                </Row>
                <input type="hidden" id="employeeNo" name="employeeNo"/>
                <input type="hidden" id="shoriKbn" name="shoriKbn"/>
                </Form>
            </div>
            </div>
        );
    }
}

export default CustomerInfo;