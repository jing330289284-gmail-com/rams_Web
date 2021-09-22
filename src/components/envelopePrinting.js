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

class envelopePrinting extends Component {// 状況変動一覧
     constructor(props){
        super(props);
        this.state = this.initialState;// 初期化
		this.valueChange = this.valueChange.bind(this);
    }

    initialState = {
        serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
        employeeInfo: store.getState().dropDown[38].slice(1),
		occupationCodes: store.getState().dropDown[10],
		envelopeSize: '0',
        companyData: '0',
        employeeName: '',
        employeeNamePrint: '',
        employeeNo: '',
		occupationCode: '',
		address: '',
		postcode: '',
		firstHalfAddress: '',
		lastHalfAddress: '',
		loading: true,
    }
    
	// valueChange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	}

    componentDidMount(){
    	this.setOccupationCodes();
		if (this.props.location.state !== undefined) {
            var sendValue = this.props.location.state.sendValue;
            this.searchEmp(sendValue.employeeNo);
            this.setState({
            })
		}
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
    
    searchEmp = (No) => {
		const emp = {
				employeeNo: No,
			};
		axios.post(this.state.serverIP + "employee/getEmployeeByEmployeeNo", emp)
		.then(response => response.data)
		.then((data) => {
			this.setState({
				employeeNamePrint: data.employeeFristName + "　" + data.employeeLastName,
				postcode: data.postcode === null || data.postcode === "" ? "" : "〒" + data.postcode.substring(0,3) + "-" + data.postcode.substring(3,data.postcode.length),
				firstHalfAddress: data.firstHalfAddress === null || data.firstHalfAddress === "" ? "" : data.firstHalfAddress,
				lastHalfAddress: data.lastHalfAddress === null || data.lastHalfAddress === "" ? "" : data.lastHalfAddress,
	        });
		});
    }
    
    handleTag = (event, values) => {
        if (values != null) {
			this.setState({
                employeeName: values.name,
                employeeNo: values.code,
	        });
			this.searchEmp(values.code);
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
				certificate: this.state.certificate,
				employeeName: this.state.employeeName,
				employeeNamePrint: this.state.employeeNamePrint,
				employeeNo: this.state.employeeNo,
				furigana: this.state.furigana,
				address: this.state.address,
				postcode: this.state.postcode,
				firstHalfAddress: this.state.firstHalfAddress,
				lastHalfAddress: this.state.lastHalfAddress,
				birthday: this.state.birthday,
				intoCompanyYearAndMonth: this.state.intoCompanyYearAndMonth,
				nowYearAndMonth: this.state.nowYearAndMonth,
				workingTime: this.state.workingTime,
				lastDayofYearAndMonth: this.state.lastDayofYearAndMonth,
				retirementYearAndMonth: this.state.retirementYearAndMonth,
				occupationCode: this.state.occupationCode,
				remark: this.state.remark,
				stamp: this.state.stamp,
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
	
	downloadPDF = (event) => {
		this.setState({ loading: false, });

		let dataInfo = {};

		dataInfo["companyData"] = this.state.companyData;
		dataInfo["employeeName"] = this.state.employeeNamePrint;
		dataInfo["postcode"] = this.state.postcode;
		dataInfo["firstHalfAddress"] = this.state.firstHalfAddress;
		dataInfo["lastHalfAddress"] = this.state.lastHalfAddress;

		axios.post(this.state.serverIP + "envelopePrinting/downloadPDF", dataInfo)
			.then(resultMap => {
				if (resultMap.data) {
					//alert(resultMap.data)
					//window.open(resultMap.data, "_blank");
					var a = document.createElement("a");
					a.setAttribute("href",this.state.serverIP + "封筒印刷.pdf");
					a.setAttribute("target","_blank");
					document.body.appendChild(a);
					a.click();
					this.setState({ loading: true, });
					//window.open(this.state.serverIP + "証明書.pdf", "_blank");
					//publicUtils.handleDownload(resultMap.data, this.state.serverIP);
				} else {
					alert("更新失败");
					this.setState({ loading: true, });
				}
			})
			.catch(function () {
				alert("更新错误，请检查程序");
				this.setState({ loading: true, });
			});
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
                    <h2>封筒印刷</h2>
                    </Col> 
                </Row>
                <br/>
                <div className="container col-3">
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
										<input placeholder="" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-envelopePrinting-employeeName"/>
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
									<InputGroup.Text id="fiveKanji">封筒サイズ</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control as="select" size="sm" onChange={this.valueChange} name="envelopeSize" value={this.state.envelopeSize} autoComplete="off" >
									<option value="0">3号封筒</option>
									<option value="1">大封筒</option>
								</Form.Control>
							</InputGroup>
	                    </Col>
					</Row>
	                <Row>
		                <Col>
		                <InputGroup size="sm" className="mb-3">
			                <InputGroup.Prepend>
								<InputGroup.Text id="fiveKanji">会社情報</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control as="select" size="sm" onChange={this.valueChange} name="companyData" value={this.state.companyData} autoComplete="off" >
								<option value="0">あり</option>
								<option value="1">なし</option>
							</Form.Control>
						</InputGroup>
		                </Col>
	                </Row>
					<div style={{ "textAlign": "center" }}>
						<Button size="sm" variant="info" onClick={this.downloadPDF} disabled={!(this.state.employeeNo !== "" || this.state.companyData === "0")} type="button" on>
							<FontAwesomeIcon icon={faDownload} /> 印刷
						</Button>
					</div>
					<div className='loadingImage' hidden={this.state.loading} style = {{"position": "absolute","top":"60%","left":"60%","margin-left":"-150px", "margin-top":"0px"}}></div>
				</div>
         </div>
        )
    }
}
    export default envelopePrinting;

