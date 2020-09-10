import React from 'react';
import { Button, Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import '../asserts/css/development.css';
import '../asserts/css/style.css';
import $ from 'jquery'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faSearch, faEdit, faTrash, faDownload, faList } from '@fortawesome/free-solid-svg-icons';
import * as publicUtils from './utils/publicUtils.js';
import { Link } from "react-router-dom";
import MyToast from './myToast';

registerLocale("ja", ja);
class dutyManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		this.searchEmployee = this.searchDutyManagement.bind(this);
	};
	componentDidMount(){
		$("#syounin").attr("disabled",true);
		$("#datePicker").attr("readonly","readonly");
	}
	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	//　初期化データ
	initialState = {
		yearAndMonth: new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1))).getTime(),
		updateTimelist:"",
		approvalStatus:'',
		employeeList: [],
		employeeNo: [],
		employeeName: [],
		customerName: [], 
		stationName: [],
		payOffRange: [],
		workTime: [],
		workTotalTimeHaveData: [],
		employeeWorkTimeHaveData:[],
		updateTimelist:[],
		approvalStatuslist:[],
	};
	//　検索
	searchDutyManagement = () => {
		const emp = {
			yearAndMonth: this.state.yearAndMonth,
			approvalStatus: this.state.approvalStatus,
		};
		axios.post("http://127.0.0.1:8080/dutyManagement/selectDutyManagement", emp)
			.then(response => {
				if (response.data != null) {
					alert(response.data);
					this.setState({ employeeList: response.data })
				} else {
					alert("err")
				}
			}
			);
	}
   /**
     * 行の承認
     */
    listApproval=()=>{
        //将id进行数据类型转换，强制转换为数字类型，方便下面进行判断。
        var a = window.confirm("承認していただきますか？");
        if(a){
            $("#approvalBtn").click();    
        }
    }
    //　隠した承認ボタン
    createCustomApprovalButton = (onClick) => {
        return (
            <Button variant="info" id="approvalBtn"hidden　　onClick={ onClick } >承認</Button>
        );
      }
      //　隠した承認ボタンの実装
      onApprovalRow =(rows)=>{
        var id = this.state.rowNo;
            var dutyMangementInfoList = this.state.dutyMangementInfoData;
            for(let i=dutyMangementInfoList.length-1; i>=0; i--){
                if(dutyMangementInfoList[i].rowNo === id){
                    dutyMangementInfoList.splice(i,1);
                }
            }
            if(dutyMangementInfoList.length !== 0){
                for(let i=dutyMangementInfoList.length-1; i>=0; i--){
                    dutyMangementInfoList[i].rowNo = (i + 1);
                }  
            }
            this.setState({
                dutyMangementInfoData:dutyMangementInfoList,
                rowNo:'',
            })
            var dutyMangementInfoMod = {};
            dutyMangementInfoMod["customerNo"] = this.state.customerNo;
            axios.post("http://127.0.0.1:8080/dutyMangement/updateDutyManagement", dutyMangementInfoMod)
            .then(function (result) {
                if(result.data === 0){
                    alert("承認成功");
                }else if(result.data === 1){
                    alert("承認失败");
                }
            })
            .catch(function (error) {
                alert("承認失败，请检查程序");
            });
      }
    //　承認
    customConfirm(next, dropRowKeys) {
        const dropRowKeysStr = dropRowKeys.join(',');
        next();
    }
	state = {
		yearAndMonth: new Date()
	};

	//　年月
	inactiveYearAndMonth = (date) => {
		this.setState(
			{
				yearAndMonth: date
			}
		);
	};
	//行Selectファンクション
	handleRowSelect = (row, isSelected, e) => {
		$("#syounin").attr("disabled",false);
		if (isSelected) {
			this.setState(
				{
					rowSelectEmployeeNo: row.employeeNo,
				}
			);
			$('button[name="clickButton"]').prop('disabled', false);
		} else {
			$("#syounin").attr("disabled",true);
			this.setState(
				{
					rowSelectEmployeeNo: '',
				}
			);
			$('button[name="clickButton"]').prop('disabled', true);
		}
	}

	renderShowsTotal(start, to, total) {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}

	render() {
		const {employeeNo,employeeName, customerName, stationName, payOffRange, workTime, employeeWorkTimeHaveData, updateTimelist,approvalStatuslist,approvalStatus,employeeList} = this.state;
		//　テーブルの行の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,  // click to select, default is false
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		//　 テーブルの定義
		const options = {
			page: 1, 
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: 'Prev', // Previous page button text
			nextPage: 'Next', // Next page button text
			firstPage: 'First', // First page button text
			lastPage: 'Last', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
			expandRowBgColor: 'rgb(165, 165, 165)',
			approvalBtn: this.createCustomApprovalButton,
			onApprovalRow: this.onApprovalRow,
			handleConfirmApprovalRow: this.customConfirm,
		};

		return (
			<div>
				<FormControl id="rowSelectEmployeeNo" name="rowSelectEmployeeNo" hidden />
				<Form >
					<div>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text><DatePicker
												selected={this.state.yearAndMonth}
												onChange={this.inactiveYearAndMonth}
												autoComplete="off"
												locale="ja"
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												maxDate={new Date()}
												id="datePicker"
												className="form-control form-control-sm"
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">時間登録ステータス</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.valueChange} name="approvalStatus" value={approvalStatus} autoComplete="off" >
											<option value="0">すべて</option>
											<option value="1">未</option>
											<option value="2">済み</option>
											<option value="3">総時間のみ</option>
											<option value="4">登録のみ</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<Button size="sm" variant="info" type="button" onClick={this.searchDutyManagement}>
										<FontAwesomeIcon icon={faSearch} /> 検索
				                    </Button>{' '}
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
				<div >
	                <br/>
                    <Row>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>稼動人数：{this.state.totalPersons}</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>平均稼働時間：{this.state.averageWorkingTime}</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>最大稼働時間：{this.state.totalWorkingTime}</font>
						</Col>
                        <Col sm={7}>
                        </Col>
                        <Col sm={2}>
                            <div style={{ "float": "right" }}>
                               <Button variant="info" size="sm" id="syounin" onClick={this.listApproval} > <FontAwesomeIcon icon={faTrash} />承認</Button>
                            </div>
                        </Col>
                    </Row>
					<BootstrapTable data={employeeList} className={"bg-white text-dark"} pagination={true} options={options} approvalRow selectRow={selectRow} headerStyle={ { background: '#B1F9D0'} } striped hover condensed >
						<TableHeaderColumn width='95'　tdStyle={ { padding: '.45em' } }  dataField='rowNo' dataSort={true} caretRender={publicUtils.getCaret} isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='90'　tdStyle={ { padding: '.45em' } } 　 dataField='employeeNo'>社員番号</TableHeaderColumn>
						<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } }  dataField='employeeName'>氏名</TableHeaderColumn>
						<TableHeaderColumn width='150' tdStyle={ { padding: '.45em' } }  dataField='customerName'>所属お客様</TableHeaderColumn>
						<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } }  dataField='stationName'>場所</TableHeaderColumn>
						<TableHeaderColumn width='95' tdStyle={ { padding: '.45em' } }  dataField='payOffRange'>精算範囲</TableHeaderColumn>
						<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } }  dataField='workTime'>稼働時間</TableHeaderColumn>
						<TableHeaderColumn width='125' tdStyle={ { padding: '.45em' } }  dataField='workTotalTimeHaveData'>アップロード</TableHeaderColumn>
						<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } }  dataField='employeeWorkTimeHaveData'>登録済み</TableHeaderColumn>
						<TableHeaderColumn width='90' tdStyle={ { padding: '.45em' } }  dataField='updateTimelist'>更新日付</TableHeaderColumn>
						<TableHeaderColumn width='120' tdStyle={ { padding: '.45em' } }  dataField='approvalStatuslist'>ステータス</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div >
		);
	}
}
export default dutyManagement;