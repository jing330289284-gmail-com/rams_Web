import React, { Component } from 'react';
import '../asserts/css/login.css';
import title from '../asserts/images/LYCmark.png';
import $ from 'jquery'
import axios from 'axios';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';

axios.defaults.withCredentials = true;
/**
 * 管理者ログイン画面
 * 20201019 劉林涛
 */
class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
			yztime: 59,
			buttonText: "SMSを発信する",
			btnDisable: false,
			time: 60,
			errorsMessageShow: false,
			errorsMessageValue: '',
		}
	};

	componentWillMount() {
		$("#sendVerificationCode").attr("disabled", true);
		$("#login").attr("disabled", true);
		axios.post(this.state.serverIP + "login/init")
			.then(resultMap => {
				if (resultMap.data) {
					this.props.history.push("/subMenuManager");
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
		axios.post(this.state.serverIP + "login/login", loginModel)
			.then(result => {
				if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
					this.props.history.push("/subMenuManager");
				} else {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				}
			})
			.catch(function (error) {
				this.setState({ "errorsMessageShow": true, errorsMessageValue: "エラーが発生してしまいました、画面をリフレッシュしてください" });
			});
	}
	render() {
		const { errorsMessageValue, } = this.state;
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
					buttonText: "SMSを発信する",
				});
			}
		};

		const sendCode = () => {
			var loginModel = {};
			loginModel["employeeNo"] = $("#employeeNo").val();
			loginModel["password"] = $("#password").val();
			//axios.post(this.props.serverIP + "login/sendVerificationCode", loginModel)
			axios.post(this.state.serverIP + "login/sendVerificationCode", loginModel)
				.then(result => {
					if (result.data.errorsMessage !== null && result.data.errorsMessage !== undefined) {
						this.setState({ errorsMessageShow: true, errorsMessageValue: result.data.errorsMessage });
					} else {
						this.setState({
							btnDisable: true,
							buttonText: "60s後再発行",
						});
						alert(result.data.verificationCode);
						$("#verificationCode").attr("readOnly", false);
						$("#login").attr("disabled", false);
						//每隔一秒执行一次clock方法
						timeChange = setInterval(clock, 1000);
					}
				})
		};
		return (
			<div className="loginBody">
				<div style={{ "marginTop": "10%" }}>
					<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
						<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
					</div>
					<div style={{ "textAlign": "center" }}>
						<img className="mb-4" alt="title" src={title} />{"   "}<a className="loginMark">LYC株式会社</a>
					</div>
					<Form className="form-signin" id="loginForm">
						<Form.Group controlId="formBasicEmail" >
							<Form.Control id="employeeNo" name="employeeNo" maxLength="6" type="text" placeholder="社员番号" onChange={this.setReadOnly} required />
							<Form.Control id="password" name="password" maxLength="12" type="password" placeholder="Password" onChange={this.setReadOnly} required />
						</Form.Group>
						<InputGroup className="mb-3" size="sm">
							<FormControl
								size="sm"
								placeholder="検証番号"
								id="verificationCode" name="verificationCode"
								readOnly
								required
							/>
							<InputGroup.Append>
								<Button size="sm" variant="info" id="sendVerificationCode" disabled={this.state.btnDisable} onClick={sendCode}>{this.state.buttonText}</Button>
							</InputGroup.Append>
						</InputGroup>
						<Button variant="primary" id="login" onClick={this.login} block type="button">
							ログイン
				</Button>
					</Form>
				</div>
			</div>
		)
	}
}
export default Login;


