const $ = require('jquery');
const axios = require('axios');

/**
 * 非活性になる
 */
export function setDisabled(){
    $("#customerNo").attr("disabled",true);
    $("#customerName").attr("disabled",true);
    $("#stationCode").attr("disabled",true);
    $("#establishmentDate").attr("disabled",true);
    $("#levelCode").attr("disabled",true);
    $("#listedCompany").attr("disabled",true);
    $("#companyNatureCode").attr("disabled",true);
    $("#url").attr("disabled",true);
    $("#remark").attr("disabled",true);
    $("#topCustomerNameShita").attr("disabled",true);
    $("#customerAbbreviation").attr("disabled",true);
    $("#businessStartDate").attr("disabled",true);
    $("#proposeClassificationCode").attr("disabled",true);
    $("#listedCompanyFlag").attr("disabled",true);
    $("#representative").attr("disabled",true);
    $("#paymentsiteCode").attr("disabled",true);
    $("#commonMail").attr("disabled",true);
    $("#toroku").attr("disabled",true);
    $("#reset").attr("disabled",true);
    $("#meisaiToroku").attr("disabled",true);
    $("#meisaiReset").attr("disabled",true);
    $("#purchasingManagersMail").attr("disabled",true);
    $("#remark").attr("disabled",true);
    $("#purchasingManagers").attr("disabled",true);
    $("#topCustomer").attr("disabled",true);
    $("#customerDepartmentName").attr("disabled",true);
    $("#positionCode").attr("disabled",true);
    $("#responsiblePerson").attr("disabled",true);
    $("#customerDepartmentMail").attr("disabled",true);
    $("#toBankInfo").attr("disabled",false);
    $("#toCustomerInfo").attr("disabled",true);
    $("#dateButton").attr("disabled",true);
    $("#capitalStock").attr("disabled",true);
    $("#basicContract").attr("disabled",true);
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
