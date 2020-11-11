import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl, Modal} from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker, {  } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faUndo, faFile } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import MyToast from './myToast';
import store from './redux/store';
import OtherCostModel from './otherCost';
/**
 * 費用登録画面
 */


function transportationCode(code, roundCode) {

	for (var i in roundCode) {
		if (roundCode[i].code != "") {
			if (code == roundCode[i].code) {
				return roundCode[i].name;
			}
		}
	}

};
class costRegistration extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.searchCostRegistration = this.searchCostRegistration.bind(this);
		this.searchEmployeeName = this.searchEmployeeName.bind(this);
	};

	componentDidMount() {
		this.searchCostRegistration();
		this.searchEmployeeName();
	}
	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	//　初期化データ
	initialState = {
		employeeList: [],
		approvalStatuslist: [],
		stationCode1: '',　// 出発
		stationCode2: '',　// 到着
		showOtherCostModal: false,//他の費用
		otherCostModel: null,//他の費用データ
		changeData: false,//insert:false
		station: store.getState().dropDown[14],
		costClassification: store.getState().dropDown[30],
		transportation: store.getState().dropDown[31],
		round: store.getState().dropDown[37],
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};
	//　検索
	searchCostRegistration = () => {
		this.setState({
			yearAndMonth3: '',
			transportationCode: '',
			stationCode3: '',
			stationCode4: '',
			roundCode: '',
			cost1: '',
			oldCostClassification: '',
			oldHappendDate1: '',
			yearAndMonth4: '',
			detailedNameOrLine2: '',
			stationCode5: '',
			remark: '',
			cost2: '',
			oldCostFile: '',
			changeData: '',
			changeFile: '',
			costRegistrationFileFlag: '',
		})
		axios.post(this.state.serverIP + "costRegistration/selectCostRegistration")
			.then(response => response.data)
			.then((data) => {
				var sumCost = 0;
				if (data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						sumCost = sumCost + (data[i].cost * 1);
						if (data[i].costFile != null) {
							data[i].costFileForShow = (data[i].costFile).split("\\")[(data[i].costFile).split("\\").length - 1];
						}
						if (data[i].costClassificationCode == 0) {
							data[i].happendDate = data[i].happendDate + "～" + data[i].dueDate;
						}
					}
				} else {
					var sumCost = "";
				}
				this.setState({
					employeeList: data, sumCost: sumCost
				})
			});
	};
	searchEmployeeName = () => {

		axios.post(this.state.serverIP + "costRegistration/selectEmployeeName")
			.then(response => {
				this.setState({
					employeeName: response.data.employeeName,
				})

			});
	};

	//登録と修正
	InsertCost = () => {
		if ($('#costRegistrationFile').val() == "" &&
			!this.state.changeData) {
			this.setState({ "myToastShow": true, "method": "put", "message": "入力不具合" });
			setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			return;
        }
		const formData = new FormData()
		if (this.state.yearAndMonth1 == "" ||
			this.state.yearAndMonth2 == "" ||
			isNaN(this.state.cost) ||
			this.state.stationCode1 == "" ||
			this.state.stationCode2 == "" ||
			this.state.detailedNameOrLine == "" ||
			this.state.costRegistrationFile == "" ||
			this.state.yearAndMonth1 > this.state.yearAndMonth2) {
			this.setState({ "myToastShow": true, "method": "put", "message": "入力不具合" });
			setTimeout(() => this.setState({ "myToastShow": false }), 3000);
			return;
		}
		if (this.state.changeData) {
			var theUrl = "costRegistration/updateCostRegistration"
		} else {
			var theUrl = "costRegistration/insertCostRegistration"
		}
		const emp = {
			costClassificationCode: 0,
			costClassificationName:this.costClassificationCode(0),
			happendDate: publicUtils.formateDate(this.state.yearAndMonth1, true),
			dueDate: publicUtils.formateDate(this.state.yearAndMonth2, true),
			transportationCode: this.state.stationCode1,
			destinationCode: this.state.stationCode2,
			detailedNameOrLine: this.state.detailedNameOrLine,
			cost: this.state.cost,
			oldHappendDate: this.state.oldHappendDate,
			oldCostClassificationCode: 0,
			oldCostFile: this.state.oldCostFile,
			changeFile: this.state.changeFile,
		}
		formData.append('emp', JSON.stringify(emp))
		formData.append('costFile', publicUtils.nullToEmpty($('#costRegistrationFile').get(0).files[0]))
		axios.post(this.state.serverIP + theUrl, formData)
			.then(response => {
				if (response.data) {
					this.setState({changeData: false,})
					this.setState({ "myToastShow": true, "method": "put", "message": "登録完了" });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					window.location.reload();
				} else {
					this.setState({ "myToastShow": true, "method": "put", "message": "登録失敗" });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};
/**
*修正ボタン
*/
	listChange = () => {
		if (this.state.rowSelectCostClassificationCode == 0) {
			var splDate = (this.state.rowSelectHappendDate).split("～");
			this.setState({
				oldCostClassification: this.state.rowSelectCostClassificationCode,
				oldHappendDate: splDate[0],
				yearAndMonth1: publicUtils.converToLocalTime(splDate[0], true),
				yearAndMonth2: publicUtils.converToLocalTime(splDate[1], true),
				detailedNameOrLine: this.state.rowSelectDetailedNameOrLine,
				stationCode1: this.state.rowSelectTransportationCode.toString(),
				stationCode2: this.state.rowSelectDestinationCode.toString(),
				cost: this.state.rowSelectCost,
				oldCostFile: this.state.rowSelectCostFile,
				changeData: true,
				changeFile: false,
				costRegistrationFileFlag: true,
			})
		} else if (this.state.rowSelectCostClassificationCode == 1) {
			this.setState({
				oldCostClassification1: this.state.rowSelectCostClassificationCode.toString(),
				oldHappendDate1: this.state.rowSelectHappendDate,
				costClassification1: this.state.rowSelectCostClassificationCode,
				yearAndMonth3: publicUtils.converToLocalTime(this.state.rowSelectHappendDate, true),
				transportationCode: this.state.rowSelectTransportationCode,
				stationCode3: this.state.rowSelectTransportationCode,
				stationCode4: this.state.rowSelectDestinationCode,
				roundCode: this.state.rowSelectRoundCode,
				cost1: this.state.rowSelectCost,
				oldCostFile: this.state.rowSelectCostFile,
				changeData1: true,
				changeFile1: false,
				costRegistrationFileFlag1: true,
				showOtherCostModal:true,
			});
		} else if(this.state.rowSelectCostClassificationCode > 1){
			this.setState({
				oldCostClassification1: this.state.rowSelectCostClassificationCode.toString(),
				oldHappendDate1: this.state.rowSelectHappendDate,
				costClassification1: this.state.rowSelectCostClassificationCode,
				yearAndMonth4: publicUtils.converToLocalTime(this.state.rowSelectHappendDate, true),
				detailedNameOrLine2: this.state.rowSelectDetailedNameOrLine,
				stationCode5: this.state.rowSelectStationCode,
				remark: this.state.rowSelectRemark,
				cost2: this.state.rowSelectCost,
				oldCostFile: this.state.rowSelectCostFile,
				changeData1: true,
				changeFile1: false,
				costRegistrationFileFlag1: true,
				showOtherCostModal: true,
			});
        }		
	}
		/**
	*削除
	*/
	listDel = () => {
		var a = window.confirm("削除していただきますか？");
		if (!a) {
			return;
		}
		var splDate = (this.state.rowSelectHappendDate).split("～");
		const emp = {
			oldCostClassificationCode: this.state.rowSelectCostClassificationCode,
			oldHappendDate: splDate[0],
			oldCostFile: this.state.rowSelectCostFile,
		};
		axios.post(this.state.serverIP + "costRegistration/deleteCostRegistration", emp)
			.then(result => {
				if (result.data ==true) {
					//削除の後で、rowSelectの値に空白をセットする
					this.setState({
							changeData: false,
					})
					this.setState({ "myToastShow": true, "method": "put", "message": "削除完了" });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					window.location.reload();
				} else{
					this.setState({ "myToastShow": true, "method": "put", "message": "削除失敗" });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				}
			}).catch((error) => {
				alert(error);
				console.error("Error - " + error);
			});
	}
	//reset
	resetBook = () => {
		this.setState(() => this.resetStates);
		
	};
	//リセット　reset
	resetStates = {
		yearAndMonth1: null, yearAndMonth2: null, stationCode1: null, stationCode2: null, detailedNameOrLine: '',
		cost: '', costRegistrationFile: null, changeData: false,oldCostClassification1: null,oldHappendDate1: null,
		changeFile: false, costRegistrationFileFlag: false, costClassification1: null,
	};
		//　年月1
	inactiveYearAndMonth1 = (date) => {
		this.setState(
			{
				yearAndMonth1: date,
				changeFile: true,
			}
		);

	};
			//　年月2
	inactiveYearAndMonth2 = (date) => {
		this.setState(
			{
				yearAndMonth2: date,
			}
		);
	};
	state = {
		yearAndMonth: new Date()
	};
	
  /**
     * 添付ボタン
     */
	addFile = (event) => {
		$("#costRegistrationFile").click();
	}
	changeFile = (event) => {
		var filePath = event.target.value;
		var arr = filePath.split('\\');
		var fileName = arr[arr.length - 1];
			this.setState({
				costRegistrationFile: filePath,
				costRegistrationFileName: fileName,
				changeFile:true,
			})
			if (filePath != null) {
				this.setState({
					costRegistrationFileFlag: true,
				})
			}
	}
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState(
				{
					rowSelectHappendDate: row.happendDate,
					rowSelectCostClassificationCode: row.costClassificationCode,
					rowSelectDetailedNameOrLine: row.detailedNameOrLine,
					rowSelectStationCode: row.stationCode,
					rowSelectTransportationCode: row.transportationCode,
					rowSelectDestinationCode: row.destinationCode,
					rowSelectCost: row.cost,
					rowSelectRemark: row.remark,
					rowSelectRoundCode: row.roundCode,
					rowSelectCostFile: row.costFile,
				});
		} else {
			this.setState(
				{
					rowSelectHappendDate: '',
					rowSelectCostClassificationCode: '',
					rowSelectDetailedNameOrLine: '',
					rowSelectStationCode: '',
					rowSelectTransportationCode: '',
					rowSelectDestinationCode: '',
					rowSelectCost: '',
					rowSelectRemark: '',
					rowSelectRoundCode: '',
					rowSelectCostFile: '',
					oldCostClassification1: '',
					oldHappendDate1: '',
					costClassification1: '',
					yearAndMonth3: '',
					transportationCode: '',
					stationCode3: '',
					stationCode4: '',
					roundCode: '',
					cost1: '',
					oldCostFile: '',
					yearAndMonth4: '',
					detailedNameOrLine2: '',
					stationCode5: '',
					remark: '',
					cost2: '',
				}
			);
		}
	}

		/**
 　　　*他の費用画面の開き
    */
	handleShowModal = () => {
			this.setState({ changeData1: false })
			this.setState({ showOtherCostModal: true })
	}
		/**
	*他の費用画面の閉め 
	*/
	handleHideModal = () => {
		this.setState({ showOtherCostModal: false})
	}
		/* 
	他の費用情報の取得
 　　　*/
	otherCostGet = (otherCostGetTokuro) => {
		this.setState({
			otherCostModel: otherCostGetTokuro,
			showOtherCostModal: false,
		})
	}
	// AUTOSELECT select事件
	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (fieldName === "station" && this.state.station.find((v) => (v.name === value)) !== undefined) {
				switch (id) {
					case 'stationCode1':
						this.setState({
							stationCode1: this.state.station.find((v) => (v.name === value)).code,
						})
						break;
					case 'stationCode2':
						this.setState({
							stationCode2: this.state.station.find((v) => (v.name === value)).code,
						})
						break;
					default:
				}
			}
		}
	};
	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}
	otherCostClick = () => {
		alert(123);

		} 
	testSpan = (cell, row) => {
		if (row.costClassificationCode >1) {
			return transportationCode(row.stationCode, this.state.station)
			
		} else {
			return (<div style={{ padding: '0px' }}>
				<td style={{ border: 'none', width: "126px", padding: '0px', textAlign: "center", height: '20px' }} dataField='transportationCode' dataFormat={this.transportationCode.bind(this)}>{transportationCode(row.transportationCode, this.state.station)}</td>
				<td style={{ textAlign: "center", border: "1px solid #ddd", borderTop: '0', borderBottom: '0', borderRight: '0', width: "126px", padding: '0px' }} dataField='destinationCode' dataFormat={this.destinationCode.bind(this)}>{transportationCode(row.destinationCode, this.state.station)}</td></div>)
		}
	}
	roundCode(code) {
		let roundCode = this.state.round;
		for (var i in roundCode) {
			if (roundCode[i].code != "") {
				if (code == roundCode[i].code) {
					return roundCode[i].name;
				}
			}
		}
	};

	costClassificationCode(code) {
		let costClassificationCode = this.state.costClassification;
		for (var i in costClassificationCode) {
			if (costClassificationCode[i].code != "") {
				if (code == costClassificationCode[i].code) {
					return costClassificationCode[i].name;
				}
			}
		}
	};
	stationCode(code) {
		let stationCode = this.state.station;

		for (var i in stationCode) {
			if (code == stationCode[i].code) {
				return stationCode[i].name;
			}
		}
	};
	transportationCode(code) {
		let transportationCode = this.state.station;
		for (var i in transportationCode) {
			if (code == transportationCode[i].code) {
				return transportationCode[i].name;
			}
		}
	};
	destinationCode(code) {
		let destinationCode = this.state.station;
		for (var i in destinationCode) {
			if (code == destinationCode[i].code) {
				return destinationCode[i].name;
			}
		}
	};
	render() {
		const {employeeList} = this.state;
		const { otherCostModel, otherCostTokuro } = this.state;
		const station = this.state.station;
		//　テーブルの行の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			clickToSelectAndEditCell: true,
			hideSelectColumn: true,
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		//　 テーブルの定義
		const options = {
			page: 1, 
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: 'Prev', // Previous page button text
			nextPage: 'Next', // Next page button text
			firstPage: 'First', // First page button text
			lastPage: 'Last', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
			expandRowBgColor: 'rgb(165, 165, 165)',
			approvalBtn: this.createCustomApprovalButton,
			onApprovalRow: this.onApprovalRow,
			handleConfirmApprovalRow: this.customConfirm,
		};
		const cellEdit = {
			mode: 'click',
			blurToSave: true,
			afterSaveCell: this.sumWorkTimeChange,
		}
		return (
			<div>
			{/*　 他の費用*/}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this)} show={this.state.showOtherCostModal} dialogClassName="modal-otherCost">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<OtherCostModel
							yearAndMonth3={this.state.yearAndMonth3}
							transportationCode={this.state.transportationCode}
							stationCode3={this.state.stationCode3}
							stationCode4={this.state.stationCode4}
							roundCode={this.state.roundCode}
							cost1={this.state.cost1}
							oldCostClassification1={this.state.oldCostClassification1}
							costClassification={this.state.oldCostClassification1}
							oldHappendDate1={this.state.oldHappendDate1}
							yearAndMonth4={this.state.yearAndMonth4}
							detailedNameOrLine2={this.state.detailedNameOrLine2}
							stationCode5={this.state.stationCode5}
							remark={this.state.remark}
							cost2={this.state.cost2}
							oldCostFile1={this.state.oldCostFile}
							changeData1={this.state.changeData1}
							changeFile1={this.state.changeFile1}
							costRegistrationFileFlag1={this.state.costRegistrationFileFlag1}
						/></Modal.Body>
				</Modal>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.message}  type={"success"} />
				</div>
				<Form >
					<div>
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>費用登録</h2>
							  		<br/>
									<h2>{new Date().toLocaleDateString()}</h2>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
                    <Row>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}>氏名：{this.state.employeeName}</font>
							{"        "}
						</Col>
						<Col sm={8}></Col>
					</Row>	
					<br /><br />
					<Row>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}><b>定期</b></font>
						</Col>	
					</Row>	
					<Row>
						<Col sm={5}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">期間</InputGroup.Text>
								</InputGroup.Prepend>
								<InputGroup.Prepend>
									<DatePicker
										selected={this.state.yearAndMonth1}
										onChange={this.inactiveYearAndMonth1}
										autoComplete="off"
										locale="ja"
										dateFormat="yyyy/MM/dd"
										id="datePicker"
										className="form-control form-control-sm"
										
									/>～
									<DatePicker
										selected={this.state.yearAndMonth2}
										onChange={this.inactiveYearAndMonth2}
										autoComplete="off"
										locale="ja"
										dateFormat="yyyy/MM/dd"
										id="datePicker"
										className="form-control form-control-sm"
									/>
								</InputGroup.Prepend>
							</InputGroup>	
						</Col>
                        <Col sm={2}>
							<Button variant="info" size="sm" onClick={this.handleShowModal.bind(this)} id="OtherCost">
									<FontAwesomeIcon /> 他の費用
		                        </Button>
						</Col>
					</Row>
					<Row>
						<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出発</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={this.state.station.find((v) => (v.code === this.state.stationCode1)) || {}}
										options={this.state.station}
										name="station"
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'station')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  出発" type="text" {...params.inputProps} className="auto" id="stationCode1"
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
										value={this.state.station.find((v) => (v.code === this.state.stationCode2)) || {}}
										options={this.state.station}
										name="station"
										getOptionLabel={(option) => option.name}
										onSelect={(event) => this.handleTag(event, 'station')}
										renderInput={(params) => (
											<div ref={params.InputProps.ref}>
												<input placeholder="  到着" type="text" {...params.inputProps} className="auto" id="stationCode2"
													style={{ width: 172, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
											</div>
										)}
									/>
								</InputGroup>
							</Col>
						<Col sm={2}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">線路</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control type="text" value={this.state.detailedNameOrLine} name="detailedNameOrLine" autoComplete="off" size="sm" onChange={this.valueChange} placeholder="線路" />
							</InputGroup>
						</Col>
						<Col sm={2}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">料金</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control type="text" value={this.state.cost} name='cost' autoComplete="off" size="sm" onChange={this.valueChange} placeholder="料金" />
							</InputGroup>
						</Col>
						<Col sm={4}>
							<InputGroup size="sm" className="mb-3">
									<Button size="sm" onClick={(event) => this.addFile(event)}><FontAwesomeIcon icon={faFile} />{this.state.costRegistrationFileFlag !== true ? " 添付" : " 添付済み"} </Button>
									<Form.File id="costRegistrationFile" hidden value={this.state.costRegistrationFile} custom onChange={(event) => this.changeFile(event)} />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						 <Col sm={4}>
							<div style={{ "position": "relative", "left": "100%" }}>
								<div style={{ "textAlign": "center" }}>
									<Button size="sm" variant="info" onClick={this.InsertCost} type="button" on>
										<FontAwesomeIcon icon={faSave} /> {" 登録"}
									</Button>{' '}
									<Button size="sm" variant="info" type="reset" onClick={this.resetBook}>
										<FontAwesomeIcon icon={faUndo} /> Reset
									</Button>
								</div>
							</div>
						 </Col>
					</Row>
					<div>
						<Row>
							<Col sm={4}>
								<div style={{ "float": "left" }}>
									<font style={{ whiteSpace: 'nowrap' }}>総額：{this.state.sumCost}</font>
								</div>
							</Col>
							<Col sm={6}><div style={{ "float": "center" }}>
							</div></Col>
							
							<Col sm={2}>
								<div style={{ "float": "right" }}>
										<Button variant="info" size="sm" onClick={this.listChange} id="costRegistrationChange">
											<FontAwesomeIcon icon={faEdit} /> 修正
										</Button>{' '}
										<Button variant="info" size="sm" onClick={this.listDel}id="costRegistrationDel">
											<FontAwesomeIcon icon={faTrash} /> 削除
										</Button>
	 							</div>
							</Col>
						</Row>
					</div>
					<div><Col sm={12}>
						<BootstrapTable data={employeeList}  pagination={true} options={options} approvalRow selectRow={selectRow} headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn  row='0' rowSpan='2' width='5%'　tdStyle={ { padding: '.45em' } } dataField='rowNo'  isKey>番号</TableHeaderColumn>
							<TableHeaderColumn  row='0' rowSpan='2' width='10%'　tdStyle={ {padding: '.45em' } } dataField='happendDate' >日付</TableHeaderColumn>
							<TableHeaderColumn row='0' rowSpan='2' width='10%' tdStyle={{ padding: '.45em' }} dataField='costClassificationCode' dataFormat={this.costClassificationCode.bind(this)}>区分</TableHeaderColumn>
							<TableHeaderColumn row='0' rowSpan='2' width='15%' tdStyle={{ padding: '.45em' }} dataField='detailedNameOrLine' >名称（線路）</TableHeaderColumn>
							<TableHeaderColumn row='0' colSpan='1' width='20%' headerAlign='center' dataAlign='center' >場所</TableHeaderColumn>
							<TableHeaderColumn row='1' width='20%' dataField='stationCode' dataAlign='center' dataFormat={this.testSpan}>
								<th style={{ textAlign: "center", border: 'none', width: '10%', padding: '0px' }}>出発地</th>
								<th style={{ textAlign: "center", width: '10%', border: "1px solid #ddd", borderTop: '0', borderBottom: '0', borderRight: '0', padding: '0px' }}>目的地</th>
							</TableHeaderColumn> 
							<TableHeaderColumn row='0' rowSpan='2' width='10%' tdStyle={ { padding: '.45em' } } dataField='cost' >金額</TableHeaderColumn>
							<TableHeaderColumn row='0' rowSpan='2' width='15%' tdStyle={ { padding: '.45em' } } dataField='remark' >備考</TableHeaderColumn>
							<TableHeaderColumn row='0' rowSpan='2' width='8%' tdStyle={{ padding: '.45em' }} dataField='roundCode' dataFormat={this.roundCode.bind(this)} >片・往</TableHeaderColumn>
							<TableHeaderColumn row='0' rowSpan='2' width='15%' tdStyle={{ padding: '.45em' }} dataField='costFileForShow' >添付</TableHeaderColumn>
							<TableHeaderColumn hidden dataField='costFile' ></TableHeaderColumn>
							<TableHeaderColumn dataField='transportationCode' hidden></TableHeaderColumn>
						</BootstrapTable>
					</Col></div></div>
			</div >
		);
	}
}
export default costRegistration;