/* Bp情報を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faTrash } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as utils from './utils/publicUtils.js';
import store from './redux/store';
import $ from 'jquery';
axios.defaults.withCredentials = true;

class bpInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.valueChange = this.valueChange.bind(this);
		this.bpSalesProgressCodeChange = this.bpSalesProgressCodeChange.bind(this);
	}
	// 初期化
	initialState = {
		// salesProgressCodes: [],
		bpBelongCustomerCode: '',// 選択中のBP所属
		bpUnitPrice: '',// 単価
		bpSalesProgressCode: String(this.props.employeeNo).substring(0,3) === "BPR" ? '3' : '4',// 選択中の営業状況
		bpRemark: '',// 備考
		bpOtherCompanyAdmissionEndDate: '',
		oldUnitPriceStartMonth: null,
		customer: store.getState().dropDown[15].slice(1),
		salesProgressCodes: store.getState().dropDown[16].slice(1),
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	
	bpSalesProgressCodeChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
		if(event.target.value === "4"){
			this.setState({
				bpOtherCompanyAdmissionEndDate: "",
			})
		}
	}
	// リセット
	resetButton = () => {
		this.setState({
			bpBelongCustomerCode: '',// 選択中のBP所属
			bpUnitPrice: '',// 単価
			bpSalesProgressCode: String(this.props.employeeNo).substring(0,3) === "BPR" ? '3' : '4',// 選択中の営業状況
			bpOtherCompanyAdmissionEndDate: '',// 所属現場終年月
			bpRemark: '',// 備考
		})
	};
	
	deleteRow = () => {
		var a = window.confirm("削除していただきますか？");
		if (a) {
			const bpInfoModel = {
					bpEmployeeNo: this.props.employeeNo,
					oldUnitPriceStartMonth: this.state.oldUnitPriceStartMonth,
				};
			axios.post(this.state.serverIP + "employee/deletebpInfo", bpInfoModel)
			.then(response => {
				if (response.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
					setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
				} else {
					this.setState({ "myToastShow": true, "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				}
				this.getbpInfoList();
			}).catch((error) => {
				console.error("Error - " + error);
			});
		}
	};

	// 初期化メソッド
	componentDidMount() {
		this.setEmployeeName();
		if (this.props.actionType !== "insert") {
			this.getbpInfoList();
		}
		var bpInfoModel = this.props.bpInfoModel;// 父画面のパラメータ（画面既存口座情報）
		if (!$.isEmptyObject(bpInfoModel)) {
			this.setState({
				bpBelongCustomerCode: bpInfoModel["bpBelongCustomerCode"],
				bpUnitPrice: bpInfoModel["bpUnitPrice"],
				bpSalesProgressCode: bpInfoModel["bpSalesProgressCode"],
				bpOtherCompanyAdmissionEndDate: utils.converToLocalTime(bpInfoModel["bpOtherCompanyAdmissionEndDate"], false),
				bpRemark: bpInfoModel["bpRemark"],
			});

		}
	}
	
	getbpInfoList = () =>{
		const formData = new FormData()
		formData.append('bpEmployeeNo', this.props.employeeNo)
		axios.post(this.state.serverIP + "bpInfo/getBpInfo", formData)
			.then(response => response.data)
			.then((data) => {
				this.setState({
					bpInfoTable: data.bpInfoList,
					bpBelongCustomerCode: data.model === null ? '' : data.model.bpBelongCustomerCode,// 選択中のBP所属
					bpSalesProgressCode: data.model === null ? '4' : data.model.bpSalesProgressCode,// 選択中の営業状況
					bpOtherCompanyAdmissionEndDate: data.model === null ? "" : utils.converToLocalTime(data.model.bpOtherCompanyAdmissionEndDate, false),
				});
				if(data.bpInfoList.length > 0){
					this.setState({
						unitPriceStartMonth: utils.converToLocalTime(data.bpInfoList[data.bpInfoList.length - 1].unitPriceStartMonth, false),
						bpUnitPrice: data.bpInfoList[data.bpInfoList.length - 1].bpUnitPrice,
						bpRemark: data.bpInfoList[data.bpInfoList.length - 1].bpRemark,
					});
				}
			}
		);
	}

	setEmployeeName = () => {
		if (this.props.employeeFristName === undefined || this.props.employeeLastName === undefined) {
			this.setState({
				pbInfoEmployeeName: '',
			})
		} else {
			this.setState({
				pbInfoEmployeeName: this.props.employeeFristName + this.props.employeeLastName,
			})
		}
	}

	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState(
					{
						oldUnitPriceStartMonth: row.unitPriceStartMonth,
						unitPriceStartMonth: row.unitPriceStartMonth === null || row.unitPriceStartMonth === undefined || row.unitPriceStartMonth === "" ? "" : utils.converToLocalTime(row.unitPriceStartMonth, false),
						bpUnitPrice: row.bpUnitPrice === null || row.bpUnitPrice === undefined || row.bpUnitPrice === "" ? "" : row.bpUnitPrice,
						bpRemark: row.bpRemark === null || row.bpRemark === undefined || row.bpRemark === "" ? "" : row.bpRemark,
					}
				);
		}
		else{
			this.setState(
					{
						oldUnitPriceStartMonth: null,
						unitPriceStartMonth: "",
						bpUnitPrice: "",
						bpRemark: "",
					}
				);
		}
	}
	
	bpOtherCompanyAdmissionEndDateChange = (date) => {
		this.setState(
			{
				bpOtherCompanyAdmissionEndDate: date,
			}
		);
	};
	
	unitPriceStartMonthChange = (date) => {
		this.setState(
				{
					unitPriceStartMonth: date,
				}
			);
		};

	insertOrUpdateBpInfo = () => {
		const bpInfoModel = {
			bpEmployeeNo: this.props.employeeNo,
			bpBelongCustomerCode: this.state.bpBelongCustomerCode,
			bpUnitPrice: this.state.bpUnitPrice,
			bpSalesProgressCode: this.state.bpSalesProgressCode,
			bpOtherCompanyAdmissionEndDate: utils.formateDate(this.state.bpOtherCompanyAdmissionEndDate, false),
			unitPriceStartMonth: utils.formateDate(this.state.unitPriceStartMonth, false),
			bpRemark: this.state.bpRemark,
			oldUnitPriceStartMonth: this.state.oldUnitPriceStartMonth,
		};
		if(this.props.actionType === "update"){
			axios.post(this.state.serverIP + "employee/updatebpInfo", bpInfoModel)
			.then(response => {
				if (response.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
					setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
				} else {
					this.setState({ "myToastShow": true, "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				}
				this.getbpInfoList();
				this.setState({ oldUnitPriceStartMonth: null });
			}).catch((error) => {
				console.error("Error - " + error);
			});
		}
		//this.props.pbInfoTokuro(bpInfoModel);
	};

	getCustomer = (event, values) => {
		if (values != null) {
			this.setState({
				bpBelongCustomerCode: values.code,
			})
		} else {
			this.setState({
				bpBelongCustomerCode: "",
			})
		}
	}
	render() {
		const { bpUnitPrice, bpSalesProgressCode, bpRemark, pbInfoEmployeeName, } = this.state;
		// テーブルの行の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			clickToExpand: true,
			onSelect: this.handleRowSelect,
		};
		// テーブルの定義
		const options = {
			page: 1,
			sizePerPage: 5,
			pageStartIndex: 1,
			paginationSize: 3,
			prePage: '<',
			nextPage: '>',
			firstPage: '<<',
			lastPage: '>>',
			paginationShowsTotal: this.renderShowsTotal,
			hideSizePerPage: true,
			expandRowBgColor: 'rgb(165, 165, 165)',
			deleteBtn: this.createCustomDeleteButton,
			onDeleteRow: this.onDeleteRow,
			handleConfirmDeleteRow: this.customConfirm,
			sortIndicator: false, // 隐藏初始排序箭头
		};
		return (
			<div>
				<Row inline="true">
					<Col className="text-center">
						<h2>BP情報入力</h2>
					</Col>
				</Row>
				<br />
				<Form >
					<Form.Group>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									BP社員名：{pbInfoEmployeeName}
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">BP所属</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										id="bpBelongCustomerCode"
										name="bpBelongCustomerCode"
										value={this.state.customer.find(v => v.code === this.state.bpBelongCustomerCode) || {}}
										onChange={(event, values) => this.getCustomer(event, values)}
										options={this.state.customer}
										disabled={this.props.actionType === "detail" ? true : false}
										getOptionLabel={(option) => option.name}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  BP所属" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-bpInfo-bpBelongCustomerCode" id="bpBelongCustomerCode"
													style={{"backgroundColor": this.props.actionType === "detail" ? "#e9ecef" : "" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">営業状況</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.bpSalesProgressCodeChange}
										name="bpSalesProgressCode" value={bpSalesProgressCode}
										autoComplete="off" disabled={this.props.actionType === "detail" ? true : false}>
										{this.state.salesProgressCodes.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="sixKanji">単価開始年月</InputGroup.Text>
									</InputGroup.Prepend>
									<DatePicker
										selected={this.state.unitPriceStartMonth}
										onChange={this.unitPriceStartMonthChange}
										autoComplete="off"
										showMonthYearPicker
										showFullMonthYearPicker
										showDisabledMonthNavigation
										className="form-control form-control-sm"
										id={this.props.actionType === "detail" || bpSalesProgressCode === "4" ? "datePickerReadonlyDefault-bpInfo" : "datePicker-bpInfo"}
										dateFormat={"yyyy/MM"}
										locale="ja"
										disabled={this.props.actionType === "detail" || bpSalesProgressCode === "4" ? true : false}
									/>
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">BP単価</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="BP単価" value={bpUnitPrice} autoComplete="off" 
										onChange={this.valueChange} size="sm" name="bpUnitPrice" maxlength='3' disabled={this.props.actionType === "detail" ? true : false} />
									<InputGroup.Prepend>
										<InputGroup.Text id="twoKanji">万円</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="sixKanji">所属終了年月</InputGroup.Text>
									</InputGroup.Prepend>
									<DatePicker
										selected={this.state.bpOtherCompanyAdmissionEndDate}
										onChange={this.bpOtherCompanyAdmissionEndDateChange}
										autoComplete="off"
										showMonthYearPicker
										showFullMonthYearPicker
										showDisabledMonthNavigation
										className="form-control form-control-sm"
										id={this.props.actionType === "detail" || bpSalesProgressCode === "4" ? "datePickerReadonlyDefault-bpInfo" : "datePicker-bpInfo"}
										dateFormat={"yyyy/MM"}
										locale="ja"
										disabled={this.props.actionType === "detail" || bpSalesProgressCode === "4" ? true : false}
									/>
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="twoKanji">備考</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="例：XXXXX" name="bpRemark" value={bpRemark} autoComplete="off" disabled={this.props.actionType === "detail" ? true : false}
										onChange={this.valueChange} type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<div style={{ "textAlign": "center" }} hidden={this.props.actionType === "detail"}>
						<Button size="sm" variant="info" onClick={this.insertOrUpdateBpInfo} type="button" on>
							<FontAwesomeIcon icon={faSave} /> {this.props.actionType === "update" ? "更新" : "登録"}
						</Button>{' '}
						<Button size="sm" variant="info" onClick={this.resetButton}>
							<FontAwesomeIcon icon={faUndo} /> リセット
                        </Button>
					</div>
					<div style={{ "textAlign": "right" }} hidden={this.props.actionType === "detail"}>
					<Col>
					<Button size="sm" variant="info" type="button" disabled={this.state.oldUnitPriceStartMonth === null} onClick={this.deleteRow}>
						<FontAwesomeIcon icon={faTrash} /> 削除
					</Button>
					</Col>
					</div>
					<div >
						<Row>
							<Col sm={12}>
								<BootstrapTable ref="bpInfoTable"
									data={this.state.bpInfoTable} pagination={true} options={options} deleteRow selectRow={selectRow} headerStyle={{ background: '#5599FF' }} striped hover condensed >
									<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} dataField='rowNo'>番号</TableHeaderColumn>
									<TableHeaderColumn width='25%' tdStyle={{ padding: '.45em' }} dataField='unitPriceStartMonth' isKey>単価開始月</TableHeaderColumn>
									<TableHeaderColumn width='20%' tdStyle={{ padding: '.45em' }} dataField='bpUnitPrice'>単価</TableHeaderColumn>
									<TableHeaderColumn width='40%' tdStyle={{ padding: '.45em' }} dataField='bpRemark'>備考</TableHeaderColumn>
								</BootstrapTable>
							</Col>
						</Row>
					</div>
				</Form>
			</div>
		);
	}
}

/*
 * const mapStateToProps = state => { return { customer:
 * state.data.dataReques.length >= 1 ? state.data.dataReques[15].slice(1) : [],
 * salesProgressCodes: state.data.dataReques.length >= 1 ?
 * state.data.dataReques[16].slice(1) : [], serverIP:
 * state.data.dataReques[state.data.dataReques.length - 1],
 *  } };
 * 
 * const mapDispatchToProps = dispatch => { return { fetchDropDown: () =>
 * dispatch(fetchDropDown()) } }; export default connect(mapStateToProps,
 * mapDispatchToProps)(bpInfo);
 */
export default bpInfo;


