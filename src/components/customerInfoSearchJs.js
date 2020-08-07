const $ = require('jquery');
const axios = require('axios');
/**
 * 画面の初期化
 */
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
        for(let i = 0;i<customerRanking.length ; i++){//お客様ランキング
            $("#customerRankingCode").append('<option value="'+customerRanking[i]["customerRankingCode"]+'">'+customerRanking[i]["customerRankingName"]+'</option>');
        }
        for(let i = 0;i<companyNature.length ; i++){//お客様性質
            $("#companyNatureCode").append('<option value="'+companyNature[i]["companyNatureCode"]+'">'+companyNature[i]["companyNatureName"]+'</option>');
        }
    })
    .catch(function (error) {
      alert("select框内容获取错误，请检查程序");
    });  
}