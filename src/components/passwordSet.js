import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';

class PasswordSet extends Component {
    state = { 
        fatherMenu:'',//サブメニュー画面からのフラグ
     }

    /**
     * 画面初期化
     */
    componentDidMount(){
        var actionType = '';
        var password = '';
        if(this.props.location.state.actionType !== null && this.props.location.state.actionType !== ''){//サブメニューからの場合
            actionType = this.props.location.state.actionType;
            document.getElementById("passwordEmployeeName").innerHTML =  sessionStorage.getItem('employeeName');
            this.setState({
                fatherMenu:this.props.location.state.fatherMenu,
            })
        }else{//社員情報登録からの場合
            actionType = this.props.actionType;//父画面のパラメータ（処理区分）
            password = this.props.password;//父画面のパラメータ（画面既存の新パスワード）
            document.getElementById("passwordEmployeeName").innerHTML =  $("#employeeName").val(password);
        }
        if(actionType === "update"){
            if(password !== null && password !== ''){
                $("#newPassword").val(password);
            }
            document.getElementById("passwordSetText").innerHTML = "既存パスワード";
        }else{
            $("#newPassword").attr("disabled",true);
            $("#passwordCheck").attr("disabled",true);
            if(password !== null && password !== ''){
                $("#password").val(password);
            }
        }   
    }
    /**
     * パスワード登録
     */
    passwordToroku=()=>{
        if($("#newPassword").val() === $("#passwordCheck").val()){
            if(this.state.fatherMenu === "subMenu"){//サブメニューからの場合
                var emp = {};
                emp["employeeNo"] = sessionStorage.getItem('employeeNo');
                emp["password"] = $("#newPassword").val();
                emp["oldPassword"] = $("#oldPassword").val();
                axios.post("http://127.0.0.1:8080/resetPassword", emp)
                .then(function (result) {
                    if(result.data){
                        alert("パスワードリセット成功しました");
                        window.location.reload();
                    }else{
                        document.getElementById("passwordSetErorMsg").style = "visibility:visible";
                        document.getElementById("passwordSetErorMsg").innerHTML = "既存パスワードが間違いため、パスワードリセットができません"
                    }
                })
                .catch(function(){
                    alert("页面加载错误，请检查程序");
                })
            }else{//社員情報登録からの場合
                this.props.passwordToroku($("#newPassword").val());
            }
        }else{
            document.getElementById("passwordSetErorMsg").style = "visibility:visible";
            document.getElementById("passwordSetErorMsg").innerHTML = "パスワード再確認と新しいパスワードが間違いため、チェックしてください"
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
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="passwordSetText">パスワード設定</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control type="password" id="oldPassword" name="oldPassword" /><font  color="red"
				                style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">新しいパスワード</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control type="password" id="newPassword" name="newPassword" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">パスワード再確認</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control type="password" id="passwordCheck" name="passwordCheck" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}></Col>
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={this.passwordToroku.bind(this)} variant="primary" id="toroku" type="button">
                                    登録
                                </Button>
                        </Col>
                        <Col sm={3} className="text-center">
                                <Button  block size="sm" id="reset"  >
                                    リセット
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