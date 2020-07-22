import React from 'react';
import { Card, Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import ImageUploader from "react-images-upload";
import './style.css';
import './imageUploader.css';

class mainAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;//初期化
		this.valueChange = this.valueChange.bind(this);
		//this.saveEmployee = this.saveEmployee.bind(this);//登録
		this.onDrop = this.onDrop.bind(this);//ImageUploaderを処理

	}
	//初期化
	initialState = {
		employeeNo: '',//社員番号
		pictures: [],//ImageUploader
	};
	//リセット
	resetBook = () => {
		this.setState(() => this.initialState);
	};

	//onchange
	valueChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	//ImageUploaderを処理　開始
	onDrop(picture) {
		this.setState({
			pictures: this.state.pictures.concat(picture),
		});
	}
	//ImageUploaderを処理　終了
	render() {
		const { employeeNo } = this.state;
		return (
			<Card className="border border-dark bg-dark text-white">
				<Card.Header style={{ "textAlign": "center" }}>
					<Button size="sm">住所情報</Button>{' '}
					<Button size="sm">口座情報</Button>{' '}
					<Button size="sm">諸費用</Button>{' '}
					<Button size="sm">現場情報</Button>{' '}
					<Button size="sm">協力会社</Button>{' '}
					<Button size="sm">権限・PW設置</Button>
					<div>
						<Form.Label>社員</Form.Label><Form.Check inline type="radio" name="employeeType" value="0" />
						<Form.Label>協力</Form.Label><Form.Check inline type="radio" name="employeeType" value="1" />
					</div>
				</Card.Header>

				<Form onSubmit={this.saveEmployee} onReset={this.resetBook} id="bookFormID">
					<Form.Label>基本情報</Form.Label>
					<Form.Group>
						{/* <div style={{ "float": "right" }} > */}
						<ImageUploader
							withIcon={false}
							withPreview={true}
							label=""
							buttonText="Upload Images"
							onChange={this.onDrop}
							imgExtension={[".jpg", ".gif", ".png", ".gif", ".svg"]}
							maxFileSize={1048576}
							fileSizeError=" file size is too big"
						/>
						{/* </div> */}
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="社員番号" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員名</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="社員名" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />{' '}
									<FormControl id="inlineFormInputGroup" placeholder="社員名" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">カタカナ</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="カタカナ" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />{' '}
									<FormControl id="inlineFormInputGroup" placeholder="カタカナ" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">ローマ字</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="ローマ字" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">年齢</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="年齢" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
									<FormControl id="inlineFormInputGroup" placeholder="年齢" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">和暦</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="和暦" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">性別</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="性別" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社区分</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="入社区分" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社員形式</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="社員形式" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">職種</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="職種" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">部署</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="部署" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">社内メール</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control type="email" id="inlineFormInputGroup" placeholder="社内メール" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業学校</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="学校" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
									<FormControl id="inlineFormInputGroup" placeholder="専門" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">卒業年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="卒業年月" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">入社年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="入社年月" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
									<FormControl id="inlineFormInputGroup" placeholder="入社年月" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">退職年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="退職年月" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">出身地</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="出身地" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
									<FormControl id="inlineFormInputGroup" placeholder="出身地" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">携帯電話</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="携帯電話" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">来日年月</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="来日年月" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">権限</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="権限" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<Form.Label>スキール情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">日本語</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="日本語" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">英語</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="英語" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">資格</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="資格" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
									<FormControl id="inlineFormInputGroup" placeholder="資格" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={6}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">スキール</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="スキール" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
									<FormControl id="inlineFormInputGroup" placeholder="スキール" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
									<FormControl id="inlineFormInputGroup" placeholder="スキール" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">経験年数</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="経験年数" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>

					<Form.Label>個人関連情報</Form.Label>
					<Form.Group>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留資格</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="在留資格" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="在留カード" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留期間</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="在留期間" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">雇用保険番号</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="雇用保険番号" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={3}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">マイナンバー</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="マイナンバー" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>

						<Row>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">履歴書</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.File id="exampleFormControlFile1"/>
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">在留カード</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="在留カード" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
							<Col sm={4}>
								<InputGroup size="sm" className="mb-3">
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroup-sizing-sm">パスポート</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl id="inlineFormInputGroup" placeholder="パスポート" value={employeeNo} autoComplete="off"
										onChange={this.valueChange} size="sm" name="employeeNo" />
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>

					<Card.Footer style={{ "textAlign": "center" }}>
						<Button size="sm" variant="success" type="submit">
							登録
                        </Button>{' '}
						<Button size="sm" type="reset" variant="success"  >
							リセット
                        </Button>
					</Card.Footer>
				</Form>
			</Card>
		);
	}
}
export default mainAdd;
