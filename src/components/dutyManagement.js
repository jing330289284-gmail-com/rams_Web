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
import { faEdit, faUpload, faSearch } from '@fortawesome/free-solid-svg-icons';
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
		$("#update").attr("disabled",true);
		$("#syounin").attr("disabled",true);
		$("#workRepot").attr("disabled",true);
		$("#datePicker").attr("readonly","readonly");
		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
		.then(result => {
			this.setState({
				authorityCode: result.data[0].authorityCode,
			})
		})
		.catch(function(error) {
			alert(error);
		});	
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
		rowSelectEmployeeNo: "",
		authorityCode: "",
		rowWorkTime: '',
		rowApprovalStatus: '',
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

	greyShow(cell,row) {
		if(row.workTime === "" || row.workTime === null)
			return (<div style={{color:"grey"}}>{cell}</div>);
		else
			return cell;
    };
	
	approvalStatus(code,row) {
		if(row.workTime === "" || row.workTime === null)
			return "";
	    let approvalStatuss = this.state.approvalStatuslist;
	        for (var i in approvalStatuss) {
	            if (code === approvalStatuss[i].code) {
	                return approvalStatuss[i].name;
	            }
	        }
    };
	//　検索
	searchDutyManagement = (rowNo) => {
		const emp = {
			yearAndMonth: publicUtils.formateDate($("#datePicker").val(), false),
			approvalStatus: $("#approvalStatus").val(),
		};
		axios.post(this.state.serverIP + "dutyManagement/selectDutyManagement", emp)
			.then(response => {
				var totalPersons=0;
				var averageWorkingTime=0;
				var totalWorkingTime=0;
				var minWorkingTime=999;
				if (response.data.length>0) {
					totalPersons=response.data.length;
					for(var i=0;i<totalPersons;i++){
						averageWorkingTime = averageWorkingTime+response.data[i].workTime;
						if(Number(totalWorkingTime) < Number(response.data[i].workTime)){
							totalWorkingTime = response.data[i].workTime;
						}
						if(!(response.data[i].workTime === "" || response.data[i].workTime === null)){
							if(Number(minWorkingTime) > Number(response.data[i].workTime)){
								minWorkingTime = response.data[i].workTime
							}
						}
					}
					averageWorkingTime=Math.round(averageWorkingTime/totalPersons);
					if(isNaN(averageWorkingTime)){
						averageWorkingTime=0
					}
				} else {
					totalPersons="";
					averageWorkingTime="";
					totalWorkingTime="";
					minWorkingTime="";
				}
				this.setState({
					employeeList: response.data,
					totalPersons: totalPersons,
					totalWorkingTime: totalWorkingTime,
					minWorkingTime: minWorkingTime,
					averageWorkingTime: averageWorkingTime
				})
				if(rowNo !== undefined){
					this.setState({
						rowApprovalStatus: response.data[rowNo - 1].approvalStatus,
					})
					if(response.data[rowNo - 1].approvalStatus === "1"){
						$("#update").attr("disabled",true);
					}else{
						$("#update").attr("disabled",false);
					}
				}
			}
			);
	}
	/**
	  * 行の承認
	  */
	listApproval = (approvalStatus) => {
		const emp = {
			yearAndMonth: publicUtils.formateDate(this.state.yearAndMonth, false),
			employeeNo: this.state.rowSelectEmployeeNo,
			checkSection: this.state.rowSelectCheckSection,
			deductionsAndOvertimePay: publicUtils.deleteComma((this.state.employeeList[this.state.rowNo - 1].deductionsAndOvertimePay).replace(/￥/, "")),
			deductionsAndOvertimePayOfUnitPrice: publicUtils.deleteComma(this.state.employeeList[this.state.rowNo - 1].deductionsAndOvertimePayOfUnitPrice.replace(/￥/, "")),
			approvalStatus: approvalStatus,
		}
		axios.post(this.state.serverIP + "dutyManagement/updateDutyManagement", emp)
			.then(result => {
				if (result.data == true) {
					this.searchDutyManagement(this.state.rowNo);
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
    
    overtimePayFormat = (cell,row) => {
    	if(row.workTime === "" || row.workTime === null)
    		return "";
    	if(cell === null || cell === "")
    		return "";
    	else
    		return ("￥" + publicUtils.addComma(cell));
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
					rowSelectDeductionsAndOvertimePay: row.deductionsAndOvertimePay,
					rowSelectDeductionsAndOvertimePayOfUnitPrice: row.deductionsAndOvertimePayOfUnitPrice,
					rowWorkTime: row.workTime,
					rowApprovalStatus: row.approvalStatus,
				}
			);
			if(!(row.workTime === "" || row.workTime === null)){
				$("#syounin").attr("disabled",false);
				if(row.approvalStatus !== "1")
					$("#update").attr("disabled",false);
				else
					$("#update").attr("disabled",true);
			}else{
				$("#syounin").attr("disabled",true);
				$("#update").attr("disabled",true);
			}

			if(row.checkSection==0){
				$("#workRepot").attr("disabled",false);
			}
		} else {
			this.setState(
				{
					rowNo: '',
					rowSelectEmployeeNo: '',
					rowSelectCheckSection: '',
					rowSelectDeductionsAndOvertimePay: '',
					rowSelectDdeductionsAndOvertimePayOfUnitPrice: '',
					rowApprovalStatus: '',
				}
			);
			$("#syounin").attr("disabled",true);
			$("#update").attr("disabled",true);
		}
	}
	
	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = {
				yearAndMonthDate: this.state.yearAndMonthDate,
				enterPeriodKbn: this.state.enterPeriodKbn,
				employeeName: this.state.employeeName,
				employeeNo: $("#employeeName").val(),
		};
		switch (actionType) {
			case "employeeInfo":
				path = {
					pathname: '/subMenuManager/employeeUpdateNew',
					state: {
						id: this.state.rowSelectEmployeeNo,
						employeeNo: this.state.rowSelectEmployeeNo,
						backPage: "dutyManagement",
						sendValue: sendValue,
	                    searchFlag: true,
	                    actionType:"update",
					},
				}
				break;
			case "siteInfo":
				path = {
					pathname: '/subMenuManager/siteInfo',
					state: {
						employeeNo: this.state.rowSelectEmployeeNo,
						backPage: "dutyManagement",
						sendValue: sendValue,
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
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
			clickToSelectAndEditCell: true,
			hideSelectColumn: true,
			clickToSelect: true,  // click to select, default is false
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		//　 テーブルの定義
		const options = {
			page: 1, 
			sizePerPage: 10,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
			expandRowBgColor: 'rgb(165, 165, 165)',
			approvalBtn: this.createCustomApprovalButton,
			onApprovalRow: this.onApprovalRow,
			handleConfirmApprovalRow: this.customConfirm,
		};
		const cellEdit = {
				mode: 'click',
				blurToSave: true
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
								<Col sm={10}>
									<Col sm={6} style={{padding:"0px"}}>
									<InputGroup size="sm" className="mb-2">
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
									<font style={{ marginRight: "30px" }}></font>
										<InputGroup.Prepend>
											<InputGroup.Text id="nineKanji">時間登録ステータス</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control id="approvalStatus" as="select" size="sm" onChange={this.valueChange} style={{width:"30px"}} name="approvalStatus" value={approvalStatus} autoComplete="off" >
											<option value="0">すべて</option>
											<option value="1">未</option>
											<option value="2">済み</option>
											<option value="3">総時間のみ</option>
											<option value="4">登録のみ</option>
										</Form.Control>
										<font style={{ marginLeft: "90px" }}></font>
									</InputGroup>
								</Col>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
                    <Row>
						<Col sm={2}>
							{/*<font style={{ whiteSpace: 'nowrap' }}>稼動人数：{this.state.totalPersons}</font>*/}
                            <Button size="sm" onClick={this.shuseiTo.bind(this, "employeeInfo")} disabled={this.state.rowSelectEmployeeNo === "" ? true : false} variant="info" id="employeeInfo">個人情報</Button>{' '}
							<Button size="sm" onClick={this.shuseiTo.bind(this, "siteInfo")} disabled={this.state.rowSelectEmployeeNo === "" ? true : false} name="clickButton" variant="info" id="siteInfo">現場情報</Button>{' '}
						</Col>
						<Col>
							<InputGroup size="sm">
			                    <InputGroup.Prepend>
			                        <InputGroup.Text id="sixKanji" className="input-group-indiv">最小稼働時間</InputGroup.Text>
			                    </InputGroup.Prepend>
			                    <FormControl
			                    value={this.state.minWorkingTime}
			                    disabled/>
		                    </InputGroup>
						</Col>
						<Col>
							<InputGroup size="sm">
			                    <InputGroup.Prepend>
			                        <InputGroup.Text id="sixKanji" className="input-group-indiv">最大稼働時間</InputGroup.Text>
			                    </InputGroup.Prepend>
			                    <FormControl
			                    value={this.state.totalWorkingTime}
			                    disabled/>
		                    </InputGroup>
						</Col>
						<Col>
							<InputGroup size="sm">
			                    <InputGroup.Prepend>
			                        <InputGroup.Text id="sixKanji" className="input-group-indiv">平均稼働時間</InputGroup.Text>
			                    </InputGroup.Prepend>
			                    <FormControl
			                    value={this.state.averageWorkingTime}
			                    disabled/>
		                    </InputGroup>
						</Col>

                        <Col sm={3}>
                            <div style={{ "float": "right" }}>
		                        <Button variant="info" size="sm" onClick={this.workRepot} id="workRepot">
		                     		 <FontAwesomeIcon icon={faUpload} />報告書
		                       </Button>{' '}
	                            <Button variant="info" size="sm" id="update" onClick={this.listApproval.bind(this,2)}>
									<FontAwesomeIcon icon={faEdit} />残業控除更新
								</Button>{' '}
                               <Button variant="info" size="sm" id="syounin" onClick={this.state.rowApprovalStatus !== "1" ? this.listApproval.bind(this,1) : this.listApproval.bind(this,0)}>
									<FontAwesomeIcon icon={faEdit} />{this.state.rowApprovalStatus !== "1" ? "承認" : "取り消し" }
								</Button>{' '}
               
	 						</div>
						</Col>  
                    </Row>
                    <Col>
						<BootstrapTable data={employeeList} selectRow={selectRow} pagination={true} cellEdit={cellEdit} options={options} approvalRow headerStyle={ { background: '#5599FF'} } striped hover condensed >
							<TableHeaderColumn width='55'　tdStyle={ { padding: '.45em' } } dataFormat={this.greyShow.bind(this)} dataField='rowNo' isKey>番号</TableHeaderColumn>
							<TableHeaderColumn width='90'　tdStyle={ { padding: '.45em' } } 　dataFormat={this.greyShow.bind(this)} dataField='employeeNo' hidden>社員番号</TableHeaderColumn>
							<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } } dataFormat={this.greyShow.bind(this)} dataField='employeeName' editable={false}>氏名</TableHeaderColumn>
							<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } } dataFormat={this.greyShow.bind(this)} dataField='customerName' editable={false}>お客様</TableHeaderColumn>
							<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } } dataFormat={this.greyShow.bind(this)} dataField='stationName' editable={false}>場所</TableHeaderColumn>
							<TableHeaderColumn width='95' tdStyle={ { padding: '.45em' } } dataFormat={this.greyShow.bind(this)} dataField='payOffRange' editable={false}>精算範囲</TableHeaderColumn>
							<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } }  dataField='workTime' editable={false}>稼働時間</TableHeaderColumn>
							<TableHeaderColumn width='125' tdStyle={{ padding: '.45em' }} hidden={this.state.authorityCode==="4" ? false : true} dataField='deductionsAndOvertimePay' editable={!(this.state.rowWorkTime === "" || this.state.rowWorkTime === null)} editColumnClassName="dutyRegistration-DataTableEditingCell" dataFormat={this.overtimePayFormat.bind(this)}>残業/控除</TableHeaderColumn>
							<TableHeaderColumn width='125' tdStyle={{ padding: '.45em' }} dataField='deductionsAndOvertimePayOfUnitPrice' editable={!(this.state.rowWorkTime === "" || this.state.rowWorkTime === null)} editColumnClassName="dutyRegistration-DataTableEditingCell" dataFormat={this.overtimePayFormat.bind(this)}>残業/控除(客)</TableHeaderColumn>
							<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } }  dataFormat={this.checkSection.bind(this)} hidden dataField='checkSection' editable={false}>確認区分</TableHeaderColumn>
							<TableHeaderColumn width='140' tdStyle={ { padding: '.45em' } }  dataField='updateTime' editable={false}>更新日付</TableHeaderColumn>
							<TableHeaderColumn width='110' tdStyle={ { padding: '.45em' } }  dataFormat={this.approvalStatus.bind(this)} dataField='approvalStatus' editable={false}>ステータス</TableHeaderColumn>
						</BootstrapTable>
					</Col>  
				</div>
			</div >
		);
	}
}
export default dutyManagement;