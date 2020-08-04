import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './components/login'
import Subcost from './components/subCost'
import SubMenu from './components/subMenu'
import main from './components/main';
import EmployeeAdd from './components/employeeAdd';
import EmployeeSearch from './components/employeeSearch';
import BankInfo from './components/bankInfo';
import CustomerInfo from './components/CustomerInfo';
import TopCustomerInfo from './components/topCustomerInfo';
import TechnologyTypeMaster from './components/technologyTypeMaster';
import CustomerInfoSearch from './components/customerInfoSearch';
import siteInfo from './components/siteInfo';

function App() {
	return (
		<Router>
			<div style={{ "backgroundColor": "#f5f5f5" }}>

				<Route exact path="/" component={Login} />
				<Route path="/subMenu" component={SubMenu} />
				<Route path="/subCost" component={Subcost} />
				<Route path="/main" component={main} />
				<Route path="/add" component={EmployeeAdd} />
				<Route path="/employeeSearch" component={EmployeeSearch} />
				<Route path="/bankInfo" component={BankInfo} />
				<Route path="/customerInfo" component={CustomerInfo} />
				<Route path="/topCustomerInfo" component={TopCustomerInfo} />
				<Route path="/technologyTypeMaster" component={TechnologyTypeMaster} />
				<Route path="/customerInfoSearch" component={CustomerInfoSearch} />
				<Route path="/siteInfo" component={siteInfo} />
			</div>
		</Router>

	);
}

export default App;
