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
		companyMailNames:[this.props.personalInfo.state.selectedMail.length>=1?this.props.personalInfo.state.selectedMail[0].companyMail:'',
		this.props.personalInfo.state.selectedMail.length>=2?this.props.personalInfo.state.selectedMail[1].companyMail:''].filter(function(s) {
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
		siteRoleCode: this.props.personalInfo.state.siteRoleCode,
		developLanguage: this.props.personalInfo.state.developLanguage,
		unitPrice: this.props.personalInfo.state.unitPrice,
		salesProgressCode: this.props.personalInfo.state.salesProgressCode,
		salesProgresss:this.props.personalInfo.state.salesProgresss,
		remark: this.props.personalInfo.state.remark,
		selectedCustomerName: this.props.personalInfo.state.selectedCustomerName,
		loginUserInfo:this.props.personalInfo.state.loginUserInfo,
		selectedmail: this.props.personalInfo.state.selectedmail,
		selectedPurchasingManagers: this.props.personalInfo.state.selectedPurchasingManagers,
	})
	componentDidMount() {

	}

	render() {
		return (
			<div>
				<div >
					<textarea ref={(textarea) => this.textArea = textarea} disabled
						style={{ height: '880px', width: '100%', resize: 'none', border: '0', overflow: 'hidden' }}
						value={`To:`+this.state.selectedmail+`                          添付ファイル名前______`+`
CC:`+this.state.companyMailNames.join(';')+`

タイトル:`+this.state.mailTitle+`

`+
this.state.selectedCustomerName + `株式会社
`+ this.state.selectedPurchasingManagers + `様

お世話になっております、`+this.state.loginUserInfo[0].employeeFristName+`です。

以下の要員を提案させていただきます、案件がございましたら、
ご検討の程宜しくお願い致します。

【名　　前】：`+ this.state.employeeName + `　　　` + this.state.nationalityName + `　　　` + this.state.genderStatus + `
【所　　属】：`+ this.state.employeeStatus + `
【年　　齢】：`+ this.state.age + `歳
【最寄り駅】：`+ (this.state.nearestStation !== "" ? this.state.stations.find((v) => (v.code === this.state.nearestStation)).name : '') + `
【日本　語】：`+ (this.state.japaneaseConversationLevel !== "" ? this.state.japaneaseConversationLevels.find((v) => (v.code === this.state.japaneaseConversationLevel)).name : '') + `
【英　　語】：`+ (this.state.englishConversationLevel !== "" ? this.state.englishConversationLevels.find((v) => (v.code === this.state.englishConversationLevel)).name : '') + `
【業務年数】：`+ this.state.yearsOfExperience + `年
【対応工程】：`+ this.state.siteRoleCode + `
【得意言語】：`+ this.state.developLanguage + `
【単　　価】：`+ this.state.unitPrice + `万円
【稼働開始】：2020/09
【営業状況】：`+ (this.state.salesProgressCode !== "" ? this.state.salesProgresss.find((v) => (v.code === this.state.salesProgressCode)).name : '') + `
【備　　考】：`+ this.state.remark + `

以上、よろしくお願いいたします。
******************************************************************
LYC株式会社 `+this.state.loginUserInfo[0].employeeFristName+` `+this.state.loginUserInfo[0].employeeLastName+`
〒:101-0032 東京都千代田区岩本町3-3-3サザンビル3F  
http://www.lyc.co.jp/   
TEL：03-6908-5796  携帯：`+this.state.loginUserInfo[0].phoneNo+`(優先）
Email：`+this.state.loginUserInfo[0].companyMail+` 営業共通：eigyou@lyc.co.jp 
労働者派遣事業許可番号　派遣許可番号　派13-306371
ＩＳＭＳ：MSA-IS-385
*****************************************************************`}
					/></div>
			</div>
		);
	}
}
export default mailConfirm;