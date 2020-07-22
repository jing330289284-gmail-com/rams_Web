import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl} from 'react-bootstrap';
import * as SubCostJs from '../components/subCostJs.js';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';

registerLocale('ja', ja);

class SubCost extends Component {

    state = {
        bonusStartDate: new Date(),
        raiseStartDate: new Date(),
    }
    //日期更改
    bonusChange = date => {
    this.setState({
        bonusStartDate: date,
    });
    $("#NextBonusMonth").val(date.getMonth() + 1);
    
    };
      //日期更改
    raiseChange = date => {
    this.setState({
        raiseStartDate: date,
    });
    $("#NextRaiseMonth").val(date.getMonth() + 1);
    };
    // 页面加载
    componentDidMount(){
      var employeeNo = sessionStorage.getItem('employeeNo');
      var shoriKbn = sessionStorage.getItem('shoriKbn');
      $("#employeeNo").val("LYC001")
      $("#shoriKbn").val("tsuika")
      if($("#shoriKbn").val() === "shosai"){
        SubCostJs.onloadPage();
        SubCostJs.setDisabled();
      }else if($("#shoriKbn").val() === "shusei"){
        SubCostJs.onloadPage();
      }
    }
    render() {
        return (
          <div className="container col-10" style={{"background":"#f5f5f5"}}>
          <div className="container col-6" style={{"background":"#f5f5f5"}}>
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
              </Form.Group>
              <Form.Group>
                    <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">給料</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="salary" name="salary" maxLength="6" placeholder="給料" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社会保险</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Check defaultChecked={true}　label="あり" inline="true" type="radio" id="hokenCheckYes" name="SocialInsuranceFlag" value="0" onClick={SubCostJs.checkHave.bind(this,"SocialInsuranceFlag")}  />
                            <Form.Check label="なし" inline="true" type="radio" name="SocialInsuranceFlag" id="hokenCheckNo" value="1" onClick={SubCostJs.checkHave.bind(this,"SocialInsuranceFlag")}  />
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">保険料</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="InsuranceFee" name="InsuranceFee" readOnly maxLength="5" placeholder="保険料" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                                <Button id="jidokeisan" onClick={SubCostJs.jidoujisan} >自動計算</Button>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">待機費</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="WaitingCost" name="WaitingCost" maxLength="6" type="text" placeholder="待機費" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">ボーナス：</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Check label="あり" defaultChecked={true} inline="true" type="radio" id="bonusCheckYes" name="BonusFlag" value="0" onClick={SubCostJs.checkHave.bind(this,"BonusFlag")}  />
                            <Form.Check label="なし" inline="true" type="radio" id="bonusCheckNo" name="BonusFlag" value="1" onClick={SubCostJs.checkHave.bind(this,"BonusFlag")}  />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">ボーナス</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="BonusAmount" name="BonusAmount" maxLength="6" placeholder="ボーナス" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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
                            <FormControl id="TransportationExpenses" name="TransportationExpenses" maxLength="5" type="text" placeholder="交通費" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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
                    <Col sm={5}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">他の手当</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="otherAllowance" maxLength="20" name="otherAllowance" type="text" placeholder="手当名称" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <FormControl id="otherAllowanceAmount" maxLength="6" name="otherAllowanceAmount" type="text" placeholder="手当金額" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">円</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="remark" name="remark" type="text" placeholder="備考" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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
          </Form>
          </div>
          </div>
        )
    }
}

export default SubCost;

