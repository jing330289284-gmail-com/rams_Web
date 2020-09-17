/* 社員を追加 */
import React from 'react';
import { Card, Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as utils from './utils/publicUtils.js';

axios.defaults.withCredentials = true;

class bpInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
	}
	//初期化
	initialState = {
		salesProgressCodes: [],
		bpBelongCustomerCode: '',//選択中のBP所属
		bpUnitPrice: '',//単価
		bpSalesProgressCode: '4',//選択中の営業状況
		bpRemark: '',//備考
		bpOtherCompanyAdmissionEndDate: '',
	};
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	//　　リセット
	resetButton = () => {
		this.setState({
			bpBelongCustomerCode: '',//　　選択中のBP所属
			bpUnitPrice: '',//単価
			bpSalesProgressCode: '4',//選択中の営業状況
			bpOtherCompanyAdmissionEndDate: '',//所属現場終年月
			bpRemark: '',//備考
		})
	};

	//初期化メソッド
	componentDidMount() {
		this.getDropDownｓ();//全部のドロップダウン
		this.setEmployeeName();
		if (this.props.actionType !== "insert") {
			const formData = new FormData()
			formData.append('bpEmployeeNo', this.props.employeeNo)
			axios.post("http://127.0.0.1:8080/bpInfo/getBpInfo", formData)
				.then(response => response.data)
				.then((data) => {
					this.setState({
						bpBelongCustomerCode: data.bpBelongCustomerCode,//　　選択中のBP所属
						bpUnitPrice: data.bpUnitPrice,//単価
						bpSalesProgressCode: data.bpSalesProgressCode,//選択中の営業状況
						bpOtherCompanyAdmissionEndDate: utils.converToLocalTime(data.bpOtherCompanyAdmissionEndDate, false),
						bpRemark: data.bpRemark,//備考
					});
				}
				);
		}
	}

	getDropDownｓ = () => {
		var methodArray = ["getSalesProgress"]
		var data = utils.getPublicDropDown(methodArray);
		this.setState(
			{
				salesProgressCodes: data[0].slice(1),//
			}
		);
	};

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

	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (this.props.customer.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'bpBelongCustomerCode':
						this.setState({
							bpBelongCustomerCode: this.props.customer.find((v) => (v.name === value)).code,
						})
						break;
					default:
				}
			}
		}
	};

	bpOtherCompanyAdmissionEndDateChange = (date) => {
		this.setState(
			{
				bpOtherCompanyAdmissionEndDate: date,
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
			bpRemark: this.state.bpRemark,
		};
		this.props.pbInfoTokuro(bpInfoModel);
	};

	render() {
		const { bpUnitPrice, bpSalesProgressCode, bpRemark, pbInfoEmployeeName } = this.state;
		return (
			<div>
				<Card.Header style={{ "textAlign": "center", "background-color": "white", "border-bottom": "0px" }}>
					<h2>BP情報入力</h2>
				</Card.Header>
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
										value={this.props.customer.find((v) => (v.code === this.state.bpBelongCustomerCode)) || {}}
										options={this.props.customer}
										getOptionLabel={(option) => option.name}
										disabled={this.props.actionType === "detail" ? true : false}
										onSelect={(event) => this.handleTag(event, 'bpBelongCustomerCode')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  BP所属" type="text" {...params.inputProps} className="auto" id="bpBelongCustomerCode"
													style={{ height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057", "backgroundColor": this.props.actionType === "detail"  ? "#e9ecef" : "" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">BP単価</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="BP単価" value={bpUnitPrice} autoComplete="off"
										onChange={this.valueChange} size="sm" name="bpUnitPrice" maxlength='5' disabled={this.props.actionType === "detail" ? true : false} />
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">万円</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">営業状況</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
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
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">所属現場終年月</InputGroup.Text>
									</InputGroup.Prepend>
									<DatePicker
										selected={this.state.bpOtherCompanyAdmissionEndDate}
										onChange={this.bpOtherCompanyAdmissionEndDateChange}
										autoComplete="off"
										showMonthYearPicker
										showFullMonthYearPicker
										showDisabledMonthNavigation
										className="form-control form-control-sm"
										id={this.props.actionType === "detail" ? "datePickerReadonlyDefault" : "datePicker"}
										dateFormat={"yyyy/MM"}
										locale="ja"
										disabled={this.props.actionType === "detail" ? true : false}
									/>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={12}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="例：XXXXX" name="bpRemark" value={bpRemark} autoComplete="off" disabled={this.props.actionType === "detail" ? true : false}
										onChange={this.valueChange} type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					{this.props.actionType === "detail" ? "" : <div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" onClick={this.insertOrUpdateBpInfo} type="button" on>
							<FontAwesomeIcon icon={faSave} /> {this.props.actionType === "update" ? "更新" : "登録"}
						</Button>{' '}
						<Button size="sm" variant="info" onClick={this.resetButton}>
							<FontAwesomeIcon icon={faUndo} /> リセット
                        </Button>
					</div>}
				</Form>
			</div>
		);
	}
}
export default bpInfo;
