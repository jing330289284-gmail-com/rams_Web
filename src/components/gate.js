import React,{Component} from 'react';
import { BrowserRouter as Router, Route , Link} from "react-router-dom";
import { Button , Card} from 'react-bootstrap';

class gate extends Component {
    state = { 

     }
    render() {
        return (
            <div className="text-center mainBody" style={{ "float": "center" , "marginTop":"10%"}}>
                    <Link to="/loginManager" className="btn btn-primary">管理者登録</Link><br/><Link to="/loginEmployee" className="btn btn-primary">社員登録</Link>
            </div>
        );
    }
}

export default gate;