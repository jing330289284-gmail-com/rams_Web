import React,{Component} from 'react';
import {Row , Col , InputGroup ,Form } from 'react-bootstrap';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import * as publicUtils from './utils/publicUtils.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
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
			paginationSize: 2,
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
        this.selectSituationChange();

    }
    startsituationChange = date => {
        if(date !== null){
            this.setState({
                startsituationChange: date,
            },()=>{this.selectSituationChange()});
        }else{
            this.setState({
                startsituationChange: new Date(),
            });
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
            });
        }
    };
    
selectSituationChange =() => {
    if(this.state.startsituationChange!=null&&this.state.endsituationChange!=null){
        const situationInfo = {
            classification:this.state.situationChange,
            startYandM: publicUtils.formateDate(this.state.startsituationChange,false),
            endYandM: publicUtils.formateDate(this.state.endsituationChange,false),

        };
        axios.post(this.state.serverIP + "SituationChange/searchSituationChange", situationInfo)
			.then(response => {
				if (response.data.errorsMessage != null) {
                    this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.errorsMessage });
                }else if(response.data.noData != null){
                	if(this.state.isStart){
                        this.setState({ isStart: false});
                	}else{
                        this.setState({ "errorsMessageShow": true, errorsMessageValue: response.data.noData });
                	}
                }else {
                    this.setState({"errorsMessageShow":false})
                    this.setState({ situationInfoList: response.data.data })
				 }
			}).catch((error) => {
				console.error("Error - " + error);
			});
        }

}

renderShowsTotal(start, to, total) {
    return (
        <p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
            {start}から  {to}まで , 総計{total}
        </p>
    );
}
    render(){
        const  situationChanges= this.state.situationChanges;
        const  errorsMessageValue= this.state.errorsMessageValue;
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
				<Col>
                <div>
                    <BootstrapTable data={this.state.situationInfoList}   pagination={true}  headerStyle={{ background: '#5599FF' }} options={this.options}　striped hover condensed>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='80' dataField='rowNo'dataSort={true} isKey>番号</TableHeaderColumn>
                            <TableHeaderColumn tdStyle={{ padding: '.45em' }} width='110' dataField='reflectYearAndMonth'>年月</TableHeaderColumn>                           
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='110' dataField='employeeNo'>社員番号</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='110' dataField='employeeName'>社員名</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='110' dataField='status'>区分</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeFormName'>社員形式</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='salary'>給料</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='socialInsuranceFlag'>社会保険</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='scheduleOfBonusAmount' >ボーナス</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125' dataField='remark' >備考</TableHeaderColumn>
					</BootstrapTable>
                    </div>
                 </Col>
         </div>
        )
    }
}
    export default situationChange;

