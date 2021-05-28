import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
/**
 * メール確認
 * 
 */
class mailReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initState;
	}

	initState = ({
		loginUserInfo: this.props.personalInfo.state.loginUserInfo,
		purchasingManagersMail: this.props.personalInfo.state.purchasingManagersMail,
		customerName: this.props.personalInfo.state.customerName,
		purchasingManagers: this.props.personalInfo.state.purchasingManagers,
		sendRepotsAppend: this.props.personalInfo.state.sendRepotsAppend,
	})
	componentDidMount() {
		
	}

	render() {
		return (
			<div>
				<div >
					<textarea ref={(textarea) => this.textArea = textarea} disabled
						style={{ height: '500px', width: '100%', resize: 'none', border: '0'}}
						value={`宛先TO：` + this.state.purchasingManagersMail + `
メールタイトル：` + new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + `作業報告書` + `

` + this.state.customerName + "の" + this.state.purchasingManagers + `様

お世話になっております、`+ this.state.loginUserInfo[0].employeeFristName + ` ` + this.state.loginUserInfo[0].employeeLastName + `と申します。
弊社の`+ this.state.sendRepotsAppend + (new Date().getMonth() + 1) + "月" + `作業報告書を添付します。`
+ `

以上、よろしくお願いいたします。
******************************************************************
LYC株式会社 `+ this.state.loginUserInfo[0].employeeFristName + ` ` + this.state.loginUserInfo[0].employeeLastName + `
〒:101-0032 東京都千代田区岩本町3-3-3サザンビル3F  
http://www.lyc.co.jp/   
TEL：03-6908-5796  携帯：`+ this.state.loginUserInfo[0].phoneNo + `(優先）
Email：`+ this.state.loginUserInfo[0].companyMail + ` 営業共通：eigyou@lyc.co.jp 
労働者派遣事業許可番号　派遣許可番号　派13-306371
ＩＳＭＳ：MSA-IS-385
*****************************************************************`}
					/></div>
			</div>
		);
	}
}
export default mailReport;