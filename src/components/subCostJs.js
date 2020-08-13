const $ = require('jquery');
const axios = require('axios');

/**
 * 画面項目の非活性
 */
export function setDisabled(){
  $("#salary").attr("disabled",true)
  $("#SocialInsuranceFlag").attr("disabled",true)
  $("#welfarePensionAmount").attr("disabled",true)
  $("#healthInsuranceAmount").attr("disabled",true)
  $("#onsuranceFeeAmount").attr("disabled",true)
  $("#transportationExpenses").attr("disabled",true)
  $("#bonusFlag").attr("disabled",true)
  $("#lastTimeBonusAmount").attr("disabled",true)
  $("#scheduleOfBonusAmount").attr("disabled",true)
  $("#leaderAllowanceAmount").attr("disabled",true)
  $("#totalAmount").attr("disabled",true)
  $("#relatedEmployees").attr("disabled",true)
  $("#youin").attr("disabled",true)
  $("#bonusAmount").attr("disabled",true)
  $("#bonusCheckYes").attr("disabled",true)
  $("#bonusCheckNo").attr("disabled",true)
  $("#insuranceFee").attr("disabled",true);
  $("#hokenCheckYes").attr("disabled",true)
  $("#hokenCheckNo").attr("disabled",true)
  $("#remark").attr("disabled",true)
  $("#waitingCost").attr("disabled",true)
  $("#nextBonusMonth").attr("disabled",true)
  $("#nextRaiseMonth").attr("disabled",true)
  $("#reflectYearAndMonth").attr("disabled",true)
  $("#subCostEmployeeFormCode").attr("disabled",true)
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
  if($("#SocialInsuranceFlag").val() === "1"){
    if(salary === ''){
      alert("请输入给料");
      $("#SocialInsuranceFlag").val("0");
    }else if(salary === '0'){
      alert("给料不能为0");
      $("#SocialInsuranceFlag").val("0");
    }else{
      /**
       * https://asia-northeast1-tsunagi-all.cloudfunctions.net/
       * 社会保険計算
       */
      await axios.post("/api/getSocialInsurance202003?salary="+salary+"&kaigo=0")
      .then(function (result) {
        $("#welfarePensionAmount").val(result.data.pension.payment);
        $("#healthInsuranceAmount").val(result.data.insurance.payment);
        $("#insuranceFeeAmount").val(result.data.insurance.payment + result.data.pension.payment);
      })
      .catch(function (error) {
        alert("保险计算错误，请检查程序");
        $("#SocialInsuranceFlag").val("0");
      });
    }
    totalKeisan();
  }else{
    $("#welfarePensionAmount").val('');
    $("#healthInsuranceAmount").val('');
    $("#insuranceFeeAmount").val('');
    totalKeisan();
  }
}
/**
 * ボーナス項目の活性
 */
export function bonusCanInput(){
  if($("#BonusFlag").val() === "1"){
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
 * 住宅手当項目の活性
 */
export function housingAllowanceCanInput(){
  if($("#housingStatus").val() !== ""){
    $("#housingAllowance").attr('readOnly' , false);
  }else{
    $("#housingAllowance").attr('readOnly' , true);
    $("#housingAllowance").val('');
  }
}
/**
 * 総計の計算
 */
export function totalKeisan(){
  var sum = 0;
  if($("#salary").val() === '' && $("#waitingCost").val() !== ''){
    sum += parseInt($("#waitingCost").val());
  }else if($("#salary").val() !== '' && $("#waitingCost").val() === ''){
    sum += parseInt($("#salary").val());
  }
  sum = sum + parseInt(($("#insuranceFeeAmount").val() === '' ? 0 : $("#insuranceFeeAmount").val())) + parseInt(($("#transportationExpenses").val() === '' ? 0 : $("#transportationExpenses").val())) 
  + parseInt(($("#leaderAllowanceAmount").val() === '' ? 0 : $("#leaderAllowanceAmount").val())) + 
  parseInt(($("#otherAllowanceAmount").val() === '' ? 0 : $("#otherAllowanceAmount").val())) + Math.floor(($("#scheduleOfBonusAmount").val() === '' ? 0 : $("#scheduleOfBonusAmount").val())/12);
  $("#totalAmount").val((isNaN(sum) ? '' : sum));
  if($("#totalAmount").val() === "0"){
    $("#totalAmount").val('');
  }
}