import React, { Component } from 'react';
import { Row, Col, InputGroup, Button, FormControl, Popover, OverlayTrigger, Table } from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorsMessageToast from './errorsMessageToast';
import store from './redux/store';
axios.defaults.withCredentials = true;

class customerSalesList extends React.Component {
    state = {
        perCal:[],
        totalHidden:'',
    }
    constructor(props) {
        super(props);
        this.state = this.initialState;//初期化
        this.options = {
            sizePerPage: 12,
            pageStartIndex: 1,
            paginationSize: 3,
            prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
            hideSizePerPage: true,
            alwaysShowAllBtns: true,
            paginationShowsTotal: this.renderShowsTotal,
        }
    }

    initialState = {
            customerSalesListYearAndMonth:'',
            serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
            perCal:[],
            CustomerSaleslListInfoList: [],
            totalGrossProfitAdd: 0,
            countPeo: 0,
        }
    
	renderShowsTotal = () => {
		return (
			<p style={{ color: 'dark', "float": "left" }}  >
				稼働人数：{this.state.countPeo}
			</p>
		);
	}


    customerSalesListYearAndMonth = date => {
        if (date !== null) {
            this.setState({
                customerSalesListYearAndMonth: date,
            },()=>this.searchCustomer());
        } else {
            this.setState({
                customerSalesListYearAndMonth: '',
            });
        }
    };

