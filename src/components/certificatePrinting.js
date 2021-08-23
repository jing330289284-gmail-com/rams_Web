import React,{Component} from 'react';
import {Row , Col , InputGroup ,Form, Button, FormControl } from 'react-bootstrap';
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import { faSave, faEnvelope, faIdCard, faListOl, faBuilding, faDownload, faBook, faEdit } from '@fortawesome/free-solid-svg-icons';
axios.defaults.withCredentials = true;

class certificatePrinting extends Component {// 状況変動一覧
     constructor(props){
        super(props);
        this.state = this.initialState;// 初期化
		this.valueChange = this.valueChange.bind(this);
    }

    initialState = {
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
        employeeInfo: store.getState().dropDown[38].slice(1),
		occupationCodes: store.getState().dropDown[10],
        certificate: '0',
        employeeName: '',
        employeeNo: '',
		birthday:　'',
		intoCompanyYearAndMonth:　'',
		nowYearAndMonth: new Date(),
		lastDayofYearAndMonth: new Date(new Date().getFullYear(),new Date().getMonth() + 1,0),
		workingTime: '10:00~19:00',
		occupationCode: '',
		address: '',
    }
    
	// valueChange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

    componentDidMount(){
    	this.setOccupationCodes();
    }
    
    setOccupationCodes = () => {
    	let occupationCodes = [];
    	for(let i in this.state.occupationCodes){
    		if(this.state.occupationCodes[i].code !== "0"){
    			occupationCodes.push(this.state.occupationCodes[i]);
    		}
    	}
		this.setState({
			occupationCodes: occupationCodes,
		})
    }
    
    handleTag = (event, values) => {
        if (values != null) {
			this.setState({
                employeeName: values.name,
                employeeNo: values.code,
	        });
			const emp = {
					employeeNo: values.code
				};
				axios.post(this.state.serverIP + "employee/getEmployeeByEmployeeNo", emp)
					.then(response => response.data)
					.then((data) => {
						this.setState({
							address: data.firstHalfAddress + data.lastHalfAddress,
							birthday: publicUtils.converToLocalTime(data.birthday, true),// 年齢
							intoCompanyYearAndMonth: publicUtils.converToLocalTime(data.intoCompanyYearAndMonth, true),// 入社年月
							occupationCode: data.occupationCode,// 職種
							retirementYearAndMonth: publicUtils.converToLocalTime(data.retirementYearAndMonth, true),// 退職年月
				        });
					}
				);
        }
        else{
			this.setState({
				employeeName: '',
                employeeNo: '',
	        });   
        }
    }
    
	/**
	 * 年齢と和暦
	 */
	inactiveBirthday = date => {
		if (date !== undefined && date !== null && date !== "") {
				this.setState(
					{
						birthday: date,
					}
				);
		} else {
			this.setState({
				birthday: "",
			});
		}
	};
	
	/**
	 * 入社年月
	 */
	inactiveintoCompanyYearAndMonth = (date) => {
		this.setState(
			{
				intoCompanyYearAndMonth: date,
			}
		);
	};
	
	inactiveRetirementYearAndMonth = (date) => {
		this.setState(
			{
				retirementYearAndMonth: date,
			}
		);
	};
	
	inactiveintoLastDayofYearAndMonth = (date) => {
		this.setState(
				{
					lastDayofYearAndMonth: date,
				}
			);
		};
	
	inactiveintoNowYearAndMonth = (date) => {
		this.setState(
				{
					nowYearAndMonth: date,
				}
			);
		};
    
	shuseiTo = (actionType) => {
		var path = {};
		const sendValue = {

		};
		switch (actionType) {
			case "update":
				path = {
					pathname: '/subMenuManager/employeeUpdateNew',
					state: {
						actionType: 'update',
						id: this.state.employeeNo,
						backPage: "certificatePrinting",
						sendValue: sendValue,
					},
				}
				break;
			default:
		}
		this.props.history.push(path);
	}	
	
