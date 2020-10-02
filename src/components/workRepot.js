import React from 'react';
import { Button, Form, Col, Row, FormControl } from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload,faDownload } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import MyToast from './myToast';
class workRepot extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.getDropDownｓ = this.getDropDownｓ.bind(this);
		this.searchWorkRepot = this.searchWorkRepot.bind(this);
		this.sumWorkTimeChange = this.sumWorkTimeChange.bind(this);

	};
	componentDidMount(){
		$("#workRepotUpload").attr("disabled",true);
		$("#workRepotDownload").attr("disabled",true);
		this.getDropDownｓ();
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

	};
		getDropDownｓ = () => {
		var methodArray = ["getApproval"]
		var data = publicUtils.getPublicDropDown(methodArray);
		this.setState(
			{
				approvalStatuslist: data[0],//　getApproval
			}
		);
	};
	//　検索
	searchWorkRepot = () => {
		axios.post("http://127.0.0.1:8080/workRepot/selectWorkRepot")
			.then(response => response.data)
			.then((data) => {
				if (data != null) {
					var statuss = this.state.approvalStatuslist;
					for(var i=0;i<data.length;i++){
						for (var i2=0;i2<statuss.length;i2++) {
							if (data[i].approvalStatus == statuss[i2].code) {
								data[i].approvalStatusName=statuss[i2].name;
							}
						}
					}
				} else {
					data[0].approvalStatus=0;
					data[0].approvalStatusName="未";
					data[0].attendanceYearAndMonth=publicUtils.setFullYearMonth(new Date());
					}
				this.setState({ 
					employeeList: data
				})
			});
	};
	//　変更
	sumWorkTimeChange = (e) =>{
		const emp = {
			attendanceYearAndMonth: this.state.rowSelectAttendanceYearAndMonth,
			sumWorkTime:　e.sumWorkTime,
		};
		axios.post("http://127.0.0.1:8080/workRepot/updateworkRepot",emp)
			.then(response => {
				if (response.data != null) {
					window.location.reload();
				} else {
					alert("err")
				}
			});
	}
  /**
     * 作業報告書ボタン
     */
    workRepotUpload=()=>{
 		
    }
	getFile=()=>{
		$("#getFile").click();
	}
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			$("#workRepotUpload").attr("disabled",true);
			$("#workRepotDownload").attr("disabled",false);
			var TheYearMonth=publicUtils.setFullYearMonth(new Date())-1;
			this.setState(
				{
					rowSelectAttendanceYearAndMonth: row.attendanceYearAndMonth,
					rowSelectSumWorkTime: row.sumWorkTime,
					rowSelectapproval:row.attendanceYearAndMonth-0>=TheYearMonth?true:false,
				}
			);

			if(row.attendanceYearAndMonth-0>=TheYearMonth){
				$("#workRepotUpload").attr("disabled",false);
			}
			if(row.attendanceYearAndMonth-0>TheYearMonth){
				$("#workRepotDownload").attr("disabled",true);
			}

		} else {
			this.setState(
				{	rowSelectAttendanceYearAndMonth:'',
					rowSelectSumWorkTime: '',
					rowSelectapproval: '',
				}
			);
		}
	}

	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
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
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={"成功！"} type={"success"} />
				</div>
				<FormControl id="rowSelectCheckSection" name="rowSelectCheckSection" hidden />
				<Form >
					<div>
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>作業報告書アップロード</h2>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
	                <br/>
                    <Row>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}>作業報告書</font>
						</Col>
  						<Col sm={6}></Col>
                        <Col sm={4}>
                            <div style={{ "float": "right" }}>
                               <Button variant="info" size="sm" onClick={this.getFile} id="workRepotUpload">
									<FontAwesomeIcon icon={faUpload} />Upload
								</Button>{' '}
		                        <Button variant="info" size="sm" onClick={this.workRepotDownload} id="workRepotDownload">
	                          		 <FontAwesomeIcon icon={faDownload} />Download
		                        </Button>   
								</div>
						</Col>
                    </Row>	
					<BootstrapTable data={employeeList} cellEdit={cellEdit} pagination={true}  options={options} approvalRow selectRow={selectRow} headerStyle={ { background: '#5599FF'} } striped hover condensed >
						<TableHeaderColumn width='0'　hidden={true} tdStyle={ { padding: '.0em' } }  dataField='approvalStatus' ></TableHeaderColumn>
						<TableHeaderColumn width='150'　tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='attendanceYearAndMonth' editable={false} isKey>年月</TableHeaderColumn>
						<TableHeaderColumn width='250' tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='workingTimeReport' editable={false}>ファイル名</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } } onBlur={this.sumWorkTimeChange} headerAlign='center' dataAlign='center' dataField='sumWorkTime' editable={this.state.rowSelectapproval}>稼働時間</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='updateUser' editable={false}>登録者</TableHeaderColumn>
						<TableHeaderColumn width='450' tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='updateTime' editable={false}>更新日</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='approvalStatusName' editable={false}>ステータス</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div >
		);
	}
}
export default workRepot;