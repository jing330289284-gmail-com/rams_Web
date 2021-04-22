import React, { Component } from 'react';
import * as publicUtils from './utils/publicUtils.js';
import { Row, Form, Col, InputGroup, Button, FormControl,Image } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios'
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave,faEdit } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import store from './redux/store';
import { Hidden } from '@material-ui/core';
axios.defaults.withCredentials = true;


// マスター登録
class systemSet extends Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.onchange = this.onchange.bind(this);
		this.refreshReducer = this.refreshReducer.bind(this);
	}
	// 初期化
	initialState = {
		myToastShow: false,
		errorsMessageShow: false,
		flag: true,// 活性非活性flag
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};

	onchange = (event, values) => {
		this.setState({ flag: false });
		this.setState({ [event.target.name]: event.target.value }
			, () => {
				if ($("#master").val() === "") {
					this.setState({ flag: true });
				}
			})
		if (values != null) {
			this.setState({
				master: values.name,
			})

		} else {
			this.setState({
				master: '',
			})
		}
	}

	// 页面加载
	componentDidMount() {
		axios.post(this.state.serverIP + "subMenu/getCompanyDate")
		.then(response => {
				this.setState({
					companyName : response.data.companyName,
					image: response.data.companyLogo,
					empNoHead: response.data.empNoHead,
				})
				$("#myColor").val(response.data.backgroundColor);
		}).catch((error) => {
			console.error("Error - " + error);
		});
	}

	/**
	 * 更新ボタン
	 */
	update = () => {
		let color = $("#myColor").val();
		let obj = document.getElementById("imageId");
		let imgSrc = obj.getAttribute("src");
		const companyDate = {
				companyName: this.state.companyName,// 会社名前
				companyLogo: imgSrc,// logo
				backgroundColor: color,// 背景色
				empNoHead: this.state.empNoHead,// 社員番号の頭
		}
		axios.post(this.state.serverIP + "masterUpdate/updateSystem", companyDate)
		.then(result => {
			window.location.reload();
		}).catch((error) => {
			console.error("Error - " + error);
		});
	}
	
	refreshReducer = () =>{
		switch (this.state.master) {
		case "TOPお客様":
			store.dispatch({type:"UPDATE_STATE",dropName:"getTopCustomer"});
			break;
		case "支店マスター":
			break;
		default:
			window.location.reload();
			break;
		}
	}

	handleTag = (event, values) => {
		if (values != null) {
			this.setState({
				bankName: values.code,
				branchName:'',
				branchCode:'',
			})
	

		} else {
			this.setState({
				bankName: '',
			})
		}
	}
	valueChange = event => {
		if(event.target.value===''){
			this.setState({
				[event.target.name]: event.target.value,
				branchCode:''})
		}else{
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	
	}
	vNumberChange = (e, key) => {
		const { value } = e.target;

		const reg = /^[0-9]*$/;
		if ((reg.test(value))&&value.length<4) {
			this.setState({
				[key]: value,
			})
		}
		if(value===''){
			this.setState({
				[key]: value,
				branchName:''
			})
		}
	}
	
	/**
	 * ファイルを処理
	 * 
	 * @param {*}
	 *            event
	 * @param {*}
	 *            name
	 */
	addFile = (event, name) => {
		$("#" + name).click();
	}
	
	changeFile = (event, name) => {
		var filePath = event.target.value;
		var arr = filePath.split('\\');
		var fileName = arr[arr.length - 1];
		if (name === "image") {
			if (publicUtils.nullToEmpty($('#image').get(0).files[0]) === "") {
				return
			};
			var reader = new FileReader();
			reader.readAsDataURL(publicUtils.nullToEmpty($('#image').get(0).files[0]));
			reader.onload = function() {
				document.getElementById("imageId").src = reader.result;
			};
		}
	}

	render() {
		const { master, errorsMessageValue, masterStatus, bankName, bankInfo,companyName,backgroundColor,empNoHead } = this.state;

		return (
			<div className="container col-7">
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={"登録成功！"} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<Row inline="true">
					<Col className="text-center">
						<h2>システム設定</h2>
					</Col>
				</Row>
				<br />
				<Form id="masterInsertForm">
					<Row>
						<Col sm={6}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">会社ロゴ</InputGroup.Text>
								</InputGroup.Prepend>
							</InputGroup>
							<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<Image src={this.state.image} id="imageId" rounded width="130" height="120" onClick={(event) => this.addFile(event, 'image')} />
							</InputGroup.Prepend>
							<Form.File id="image" hidden data-browse="添付" custom onChange={(event) => this.changeFile(event, 'image')} accept="image/png, image/jpeg"></Form.File>
						</InputGroup>
						</Col>
						<Col sm={6}>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">会社名</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control type="text" placeholder="会社名" value={companyName} autoComplete="off" maxlength="20"
							onChange={this.valueChange} size="sm" name="companyName" />
						</InputGroup>
						
						<InputGroup size="sm" className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text id="inputGroup-sizing-sm">背景色</InputGroup.Text>
						</InputGroup.Prepend>
						<input type="color" id="myColor" style={{ "height": "30px" }}/>
					    </InputGroup>
					<InputGroup size="sm" className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="sixKanji">社員番号の頭</InputGroup.Text>
					</InputGroup.Prepend>
					<Form.Control type="text" placeholder="社員番号の頭" value={empNoHead} autoComplete="off" maxlength="3"
						onChange={this.valueChange} size="sm" name="empNoHead" />
				</InputGroup>
					</Col>
					</Row>
					<br />
					<div style={{ "textAlign": "center" }}>
					<Button size="sm" variant="info" type="button" onClick={this.update}>
						<FontAwesomeIcon  icon={faEdit} /> 更新
						</Button>
						</div>
				</Form>
			</div>
		);
	}
}

export default systemSet;