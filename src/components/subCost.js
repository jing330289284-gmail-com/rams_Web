import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl , OverlayTrigger , Popover} from 'react-bootstrap';
import * as SubCostJs from '../components/subCostJs.js';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';

registerLocale('ja', ja);

class SubCost extends Component {

    state = {
        bonusStartDate: new Date(),//ボーナスの期日
        raiseStartDate: new Date(),//昇給の期日
        RelatedEmployees:'',//要員
    }
    /**
     * ボーナス期日の変化
     */
    bonusChange = date => {
    this.setState({
        bonusStartDate: date,
    });
    $("#NextBonusMonth").val(date.getMonth() + 1);
    
    };
    /**
     * 昇給期日の変化
     */
    raiseChange = date => {
    this.setState({
        raiseStartDate: date,
    });
    $("#NextRaiseMonth").val(date.getMonth() + 1);
    };
     /**
     * 画面の初期化
     */
    componentDidMount(){
      var employeeNo = sessionStorage.getItem('employeeNo');
      var shoriKbn = sessionStorage.getItem('shoriKbn');
      $("#employeeNo").val("LYC001")
      $("#shoriKbn").val("shusei")
      if($("#shoriKbn").val() === "shosai"){
        SubCostJs.onloadPage();
        SubCostJs.setDisabled();
      }else if($("#shoriKbn").val() === "shusei"){
        SubCostJs.onloadPage();
      }
    }
    /**
     * 要員の内容
     */
    setYouin=()=>{
        this.setState({
            RelatedEmployees:$("#RelatedEmployees").val()
        })
    }
    render() {
        const {RelatedEmployees} = this.state;
        return (
          <div className="container col-10" style={{"background":"#f5f5f5"}}>
          <div className="container col-7" style={{"background":"#f5f5f5"}}>
            <Form id="costForm">
              <Form.Group>
              {/* <Row>
                    <Col sm={3}></Col>
                    <Col sm={7}>
                        <img className="mb-4" alt="title" src={title}/>
                    </Col>
              </Row> */}
              <Row inline="true">
                <Col  className="text-center">
                 <h2>諸費用</h2>
                </Col>
              </Row>
              <Row>
                        <Col sm={3}>
                        </Col>
                        <Col sm={7}>
                        <p id="subCostErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★</p>
                        </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                    <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社員給料</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="salary" name="salary" maxLength="6" 
                            onChange={SubCostJs.totalKeisan} placeholder="給料" aria-label="Small" aria-describedby="inputGroup-sizing-sm" /><font id="mark" color="red"
				                style={{marginLeft: "10px",marginRight: "10px"}}>★</font>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社会保险</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="select" id="SocialInsuranceFlag" name="SocialInsuranceFlag" onChange={SubCostJs.jidoujisan}>
                                <option value="1">なし</option>
                                <option value="0">あり</option>
                            </FormControl>
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">厚生</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="welfarePensionAmount" onChange={SubCostJs.totalKeisan} name="welfarePensionAmount" readOnly maxLength="5" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">健康</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="healthInsuranceAmount" onChange={SubCostJs.totalKeisan} name="healthInsuranceAmount" readOnly aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">総額</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="InsuranceFeeAmount" onChange={SubCostJs.totalKeisan} name="InsuranceFeeAmount" readOnly aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">交通費</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="TransportationExpenses" onChange={SubCostJs.totalKeisan} name="TransportationExpenses" maxLength="5" type="text" placeholder="交通費" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">ボーナス：</InputGroup.Text>
                            </InputGroup.Prepend>
                                <FormControl as="select" id="BonusFlag" name="BonusFlag" onChange={SubCostJs.bonusCanInput}> 
                                    <option value="1">なし</option>
                                    <option value="0">あり</option>
                                </FormControl>
                            </InputGroup>
                    </Col>
                    <Col sm={5}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">前回額</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="lastTimeBonusAmount" onChange={SubCostJs.totalKeisan} readOnly name="lastTimeBonusAmount" maxLength="7" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">予定額</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="scheduleOfBonusAmount" onChange={SubCostJs.totalKeisan} readOnly name="scheduleOfBonusAmount" maxLength="7" placeholder="予定額" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">非稼働費用</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="WaitingCost" onChange={SubCostJs.totalKeisan} readOnly name="WaitingCost" maxLength="6" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">次のボーナス月</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="NextBonusMonth" name="NextBonusMonth"  maxLength="2" readOnly/>
                            <InputGroup.Append>
                            <DatePicker
                                selected={this.state.bonusStartDate}
                                onChange={this.bonusChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="on"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                minDate={new Date()}
                                showDisabledMonthNavigation
                                className={"dateInput"}
                                id="NextBonusDate"
                                locale="ja"
                                />
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">次回に昇給月</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="NextRaiseMonth" name="NextRaiseMonth" maxLength="2" readOnly/>
                            <InputGroup.Append>
                            <DatePicker
                                selected={this.state.raiseStartDate}
                                onChange={this.raiseChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="on"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                minDate={new Date()}
                                showDisabledMonthNavigation
                                className={"dateInput"}
                                id="NextBonusDate"
                                locale="ja"
                                />
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">リーダ手当</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="leaderAllowanceAmount" onChange={SubCostJs.totalKeisan} readOnly maxLength="6" name="leaderAllowanceAmount" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <OverlayTrigger
                                trigger="click"
                                key={"top"}
                                placement={"top"}
                                overlay={
                                    <Popover>
                                    <Popover.Content>
                                        <a >{RelatedEmployees}</a>
                                    </Popover.Content>
                                    </Popover>
                                }
                                >
                                <Button size="sm" id="youin" onClick={this.setYouin}>要員</Button>
                            </OverlayTrigger>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">他の手当</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="otherAllowance" maxLength="20" name="otherAllowance" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <FormControl id="otherAllowanceAmount" onChange={SubCostJs.totalKeisan} maxLength="6" name="otherAllowanceAmount" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">円</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="remark" name="remark" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">総額</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="totalAmount" maxLength="7" name="totalAmount" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">円</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={4}></Col>
                    <Col sm={2} className="text-center">
                            <Button block size="sm" onClick = {SubCostJs.tokuro} variant="primary" id="toroku" className="col-offset-1" type="button">
                            登録
                            </Button>
                    </Col>
                    <Col sm={2} className="text-center">
                            <Button block size="sm" type="reset" id="reset" value="Reset" >
                            リセット
                            </Button>
                            
                    </Col>
                </Row>
            </Form.Group>
            <input type="hidden" id="employeeNo" name="employeeNo"/>
            <input type="hidden" id="shoriKbn" name="shoriKbn"/>
            <input type="hidden" id="RelatedEmployees" name="RelatedEmployees"/>
          </Form>
          </div>
          </div>
        )
    }
}

export default SubCost;

