/* 
社員を検索
 */
import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch, faEdit, faTrash, faDownload, faList } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import { Link } from "react-router-dom";
import * as utils from './utils/publicUtils.js';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import Autocomplete from '@material-ui/lab/Autocomplete';
import store from './redux/store';
axios.defaults.withCredentials = true;
registerLocale("ja", ja);

class employeeSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
		this.valueChange = this.valueChange.bind(this);
		this.ageValueChange = this.ageValueChange.bind(this);
		this.searchEmployee = this.searchEmployee.bind(this);
	};
	
	// ageValueChange
	ageValueChange = event => {
		if(event.target.value > 0){
			this.setState({
				[event.target.name]: event.target.value
			})
		}
	}
	
	// onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	// reset
	resetBook = () => {
		this.setState(() => this.resetStates);
	};

	// 初期化データ
	initialState = {
		employeeList: [], resumeInfo1: '',resumeName1: '', resumeInfo2: '', resumeName2: '', residentCardInfo: '',passportInfo: '',
		genderStatuss: store.getState().dropDown[0],
		intoCompanyCodes: store.getState().dropDown[1],
		employeeFormCodes: store.getState().dropDown[2],
		siteMaster: store.getState().dropDown[3],
		employeeStatuss: store.getState().dropDown[4],
		japaneaseLevelCodes: store.getState().dropDown[5],
		residenceCodes: store.getState().dropDown[6],
		nationalityCodes: store.getState().dropDown[7],
		developLanguageMaster: store.getState().dropDown[8].slice(1),
		employeeInfo: store.getState().dropDown[9].slice(1),
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		customerMaster: store.getState().dropDown[15].slice(1),
		socialInsuranceStatus: store.getState().dropDown[68],
		searchFlag: false,
		ageFrom: '', ageTo: '',
		authorityCode: '',
	};
	// リセット reset
	resetStates = {
		employeeName: '',
		employeeFormCode: '', employeeStatus: '', genderStatus: '',
		ageFrom: '', ageTo: '', residenceCode: '', nationalityCode: '', customerNo: '',
		intoCompanyCode: '', japaneseLevelCode: '', siteRoleCode: '', intoCompanyYearAndMonthFrom: '', intoCompanyYearAndMonthTo: '',
		kadou: '', developLanguage1: '', developLanguage2: '', socialInsurance: ''
	};

	// 初期化メソッド
	componentDidMount() {
		axios.post(this.state.serverIP + "sendLettersConfirm/getLoginUserInfo")
		.then(result => {
			this.setState({
				authorityCode: result.data[0].authorityCode,
			})
		})
		.catch(function(error) {
			alert(error);
		});		
		this.clickButtonDisabled();
		if (this.props.location.state !== undefined) {
            var sendValue = this.props.location.state.sendValue;
            $("#employeeStatus").val(sendValue.employeeStatus);
            $("#genderStatus").val(sendValue.genderStatus);
            $("#customerNo").val(sendValue.customerNo);
            $("#employeeFormCode").val(sendValue.employeeFormCode);
            $("#employeeName").val(sendValue.employeeName);
            $("#ageFrom").val(sendValue.ageFromValue);
            $("#ageTo").val(sendValue.ageToValue);
            $("#intoCompanyCode").val(sendValue.intoCompanyCode);
            $("#developLanguage1").val(sendValue.developLanguage1);
            $("#developLanguage2").val(sendValue.developLanguage2);
            $("#residenceCode").val(sendValue.residenceCode);
            $("#japaneseLevelCode").val(sendValue.japaneseLevelCode);
            $("#nationalityCode").val(sendValue.nationalityCode);
            $("#siteRoleCode").val(sendValue.siteRoleCode);
            $("#kadou").val(sendValue.kadou);
            $("#socialInsurance").val(sendValue.socialInsurance);
            this.setState({
            	employeeStatus: sendValue.employeeStatus,
            	genderStatus: sendValue.genderStatus,
            	customerNo: sendValue.customerNo,
            	employeeFormCode: sendValue.employeeFormCode,
            	employeeName: sendValue.employeeName,
            	ageFrom: sendValue.ageFromValue,
            	ageTo: sendValue.ageToValue,
            	intoCompanyCode: sendValue.intoCompanyCode,
            	developLanguage1: sendValue.developLanguage1,
            	developLanguage2: sendValue.developLanguage2,
            	residenceCode: sendValue.residenceCode,
            	japaneseLevelCode: sendValue.japaneseLevelCode,
            	nationalityCode: sendValue.nationalityCode,
            	siteRoleCode: sendValue.siteRoleCode,
            	kadou: sendValue.kadou,
            	socialInsurance: sendValue.socialInsurance,
            	authorityCode: sendValue.authorityCode,
            	intoCompanyYearAndMonthFrom: utils.converToLocalTime(sendValue.intoCompanyYearAndMonthFrom, false),
            	intoCompanyYearAndMonthTo: utils.converToLocalTime(sendValue.intoCompanyYearAndMonthTo, false),
            }, () => {
                    this.searchEmployee();
            })
        }
	}

	// 初期化の時、disabledをセットします
	clickButtonDisabled = () => {
		$('button[name="clickButton"]').attr('disabled', true);
		/*
		 * this.refs.siteSearchTable.handleSort('asc', 'rowNo');
		 * this.refs.siteSearchTable.handleSort('asc', 'employeeFristName');
		 * this.refs.siteSearchTable.handleSort('asc', 'furigana');
		 * this.refs.siteSearchTable.handleSort('asc', 'alphabetName');
		 * this.refs.siteSearchTable.handleSort('asc', 'birthday');
		 * this.refs.siteSearchTable.handleSort('asc', 'phoneNo');
		 * this.refs.siteSearchTable.handleSort('asc', 'stationName');
		 * this.refs.siteSearchTable.handleSort('asc',
		 * 'intoCompanyYearAndMonth');
		 * this.refs.siteSearchTable.handleSort('asc', 'admissionTime');
		 * this.refs.siteSearchTable.handleSort('asc', 'stayPeriod');
		 * this.refs.siteSearchTable.handleSort('asc', 'employeeNo');
		 */
	};

	// 検索s
	searchEmployee = () => {
		var age = parseInt(this.state.ageTo) + 1;
		const emp = {
			employeeName: this.state.employeeName === "" ? undefined : this.state.employeeName,
			employeeFormCode: this.state.employeeFormCode === "" ? undefined : this.state.employeeFormCode,
			employeeStatus: this.state.employeeStatus === "" ? undefined : this.state.employeeStatus,
			genderStatus: this.state.genderStatus === "" ? undefined : this.state.genderStatus,
			ageFrom: this.state.ageFrom === "" || this.state.ageFrom === undefined  ? undefined : publicUtils.birthday_age(this.state.ageFrom),
			ageTo: this.state.ageTo === "" || this.state.ageTo === undefined ? undefined : publicUtils.birthday_age(age),
			residenceCode: this.state.residenceCode === "" ? undefined : this.state.residenceCode,
			nationalityCode: this.state.nationalityCode === "" ? undefined : this.state.nationalityCode,
			customer: this.props.location.state !== undefined?this.state.customerNo:publicUtils.labelGetValue($("#customerNo").val(), this.state.customerMaster),
			intoCompanyCode: this.state.intoCompanyCode === "" ? undefined : this.state.intoCompanyCode,
			japaneseLevelCode: this.state.japaneseLevelCode === "" ? undefined : this.state.japaneseLevelCode,
			siteRoleCode: this.state.siteRoleCode === "" ? undefined : this.state.siteRoleCode,
			developLanguage1: this.props.location.state !== undefined?this.state.developLanguage1:publicUtils.labelGetValue($("#developLanguage1").val(), this.state.developLanguageMaster),
			developLanguage2: this.props.location.state !== undefined?this.state.developLanguage2:publicUtils.labelGetValue($("#developLanguage2").val(), this.state.developLanguageMaster),
			intoCompanyYearAndMonthFrom: this.state.intoCompanyYearAndMonthFrom === "" || this.state.intoCompanyYearAndMonthFrom === null || this.state.intoCompanyYearAndMonthFrom === undefined ? undefined : publicUtils.formateDate(this.state.intoCompanyYearAndMonthFrom, false),
			intoCompanyYearAndMonthTo: this.state.intoCompanyYearAndMonthTo === "" || this.state.intoCompanyYearAndMonthTo === null || this.state.intoCompanyYearAndMonthTo === undefined ? undefined : publicUtils.formateDate(this.state.intoCompanyYearAndMonthTo, false),
			kadou: this.state.kadou === "" ? undefined : this.state.kadou,
			socialInsuranceStatus: this.state.socialInsurance === "" ? undefined : this.state.socialInsurance,
			authorityCode: this.state.authorityCode,
		};
		axios.post(this.state.serverIP + "employee/getEmployeeInfo", emp)
			.then(response => {
				if (response.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
				} 	else if (response.data.isNullMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.isNullMessage,employeeList: response.data.data });
				} 
				else {
					this.setState({ employeeList: response.data.data, "errorsMessageShow": false })
				}
				this.refs.siteSearchTable.setState({
					selectedRowKeys: [],
				})
				this.setState({
					searchFlag: true,
					rowSelectEmployeeNo: ''
				})
					$('#resumeInfo1').prop('disabled', true);
					$('#resumeInfo2').prop('disabled', true);
					$('#residentCardInfo').prop('disabled', true);
					$('#passportInfo').prop('disabled', true);
					$('#delete').attr('disabled', true);
					$('#update').attr('disabled', true);
					$('#detail').attr('disabled', true);
					$('#wagesInfo').attr('disabled', true);
					$('#siteInfo').attr('disabled', true);
			}
			);
	}
	
	state = {
		intoCompanyYearAndMonthFrom: new Date(),
		intoCompanyYearAndMonthTo: new Date()
	};

	// 入社年月form
	inactiveintoCompanyYearAndMonthFrom = (date) => {
		this.setState(
			{
				intoCompanyYearAndMonthFrom: date
			}
		);
	};
	// 入社年月To
	inactiveintoCompanyYearAndMonthTo = (date) => {
		this.setState(
			{
				intoCompanyYearAndMonthTo: date
			}
		);
	};
	employeeDelete = () => {
		// 将id进行数据类型转换，强制转换为数字类型，方便下面进行判断。
		var a = window.confirm("削除していただきますか？");
		if (a) {
			$("#deleteBtn").click();
		}
	}
	// 隠した削除ボタン
	createCustomDeleteButton = (onClick) => {
		return (
			<Button variant="info" id="deleteBtn" hidden onClick={onClick} >删除</Button>
		);
	}
	// 隠した削除ボタンの実装
	onDeleteRow = (rows) => {
		const emp = {
			employeeNo: this.state.rowSelectEmployeeNo,
			resumeInfo1: this.state.resumeInfo1,
			resumeInfo2: this.state.resumeInfo2,
			residentCardInfo: this.state.residentCardInfo,
			passportInfo: this.state.passportInfo,
		};
		const tableSize = this.state.employeeList.length;
		axios.post(this.state.serverIP + "employee/deleteEmployeeInfo", emp)
			.then(result => {
				if (result.data) {
					if(tableSize>1){
						this.searchEmployee();
						// 削除の後で、rowSelectEmployeeNoの値に空白をセットする
						this.setState(
							{
								rowSelectEmployeeNo: '',
							}
						);
						this.setState({ "myToastShow": true });
						setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					}
					else{
						// 削除の後で、rowSelectEmployeeNoの値に空白をセットする
						this.setState(
							{
								rowSelectEmployeeNo: '',
								employeeList: []
							}
						);
						this.setState({ "myToastShow": true });
						setTimeout(() => this.setState({ "myToastShow": false }), 300);
						window.location.reload();// 刷新当前页面.
					}
				} else {
					this.setState({ "myToastShow": false });
				}
			})
			.catch(function (error) {
				alert("删除错误，请检查程序");
			});
	}
	// 削除前のデフォルトお知らせの削除
	customConfirm(next, dropRowKeys) {
		const dropRowKeysStr = dropRowKeys.join(',');
		next();
	}

	// 行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
