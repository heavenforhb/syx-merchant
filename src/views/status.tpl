<!DOCTYPE html>
<html>
 <head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>支付结果 - 商银信支付</title>
  <link rel="stylesheet" href="/stylesheets/style.css" />
  <script src="/javascripts/jquery.js"></script>
  <script src="/javascripts/lib.js"></script>
 </head>
 <body>
  <div class="body">
   <div class="header">
    <div class="container">
     <a class="header__logo"><img src="/images/cashier-logo.png" /><h1>商银信支付</h1></a>
     <div class="header__contact">
      <em>7x24小时客服电话：4001-500-800</em>
     </div>
    </div>
   </div>
   <div class="main">
    <div class="container">
     <div class="main__box">
      <div class="pay-order-type" style="border-top: 3px solid #38b8f2;">
       <div class="pay-order clearfix">
        <div class="pay-order__amount fl">
         <span>订单总额：</span>
         <em>{{orderData.orderAmt}}</em>
        </div>
        <div class="pay-order__detail fr">
         <p><span>购买商品：{{orderData.goodsName}}</span><span>订单号：{{orderData.orderNo}}</span></p>
         <p><span>收款商家：{{orderData.mercName}}</span><span>交易时间：{{orderData.orderTime}}</span></p>
         <a id="more_detail_btn">详情<i class="ico"></i></a>
        </div>
       </div>
      </div>
      <div class="pay-main" style="min-height:220px">
       <div class="pay-status">
        <div class="icon">
         <i></i>
        </div>
        <div class="desc">
         <p class="message">支付中</p>
         <button class="button primary">再次查询支付结果</button>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
   <div class="footer">
    <div class="container">
     <div class="copy">
      本支付由商银信支付提供，商银信支付版权所有 &copy; 2003-2017 京ICP备10046794号
     </div>
    </div>
   </div>
  </div>
  <script>
    var orderNo = '{{orderData.orderNo}}', mercCd = '{{orderData.mercCd}}', 
      outOrderNo = '{{orderData.outOrderNo}}', callBackUrl = '{{orderData.callBackUrl}}';

  </script>

  <script src="/javascripts/status.js"></script>
 </body>
</html>