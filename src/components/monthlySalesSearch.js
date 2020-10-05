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
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';

class monthlySalesSearch extends Component {
    state = { 
        individualSales_YearAndMonth:'',
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
    vNumberChange = (e, key) => {
        const {value} = e.target;

        const reg = /^[0-9]*$/;
        if((reg.test(value) && value.length<3)){
            this.setState({
            [key]: value
            })
        }
        // if((reg.test(utilPriceback) && utilPriceback.length<3)){
        //     this.setState({
        //         utilPriceback: utilPriceback
        //     })
        // }
    } 
	individualSalesYearAndMonthChange = date => {
        if(date !== null){
            this.setState({
                individualSales_YearAndMonth: date,
                fiscalYear:'',
            });
        }else{
            this.setState({
                individualSales_YearAndMonth: '',
            });
        }
	};
    searchMonthlySales = () => { 
		const monthlyInfo = {
            nowYandM: publicUtils.formateDate(this.state.individualSales_YearAndMonth,false),
            employeeClassification:this.state.employeeClassification,
            employeeForms:this.state.employeeForms,
            employeeOccupation:this.state.employeeOccupation,
            kadou:this.state.kadou,
            utilPricefront:this.state.utilPricefront,
            utilPriceback:this.state.utilPriceback,
            salaryfront:this.state.salaryfront,
            salaryback:this.state.salaryback,
            grossProfitFront:this.state.grossProfitFront,
            grossProfitBack:this.state.grossProfitBack,

        };
        
 
		axios.post("http://127.0.0.1:8080/monthlySales/searchMonthlySales", monthlyInfo)
			.then(response => {
				// if (response.data.errorsMessage != null) {
                //     this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
				// 	setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
				// } else {
                    this.setState({ monthlySalesInfoList: response.data.data })
                    this.totalfee()
                //     this.setState({workMonthCount:this.state.employeeInfoList[0].workMonthCount})
					
				// }
			}).catch((error) => {
				console.error("Error - " + error);
			});
        //}
    }
    resetForm= () =>{
        this.setState({
            individualSales_YearAndMonth: '',
            employeeClassification: '',
            employeeForms: '',
            employeeOccupation: '',
            kadou: '',
            utilPricefront: '',
            utilPriceback: '',
            salaryfront: '',
            salaryback: '',
            grossProfitFront: '',
            grossProfitBack: '',
        });
    }

    totalfee = () =>{
        let unitPirceTotal = 0;
        let salaryTotal = 0;
        let TotalNonOperation = 0;
        let grossProfitTotal= 0;
        let workcount = 0;
        for(let i=0;i<this.state.monthlySalesInfoList.length;i++){
            if(this.state.monthlySalesInfoList[i].unitPrice==null||this.state.monthlySalesInfoList[i].unitPrice==""){
                unitPirceTotal = parseInt(unitPirceTotal) + 0;
            }else{
                unitPirceTotal = parseInt(unitPirceTotal)+parseInt(this.state.monthlySalesInfoList[i].unitPrice)
            }
            if(this.state.monthlySalesInfoList[i].salary == null||this.state.monthlySalesInfoList[i].salary == ""){
                salaryTotal = salaryTotal + 0;
            }else{
                salaryTotal = salaryTotal + parseInt(this.state.monthlySalesInfoList[i].salary)
            }
            if(this.state.monthlySalesInfoList[i].waitingCost==null||this.state.monthlySalesInfoList[i].waitingCost==""){
                TotalNonOperation = parseInt(TotalNonOperation) + 0;
            }else{
                TotalNonOperation = parseInt(TotalNonOperation) + parseInt(this.state.monthlySalesInfoList[i].waitingCost) 
                workcount++;
            }

            if(this.state.monthlySalesInfoList[i].monthlyGrosProfits==null||this.state.monthlySalesInfoList[i].monthlyGrosProfits==""){
                grossProfitTotal = parseInt(grossProfitTotal) + 0;
            }else{
                grossProfitTotal = parseInt(grossProfitTotal) + parseInt(this.state.monthlySalesInfoList[i].monthlyGrosProfits) 
            }
        }
        this.setState({unitPirceTotal:unitPirceTotal})
        this.setState({salaryTotal:salaryTotal})
        this.setState({TotalNonOperation:TotalNonOperation})
        this.setState({grossProfitTotal:grossProfitTotal})
        this.setState({workcount:workcount})

    }
    render(){
        const { kadou,employeeOccupation,employeeForms,employeeClassification}= this.state;
        return(
            
            <div>
                <Form>
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
                            <DatePicker
                                selected={this.state.individualSales_YearAndMonth}
                                onChange={this.individualSalesYearAndMonthChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="off"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                showDisabledMonthNavigation
                                className="form-control form-control-sm"
                                id="monthlysalesSearchDatePicker"
                                dateFormat={"yyyy/MM"}
                                name="individualSales_YearAndMonth"
                                locale="ja">
								</DatePicker>
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
                                    <Form.Control as="select" size="sm" onChange={this.valueChange} name="employeeClassification" id="employeeClassification" value={employeeClassification} autoComplete="off">
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
                            <Form.Control as="select" size="sm" onChange={this.valueChange} name="employeeForms" id="employeeForms" value={employeeClassification === "1" ? "" :employeeForms} autoComplete="off"  disabled={employeeClassification === "1" ? true : false} >
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
                            <Form.Control as="select" size="sm" onChange={this.valueChange} name="employeeOccupation" id="employeeOccupation" value={employeeOccupation} autoComplete="off">
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
                            <Form.Control as="select" size="sm" onChange={this.valueChange} name="kadou" id="kadou" value={kadou} autoComplete="off" >
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
                            <FormControl name="utilPricefront" id="utilPricefront" value={this.state.utilPricefront} onChange={(e) => this.vNumberChange(e, 'utilPricefront')} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" 万円"/>
                            <font id="mark">～</font>
                            <FormControl name="utilPriceback" id="utilPriceback" value={this.state.utilPriceback}   onChange={(e) => this.vNumberChange(e, 'utilPriceback')} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" 万円"/>
                        </InputGroup>  
                    </Col>
                    <Col sm={3}>
                    <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">給料範囲</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl name="salaryfront" id="salaryfront" value={this.state.salaryfront}   onChange={(e) => this.vNumberChange(e, 'salaryfront')} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" 万円" />
                            <font id="mark">～</font>
                            <FormControl name="salaryback" id="salaryback" value={this.state.salaryback}  onChange={(e) => this.vNumberChange(e, 'salaryback')} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" 万円"/>
                        </InputGroup>  
                    </Col>
                    <Col sm={3}>
                    <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">粗利</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl name="grossProfitFront" id="grossProfitFront" value={this.state.grossProfitFront} onChange={(e) => this.vNumberChange(e, 'grossProfitFront')} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" 万円"/>
                            <font id="mark">～</font>
                            <FormControl name="grossProfitBack" id="grossProfitBack" value={this.state.grossProfitBack}  onChange={(e) => this.vNumberChange(e, 'grossProfitBack')} aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder=" 万円"/>
                        </InputGroup>  
                    </Col>
                </Row>
                <Row>
					<Col  className="text-center">
					<Button variant="info" size="sm" id="shusei" onClick={this.searchMonthlySales}><FontAwesomeIcon icon={faSearch} />検索</Button>
                    {' '}
                    <Button size="sm" variant="info"onClick={this.resetForm}><FontAwesomeIcon icon={faUndo} /> Reset</Button>
                    </Col> 
                </Row>
                </Form>
                <Row style = {{marginTop:"10px"}}>
                    <Col sm={2}>
                            <label>稼働人数：</label>
                            <label id="workPeopleCount"name="workPeopleCount" >{this.state.workcount}</label>
						</Col>
                         
                    <Col sm={2}>
                            <label>単価総額：</label>
                                            <label id="utilPirceTotal"name="utilPirceTotal">{this.state.unitPirceTotal}</label>
						</Col>
                    
						<Col sm={2}>
                            <label>支給総額：</label>
                                            <label id="salaryTotal" name="salaryTotal" >{this.state.salaryTotal}</label>
						</Col>
						<Col sm={2}>

                            <label>非稼働総額：</label>
                            <label id="TotalNonOperation" name="TotalNonOperation" type="text">{this.state.TotalNonOperation}</label>
						</Col>
						<Col sm={2}>
                            <label>粗利総額：</label>
                            <label id="grossProfitTotal" name="grossProfitTotal" type="text">{this.state.grossProfitTotal}</label>
						</Col>
                        <Col  className="text-right">
					<Button variant="info" size="sm" id="shusei">個人売上検索</Button>
                    </Col>
				</Row>
                <div>
                    <BootstrapTable data={this.state.monthlySalesInfoList}  pagination={true}  headerStyle={{ background: '#5599FF' }}  options={this.options}　striped hover condensed>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='70' dataField='rowNo'dataSort={true} isKey>番号</TableHeaderColumn>                           
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeNo'>社員番号</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeName'>氏名</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeStatus'>社員区分</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeFormName'>社員形式</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='occupationName'>職種</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='unitPrice'>単価</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='salary'>支給合計</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125' dataField='otherFee'>他の負担</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125'　dataField='waitingCost'>非稼動費用</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125'　dataField='monthlyGrosProfits'>粗利(税抜き)</TableHeaderColumn>         
					</BootstrapTable>
                    </div>
                
            </div>
        );            
    }
}

const mapStateToProps = state => {
	return {
        employeeStatuss: state.data.dataReques.length >= 1 ? state.data.dataReques[0] : [],
        employeeFormCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[1] : [],
        occupationCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[2] : [],
		
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};

export default monthlySalesSearch;