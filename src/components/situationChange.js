import React,{Component} from 'react';
import {Row , Col , InputGroup , Button , FormControl,Table } from 'react-bootstrap';
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
class situationChange extends Component {
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
    render(){
        return(
            <div>
                 <Row inline="true">
                     <Col  className="text-center">
                    <h2>状況変動一覧</h2>
                    </Col> 
                </Row>
                <Row>
                <Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">区分</InputGroup.Text></InputGroup.Prepend>
                                    
								</InputGroup>
							</Col>
                </Row>
            </div>
        )
    }
};
    export default situationChange;

