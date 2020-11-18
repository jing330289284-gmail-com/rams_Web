import React from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { faSave, faEnvelope, faMinusCircle, faBroom, faListOl,faUserPlus ,faFileExcel} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@material-ui/lab/Autocomplete';
import "react-datepicker/dist/react-datepicker.css";
axios.defaults.withCredentials = true;

/**
 * メール確認
 * 
 */
class salesEmpAddPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initState;
	}

	initState = ({
		selectedEmps: this.props.personalInfo.state.selectedEmps,
		popupFlag: this.props.personalInfo.state.popupFlag,
		employeeInfo: this.props.personalInfo.state.employeeInfo,
		employeeName: '',
employeeStatusS: this.props.personalInfo.state.employeeStatusS,
appendEmps: this.props.personalInfo.state.appendEmps,
belongTo:'',
price:'',
resume:'',
resumeDetail:'',
	})
	componentDidMount() {

	}
empChange=(event, values)=>{
	
	this.setState({
		employeeName:values!==null?values.employeeName:'',
	})
}

	resumeValueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
			
		})
		if(event.target.selectedIndex===1){
			this.setState({
			resumeDetail: this.state.employeeName!==''?this.state.appendEmps.find(v => v.employeeName === this.state.employeeName).resumeInfo1:'',
			
		})
		}else if(event.target.selectedIndex===2){
			this.setState({
			resumeDetail: this.state.employeeName!==''?this.state.appendEmps.find(v => v.employeeName === this.state.employeeName).resumeInfo2:'',
			
		})
		}
	}; 
	
		valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		})
	};
	render() {
		return (
			<div>
			<Form.Group>
							<Row>
								<Col sm={5}>
									<InputGroup size="sm" className="mb-3" >
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
										</InputGroup.Prepend>
										<Autocomplete
											id="employeeName"
											name="employeeName"
											options={this.state.appendEmps}
											getOptionLabel={(option) => option.employeeName}
											value={this.state.appendEmps.find(v => v.employeeName === this.state.employeeName) || ''}
											//onSelect={(event) => this.handleTag(event, 'employeeName')}
											onChange={(event,values)=>this.empChange(event,values)}
											renderInput={(params) => (
												<div ref={params.InputProps.ref}>
													<input placeholder="  例：佐藤真一" type="text" {...params.inputProps} className="auto form-control Autocompletestyle-salesEmpAdd"
														 />
												</div>
											)}
										/>
									</InputGroup>
								</Col>
								<Col sm={5}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">所属</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.valueChange}
										name="belongTo"
										autoComplete="off">
										{this.state.employeeStatusS.map(date =>
											<option key={date.code} value={date.code}>
												{date.name}
											</option>
										)}
									</Form.Control>
								</InputGroup>
							</Col>
							</Row>
							<Row>
							<Col sm={5}>
				<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">単価</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl autoComplete="off" name="price" onChange={this.valueChange}
										size="sm" />
								</InputGroup>
				</Col>
				<Col sm={5}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control as="select" size="sm"
										onChange={this.resumeValueChange}
										name="resume" 
										autoComplete="off">
										<option ></option>
										
											<option >{this.state.employeeName!==''?this.state.appendEmps.find(v => v.employeeName === this.state.employeeName).resumeInfo1.split('/')[4]:'履歴書１なし'}</option>
											<option >{this.state.employeeName!==''?this.state.appendEmps.find(v => v.employeeName === this.state.employeeName).resumeInfo2.split('/')[4]:'履歴書２なし'}</option>
									</Form.Control>
								</InputGroup>
							</Col>
							</Row>
							</Form.Group>
											<div>
					<div style={{ "textAlign": "center" }}><Button size="sm" variant="info" onClick={this.salesSelected}>
						<FontAwesomeIcon icon={faSave} /> {"確定"}</Button></div>
				</div>
			</div>
		);
	}
}
export default salesEmpAddPopup;