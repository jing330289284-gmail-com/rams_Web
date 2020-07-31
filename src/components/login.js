import React,{Component} from 'react';
import '../asserts/css/login.css';
import title from '../asserts/images/title.png';
import $ from 'jquery'
import axios from 'axios';
import SubMenu from './subMenu'
import { Row,  Col , Form , Button} from 'react-bootstrap';
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";

class Login extends Component {
	state = {
		loginFlag:false,//ログインの成功フラグ
	}
	/**
	 * ログインボタン
	 */
	login = () =>{
		var loginModel = {};
		loginModel["employeeNo"] = $("#employeeNo").val();
		loginModel["password"] = $("#password").val();
		axios.post("http://127.0.0.1:8080/login/login",loginModel)
		.then(resultMap =>{
			var employeeModel = resultMap.data.employeeModel;		
			if(employeeModel !== null){//ログイン成功
				// this.context.router.push("/subCost")
				sessionStorage.setItem('employeeNo', employeeModel["employeeNo"]);
				sessionStorage.setItem('authorityProperty', employeeModel["authorityProperty"]);
				sessionStorage.setItem('employeeName', employeeModel["employeeFristName"] + '' + employeeModel["employeeLastName"]);
				if($("input[name='remeber']").is(":checked")){
					sessionStorage.setItem('loginEmployeeNo', employeeModel["employeeNo"]);
				}else{
					sessionStorage.setItem('loginEmployeeNo', '');
				}
				this.setState({
					loginFlag:true,
				})
			}else{//ログイン失敗
				alert("账号或密码输入错误");
			}
			})
			.catch(function (error) {
				alert("登录错误，请检查程序");
			});
	}
	/**
	 * 画面初期化
	 * remeberボックスの使用
	 */
	componentDidMount(){
		var employeeNo = sessionStorage.getItem('loginEmployeeNo');
		$("#employeeNo").val(employeeNo);
	}
    render() {
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
						<Form.Control id="employeeNo" name="employeeNo" maxLength="6" type="text" placeholder="社员番号" required/>
						<Form.Control id="password" name="password" maxLength="12" type="password" placeholder="Password" required/>
					</Form.Group>
						<Form.Group　className="text-center">
							<Form.Check id="remeber" name="remeber" type="checkbox" label="Remeber me" />
						</Form.Group>
					<Button variant="primary" onClick={this.login} className="btn btn-lg btn-primary btn-block" type="button">
						ログイン
					</Button>
				</Form>
				</div>
				)
			}
		}     
}

export default Login;

