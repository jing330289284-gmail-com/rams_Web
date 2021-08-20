import React,{Component} from 'react';
import {Row , Col , InputGroup ,Form, Button } from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import $ from 'jquery';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios';
import store from './redux/store';
axios.defaults.withCredentials = true;

class situationChange extends Component {//状況変動一覧
     constructor(props){
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

		};
    }

    initialState = {
        situationChange:'0',
        rowSelectEmployeeNo: "",
        isStart:true,
        startsituationChange:new Date(),
        endsituationChange:new Date(),
        situationChanges: store.getState().dropDown[39].slice(1),
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    }

               	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
        } ,()=>{this.selectSituationChange()})       
    }

    componentDidMount(){
        if (this.props.location.state !== null && this.props.location.state !== undefined && this.props.location.state !== '') {
        	$("#situationChange").val(this.props.location.state.sendValue.situationChange);
    		this.setState({
    			situationChange: this.props.location.state.sendValue.situationChange,
    			startsituationChange: this.props.location.state.sendValue.startsituationChange,
    			endsituationChange: this.props.location.state.sendValue.endsituationChange,
            } ,()=>{this.selectSituationChange()})   
        }
        else{
            this.selectSituationChange();
        }
    }
    startsituationChange = date => {
        if(date !== null){
            this.setState({
                startsituationChange: date,
            },()=>{this.selectSituationChange()});
        }else{
            this.setState({
                startsituationChange: new Date(),
            },()=>{this.selectSituationChange()});
        }
    };
    
    endsituationChange = date => {
        if(date !== null){
            this.setState({
                endsituationChange: date,
            },()=>{this.selectSituationChange()});
        }else{
            this.setState({
                endsituationChange: new Date(),
            },()=>{this.selectSituationChange()});
        }
    };
    
selectSituationChange =() => {
    if(this.state.startsituationChange!=null&&this.state.endsituationChange!=null){
        const situationInfo = {
            classification:this.state.situationChange,
            startYandM: publicUtils.formateDate(this.state.startsituationChange,false),
            endYandM: publicUtils.formateDate(this.state.endsituationChange,false),

        };
        axios.post(this.state.serverIP + "SituationChange/searchSituationTest", situationInfo)
			.then(response => {
				if (response.data.errorsMessage != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage,isStart: false });
                }else if(response.data.noData != null){
                	if(this.state.isStart){
                        this.setState({ isStart: false});
                	}else{
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.noData,situationInfoList: response.data.data });
                	}
                }else {
                    this.setState({"errorsMessageShow":false})
                    this.setState({ situationInfoList: response.data.data,isStart: false })
				 }
			}).catch((error) => {
				console.error("Error - " + error);
			});
        }

}

bonusAmount(cell, row) {
    if (row.scheduleOfBonusAmount === null || row.scheduleOfBonusAmount === "") {
        return
    } else {
        let scheduleOfBonusAmount = row.scheduleOfBonusAmount.replace(".0","")
        return scheduleOfBonusAmount;
    }
}

handleRowSelect = (row, isSelected, e) => {
	if (isSelected) {this.setState({rowSelectEmployeeNo: row.employeeNo,});}
	else{this.setState({rowSelectEmployeeNo: "",});}
}	

renderShowsTotal(start, to, total) {
    return (
        <p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
            {start}から  {to}まで , 総計{total}
        </p>
    );
}

shuseiTo = (actionType) => {
	var path = {};
	const sendValue = {
			situationChange: this.state.situationChange,
			startsituationChange: this.state.startsituationChange,
			endsituationChange: this.state.endsituationChange,
	};
	switch (actionType) {
		case "detail":
			path = {
				pathname: '/subMenuManager/employeeDetailNew',
				state: {
					actionType: 'detail',
					id: this.state.rowSelectEmployeeNo,
					backPage: "situationChange",
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
					backPage: "situationChange",
					sendValue: sendValue,
				},
			}
			break;
		case "siteInfo":
			path = {
				pathname: '/subMenuManager/siteInfo',
				state: {
					employeeNo: this.state.rowSelectEmployeeNo,
					backPage: "situationChange",
					sendValue: sendValue,
				},
			}
			break;
		default:
	}
	this.props.history.push(path);
}

    render(){
        const  situationChanges= this.state.situationChanges;
        const  errorsMessageValue= this.state.errorsMessageValue;
		const selectRow = {
				mode: 'radio',
				bgColor: 'pink',
				clickToSelectAndEditCell: true,
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
                 <Row inline="true">
                     <Col  className="text-center">
                    <h2>状況変動一覧</h2>
                    </Col> 
                </Row>
                <br/>
                <Row>
                <Col sm={3}>
					<InputGroup size="sm" className="mb-3">
						<InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-sm">区分</InputGroup.Text></InputGroup.Prepend>
                           <Form.Control as="select" size="sm" onChange={this.valueChange} name="situationChange" id="situationChange"autoComplete="off">
							{situationChanges.map(data =>
							<option key={data.code} value={data.code}>
								{data.name}
								</option>
							)}
                            </Form.Control>
						</InputGroup>
					</Col>
                    <Col sm={6}>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
                                selected={this.state.startsituationChange}
                                onChange={this.startsituationChange}
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
                                selected={this.state.endsituationChange}
                                onChange={this.endsituationChange}
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
	                <Col>
						<Button size="sm" onClick={this.shuseiTo.bind(this, "detail")} disabled={this.state.rowSelectEmployeeNo === "" ? true : false} name="clickButton" variant="info" id="siteInfo">個人情報</Button>{' '}
						<Button size="sm" onClick={this.shuseiTo.bind(this, "siteInfo")} disabled={this.state.rowSelectEmployeeNo === "" ? true : false} name="clickButton" variant="info" id="siteInfo">現場情報</Button>{' '}
						<Button size="sm" onClick={this.shuseiTo.bind(this, "wagesInfo")} disabled={this.state.rowSelectEmployeeNo === "" ? true : false} name="clickButton" variant="info" id="siteInfo">給料情報</Button>{' '}
		            </Col>
				</Row>
				<Col>
                <div>
                    <BootstrapTable data={this.state.situationInfoList}
					selectRow={selectRow}
                    pagination={true}  headerStyle={{ background: '#5599FF' }} options={this.options}　striped hover condensed>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='80' dataField='rowNo'dataSort={true} isKey>番号</TableHeaderColumn>
                            <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='110' dataField='reflectYearAndMonth'>年月</TableHeaderColumn>                           
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='110' dataField='employeeNo' hidden >社員番号</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='180' dataField='employeeName'>社員名</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='110' dataField='status'>区分</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeFormName'>社員形式</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='salary'>給料</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='socialInsuranceFlag'>社会保険</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='scheduleOfBonusAmount' dataFormat={this.bonusAmount} >ボーナス</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125' dataField='remark' >備考</TableHeaderColumn>
					</BootstrapTable>
                    </div>
                 </Col>
         </div>
        )
    }
}
    export default situationChange;

