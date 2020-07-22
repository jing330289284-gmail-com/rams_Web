const $ = require('jquery');
const axios = require('axios');
var oldForm_data;
var oldForm_dataJson;
var newForm_data;
var newForm_dataJson;

// radio切换
export  function checkHave(radioName){   
    var changeId = (radioName == "SocialInsuranceFlag") ? "InsuranceFee" : "BonusAmount";
    if($('input:radio[name="'+radioName+'"]:checked').val() == "1"){
        $("#"+changeId+"").attr("disabled",true);
        $("#"+changeId+"").val("");
        if(radioName == "SocialInsuranceFlag"){
          $("#jidokeisan").attr("disabled",true);
        }
    }else if($('input:radio[name="'+radioName+'"]:checked').val() == "0"){
        $("#"+changeId+"").attr("disabled",false);
        if(radioName == "SocialInsuranceFlag"){
          $("#jidokeisan").attr("disabled",false);
        }
    }
 }
// 登录按钮
export function tokuro(){
  newForm_data = $("#costForm").serializeArray();
  newForm_dataJson = JSON.stringify({ dataform: newForm_data });
  if(newForm_dataJson != oldForm_dataJson){
    var costModel = {};
    var formArray =$("#costForm").serializeArray();
    $.each(formArray,function(i,item){
      costModel[item.name] = item.value;     
    });
    costModel["updateUser"] = sessionStorage.getItem('employeeNo');
    axios.post("http://127.0.0.1:8080/subCost/toroku", costModel)
    .then(function (result) {
      
      if(result.data == true){
        alert("登录完成");
        window.location.reload();
      }else{
        alert("登录错误，请检查程序");
      }
    })
    .catch(function (error) {
      alert("登录错误，请检查程序");
    });
  }else{
    alert("修正してありません!")
  }   
}
// 页面加载
export function onloadPage(){
  var costModel = {};
  costModel["employeeNo"] = $("#employeeNo").val();
  costModel["shoriKbn"] = $("#shoriKbn").val();
  axios.post("http://127.0.0.1:8080/subCost/loadCost", costModel)
  .then(function (resultMap) {
    var resultList = resultMap.data.dataList
    $("#BonusAmount").val(resultList[0]["BonusAmount"]);
      if(resultList[0]["BonusFlag"] == "0"){
        $("#bonusCheckYes").attr("checked",true)
      }else{
        $("#bonusCheckNo").attr("checked",true)
      }
    $("#InsuranceFee").val(resultList[0]["InsuranceFee"]);
      if(resultList[0]["SocialInsuranceFlag"] == "0"){
        $("#hokenCheckYes").attr("checked",true)
      }else{
        $("#hokenCheckNo").attr("checked",true)
      }
    $("#TransportationExpenses").val(resultList[0]["TransportationExpenses"]);
    $("#remark").val(resultList[0]["remark"]);
    $("#salary").val(resultList[0]["salary"]);
    $("#WaitingCost").val(resultList[0]["WaitingCost"]);
    $("#NextBonusMonth").val(resultList[0]["NextBonusMonth"]);
    $("#NextRaiseMonth").val(resultList[0]["NextRaiseMonth"]);
    $("#otherAllowance").val(resultList[0]["otherAllowance"]);
    $("#otherAllowanceAmount").val(resultList[0]["otherAllowanceAmount"]);
    oldForm_data = $("#costForm").serializeArray();
    oldForm_dataJson = JSON.stringify({ dataform: oldForm_data });
  })
  .catch(function (error) {
    alert("查询错误，请检查程序");
  });
}
// 页面不可更改
export function setDisabled(){
  $("#BonusAmount").attr("disabled",true)
  $("#bonusCheckYes").attr("disabled",true)
  $("#bonusCheckNo").attr("disabled",true)
  $("#InsuranceFee").attr("disabled",true);
  $("#hokenCheckYes").attr("disabled",true)
  $("#hokenCheckNo").attr("disabled",true)
  $("#TransportationExpenses").attr("disabled",true)
  $("#remark").attr("disabled",true)
  $("#salary").attr("disabled",true)
  $("#WaitingCost").attr("disabled",true)
  $("#NextBonusMonth").attr("disabled",true)
  $("#NextRaiseMonth").attr("disabled",true)
  $("#toroku").attr("disabled",true)
  $("#reset").attr("disabled",true)
  $("#jidokeisan").attr("disabled",true)
  $("#otherAllowance").attr("disabled",true)
  $("#otherAllowanceAmount").attr("disabled",true)
}
export function jidoujisan(){
  var salary = document.getElementById("salary").value;
  if(salary === ''){
    alert("请输入给料");
  }else if(salary === '0'){
    alert("给料不能为0");
  }else{
    axios.post("/api/getSocialInsurance202003?salary="+salary+"&kaigo=0")
    .then(function (result) {
      $("#InsuranceFee").val(result.data.insurance.payment + result.data.pension.payment);
    })
    .catch(function (error) {
      alert("保险计算错误，请检查程序");
    });
  }
  
}