import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , select, FormControl , Tooltip} from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import $ from 'jquery';
import SubCost from './costInfo';
import PbInfo from './pbInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autosuggest from 'react-autosuggest';
import { faSave, faUndo, faSearch , faEdit } from '@fortawesome/free-solid-svg-icons';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
class individualSales extends Component {
    state = { 
        actionType:'',
        employeeNo:'',
        fiscalYear:'',
        employeeFirstName:'',
        employeeLastName:'',
		individualSales_startYearAndMonth:'',
		individualSales_endYearAndMonth:'',
     }
     constructor(props){
		super(props);
		this.options = {
			defaultSortName: 'rowNo',
			defaultSortOrder: 'dsc',
			sizePerPage: 5,
			pageStartIndex: 1,
			paginationSize: 2,
			prePage: 'Prev',
			nextPage: 'Next',
			hideSizePerPage: true,
			alwaysShowAllBtns: true,
			paginationShowsTotal: this.renderShowsTotal,

		};
    }
	searchEmployee = () => {
		const empInfo = {
			employeeNo: this.state.employeeNo,
			employeeFirstName: this.state.employeeFirstName,
			employeeLastName: this.state.employeeLastName,
            fiscalYear:this.state.sysYear,
            startYearAndMonth:this.state.individualSales_startYearAndMonth,
            endYearAndMonth:this.state.individualSales_endYearAndMonth,
		};
		axios.post("http://127.0.0.1:8080/personalSales/searchEmpDetails", empInfo)
			.then(response => {
				if (response.data != null) {
					this.setState({ employeeList: response.data })
				} else {
					alert("err")
				}
			}
			);
    }
    	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	componentDidMount(){
		var date = new Date();
		var year = date.getFullYear();
		$('#sysYear').append('<option value="'+0+'">'+""+'</option>');
		for(var i=2019;i<=year;i++){
				$('#sysYear').append('<option value="'+i+'">'+i+'</option>');
			}
	}
	individualSalesStartYearAndMonthChange = date => {
        if(date !== null){
            this.setState({
                individualSales_startYearAndMonth: date,
            });
        }else{
            this.setState({
                individualSales_startYearAndMonth: '',
            });
        }
	};
	
	individualSalesEndYearAndMonthChange = date => {
        if(date !== null){
            this.setState({
                individualSales_endYearAndMonth: date,
            });
        }else{
            this.setState({
                individualSales_endYearAndMonth: '',
            });
        }
    };
render (){
        return(
            <div　style={{marginTop:"5%",marginLeft:"8%",marginRight:"8%"}}>
                <Row inline="true">
                     <Col  className="text-center">
                    <h2>個人売上検索</h2>
                    </Col> 
                </Row>
				<Row>
				<Col sm={2}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">年度</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="sysYear" as="select" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.valueChange}/>
                        </InputGroup>
                    </Col>
				</Row>
				<Row>
                <Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text></InputGroup.Prepend>
									<FormControl placeholder="社員氏" size="sm" name="employeeFirstName" value={this.state.employeeFirstName} onChange={this.valueChange} maxlength="3" />{' '}
									<FormControl placeholder="社員名" size="sm" name="employeeLastName" value={this.state.employeeLastName} onChange={this.valueChange}  maxlength="3" />
                                    <font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
                    <Col sm={2}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl  id="subCostEmployeeFormCode" name="subCostEmployeeFormCode" value={this.state.employeeNo} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={7}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
                            </InputGroup.Prepend>
                            <InputGroup.Append>
                            <DatePicker
                                selected={this.state.individualSales_startYearAndMonth}
                                onChange={this.individualSalesStartYearAndMonthChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="off"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                showDisabledMonthNavigation
                                className="form-control form-control-sm"
                                id="customerInfoDatePicker"
                                dateFormat={"yyyy/MM"}
                                name="individualSales_startYearAndMonth"
                                locale="ja">
								</DatePicker><font id="mark" style={{marginLeft: "20px",marginRight: "20px"}}>～</font>
                            </InputGroup.Append>
                            <InputGroup.Append>
                            <DatePicker
                                selected={this.state.individualSales_endYearAndMonth}
                                onChange={this.individualSalesEndYearAndMonthChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="off"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                showDisabledMonthNavigation
                                className="form-control form-control-sm"
                                id="customerInfoDatePicker"
                                dateFormat={"yyyy/MM"}
                                name="individualSales_endYearAndMonth"
                                locale="ja">
								</DatePicker>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
				<Row>
					<Col  className="text-center">
					<Button variant="info" size="sm" id="shusei"　onClick={this.searchEmployee}><FontAwesomeIcon icon={faSearch} />検索</Button>
                    </Col> 
                </Row>
				<br/>
				<div>
				<Row>
                    <Col sm={2}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">稼働月数:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <a id="otherAllowance" name="operatingMonth" type="text" aria-label="Small" aria-describedby="inputGroup-sizing-sm" ></a>
                        </InputGroup>
						</Col>
				</Row>
					<BootstrapTable   className={"bg-white text-dark"} pagination={true} options={this.options}>
							<TableHeaderColumn width='95' dataField='yAndm' dataSort={true} caretRender={publicUtils.getCaret} isKey>年月</TableHeaderColumn>
							<TableHeaderColumn width='120' dataField='employeetype'>社員形式</TableHeaderColumn>
							<TableHeaderColumn width='120' dataField='customersAffi'>所属客様</TableHeaderColumn>
							<TableHeaderColumn width='110' dataField='unitPrice'>単価</TableHeaderColumn>
							<TableHeaderColumn width='110' dataField='basicPayment'>基本支給</TableHeaderColumn>
							<TableHeaderColumn width='110' dataField='transportationFee'>交通代</TableHeaderColumn>
							<TableHeaderColumn width='90' dataField='socialInsurance'>社会保険</TableHeaderColumn>
							<TableHeaderColumn width='90' dataField='bonus'>ボーナス</TableHeaderColumn>
							<TableHeaderColumn width='120' dataField='leaderAllowance'>リーダー手当</TableHeaderColumn>
							<TableHeaderColumn width='110' dataField='otherAllowance'>他の手当</TableHeaderColumn>
							<TableHeaderColumn width='110' dataField='grosProfits'>粗利</TableHeaderColumn>
						</BootstrapTable>
						<Row style={{marginLeft: "650px"}}>
						<Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">単価合計:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <a id="utilPriceTotal" name="utilPriceTotal" type="text" aria-label="Small"  ></a>
                        </InputGroup>
						</Col>
						<Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">支払合計:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <a id="paymentTotal" name="paymentTotal" type="text" aria-label="Small"></a>
                        </InputGroup>
						</Col>
						<Col sm={4}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">粗利合計:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <a id="grossProfitTotal" name="grossProfitTotal" type="text" aria-label="Small"></a>
                        </InputGroup>
						</Col>
						</Row>
				</div>
			</div>
        );
    }
}export default individualSales;