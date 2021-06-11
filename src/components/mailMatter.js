import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
/**
 * メール確認
 * 
 */
class mailMatter extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.initState;
	}

	initState = ({
		companyMailNames: [this.props.personalInfo.state.selectedMailCC.length >= 1 ? this.props.personalInfo.state.selectedMailCC[0].companyMail : '',
				this.props.personalInfo.state.selectedMailCC.length >= 2 ? this.props.personalInfo.state.selectedMailCC[1].companyMail : ''].filter(function(s) {
					return s;
				}),
				mailTitle: this.props.personalInfo.state.mailTitle,
				selectedCustomerName: this.props.personalInfo.state.selectedCustomerName,
				loginUserInfo: this.props.personalInfo.state.loginUserInfo,
				selectedmail: this.props.personalInfo.state.selectedmail,
				selectedPurchasingManagers: this.props.personalInfo.state.selectedPurchasingManagers,
				matterText: this.props.personalInfo.state.matterText,
				greetinTtext: this.props.personalInfo.state.greetinTtext,
	})
	componentDidMount() {
	}

	render() {
		return (
			<div>
				<div >
					<textarea ref={(textarea) => this.textArea = textarea} disabled
						style={{ height: '800px', width: '100%', resize: 'none', border: '0'}}
					value={`To:` + this.state.selectedmail + `
CC:`+ this.state.companyMailNames.join(';') + `         

タイトル:`+ this.state.mailTitle + `

`+
this.state.selectedCustomerName + `株式会社
`+ (this.state.selectedPurchasingManagers === "" ? "ご担当者" : this.state.selectedPurchasingManagers) + `様

お世話になっております、LYC`+ this.state.loginUserInfo[0].employeeFristName + `です。

` +
this.state.greetinTtext
 + `

` +
this.state.matterText
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
export default mailMatter;