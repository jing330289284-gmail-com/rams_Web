import React,{Component} from 'react';
import {Row , Col , InputGroup ,Form, Button } from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios';
import store from './redux/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEnvelope, faIdCard, faListOl, faBuilding, faDownload, faBook } from '@fortawesome/free-solid-svg-icons';
axios.defaults.withCredentials = true;

class employeeInformation extends Component {// 状況変動一覧
     constructor(props){
        super(props);
        this.state = this.initialState;// 初期化
		this.options = {
			sizePerPage: 15,
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
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		modeSelect: 'checkbox',
		selectetRowIds: [],
    }
               	// onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
        });   
    }

    componentDidMount(){
	    	axios.post(this.state.serverIP + "EmployeeInformation/getEmployeeInformation")
			.then(response => {
				this.setState({
					situationInfoList:response.data.data
		        });   
			}).catch((error) => {
				console.error("Error - " + error);
			});
    }
    
	// 優先度表示
    stayPeriodChange(cell,row) {
    	if(row.stayPeriod <= 90){
        	return (<div><font color="red">{row.stayPeriod}</font></div>);
    	}
    	else{
        	return (<div><font>{row.stayPeriod}</font></div>);
    	}
	}
    
    birthdayChange(cell,row) {
    	if(row.birthday <= 7){
        	return (<div><font color="red">{row.birthday}</font></div>);
    	}
    	else{
        	return (<div><font>{row.birthday}</font></div>);
    	}
	}
    
    contractDeadlineChange(cell,row) {
    	if(row.birthday <= 60){
        	return (<div><font color="red">{row.contractDeadline}</font></div>);
    	}
    	else{
        	return (<div><font>{row.contractDeadline}</font></div>);
    	}
	}
    
    handleRowSelect = (row, isSelected, e) => {
		if (isSelected) {
			this.setState({
				selectetRowIds: row.employeeNo === null ? [] : this.state.selectetRowIds.concat([row.employeeNo]),
			});
		} else {
			this.setState({
				selectetRowIds: [],
			});
		}
	}
    
    render(){
        const  situationChanges= this.state.situationChanges;
        const  errorsMessageValue= this.state.errorsMessageValue;
        const selectRow = {
    			mode: this.state.modeSelect,
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
                    <h2>個人情報期限一覧</h2>
                    </Col> 
                </Row>
                <br/>
                <Row>
                    <Col sm={12}>
                    <div style={{ "float": "right" }}>
					<Button size="sm" variant="info" name="clickButton"><FontAwesomeIcon icon={faSave} /> 更新</Button>{' '}
                    </div>
                    </Col>
				</Row>
				<Col>
                <div>
                    <BootstrapTable data={this.state.situationInfoList}
                    pagination={true}
                    headerStyle={{ background: '#5599FF' }}
                    options={this.options}
                    selectRow={selectRow}
　					striped hover condensed>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='14%' dataField='rowNo' >番号</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} hidden dataField='employeeNo' isKey>社員番号</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='14%' dataField='employeeName'>社員名</TableHeaderColumn>
                            <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='14%' dataField='stayPeriod' dataFormat={this.stayPeriodChange}>在留カード</TableHeaderColumn>                           
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='14%' dataField='birthday' dataFormat={this.birthdayChange}>誕生日</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='14%' dataField='contractDeadline' dataFormat={this.contractDeadlineChange}>契約</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='14%' dataField='passportStayPeriod' >パスポート</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='14%' dataField='DealDistinctioCode' >処理区分</TableHeaderColumn>
					</BootstrapTable>
                    </div>
                 </Col>
         </div>
        )
    }
}
    export default employeeInformation;

