import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Button, Col, Row, ListGroup,InputGroup, Modal } from 'react-bootstrap';
import { faPlusCircle, faEnvelope, faMinusCircle, faBroom, faListOl } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import * as publicUtils from './utils/publicUtils.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DatePicker from "react-datepicker";
import TextField from '@material-ui/core/TextField';
import MailConfirm from './mailConfirm';
import { connect } from 'react-redux';
import { fetchDropDown } from './services/index';
/** 
*営業送信お客確認画面
 */
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
	nationalityName:'',
	birthday:'',
	stationName:'',
	developLanguage:'',
	yearsOfExperience:'',
	japaneseLevelName:'',
	beginMonth:'',
	salesProgressCode:'',
	remark:'',
			myToastShow: false,// 状態ダイアログ
		employeeNo: this.props.empNo,
		genderStatus: '',
		age: '',
		hopeHighestPrice: '',
		beginMonth: '',
		nearestStation: '',
		employeeStatus: '',
		japaneseLevelCode: '',
		englishLevelCode: '',
		japaneseLevellabal: '',
		englishLevellabal: '',
		siteRoleCode: '',
		unitPrice: '',
		addDevelopLanguage: '',
		developLanguageCode6: null,
		developLanguageCode7: null,
		developLanguageCode8: null,
		developLanguageCode9: null,
		developLanguageCode10: null,
		genders: [],
		employees: [],
		japaneseLevels: [],
		englishLevels: [],
		salesProgresss: [],
		japaneaseConversationLevels: [],
		englishConversationLevels: [],
		projectPhases: [],
		stations: [],
		developLanguages: [],
		developLanguagesShow: [],
		wellUseLanguagss: [],
		stationCode: '',
		disbleState: false,
		japaneaseConversationLevel: '',
		englishConversationLevel: '',
		projectPhaseCode: '0',
		empSelectedFlag:false,
		ctmSelectedFlag:false,
		selectedCustomerName: '',
		selectedPurchasingManagers: '',
		initAge: '',
		initNearestStation: '',
		initJapaneaseConversationLevel: '',
		initEnglishConversationLevel: '',
		initYearsOfExperience: '',
		initDevelopLanguageCode6: null,
		initDevelopLanguageCode7: null,
		initDevelopLanguageCode8: null,
		initDevelopLanguageCode9: null,
		initDevelopLanguageCode10: null,
				initUnitPrice: '',
				initRemark: '',
				disableFlag:true,
				initWellUseLanguagss: [],
				daiologShowFlag: false,
})
componentDidMount(){
	this.searchEmpDetail();
	this.getDropDowns();
}
	getDropDowns = () => {
		var methodArray = ["getGender", "getEmployeeStatus", "getJapaneseLevel", "getEnglishLevel", "getSalesProgress", "getJapaneaseConversationLevel", "getEnglishConversationLevel", "getProjectPhase", "getStation", "getDevelopLanguage"]
		var data = publicUtils.getPublicDropDown(methodArray,this.props.serverIP);
		this.setState(
				{genders: data[0],
				employees: data[1],
				japaneseLevels: data[2],
				englishLevels: data[3],
				salesProgresss: data[4],
				japaneaseConversationLevels: data[5],
				englishConversationLevels: data[6],
				projectPhases: data[7],
				stations: data[8],
				developLanguages: data[9],
				developLanguagesShow: data[9],
			}
		);
	}
		fromCodeToNameLanguage = (code) => {
		if (code === "" || code === null) {
			return;
		} else {
			return this.state.developLanguages.find((v) => (v.code === code)).name;
		}
	}
	
	fromCodeToListLanguage = (code) => {
		if (code === "" || code === null) {
			return '';
		} else {
			return this.state.developLanguages.find((v) => (v.code === code));
		}
	}
		openDaiolog = () => {
		this.setState({
			daiologShowFlag: true,
		});

	}
	searchPersonnalDetail=()=>{
			axios.post(this.props.serverIP + "salesSituation/getPersonalSalesInfo", { employeeNo: this.state.selectedEmpNos[0] })
	.then(result=>{
				console.log(result.data);
				if (result.data[0].age === "") {
					this.setState({
						employeeName: result.data[0].employeeFullName,
						genderStatus: this.state.genders.find((v) => (v.code === result.data[0].genderStatus)).name,
						nationalityName: result.data[0].nationalityName,
						age: publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
							Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) / 31536000000),
						developLanguage: result.data[0].developLanguage,
						yearsOfExperience: result.data[0].yearsOfExperience,
						beginMonth: new Date("2020/09").getTime(),
						salesProgressCode: result.data[0].salesProgressCode,
						nearestStation: result.data[0].nearestStation,
						stationCode: result.data[0].nearestStation,
						employeeStatus: this.state.employees.find((v) => (v.code === result.data[0].employeeStatus)).name,
						japaneseLevelCode: this.state.japaneseLevels.find((v) => (v.code === result.data[0].japaneseLevelCode)).name,
						englishLevelCode: this.state.englishLevels.find((v) => (v.code === result.data[0].englishLevelCode)).name,
						siteRoleCode: result.data[0].siteRoleCode,
						
								initAge: publicUtils.converToLocalTime(result.data[0].birthday, true) === "" ? "" :
							Math.ceil((new Date().getTime() - publicUtils.converToLocalTime(result.data[0].birthday, true).getTime()) / 31536000000),
		initNearestStation: result.data[0].nearestStation,
		initJapaneaseConversationLevel: '',
		initEnglishConversationLevel: '',
		initYearsOfExperience: result.data[0].yearsOfExperience,
		initDevelopLanguageCode6: null,
		initDevelopLanguageCode7: null,
		initDevelopLanguageCode8: null,
		initDevelopLanguageCode9: null,
		initDevelopLanguageCode10: null,
				initUnitPrice: '',
				initRemark: '',
				initWellUseLanguagss: [],
					})
				} else {
					this.setState({
						employeeName: result.data[0].employeeFullName,
						genderStatus: this.state.genders.find((v) => (v.code === result.data[0].genderStatus)).name,
						nationalityName: result.data[0].nationalityName,
						age: result.data[0].age,
						developLanguageCode6: result.data[0].developLanguage1,
						developLanguageCode7: result.data[0].developLanguage2,
						developLanguageCode8: result.data[0].developLanguage3,
						developLanguageCode9: result.data[0].developLanguage4,
						developLanguageCode10: result.data[0].developLanguage5,
						wellUseLanguagss: [this.fromCodeToListLanguage(result.data[0].developLanguage1),
						this.fromCodeToListLanguage(result.data[0].developLanguage2),
						this.fromCodeToListLanguage(result.data[0].developLanguage3),
						this.fromCodeToListLanguage(result.data[0].developLanguage4),
						this.fromCodeToListLanguage(result.data[0].developLanguage5)].filter(function(s) {
							return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
						}),
						disbleState: this.fromCodeToListLanguage(result.data[0].developLanguage5) === '' ? false : true,
						developLanguage: [this.fromCodeToNameLanguage(result.data[0].developLanguage1),
						this.fromCodeToNameLanguage(result.data[0].developLanguage2),
						this.fromCodeToNameLanguage(result.data[0].developLanguage3),
						this.fromCodeToNameLanguage(result.data[0].developLanguage4),
						this.fromCodeToNameLanguage(result.data[0].developLanguage5)].filter(function(s) {
							return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
						}).join('、'),
						yearsOfExperience: result.data[0].yearsOfExperience,
						japaneaseConversationLevel: result.data[0].japaneaseConversationLevel,
						englishConversationLevel: result.data[0].englishConversationLevel,
						beginMonth: new Date("2020/09").getTime(),
						salesProgressCode: '1',
						//salesProgressCode: result.data[0].salesProgressCode,
						nearestStation: result.data[0].nearestStation,
						stationCode: result.data[0].nearestStation,
						employeeStatus: this.state.employees.find((v) => (v.code === result.data[0].employeeStatus)).name,
						japaneseLevelCode: this.state.japaneseLevels.find((v) => (v.code === result.data[0].japaneseLevelCode)).name,
						englishLevelCode: this.state.englishLevels.find((v) => (v.code === result.data[0].englishLevelCode)).name,
						siteRoleCode: result.data[0].siteRoleCode,
						unitPrice: result.data[0].unitPrice,
						remark: result.data[0].remark,
						
						initAge:result.data[0].age,
						initNearestStation: result.data[0].nearestStation,
		initJapaneaseConversationLevel: result.data[0].japaneaseConversationLevel,
		initEnglishConversationLevel: result.data[0].englishConversationLevel,
		initYearsOfExperience: result.data[0].yearsOfExperience,
		initDevelopLanguageCode6: result.data[0].developLanguage1,
		initDevelopLanguageCode7: result.data[0].developLanguage2,
		initDevelopLanguageCode8: result.data[0].developLanguage3,
		initDevelopLanguageCode9: result.data[0].developLanguage4,
		initDevelopLanguageCode10: result.data[0].developLanguage5,
				initUnitPrice: result.data[0].unitPrice,
				initRemark: result.data[0].remark,
				initWellUseLanguagss: [this.fromCodeToListLanguage(result.data[0].developLanguage1),
						this.fromCodeToListLanguage(result.data[0].developLanguage2),
						this.fromCodeToListLanguage(result.data[0].developLanguage3),
						this.fromCodeToListLanguage(result.data[0].developLanguage4),
						this.fromCodeToListLanguage(result.data[0].developLanguage5)].filter(function(s) {
							return s; // 注：IE9(不包含IE9)以下的版本没有trim()方法
						}),
					})
				}
			})
	.catch(function(error) {
				alert(error);
			});
	}
