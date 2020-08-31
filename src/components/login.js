import React,{Component} from 'react';
import '../asserts/css/login.css';
import title from '../asserts/images/title.png';
import $ from 'jquery'
import axios from 'axios';
import SubMenu from './subMenu'
import { Row,  Col , Form , Button , InputGroup , FormControl} from 'react-bootstrap';
import { BrowserRouter as Router, Redirect, Route, Link } from "react-router-dom";
axios.defaults.withCredentials=true;

class Login extends Component {
	state = {
		loginFlag:false,//ログインの成功フラグ
		yztime:59,
		loading: false,
		buttonText:"SMSを発信する",
		btnDisable:false,
		time:60,
	}
	componentWillMount(){
		$("#sendVerificationCode").attr("disabled",true);
		$("#login").attr("disabled",true);
		axios.post("http://127.0.0.1:8080/login/init")
		.then(resultMap =>{
			if(resultMap.data){
				this.setState({
					loginFlag:true,
				})
			}
		})
	}
	/**
	 * ログインボタン
	 */
	login = () =>{
		var loginModel = {};
		loginModel["employeeNo"] = $("#employeeNo").val();
		loginModel["password"] = $("#password").val();
		loginModel["verificationCode"] = $("#verificationCode").val();
		axios.post("http://127.0.0.1:8080/login/login",loginModel)
		.then(resultMap =>{
			var employeeModel = resultMap.data.employeeModel;		
			if(employeeModel !== null){//ログイン成功
				this.setState({
					loginFlag:true,
				})
			}else{//ログイン失敗
				alert("入力した社員番号やパスワードや認証番号が間違いため、ログインできません");
			}
			})
			.catch(function (error) {
				alert("登录错误，请检查程序");
			});
	}
	/**
	 * 画面初期化
	 */
	componentDidMount(){
	}
    render() {
		let timeChange;
		let ti = this.state.time;
		//关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
		const clock =()=>{
		  if (ti > 0) {
			//当ti>0时执行更新方法
			 ti = ti - 1;
			 this.setState({
				time: ti,
				buttonText: ti + "s後再発行",
			  });
		  }else{
			//当ti=0时执行终止循环方法
			clearInterval(timeChange);
			this.setState({
			  btnDisable: false,
			  time: 60,
			  buttonText: "发送验证码",
			});
		  }
		};
	
		const sendCode = () =>{
		  var loginModel = {};
		  loginModel["employeeNo"] = $("#employeeNo").val();
		  loginModel["password"] = $("#password").val();
		  if($("#employeeNo").val() !== null && $("#password").val() !== null && 
		  		$("#employeeNo").val() !== '' && $("#password").val() !== ''){
					axios.post("http://127.0.0.1:8080/login/sendVerificationCode",loginModel)
					.then(resultMap =>{
						if(!resultMap.data){
							alert("社員番号またはパスワードが間違いため、認証番号は発送できません");
						}else{
							this.setState({
								btnDisable: true,
								buttonText: "60s後再発行",
							  });
							$("#verificationCode").attr("readOnly",false);
							$("#login").attr("disabled",false);
							//每隔一秒执行一次clock方法
							  timeChange = setInterval(clock,1000);
						}
					})
		  } else if($("#employeeNo").val() === null || $("#password").val() === null || 
		  				$("#employeeNo").val() === '' || $("#password").val() === ''){
							alert("社員番号とパスワードを入力してください。");
		  }
		};
		if(this.state.loginFlag){
			return (
				<Route path="/" component={Login}>
					<Redirect to="/subMenu" component={SubMenu}/>
				</Route>
			)
		}else{
			return (
				<div style={{marginTop:"10%"}}>
					<Row>
						<Col sm={5}></Col>
						<Col sm={7}>
							<img className="mb-4" alt="title" src={title}/>
						</Col>
					</Row>
				<Form className="form-signin" id="loginForm">
					<Form.Group controlId="formBasicEmail" >
						{/* <img className="mb-4" alt="title" src={title}/> */}
						<Form.Control id="employeeNo" name="employeeNo" maxLength="6" type="text" placeholder="社员番号" onChange={this.setReadOnly} required/>
						<Form.Control id="password" name="password" maxLength="12" type="password" placeholder="Password" onChange={this.setReadOnly} required/>
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
				<Form className="form-check">

				</Form>
				</div>
				)
			}
		}     
}

export default Login;

