const $ = require('jquery');
const axios = require('axios');
var oldForm_data;
var oldForm_dataJson;
var newForm_data;
var newForm_dataJson;

export async function onload(){
  if($("#shoriKbn").val() !== "shusei"){
    $("#toBankInfo").attr("disabled",true);
    $("#toCustomerInfo").attr("disabled",true);
  }
    var customerInfoMod = {};
    customerInfoMod["customerNo"] = $("#customerNo").val();
    customerInfoMod["shoriKbn"] = $("#shoriKbn").val();
    await axios.post("http://127.0.0.1:8080/customerInfo/onloadPage" , customerInfoMod)
    .then(function (resultMap) {
        var customerRanking = {};
        var companyNature = {};
        var customerInfoMod;
        var shoriKbn = $("#shoriKbn").val();
        customerRanking = resultMap.data.selectModel.customerRanking;
        companyNature = resultMap.data.selectModel.companyNature;
        customerInfoMod = resultMap.data.customerInfoMod;
        for(let i = 0;i<customerRanking.length ; i++){
            $("#customerRankingCode").append('<option value="'+customerRanking[i]["customerRankingCode"]+'">'+customerRanking[i]["customerRankingName"]+'</option>');
        }
        for(let i = 0;i<companyNature.length ; i++){
            $("#companyNatureCode").append('<option value="'+companyNature[i]["companyNatureCode"]+'">'+companyNature[i]["companyNatureName"]+'</option>');
        }
        if(shoriKbn == 'tsuika'){
            var customerNoSaiBan = resultMap.data.customerNoSaiBan;
            customerNoSaiBan =  parseInt(customerNoSaiBan.substring(1,4)) + 1;
            if(customerNoSaiBan < 10){
                customerNoSaiBan = 'C00' + customerNoSaiBan;
            }else if(customerNoSaiBan >= 10 && customerNoSaiBan < 100){
                customerNoSaiBan = 'C0' + customerNoSaiBan;
            }else if(customerNoSaiBan >=100){
                customerNoSaiBan = 'C' + customerNoSaiBan;
            }
            $("#customerNo").val(customerNoSaiBan);
            $("#customerNo").attr("readOnly",true);
        }else{
            $("#customerName").val(customerInfoMod.customerName);
            $("#topCustomerNameShita").val(customerInfoMod.topCustomerName);
            $("#customerAbbreviation").val(customerInfoMod.customerAbbreviation);
            $("#businessStartDate").val(customerInfoMod.businessStartDate);
            $("#headOffice").val(customerInfoMod.headOffice);
            $("#establishmentDate").val(customerInfoMod.establishmentDate);
            $("#customerRankingCode").val(customerInfoMod.customerRankingCode);
            $("#listedCompany").val(customerInfoMod.listedCompany);
            $("#companyNatureCode").val(customerInfoMod.companyNatureCode);
            $("#url").val(customerInfoMod.url);
            $("#remark").val(customerInfoMod.remark);
            oldForm_data = $("#customerForm").serializeArray();
            oldForm_dataJson = JSON.stringify({ dataform: oldForm_data });
            if(shoriKbn == 'sansho'){
              setDisabled();
          }
        }
    })
    .catch(function (error) {
      alert("select框内容获取错误，请检查程序");
    });  
}

export function toroku(){
    newForm_data = $("#customerForm").serializeArray();
    newForm_dataJson = JSON.stringify({ dataform: newForm_data });
    if(newForm_dataJson != oldForm_dataJson && $("#customerName").val() != "" && $("#customerName").val() != null){
        var customerInfoMod = {};
        var formArray =$("#customerForm").serializeArray();
        $.each(formArray,function(i,item){
            customerInfoMod[item.name] = item.value;     
        });
        customerInfoMod["topCustomerName"] = $("#topCustomerNameShita").val();
        customerInfoMod["updateUser"] = sessionStorage.getItem('employeeNo');
        axios.post("http://127.0.0.1:8080/customerInfo/toroku", customerInfoMod)
        .then(function (result) {
          if(result.data == 0){
            alert("登录完成");
            window.location.reload();
          }else if(result.data == 1){
            alert("登录错误，请检查程序");
          }else if(result.data == 2){
            alert("上位お客様名前がお客様情報テーブルに存じません，データをチェックしてください");
          }
        })
        .catch(function (error) {
          alert("登录错误，请检查程序");
        });
      }else{
          if(newForm_dataJson == oldForm_dataJson){
            alert("修正してありません!");
          }else if($("#customerName").val() === "" || $("#customerName").val() === null){
            document.getElementById("erorMsg").style = "visibility:visible";
          }
        
      }   
}

export function setDisabled(){
    $("#customerNo").attr("disabled",true);
    $("#customerName").attr("disabled",true);
    $("#headOffice").attr("disabled",true);
    $("#establishmentDate").attr("disabled",true);
    $("#customerRankingCode").attr("disabled",true);
    $("#listedCompany").attr("disabled",true);
    $("#companyNatureCode").attr("disabled",true);
    $("#url").attr("disabled",true);
    $("#remark").attr("disabled",true);
    $("#toroku").attr("disabled",true);
    $("#reset").attr("disabled",true);
    $("#toBankInfo").attr("disabled",true);
    $("#toCustomerInfo").attr("disabled",true);
}
//重置按钮事件
export function reset(){
  $("#customerName").val("");
  $("#headOffice").val("");
  $("#establishmentDate").val("");
  $("#customerRankingCode").val("0");
  $("#listedCompany").val("0");
  $("#companyNatureCode").val("0");
  $("#url").val("");
  $("#remark").val("");
  $("#toBankInfo").attr("disabled",true);
  $("#toCustomerInfo").attr("disabled",true);
}
export function toDisabed(){
  if($("#customerName").val() !== null && $("#customerName").val() !== ''){
    $("#toBankInfo").attr("disabled",false);
    $("#toCustomerInfo").attr("disabled",false);
  }else{
    $("#toBankInfo").attr("disabled",true);
    $("#toCustomerInfo").attr("disabled",true);
  }
}
