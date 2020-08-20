import React from 'react';
import { Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap';

class pbInfo extends React.Component {
	
	render() {
		return (
			<div >
				<FormControl id="rowSelectEmployeeNo" name="rowSelectEmployeeNo" hidden />
				<Form >
					<div >
						<Form.Group>
							<Row>
								<Col lg={3}>
									<InputGroup size="sm" className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroup-sizing-sm">ｐｂ情報</InputGroup.Text>
										</InputGroup.Prepend>
									</InputGroup>
								</Col>
							</Row>
						</Form.Group>
					</div>
				</Form>
			</div >
		);
	}
}
export default pbInfo;