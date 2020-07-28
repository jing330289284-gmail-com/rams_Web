const $ = require('jquery');
const axios = require('axios');
var oldForm_data;
var oldForm_dataJson;
var newForm_data;
var newForm_dataJson;

// 登录按钮
export function tokuro() {
	if ($("#time_2").val() < $("#time_1").val()) {
		alert("正しい期間を選択してください");
		return false;
	}
	if ($("#time_2").val() == $("#time_1").val()) {
		alert("固定を選択してくださいます");
		return false;
	}

    var siteModel = {};
    var formArray =$("#siteForm").serializeArray();
    $.each(formArray,function(i,item){
      siteModel[item.name] = item.value;     
    });
    axios.post("http://localhost:8080/insertSiteInfo", siteModel)
    .then(function (result) {
      if(result.data == true){
        alert("登录完成");
      }else{
        alert("登录错误，请检查程序");
      }
    })
    .catch(function (error) {
      alert("登录错误，请检查程序");
    });	
}
// 页面加载
export function onloadPage() {
	var costModel = {};
	costModel["employeeNo"] = $("#employeeNo").val();
	costModel["shoriKbn"] = $("#shoriKbn").val();
	axios.post("http://127.0.0.1:8080/subCost/loadCost", costModel)
		.then(function(resultMap) {
			var resultList = resultMap.data.dataList
			$("#BonusFee").val(resultList[0]["BonusFee"]);
			if (resultList[0]["BonusFlag"] == "0") {
				$("#bonusCheckYes").attr("checked", true)
			} else {
				$("#bonusCheckNo").attr("checked", true)
			}
			$("#InsuranceFee").val(resultList[0]["InsuranceFee"]);
			if (resultList[0]["SocialInsuranceFlag"] == "0") {
				$("#hokenCheckYes").attr("checked", true)
			} else {
				$("#hokenCheckNo").attr("checked", true)
			}
			$("#TransportationExpenses").val(resultList[0]["TransportationExpenses"]);
			$("#remark").val(resultList[0]["remark"]);
			$("#salary").val(resultList[0]["salary"]);
			$("#WaitingCost").val(resultList[0]["WaitingCost"]);
			$("#NextBonusMonth").val(resultList[0]["NextBonusMonth"]);
			$("#NextRaiseMonth").val(resultList[0]["NextRaiseMonth"]);
			oldForm_data = $("#costForm").serializeArray();
			oldForm_dataJson = JSON.stringify({ dataform: oldForm_data });
		})
		.catch(function(error) {
			alert("查询错误，请检查程序");
		});
}
// 页面不可更改
export function setDisabled() {
	$("#BonusFee").attr("disabled", true)
	$("#bonusCheckYes").attr("disabled", true)
	$("#bonusCheckNo").attr("disabled",  true)
	$("#InsuranceFee").attr("disabled",  true);
	$("#hokenCheckYes").attr("disabled", true)
	$("#hokenCheckNo").attr("disabled", true)
	$("#TransportationExpenses").attr("disabled", true)
	$("#remark").attr("disabled", true)
	$("#salary").attr("disabled", true)
	$("#WaitingCost").attr("disabled", true)
	$("#NextBonusMonth").attr("disabled", true)
	$("#NextRaiseMonth").attr("disabled", true)
	$("#toroku").attr("disabled", true)
	$("#reset").attr("disabled", true)
	$("#jidokeisan").attr("disabled", true)
}
