import React from 'react';
import { BrowserRouter as Router , Route} from "react-router-dom";
import Main from './components/mainIn';
import PasswordReset from './components/passwordReset';

function App() {
	return (
		<Router>
			<div>
				<Main/>
				<Route exact path="/passwordReset" component={PasswordReset} />
			</div>
		</Router>

	);
}

export default App;
