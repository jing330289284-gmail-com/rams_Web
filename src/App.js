import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './components/login'
import Subcost from './components/costInfo'
import SubMenu from './components/subMenu'
import main from './components/main';
import Employee from './components/employee';
import EmployeeSearch from './components/employeeSearch';
import BankInfo from './components/accountInfo';
import CustomerInfo from './components/customerInfo';
import TopCustomerInfo from './components/topCustomerInfo';
import masterInsert from './components/masterInsert';
import masterUpdate from './components/masterUpdate';
import ManageSituation from './components/manageSituation';
import CustomerInfoSearch from './components/customerInfoSearch';
import siteInfo from './components/siteInfo';
import siteSearch from './components/siteSearch';
import PasswordSet from './components/passwordSet';
import individualSales from './components/individualSales';


function App() {
	return (
		<Router>
			<div style={{ "backgroundColor": "#f5f5f5" }}>
				<Route exact path="/" component={Login} />
				<Route path="/subMenu" component={SubMenu} />
				<Route path="/subCost" component={Subcost} />
				<Route path="/main" component={main} />
				<Route path="/employee" component={Employee} />
				<Route path="/employeeSearch" component={EmployeeSearch} />
				<Route path="/bankInfo" component={BankInfo} />
				<Route path="/customerInfo" component={CustomerInfo} />
				<Route path="/topCustomerInfo" component={TopCustomerInfo} />
				<Route path="/masterInsert" component={masterInsert} />
				<Route path="/masterUpdate" component={masterUpdate} />
				<Route path="/customerInfoSearch" component={CustomerInfoSearch} />
				<Route path="/siteInfo" component={siteInfo} />
				<Route path="/manageSituation" component={ManageSituation} />
				<Route path="/siteSearch" component={siteSearch} />
				<Route path="/passwordSet" component={PasswordSet} />
				<Route path="/individualSales" component={individualSales} />
			</div>
		</Router>

	);


}

export default App;
