import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUpload } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import MyToast from './myToast';
import store from './redux/store';
registerLocale("ja", ja);
axios.defaults.withCredentials = true;

/**
 * 社員勤務管理画面
 */
class dutyManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.searchEmployee = this.searchDutyManagement.bind(this);
	};
	componentDidMount(){
		$("#syounin").attr("disabled",true);
		$("#workRepot").attr("disabled",true);
		$("#datePicker").attr("readonly","readonly");
		this.searchDutyManagement();
		
	}
	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
		this.searchDutyManagement();
	}
	//　初期化データ
	initialState = {
		yearAndMonth: new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1))).getTime(),
		employeeList: [],
		totalPersons:"",
		averageWorkingTime:"",
		totalWorkingTime: "",
		approvalStatuslist: store.getState().dropDown[27],
		checkSectionlist: store.getState().dropDown[28],
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};
	checkSection(code) {
    let checkSections = this.state.checkSectionlist;
        for (var i in checkSections) {
            if (code === checkSections[i].code) {
                return checkSections[i].name;
            }
        }
    };
	approvalStatus(code) {
    let approvalStatuss = this.state.approvalStatuslist;
        for (var i in approvalStatuss) {
            if (code === approvalStatuss[i].code) {
                return approvalStatuss[i].name;
            }
        }
    };
	//　検索
	searchDutyManagement = () => {
		const emp = {
			yearAndMonth: publicUtils.formateDate($("#datePicker").val(), false),
			approvalStatus: $("#approvalStatus").val(),
		};
		axios.post(this.state.serverIP + "dutyManagement/selectDutyManagement", emp)
			.then(response => {
				var totalPersons=0;
				var averageWorkingTime=0;
				var totalWorkingTime=0;
				if (response.data.length>0) {
					var totalPersons=response.data.length;
					for(var i=0;i<totalPersons;i++){
						averageWorkingTime=averageWorkingTime+response.data[i].workTime;
						if(totalWorkingTime<response.data[i].workTime){
							totalWorkingTime=response.data[i].workTime;
						}
					}
					averageWorkingTime=Math.round(averageWorkingTime/totalPersons);
					if(isNaN(averageWorkingTime)){
						averageWorkingTime=0
					}
				} else {
					var totalPersons="";
					var averageWorkingTime="";
					var totalWorkingTime="";
				}
				this.setState({ employeeList: response.data,totalPersons: totalPersons,totalWorkingTime:totalWorkingTime,averageWorkingTime:averageWorkingTime })
			}
			);
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
		axios.post(this.state.serverIP + "dutyManagement/updateDutyManagement", emp)
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
	state = {
		yearAndMonth: new Date()
	};
  /**
     * 作業報告書ボタン
     */
    workRepot=()=>{
 
    }
	//　年月
	inactiveYearAndMonth = (date) => {
		this.setState(
			{
				yearAndMonth: date,
			}
		);
		$("#datePicker").val(date);
		this.searchDutyManagement();
	};
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		$("#workRepot").attr("disabled",true);
		if (isSelected) {
			this.setState(
				{
					rowNo:row.rowNo,
					rowSelectEmployeeNo: row.employeeNo,
					rowSelectCheckSection: row.checkSection,
				}
			);
			$("#syounin").attr("disabled",false);
			if(row.checkSection==0){
				$("#workRepot").attr("disabled",false);
			}
		} else {
			this.setState(
				{
					rowNo: '',
					rowSelectEmployeeNo: '',
					rowSelectCheckSection: '',
				}
			);
			$("#syounin").attr("disabled",true);
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
		const {approvalStatus,employeeList} = this.state;
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
					<MyToast myToastShow={this.state.myToastShow} message={"承認成功！"} type={"success"} />
				</div>
				<FormControl id="rowSelectEmployeeNo" name="rowSelectEmployeeNo" hidden />
				<FormControl id="rowSelectCheckSection" name="rowSelectCheckSection" hidden />
				<Form >
					<div>
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>社員勤務管理</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
												selected={this.state.yearAndMonth}
												onChange={this.inactiveYearAndMonth}
												autoComplete="off"
												locale="ja"
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												maxDate={new Date()}
												id="datePicker"
												className="form-control form-control-sm"
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">時間登録ステータス</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control id="approvalStatus" as="select" size="sm" onChange={this.valueChange} name="approvalStatus" value={approvalStatus} autoComplete="off" >
											<option value="0">すべて</option>
											<option value="1">未</option>
											<option value="2">済み</option>
											<option value="3">総時間のみ</option>
											<option value="4">登録のみ</option>
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
	                <br/>
                    <Row>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}>稼動人数：{this.state.totalPersons}</font>
						</Col>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}>平均稼働時間：{this.state.averageWorkingTime}</font>
						</Col>
						<Col sm={2}>
							<font style={{ whiteSpace: 'nowrap' }}>最大稼働時間：{this.state.totalWorkingTime}</font>
						</Col>
  						<Col sm={2}></Col>
                        <Col sm={4}>
                            <div style={{ "float": "right" }}>
                               <Button variant="info" size="sm" id="syounin" onClick={this.listApproval} >
									<FontAwesomeIcon icon={faEdit} />承認
								</Button>{' '}
		                        <Button variant="info" size="sm" onClick={this.workRepot} id="workRepot">
	                          		 <FontAwesomeIcon icon={faUpload} />作業報告書
		                        </Button>                   
	 						</div>
						</Col>  
                    </Row>
					<BootstrapTable data={employeeList} pagination={true} options={options} approvalRow selectRow={selectRow} headerStyle={ { background: '#5599FF'} } striped hover condensed >
						<TableHeaderColumn width='55'　tdStyle={ { padding: '.45em' } }  dataField='rowNo' isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='90'　tdStyle={ { padding: '.45em' } } 　 dataField='employeeNo'>社員番号</TableHeaderColumn>
						<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } }  dataField='employeeName'>氏名</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }  dataField='customerName'>所属お客様</TableHeaderColumn>
						<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } }  dataField='stationName'>場所</TableHeaderColumn>
						<TableHeaderColumn width='95' tdStyle={ { padding: '.45em' } }  dataField='payOffRange'>精算範囲</TableHeaderColumn>
						<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } }  dataField='workTime'>稼働時間</TableHeaderColumn>
						<TableHeaderColumn width='125' tdStyle={ { padding: '.45em' } }  dataField='overTimePay'>残業代/控除</TableHeaderColumn>
						<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } }  dataFormat={this.checkSection.bind(this)}  dataField='checkSection'>確認区分</TableHeaderColumn>
						<TableHeaderColumn width='140' tdStyle={ { padding: '.45em' } }  dataField='updateTime'>更新日付</TableHeaderColumn>
						<TableHeaderColumn width='110' tdStyle={ { padding: '.45em' } }  dataFormat={this.approvalStatus.bind(this)} dataField='approvalStatus'>ステータス</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div >
		);
	}
}
export default dutyManagement;