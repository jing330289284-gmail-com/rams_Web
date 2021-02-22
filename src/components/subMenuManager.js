import React, { Component } from 'react';
import { Row, Col, ListGroup, Accordion, Button, Navbar, Container } from 'react-bootstrap';
import title from '../asserts/images/LYCmark.png';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import EmployeeInsert from './employeeInsert';
import EmployeeSearch from './employeeSearch';
import CustomerInfo from './customerInfo';
import masterInsert from './masterInsert';
import masterUpdate from './masterUpdate';
import CustomerInfoSearch from './customerInfoSearch';
import siteInfo from './siteInfo';
import ManageSituation from './manageSituation';
import SendRepot from './sendRepot';
import siteSearch from './siteSearch';
import salesPointSet from './salesPointSet';
import salesProfit from './salesProfit';
import salesPoint from './salesPoint';
import WagesInfo from './wagesInfo';
import workRepot from './workRepot';
import costRegistration from './costRegistration';
import DutyRegistration from './dutyRegistration';
import BreakTime from './breakTime';
import axios from 'axios';
import salesSendLetter from './salesSendLetter';
import dutyManagement from './dutyManagement';
import individualSales from './individualSales';
import monthlySalesSearch from './monthlySalesSearch';
import EnterPeriodSearch from './enterPeriodSearch';
import sendLettersConfirm from './sendLettersConfirm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import situationChange from './situationChange';
import EmployeeUpdate from './employeeUpdate';
import EmployeeDetail from './employeeDetail';
import ProjectInfoSearch from './projectInfoSearch';
import IndividualCustomerSales from './individualCustomerSales';
import projectInfo from './projectInfo';
import customerSalesList from './customerSalesList';
import {
	faAddressBook, faHome, faUser, faUsers, faYenSign, faPaperPlane, faBuilding, faCalendar,
	faCalendarAlt, faThList, faCogs, faCloudUploadAlt, faSearch, faSave,
	faCommentDollar, faList, faSearchMinus, faNewspaper,
	faFilePowerpoint, faChartPie, faTable, faCog, faUpload, faCheckSquare, faBars, faCaretSquareLeft
} from '@fortawesome/free-solid-svg-icons';
import '../asserts/css/subMenu.css';
import store from './redux/store';
axios.defaults.withCredentials = true;

/**
 * サブメニュー画面（管理者用）
 * 20201019 劉林涛
 */
class SubMenu extends Component {

	constructor(props) {
		super(props);
		this.state = {
			serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
			nowDate: '',//今の期日
			authorityCode: '',
		}
	};

