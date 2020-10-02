import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as publicUtils from './utils/publicUtils.js';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import $ from 'jquery';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

class salesPointSet extends Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}

	initialState = {
		masterStatus: [],
		employee: '',
		newMember: '',
		customerContract: '',
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

	// 页面加载
	componentDidMount() {
		this.getDropDowns();//全部のドロップダウン
	}
	//明细查询
	onchange = (event) => {
		this.refs.table.setState({
			selectedRowKeys: []
		});
		this.setState({
			[event.target.name]: event.target.value
		}, () => {
			var salesPointSetModel = {};
			salesPointSetModel["employee"] = this.state.employee
			salesPointSetModel["newMember"] = this.state.newMember
			salesPointSetModel["customerContract"] = this.state.customerContract
			axios.post("http://127.0.0.1:8080/getSalesPointInfo", salesPointSetModel)
				.then(response => {
					if (response.data != null) {
						this.setState({
							salesPointData: response.data
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
					window.location.reload();
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
					window.location.reload();
				})
				.catch((error) => {
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
		const { employee, newMember, customerContract, salesPointData, errorsMessageValue } = this.state;
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
			<div style={{ "background": "#f5f5f5" }}>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.method === "put" ? "修正成功！" : "登録成功！"} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<div style={{ "background": "#f5f5f5" }}>
					<Form id="siteForm">
						<Form.Group>
							{/* <Row>
                    <Col sm={3}></Col>
                    <Col sm={7}> <img className="mb-4" alt="title" src={title}/> </Col>
                    </Row> */}
							<Row inline="true">
								<Col className="text-center">
									<h2>営業ポイント設定</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.onchange} name="employee" value={employee} autoComplete="off" >
											<option value="">選択ください</option>
											<option value="0">社員</option>
											<option value="1">協力</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">新人区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.onchange} name="newMember" value={newMember} autoComplete="off" >
											<option value="">選択ください</option>
											<option value="0">新人</option>
											<option value="1">経験者</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">契約区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.onchange} name="customerContract" value={customerContract} autoComplete="off" >
											<option value="">選択ください</option>
											<option value="0">既存</option>
											<option value="1">新規</option>
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={9}>
								</Col>
								<Col sm={3}>
									<div style={{ "float": "right" }}>
										<Button variant="info" size="sm" id="revise" onClick={this.insert} disabled={this.state.updateFlag === true ? true : false}><FontAwesomeIcon icon={faSave} />追加</Button>{' '}
										<Button variant="info" size="sm" id="revise" onClick={this.update} disabled={this.state.updateFlag === true ? true : false}><FontAwesomeIcon icon={faEdit} />修正</Button>{' '}
										<Button variant="info" size="sm" id="revise" onClick={this.delete} disabled={this.state.updateFlag === true ? true : false}><FontAwesomeIcon icon={faTrash} />削除</Button>{' '}
									</div>
								</Col>
							</Row>
							<div>
								<BootstrapTable selectRow={selectRow} data={salesPointData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
									<TableHeaderColumn dataField='no' width='58' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
									<TableHeaderColumn dataField='employee' width='95' tdStyle={{ padding: '.45em' }} headerAlign='center'>社員区分</TableHeaderColumn>
									<TableHeaderColumn dataField='newMember' width='95' tdStyle={{ padding: '.45em' }} headerAlign='center'>新人区分</TableHeaderColumn>
									<TableHeaderColumn dataField='customerContract' width='95' tdStyle={{ padding: '.45em' }} headerAlign='center'>契約区分</TableHeaderColumn>
									<TableHeaderColumn dataField='level' width='125' tdStyle={{ padding: '.45em' }} headerAlign='center'>お客様レベル</TableHeaderColumn>
									<TableHeaderColumn dataField='salesPuttern' width='155' tdStyle={{ padding: '.45em' }} headerAlign='center'>営業結果パタンー</TableHeaderColumn>
									<TableHeaderColumn dataField='specialPoint' tdStyle={{ padding: '.45em' }} headerAlign='center'>特別ポイント条件</TableHeaderColumn>
									<TableHeaderColumn dataField='point' width='95' tdStyle={{ padding: '.45em' }} headerAlign='center'>ポイント</TableHeaderColumn>
									<TableHeaderColumn dataField='remark' tdStyle={{ padding: '.45em' }} headerAlign='center'>備考</TableHeaderColumn>
								</BootstrapTable>
							</div>
						</Form.Group>
					</Form>
				</div>
			</div >
		);
	}
}

export default salesPointSet;