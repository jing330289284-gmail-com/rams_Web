const $ = require('jquery');
const axios = require('axios');

/**
 * 銀行の選択と項目の活性
 */
export function canSelect(){
	var val = $("#bankCode").val();
	if(val !== ''){
        $("#bankBranchName").attr("readonly",false);
        $("#bankBranchCode").attr("readonly",false);
        $("#accountNo").attr("readonly",false);
        $("#accountName").attr("readonly",false);
        $("#futsu").attr("disabled",false);
        $("#toza").attr("disabled",false);
        $("#futsu").attr("checked",true);
    }else{
        $("#bankBranchName").attr("readonly",true);
        $("#bankBranchCode").attr("readonly",true);
        $("#accountNo").attr("readonly",true);
        $("#accountName").attr("readonly",true);
        $("#futsu").attr("disabled",true);
        $("#toza").attr("disabled",true);
        $("#futsu").attr("checked",true);
    }
    $("#bankBranchName").val("");
    $("#bankBranchCode").val("");
    $("#accountNo").val("");
    $("#accountName").val("");
    $("#futsu").attr("checked",true);
}
/**
 * 非活性になる
 */
export function setDisabled(){
    $("#bankBranchName").attr("readonly",true);
    $("#bankBranchCode").attr("readonly",true);
    $("#accountNo").attr("readonly",true);
    $("#accountName").attr("readonly",true);
    $("#futsu").attr("disabled",true);
    $("#toza").attr("disabled",true);
    $('#futsu').attr("checked",true);
}
/**
 * フォーマットチェック
 */
export function torokuCheck(){
  if($("#bankCode").val() !== ''){
    if(   $("#bankBranchName").val() === null || $("#bankBranchName").val() === '' ||
          $("#bankBranchCode").val() === null || $("#bankBranchCode").val() === '' ||
          $("#accountNo").val() === null || $("#accountNo").val() === '' ||
          $("#accountName").val() === null || $("#accountName").val() === '' ){
            return false;
    }
  }
  return true;
}
/**
 * 活性になる
 */
export function takeDisabled(){
  $("#bankBranchName").attr("readonly",false);
  $("#bankBranchCode").attr("readonly",false);
  $("#accountNo").attr("readonly",false);
  $("#accountName").attr("readonly",false);
  $("#futsu").attr("disabled",false);
  $("#toza").attr("disabled",false);
}
/**
 * カタカナのチェック
 */
export function checkAccountName(){
  var katakana = /^[ァ-ロワヲンー]*$/;//片仮名の正規表現
  var accountName = document.getElementById("accountName");
  
  if(!katakana.test(accountName.value)){
    return false;
  }else{
    return true;
  }
}
/**
 * 全部の項目を非活性になる
 */
export function setAllDisabled(){
  $("#bankBranchName").attr("disabled",true);
  $("#bankBranchCode").attr("disabled",true);
  $("#accountNo").attr("disabled",true);
  $("#accountName").attr("disabled",true);
  $("#bankCode").attr("disabled",true);
  $("#futsu").attr("disabled",true);
  $("#toza").attr("disabled",true);
  $("#accountToroku").attr("disabled",true);
  $("#accountReset").attr("disabled",true);
}