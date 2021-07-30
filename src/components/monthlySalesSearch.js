import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , FormControl ,} from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faSearch  } from '@fortawesome/free-solid-svg-icons';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import ErrorsMessageToast from './errorsMessageToast';
import { Link } from "react-router-dom";
import store from './redux/store';
import { alignPropType } from 'react-bootstrap/esm/DropdownMenu';
axios.defaults.withCredentials = true;

class monthlySalesSearch extends Component {//月次売上検索
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
        rowSelectemployeeNo:'',
        rowSelectemployeeName:'',
        sendFlag:'',
        bpFlag: false,
     }
     constructor(props){
        super(props);
        this.state = this.initialState;
        this.valueChange = this.valueChange.bind(this);
		this.options = {
			sizePerPage: 12,
			pageStartIndex: 1,
			paginationSize: 3,
			prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
			hideSizePerPage: true,
			hideSizePerPage: true,
            alwaysShowAllBtns: true,
            paginationShowsTotal: this.renderShowsTotal,
            expandRowBgColor: 'rgb(165, 165, 165)',
		};

        };
        
        initialState = { 
            employeeStatuss:  store.getState().dropDown[4],
            employeeFormCodes: store.getState().dropDown[2],
            occupationCodes: store.getState().dropDown[10],
            serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
            rowSelectemployeeNo:'',
        }
        componentDidMount(){
            var date = new Date();
            var year = date.getFullYear();
            $('#fiscalYear').append('<option value="">' + "" + '</option>');
            for (var i = year - 1; i <= year + 1; i++) {
                $('#fiscalYear').append('<option value="' + i + '">' + i + '</option>');
            }
        	let employeeStatuss = [];
        	for(let i in this.state.employeeStatuss){
        		if(this.state.employeeStatuss[i].code !== "4"){
        			employeeStatuss.push(this.state.employeeStatuss[i]);
        		}
        	}
            this.setState({
            	employeeStatuss: employeeStatuss,
            });
           this.clickButtonDisabled();  
           const { location } = this.props
           if (location.state) {
        	   	let data = location.state;
               	if(data.sendValue !== undefined && data.sendValue !== null){
               		data = data.sendValue;
               	}
        	   	this.setState({
                    monthlySales_startYearAndMonth : data.monthlySales_startYearAndMonth,
                    monthlySales_endYearAndMonth : data.monthlySales_endYearAndMonth,
                    //employeeClassification:this.state.employeeClassification === "" ? "" :data.employeeClassification,
                    // employeeFormCodes:this.state.employeeFormCodes === "" ? "" :data.employeeFormCodes,
                    // occupationCodes:this.state.occupationCodes === "" ? "" :data.occupationCodes,
                    // kadou:this.state.kadou === "" ? "" :data.kadou,
                    utilPricefront:this.state.utilPricefront === "" ? "" :data.utilPricefront,
                    utilPriceback: this.state.utilPriceback === "" ? "" :data.utilPriceback,
                    salaryfront:this.state.salaryfront === "" ? "" :data.salaryfront,
                    salaryback:this.state.salaryback === "" ? "" :data.salaryback,
                    grossProfitFront:this.state.grossProfitFront === "" ? "" :data.grossProfitFront,
                    grossProfitBack:this.state.grossProfitBack === "" ? "" :data.grossProfitBack,
                    fiscalYear: data.fiscalYear,
                    kadou: data.kadou,
                    employeeClassification: data.employeeClassification,
                    employeeOccupation: data.employeeOccupation,
                }, () =>
                this.searchMonthlySales())
            }
        }

        clickButtonDisabled = () => {
            $('button[name="personalSearchBtn"]').prop('disabled', true);
        };
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

    
    vNumberChange = (e, key) => {
        const {value} = e.target;

        const reg = /^[0-9]*$/;
        if((reg.test(value) && value.length<4)){
            this.setState({
            [key]: value
            })
        }
    } 
    monthlySalesStartYearAndMonthChange = date => {
        if(date !== null){
            this.setState({
                monthlySales_startYearAndMonth: date,
                fiscalYear: '',
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
                fiscalYear: '',
            });
        }else{
            this.setState({
                monthlySales_endYearAndMonth: '',
            });
        }
	};
    searchMonthlySales = () => { 
    	let employeeOccupation = this.state.employeeOccupation;
    	if(this.state.employeeClassification === "1"){
            this.setState({ bpFlag: true })
            employeeOccupation = "";
    	}else{
            this.setState({ bpFlag: false })
    	}
		const monthlyInfo = {
            employeeClassification:this.state.employeeClassification,
            employeeForms:this.state.employeeForms,
            employeeOccupation: employeeOccupation,
            kadou:this.state.kadou,
            utilPricefront:this.state.utilPricefront,
            utilPriceback:this.state.utilPriceback,
            salaryfront:this.state.salaryfront,
            salaryback:this.state.salaryback,
            grossProfitFront:this.state.grossProfitFront,
            grossProfitBack:this.state.grossProfitBack,
            startYandM: publicUtils.formateDate(this.state.monthlySales_startYearAndMonth,false),
            endYandM: publicUtils.formateDate(this.state.monthlySales_endYearAndMonth,false),
            fiscalYear: this.state.fiscalYear,
        };
        axios.post(this.state.serverIP + "monthlySales/searchMonthlySales", monthlyInfo)
			.then(response => {
				if (response.data.errorsMessage != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
                    this.setState({ monthlySalesInfoList: [] })
                }else if(response.data.noData != null){
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.noData });
                    this.setState({ monthlySalesInfoList: [] })
                }else {
                    this.setState({"errorsMessageShow":false})
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
            fiscalYear: '',
        });
    }
    totalfee = () =>{
        let unitPirceTotal = 0;
        let salaryTotal = 0;
        let TotalNonOperation = 0;
        let grossProfitTotal= 0;
        let workcount = 0;
        for(let i=0;i<this.state.monthlySalesInfoList.length;i++){
            workcount++;
            if(this.state.monthlySalesInfoList[i].unitPrice==null||this.state.monthlySalesInfoList[i].unitPrice==""){
                unitPirceTotal = parseInt(unitPirceTotal) + 0;
            }else{
                if(this.state.monthlySalesInfoList[i].deductionsAndOvertimePayOfUnitPrice===null){
                    unitPirceTotal = parseInt(unitPirceTotal)+parseInt(this.state.monthlySalesInfoList[i].unitPrice) 
                }else{
                    unitPirceTotal = parseInt(unitPirceTotal)+parseInt(this.state.monthlySalesInfoList[i].unitPrice) +parseInt(this.state.monthlySalesInfoList[i].deductionsAndOvertimePayOfUnitPrice)
                }               
            }
            if(this.state.monthlySalesInfoList[i].salary == null||this.state.monthlySalesInfoList[i].salary == ""){
                salaryTotal = salaryTotal + 0;
            }else{
                if(this.state.monthlySalesInfoList[i].deductionsAndOvertimePay===null){
                    salaryTotal = salaryTotal + parseInt(this.state.monthlySalesInfoList[i].salary)
                }
                else{
                    salaryTotal = salaryTotal + parseInt(this.state.monthlySalesInfoList[i].salary)+parseInt(this.state.monthlySalesInfoList[i].deductionsAndOvertimePay)
                }              
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
        if(row.unitPrice ===null||row.unitPrice===0){
            return 
        }else{
            let formatUprice
            if(row.deductionsAndOvertimePayOfUnitPrice !=null){
                if(row.deductionsAndOvertimePayOfUnitPrice<0){
                  return (<div><div style={{ float:'left' }}>{publicUtils.addComma(row.unitPrice , false)}</div><div style={{ color: 'red',float:'left' }}>({publicUtils.addComma(row.deductionsAndOvertimePayOfUnitPrice , false)})</div></div>);
                }                                 
            }else{
                formatUprice = publicUtils.addComma(row.unitPrice , false);
            }
                          
            return formatUprice;
        }   
    }

    salaryAddComma(cell,row){
        if(row.salary ===null||row.salary ===0){
            return 
        }else{
            let formatSalary
            if(row.deductionsAndOvertimePay!= null){
                if(row.deductionsAndOvertimePay <0){
                    return (<div><div style={{ float:'left' }}>{publicUtils.addComma(row.salary , false)}</div><div style={{ color: 'red',float:'left' }}>({publicUtils.addComma(row.deductionsAndOvertimePay , false)})</div></div>);  
                }
               
            }else{
                formatSalary = publicUtils.addComma(row.salary , false);
            }
            
            return formatSalary;
        }   
    }

    otherFeeAddComma(cell,row){
        if(row.otherFee ===null||row.otherFee===0){
            return 
        }else{
            let formatOtherFee = publicUtils.addComma(row.otherFee , false);
            return formatOtherFee;
        } 
    }

    waitingCostAddComma(cell, row){
        if(row.waitingCost ===null||row.waitingCost ===0){
            return
        }else{
            let formatwaitingCost = publicUtils.addComma(row.waitingCost , false)
            if(row.waitingCost==="0"){
                return ""
            }    
            else{
            return formatwaitingCost;
            }
        }
    }

    monthlyGrosProfitsAddComma(cell ,row){
       if(row.monthlyGrosProfits===null||row.monthlyGrosProfits===0){
           return 
       }else{
        let mGrosProfits = row.monthlyGrosProfits.split('.')[0];
        let formatmGrosProfits = publicUtils.addComma(mGrosProfits,false)
        if(row.monthlyGrosProfits<0){
            return(<div style={{color:'red'}} >{formatmGrosProfits}</div>);
        }
        return formatmGrosProfits;
       } 
    }


    rowNoFormat(cell,row){
        var len = row.rowNo.toString().length;  
        while(len < 3) {  
            row.rowNo = "0" + row.rowNo;  
            len++;  
        }  
        return row.rowNo;  
    }
    handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
            this.setState({rowSelectemployeeNo:row.employeeNo});
            this.setState({rowSelectemployeeName:row.employeeName});
			$('#personalSearchBtn').removeClass('disabled');
		} else {
            this.setState({rowSelectemployeeNo:""});
			$('#personalSearchBtn').addClass('disabled');
		}
	}
    
    yearAndMonthChange = event => {
            this.setState({
                [event.target.name]: event.target.value,
                monthlySales_startYearAndMonth: '' ,
                monthlySales_endYearAndMonth: '' ,
            })
    }
    
	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = {
                monthlySales_startYearAndMonth: this.state.monthlySales_startYearAndMonth,
                monthlySales_endYearAndMonth: this.state.monthlySales_endYearAndMonth,
                utilPricefront: this.state.utilPricefront,
                utilPriceback: this.state.utilPriceback,
                salaryfront: this.state.salaryfront,
                salaryback: this.state.salaryback,
                grossProfitFront: this.state.grossProfitFront,
                grossProfitBack: this.state.grossProfitBack,
                fiscalYear: this.state.fiscalYear,
                kadou: this.state.kadou,
                employeeClassification: this.state.employeeClassification,
                employeeOccupation: this.state.employeeOccupation,
		};
		
		switch (actionType) {
			case "wagesInfo":
				path = {
					pathname: '/subMenuManager/wagesInfo',
					state: {
						employeeNo: this.state.rowSelectemployeeNo,
						backPage: "monthlySalesSearch",
						sendValue: sendValue,
						searchFlag: this.state.searchFlag,

					},
				}
				break;
		}
		this.props.history.push(path);
	}
    
    render(){
        const { kadou,
                employeeOccupation,
                employeeForms,
                employeeClassification,
                errorsMessageValue,
                employeeStatuss,
                employeeFormCodes,
                occupationCodes}= this.state;
        const selectRow = {
                mode: 'radio',
                bgColor: 'pink',
                hideSelectColumn: true,
                clickToSelect: true,
                clickToExpand: true,
                onSelect: this.handleRowSelect,
		    };
        return(
            <div>   
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
                <Form>
                <Row inline="true">
                     <Col  className="text-center">
                    <h2>全員売上検索</h2>
                    </Col> 
                </Row>
                <br/>
				<Row>
        		<Col sm={3}>
	                <InputGroup size="sm" className="mb-3">
	                    <InputGroup.Prepend>
	                        <InputGroup.Text id="inputGroup-sizing-sm">年度</InputGroup.Text>
	                    </InputGroup.Prepend>
	                    <FormControl id="fiscalYear" name="fiscalYear" value={this.state.fiscalYear} as="select" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.yearAndMonthChange.bind(this)} />
	                </InputGroup>
                </Col>
                <Col sm={3}>
	                <InputGroup size="sm" className="mb-3">
	                    <InputGroup.Prepend>
	                    <InputGroup.Text id="inputGroup-sizing-sm">稼働区分</InputGroup.Text>
	                    </InputGroup.Prepend>
	                    <Form.Control as="select" size="sm" onChange={this.valueChange} name="kadou" id="kadou" value={kadou} autoComplete="off" >
										<option value=""　></option>
										<option value="0">はい</option>
										<option value="1">いいえ</option>
									</Form.Control>
	                </InputGroup>
                </Col>
                <Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text></InputGroup.Prepend>
                                    <Form.Control as="select" size="sm" onChange={this.valueChange} name="employeeClassification" id="employeeClassification" value={employeeClassification} autoComplete="off">
											{employeeStatuss.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
                                            </Form.Control>
								</InputGroup>
							</Col>
                    <Col hidden>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as="select" size="sm" onChange={this.valueChange} name="employeeForms" id="employeeForms" value={employeeClassification === "1" ? "" :employeeForms} autoComplete="off"  disabled={employeeClassification === "1" ? true : false} >
											{employeeFormCodes.map(data =>
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
                            <Form.Control as="select" size="sm" onChange={this.valueChange} disabled={this.state.employeeClassification==="1"?true:false} name="employeeOccupation" id="employeeOccupation" value={this.state.employeeClassification==="1"?"":employeeOccupation} autoComplete="off">
											{occupationCodes.map(data =>
												<option key={data.code} value={data.code}>
													{data.name}
												</option>
											)}
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
                    <Col sm={3}>
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
	                            id="monthlysalesSearchDatePicker"
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
	                            id="monthlysalesSearchDatePicker"
	                            dateFormat={"yyyy/MM"}
	                            name="individualSales_endYearAndMonth"
	                            locale="ja">
								</DatePicker>
	                        </InputGroup.Prepend>
	                    </InputGroup>                       
                    </Col>
                </Row>
                <Row className="mb-3">
					<Col  className="text-center">
					<Button variant="info" size="sm" id="shusei" onClick={this.searchMonthlySales}><FontAwesomeIcon icon={faSearch} />検索</Button>
                    {' '}
                    <Button size="sm" variant="info"onClick={this.resetForm}><FontAwesomeIcon icon={faUndo} /> Reset</Button>
                    </Col> 
                </Row>
                </Form>           
                <Row >
                <div style={{ "textAlign": "center" }}>
                    <Link to={{ pathname: '/subMenuManager/individualSales', 
                    state: {actionType: 'monthly',
                    backPage: "monthlySalesSearch",
                    monthlySales_startYearAndMonth: this.state.monthlySales_startYearAndMonth,
                    monthlySales_endYearAndMonth:this.state.monthlySales_endYearAndMonth,
                    rowSelectemployeeNo:this.state.rowSelectemployeeNo,
                    rowSelectemployeeName:this.state.rowSelectemployeeName,
                    employeeClassification:this.state.employeeClassification,
                    employeeFormCodes:this.state.employeeFormCodes,
                    occupationCodes:this.state.occupationCodes,
                    kadou:this.state.kadou,
                    utilPricefront:this.state.utilPricefront,
                    utilPriceback: this.state.utilPriceback,
                    salaryfront:this.state.salaryfront,
                    salaryback:this.state.salaryback,
                    grossProfitFront:this.state.grossProfitFront,
                    grossProfitBack:this.state.grossProfitBack,
                    fiscalYear: this.state.fiscalYear,
                    employeeNo: this.state.rowSelectemployeeNo,
                    monthlyValue: {
                            monthlySales_startYearAndMonth: this.state.monthlySales_startYearAndMonth,
                            monthlySales_endYearAndMonth: this.state.monthlySales_endYearAndMonth,
                            utilPricefront: this.state.utilPricefront,
                            utilPriceback: this.state.utilPriceback,
                            salaryfront: this.state.salaryfront,
                            salaryback: this.state.salaryback,
                            grossProfitFront: this.state.grossProfitFront,
                            grossProfitBack: this.state.grossProfitBack,
                            fiscalYear: this.state.fiscalYear,
                            kadou: this.state.kadou,
                            employeeClassification: this.state.employeeClassification,
                            employeeOccupation: this.state.employeeOccupation,
            		},
                } 
                    }} className="btn btn-info btn-sm disabled" id="personalSearchBtn" > 個人売上検索</Link>
                
	                <font style={{ marginLeft: "2px" , marginRight: "2px" }}></font>
	                <Button size="sm" onClick={this.shuseiTo.bind(this, "wagesInfo")}  disabled={this.state.rowSelectemployeeNo === '' ? true : false} className="individualSalesButtom" name="clickButton" variant="info" id="wagesInfo">給料情報</Button>

                    </div> 
                    <Col>
		                <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">単価総額</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
		                    value={this.state.unitPirceTotal}
		                    disabled/>
	                    </InputGroup>
					</Col>
                    
                    <Col>
		                <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">支給総額</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
		                    value={this.state.salaryTotal}
		                    disabled/>
	                    </InputGroup>
					</Col>
                    <Col>
		                <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="fiveKanji" className="input-group-indiv">非稼働総額</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
		                    value={this.state.TotalNonOperation}
		                    disabled/>
	                    </InputGroup>
					</Col>
                    <Col>
		                <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">粗利総額</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
		                    value={this.state.grossProfitTotal}
		                    disabled/>
	                    </InputGroup>
					</Col>
				</Row>
                <div>
                    <BootstrapTable data={this.state.monthlySalesInfoList}  pagination={true}  headerStyle={{ background: '#5599FF' }} selectRow={selectRow} options={this.options}　striped hover condensed>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='80' dataField='rowNo'dataSort={true} isKey dataFormat={this.rowNoFormat}>番号</TableHeaderColumn>                           
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='yearAndMonth' width='90'>年月</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeName'width='100'>氏名</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeFormName' width='110'>社員形式</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='occupationName' width='90'>職種</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='unitPrice'  width='150'dataFormat={this.unitPriceAddComma}>単価(控除残業)</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='salary'  width='150' dataFormat={this.salaryAddComma}>基本給(控除残業)</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} hidden={this.state.bpFlag} dataField='otherFee' dataFormat={this.otherFeeAddComma} width='100'>他の費用</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} hidden={this.state.bpFlag} dataField='waitingCost' dataFormat={this.waitingCostAddComma} width='110'>非稼動費用</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} hidden={!this.state.bpFlag} dataField='bpBelongCustomer' width='210'>所属会社</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125'　dataField='monthlyGrosProfits'dataFormat={this.monthlyGrosProfitsAddComma} width='120'>粗利(税抜き)</TableHeaderColumn>         
					</BootstrapTable>
                    </div>
                
            </div>
        );            
    }
}
export default monthlySalesSearch ;