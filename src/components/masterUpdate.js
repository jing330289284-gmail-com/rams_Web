import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as publicUtils from './utils/publicUtils.js';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from '@material-ui/lab/Autocomplete';

class masterUpdate extends Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}

	initialState = {
		masterStatus: [],
		code: ''
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
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	// 页面加载
	componentDidMount() {
		this.getDropDowns();//全部のドロップダウン
		$("#update").prop('disabled', true);
		$("#delete").prop('disabled', true);
		$("#data").prop('disabled', true);
	}
	//明细查询
	selectMaster = (event) => {
		this.setState({
			data: '',
		})
		this.setState({
			[event.target.name]: event.target.value
		}, () => {
			axios.post("http://127.0.0.1:8080/masterUpdate/getMasterInfo", { master: publicUtils.labelGetValue($("#master").val(), this.state.masterStatus) })
				.then(response => {
					if (response.data != null) {
						this.setState({
							masterData: response.data
						});
					}
				}).catch((error) => {
					console.error("Error - " + error);
				});
		})
	}

	/**
   * 行Selectファンクション
   */
	handleRowSelect = (row, isSelected) => {
		$("#update").prop('disabled', true);
		$("#delete").prop('disabled', true);
		$("#data").prop('disabled', true);
		this.setState({
			data: '',
		})
		if (isSelected) {
			this.setState({
				code: row.code,
				data: row.data,
			})

			$("#update").prop('disabled', false);
			$("#delete").prop('disabled', false);
			$("#data").prop('disabled', false);
		}
	}
    /**
     * 修正ボタン
     */
	update = () => {
		var masterModel = {};
		var formArray = $("#masterUpdateForm").serializeArray();
		$.each(formArray, function(i, item) {
			masterModel[item.name] = item.value;
		});
		masterModel["master"] = publicUtils.labelGetValue($("#master").val(), this.state.masterStatus)
		masterModel["code"] = this.state.code;
		axios.post("http://127.0.0.1:8080/masterUpdate/update", masterModel)
			.then(function(result) {
				if (result.data) {
					alert("修正成功");
				} else {
					alert("データが存在しています");
				}
			})
			.catch(function(error) {
				alert("页面加载错误，请检查程序");
			});
	}

	/**
	 * 削除ボタン
	 */
	delete = (event) => {
		var a = window.confirm("削除していただきますか？");
		if (a) {
			var masterModel = {};
			masterModel["master"] = publicUtils.labelGetValue($("#master").val(), this.state.masterStatus)
			masterModel["code"] = this.state.code;
			axios.post("http://127.0.0.1:8080/masterUpdate/delete", masterModel)
				.then(function(result) {
					if (result.data) {
						alert("削除成功");
						this.selectMaster(event);
					} else {
						alert("削除失敗");
					}
				})
				.catch(function(error) {
					alert("页面加载错误，请检查程序");
				});
		}
	}

	render() {
		this.options = {
			page: 1,  // which page you want to show as default
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: 'まえ', // Previous page button text
			nextPage: 'つぎ', // Next page button text
			firstPage: '最初', // First page button text
			lastPage: '最後', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
		};
		const { master, masterData } = this.state;
		//テーブルの列の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,  // click to select, default is false
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		return (
			<div className="container col-7">
				<Row inline="true">
					<Col className="text-center">
						<h2>共通マスター修正</h2>
					</Col>
				</Row>
				<Row>
					<Col sm={4}></Col>
					<Col sm={7}>
						<p id="masterUpdateErorMsg" style={{ visibility: "hidden" }} class="font-italic font-weight-light text-danger">★</p>
					</Col>
				</Row>
				<Form id="masterUpdateForm">
					<Row>
						<Col>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">名　称</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
									id="master"
									name="master"

									options={this.state.masterStatus}
									getOptionLabel={(option) => option.name}
									clearOnBlur
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input placeholder="マスター名" type="text" {...params.inputProps}
																				value={"master"}
												style={{ width: 225, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
										</div>
									)}
									onChange={this.selectMaster}
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
								<FormControl placeholder="データ" id="data" name="data" onChange={this.onchange} value={this.state.data} disabled />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col sm={2}></Col>
						<Col sm={4} className="text-center">
							<Button size="sm" onClick={this.update} variant="info" id="update" type="button" >
								<FontAwesomeIcon icon={faEdit} />修正
							</Button>
						</Col>
						<Col sm={4} className="text-center">
							<Button size="sm" onClick={this.delete} variant="info" id="delete" type="button" >
								<FontAwesomeIcon icon={faTrash} /> 削除
                           </Button>
						</Col>
					</Row>
					<br />
					<div>
						<BootstrapTable selectRow={selectRow} data={masterData} pagination={true} options={this.options} >
							<TableHeaderColumn dataField='code' width='60' isKey>番号</TableHeaderColumn>
							<TableHeaderColumn dataField='data' headerAlign='center'>名称</TableHeaderColumn>
						</BootstrapTable>
					</div>
				</Form>
			</div>
		);
	}
}

export default masterUpdate;