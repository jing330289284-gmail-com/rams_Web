import React, { Component } from 'react';
import { Row, Col, ListGroup, Accordion, Button, Navbar } from 'react-bootstrap';

import title from '../asserts/images/title.png';
import open from '../asserts/images/open.png';
import openPage from '../asserts/images/openPage.png';
import menu from '../asserts/images/menu.png';
import signout from '../asserts/images/signout.png';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Subcost from './subCost'
import Main from './main';
import Employee from './employee';
import EmployeeSearch from './employeeSearch';
import BankInfo from './bankInfo';
import CustomerInfo from './customerInfo';
import TopCustomerInfo from './topCustomerInfo';
import masterInsert from './masterInsert';
import CustomerDepartmentTypeMaster from './customerDepartmentTypeMaster';
import CustomerInfoSearch from './customerInfoSearch';
import siteInfo from './siteInfo';
import ManageSituation from './manageSituation';
import siteSearch from './siteSearch';
import PasswordSet from './passwordSet';
import GyoumuTouroku from './gyoumuTouroku';
import Kyuukei from './kyuukei';

class SubMenu extends Component {
	state = {
		nowDate: '',//今の期日
	}
    /**
     * 画面の初期化
     */
	componentDidMount() {
		var dateNow = new Date();
		let month = dateNow.getMonth() + 1;
		this.setState({
			nowDate: (dateNow.getFullYear() + '年' + (month < 10 ? '0' + month : month) + '月'),
		})
		document.getElementById("kanriSha").innerHTML = sessionStorage.getItem('authorityName') + "：" + sessionStorage.getItem('employeeName');
	}
	render() {
		//お客様情報画面の追加パラメータ
		var customerInfoPath = {
			pathname: '/subMenu/customerInfo', state: { actionType: 'insert' },
		}
		//社員情報登録
		var passwordSetPath = {
			pathname: '/subMenu/passwordSet', state: { actionType: 'update', fatherMenu: 'subMenu' },
		}
		return (
			<div>
				<Row>
					<Col sm={5}></Col>
					<Col sm={7}>
						<img className="mb-4" alt="title" src={title} />
					</Col>
				</Row>
				<Row>
					<Col sm={5}></Col>
					<Col sm={5}>
						<h1>
							売上請求管理システム
                        </h1>
					</Col>
					<Col sm={1}>
					</Col>
					<Col sm={1}>
						<Link to="/" id="logout"><img alt="title" src={signout} />sign out</Link>
					</Col>
				</Row>
				<Row>
					<Col sm={1}>
					</Col>
					<Col>
						<Navbar>
							<Navbar.Brand>{this.state.nowDate}</Navbar.Brand>
							<Navbar.Toggle />
							<Navbar.Collapse>
								<Navbar.Text>
									<a id="kanriSha"></a>
								</Navbar.Text>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				{/* <Row className="clearfix" style={{marginBottom: "10px"}}>
                    <Col sm={2}></Col>
                    <Col sm={7}>
                    <Form.Group >
                        <Form.Label column sm="2">
                        年月日
                        </Form.Label>
                    </Form.Group>
                    </Col>
                </Row> */}
				<hr style={{ height: "1px", border: "none", borderTop: "1px solid #555555" }} />
				<Row>
					<Col sm={2} >
						<h4 style={{ backgroundColor: "#dfb763" }}><img alt="title" src={menu} />メニュー一覧</h4>
						<br />

						<ListGroup>
							<Accordion >
								<ListGroup.Item variant="secondary" block>
									<Accordion.Toggle as={Button} variant="link" eventKey="0"><img alt="title" src={openPage} />社員管理</Accordion.Toggle>
									<Accordion.Collapse eventKey="0">
										<ListGroup variant="flush">
											<ListGroup.Item variant="secondary"><Link to={{ pathname: '/subMenu/employee', state: { actionType: 'insert' } }}><img alt="title" src={open} />社員情報登録</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link to="/subMenu/employeeSearch"><img alt="title" src={open} />社員情報検索</Link></ListGroup.Item>
										</ListGroup>
									</Accordion.Collapse>
								</ListGroup.Item>
								<ListGroup.Item variant="secondary" block>
									<Accordion.Toggle as={Button} variant="link" eventKey="1"><img alt="title" src={openPage} />現場</Accordion.Toggle>
									<Accordion.Collapse eventKey="1">
										<ListGroup variant="flush">
											<ListGroup.Item variant="secondary"><Link to="/subMenu/siteInfo"><img alt="title" src={open} />現場情報登録</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link to="/subMenu/siteSearch"><img alt="title" src={open} />現場情報検索</Link></ListGroup.Item>
										</ListGroup>
									</Accordion.Collapse>
								</ListGroup.Item>
								<ListGroup.Item variant="secondary">
									<Accordion.Toggle as={Button} variant="link" eventKey="2"><img alt="title" src={openPage} />お客様</Accordion.Toggle>
									<Accordion.Collapse eventKey="2">
										<ListGroup variant="flush">
											<ListGroup.Item variant="secondary"><Link to={customerInfoPath}><img alt="title" src={open} />お客様情報登録</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link to="/subMenu/customerInfoSearch"><img alt="title" src={open} />お客様情報検索</Link></ListGroup.Item>
										</ListGroup>
									</Accordion.Collapse>
								</ListGroup.Item>
								<ListGroup.Item variant="secondary">
									<Accordion.Toggle as={Button} variant="link" eventKey="3"><img alt="title" src={openPage} />給料と単価</Accordion.Toggle>
									<Accordion.Collapse eventKey="3">
										<ListGroup variant="flush">
											<ListGroup.Item variant="secondary"><Link><img alt="title" src={open} />個人売上一覧</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link><img alt="title" src={open} />売上検索一覧</Link></ListGroup.Item>
										</ListGroup>
									</Accordion.Collapse>
								</ListGroup.Item>
								<ListGroup.Item variant="secondary">
									<Accordion.Toggle as={Button} variant="link" eventKey="4"><img alt="title" src={openPage} />営業送信</Accordion.Toggle>
									<Accordion.Collapse eventKey="4">
										<ListGroup variant="flush">
											<ListGroup.Item variant="secondary"><Link><img alt="title" src={open} />営業状況確認一覧</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link><img alt="title" src={open} />提案送信</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link to="/subMenu/manageSituation"><img alt="title" src={open} />営業状況確認一覧</Link></ListGroup.Item>
										</ListGroup>
									</Accordion.Collapse>
								</ListGroup.Item>
								<ListGroup.Item variant="secondary">
									<Accordion.Toggle as={Button} variant="link" eventKey="5"><img alt="title" src={openPage} />非稼働</Accordion.Toggle>
									<Accordion.Collapse eventKey="5">
										<ListGroup variant="flush">
											<ListGroup.Item variant="secondary"><Link><img alt="title" src={open} />非待機一覧</Link></ListGroup.Item>
										</ListGroup>
									</Accordion.Collapse>
								</ListGroup.Item>
								<ListGroup.Item variant="secondary">
									<Accordion.Toggle as={Button} variant="link" eventKey="6"><img alt="title" src={openPage} />マスター</Accordion.Toggle>
									<Accordion.Collapse eventKey="6">
										<ListGroup variant="flush">
											<ListGroup.Item variant="secondary"><Link to="/subMenu/customerDepartmentTypeMaster"><img alt="title" src={open} />部署マスター</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link to="/subMenu/masterInsert"><img alt="title" src={open} />マスター登録</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link to="/subMenu/customerDepartmentTypeMaster"><img alt="title" src={open} />マスター修正</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link to="/subMenu/customerDepartmentTypeMaster"><img alt="title" src={open} />マスター削除</Link></ListGroup.Item>
										</ListGroup>
									</Accordion.Collapse>
								</ListGroup.Item>
								<ListGroup.Item variant="secondary">
									<Accordion.Toggle as={Button} variant="link" eventKey="7"><img alt="title" src={openPage} />他の設定</Accordion.Toggle>
									<Accordion.Collapse eventKey="7">
										<ListGroup variant="flush">
											<ListGroup.Item variant="secondary"><Link to="/subMenu/masterInsert"><img alt="title" src={open} />システム設定</Link></ListGroup.Item>
										</ListGroup>
									</Accordion.Collapse>
								</ListGroup.Item>
								<ListGroup.Item variant="secondary">
									<Accordion.Toggle as={Button} variant="link" eventKey="8"><img alt="title" src={openPage} />勤務</Accordion.Toggle>
									<Accordion.Collapse eventKey="8">
										<ListGroup variant="flush">
											<ListGroup.Item variant="secondary"><Link to="/subMenu/gyoumuTouroku/"><img alt="title" src={open} />勤務登録</Link></ListGroup.Item>
											<ListGroup.Item variant="secondary"><Link to="/subMenu/"><img alt="title" src={open} />履歴検索</Link></ListGroup.Item>
										</ListGroup>
									</Accordion.Collapse>
								</ListGroup.Item>
							</Accordion>
						</ListGroup>
					</Col>
					<div style={{ float: "left", width: "1px", height: "650px", background: "darkgray" }}></div>
					{/* <Container> */}
					<Col sm={9} id="page">
						<div key={this.props.location.key}>
							<Router>
								<Route exact path={`${this.props.match.url}/`} component={Main} />
								<Route exact path={`${this.props.match.url}/passwordReset`} component={Subcost} />
								<Route exact path={`${this.props.match.url}/employee`} component={Employee} />
								<Route exact path={`${this.props.match.url}/employeeSearch`} component={EmployeeSearch} />
								<Route exact path={`${this.props.match.url}/bankInfo`} component={BankInfo} />
								<Route exact path={`${this.props.match.url}/customerInfo`} component={CustomerInfo} />
								<Route exact path={`${this.props.match.url}/siteInfo`} component={siteInfo} />
								<Route exact path={`${this.props.match.url}/siteSearch`} component={siteSearch} />
								<Route exact path={`${this.props.match.url}/customerInfoSearch`} component={CustomerInfoSearch} />
								<Route exact path={`${this.props.match.url}/manageSituation`} component={ManageSituation} />
								<Route exact path={`${this.props.match.url}/gyoumuTouroku`} component={GyoumuTouroku} />
								<Route exact path={`${this.props.match.url}/kyuukei`} component={Kyuukei} />
								<div className="container col-8">
									<div className="container col-10">
										<Route exact path={`${this.props.match.url}/topCustomerInfo`} component={TopCustomerInfo} />
										<Route exact path={`${this.props.match.url}/customerDepartmentTypeMaster`} component={CustomerDepartmentTypeMaster} />
										<Route exact path={`${this.props.match.url}/masterInsert`} component={masterInsert} />
										<Route exact path={`${this.props.match.url}/passwordSet`} component={PasswordSet} />
									</div>
								</div>
							</Router>
						</div>
					</Col>
					{/* </Container> */}
				</Row>
				<br />
			</div>
		);
	}
}

export default SubMenu;
