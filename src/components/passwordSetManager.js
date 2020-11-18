import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button } from 'react-bootstrap';
import $, { isNumeric } from 'jquery';
import axios from 'axios';
import { faSave, faUndo, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorsMessageToast from './errorsMessageToast';
axios.defaults.withCredentials = true;

class PasswordSetManager extends Component {
	/**
	 * パスワードリセット画面（管理者画面用）
	 */

	state = {
		actionType: '',
	}
	constructor(props) {
		super(props);
	}

    /**
     * 画面初期化
     */
	componentDidMount() {
		var actionType = '';
		var password = '';
		//社員情報登録からの場合
		actionType = this.props.actionType;//父画面のパラメータ（処理区分）
		password = this.props.passwordSetInfo;//父画面のパラメータ（画面既存の新パスワード）
		if (password !== null && password !== '') {
			$("#newPassword").val(password);
			$("#passwordCheck").val(password);
		}
		if (this.props.employeeFristName === undefined || this.props.employeeLastName === undefined) {
			$('#passwordEmployeeName').val(" ");
		} else {
			document.getElementById("passwordEmployeeName").innerHTML = this.props.employeeFristName + this.props.employeeLastName;
		}

		document.getElementById("passwordEmployeeNo").innerHTML = this.props.employeeNo;

		// }
		if (actionType === "update") {
			document.getElementById("passwordSetText").innerHTML = "新しいパスワード";
			document.getElementById("toroku").innerHTML = "更新";
		}

	}
    /**
     * パスワード登録
     */
	passwordToroku = () => {
		var reg = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]{8,}$/;
		var actionType = this.props.actionType;
		if ($("#newPassword").val() == "") {
			this.setState({ "errorsMessageShow": true, errorsMessageValue: "パスワード入力してください" });
		}
		else if ($("#passwordCheck").val() == "") {
			this.setState({ "errorsMessageShow": true, errorsMessageValue: "パスワード再確認入力してください" });
		}
		else if (!reg.test($("#newPassword").val())) {
			this.setState({ "errorsMessageShow": true, errorsMessageValue: "8桁以上、大文字、小文字、数字、記号を含めてパスワードを入力してください" });
		}
		else {
			if ($("#newPassword").val() === $("#passwordCheck").val()) {
				if (actionType == 'update') {
					this.props.passwordToroku($("#newPassword").val());
				}
				if (actionType == 'insert') {
					this.props.passwordToroku($("#newPassword").val());
				}
			}
			else {
				this.setState({ "errorsMessageShow": true, errorsMessageValue: "パスワード再確認と新しいパスワードが間違いため、チェックしてください" });
			}
		}


	}
	render() {
		const { errorsMessageValue } = this.state
		return (
			<div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<Row inline="true">
					<Col className="text-center" >
						<h2>パースワード設定</h2>
					</Col>
				</Row>
				<br />
				<Form id="passwordSetForm">
					<Row>
						<Col >
							<InputGroup size="sm" className="mb-3">
								社員名：<a id="passwordEmployeeName" name="passwordEmployeeName"></a>
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col >
							<InputGroup size="sm" className="mb-3">
								社員番号： <a id="passwordEmployeeNo" name="passwordEmployeeNo"></a>
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col >
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="passwordSetText" style={{ "width": this.props.actionType === "update" ? "8rem" : "7.5rem" }}>パスワード設定</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control type="password" id="newPassword" name="newPassword" />
							</InputGroup>
						</Col>
						<font color="red" >★</font>
					</Row>
					<Row>
						<Col >
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm" style={{ "width": "8.5rem" }}>パスワード再確認</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control type="password" id="passwordCheck" a name="passwordCheck" />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col className="text-center">
							<Button size="sm" onClick={this.passwordToroku.bind(this)} variant="info" id="toroku" type="button">
								<FontAwesomeIcon icon={this.props.actionType === "update" ? faEdit : faSave} /> 登録
                                </Button>
							{' '}
							<Button size="sm" id="reset" type="reset" variant="info">
								<FontAwesomeIcon icon={faUndo} /> リセット
                                </Button>
						</Col>
					</Row>
				</Form>
				<input type="hidden" id="actionType" name="actionType" />
			</div>
		);
	}
}

export default PasswordSetManager;