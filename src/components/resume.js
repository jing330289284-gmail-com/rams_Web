import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload,faDownload } from '@fortawesome/free-solid-svg-icons';
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
		$("#resumeUpload").attr("disabled",true);
		$("#resumeDownload").attr("disabled",true);
		this.searchResume();
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
				data.push({ "rowNo": 2, "resumeInfo1": data[0].resumeInfo2, "resumeName1": data[0].resumeName2, "updateTime": data[0].updateTime, "updateUser": data[0].updateUser});
					this.setState({ 
						employeeList: data
					})
				});
	};
	//　変更
	resumeName1Change = (e) =>{
		const emp = {
		};
		axios.post(this.state.serverIP + "resume/updateresume",emp)
			.then(response => {
				if (response.data != null) {
					this.searchResume();
					this.setState({ "myToastShow": true });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
				} else {
					alert("err")
				}
			});
	}
  /**
     * 作業報告書ボタン
     */
    resumeUpload=()=>{
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
			};
			formData.append('emp', JSON.stringify(emp))
			formData.append('resumeFile', $("#getFile").get(0).files[0])
			axios.post(this.state.serverIP + "resume/updateResumeFile",formData)
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
			$("#resumeUpload").attr("disabled",true);
			$("#resumeDownload").attr("disabled",false);
			
		
		}
	}
	setButton = (cell, row) => {
		return (<div style={{ padding: '0px', width: "100%" }}>
				<td>
					<Button variant="info" size="sm" onClick={this.getFile} id="resumeUpload">
						<FontAwesomeIcon icon={faUpload} />Upload
					</Button>{row.resumeInfo1}
				</td>
				</div>
		)
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
					<MyToast myToastShow={this.state.myToastShow} message={"アップロード成功！"} type={"success"} />
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
				<Form.File id="getFile" accept="application/pdf,application/vnd.ms-excel" custom hidden="hidden" onChange={this.resumeUpload}/>
	                <br/>
                    <Row>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}>履歴書</font>
						</Col>
  						<Col sm={6}></Col>
                        <Col sm={4}>
                            <div style={{ "float": "right" }}>
                               <Button variant="info" size="sm" onClick={this.getFile} id="resumeUpload">
									<FontAwesomeIcon icon={faUpload} />Upload
								</Button>{' '}
								<Button variant="info" size="sm" onClick={publicUtils.handleDownload.bind(this, this.state.rowSelectWorkingTimeReport, this.state.serverIP)}id="resumeDownload">
	                          		 <FontAwesomeIcon icon={faDownload} />Download
		                        </Button>
	 						</div>
						</Col>
                    </Row>	
					<BootstrapTable data={employeeList} cellEdit={cellEdit}   options={options} approvalRow selectRow={selectRow} headerStyle={ { background: '#5599FF'} } striped hover condensed >
						<TableHeaderColumn width='5%'  tdStyle={{ padding: '.45em' }} editable={false} dataField='rowNo' isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='20%' tdStyle={{ padding: '.45em' }} dataField='resumeInfo1' editable={false} dataFormat={this.setButton}>ファイル名</TableHeaderColumn>
						<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} onChange={this.resumeNameChange} dataField='resumeName1' editable={true}>備考</TableHeaderColumn>
						<TableHeaderColumn width='20%' tdStyle={{ padding: '.45em' }} dataField='resumeInfo2' editable={false}>ファイル名</TableHeaderColumn>
						<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} onChange={this.resumeNameChange} dataField='resumeName2' editable={true}>備考</TableHeaderColumn>
						<TableHeaderColumn width='10%' tdStyle={{ padding: '.45em' }} dataField='updateUser' editable={false}>更新者</TableHeaderColumn>
						<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} dataField='updateTime' editable={false}>更新日</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div >
		);
	}
}
export default resume;