import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ja from "date-fns/locale/ja";
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
		this.searchWorkRepot = this.searchWorkRepot.bind(this);
	};
	componentDidMount(){
		$("#workRepotUpload").attr("disabled",true);
		$("#workRepotDownload").attr("disabled",true);
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
	//　検索
	searchWorkRepot = () => {
				const emp = {

		};
		axios.post("http://127.0.0.1:8080/workRepot/selectWorkRepot",emp)
			.then(response => {
				if (response.data != null) {
					this.setState({ employeeList: response.data })
				} else {
					alert("err")
				}
			});
	}

	/**
	  * 行の承認
	  */
	listApproval = () => {
		const emp = {
			yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
			employeeNo: this.state.rowSelectEmployeeNo,
			checkSection: this.state.rowSelectCheckSection,
		}
		axios.post("http://127.0.0.1:8080/workRepot/updateWorkRepot", emp)
			.then(result => {
				if (result.data == true) {
					this.searchWorkRepot();
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
     * 作業報告書ボタン
     */
    workRepot=()=>{
 
    }

	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			$("#workRepotUpload").attr("disabled",false);
			$("#workRepotDownload").attr("disabled",false);
			this.setState(
				{
					rowNo:row.rowNo,
					rowSelectEmployeeNo: row.employeeNo,
					rowSelectCheckSection: row.checkSection,
				}
			);
			if(row.checkSection==0){
				$("#workRepotUpload").attr("disabled",true);
				$("#workRepotDownload").attr("disabled",true);
			}
		} else {
			this.setState(
				{
					rowNo: '',
					rowSelectEmployeeNo: '',
					rowSelectCheckSection: '',
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
			hideSelectColumn: true,
			clickToSelect: true,  // click to select, default is false
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

		return (

			<div>

				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={"成功！"} type={"success"} />
				</div>
				<FormControl id="rowSelectEmployeeNo" name="rowSelectEmployeeNo" hidden />
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
                               <Button variant="info" size="sm" onClick={this.workRepotUpload} id="workRepotUpload">
									<FontAwesomeIcon icon={faUpload} />Upload
								</Button>{' '}
		                        <Button variant="info" size="sm" onClick={this.workRepotDownload} id="workRepotDownload">
	                          		 <FontAwesomeIcon icon={faDownload} />Download
		                        </Button>                   
	 						</div>
						</Col>
                    </Row>
					<BootstrapTable data={employeeList} pagination={true}    options={options} approvalRow selectRow={selectRow} headerStyle={ { background: '#5599FF'} } striped hover condensed >
						<TableHeaderColumn width='0'　tdStyle={ { padding: '.0em' } }  dataField='rowNo' isKey></TableHeaderColumn>
						<TableHeaderColumn width='150'　tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='attendanceYearAndMonth'>年月</TableHeaderColumn>
						<TableHeaderColumn width='250' tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='workingTimeReport'>ファイル名</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='sumWorkTime'>稼働時間</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='updateUser'>登録者</TableHeaderColumn>
						<TableHeaderColumn width='450' tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='updateTime'>更新日</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }  headerAlign='center' dataAlign='center' dataField='approvalStatus'>ステータス</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div >
		);
	}
}
export default workRepot;