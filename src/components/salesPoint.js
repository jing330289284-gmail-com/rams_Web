import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Form, Col, InputGroup, Button } from 'react-bootstrap';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import store from './redux/store';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DatePicker, { registerLocale } from "react-datepicker"
import * as publicUtils from './utils/publicUtils.js';
axios.defaults.withCredentials = true;

// 営業ポイント設定
class salesPoint extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.onchange = this.onchange.bind(this);
		this.getAdmissionDate = this.getAdmissionDate.bind(this);
	}

	initialState = {
		no: '',
		rows: 0,
		employee: '',
		startTime: '',
		newMember: '',
		pointAll: '',
		customerContract: '',
		updateFlag: true,
		insertFlag: false,
		currentPage: 1,// 今のページ
		insertNo: '',
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		customerDrop: store.getState().dropDown[56].slice(1),
	};

	// 页面加载
	componentDidMount() {
		if (typeof this.props.location.state !== "undefined") {
			this.setState({
				customerNo: this.props.location.state.customerNo,
				admissionStartDate: this.props.location.state.startTime,
				admissionEndDate: this.props.location.state.endTime,
			}, () => {
				this.select(null, "startAndEnd");
			})
		}
	}

	// 时间入力框初始值
	state = {
		admissionStartDate: new Date(),
		admissionEndDate: new Date(),
		no: 0,
		siteRoleNameAll: 0,
		profitAll: 0,
		rows: 0,
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
				if (typeof this.state.admissionEndDate !== "undefined" && typeof this.state.customerNo !== "undefined") {
					this.select(date, "start");
				}
				break;
			case "end":
				if (typeof this.state.admissionStartDate !== "undefined" && typeof this.state.customerNo !== "undefined") {
					this.select(date, "end");
				}
				break;
			default:
				break;
		}
	};

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
	
	// 鼠标悬停显示全文
	specialPointStatusFormat = (cell) => {
		return <span title={cell}>{cell}</span>;
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

	downloadPDF = () => {
		var salesPointSetModel = {};
		salesPointSetModel["employeeName"] = this.state.customerNo
		salesPointSetModel["startDate"] = this.state.admissionStartDate
		salesPointSetModel["endDate"] = this.state.admissionEndDate
		salesPointSetModel["pdf"] = "true"
		axios.post(this.state.serverIP + "SalesPointController/downloadPDF", salesPointSetModel)
			.then(resultMap => {
				if (resultMap.data) {
					publicUtils.handleDownload(resultMap.data, this.state.serverIP);
					// alert(resultMap.data);
				} else {
					alert("更新失败");
				}
			})
			.catch(function () {
				alert("更新错误，请检查程序");
			});
	}

	select = (date, str) => {
		var salesPointSetModel = {};
		salesPointSetModel["employeeName"] = this.state.customerNo
		salesPointSetModel["startDate"] = this.state.admissionStartDate
		salesPointSetModel["endDate"] = this.state.admissionEndDate
		salesPointSetModel["pdf"] = "false"
		switch (str) {
			case "start":
				salesPointSetModel["startDate"] = date
				salesPointSetModel["endDate"] = this.state.admissionEndDate
				break;
			case "end":
				salesPointSetModel["startDate"] = this.state.admissionStartDate
				salesPointSetModel["endDate"] = date
				break;
			case "startAndEnd":
				salesPointSetModel["startDate"] = this.props.location.state.startTime
				salesPointSetModel["endDate"] = this.props.location.state.endTime
				break;
			default:
				break;
		}
		axios.post(this.state.serverIP + "getPointInfo", salesPointSetModel)
			.then(response => {
				if (response.data != null) {
					if (response.data.length > 0) {
						this.setState({
							salesPointData: response.data,
							pointAll: response.data[0].pointAll,
							rows: response.data.length,
						});
					} else {
						this.setState({
							salesPointData: response.data,
							pointAll: "",
							rows: 0,
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
				no: row.no,
				updateFlag: false
			});
		} else {
			this.setState({
				updateFlag: true
			});
		}
	}

	render() {
		// 表格样式设定
		this.options = {
			onPageChange: page => {
				this.setState({ currentPage: page });
			},
			page: this.state.currentPage,
			sizePerPage: 12,  // which size per page you want to locate as
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
		const { errorsMessageValue } = this.state;
		// テーブルの列の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			clickToSelectAndEditCell: true,
			hideSelectColumn: true,
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		return (
			<div >
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.method === "put" ? "登録成功！" : "削除成功！"} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<div >
					<Form id="siteForm">
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>営業ポイント明細確認</h2>
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
											getOptionLabel={(option) => option.text ? option.text : ""}
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
							<br />
							<Row>
								<Col sm={3}>
									<font style={{ whiteSpace: 'nowrap' }}>ポイント合計：{this.state.pointAll}</font>
								</Col>
								<Col sm={7}>
								</Col>
								<Col sm={2}>
									<div style={{ "float": "right" }}>
										<Button variant="info" size="sm" id="downloadPDF" onClick={this.downloadPDF.bind(this)} disabled={this.state.rows > 0 ? false : true}><FontAwesomeIcon icon={faDownload} /> PDF出力</Button>{' '}
									</div>
								</Col>
							</Row>
							<Row>
								<Col sm={12}>
									<BootstrapTable selectRow={selectRow} data={this.state.salesPointData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
										<TableHeaderColumn dataField='rowNo' width='57' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
										<TableHeaderColumn dataField='yearAndMonth' width='80' tdStyle={{ padding: '.45em' }}>年月</TableHeaderColumn>
										<TableHeaderColumn dataField='employeeStatusName' width='90' tdStyle={{ padding: '.45em' }} >社員区分</TableHeaderColumn>
										<TableHeaderColumn dataField='employeeFrom' tdStyle={{ padding: '.45em' }} width='120'>所属会社</TableHeaderColumn>
										<TableHeaderColumn dataField='employeeName' tdStyle={{ padding: '.45em' }} width='120'>氏名</TableHeaderColumn>
										<TableHeaderColumn dataField='customerName' tdStyle={{ padding: '.45em' }} width='120'>お客様</TableHeaderColumn>
										<TableHeaderColumn dataField='customerContractStatus' hidden tdStyle={{ padding: '.45em' }} width='80'>契約区分</TableHeaderColumn>
										<TableHeaderColumn dataField='salesProgressName' tdStyle={{ padding: '.45em' }} width='150' >営業結果パタンー</TableHeaderColumn>
										<TableHeaderColumn dataField='point' tdStyle={{ padding: '.45em' }} width='80' >ポイント</TableHeaderColumn>
										<TableHeaderColumn dataField='specialsalesPointCondition' tdStyle={{ padding: '.45em' }} width='200' dataFormat={this.specialPointStatusFormat.bind(this)}>特別ポイント理由</TableHeaderColumn>
										<TableHeaderColumn dataField='specialsalesPoint' tdStyle={{ padding: '.45em' }} width='130' >特別ポイント</TableHeaderColumn>
									</BootstrapTable>
								</Col>
							</Row>
						</Form.Group>
					</Form>
				</div>
			</div >
		);
	}
}

export default salesPoint;