import React,{Component} from 'react';
import { Row,  Col, Nav  , ListGroup , Dropdown , Card , Accordion , Button , Navbar} from 'react-bootstrap';

import title from '../asserts/images/title.png';
import open from '../asserts/images/打开.png';
import openPage from '../asserts/images/打开页面.png';
import menu from '../asserts/images/菜单.png';
import signout from '../asserts/images/登出.png';

import { BrowserRouter as Router, Route, Link ,Switch } from "react-router-dom";
import Subcost from './subCost'
import Main from './main';
import MainAdd from './mainAdd';
import MainSearch from './mainSearch';
import BankInfo from './bankInfo';
import CustomerInfo from './CustomerInfo';
import TopCustomerInfo from './topCustomerInfo';
import TechnologyTypeMaster from './technologyTypeMaster';
import CustomerInfoSearch from './customerInfoSearch';
import $ from 'jquery';

class SubMenu extends Component {
    state = {
        nowDate:'',
    }
    componentDidMount(){
        var dateNow = new Date();
        let month = dateNow.getMonth() + 1;
        this.setState({
            nowDate:(dateNow.getFullYear() + '年' + (month < 10 ? '0'+month: month) + '月'),
        })
        document.getElementById("kanriSha").innerHTML = sessionStorage.getItem('authorityProperty') + "：" + sessionStorage.getItem('employeeName');
    }