	async componentWillMount() {
		await axios.post(this.state.serverIP + "subMenu/init")
			.then(resultMap => {
				if (resultMap.data !== null && resultMap.data !== '') {
					if (resultMap.data["authorityCode"] === "0") {
						this.props.history.push("/");
						alert("権限不足");
						return
					}
					this.setState({
						authorityCode: resultMap.data["authorityCode"],
					})
					document.getElementById("kanriSha").innerHTML = resultMap.data["authorityName"] + "：" + resultMap.data["employeeName"];
				} else {
					this.props.history.push("/");
				}
			})
	}
	/**
	 * 画面の初期化
	 */
	componentDidMount() {
		var dateNow = new Date();
		let month = dateNow.getMonth() + 1;
		let day = dateNow.getDate();
		this.setState({
			nowDate: (dateNow.getFullYear() + '年' + (month < 10 ? '0' + month : month) + '月' + (day < 10 ? '0' + day : day) + "日"),
			click: "",
		})
	}
	logout = () => {
		axios.post(this.state.serverIP + "subMenu/logout")
			.then(resultMap => {
				alert("ログアウトしました");
			})
	}
	click = (name) =>{
		this.setState({
			click:name,
		})
	}
	render() {
		//お客様情報画面の追加パラメータ
		var customerInfoPath = {
			pathname: '/subMenuManager/customerInfo', state: { actionType: 'insert' },
		}
		var projectInfoPath = {
			pathname: '/subMenuManager/projectInfo', state: { actionType: 'insert', backPage: '' },
		}
		const { authorityCode } = this.state;
		const styleLow = {
			backgroundColor: "#17a2b8"
		}
		const styleHigh = {
			backgroundColor: "#1a94a8"
		}
		return (
			<div className="mainBody">
				<Row style={{ "backgroundColor": "#FFFAF0" }}>
					<Navbar inline>
						<img className="titleImg" alt="title" src={title} /><a className="loginMark" inline>LYC株式会社</a>{" "}
					</Navbar>
					<div style={{ "marginTop": "2%", "marginLeft": "auto", }}>
						<font className="loginPeople">{this.state.nowDate}{" "}<FontAwesomeIcon className="fa-fw" size="lg" icon={faUser} /><a id="kanriSha"></a></font>{" "}
						<Link as="button" className="logout" to="/" id="logout" onClick={this.logout}><FontAwesomeIcon className="fa-fw" size="lg" icon={faCaretSquareLeft} />sign out</Link>
					</div>

				</Row>
				<Row>
					<Col sm={2}>
						<br />
						<Row>
							<Container>
								<h1 className="title-font">
									売上請求管理システム
                            </h1>
								<br />
							</Container>
						</Row>
						<Row>
							<Col>
								<ListGroup >
									<Accordion className="menuCol">
										<ListGroup.Item style={styleLow} block>
											<Accordion.Toggle as={Button} variant="link" eventKey="0"><font className={this.state.click==="社員管理"?"linkFont-click":"linkFont"} onClick={() => this.click('社員管理')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faAddressBook} />社員管理</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="0">
												<ListGroup>
													<ListGroup.Item style={styleLow}>
														<Link className={this.state.click==="社員情報登録"?"linkFont-click":"linkFont"} onClick={() => this.click('社員情報登録')} to={{ pathname: '/subMenuManager/employeeInsert', state: { actionType: 'insert' } }}>
															<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave}/>社員情報登録</Link></ListGroup.Item>
													<ListGroup.Item style={styleLow}><Link className={this.state.click==="社員情報検索"?"linkFont-click":"linkFont"} onClick={() => this.click('社員情報検索')} to="/subMenuManager/employeeSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />社員情報検索</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={styleHigh} block>
											<Accordion.Toggle as={Button} variant="link" eventKey="1"><font className={this.state.click==="現場"?"linkFont-click":"linkFont"} onClick={() => this.click('現場')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faHome} />現場</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="1">
												<ListGroup >
													<ListGroup.Item style={styleHigh}><Link className={this.state.click==="現場情報登録"?"linkFont-click":"linkFont"} onClick={() => this.click('現場情報登録')} to="/subMenuManager/siteInfo">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />現場情報登録</Link></ListGroup.Item>
													<ListGroup.Item style={styleHigh}><Link className={this.state.click==="現場情報検索"?"linkFont-click":"linkFont"} onClick={() => this.click('現場情報検索')} to="/subMenuManager/siteSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />現場情報検索</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={styleLow}>
											<Accordion.Toggle as={Button} variant="link" eventKey="2"><font className={this.state.click==="お客様"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faUsers} />お客様</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="2">
												<ListGroup variant="flush">
													<ListGroup.Item style={styleLow}><Link className={this.state.click==="お客様情報登録"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様情報登録')} to={customerInfoPath}>
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />お客様情報登録</Link></ListGroup.Item>
													<ListGroup.Item style={styleLow}><Link className={this.state.click==="お客様情報検索"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様情報検索')} to="/subMenuManager/customerInfoSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />お客様情報検索</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										{
											authorityCode !== "2" ? authorityCode !== "3" ?
												<ListGroup.Item style={styleHigh}>
													<Accordion.Toggle as={Button} variant="link" eventKey="3"><font className={this.state.click==="給料と売上"?"linkFont-click":"linkFont"} onClick={() => this.click('給料と売上')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faYenSign} />給料と売上</font></Accordion.Toggle>
													<Accordion.Collapse eventKey="3">
														<ListGroup variant="flush">
															<ListGroup.Item style={styleHigh}><Link className={this.state.click==="給料情報"?"linkFont-click":"linkFont"} onClick={() => this.click('給料情報')} to="/subMenuManager/wagesInfo">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCommentDollar} />給料情報</Link></ListGroup.Item>
															<ListGroup.Item style={styleHigh}><Link className={this.state.click==="個人売上一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('個人売上一覧')} to="/subMenuManager/individualSales">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faList} />個人売上一覧</Link></ListGroup.Item>
															<ListGroup.Item style={styleHigh}><Link className={this.state.click==="全員売上一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('全員売上一覧')} to="/subMenuManager/monthlySalesSearch">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />全員売上一覧</Link></ListGroup.Item>
															<ListGroup.Item style={styleHigh}><Link className={this.state.click==="お客様個別売上"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様個別売上')} to="/subMenuManager/individualCustomerSales">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />お客様個別売上</Link></ListGroup.Item>
															<ListGroup.Item style={styleHigh}><Link className={this.state.click==="お客様売上一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様売上一覧')} to="/subMenuManager/customerSalesList">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />お客様売上一覧</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>
												</ListGroup.Item>
												:
												null
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={authorityCode === "3" ? styleHigh : styleLow}>
													<Accordion.Toggle as={Button} variant="link" eventKey="4"><font className={this.state.click==="営業送信"?"linkFont-click":"linkFont"} onClick={() => this.click('営業送信')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faPaperPlane} />営業送信</font></Accordion.Toggle>
													<Accordion.Collapse eventKey="4">
														<ListGroup variant="flush">
															<ListGroup.Item style={authorityCode === "3" ? styleHigh : styleLow}><Link className={this.state.click==="営業状況一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('営業状況一覧')} to="/subMenuManager/manageSituation">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faNewspaper} />営業状況一覧</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? styleHigh : styleLow}><Link className={this.state.click==="お客様選択"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様選択')} to="/subMenuManager/salesSendLetter">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCheckSquare} />お客様選択</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? styleHigh : styleLow}><Link className={this.state.click==="案件登録"?"linkFont-click":"linkFont"} onClick={() => this.click('案件登録')} to={projectInfoPath}>
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />案件登録</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? styleHigh : styleLow}><Link className={this.state.click==="案件一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('案件一覧')} to="/subMenuManager/projectInfoSearch">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />案件一覧</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>
												</ListGroup.Item>
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={authorityCode === "3" ? styleLow : styleHigh}>
													<Accordion.Toggle as={Button} variant="link" eventKey="5"><font className={this.state.click==="営業管理"?"linkFont-click":"linkFont"} onClick={() => this.click('営業管理')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faBuilding} />営業管理</font></Accordion.Toggle>
													<Accordion.Collapse eventKey="5">
														<ListGroup variant="flush">
															<ListGroup.Item style={authorityCode === "3" ? styleLow : styleHigh}><Link className={this.state.click==="営業ポイント設定"?"linkFont-click":"linkFont"} onClick={() => this.click('営業ポイント設定')} to="/subMenuManager/salesPointSet">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faFilePowerpoint} color="rgb(247, 226, 248)"/>営業ポイント設定</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? styleLow : styleHigh}><Link className={this.state.click==="営業個別売上"?"linkFont-click":"linkFont"} onClick={() => this.click('営業個別売上')} to="/subMenuManager/salesProfit">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faChartPie} />営業個別売上</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? styleLow : styleHigh}><Link className={this.state.click==="営業ポイント明細"?"linkFont-click":"linkFont"} onClick={() => this.click('営業ポイント明細')} to="/subMenuManager/salesPoint">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faBars} />営業ポイント明細</Link></ListGroup.Item>										</ListGroup>
													</Accordion.Collapse>
												</ListGroup.Item>
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={authorityCode === "3" ? styleHigh : styleLow}>
													<Accordion.Toggle as={Button} variant="link" eventKey="6"><font className={this.state.click==="勤務"?"linkFont-click":"linkFont"} onClick={() => this.click('勤務')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faCalendar} />勤務</font></Accordion.Toggle>
													<Accordion.Collapse eventKey="6">
														<ListGroup variant="flush">
															<ListGroup.Item style={authorityCode === "3" ? styleHigh : styleLow}><Link className={this.state.click==="勤務管理"?"linkFont-click":"linkFont"} onClick={() => this.click('勤務管理')} to="/subMenuManager/dutyManagement/">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />勤務管理</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? styleHigh : styleLow}><Link className={this.state.click==="報告書送信"?"linkFont-click":"linkFont"} onClick={() => this.click('報告書送信')} to="/subMenuManager/sendRepot">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCheckSquare} />報告書送信</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>
												</ListGroup.Item>
												:
												null
										}
										{
											authorityCode !== "2" ? authorityCode !== "3" ?
												<ListGroup.Item style={styleHigh}>
													<Accordion.Toggle as={Button} variant="link" eventKey="7"><font className={this.state.click==="期限確認"?"linkFont-click":"linkFont"} onClick={() => this.click('期限確認')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faCalendarAlt} />期限確認</font></Accordion.Toggle>
													<Accordion.Collapse eventKey="7">
														<ListGroup variant="flush">
															<ListGroup.Item style={styleHigh}><Link className={this.state.click==="状況変動一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('状況変動一覧')} to="/subMenuManager/situationChange">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />状況変動一覧</Link></ListGroup.Item>
															<ListGroup.Item style={styleHigh}><Link className={this.state.click==="入社入場期限一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('入社入場期限一覧')} to="/subMenuManager/enterPeriodSearch">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />入社入場期限一覧</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>
												</ListGroup.Item>
												:
												null
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={styleLow}>
													<Accordion.Toggle as={Button} variant="link" eventKey="8"><font className={this.state.click==="マスター"?"linkFont-click":"linkFont"} onClick={() => this.click('マスター')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faThList} />マスター</font></Accordion.Toggle>
													<Accordion.Collapse eventKey="8">
														<ListGroup variant="flush">
															<ListGroup.Item style={styleLow}><Link className={this.state.click==="マスター登録"?"linkFont-click":"linkFont"} onClick={() => this.click('マスター登録')} to="/subMenuManager/masterInsert">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />マスター登録</Link></ListGroup.Item>
															<ListGroup.Item style={styleLow}><Link className={this.state.click==="マスター修正"?"linkFont-click":"linkFont"} onClick={() => this.click('マスター修正')} to="/subMenuManager/masterUpdate">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />マスター修正</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>
												</ListGroup.Item>
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={styleHigh}>
													<Accordion.Toggle as={Button} variant="link" eventKey="9"><font className={this.state.click==="他の設定"?"linkFont-click":"linkFont"} onClick={() => this.click('他の設定')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faCogs} />他の設定</font></Accordion.Toggle>
													<Accordion.Collapse eventKey="9">
														<ListGroup variant="flush">
															<ListGroup.Item style={styleHigh}><Link className={this.state.click==="システム設定"?"linkFont-click":"linkFont"} onClick={() => this.click('システム設定')} to={{ pathname: '/subMenuManager/cssTest', state: { actionType: 'insert' } }}>
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCog} />システム設定</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>
												</ListGroup.Item>
												:
												null
										}
									</Accordion>
								</ListGroup>
							</Col>
						</Row>
					</Col>
					<Col sm={9} id="page">
						<div key={this.props.location.key}>
							<br />
							<Router>
								<Route exact path={`${this.props.match.url}/`} component={EmployeeSearch} />
								<Route exact path={`${this.props.match.url}/employeeInsert`} component={EmployeeInsert} />
								<Route exact path={`${this.props.match.url}/employeeSearch`} component={EmployeeSearch} />
								<Route exact path={`${this.props.match.url}/dutyManagement`} component={dutyManagement} />
								<Route exact path={`${this.props.match.url}/customerInfo`} component={CustomerInfo} />
								<Route exact path={`${this.props.match.url}/siteInfo`} component={siteInfo} />
								<Route exact path={`${this.props.match.url}/siteSearch`} component={siteSearch} />
								<Route exact path={`${this.props.match.url}/customerInfoSearch`} component={CustomerInfoSearch} />
								<Route exact path={`${this.props.match.url}/manageSituation`} component={ManageSituation} />
								<Route exact path={`${this.props.match.url}/sendRepot`} component={SendRepot} />
								<Route exact path={`${this.props.match.url}/dutyRegistration`} component={DutyRegistration} />
								<Route exact path={`${this.props.match.url}/breakTime`} component={BreakTime} />
								<Route exact path={`${this.props.match.url}/salesSendLetter`} component={salesSendLetter} />
								<Route exact path={`${this.props.match.url}/individualSales`} component={individualSales} />
								<Route exact path={`${this.props.match.url}/wagesInfo`} component={WagesInfo} />
								<Route exact path={`${this.props.match.url}/workRepot`} component={workRepot} />
								<Route exact path={`${this.props.match.url}/costRegistration`} component={costRegistration} />
								<Route exact path={`${this.props.match.url}/monthlySalesSearch`} component={monthlySalesSearch} />
								<Route exact path={`${this.props.match.url}/salesPointSet`} component={salesPointSet} />
								<Route exact path={`${this.props.match.url}/salesProfit`} component={salesProfit} />
								<Route exact path={`${this.props.match.url}/salesPoint`} component={salesPoint} />
								<Route exact path={`${this.props.match.url}/enterPeriodSearch`} component={EnterPeriodSearch} />
								<Route exact path={`${this.props.match.url}/sendLettersConfirm`} component={sendLettersConfirm} />
								<Route exact path={`${this.props.match.url}/situationChange`} component={situationChange} />
								<Route exact path={`${this.props.match.url}/employeeUpdate`} component={EmployeeUpdate} />
								<Route exact path={`${this.props.match.url}/employeeDetail`} component={EmployeeDetail} />
								<Route exact path={`${this.props.match.url}/projectInfo`} component={projectInfo} />
								<Route exact path={`${this.props.match.url}/projectInfoSearch`} component={ProjectInfoSearch} />
								<Route exact path={`${this.props.match.url}/individualCustomerSales`} component={IndividualCustomerSales} />
								<Route exact path={`${this.props.match.url}/customerSalesList`} component={customerSalesList} />
								<div className="container col-8">
									<div className="container col-10">
										<Route exact path={`${this.props.match.url}/masterInsert`} component={masterInsert} />
										<Route exact path={`${this.props.match.url}/masterUpdate`} component={masterUpdate} />
									</div>
								</div>
							</Router>
						</div>
					</Col>
				</Row>
				<br />
			</div>
		);
	}
}
export default SubMenu;

