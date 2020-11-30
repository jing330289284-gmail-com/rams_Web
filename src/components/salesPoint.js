import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Form, Col, InputGroup, Button } from 'react-bootstrap';
import MyToast from './myToast';
import ErrorsMessageToast from './errorsMessageToast';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faDownload } from '@fortawesome/free-solid-svg-icons';
import store from './redux/store';
axios.defaults.withCredentials = true;


//営業ポイント設定
class salesPoint extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.onchange = this.onchange.bind(this);
		this.checkRows = this.checkRows.bind(this);
	}

	initialState = {
		no: '',
		employee: '',
		startTime: '',
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
		serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
	};

	// 页面加载
	componentDidMount() {
		this.setState({
			//salesPointData: this.props.location.state.pointData,
		})
		//this.select();
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
		salesPointSetModel["employee"] = this.state.employeeSearch
		salesPointSetModel["newMember"] = this.state.newMemberSearch
		salesPointSetModel["customerContract"] = this.state.customerContractSearch
		axios.post(this.state.serverIP + "getSalesPointInfo", salesPointSetModel)
			.then(response => {
				if (response.data != null) {
					this.setState({
						salesPointData: response.data,
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

	checkRows = () => {
		let isNull = false;
		if (this.state.salesPointData[this.state.salesPointData.length - 1].employee === "" ||
			this.state.salesPointData[this.state.salesPointData.length - 1].newMember === "" ||
			this.state.salesPointData[this.state.salesPointData.length - 1].customerContract === "" ||
			this.state.salesPointData[this.state.salesPointData.length - 1].level === "" ||
			this.state.salesPointData[this.state.salesPointData.length - 1].salesPuttern === "" ||
			this.state.salesPointData[this.state.salesPointData.length - 1].specialPoint === "" ||
			this.state.salesPointData[this.state.salesPointData.length - 1].point === "") {
			isNull = true;
		}
		return isNull;
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
		//	テーブルの列の選択
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
							{/* <Row>
                    <Col sm={3}></Col>
                    <Col sm={7}> <img className="mb-4" alt="title" src={title}/> </Col>
                    </Row> */}
							<Row inline="true">
								<Col className="text-center">
									<h2>営業ポイント明細確認</h2>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group>
							<Row>
								<Col sm={3}>
									<font style={{ whiteSpace: 'nowrap' }}>営業担当：{this.state.startTime}</font>
								</Col>
								<Col sm={5}>
								</Col>
								<Col sm={2}>
									<font style={{ whiteSpace: 'nowrap' }}>ポイント合計：{this.state.siteRoleNameAll}</font>
								</Col>
								<Col sm={2}>
									<div style={{ "float": "right" }}>
										<Button variant="info" size="sm" id="revise" onClick={this.delete} disabled={this.state.updateFlag === false && this.state.insertFlag === false ? false : true}><FontAwesomeIcon icon={faDownload} /> PDF出力</Button>{' '}
									</div>
								</Col>
							</Row>
							<Row>
								<Col sm={12}>
									<BootstrapTable selectRow={selectRow} data={this.state.salesPointData} ref='table' pagination={true} options={this.options} headerStyle={{ background: '#5599FF' }} striped hover condensed>
										<TableHeaderColumn dataField='rowNo' width='57' tdStyle={{ padding: '.45em' }} isKey>番号</TableHeaderColumn>
										<TableHeaderColumn dataField='yearAndMonth' width='80' tdStyle={{ padding: '.45em' }}>年月</TableHeaderColumn>
										<TableHeaderColumn dataField='employeeStatus' width='90' tdStyle={{ padding: '.45em' }} >社員区分</TableHeaderColumn>
										<TableHeaderColumn dataField='employeeFrom' tdStyle={{ padding: '.45em' }} width='120'>所属会社</TableHeaderColumn>
										<TableHeaderColumn dataField='employeeName' tdStyle={{ padding: '.45em' }} width='120'>氏名</TableHeaderColumn>
										<TableHeaderColumn dataField='customerName' tdStyle={{ padding: '.45em' }} width='120'>お客様</TableHeaderColumn>
										<TableHeaderColumn dataField='workDate' tdStyle={{ padding: '.45em' }} width='80'>契約区分</TableHeaderColumn>
										<TableHeaderColumn dataField='unitPrice' tdStyle={{ padding: '.45em' }} width='150' >営業結果パタンー</TableHeaderColumn>
										<TableHeaderColumn dataField='profit' tdStyle={{ padding: '.45em' }} width='80' >ポイント</TableHeaderColumn>
										<TableHeaderColumn dataField='salary' tdStyle={{ padding: '.45em' }} width='150' >特別ポイント</TableHeaderColumn>
										<TableHeaderColumn dataField='siteRoleName' tdStyle={{ padding: '.45em' }} width='170' >特別ポイント理由</TableHeaderColumn>
									</BootstrapTable>
								</Col>
							</Row>
						</Form.Group>
					</Form>
				</div>
			</div >
		);
	}
}

export default salesPoint;