import React, { Component } from 'react';
import { Row, Form, Col, InputGroup, Button, FormControl} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as SiteJs from './SiteInformationJs.js';
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { startDate, registerLocale, setStartDate } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import '../asserts/css/SiteInformation.css';
import axios from 'axios';

registerLocale('ja', ja);
class SiteInformation extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}
	initialState = {
		time_1: '',
		time_2: '',

	};

	onchange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	fixed = event => {
		$("#time_2").prop('disabled', false);
		this.onchange(event);

		if (event.target.value == 0) {
			this.setState({ "time_2": event.target.value })
			$("#time_2").prop('disabled', true);
		}
	}
	workState = event => {
		$("#endDateCalendar").toggle(true);
		this.onchange(event);
		if (event.target.value == 1) {
			$("#endDateCalendar").toggle(false);
		}
	}
	state = {
		bonusStartDate: new Date(),
		raiseStartDate: new Date(),
	}
	//日期更改
	inactive = date => {
		$("#time").val("0年0月");
		this.setState({
			bonusStartDate: date,
		});
		$("#AdmissionStartDate").val(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
		var today = new Date();
		var year = today.getFullYear() - date.getFullYear();
		var month = today.getMonth() - date.getMonth();
		var day = today.getDate() - date.getDate();
		if (year >= 0) {
			if (year > 0 && month < 0) {
				if (day > 0) {
					$("#time").val((year - 1) + "年" + (month + 12) + "月");
				}
				else {
					$("#time").val((year - 1) + "年" + (month + 11) + "月");
				}
			}
			if (month >= 0) {

				if (day >= 0) {
					$("#time").val(year + "年" + month + "月");
				}
				else {
					if (year == 0 && month == 0) {
						$("#time").val("0年0月");
					}
					else {
						$("#time").val(year + "年" + (month - 1) + "月");
					}
				}
			}
		}
	};
	//日期更改
	raiseChange = date => {
		this.setState({
			raiseStartDate: date,
		});
		$("#AdmissionEndDate").val(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
	};
	// 页面加载
	componentDidMount() {
		axios.post("http://localhost:8080/getSiteInfo", { employeeNo: "LYC001" })
			.then(response => {
				if (response.data != null) {
					this.setState({
						products: response.data
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});

	}

	render() {
		this.options = {
			sizePerPage: 5,
			pageStartIndex: 1,
			paginationSize: 2,
			prePage: '<<',
			nextPage: '>>',
			hideSizePerPage: true,
			alwaysShowAllBtns: true,
		};
		const { time_1, time_2, workState, products } = this.state;
		return (
			<div style={{ "background": "#f5f5f5" }}>
				<div style={{ "background": "#f5f5f5" }}>
					<Form id="siteForm">
						<Form.Group>
							{/* <Row>
                    <Col sm={3}></Col>
                    <Col sm={7}>
                        <img className="mb-4" alt="title" src={title}/>
                    </Col>
              </Row> */}
							<Row inline="true">
								<Col className="text-center">
									<h2>現場情報</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
										</InputGroup.Prepend>

									</InputGroup>
								</Col>
							</Row>
							<br />
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">システム名</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="systemName" name="systemName" type="text" placeholder="システム名" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									</InputGroup>
								</Col>

								<Col sm={3}>

									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">場所</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="location" name="location" placeholder="場所" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
									</InputGroup>

								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">お客様</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="customerNo" name="customerNo" onChange={this.onchange} >
											<option value="C001">ベース株式会社</option>
											<option value="C002">いビジネス</option>
											<option value="C003">イスタア</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">トップお客様</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" id="topCustomerNo" name="topCustomerNo" onChange={this.onchange} >
											<option value="T001">ベース</option>
											<option value="T002">富士通</option>
											<option value="T003">富士急</option>
										</Form.Control>
									</InputGroup>
								</Col>
							</Row>
							<br />
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">&emsp;単&emsp;価&emsp;</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl id="unitPrice" name="unitPrice" type="text" placeholder="単価" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">万円</InputGroup.Text>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">

										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">精算< /InputGroup.Text>
                            </InputGroup.Prepend>
											<Form.Control as="select" id="time_1" name="time_1" value={time_1} onChange={this.fixed}>
												<option value="0">固定</option>
												<option value="130">130</option>
												<option value="140">140</option>
												<option value="150">150</option>
												<option value="160">160</option>
												<option value="170">170</option>
												<option value="180">180</option>
												<option value="190">190</option>
												<option value="200">200</option>
											</Form.Control>〜
											<Form.Control as="select" id="time_2" name="time_2" value={time_2} onChange={this.onchange} disabled>
												<option value="0">固定</option>
												<option value="130">130</option>
												<option value="140">140</option>
												<option value="150">150</option>
												<option value="160">160</option>
												<option value="170">170</option>
												<option value="180">180</option>
												<option value="190">190</option>
												<option value="200">200</option>
											</Form.Control>
                        </InputGroup>
                    </Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">開発言語</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="developlanguage" name="developlanguage" placeholder="開発言語" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />

										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">役割</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select" id="siteRoleCode" name="siteRoleCode" onChange={this.onchange}>
												<option value="0">PG</option>
												<option value="1">SE</option>
											</Form.Control>
										</InputGroup>
									</Col>
									
						
                </Row>
								<br />
								<Row>
									<Col sm={2}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">責任者</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="siteManager" name="siteManager" type="text" placeholder="責任者" onChange={this.onchange} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
										</InputGroup>
									</Col>

									<Col sm={4}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">入場年月日</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="AdmissionStartDate" name="AdmissionStartDate" placeholder="入場年月日" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
											<InputGroup.Append>
												<DatePicker
													selected={this.state.raiseStartDate}
													onChange={this.inactive}
													autoComplete="on"
													locale="pt-BR"
													className={"dateInput"}
													id="beginDate"
													locale="ja"
												/>
											</InputGroup.Append>
											<FormControl id="time" name="time" placeholder="0" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">現場状態</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control as="select" id="workState" name="workState" value={workState} onChange={this.workState}>
												<option value="0">終了</option>
												<option value="1">稼働中</option>
											</Form.Control>
										</InputGroup>
									</Col>
									<Col sm={3}>
										<InputGroup size="sm" className="mb-3">
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroup-sizing-sm">退場年月日</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl id="AdmissionEndDate" name="AdmissionEndDate" placeholder="退場年月日" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readOnly />
											<InputGroup.Append>
												<DatePicker
													selected={this.state.raiseStartDate}
													onChange={this.raiseChange}
													autoComplete="on"
													locale="pt-BR"
													className={"dateInput"}
													id="endDateCalendar"
													locale="ja"
												/>
											</InputGroup.Append>
										</InputGroup>
									</Col>
								</Row>
								<br />
								<Row>
									<Col sm={4}></Col>
									<Col sm={2} className="text-center">
										<Button block size="sm" type="reset" id="reset" value="Reset" >
											リセット
                            </Button>

									</Col>
									<Col sm={2} className="text-center">
										<Button block size="sm" onClick={SiteJs.tokuro} variant="primary" id="toroku" className="col-offset-1" type="button">
											登録
                            </Button>
									</Col>

								</Row>
            </Form.Group>
          </Form>
						<BootstrapTable
							data={products} pagination={true} options={this.options}
							pagination>
							<TableHeaderColumn dataField='workDate' isKey>期間</TableHeaderColumn>
							<TableHeaderColumn dataField='systemName'>システム</TableHeaderColumn>
							<TableHeaderColumn dataField='location'>場所</TableHeaderColumn>
							<TableHeaderColumn dataField='customerName'>お客様</TableHeaderColumn>
							<TableHeaderColumn dataField='topCustomerName'>トップ客様</TableHeaderColumn>
							<TableHeaderColumn dataField='unitPrice'>単価</TableHeaderColumn>
							<TableHeaderColumn dataField='developlanguage'>言語</TableHeaderColumn>
							<TableHeaderColumn dataField='siteRoleCodeName'>役割</TableHeaderColumn>
						</BootstrapTable>
          </div>
				</div>
        )
    }
}

export default SiteInformation;

