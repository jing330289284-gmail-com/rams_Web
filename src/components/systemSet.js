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
		bankName: '',
		branchName: '',
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

	}

	/**
	 * 登録ボタン
	 */
	toroku = () => {
		$("#toroku").attr({"disabled":"disabled"});
		// setTimeout($("#toroku").removeAttr("disabled"),2000)
		if (this.state.master != '支店マスター' && this.state.master != 'TOPお客様' ) {
			var masterModel = {};
			// 画面输入信息取得
			var formArray = $("#masterInsertForm").serializeArray();
			$.each(formArray, function (i, item) {
				masterModel[item.name] = item.value;
			});
			masterModel["master"] = publicUtils.labelGetValue($("#master").val(), this.state.masterStatus)
			axios.post(this.state.serverIP + "masterInsert/toroku", masterModel)
				.then(result => {
					if (result.data.errorsMessage != null) {
						this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
						$("#toroku").removeAttr("disabled");
					} else {
						this.setState({ "myToastShow": true, "errorsMessageShow": false });
						setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						this.refreshReducer();
					}
				}).catch((error) => {
					console.error("Error - " + error);
				});
		} else if(this.state.master === '支店マスター') {
			$("#toroku").attr({"disabled":"disabled"});
			const branchDetails = {
				bankBranchCode: this.state.branchCode,
				bankBranchName: this.state.branchName,
				bankCode: this.state.bankName,
			};
			axios.post(this.state.serverIP + "branchInsert/toroku", branchDetails)
				.then(result => {
					if (result.data.errorsMessage != null) {
						this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
						$("#toroku").removeAttr("disabled");
					} else {
						this.setState({ "myToastShow": true, "errorsMessageShow": false });
						setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						this.refreshReducer();
						this.setState({branchCode:'',
										branchName:''})
					$("#toroku").removeAttr("disabled");
					}
				}).catch((error) => {
					console.error("Error - " + error);
				});
		}else if(this.state.master === 'TOPお客様') {
			$("#toroku").attr({"disabled":"disabled"});
			const customerDetails = {
				topCustomerName: this.state.topCustomerName,
				topCustomerAbbreviation: this.state.topCustomerAbbreviation,
				url: this.state.url,
			};
			axios.post(this.state.serverIP + "customerInsert/toroku", customerDetails)
				.then(result => {
					if (result.data.errorsMessage != null) {
						this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
						$("#toroku").removeAttr("disabled");
					} else {
						this.setState({ "myToastShow": true, "errorsMessageShow": false });
						setTimeout(() => this.setState({ "myToastShow": false }), 3000);
						this.refreshReducer();
						this.setState({topCustomerName:'',
							topCustomerAbbreviation:'',
							url:''})
					$("#toroku").removeAttr("disabled");
					}
				}).catch((error) => {
					console.error("Error - " + error);
				});
		}
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
		const { master, errorsMessageValue, masterStatus, bankName, bankInfo,companyName,backgroundColor,EmpNoHead } = this.state;

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
				<Row></Row>
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
								<Image src={this.state.image} id="imageId" rounded width="220" height="240" onClick={(event) => this.addFile(event, 'image')} />
							</InputGroup.Prepend>
							<Form.File id="image" hidden data-browse="添付" custom onChange={(event) => this.changeFile(event, 'image')} accept="image/png, image/jpeg"></Form.File>
						</InputGroup>
						</Col>
						<Col sm={6}>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">会社名</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control type="email" placeholder="会社名" value={companyName} autoComplete="off"
							onChange={this.valueChange} size="sm" name="companyName" />
						</InputGroup>
						
						<InputGroup size="sm" className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text id="inputGroup-sizing-sm">背景色</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control type="email" placeholder="背景色" value={backgroundColor} autoComplete="off"
							onChange={this.valueChange} size="sm" name="backgroundColor" />
					</InputGroup>
					<InputGroup size="sm" className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="inputGroup-sizing-sm">社員番号の頭</InputGroup.Text>
					</InputGroup.Prepend>
					<Form.Control type="email" placeholder="社員番号の頭" value={EmpNoHead} autoComplete="off"
						onChange={this.valueChange} size="sm" name="EmpNoHead" />
				</InputGroup>
					</Col>
					</Row>
					<div style={{ "textAlign": "center" }}>
					<Button size="sm" variant="info" type="button">
						<FontAwesomeIcon  icon={faEdit} /> 更新
						</Button>
						</div>
				</Form>
			</div>
		);
	}
}

export default systemSet;