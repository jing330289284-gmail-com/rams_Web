import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl} from 'react-bootstrap';
import * as TopCustomerInfoJs from '../components/topCustomerInfoJs.js';
import $ from 'jquery';

class TopCustomerInfo extends Component {
    state = {  }

    componentDidMount(){
        $("#shoriKbn").val( this.props.location.state);
        TopCustomerInfoJs.onload();
    }
    render() {
        return (
            <div >
            <div >
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>上位お客様情報</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                    </Col>
                    <Col sm={7}>
                    <p id="topCustomerInfoErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★</p>
                    </Col>
                </Row>
                <Form id="topCustomerInfoForm">
                <Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">上位お客様番号</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="お客様番号" id="topCustomerNo" name="topCustomerNo" readOnly/>
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="例：富士通" id="topCustomerName" name="topCustomerName" /><font  color="red"
				                style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">URL</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="www.123321.com" id="topUrl" name="topUrl"/>
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="備考" id="topRemark" name="topRemark" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}></Col>
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={TopCustomerInfoJs.toroku} variant="primary" id="toroku" type="button">
                                    登録
                                </Button>
                        </Col>
                        <Col sm={3} className="text-center">
                                <Button  block size="sm" id="reset" onClick={TopCustomerInfoJs.reset} >
                                    リセット
                                </Button>
                        </Col>
                </Row>
                </Form>
                <input type="hidden" id="shoriKbn" name="shoriKbn"/>
            </div>
            </div>
        );
    }
}

export default TopCustomerInfo;