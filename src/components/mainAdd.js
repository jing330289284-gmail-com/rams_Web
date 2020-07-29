import React from 'react';
import { Card, Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import ImageUploader from "react-images-upload";
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, {registerLocale} from "react-datepicker"
import ja from 'date-fns/locale/ja';
import * as dateUtils from './utils/dateUtils.js';
import './style.css';

class mainAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		//this.saveEmployee = this.saveEmployee.bind(this);//登録
		this.onDrop = this.onDrop.bind(this);//ImageUploaderを処理
	}
	//初期化
	initialState = {
		employeeNo: '',//社員番号
		pictures: [],//ImageUploader
		japaneseCalendar:"",//和暦
		genders: [],//性別
		intoCompanys: [],//入社区分
		staffForms: [],//社員形式
	};
	//リセット
	resetBook = () => {
		this.setState(() => this.initialState);
	};

	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
　　　//初期化メソッド
	componentDidMount() {
		this.getGender();//性別区別
		this.getIntoCompany();//入社区分
		this.getStaffForms()//社員形式
	}
　　　/* 性別区別 */
	getGender = () => {
		axios.post("http://127.0.0.1:8080/getGender")
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						genders: [{ code: '', name: '選択ください' }]
							.concat(data.map(ge => {
								return { code: ge.code, name: ge.name }
							}))
					}
				);
			}
			);
	};
