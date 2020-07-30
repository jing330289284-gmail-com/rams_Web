const $ = require('jquery');
const axios = require('axios');

export function onload(){
    document.getElementById('shusei').className += " disabled";
    document.getElementById('sakujo').className += " disabled";
    var customerInfoMod = {};
    axios.post("http://127.0.0.1:8080/customerInfo/onloadPage" , customerInfoMod)
    .then(function (resultMap) {
        var customerRanking = {};
        var companyNature = {};
        customerRanking = resultMap.data.selectModel.customerRanking;
        companyNature = resultMap.data.selectModel.companyNature;
        for(let i = 0;i<customerRanking.length ; i++){
            $("#customerRankingCode").append('<option value="'+customerRanking[i]["customerRankingCode"]+'">'+customerRanking[i]["customerRankingName"]+'</option>');
        }
        for(let i = 0;i<companyNature.length ; i++){
            $("#companyNatureCode").append('<option value="'+companyNature[i]["companyNatureCode"]+'">'+companyNature[i]["companyNatureName"]+'</option>');
        }
    })
    .catch(function (error) {
      alert("select框内容获取错误，请检查程序");
    });  
}
export function search(){
    var customerInfoMod = {};
    var formArray =$("#conditionForm").serializeArray();
    $.each(formArray,function(i,item){
        customerInfoMod[item.name] = item.value;     
    });
    axios.post("http://127.0.0.1:8080/customerInfoSearch/search" , customerInfoMod)
    .then(function (resultList) {
        return resultList.data;
    })
    .catch(function (error) {
      alert("select框内容获取错误，请检查程序");
    });  
}
