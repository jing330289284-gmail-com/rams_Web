/* 社員を追加 */
import React from 'react';
import $ from 'jquery'
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUpload, faUndo, faFile } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as publicUtils from './utils/publicUtils.js';
import store from './redux/store';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import costRegistration from './costRegistration';
import * as utils from './utils/publicUtils.js';
axios.defaults.withCredentials = true;
/**1
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
		roundCode:'',
		costClassificationsts: 0,//区分状態
		otherCostFileFlag2: false,//ファイル2状態
		otherCostFileFlag3: false,//ファイル3状態
		station: store.getState().dropDown[14],
		costClassificationForOtherCost: store.getState().dropDown[47],
		transportation: store.getState().dropDown[31],
		round: store.getState().dropDown[37],
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}
	costValueChange = (e) => {
		let cost = e.target.value
		cost = utils.addComma(cost)
		this.setState({
			[e.target.name]: cost
		})
	}
	valueChangeAndFlag = event => {
		if (event.target.value > 1 && this.state.costClassificationCode ==1) {
			this.resetBook2();
		} else if(this.state.costClassificationCode > 1 && event.target.value == 1){
			this.resetBook2();
        }
		this.setState({
			[event.target.name]: event.target.value,
			changeFile: true,
		})

		

	}
	//初期化メソッド
	componentDidMount() {
		this.setState({ "errorsMessageShow": false, "myToastShow": false, minDate: this.props.minDate, deleteFile:false });
		//定期を選択欄から除去
		if (this.state.costClassificationForOtherCost.length >= 6) {
			this.costClassificationForOtherCost();
		}
		if (this.state.round.length > 3) {
			this.roundSet();
		}
		if (this.props.changeData1) {
			if (this.props.costClassification == 1) {
				this.setState({
					costClassificationCode: this.props.costClassification,
					oldCostClassification: this.props.oldCostClassification1,
					oldHappendDate: this.props.oldHappendDate1,
					yearAndMonth3: this.props.yearAndMonth3,
					transportationCode: this.props.transportationCode.toString(),
					stationCode3: this.props.stationCode3.toString(),
					stationCode4: this.props.stationCode4.toString(),
					roundCode: this.props.roundCode.toString(),
					cost1: this.props.cost1,
					oldCostFile: this.props.oldCostFile1,
					changeData: this.props.changeData1,
					changeFile: this.props.changeFile1,
					costRegistrationFileFlag2: this.props.costRegistrationFileFlag1,
				})
			} else {
				this.setState({
					costClassificationCode: this.props.costClassification,
					oldCostClassification: this.props.oldCostClassification1,
					oldHappendDate: this.props.oldHappendDate1,
					yearAndMonth4: this.props.yearAndMonth4,
					detailedNameOrLine2: this.props.detailedNameOrLine2,
					stationCode5: this.props.stationCode5.toString(),
					remark: this.props.remark,
					cost2: this.props.cost2,
					oldCostFile: this.props.oldCostFile1,
					changeData: this.props.changeData1,
					changeFile: this.props.changeFile1,
					costRegistrationFileFlag3: this.props.costRegistrationFileFlag1,
				})
			}
		} else {
			this.resetBook();
        }
		

	}

	costClassificationForOtherCost = () => {
		var costClassificationForOtherCost = this.state.costClassificationForOtherCost;
		console.log(this.state.costClassificationForOtherCost)
		console.log(this.state.costClassificationForOtherCost.splice(1, 1))
		this.setState({
			costClassificationForOtherCost: this.state.costClassificationForOtherCost,
		})
	};
	roundSet = () => {
		var round = this.state.round;
		console.log(this.state.round)
		console.log(this.state.round.splice(1, 1))
		this.setState({
			round: this.state.round,
		})
	};
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
				changeFile: true,
				costRegistrationFileFlag2: true,
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
				changeFile: true,
				costRegistrationFileFlag3:true,
			})
			if (filePath != null) {
				this.setState({
					otherCostFileFlag3: true,
				})
			}
		}
	}
	//reset
	resetBook = () => {
		this.setState(() => this.resetStates);
		this.setState({ "errorsMessageShow": false, "myToastShow": false, });
	};
	//リセット　reset
	resetStates = {
		costClassificationCode: '0', yearAndMonth3: null, yearAndMonth4: null, stationCode2: '',
		stationCode3: '', stationCode4: '', stationCode5: '', detailedNameOrLine2: '',
		roundCode: 0, cost1: '', cost2: '', transportationCode: '', costRegistrationFileFlag2: '',
		costRegistrationFileFlag3: '', remark: '', oldCostFile: '', otherCostFile2: '',
		otherCostFile3: '',
	};
	resetBook2 = () => {
		this.setState(() => this.changeCostClassificationCode);
		this.setState({ "errorsMessageShow": false, "myToastShow": false, });
	};
	changeCostClassificationCode={
		yearAndMonth3: null, yearAndMonth4: null, stationCode2: '',
		stationCode3: '', stationCode4: '', stationCode5: '', detailedNameOrLine2: '',
		roundCode: 0, cost1: '', cost2: '', transportationCode: '', costRegistrationFileFlag2: '',
		costRegistrationFileFlag3: '', remark: '', otherCostFile2: '',otherCostFile3: '',
	};
	costClassificationCode(code) {
		let costClassificationCode = this.state.costClassificationForOtherCost;
		for (var i in costClassificationCode) {
			if (costClassificationCode[i].code != "") {
				if (code == costClassificationCode[i].code) {
					return costClassificationCode[i].name;
				}
			}
		}
	};
	//　年月3
	inactiveYearAndMonth3 = (date) => {
		this.setState(
			{
				yearAndMonth3: date,
				changeFile: true,
			}
		);
	};
	//　年月4
	inactiveYearAndMonth4 = (date) => {
		this.setState(
			{
				yearAndMonth4: date,
				changeFile: true,
			}
		);
	};
	inactivecostClassification(event) {

	};
	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (fieldName === "costClassification" && this.state.costClassification.find((v) => (v.name === value)) !== undefined) {
				this.setState({
					costClassificationCode: this.state.costClassification.find((v) => (v.name === value)).code,
				})
			} else if (fieldName === "transportation" && this.state.transportation.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'transportation':
						this.setState({
							transportationCode: this.state.transportation.find((v) => (v.name === value)).code,
						})
						break;
					default:
				}
			} else if (fieldName === "station" && this.state.station.find((v) => (v.name === value)) !== undefined) {
				switch (id) {
					case 'stationCode3':
						this.setState({
							stationCode3: this.state.station.find((v) => (v.name === value)).code,
						})
						break;
					case 'stationCode4':
						this.setState({
							stationCode4: this.state.station.find((v) => (v.name === value)).code,
						})
						break;
					case 'stationCode5':
						this.setState({
							stationCode5: this.state.station.find((v) => (v.name === value)).code,
						})
						break;
					default:
				}
			} else if (fieldName === "round" && this.state.round.find((v) => (v.name === value)) !== undefined) {
				this.setState({
					roundCode: this.state.round.find((v) => (v.name === value)).code,
				})
			}


		}
	};
	//登録と修正
	InsertCost = () => {
		this.setState({ "errorsMessageShow": false, "myToastShow": false,  });
		const formData = new FormData()
		if (this.state.changeData) {
			var theUrl = "costRegistration/updateCostRegistration"
		} else {
			var theUrl = "costRegistration/insertCostRegistration"
		}
		if (this.state.costClassificationCode < 1) {
			this.setState({ "errorsMessageShow": true, "type": "fail", "method": "put", "message": "区分を入力してください" });
				return;
			}
		if (this.state.costClassificationCode == 1) {
			/*if ($('#otherCostFile2').val() == "" &&
				!this.state.changeData) {
				this.setState({ "errorsMessageShow": true, "type": "fail", "method": "put", "message": "添付ファイルを入れてください" });
				return;
			}*/
			if (this.state.yearAndMonth3 == "" ||
			this.state.transportationCode == "" ||
			this.state.stationCode3 == "" ||
			this.state.stationCode4 == "" ||
			this.state.roundCode ==0 ||
			isNaN(utils.deleteComma(this.state.cost1))) {
				this.setState({ "errorsMessageShow": true, "type": "fail", "method": "put", "message": "全項目入力してください" });
				return;
			}
			const emp = {
				costClassificationName: this.costClassificationCode(this.state.costClassificationCode),
				costClassificationCode: this.state.costClassificationCode,
				oldCostClassificationName: this.costClassificationCode(this.state.oldCostClassification),
				oldCostClassificationCode: this.state.oldCostClassification,
				oldHappendDate: this.state.oldHappendDate,
				happendDate: publicUtils.formateDate(this.state.yearAndMonth3, true),
				transportationCode: this.state.transportationCode,
				originCode: this.state.stationCode3,
				destinationCode: this.state.stationCode4,
				roundCode: this.state.roundCode,
				cost: utils.deleteComma(this.state.cost1),
				changeFile: this.state.changeFile,
				oldCostFile: this.state.oldCostFile,
			}
			formData.append('emp', JSON.stringify(emp))
			formData.append('costFile', publicUtils.nullToEmpty($('#otherCostFile2').get(0).files[0]))

		} else if (this.state.costClassificationCode > 1) {
/*			if ($('#otherCostFile3').val() == "" &&
				!this.state.changeData) {
				this.setState({ "errorsMessageShow": true, "method": "put", "message": "添付ファイルを入れてください" });
				return;
			}*/
			if (this.state.yearAndMonth4 == "" ||
				this.state.detailedNameOrLine2 == "" ||
				this.state.stationCode5 == "" ||
				this.state.remark == "" ||
				isNaN(utils.deleteComma(this.state.cost2))) {
				this.setState({ "errorsMessageShow": true, "method": "put", "message": "全項目入力してください"  });
				return;
			}
			const emp = {
				costClassificationName: this.costClassificationCode(this.state.costClassificationCode),
				costClassificationCode: this.state.costClassificationCode,
				happendDate: publicUtils.formateDate(this.state.yearAndMonth4, true),
				oldCostClassificationName: this.costClassificationCode(this.state.oldCostClassification),
				oldCostClassificationCode: this.state.oldCostClassification,
				oldHappendDate: this.state.oldHappendDate,
				detailedNameOrLine: this.state.detailedNameOrLine2,
				stationCode: this.state.stationCode5,
				transportationCode: this.state.transportationCode,
				remark: this.state.remark,
				cost: utils.deleteComma(this.state.cost2),
				changeFile: this.state.changeFile,
				oldCostFile: this.state.oldCostFile,
			}
			formData.append('emp', JSON.stringify(emp))
			formData.append('costFile', publicUtils.nullToEmpty($('#otherCostFile3').get(0).files[0]))
		}
		axios.post(this.state.serverIP + theUrl, formData)
			.then(response => {
				if (response.data) {
					this.setState({ "myToastShow": true, "method": "put", "message": "登録完了"});
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					this.props.otherCostToroku();
				} else {
					this.setState({ "errorsMessageShow": true, "message": "データはすでに存在している"});
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				}
				
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};
	render() {
		const { cost1, cost2, remark, costClassificationsts, otherCostFileFlag2, otherCostFileFlag3 } = this.state;
		const station = this.state.station;
		const round = this.state.round;
		return (
			<div>
				<Form.File id="getFile" accept="application/pdf,application/vnd.ms-excel" custom hidden="hidden" onChange={this.fileUpload} />
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.message} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={this.state.message} type={"danger"} />
				</div>
				<Form >
					<div>
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>他の費用</h2>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<Form >
					<Form.Group>
						<Row>
							<Col sm={1}></Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select"
										onChange={this.valueChangeAndFlag.bind(this)}
										size="sm"
										name="costClassificationCode"
										value={this.state.costClassificationCode}
										autoComplete="off">
										{this.state.costClassificationForOtherCost.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={1}></Col>
							<Col sm={2}>
								<font style={{ whiteSpace: 'nowrap' }}><b>出張費用</b></font>
							</Col>
						</Row>
						<Row>
							<Col sm={1}></Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
										<DatePicker
											value={this.state.yearAndMonth3}
											selected={this.state.yearAndMonth3}
											onChange={this.inactiveYearAndMonth3}
											disabled={this.state.costClassificationCode != 1 ? true : false}
											autoComplete="off"
											locale="ja"
											minDate={this.state.minDate}
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
									<Form.Control as="select"
										onChange={this.valueChange}
										size="sm"
										name="transportationCode"
										value={this.state.transportationCode}
										autoComplete="off"
										disabled={this.state.costClassificationCode != 1 ? true : false}
									>
										{this.state.transportation.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出発</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={this.state.station.find((v) => (v.code === this.state.stationCode3)) || {}}
										options={this.state.station}
										id="station3"
										disabled={this.state.costClassificationCode != 1 ? true : false}
										name="station"
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'station')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  出発" type="text" {...params.inputProps} className="auto" id="stationCode3"
													style={{ width: 172, height: 31,borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
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
										value={this.state.station.find((v) => (v.code === this.state.stationCode4)) || {}}
										options={this.state.station}
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
									<Form.Control as="select"
										onChange={this.valueChange}
										size="sm"
										name="roundCode"
										value={this.state.roundCode}
										autoComplete="off"
										disabled={this.state.costClassificationCode != 1 ? true : false}>
										{this.state.round.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={1}></Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">料金</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={cost1} name='cost1' maxLength='7' onChange={(e) => this.costValueChange(e)}  disabled={this.state.costClassificationCode != 1 ? true : false} placeholder="例：XXXXX" autoComplete="off"  type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<Button size="sm" onClick={(event) => this.addFile(event, 'otherCostFile2')}><FontAwesomeIcon icon={faFile} disabled={this.state.costClassificationCode != 1 ? true : false} />{this.state.costRegistrationFileFlag2 !== true ? " 添付" : " 添付済み"} </Button>
									<Form.File id="otherCostFile2" hidden value={this.state.otherCostFile2} custom onChange={(event) => this.changeFile(event, 'otherCostFile2')} disabled={this.state.costClassificationCode != 1 ? true : false} />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={1}></Col>
							<Col sm={2}>
								<font style={{ whiteSpace: 'nowrap' }}><b>宿泊と食事費用など</b></font>
							</Col>
						</Row>
						<Row>
							<Col sm={1}></Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
										<DatePicker
											selected={this.state.yearAndMonth4}
											onChange={this.inactiveYearAndMonth4}
											autoComplete="off"
											locale="ja"
											minDate={this.state.minDate}
											dateFormat="yyyy/MM/dd"
											id="datePicker4"
											disabled={this.state.costClassificationCode > 1 ? false : true}
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
									<FormControl placeholder="" autoComplete="off" name="detailedNameOrLine2" value={this.state.detailedNameOrLine2}
										onChange={this.valueChange} type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" disabled={this.state.costClassificationCode > 1 ? false : true} />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3" >
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={this.state.station.find((v) => (v.code === this.state.stationCode5)) || {}}
										options={this.state.station}
										name="station"
										disabled={this.state.costClassificationCode > 1 ? false : true}
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'station')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  場所" type="text" {...params.inputProps} className="auto" id="stationCode5"
													style={{ width: 172, height: 31,borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
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
									<FormControl placeholder="例：XXXXX" name="remark" value={this.state.remark} autoComplete="off" disabled={this.state.costClassificationCode > 1 ? true : false}
										onChange={this.valueChange} type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" disabled={this.state.costClassificationCode > 1 ? false : true} />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={1}></Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">料金</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={cost2} name='cost2' maxLength='7' onChange={(e) => this.costValueChange(e)}  value={this.state.cost2} placeholder="例：XXXXX" autoComplete="off" type="text" aria-label="Small" size="sm" aria-describedby="inputGroup-sizing-sm" disabled={this.state.costClassificationCode > 1 ? false : true} />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<Button size="sm" onClick={(event) => this.addFile(event, 'otherCostFile3')}><FontAwesomeIcon icon={faFile} disabled={this.state.costClassificationCode > 1 ? false : true} />{this.state.costRegistrationFileFlag3 !== true ? " 添付" : " 添付済み"} </Button>
									<Form.File id="otherCostFile3" hidden data-browse="添付" value={this.state.otherCostFile3} custom onChange={(event) => this.changeFile(event, 'otherCostFile3')} disabled={this.state.costClassificationCode > 1 ? false : true} />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" onClick={this.InsertCost} type="button" on>
							<FontAwesomeIcon icon={faSave} /> {"登録"}
						</Button>{' '}
						<Button size="sm" variant="info" type="reset" onClick={this.resetBook}>
							<FontAwesomeIcon icon={faUndo} /> Reset
							</Button>
					</div>
				</Form>
			</div>
		);
	}
}
export default otherCost;