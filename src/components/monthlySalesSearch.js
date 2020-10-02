import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , select, FormControl , Tooltip,} from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autosuggest from 'react-autosuggest';
import { faSave, faUndo, faSearch , faEdit } from '@fortawesome/free-solid-svg-icons';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import { TableBody } from '@material-ui/core';
import { parse } from '@fortawesome/fontawesome-svg-core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import ErrorsMessageToast from './errorsMessageToast';

class monthlySalesSearch extends Component {
    state = { 
        individualSales_startYearAndMonth:'',
        individualSales_endYearAndMonth:'',
        utilPricefront:'',
        utilPriceback:'',
        salaryfront:'',
        salaryback:'',
        grossProfitFront:'',
        grossProfitBack:'',
        nowYandM:'',
     }
     constructor(props){
        super(props);
        this.state = this.initialState;
        this.valueChange = this.valueChange.bind(this);
		this.options = {
			sizePerPage: 12,
			pageStartIndex: 1,
			paginationSize: 2,
			prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
			hideSizePerPage: true,
			hideSizePerPage: true,
            alwaysShowAllBtns: true,
            paginationShowsTotal: this.renderShowsTotal,

		};

        };
        
        initialState = { occupationCodes: [],employeeFormCodes: [],employeeStatuss:[],
        }
        componentDidMount(){
            var date = new Date();
            var nowY=date.getFullYear();
            var nowM=date.getMonth()+1;
            if(nowM<10){
                nowM="0"+nowM;
            }
            var nowYM=nowY+"-"+nowM;
            this.setState({nowYandM:nowYM})
           this.getDropDownｓ();
       
        }
           	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
        })

    }
    renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
    }   
    getDropDownｓ = () => {
		var methodArray = ["getStaffForms" ,"getOccupation","getEmployee"];
		var data = publicUtils.getPublicDropDown(methodArray);
		this.setState(
			{
                employeeFormCodes:data[0],
                occupationCodes:data[1],
                employeeStatuss:data[2],

			}
		);
	};

    render(){
        const { kadou,employeeOccupation,employeeForms,employeeClassification}= this.state;
        return(
            
            <div>
                <Row inline="true">
                     <Col  className="text-center">
                    <h2>月次売上検索</h2>
                    </Col> 
                </Row>
				<Row>
				<Col sm={3}>
                <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
                            <InputGroup.Text  name="nowYandM" aria-label="Small" aria-describedby="inputGroup-sizing-sm">{this.state.nowYandM} </InputGroup.Text>
                                </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                    <p id ="individualSalesErrmsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger"></p>
                    </Col>
				</Row>
				<Row>
                <Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text></InputGroup.Prepend>
                                    <Form.Control as="select" size="sm" onChange={this.valueChange} name="employeeClassification" value={employeeClassification} autoComplete="off">
											{this.state.employeeStatuss.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
                                            </Form.Control>
								</InputGroup>
							</Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="select" size="sm" onChange={this.valueChange} name="employeeForms" value={employeeForms} autoComplete="off">
											{this.state.employeeFormCodes.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
                                            </Form.Control>
                            
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">職種</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="select" size="sm" onChange={this.valueChange} name="employeeOccupation" value={employeeOccupation} autoComplete="off">
											{this.state.occupationCodes.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
                                            </Form.Control>
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">稼働</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="select" size="sm" onChange={this.valueChange} name="kadou" value={kadou} autoComplete="off" >
											<option value=""　>選択ください</option>
											<option value="0">はい</option>
											<option value="1">いいえ</option>
										</Form.Control>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                    <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">単価範囲</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl name="utilPricefront" value={this.state.utilPricefront}  onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <font id="mark" style={{marginLeft: "10px",marginRight: "10px"}}>～</font>
                            <FormControl name="utilPriceback" value={this.state.utilPriceback}  onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>  
                    </Col>
                    <Col sm={3}>
                    <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">給料範囲</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl name="salaryfront" value={this.state.salaryfront}  onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <font id="mark" style={{marginLeft: "10px",marginRight: "10px"}}>～</font>
                            <FormControl name="salaryback" value={this.state.salaryback}  onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>  
                    </Col>
                    <Col sm={3}>
                    <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">粗利</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl name="grossProfitFront" value={this.state.grossProfitFront}  onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            <font id="mark" style={{marginLeft: "10px",marginRight: "10px"}}>～</font>
                            <FormControl name="grossProfitBack" value={this.state.grossProfitBack}  onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>  
                    </Col>
                </Row>
                <Row>
					<Col  className="text-center">
					<Button variant="info" size="sm" id="shusei"><FontAwesomeIcon icon={faSearch} />検索</Button>
                    </Col> 
                </Row>
                <Row>
                    <Col sm={3}>
                            <label>稼働人数:</label>
                            <label id="workPeopleCount"name="workPeopleCount" ></label>
						</Col>
                        <Col  className="text-right">
					<Button variant="info" size="sm" id="shusei">個人売上検索</Button>
                    </Col> 
                </Row>
                <div>
                    <BootstrapTable   pagination={true}  headerStyle={{ background: '#5599FF' }}  options={this.options}>
							<TableHeaderColumn  dataField='onlyYandM'dataSort={true} caretRender={publicUtils.getCaret} isKey>番号</TableHeaderColumn>                           
							<TableHeaderColumn  dataField='employeeNo'>社員番号</TableHeaderColumn>
							<TableHeaderColumn  dataField='employeeName'>氏名</TableHeaderColumn>
							<TableHeaderColumn  dataField='employeeClassification'>社員区分</TableHeaderColumn>
							<TableHeaderColumn  dataField='employeeForm'>社員形式</TableHeaderColumn>
							<TableHeaderColumn  dataField='Occupation'>職種</TableHeaderColumn>
							<TableHeaderColumn  dataField='utilPirce'>単価</TableHeaderColumn>
							<TableHeaderColumn  dataField='totalSalaryAmount'>支給合計</TableHeaderColumn>
							<TableHeaderColumn  width='125' dataField='otherBurden'>他の負担</TableHeaderColumn>
							<TableHeaderColumn  width='125'　dataField='nonOperatingCosts'>非稼動費用</TableHeaderColumn>
							<TableHeaderColumn  width='125'　dataField='grosProfitsExcludingTax'>粗利(税抜き)</TableHeaderColumn>         
					</BootstrapTable>
                    </div>
                <Row>
                    <Col sm={3}>
                            <label>単価総額:</label>
                            <label id="utilPirceTotal"name="utilPirceTotal" ></label>
						</Col>
                    
						<Col sm={3}>
                            <label>支給総額:</label>
                            <label id="salaryTotal" name="salaryTotal" >{'\u00A0'}{'\u00A0'}</label>
						</Col>
						<Col sm={3}>

                            <label>非稼働総額:</label>
                            <label id="TotalNonOperation" name="TotalNonOperation" type="text"></label>
						</Col>
						<Col sm={3}>
                            <label>粗利総額:</label>
                            <label id="grossProfitTotal" name="grossProfitTotal" type="text">{'\u00A0'}{'\u00A0'}</label>
						</Col>
				</Row>
            </div>
        );            
    }
}export default monthlySalesSearch;