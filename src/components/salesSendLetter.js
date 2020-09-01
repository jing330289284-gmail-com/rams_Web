/* 営業確認 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import * as publicUtils from './utils/publicUtils.js';
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEnvelope, faMinusCircle, faBroom, faListOl } from '@fortawesome/free-solid-svg-icons';
axios.defaults.withCredentials=true;

class salesSendLetter extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
	}
	//初期化
	initialState = {
		employeeNo: '',// 社員NO
		yearMonth: new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 2) : (new Date().getMonth() + 2))).getTime(),
		interviewDate1Show: '',　// 面接1日付
		interviewDate1: '',　// 面接1日付
		interviewDate2Show: '',　// 面接1日付
		interviewDate2: '',　// 面接2日付
		stationCode1: '',　// 面接1場所
		stationCode2: '',　// 面接2場所
		interviewCustomer1: '',　// 面接1客様
		interviewCustomer2: '',　// 面接2客様
		hopeLowestPrice: '',　// 希望単価min
		hopeHighestPrice: '',　// 希望単価max
		remark: '',　// 備考
		salesSituationLists: [],// 明細
		readFlag: true,// readonlyflag
		style: {
			"color": ""
		},// 単価エラー色
		salesProgressCodes: [],// ステータス
		allCustomer: [],// お客様レコード用
		editFlag: false,// 確定客様編集flag
		priceEditFlag: false,// 確定単価編集flag
		updateBtnflag: false,//　レコード選択flag
		salesYearAndMonth: new Date().getFullYear() + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 2) : (new Date().getMonth() + 2)),// 終わり年月
		updateUser: sessionStorage.getItem('employeeName'),//更新者
		salesPriorityStatus: '',// 優先度
		regexp: /^[0-9\b]+$/,// 数字正則式
		salesStaff: '',// 営業担当
		salesPriorityStatuss: [],// 全部ステータス
		salesPersons: [],// 全部営業
		customers: [],// 全部お客様　画面入力用
		getstations: [], // 全部場所
		totalPersons: '',// 合計人数
		decidedPersons: '',// 確定人数
		linkDisableFlag: true,// linkDisableFlag
		admissionStartDate:'', // record開始時間
		customerNo:'', // 該当レコードおきゃくNO
		unitPrice:'', // 該当レコード単価
		resumeInfo1:'',	
		resumeInfo2:'',
	};

	// 初期表示のレコードを取る
	componentDidMount() {
	}
	
	// 行番号
	indexN(cell, row, enumObject, index) {
		return (<div>{index + 1}</div>);
	}

	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

	// レコードselect事件
	
	renderShowsTotal = (start, to, total) => {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}


	render() {
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			clickToSelectAndEditCell: true,
			hideSelectColumn: true,
			clickToExpand: true,
			onSelect: this.handleRowSelect,
		};
		const cellEdit = {
			mode: 'click',
			blurToSave: true,
			afterSaveCell: this.afterSaveCell,
		}

		const options = {
			defaultSortOrder: 'dsc',
			sizePerPage: 5,
			pageStartIndex: 1,
			paginationSize: 2,
			prePage: 'Prev',
			nextPage: 'Next',
			hideSizePerPage: true,
			alwaysShowAllBtns: true,
			paginationShowsTotal: this.renderShowsTotal,
		};

		return (
			<div>
				<Form onSubmit={this.savealesSituation}>
					<Form.Group>

						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.remark} autoComplete="off" name="remark"
										onChange={this.valueChange} size="sm" maxLength="50" />
								</InputGroup>
							</Col>
							
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様名</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.remark} autoComplete="off" name="remark"
										onChange={this.valueChange} size="sm" maxLength="50" />
								</InputGroup>
							</Col>
							
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">部門</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.remark} autoComplete="off" name="remark"
										onChange={this.valueChange} size="sm" maxLength="50"  />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<Button size="sm" variant="info" >
							<FontAwesomeIcon icon={faPlusCircle} />追加</Button>
							</Col>
						</Row>
					</Form.Group>

					<Row>
						<Col sm={2}>
							<Button size="sm" variant="info" name="clickButton" ><FontAwesomeIcon icon={faListOl} />すべて選択</Button>
							{' '}
							<font style={{ whiteSpace: 'nowrap' }}>件数：21</font>
						</Col>
						<Col sm={5}></Col>
						<Col sm={5}>
							<div style={{ "float": "right" }}>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" ><FontAwesomeIcon icon={faBroom} />クリア</Button>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" ><FontAwesomeIcon icon={faMinusCircle} />削除</Button>
								<Button size="sm" variant="info" name="clickButton" ><FontAwesomeIcon icon={faEnvelope} />送信</Button>
							</div>
						</Col>
					</Row>
				</Form>
				<div >
					<BootstrapTable
						className={"bg-white text-dark"}
						data={this.state.salesSituationLists}
						pagination
						options={options}
						selectRow={selectRow}
						cellEdit={cellEdit}
						trClassName="customClass" >
						<TableHeaderColumn width='8%' dataField='any' dataFormat={this.indexN} dataAlign='center' autoValue dataSort={true} caretRender={publicUtils.getCaret} editable={false}>番号</TableHeaderColumn>
						<TableHeaderColumn width='10%' dataField='employeeNo' dataFormat={this.showPriority} editable={false} isKey>お客様番号</TableHeaderColumn>
						<TableHeaderColumn width='10%' dataField='employeeName' editable={false}>お客様名</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='siteRoleCode' editable={false}>担当者</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='developLanguage' editable={false}>所属</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='nearestStation' editable={false}>職位</TableHeaderColumn>
						<TableHeaderColumn width='15%' dataField='unitPrice' editable={false}>メール</TableHeaderColumn>
						<TableHeaderColumn width='12%' dataField='price' editable={this.state.priceEditFlag}>ランキング</TableHeaderColumn>
						<TableHeaderColumn width='12%' dataField='interviewDate1'>取引数(今月)</TableHeaderColumn>
						<TableHeaderColumn width='12%' dataField='stationCode1' >担当追加</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		);
	}
}
export default salesSendLetter;
