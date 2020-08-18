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
	
	// レコードのステータス
	 formatType(cell){
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

	   afterSaveCell=(row, cellName, cellValue) =>{
		   if(row.salesProgressCode==='2'){
				this.setState({
					editFlag:false,
				}); 
			}else{
				row.customer='0';
				this.setState({
					editFlag:true,
				});
			}
		};
		  
	   formatCustome(cell) {
		 let ststeName = '';
		 if (cell==='0') {
			 ststeName = '';
		 } else if (cell==='1') {
			 ststeName = 'MIZUHO';
		 }else if (cell==='2') {
			 ststeName = 'LENOVO';
		 } else if (cell==='3') {
			 ststeName = 'SONY';
		 } 
    　　	return ststeName;
	   }

	   // 行番号
	   indexN(cell,row,enumObject,index){
		   return(<div>{index+1}</div>);

	   }
	   
	// 初期表示のレコードを取る
	componentDidMount(){
		let sysDate = this.state.yearMonth;
		console.log(sysDate);
		axios.post("http://127.0.0.1:8080/salesSituation/getSalesSituation",{salesYearAndMonth:sysDate})
                .then(result=> {
                    if(result.data!= null){
						/* result.data.map((item, index) => (
							alert(item.salesProgressCode)

						)); */
						
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
		salesProgressCodes:[{value:0,text:' '},{value:1,text:'提案のみ'},{value:2,text:'確定'},{value:3,text:'延長'}] ,// ステータス
		allCustomer:[{value:0,text:' '},{value:1,text:'MIZUHO'},{value:2,text:'LENOVO'},{value:3,text:'SONY'}] ,// ステータス
		totalPerson:'',
		decidedPerson:'',
		editFlag:true
	};

	render() {
		const cellEdit = {
    		mode: 'click',
			blurToSave: true,
			afterSaveCell:this.afterSaveCell,
			
		  };
		const options = {
		onRowClick: row=> {
			/* alert(row.interviewLocation1+row.interviewCustomer1) */
			this.setState({
				intreviewDate1:row.interviewDate1,　
				intreviewDate2:row.interviewDate2,　
				intreviewPalace1:row.interviewLocation1,　
				intreviewPalace2:row.interviewLocation2,　
				intreviewCustomer1:row.interviewCustomer1,　
				intreviewCustomer2:row.interviewCustomer2,　
				hopeMinPrice:row.hopeLowestPrice,　
				hopeMaxPrice:row.hopeHighestPrice,　
				remark:row.remark,　
						});
			
		},
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
									<FormControl id="time4" value={this.state.yearMonth} aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly/>
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
									<FormControl  value={this.state.intreviewDate1} aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly/>
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
									<FormControl value={this.state.intreviewPalace1} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeLastName" maxlength="3" readOnly/>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.intreviewCustomer1} autoComplete="off"
										onChange={this.valueChange} size="sm" maxlength="3" readOnly/>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日付</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl  value={this.state.intreviewDate2} aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly/>
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
										onChange={this.valueChange} size="sm"  maxlength="3" readOnly/>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.intreviewCustomer2} autoComplete="off"
										onChange={this.valueChange} size="sm" maxlength="3" readOnly/>
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
										onChange={this.valueChange} size="sm" maxlength="3" readOnly/>
									<font style={{ marginLeft: "10px", marginRight: "10px" }}>～</font>
									<FormControl placeholder="00" value={this.state.hopeMaxPrice} autoComplete="off"
										onChange={this.valueChange} size="sm" maxlength="3" readOnly/>
								</InputGroup>
							</Col>
							<Col sm={2}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">優先度</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.priorityDegree} autoComplete="off"
										onChange={this.valueChange} size="sm"  maxlength="3" readOnly/>
								</InputGroup>
							</Col>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">備考</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl value={this.state.remark} autoComplete="off"
										onChange={this.valueChange} size="sm" maxlength="3" readOnly/>
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
				{/* 	var total=this.state.salesSituationLists.length;
					var decided = 0;
					if (total!===0) {
						this.state.salesSituationLists.map((item, index) => (
								if(item.salesProgressCode===1){
									decided=decided+1
								} 
						))
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>合計：人</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>確定：0人</font>
						</Col>
					}else{
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>合計：0人</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>確定：0人</font>
						</Col>

					} */}
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>合計：1人</font>
						</Col>
						<Col sm={1}>
							<font style={{ whiteSpace: 'nowrap' }}>確定：0人</font>
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
					<BootstrapTable className={"bg-white text-dark"} options={options} data={ this.state.salesSituationLists } pagination
  ignoreSinglePage cellEdit={ cellEdit }>
						<TableHeaderColumn width='8%' dataField='any' dataFormat={ this.indexN } dataAlign='center' autoValue dataSort={true} caretRender={dateUtils.getCaret} isKey>番号</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='employeeNo' editable={ false }>社員番号</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='employeeName' editable={ false }>氏名</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='siteRoleCode' editable={ false }>役割</TableHeaderColumn>
						<TableHeaderColumn width='20%' dataField='developLanguage' editable={ false }>開発言語</TableHeaderColumn>
						<TableHeaderColumn width='7%' dataField='nearestStation' editable={ false }>寄り駅</TableHeaderColumn>
						<TableHeaderColumn width='5%' dataField='unitPrice' editable={ false }>単価</TableHeaderColumn>
						<TableHeaderColumn width='10%' dataField='salesProgressCode' dataFormat={this.formatType.bind(this)}  editable={ { type: 'select', options: { values: this.state.salesProgressCodes } } } >ステータス</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='customer' dataFormat={ this.formatCustome } editable={ { type: 'select', readOnly: this.state.editFlag, options: { values: this.state.allCustomer } } }>確定客様</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='price' >確定単価</TableHeaderColumn>
						<TableHeaderColumn width='8%' dataField='salesStaff' >営業担当</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewDate1' hidden={true}>面接1日付</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewLocation1' hidden={true}>面接1場所</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewCustomer1' hidden={true}>面接1客様</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewDate2' hidden={true}> 面接2日付</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewLocation2' hidden={true}>面接2場所</TableHeaderColumn>
						<TableHeaderColumn dataField='interviewCustomer2' hidden={true}>面接2客様</TableHeaderColumn>
						<TableHeaderColumn dataField='hopeLowestPrice' hidden={true}>希望単価min</TableHeaderColumn>
						<TableHeaderColumn dataField='hopeHighestPrice' hidden={true}>希望単価max</TableHeaderColumn>
						<TableHeaderColumn dataField='salesProgressCode' hidden={true}>備考</TableHeaderColumn>
						<TableHeaderColumn dataField='remark' hidden={true}>営業担当</TableHeaderColumn>
					</BootstrapTable>
				</div>
			</div>
		);
	}
}
export default manageSituation;
