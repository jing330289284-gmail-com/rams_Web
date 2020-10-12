import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, Container } from 'react-bootstrap';
import MyToast from './myToast';
import $ from 'jquery';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios';
import { faSave, faUndo, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';

class PasswordSetEmployee extends Component {
    state = {
        oldPassword:'',//既存パスワード
        newPassword:'',//新しいパスワード
        passwordCheck:'',//パスワード再確認
        message: '',//toastのメッセージ
        type: '',//成功や失敗
        myToastShow: false,//toastのフラグ
        errorsMessageShow: false,///エラーのメッセージのフラグ
        errorsMessageValue: '',//エラーのメッセージ
    }
    constructor(props) {
        super(props);
    }

    /**
     * 画面初期化
     */
    componentDidMount() {
        this.props.fetchDropDown();
    }
    //onchange
    valueChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }
    toroku=()=>{
        var passwordSetEmployeeModel = {};
        var formArray = $("#passwordSetForm").serializeArray();
        $.each(formArray, function (i, item) {
            passwordSetEmployeeModel[item.name] = item.value;
        });
        axios.post(this.props.serverIP + "/passwordSetEmployee/passwordReset" , passwordSetEmployeeModel)
        .then(resultMap => {
            if (resultMap.data.errorsMessage !== null && resultMap.data.errorsMessage !== undefined ) {
                this.setState({ "errorsMessageShow": true, errorsMessageValue: resultMap.data.errorsMessage });
            }else{
                this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: resultMap.data.message });
                setTimeout(() => this.setState({ "myToastShow": false }), 3000);
                window.location.reload();
            }
        })
    }
    /**
     * パスワード登録
     */
    render() {
        const {oldPassword , newPassword , passwordCheck , message , type , errorsMessageValue}=this.state;
        return (
            <div className="col-sm-4 container" style={{ "marginTop": "5%" }}>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
                </div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <Row inline="true">
                    <Col className="text-center">
                        <h2>パースワード設定</h2>
                    </Col>
                </Row>
                <br />
                <Form id="passwordSetForm">
                    <Row>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="passwordSetText">既存パースワード</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="password" onChange={this.valueChange} value={oldPassword} name="oldPassword"/>
                            </InputGroup>
                        </Col>
                        <font color="red"
                        >★</font>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="passwordSetText">新しいパスワード</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="password" onChange={this.valueChange} value={newPassword} name="newPassword"/>
                            </InputGroup>
                        </Col>
                        <font color="red"
                        >★</font>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">パスワード再確認</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="password" onChange={this.valueChange} value={passwordCheck} name="passwordCheck"/>
                            </InputGroup>
                        </Col>
                        <font color="red"
                        >★</font>
                    </Row>
                    <div className="text-center">
                        <Button size="sm" variant="info" id="toroku" type="button" onClick={this.toroku}>
                            <FontAwesomeIcon icon={faEdit} />登録
                                </Button>{" "}
                        <Button size="sm" id="reset" type="reset" variant="info">
                            <FontAwesomeIcon icon={faUndo} />リセット
                                </Button>
                    </div>
                </Form>
                <input type="hidden" id="actionType" name="actionType" />
            </div>
        );
    }
}
const mapStateToProps = state => {
	return {
		serverIP: state.data.dataReques[state.data.dataReques.length-1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(PasswordSetEmployee);