    searchCustomer = () => {

        const customerSalesListInfo = {
            yearAndMonth:
            publicUtils.formateDate(this.state.customerSalesListYearAndMonth, false),
            
        };
        
        axios.post(this.state.serverIP + "customerSalesList/searchCustomerSalesList", customerSalesListInfo)
            .then(response => {
                if (response.data.errorsMessage != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
                } else if (response.data.noData != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.noData });
                }
                else {
                	let countPeo = 0;
                	for(let i in response.data.data){
                		countPeo += Number(response.data.data[i].countPeo);
                	}
                		
                     this.setState({ "errorsMessageShow": false })
                     this.setState({ CustomerSaleslListInfoList: response.data.data })
                     this.setState({ calPeoCount: this.state.CustomerSaleslListInfoList[0].calPeoCount })
                     this.setState({unitPTotal:publicUtils.addComma(this.state.CustomerSaleslListInfoList[0].unitPTotal,false)})
                     this.setState({totalSales:publicUtils.addComma(this.state.CustomerSaleslListInfoList[0].totalSales,false)})
                     this.setState({totalgrossProfit:publicUtils.addComma(this.state.CustomerSaleslListInfoList[0].totalgrossProfit,false)})
                     /*this.setState({totalpercent:''})*/
                     this.refs.CustomerSaleslListInfoListTable.setState({
                        selectedRowKeys: []
                    });
                     this.setState({totalHidden:''})
                     this.setState({
                        perCal:[],
                        totalGrossProfitAdd: 0,
                        countPeo: countPeo,
                        unitPTotal: publicUtils.addComma((this.state.CustomerSaleslListInfoList[0].unitPTotal/countPeo).toFixed(0),false),
                     })
    
                    
                }
            }).catch((error) => {
                console.error("Error - " + error);
            });
    }

    averUnitPriceFormat(cell ,row){
        if(row. averUnitPrice===null||row. averUnitPrice==="0"||row. averUnitPrice===NaN){
            return 
        }else{
            let averageUnitP ;
            let formatTotalUnitPrice = row. averUnitPrice.split('.')[1];
            if(formatTotalUnitPrice!=="0"){
                averageUnitP= row. averUnitPrice
            }
            else{
                averageUnitP= row. averUnitPrice.split('.')[0]
            }
         return publicUtils.addComma( averageUnitP,false);
        } 
    }

    totalUnitPriceFormat(cell,row){
        if(row. totalUnitPrice===null||row. totalUnitPrice==="0"){
            return 
        }else{
            let formatTotalUnitPrice = row.totalUnitPrice
         return publicUtils.addComma( formatTotalUnitPrice,false);
        }
    }
    
    costChange = (cell, row) => {
    	if(cell === "0")
    		return "";
    	if(Number(row.cost) > Number(row.unitPrice))
    		return (<div style={{ color: 'red' }}>{cell}</div>);
    	return cell;
    }

    empDetailCheck=(cell,row)=>{

        let returnItem = cell;
        const options = {
            noDataText: (<i className="" style={{ 'fontSize': '20px' }}>データなし</i>),
            expandRowBgColor: 'rgb(165, 165, 165)',
            hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
            expandRowBgColor: 'rgb(165, 165, 165)',
        };
        const selectRow = {
                mode: 'radio',
                bgColor: 'pink',
                hideSelectColumn: true,
                clickToSelect: true,
                clickToExpand: true,
            };
        returnItem = 
        <OverlayTrigger 
            trigger="click"
            placement={"left"}
            overlay={
            <Popover className="popoverC">
                <Popover.Content >
                <div >
                    <BootstrapTable 
                        pagination={false}
                        options={options}
                        data={row.empDetail}
                		selectRow={selectRow}
                        headerStyle={{ background: '#5599FF' }}
                        striped
                        hover
                        condensed>
                        <TableHeaderColumn isKey={true} dataField='employeeName'tdStyle={{ padding: '.45em' }} width="30%">
                        氏名</TableHeaderColumn>
                        <TableHeaderColumn dataField='siteRoleName' tdStyle={{ padding: '.45em' }}>
                        役割</TableHeaderColumn>
                        <TableHeaderColumn dataField='stationName'tdStyle={{ padding: '.45em' }} width="30%" >
                        現場先</TableHeaderColumn>
                        <TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }}>
                        単価(万)</TableHeaderColumn>
                        <TableHeaderColumn dataField='cost' dataFormat={this.costChange} tdStyle={{ padding: '.45em' }}>
                        費用(万)</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                </Popover.Content>
            </Popover>
            }
        >
        <Button variant="warning" size="sm" >要員確認</Button>
      </OverlayTrigger>
        return returnItem;
    }

    overTimeFeeAddComma(cell,row){
        if(row.overTimeFee===null||row.overTimeFee==="0"){
            return
        }
        else{
            let formatoverTimeFee = publicUtils.addComma(row. overTimeFee,false)
            return formatoverTimeFee;
        }
    }
    expectFeeAddComma(cell,row){
        if(row.expectFee===null||row.expectFee==="0"){
            return ''
        }
        else{
            let formatexpectFee = publicUtils.addComma(row. expectFee,false)
            return (<div style={{ color: 'red' }}>{formatexpectFee}</div>);
            
        }
    }

    totalAmountAddComma(cell,row){
        if(row.totalAmount===null||row.totalAmount==="0"){
            return ''
        }
        else{
            let formattotalAmount = publicUtils.addComma(row. totalAmount,false)
            return formattotalAmount;
            
        }
    }

    grossProfitAddComma(cell,row){
        if(row.grossProfit===null/*||row.grossProfit==="0"*/){
            return ''
        }
        else{
            if(row.grossProfit<0){
                let formatgrossProfit = publicUtils.addComma(row. grossProfit,false)
                return (<div style={{ color: 'red' }}>{formatgrossProfit}</div>); 
            }
            let formatgrossProfit = publicUtils.addComma(row. grossProfit,false)
            return formatgrossProfit;
            
        }
    }
    
    // 鼠标悬停显示全文
    customerNameFormat = (cell) => {
		return <span title={cell}>{cell}</span>;
	}
    
	handleRowSelect = (row, isSelected,e) => {
        
        if (isSelected) {
           let percent= parseInt(row.totalUnitPrice)+parseInt(row.overTimeFee)+parseInt(row.expectFee)
          this.state.perCal.push(percent)
          var salesCal = 0 ;
            for(var i=0;i<this.state.perCal.length;i++){
                salesCal=parseInt(salesCal)+parseInt(this.state.perCal[i])
            }
            var salesPercet =salesCal/row.totalSales
            var salesToPercet= (Math.round(salesPercet * 10000) / 100).toFixed(1) + '%'; 
            
            let totalGrossProfitAdd = parseInt(this.state.totalGrossProfitAdd) + parseInt(row.grossProfit);
            let grossProfitPercet = 0;
            if(totalGrossProfitAdd > 0){
            	let totalgrossProfit = publicUtils.deleteComma(this.state.totalgrossProfit,false)
            	grossProfitPercet = parseInt(totalGrossProfitAdd)/parseInt(totalgrossProfit);
            }
            grossProfitPercet = (Math.round(grossProfitPercet * 10000) / 100).toFixed(1) + '%'; 
           this.setState({
            totalpercent:salesToPercet,
            totalGrossProfitAdd:totalGrossProfitAdd,
            grossProfitPercent:grossProfitPercet,
           })
           this.setState({
            totalHidden:salesCal
        })
           
        }
        else{
            for(var i=this.state.perCal.length;i>=0;i--){
                if(this.state.perCal[i]===parseInt(row.totalUnitPrice) + parseInt(row.overTimeFee)+parseInt(row.expectFee)){
                    this.state.perCal.splice(i, 1);
                }
            }
            var caltotalSales =0;
            for(var j =0;j<this.state.perCal.length;j++){
                caltotalSales = caltotalSales+parseInt(this.state.perCal[j])
            }
            var percentCal =parseInt(this.state.totalHidden)-(parseInt(row.totalUnitPrice)+parseInt(row.overTimeFee)+parseInt(row.expectFee))  
            var salesPercet =percentCal/row.totalSales
            var salesToPercet= (Math.round(salesPercet * 10000) / 100).toFixed(1) + '%'; 
            
            let totalGrossProfitAdd = parseInt(this.state.totalGrossProfitAdd) - parseInt(row.grossProfit);
            let grossProfitPercet = 0;
            if(totalGrossProfitAdd > 0){
            	let totalgrossProfit = publicUtils.deleteComma(this.state.totalgrossProfit,false)
            	grossProfitPercet = parseInt(totalGrossProfitAdd)/parseInt(totalgrossProfit);
            }
            grossProfitPercet = (Math.round(grossProfitPercet * 10000) / 100).toFixed(1) + '%'; 
            
            this.setState({
                totalpercent:salesToPercet,
                totalGrossProfitAdd:totalGrossProfitAdd,
                grossProfitPercent:grossProfitPercet,
            })
            this.setState({
                totalHidden:caltotalSales
            })
            if(salesToPercet=='0.0%'){
/*                this.setState({
                    totalpercent:''
                })*/
                if(this.state.totalHidden===0){
                    this.state.perCal=[]
                }
            }
        }
    }
    
    render() {
        const { errorsMessageValue,  } = this.state;
        const selectRow = {
            mode: 'checkbox',
            bgColor: 'pink',
            hideSelectColumn: true,
            clickToSelect: true,
            clickToExpand: true,
            singleSelect: false, 
            onSelect: this.handleRowSelect.bind(this),
        };
        return (
            <div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <Row inline="true">
                    <Col className="text-center">
                        <h2>お客様売上一覧</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
	                	<InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend >
                                <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
                                    selected={this.state.customerSalesListYearAndMonth}
                                    onChange={this.customerSalesListYearAndMonth}
                                    dateFormat={"yyyy MM"}
                                    autoComplete="off"
                                    locale="pt-BR"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    showDisabledMonthNavigation
                                    className="form-control form-control-sm"
                                    id="customerSalesListDatePicker"
                                    dateFormat={"yyyy/MM"}
                                    name="customerSalesListYearAndMonth"
                                    locale="ja" />
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
	                <Col>
		                <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">全体比率</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
		                    value={this.state.totalpercent}
		                    disabled/>
		                </InputGroup>
	                </Col>
	                
	                <Col>
		                <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">粗利比率</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
		                    value={this.state.grossProfitPercent}
		                    disabled/>
		                </InputGroup>
	                </Col>
	                
	                <Col>
		                <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">平均単価</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
		                    value={this.state.unitPTotal}
		                    disabled/>
		                </InputGroup>
	                </Col>
	                
	                <Col>
		                <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">売上合計</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
		                    value={this.state.totalSales}
		                    disabled/>
		                </InputGroup>
	                </Col>

	                <Col>
		                <InputGroup size="sm">
		                    <InputGroup.Prepend>
		                        <InputGroup.Text id="inputGroup-sizing-sm" className="input-group-indiv">粗利合計</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <FormControl
		                    value={this.state.totalgrossProfit}
		                    disabled/>
		                </InputGroup>
	                </Col>
                </Row>
                <Col >
                    <BootstrapTable data={this.state.CustomerSaleslListInfoList} ref="CustomerSaleslListInfoListTable" pagination={true} selectRow={selectRow} headerStyle={{ background: '#5599FF' }} options={this.options} striped hover condensed >
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='rowNo' isKey width='60'>番号</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='customerName' width='150' dataFormat={this.customerNameFormat.bind(this)}>お客様名</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='totalUnitPrice' dataFormat={this.totalUnitPriceFormat} width='100' >単価合計</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='averUnitPrice' dataFormat={this.averUnitPriceFormat} width='100'>平均単価</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='countPeo' width='100'>稼働人数</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='lastMonthCountPeo' width='100'>先月稼働人数</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='empDetailCheck' dataFormat={this.empDetailCheck.bind(this)} width='100'>要員確認</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='overTimeFee' dataFormat={this.overTimeFeeAddComma} width='90'>残業代</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='expectFee' dataFormat={this.expectFeeAddComma} width='100'>控除</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='totalAmount' dataFormat={this.totalAmountAddComma} width='110'>費用</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='grossProfit' dataFormat={this.grossProfitAddComma} width='100'>粗利</TableHeaderColumn>
                    </BootstrapTable>
                </Col>
            </div>
        );
    }

} export default customerSalesList;