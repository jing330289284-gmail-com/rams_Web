import React, { Component } from 'react';
import Select from 'react-select';
import * as publicUtils from './utils/publicUtils.js';
import { Row, Form, Col, InputGroup, Button } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';

class masterInsert extends Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}

	initialState = {
		masterStatus: []
	};

	//全部のドロップダウン
	getDropDowns = () => {
		var methodArray = ["getMaster"]
		var data = publicUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				masterStatus: data[0],//　名称
			}
		);
	};

	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	// 页面加载
	componentDidMount() {
		this.getDropDowns();//全部のドロップダウン
	}

	//联想框用
	handleChange = selectedOption => {
		this.setState({ selectedOption });
		console.log(`Option selected:`, selectedOption);
	};

    /**
     * 登録ボタン
     */
	toroku = () => {
		var masterModel = {};
		var formArray = $("#masterInsertForm").serializeArray();
		$.each(formArray, function(i, item) {
			masterModel[item.name] = item.value;
		});
		masterModel["updateUser"] = sessionStorage.getItem("employeeNo");
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
					<Col sm={4}>
					</Col>
					<Col sm={7}>
						<p id="masterInsertErorMsg" style={{ visibility: "hidden" }} class="font-italic font-weight-light text-danger">★</p>
					</Col>
				</Row>
				<Form id="masterInsertForm">
					<Row>
						<Col>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">名称</InputGroup.Text>
								</InputGroup.Prepend>
								<Select
									name="master"
									id="master"
									value={master}
									onChange={this.handleChange}
									options={this.state.masterStatus}
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
								<Form.Control placeholder="データ" id="data" name="data" />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col sm={3}></Col>
						<Col sm={3} className="text-center">
							<Button block size="sm" onClick={this.toroku} variant="info" id="toroku" type="button">
								<FontAwesomeIcon icon={faSave} />登録
							</Button>
						</Col>
						<Col sm={3} className="text-center">
							<Button block size="sm" type="reset" variant="info" >
								<FontAwesomeIcon icon={faUndo} /> リセット
                                    </Button>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

export default masterInsert;