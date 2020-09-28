/* 社員を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import '../asserts/css/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as publicUtils from './utils/publicUtils.js';
import { Link } from "react-router-dom";


import BreakTime from './breakTime';
import * as DutyRegistrationJs from './dutyRegistrationJs.js';
axios.defaults.withCredentials=true;


class DutyRegistration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			weekDay: {0: "日", 1: "月", 2: "火", 3: "水", 4: "木", 5: "金", 6: "土"},
			hasWork: ["休憩","出勤"],
			dateData: [],
			dateDataTemp: [],
			year: new Date().getFullYear(),
			month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
//			status: {sleep2sleep: 0 ,work2work: 1, sleep2work: 2, work2sleep: 3},
			workDays: 0,
			workHours: 0,
			isConfirmedPage: false,
		}
		this.options = {
			defaultSortName: 'day',
			defaultSortOrder: 'dsc',
			sizePerPage: 40,
			hideSizePerPage: true,
			paginationShowsTotal: this.renderShowsTotal,
			hidePageListOnlyOnePage: true,
		};
		this.cellEditProp = {
			mode: 'click',
			blurToSave: true,
			beforeSaveCell: this.beforeSaveCell,
			afterSaveCell: this.afterSaveCell
		};
		this.valueChange = this.valueChange.bind(this);
	}
	//onChange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	//onChange
	tableValueChange = (event, cell, row) => {
		let dataData = this.state.dateData;
		if (publicUtils.isNull(event.target.dataset["beforevalue"]))	{
			event.target.dataset["beforevalue"] = dataData[row.id][event.target.name];
		}
		dataData[row.id][event.target.name] = event.target.value;
		this.setState({
			dateData: dataData
		})
	}
	//onChangeAfter
	tableValueChangeAfter = (event, cell, row) => {	
		var regExp = /.*/;		
		switch (event.target.name)	{
			case "startTime":
			case "endTime":
				regExp = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
			break;
			default:
			break;
		}
		if (!cell.match(regExp))	{
			event.target.value = event.target.dataset["beforevalue"];
			return;
		}
		event.target.dataset["beforevalue"] = cell;
		row['isChanged'] = true;
		this.setTableStyle(row.id);
		
		let dataData = this.state.dateData;
		dataData[row.id]["workHour"] = publicUtils.nullToEmpty(publicUtils.timeDiff(row.startTime, row.endTime) - Number(row.sleepHour));
		this.setState({
			dateData: dataData
		})
	}
	setTableStyle = (rowId) =>	{
		if (publicUtils.isNull(rowId))	{
			for (let i = 0; i < this.state.dateData.length; i++)	{
				this.setTableStyle(this.state.dateData[i].id);
			}
			return;
		}
		let dateData = this.state.dateData;
		let target = $("#dutyDataRowNumber-" + rowId).parent().parent()[0];
		DutyRegistrationJs.removeRowAllClass(target);
		for (let i = 0; i < dateData.length; i++)	{
			target = $("#dutyDataRowNumber-" + dateData[i].id).parent().parent()[0];
			if (this.state.isConfirmedPage && dateData[i].isChanged)	{
				DutyRegistrationJs.addRowClass(target, "dutyRegistration-IsChanged");				
			}
			else	{
				if (dateData[i].isWork == 1 && dateData[i].hasWork == this.state.hasWork[1])	{
					DutyRegistrationJs.addRowClass(target, "dutyRegistration-Work2Work");			
				}
				else if (dateData[i].isWork == 0 && dateData[i].hasWork == this.state.hasWork[1])	{
					DutyRegistrationJs.addRowClass(target, "dutyRegistration-Sleep2Work");
				}
				else if (dateData[i].isWork == 1 && dateData[i].hasWork == this.state.hasWork[0])	{
					DutyRegistrationJs.addRowClass(target, "dutyRegistration-Work2Sleep");			
				}
				else if (dateData[i].isWork == 0 && dateData[i].hasWork == this.state.hasWork[0])	{
					DutyRegistrationJs.addRowClass(target, "dutyRegistration-Sleep2Sleep");			
				}
			}
		}
	}
	//リセット化
	resetState = {
		siteCustomer: "",
	};
	//初期化メソッド
	componentDidMount() {
		var dateData = [];
		var monthDays = new Date(this.state.year, this.state.month, 0).getDate();
		let workDays = 0;
		let workHours = 0;
		for (var i = 0; i < monthDays; i++)	{
			dateData[i] = {};
			dateData[i]['id'] = i;
			dateData[i]['isChanged'] = false;
			dateData[i]['day'] = i + 1;
			dateData[i]['week'] = this.state.weekDay[new Date(this.state.year + "/" + this.state.month +"/" + (i + 1)).getDay()];
			dateData[i]['startTime'] = "";
			dateData[i]['endTime'] = "";
			dateData[i]['sleepHour'] = "";
			dateData[i]['workHour'] = "";
			dateData[i]['workContent'] = "";
			dateData[i]['remark'] = "";
			if (dateData[i]['week'] === "土" || dateData[i]['week'] === "日")	{
				dateData[i]['isWork'] = 0;
				dateData[i]['hasWork'] = this.state.hasWork[0];
			}
			else	{
				dateData[i]['isWork'] = 1;
				dateData[i]['hasWork'] = this.state.hasWork[1];
				dateData[i]['sleepHour'] = 0;
			}
			if (dateData[i]["hasWork"] == this.state.hasWork[1])	{
				workDays++;
			}
		}
		this.setState({ dateData: dateData, workDays: workDays, workHours: workHours });
		let postData = {
			yearMonth: this.state.year + this.state.month,
		}
        axios.post("http://127.0.0.1:8080/dutyRegistration/getDutyInfo", postData)
            .then(resultMap => {
                if(resultMap.data){
					let dateData = [];
					let defaultDateData = [];
					let workDays = 0;
					let workHours = 0;
					let sleepHour = 0;
					dateData = this.state.dateData;
					defaultDateData = resultMap.data.dateData;
//					console.log(resultMap.data);
					if (!publicUtils.isNull(resultMap.data.breakTime) && resultMap.data.breakTime["breakTimeFixedStatus"] === "1" ) 	{
						sleepHour = resultMap.data.breakTime["totalBreakTime"];
					}
					let dayIndex = -1;
					for (let i = 0; i < defaultDateData.length; i++)	{
						dayIndex = defaultDateData[i].day - 1;
						dateData[dayIndex].hasWork = this.state.hasWork[defaultDateData[i].isWork];
						if (defaultDateData[i].isWork == 1)	{
							dateData[dayIndex].startTime = publicUtils.timeInsertChar(publicUtils.nullToEmpty(defaultDateData[i].startTime));
							dateData[dayIndex].endTime = publicUtils.timeInsertChar(publicUtils.nullToEmpty(defaultDateData[i].endTime));
							dateData[dayIndex].sleepHour = sleepHour;
							dateData[dayIndex].workHour = publicUtils.nullToEmpty(publicUtils.timeDiff(dateData[dayIndex].startTime, dateData[dayIndex].endTime) - Number(dateData[dayIndex].sleepHour));
							workDays++;
							workHours += Number(dateData[dayIndex].workHour);
						}
					}
					this.setState({dateData: dateData, workDays: workDays, workHours: workHours, 
						employeeNo: resultMap.data.employeeNo, siteCustomer: resultMap.data.siteCustomer, customer: resultMap.data.customer,
						siteResponsiblePerson: resultMap.data.siteResponsiblePerson, systemName: resultMap.data.systemName,
						breakTimeFixedStatus: resultMap.data.breakTimeFixedStatus, employeeName: resultMap.data.employeeName, });
//					console.log(resultMap.data);
					
                }else{
                    alert("fail");
                }
				this.setTableStyle();
            })
            .catch(function(){
                alert("error");
            })
	}
	/**
	* 小さい画面の閉め 
	*/
	handleHideModal = (kbn) => {
		if (kbn === "breakTime") {//PW設定
			this.setState({ showbreakTimeModal: false })
		}
	}

	/**
 　　　* 小さい画面の開き
    */
	handleShowModal = (kbn) => {
		if (kbn === "breakTime") {//PW設定
			this.setState({ showbreakTimeModal: true })
		}
	}
	setWorkDays ()	{
		let workDays = 0;
		for (var i = 0; i < this.state.dateData.length; i++)	{
			if (this.state.dateData[i]["hasWork"] == this.state.hasWork[1])	{
				workDays++;
			}
		}
		this.setState({ workDays: workDays });
	}
	setWorkHours ()	{
		let workHours = 0;
		for (var i = 0; i < this.state.dateData.length; i++)	{
			workHours += Number(this.state.dateData[i]["workHour"]);
		}
		this.setState({ workHours: workHours });		
	}
	onSubmit = (event) =>	{
        var dataInfo = {};
		var actionType = "insert";
        dataInfo["actionType"] = actionType;
        dataInfo["dateData"] = this.state.dateData;
        dataInfo["yearMonth"] = this.state.year + this.state.month;
        dataInfo["siteCustomer"] = this.state.siteCustomer;
        dataInfo["customer"] = this.state.customer;
        dataInfo["siteResponsiblePerson"] = this.state.siteResponsiblePerson;
        dataInfo["systemName"] = this.state.systemName;
		for (let i = 0; i < dataInfo["dateData"].length; i++)	{
			dataInfo["dateData"][i]["isWork"] = (dataInfo["dateData"][i]["hasWork"] == this.state.hasWork[0])?0:1;
		}
		console.log(dataInfo);
        if(actionType === "insert"){
            axios.post("http://127.0.0.1:8080/dutyRegistration/dutyInsert", dataInfo)
            .then(resultMap => {
                if(resultMap.data){
                    alert("更新成功");
                }else{
                    alert("更新失败");
                }
				this.onBack();
            })
            .catch(function(){
                alert("更新错误，请检查程序");
            })
        }
	}
	beforeSubmit = (event) =>	{
		this.setState({ isConfirmedPage: true }, () => {
			this.setTableStyle();		
		});
	}
	onBack = (event) =>	{
		this.setState({ isConfirmedPage: false }, () => {
			this.setTableStyle();		
		});
	}	
	hasWorkFormatter = (cell, row) => {
		let returnItem = (
			<span id={"dutyDataRowNumber-" + row.id}>{cell}</span>
		)
		if (!this.state.isConfirmedPage)	{
			returnItem = (
				<span id={"dutyDataRowNumber-" + row.id} class="dutyRegistration-DataTableEditingCell" >
					<select class=" form-control editor edit-select" name="hasWork" value={cell} onChange={(event) => {this.tableValueChange(event, cell,row);this.tableValueChangeAfter(event ,cell ,row)}} >
						{this.state.hasWork.map(date =>
							<option key={date} value={date}>
								{date}
							</option>
						)}
					</select>
				</span>
			)
		}
		return returnItem;
	}
	startTimeFormatter = (cell, row) => {
		let returnItem = cell;
		if (!this.state.isConfirmedPage && this.state.dateData[row.id].hasWork === this.state.hasWork[1])	{
			returnItem = <span class="dutyRegistration-DataTableEditingCell"><input type="text" class=" form-control editor edit-text" name="startTime" value={cell} onChange={(event) => this.tableValueChange(event ,cell ,row)} onBlur={(event) => this.tableValueChangeAfter(event ,cell ,row)} /></span>;
		}
		return returnItem;
	}
	endTimeFormatter = (cell, row) => {
		let returnItem = cell;
		if (!this.state.isConfirmedPage && this.state.dateData[row.id].hasWork === this.state.hasWork[1])	{
			returnItem = <span class="dutyRegistration-DataTableEditingCell"><input type="text" class=" form-control editor edit-text" name="endTime" value={cell} onChange={(event) => this.tableValueChange(event ,cell ,row)} onBlur={(event) => this.tableValueChangeAfter(event ,cell ,row)} /></span>;
		}
		return returnItem;
	}
	sleepHourFormatter = (cell, row) => {
		let returnItem = cell;
		if (!this.state.isConfirmedPage && this.state.breakTimeFixedStatus)	{
			returnItem = <span class="dutyRegistration-DataTableEditingCell"><input type="text" class=" form-control editor edit-text" name="sleepHour" value={cell} onChange={(event) => this.tableValueChange(event ,cell ,row)} onBlur={(event) => this.tableValueChangeAfter(event ,cell ,row)} /></span>;
		}
		return returnItem;
	}
	workContentFormatter = (cell, row) => {
		let returnItem = cell;
		if (!this.state.isConfirmedPage && this.state.dateData[row.id].hasWork === this.state.hasWork[1])	{
			returnItem = <span class="dutyRegistration-DataTableEditingCell"><input type="text" class=" form-control editor edit-text" name="workContent" value={cell} onChange={(event) => this.tableValueChange(event ,cell ,row)} onBlur={(event) => this.tableValueChangeAfter(event ,cell ,row)} /></span>;
		}
		return returnItem;
	}
	remarkFormatter = (cell, row) => {
		let returnItem = cell;
		if (!this.state.isConfirmedPage && this.state.dateData[row.id].hasWork === this.state.hasWork[1])	{
			returnItem = <span class="dutyRegistration-DataTableEditingCell"><input type="text" class=" form-control editor edit-text" name="remark" value={cell} onChange={(event) => this.tableValueChange(event ,cell ,row)} onBlur={(event) => this.tableValueChangeAfter(event ,cell ,row)} /></span>;
		}
		return returnItem;
	}
	
	render() {
		return (
			<div>
				<div>
					{/*　 開始 */}
					{/*　 休憩時間 */}
					<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
						onHide={this.handleHideModal.bind(this, "breakTime")} show={this.state.showbreakTimeModal} dialogClassName="modal-breakTime">
						<Modal.Header closeButton>
						</Modal.Header>
						<Modal.Body >
							<BreakTime actionType={sessionStorage.getItem('actionType')} />
						</Modal.Body>
					</Modal>
					{/* 終了 */}
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" className="btn btn-info btn-sm" onClick={this.handleShowModal.bind(this, "breakTime")}>休憩時間</Button>{' '}
					</div>
				</div>
				<div>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<FormControl value={this.state.siteCustomer} autoComplete="off" size="sm" name="siteCustomer" id="siteCustomer" onChange={this.valueChange} />
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">御中</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={3} md={{ span: 3, offset: 6 }}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">会社名</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.customer} autoComplete="off" size="sm" name="customer" id="customer" onChange={this.valueChange} />
								</InputGroup>
							</Col>
						</Row>
						<Row className="align-items-center">
							<Col sm={4} md={{ span: 4, offset: 3 }}>
								<span size="lg" className="mb-3">
										<h3 class="text-danger">{this.state.year}年{this.state.month}月　作業報告書</h3>
								</span>
							</Col>
							<Col sm={3} md={{ span: 3, offset: 2 }}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">責任者名</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.siteResponsiblePerson} autoComplete="off" size="sm" name="siteResponsiblePerson" id="siteResponsiblePerson" onChange={this.valueChange} />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">業務名称</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.systemName} autoComplete="off" size="sm" name="systemName" id="systemName" onChange={this.valueChange} />
								</InputGroup>
							</Col>
							<Col sm={3} md={{ span: 3, offset: 6 }}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">作業担当者</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.employeeName} autoComplete="off" size="sm" name="employeeName" id="employeeName" onChange={this.valueChange} />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={12}>
								<div style={{ "float": "right" }}>
									<Link className="btn btn-info btn-sm" onClick="" id=""><FontAwesomeIcon icon={faDownload} /> PDF</Link>
								</div>
							</Col>
						</Row>
						<BootstrapTable className={"bg-white text-dark"} data={this.state.dateData} pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} >
							<TableHeaderColumn tdStyle={{ padding: '.20em' }} width='50' dataField='hasWork' dataFormat={ this.hasWorkFormatter } >勤務</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.20em' }} width='50' dataField='day' dataSort={true} isKey>日</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.20em' }} width='50' dataField='week' >曜日</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.20em' }} width='100' dataField='startTime' dataFormat={ this.startTimeFormatter } >作業開始時刻</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.20em' }} width='100' dataField='endTime' dataFormat={ this.endTimeFormatter } >作業終了時刻</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.20em' }} width='70' dataField='sleepHour' dataFormat={ this.sleepHourFormatter } >休憩時間</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.20em' }} width='70' dataField='workHour' >作業時間</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.20em' }} width='250' dataField='workContent' dataFormat={ this.workContentFormatter } >作業内容</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.20em' }} width='120' dataField='remark' dataFormat={ this.remarkFormatter } >備考</TableHeaderColumn>
						</BootstrapTable>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出勤日数</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">{this.state.workDays}</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={3} md={{ span: 0, offset: 2 }}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">合計時間</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">{this.state.workHours}H</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
						<div style={{ "textAlign": "center" }} hidden={ this.state.isConfirmedPage }>
							<Button size="sm" className="btn btn-info btn-sm" onClick={this.beforeSubmit.bind(this)}>提出</Button>
						</div>
						<div style={{ "textAlign": "center" }} hidden={ !this.state.isConfirmedPage }>
							<Button size="sm" className="btn btn-info btn-sm" onClick={this.onSubmit.bind(this)}>確認</Button>
							&nbsp;&nbsp;
							<Button size="sm" className="btn btn-info btn-sm" onClick={this.onBack.bind(this)}>back</Button>
						</div>
					</Form.Group>
				</div>
			</div>
		);
	}
}

export default DutyRegistration;
