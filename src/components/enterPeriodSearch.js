import React, { Component } from 'react';
import { Row, Col, InputGroup, FormControl, Button, Table, OverlayTrigger, Form , Popover } from 'react-bootstrap';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from 'date-fns/locale/ja';
import Autocomplete from '@material-ui/lab/Autocomplete';
import $ from 'jquery';
import axios from 'axios';
import * as utils from './utils/publicUtils.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import store from './redux/store';

registerLocale('ja', ja);
axios.defaults.withCredentials = true;
/**
 * 入社入場期限検索画面
 */
class EnterPeriodSearch extends React.Component {
    state = {
    	yearAndMonthDate: new Date(),
        /*yearAndMonthDate: new Date('' + (new Date().getMonth() === 11 ? (new Date().getFullYear() + 1) : new Date().getFullYear()) + ' ' + 
        (new Date().getMonth() === 11 ? 1 : new Date().getMonth() + 2) + ''),//今の期日より一月後の年月*/
    	enterPeriodKbn: '0',//区分
        enterPeriodKbnDrop: [],//区分List
        enterPeriodList: [],//入社入場期限List
        actionType: '',//処理区分
        employeeNameDrop: [],//社員名Drop
        employeeNameDropBp:[],//社員名Drop（BP含む）
        message: '',
        type: '',
        myToastShow: false,
        errorsMessageShow: false,
        errorsMessageValue: '',
        rowSelectEmployeeNo: '',
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
    }
    componentDidMount(){
        this.setState({
            employeeNameDrop:store.getState().dropDown[38].slice(1),
            enterPeriodKbnDrop:store.getState().dropDown[29].slice(1),
            employeeNameDropBp:store.getState().dropDown[9].slice(1),
        })
        if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
            this.setState({
                yearAndMonthDate: this.props.location.state.sendValue.yearAndMonthDate,
                enterPeriodKbn: this.props.location.state.sendValue.enterPeriodKbn,
                //employeeName: this.props.location.state.sendValue.employeeName,
            },()=>{
                this.search(utils.formateDate(this.state.yearAndMonthDate,false),this.state.enterPeriodKbn,utils.labelGetValue(this.props.location.state.sendValue.employeeNo,this.state.employeeNameDrop));
            })
        }else{
            this.search(utils.formateDate(this.state.yearAndMonthDate,false),this.state.enterPeriodKbn,utils.labelGetValue($("#employeeName").val(),this.state.employeeNameDrop));
        }
    }
    /**
     * 年月のonChange 
     */
    yearAndMonthDateChange = date => {
        if (date !== null) {
            this.setState({
                yearAndMonthDate: date,
            }, () => {
                this.search(utils.formateDate(this.state.yearAndMonthDate,false),this.state.enterPeriodKbn,utils.labelGetValue($("#employeeName").val(),this.state.employeeNameDrop));
            });
        } else {
            this.setState({
                yearAndMonthDate: new Date('' + (new Date().getMonth() === 11 ? (new Date().getFullYear() + 1) : new Date().getFullYear()) + ' ' + 
                (new Date().getMonth() === 11 ? 1 : new Date().getMonth() + 2) + ''),
            }, () => {
                this.search(utils.formateDate(this.state.yearAndMonthDate,false) ,
                    this.state.enterPeriodKbn,
                        utils.labelGetValue($("#employeeName").val() , this.state.employeeNameDrop));
            });
        }
    }
    /**
     * 社員名連想
     * @param {} event 
     */
    getEmployeeName = (event,values) => {
        this.setState({
            [event.target.name]: event.target.value,
        },()=>{
            var employeeNo = null;
            if(values !== null){
                employeeNo = values.code;
            }
            this.setState({
                employeeName:employeeNo,
            })
            this.search(utils.formateDate(this.state.yearAndMonthDate,false) ,
                    this.state.enterPeriodKbn,
                    employeeNo);
        })
    }
    /**
     * 検索メソッド
     * @param {} yearAndMonth 画面の年月
     * @param {*} enterPeriodKbn 区分
     * @param {*} employeeNo 社員番号
     */
    search=(yearAndMonth,enterPeriodKbn,employeeNo)=>{
        var enterPeriodSearchModel = {};
        enterPeriodSearchModel["yearAndMonth"] = yearAndMonth;
        enterPeriodSearchModel["employeeNo"] = employeeNo;
        enterPeriodSearchModel["enterPeriodKbn"] = enterPeriodKbn;
            axios.post(this.state.serverIP + "enterPeriodSearch/selectEnterPeriodDataNew", enterPeriodSearchModel)
                .then(result => {
                    if (result.data.errorsMessage === null || result.data.errorsMessage === undefined) {
                        this.setState({
                            enterPeriodList: result.data.enterPeriodList,
                        })
                    } else {
                        this.setState({
                            enterPeriodList: [],
                        })
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
                        setTimeout(() => this.setState({ "errorsMessageShow": false }), 3000);
                    }
                })
    }
    /**
     * テーブルの下もの
     * @param {} start 
     * @param {*} to 
     * @param {*} total 
     */
    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
                {start}から  {to}まで , 総計{total}
            </p>
        );
    }
    //onchange
    valueChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
            employeeName:'',
        },()=>{
            this.search(utils.formateDate(this.state.yearAndMonthDate,false) ,
                    this.state.enterPeriodKbn,
                        utils.labelGetValue($("#employeeName").val() , this.state.employeeNameDrop));
        })
    }
    periodButton=(cell,row)=>{
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
            <Popover>
                <Popover.Content>
                <div>
                    <BootstrapTable
                        pagination={false}
                        options={options}
            			selectRow={selectRow}
                        data={row.nonSitePeriodsList}
                        headerStyle={{ background: '#5599FF' }}
                        striped
                        hover
                        condensed>
                        <TableHeaderColumn isKey={true} dataField='nonSitePeriod' tdStyle={{ padding: '.45em' }} >
                        非稼働期間</TableHeaderColumn>
                        <TableHeaderColumn dataField='nonSiteMonths' tdStyle={{ padding: '.45em' }} width="40%">
                        非稼働月数</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                </Popover.Content>
            </Popover>
            }
        >
        <Button variant="warning" size="sm" className="hikadoButton">非稼働期間</Button>
      </OverlayTrigger>
        return returnItem;
    }
    
    colorChange = (cell,row) => {
    	if(row.isRed === "true")
    		return (<div><font color="red">{row.employeeName}</font></div>);
    	else
    		return (<div><font>{row.employeeName}</font></div>);
    }
    
    //以下の四つは金額マークの追加
    addMarkSalary=(cell,row)=>{
        let salary = utils.addComma(row.salary);
        return salary;
    }
    addMarkInsuranceFeeAmount=(cell,row)=>{
        let insuranceFeeAmount = utils.addComma(row.insuranceFeeAmount);
        if(insuranceFeeAmount === "0")
        	return "";
        return insuranceFeeAmount;
    }
    addMarkUnitPrice=(cell,row)=>{
        let unitPrice = utils.addComma(row.unitPrice);
        return unitPrice;
    }
    addMarkScheduleOfBonusAmount=(cell,row)=>{
    	if(row.scheduleOfBonusAmount === "0" || row.scheduleOfBonusAmount === "0.0")
    		return "";
        let scheduleOfBonusAmount = utils.addComma(row.scheduleOfBonusAmount);
        return scheduleOfBonusAmount.replace(".0","");
    }
    //以下の二つは期日に/の追加
    addMarkReflectYearAndMonth=(cell,row)=>{
        let reflectYearAndMonth = utils.dateFormate(row.reflectYearAndMonth);
        return reflectYearAndMonth;
    }
    addMarkAdmissionStartDate=(cell,row)=>{
        let admissionStartDate = utils.dateFormate(row.admissionStartDate);
        if(admissionStartDate === "")
        	return "";
        admissionStartDate += "(" + row.admissionMonth + ")";
        return admissionStartDate;
    }
    
	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = {
				yearAndMonthDate: this.state.yearAndMonthDate,
				enterPeriodKbn: this.state.enterPeriodKbn,
				employeeName: this.state.employeeName,
				employeeNo: $("#employeeName").val(),
		};
		switch (actionType) {
			case "detail":
				path = {
					pathname: '/subMenuManager/employeeDetailNew',
					state: {
						actionType: 'detail',
						id: this.state.rowSelectEmployeeNo,
						backPage: "enterPeriodSearch",
						sendValue: sendValue,
					},
				}
			break;
			case "wagesInfo":
				path = {
					pathname: '/subMenuManager/wagesInfo',
					state: {
						actionType: "insert",
						employeeNo: this.state.rowSelectEmployeeNo,
						backPage: "enterPeriodSearch",
						sendValue: sendValue,
					},
				}
				break;
			case "siteInfo":
				path = {
					pathname: '/subMenuManager/siteInfo',
					state: {
						employeeNo: this.state.rowSelectEmployeeNo,
						backPage: "enterPeriodSearch",
						sendValue: sendValue,
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
	}
    
	handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState(
					{
						rowSelectEmployeeNo: row.employeeNo,
					}
			);
		}
		else{
			this.setState(
					{
						rowSelectEmployeeNo: "",
					}
			);
		}
	}	
	
    render() {
        const {
            yearAndMonthDate,
            employeeNameDrop,
            enterPeriodKbnDrop,
            enterPeriodKbn,
            employeeName,
            actionType,
            message,
            type,
            errorsMessageValue,
            enterPeriodList, } = this.state;
        //テーブルの定義
        const options = {
            noDataText: (<i>データなし</i>),
            page: 1,  // which page you want to show as default
            sizePerPage: 12,  // which size per page you want to locate as default
            pageStartIndex: 1, // where to start counting the pages
            paginationSize: 3,  // the pagination bar size.
            prePage: '<', // Previous page button text
            nextPage: '>', // Next page button text
            firstPage: '<<', // First page button text
            lastPage: '>>', // Last page button text
            expandRowBgColor: 'rgb(165, 165, 165)',
            paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
            hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
            expandRowBgColor: 'rgb(165, 165, 165)',
        };
		const selectRow = {
				mode: 'radio',
				bgColor: 'pink',
				clickToSelectAndEditCell: true,
				hideSelectColumn: true,
				clickToSelect: true,
				clickToExpand: true,
				onSelect: this.handleRowSelect,
			};
        return (
            <div>
                <div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
                    <MyToast myToastShow={this.state.myToastShow} message={message} type={type} />
                </div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
                    <ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
                </div>
                <Row inline="true">
                    <Col className="text-center">
                        <h2>入社入場期限一覧（一年）</h2>
                    </Col>
                </Row>
                <br />
                <Form id="enterPeriodForm">
                    <Row>
                        <Col sm="3">
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
                                </InputGroup.Prepend>
                                <DatePicker
                                    selected={yearAndMonthDate}
                                    onChange={this.yearAndMonthDateChange}
                                    dateFormat={"yyyy/MM"}
                                    autoComplete="off"
                                    locale="pt-BR"
                                    showYearDropdown
                                    yearDropdownItemNumber={15}
                                    scrollableYearDropdown
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    minDate={new Date(new Date().getFullYear(), new Date().getMonth())}
                                    showDisabledMonthNavigation
                                    className="form-control form-control-sm"
                                    id="enterPeriodSearchDatePicker"
                                    name="businessStartDate"
                                    locale="ja"
                                />
                            </InputGroup>
                        </Col>
                        <Col sm="3">
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>区分</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    as="select"
                                    disabled={actionType === "detail" ? true : false}
                                    name="enterPeriodKbn"
                                    onChange={this.valueChange}
                                    value={enterPeriodKbn}>
                                    {this.state.enterPeriodKbnDrop.map(data =>
                                        <option key={data.code} value={data.code}>
                                            {data.name}
                                        </option>
                                    )}
                                </FormControl>
                            </InputGroup>
                        </Col>
                        <Col sm="6">
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>社員名</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Autocomplete
                                    id="employeeName"
                                    name="employeeName"
                                    value={enterPeriodKbn === "1" ? this.state.employeeNameDropBp.find(v => v.code === this.state.employeeName) || {} : 
                                    this.state.employeeNameDrop.find(v => v.code === this.state.employeeName) || {}}
                                    options={enterPeriodKbn === "1" ? this.state.employeeNameDropBp : this.state.employeeNameDrop}
                                    getOptionLabel={(option) => option.text}
                                    onChange={(event,values)=>this.getEmployeeName(event,values)}
                                    renderOption={(option) => {
                                        return (
                                        <React.Fragment>
                                        {option.name}
                                        </React.Fragment>
                                        )
                                    }}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref}>
                                        <input placeholder="  例：佐藤真一" type="text" {...params.inputProps} className="form-control Autocomplete-style"
                                            style={{ width: 200,}}
                                         />
                                        </div>
                                    )}
                                    />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
	                    <Col sm="12">
							<Button size="sm" onClick={this.shuseiTo.bind(this, "detail")} disabled={this.state.rowSelectEmployeeNo === "" ? true : false} name="clickButton" variant="info" id="siteInfo">個人情報</Button>{' '}
							<Button size="sm" onClick={this.shuseiTo.bind(this, "siteInfo")} disabled={this.state.rowSelectEmployeeNo === "" ? true : false} name="clickButton" variant="info" id="siteInfo">現場情報</Button>{' '}
							<Button size="sm" onClick={this.shuseiTo.bind(this, "wagesInfo")} disabled={this.state.rowSelectEmployeeNo === "" ? true : false} name="clickButton" variant="info" id="siteInfo">給料情報</Button>{' '}
	                    </Col>
                    </Row>
                </Form>
				<Col>
                <div>
                    <BootstrapTable
                        pagination={true}
                        options={options}
                        data={enterPeriodList}
						selectRow={selectRow}
                        headerStyle={{ background: '#5599FF' }}
                        striped
                        hover
                        condensed>
                        <TableHeaderColumn isKey={true} dataField='rowNo' tdStyle={{ padding: '.45em' }} width='6%' >
                            番号</TableHeaderColumn>
                        <TableHeaderColumn dataField='employeeNo' tdStyle={{ padding: '.45em' }} hidden >
                            社員番号</TableHeaderColumn>
                        <TableHeaderColumn dataField='employeeName' tdStyle={{ padding: '.45em' }} dataFormat={this.colorChange} width='11%' >
                            氏名</TableHeaderColumn>
                        <TableHeaderColumn dataField='salary' tdStyle={{ padding: '.45em' }} width='11%' dataFormat={this.addMarkSalary}>
                            基本支給</TableHeaderColumn>
                        <TableHeaderColumn dataField='insuranceFeeAmount' tdStyle={{ padding: '.45em' }} width='10%' dataFormat={this.addMarkInsuranceFeeAmount}>
                            社会保険</TableHeaderColumn>
                        <TableHeaderColumn dataField='reflectYearAndMonth' tdStyle={{ padding: '.45em' }} width='12%' dataFormat={this.addMarkReflectYearAndMonth}>
                            直近調整年月</TableHeaderColumn>
                        <TableHeaderColumn dataField='admissionStartDate' tdStyle={{ padding: '.45em' }} width='14%' dataFormat={this.addMarkAdmissionStartDate}>
                            直近入場年月日</TableHeaderColumn>
                        <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='11%' dataFormat={this.periodButton.bind(this)}>
                            非稼動月数</TableHeaderColumn>
                        <TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }} width='12%' dataFormat={this.addMarkUnitPrice}>
                            単価（円）</TableHeaderColumn>
                        <TableHeaderColumn dataField='scheduleOfBonusAmount' tdStyle={{ padding: '.45em' }} width='13%' dataFormat={this.addMarkScheduleOfBonusAmount}>
                            ボーナス予定額</TableHeaderColumn>
                    </BootstrapTable>
                </div>
				</Col>
            </div>
        );
    }
}
export default EnterPeriodSearch;