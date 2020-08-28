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
    accountName.className += " border-danger";
    return false;
  }else{
    accountName.className = " form-control";
    return true;
  }
}
/**
 * 支店名と支店番号の検索
 * param 項目のid
 */
export function getBankBranchInfo(noORname){
  var sendMap = {};
  sendMap[noORname] = $('#'+noORname+'').val();
  sendMap["bankCode"] = $('#bankCode').val();
  if($('#'+noORname+'').val() !== ""){
    
    axios.post("http://127.0.0.1:8080/getBankBranchInfo",sendMap)
      .then(function (resultMap) {
        if(resultMap.data.length !== 0){
            $('#bankBranchCode').val(resultMap.data[0].code);
            $('#bankBranchName').val(resultMap.data[0].name);
        }else{
          $('#bankBranchCode').val("");
          $('#bankBranchName').val("");
        }
        
      })
      .catch(function (error) {
        alert("支店信息获取错误，请检查程序");
      });
  }else{
    $('#bankBranchCode').val("");
    $('#bankBranchName').val("");
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