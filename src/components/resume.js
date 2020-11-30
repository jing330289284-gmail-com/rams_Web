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
				if (data[0].resumeInfo2 == null || data[0].resumeInfo2 == "") {
					data[1]["fileSts"] = false;
				} else {
					data[1]["fileSts"] = true;
				}
					this.setState({ 
						employeeList: data,
						haveChange: false,
					})
				});
	};
	searchEmployeeName = () => {
		axios.post(this.state.serverIP + "resume/selectEmployeeName")
			.then(response => {
				this.setState({
					employeeName: response.data.employeeName,
				})
			});
	};
	//　変更と追加
	InsertResume = (e) => {
		this.setState({ "errorsMessageShow": false });
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
		axios.post(this.state.serverIP + "resume/insertResume", formData)
			.then(response => {
				if (response.data) {
					this.setState({ "myToastShow": true, "method": "put", "message": "登録完了" });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					this.searchResume();
					var file = document.getElementById('UpButtonForm1');
					file.reset();
					var file = document.getElementById('UpButtonForm2');
					file.reset();
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
	setDownButton = (cell, row) => {
		return (
				<Button variant="info" size="sm" onClick={publicUtils.handleDownload.bind(this, row.resumeInfo1, this.state.serverIP)} id={"resumeDownload" + row.rowNo} >
					<FontAwesomeIcon icon={faDownload} />Download
				</Button>
		)
	}
	setUpButton = (cell, row) => {
		return (

					<form id={"UpButtonForm"+ row.rowNo}>
					<Button size="sm" onClick={(event) => this.addFile(event, row.rowNo)}><FontAwesomeIcon />{row.haveFile !==true ? " 添付" : " 添付済み"} </Button>
					<Form.File id={"filePath" + row.rowNo} hidden onChange={(event) => this.changeFile(event, row)}/>
					</form>
		)
	}
	addFile = (event, name) => {
		$("#filePath"+name).click();
	}
	changeFile = (event, row) => {
		var filePath = event.target.value;
		if (filePath == "") {
			return;
        }
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
			alert('PDF或いはexcelをアップロードしてください');
			var file = document.getElementById('UpButtonForm1');
			file.reset();
			var file = document.getElementById('UpButtonForm2');
			file.reset();
			return;
		}
		let data = this.state.employeeList
		data[row.rowNo - 1]["filePath"] = filePath;
		data[row.rowNo - 1]["haveFile"] = true;
		if (!row.fileSts) {
			data[row.rowNo - 1]["resumeName1"] = this.state.employeeName+"_";
		}
		this.setState({
			employeeList: data,
			haveChange: true,
		})
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
	resumeNameChange = (event, cell, row) => {
		let data = this.state.employeeList;
		var a = new RegExp("^" + this.state.employeeName + "_")
		var b = new RegExp(".*[\u4e00-\u9fa5]+.*$")
		if (b.test((event.target.value).substring((this.state.employeeName + "_").length))) {
			alert("漢字は使えません")
			data[row.rowNo - 1]["resumeName1"] = this.state.employeeName + "_";
			this.setState({
				employeeList: data,
			})
			return;
		}
		if (!a.test(event.target.value)) {
			alert(this.state.employeeName + "_は変更できません")
			data[row.rowNo - 1]["resumeName1"] = this.state.employeeName + "_";
			this.setState({
				employeeList: data,
			})
			return;
		}
		data[row.rowNo - 1][event.target.name] = event.target.value;
		this.setState({
			haveChange: true,
		})
		
	};
	test = (cell, row) => {
		let returnItem = cell;
		returnItem = <span>
			<input type="text" class=" form-control editor edit-text" name="resumeName1" maxLength="25" value={cell}
				onChange={(event) => this.resumeNameChange(event, cell, row)} />
		</span>;
		return returnItem;
	}
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
			hidePageListOnlyOnePage: true,
			expandRowBgColor: 'rgb(165, 165, 165)',
			approvalBtn: this.createCustomApprovalButton,
			onApprovalRow: this.onApprovalRow,
			handleConfirmApprovalRow: this.customConfirm,
		};
		const cellEdit = {
			mode: 'click',
			blurToSave: true,
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
							<BootstrapTable pagination={true} data={employeeList} options={options} approvalRow selectRow={selectRow} headerStyle={{ background: '#5599FF' }} striped hover condensed >
								<TableHeaderColumn dataField='filePath' hidden></TableHeaderColumn>
								<TableHeaderColumn dataField='haveFile' hidden></TableHeaderColumn>
								<TableHeaderColumn dataField='resumeInfo1' hidden></TableHeaderColumn>
								<TableHeaderColumn width='5%' tdStyle={{ padding: '.45em' }}  dataField='rowNo' isKey>番号</TableHeaderColumn>
								<TableHeaderColumn width='20%' tdStyle={{ padding: '.45em' }} dataField='nodata' dataFormat={this.setUpButton.bind(this)}>添付状況</TableHeaderColumn>
								<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} dataField='fileSts' dataFormat={this.setSts}  >ファイルステータス</TableHeaderColumn>
								<TableHeaderColumn width='20%' tdStyle={{ padding: '.45em' }} dataField='resumeName1' dataFormat={this.test}>履歴書名</TableHeaderColumn>
								<TableHeaderColumn width='20%' tdStyle={{ padding: '.45em' }} dataField='nodata' dataFormat={this.setDownButton}>履歴書DownLoad</TableHeaderColumn>
								<TableHeaderColumn width='10%' tdStyle={{ padding: '.45em' }} dataField='updateUser' >更新者</TableHeaderColumn>
								<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} dataField='updateTime' dataFormat={this.setUpDate.bind(this)}>更新日</TableHeaderColumn>
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