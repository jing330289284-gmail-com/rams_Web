import React, { Component } from 'react';
import { Row, Col, ListGroup, Accordion, Button, Navbar, Container } from 'react-bootstrap';
import title from '../asserts/images/LYCmark.png';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PasswordSetEmployee from './passwordSetEmployee';
import workRepot from './workRepot';
import costRegistration from './costRegistration';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faFile , faUser , faFileExcel , faFileWord , faSearch , faSave , faThList} from '@fortawesome/free-solid-svg-icons';
import '../asserts/css/subMenu.css';
import DutyRegistration from './dutyRegistration';
import store from './redux/store';
axios.defaults.withCredentials = true;

/**
 * サブメニュー画面（社員用）
 */
class SubMenu extends Component {
    state = {
        nowDate: '',//今の期日
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
    }
    async componentWillMount() {
        await axios.post(this.state.serverIP + "subMenuEmployee/init")
            .then(resultMap => {
                if (resultMap.data !== null && resultMap.data !== '') {
                    document.getElementById("kanriSha").innerHTML = "社員" + "：" + resultMap.data["employeeName"];
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
        axios.post(this.state.serverIP + "subMenuEmployee/logout")
            .then(resultMap => {
                alert("ログアウトしました");
            })
    }
    render() {
        //お客様情報画面の追加パラメータ
        var customerInfoPath = {
            pathname: '/subMenuEmployee/customerInfo', state: { actionType: 'insert' },
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
                                            <Accordion.Toggle as={Link} to="/subMenuEmployee/passwordSetEmployee" style={{"marginLeft":"6%"}}>
                                                <font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faHistory} />PWリセット</font></Accordion.Toggle>
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ "backgroundColor": "#1a94a8" }} block>
                                            <Accordion.Toggle as={Link} to="/subMenuEmployee/" style={{"marginLeft":"6%"}}>
                                                <font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faThList} />勤務時間入力</font></Accordion.Toggle>
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ "backgroundColor": "#17a2b8" }} block>
                                            <Accordion.Toggle as={Link} style={{"marginLeft":"6%"}}>
                                                <font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSave} />費用登録</font></Accordion.Toggle>
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ "backgroundColor": "#1a94a8" }} block>
                                            <Accordion.Toggle as={Link} style={{"marginLeft":"6%"}}>
                                                <font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faSearch} />履歴検索</font></Accordion.Toggle>
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                <font className="linkFont"><FontAwesomeIcon className="fa-fw" size="lg" icon={faFile} />ファイル管理</font></Accordion.Toggle>
                                            <Accordion.Collapse eventKey="1">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
                                                        <Link className="linkFont" to="/subMenuManager/workRepot/">
                                                            <FontAwesomeIcon className="fa-fw" size="lg" icon={faFileExcel} />作業報告書</Link></ListGroup.Item>
                                                    <ListGroup.Item style={{ "backgroundColor": "#17a2b8" }}>
                                                        <Link className="linkFont" to="/subMenuManager/costRegistration/">
                                                            <FontAwesomeIcon className="fa-fw" size="lg" icon={faFileWord} />履歴書</Link></ListGroup.Item>
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
                                <Route exact path={`${this.props.match.url}/`} component={DutyRegistration} />
                                <Route exact path={`${this.props.match.url}/passwordSetEmployee`} component={PasswordSetEmployee} />
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
