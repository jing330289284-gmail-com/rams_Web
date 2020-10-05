import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as publicUtils from './utils/publicUtils.js';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import $ from 'jquery';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
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
		code: '',
		flag: true//活性非活性flag
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
	//onchange
	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	// 页面加载
	componentDidMount() {
		this.getDropDowns();//全部のドロップダウン
	}
	//明细查询
	selectMaster = (event) => {
		this.setState({
			data: '',
		})
		this.refs.table.setState({
			selectedRowKeys: []
		});
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
		this.setState({ flag: true });
		this.setState({
			data: '',
		})
		if (isSelected) {
			this.setState({
				code: row.code,
				data: row.data,
			})
			this.setState({ flag: false });
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
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "put", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					axios.post("http://127.0.0.1:8080/masterUpdate/getMasterInfo", { master: publicUtils.labelGetValue($("#master").val(), this.state.masterStatus) })
						.then(response => {
							if (response.data != null) {
								this.setState({
									masterData: response.data,
									flag: true,
									data: ''
								});
							}
							this.refs.table.setState({
								selectedRowKeys: []
							});
						}).catch((error) => {
							console.error("Error - " + error);
						});

				}
			})
			.catch((error) => {
				console.error("Error - " + error);
			});


	}

	/**
	 * 削除ボタン
	 */
	delete = () => {
		var a = window.confirm("削除していただきますか？");
		if (a) {
			var masterModel = {};
			masterModel["master"] = publicUtils.labelGetValue($("#master").val(), this.state.masterStatus)
			masterModel["code"] = this.state.code;
			axios.post("http://127.0.0.1:8080/masterUpdate/delete", masterModel)
				.then(result => {
					this.setState({ "myToastShow": true, "method": "post", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					axios.post("http://127.0.0.1:8080/masterUpdate/getMasterInfo", { master: publicUtils.labelGetValue($("#master").val(), this.state.masterStatus) })
						.then(response => {
							if (response.data != null) {
								this.setState({
									masterData: response.data,
									flag: true,
									data: ''
								});
							}
							this.refs.table.setState({
								selectedRowKeys: []
							});
						}).catch((error) => {
							console.error("Error - " + error);
						});
				})
				.catch((error) => {
					console.error("Error - " + error);
				});
			this.refs.table.setState({
				selectedRowKeys: []
			});
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
		}
	}

	render() {
		//表格样式设定
		this.options = {
			page: 1,  // which page you want to show as default
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
		};
		const { master, masterData, errorsMessageValue } = this.state;
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
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.method === "put" ? "修正成功！" : "削除成功！"} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
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
									value={master}
									options={this.state.masterStatus}
									getOptionLabel={(option) => option.name}
									clearOnBlur
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input placeholder="  マスター名" type="text" {...params.inputProps} className="auto"
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
								<FormControl placeholder="データ" id="data" name="data" onChange={this.onchange} value={this.state.data} disabled={this.state.flag === true ? true : false} />
							</InputGroup>
						</Col>
					</Row>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" onClick={this.update} variant="info" id="update" type="button" disabled={this.state.flag === true ? true : false} >
							<FontAwesomeIcon icon={faEdit} />修正
							</Button>{' '}
						<Button size="sm" onClick={this.delete} variant="info" id="delete" type="button" disabled={this.state.flag === true ? true : false} >
							<FontAwesomeIcon icon={faTrash} /> 削除
                           </Button>
					</div>
					<br />
					<div>
						<BootstrapTable selectRow={selectRow} data={this.state.masterData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn dataField='code' width='60' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
							<TableHeaderColumn dataField='data' tdStyle={{ padding: '.45em' }} headerAlign='center'>名称</TableHeaderColumn>
						</BootstrapTable>
					</div>
				</Form>
			</div>
		);
	}
}

export default masterUpdate;