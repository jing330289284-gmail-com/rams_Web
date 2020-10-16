/* 社員を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as utils from './utils/publicUtils.js';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
axios.defaults.withCredentials = true;

class otherCost extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
	}
	//初期化
	initialState = {
		salesProgressCodes: [],
		costClassificationCode: '',//選択中の区分
		transportationCode: '',//選択中の交通手段
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
			costClassificationCode: '',//　　選択中の区分
			transportationCode: '',//選択中の交通手段
			bpUnitPrice: '',//単価
			bpSalesProgressCode: '4',//選択中の営業状況
			bpOtherCompanyAdmissionEndDate: '',//所属現場終年月
			bpRemark: '',//備考
		})
	};

	//初期化メソッド
	componentDidMount() {
		//this.getDropDownｓ();//全部のドロップダウン
		this.setEmployeeName();
		this.props.fetchDropDown();
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

	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (fieldName === "costClassification" && this.props.costClassification.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'costClassification':
						this.setState({
							costClassificationCode: this.props.costClassification.find((v) => (v.name === value)).code,
						})
					break;
				default:
				}
			}else if (fieldName === "transportation" && this.props.transportation.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'transportation':
						this.setState({
							transportationCode: this.props.transportation.find((v) => (v.name === value)).code,
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
			costClassificationCode: this.state.costClassificationCode,
			transportationCode: this.state.transportationCode,
			bpUnitPrice: this.state.bpUnitPrice,
			bpSalesProgressCode: this.state.bpSalesProgressCode,
			bpOtherCompanyAdmissionEndDate: utils.formateDate(this.state.bpOtherCompanyAdmissionEndDate, false),
			bpRemark: this.state.bpRemark,
		};
		this.props.pbInfoTokuro(bpInfoModel);
	};

	render() {
		const { bpRemark} = this.state;

		const costClassification = this.props.costClassification;
		const transportation = this.props.transportation;
		return (
			<div>
				<Row inline="true">
                        <Col className="text-center">
                            <h2>他の費用</h2>
                        </Col>
                </Row>
				<br />
				<Form >
					<Form.Group>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={costClassification.find((v) => (v.code === this.state.costClassificationCode)) || {}}
										options={costClassification}
										name="station"
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'costClassification')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  区分" type="text" {...params.inputProps} className="auto" id="costClassificationCode"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={2}>
								<font style={{ whiteSpace: 'nowrap' }}><b>出張費用</b></font>
							</Col>	
						</Row>	
					<Row>
						<Col sm={4}>
							<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">期間</InputGroup.Text>
										<DatePicker
											selected={this.state.yearAndMonth3}
											onChange={this.inactiveYearAndMonth3}
											autoComplete="off"
											locale="ja"
											dateFormat="yyyy/MM/dd"
											id="datePicker3"
											className="form-control form-control-sm"
										/>
									</InputGroup.Prepend>
								</InputGroup>	
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">交通手段</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={transportation.find((v) => (v.code === this.state.transportationCode)) || {}}
										options={transportation}
										name="station"
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'transportation')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  区分" type="text" {...params.inputProps} className="auto" id="transportationCode"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
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

const mapStateToProps = state => {
	return {
		costClassification: state.data.dataReques.length >= 1 ? state.data.dataReques[30] : [],
		transportation: state.data.dataReques.length >= 1 ? state.data.dataReques[31] : [],
		serverIP: state.data.dataReques[state.data.dataReques.length-1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(otherCost);

