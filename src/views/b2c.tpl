   <!DOCTYPE html>
<html>
  <head>
    <title>{{title}}</title>
    <link re="stylesheet" href="/stylesheets/style.css" />
    <script src="/javascripts/lib.js"></script>
    <style>
      body {
        background: #fff;
      }
      #my_form {
        display: none;
      }
    </style>
  </head>
  <body>
    <h1>页面跳转中...</h1>
    <form action="{{orderData.payUrl}}" method="{{orderData.payType}}" id="my_form"></form>
    <script>
      var payInfo = {{orderData.payInfo}},
        myForm = document.getElementById('my_form')

      for (var key in payInfo) {
        var ipt = document.createElement('input')
        ipt.setAttribute('name', key)
        ipt.setAttribute('type', 'hidden')
        ipt.value = payInfo[key]
        myForm.appendChild(ipt)
      }

      setTimeout(function () {
        myForm.submit()
      }, 1000)
    </script>
  </body>
</html>
