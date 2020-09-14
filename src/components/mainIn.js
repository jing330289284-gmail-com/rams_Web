import React,{Component} from 'react';
import { BrowserRouter as Router, Route , withRouter} from "react-router-dom";
import Login from './login';
import SubMenu from './subMenu';
import ExpensesInfo from "./expensesInfo.js"
import axios from 'axios';
axios.defaults.withCredentials=true;
/**
 * 主画面
 */
class mainIn extends Component {
    render() {
        return (
            <Router>
            <>
                <Route exact path="/" component={Login} />
				<Route path="/subMenu" component={SubMenu} />
                <Route path="/expensesInfo" component={ExpensesInfo} />
            </>
            </Router>
            
        );
    }
}

export default withRouter(mainIn);