searchEmpDetail=()=>{
	axios.post(this.props.serverIP + "sendLettersConfirm/getSalesEmps", { employeeNos: this.state.selectedEmpNos })
	.then(result=>{
		this.setState({
				employeeInfo:result.data,
		})
	})
	.catch(function(error) {
				alert(error);
			});
			this.searchPersonnalDetail();
}

	renderShowsTotal = (start, to, total) => {
		return (
			<p style={{ color: 'dark', "float": "left", "display": total > 0 ? "block" : "none" }}  >
				{start}から  {to}まで , 総計{total}
			</p>
		);
	}
	
	closeDaiolog = () => {
		this.setState({
			daiologShowFlag: false,
		})
	}
	
	handleCtmSelect = (row, isSelected, e) => {
		this.setState({
							selectedCustomerName: isSelected?row.customerName:'',
		selectedPurchasingManagers: isSelected?row.purchasingManagers:'',
		})
	}
	render() {
				const options = {
			noDataText: (<i className="" style={{ 'fontSize': '24px' }}>show what you want to show!</i>),
			defaultSortOrder: 'dsc',
			sizePerPage: 10,
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
		
				const selectRow = {
			mode: "radio",
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			onSelect: this.handleEmpSelect,
		};
		
						const selectRow1 = {
			mode: "radio",
			bgColor: 'pink',
			hideSelectColumn: true,
			clickToSelect: true,
			onSelect: this.handleCtmSelect,
		};
		return (
			<div>
							<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.closeDaiolog} show={this.state.daiologShowFlag} dialogClassName="modal-bankInfo">
					<Modal.Header closeButton><Col className="text-center">
					<h2>メール内容確認</h2>
					</Col></Modal.Header>
					<Modal.Body >
						<MailConfirm  personalInfo={this}/>
					</Modal.Body>
				</Modal>
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
				options={options}
								selectRow={selectRow}
							ref='table'
							data={this.state.employeeInfo}
							className={"bg-white text-dark"}
							// pagination
							trClassName="customClass"
							headerStyle={{ background: '#5599FF' }} striped hover condensed>
							<TableHeaderColumn width='8%' dataField='employeeName' dataAlign='center' autoValue dataSort={true} editable={false} isKey>名前</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='employeeStatus' editable={false} >所属</TableHeaderColumn>
							<TableHeaderColumn width='8%' dataField='hopeHighestPrice' editable={false}>単価</TableHeaderColumn>
						</BootstrapTable>
					</Col>
					<Col sm={1}></Col>
					<Col sm={4}>
					<ListGroup>
					<ListGroup.Item>【名　　前】：{this.state.employeeName}{'　　　'}{this.state.nationalityName}{'　　　'}{this.state.genderStatus}</ListGroup.Item>
					<ListGroup.Item>【所　　属】：{this.state.employeeStatus}</ListGroup.Item>
					<ListGroup.Item>【年　　齢】：{this.state.age}歳</ListGroup.Item>
					<ListGroup.Item>【最寄り駅】：{this.state.nearestStation !== "" ? this.state.stations.find((v) => (v.code === this.state.nearestStation)).name:""}</ListGroup.Item>
					<ListGroup.Item>【日本　語】：{this.state.nearestStation !== "" ? this.state.japaneaseConversationLevels.find((v) => (v.code === this.state.japaneaseConversationLevel)).name:""}</ListGroup.Item>
					<ListGroup.Item>【英　　語】：{this.state.nearestStation !== "" ? this.state.englishConversationLevels.find((v) => (v.code === this.state.englishConversationLevel)).name:""}</ListGroup.Item>
					<ListGroup.Item>【業務年数】：{this.state.yearsOfExperience}年</ListGroup.Item>
					<ListGroup.Item>【対応工程】：{this.state.siteRoleCode}</ListGroup.Item>
					<ListGroup.Item>【得意言語】：{this.state.developLanguage}</ListGroup.Item>
					<ListGroup.Item>【単　　価】：{this.state.unitPrice}万円</ListGroup.Item>
					<ListGroup.Item>【稼働開始】：{publicUtils.dateFormate(publicUtils.formateDate(this.state.beginMonth,false))}</ListGroup.Item>
					<ListGroup.Item>【営業状況】：{this.state.nearestStation !== "" ? this.state.salesProgresss.find((v) => (v.code === this.state.salesProgressCode)).name:""}</ListGroup.Item>
					<ListGroup.Item>【備　　考】：{this.state.remark}</ListGroup.Item>
				    </ListGroup>
</Col>
				</Row>
				<Row style={{ padding: "10px" }}><Col sm={12}></Col></Row>
				<Row>
						<Col sm={8}></Col>
						<Col sm={2}>
							<div style={{ "float": "right" }}>
								<Button onClick={this.openDaiolog}  size="sm" 　variant="info" name="clickButton" ><FontAwesomeIcon icon={faEnvelope} />メール確認</Button>
							</div>
						</Col>
					</Row>
				<Row>
				<Col sm={1}></Col>
					<Col sm={9}>
						
				<BootstrapTable
				options={options}
				selectRow={selectRow1}
							ref='table1'
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
const mapStateToProps = state => {
	return {
		serverIP: state.data.dataReques[state.data.dataReques.length-1],
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchDropDown: () => dispatch(fetchDropDown())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(sendLettersConfirm);