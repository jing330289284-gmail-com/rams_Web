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
		// 社員情報登録からの場合
		actionType = this.props.actionType;// 父画面のパラメータ（処理区分）
		password = this.props.passwordSetInfo;// 父画面のパラメータ（画面既存の新パスワード）
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
			document.getElementById("toroku").innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>'+" 更新";
			
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
								<Form.Control type="password" id="newPassword" name="newPassword" maxlength="12"/>
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
								<Form.Control type="password" id="passwordCheck" a name="passwordCheck" maxlength="12"/>
							</InputGroup>
						</Col>
						<font color="white" >★</font>
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