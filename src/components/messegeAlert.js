import React from 'react';
import MyToast from './myToast';

import { Card, Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';

import './style.css';




class messegeAlert extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;
		this.state.show = false;
		this.bookChange = this.bookChange.bind(this);
		this.submitBook = this.submitBook.bind(this);
	}

	handleChanges = async (e) => {
		const val = e.target.value;
		const emp = {
			employeeNo: val
		};
		axios.post("http://localhost:8080/getTechnologyType", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						arr: response.data
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});

	}


	initialState = {
		employeeNo: '',
		employeeFristName: '',
		developmentLanguageNo: '',
		arr: [],
		startDate: new Date(),
		value: '',
		suggestions: []

	};



	handleChange = date => {
		this.setState({
			startDate: date
		});
	};

	bookChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	componentDidMount() {
		const employeeNo = this.props.match.params.employeeNo;
		if (employeeNo) {
			this.findBookById(employeeNo);
		}
	}

	findBookById = (employeeNo) => {
		const emp = {
			employeeNo: employeeNo
		};
		axios.post("http://localhost:8080/getEmployeeInfo", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						employeeNo: response.data[0].employeeNo,
						employeeFristName: response.data[0].employeeFristName
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	};

	submitBook = event => {
		const emp = {
			employeeFristName: this.state.employeeFristName
		};
		axios.post("http://localhost:8080/getEmployeeInfo", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({ "show": true });
					setTimeout(() => {
						this.setState({ "show": false })
					}, 3000);
				} else {
					this.setState({ "show": false });
				}
			});
		this.setState(this.initialState);
	}

	updateBook = () => {
		alert("updateBook")
		const emp = {
			employeeFristName: this.state.employeeFristName
		};
		axios.post("http://localhost:8080/getEmployeeInfo", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({ "show": true });
					setTimeout(() => {
						this.setState({ "show": false })
					}, 3000);
					setTimeout(() => {
						this.getEmployeeInfo()
					}, 3000);
				} else {
					this.setState({ "show": false });
				}
			});
		this.setState(this.initialState);
	}

	resetBook = () => {
		this.setState(() => this.initialState);
	};

	getEmployeeInfo = () => {
		return this.props.history.push("/mainSearchTest");
	};

	render() {
		const { employeeNo, employeeFristName} = this.state;
		

		return (
			<div >
				<div style={{ "display": this.state.show ? "block" : "none" }}  >
					<MyToast show={this.state.show} message={this.state.employeeNo ? "Book Updated Successfully." : "Book Saved Successfully."} />
				</div>
				<Card className="border border-dark bg-dark text-white">
					<Card.Header>{this.state.employeeNo ? "Update Book" : "Add New Book"}
					</Card.Header>
					<Form onSubmit={this.state.employeeNo ? this.updateBook : this.submitBook} onReset={this.resetBook} id="bookFormID">
						<Card.Body>
							<Form.Row>
								<Form.Group as={Col} controlId="formGridEmployeeNo">
									<Form.Label>社員番号</Form.Label>
									{/* required 必ず */}
									<Form.Control type="test" readOnly
										name="employeeNo" autoComplete="off"
										value={employeeNo}
										onChange={this.bookChange}
										className={"bg-dark text-white"}
										placeholder="社員番号" />
								</Form.Group>
								<Form.Group as={Col} controlId="formGridEmployeeFristName">
									<Form.Label>社員名</Form.Label>
									<Form.Control type="test" name="employeeFristName"
										value={employeeFristName} autoComplete="off"
										onChange={this.bookChange}
										className={"bg-dark text-white"}
										placeholder="社員名" />
								</Form.Group>




							</Form.Row>
						</Card.Body>
						<Card.Footer style={{ "textAlign": "center" }}>
							<Button size="sm" variant="success" type="submit">
								{this.state.employeeNo ? "修正" : "登録"}
							</Button>{' '}
							<Button size="sm" type="reset" variant="success"  >
								Reset
                        </Button>
							{' '}
							<Button size="sm" type="button" variant="success" onClick={this.getEmployeeInfo.bind()}>
								employeeInfoList
                        </Button>
						</Card.Footer>
					</Form>
				</Card>
			</div>
		);
	}
}
export default messegeAlert;
