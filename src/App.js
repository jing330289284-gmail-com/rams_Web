import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './components/login'
import Subcost from './components/subCost'
import SubMenu from './components/subMenu'
import main from './components/main';
import mainAdd from './components/mainAdd';
import mainSearch from './components/mainSearch';
import mainSearchTest from './components/mainSearchTest';
import messegeAlert from './components/messegeAlert';
import BankInfo from './components/bankInfo';
import CustomerInfo from './components/CustomerInfo';
import TopCustomerInfo from './components/topCustomerInfo';
import TechnologyTypeMaster from './components/technologyTypeMaster';
import CustomerInfoSearch from './components/customerInfoSearch';

function App() {
  const marginTop = {
    marginTop: "20px"
  }
  return (
    <Router>
      <div style={{"backgroundColor":"#f5f5f5"}}>

        <Route exact path="/" component={Login}/>
        <Route path="/subMenu" component={SubMenu}/>
        <Route path="/subCost" component={Subcost}/>
        <Route path="/main" component={main} />
        <Route path="/add" component={mainAdd} />
        <Route path="/edit/:employeeNo" component={messegeAlert} />
        <Route path="/mainSearch" component={mainSearch} />
        <Route path="/mainSearchTest" component={mainSearchTest} />
        <Route path="/messegeAlert" component={messegeAlert} />
        <Route path="/bankInfo" component={BankInfo} />
        <Route path="/customerInfo" component={CustomerInfo} />
        <Route path="/topCustomerInfo" component={TopCustomerInfo} />
        <Route path="/technologyTypeMaster" component={TechnologyTypeMaster} />
        <Route path="/customerInfoSearch" component={CustomerInfoSearch} />
      </div>
    </Router>

  );
}

export default App;
