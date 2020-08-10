const $ = require('jquery');
const axios = require('axios');
var oldForm_data;
var oldForm_dataJson;
var newForm_data;
var newForm_dataJson;

/**
 * 画面初期化
 */
export function onload(){
  var onloadMol = {};
  onloadMol["employeeOrCustomerNo"] = $("#employeeOrCustomerNo").val();
  onloadMol["accountBelongsStatus"] = $("#accountBelongsStatus").val();
  onloadMol["actionType"] = $("#actionType").val();
  //画面データの検索
    axios.post("http://127.0.0.1:8080/bankInfo/getBankInfo",onloadMol)
    .then(function (resultMap) {
      var bankName = {};
      bankName = resultMap.data.bankName;
      for(let i = 0;i<bankName.length ; i++){
        $("#bankCode").append('<option value="'+bankName[i].code+'">'+bankName[i].name+'</option>');
      }
      if(resultMap.data.accountInfoMod !== ''){
        $("#bankBranchName").val(resultMap.data.accountInfoMod["bankBranchName"]);
        $("#bankBranchCode").val(resultMap.data.accountInfoMod["bankBranchCode"]);
        $("#accountNo").val(resultMap.data.accountInfoMod["accountNo"]);
        $("#accountName").val(resultMap.data.accountInfoMod["accountName"]);
        $("#bankCode").val(resultMap.data.accountInfoMod["bankCode"]);   
        if(resultMap.data.accountInfoMod["accountBelongsStatus"] !== null && resultMap.data.accountInfoMod["accountBelongsStatus"] !== ''){
          $("#accountBelongsStatus").val(resultMap.data.accountInfoMod["accountBelongsStatus"]);
        }
        if(resultMap.data.accountInfoMod["accountTypeStatus"] === '0'){
          $("#futsu").attr("checked",true);
        }else if(resultMap.data.accountInfoMod["accountTypeStatus"] === '1'){
          $("#toza").attr("checked",true);
        }
        //修正の場合
        if($("#actionType").val() === 'update'){
          $("#bankBranchName").attr("readonly",false);
          $("#bankBranchCode").attr("readonly",false);
          $("#accountNo").attr("readonly",false);
          $("#accountName").attr("readonly",false);
          $("#futsu").attr("disabled",false);
          $("#toza").attr("disabled",false);
          oldForm_data = $("#bankForm").serializeArray();
          oldForm_dataJson = JSON.stringify({ dataform: oldForm_data });
        }else if($("#actionType").val() === "addTo"){//追加の場合
          $("#bankBranchName").attr("readonly",true);
          $("#bankBranchCode").attr("readonly",true);
          $("#accountNo").attr("readonly",true);
          $("#accountName").attr("readonly",true);
          $("#bankCode").val('0'); 
          $("#futsu").attr("disabled",true);
          $("#toza").attr("disabled",true);
        }else if($("#actionType").val() === "shosai"){
          setAllDisabled();
        }
      }
    })
    .catch(function (error) {
      alert("銀行名错误，请检查程序");
    });  
}
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
    // document.getElementById("tips").className = "show";
    return false;
  }else{
    accountName.className = " form-control";
    // document.getElementById("tips").className = "hidden";
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
        if(resultMap.data !== ''){
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
  $("#toroku").attr("disabled",true);
  $("#reset").attr("disabled",true);
}