/* 営業確認 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"
import * as dateUtils from './utils/dateUtils.js';
import '../asserts/css/style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class manageSituation extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
	}
	 formatType(cell) {
		 let ststeName = '';
		 if (cell==='0') {
			 ststeName = '';
		 } else if (cell==='1') {
			 ststeName = '提案のみ';
		 }else if (cell==='2') {
			 ststeName = '確定';
		 } else if (cell==='3') {
			 ststeName = '延長';
		 } 
    　　	return ststeName;
  	 }
	componentDidMount(){
		let sysDate = this.state.yearMonth;
		console.log(sysDate);
		axios.post("http://127.0.0.1:8080/salesSituation/getSalesSituation",{salesYearAndMonth:sysDate})
                .then(result=> {
                    if(result.data!= null){
						this.setState({
							salesSituationLists:result.data,
						});
                    }else{
                        alert("FAIL"); 
                    }
                })
                .catch(function (error) {
                    alert("ERR");
                }); 
	}
	//初期化
	initialState = {
		employeeName:'',// 社員NO
		/* yearMonth:new Date().getFullYear() + "/" + (new Date().getMonth() + 1),// 今年月 */
		yearMonth:'202008',
		intreviewDate1:'',　// 面接1日付
		intreviewDate2:'',　// 面接2日付
		intreviewPalace1:'',　// 面接1場所
		intreviewPalace2:'',　// 面接2場所
		intreviewCustomer1:'',　// 面接1客様
		intreviewCustomer2:'',　// 面接2客様
		hopeMinPrice:'',　// 希望単価min
		hopeMaxPrice:'',　// 希望単価max
		remark:'',　// 備考
		salesSituationLists:[],// 明細
		salesProgressCodes:[{value:0,text:' '},{value:1,text:'提案のみ'},{value:2,text:'確定'},{value:3,text:'延長'}] // ステータス
	};

	render() {
		const cellEdit = {
    		mode: 'click',
    		blurToSave: true
		  };
		return (
			<div>
				<Form onSubmit={this.savealesSituation}>
					<Form.Group>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="社員名" autoComplete="off"
										defaultValue={this.state.employeeName} size="sm" name="employeeLastName" maxlength="3" readOnly/>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="time4" value={this.state.yearMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveAge}
											autoComplete="on"
											locale="ja"
											showYearDropdown
											yearDropdownItemNumber={25}
											scrollableYearDropdown
											className={"dateInput"}
											minDate={new Date()}
										/>
									</InputGroup.Append>
								</InputGroup>
							</Col>
						</Row>
						<Row style={{padding:"10px"}}><Col sm={12}></Col></Row>
						<Row>
							<Col sm={6}>
								<Form.Label style={{ "color": "#FFD700" }}>面談情報1</Form.Label>
							</Col>
							<Col sm={6}>
								<Form.Label style={{ "color": "#FFD700" }}>面談情報2</Form.Label>
							</Col>
						</Row>
						<Row>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  value={this.state.intreviewDate1} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveAge}
											autoComplete="on"
											locale="ja"
											showYearDropdown
											yearDropdownItemNumber={25}
											scrollableYearDropdown
											className={"dateInput"}
											minDate={new Date()}
										/>
									</InputGroup.Append>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.setState.intreviewPalace1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.setState.intreviewCustomer1} autoComplete="off"
										onChange={this.valueChange} size="sm" maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  value={this.state.intreviewDate2} name="time4" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									<InputGroup.Append>
										<DatePicker
											selected={new Date()}
											onChange={this.inactiveAge}
											autoComplete="on"
											locale="ja"
											showYearDropdown
											yearDropdownItemNumber={25}
											scrollableYearDropdown
											className={"dateInput"}
											minDate={new Date()}
										/>
									</InputGroup.Append>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.intreviewPalace2} autoComplete="off"
										onChange={this.valueChange} size="sm"  maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.intreviewCustomer2} autoComplete="off"
										onChange={this.valueChange} size="sm" maxlength="3" />
								</InputGroup>
							</Col>
						</Row>
						<Row style={{padding:"10px"}}><Col sm={12}></Col></Row>
						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">希望単価</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl placeholder="00" value={this.state.hopeMinPrice} autoComplete="off"
										onChange={this.valueChange} size="sm" maxlength="3" />
									<font style={{ marginLeft: "10px", marginRight: "10px" }}>～</font>
									<FormControl placeholder="00" value={this.state.hopeMaxPrice} autoComplete="off"
										onChange={this.valueChange} size="sm" maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">優先度</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.priorityDegree} autoComplete="off"
										onChange={this.valueChange} size="sm"  maxlength="3" />
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.remark} autoComplete="off"
										onChange={this.valueChange} size="sm" maxlength="3" />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info">
							更新
                        </Button>
					</div>
					<Row>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>合計：6人</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>確定：6人</font>
						</Col>
						<Col sm={6}></Col>
						<Col sm={4}>
							<div style={{ "float": "right" }}>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >個人情報</Button>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >現場情報</Button>
								<Button style={{ marginRight: "10px" }} size="sm" variant="info" name="clickButton" >履歴書1</Button>
								<Button size="sm" variant="info" name="clickButton" >履歴書2</Button>
							</div>
						</Col>
					</Row>
				</Form>
				<div >
					<BootstrapTable className={"bg-white text-dark"} options={this.options} data={ this.state.salesSituationLists } pagination
  ignoreSinglePage cellEdit={ cellEdit }>
						<TableHeaderColumn width='8%' dataField='rowNo' autoValue dataSort={true} caretRender={dateUtils.getCaret} isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='employeeNo'>社員番号</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='employeeName'>氏名</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='siteRoleCode'>役割</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='developLanguage' dataAlign='center'>開発言語</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='nearestStation'>寄り駅</TableHeaderColumn>
						<TableHeaderColumn width='5%' dataField='unitPrice'>単価</TableHeaderColumn>
						<TableHeaderColumn width='9%' dataField='salesProgressCode' dataFormat={ this.formatType }  editable={ { type: 'select', options: { values: this.state.salesProgressCodes } } } >ステータス</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='customer'>確定客様</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='price'>確定単価</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='staff'>営業担当</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		);
	}
}
export default manageSituation;
