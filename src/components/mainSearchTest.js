import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';



const selectRowProp = {
	mode: 'radio',
	bgColor: 'pink',
	hideSelectColumn: true,
	clickToSelect: true
};


class mainSearchTest extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
	};
	initialState = {
		products: [],
	};

	componentDidMount() {
		this.getNationalitys();//全部の国籍

	}
	//開発言語　開始
	getNationalitys = (sortToggleSalaryFlag) => {
		const emp = {
			developmentLanguageNo: sortToggleSalaryFlag
		};
		axios.post("http://localhost:8080/getEmployeeInfo", emp)
			.then(response => {
				if (response.data != null) {
					this.setState({
						products: response.data
					});
				}
			}).catch((error) => {
				console.error("Error - " + error);
			});

	};

	render() {
		const { products } = this.state;

		return (
			<BootstrapTable data={products} selectRow={selectRowProp}>
				<TableHeaderColumn dataField='rowNo' isKey>番号</TableHeaderColumn>
				<TableHeaderColumn dataField='employeeNo'>社員番号</TableHeaderColumn>
				<TableHeaderColumn dataField='employeeFristName'>社員名</TableHeaderColumn>
			</BootstrapTable>
		);
	}
}
export default mainSearchTest;



