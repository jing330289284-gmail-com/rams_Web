const $ = require('jquery');
const axios = require('axios');
var oldForm_data;//画面初期のデータ
var oldForm_dataJson;//画面初期のデータのjson
var newForm_data;//登録の際データ
var newForm_dataJson;//登録の際データのjson

/**
 * 登録ボタン
 */
export function tokuro(){
  newForm_data = $("#costForm").serializeArray();
  newForm_dataJson = JSON.stringify({ dataform: newForm_data });
  if(newForm_dataJson !== oldForm_dataJson && $("#totalAmount").val() !== '' && 
  $("#totalAmount").val() !== null && !isNaN($("#totalAmount").val())){
    var costModel = {};
    var formArray =$("#costForm").serializeArray();
    $.each(formArray,function(i,item){
      costModel[item.name] = item.value;     
    });
    costModel["updateUser"] = sessionStorage.getItem('employeeNo');
    axios.post("http://127.0.0.1:8080/subCost/toroku", costModel)
    .then(function (result) {
      
      if(result.data === true){
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
    if(newForm_dataJson === oldForm_dataJson){
      alert("修正してありません!")
    }else if($("#totalAmount").val() === '' || 
    $("#totalAmount").val() === null || isNaN($("#totalAmount").val())){
      document.getElementById("subCostErorMsg").innerHTML = "入力してあるデータに不正があるため、チェックしてください！";
      document.getElementById("subCostErorMsg").style = "visibility:visible";    } 
  }   
}
/**
 * 画面初期化
 */
export function onloadPage(){
  $("#youin").attr("disabled",true);
  var costModel = {};
  costModel["employeeNo"] = $("#employeeNo").val();
  costModel["actionType"] = $("#actionType").val();
  axios.post("http://127.0.0.1:8080/subCost/loadCost", costModel)
  .then(function (resultMap) {
    var resultList = resultMap.data.dataList.dataList;
    var checkKadoMap = resultMap.data.checkKadoMap;
    $("#salary").val(resultList[0]["salary"]);
    $("#SocialInsuranceFlag").val(resultList[0]["SocialInsuranceFlag"]);
    $("#welfarePensionAmount").val(resultList[0]["welfarePensionAmount"]);
    $("#healthInsuranceAmount").val(resultList[0]["healthInsuranceAmount"]);
    $("#InsuranceFeeAmount").val(resultList[0]["InsuranceFeeAmount"]);
    $("#TransportationExpenses").val(resultList[0]["TransportationExpenses"]);
    $("#BonusFlag").val(resultList[0]["BonusFlag"]);
    if($("#BonusFlag").val() === "0"){
      $("#lastTimeBonusAmount").attr('readOnly' , false);
      $("#scheduleOfBonusAmount").attr('readOnly' , false);
    }
    $("#lastTimeBonusAmount").val(resultList[0]["lastTimeBonusAmount"]);
    $("#scheduleOfBonusAmount").val(resultList[0]["scheduleOfBonusAmount"]);
    $("#WaitingCost").val(resultList[0]["WaitingCost"]);
    $("#NextBonusMonth").val(resultList[0]["NextBonusMonth"]);
    $("#NextRaiseMonth").val(resultList[0]["NextRaiseMonth"]);
    $("#leaderAllowanceAmount").val(resultList[0]["leaderAllowanceAmount"]);
    $("#otherAllowance").val(resultList[0]["otherAllowance"]);
    $("#otherAllowanceAmount").val(resultList[0]["otherAllowanceAmount"]);
    $("#remark").val(resultList[0]["remark"]);
    $("#totalAmount").val(resultList[0]["totalAmount"]);
    //非稼働判断
    if(checkKadoMap !== null){
      if(checkKadoMap["siteRoleCode"] === 1){
        $("#leaderAllowanceAmount").attr("readOnly",false);
        if(checkKadoMap["RelatedEmployees"] !== null && checkKadoMap["RelatedEmployees"] !== ''){
          $("#RelatedEmployees").val(checkKadoMap["RelatedEmployees"]);
          $("#youin").attr("disabled",false);
        }
      }
    }else{
      $("#WaitingCost").attr("readOnly",false);
      document.getElementById('mark').innerHTML = '';
    }
    oldForm_data = $("#costForm").serializeArray();
    oldForm_dataJson = JSON.stringify({ dataform: oldForm_data });
  })
  .catch(function (error) {
    alert("查询错误，请检查程序");
  });
}
/**
 * 画面項目の非活性
 */
export function setDisabled(){
  $("#salary").attr("disabled",true)
  $("#SocialInsuranceFlag").attr("disabled",true)
  $("#welfarePensionAmount").attr("disabled",true)
  $("#healthInsuranceAmount").attr("disabled",true)
  $("#InsuranceFeeAmount").attr("disabled",true)
  $("#TransportationExpenses").attr("disabled",true)
  $("#BonusFlag").attr("disabled",true)
  $("#lastTimeBonusAmount").attr("disabled",true)
  $("#scheduleOfBonusAmount").attr("disabled",true)
  $("#leaderAllowanceAmount").attr("disabled",true)
  $("#totalAmount").attr("disabled",true)
  $("#RelatedEmployees").attr("disabled",true)
  $("#youin").attr("disabled",true)
  $("#BonusAmount").attr("disabled",true)
  $("#bonusCheckYes").attr("disabled",true)
  $("#bonusCheckNo").attr("disabled",true)
  $("#InsuranceFee").attr("disabled",true);
  $("#hokenCheckYes").attr("disabled",true)
  $("#hokenCheckNo").attr("disabled",true)
  $("#remark").attr("disabled",true)
  $("#WaitingCost").attr("disabled",true)
  $("#NextBonusMonth").attr("disabled",true)
  $("#NextRaiseMonth").attr("disabled",true)
  $("#toroku").attr("disabled",true)
  $("#reset").attr("disabled",true)
  $("#otherAllowance").attr("disabled",true)
  $("#otherAllowanceAmount").attr("disabled",true)
}
/**
 * 社会保険計算
 */
export async function jidoujisan(){
  var salary = document.getElementById("salary").value;
  if($("#SocialInsuranceFlag").val() === "0"){
    if(salary === ''){
      alert("请输入给料");
      $("#SocialInsuranceFlag").val("1");
    }else if(salary === '0'){
      alert("给料不能为0");
      $("#SocialInsuranceFlag").val("1");
    }else{
      /**
       * https://asia-northeast1-tsunagi-all.cloudfunctions.net/
       * 社会保険計算
       */
      await axios.post("/api/getSocialInsurance202003?salary="+salary+"&kaigo=0")
      .then(function (result) {
        $("#welfarePensionAmount").val(result.data.pension.payment);
        $("#healthInsuranceAmount").val(result.data.insurance.payment);
        $("#InsuranceFeeAmount").val(result.data.insurance.payment + result.data.pension.payment);
      })
      .catch(function (error) {
        alert("保险计算错误，请检查程序");
        $("#SocialInsuranceFlag").val("1");
      });
    }
    totalKeisan();
  }else{
    $("#welfarePensionAmount").val('');
    $("#healthInsuranceAmount").val('');
    $("#InsuranceFeeAmount").val('');
    totalKeisan();
  }
}
/**
 * ボーナス項目の活性
 */
export function bonusCanInput(){
  if($("#BonusFlag").val() === "0"){
    $("#lastTimeBonusAmount").attr('readOnly' , false);
    $("#scheduleOfBonusAmount").attr('readOnly' , false);
    totalKeisan();
  }else{
    $("#lastTimeBonusAmount").attr('readOnly' , true);
    $("#scheduleOfBonusAmount").attr('readOnly' , true);
    $("#lastTimeBonusAmount").val('');
    $("#scheduleOfBonusAmount").val('');
    totalKeisan();
  }
}
/**
 * 総計の計算
 */
export function totalKeisan(){
  var sum = 0;
  if($("#salary").val() === '' && $("#WaitingCost").val() !== ''){
    sum += parseInt($("#WaitingCost").val());
  }else if($("#salary").val() !== '' && $("#WaitingCost").val() === ''){
    sum += parseInt($("#salary").val());
  }
  sum = sum + parseInt(($("#InsuranceFeeAmount").val() === '' ? 0 : $("#InsuranceFeeAmount").val())) + parseInt(($("#TransportationExpenses").val() === '' ? 0 : $("#TransportationExpenses").val())) 
  + parseInt(($("#leaderAllowanceAmount").val() === '' ? 0 : $("#leaderAllowanceAmount").val())) + 
  parseInt(($("#otherAllowanceAmount").val() === '' ? 0 : $("#otherAllowanceAmount").val())) + Math.floor(($("#scheduleOfBonusAmount").val() === '' ? 0 : $("#scheduleOfBonusAmount").val())/12);
  $("#totalAmount").val((isNaN(sum) ? '' : sum));
  if($("#totalAmount").val() === "0"){
    $("#totalAmount").val('');
  }
}