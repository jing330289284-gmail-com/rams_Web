import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"
import * as publicUtils from './utils/publicUtils.js';
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEnvelope, faIdCard, faListOl, faBuilding, faDownload, faBook, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import TableSelect from './TableSelect';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import SalesContent from './salesContent';
import store from './redux/store';
axios.defaults.withCredentials = true;
/**
 * 営業状況画面
 */
class interviewInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;// 初期化
	}

	// 初期化
	initialState = {
		interviewLists: [],
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};

	// 初期表示のレコードを取る
	componentDidMount() {
		let interviewLists = [];
		let temp = {};
		temp["employeeName"] = "test";
		for(let i = 0;i < 10;i++){
			interviewLists.push(temp);
		}
		this.setState({
			interviewLists: interviewLists,
		});
	}

	render() {
		const selectRow = {
				mode: 'radio',
				bgColor: 'pink',
				clickToSelectAndEditCell: true,
				hideSelectColumn: true,
				clickToSelect: true,
				clickToExpand: true,
				onSelect: this.handleRowSelect,
			};
			
		const options = {
				noDataText: (<i className="" style={{ 'fontSize': '24px' }}>show what you want to show!</i>),
				defaultSortOrder: 'dsc',
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
		return (			
			<div>
			<Row>
			<Col sm={3}>
			</Col>
			<Col sm={3}>
			</Col>
			<Col sm={3}>
			</Col>
			<Col sm={3}>
			</Col>
			</Row>
			<Row>
			<Col sm={6}>
			</Col>
			<Col sm={6}>
			</Col>
			</Row>
			<Row>
			<Col sm={12}>
			</Col>
			</Row>
				<Form onSubmit={this.savealesSituation}>
					<Row>
						<Col sm={12}>
							<BootstrapTable
								ref='table'
								data={this.state.interviewLists}
								pagination
								options={options}
								selectRow={selectRow}
								trClassName="customClass"
								headerStyle={{ background: '#5599FF' }} striped hover condensed>
								<TableHeaderColumn row='1' dataField='employeeNo' hidden isKey>社員番号</TableHeaderColumn>
								<TableHeaderColumn row='0' ></TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='employeeName' >氏名</TableHeaderColumn>
								<TableHeaderColumn row='0' cellSpan='2' >面談情報1</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewTimes1' >面談回数</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewDate1' >日付</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewCustomer1' >お客様</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='stationCode1' >場所</TableHeaderColumn>
								<TableHeaderColumn row='0' >面談情報2</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewTimes2' >面談回数</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewDate2' > 日付</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='interviewCustomer2' >お客様</TableHeaderColumn>
								<TableHeaderColumn row='1' dataField='stationCode2' >場所</TableHeaderColumn>
							</BootstrapTable>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}
export default interviewInformation;

