import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import "react-datepicker/dist/react-datepicker.css";
import ErrorsMessageToast from './errorsMessageToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faSave } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import store from './redux/store';
import MyToast from './myToast';
/**
 * 作業報告書登録画面
 */
class resume extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.searchResume = this.searchResume.bind(this);
	};
	componentDidMount(){
		$("#resumeDownload").attr("disabled",true);
		this.searchResume();
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
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};
	//　検索
	searchResume = () => {
		axios.post(this.state.serverIP + "resume/selectResume")
			.then(response => response.data)
			.then((data) => {
				data.push({ "rowNo": 2, "resumeInfo1": data[0].resumeInfo2, "resumeName1": data[0].resumeName2, "updateTime": data[0].updateTime, "updateUser": data[0].updateUser });
				if (data[0].resumeInfo1 == null || data[0].resumeInfo1 =="") {
					data[0]["fileSts"]=false ;
				} else {
					data[0]["fileSts"] =true;
				}
				if (data[0].resumeInfo2 == null || data[0].resumeInfo1 == "") {
					data[1]["fileSts"] = false;
				} else {
					data[1]["fileSts"] = true;
				}
					this.setState({ 
						employeeList: data
					})
				});
	};
	searchEmployeeName = () => {
		axios.post(this.state.serverIP + "resume/selectEmployeeName")
			.then(response => {
				this.setState({
					employeeName: response.data.employeeName,
					haveChange: false,
				})
			});
	};
	//　変更と追加
	InsertResume = (e) => {
		var a = new RegExp("^" + this.state.employeeName + "_.")
		if (!this.state.haveChange) {
			this.setState({ "errorsMessageShow": true, "method": "put", "message": "変更ありません" });
			return;
		}
		if (this.state.employeeList[0].filePath != undefined) {
			if (!a.test(this.state.employeeList[0].resumeName1)){
				this.setState({ "errorsMessageShow": true, "method": "put", "message": "ファイル名修正してください" });
				return;
			}
		}
		if (this.state.employeeList[1].filePath != undefined) {
			if (!a.test(this.state.employeeList[1].resumeName1)) {
				this.setState({ "errorsMessageShow": true, "method": "put", "message": "ファイル名修正してください" });
				return;
			}
		}
		if (this.state.employeeList[0].resumeName1 === this.state.employeeList[1].resumeName1) {
			this.setState({ "errorsMessageShow": true, "method": "put", "message": "ファイル名が同じです" });
			return;
        }
		const formData = new FormData()
		const emp = {
			resumeInfo1: this.state.employeeList[0].resumeInfo1,
			resumeInfo2: this.state.employeeList[1].resumeInfo1,
			resumeName1: this.state.employeeList[0].resumeName1,
			resumeName2: this.state.employeeList[1].resumeName1,
		};
		formData.append('emp', JSON.stringify(emp))
		formData.append('filePath1', publicUtils.nullToEmpty($('#filePath1').get(0).files[0]))
		formData.append('filePath2', publicUtils.nullToEmpty($('#filePath2').get(0).files[0]))
		axios.post(this.state.serverIP + "resume/insertResume",emp)
			.then(response => {
				if (response.data) {
					this.searchResume();
					this.setState({ "myToastShow": true, "method": "put", "message": "登録完了" });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				} else {
					this.setState({ "errorsMessageShow": true, "method": "put", "message": "登録失敗" });
				}
			});
	}
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			if (row.fileSts || row.haveFile) {
				this.setState(
					{
						rowSelectfileSts: true,
					}
				);
			} else {
				this.setState(
					{
						rowSelectfileSts: false,
					}
				);
            }
			
		}
	}
	setUpButton = (cell, row) => {
		return (
			<div style={{ padding: '0px', width: "100%"}}>
				<InputGroup size="sm" className="mb-3">
					<Button size="sm" onClick={(event) => this.addFile(event, row.rowNo)}><FontAwesomeIcon />{row.haveFile !==true ? " 添付" : " 添付済み"} </Button>
					<Form.File id={"filePath" + row.rowNo} value={row.filePath}  hidden custom onChange={(event) => this.changeFile(event, row)} custom />
				</InputGroup>
			</div>
		)
	}
	addFile = (event, name) => {
		$("#filePath"+name).click();
	}
	changeFile = (event, row) => {
		var filePath = event.target.value;
		var arr = filePath.split('\\');
		let fileName = filePath.split('.');
		if (
			fileName[fileName.length - 1] === "xlsx" ||
			fileName[fileName.length - 1] === "xls" ||
			fileName[fileName.length - 1] === "xltx" ||
			fileName[fileName.length - 1] === "xlt" ||
			fileName[fileName.length - 1] === "xlsm" ||
			fileName[fileName.length - 1] === "xlsb" ||
			fileName[fileName.length - 1] === "xltm" ||
			fileName[fileName.length - 1] === "csv" ||
			fileName[fileName.length - 1] === "pdf"
		) {
		} else {
			alert('PDF或いはexcelをアップロードしてください')
			return false;
		}
		let data = this.state.employeeList
		data[row.rowNo - 1]["filePath"] = filePath;
		data[row.rowNo - 1]["haveFile"] = true;
		if (!row.fileSts) {
			data[row.rowNo - 1]["resumeName1"] = this.state.employeeName+"_";
		}
		this.setState({
			employeeList: data,
		})
	}
	setDownButton = (cell, row) => {
	return(
			<div style = {{ padding: '0px', width: "100%" }}>
			<Button variant="info" size="sm" onClick={publicUtils.handleDownload.bind(this, row.resumeInfo1, this.state.serverIP)} id={"resumeDownload" +row.rowNo} >
						<FontAwesomeIcon icon={faDownload} />Download
					</Button>
			</div >
		)
	}
	setSts(flag) {
		if (flag === true) {
			return "存在";
		} else {
			return "存在なし";
        }
	};
	setUpDate = (cell, row) => {
		return row.updateTime.substr(0,16);
};
	resumeNameChange = (cell, row) => {
		var a = new RegExp("^" + this.state.employeeName + "_")
		if (!a.test(cell.resumeName1)) {
			alert(this.state.employeeName + "_は変更できません")
			cell.resumeName1 = this.state.employeeName + "_";
			return;
		}
		this.setState({
			haveChange: true,
		})
		
	};
	render() {
		const {employeeList} = this.state;
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
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
			expandRowBgColor: 'rgb(165, 165, 165)',
			approvalBtn: this.createCustomApprovalButton,
			onApprovalRow: this.onApprovalRow,
			handleConfirmApprovalRow: this.customConfirm,
		};
		const cellEdit = {
			mode: 'click',
			blurToSave: true,
			afterSaveCell: this.resumeNameChange,
		}
		return (
			<div>
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.message} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={this.state.message} type={"danger"} />
				</div>
				<FormControl id="rowSelectCheckSection" name="rowSelectCheckSection" hidden />
				<Form >
					<div>
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>履歴書アップロード</h2>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
					<Form.File id="getFile" accept="application/pdf,application/vnd.ms-excel"  custom hidden="hidden" onChange={this.resumeUpload}/>
	                <br/>
                    <Row>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap'}}>履歴書</font>
						</Col>
						<Col sm={10}></Col>
						<Col sm={12}>
							<BootstrapTable data={employeeList} cellEdit={cellEdit} options={options} approvalRow selectRow={selectRow} headerStyle={{ background: '#5599FF' }} striped hover condensed >
								<TableHeaderColumn dataField='filePath' editable={false} hidden></TableHeaderColumn>
								<TableHeaderColumn dataField='haveFile' editable={false} hidden></TableHeaderColumn>
								<TableHeaderColumn dataField='resumeInfo1' editable={false}></TableHeaderColumn>
								<TableHeaderColumn width='5%' tdStyle={{ padding: '.45em' }}  dataField='rowNo' editable={false} isKey>番号</TableHeaderColumn>
								<TableHeaderColumn width='20%' tdStyle={{ padding: '.45em' }} dataField='nodata' editable={false} dataFormat={this.setUpButton.bind(this)}>添付状況</TableHeaderColumn>
								<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} dataField='fileSts' editable={false} dataFormat={this.setSts}  >ファイルステータス</TableHeaderColumn>
								<TableHeaderColumn width='20%' tdStyle={{ padding: '.45em' }} dataField='resumeName1' editable={this.state.rowSelectfileSts} onChange={this.resumeNameChange.bind(this)}>履歴書名</TableHeaderColumn>
								<TableHeaderColumn width='20%' tdStyle={{ padding: '.45em' }} dataField='nodata' editable={false} dataFormat={this.setDownButton}>履歴書DownLoad</TableHeaderColumn>
								<TableHeaderColumn width='10%' tdStyle={{ padding: '.45em' }} dataField='updateUser' editable={false}>更新者</TableHeaderColumn>
								<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} dataField='updateTime' editable={false} dataFormat={this.setUpDate.bind(this)}>更新日</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</Row>
					<br/>
					<Row>
						<Col sm={4}>
							<div style={{ "position": "relative", "left": "100%" }}>
								<div style={{ "textAlign": "center" }}>
									<Button size="sm" variant="info" type="button" onClick={this.InsertResume} on>
										<FontAwesomeIcon icon={faSave} /> {" 登録"}
									</Button>
								</div>
							</div>
						</Col>
					</Row>
					<br />
				</div>
			</div >
		);
	}
}
export default resume;