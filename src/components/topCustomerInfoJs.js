const $ = require('jquery');
/**
 * リセットボタン
 */
export function reset(){
    $("#topCustomerName").val("");
    $("#topUrl").val("");
    $("#topRemark").val("");
  }
/**
 * 項目の非活性
 */
export function setDisabled(){
    $("#topCustomerNo").attr("disabled",true);
    $("#topCustomerAbbreviation").attr("disabled",true);
    $("#topCustomerName").attr("disabled",true);
    $("#topUrl").attr("disabled",true);
    $("#topRemark").attr("disabled",true);
    $("#toroku").attr("disabled",true);
    $("#reset").attr("disabled",true);
}