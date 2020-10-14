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
import siteSearch from './siteSearch';
import salesPointSet from './salesPointSet';
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
import {
	faAddressBook, faHome, faUser, faUsers, faYenSign, faPaperPlane, faBuilding, faCalendar,
	faCalendarAlt, faThList, faCogs, faCloudUploadAlt, faSearch, faSave,
	faCommentDollar, faList, faSearchMinus, faNewspaper, faPencilRuler,
	faUserCircle, faFilePowerpoint, faChartPie, faTable, faCog, faUpload
} from '@fortawesome/free-solid-svg-icons';
import '../asserts/css/subMenu.css';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
axios.defaults.withCredentials = true;


class SubMenu extends Component {
	state = {
		nowDate: '',//今の期日
	}
	async componentWillMount() {
		this.props.fetchDropDown();
		await axios.post(this.props.serverIP + "subMenu/init")
			.then(resultMap => {
				if (resultMap.data !== null && resultMap.data !== '') {
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
		})
	}
	logout = () => {
		axios.post(this.props.serverIP + "subMenu/logout")
			.then(resultMap => {
				alert("ログアウトしました");
			})
	}
	render() {
		//お客様情報画面の追加パラメータ
		var customerInfoPath = {
			pathname: '/subMenuManager/customerInfo', state: { actionType: 'insert' },
		}
		return (
			<div className="mainBody">
				<Row style={{ "backgroundColor": "#FFFAF0" }}>
					<Navbar inline>
					<img className="titleImg" alt="title" src={title} /><a className="loginMark" inline>LYC株式会社</a>{" "}
					</Navbar>
					<div style={{ "marginTop": "2%", "marginLeft": "auto", }}>
						<font className="loginPeople">{this.state.nowDate}{" "}<FontAwesomeIcon className="fa-fw" size="lg" icon={faUser} /><a id="kanriSha"></a></font>{" "}
						<Link as="button" className="logout" to="/" id="logout" onClick={this.logout}>sign out</Link>
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
										<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }} block>
											<Accordion.Toggle as={Button} variant="link" eventKey="0"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faAddressBook} />社員管理</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="0">
												<ListGroup>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
														<Link className="linkFont" to={{ pathname: '/subMenuManager/employeeInsert', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />社員情報登録</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/employeeSearch"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />社員情報検索</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }} block>
											<Accordion.Toggle as={Button} variant="link" eventKey="1"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faHome} />現場</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="1">
												<ListGroup >
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont" to="/subMenuManager/siteInfo"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />現場情報登録</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont" to="/subMenuManager/siteSearch"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />現場情報検索</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
											<Accordion.Toggle as={Button} variant="link" eventKey="2"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faUsers} />お客様</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="2">
												<ListGroup variant="flush">
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to={customerInfoPath}><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />お客様情報登録</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/customerInfoSearch"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />お客様情報検索</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}>
											<Accordion.Toggle as={Button} variant="link" eventKey="3"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faYenSign} />給料と単価</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="3">
												<ListGroup variant="flush">
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont" to="/subMenuManager/wagesInfo">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faCommentDollar} />給料情報</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont" to="/subMenuManager/individualSales">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faList} />個人売上一覧</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont" to="/subMenuManager/monthlySalesSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />売上検索一覧</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont" to="/subMenuManager/">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />状況変動一覧</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont" to="/subMenuManager/enterPeriodSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />入社入場期限一覧</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
											<Accordion.Toggle as={Button} variant="link" eventKey="4"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faPaperPlane} />営業送信</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="4">
												<ListGroup variant="flush">
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/manageSituation"><FontAwesomeIcon className="fa-fw" size="lg" icon={faNewspaper} />営業状況確認一覧</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faPencilRuler} />提案送信</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faUserCircle} />要員提案送信</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}>
											<Accordion.Toggle as={Button} variant="link" eventKey="5"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faBuilding} />営業管理</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="5">
												<ListGroup variant="flush">
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont" to="/subMenuManager/salesPointSet"><FontAwesomeIcon className="fa-fw" size="lg" icon={faFilePowerpoint} />営業ポイント設定</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faChartPie} />営業個別売上</Link></ListGroup.Item>										</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
											<Accordion.Toggle as={Button} variant="link" eventKey="6"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faCalendar} />勤務</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="6">
												<ListGroup variant="flush">
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/dutyManagement">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faTable} />勤務管理</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faPaperPlane} />勤務表送信</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faCommentDollar} />残業代一覧</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/dutyRegistration/">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />勤務登録</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />履歴検索</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}>
											<Accordion.Toggle as={Button} variant="link" eventKey="7"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faCalendarAlt} />非稼働</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="7">
												<ListGroup variant="flush">
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faTable} />非待機一覧</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
											<Accordion.Toggle as={Button} variant="link" eventKey="8"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faThList} />マスター</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="8">
												<ListGroup variant="flush">
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/masterInsert"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />マスター登録</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/masterUpdate"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />マスター修正</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}>
											<Accordion.Toggle as={Button} variant="link" eventKey="9"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faCogs} />他の設定</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="9">
												<ListGroup variant="flush">
													<ListGroup.Item style={{ "backgroundColor": "#1a94a8" }}><Link className="linkFont" to="/subMenuManager/masterInsert"><FontAwesomeIcon className="fa-fw" size="lg" icon={faCog} />システム設定</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
										<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
											<Accordion.Toggle as={Button} variant="link" eventKey="10"><font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faCloudUploadAlt} />アップロード</font></Accordion.Toggle>
											<Accordion.Collapse eventKey="10">
												<ListGroup variant="flush">
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/workRepot/"><FontAwesomeIcon className="fa-fw" size="lg" icon={faUpload} />作業報告書アップ</Link></ListGroup.Item>
													<ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}><Link className="linkFont" to="/subMenuManager/costRegistration/"><FontAwesomeIcon className="fa-fw" size="lg" icon={faUpload} />費用登録</Link></ListGroup.Item>
												
												</ListGroup>
											</Accordion.Collapse>
										</ListGroup.Item>
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
								<Route exact path={`${this.props.match.url}/dutyRegistration`} component={DutyRegistration} />
								<Route exact path={`${this.props.match.url}/breakTime`} component={BreakTime} />
								<Route exact path={`${this.props.match.url}/salesSendLetter`} component={salesSendLetter} />
								<Route exact path={`${this.props.match.url}/individualSales`} component={individualSales} />
								<Route exact path={`${this.props.match.url}/wagesInfo`} component={WagesInfo} />
								<Route exact path={`${this.props.match.url}/workRepot`} component={workRepot} />
								<Route exact path={`${this.props.match.url}/costRegistration`} component={costRegistration} />
								<Route exact path={`${this.props.match.url}/monthlySalesSearch`} component={monthlySalesSearch} />
								<Route exact path={`${this.props.match.url}/salesPointSet`} component={salesPointSet} />
								<Route exact path={`${this.props.match.url}/enterPeriodSearch`} component={EnterPeriodSearch} />
								<Route exact path={`${this.props.match.url}/sendLettersConfirm`} component={sendLettersConfirm} />
								
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
const mapStateToProps = state => {
	return {
		serverIP: state.data.dataReques[state.data.dataReques.length-1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(SubMenu);
