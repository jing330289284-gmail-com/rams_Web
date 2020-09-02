/* 社員を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import ImageUploader from "react-images-upload";
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import * as dateUtils from './utils/publicUtils.js';
import BankInfo from './accountInfo';
import SubCost from './costInfo';
import SiteInfo from './siteInfo';
import PasswordSet from './passwordSet';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import Autosuggest from 'react-autosuggest';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as publicUtils from './utils/publicUtils.js';


import BreakTime from './breakTime';


class DutyRegistration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			weekDay: {0: "日", 1: "月", 2: "火", 3: "水", 4: "木", 5: "金", 6: "土"},
			isWorkMap: ["休憩", "出勤"],
			dateData: [],
			year: new Date().getFullYear(),
			month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
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
			blurToSave: true
		};
	}
	//リセット化
	resetState = {
	};
	//初期化メソッド
	componentDidMount() {
		var dateData = [];
		for (var i = 0; i < 31; i++)	{
			dateData[i] = {};
			dateData[i]['day'] = i + 1;
			dateData[i]['week'] = this.state.weekDay[new Date(this.state.year + "/" + this.state.month +"/" + (i + 1)).getDay()];
			dateData[i]['startHour'] = "";
			dateData[i]['startMinut'] = "";
			dateData[i]['endHour'] = "";
			dateData[i]['endMinute'] = "";
			dateData[i]['sleepHour'] = "";
			dateData[i]['workHour'] = "";
			dateData[i]['workContent'] = "";
			dateData[i]['remark'] = "";
			if (dateData[i]['week'] === "土" || dateData[i]['week'] === "日")	{
				dateData[i]['isWork'] = this.state.isWorkMap[0];				
			}
			else	{
				dateData[i]['isWork'] = this.state.isWorkMap[1];				
			}
		}
		this.setState({ dateData: dateData })
		console.log(new Date("2020/08/02").getDay());
		console.log(this.state.month);
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
	rowClassNameFormat( row, rowIdx) {
		var baseCss = " dutyRegistration-DataTableRow ";
		if (row["week"] === "土" || row["week"] === "日")	{
			return baseCss + 'dutyRegistration-DataTableSleep';
		}
		return baseCss;
	}
	columnClassNameFormat( fieldValue, row, rowIdx, colIdx) {
		var baseCss = " dutyRegistration-DataTableTd ";
		return baseCss;
	}
	onSubmit = (event) =>	{
		console.log(this.state.dateData);
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
						<Button size="sm" onClick={this.handleShowModal.bind(this, "breakTime")}>休憩時間</Button>{' '}
					</div>
				</div>
				<div>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<FormControl value="" autoComplete="off" size="sm" name="" id="" />
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">御中</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={3} md={{ span: 3, offset: 6 }}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">会社名：</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value="" autoComplete="off" size="sm" name="" id="" />
								</InputGroup>
							</Col>
						</Row>
						<Row className="align-items-center">
							<Col sm={3} md={{ span: 3, offset: 4 }}>
								<InputGroup size="lg" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">{this.state.year}年{this.state.month}月　作業報告書</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={3} md={{ span: 3, offset: 2 }}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">責任者名：</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value="" autoComplete="off" size="sm" name="" id="" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">業務名称：</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value="" autoComplete="off" size="sm" name="" id="" />
								</InputGroup>
							</Col>
							<Col sm={3} md={{ span: 3, offset: 6 }}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">作業担当者</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value="" autoComplete="off" size="sm" name="" id="" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={1} md={{ offset: 11 }}>
								<Button size="sm">PDF</Button>
							</Col>
						</Row>
						<BootstrapTable className={"dutyRegistration-DataTable"} trClassName={ this.rowClassNameFormat } data={this.state.dateData} pagination={true} options={this.options}  cellEdit={ this.cellEditProp }>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} editColumnClassName="dutyRegistration-DataTableEditingCell" width='120' dataField='isWork' editable={{ type: 'select', options: { values: this.state.isWorkMap } }}>出勤・休憩</TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} width='50' dataField='day' dataSort={true} isKey>日</TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} width='60' dataField='week' editable={false}>曜日</TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} editColumnClassName="dutyRegistration-DataTableEditingCell" width='120' dataField='startHour' colSpan='1'>作業開始時刻</TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} editColumnClassName="dutyRegistration-DataTableEditingCell" width='50' dataField='startMinute'></TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} editColumnClassName="dutyRegistration-DataTableEditingCell" width='120' dataField='endHour'>作業終了時刻</TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} editColumnClassName="dutyRegistration-DataTableEditingCell" width='50' dataField='endMinute'></TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} width='100' dataField='sleepHour' editable={false}>休憩時間</TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} width='100' dataField='workHour' editable={false}>作業時間</TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} editColumnClassName="dutyRegistration-DataTableEditingCell" width='100' dataField='workContent'>作業内容</TableHeaderColumn>
							<TableHeaderColumn columnClassName={this.columnClassNameFormat} className={"dutyRegistration-DataTableTh"} editColumnClassName="dutyRegistration-DataTableEditingCell" width='120' dataField='remark'>備考</TableHeaderColumn>
						</BootstrapTable>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出勤日数：</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">20</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={3} md={{ span: 0, offset: 4 }}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">合計時間：</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">168H</InputGroup.Text>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
						<div style={{ "textAlign": "center" }}>
							<Button size="sm" onClick={this.onSubmit.bind(this)}>提出</Button>
						</div>
					</Form.Group>
				</div>
			</div>
		);
	}
}
export default DutyRegistration;
