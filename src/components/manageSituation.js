/* 営業確認 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"
import * as publicUtils from './utils/publicUtils.js';
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEnvelope, faIdCard, faBuilding, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
axios.defaults.withCredentials=true;

class manageSituation extends React.Component {
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
		let sysYearMonth = new Date();
		let searchYearMonth = sysYearMonth.getFullYear() + (sysYearMonth.getMonth() + 1 < 10 ? '0' + (sysYearMonth.getMonth() + 2) : (sysYearMonth.getMonth() + 2));
		this.getSalesSituation(searchYearMonth);
		this.getDropDowns();
	}

	// レコードを取る
	getSalesSituation = (searchYearMonth) => {
		axios.post("http://127.0.0.1:8080/salesSituation/getSalesSituation", { salesYearAndMonth: searchYearMonth })
			.then(result => {
				if (result.data != null) {
					console.log(result.data);
					var totalPersons = result.data.length;
					var decidedPersons = 0;
					if (totalPersons !== 0) {
						for (var i = 0; i < result.data.length; i++) {
							if (result.data[i].salesProgressCode === '3') {
								decidedPersons = decidedPersons + 1;
							}
						}
					}

					this.setState({
						salesSituationLists: result.data,
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
						salesPriorityStatus: '',
						style: {
							"color": ""
						},
						readFlag: true,
						updateBtnflag: false,
						totalPersons: totalPersons,// 合計人数
						decidedPersons: decidedPersons,// 確定人数
					});
				} else {
					alert("FAIL");
				}
			})
			.catch(function (error) {
				alert("ERR");
			});
	}

	getDropDowns = () => {
		var methodArray = ["getSalesPriorityStatus", "getCustomer", "getStation"]
		var data = publicUtils.getPublicDropDown(methodArray);
		data[1].shift();
		data[1].unshift({ value: '', label: '選択ください' })
		this.setState(
			{
				salesPriorityStatuss: data[0],//　営業優先度 
				customers: data[1],//　お客様
				getstations: data[2],//　 場所 
			}
		);
		// レコードdropdown用
		var methodArrayTleOnly = ["getSalesStatus", "getSalesPerson", "getCustomer"]
		var dataTleOnly = publicUtils.getPublicDropDownRtBtSpTleOnly(methodArrayTleOnly);
		dataTleOnly[2].shift();
		dataTleOnly[2].unshift({ value: '', text: '選択ください' })
		this.setState(
			{
				salesProgressCodes: dataTleOnly[0],//　営業状態
				salesPersons: dataTleOnly[1],//　 営業担当 
				allCustomer: dataTleOnly[2],//　お客様
			}
		);
	};

	// レコードのステータス
	formatType(cell) {
		var statuss = this.state.salesProgressCodes;
		for (var i in statuss) {
			if (cell === statuss[i].value) {
				return statuss[i].text;
			}
		}
	}

	// レコードおきゃく表示
	formatCustome(cell,row) {
		if(row.salesProgressCode === '3' || row.salesProgressCode === '5'){
					var allCustomers = this.state.allCustomer;
		for (var i in allCustomers) {
			if (cell === allCustomers[i].value) {
				return allCustomers[i].text;
			}
		}
		}else{
			return '';
		}

	}

	// レコードおきゃく表示
	formatStaff(cell) {
		var salesPersons = this.state.salesPersons;
		for (var i in salesPersons) {
			if (cell === salesPersons[i].value) {
				return salesPersons[i].text;
			}
		}
	}

	// table編集保存
	afterSaveCell = (row) => {
		if (row.salesProgressCode === '3' || row.salesProgressCode === '5') {
			if(row.customer ==='' || row.customer ===undefined){
				row.customer = '';
			}
			this.setState({
				customerNo: row.customer,
				unitPrice: row.price
			})
			// 
			if(row.customer !=='' && row.price!=='' && row.customer !==undefined && row.price!==undefined){
				alert(row.customer);
				alert(row.price);
				row.customerNo=row.customer;
				row.updateUser=sessionStorage.getItem('employeeName');
				row.unitPrice=row.price;
				row.salesYearAndMonth=this.state.salesYearAndMonth;
				axios.post("http://127.0.0.1:8080/salesSituation/updateEmployeeSiteInfo", row)
					.then(result => {
						if (result.data != null) {
							this.getSalesSituation(this.state.salesYearAndMonth)
						} else {
							alert("FAIL");
						}
					})
					.catch(function (error) {
						alert("ERR");
					});
			}
		}else{
			row.customer = 'noedit';
		}

	};

	// 行番号
	indexN(cell, row, enumObject, index) {
		return (<div>{index + 1}</div>);
	}

	// 優先度表示
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
				/* alert(this.state.interviewDate1);
				alert(this.state.interviewDate1Show);*/
				alert(this.state.salesYearAndMonth); 
				axios.post("http://127.0.0.1:8080/salesSituation/updateSalesSituation", this.state)
					.then(result => {
						if (result.data != null) {
							this.getSalesSituation(this.state.salesYearAndMonth)
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
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

	// numbre only
	valueChangeNUmberOnly = event => {
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
		});
		let searchYearMonth = date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
		this.getSalesSituation(searchYearMonth)
	}

	// setinterviewDate1
	setinterviewDate1 = (date) => {
		this.setState({
			interviewDate1Show: date,
			interviewDate1: publicUtils.timeToStr(date)
		});
	}

	// setinterviewDate2
	setinterviewDate2 = (date) => {
		this.setState({
			interviewDate2Show: date,
			interviewDate2: publicUtils.timeToStr(date)
		});
	}

	// レコードselect事件
	handleRowSelect = (row, isSelected, e) => {
		console.log(e);
		if (isSelected) {
			this.setState({
				employeeNo: row.employeeNo === null ? '' : row.employeeNo,
				interviewDate1: row.interviewDate1 === null ? '' : row.interviewDate1,
				interviewDate1Show: row.interviewDate1 === null ? '' : new Date(publicUtils.strToTime(row.interviewDate1)).getTime(),
				interviewDate2: row.interviewDate2 === null ? '' : row.interviewDate2,
				interviewDate2Show: row.interviewDate2 === null ? '' : new Date(publicUtils.strToTime(row.interviewDate2)).getTime(),
				stationCode1: row.stationCode1 === null ? '' : row.stationCode1,
				stationCode2: row.stationCode2 === null ? '' : row.stationCode2,
				interviewCustomer1: row.interviewCustomer1 === null ? '' : row.interviewCustomer1,
				interviewCustomer2: row.interviewCustomer2 === null ? '' : row.interviewCustomer2,
				hopeLowestPrice: row.hopeLowestPrice === null ? '' : row.hopeLowestPrice,
				hopeHighestPrice: row.hopeHighestPrice === null ? '' : row.hopeHighestPrice,
				salesPriorityStatus: row.salesPriorityStatus === null ? '' : row.salesPriorityStatus,
				salesProgressCode: row.salesProgressCode === null ? '' : row.salesProgressCode,
				remark: row.remark === null ? '' : row.remark,
				editFlag: row.salesProgressCode === '3' || row.salesProgressCode === '5' ? { type: 'select', readOnly: false, options: { values: this.state.allCustomer } } : false,
				priceEditFlag: row.salesProgressCode === '3' || row.salesProgressCode === '5' ? true : false,// 確定単価編集flag
				updateBtnflag: isSelected,
				salesStaff: row.salesStaff === null ? '' : row.salesStaff,
				readFlag: row.employeeNo === this.state.employeeNo && !this.state.readFlag ? false : true,
				linkDisableFlag: false,
				admissionStartDate: row.admissionStartDate === null ? '' : row.admissionStartDate,
				customerNo: row.customer === null ? '' : row.customer,
				unitPrice:row.price === null ? '' : row.price,
				resumeInfo1:row.resumeInfo1 === null ? '' : row.resumeInfo1,	
				resumeInfo2:row.resumeInfo2 === null ? '' : row.resumeInfo2,

			});
		} else {
			this.setState({
				employeeNo: '',
				interviewDate1: '',
				interviewDate1Show: '',
				interviewDate2: '',
				interviewDate2Show: '',
				stationCode1: '',
				stationCode2: '',
				interviewCustomer1: '',
				interviewCustomer2: '',
				hopeLowestPrice: '',
				hopeHighestPrice: '',
				salesPriorityStatus: '',
				salesProgressCode: '',
				remark: '',
				editFlag: row.salesProgressCode === '3' ? { type: 'select', readOnly: false, options: { values: this.state.allCustomer } } : false,
				updateBtnflag: isSelected,
				salesStaff: '',
				readFlag: true,
				linkDisableFlag: true,
			});
		}
	}

	renderShowsTotal = (start, to, total) => {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

/* 	handleDownload1 = (resumeInfo) => {
		publicUtils.handleDownload(resumeInfo);
	} */
	// react download Excel
/* 	handleDownload = (resumeInfo) => {
		var resumeInfos= new Array();
		console.log(resumeInfo);
		resumeInfos=resumeInfo.split("/"); 
		console.log(resumeInfos);
		axios({
			method: "POST", //请求方式
			url: "http://127.0.0.1:8080/download", //下载地址
			data: { name: resumeInfos[6] }, //请求内容
			responseType: 'arraybuffer'
		})
			.then((response) => {
				console.log(response); if (response.data.byteLength === 0) {
					alert('no resume');
				} else {
					let blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
					let downloadElement = document.createElement('a');
					let href = window.URL.createObjectURL(blob); // 创建下载的链接
					downloadElement.href = href;
					downloadElement.download = resumeInfos[6]; // 下载后文件名
					document.body.appendChild(downloadElement);
					downloadElement.click(); // 点击下载
					document.body.removeChild(downloadElement); // 下载完成移除元素
					window.URL.revokeObjectURL(href); // 释放掉blob对象
				}
			}).catch((error) => {
				alert('文件下载失败', error);
			});

	} */

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
											autoComplete="off"
											locale="ja"
											showMonthYearPicker
											showFullMonthYearPicker
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
											autoComplete="off"
											locale="ja"
											showTimeSelect
											className="form-control form-control-sm"
											dateFormat="MM/dd HH:mm"
											minDate={new Date()}
											id={this.state.readFlag ? 'datePickerReadonly' : 'datePicker2'}
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
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="stationCode1" value={this.state.stationCode1}
										autoComplete="off" disabled={this.state.readFlag}>
										{this.state.getstations.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="interviewCustomer1" value={this.state.interviewCustomer1}
										autoComplete="off" disabled={this.state.readFlag}>
										{this.state.customers.map(date =>
											<option key={date.value} value={date.value}>
												{date.label}
											</option>
										)}
									</Form.Control>
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
											autoComplete="off"
											locale="ja"
											showTimeSelect
											className="form-control form-control-sm"
											dateFormat="MM/dd HH:mm"
											minDate={new Date()}
											id={this.state.readFlag ? 'datePickerReadonly' : 'datePicker2'}
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
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="stationCode2" value={this.state.stationCode2}
										autoComplete="off" disabled={this.state.readFlag}>
										{this.state.getstations.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="interviewCustomer2" value={this.state.interviewCustomer2}
										autoComplete="off" disabled={this.state.readFlag}>
										{this.state.customers.map(date =>
											<option key={date.value} value={date.value}>
												{date.label}
											</option>
										)}
									</Form.Control>
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
									<InputGroup.Append>
										<InputGroup.Text id="basic-addon1">万円</InputGroup.Text>
									</InputGroup.Append>
									<font style={{ marginLeft: "10px", marginRight: "10px", marginTop: "5px" }}>～</font>
									<FormControl value={this.state.hopeHighestPrice} autoComplete="off" name="hopeHighestPrice"
										style={this.state.style} onChange={this.valueChangeNUmberOnly.bind(this)} size="sm" maxLength="3" readOnly={this.state.readFlag} />
									<InputGroup.Append>
										<InputGroup.Text id="basic-addon2">万円</InputGroup.Text>
									</InputGroup.Append>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">優先度</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="salesPriorityStatus" value={this.state.salesPriorityStatus}
										autoComplete="off" disabled={this.state.readFlag}>
										{this.state.salesPriorityStatuss.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
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
						<div style={{ "textAlign": "center" }}><Button size="sm" variant="info" onClick={this.changeState}>
							<FontAwesomeIcon icon={faSave} /> {!this.state.readFlag && this.state.updateBtnflag ? "更新" : "解除"}</Button></div>
					</div>

					<Row>
						<Col sm={1}>
							{/* <InputGroup size="sm" >
								<InputGroup.Prepend style={{ height: '31px' }} >
									<InputGroup.Checkbox />
								</InputGroup.Prepend>
								<InputGroup.Append>
									<InputGroup.Text >選択</InputGroup.Text>
								</InputGroup.Append>
							</InputGroup> */}
							<div >
								<span style={{ whiteSpace: 'nowrap' }}> 選択 <Form.Check inline type="checkbox" /></span>
							</div>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>合計：{this.state.totalPersons}人</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>確定：{this.state.decidedPersons}人</font>
						</Col>
						<Col sm={4}></Col>
						<Col sm={5}>
							<div style={{ "float": "right" }}>
								<Link to={{ pathname: '/subMenu/employee', state: { actionType: 'detail', id: this.state.employeeNo } }}>
									<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" ><FontAwesomeIcon icon={faEnvelope} />お客様送信</Button></Link>
								<Link to={{ pathname: '/subMenu/employee', state: { actionType: 'detail', id: this.state.employeeNo } }}>
									<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" disabled={this.state.linkDisableFlag}><FontAwesomeIcon icon={faIdCard} />個人情報</Button></Link>
								<Link to={{ pathname: '/subMenu/siteSearch', state: { id: this.state.employeeNo } }}>
									<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" disabled={this.state.linkDisableFlag}><FontAwesomeIcon icon={faBuilding} />現場情報</Button></Link>
								<Button onClick={publicUtils.handleDownload.bind(this,this.state.resumeInfo1)} style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" disabled={this.state.linkDisableFlag}><FontAwesomeIcon icon={faDownload} />履歴書1</Button>
								<Link to={{ pathname: '/subMenu/employee', state: { actionType: 'detail', id: this.state.employeeNo } }}>
									<Button size="sm" variant="info" name="clickButton" disabled={this.state.linkDisableFlag}><FontAwesomeIcon icon={faDownload} />履歴書2</Button></Link>
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
						<TableHeaderColumn width='8%' dataField='employeeNo' dataFormat={this.showPriority} editable={false} isKey>社員番号</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='employeeName' editable={false}>氏名</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='siteRoleCode' editable={false}>役割</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='developLanguage' editable={false}>開発言語</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='nearestStation' editable={false}>寄り駅</TableHeaderColumn>
						<TableHeaderColumn width='5%' dataField='unitPrice' editable={false}>単価</TableHeaderColumn>
						<TableHeaderColumn width='10%' dataField='salesProgressCode' dataFormat={this.formatType.bind(this)} editable={{ type: 'select', options: { values: this.state.salesProgressCodes } }} >ステータス</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='customer' dataFormat={this.formatCustome.bind(this)} editable={this.state.editFlag}>確定客様</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='price' editable={this.state.priceEditFlag}>確定単価</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='salesStaff' dataFormat={this.formatStaff.bind(this)} editable={{ type: 'select', options: { values: this.state.salesPersons } }}>営業担当</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewDate1' hidden={true}>面接1日付</TableHeaderColumn>
						<TableHeaderColumn dataField='stationCode1' hidden={true}>面接1場所</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewCustomer1' hidden={true}>面接1客様</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewDate2' hidden={true}> 面接2日付</TableHeaderColumn>
						<TableHeaderColumn dataField='stationCode2' hidden={true}>面接2場所</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewCustomer2' hidden={true}>面接2客様</TableHeaderColumn>
						<TableHeaderColumn dataField='hopeLowestPrice' hidden={true}>希望単価min</TableHeaderColumn>
						<TableHeaderColumn dataField='hopeHighestPrice' hidden={true}>希望単価max</TableHeaderColumn>
						<TableHeaderColumn dataField='remark' hidden={true}>備考</TableHeaderColumn>
						<TableHeaderColumn dataField='salesPriorityStatus' hidden={true}>優先度</TableHeaderColumn>
						<TableHeaderColumn dataField='admissionStartDate' hidden={true}>開始時間</TableHeaderColumn>
						<TableHeaderColumn dataField='resumeInfo1' hidden={true}>履歴書1</TableHeaderColumn>
						<TableHeaderColumn dataField='resumeInfo2' hidden={true}>履歴書2</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		);
	}
}
export default manageSituation;
