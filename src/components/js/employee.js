// 社員情報登録画面の初期化
export async function addInitialState() {
	return {
		showBankInfoModal: false,//口座情報画面フラグ
		showSubCostModal: false,//諸費用
		showSiteInformationModal: false,//現場情報
		//showCustomerInfoModal: false,//権限・PW設置
		pictures: [],//ImageUploader
		genderStatuss: [],//性別
		intoCompanyCodes: [],//　　入社区分
		emploryeeFormCodes: [],//　　社員形式
		occupationCodes: [],//　　職種
		departmentCodes: [],//　　部署
		authorityCodes: [],//　　権限
		japaneaseLevelCodes: [],//　　日本語
		residenceCodes: [],//　　在留資格
		englishLeveCodes: [],//　　英語
		nationalityCodes: [],//　　出身地
	};
}

// 社員情報登録画面のリセット
export async function addResetState() {
	return {
		employeeFristName: '',//　　社員氏
		employeeLastName: '',//　　社員名
		furigana1: '',//　　カタカナ1
		furigana2: '',//　　カタカナ2
		alphabetName: '',//　　ローマ字
		age: '',//　　年齢
		japaneseCalendar: "",　　//和暦
		companyMail: "",　　//社内メール
		graduationUniversity: "",　　//学校
		major: "",//　　専門
		graduationDate: "",//　　卒業年月
		intoCompanyYearAndMonth: "",//　　入社年月
		retirementYearAndMonth: "",//　　退職年月
		comeToJapanYearAndMonth: "",//　　来日年月
		//intoCompanyYearAndMonth: "",//出身地TODO
		nationalityCode: "",//　　出身地(県)
		phone: "",//携帯電話
		developLanguage1: "",//　　スキール1
		developLanguage2: "",//　　スキール2
		developLanguage3: "",//　　スキール3
		developLanguage4: "",//　　スキール4
		developLanguage5: "",//　　スキール5
		residenceCardNoCode: "",//　　在留カード
		employmentInsuranceNo: "",//　　雇用保険番号
		myNumber: "",//　　マイナンバー
		certification1: "",//　　資格1
		certification2: "",//　　資格2
	};
}
