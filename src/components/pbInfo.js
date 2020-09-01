import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl , OverlayTrigger , Popover , Navbar} from 'react-bootstrap';
import $, { isNumeric } from 'jquery';
import * as publicUtils from './utils/publicUtils.js';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker"
import { faSave, faUndo, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as utils from './utils/publicUtils.js';

class pbInfo extends React.Component {
    state = { 
	    customerName:[],//BP所属
		bpSalesProgress:[],//営業状況
		bpBelongCustomerCode:'',//選択中のBP所属
        bpUnitPrice: '',//単価
		bpSalesProgressCode: '',//選択中の営業状況
        bpOtherCompanyAdmissionEndDate:'',//所属現場終年月
        bpRemark:'',//備考
		pbInfo:'',//入力データ
		actionType:'',//処理区分
     }
     constructor(props){
        super(props);
    }
	//　　所属現場退場年月
	bpOtherCompanyAdmissionEndDateChange = (date) => {
		this.setState(
			{
				bpOtherCompanyAdmissionEndDate: date,
				temporary_retirementYearAndMonth: publicUtils.getFullYearMonth(date, new Date()),

			}
		);
	};
    /**
     * 画面初期化
     */
    componentDidMount(){
	    var actionType = this.props.actionType;//父画面のパラメータ（処理区分）
		var pbInfo = this.props.pbInfo;//父画面のパラメータ（画面既存諸費用情報）
//営業状況リスト取得
	    var bpSalesProgress = utils.getdropDown("getSalesProgress");
        for(let i = 1;i<bpSalesProgress.length ; i++){
            $("#bpSalesProgressCode").append('<option value="'+bpSalesProgress[i].code+'">'+bpSalesProgress[i].name+'</option>');
        }
 		$("#bpSalesProgressCode").find("option[value='4']").attr("selected",true);
            if(this.props.employeeFristName===undefined||this.props.employeeLastName===undefined){
                $('#pbInfoEmployeeName').val(" "); 
             }else{
                 document.getElementById("pbInfoEmployeeName").innerHTML =  this.props.employeeFristName + this.props.employeeLastName;
                }
    if(!$.isEmptyObject(pbInfo)){
		$("#bpBelongCustomerCode").val(pbInfo.bpBelongCustomerCode);
        $("#bpUnitPrice").val(pbInfo.bpUnitPrice);
		$("#bpSalesProgressCode").val(pbInfo.bpSalesProgressCode);
		 this.setState({
            bpOtherCompanyAdmissionEndDate:utils.converToLocalTime(pbInfo.bpOtherCompanyAdmissionEndDate,false),
        })

		$("#bpRemark").val(pbInfo.bpRemark);
		}    
	}
    /**
 	* 登録ボタン
     */
    pbInfoTokuro=()=>{
			var pbInfo = {};
          	pbInfo["bpBelongCustomerCode"] = $("#bpBelongCustomerCode").val();
            pbInfo["bpUnitPrice"] = $("#bpUnitPrice").val();
            pbInfo["bpSalesProgressCode"] = $("#bpSalesProgressCode").val();
            pbInfo["bpOtherCompanyAdmissionEndDate"] = utils.formateDate(this.state.bpOtherCompanyAdmissionEndDate,false);
            pbInfo["bpRemark"] = $("#bpRemark").val();
            this.props.pbInfoTokuro(pbInfo);
	}
	reset=()=>{
	  $("#bpBelongCustomerCode").val("");
	  $("#bpUnitPrice").val("");
	  $("#bpSalesProgressCode").val("4");
	  $("#bpRemark").val("");
	}
    render() {
	const { actionType} = this.state;
        return (
            <div>
                <Row inline="true">
                    <Col  className="text-center">
                    <h2>BP情報入力</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                    </Col>
                    <Col sm={7}>
                    <p id="pbInfoSetErorMsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger">★</p>
                    </Col>
                </Row>
                <Form id="pbInfoSetForm">
                <Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                        BP社員名：
                                <a id="pbInfoEmployeeName" name="pbInfoEmployeeName"></a>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                    	<InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">BP所属{'\u00A0'}{'\u00A0'}{'\u00A0'}</InputGroup.Text>
						        <Form.Control type="text" id="bpBelongCustomerCode"a name="bpBelongCustomerCode" />
                      		</InputGroup.Prepend>
						</InputGroup>
	                </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="inputGroup-sizing-sm">BP単価{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</InputGroup.Text>
	                 	        <Form.Control type="text" id="bpUnitPrice"a name="bpUnitPrice" maxlength='5'/>
								<InputGroup.Text id="inputGroup-sizing-sm">万円</InputGroup.Text>
							</InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="pbInfoSetText">営業状況</InputGroup.Text>
								<Form.Control id="bpSalesProgressCode" name="bpSalesProgressCode" as="select" >
                          		</Form.Control>
                            </InputGroup.Prepend> 
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="pbInfoSetText">所属現場終年月</InputGroup.Text>                       
	                           <InputGroup.Append>
	                            <DatePicker
	                                selected={this.state.bpOtherCompanyAdmissionEndDate}
	                                onChange={this.bpOtherCompanyAdmissionEndDateChange}
	                                dateFormat={"yyyy MM"}
	                                autoComplete="off"
	                                locale="pt-BR"
	                                showMonthYearPicker
	                                showFullMonthYearPicker
	                                // minDate={new Date()}
	                                showDisabledMonthNavigation
	                                className="form-control form-control-sm"
	                                id="customerInfoDatePicker"
	                                placeholderText="期日を選択してください"
	                                dateFormat={"yyyy/MM"}
	                                name="bpOtherCompanyAdmissionEndYearAndMonth"
	                                locale="ja"
	                                disabled={actionType === "detail" ? true : false}
	                                />
	                            </InputGroup.Append>
							</InputGroup.Prepend>                        
						</InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">備考{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}</InputGroup.Text>
                                <FormControl id="bpRemark" placeholder="例：XXXXX" name="bpRemark" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        	</InputGroup.Prepend>
                        </InputGroup>                       
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}></Col>
                        <Col sm={3} className="text-center">
                                <Button block size="sm" onClick={this.pbInfoTokuro.bind(this)} variant="info" id="toroku" type="button">
                                <FontAwesomeIcon icon={faEdit} />登録
                                </Button>
                        </Col>
                        <Col sm={3} className="text-center">
                                <Button  block size="sm" id="reset" type="reset" variant="info" value="Reset" onclick="reset">
                                <FontAwesomeIcon icon={faEdit} />リセット
                                </Button>
                        </Col>
                </Row>
                </Form>
            </div>
        );
    }
}

export default pbInfo;