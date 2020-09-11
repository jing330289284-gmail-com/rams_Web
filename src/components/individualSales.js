import React,{Component} from 'react';
import {Row , Form , Col , InputGroup , Button , select, FormControl , Tooltip} from 'react-bootstrap';
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
			sizePerPage: 12,
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
        if($("#employeeName").val()==""){
            document.getElementById("individualSalesErrmsg").innerHTML = "社員名を入力してください";
            document.getElementById("individualSalesErrmsg").style = "visibility:visible";
        }else if($("#fiscalYear").val()==""&&$("#personalsalesSearchDatePicker").val()==""&&$("#personalsalesSearchBackDatePicker").val()==""){
            document.getElementById("individualSalesErrmsg").innerHTML = "年度また年月を入力してください";
            document.getElementById("individualSalesErrmsg").style = "visibility:visible";
        }else if($("#personalsalesSearchDatePicker").val()!=""&&$("#personalsalesSearchBackDatePicker").val()!=""&&$("#personalsalesSearchDatePicker").val()>$("#personalsalesSearchBackDatePicker").val()&&$("#fiscalYear").val()==""){
            document.getElementById("individualSalesErrmsg").innerHTML = "年月を確認してください";
            document.getElementById("individualSalesErrmsg").style = "visibility:visible";
        }
        else{
            document.getElementById("individualSalesErrmsg").style = "visibility:hidden";
        
		const empInfo = {
			employeeNo: this.state.employeeNo,
			employeeName: $("#employeeName").val(),
            fiscalYear:this.state.fiscalYear,
            startYearAndMonth:publicUtils.formateDate(this.state.individualSales_startYearAndMonth,false),
            endYearAndMonth:publicUtils.formateDate(this.state.individualSales_endYearAndMonth,false),
		};
		axios.post("http://127.0.0.1:8080/personalSales/searchEmpDetails", empInfo)
			.then(response => {
				if (response.data != null) {
                    this.setState({ employeeInfoList: response.data })
                    this.setState({workMonthCount:this.state.employeeInfoList[0].workMonthCount})
                    this.feeTotal();
				} else {
					alert("err")
				}
			}
            );
        }
    }


    	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
        })

    }
    
    feeTotal = () =>{
        var totalutilPrice = 0;
        var totalgrosProfits = 0;
        var paymentTotal = 0;
        for(var i=0;i<this.state.employeeInfoList.length;i++){
            if(this.state.employeeInfoList[i].paymentTotal==null){
            paymentTotal = paymentTotal + 0;
            }else{
            paymentTotal = parseInt(paymentTotal)+parseInt(this.state.employeeInfoList[i].paymentTotal)
            }
            if(this.state.employeeInfoList[i].unitPrice == null){
                totalutilPrice = totalutilPrice + 0;
            }else{
                totalutilPrice = parseInt(totalutilPrice) + parseInt(this.state.employeeInfoList[i].unitPrice)
            }
            if(this.state.employeeInfoList[i].grosProfits==null){
                totalgrosProfits = parseInt(totalgrosProfits) + 0;
            }else{
                totalgrosProfits = parseInt(totalgrosProfits) + parseInt(this.state.employeeInfoList[i].grosProfits) 
            }
        }
        this.setState({totalutilPrice:totalutilPrice+"万円"})
        this.setState({totalgrosProfits:totalgrosProfits})
        this.setState({paymentTotal:paymentTotal})
    }
	componentDidMount(){
        this.getDropDown();
		var date = new Date();
		var year = date.getFullYear();
		$('#fiscalYear').append('<option value="">'+""+'</option>');
		for(var i=2019;i<=year;i++){
				$('#fiscalYear').append('<option value="'+i+'">'+i+'</option>');
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

    renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}
    getDropDown = () => {
		var method = ["getEmployeeName"]
		var data = publicUtils.getPublicDropDown(method);
		this.setState(
			{
				employeeName: data[0],//　性別区別

			}
		);
	};

render (){
    const { employeeName } = this.state;
        return(
            <div>
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
                            <FormControl id="fiscalYear"  name="fiscalYear" value={this.state.fiscalYear} as="select" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.valueChange} />
                        </InputGroup>
                    </Col>
                    <Col sm={3}>
                    <p id ="individualSalesErrmsg" style={{visibility:"hidden"}} class="font-italic font-weight-light text-danger"></p>
                    </Col>
				</Row>
				<Row>
                <Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend><InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text></InputGroup.Prepend>
									
                                    {/* <FormControl placeholder="社員名" size="sm"  id="employeeName" name="employeeName" value={this.state.employeeName} onChange={this.valueChange}/>{' '} */}
									<Autocomplete
									id="employeeName"
									name="employeeName"
									value={employeeName}
									options={this.state.employeeName}
									getOptionLabel={(option) => option.name}
									clearOnBlur
									renderInput={(params) => (
										<div ref={params.InputProps.ref}>
											<input placeholder="社員名" type="text" {...params.inputProps}
												style={{ width: 160, height: 31, borderColor: "#ced4da", borderWidth: 1, borderStyle: "solid", fontSize: ".875rem", color: "#495057" }} />
										</div>
									)}
								/>
                                    {/* <FormControl placeholder="社員名" size="sm" id="employeeLastName" name="employeeLastName" value={this.state.employeeLastName} onChange={this.valueChange}/> */}
                                    <font color="red" style={{ marginLeft: "10px", marginRight: "10px" }}>★</font>
								</InputGroup>
							</Col>
                    <Col sm={3}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl name="employeeNo" value={this.state.employeeNo}  onChange={this.valueChange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                        </InputGroup>
                    </Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
                                selected={this.state.individualSales_startYearAndMonth}
                                onChange={this.individualSalesStartYearAndMonthChange}
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
								</DatePicker><font id="mark" style={{marginLeft: "20px",marginRight: "20px"}}>～</font><DatePicker
                                selected={this.state.individualSales_endYearAndMonth}
                                onChange={this.individualSalesEndYearAndMonthChange}
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
                            <InputGroup.Append>                 
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
				<Row>
					<Col  className="text-center">
					<Button variant="info" size="sm" id="shusei"　onClick={this.searchEmployee}><FontAwesomeIcon icon={faSearch} />検索</Button>
                    </Col> 
                </Row>
				<Row>
                    <Col sm={3}>
                            <label>稼働月数:</label>
                            <label id="workMonthCount"name="workMonthCount" >{this.state.workMonthCount}</label>
						</Col>
                    
						<Col sm={3}>
                            <label>単価合計:</label>
                            <label id="utilPriceTotal" name="utilPriceTotal" >{'\u00A0'}{'\u00A0'}{this.state.totalutilPrice}</label>
						</Col>
						<Col sm={3}>

                            <label>支払合計:</label>
                            <label id="paymentTotal" name="paymentTotal" type="text">{this.state.paymentTotal}</label>
						</Col>
						<Col sm={3}>
                            <label>粗利合計:</label>
                            <label id="grossProfitTotal" name="grossProfitTotal" type="text">{'\u00A0'}{'\u00A0'}{this.state.totalgrosProfits}</label>
						</Col>
				</Row>
                <div>
                    <BootstrapTable data={this.state.employeeInfoList} className={"bg-white text-dark"} pagination={true}  headerStyle={{ background: '#B1F9D0' }}  options={this.options}>
							<TableHeaderColumn  dataField='onlyYandM'dataSort={true} caretRender={publicUtils.getCaret} isKey>年月</TableHeaderColumn>                           
							<TableHeaderColumn  dataField='employeeFormName'>社員形式</TableHeaderColumn>
							<TableHeaderColumn  width='125' dataField='customerName'>所属客様</TableHeaderColumn>
							<TableHeaderColumn  dataField='unitPrice'>単価</TableHeaderColumn>
							<TableHeaderColumn  dataField='salary'>基本支給</TableHeaderColumn>
							<TableHeaderColumn  dataField='transportationExpenses'>交通代</TableHeaderColumn>
							<TableHeaderColumn  dataField='insuranceFeeAmount'>社会保険</TableHeaderColumn>
							<TableHeaderColumn  dataField='scheduleOfBonusAmount'>ボーナス</TableHeaderColumn>
							<TableHeaderColumn  width='125' dataField='leaderAllowanceAmount'>リーダー手当</TableHeaderColumn>
							<TableHeaderColumn  dataField='otherAllowanceAmount'>他の手当</TableHeaderColumn>
							<TableHeaderColumn  dataField='grosProfits'>粗利</TableHeaderColumn>         
					</BootstrapTable>
                    </div>
						
			</div>
        );
    }
}export default individualSales;