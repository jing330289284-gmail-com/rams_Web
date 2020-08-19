import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './components/login'
import Subcost from './components/subCost'
import SubMenu from './components/subMenu'
import main from './components/main';
import Employee from './components/employee';
import EmployeeSearch from './components/employeeSearch';
import BankInfo from './components/bankInfo';
import CustomerInfo from './components/customerInfo';
import TopCustomerInfo from './components/topCustomerInfo';
import masterInsert from './components/masterInsert';
import CustomerDepartmentTypeMaster from './components/customerDepartmentTypeMaster';
import ManageSituation from './components/manageSituation';
import CustomerInfoSearch from './components/customerInfoSearch';
import siteInfo from './components/siteInfo';
import siteSearch from './components/siteSearch';
import PasswordSet from './components/passwordSet';


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
				<Route path="/customerDepartmentTypeMaster" component={CustomerDepartmentTypeMaster} />
				<Route path="/masterInsert" component={masterInsert} />
				<Route path="/customerInfoSearch" component={CustomerInfoSearch} />
				<Route path="/siteInfo" component={siteInfo} />
				<Route path="/manageSituation" component={ManageSituation} />
				<Route path="/siteSearch" component={siteSearch} />
				<Route path="/passwordSet" component={PasswordSet} />
			</div>
		</Router>

	);


}

export default App;