    render(){
        const  errorsMessageValue= this.state.errorsMessageValue;
				
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
                    <h2>証明書印刷</h2>
                    </Col> 
                </Row>
                <br/>
                <div className="container col-4">
	                <Row>
	                    <Col>
			                <InputGroup size="sm" className="mb-3">
				                <InputGroup.Prepend>
									<InputGroup.Text id="fiveKanji">書類</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control as="select" size="sm" onChange={this.valueChange} name="certificate" value={this.state.certificate} autoComplete="off" >
									<option value="0">在職証明書</option>
									<option value="1">離職証明書</option>
								</Form.Control>
							</InputGroup>
	                    </Col>
					</Row>
				{/*</div>
                <div className="container col-5">*/}
	                <Row>
		                <Col>
	                	<InputGroup size="sm" className="mb-3">
		                    <InputGroup.Prepend>
		                    	<InputGroup.Text id="fiveKanji">氏名</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <Autocomplete
		                        id="employeeName"
		                        name="employeeName"
		                        options={this.state.employeeInfo}
		                        getOptionLabel={(option) => option.name}
		                        value={this.state.employeeInfo.find(v => v.name === this.state.employeeName) || {}}
		                        onChange={(event, values) => this.handleTag(event, values)}
		                        renderInput={(params) => (
		                            <div ref={params.InputProps.ref}>
										<input placeholder="" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-certificatePrinting-employeeName"/>
		                            </div>
		                        )}
		                    />
	                    </InputGroup>
		                </Col>
					</Row>
	                <Row>
		                <Col>
	                	<InputGroup size="sm" className="mb-3">
		                    <InputGroup.Prepend>
		                    	<InputGroup.Text id="fiveKanji">住所</InputGroup.Text>
		                    </InputGroup.Prepend>
							<FormControl placeholder="住所" value={this.state.address} autoComplete="off" disabled onChange={this.valueChange} size="sm" name="address"/>
	                    </InputGroup>
		                </Col>
	                </Row>
	                <Row>
		                <Col>
	                	<InputGroup size="sm" className="mb-3">
		                    <InputGroup.Prepend>
		                    	<InputGroup.Text id="fiveKanji">誕生日</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <InputGroup.Append>
							<DatePicker
								selected={this.state.birthday}
								onChange={this.inactiveBirthday}
								autoComplete="off"
								locale="ja"
								yearDropdownItemNumber={100}
								scrollableYearDropdown
								maxDate={new Date()}
								id="datePicker-certificatePrinting-birthday"
								className="form-control form-control-sm"
								showYearDropdown
								dateFormat="yyyy/MM/dd"
							/>
							</InputGroup.Append>
	                    </InputGroup>
		                </Col>
	                </Row>
	                {this.state.certificate === "0" ? 
	                <div>
	                <Row>
		                <Col>
	                	<InputGroup size="sm" className="mb-3">
		                    <InputGroup.Prepend>
		                    	<InputGroup.Text id="fiveKanji">就職年月日</InputGroup.Text>
		                    </InputGroup.Prepend>
		                    <InputGroup.Append>
							<DatePicker
								selected={this.state.intoCompanyYearAndMonth}
								onChange={this.inactiveintoCompanyYearAndMonth}
								locale="ja"
								dateFormat="yyyy/MM/dd"
								className="form-control form-control-sm"
								autoComplete="off"
								id="datePicker-certificatePrinting-intoCompanyYearAndMonth"
							/>
							<font>～</font>
							<DatePicker
							selected={this.state.nowYearAndMonth}
							onChange={this.inactiveintoNowYearAndMonth}
							locale="ja"
							dateFormat="yyyy/MM/dd"
							className="form-control form-control-sm"
							autoComplete="off"
							id="datePicker-certificatePrinting-intoCompanyYearAndMonth"
							/>
							</InputGroup.Append>
	                    </InputGroup>
		                </Col>
	                </Row>
	                <Row>
		                <Col>
	                	<InputGroup size="sm" className="mb-3">
		                    <InputGroup.Prepend>
		                    	<InputGroup.Text id="fiveKanji">勤務時間</InputGroup.Text>
		                    </InputGroup.Prepend>
							<FormControl placeholder="勤務時間" value={this.state.workingTime} autoComplete="off" onChange={this.valueChange} size="sm" name="workingTime"/>
	                    </InputGroup>
		                </Col>
	                </Row>
	                </div>
	                :
	                <div>
		                <Row>
			                <Col>
		                	<InputGroup size="sm" className="mb-3">
			                    <InputGroup.Prepend>
			                    	<InputGroup.Text id="fiveKanji">在職期間</InputGroup.Text>
			                    </InputGroup.Prepend>
			                    <InputGroup.Append>
								<DatePicker
									selected={this.state.intoCompanyYearAndMonth}
									onChange={this.inactiveintoCompanyYearAndMonth}
									locale="ja"
									dateFormat="yyyy/MM/dd"
									className="form-control form-control-sm"
									autoComplete="off"
									id="datePicker-certificatePrinting-intoCompanyYearAndMonth"
								/>
								<font>～</font>
								<DatePicker
								selected={this.state.lastDayofYearAndMonth}
								onChange={this.inactiveintoLastDayofYearAndMonth}
								locale="ja"
								dateFormat="yyyy/MM/dd"
								className="form-control form-control-sm"
								autoComplete="off"
								id="datePicker-certificatePrinting-intoCompanyYearAndMonth"
								/>
								</InputGroup.Append>
		                    </InputGroup>
			                </Col>
		                </Row>
		                <Row>
			                <Col>
		                	<InputGroup size="sm" className="mb-3">
			                    <InputGroup.Prepend>
			                    	<InputGroup.Text id="fiveKanji">退職年月日</InputGroup.Text>
			                    </InputGroup.Prepend>
			                    <InputGroup.Append>
								<DatePicker
									selected={this.state.retirementYearAndMonth}
									onChange={this.inactiveRetirementYearAndMonth}
									locale="ja"
									dateFormat="yyyy/MM/dd"
									className="form-control form-control-sm"
									autoComplete="off"
									id="datePicker-certificatePrinting-birthday"
								/>
								</InputGroup.Append>
		                    </InputGroup>
			                </Col>
		                </Row>
	                </div>
	                }
	                <Row>
		                <Col>
	                	<InputGroup size="sm" className="mb-3">
		                    <InputGroup.Prepend>
		                    	<InputGroup.Text id="fiveKanji">{this.state.certificate === "0" ? "職種" : "退職時役職"}</InputGroup.Text>
		                    </InputGroup.Prepend>
							<Form.Control as="select" size="sm" onChange={this.valueChange} name="occupationCode" value={this.state.occupationCode} autoComplete="off">
							{this.state.occupationCodes.map(data =>
								<option key={data.code} value={data.code}>
									{data.name}
								</option>
							)}
							</Form.Control>
	                    </InputGroup>
		                </Col>
	                </Row>
	                <Row>
		                <Col>
	                	<InputGroup size="sm" className="mb-3">
		                    <InputGroup.Prepend>
		                    	<InputGroup.Text id="fiveKanji">備考</InputGroup.Text>
		                    </InputGroup.Prepend>
							<textarea ref={(textarea) => this.textArea = textarea} value = {this.state.remark}  id="remark" name="remark" 
								onChange={this.valueChange}
								className="auto form-control Autocompletestyle-interview-text"
								style={{ height: '80px', resize: 'none', overflow: 'hidden' }}
							/>
	                    </InputGroup>
		                </Col>
	                </Row>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" onClick={this.shuseiTo.bind(this, "update")} disabled={this.state.employeeNo === ""} type="button" on>
							<FontAwesomeIcon icon={faEdit} /> 個人情報
						</Button>{" "}
						<Button size="sm" variant="info" /*onClick={this.updateEmployee}*/ disabled={this.state.employeeNo === ""} type="button" on>
							<FontAwesomeIcon icon={faDownload} /> 印刷
						</Button>
					</div>
				</div>
         </div>
        )
    }
}
    export default certificatePrinting;

