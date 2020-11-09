import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Form, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios'
import ja from 'date-fns/locale/ja';
import DatePicker, { registerLocale } from "react-datepicker"
import store from './redux/store';

registerLocale('ja', ja);

//営業個別売上
class salesProfit extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
	}

	initialState = {
		no: '',
		employee: '',
		newMember: '',
		customerContract: '',
		updateFlag: true,
		insertFlag: false,
		currentPage: 1,//今のページ
		insertNo: '',
		employeeStatus: store.getState().dropDown[4],
		newMemberStatus: store.getState().dropDown[23],
		customerContractStatus: store.getState().dropDown[24],
		levelStatus: store.getState().dropDown[18],
		salesPutternStatus: store.getState().dropDown[25],
		specialPointStatus: store.getState().dropDown[26],
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],//劉林涛　テスト
	};

	// 页面加载
	componentDidMount() {
		this.select();
	}
	//明细查询
	onchange = (event) => {
		this.refs.table.setState({
			selectedRowKeys: []
		});
		this.setState({
			[event.target.name]: event.target.value
		}, () => {
			this.select();
		})
	}

	//时间入力框初始值
	state = {
		admissionStartDate: new Date(),
		admissionEndDate: new Date()
	}
	//　入場年月
	admissionStartDate = (date) => {
		this.setState(
			{
				admissionStartDate: date,
			}
		);
	};
	//　退場年月
	admissionEndDate = (date) => {
		this.setState(
			{
				admissionEndDate: date,
			}
		);
	};

	// レコードのステータス
	employeeStatusFormat = (cell) => {
		var statuss = this.state.employeeStatus;
		for (var i in statuss) {
			if (cell === statuss[i].value) {
				return statuss[i].text;
			}
		}
	}

	newMemberStatusFormat = (cell) => {
		var statuss = this.state.newMemberStatus;
		for (var i in statuss) {
			if (cell === statuss[i].value) {
				return statuss[i].text;
			}
		}
	}

	customerContractStatusFormat = (cell) => {
		var statuss = this.state.customerContractStatus;
		for (var i in statuss) {
			if (cell === statuss[i].value) {
				return statuss[i].text;
			}
		}
	}

	levelStatusFormat = (cell) => {
		var statuss = this.state.levelStatus;
		for (var i in statuss) {
			if (cell === statuss[i].value) {
				return statuss[i].text;
			}
		}
	}

	salesPutternStatusFormat = (cell) => {
		var statuss = this.state.salesPutternStatus;
		for (var i in statuss) {
			if (cell === statuss[i].value) {
				return statuss[i].text;
			}
		}
	}

	specialPointStatusFormat = (cell) => {
		var statuss = this.state.specialPointStatus;
		for (var i in statuss) {
			if (cell === statuss[i].value) {
				return <span title={statuss[i].text}>{statuss[i].text}</span>;
			}
		}
	}
	remarkFormat = (cell) => {
		return <span title={cell}>{cell}</span>;
	}
	select = () => {
		var salesPointSetModel = {};
		salesPointSetModel["employeeName"] = this.state.employeeName
		salesPointSetModel["employeeStatus"] = this.state.employeeSearch
		if (typeof this.state.admissionStartDate == "undefined" || typeof this.state.admissionEndDate == "undefined") {
		  return;
		}
		salesPointSetModel["startDate"] = this.state.admissionStartDate
		salesPointSetModel["endDate"] = this.state.admissionEndDate
		axios.post(this.state.serverIP + "getSalesProfitInfo", salesPointSetModel)
			.then(response => {
				if (response.data != null) {
					this.setState({
						salesPointData: response.data
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});
	}
	/**
	* 行Selectファンクション
	*/
	handleRowSelect = (row, isSelected) => {

		if (isSelected) {
			this.setState({
				no: row.no,
				updateFlag: false
			});
		} else {
			this.setState({
				updateFlag: true
			});
		}
	}

	/**
	 * 行追加
	 */
	insertRow = () => {
		var salesPointData = this.state.salesPointData;
		var salesPointSetModel = {};
		salesPointSetModel["no"] = parseInt(salesPointData[salesPointData.length - 1].no) + 1;
		salesPointSetModel["employee"] = "";
		salesPointSetModel["newMember"] = "";
		salesPointSetModel["customerContract"] = "";
		salesPointSetModel["level"] = "";
		salesPointSetModel["salesPuttern"] = "";
		salesPointSetModel["specialPoint"] = "";
		salesPointSetModel["point"] = "";
		salesPointSetModel["remark"] = "";
		salesPointData.push(salesPointSetModel);
		var currentPage = Math.ceil(salesPointData.length / 5);
		this.setState({
			no: salesPointSetModel["no"],
			salesPointData: salesPointData,
			currentPage: currentPage,
			updateFlag: true,
			insertFlag: true,
		})
		this.refs.table.setState({
			selectedRowKeys: []
		});
	}
	/**
	  * 登録ボタン
	  */
	insert = () => {
		var salesPointSetModel = {};
		for (let i = 0; i < this.state.salesPointData.length; i++) {
			if (this.state.salesPointData[i].no === this.state.no) {
				salesPointSetModel["no"] = this.state.no
				salesPointSetModel["employee"] = this.state.salesPointData[i].employee
				salesPointSetModel["newMember"] = this.state.salesPointData[i].newMember
				salesPointSetModel["customerContract"] = this.state.salesPointData[i].customerContract
				salesPointSetModel["level"] = this.state.salesPointData[i].level
				salesPointSetModel["salesPuttern"] = this.state.salesPointData[i].salesPuttern
				salesPointSetModel["specialPoint"] = this.state.salesPointData[i].specialPoint
				salesPointSetModel["point"] = this.state.salesPointData[i].point
				salesPointSetModel["remark"] = this.state.salesPointData[i].remark
			}
		}
		axios.post(this.state.serverIP + "salesPointInsert", salesPointSetModel)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "put", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					this.refs.table.setState({
						selectedRowKeys: []
					});
					this.setState({
						insertFlag: false,
						updateFlag: true
					});
					this.select();
				}
			})
			.catch((error) => {
				console.error("Error - " + error);
			});
	}

	/**
	 * 修正ボタン
	 */
	update = () => {
		var salesPointSetModel = {};
		for (let i = 0; i < this.state.salesPointData.length; i++) {
			if (this.state.salesPointData[i].no === this.state.no) {
				salesPointSetModel["no"] = this.state.no
				salesPointSetModel["employee"] = this.state.salesPointData[i].employee
				salesPointSetModel["newMember"] = this.state.salesPointData[i].newMember
				salesPointSetModel["customerContract"] = this.state.salesPointData[i].customerContract
				salesPointSetModel["level"] = this.state.salesPointData[i].level
				salesPointSetModel["salesPuttern"] = this.state.salesPointData[i].salesPuttern
				salesPointSetModel["specialPoint"] = this.state.salesPointData[i].specialPoint
				salesPointSetModel["point"] = this.state.salesPointData[i].point
				salesPointSetModel["remark"] = this.state.salesPointData[i].remark
			}
		}
		axios.post(this.state.serverIP + "salesPointUpdate", salesPointSetModel)
			.then(result => {
				if (result.data.errorsMessage != null) {
					this.setState({ "errorsMessageShow": true, errorsMessageValue: result.data.errorsMessage });
				} else {
					this.setState({ "myToastShow": true, "method": "put", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					this.refs.table.setState({
						selectedRowKeys: []
					});
					this.setState({
						updateFlag: true
					});
					this.select();
				}
			})
			.catch((error) => {
				console.error("Error - " + error);
			});
	}

	/**
	 * 削除ボタン
	 */
	delete = () => {
		var a = window.confirm("削除していただきますか？");
		if (a) {
			var salesPointSetModel = {};
			salesPointSetModel["no"] = this.state.no
			axios.post(this.state.serverIP + "salesPointDelete", salesPointSetModel)
				.then(result => {
					this.setState({ "myToastShow": true, "method": "post", "errorsMessageShow": false });
					setTimeout(() => this.setState({ "myToastShow": false }), 3000);
					this.setState({
						updateFlag: true
					});
					this.select();
				})
				.catch((error) => {
					console.error("Error - " + error);
				});
		}
	}

	render() {
		//表格样式设定
		this.options = {
			onPageChange: page => {
				this.setState({ currentPage: page });
			},
			page: this.state.currentPage,
			sizePerPage: 5,  // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3,  // the pagination bar size.
			prePage: '<', // Previous page button text
			nextPage: '>', // Next page button text
			firstPage: '<<', // First page button text
			lastPage: '>>', // Last page button text
			paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
			hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
		};
		const { employeeSearch, newMemberSearch, customerContractSearch, errorsMessageValue } = this.state;
		//テーブルの列の選択
		const selectRow = {
			mode: 'radio',
			bgColor: 'pink',
			clickToSelectAndEditCell: true,
			hideSelectColumn: true,
			clickToExpand: true,// click to expand row, default is false
			onSelect: this.handleRowSelect,
		};
		const cellEdit = {
			mode: 'click',
			blurToSave: true
		};
		return (
			<div >
				<div style={{ "display": this.state.myToastShow ? "block" : "none" }}>
					<MyToast myToastShow={this.state.myToastShow} message={this.state.method === "put" ? "登録成功！" : "削除成功！"} type={"success"} />
				</div>
				<div style={{ "display": this.state.errorsMessageShow ? "block" : "none" }}>
					<ErrorsMessageToast errorsMessageShow={this.state.errorsMessageShow} message={errorsMessageValue} type={"danger"} />
				</div>
				<div >
					<Form id="siteForm">
						<Form.Group>
							<Row inline="true">
								<Col className="text-center">
									<h2>営業個別売上</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">営業担当</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl placeholder="例：田中" id="data" name="data" onChange={this.onchange} name="employeeName"  value={this.state.employeeSearch} />
									</InputGroup>
								</Col>
								<Col sm={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">社員区分</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control as="select" size="sm" onChange={this.onchange} name="employeeSearch" value={employeeSearch} autoComplete="off" >
											<option value="">選択ください</option>
											<option value="0">社員</option>
											<option value="1">協力</option>
										</Form.Control>
									</InputGroup>
								</Col>
								<Col sm={5}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">年月</InputGroup.Text>
										</InputGroup.Prepend>
										<InputGroup.Prepend>
											<DatePicker
												selected={this.state.admissionStartDate}
												onChange={this.admissionStartDate}
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												name="admissionStartDate"
												className="form-control form-control-sm"
												id="admissionStartDate"
												locale="ja"
												autoComplete="off"
											/>〜
										<DatePicker
												selected={this.state.admissionEndDate}
												onChange={this.admissionEndDate}
												dateFormat="yyyy/MM"
												showMonthYearPicker
												showFullMonthYearPicker
												name="admissionEndDate"
												className="form-control form-control-sm"
												id="admissionEndDate"
												locale="ja"
												autoComplete="off"
											/>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
							</Row>
							<div>
								<br />
								<Row>
									<Col sm={3}>
										<font style={{ whiteSpace: 'nowrap' }}>入場人数：</font>
									</Col>
									<Col sm={3}>
										<font style={{ whiteSpace: 'nowrap' }}>売上合計：</font>
									</Col>
									<Col sm={2}>
										<font style={{ whiteSpace: 'nowrap' }}>粗利合計：</font>
									</Col>
									<Col sm={4}>
										<div style={{ "float": "right" }}>
											<Button size="sm" id="syounin" onClick={this.onchange} className="btn btn-primary btn-sm">
												営業ポイント明細
								        </Button>
										</div>
									</Col>
								</Row>
								<Row>
									<Col sm={12}>
										<BootstrapTable selectRow={selectRow} data={this.state.salesPointData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
											<TableHeaderColumn dataField='rowNo' width='57' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
											<TableHeaderColumn dataField='yearAndMonth' width='80' tdStyle={{ padding: '.45em' }}>年月</TableHeaderColumn>
											<TableHeaderColumn dataField='employeeStatus' width='90' tdStyle={{ padding: '.45em' }} >社員区分</TableHeaderColumn>
											<TableHeaderColumn dataField='employeeFrom' tdStyle={{ padding: '.45em' }} >所属</TableHeaderColumn>
											<TableHeaderColumn dataField='employeeName' tdStyle={{ padding: '.45em' }} width='120'>氏名</TableHeaderColumn>
											<TableHeaderColumn dataField='customerName' tdStyle={{ padding: '.45em' }} >お客様</TableHeaderColumn>
											<TableHeaderColumn dataField='workDate' tdStyle={{ padding: '.45em' }} >入場期間</TableHeaderColumn>
											<TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }} width='70' >単価</TableHeaderColumn>
											<TableHeaderColumn dataField='profit' width='90' tdStyle={{ padding: '.45em' }} >売上</TableHeaderColumn>
											<TableHeaderColumn dataField='salary' tdStyle={{ padding: '.45em' }} >給料(発注額)</TableHeaderColumn>
											<TableHeaderColumn dataField='siteRoleName' tdStyle={{ padding: '.45em' }} width='65' >粗利</TableHeaderColumn>
										</BootstrapTable>
									</Col>
								</Row>
							</div>
						</Form.Group>
					</Form>
				</div>
			</div >
		);
	}
}


export default (salesProfit);