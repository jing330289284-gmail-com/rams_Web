import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Main from './components/mainIn'

function App() {
	return (
		<Router>
			<div style={{ "backgroundColor": "#f5f5f5" }}>
				<Main/>
			</div>
		</Router>

	);
}

export default App;
