import React,{Component} from 'react';
import {Row , Col , InputGroup , Button , FormControl,Table,Form } from 'react-bootstrap';
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
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
class situationChange extends Component {//状況変動一覧
    state = { 

     }
     constructor(props){
		super(props);
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

               	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
        })

    }

    componentDidMount(){
        this.props.fetchDropDown();
    }
    startsituationChange = date => {
        if(date !== null){
            this.setState({
                startsituationChange: date,
            });
        }else{
            this.setState({
                startsituationChange: '',
            });
        }
    };
    
    endsituationChange = date => {
        if(date !== null){
            this.setState({
                endsituationChange: date,
            });
        }else{
            this.setState({
                endsituationChange: '',
            });
        }
	};
    render(){
        const  situationChanges= this.props.situationChanges;
        return(
            <div>
                 <Row inline="true">
                     <Col  className="text-center">
                    <h2>状況変動一覧</h2>
                    </Col> 
                </Row>
                <br/>
                <Row>
                <Col sm={2}>
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
                                selected={this.state.endsituationChange}
                                onChange={this.endsituationChange}
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
                <div>
                    <BootstrapTable   pagination={true}  headerStyle={{ background: '#5599FF' }} options={this.options}　striped hover condensed>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='70' dataField='rowNo'dataSort={true} isKey>番号</TableHeaderColumn>                           
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeNo'>社員番号</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeName'>社員名</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='status'>区分</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='employeeFormName'>社員形式</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='salary'>給料</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='socialInsurance'>社会保険</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} dataField='bonus' >ボーナス</TableHeaderColumn>
							<TableHeaderColumn tdStyle={{ padding: '.45em' }} width='125' dataField='remarks' >備考</TableHeaderColumn>
												</BootstrapTable>
                    </div>
            </div>
        )
    }
}
    const mapStateToProps = state => {
        return {
            situationChanges: state.data.dataReques.length >= 1 ? state.data.dataReques[38].slice(1) : [],

            serverIP: state.data.dataReques[state.data.dataReques.length-1],
            
        }
    };
    
    const mapDispatchToProps = dispatch => {
        return {
            fetchDropDown: () => dispatch(fetchDropDown())
        }
};
    export default connect(mapStateToProps, mapDispatchToProps) (situationChange);

