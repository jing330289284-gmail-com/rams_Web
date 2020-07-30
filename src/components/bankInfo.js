import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , Navbar , OverlayTrigger , Tooltip} from 'react-bootstrap';
import * as bankInfoJs from '../components/bankInfoJs.js';
import $ from 'jquery';

class BankInfo extends Component {
    state = {  }

    componentDidMount(){
        if($("#customerNo").val() === '' || $("#customerNo").val() === null){//社員の場合
            $("#employeeOrCustomerNo").val($("#employeeNo").val())
            $("#accountBelongsStatus").val("0")
            document.getElementById("No").innerHTML  = "社員：" + $("#employeeName").val();
        }else if($("#employeeNo").val() === '' || $("#employeeNo").val() === null){//お客様の場合
            $("#employeeOrCustomerNo").val($("#customerNo").val())
            $("#accountBelongsStatus").val("1")
            document.getElementById("No").innerHTML  = "お客様：" + $("#customerName").val();
        }
        bankInfoJs.onload();//画面初期化
    }
    render() {
        return (
            <div  >
            <div  >
                {/* <Row>
                        <Col sm={2}></Col>
                        <Col sm={7}>
                            <img className="mb-4" alt="title" src={title}/>
                        </Col>
                </Row> */}
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>口座情報</h2>
                    </Col>
                </Row>
                <Row>
                        <Col sm={2}>
                        </Col>
                        <Col sm={9}>
                        <p id="bankInfoErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">1</p>
                        </Col>
                </Row>
                <Form id="bankForm">
                <Row>
                        <Col>
                            <Navbar>
                                    <Navbar.Collapse>
                                        <Navbar.Text>
                                            <a id="No"></a>
                                        </Navbar.Text>
                                </Navbar.Collapse>
                            </Navbar>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">銀行名：</InputGroup.Text>
                                </InputGroup.Prepend>
                                    <Form.Control id="bankCode" name="bankCode" as="select" onChange={bankInfoJs.canSelect}>
                                        <option value="0">銀行を選んでください</option>
                                    </Form.Control>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Check disabled defaultChecked={true}　label="普通" inline="true" type="radio" id="futsu" name="accountTypeStatus" value="0"   />
                            <Form.Check disabled label="当座" inline="true" type="radio" name="accountTypeStatus" id="toza" value="1"   />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">支店名：</InputGroup.Text>
                                </InputGroup.Prepend>
                                    <Form.Control readOnly placeholder="例：浦和支店" onBlur={bankInfoJs.getBankBranchInfo.bind(this,"bankBranchName")} id="bankBranchName" maxLength="20" name="bankBranchName"/>
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">支店番号：</InputGroup.Text>
                                </InputGroup.Prepend>
                                    <Form.Control placeholder="010" onBlur={bankInfoJs.getBankBranchInfo.bind(this,"bankBranchCode")} readOnly id="bankBranchCode" maxLength="3" name="bankBranchCode"/>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">口座番号：</InputGroup.Text>
                                </InputGroup.Prepend>
                                    <Form.Control placeholder="123456" readOnly id="accountNo" maxLength="9" name="accountNo"/>
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">口座名義人：</InputGroup.Text>
                                </InputGroup.Prepend>
                                <OverlayTrigger
                                    overlay={
                                    <Tooltip id="tips" >
                                        片仮名で入力してください
                                    </Tooltip>
                                    }
                                >
                                    <Form.Control placeholder="カタカナ" onChange={bankInfoJs.checkAccountName} readOnly id="accountName" maxLength="20" name="accountName"/>
                                </OverlayTrigger>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3}></Col>
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={bankInfoJs.tokuro}  variant="primary" id="toroku" type="button">
                                登録
                                </Button>
                        </Col>
                        <Col sm={3} className="text-center">
                                <Button onClick={bankInfoJs.setDisabled} block size="sm" type="reset" id="reset" value="Reset" >
                                リセット
                                </Button>
                        </Col>
                    </Row> 
                <input type="hidden" id="employeeOrCustomerNo" name="employeeOrCustomerNo"/>
                <input type="hidden" id="accountBelongsStatus" name="accountBelongsStatus"/>
                </Form>
            </div>
            </div>
        );
    }
}

export default BankInfo;