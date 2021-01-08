import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from './components/mainIn';
import PasswordReset from './components/passwordReset';
import ErrorPage from './components/errorPage';
function App() {
	return (
		<Router>
			<div>
				<ErrorPage>
					<Main />
					<Route exact path="/passwordReset" component={PasswordReset} />
				</ErrorPage>
			</div>
		</Router>

	);
}
export default App;
