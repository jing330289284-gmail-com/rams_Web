import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios'
import ja from 'date-fns/locale/ja';
import DatePicker, { registerLocale } from "react-datepicker"
import store from './redux/store';
import * as utils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
axios.defaults.withCredentials = true;

registerLocale('ja', ja);

// 営業個別売上
class salesProfit extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.onchange = this.onchange.bind(this);
		this.getAdmissionDate = this.getAdmissionDate.bind(this);
		this.getSalesInfo = this.getSalesInfo.bind(this);
	}

	initialState = {
		no: '',
		employee: '',
		employeeNo: "",
		newMember: '',
		customerNo: null,// 選択した列のお客様番号
		customerContract: '',
		siteRoleNameAll: '',
		profitAll: '',
		updateFlag: true,
		insertFlag: false,
		currentPage: 1,// 今のページ
		insertNo: '',
		salesPointData: [],
		authorityCode: '',
		employeeStatus: store.getState().dropDown[4].slice(1),
		newMemberStatus: store.getState().dropDown[23].slice(1),
		customerContractStatus: store.getState().dropDown[24].slice(1),
		levelStatus: store.getState().dropDown[18].slice(1),
		salesPutternStatus: store.getState().dropDown[25].slice(1),
		specialPointStatus: store.getState().dropDown[26].slice(1),
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],// 劉林涛
																					// テスト
		customerDrop: store.getState().dropDown[56].slice(1),
	};

	// 页面加载
	componentDidMount() {
		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
		.then(result => {
			this.setState({
				authorityCode: result.data[0].authorityCode,
			})
		})
		.catch(function(error) {
			alert(error);
		});	
		if (this.props.location.state !== undefined) {
            var sendValue = this.props.location.state.sendValue;
            this.setState({
            	customerNo: sendValue.customerNo,
				employeeSearch: sendValue.employeeSearch,
				admissionStartDate: sendValue.admissionStartDate,
				admissionEndDate: sendValue.admissionEndDate,
            }, () =>{
            	this.select();
            }
            );
		}
		// this.select();
	}

    /**
	 * 社員名連想
	 * 
	 * @param {}
	 *            event
	 */
	getCustomer = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let customerNo = null;
			if (values !== null) {
				customerNo = values.code;
			}
			this.setState({
				customerNo: customerNo,
			}, () => {
				this.select();
			})
		})
	}

	// 明细查询
	onchange = (event) => {
		this.refs.table.setState({
			selectedRowKeys: []
		});
		this.setState({
			[event.target.name]: event.target.value
		}, () => {
			this.select();
		})
	}

	// 时间入力框初始值
	state = {
		admissionStartDate: new Date(),
		admissionEndDate: new Date(),
		no: 0,
		siteRoleNameAll: 0,
		profitAll: 0,
	}
	// 入場年月
	admissionStartDate = (date) => {
		this.setState(
			{
				admissionStartDate: date,
			}
		);
		this.getAdmissionDate("start", date);
	};
	// 退場年月
	admissionEndDate = (date) => {
		this.setState(
			{
				admissionEndDate: date,
			}
		);
		this.getAdmissionDate("end", date);
	};

	// 年月を取得する
	getAdmissionDate = (str, date) => {
		switch (str) {
			case "start":
				if (typeof this.state.admissionEndDate !== "undefined") {
					this.getSalesInfo(date, this.state.admissionEndDate);
				}
				break;
			case "end":
				if (typeof this.state.admissionStartDate !== "undefined") {
					this.getSalesInfo(this.state.admissionStartDate, date);
				}
				break;
			default:
				break;
		}
	};

	// 現場情報を取得する
	getSalesInfo = (start, end) => {
		var salesPointSetModel = {};
		salesPointSetModel["employeeName"] = this.state.customerNo
		salesPointSetModel["employeeStatus"] = this.state.employeeSearch
		salesPointSetModel["startDate"] = start;
		salesPointSetModel["endDate"] = end;
		axios.post(this.state.serverIP + "getSalesInfo", salesPointSetModel)
			.then(response => {
				if (response.data != null) {
					if (response.data[0] != null) {
						let salesPointData = response.data;
						let siteRoleNameAll = 0;
						for(let i in salesPointData){
							if(salesPointData[i].employeeNo.search("BP") === -1 && this.state.authorityCode !== "4"){
								salesPointData[i].siteRoleName = "";
							}else{
								siteRoleNameAll += Number(utils.deleteComma(salesPointData[i].siteRoleName));
							}
						}
						this.setState({
							salesPointData: salesPointData,
							no: response.data.length,
							siteRoleNameAll: utils.addComma(siteRoleNameAll),
							profitAll: response.data[0].profitAll,
						});
					} else {
						this.setState({
							salesPointData: response.data,
							no: '',
							siteRoleNameAll: '',
							profitAll: '',
						});
					}
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	}

	remarkFormat = (cell) => {
		return <span title={cell}>{cell}</span>;
	}

	// 页面跳转
	shuseiTo (actionType) {
		var path = {};
		var startTime = null;
		var endTime = null;
		if (this.state.admissionStartDate != null && this.state.admissionEndDate != null) {
			startTime = this.state.admissionStartDate;
			endTime = this.state.admissionEndDate;
		}
		const sendValue = {
				customerNo: this.state.customerNo,
				employeeSearch: this.state.employeeSearch,
				admissionStartDate: this.state.admissionStartDate,
				admissionEndDate: this.state.admissionEndDate,
		};
		switch (actionType) {
			case "wagesInfo":
				path = {
					pathname: '/subMenuManager/wagesInfo',
					state: {
						employeeNo: this.state.employeeNo,
						backPage: "salesProfit",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			case "siteInfo":
				path = {
					pathname: '/subMenuManager/siteInfo',
					state: {
						employeeNo: this.state.employeeNo,
						backPage: "salesProfit",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			case "salesPoint":
				path = {
					pathname: '/subMenuManager/salesPoint',
					state: {
						customerNo: this.state.customerNo,
						startTime: startTime,
						endTime: endTime,
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
	}

	select = () => {
		var salesPointSetModel = {};
		salesPointSetModel["employeeName"] = this.state.customerNo
		salesPointSetModel["employeeStatus"] = this.state.employeeSearch
		if (typeof this.state.admissionStartDate == "undefined" || typeof this.state.admissionEndDate == "undefined") {
			return;
		}
		salesPointSetModel["startDate"] = this.state.admissionStartDate
		salesPointSetModel["endDate"] = this.state.admissionEndDate
		axios.post(this.state.serverIP + "getSalesInfo", salesPointSetModel)
			.then(response => {
				if (response.data != null) {
					if (response.data[0] != null) {
						this.setState({
							salesPointData: response.data,
							no: response.data.length,
							siteRoleNameAll: response.data[0].siteRoleNameAll,
							profitAll: response.data[0].profitAll,
						});
					} else {
						this.setState({
							salesPointData: response.data,
							no: '',
							siteRoleNameAll: '',
							profitAll: '',
						});
					}
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	}
	/**
	 * 行Selectファンクション
	 */
	handleRowSelect = (row, isSelected) => {

		if (isSelected) {
			this.setState({
				// no: row.no,
				employeeNo: row.employeeNo,
				updateFlag: false
			});
		} else {
			this.setState({
				employeeNo: "",
				updateFlag: true
			});
		}
	}
	
	renderShowsTotal = () => {
		return (
			<p hidden={!this.state.salesPointData.length > 0} style={{ color: 'dark', "float": "left" }}  >
				入場人数：{this.state.no}
			</p>
		);
	}
	
	employeeNameFormat = (cell, row, enumObject, index) => {
		let employeeName = row.employeeName;
		if(row.employeeNo.search("BP") !== -1){
			employeeName += "(" + row.employeeFrom + ")";
		}
		return employeeName;
	}
	
	siteRoleNameFormat = (cell, row, enumObject, index) => {
		if(Number(utils.deleteComma(row.siteRoleName)) < 0){
			return (<font color="red">{row.siteRoleName}</font>);
		}
		return row.siteRoleName;
	}
	
	profitFormat = (cell, row, enumObject, index) => {
		let profitFormat = row.profit + "(" + row.month + ")";
		return profitFormat;
	}
	
	render() {
		// 表格样式设定
		this.options = {
			onPageChange: page => {
				this.setState({ currentPage: page });
			},
			page: this.state.currentPage,
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
		const { employeeSearch, newMemberSearch, customerContractSearch, errorsMessageValue } = this.state;
		// テーブルの列の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			clickToSelectAndEditCell: true,
			hideSelectColumn: true,
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		const cellEdit = {
			mode: 'click',
			blurToSave: true
		};
		return (
			<div >
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<div >
					<Form id="siteForm">
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>営業個別売上</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">営業担当</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="customerNo"
											name="customerNo"
											value={this.state.customerDrop.find(v => v.code === this.state.customerNo) || {}}
											options={this.state.customerDrop}
											getOptionLabel={(option) => option.text}
											onChange={(event, values) => this.getCustomer(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														{option.name}
													</React.Fragment>
												)
											}}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customerInfo"
													/>
												</div>
											)}
										/>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.onchange} name="employeeSearch" value={employeeSearch} autoComplete="off" >
											<option value="">選択ください</option>
											<option value="0">社員</option>
											<option value="1">協力</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={5}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
										</InputGroup.Prepend>
										<InputGroup.Prepend>
											<DatePicker
												selected={this.state.admissionStartDate}
												onChange={this.admissionStartDate}
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												maxDate={new Date()}
												name="admissionStartDate"
												className="form-control form-control-sm"
												id="datePicker"
												locale="ja"
												autoComplete="off"
											/>〜
										<DatePicker
												selected={this.state.admissionEndDate}
												onChange={this.admissionEndDate}
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												maxDate={new Date()}
												name="admissionEndDate"
												className="form-control form-control-sm"
												id="datePicker"
												locale="ja"
												autoComplete="off"
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
							</Row>
							<div>
								<Row>
									<Col sm={2}>
										{/*
											 * <font style={{ whiteSpace:
											 * 'nowrap' }}>入場人数：{this.state.no}</font>
											 */}
										<Button size="sm" onClick={this.shuseiTo.bind(this, "siteInfo")} disabled={this.state.employeeNo === '' ? true : false} className="individualSalesButtom" name="clickButton" variant="info" id="siteInfo">現場情報</Button>{' '}
						                <Button size="sm" onClick={this.shuseiTo.bind(this, "wagesInfo")}  disabled={this.state.employeeNo === '' ? true : false} className="individualSalesButtom" name="clickButton" variant="info" id="wagesInfo">給料情報</Button>
									</Col>
									<Col sm={1}>
									</Col>
				                    <Col>
						                <InputGroup size="sm">
						                    <InputGroup.Prepend>
						                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">売上合計</InputGroup.Text>
						                    </InputGroup.Prepend>
						                    <FormControl
						                    value={this.state.profitAll}
						                    disabled/>
					                    </InputGroup>
				                    </Col>
									<Col sm={1}>
									</Col>
				                    <Col>
						                <InputGroup size="sm">
						                    <InputGroup.Prepend>
						                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">粗利合計</InputGroup.Text>
						                    </InputGroup.Prepend>
						                    <FormControl
						                    value={this.state.siteRoleNameAll}
						                    disabled/>
					                    </InputGroup>
				                    </Col>
									<Col sm={3}>
										<div style={{ "float": "right" }}>
											<Button size="sm" className="individualSalesButtom" name="clickButton" variant="info" id="syounin" onClick={this.shuseiTo.bind(this,"salesPoint")} disabled={this.state.customerNo === null ? true : false} className="btn btn-primary btn-sm">
												営業ポイント明細
								        </Button>
										</div>
									</Col>
								</Row>
								<Row>
									<Col sm={12}>
										<BootstrapTable selectRow={selectRow} data={this.state.salesPointData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
											<TableHeaderColumn dataField='rowNo' width='57' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
											<TableHeaderColumn dataField='yearAndMonth' width='100' tdStyle={{ padding: '.45em' }}>年月</TableHeaderColumn>
											<TableHeaderColumn dataField='employeeStatus' width='90' tdStyle={{ padding: '.45em' }} hidden >社員区分</TableHeaderColumn>
											<TableHeaderColumn dataField='employeeName' tdStyle={{ padding: '.45em' }} width='260' dataFormat={this.employeeNameFormat}>氏名</TableHeaderColumn>
											<TableHeaderColumn dataField='employeeFrom' tdStyle={{ padding: '.45em' }} hidden >所属</TableHeaderColumn>
											<TableHeaderColumn dataField='customerName' tdStyle={{ padding: '.45em' }} >お客様</TableHeaderColumn>
											<TableHeaderColumn dataField='workDate' tdStyle={{ padding: '.45em' }} >入場期間</TableHeaderColumn>
											<TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }} width='120' hidden>単価</TableHeaderColumn>
											<TableHeaderColumn dataField='profit' tdStyle={{ padding: '.45em' }} width='150' dataFormat={this.profitFormat}>売上</TableHeaderColumn>
											<TableHeaderColumn dataField='salary' tdStyle={{ padding: '.45em' }} width='150' >給料(発注)合計</TableHeaderColumn>
											<TableHeaderColumn dataField='siteRoleName' tdStyle={{ padding: '.45em' }} width='150' dataFormat={this.siteRoleNameFormat}>粗利</TableHeaderColumn>
										</BootstrapTable>
									</Col>
								</Row>
							</div>
						</Form.Group>
					</Form>
				</div>
			</div >
		);
	}
}

export default (salesProfit);