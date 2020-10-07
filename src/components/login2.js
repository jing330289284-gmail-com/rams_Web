import React, { Component } from 'react';
import '../asserts/css/login.css';
import title from '../asserts/images/LYCmark.png';
import $ from 'jquery'
import axios from 'axios';
import { Row, Col, Form, Button } from 'react-bootstrap';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
axios.defaults.withCredentials = true;

class Login2 extends Component {
	state = {
		yztime: 59,
		btnDisable: false,
		time: 60,
		buttonText: "パスワード忘れたの場合",
		message: '',
		type: '',
		myToastShow: false,
		errorsMessageShow: false,
		errorsMessageValue: '',
	}
	componentWillMount() {
		$("#sendVerificationCode").attr("disabled", true);
		$("#login").attr("disabled", true);
		axios.post("http://127.0.0.1:8080/login2/init")
			.then(resultMap => {
				if (resultMap.data) {
					this.props.history.push("/subMenu");
				}
			})
	}
	/**
	 * ログインボタン
	 */
	login = () => {
		var loginModel = {};
		loginModel["employeeNo"] = $("#employeeNo").val();
		loginModel["password"] = $("#password").val();
		loginModel["verificationCode"] = $("#verificationCode").val();
		axios.post("http://127.0.0.1:8080/login2/login", loginModel)
			.then(result => {
				if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {//ログイン成功
					this.props.history.push("/subMenu");
				} else {//ログイン失敗
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				}
			})
			.catch(function (error) {
				this.setState({ "errorsMessageShow": true, errorsMessageValue: "程序错误" });
			})
	}
	render() {
		const { message, type, errorsMessageValue } = this.state
		let timeChange;
		let ti = this.state.time;
		//关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
		const clock = () => {
			if (ti > 0) {
				//当ti>0时执行更新方法
				ti = ti - 1;
				this.setState({
					time: ti,
					buttonText: ti + "s後再発行",
				});
			} else {
				//当ti=0时执行终止循环方法
				clearInterval(timeChange);
				this.setState({
					btnDisable: false,
					time: 60,
					buttonText: "パスワード忘れたの場合",
				});
			}
		};

		const sendMail = () => {
			var loginModel = {};
			loginModel["employeeNo"] = $("#employeeNo").val();
			axios.post("http://127.0.0.1:8080/login2/sendMail", loginModel)
				.then(result => {
					if (result.data.errorsMessage !== null && result.data.errorsMessage !== undefined) {
						this.setState({ errorsMessageShow: true, errorsMessageValue: result.data.errorsMessage });
					} else {
						this.setState({ "myToastShow": true, "type": "success", "errorsMessageShow": false, message: "事前に登録したメールにパスワードリセットURLが発信しました!" });
						setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						this.setState({
							btnDisable: true,
							buttonText: "60s後再発行",
						});
						$("#verificationCode").attr("readOnly", false);
						$("#login").attr("disabled", false);
						//每隔一秒执行一次clock方法
						timeChange = setInterval(clock, 1000);
					}
				})
		};
		return (
			<div className="loginBody" >
				<div style={{ "marginTop": "10%" }}>
					<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
						<MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
					</div>
					<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
						<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
					</div>
					<div style={{ "textAlign": "center" }}>
						<img className="mb-4" alt="title" src={title} />{"   "}<a className="loginMark">LYC株式会社</a>
					</div>
					<Form className="form-signin" id="loginForm">
						<Form.Group>
							<Form.Control id="employeeNo" name="employeeNo" maxLength="6" type="text" placeholder="社员番号" onChange={this.setReadOnly} />
							<Form.Control id="password" name="password" maxLength="12" type="password" placeholder="Password" onChange={this.setReadOnly} />
						</Form.Group>
					</Form>
					<div className="form-signin">
						<div className="text-center">
							<button onClick={sendMail} disabled={this.state.btnDisable} className="btn btn-link">{this.state.buttonText}</button>
							<br />
							<Button variant="primary" id="login" block onClick={this.login} type="button">
								ログイン
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Login2;

