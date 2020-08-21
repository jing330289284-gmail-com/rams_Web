/* 営業確認 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"
import * as publicUtils from './utils/publicUtils.js';
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class manageSituation extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
	}

	// レコードのステータス
	formatType(cell) {
		let ststeName = '';
		if (cell === '0') {
			ststeName = '';
		} else if (cell === '1') {
			ststeName = '提案のみ';
		} else if (cell === '2') {
			ststeName = '確定';
		} else if (cell === '3') {
			ststeName = '延長';
		}
		return ststeName;
	}

	// table編集
	afterSaveCell = (row) => {
		if (!(row.salesProgressCode === '2')) {
			row.customer = '0';
		}
	};

	formatCustome(cell) {
		let ststeName = '';
		if (cell === '0') {
			ststeName = '';
		} else if (cell === '1') {
			ststeName = 'MIZUHO';
		} else if (cell === '2') {
			ststeName = 'LENOVO';
		} else if (cell === '3') {
			ststeName = 'SONY';
		}
		return ststeName;
	}

	// 行番号
	indexN(cell, row, enumObject, index) {
		return (<div>{index + 1}</div>);
	}

	showPriority(cell, row, enumObject, index) {
		if (row.salesPriorityStatus === '1') {
			return (<div>{row.employeeNo}<font color="red">★</font></div>);
		} else {
			return (<div>{row.employeeNo}</div>);
		}
	}

	// 更新ボタン
	changeState = () => {
		if (this.state.readFlag) {
			if (!this.state.updateBtnflag) {
				alert("エラーメッセージ");
			} else {
				this.setState({
					readFlag: !this.state.readFlag,
					readOnlyColorId: 'datePicker2',
				})
			}
		} else {
			if (this.state.hopeLowestPrice > this.state.hopeHighestPrice) {
				this.setState({
					style: {
						"color": "red"
					},
				})
				alert("エラーメッセージはMSG009")
			} else {
				alert(this.state.interviewDate1);
				alert(this.state.interviewDate1Show);
				alert(this.state.salesYearAndMonth);
				axios.post("http://127.0.0.1:8080/salesSituation/updateSalesSituation", this.state)
					.then(result => {
						if (result.data != null) {
							this.getSalesSituation(this.state.salesYearAndMonth)
							this.setState({
								style: {
									"color": ""
								},
								readFlag: !this.state.readFlag,
								readOnlyColorId: 'datePickerReadonly',
								updateBtnflag: !this.state.updateBtnflag,
								salesPriorityStatus: ''
							})
							/* window.location.reload(); */
						} else {
							alert("FAIL");
						}
					})
					.catch(function (error) {
						alert("ERR");
					});
			}
		}
	}

	//onchange
	valueChange = event => {
		console.log(event)
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

	// numbre only
	valueChangeNUmberOnly = event => {
		console.log(event)
		if (event.target.value === '' || this.state.regexp.test(event.target.value)) {
			this.setState({
				[event.target.name]: event.target.value,
			})
		} else {
			alert("ONLY NUMBER");
		}
	}

	// 年月変更後、レコ＾ド再取る
	setEndDate = (date) => {
		this.setState({
			yearMonth: date,
			salesYearAndMonth: publicUtils.formateDate(date, false),
			initFlag: false
		});
		let searchYearMonth = date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
		this.getSalesSituation(searchYearMonth)
	}

	// setinterviewDate1
	setinterviewDate1 = (date) => {
		this.setState({
			interviewDate1Show: date,
			interviewDate1: this.timeToStr(date)
		});
	}

	// setinterviewDate2
	setinterviewDate2 = (date) => {
		this.setState({
			interviewDate2Show: date,
			interviewDate2: this.timeToStr(date)
		});
	}

	// 初期表示のレコードを取る
	componentDidMount() {
		let sysYearMonth = new Date();
		let searchYearMonth = sysYearMonth.getFullYear() + (sysYearMonth.getMonth() + 1 < 10 ? '0' + (sysYearMonth.getMonth() + 2) : (sysYearMonth.getMonth() + 2));
		this.getSalesSituation(searchYearMonth)
	}

	// レコードを取る
	getSalesSituation = (searchYearMonth) => {
		axios.post("http://127.0.0.1:8080/salesSituation/getSalesSituation", { salesYearAndMonth: searchYearMonth })
			.then(result => {
				if (result.data != null) {
					this.setState({
						salesSituationLists: result.data,
						interviewDate1Show: '',　// 面接1日付
						interviewDate1: '',　// 面接1日付
						interviewDate2Show: '',　// 面接1日付
						interviewDate2: '',　// 面接2日付
						intreviewPalace1: '',　// 面接1場所
						intreviewPalace2: '',　// 面接2場所
						interviewCustomer1: '',　// 面接1客様
						interviewCustomer2: '',　// 面接2客様
						hopeLowestPrice: '',　// 希望単価min
						hopeHighestPrice: '',　// 希望単価max
						remark: '',　// 備考 
						salesPriorityStatus: '',
					});
					/* if(!this.state.initFlag){
						window.location.reload();
					} */
				} else {
					alert("FAIL");
				}
			})
			.catch(function (error) {
				alert("ERR");
			});
	}

	// yyyy/mm/dd hh:mm→yyyymmddhhmm
	timeToStr = (date) => {
		if (date !== undefined && date !== null && date !== "") {
			function addDateZero(num) {
				return (num < 10 ? "0" + num : num);
			}
			let d = new Date(date);
			return d.getFullYear() + '' + addDateZero(d.getMonth() + 1) + '' + addDateZero(d.getDate()) + '' +
				addDateZero(d.getHours()) + '' + addDateZero(d.getMinutes());
		} else {
			return "";
		}
	};

	// yyyymmddhhmm→yyyy/mm/dd hh:mm
	formatTime = (datetime) => {
		if (datetime !== undefined && datetime !== null && datetime !== "") {
			var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/;
			return datetime.replace(pattern, '$1/$2/$3 $4:$5');
		} else {
			return "";
		}
	};

	//初期化
	initialState = {
		employeeNo: '',// 社員NO
		yearMonth: new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 2) : (new Date().getMonth() + 2))).getTime(),
		interviewDate1Show: '',　// 面接1日付
		interviewDate1: '',　// 面接1日付
		interviewDate2Show: '',　// 面接1日付
		interviewDate2: '',　// 面接2日付
		intreviewPalace1: '',　// 面接1場所
		intreviewPalace2: '',　// 面接2場所
		interviewCustomer1: '',　// 面接1客様
		interviewCustomer2: '',　// 面接2客様
		hopeLowestPrice: '',　// 希望単価min
		hopeHighestPrice: '',　// 希望単価max
		remark: '',　// 備考
		salesSituationLists: [],// 明細
		readFlag: true,// readflag
		style: {
			"color": ""
		},
		salesProgressCodes: [{ value: 0, text: ' ' }, { value: 1, text: '提案のみ' }, { value: 2, text: '確定' }, { value: 3, text: '延長' }],// ステータス
		allCustomer: [{ value: 0, text: ' ' }, { value: 1, text: 'MIZUHO' }, { value: 2, text: 'LENOVO' }, { value: 3, text: 'SONY' }],// ステータス
		editFlag: false,
		readOnlyColorId: 'datePickerReadonly',
		updateBtnflag: false,
		salesYearAndMonth: new Date().getFullYear() + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 2) : (new Date().getMonth() + 2)),
		updateUser: sessionStorage.getItem('employeeName'),//更新者
		salesPriorityStatus: '',
		initFlag: true,
		regexp: /^[0-9\b]+$/,
		salesStaff: ''
	};

	// レコードselect事件
	handleRowSelect = (row, isSelected, e) => {
		this.setState({
			employeeNo: row.employeeNo === null ? '' : row.employeeNo,
			interviewDate1: row.interviewDate1 === null ? '' : row.interviewDate1,
			interviewDate1Show: row.interviewDate1 === null ? '' : new Date(this.formatTime(row.interviewDate1)).getTime(),
			interviewDate2: row.interviewDate2 === null ? '' : row.interviewDate2,
			interviewDate2Show: row.interviewDate2 === null ? '' : new Date(this.formatTime(row.interviewDate2)).getTime(),
			intreviewPalace1: row.interviewLocation1 === null ? '' : row.interviewLocation1,
			intreviewPalace2: row.interviewLocation2 === null ? '' : row.interviewLocation2,
			interviewCustomer1: row.interviewCustomer1 === null ? '' : row.interviewCustomer1,
			interviewCustomer2: row.interviewCustomer2 === null ? '' : row.interviewCustomer2,
			hopeLowestPrice: row.hopeLowestPrice === null ? '' : row.hopeLowestPrice,
			hopeHighestPrice: row.hopeHighestPrice === null ? '' : row.hopeHighestPrice,
			salesPriorityStatus: row.salesPriorityStatus === null ? '' : row.salesPriorityStatus,
			salesProgressCode: row.salesProgressCode === null ? '' : row.salesProgressCode,
			remark: row.remark === null ? '' : row.remark,
			editFlag: row.salesProgressCode === '2' ? { type: 'select', readOnly: false, options: { values: this.state.allCustomer } } : false,
			updateBtnflag: true,
			salesStaff: row.salesStaff === null ? '' : row.salesStaff,
		});
	}

	render() {
		let buttonDiv;
		if (!this.state.readFlag && this.state.updateBtnflag) {
			buttonDiv = (<div style={{ "textAlign": "center" }}><Button size="sm" variant="info" onClick={this.changeState}>更新</Button></div>)
		} else {
			buttonDiv = (<div style={{ "textAlign": "center" }}><Button size="sm" variant="info" onClick={this.changeState}>解除</Button></div>)
		}

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
			bgColor: 'pink',
			afterSaveCell: this.afterSaveCell,
		}

		const options = {

		};

		return (
			<div>
				<Form onSubmit={this.savealesSituation}>
					<Form.Group>
						<Row >
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3" >
									<FormControl placeholder="社員NO" autoComplete="off" hidden
										defaultValue={this.state.employeeNo} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.yearMonth}
											onChange={this.setEndDate}
											autoComplete="on"
											locale="ja"
											className="form-control form-control-sm"
											dateFormat="yyyy/MM"
											id="datePicker"
										/>
									</InputGroup.Append>
								</InputGroup>
							</Col>
						</Row>
						<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
						<Row>
							<Col sm={6}>
								<Form.Label style={{ "color": "#FFD700" }}>面談情報1</Form.Label>
							</Col>
							<Col sm={6}>
								<Form.Label style={{ "color": "#FFD700" }}>面談情報2</Form.Label>
							</Col>
						</Row>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3" style={{ flexFlow: "nowrap", width: "200%" }}>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.interviewDate1Show}
											onChange={this.setinterviewDate1}
											autoComplete="on"
											locale="ja"
											showTimeSelect
											className="form-control form-control-sm"
											dateFormat="MM/dd HH:mm"
											minDate={new Date()}
											id={this.state.readOnlyColorId}
											readOnly={this.state.readFlag}
										/>
									</InputGroup.Append>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.intreviewPalace1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="intreviewPalace1" maxLength="3" readOnly={this.state.readFlag} />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.interviewCustomer1} autoComplete="off"
										onChange={this.valueChange} size="sm" maxLength="3" name="interviewCustomer1" readOnly={this.state.readFlag} />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3" style={{ flexFlow: "nowrap", width: "200%" }}>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
									</InputGroup.Prepend>
									<InputGroup.Append>
										<DatePicker
											selected={this.state.interviewDate2Show}
											onChange={this.setinterviewDate2}
											autoComplete="on"
											locale="ja"
											showTimeSelect
											className="form-control form-control-sm"
											dateFormat="MM/dd HH:mm"
											minDate={new Date()}
											id={this.state.readOnlyColorId}
											readOnly={this.state.readFlag}
										/>
									</InputGroup.Append>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3" >
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.intreviewPalace2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="intreviewPalace2" maxLength="3" readOnly={this.state.readFlag} />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.interviewCustomer2} autoComplete="off"
										onChange={this.valueChange} size="sm" maxLength="3" name="interviewCustomer2" readOnly={this.state.readFlag} />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">希望単価</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.hopeLowestPrice} autoComplete="off" name="hopeLowestPrice"
										style={this.state.style} onChange={this.valueChangeNUmberOnly.bind(this)} size="sm" maxLength="3" readOnly={this.state.readFlag} />
									<font style={{ marginLeft: "10px", marginRight: "10px" }}>～</font>
									<FormControl value={this.state.hopeHighestPrice} autoComplete="off" name="hopeHighestPrice"
										style={this.state.style} onChange={this.valueChangeNUmberOnly.bind(this)} size="sm" maxLength="3" readOnly={this.state.readFlag} />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">優先度</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.salesPriorityStatus} autoComplete="off" name="salesPriorityStatus"
										onChange={this.valueChange} size="sm" maxLength="3" readOnly={this.state.readFlag} />
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.remark} autoComplete="off" name="remark"
										onChange={this.valueChange} size="sm" maxLength="50" readOnly={this.state.readFlag} />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<div>
						{buttonDiv}
					</div>

					<Row>
						{/* 	var total=this.state.salesSituationLists.length;
					var decided = 0;
					if (total!===0) {
						this.state.salesSituationLists.map((item, index) => (
								if(item.salesProgressCode===1){
									decided=decided+1
								} 
						))
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>合計：人</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>確定：0人</font>
						</Col>
					}else{
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>合計：0人</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>確定：0人</font>
						</Col>

					} */}
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>合計：1人</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>確定：0人</font>
						</Col>
						<Col sm={5}></Col>
						<Col sm={5}>
							<div style={{ "float": "right" }}>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >お客様送信</Button>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >個人情報</Button>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >現場情報</Button>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >履歴書1</Button>
								<Button size="sm" variant="info" name="clickButton" >履歴書2</Button>
							</div>
						</Col>
					</Row>
				</Form>
				<div >
					<BootstrapTable
						className={"bg-white text-dark"}
						data={this.state.salesSituationLists}
						pagination
						selectRow={selectRow}
						cellEdit={cellEdit}
						trClassName={this.rowClassNameFormat}>
						<TableHeaderColumn width='8%' dataField='any' dataFormat={this.indexN} dataAlign='center' autoValue dataSort={true} caretRender={publicUtils.getCaret} >番号</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='employeeNo' dataFormat={this.showPriority} editable={false} isKey>社員番号</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='employeeName' editable={false}>氏名</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='siteRoleCode' editable={false}>役割</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='developLanguage' editable={false}>開発言語</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='nearestStation' editable={false}>寄り駅</TableHeaderColumn>
						<TableHeaderColumn width='5%' dataField='unitPrice' editable={false}>単価</TableHeaderColumn>
						<TableHeaderColumn width='10%' dataField='salesProgressCode' dataFormat={this.formatType.bind(this)} editable={{ type: 'select', options: { values: this.state.salesProgressCodes } }} >ステータス</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='customer' dataFormat={this.formatCustome} editable={this.state.editFlag}>確定客様</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='price' >確定単価</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='salesStaff' >営業担当</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewDate1' hidden={true}>面接1日付</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewLocation1' hidden={true}>面接1場所</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewCustomer1' hidden={true}>面接1客様</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewDate2' hidden={true}> 面接2日付</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewLocation2' hidden={true}>面接2場所</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewCustomer2' hidden={true}>面接2客様</TableHeaderColumn>
						<TableHeaderColumn dataField='hopeLowestPrice' hidden={true}>希望単価min</TableHeaderColumn>
						<TableHeaderColumn dataField='hopeHighestPrice' hidden={true}>希望単価max</TableHeaderColumn>
						<TableHeaderColumn dataField='remark' hidden={true}>備考</TableHeaderColumn>
						<TableHeaderColumn dataField='salesPriorityStatus' hidden={true}>営業担当</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		);
	}
}
export default manageSituation;
