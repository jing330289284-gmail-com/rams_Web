import React, { Component } from 'react';
import { Row, Col, ListGroup, Accordion, Button, Navbar, Container } from 'react-bootstrap';
import $ from 'jquery';
import title from '../asserts/images/LYCmark.png';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import EmployeeInsert from './employeeInsert';
import EmployeeInsertNew from './employeeInsertNew';
import EmployeeInformation from './employeeInformation';
import CertificatePrinting from './certificatePrinting';
import EnvelopePrinting from './envelopePrinting';
import EmployeeSearch from './employeeSearch';
import CustomerInfo from './customerInfo';
import masterInsert from './masterInsert';
import masterUpdate from './masterUpdate';
import systemSet from './systemSet';
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
import sendLettersMatter from './sendLettersMatter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import situationChange from './situationChange';
import EmployeeUpdate from './employeeUpdate';
import EmployeeUpdateNew from './employeeUpdateNew';
import EmployeeDetail from './employeeDetail';
import EmployeeDetailNew from './employeeDetailNew';
import ProjectInfoSearch from './projectInfoSearch';
import IndividualCustomerSales from './individualCustomerSales';
import projectInfo from './projectInfo';
import sendRepotConfirm from './sendRepotConfirm';
import customerSalesList from './customerSalesList';
import ReactTooltip from 'react-tooltip';


import {
	faAddressBook, faHome, faUser, faUsers, faYenSign, faPaperPlane, faBuilding, faCalendar,
	faCalendarAlt, faThList, faCogs, faCloudUploadAlt, faSearch, faSave,
	faCommentDollar, faList, faSearchMinus, faNewspaper,faDownload,
	faFilePowerpoint, faChartPie, faTable, faCog, faUpload, faCheckSquare, faBars, faCaretSquareLeft
} from '@fortawesome/free-solid-svg-icons';
import '../asserts/css/subMenu.css';
import store from './redux/store';
axios.defaults.withCredentials = true;

/**
 * サブメニュー画面（管理者用） 20201019 劉林涛
 */
class SubMenu extends Component {

