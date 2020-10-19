import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload,faDownload } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
import * as publicUtils from './utils/publicUtils.js';
import MyToast from './myToast';
/**
 * 作業報告書登録画面
 */
class workRepot extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.searchWorkRepot = this.searchWorkRepot.bind(this);
		this.sumWorkTimeChange = this.sumWorkTimeChange.bind(this);
	};
	componentDidMount(){
		$("#workRepotUpload").attr("disabled",true);
		$("#workRepotDownload").attr("disabled",true);
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
	};
	approvalStatus(code) {
    let approvalStatuss = this.props.approvalStatuslist;
        for (var i in approvalStatuss) {
            if (code === approvalStatuss[i].code) {
                return approvalStatuss[i].name;
            }
        }
    };
	//　検索
	searchWorkRepot = () => {
		axios.post(this.props.serverIP + "workRepot/selectWorkRepot")
			.then(response => response.data)
			.then((data) => {
				if (data.length!=0) {
					for(var i=0;i<data.length;i++){
						if(data[i].workingTimeReport!=null){
							let fileName=data[i].workingTimeReport.split("/");
							data[i].workingTimeReportFile=fileName[fileName.length-1];
						}
					}
				} else {
					data.push({"approvalStatus":0,"approvalStatusName":"未","attendanceYearAndMonth":publicUtils.setFullYearMonth(new Date())});
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
		axios.post(this.props.serverIP + "workRepot/updateworkRepot",emp)
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
  /**
     * 作業報告書ボタン
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
			$("#workRepotUpload").attr("disabled",true);
			$("#workRepotDownload").attr("disabled",false);
			var TheYearMonth=publicUtils.setFullYearMonth(new Date())-1;
			this.setState(
				{
					rowSelectAttendanceYearAndMonth: row.attendanceYearAndMonth,
					rowSelectWorkingTimeReport: row.workingTimeReport,
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
				{	
					rowSelectWorkingTimeReport:'',
					rowSelectAttendanceYearAndMonth:'',
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
					<MyToast myToastShow={this.state.myToastShow} message={"アップロード成功！"} type={"success"} />
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
				<Form.File id="getFile" accept="application/pdf,application/vnd.ms-excel" custom hidden="hidden" onChange={this.workRepotUpload}/>
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
		                        <Button variant="info" size="sm" onClick={publicUtils.handleDownload.bind(this, this.state.rowSelectWorkingTimeReport,this.props.serverIP)}id="workRepotDownload">
	                          		 <FontAwesomeIcon icon={faDownload} />Download
		                        </Button>
	 						</div>
						</Col>
                    </Row>	
					<BootstrapTable data={employeeList} cellEdit={cellEdit} pagination={true}  options={options} approvalRow selectRow={selectRow} headerStyle={ { background: '#5599FF'} } striped hover condensed >
						<TableHeaderColumn width='0'　hidden={true} tdStyle={ { padding: '.0em' } }  dataField='approvalStatus' ></TableHeaderColumn>
						<TableHeaderColumn width='0'hidden={true}  tdStyle={ { padding: '.0em' } }   dataField='workingTimeReport'></TableHeaderColumn>
						<TableHeaderColumn width='130'　tdStyle={ { padding: '.45em' } }   dataField='attendanceYearAndMonth' editable={false} isKey>年月</TableHeaderColumn>
						<TableHeaderColumn width='380' tdStyle={ { padding: '.45em' } }   dataField='workingTimeReportFile' editable={false}>ファイル名</TableHeaderColumn>
						<TableHeaderColumn width='140' tdStyle={ { padding: '.45em' } } onChange={this.sumWorkTimeChange}  dataField='sumWorkTime' editable={this.state.rowSelectapproval}>稼働時間</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }   dataField='updateUser' editable={false}>登録者</TableHeaderColumn>
						<TableHeaderColumn width='350' tdStyle={ { padding: '.45em' } }   dataField='updateTime' editable={false}>更新日</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }   dataField='approvalStatus' editable={false} dataFormat={this.approvalStatus.bind(this)}>ステータス</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div >
		);
	}
}
const mapStateToProps = state => {
	return {
		costClassificationCode: state.data.dataReques.length >= 1 ? state.data.dataReques[30]: [],
		serverIP: state.data.dataReques[state.data.dataReques.length-1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(workRepot);