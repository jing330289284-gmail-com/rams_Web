import React,{Component} from 'react';
import {Row , Col , InputGroup ,Form, Button } from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios';
import store from './redux/store';
import MyToast from './myToast';
import TableSelect from './TableSelect';
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
			sortIndicator: false, // 隐藏初始排序箭头
		};
    }

    initialState = {
    	salesProgressCodes: store.getState().dropDown[70],// ステータス
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
		modeSelect: 'checkbox',
		selectetRowIds: [],
		myToastShow: false,
    }
               	// onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
        });   
    }

    componentDidMount(){
    	this.getInformation();
    }
    
    getInformation(){
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
    	if(row.stayPeriodDate <= 90 && row.dealDistinctioCode !== "2"){
        	return (<div><font color="red">{row.stayPeriodDate === 0 ? "" : row.stayPeriodDate}</font></div>);
    	}
    	else{
        	return (<div><font>{row.stayPeriodDate === 0 ? "" : row.stayPeriodDate}</font></div>);
    	}
	}
    
    birthdayChange(cell,row) {
    	if(row.birthdayDate <= 7 && row.dealDistinctioCode !== "2"){
        	return (<div><font color="red">{row.birthdayDate === 0 ? "" : row.birthdayDate}</font></div>);
    	}
    	else{
        	return (<div><font>{row.birthdayDate === 0 ? "" : row.birthdayDate}</font></div>);
    	}
	}
    
    contractDeadlineChange(cell,row) {
    	if(row.contractDeadlineDate <= 60 && row.dealDistinctioCode !== "2"){
        	return (<div><font color="red">{row.contractDeadlineDate === 0 ? "" : row.contractDeadlineDate}</font></div>);
    	}
    	else{
        	return (<div><font>{row.contractDeadlineDate === 0 ? "" : row.contractDeadlineDate}</font></div>);
    	}
	}
    
    passportStayPeriodChange(cell,row)  {
        return (<div><font>{row.passportStayPeriodDate === 0 ? "" : row.passportStayPeriodDate}</font></div>);
	}
    
	// レコードのステータス
	formatType = (cell) => {
		var statuss = this.state.salesProgressCodes;
		for (var i in statuss) {
			if (cell === statuss[i].code) {
				return statuss[i].name;
			}
		}
	}
	
	// 明細選択したSalesProgressCodeを設定する
	getDealDistinctioCode = (no) => {
		this.state.situationInfoList[this.state.rowNo - 1].dealDistinctioCode = no;
		this.formatType(no);
	}
    
    handleRowSelect = (row, isSelected, e) => {
		this.setState({
			rowNo: row.rowNo === null ? '' : row.rowNo,
			dealDistinctioCode: row.dealDistinctioCode === null ? '' : row.dealDistinctioCode,
		});
	}
    
	update = () => {
		let employeeNo = [];
		let dealDistinctioCode = [];
		for(let i = 0; i < this.state.situationInfoList.length; i++){
			employeeNo.push(this.state.situationInfoList[i].employeeNo);
			dealDistinctioCode.push(this.state.situationInfoList[i].dealDistinctioCode);
		}
		this.setState({
			situationInfoList:[]
		});
		
    	axios.post(this.state.serverIP + "EmployeeInformation/updateEmployeeInformation",  {
    		employeeNos : employeeNo,
    		dealDistinctioCodes : dealDistinctioCode
    	})
		.then(response => { 
		    this.getInformation();
			this.setState({ "myToastShow": true, "errorsMessageShow": false });
			setTimeout(() => this.setState({ "myToastShow": false }), 3000);
		}).catch((error) => {
			console.error("Error - " + error);
		});
	}
    
    render(){
        const  situationChanges= this.state.situationChanges;
        const  errorsMessageValue= this.state.errorsMessageValue;
		const cellEdit = {
				mode: 'click',
				blurToSave: true,
			}
        const selectRow = {
    			mode: this.state.modeSelect,
    			clickToSelectAndEditCell: true,
    			hideSelectColumn: true,
    			clickToSelect: true,
    			clickToExpand: true,
    			onSelect: this.handleRowSelect,
    		};
		
		const tableSelect = (onUpdate, props) => (<TableSelect dropdowns={this} flag={12} onUpdate={onUpdate} {...props} />);
		
        return(
            <div>
                <div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
					<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={"更新成功！"} type={"success"} />
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
					<Button size="sm" variant="info" name="clickButton"　onClick={this.update}　><FontAwesomeIcon icon={faSave} /> 更新</Button>{' '}
                    </div>
                    </Col>
				</Row>
				<Col>
                <div>
                    <BootstrapTable
                    data={this.state.situationInfoList}
                    pagination={true}
                    headerStyle={{ background: '#5599FF' }}
                    options={this.options}
                    selectRow={selectRow}
					cellEdit={cellEdit}
　					striped hover condensed>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='12%' dataField='rowNo' editable={false} dataSort >番号</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='12%' dataField='employeeNo' isKey editable={false}>社員番号</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='12%' dataField='employeeName' editable={false}>社員名</TableHeaderColumn>
                            <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='12%' dataField='stayPeriodDate' dataFormat={this.stayPeriodChange} editable={false} dataSort >在留カード</TableHeaderColumn>                           
                            <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='12%' dataField='birthdayDate' dataFormat={this.birthdayChange} editable={false} dataSort >誕生日</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='12%' dataField='contractDeadlineDate' dataFormat={this.contractDeadlineChange} editable={false} dataSort >契約</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='12%' dataField='passportStayPeriodDate' dataFormat={this.passportStayPeriodChange} editable={false} dataSort >パスポート</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='12%' dataField='dealDistinctioCode' dataFormat={this.formatType.bind(this)} customEditor={{ getElement: tableSelect }} editable={true}>処理区分</TableHeaderColumn>
					</BootstrapTable>
                    </div>
                 </Col>
         </div>
        )
    }
}
    export default employeeInformation;

