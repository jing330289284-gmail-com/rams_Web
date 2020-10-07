import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl , select , Tooltip,} from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faSearch  } from '@fortawesome/free-solid-svg-icons';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import ErrorsMessageToast from './errorsMessageToast';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
import { Route } from 'react-router-dom';

class monthlySalesSearch extends Component {
    state = { 
        monthlySales_YearAndMonth:'',
        monthlySales_startYearAndMonth:'',
        monthlySales_endYearAndMonth:'',
        utilPricefront:'',
        utilPriceback:'',
        salaryfront:'',
        salaryback:'',
        grossProfitFront:'',
        grossProfitBack:'',
        nowYandM:'',
        kadou:'',
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
		var methodArray = ["getStaffForms" ,"getOccupation","getEmployeeStatus"];
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
    } 
    monthlySalesStartYearAndMonthChange = date => {
        if(date !== null){
            this.setState({
                monthlySales_startYearAndMonth: date,
            });
        }else{
            this.setState({
                monthlySales_startYearAndMonth: '',
            });
        }
    };
    
    monthlySalesEndYearAndMonthChange = date => {
        if(date !== null){
            this.setState({
                monthlySales_endYearAndMonth: date,
            });
        }else{
            this.setState({
                monthlySales_endYearAndMonth: '',
            });
        }
	};
    searchMonthlySales = () => { 
		const monthlyInfo = {
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
            startYandM: publicUtils.formateDate(this.state.monthlySales_startYearAndMonth,false),
            endYandM: publicUtils.formateDate(this.state.monthlySales_endYearAndMonth,false),

        };
		axios.post("http://127.0.0.1:8080/monthlySales/searchMonthlySales", monthlyInfo)
			.then(response => {
				if (response.data.errorsMessage != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
                    setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
                }else if(response.data.noData != null){
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.noData });
                    setTimeout(() => this.setState({ "errorsMessageShow": false }), 4000);
                    window.location.href = window.location.href
                }else {
                    this.setState({ monthlySalesInfoList: response.data.data })
                    this.totalfee()	
				 }
			}).catch((error) => {
				console.error("Error - " + error);
			});
        }
    resetForm= () =>{
        this.setState({
            monthlySales_startYearAndMonth: '',
            monthlySales_endYearAndMonth: '',
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
                workcount++;
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
                
            }

            if(this.state.monthlySalesInfoList[i].monthlyGrosProfits==null||this.state.monthlySalesInfoList[i].monthlyGrosProfits==""){
                grossProfitTotal = parseInt(grossProfitTotal) + 0;
            }else{
                grossProfitTotal = parseInt(grossProfitTotal) + parseInt(this.state.monthlySalesInfoList[i].monthlyGrosProfits) 
            }
        }
        this.setState({unitPirceTotal:publicUtils.addComma(unitPirceTotal.toString(),false)})
        this.setState({salaryTotal:publicUtils.addComma(salaryTotal.toString(),false)})
        this.setState({TotalNonOperation:publicUtils.addComma(TotalNonOperation.toString(),false)})
        this.setState({grossProfitTotal:publicUtils.addComma(grossProfitTotal.toString(),false)})
        this.setState({workcount:workcount})
    }

	


    formatStayPeriod(code) {
    let positionsTem = this.state.employeeStatuss;
		for (var i in positionsTem) {
			if (code === positionsTem[i].code) {
				return positionsTem[i].name;
			}
		}
    }
    
    unitPriceAddComma(cell,row){
        if(row.unitPrice ===null){
            return 
        }else{
            let formatUprice = publicUtils.addComma(row.unitPrice , false);
            return formatUprice;
        }   
    }

    salaryAddComma(cell,row){
        if(row.salary ===null){
            return 
        }else{
            let formatSalary = publicUtils.addComma(row.salary , false);
            return formatSalary;
        }   
    }

    otherFeeAddComma(cell,row){
        if(row.otherFee ===null){
            return 
        }else{
            let formatOtherFee = publicUtils.addComma(row.otherFee , false);
            return formatOtherFee;
        } 
    }

    waitingCostAddComma(cell, row){
        if(row.waitingCost ===null){
            return
        }else{
            let formatwaitingCost = publicUtils.addComma(row.waitingCost , false)
            return formatwaitingCost;
        }
    }

    monthlyGrosProfitsAddComma(cell ,row){
       if(row.monthlyGrosProfits===null){
           return 
       }else{
        let mGrosProfits = row.monthlyGrosProfits.split('.')[0];
        let formatmGrosProfits = publicUtils.addComma(mGrosProfits,false)
        return formatmGrosProfits;
       }
        

    }
    render(){
        const { kadou,employeeOccupation,employeeForms,employeeClassification ,errorsMessageValue}= this.state;
        // const employeeStatuss = this.props.employeeStatuss;
        // const employeeFormCodes = this.props.employeeFormCodes;
        // const  occupationCodes= this.props.occupationCodes;

        return(
            <div>   
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
                <Form>
                <Row inline="true">
                     <Col  className="text-center">
                    <h2>月次売上検索</h2>
                    </Col> 
                </Row>
                <br/>
				<Row>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
                                selected={this.state.monthlySales_startYearAndMonth}
                                onChange={this.monthlySalesStartYearAndMonthChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="off"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                showDisabledMonthNavigation
                                className="form-control form-control-sm"
                                id="personalsalesSearchDatePicker"
                                dateFormat={"yyyy/MM"}
                                name="individualSales_startYearAndMonth"
                                locale="ja">
								</DatePicker><font id="mark">～</font><DatePicker
                                selected={this.state.monthlySales_endYearAndMonth}
                                onChange={this.monthlySalesEndYearAndMonthChange}
                                dateFormat={"yyyy MM"}
                                autoComplete="off"
                                locale="pt-BR"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                showDisabledMonthNavigation
                                className="form-control form-control-sm"
                                id="personalsalesSearchBackDatePicker"
                                dateFormat={"yyyy/MM"}
                                name="individualSales_endYearAndMonth"
                                locale="ja">
								</DatePicker>
                            </InputGroup.Prepend>
                        </InputGroup>                       
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
                            <InputGroup.Text id="inputGroup-sizing-sm">粗利範囲</InputGroup.Text>
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
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeStatus'　dataFormat={this.formatStayPeriod.bind(this)}>社員区分</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeFormName'>社員形式</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='occupationName'>職種</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='unitPrice'dataFormat={this.unitPriceAddComma}>単価</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='salary' dataFormat={this.salaryAddComma}>支給合計</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125' dataField='otherFee' dataFormat={this.otherFeeAddComma}>他の負担</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125'　dataField='waitingCost' dataFormat={this.waitingCostAddComma}>非稼動費用</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125'　dataField='monthlyGrosProfits'dataFormat={this.monthlyGrosProfitsAddComma}>粗利(税抜き)</TableHeaderColumn>         
					</BootstrapTable>
                    </div>
                
            </div>
        );            
    }
}

const mapStateToProps = state => {
	return {
        employeeStatuss: state.data.dataReques.length >= 1 ? state.data.dataReques[4] : [],
        employeeFormCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[2] : [],
        occupationCodes: state.data.dataReques.length >= 1 ? state.data.dataReques[3] : [],
		
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(monthlySalesSearch) ;