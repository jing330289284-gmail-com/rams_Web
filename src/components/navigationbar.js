import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";

class BavigationBar extends React.Component {
	render() {
		return (
			<Navbar bg="dark" variant="dark">
				<Link to={""} className="navbar-brand">
					main画面
				</Link>
				<Nav className="mr-auto">
					<Link to={"add"} className="nav-link">社員情報登録</Link>
					<Link to={"mainSearch"} className="nav-link">社員情報検索</Link>
					<Link to={"mainSearchTest"} className="nav-link">社員情報検索テスト</Link>
					<Link to={"messegeAlert"} className="nav-link">メッセージ</Link>
				</Nav>
			</Navbar>
		);
	}
}
export default BavigationBar;
