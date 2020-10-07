import React,{Component} from 'react';
import { BrowserRouter as Router, Route , withRouter} from "react-router-dom";
import LoginManager from './loginManager';
import Gate from './gate';
import LoginEmployee from './loginEmployee';
import SubMenuManager from './subMenuManager';
import SubMenuEmployee from './subMenuEmployee';
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
                <Route exact path="/" component={Gate} />
                <Route path="/loginManager" component={LoginManager} />
                <Route path="/loginEmployee" component={LoginEmployee} />
				<Route path="/subMenuManager" component={SubMenuManager} />
                <Route path="/subMenuEmployee" component={SubMenuEmployee} />
            </>
            </Router>
            
        );
    }
}

export default withRouter(mainIn);