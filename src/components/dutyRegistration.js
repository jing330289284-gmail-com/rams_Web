/* 社員を追加 */
import React from 'react';
import { Form, Button, Col, Row, InputGroup, FormControl, Modal } from 'react-bootstrap';
import axios from 'axios';
import ImageUploader from "react-images-upload";
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import * as dateUtils from './utils/publicUtils.js';
import BankInfo from './accountInfo';
import SubCost from './costInfo';
import SiteInfo from './siteInfo';
import PasswordSet from './passwordSet';
import '../asserts/css/style.css';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import Autosuggest from 'react-autosuggest';

import BreakTime from './breakTime';


class DutyRegistration extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
	}
	//初期化
	initialState = {
	};
	//リセット化
	resetState = {
	};
	//初期化メソッド
	async componentDidMount() {
	}
	/**
	* 小さい画面の閉め 
	*/
	handleHideModal = (kbn) => {
		if (kbn === "breakTime") {//PW設定
			this.setState({ showbreakTimeModal: false })
		}
	}

	/**
 　　　* 小さい画面の開き
    */
	handleShowModal = (kbn) => {
		if (kbn === "breakTime") {//PW設定
			this.setState({ showbreakTimeModal: true })
		}
	}
	render() {
		return (
			<div>
				{/*　 開始 */}
				{/*　 休憩時間 */}
				<Modal aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
					onHide={this.handleHideModal.bind(this, "breakTime")} show={this.state.showbreakTimeModal} dialogClassName="modal-breakTime">
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body >
						<BreakTime actionType={sessionStorage.getItem('actionType')} />
					</Modal.Body>
				</Modal>
				{/* 終了 */}
				<div style={{ "textAlign": "center" }}>
					<Button size="sm" onClick={this.handleShowModal.bind(this, "breakTime")}>休憩時間</Button>{' '}
				</div>
			</div>
		);
	}
}
export default DutyRegistration;
