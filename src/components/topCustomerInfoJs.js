const $ = require('jquery');
const axios = require('axios');
var oldForm_data;
var oldForm_dataJson;
var newForm_data;
var newForm_dataJson;

export function onload(){
    var shoriKbn = $("#shoriKbn").val();
    var topCustomerMod = {};
    topCustomerMod["shoriKbn"] = $("#shoriKbn").val();
    topCustomerMod["topCustomerNo"] = $("#topCustomerNo").val();
    axios.post("http://127.0.0.1:8080/topCustomerInfo/onloadPage", topCustomerMod)
    .then(function (resultMap) {
        var topCustomerMod = resultMap.data.topCustomerMod;
        if(shoriKbn === 'tsuika'){
            var TopCustomerNoSaiBan = resultMap.data.TopCustomerNoSaiBan;
            TopCustomerNoSaiBan =  parseInt(TopCustomerNoSaiBan.substring(1,4)) + 1;
            if(TopCustomerNoSaiBan < 10){
                TopCustomerNoSaiBan = 'T00' + TopCustomerNoSaiBan;
            }else if(TopCustomerNoSaiBan >= 10 && TopCustomerNoSaiBan < 100){
                TopCustomerNoSaiBan = 'T0' + TopCustomerNoSaiBan;
            }else if(TopCustomerNoSaiBan >=100){
                TopCustomerNoSaiBan = 'T' + TopCustomerNoSaiBan;
            }
            $("#topCustomerNo").val(TopCustomerNoSaiBan);
            $("#topCustomerNo").attr("readOnly",true);
        }else{
            $("#topCustomerName").val(topCustomerMod.topCustomerName);
            $("#topUrl").val(topCustomerMod.url);
            $("#topRemark").val(topCustomerMod.remark);
            oldForm_data = $("#topCustomerInfoForm").serializeArray();
            oldForm_dataJson = JSON.stringify({ dataform: oldForm_data });
            if(shoriKbn === 'sansho'){
                setDisabled();
            }
        }
    })
    .catch(function(){
        alert("页面加载错误，请检查程序");
    })
}
export function toroku(){
    newForm_data = $("#topCustomerInfoForm").serializeArray();
    newForm_dataJson = JSON.stringify({ dataform: newForm_data });
    if(newForm_dataJson !== oldForm_dataJson && $("#topCustomerName").val() !== "" && $("#topCustomerName").val() != null){
        var topCustomerMod = {};
        topCustomerMod["topCustomerNo"] = $("#topCustomerNo").val();
        topCustomerMod["topCustomerName"] = $("#topCustomerName").val();
        topCustomerMod["url"] = $("#topUrl").val();
        topCustomerMod["remark"] = $("#topRemark").val();
        topCustomerMod["shoriKbn"] = $("#shoriKbn").val();
        topCustomerMod["updateUser"] = sessionStorage.getItem('employeeNo');
        axios.post("http://127.0.0.1:8080/topCustomerInfo/toroku", topCustomerMod)
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
            alert("修正してありません!");
          }else if($("#topCustomerName").val() === "" || $("#topCustomerName").val() === null){
            document.getElementById("topCustomerInfoErorMsg").style = "visibility:visible";
            document.getElementById("topCustomerInfoErorMsg").innerHTML = "★がついてる項目を入力してください！"
          }
        
      } 
}
//重置按钮事件
export function reset(){
    $("#topCustomerName").val("");
    $("#topUrl").val("");
    $("#topRemark").val("");
  }
export function setDisabled(){
    $("#topCustomerNo").attr("disabled",true);
    $("#topCustomerName").attr("disabled",true);
    $("#topUrl").attr("disabled",true);
    $("#topRemark").attr("disabled",true);
    $("#toroku").attr("disabled",true);
    $("#reset").attr("disabled",true);
}