	constructor(props) {
		super(props);
		this.state = {
			serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],// 劉林涛
																						// テスト
			companyName: '',
			nowDate: '',// 今の期日
			authorityCode: '',
			hover: '',
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
		axios.post(this.state.serverIP + "subMenu/getCompanyDate")
		.then(response => {
				this.setState({
					companyName: response.data.companyName,
					pic: response.data.companyLogo,
					backgroundColor: response.data.backgroundColor,
				})
		}).catch((error) => {
			console.error("Error - " + error);
		});
		
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
	checkSession = () =>{
		axios.post(this.state.serverIP + "subMenu/checkSession")
		.then(resultMap => {
			if (resultMap.data === null || resultMap.data === ''){
				alert("セッションの有効期限が切れています。再度ログインを行なってください。")
				this.props.history.push("/loginManager");
			}
		})
	}
	
	handleMouseOver = () =>{
		var popudiv = $('#popu_div');
		var test = "test";
        popudiv.html(test);//设置内容
        popudiv.css('position','absolute');//设置position
        var pos = {//定位popudiv，这里以在td右边显示为例子，左边跟上边的时候还要计算popudiv的尺寸
            top : 0,
            left : 0
        }
        popudiv.css(pos).show();//设置left，top，并显示出来
	}
	
	handleMouseOut = () =>{
		var popudiv = $('#popu_div');
        popudiv.hide();
	}
	
	shuseiTo = (path) => {
		this.props.history.push(path);
	}

	toggleHover = (num) => {
		this.setState({
			hover: num,
		})
	}
	
	render() {
		// お客様情報画面の追加パラメータ
		var customerInfoPath = {
			pathname: '/subMenuManager/customerInfo', state: { actionType: 'insert' },
		}
		var projectInfoPath = {
			pathname: '/subMenuManager/projectInfo', state: { actionType: 'insert', backPage: '' },
		}
		const { authorityCode } = this.state;
		const menuStyle = {
			borderBottom: "0.1px solid #167887",
			backgroundColor: "#17a2b8"
		}
		const menuStyleHover = {
			borderBottom: "0.1px solid #167887",
			backgroundColor: "#188596"
		}
		
		const subMenu = {
			borderBottom: "0.1px solid #4a4a4a",
			backgroundColor: "#ffffff"
		}
		const subMenuHover = {
			borderBottom: "0.1px solid #4a4a4a",
			backgroundColor: "#4a4a4a"
		}
		
		return (
			<div className="mainBody">
				<div id="popu_div"></div>
				<Row style={{ "backgroundColor": "#FFFAF0" }}>
					<Navbar inline>
						<img className="titleImg" alt="title" src={this.state.pic} style={{ "width": "65px"}} /><a className="loginMark" inline>{this.state.companyName}</a>{" "}
					</Navbar>
					<div style={{ "marginTop": "2%", "marginLeft": "auto", }}>
						<font className="loginPeople">{this.state.nowDate}{" "}<FontAwesomeIcon className="fa-fw" size="lg" icon={faUser} /><a id="kanriSha"></a></font>{" "}
						<Link as="button" className="logout" to="/" id="logout" onClick={this.logout}><FontAwesomeIcon className="fa-fw" size="lg" icon={faCaretSquareLeft} />sign out</Link>
					</div>

				</Row>
				<Row onClick={() => this.checkSession()}>
					<Col sm={2}>
						<br />
						<Row>
							<Container>
								<h1 className="title-font">
									社員・営業管理
                            </h1>
								<br />
							</Container>
						</Row>
						<Row>
							<Col>
								<ListGroup >
									<Accordion className="menuCol">
										<ListGroup.Item style={this.state.hover.search("社員・BP") !== -1 ? menuStyleHover : menuStyle} block data-place="right" data-type="info" data-tip="" data-for="社員・BP" data-class="my-tabcolor" data-effect="solid"
											onMouseEnter={this.toggleHover.bind(this,"社員・BP")} onMouseLeave={this.toggleHover.bind(this,"")}>
											<Accordion.Toggle as={Button} variant="link" eventKey="0"><font
											className={this.state.hover.search("社員・BP") !== -1 ? "linkFont-click":"linkFont"} ><FontAwesomeIcon className="fa-fw" size="lg" icon={faAddressBook} /> 社員・BP</font></Accordion.Toggle>
											<ReactTooltip id="社員・BP"  delayUpdate={1000} getContent={() => {
												return <div>
												<ListGroup>
													<Accordion className="menuCol">
														<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"社員・BP-1")} onMouseLeave={this.toggleHover.bind(this,"社員・BP")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/employeeInsertNew', state: { actionType: 'insert' }})} block>
															<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={{ pathname: '/subMenuManager/employeeInsertNew', state: { actionType: 'insert' } }}><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave}/> 社員・BP登録</Link></div>
														</ListGroup.Item>
														<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"社員・BP-2")} onMouseLeave={this.toggleHover.bind(this,"社員・BP")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/employeeSearch'})} block>
															<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/employeeSearch"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} /> 社員・BP検索</Link></div>
														</ListGroup.Item>
														<ListGroup.Item style={this.state.hover.search("3") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"社員・BP-3")} onMouseLeave={this.toggleHover.bind(this,"社員・BP")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/employeeInformation'})} block>
															<div><Link className={this.state.hover.search("3") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/employeeInformation"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} /> 個人情報期限</Link></div>
														</ListGroup.Item>
														<ListGroup.Item style={this.state.hover.search("4") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"社員・BP-4")} onMouseLeave={this.toggleHover.bind(this,"社員・BP")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/certificatePrinting'})} block>
															<div><Link className={this.state.hover.search("4") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/certificatePrinting"><FontAwesomeIcon className="fa-fw" size="lg" icon={faDownload} /> 証明書印刷</Link></div>
														</ListGroup.Item>
														<ListGroup.Item style={this.state.hover.search("5") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"社員・BP-5")} onMouseLeave={this.toggleHover.bind(this,"社員・BP")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/envelopePrinting'})} block>
															<div><Link className={this.state.hover.search("5") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/envelopePrinting"><FontAwesomeIcon className="fa-fw" size="lg" icon={faDownload} /> 封筒印刷</Link></div>
														</ListGroup.Item>
													</Accordion>
												</ListGroup>
												</div>
												}}/>
											{/*<Accordion.Collapse eventKey="0">
												<ListGroup>
													<ListGroup.Item style={menuStyle}>
														<Link className={this.state.click==="社員・BP登録"?"linkFont-click":"linkFont"} onClick={() => this.click('社員・BP登録')} to={{ pathname: '/subMenuManager/employeeInsertNew', state: { actionType: 'insert' } }}>
															<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave}/>社員・BP登録</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="社員・BP検索"?"linkFont-click":"linkFont"} onClick={() => this.click('社員・BP検索')} to="/subMenuManager/employeeSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />社員・BP検索</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="個人情報期限"?"linkFont-click":"linkFont"} onClick={() => this.click('個人情報期限')} to="/subMenuManager/employeeInformation">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />個人情報期限</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="証明書印刷"?"linkFont-click":"linkFont"} onClick={() => this.click('証明書印刷')} to="/subMenuManager/certificatePrinting">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faDownload} />証明書印刷</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>*/}
										</ListGroup.Item>
										<ListGroup.Item style={this.state.hover.search("現場") !== -1 ? menuStyleHover : menuStyle} block data-place="right" data-type="info" data-tip="" data-for="現場" data-class="my-tabcolor"  data-effect="solid"
											 onMouseEnter={this.toggleHover.bind(this,"現場")} onMouseLeave={this.toggleHover.bind(this,"")}>
											<Accordion.Toggle as={Button} variant="link" eventKey="1"><font
											className={this.state.hover.search("現場") !== -1 ? "linkFont-click":"linkFont"} onClick={() => this.click('現場')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faHome} /> 現場</font></Accordion.Toggle>
											<ReactTooltip id="現場"  delayUpdate={1000} getContent={() => {
												return <div>
												<ListGroup>
													<Accordion className="menuCol">
														<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"現場-1")} onMouseLeave={this.toggleHover.bind(this,"現場")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/siteInfo'})} block>
															<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/siteInfo"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} /> 現場情報登録</Link></div>
														</ListGroup.Item>
														<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"現場-2")} onMouseLeave={this.toggleHover.bind(this,"現場")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/siteSearch'})} block>
															<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/siteSearch"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} /> 現場情報検索</Link></div>
														</ListGroup.Item>
													</Accordion>
												</ListGroup>
												</div>
												}}/>
											{/*<Accordion.Collapse eventKey="1">
												<ListGroup >
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="現場情報登録"?"linkFont-click":"linkFont"} onClick={() => this.click('現場情報登録')} to="/subMenuManager/siteInfo">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />現場情報登録</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="現場情報検索"?"linkFont-click":"linkFont"} onClick={() => this.click('現場情報検索')} to="/subMenuManager/siteSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />現場情報検索</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>*/}
										</ListGroup.Item>
										<ListGroup.Item style={this.state.hover.search("お客様") !== -1 ? menuStyleHover : menuStyle} data-place="right" data-type="info" data-tip="" data-for="お客様" data-class="my-tabcolor"  data-effect="solid"
											 onMouseEnter={this.toggleHover.bind(this,"お客様")} onMouseLeave={this.toggleHover.bind(this,"")}>
											<Accordion.Toggle as={Button} variant="link" eventKey="2"><font
												className={this.state.hover.search("お客様") !== -1 ? "linkFont-click":"linkFont"} onClick={() => this.click('お客様')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faUsers} /> お客様</font></Accordion.Toggle>
												<ReactTooltip id="お客様"  delayUpdate={1000} getContent={() => {
													return <div>
													<ListGroup>
														<Accordion className="menuCol">
															<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"お客様-1")} onMouseLeave={this.toggleHover.bind(this,"お客様")} onClick={this.shuseiTo.bind(this,customerInfoPath)} block>
																<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={customerInfoPath}><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} /> お客様情報登録</Link></div>
															</ListGroup.Item>
															<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"お客様-2")} onMouseLeave={this.toggleHover.bind(this,"お客様")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/customerInfoSearch'})} block>
																<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/customerInfoSearch"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} /> お客様情報検索</Link></div>
															</ListGroup.Item>
														</Accordion>
													</ListGroup>
													</div>
													}}/>
											{/*<Accordion.Collapse eventKey="2">
												<ListGroup variant="flush">
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="お客様情報登録"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様情報登録')} to={customerInfoPath}>
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />お客様情報登録</Link></ListGroup.Item>
													<ListGroup.Item style={menuStyle}><Link className={this.state.click==="お客様情報検索"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様情報検索')} to="/subMenuManager/customerInfoSearch">
														<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />お客様情報検索</Link></ListGroup.Item>
												</ListGroup>
											</Accordion.Collapse>*/}
										</ListGroup.Item>
										{
											authorityCode !== "2" ? authorityCode !== "3" ?
												<ListGroup.Item style={this.state.hover.search("給料と売上") !== -1 ? menuStyleHover : menuStyle} data-place="right" data-type="info" data-tip="" data-for="給料と売上" data-class="my-tabcolor"  data-effect="solid"
													 onMouseEnter={this.toggleHover.bind(this,"給料と売上")} onMouseLeave={this.toggleHover.bind(this,"")}>
													<Accordion.Toggle as={Button} variant="link" eventKey="3"><font
													
													className={this.state.hover.search("給料と売上") !== -1 ? "linkFont-click":"linkFont"} onClick={() => this.click('給料と売上')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faYenSign} /> 給料と売上</font></Accordion.Toggle>
													<ReactTooltip id="給料と売上"  delayUpdate={1000} getContent={() => {
														return <div>
														<ListGroup>
															<Accordion className="menuCol">
																<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"給料と売上-1")} onMouseLeave={this.toggleHover.bind(this,"給料と売上")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/wagesInfo'})} block>
																	<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/wagesInfo"><FontAwesomeIcon className="fa-fw" size="lg" icon={faCommentDollar} /> 給料情報</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"給料と売上-2")} onMouseLeave={this.toggleHover.bind(this,"給料と売上")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/individualSales'})} block>
																	<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/individualSales"><FontAwesomeIcon className="fa-fw" size="lg" icon={faList} /> 個人売上一覧</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("3") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"給料と売上-3")} onMouseLeave={this.toggleHover.bind(this,"給料と売上")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/monthlySalesSearch'})} block>
																	<div><Link className={this.state.hover.search("3") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/monthlySalesSearch"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} /> 全員売上一覧</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("4") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"給料と売上-4")} onMouseLeave={this.toggleHover.bind(this,"給料と売上")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/individualCustomerSales'})} block>
																	<div><Link className={this.state.hover.search("4") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/individualCustomerSales"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} /> お客様個別売上</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("5") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"給料と売上-5")} onMouseLeave={this.toggleHover.bind(this,"給料と売上")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/customerSalesList'})} block>
																	<div><Link className={this.state.hover.search("5") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/customerSalesList"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} /> お客様売上一覧</Link></div>
																</ListGroup.Item>
															</Accordion>
														</ListGroup>
														</div>
														}}/>
													{/*<Accordion.Collapse eventKey="3">
														<ListGroup variant="flush">
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="給料情報"?"linkFont-click":"linkFont"} onClick={() => this.click('給料情報')} to="/subMenuManager/wagesInfo">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCommentDollar} />給料情報</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="個人売上一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('個人売上一覧')} to="/subMenuManager/individualSales">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faList} />個人売上一覧</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="全員売上一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('全員売上一覧')} to="/subMenuManager/monthlySalesSearch">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />全員売上一覧</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="お客様個別売上"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様個別売上')} to="/subMenuManager/individualCustomerSales">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />お客様個別売上</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="お客様売上一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様売上一覧')} to="/subMenuManager/customerSalesList">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />お客様売上一覧</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
												</ListGroup.Item>
												:
												null
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={this.state.hover.search("営業送信") !== -1 ? menuStyleHover : menuStyle} data-place="right" data-type="info" data-tip="" data-for="営業送信" data-class="my-tabcolor"  data-effect="solid"
													 onMouseEnter={this.toggleHover.bind(this,"営業送信")} onMouseLeave={this.toggleHover.bind(this,"")}>
													<Accordion.Toggle as={Button} variant="link" eventKey="4"><font
													className={this.state.hover.search("営業送信") !== -1 ? "linkFont-click":"linkFont"} onClick={() => this.click('営業送信')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faPaperPlane} /> 営業送信</font></Accordion.Toggle>
													<ReactTooltip id="営業送信"  delayUpdate={1000} getContent={() => {
														return <div>
														<ListGroup>
															<Accordion className="menuCol">
																<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"営業送信-1")} onMouseLeave={this.toggleHover.bind(this,"営業送信")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/manageSituation'})} block>
																	<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/manageSituation"><FontAwesomeIcon className="fa-fw" size="lg" icon={faNewspaper} /> 営業状況一覧</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"営業送信-2")} onMouseLeave={this.toggleHover.bind(this,"営業送信")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/salesSendLetter'})} block>
																	<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/salesSendLetter"><FontAwesomeIcon className="fa-fw" size="lg" icon={faCheckSquare} /> お客様選択</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("3") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"営業送信-3")} onMouseLeave={this.toggleHover.bind(this,"営業送信")} onClick={this.shuseiTo.bind(this,projectInfoPath)} block>
																	<div><Link className={this.state.hover.search("3") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={projectInfoPath}><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} /> 案件登録</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("4") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"営業送信-4")} onMouseLeave={this.toggleHover.bind(this,"営業送信")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/projectInfoSearch'})} block>
																	<div><Link className={this.state.hover.search("4") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/projectInfoSearch"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} /> 案件一覧</Link></div>
																</ListGroup.Item>
															</Accordion>
														</ListGroup>
														</div>
														}}/>
													{/*<Accordion.Collapse eventKey="4">
														<ListGroup variant="flush">
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="営業状況一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('営業状況一覧')} to="/subMenuManager/manageSituation">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faNewspaper} />営業状況一覧</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="お客様選択"?"linkFont-click":"linkFont"} onClick={() => this.click('お客様選択')} to="/subMenuManager/salesSendLetter">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCheckSquare} />お客様選択</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="案件登録"?"linkFont-click":"linkFont"} onClick={() => this.click('案件登録')} to={projectInfoPath}>
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />案件登録</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="案件一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('案件一覧')} to="/subMenuManager/projectInfoSearch">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />案件一覧</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
												</ListGroup.Item>
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={this.state.hover.search("営業管理") !== -1 ? menuStyleHover : menuStyle} data-place="right" data-type="info" data-tip="" data-for="営業管理" data-class="my-tabcolor"  data-effect="solid"
													 onMouseEnter={this.toggleHover.bind(this,"営業管理")} onMouseLeave={this.toggleHover.bind(this,"")}>
													<Accordion.Toggle as={Button} variant="link" eventKey="5"><font
													className={this.state.hover.search("営業管理") !== -1 ? "linkFont-click":"linkFont"} onClick={() => this.click('営業管理')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faBuilding} /> 営業管理</font></Accordion.Toggle>
													<ReactTooltip id="営業管理"  delayUpdate={1000} getContent={() => {
														return <div>
														<ListGroup>
															<Accordion className="menuCol">
																<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"営業管理-1")} onMouseLeave={this.toggleHover.bind(this,"営業管理")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/salesPointSet'})} block>
																	<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/salesPointSet"><FontAwesomeIcon className="fa-fw" size="lg" icon={faFilePowerpoint} /> ポイント設定</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"営業管理-2")} onMouseLeave={this.toggleHover.bind(this,"営業管理")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/salesProfit'})} block>
																	<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/salesProfit"><FontAwesomeIcon className="fa-fw" size="lg" icon={faChartPie} /> 営業個別売上</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("3") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"営業管理-3")} onMouseLeave={this.toggleHover.bind(this,"営業管理")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/salesPoint'})} block>
																	<div><Link className={this.state.hover.search("3") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/salesPoint"><FontAwesomeIcon className="fa-fw" size="lg" icon={faBars} /> 営業ポイント</Link></div>
																</ListGroup.Item>
															</Accordion>
														</ListGroup>
														</div>
														}}/>
													{/*<Accordion.Collapse eventKey="5">
														<ListGroup variant="flush">
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="ポイント設定"?"linkFont-click":"linkFont"} onClick={() => this.click('ポイント設定')} to="/subMenuManager/salesPointSet">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faFilePowerpoint} color="rgb(247, 226, 248)"/>ポイント設定</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="営業個別売上"?"linkFont-click":"linkFont"} onClick={() => this.click('営業個別売上')} to="/subMenuManager/salesProfit">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faChartPie} />営業個別売上</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="営業ポイント"?"linkFont-click":"linkFont"} onClick={() => this.click('営業ポイント')} to="/subMenuManager/salesPoint">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faBars} />営業ポイント</Link></ListGroup.Item>										</ListGroup>
													</Accordion.Collapse>*/}
												</ListGroup.Item>
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={this.state.hover.search("勤務") !== -1 ? menuStyleHover : menuStyle} data-place="right" data-type="info" data-tip="" data-for="勤務" data-class="my-tabcolor"  data-effect="solid"
													 onMouseEnter={this.toggleHover.bind(this,"勤務")} onMouseLeave={this.toggleHover.bind(this,"")}>
													<Accordion.Toggle as={Button} variant="link" eventKey="6"><font
													className={this.state.hover.search("勤務") !== -1 ? "linkFont-click":"linkFont"} onClick={() => this.click('勤務')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faCalendar} /> 勤務</font></Accordion.Toggle>
													<ReactTooltip id="勤務"  delayUpdate={1000} getContent={() => {
														return <div>
														<ListGroup>
															<Accordion className="menuCol">
																<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"勤務-1")} onMouseLeave={this.toggleHover.bind(this,"勤務")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/dutyManagement'})} block>
																	<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/dutyManagement"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} /> 勤務管理</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"勤務-2")} onMouseLeave={this.toggleHover.bind(this,"勤務")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/sendRepot'})} block>
																	<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/sendRepot"><FontAwesomeIcon className="fa-fw" size="lg" icon={faCheckSquare} /> 報告書送信</Link></div>
																</ListGroup.Item>
															</Accordion>
														</ListGroup>
														</div>
														}}/>
													{/*<Accordion.Collapse eventKey="6">
														<ListGroup variant="flush">
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="勤務管理"?"linkFont-click":"linkFont"} onClick={() => this.click('勤務管理')} to="/subMenuManager/dutyManagement">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />勤務管理</Link></ListGroup.Item>
															<ListGroup.Item style={authorityCode === "3" ? menuStyle : menuStyle}><Link className={this.state.click==="報告書送信"?"linkFont-click":"linkFont"} onClick={() => this.click('報告書送信')} to="/subMenuManager/sendRepot">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCheckSquare} />報告書送信</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
												</ListGroup.Item>
												:
												null
										}
										{
											authorityCode !== "2" ? authorityCode !== "3" ?
												<ListGroup.Item style={this.state.hover.search("期限確認") !== -1 ? menuStyleHover : menuStyle} data-place="right" data-type="info" data-tip="" data-for="期限確認" data-class="my-tabcolor"  data-effect="solid"
													 onMouseEnter={this.toggleHover.bind(this,"期限確認")} onMouseLeave={this.toggleHover.bind(this,"")}>
													<Accordion.Toggle as={Button} variant="link" eventKey="7"><font
													className={this.state.hover.search("期限確認") !== -1 ? "linkFont-click":"linkFont"} onClick={() => this.click('期限確認')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faCalendarAlt} /> 期限確認</font></Accordion.Toggle>
													<ReactTooltip id="期限確認"  delayUpdate={1000} getContent={() => {
														return <div>
														<ListGroup>
															<Accordion className="menuCol">
																<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"期限確認-1")} onMouseLeave={this.toggleHover.bind(this,"期限確認")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/situationChange'})} block>
																	<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/situationChange"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} /> 状況変動一覧</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"期限確認-2")} onMouseLeave={this.toggleHover.bind(this,"期限確認")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/enterPeriodSearch'})} block>
																	<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/enterPeriodSearch"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} /> 期限一覧</Link></div>
																</ListGroup.Item>
															</Accordion>
														</ListGroup>
														</div>
														}}/>
													{/*<Accordion.Collapse eventKey="7">
														<ListGroup variant="flush">
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="状況変動一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('状況変動一覧')} to="/subMenuManager/situationChange">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />状況変動一覧</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="期限一覧"?"linkFont-click":"linkFont"} onClick={() => this.click('期限一覧')} to="/subMenuManager/enterPeriodSearch">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearchMinus} />期限一覧</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
												</ListGroup.Item>
												:
												null
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={this.state.hover.search("マスター") !== -1 ? menuStyleHover : menuStyle} data-place="right" data-type="info" data-tip="" data-for="マスター" data-class="my-tabcolor"  data-effect="solid"
													 onMouseEnter={this.toggleHover.bind(this,"マスター")} onMouseLeave={this.toggleHover.bind(this,"")}>
													<Accordion.Toggle as={Button} variant="link" eventKey="8"><font
													className={this.state.hover.search("マスター") !== -1 ? "linkFont-click":"linkFont"} onClick={() => this.click('マスター')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faThList} /> マスター</font></Accordion.Toggle>
													<ReactTooltip id="マスター"  delayUpdate={1000} getContent={() => {
														return <div>
														<ListGroup>
															<Accordion className="menuCol">
																<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"マスター-1")} onMouseLeave={this.toggleHover.bind(this,"マスター")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/masterInsert'})} block>
																	<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/masterInsert"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} /> マスター登録</Link></div>
																</ListGroup.Item>
																<ListGroup.Item style={this.state.hover.search("2") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"マスター-2")} onMouseLeave={this.toggleHover.bind(this,"マスター")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/masterUpdate'})} block>
																	<div><Link className={this.state.hover.search("2") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/masterUpdate"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} /> マスター修正</Link></div>
																</ListGroup.Item>
															</Accordion>
														</ListGroup>
														</div>
														}}/>
													{/*<Accordion.Collapse eventKey="8">
														<ListGroup variant="flush">
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="マスター登録"?"linkFont-click":"linkFont"} onClick={() => this.click('マスター登録')} to="/subMenuManager/masterInsert">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />マスター登録</Link></ListGroup.Item>
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="マスター修正"?"linkFont-click":"linkFont"} onClick={() => this.click('マスター修正')} to="/subMenuManager/masterUpdate">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />マスター修正</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
												</ListGroup.Item>
												:
												null
										}
										{
											authorityCode !== "2" ?
												<ListGroup.Item style={this.state.hover.search("他の設定") !== -1 ? menuStyleHover : menuStyle} data-place="right" data-type="info" data-tip="" data-for="他の設定" data-class="my-tabcolor"  data-effect="solid"
													 onMouseEnter={this.toggleHover.bind(this,"他の設定")} onMouseLeave={this.toggleHover.bind(this,"")}>
													<Accordion.Toggle as={Button} variant="link" eventKey="9"><font
													className={this.state.hover.search("他の設定") !== -1 ? "linkFont-click":"linkFont"} onClick={() => this.click('他の設定')}><FontAwesomeIcon className="fa-fw" size="lg" icon={faCogs} /> 他の設定</font></Accordion.Toggle>
													<ReactTooltip id="他の設定"  delayUpdate={1000} getContent={() => {
														return <div>
														<ListGroup>
															<Accordion className="menuCol">
																<ListGroup.Item style={this.state.hover.search("1") !== -1 ? subMenuHover : subMenu} onMouseEnter={this.toggleHover.bind(this,"他の設定-1")} onMouseLeave={this.toggleHover.bind(this,"他の設定")} onClick={this.shuseiTo.bind(this,{ pathname: '/subMenuManager/systemSet'})} block>
																	<div><Link className={this.state.hover.search("1") !== -1 ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to="/subMenuManager/systemSet"><FontAwesomeIcon className="fa-fw" size="lg" icon={faCog} /> システム設定</Link></div>
																</ListGroup.Item>
															</Accordion>
														</ListGroup>
														</div>
														}}/>
													{/*<Accordion.Collapse eventKey="9">
														<ListGroup variant="flush">
															<ListGroup.Item style={menuStyle}><Link className={this.state.click==="システム設定"?"linkFont-click":"linkFont"} onClick={() => this.click('システム設定')} to="/subMenuManager/systemSet">
																<FontAwesomeIcon className="fa-fw" size="lg" icon={faCog} />システム設定</Link></ListGroup.Item>
														</ListGroup>
													</Accordion.Collapse>*/}
												</ListGroup.Item>
												:
												null
										}
									</Accordion>
								</ListGroup>
							</Col>
						</Row>
					</Col>
					<Col sm={9} id="page" style={{ "backgroundColor": this.state.backgroundColor }}>
						<div key={this.props.location.key}>
							<br />
							<Router>
								<Route exact path={`${this.props.match.url}/`} component={EmployeeSearch} />
								<Route exact path={`${this.props.match.url}/employeeInsert`} component={EmployeeInsert} />
								<Route exact path={`${this.props.match.url}/employeeInsertNew`} component={EmployeeInsertNew} />
								<Route exact path={`${this.props.match.url}/employeeSearch`} component={EmployeeSearch} />
								<Route exact path={`${this.props.match.url}/employeeInformation`} component={EmployeeInformation} />
								<Route exact path={`${this.props.match.url}/certificatePrinting`} component={CertificatePrinting} />
								<Route exact path={`${this.props.match.url}/envelopePrinting`} component={EnvelopePrinting} />
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
								<Route exact path={`${this.props.match.url}/sendLettersMatter`} component={sendLettersMatter} />
								<Route exact path={`${this.props.match.url}/sendRepotConfirm`} component={sendRepotConfirm} />
								<Route exact path={`${this.props.match.url}/situationChange`} component={situationChange} />
								<Route exact path={`${this.props.match.url}/employeeUpdate`} component={EmployeeUpdate} />
								<Route exact path={`${this.props.match.url}/employeeUpdateNew`} component={EmployeeUpdateNew} />
								<Route exact path={`${this.props.match.url}/employeeDetail`} component={EmployeeDetail} />
								<Route exact path={`${this.props.match.url}/employeeDetailNew`} component={EmployeeDetailNew} />
								<Route exact path={`${this.props.match.url}/projectInfo`} component={projectInfo} />
								<Route exact path={`${this.props.match.url}/projectInfoSearch`} component={ProjectInfoSearch} />
								<Route exact path={`${this.props.match.url}/individualCustomerSales`} component={IndividualCustomerSales} />
								<Route exact path={`${this.props.match.url}/customerSalesList`} component={customerSalesList} />
								<Route exact path={`${this.props.match.url}/systemSet`} component={systemSet} />
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

