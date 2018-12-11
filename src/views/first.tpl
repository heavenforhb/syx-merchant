<!DOCTYPE html>
<html>
 <head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>{{title}}</title>
 </head>
 <body>
 <script>


  var mercCd = ""
     var search = window.location.href.split("?")[1].split("&")

       search.map(function(item){
             var arr = item.split("=")
             if(arr[0] == "mercCd"){
               mercCd = arr[1]
             }
       })
         var url = "https://cashier.allscore.com/scan#/payPage"
         //var url = "http://tcloud.allscore.com/index"
         url = encodeURIComponent(url);
         window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx23d10587e03a7720&redirect_uri="+url+"&response_type=code&scope=snsapi_base&state="+mercCd+"#wechat_redirect"
 </script>
    <script>

    </script>

 </body>
</html>