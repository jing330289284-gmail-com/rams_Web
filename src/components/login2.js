import React,{Component} from 'react';
import '../asserts/css/login.css';
import title from '../asserts/images/title.png';
import $ from 'jquery'
import axios from 'axios';
import { Row,  Col , Form , Button } from 'react-bootstrap';
axios.defaults.withCredentials=true;

class Login2 extends Component {
	state = {
		yztime:59,
		btnDisable:false,
		time:60,
	}
	// componentWillMount(){
	// 	$("#sendVerificationCode").attr("disabled",true);
	// 	$("#login").attr("disabled",true);
	// 	axios.post("http://127.0.0.1:8080/login/init")
	// 	.then(resultMap =>{
	// 		if(resultMap.data){
	// 			this.props.history.push("/subMenu");
	// 		}
	// 	})
	// }
	/**
	 * ログインボタン
	 */
	login = () =>{
		if($("#employeeNo").val() !== null && $("#password").val() !== null && 
			$("#employeeNo").val() !== '' && $("#password").val() !== '' &&
				$("#verificationCode").val() !== '' && $("#verificationCode").val() !== null){
					var loginModel = {};
					loginModel["employeeNo"] = $("#employeeNo").val();
					loginModel["password"] = $("#password").val();
					loginModel["verificationCode"] = $("#verificationCode").val();
					axios.post("http://127.0.0.1:8080/login/login",loginModel)
					.then(resultMap =>{
						var employeeModel = resultMap.data.employeeModel;		
						if(employeeModel !== null){//ログイン成功
							this.props.history.push("/subMenu");
						}else{//ログイン失敗
							alert("入力した社員番号やパスワードや認証番号が間違いため、ログインできません");
						}
						})
						.catch(function (error) {
							alert("登录错误，请检查程序");
						});
		}else{
			alert("社員番号とパスワードと検証番号を入力してください");
		}
		
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
	
		const sendMail = () =>{
		  var loginModel = {};
		  loginModel["employeeNo"] = $("#employeeNo").val();
		  if($("#employeeNo").val() !== null && $("#employeeNo").val() !== ''){
					axios.post("http://127.0.0.1:8080/login2/sendMail",loginModel)
					.then(resultMap =>{
						if(!resultMap.data){
							alert("発信失敗、社員番号またはネット環境をチェックしてください");
						}else{
							alert("事前に登録したメールにパスワードリセットURLが発信しました");
							this.setState({
								btnDisable: true,
							  });
							$("#verificationCode").attr("readOnly",false);
							$("#login").attr("disabled",false);
							//每隔一秒执行一次clock方法
							  timeChange = setInterval(clock,1000);
						}
					})
		  } else if($("#employeeNo").val() === null || $("#employeeNo").val() === ''){
				alert("社員番号を入力してください。");
		  }
		};
		return (
			<div style={{marginTop:"10%"}}>
				<Row>
					<Col sm={5}></Col>
					<Col sm={7}>
						<img className="mb-4" alt="title" src={title}/>
					</Col>
				</Row>
			<Form className="form-signin" id="loginForm">
				<Form.Group>
					<Form.Control id="employeeNo" name="employeeNo" maxLength="6" type="text" placeholder="社员番号" onChange={this.setReadOnly}/>
					<Form.Control id="password" name="password" maxLength="12" type="password" placeholder="Password" onChange={this.setReadOnly}/>
				</Form.Group>
			</Form>
                <div className="text-center form-signin">
                    <button onClick={sendMail}　disabled={this.state.btnDisable} className="btn btn-link">パスワード忘れたの場合</button>
				<br/>
				<Button variant="primary" id="login" block onClick={this.login} type="button">
					ログイン
				</Button>
                </div>
			</div>
			)
		}
}

export default Login2;

