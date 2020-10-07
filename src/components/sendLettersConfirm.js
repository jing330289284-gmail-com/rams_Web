import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Button, Col, Row, ListGroup,InputGroup, FormControl } from 'react-bootstrap';
import { faPlusCircle, faEnvelope, faMinusCircle, faBroom, faListOl } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
class sendLettersConfirm extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
	}

initialState=({
	selectedEmpNos:this.props.location.state.salesPersons,
	selectedCusInfos:this.props.location.state.targetCusInfos,
	employeeInfo:[],
	employeeName:'',
	hopeHighestPrice:'',
	genderStatus:'',
	nationalityName:'',
	birthday:'',
	stationName:'',
	developLanguage:'',
	yearsOfExperience:'',
	japaneseLevelName:'',
	beginMonth:'',
	salesProgressCode:'',
	remark:'',
})
componentDidMount(){
	this.searchEmpDetail();
}
searchEmpDetail=()=>{
	axios.post("http://127.0.0.1:8080/sendLettersConfirm/getSalesEmps", { employeeNos: this.state.selectedEmpNos })
	.then(result=>{
		this.setState({
				employeeInfo:result.data,
					employeeName:result.data[0].employeeName,
	hopeHighestPrice:result.data[0].hopeHighestPrice,
				genderStatus:result.data[0].genderStatus,
				nationalityName:result.data[0].nationalityName,
				birthday:result.data[0].birthday,
				stationName:result.data[0].stationName,
				developLanguage:result.data[0].developLanguage,
				yearsOfExperience:result.data[0].yearsOfExperience,
				japaneseLevelName:result.data[0].japaneseLevelName,
				beginMonth:result.data[0].beginMonth,
				salesProgressCode:result.data[0].salesProgressCode,
				remark:result.data[0].remark,
		})
	})
	.catch(function(error) {
				alert(error);
			});
}
	render() {
		return (
			<div>
				<Row inline="true">
					<Col className="text-center">
						<h2>営業状況確認一覧</h2>
					</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
				<Row style={{ padding: "10px" }}><Col sm={1}></Col><Col sm={1}>要員一覧</Col><Col sm={4}></Col><Col sm={1}>営業文章</Col></Row>
				<Row>
				<Col sm={1}></Col>
					<Col sm={4}>
						
				<BootstrapTable
							ref='table'
							data={this.state.employeeInfo}
							className={"bg-white text-dark"}
							// pagination
							trClassName="customClass"
							headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='8%' dataField='employeeName' dataAlign='center' autoValue dataSort={true} editable={false} isKey>名前</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='employeeStatus' editable={false} >所属</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='genderStatus' editable={false} >性別</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='nationalityName' editable={false} >国名</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='birthday' editable={false} >年齢</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='stationName' editable={false} >駅名</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='developLanguage' editable={false} >技術</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='yearsOfExperience' editable={false} >履歴年数</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='japaneseLevelName' editable={false} >日本語ラベル</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='beginMonth' editable={false} >開始時間</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='salesProgressCode' editable={false} >進捗状況</TableHeaderColumn>
							<TableHeaderColumn hidden={true} dataField='remark' editable={false} >備考</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='hopeHighestPrice' editable={false}>単価</TableHeaderColumn>
						</BootstrapTable>
					</Col>
					<Col sm={1}></Col>
					<Col sm={4}>
						<ListGroup>
							<ListGroup.Item>【名　前】{this.state.employeeName}</ListGroup.Item>
							<ListGroup.Item>【性　別】{this.state.genderStatus}</ListGroup.Item>
							<ListGroup.Item>【国　籍】{this.state.nationalityName}</ListGroup.Item>
							<ListGroup.Item>【年　齢】{this.state.birthday}</ListGroup.Item>
							<ListGroup.Item>【技　術】{this.state.developLanguage}</ListGroup.Item>
							<ListGroup.Item>【業務年数】{this.state.yearsOfExperience}</ListGroup.Item>
							<ListGroup.Item>【日本語】{this.state.japaneseLevelName}</ListGroup.Item>
							<ListGroup.Item>【単　価】{this.state.hopeHighestPrice}</ListGroup.Item>
							<ListGroup.Item>【稼働可能日】{this.state.beginMonth}</ListGroup.Item>
							<ListGroup.Item>【営業状況】{this.state.salesProgressCode}</ListGroup.Item>
							<ListGroup.Item>【備考】{this.state.remark}</ListGroup.Item>
						</ListGroup></Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
				<Row>
				<Col sm={1}></Col>
					<Col sm={9}>
						
				<BootstrapTable
							ref='table'
							data={this.state.selectedCusInfos}
							className={"bg-white text-dark"}
							// pagination
							trClassName="customClass"
							headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='8%' dataField='customerName' dataAlign='center' autoValue dataSort={true} editable={false}>お客様名</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagers' editable={false} isKey>担当者</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='positionCode' editable={false}>職位</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagersMail' editable={false}>メール</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagers2' editable={false}>担当者</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='positionCode2' editable={false}>職位</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='purchasingManagersMail2' editable={false}>メール</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='employeeName' editable={false}>追加者</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='any' editable={false}>送信状況</TableHeaderColumn>
						</BootstrapTable>
					</Col>
					</Row>
							<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>			
						<div style={{ "textAlign": "center" }}><Button size="sm" variant="info" >
							<FontAwesomeIcon icon={faEnvelope} /> { "送信"}</Button></div>
					
			</div>
		);
	}
}
export default sendLettersConfirm;