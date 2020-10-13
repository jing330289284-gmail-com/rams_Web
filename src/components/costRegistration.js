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
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload,faDownload } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import MyToast from './myToast';
import OtherCostModel from './otherCost';
class costRegistration extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.searchWorkRepot = this.searchWorkRepot.bind(this);

	};
	componentDidMount(){
		this.props.fetchDropDown();
		this.searchWorkRepot();
		
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
		approvalStatuslist:[],
		stationCode1: '',　// 出発
		stationCode2: '',　// 到着
		showOtherCostModal: false,//他の費用
		otherCostModel: null,
	};
	//　検索
	searchWorkRepot = () => {
		axios.post(this.props.serverIP + "workRepot/selectWorkRepot")
			.then(response => response.data)
			.then((data) => {
				if (data.length!=0) {
					var statuss = this.state.approvalStatuslist;
					for(var i=0;i<data.length;i++){
						for (var i2=0;i2<statuss.length;i2++) {
							if (data[i].approvalStatus == statuss[i2].code) {
								data[i].approvalStatusName=statuss[i2].name;
							}
						}
					}
				} 
				this.setState({ 
					employeeList: data,
							stationCode1: '',　// 出発
		stationCode2: '',　// 到着
				})
			});
	};
	/**
	*修正
	*/
	listChange = () => {
		const emp = {
			employeeNo: this.state.rowSelectEmployeeNo,
		}
		axios.post(this.props.serverIP + "dutyManagement/updateDutyManagement", emp)
			.then(result => {
				if (result.data == true) {
					this.searchDutyManagement();
					//削除の後で、rowSelectの値に空白をセットする
					this.setState(
						{
							rowSelectEmployeeNo: '',
							rowSelectCheckSection: ''
						}
					);
					this.setState({ "myToastShow": true });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				} else if (result.data == false) {
					this.setState({ "myToastShow": false });
				}
			})
			.catch(function(error) {
				alert("承認失败，请检查程序");
			});
	}
		/**
	*削除
	*/
	listDel = () => {
		const emp = {
			employeeNo: this.state.rowSelectEmployeeNo,
		}
		axios.post(this.props.serverIP + "dutyManagement/updateDutyManagement", emp)
			.then(result => {
				if (result.data == true) {
					this.searchDutyManagement();
					//削除の後で、rowSelectの値に空白をセットする
					this.setState(
						{
							rowSelectEmployeeNo: '',
							rowSelectCheckSection: ''
						}
					);
					this.setState({ "myToastShow": true });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				} else if (result.data == false) {
					this.setState({ "myToastShow": false });
				}
			})
			.catch(function(error) {
				alert("承認失败，请检查程序");
			});
	}
		//　年月1
	inactiveYearAndMonth1 = (date) => {
		this.setState(
			{
				yearAndMonth1: date,
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
    workRepotUpload=()=>{
	let getfile=$("#getFile").val();
	let fileName = getfile.split('.');
	if(
		fileName[fileName.length -1]=== "xlsx" ||
		fileName[fileName.length -1]=== "xls" ||
		fileName[fileName.length -1]=== "xltx" ||
		fileName[fileName.length -1]=== "xlt" ||
		fileName[fileName.length -1]=== "xlsm" ||
		fileName[fileName.length -1]=== "xlsb" ||
		fileName[fileName.length -1]=== "xltm" ||
		fileName[fileName.length -1]=== "csv"||
		fileName[fileName.length -1]=== "pdf"
	){
  }else{
    alert('PDF或いはexcelをアップロードしてください')
    return false;
  }
if($("#getFile").get(0).files[0].size>1048576){
	 alert('１M以下のファイルをアップロードしてください')
    return false;
}
		const formData = new FormData()
		const emp = {
				attendanceYearAndMonth:this.state.rowSelectAttendanceYearAndMonth,
			};
			formData.append('emp', JSON.stringify(emp))
			formData.append('workRepotFile', $("#getFile").get(0).files[0])
			axios.post(this.props.serverIP + "workRepot/updateWorkRepotFile",formData)
			.then(response => {
				if (response.data != null) {
					window.location.reload();
					this.setState({ "myToastShow": true });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				} else {
					alert("err")
				}
			});
    }
	getFile=()=>{
		$("#getFile").click();
	}
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState(
				{
					rowSelectAttendanceYearAndMonth: row.attendanceYearAndMonth,
				}
			);
		} else {
			this.setState(
				{	
					rowSelectWorkingTimeReport:'',
				}
			);
		}
	}

		/**
 　　　*他の費用画面の開き
    */
	handleShowModal = () => {
			this.setState({ showOtherCostModal: true })
	}
		/**
	*他の費用画面の閉め 
	*/
	handleHideModal = () => {
			this.setState({ showOtherCostModal: false })
	}
		/* 
	他の費用情報の取得
 　　　*/
	pbInfoGet = (otherCostGetTokuro) => {
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
			if (fieldName === "station" && this.props.station.find((v) => (v.name === value)) !== undefined) {
				switch (id) {
					case 'stationCode1':
						this.setState({
							stationCode1: this.props.station.find((v) => (v.name === value)).code,
						})
						break;
					case 'stationCode2':
						this.setState({
							stationCode2: this.props.station.find((v) => (v.name === value)).code,
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

	render() {
		const {employeeList} = this.state;
		const { otherCostModel } = this.state;
		const station = this.props.station;
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
					onHide={this.handleHideModal.bind(this, "otherCostModel")} show={this.state.showOtherCostModal} dialogClassName="modal-pbinfoSet">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<OtherCostModel bpInfoModel={otherCostModel} customer={this.state.customer} employeeNo={this.state.employeeNo} employeeFristName={this.state.employeeFristName} employeeLastName={this.state.employeeLastName} otherCostTokuro={this.otherCostGet} /></Modal.Body>
				</Modal>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={"アップロード成功！"} type={"success"} />
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
				<Form.File id="getFile" accept="application/pdf,application/vnd.ms-excel" custom hidden="hidden" onChange={this.workRepotUpload}/>
	                <br/>
                    <Row>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}>氏名：</font>
							{"        "}
						</Col>
						<Col sm={8}></Col>
					</Row>	
					<Row>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}><b>定期</b></font>
						</Col>	
					</Row>	
					<Row>
						<Col sm={4}>
						<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">期間</InputGroup.Text>
									<DatePicker
										selected={this.state.yearAndMonth1}
										onChange={this.inactiveYearAndMonth1}
										autoComplete="off"
										locale="ja"
										dateFormat="yyyy/MM/dd"
										id="datePicker2"
										className="form-control form-control-sm"
									/>{"　　   ～　　 　 "}
								</InputGroup.Prepend>
								<InputGroup.Prepend>
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
                            <div style={{ "float": "right" }}>
		                        <Button variant="info" size="sm" onClick={this.handleShowModal.bind(this)} id="OtherCost">
	                          		 <FontAwesomeIcon />他の費用
		                        </Button>
	 						</div>
						</Col>
					</Row>
					<Row>
						<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出発</InputGroup.Text>
									</InputGroup.Prepend>
									<Autocomplete
										value={station.find((v) => (v.code === this.state.stationCode1)) || {}}
										options={station}
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
										value={station.find((v) => (v.code === this.state.stationCode2)) || {}}
										options={station}
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
								<Form.Control type="text" autoComplete="off" size="sm" onChange={this.valueChange} placeholder="線路" />
							</InputGroup>
						</Col>
						<Col sm={2}>
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="inputGroup-sizing-sm">料金</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control type="text" autoComplete="off" size="sm" onChange={this.valueChange} placeholder="料金" />
							</InputGroup>
						</Col>
                       <Col sm={2}>
                            <div style={{ "float": "right" }}>
		                        <Button variant="info" size="sm" onClick={this.getFile}id="costRegistrationFile">
	                          		 <FontAwesomeIcon icon={faDownload} />添付
		                        </Button>
	 						</div>
						</Col>
					</Row>
					<Row>

						 <Col sm={2}>
                            <div style={{ "position": "relative","left": "300%"}}>
		                        <Button variant="info" size="sm" onClick={publicUtils.handleDownload.bind(this, this.state.rowSelectWorkingTimeReport)}id="costRegistrationInsert">
	                          		 <FontAwesomeIcon icon={faDownload} />登録
		                        </Button>
	 						</div>
						</Col>
					</Row>
					<Row>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}>総額：</font>
						</Col>
  						<Col sm={6}></Col>
                        <Col sm={4}>
                            <div style={{ "float": "right" }}>
                               <Button variant="info" size="sm" onClick={this.listChange} id="costRegistrationChange">
									<FontAwesomeIcon icon={faUpload} />修正
								</Button>{' '}
		                        <Button variant="info" size="sm" onClick={this.listDel}id="costRegistrationDel">
	                          		 <FontAwesomeIcon icon={faDownload} />削除
		                        </Button>
	 						</div>
						</Col>
                    </Row>
						<BootstrapTable data={employeeList} cellEdit={cellEdit} pagination={true}  options={options} approvalRow selectRow={selectRow} headerStyle={ { background: '#5599FF'} } striped hover condensed >
						<TableHeaderColumn width='80'　tdStyle={ { padding: '.45em' } } dataField='No' editable={false} isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='180'　tdStyle={ { padding: '.45em' } } dataField='attendanceYearAndMonth' editable={false}>日付</TableHeaderColumn>
						<TableHeaderColumn width='80' tdStyle={ { padding: '.45em' } } dataField='workingTimeReportFile' editable={false}>区分</TableHeaderColumn>
						<TableHeaderColumn width='140' tdStyle={ { padding: '.45em' } } dataField='sumWorkTime' editable={this.state.rowSelectapproval}>名称</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } } dataField='updateUser' editable={false}>出発地</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } } dataField='updateTime' editable={false}>目的地</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } } dataField='approvalStatusName' editable={false}>金額</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } } dataField='approvalStatusName' editable={false}>備考</TableHeaderColumn>
						<TableHeaderColumn width='100' tdStyle={ { padding: '.45em' } } dataField='approvalStatusName' editable={false}>片・往</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } } dataField='approvalStatusName' editable={false}>添付</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div >
		);
	}
}
const mapStateToProps = state => {
	return {
		station: state.data.dataReques.length >= 1 ? state.data.dataReques[14] : [],
		serverIP: state.data.dataReques[state.data.dataReques.length-1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(costRegistration);