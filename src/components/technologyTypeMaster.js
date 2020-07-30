import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios'

class TechnologyTypeMaster extends Component {
    state = {  }
    componentDidMount(){
        this.onloadPage();
    }
    onloadPage =()=>{
        axios.post("http://127.0.0.1:8080/technologyTypeMaster/onloadPage")
            .then(function (result) {
                $("#technologytypeCode").val(result.data + 1);
            })
            .catch(function (error) {
                alert("页面加载错误，请检查程序");
            });  
    }
    toroku =()=>{
        var technologyTypeMod = {};
        technologyTypeMod["technologytypeCode"] = $("#technologytypeCode").val();
        technologyTypeMod["technologytypeName"] = $("#technologytypeName").val();
        technologyTypeMod["updateUser"] = sessionStorage.getItem("employeeNo");
        axios.post("http://127.0.0.1:8080/technologyTypeMaster/toroku" , technologyTypeMod)
            .then(function (result) {
                if(result.data){
                    alert("登录成功");
                    window.location.reload();
                }else{
                    alert("開発言語已存在"); 
                }
            })
            .catch(function (error) {
                alert("页面加载错误，请检查程序");
            });  
    }
    reset =()=>{
        $("#technologytypeName").val("");
    }
    render() {
        return (
            <div className="container col-7">
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>言語マスタ登録</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                    </Col>
                    <Col sm={7}>
                    <p id="technologyTypeMasterErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★</p>
                    </Col>
                </Row>
                <Form id="technologyTypeMasterForm">
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">言語番号</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="言語番号" id="technologytypeCode" name="technologytypeCode" readOnly/>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control placeholder="言語番号" id="technologytypeName" name="technologytypeName"/>
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
                        <Col sm={3} className="text-center">
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

export default TechnologyTypeMaster;