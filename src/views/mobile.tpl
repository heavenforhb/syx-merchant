<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{title}}</title>
  <link rel="stylesheet" href="/stylesheets/mobile.css" />
</head>
<body>

<div id="root"></div>
<script>
   window.orderData = {
     attach: "{{orderData.attach}}",
     callBackUrl: "{{orderData.callBackUrl}}",
     goodsName: "{{orderData.goodsName}}",
     mercCd: "{{orderData.mercCd}}",
     mercName: "{{orderData.mercName}}",
     notifyUrl: "{{orderData.notifyUrl}}",
     orderAmt: "{{orderData.orderAmt}}",
     orderDt: "{{orderData.orderDt}}",
     orderExpTm: "{{orderData.orderExpTm}}",
     orderNo: "{{orderData.orderNo}}",
     orderTm: "{{orderData.orderTm}}",
     outOrderNo: "{{orderData.outOrderNo}}",
     resultCode: "{{orderData.resultCode}}",
     tranType: "{{orderData.tranType}}",
     orderTime: "{{orderData.orderTime}}",
     orderExpireTime: "{{orderData.orderExpireTime}}"
  };
  window.mercPermiInfo = [{{mercPermiInfo}}]
</script>

<script src="/javascripts/mobile.js"></script>