const $ = require('jquery');
const axios = require('axios');

/**
 *　非活性になる
 */
export function setDisabled(){
    $("#customerNo").attr("disabled",true);
    $("#customerName").attr("disabled",true);
    $("#headOffice").attr("disabled",true);
    $("#establishmentDate").attr("disabled",true);
    $("#levelCode").attr("disabled",true);
    $("#listedCompany").attr("disabled",true);
    $("#companyNatureCode").attr("disabled",true);
    $("#url").attr("disabled",true);
    $("#remark").attr("disabled",true);
    $("#toroku").attr("disabled",true);
    $("#reset").attr("disabled",true);
    $("#toBankInfo").attr("disabled",true);
    $("#toCustomerInfo").attr("disabled",true);
}
/**
 * リセットブタン
 */
export function reset(){
  $("#customerName").val("");
  $("#headOffice").val("");
  $("#establishmentDate").val("");
  $("#levelCode").val("0");
  $("#listedCompany").val("0");
  $("#companyNatureCode").val("0");
  $("#url").val("");
  $("#remark").val("");
  $("#toBankInfo").attr("disabled",true);
  $("#toCustomerInfo").attr("disabled",true);
}
/**
 * お客様名前を入力してないと、小さい画面を開けない
 */
export function toDisabed(){
  if($("#customerName").val() !== null && $("#customerName").val() !== ''){
    $("#toBankInfo").attr("disabled",false);
    $("#toCustomerInfo").attr("disabled",false);
  }else{
    $("#toBankInfo").attr("disabled",true);
    $("#toCustomerInfo").attr("disabled",true);
  }
}
