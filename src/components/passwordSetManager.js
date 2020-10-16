import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button } from 'react-bootstrap';
import $, { isNumeric } from 'jquery';
import axios from 'axios';
import { faSave, faUndo, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/**
 * パスワードリセット画面（管理者画面用）
 */
class PasswordSet extends Component {
    state = { 
        actionType:'',
     }
     constructor(props){
        super(props);
    }

    /**
     * 画面初期化
     */
    componentDidMount(){
        var actionType = '';
        var password = '';
        //社員情報登録からの場合
            actionType = this.props.actionType;//父画面のパラメータ（処理区分）
            password = this.props.passwordSetInfo;//父画面のパラメータ（画面既存の新パスワード）
            if(password !== null && password !== ''){
                $("#newPassword").val(password);
                $("#passwordCheck").val(password);
            }
            if(this.props.employeeFristName===undefined||this.props.employeeLastName===undefined){
                $('#passwordEmployeeName').val(" "); 
             }else{
                 document.getElementById("passwordEmployeeName").innerHTML =  this.props.employeeFristName + this.props.employeeLastName;
                }
            
            document.getElementById("passwordEmployeeNo").innerHTML =  this.props.employeeNo;
          
        // }
        if(actionType === "update"){

            document.getElementById("passwordSetText").innerHTML = "新しいパスワード";
            document.getElementById("toroku").innerHTML = "更新";
        }

    }
    /**
     * パスワード登録
     */
    passwordToroku=()=>{
        var reg = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]{8,}$/;
        var actionType=this.props.actionType;
        if(!reg.test($("#newPassword").val())){
            document.getElementById("passwordSetErorMsg").innerHTML = "パスワード書式再確認してください";
            document.getElementById("passwordSetErorMsg").style = "visibility:visible";
        }
        else{
        if($("#newPassword").val() === $("#passwordCheck").val()){
        if(actionType =='update'){
                this.props.passwordToroku($("#newPassword").val());         
        }
        if(actionType =='insert'){
            this.props.passwordToroku($("#newPassword").val());
        }
    }
        else{
            document.getElementById("passwordSetErorMsg").style = "visibility:visible";
            document.getElementById("passwordSetErorMsg").innerHTML = "パスワード再確認と新しいパスワードが間違いため、チェックしてください"
     }
    }
    
   
}
    render() {
        return (
            <div>
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>パースワード設定</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                    </Col>
                    <Col sm={7}>
                    <p id="passwordSetErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★</p>
                    </Col>
                </Row>
                <Form id="passwordSetForm">
                <Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                        社員名：
                                <a id="passwordEmployeeName" name="passwordEmployeeName"></a>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                        社員番号：
                                <a id="passwordEmployeeNo" name="passwordEmployeeNo"></a>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="passwordSetText">パスワード設定{'\u00A0'}{'\u00A0'}{'\u00A0'}</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control type="password" id="newPassword" name="newPassword" />
                        </InputGroup>
                    </Col>
                    <font  color="red"
				                >★</font>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">パスワード再確認</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control type="password" id="passwordCheck"a name="passwordCheck" />
                        </InputGroup>                       
                    </Col>
                    <font>{'\u00A0'}{'\u00A0'}{'\u00A0'}</font>
                </Row>
                <Row>
                    <Col sm={3}></Col>
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={this.passwordToroku.bind(this)} variant="info" id="toroku" type="button">
                                <FontAwesomeIcon icon={faEdit} />登録
                                </Button>
                        </Col>
                        <Col sm={3} className="text-center">
                                <Button  block size="sm" id="reset" type="reset" variant="info">
                                <FontAwesomeIcon icon={faEdit} />リセット
                                </Button>
                        </Col>
                </Row>
                </Form>
                <input type="hidden" id="actionType" name="actionType"/>
            </div>
        );
    }
}

export default PasswordSet;