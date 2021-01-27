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
import store from './redux/store';
axios.defaults.withCredentials = true;

// マスター修正
class masterUpdate extends Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.onchange = this.onchange.bind(this);
	}

	initialState = {
		code: '',
		flag: true,// 活性非活性flag
		masterStatus: store.getState().dropDown[32].slice(1),
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		bankInfo: store.getState().dropDown[57].slice(1),
		bankName: '',
		branchName: '',
	};

	// onchange
	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	// 页面加载
	componentDidMount() {
	}
	// 明细查询
	selectMaster = (event,values) => {	
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
		this.setState({
			data: '',
		})
		this.refs.table.setState({
			selectedRowKeys: []
		});
		this.setState({
			[event.target.name]: event.target.value
		}, () => {
			axios.post(this.state.serverIP + "masterUpdate/getMasterInfo", { master: publicUtils.labelGetValue($("#master").val(), this.state.masterStatus)})
				.then(response => {
					if (response.data != null) {
						this.setState({
							masterData: response.data,
							bankName:'',
							branchName:'',
							branchCode:'',
							topCustomerName: '',
							topCustomerAbbreviation: '',
							url: '',
							flag: true
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
			branchName:'',
			branchCode:'',
			topCustomerName: '',
			topCustomerAbbreviation: '',
			url: '',
		})
		if (isSelected) {
			if(publicUtils.labelGetValue($("#master").val(), this.state.masterStatus)==="M002BankBranch"){
				this.setState({
					branchCode: row.bankBranchCode,
					branchName: row.bankBranchName,
					oldBranchCode: row.bankBranchCode,
					oldBranchName: row.bankBranchName,
				})
			}else if(publicUtils.labelGetValue($("#master").val(), this.state.masterStatus)==="T008TopCustomerInfo"){
				this.setState({
					topCustomerNo: row.topCustomerNo,
					topCustomerName: row.topCustomerName,
					topCustomerAbbreviation: row.topCustomerAbbreviation,
					url: row.url,
				})
			}
			else{
				this.setState({
					code: row.code,
					data: row.data,
				})
			}

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
		masterModel["code"] = this.state.code - 1;
		masterModel["bankBranchName"] = this.state.oldBranchName;
		masterModel["bankBranchCode"] = this.state.oldBranchCode;
		masterModel["newBankBranchName"] = this.state.branchName;
		masterModel["newBankBranchCode"] = this.state.branchCode;
		masterModel["bankCode"] = this.state.bankCode;
		masterModel["topCustomerName"] = this.state.topCustomerName;
		masterModel["topCustomerAbbreviation"] = this.state.topCustomerAbbreviation;
		masterModel["url"] = this.state.url;
		masterModel["topCustomerNo"] = this.state.topCustomerNo;
		
		axios.post(this.state.serverIP + "masterUpdate/update", masterModel)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "put", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					axios.post(this.state.serverIP + "/masterUpdate/getMasterInfo", { master: publicUtils.labelGetValue($("#master").val(), this.state.masterStatus),bankCode: this.state.bankCode  })
						.then(response => {
							if (response.data != null) {
								this.setState({
									masterData: response.data,
									flag: true,
									data: '',
									branchName:'',
									branchCode:'',
									topCustomerName: '',
									topCustomerAbbreviation: '',
									url: '',
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
			masterModel["code"] = this.state.code - 1;
			masterModel["bankBranchName"] = this.state.oldBranchName;
			masterModel["bankBranchCode"] = this.state.oldBranchCode;
			masterModel["bankCode"] = this.state.bankCode;
			masterModel["topCustomerNo"] = this.state.topCustomerNo;
			
			axios.post(this.state.serverIP + "masterUpdate/delete", masterModel)
				.then(result => {
					this.setState({ "myToastShow": true, "method": "post", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					axios.post(this.state.serverIP + "masterUpdate/getMasterInfo", { master: publicUtils.labelGetValue($("#master").val(), this.state.masterStatus),bankCode: this.state.bankCode })
						.then(response => {
							if (response.data != null) {
								this.setState({
									masterData: response.data,
									flag: true,
									data: '',
									branchName:'',
									branchCode:'',
									topCustomerName: '',
									topCustomerAbbreviation: '',
									url: '',
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
			axios.post(this.state.serverIP + "masterUpdate/getMasterInfo", { master: publicUtils.labelGetValue($("#master").val(), this.state.masterStatus) })
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

	handleTag = (event, values) => {
		if (values != null) {
			this.setState({
				bankName: values.code,
				branchName:'',
				branchCode:'',
				bankCode: values.code,
				topCustomerName:'',
				topCustomerAbbreviation:'',
				url:'',
			})
	

		} else {
			this.setState({
				bankName: '',
			})
		}
		axios.post(this.state.serverIP + "masterUpdate/getMasterInfo", { master: publicUtils.labelGetValue($("#master").val(), this.state.masterStatus),bankCode: values.code })
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
	
	render() {
		// 表格样式设定
		this.options = {
			page: 1,  // which page you want to show as default
			sizePerPage: 5,  // which size per page you want to locate as
								// default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or
															// function
			hideSizePerPage: true, // > You can hide the dropdown for
									// sizePerPage
		};
		const { master, masterData, errorsMessageValue, masterStatus, bankName, bankInfo  } = this.state;
		// テーブルの列の選択
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
						<p id="masterUpdateErorMsg" style={{ visibility: "hidden" }} class="font-italic font-weight-light text-danger">★ </p>
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
									value={masterStatus.find(v => v.name === this.state.master) || {}}
									onChange={(event, values) => this.selectMaster(event, values)}
									options={this.state.masterStatus}
									getOptionLabel={(option) => option.name}
									clearOnBlur
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input placeholder="  マスター名" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-master"
											 />
										</div>
									)}
								/>
							</InputGroup>
						</Col>
					</Row>
					{master === "支店マスター" ?
							<div>
								<Row >
									<Col >
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">銀行名</InputGroup.Text>
											</InputGroup.Prepend>
											<Autocomplete
												id="bankName"
												name="bankName"
												options={bankInfo}
												getOptionLabel={(option) => option.name}
												value={bankInfo.find(v => v.code === this.state.bankName) || {}}
												onChange={(event, values) => this.handleTag(event, values)}
												renderInput={(params) => (
													<div ref={params.InputProps.ref}>
														<input placeholder=" 銀行名" type="text" {...params.inputProps} className=" auto form-control Autocompletestyle-branchInsertInfo "/>
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
												<InputGroup.Text id="inputGroup-sizing-sm">支店名</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl name="branchName" id="branchName" value={this.state.branchName} onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" 支店名" disabled={this.state.flag === true ? true : false} maxLength={20}/>
										</InputGroup>
									</Col>
								</Row>

								<Row>
									<Col>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">支店番号</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl name="branchCode" id="branchCode" value={this.state.branchCode} onChange={(e) => this.vNumberChange(e, "branchCode")} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" 支店番号" disabled={this.state.flag === true ? true : false} />
										</InputGroup>
									</Col>
								</Row>
							</div> :
							null
						}
					{master === "TOPお客様" ?
							<div>
								<Row >
									<Col >
											<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl name="topCustomerName" id="topCustomerName" value={this.state.topCustomerName} onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" お客様名" maxLength={20} disabled={this.state.flag === true ? true : false}/>
										</InputGroup>
									</Col>
								</Row>

								<Row>
									<Col>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">お客様略称</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl name="topCustomerAbbreviation" id="topCustomerAbbreviation" value={this.state.topCustomerAbbreviation} onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" お客様略称" maxLength={20} disabled={this.state.flag === true ? true : false}/>
										</InputGroup>
									</Col>
								</Row>

								<Row>
									<Col>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">URL</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl name="url" id="url" value={this.state.url} onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="URL" disabled={this.state.flag === true ? true : false}/>
										</InputGroup>
									</Col>
								</Row>
							</div> :
							null
						}
					{master != "支店マスター" && master != "TOPお客様"  ?
						<Row>
							<Col>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">データ</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="データ" id="data" name="data" onChange={this.onchange} value={this.state.data} disabled={this.state.flag === true ? true : false} />
								</InputGroup>
							</Col>
						</Row> :
						null
					}
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" onClick={this.update} variant="info" id="update" type="button" disabled={this.state.flag === true ? true : false} >
							<FontAwesomeIcon icon={faEdit} />修正
							</Button>{' '}
						<Button size="sm" onClick={this.delete} variant="info" id="delete" type="button" disabled={this.state.flag === true ? true : false} >
							<FontAwesomeIcon icon={faTrash} /> 削除
                           </Button>
					</div>
					<br />
					{master === "支店マスター" ?
						<div>
							<BootstrapTable selectRow={selectRow} data={this.state.masterData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
								<TableHeaderColumn dataField='code' width='60' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
								<TableHeaderColumn dataField='bankBranchCode' tdStyle={{ padding: '.45em' }} headerAlign='center'>支店番号</TableHeaderColumn>
								<TableHeaderColumn dataField='bankBranchName' tdStyle={{ padding: '.45em' }} headerAlign='center'>支店名称</TableHeaderColumn>
							</BootstrapTable>
						</div>:
						null
					}
					{master === "TOPお客様" ?
							<div>
								<BootstrapTable selectRow={selectRow} data={this.state.masterData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
									<TableHeaderColumn dataField='code' width='60' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
									<TableHeaderColumn dataField='topCustomerNo' width='120' tdStyle={{ padding: '.45em' }} headerAlign='center'>お客様番号</TableHeaderColumn>
									<TableHeaderColumn dataField='topCustomerName' tdStyle={{ padding: '.45em' }} headerAlign='center'>お客様名称</TableHeaderColumn>
									<TableHeaderColumn dataField='topCustomerAbbreviation' hidden={true} ></TableHeaderColumn>
									<TableHeaderColumn dataField='url' hidden={true} ></TableHeaderColumn>
								</BootstrapTable>
							</div>:
							null
						}
					{master != "支店マスター" && master != "TOPお客様"  ?
							<div>
								<BootstrapTable selectRow={selectRow} data={this.state.masterData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
									<TableHeaderColumn dataField='code' width='60' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
									<TableHeaderColumn dataField='data' tdStyle={{ padding: '.45em' }} headerAlign='center'>名称</TableHeaderColumn>
								</BootstrapTable>
							</div>:
							null
						}
				</Form>
			</div>
		);
	}
}

export default masterUpdate;