    render() {
        var customerInfoPath = {
            pathname:'/subMenu/customerInfo',state:"tsuika",
          }
        var topCustomerInfoPath = {
            pathname:'/subMenu/topCustomerInfo',state:"tsuika",
        }
        return (
            <div>
                <Row>
                    <Col sm={5}></Col>
                    <Col sm={7}>
                        <img className="mb-4" alt="title" src={title}/>
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
                        <Link to="/" id="logout"><img alt="title" src={signout}/>sign out</Link>
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
                <hr style={{height:"1px",border:"none",borderTop:"1px solid #555555"}} /> 
                    <Row>
                        <Col sm={2} >
                        <h4 style={{backgroundColor:"#dfb763"}}><img alt="title" src={menu}/>メニュー一覧</h4>
                        <br/>
                        
                        <ListGroup>
                                <Accordion >
                                <ListGroup.Item variant="secondary" block>
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0"><img alt="title" src={openPage}/>社員管理関連</Accordion.Toggle>
                                            <Accordion.Collapse eventKey="0">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item variant="secondary"><Link to="/subMenu/add"><img alt="title" src={open}/>社員情報登録</Link></ListGroup.Item>
                                                    <ListGroup.Item variant="secondary"><Link to="/subMenu/mainSearch"><img alt="title" src={open}/>社員情報検索</Link></ListGroup.Item>
                                                    <ListGroup.Item variant="secondary"><Link to="/subMenu/bankInfo"><img alt="title" src={open}/>現場情報登録</Link></ListGroup.Item>
                                                    <ListGroup.Item variant="secondary"><Link to="/subMenu/add"><img alt="title" src={open}/>単価情報検索</Link></ListGroup.Item>
                                                </ListGroup>
                                            </Accordion.Collapse>
                                </ListGroup.Item>
                                <ListGroup.Item variant="secondary">
                                            <Accordion.Toggle as={Button} variant="link" eventKey="1"><img alt="title" src={openPage}/>お客様関連</Accordion.Toggle>
                                            <Accordion.Collapse eventKey="1">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item variant="secondary"><Link to={customerInfoPath}><img alt="title" src={open}/>お客様情報登録</Link></ListGroup.Item>
                                                    <ListGroup.Item variant="secondary"><Link to={topCustomerInfoPath}><img alt="title" src={open}/>トップお客様登録</Link></ListGroup.Item>
                                                    <ListGroup.Item variant="secondary"><Link to="/subMenu/customerInfoSearch"><img alt="title" src={open}/>お客様情報検索</Link></ListGroup.Item>
                                                </ListGroup>
                                            </Accordion.Collapse>

                                </ListGroup.Item>
                                <ListGroup.Item variant="secondary">
                                            <Accordion.Toggle as={Button} variant="link" eventKey="2"><img alt="title" src={openPage}/>給料と単価関連</Accordion.Toggle>
                                            <Accordion.Collapse eventKey="2">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item variant="secondary"><Link><img alt="title" src={open}/>単価変動一覧</Link></ListGroup.Item>
                                                    <ListGroup.Item variant="secondary"><Link><img alt="title" src={open}/>月次売上</Link></ListGroup.Item>                                                
                                                    </ListGroup>
                                            </Accordion.Collapse>
                                </ListGroup.Item>
                                <ListGroup.Item variant="secondary">
                                            <Accordion.Toggle as={Button} variant="link" eventKey="3"><img alt="title" src={openPage}/>営業送信</Accordion.Toggle>
                                            <Accordion.Collapse eventKey="3">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item variant="secondary"><Link><img alt="title" src={open}/>要員送信</Link></ListGroup.Item>
                                                    <ListGroup.Item variant="secondary"><Link><img alt="title" src={open}/>案件情報送信</Link></ListGroup.Item>                                                
                                                    </ListGroup>
                                            </Accordion.Collapse>
                                </ListGroup.Item>
                                <ListGroup.Item variant="secondary">
                                            <Accordion.Toggle as={Button} variant="link" eventKey="4"><img alt="title" src={openPage}/>非稼働関連</Accordion.Toggle>
                                            <Accordion.Collapse eventKey="4">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item variant="secondary"><Link><img alt="title" src={open}/>非待機一覧</Link></ListGroup.Item>                                             
                                                    </ListGroup>
                                            </Accordion.Collapse>
                                </ListGroup.Item>
                                <ListGroup.Item variant="secondary">
                                            <Accordion.Toggle as={Button} variant="link" eventKey="5"><img alt="title" src={openPage}/>マスタ登録</Accordion.Toggle>
                                            <Accordion.Collapse eventKey="5">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item variant="secondary"><Link to="/subMenu/technologyTypeMaster"><img alt="title" src={open}/>言語マスター</Link></ListGroup.Item>  
                                                    <ListGroup.Item variant="secondary"><Link><img alt="title" src={open}/>資格マスター</Link></ListGroup.Item>     
                                                    <ListGroup.Item variant="secondary"><Link><img alt="title" src={open}/>部署マスター</Link></ListGroup.Item>                                        
                                                    </ListGroup>
                                            </Accordion.Collapse>
                                </ListGroup.Item>
                                <ListGroup.Item variant="secondary">
                                            <Accordion.Toggle as={Button} variant="link" eventKey="6"><img alt="title" src={openPage}/>他の設定</Accordion.Toggle>
                                            <Accordion.Collapse eventKey="6">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item variant="secondary"><Link to="/subMenu/technologyTypeMaster"><img alt="title" src={open}/>システム設定</Link></ListGroup.Item>  
                                                    <ListGroup.Item variant="secondary"><Link to="/subMenu/passwordReset"><img alt="title" src={open}/>パースワードリセット</Link></ListGroup.Item> 
                                                </ListGroup>
                                            </Accordion.Collapse>
                                </ListGroup.Item>
                                </Accordion>
                        </ListGroup>   
                        </Col>
                        <div style={{float:"left",width: "1px",height: "650px",background:"darkgray"}}></div>
                        {/* <Container> */}
                        <Col sm={9} id="page">
                            <div key={this.props.location.key}>
                                <Router>
                                    <Route exact path={`${this.props.match.url}/`} component={Main} />
                                    <Route exact path={`${this.props.match.url}/passwordReset`} component={Subcost} />
                                    <Route exact path={`${this.props.match.url}/add`} component={MainAdd} />
                                    <Route exact path={`${this.props.match.url}/mainSearch`} component={MainSearch} />
                                    <Route exact path={`${this.props.match.url}/bankInfo`} component={BankInfo} />
                                    <Route exact path={`${this.props.match.url}/customerInfo`} component={CustomerInfo} />
                                    <div className="container col-8">
                                    <div className="container col-10">
                                        <Route exact path={`${this.props.match.url}/topCustomerInfo`} component={TopCustomerInfo} />
                                        <Route exact path={`${this.props.match.url}/technologyTypeMaster`} component={TechnologyTypeMaster} />
                                    </div>
                                    </div>
                                    <Route exact path={`${this.props.match.url}/customerInfoSearch`} component={CustomerInfoSearch} />
                                    
                                </Router>
                            </div>
                        </Col>
                        {/* </Container> */}
                    </Row>
                <br/>
            </div>
        );
    }
}

export default SubMenu;