/* alert(this.state.employeeList.length); */
			this.setState(
				{
					rowSelectEmployeeNo: row.employeeNo,
					residentCardInfo: row.residentCardInfo,
					passportInfo:row.passportInfo,
					resumeInfo1: row.resumeInfo1,
					resumeName1: row.resumeName1,
					resumeInfo2: row.resumeInfo2,
					resumeName2: row.resumeName2,
				}
			);
			$('#resumeInfo1').prop('disabled', false);
			$('#resumeInfo2').prop('disabled', false);
			$('#residentCardInfo').prop('disabled', false);
			$('#passportInfo').prop('disabled', false);
			$('#delete').attr('disabled', false);
			$('#update').attr('disabled', false);
			$('#detail').attr('disabled', false);
			$('#wagesInfo').attr('disabled', false);
			$('#siteInfo').attr('disabled', false);
		} else {
			this.setState(
				{
					rowSelectEmployeeNo: ''
				}
			);
			$('#resumeInfo1').prop('disabled', true);
			$('#resumeInfo2').prop('disabled', true);
			$('#residentCardInfo').prop('disabled', true);
			$('#passportInfo').prop('disabled', true);
			$('#delete').attr('disabled', true);
			$('#update').attr('disabled', true);
			$('#detail').attr('disabled', true);
			$('#wagesInfo').attr('disabled', true);
			$('#siteInfo').attr('disabled', true);
		}
	}

	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

	formatBrthday(birthday) {
		let date = birthday;
		birthday = birthday.replace(/[/]/g,"");
		let value = publicUtils.converToLocalTime(birthday, true) === "" ? "" : Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(birthday, true).getTime()) / 31536000000);
		date = publicUtils.converToLocalTime(birthday, true) === "" ? "" : date + "(" + value + ")"
		return date;
	}

	formatStayPeriod(stayPeriod) {
		let value = publicUtils.converToLocalTime(stayPeriod, false) === "" ? "" : publicUtils.getFullYearMonth(new Date(), publicUtils.converToLocalTime(stayPeriod, false));
		return value;
	}
	
	// AUTOSELECT select事件
	handleTag = ({ target }, fieldName) => {
		const { value, id } = target;
		if (value === '') {
			this.setState({
				[id]: '',
			})
		} else {
			if (this.state.employeeInfo.find((v) => (v.name === value)) !== undefined) {
				switch (fieldName) {
					case 'employeeName':
						this.setState({
							employeeName: value,
						})
						break;
				}
			}
		}
	};

	/**
	 * 社員名連想
	 * 
	 * @param {}
	 *            event
	 */
	getEmployeeName = (event, values) => {
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			let employeeName = null;
			if (values !== null) {
				employeeName = values.text;
			}
			this.setState({
				employeeName: employeeName,
			})
		})
	}


	/**
	 * タイプが違う時に、色々な操作をします。
	 */
	employeeStatusChange = event => {
		const value = event.target.value;
		if (value === '1') {
			this.setState({ employeeStatus: '1', intoCompanyYearAndMonthFrom: '', intoCompanyCode: '', employeeFormCode: '', intoCompanyYearAndMonthTo: '' });
		} else if (value === '0') {
			this.setState({ employeeStatus: "0" });
		} else {
			this.setState({ employeeStatus: "" });
		}
	}

	getDevelopLanguage1 = (event, values) => {
		if (values != null) {
			this.setState({
				developLanguage1: values.code,
			})
		} else {
			this.setState({
				developLanguage1: "",
			})
		}
	}
	getDevelopLanguage2 = (event, values) => {
		if (values != null) {
			this.setState({
				developLanguage2: values.code,
			})
		} else {
			this.setState({
				developLanguage2: "",
			})
		}
	}
	
	downloadResume = (resumeInfo, no) => {
		let fileKey = "";
		let downLoadPath = "";
		if(resumeInfo !== null && resumeInfo.split("file/").length > 1){
			fileKey = resumeInfo.split("file/")[1];
			downLoadPath = (resumeInfo.substring(0, resumeInfo.lastIndexOf("_") + 1) + ( no === 1 ? this.state.resumeName1 : this.state.resumeName2 ) + "." + resumeInfo.split(".")[resumeInfo.split(".").length - 1]).replaceAll("/","//");
		}
		axios.post(this.state.serverIP + "s3Controller/downloadFile", {fileKey:fileKey , downLoadPath:downLoadPath})
		.then(result => {
			let path = downLoadPath.replaceAll("//","/");
			if(no === 1){
				publicUtils.resumeDownload(path, this.state.serverIP, this.state.resumeName1);
			}
			else if(no === 2){
				publicUtils.resumeDownload(path, this.state.serverIP, this.state.resumeName2);
			}
		}).catch(function (error) {
			alert("ファイルが存在しません。");
		});
	}

	getCustomerNo = (event, values) => {
		if (values != null) {
			this.setState({
				customerNo: values.code,
			})
		} else {
			this.setState({
				customerNo: "",
			})
		}
	}
	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = {
			employeeName: this.state.employeeName === "" ? undefined : this.state.employeeName,
			employeeFormCode: this.state.employeeFormCode === "" ? undefined : this.state.employeeFormCode,
			employeeStatus: this.state.employeeStatus === "" ? undefined : this.state.employeeStatus,
			genderStatus: this.state.genderStatus === "" ? undefined : this.state.genderStatus,
			ageFromValue: this.state.ageFrom === "" ? undefined :this.state.ageFrom,
			ageFrom: this.state.ageFrom === "" ? undefined : publicUtils.birthday_age(this.state.ageFrom),
			ageToValue: this.state.ageFrom === "" ? undefined :this.state.ageTo,
			ageTo: this.state.ageTo === "" ? undefined : publicUtils.birthday_age(this.state.ageTo),
			residenceCode: this.state.residenceCode === "" ? undefined : this.state.residenceCode,
			nationalityCode: this.state.nationalityCode === "" ? undefined : this.state.nationalityCode,
			customer: publicUtils.labelGetValue($("#customerNo").val(), this.state.customerMaster),
			customerNo: this.state.customerMaster === "" ? undefined : this.state.customerNo,
			intoCompanyCode: this.state.intoCompanyCode === "" ? undefined : this.state.intoCompanyCode,
			japaneseLevelCode: this.state.japaneseLevelCode === "" ? undefined : this.state.japaneseLevelCode,
			siteRoleCode: this.state.siteRoleCode === "" ? undefined : this.state.siteRoleCode,
			developLanguage1: publicUtils.labelGetValue($("#developLanguage1").val(), this.state.developLanguageMaster),
			developLanguage2: publicUtils.labelGetValue($("#developLanguage2").val(), this.state.developLanguageMaster),
			intoCompanyYearAndMonthFrom: this.state.intoCompanyYearAndMonthFrom === "" || this.state.intoCompanyYearAndMonthFrom === undefined ? undefined : publicUtils.formateDate(this.state.intoCompanyYearAndMonthFrom, false),
			intoCompanyYearAndMonthTo: this.state.intoCompanyYearAndMonthTo === "" || this.state.intoCompanyYearAndMonthTo === undefined ? undefined : publicUtils.formateDate(this.state.intoCompanyYearAndMonthTo, false),
			kadou: this.state.kadou === "" ? undefined : this.state.kadou,
			authorityCode: this.state.authorityCode,
			socialInsurance: this.state.socialInsurance,
		};
		switch (actionType) {
			case "update":
				path = {
					pathname: '/subMenuManager/employeeUpdateNew',
					state: {
						actionType: 'update',
						id: this.state.rowSelectEmployeeNo,
						backPage: "employeeSearch",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			case "detail":
				path = {
					pathname: '/subMenuManager/employeeDetailNew',
					state: {
						actionType: 'detail',
						id: this.state.rowSelectEmployeeNo,
						backPage: "employeeSearch",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			case "insert":
				path = {
					pathname: '/subMenuManager/employeeInsertNew',
					state: {
						actionType: 'insert',
						backPage: "employeeSearch",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			case "wagesInfo":
				path = {
					pathname: '/subMenuManager/wagesInfo',
					state: {
						employeeNo: this.state.rowSelectEmployeeNo,
						backPage: "employeeSearch",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			case "siteInfo":
				path = {
					pathname: '/subMenuManager/siteInfo',
					state: {
						employeeNo: this.state.rowSelectEmployeeNo,
						backPage: "employeeSearch",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
	}

	render() {
		const { employeeFormCode, genderStatus, employeeStatus, ageFrom, ageTo,
			residenceCode, nationalityCode, customer, japaneseLevelCode, siteRoleCode, kadou, intoCompanyCode,socialInsurance,
			employeeList, errorsMessageValue } = this.state;
		// テーブルの行の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			clickToExpand: true,
			onSelect: this.handleRowSelect,
		};
		// テーブルの定義
		const options = {
			page: 1,
			sizePerPage: 8,
			pageStartIndex: 1,
			paginationSize: 3,
			prePage: '<',
			nextPage: '>',
			firstPage: '<<',
			lastPage: '>>',
			paginationShowsTotal: this.renderShowsTotal,
			hideSizePerPage: true,
			expandRowBgColor: 'rgb(165, 165, 165)',
			deleteBtn: this.createCustomDeleteButton,
			onDeleteRow: this.onDeleteRow,
			handleConfirmDeleteRow: this.customConfirm,
			sortIndicator: false, // 隐藏初始排序箭头
		};

		return (
			<div >
				<FormControl id="rowSelectEmployeeNo" name="rowSelectEmployeeNo" hidden />
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={"削除成功！"} type={"danger"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<Row inline="true">
					<Col className="text-center">
						<h2>社員情報検索</h2>
					</Col>
				</Row>
				<br />
				<Form >
					<div >
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.employeeStatusChange.bind(this)} name="employeeStatus" value={employeeStatus} autoComplete="off">
											{this.state.employeeStatuss.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={5}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="fiveKanji">社員名(BP)</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="employeeName"
											name="employeeName"
											value={this.state.employeeInfo.find(v => v.text === this.state.employeeName) || {}}
											options={this.state.employeeInfo}
											getOptionLabel={(option) => option.text ? option.text : ""}
											onSelect={(event) => this.handleTag(event, 'employeeName')}
											onChange={(event, values) => this.getEmployeeName(event, values)}
											renderOption={(option) => {
												return (
													<React.Fragment>
														<p >{option.name}</p>
													</React.Fragment>
												)
											}}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto"
														style={{ width: 235, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }}
													/>
												</div>
											)}
										/>
									</InputGroup>
								</Col>


							</Row>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="genderStatus" value={genderStatus} autoComplete="off">
											{this.state.genderStatuss.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="fiveKanji">年齢</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control type="number" name="ageFrom"
										value={ageFrom}
										autoComplete="off" onChange={this.ageValueChange} size="sm"
										/> ～ <Form.Control type="number" name="ageTo" value={ageTo} autoComplete="off" onChange={this.ageValueChange} size="sm" />

									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">在留資格</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="residenceCode" value={residenceCode} autoComplete="off">
											{this.state.residenceCodes.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">国籍</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" onChange={this.valueChange} size="sm" name="nationalityCode" value={nationalityCode} autoComplete="off">
											{this.state.nationalityCodes.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={3}>
									{/*<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">お客様先</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="customerNo"
											name="customerNo"
											value={this.state.customerMaster.find(v => v.code === this.state.customerNo) || {}}
											onChange={(event, values) => this.getCustomerNo(event, values)}
											options={this.state.customerMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-customer"	/>
												</div>
											)}
										/>

									</InputGroup>*/}
									<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										disabled={employeeStatus === "1" ? true : false}
										name="employeeFormCode" value={employeeFormCode}
										autoComplete="off">
										{this.state.employeeFormCodes.map(data =>
											<option key={data.code} value={data.code}>
												{data.name}
											</option>
										)}
									</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">採用区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" onChange={this.valueChange} size="sm" name="intoCompanyCode" value={intoCompanyCode}
											disabled={employeeStatus === "1" ? true : false}
											autoComplete="off">
											{this.state.intoCompanyCodes.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" onChange={this.valueChange} size="sm" name="japaneseLevelCode" value={japaneseLevelCode} autoComplete="off">
											{this.state.japaneaseLevelCodes.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="siteRoleCode" value={siteRoleCode} autoComplete="off">
											{this.state.siteMaster.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社会保険</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm"
											onChange={this.valueChange}
											name="socialInsurance" value={socialInsurance}
											autoComplete="off">
											{this.state.socialInsuranceStatus.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm" >開発言語</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="developLanguage1"
											name="developLanguage1"
											value={this.state.developLanguageMaster.find(v => v.code === this.state.developLanguage1) || {}}
											onChange={(event, values) => this.getDevelopLanguage1(event, values)}
											options={this.state.developLanguageMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-developLanguage" id="developLanguage1" />
												</div>
											)}
										/>

										<Autocomplete
											id="developLanguage2"
											name="developLanguage2"
											value={this.state.developLanguageMaster.find(v => v.code === this.state.developLanguage2) || {}}
											onChange={(event, values) => this.getDevelopLanguage2(event, values)}
											options={this.state.developLanguageMaster}
											getOptionLabel={(option) => option.name}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input type="text" {...params.inputProps} className="auto form-control Autocompletestyle-developLanguage" id="developLanguage2" />
												</div>
											)}
										/>
									</InputGroup>
								</Col>

								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
											<DatePicker
												disabled={employeeStatus === "1" ? true : false}
												id={employeeStatus === "1" ? "datePickerReadonlyDefault" : "datePicker"}
												selected={this.state.intoCompanyYearAndMonthFrom}
												onChange={this.inactiveintoCompanyYearAndMonthFrom}
												locale="ja"
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												className="form-control form-control-sm"
												autoComplete="off"
											/>～<DatePicker
												selected={this.state.intoCompanyYearAndMonthTo}
												onChange={this.inactiveintoCompanyYearAndMonthTo}
												locale="ja"
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												disabled={employeeStatus === "1" ? true : false}
												id={employeeStatus === "1" ? "datePickerReadonlyDefault" : "datePicker"}
												className="form-control form-control-sm"
												autoComplete="off"
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">稼働　　</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="kadou" value={kadou} autoComplete="off" >
											<option value=""　></option>
											<option value="0">はい</option>
											<option value="1">いいえ</option>
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div style={{ "textAlign": "center" }}>
					<Button size="sm" variant="info" type="submit"  onClick={this.searchEmployee} >
						<FontAwesomeIcon icon={faSearch} /> 検索
                        </Button>{' '}
					<Button size="sm" onClick={this.shuseiTo.bind(this, "insert")} variant="info">
						<FontAwesomeIcon icon={faSave} /> 追加
                            </Button>{' '}
					<Button size="sm" variant="info" type="reset" onClick={this.resetBook}>
						<FontAwesomeIcon icon={faUndo} /> Reset
                        </Button>
				</div>
				<br />
				<div>
					<Row >
						<Col sm={4}>
							<div style={{ "float": "left" }}>
								<Button size="sm" onClick={this.shuseiTo.bind(this, "wagesInfo")} name="clickButton" variant="info" id="wagesInfo">給料情報</Button>{' '}
								<Button size="sm" onClick={this.shuseiTo.bind(this, "siteInfo")} name="clickButton" variant="info" id="siteInfo">現場情報</Button>{' '}
							</div>
						</Col>
						<Col sm={5}>
							<div style={{ "float": "center" }}>
								<Button size="sm" variant="info" name="clickButton" id="resumeInfo1" onClick={this.downloadResume.bind(this,this.state.resumeInfo1,1)} ><FontAwesomeIcon icon={faDownload} /> 履歴書1</Button>{' '}
								<Button size="sm" variant="info" name="clickButton" id="resumeInfo2" onClick={this.downloadResume.bind(this,this.state.resumeInfo2,2)} ><FontAwesomeIcon icon={faDownload} /> 履歴書2</Button>{' '}
								<Button size="sm" variant="info" name="clickButton" id="residentCardInfo" onClick={publicUtils.handleDownload.bind(this, this.state.residentCardInfo, this.state.serverIP)} ><FontAwesomeIcon icon={faDownload} /> 在留カード</Button>{' '}
								<Button size="sm" variant="info" name="clickButton" id="passportInfo" onClick={publicUtils.handleDownload.bind(this, this.state.passportInfo, this.state.serverIP)} ><FontAwesomeIcon icon={faDownload} /> パスポート</Button>{' '}
							</div>
						</Col>
						<Col sm={3}>
							<div style={{ "float": "right" }}>
								<Button size="sm" onClick={this.shuseiTo.bind(this, "detail")} name="clickButton" id="detail" variant="info"><FontAwesomeIcon icon={faList} />詳細</Button>{' '}
								<Button size="sm" onClick={this.shuseiTo.bind(this, "update")} name="clickButton" id="update" variant="info"><FontAwesomeIcon icon={faEdit} />修正</Button>{' '}
								<Button size="sm" variant="info" onClick={this.employeeDelete} name="clickButton" id="delete" variant="info"><FontAwesomeIcon icon={faTrash} /> 削	除</Button>
							</div>
						</Col>
					</Row>
				</div>
				<div >
					<Row >
						<Col sm={12}>
							<BootstrapTable ref="siteSearchTable"
								data={employeeList} pagination={true} options={options} deleteRow selectRow={selectRow} headerStyle={{ background: '#5599FF' }} striped hover condensed >
								<TableHeaderColumn width='6%' tdStyle={{ padding: '.45em' }} dataField='rowNo'dataSort>番号</TableHeaderColumn>
								<TableHeaderColumn width='9%' tdStyle={{ padding: '.45em' }} dataField='employeeNo' isKey dataSort>社員番号</TableHeaderColumn>
								<TableHeaderColumn width='9%' tdStyle={{ padding: '.45em' }} dataField='employeeFristName' dataSort>社員名</TableHeaderColumn>
								<TableHeaderColumn width='12%' tdStyle={{ padding: '.45em' }} dataField='furigana' dataSort>カタカナ</TableHeaderColumn>
								<TableHeaderColumn width='15%' tdStyle={{ padding: '.45em' }} dataField='alphabetName' dataSort>ローマ字</TableHeaderColumn>
								<TableHeaderColumn width='12%' tdStyle={{ padding: '.45em' }} dataField='birthday' dataSort>年齢</TableHeaderColumn>
								<TableHeaderColumn width='12%' tdStyle={{ padding: '.45em' }} dataField='phoneNo' dataSort>電話番号</TableHeaderColumn>
								<TableHeaderColumn width='9%' tdStyle={{ padding: '.45em' }} dataField='stationName' dataSort>寄り駅</TableHeaderColumn>
								<TableHeaderColumn width='9%' tdStyle={{ padding: '.45em' }} dataField='intoCompanyYearAndMonth' dataSort>入社年月</TableHeaderColumn>
								<TableHeaderColumn width='9%' tdStyle={{ padding: '.45em' }} dataField='admissionTime' dataSort>入場年月</TableHeaderColumn>
								<TableHeaderColumn dataField='stayPeriod' hidden={true} /* dataFormat={this.formatStayPeriod.bind(this)} */ dataSort>ビザ期限</TableHeaderColumn>
								<TableHeaderColumn dataField='resumeInfo1' hidden={true}>履歴書1</TableHeaderColumn>
								<TableHeaderColumn dataField='resumeName1' hidden={true}>履歴書名前1</TableHeaderColumn>
								<TableHeaderColumn dataField='resumeInfo2' hidden={true}>履歴書2</TableHeaderColumn>
								<TableHeaderColumn dataField='resumeName2' hidden={true}>履歴書名前2</TableHeaderColumn>
								<TableHeaderColumn dataField='residentCardInfo' hidden={true}>在留カード</TableHeaderColumn>
								<TableHeaderColumn dataField='passportInfo' hidden={true}>パスポート</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</Row>
				</div>
			</div >
		);
	}
}

export default employeeSearch;

