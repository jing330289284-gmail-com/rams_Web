import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import * as publicUtils from './utils/publicUtils.js';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from '@material-ui/lab/Autocomplete';

class masterInsert extends Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}

	initialState = {
		masterStatus: [],
	};

	//全部のドロップダウン
	getDropDowns = () => {
		var methodArray = ["getMaster"]
		var data = publicUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				masterStatus: data[0].slice(1),//　名称
			}
		);
	};

	onchange = event => {
		$("#toroku").prop('disabled', false);
		$("#data").prop('disabled', false);
		this.setState({
			[event.target.name]: event.target.value
		}, () => {
			if ($("#master").val() === "") {
				$("#toroku").prop('disabled', true);
				$("#data").prop('disabled', true);
			}
		})
	}

	// 页面加载
	componentDidMount() {
		this.getDropDowns();//全部のドロップダウン
		$("#toroku").prop('disabled', true);
		$("#data").prop('disabled', true);
	}

    /**
     * 登録ボタン
     */
	toroku = () => {
		var masterModel = {};
		var formArray = $("#masterInsertForm").serializeArray();
		$.each(formArray, function(i, item) {
			masterModel[item.name] = item.value;
		});
		masterModel["master"] = publicUtils.labelGetValue($("#master").val(), this.state.masterStatus)
		axios.post("http://127.0.0.1:8080/masterInsert/toroku", masterModel)
			.then(function(result) {
				if (result.data) {
					alert("登录成功");
				} else {
					alert("データが存在しています");
				}
			})
			.catch(function(error) {
				alert("页面加载错误，请检查程序");
			});
	}

	render() {
		const { master } = this.state;
		return (
			<div className="container col-7">
				<Row inline="true">
					<Col className="text-center">
						<h2>共通マスター登録</h2>
					</Col>
				</Row>
				<Row>
					<Col sm={4}></Col>
					<Col sm={7}>
						<p id="masterInsertErorMsg" style={{ visibility: "hidden" }} class="font-italic font-weight-light text-danger">★</p>
					</Col>
				</Row>
				<Form id="masterInsertForm">
					<Row>
						<Col>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">名　称</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
									id="master"
									name="master"
									value={master}
									onChange={this.onchange}
									options={this.state.masterStatus}
									getOptionLabel={(option) => option.name}
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input placeholder="マスター名" type="text" {...params.inputProps}
												style={{ width: 225, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
										</div>
									)}
								/>
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">データ</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl placeholder="データ" id="data" name="data" disabled={this.state.master === "" ? true : false} />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col sm={4}></Col>
						<Col sm={4} className="text-center">
							<Button size="sm" onClick={this.toroku} variant="info" id="toroku" type="button">
								<FontAwesomeIcon icon={faSave} />登録
							</Button>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

export default masterInsert;