　　　/* 入社区分 */
	getIntoCompany = () => {
		axios.post("http://127.0.0.1:8080/getIntoCompany")
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						intoCompanys: [{ code: '', name: '選択ください' }]
							.concat(data.map(ic => {
								return { code: ic.code, name: ic.name }
							}))
					}
				);
			}
			);
	};
	/* 社員形式 */
	getStaffForms = () => {
		axios.post("http://127.0.0.1:8080/getStaffForms")//url,条件
			.then(response => response.data)
			.then((data) => {
				this.setState(
					{
						staffForms: [{ code: '', name: '選択ください' }]
							.concat(data.map(st => {
								return { code: st.code, name: st.name }
							}))
					}
				);
			}
			);
	};	
	//ImageUploaderを処理　開始
	onDrop(picture) {
		this.setState({
			pictures: this.state.pictures.concat(picture),
		});
	}
	//ImageUploaderを処理　終了
   //年月開始
	state = {
		raiseStartDate: new Date(),
	}
	//卒業年月
	inactiveGraduationDate = date=> {
		$("#graduationDate").val(date.getFullYear() + "/" + (date.getMonth() + 1));
	};
	//退職年月
    inactiveRetirementDate = date=> {
		$("#retirementDate").val(date.getFullYear() + "/" + (date.getMonth() + 1));
	};
	//入社年月
	inactiveJoinCompanyOfYear = date=> {
		$("#time").val("0年0月");
		$("#joinCompanyOfYear").val(date.getFullYear() + "/" + (date.getMonth() + 1));
		var today = new Date();
		var year = today.getFullYear() - date.getFullYear();
		var month = today.getMonth() - date.getMonth();
		var day = today.getDate() - date.getDate();
		if (year >= 0) {
			if (year > 0 && month < 0) {
				if (day > 0) {
					$("#time").val((year - 1) + "年" + (month + 12) + "月");
				}
				else {
					$("#time").val((year - 1) + "年" + (month + 11) + "月");
				}
			}
			if (month >= 0) {

				if (day >= 0) {
					$("#time").val(year + "年" + month + "月");
				}
				else {
					if (year == 0 && month == 0) {
						$("#time").val("0年0月");
					}
					else {
						$("#time").val(year + "年" + (month - 1) + "月");
					}
				}
			}
		}
	};

	inactiveComingToJapanOfYearAndMonthr = date=> {
		$("#time2").val("0年0月");
		$("#comingToJapanOfYearAndMonth").val(date.getFullYear() + "/" + (date.getMonth() + 1));
		var today = new Date();
		var year = today.getFullYear() - date.getFullYear();
		var month = today.getMonth() - date.getMonth();
		var day = today.getDate() - date.getDate();
		if (year >= 0) {
			if (year > 0 && month < 0) {
				if (day > 0) {
					$("#time2").val((year - 1) + "年" + (month + 12) + "月");
				}
				else {
					$("#time2").val((year - 1) + "年" + (month + 11) + "月");
				}
			}
			if (month >= 0) {
				if (day >= 0) {
					$("#time2").val(year + "年" + month + "月");
				}
				else {
					if (year == 0 && month == 0) {
						$("#time2").val("0年0月");
					}
					else {
						$("#time2").val(year + "年" + (month - 1) + "月");
					}
				}
			}
		}
	};
	inactivePeriodOfStayr = date=> {
		$("#time3").val("0年0月");
		$("#periodOfStay").val(date.getFullYear() + "/" + (date.getMonth() + 1));
		var today = new Date();
		var year = today.getFullYear() - date.getFullYear();
		var month = today.getMonth() - date.getMonth();
		var day = today.getDate() - date.getDate();
		if (year >= 0) {
			if (year > 0 && month < 0) {
				if (day > 0) {
					$("#time3").val((year - 1) + "年" + (month + 12) + "月");
				}
				else {
					$("#time3").val((year - 1) + "年" + (month + 11) + "月");
				}
			}
			if (month >= 0) {
				if (day >= 0) {
					$("#time3").val(year + "年" + month + "月");
				}
				else {
					if (year == 0 && month == 0) {
						$("#time3").val("0年0月");
					}
					else {
						$("#time3").val(year + "年" + (month - 1) + "月");
					}
				}
			}
		}
	};
	//年齢と和暦
	inactiveAge = date=> {
		$("#time4").val("0歳");
		$("#age").val(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
	    var birthDayTime = date.getTime(); 
        var nowTime = new Date().getTime(); 
		$("#time4").val(Math.ceil((nowTime-birthDayTime)/31536000000)+"歳");
		//http://ap.hutime.org/cal/ 西暦と和暦の変換
		var ival=date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	   　　axios.get("http://ap.hutime.org/cal/?method=conv&ical=101.1&itype=date&ival="+ival+"&ocal=1001.1")
			.then(response => {
				if (response.data != null) {
					 this.setState({
						japaneseCalendar: response.data
					}); 
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});

	};
	//年月終了

	render() {
		const { employeeNo,employeeFristName,employeeLastName,furigana1,furigana2,alphabetOfName,age,japaneseCalendar,
			   genderStatus,intoCompanyCode,emploryeeFormCode,occupationCode,departmentCode,companyMailAddress,
			   graduationUniversity,graduationDate,joinCompanyOfYear,retirementDate,nationalityCode,
			   phone,comingToJapanOfYearAndMonth,authorityCode,japaneaseLeveCode,englishLeveCode,
			   residenceOfCode,developmentLanguageNo1,developmentLanguageNo2,developmentLanguageNo3,
			   residenceCardNoCode,periodOfStay,employmentInsuranceNo,myNumber,subjectOfStudy,certification1,certification2 } = this.state;
		return (
			<div>
				<div style={{ "textAlign": "center" }}>
					<Button size="sm">住所情報</Button>{' '}
					<Button size="sm">口座情報</Button>{' '}
					<Button size="sm">諸費用</Button>{' '}
					<Button size="sm">現場情報</Button>{' '}
					<Button size="sm">協力会社</Button>{' '}
					<Button size="sm">権限・PW設置</Button>
					<div>
						<Form.Label>社員</Form.Label><Form.Check checked inline type="radio" name="employeeType" value="0" />
						<Form.Label>協力</Form.Label><Form.Check inline type="radio" name="employeeType" value="1" />
					</div>
				</div>
               
				<Form onSubmit={this.saveEmployee} onReset={this.resetBook}>
					<Form.Label style={{ "color": "#FFD700" }}>基本情報</Form.Label>
					<Form.Group>
				{/* 		<ImageUploader
							withIcon={false}
							withPreview={true}
							label=""
							buttonText="Upload Images"
							onChange={this.onDrop}
							imgExtension={[".jpg", ".gif", ".png", ".gif", ".svg"]}
							maxFileSize={1048576}
							fileSizeError=" file size is too big"
						/> */}
						
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="社員番号" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" /><font color="red" style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="社員氏" value={employeeFristName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeFristName" />{' '}
									<FormControl  placeholder="社員名" value={employeeLastName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" /><font color="red" style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">カタカナ</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="カタカナ" value={furigana1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana1" />{' '}
									<FormControl  placeholder="カタカナ" value={furigana2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="furigana2" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="ローマ字" value={alphabetOfName} autoComplete="off"
										onChange={this.valueChange} size="sm" name="alphabetOfName" />
								</InputGroup>
							</Col>
							<Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="age" value={age} name="age"  placeholder="年齢" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
											<InputGroup.Append>
												<DatePicker
													selected={this.state.raiseStartDate}
													onChange={this.inactiveAge}
													autoComplete="on"
													locale="pt-BR"
													className={"dateInput"}
													id="beginDate"
													locale="ja"
												/>
											</InputGroup.Append>
											<FormControl id="time4" name="time4" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>		
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="和暦" value={japaneseCalendar} autoComplete="off"
										onChange={this.valueChange} size="sm" name="japaneseCalendar" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="genderStatus" value={genderStatus}
												autoComplete="off">
												{this.state.genders.map(gender =>
													<option key={gender.code} value={gender.code}>
														{gender.name}
													</option>
												)}
									</Form.Control>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="intoCompanyCode" value={intoCompanyCode}
												autoComplete="off">
												{this.state.intoCompanys.map(ic =>
													<option key={ic.code} value={ic.code}>
														{ic.name}
													</option>
												)}
									</Form.Control>
								</InputGroup>
							</Col>
									<Col sm={4}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select" size="sm"
												onChange={this.valueChange}
												name="emploryeeFormCode" value={emploryeeFormCode}
												autoComplete="off">
												{this.state.staffForms.map(st =>
													<option key={st.code} value={st.code}>
														{st.name}
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
										<InputGroup.Text id="inputGroup-sizing-sm">職種</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="職種" value={occupationCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="occupationCode" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">部署</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="部署" value={departmentCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="departmentCode" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社内メール</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="email"  placeholder="社内メール" value={companyMailAddress} autoComplete="off"
										onChange={this.valueChange} size="sm" name="companyMailAddress" /><font color="red" style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業学校</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="学校" value={graduationUniversity} autoComplete="off"
										onChange={this.valueChange} size="sm" name="graduationUniversity" />
									<FormControl  placeholder="専門" value={subjectOfStudy} autoComplete="off"
										onChange={this.valueChange} size="sm" name="subjectOfStudy" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">卒業年月</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="graduationDate" name="graduationDate" value={graduationDate}  placeholder="卒業年月"  aria-describedby="inputGroup-sizing-sm" readOnly />
											<InputGroup.Append>
											<DatePicker
													selected={this.state.raiseStartDate}
													onChange={this.inactiveGraduationDate}
													autoComplete="on"
													className={"dateInput"}
                                                    dateFormat={"yyyy MM"}
													showMonthYearPicker
													showFullMonthYearPicker
													showDisabledMonthNavigation
													locale="ja"
												/>
											</InputGroup.Append>
										</InputGroup>
							</Col>
							<Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="joinCompanyOfYear" name="joinCompanyOfYear" value={joinCompanyOfYear} placeholder="入社年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
											<InputGroup.Append>
												<DatePicker
													selected={this.state.raiseStartDate}
													onChange={this.inactiveJoinCompanyOfYear}
													autoComplete="on"
													className={"dateInput"}
                                                    dateFormat={"yyyy MM"}
													showMonthYearPicker
													showFullMonthYearPicker
													showDisabledMonthNavigation
													locale="ja"
												/>
											</InputGroup.Append>
											<FormControl id="time" name="time" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>								
							</Col>

							</Row>
							<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">退職年月</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="retirementDate" name="retirementDate" value={retirementDate} placeholder="退職年月"  aria-describedby="inputGroup-sizing-sm" readOnly />
											<InputGroup.Append>
											<DatePicker
													selected={this.state.raiseStartDate}
													onChange={this.inactiveRetirementDate}
													autoComplete="on"
													className={"dateInput"}
                                                    dateFormat={"yyyy MM"}
													showMonthYearPicker
													showFullMonthYearPicker
													showDisabledMonthNavigation
													locale="ja"
												/>
											</InputGroup.Append>
										</InputGroup>
							</Col>
							  <Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">来日年月</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="comingToJapanOfYearAndMonth" value={comingToJapanOfYearAndMonth} name="comingToJapanOfYearAndMonth" value={comingToJapanOfYearAndMonth} placeholder="来日年月" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
											<InputGroup.Append>
												<DatePicker
													selected={this.state.raiseStartDate}
													onChange={this.inactiveComingToJapanOfYearAndMonthr}
													autoComplete="on"
													className={"dateInput"}
                                                    dateFormat={"yyyy MM"}
													showMonthYearPicker
													showFullMonthYearPicker
													showDisabledMonthNavigation
													locale="ja"
												/>
											</InputGroup.Append>
											<FormControl id="time2" name="time2" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>										
								</Col>
								<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出身地</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="出身地" value={nationalityCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="nationalityCode" />
									<FormControl  placeholder="出身地" value={nationalityCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="nationalityCode" />								
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">携帯電話</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="携帯電話" value={phone} autoComplete="off"
										onChange={this.valueChange} size="sm" name="phone" />
								</InputGroup>
							</Col>
							
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">権限</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="権限" value={authorityCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="authorityCode" />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<Form.Label style={{ "color": "#FFD700" }}>スキール情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="日本語" value={japaneaseLeveCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="japaneaseLeveCode" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">英語</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="英語" value={englishLeveCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="englishLeveCode" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">資格</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="資格" value={certification1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="certification1" />
									<FormControl  placeholder="資格" value={certification2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="certification2" />								
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">スキール</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="スキール" value={developmentLanguageNo1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developmentLanguageNo1" />
									<FormControl  placeholder="スキール" value={developmentLanguageNo2} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developmentLanguageNo2" />
									<FormControl  placeholder="スキール" value={developmentLanguageNo3} autoComplete="off"
										onChange={this.valueChange} size="sm" name="developmentLanguageNo3" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">経験年数</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="経験年数" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>

					<Form.Label style={{ "color": "#FFD700" }}>個人関連情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留資格 </InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="在留資格" value={residenceOfCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="residenceOfCode" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="在留カード" value={residenceCardNoCode} autoComplete="off"
										onChange={this.valueChange} size="sm" name="residenceCardNoCode" />
								</InputGroup>
							</Col>
							<Col sm={4}>
                                <InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">在留期間</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="periodOfStay" value={periodOfStay} name="periodOfStay" value={periodOfStay} placeholder="在留期間" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
											<InputGroup.Append>
												<DatePicker
													selected={this.state.raiseStartDate}
													onChange={this.inactivePeriodOfStayr}
													autoComplete="on"
													className={"dateInput"}
                                                    dateFormat={"yyyy MM"}
													showMonthYearPicker
													showFullMonthYearPicker
													showDisabledMonthNavigation
													locale="ja"
												/>
											</InputGroup.Append>
											<FormControl id="time3" name="time3" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
								</InputGroup>										
								</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">雇用保険番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="雇用保険番号" value={employmentInsuranceNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employmentInsuranceNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">マイナンバー</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  placeholder="マイナンバー" value={myNumber} autoComplete="off"
										onChange={this.valueChange} size="sm" name="myNumber" />
								</InputGroup>
							</Col>
														<Col sm={6}>
								 <InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書</InputGroup.Text><Form.File id="exampleFormControlFile1"/>
									</InputGroup.Prepend>
								</InputGroup> 
							</Col>
						</Row>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text><Form.File id="exampleFormControlFile1"/>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">パスポート</InputGroup.Text><Form.File id="exampleFormControlFile1"/>
									</InputGroup.Prepend>
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>

					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="success" type="submit">
							登録
                        </Button>{' '}
						<Button size="sm" type="reset" variant="success"  >
							リセット
                        </Button>
					</div>
				</Form>
				</div>
		);
	}
}
export default mainAdd;
