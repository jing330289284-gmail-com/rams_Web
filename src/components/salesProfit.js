import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios'
import ja from 'date-fns/locale/ja';
import DatePicker, { registerLocale } from "react-datepicker"
import store from './redux/store';
import Autocomplete from '@material-ui/lab/Autocomplete';
axios.defaults.withCredentials = true;

registerLocale('ja', ja);

//　　営業個別売上
class salesProfit extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
		this.getAdmissionDate = this.getAdmissionDate.bind(this);
		this.getSalesInfo = this.getSalesInfo.bind(this);
	}

	initialState = {
		no: '',
		employee: '',
		newMember: '',
		customerNo: null,//選択した列のお客様番号
		customerContract: '',
		siteRoleNameAll: '',
		profitAll: '',
		updateFlag: true,
		insertFlag: false,
		currentPage: 1,//今のページ
		insertNo: '',
		employeeStatus: store.getState().dropDown[4].slice(1),
		newMemberStatus: store.getState().dropDown[23].slice(1),
		customerContractStatus: store.getState().dropDown[24].slice(1),
		levelStatus: store.getState().dropDown[18].slice(1),
		salesPutternStatus: store.getState().dropDown[25].slice(1),
		specialPointStatus: store.getState().dropDown[26].slice(1),
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
		customerDrop: store.getState().dropDown[56].slice(1),
	};

	// 页面加载
	componentDidMount() {
		this.select();
	}

    /**
     * 社員名連想
     * @param {} event 
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

	//明细查询
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

	//时间入力框初始值
	state = {
		admissionStartDate: new Date(),
		admissionEndDate: new Date(),
		no: 0,
		siteRoleNameAll: 0,
		profitAll: 0,
	}
	//　入場年月
	admissionStartDate = (date) => {
		this.setState(
			{
				admissionStartDate: date,
			}
		);
		this.getAdmissionDate("start", date);
	};
	//　退場年月
	admissionEndDate = (date) => {
		this.setState(
			{
				admissionEndDate: date,
			}
		);
		this.getAdmissionDate("end", date);
	};

	//	年月を取得する
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

	//	現場情報を取得する
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

	remarkFormat = (cell) => {
		return <span title={cell}>{cell}</span>;
	}

	//页面跳转
	shuseiTo = () => {
		var path = {};
		path = {
			pathname: '/subMenuManager/salesPoint',
			state: {
				customerNo: this.state.customerNo,
				startTime: this.state.admissionStartDate,
				endTime: this.state.admissionEndDate,
			},
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
				//no: row.no,
				updateFlag: false
			});
		} else {
			this.setState({
				updateFlag: true
			});
		}
	}
	render() {
		//表格样式设定
		this.options = {
			onPageChange: page => {
				this.setState({ currentPage: page });
			},
			page: this.state.currentPage,
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
		const { employeeSearch, newMemberSearch, customerContractSearch, errorsMessageValue } = this.state;
		//テーブルの列の選択
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
											value={this.state.employeeName}
											options={this.state.customerDrop}
											getOptionLabel={(option) => option.text ? option.text : ""}
											onChange={(event, values) => this.getCustomer(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														<p >{option.name}</p>
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
												name="admissionStartDate"
												className="form-control form-control-sm"
												id="admissionStartDate"
												locale="ja"
												autoComplete="off"
											/>〜
										<DatePicker
												selected={this.state.admissionEndDate}
												onChange={this.admissionEndDate}
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												name="admissionEndDate"
												className="form-control form-control-sm"
												id="admissionEndDate"
												locale="ja"
												autoComplete="off"
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
							</Row>
							<div>
								<br />
								<Row>
									<Col sm={3}>
										<font style={{ whiteSpace: 'nowrap' }}>入場人数：{this.state.no}</font>
									</Col>
									<Col sm={3}>
										<font style={{ whiteSpace: 'nowrap' }}>売上合計：{this.state.profitAll}</font>
									</Col>
									<Col sm={2}>
										<font style={{ whiteSpace: 'nowrap' }}>粗利合計：{this.state.siteRoleNameAll}</font>
									</Col>
									<Col sm={4}>
										<div style={{ "float": "right" }}>
											<Button size="sm" id="syounin" onClick={this.shuseiTo.bind(this)} disabled={this.state.customerNo === null ? true : false} className="btn btn-primary btn-sm">
												営業ポイント明細
								        </Button>
										</div>
									</Col>
								</Row>
								<Row>
									<Col sm={12}>
										<BootstrapTable selectRow={selectRow} data={this.state.salesPointData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
											<TableHeaderColumn dataField='rowNo' width='57' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
											<TableHeaderColumn dataField='yearAndMonth' width='80' tdStyle={{ padding: '.45em' }}>年月</TableHeaderColumn>
											<TableHeaderColumn dataField='employeeStatus' width='90' tdStyle={{ padding: '.45em' }} >社員区分</TableHeaderColumn>
											<TableHeaderColumn dataField='employeeFrom' tdStyle={{ padding: '.45em' }} >所属</TableHeaderColumn>
											<TableHeaderColumn dataField='employeeName' tdStyle={{ padding: '.45em' }} width='120'>氏名</TableHeaderColumn>
											<TableHeaderColumn dataField='customerName' tdStyle={{ padding: '.45em' }} >お客様</TableHeaderColumn>
											<TableHeaderColumn dataField='workDate' tdStyle={{ padding: '.45em' }} >入場期間</TableHeaderColumn>
											<TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }} width='120' >単価</TableHeaderColumn>
											<TableHeaderColumn dataField='profit' tdStyle={{ padding: '.45em' }} width='120' >売上</TableHeaderColumn>
											<TableHeaderColumn dataField='salary' tdStyle={{ padding: '.45em' }} width='150' >給料(発注)合計</TableHeaderColumn>
											<TableHeaderColumn dataField='siteRoleName' tdStyle={{ padding: '.45em' }} width='150' >粗利</TableHeaderColumn>
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