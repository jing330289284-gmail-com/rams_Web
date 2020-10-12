import React,{Component} from 'react';
import { faSave, faUndo, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Row , Form , Col , InputGroup , Button } from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
axios.defaults.withCredentials=true;

class passwordReset extends Component {
    state = { }

    constructor(props){
        super(props);
    }
    componentWillMount(){
        this.props.fetchDropDown();
        const query = this.props.location.search;
        var passwordResetId = query.substring(4);
        var pswMod = {};
        pswMod["passwordResetId"] = passwordResetId;
        axios.post(this.props.serverIP + "passwordReset/init" , pswMod)
		.then(resultMap =>{
			if(!resultMap.data){
				this.props.history.push("/login2");
			}
		})
    }
    passwordReset=()=>{
        const query = this.props.location.search;
        var passwordResetId = query.substring(4);
        var pswMod = {};
        pswMod["passwordResetId"] = passwordResetId;
        pswMod["password"] = $("#newPassword").val();
        if($("#newPassword").val() === $("#passwordCheck").val()){
            axios.post(this.props.serverIP + "passwordReset/passwordReset" , pswMod)
            .then(resultMap =>{
                if(resultMap.data === 0){
                    alert("パスワードリセット成功しました");
                    this.props.history.push("/login2");
                }else if(resultMap.data === 1){
                    alert("パスワードリセット失敗しました");
                }else if(resultMap.data === 2){
                    alert("パスワードリセットIDが失効しました");
                }
            })
        }else if($("#newPassword").val() === null || $("#newPassword").val() === '' ||
                    $("#passwordCheck").val() === null || $("#passwordCheck").val() === ''){
                        alert("パスワードとパスワード確認を入力してください");
        }else if($("#newPassword").val() !== $("#passwordCheck").val()){
            alert("パスワードとパスワード確認が間違いため");
        }

    }
    render() {
        return (
            <div className="mainBody">
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>パースワードリセット</h2>
                    </Col>
                </Row>
                <Row>
                </Row>
                <Form id="passwordSetForm" className="passwordForm">
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>パスワード設定{'\u00A0'}{'\u00A0'}{'\u00A0'}</InputGroup.Text>
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
                                <InputGroup.Text>パスワード再確認</InputGroup.Text>
                            </InputGroup.Prepend>
                                <Form.Control type="password" id="passwordCheck"a name="passwordCheck" />
                        </InputGroup>                       
                    </Col>
                    <font>{'\u00A0'}{'\u00A0'}{'\u00A0'}</font>
                </Row>
                <Row>
                    <Col sm={4}></Col>
                        <Col sm={4} className="text-center">
                                <Button block size="sm" variant="info" onClick={this.passwordReset} id="toroku" type="button">
                                <FontAwesomeIcon icon={faEdit} />パスワードリセット
                                </Button>
                        </Col>
                </Row>
                </Form>
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
export default connect(mapStateToProps, mapDispatchToProps)(passwordReset);