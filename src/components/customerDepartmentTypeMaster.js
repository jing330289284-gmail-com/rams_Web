import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios'

class CustomerDepartmentTypeMaster extends Component {
    state = {  }

    /**
     * 登録ボタン
     */
    toroku =()=>{
        var departmentTypeMod = {};
        if ($("#departmenttypeName").val() ==="") {
             alert("部署名を入力してください");
        }else{
            departmentTypeMod["customerDepartmenttypeRemark"] = $("#departmenttypeRemark").val();
            departmentTypeMod["customerDepartmentName"] = $("#departmenttypeName").val();
            departmentTypeMod["updateUser"] = sessionStorage.getItem("employeeNo");
            axios.post("http://127.0.0.1:8080/customerDepartmentTypeMaster/toroku" , departmentTypeMod)
                .then(function (result) {
                    if(result.data){
                        alert("登录成功");
                        window.location.reload();
                    }else{
                        alert("部署已存在"); 
                    }
                })
                .catch(function (error) {
                    alert("页面加载错误，请检查程序");
                }); 
            }
         
    }
    /**
     * リセットボタン
     */
    reset =()=>{
        $("#departmenttypeName").val("");
        $("#departmenttypeRemark").val("");
    }
    render() {
        return (
            <div className="container col-7">
                <Row inline="true">
                    <Col sm={18} className="text-center">
                    <h2>お客様部署マスタ登録</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                    </Col>
                    <Col sm={7}>
                   {/*  <p id="departmentTypeMasterErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★</p> */}
                    </Col>
                </Row>
                <Form id="departmentTypeMasterForm">
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">部門名称</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="部門名称" id="departmenttypeName" name="departmenttypeName"/>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">備　　考</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="備考" id="departmenttypeRemark" name="departmenttypeRemark"/>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    
                    <Col sm={3}></Col>
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={this.toroku} variant="primary" id="toroku" type="button">
                                    登録
                                </Button>
                        </Col>
                        <Col sm={4} className="text-center">
                                <Button  block size="sm" onClick={this.reset} id="reset" >
                                    リセット
                                </Button>
                        </Col>
                </Row>
                </Form>
            </div>
        );
    }
}

export default CustomerDepartmentTypeMaster;