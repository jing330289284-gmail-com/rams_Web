import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
/**
 * メール確認
 * 
 */
class mailConfirm extends React.Component {
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
		employeeName: this.props.personalInfo.state.employeeName,
		nationalityName: this.props.personalInfo.state.nationalityName,
		genderStatus: this.props.personalInfo.state.genderStatus,
		employeeStatus: this.props.personalInfo.state.employeeStatus,
		age: this.props.personalInfo.state.age,
		nearestStation: this.props.personalInfo.state.nearestStation,
		stations: this.props.personalInfo.state.stations,
		japaneaseConversationLevel: this.props.personalInfo.state.japaneaseConversationLevel,
		japaneaseConversationLevels: this.props.personalInfo.state.japaneaseConversationLevels,
		englishConversationLevel: this.props.personalInfo.state.englishConversationLevel,
		englishConversationLevels: this.props.personalInfo.state.englishConversationLevels,
		yearsOfExperience: this.props.personalInfo.state.yearsOfExperience,
		siteRoleCode: this.props.personalInfo.state.siteRoleName,
		developLanguage: this.props.personalInfo.state.developLanguage,
		unitPrice: this.props.personalInfo.state.unitPrice,
		salesProgressCode: this.props.personalInfo.state.salesProgressCode,
		salesProgresss: this.props.personalInfo.state.salesProgresss,
		remark: this.props.personalInfo.state.remark,
		selectedCustomerName: this.props.personalInfo.state.selectedCustomerName,
		loginUserInfo: this.props.personalInfo.state.loginUserInfo,
		selectedmail: this.props.personalInfo.state.selectedmail,
		selectedPurchasingManagers: this.props.personalInfo.state.selectedPurchasingManagers,
		greetinTtext: this.props.personalInfo.state.greetinTtext,
		theMonthOfStartWork: this.props.personalInfo.state.theMonthOfStartWork,
		resumeName: this.props.personalInfo.state.resumeName === undefined || this.props.personalInfo.state.resumeName === null ? "" : this.props.personalInfo.state.resumeName,
	})
	componentDidMount() {
	}

	render() {
		return (
			<div>
				<div >
					<textarea ref={(textarea) => this.textArea = textarea} disabled
						style={{ height: '880px', width: '100%', resize: 'none', border: '0', overflow: 'hidden' }}
						value={`To:` + this.state.selectedmail + `
CC:`+ this.state.companyMailNames.join(';') + `         
添付ファイル名前:` + this.state.resumeName + `

タイトル:`+ this.state.mailTitle + `

`+
							this.state.selectedCustomerName + `株式会社
`+ this.state.selectedPurchasingManagers + `様

お世話になっております、LYC`+ this.state.loginUserInfo[0].employeeFristName + `です。

 ` +
 this.state.greetinTtext
 + `

【名　　前】：`+ this.state.employeeName + `　` + this.state.nationalityName + `　` + this.state.genderStatus + `
【所　　属】：`+ this.state.employeeStatus + (this.state.age === ""?"":`
【年　　齢】：`)+ this.state.age + (this.state.age === ""?"":`歳`) + (this.state.nearestStation !== "" && this.state.nearestStation !== null ?`
【最寄り駅】：`:"") + (this.state.nearestStation !== "" && this.state.nearestStation !== null ? this.state.stations.find((v) => (v.code === this.state.nearestStation)).name : '') + (this.state.japaneaseConversationLevel !== "" && this.state.japaneaseConversationLevel !== null ?`
【日本　語】：`:"")+ (this.state.japaneaseConversationLevel !== "" && this.state.japaneaseConversationLevel !== null ? this.state.japaneaseConversationLevels.find((v) => (v.code === this.state.japaneaseConversationLevel)).name : '') + (this.state.englishConversationLevel !== "" && this.state.englishConversationLevel !== null ?`
【英　　語】：`:"")+ (this.state.englishConversationLevel !== "" && this.state.englishConversationLevel !== null ? this.state.englishConversationLevels.find((v) => (v.code === this.state.englishConversationLevel)).name : '') + (this.state.yearsOfExperience!==null&&this.state.yearsOfExperience!==""?`
【業務年数】：`:"")+ (this.state.yearsOfExperience!==null&&this.state.yearsOfExperience!==""?this.state.yearsOfExperience:"") + (this.state.yearsOfExperience === ""?"":`年`) + (this.state.siteRoleCode === ""?"":`
【対応工程】：`)+ this.state.siteRoleCode + (this.state.developLanguage === ""?"":`
【得意言語】：`)+ this.state.developLanguage + (this.state.unitPrice === ""||this.state.unitPrice === null?"":`
【単　　価】：`)+ (this.state.unitPrice === ""||this.state.unitPrice === null?"":this.state.unitPrice) + (this.state.unitPrice === ""||this.state.unitPrice === null?"":`万円`) + (this.state.theMonthOfStartWork !== "" && this.state.theMonthOfStartWork !== null ? `
【稼働開始】：`:"") + (this.state.theMonthOfStartWork !== "" && this.state.theMonthOfStartWork !== null ? this.state.theMonthOfStartWork:"") + (this.state.salesProgressCode !== "" && this.state.salesProgressCode !== null ?`
【営業状況】：`:"")+ (this.state.salesProgressCode !== "" ? this.state.salesProgresss.find((v) => (v.code === this.state.salesProgressCode)).name : '') + (this.state.remark === ""?"":`
【備　　考】：`)+ this.state.remark + `

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
export default mailConfirm;