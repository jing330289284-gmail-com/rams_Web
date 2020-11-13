const $ = require('jquery');

const defaultState = {
    dropDown: fetchDropDown(),
};

export function fetchDropDown() {
    var methodNameList = ["getGender",//0.性別区別 
        "getIntoCompany",// 1入社区分 
        "getStaffForms", // 2 社員形式 
        "getOccupation",// 3役割
        "getEmployeeStatus",// 4社員区分
        "getJapaneseLevel",//5日本語
        "getVisa",//6在留資格
        "getNationalitys",// 7国籍 
        "getDevelopLanguage", // 8開発言語
        "getEmployeeName",// 9社員名
        "getOccupation",//10 職種
        "getDepartment",//11部署
        "getAuthority", // 12 権限 
        "getEnglishLevel",// 13英語
        "getStation",//14駅 
        "getCustomer",//15BP所属
        "getSalesProgress",//16営業状況
        "getListedCompany",// 17上場会社
        "getLevel",//18レベル
        "getCompanyNature",//　19性質
        "getPosition",//20職位
        "getPaymentsite",//21支払サイト
        "getDepartmentMasterDrop",//22部門名前
        "getNewMember",//23新人区分
        "getCustomerContractStatus",//24契約区分
        "getSalesPuttern", //25営業結果パタンー
        "getSpecialPoint",//26特別ポイント条件
        "getApproval",//27ステータスを取得する
        "getCheckSection",//28確認区分を取得する
        "getEnterPeriod",//29enterPeriodを取得する
        "getCostClassification",//30費用区分を取得する
        "getTransportation",//31交通手段を取得する
        "getMaster",//32マスター名を取得する
        "getPayOffRange",//33精算時間を取得する
        "getSiteMaster",//34役割を取得する
        "getTopCustomer",//35トップお客様を取得する
        "getTypeOfIndustry",//36業種を取得する
        "getRound",//37片往を取得する
        "getEmployeeNameNoBP",//38社員氏名（BP社員ない）を取得する
        "getSituationChange",//39状況変動を取得する
        "getSiteStateStatus",//40现场状态
        "getSalesPriorityStatus",//41営業優先度
        "getSalesPerson",//42営業者
        "getJapaneaseConversationLevel",//43日本語会話能力
        "getEnglishConversationLevel",//44英語会話能力
        "getProjectPhase",//45作業範囲
        "getTransaction",//46取引区分
        "getCostClassification",//47費用区分を取得する
        "getSuccessRate",//48確率取得
        "getAgeClassification",//49年齢制限取得
        "getNoOfInterview",//50面談回数取得
        "getAdmissionPeriod",//51入場期限取得
        "getProjectType",//52案件タイプ取得
        "getServerIP",//最後
    ]
    var outArray = [];
    var serverIP = "http://127.0.0.1:8080/";
    //var serverIP = "http://13.58.173.66:8080/";
    var par = JSON.stringify(methodNameList);
    $.ajax({
        type: "POST",
        url: serverIP + "initializationPage",
        data: par,
        async: false,
        contentType: "application/json",
        success: function (resultList) {
            for (let j = 0; j < resultList.length; j++) {
               /*  var array = [{ code: '', name: '選択ください' }]; */
                var array = [{ code: '', name: '' }];
                var list = resultList[j];
                for (var i in list) {
                    array.push(list[i])
                }
                outArray.push(array);
            }
        }
    });
    outArray.push(outArray[outArray.length - 1].slice(1)[0].name);
    return outArray
};


export default (state = defaultState, action) => {
    return state;
};

