/* 社員を追加 */
import React from 'react';
import $ from 'jquery'
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as publicUtils from './utils/publicUtils.js';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
import store from './redux/store';
axios.defaults.withCredentials = true;
/**
 * 他の費用画面
 */
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
		stationCode3: '',　// 出発
		stationCode4: '',　// 到着
		stationCode5: '',　// 場所
		costClassificationsts: 0,//区分状態
		otherCostFileFlag2: false,//ファイル2状態
		otherCostFileFlag3: false,//ファイル3状態
	};
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	//初期化メソッド
	componentDidMount() {
		this.props.fetchDropDown();
	}
	/**
     * 添付ボタン
     */
	addFile = (event, name) => {
		$("#" + name).click();
	}
	changeFile = (event, name) => {
		var filePath = event.target.value;
		var arr = filePath.split('\\');
		var fileName = arr[arr.length - 1];
		if (name === "otherCostFile2") {
			this.setState({
				otherCostFile2: filePath,
				otherCostFileName2: fileName,
			})
			if (filePath != null) {
				this.setState({
					otherCostFileFlag2: true,
				})
            }
			
		} else if (name === "otherCostFile3") {
			this.setState({
				otherCostFile3: filePath,
				otherCostFileName3: fileName,
			})
			if (filePath != null) {
				this.setState({
					otherCostFileFlag3: true,
				})
            }
		}
	}

		//　年月3
	inactiveYearAndMonth3 = (date) => {
		this.setState(
			{
				yearAndMonth3: date,
			}
		);
	};
		//　年月4
	inactiveYearAndMonth4 = (date) => {
		this.setState(
			{
				yearAndMonth4: date,
			}
		);
	};
	inactivecostClassification(event){
		
	};
	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (fieldName === "costClassification" && this.props.costClassification.find((v) => (v.name === value)) !== undefined) {
				this.setState({
					costClassificationCode: this.props.costClassification.find((v) => (v.name === value)).code,
				})
			}else if (fieldName === "transportation" && this.props.transportation.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'transportation':
						this.setState({
							transportationCode: this.props.transportation.find((v) => (v.name === value)).code,
						})
						break;
					default:
				}
			}else if(fieldName === "station" && this.props.station.find((v) => (v.name === value)) !== undefined) {
				switch (id) {
					case 'stationCode3':
						this.setState({
							stationCode3: this.props.station.find((v) => (v.name === value)).code,
						})
						break;
					case 'stationCode4':
						this.setState({
							stationCode4: this.props.station.find((v) => (v.name === value)).code,
						})
						break;
						case 'stationCode5':
						this.setState({
							stationCode5: this.props.station.find((v) => (v.name === value)).code,
						})
						break;
					default:
				}
			}else if(fieldName === "round" && this.props.round.find((v) => (v.name === value)) !== undefined) {
						this.setState({
							round: this.props.round.find((v) => (v.name === value)).code,
						})
				}
				
		
		}
	};
	InsertCost = () => {
		const formData = new FormData()
		if(this.state.costClassificationCode==1){
			const emp = {
				costClassificationCode: this.state.costClassificationCode,
				happendDate: publicUtils.formateDate(this.state.yearAndMonth3, true),
				transportationCode: this.state.transportationCode,
				originCode: this.state.stationCode3,
				destinationCode: this.state.stationCode4,
				round: this.state.round,
				cost: this.state.cost1,
			}
			formData.append('emp', JSON.stringify(emp))
			formData.append('costFile', publicUtils.nullToEmpty($('#otherCostFile2').get(0).files[0]))
			this.props.otherCostTokuro(emp);
		}else{
			const emp = {
				costClassificationCode: this.state.costClassificationCode,
				happendDate: publicUtils.formateDate(this.state.yearAndMonth4,true),
				detailedName: this.state.detailedName,
				stationCode: this.state.stationCode4,
				transportationCode: this.state.transportationCode,
				remark: this.state.remark,
				cost: this.state.cost2,
			}
			formData.append('emp', JSON.stringify(emp))
			formData.append('costFile', publicUtils.nullToEmpty($('#otherCostFile3').get(0).files[0]))
			this.props.otherCostTokuro(emp);
		}
		axios.post(this.props.serverIP + "costRegistration/insertCostRegistration", formData)
			.then(response => {
				if (response.data != null) {
					this.setState({ "myToastShow": true, "method": "put" });
				} else {
					this.setState({ "myToastShow": false });
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};
	render() {
		const { cost1,cost2,remark, costClassificationsts, otherCostFileFlag2, otherCostFileFlag3} = this.state;
		const costClassification = this.props.costClassification;
		const transportation = this.props.transportation;
		const station = this.props.station;
		const round = this.props.round;
		return (
			<div>
			<Form.File id="getFile" accept="application/pdf,application/vnd.ms-excel" custom hidden="hidden" onChange={this.fileUpload}/>
			<Form >
				<Form.Group>
					<Row>
						<Col sm={2}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">区分</InputGroup.Text>
								</InputGroup.Prepend>
								<Autocomplete
									value={costClassification.find((v) => (v.code === this.state.costClassificationCode)) || {}}
									options={costClassification}
									id="costClassification"
									name="station"
									getOptionLabel={(option) => option.name}
									onSelect={(event) => this.handleTag(event, 'costClassification')}
									onInputChange={this.inactivecostClassification.bind()}
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
						<Col sm={2}>
							<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
										<DatePicker
											selected={this.state.yearAndMonth3}
											onChange={this.inactiveYearAndMonth3}
											disabled={this.state.costClassificationCode != 1 ? true : false}
											autoComplete="off"
											locale="ja"
											dateFormat="yyyy/MM/dd"
											id="datePicker3"
											className="form-control form-control-sm"
										/>
									</InputGroup.Prepend>
								</InputGroup>	
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">交通手段</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={transportation.find((v) => (v.code === this.state.transportationCode)) || {}}
										options={transportation}
										id="transportation"
										name="station"
										disabled={this.state.costClassificationCode != 1 ? true : false}
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
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出発</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={station.find((v) => (v.code === this.state.stationCode3)) || {}}
										options={station}
										id="station3"
										disabled={this.state.costClassificationCode != 1 ? true : false}
										name="station"
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'station')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  出発" type="text" {...params.inputProps} className="auto" id="stationCode3"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
						<Col sm={2}>
								<InputGroup size="sm" className="mb-3" >
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">到着</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={station.find((v) => (v.code === this.state.stationCode4)) || {}}
										options={station}
										id="station4"
										name="station"
										disabled={this.state.costClassificationCode != 1 ? true : false}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'station')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  到着" type="text" {...params.inputProps} className="auto" id="stationCode4"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">往復</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={round.find((v) => (v.code === this.state.round)) || {}}
										options={round}
										id="round"
										name="round"
										disabled={this.state.costClassificationCode != 1 ? true : false}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'round')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  往復" type="text" {...params.inputProps} className="auto" id="roundCode"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">料金</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={cost1} name='cost1' disabled={this.state.costClassificationCode != 1 ? true : false} placeholder="例：XXXXX" autoComplete="off" onChange={this.valueChange} type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" />
								</InputGroup>
							</Col>
							 <Col sm={2}>
                            <div style={{ "float": "right" }}>
								<Col sm={6}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm" >添付</InputGroup.Text>
											<InputGroup.Text id="inputGroup-sizing-sm" onClick={(event) => this.addFile(event, 'otherCostFile2')}>{this.state.otherCostFile2 !== undefined ? "添付済み" : "添付"} </InputGroup.Text>
											<Form.File id="otherCostFile2" hidden value={this.state.otherCostFile2} custom onChange={(event) => this.changeFile(event, 'otherCostFile2')} disabled={this.state.costClassificationCode != 1 ? true : false} />
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
	 						</div>
						</Col>
						</Row>
						<Row>
							<Col sm={2}>
								<font style={{ whiteSpace: 'nowrap' }}><b>宿泊と食事費用など</b></font>
							</Col>	
						</Row>	
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
											<DatePicker
												selected={this.state.yearAndMonth4}
												onChange={this.inactiveYearAndMonth4}
												autoComplete="off"
												locale="ja"
												dateFormat="yyyy/MM/dd"
												id="datePicker4"
												disabled={this.state.costClassificationCode <2 ? true : false}
												className="form-control form-control-sm"
											/>
										</InputGroup.Prepend>
									</InputGroup>	
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">名称</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl placeholder="" autoComplete="off"
										onChange={this.valueChange} type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" disabled={this.state.costClassificationCode < 2 ? true : false}/>
									</InputGroup>
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3" >
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											value={station.find((v) => (v.code === this.state.stationCode5)) || {}}
											options={station}
											name="station"
											disabled={this.state.costClassificationCode < 2 ? true : false}
											getOptionLabel={(option) => option.name}
											onSelect={(event) => this.handleTag(event, 'station')}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  場所" type="text" {...params.inputProps} className="auto" id="stationCode5"
														style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
												</div>
											)}
										/>
									</InputGroup>
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
										</InputGroup.Prepend>
									<FormControl placeholder="例：XXXXX" name="remark" value={remark} autoComplete="off" disabled={this.state.costClassificationCode >1 ? true : false}
										onChange={this.valueChange} type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" disabled={this.state.costClassificationCode < 2 ? true : false}/>
									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">料金</InputGroup.Text>
										</InputGroup.Prepend>
									<FormControl value={cost2} name='cost2' placeholder="例：XXXXX" autoComplete="off" onChange={this.valueChange} type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" disabled={this.state.costClassificationCode < 2 ? true : false}/>
									</InputGroup>
								</Col>
								<Col sm={2}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm" >添付</InputGroup.Text>
											<InputGroup.Text id="inputGroup-sizing-sm" onClick={(event) => this.addFile(event, 'otherCostFile3')}>{this.state.otherCostFile3 !== undefined ? "添付済み" : "添付"} </InputGroup.Text>
											<Form.File id="otherCostFile3" hidden data-browse="添付" value={this.state.otherCostFile3} custom onChange={(event) => this.changeFile(event, 'otherCostFile3')} disabled={this.state.costClassificationCode < 2 ? true : false} />
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
							</Row>
						</Form.Group>
						<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" onClick={this.InsertCost} type="button" on>
								<FontAwesomeIcon icon={faSave} /> {"登録"}
							</Button>
						</div>
				</Form>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		station: state.data.dataReques.length >= 1 ? state.data.dataReques[14] : [],
		costClassification: state.data.dataReques.length >= 1 ? state.data.dataReques[30] : [],
		transportation: state.data.dataReques.length >= 1 ? state.data.dataReques[31] : [],
		round: state.data.dataReques.length >= 1 ? state.data.dataReques[37] : [],
		serverIP: state.data.dataReques[state.data.dataReques.length - 1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(otherCost);