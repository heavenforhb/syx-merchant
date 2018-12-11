<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>{{title}}</title>
  <link rel="stylesheet" href="/stylesheets/style.css" />

</head>

<body>
  <div class="back_ground" id="modal">
    <div class="modal">
      <div class="modal_header">
        <div class="modal_title">
          <span>手机校验</span>
          <span class="modal_close">&times;</span>
        </div>
      </div>
      <div class="modal_conent">
        <div class="modal_descript">
          已经向您的手机发送了一条验证码，查收后填写
          <div class="modal_body">
            <span class="modal_body_first">验证码<span class="modal_body_two"><input id="smsCode" data-placeholder="请输入验证码"
                  maxlength="23" required="" /></span></span>
          </div>
          <div class="modal_btn">
            <button class="button primary" id="shortcut_pay">确认支付</button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
          <div class="pay-time">
            <span> 请在 <em>{{orderData.orderExpireTime}}</em> 之前完成支付</span>
          </div>
          <div class="pay-order-type">
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
            <div class="pay-type">
              <ul class="pay-type__tab" id="pay_type_tab"></ul>
            </div>
          </div>
          <div class="pay-main">
            <div class="pay-wrap clearfix" id="nocard_pay">
              <div id="nocard_form">
                <form target="_blank"></form>
              </div>
              <div class="pay-type__title">
                <h3>无卡支付</h3>
                <em> / 无卡支付</em>
              </div>
              <div class="notify"></div>
              <div class="pay-form" style="margin-top: 30px;">
                <div class="pay-form__item">
                  <label class="pay-form__item__label">银行卡</label>
                  <span class="pay-form__item__content">
                    <input class="input-box large" id="nocard_card_ipt" data-placeholder="输入个人银行卡号" maxlength="23" required /><i
                      class="loading-block"></i>
                  </span>
                </div>
                <div id="nocard_agess">
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">预留手机号</label>
                    <span class="pay-form__item__content">
                      <input class="input-box large no-input" id="nocard_phone" disabled data-placeholder="输入预留手机号" style="width: 160px" maxlength="11"
                      />
                    </span>
                  </div>
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">短信验证码</label>
                    <span class="pay-form__item__content">
                      <input class="input-box large" id="nocard_sms_code" data-placeholder="填写短信验证码" style="width: 120px" maxlength="8" required
                      />
                      <a id="btn_sms_code">获取验证码</a>
                    </span>
                  </div>
                </div>
                <div class="pay-form__item" style="margin-top: 40px">
                  <label class="pay-form__item__label"></label>
                  <span class="pay-form__item__content"><button class="button primary" id="nocard_next">下一步</button><i class="loading-block"></i></span>
                </div>
              </div>
            </div>
            <div class="pay-wrap clearfix" id="quick_pay">
              <div class="pay-type__title">
                <h3>银行卡快捷支付</h3>
                <em> / 无需开通网银</em>
              </div>
              <div class="notify"></div>
              <div class="pay-form" style="margin-top: 30px;">
                <div class="pay-form__item">
                  <label class="pay-form__item__label">银行卡</label>
                  <span class="pay-form__item__content"><input class="input-box large" id="card_ipt" data-placeholder="请输入个人银行卡号"
                      maxlength="23" required /><i class="loading-block"></i>
                    <div id="support_banks">
                      <a id="support_banks_toggler">可用银行与限额</a>
                      <div class="support-banks">
                        <i class="arrow"></i>
                        <div class="support-banks__title clearfix">
                          <span>可用银行与限额</span>
                          <a id="support_banks_closer"> </a>
                        </div>
                        <ul class="support-banks__list">
                          <li class="support-banks__list__head"><span class="span1">支持银行</span><span class="span2">卡种</span><span
                              class="span3">笔限额(元)</span><span class="span4">日限额(元)</span><span class="span5">月限额(元)</span></li>
                        </ul>
                      </div>
                    </div></span>
                </div>
                <div class="card-form" id="deposit_card_form">
                  <div class="pay-form__item" style="margin-top: 10px">
                    <label class="pay-form__item__label"></label>
                    <span class="pay-form__item__content">
                      <div class="card-info">
                        <div class="card-info__name">
                          <img class="card-info__name__icon" />
                          <span class="card-info__name__name"></span>
                        </div>
                        <div class="card-info__no">
                          <span class="card-info__no__no"></span> |
                          <span>储蓄卡</span>
                        </div>
                      </div></span>
                  </div>
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">姓名</label>
                    <span class="pay-form__item__content"><input class="input-box large" id="D_name" data-placeholder="请输入您的真实姓名"
                        required /></span>
                  </div>
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">身份证号</label>
                    <span class="pay-form__item__content"><input class="input-box large" id="D_IDCard" data-placeholder="请输入您的身份证号"
                        required /></span>
                  </div>
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">手机号</label>
                    <span class="pay-form__item__content"><input class="input-box large" id="D_phone" data-placeholder="请输入银行预留手机号"
                        required /></span>
                  </div>
                </div>
                <div class="card-form" id="credit_card_form">
                  <div class="pay-form__item" style="margin-top: 10px">
                    <label class="pay-form__item__label"></label>
                    <span class="pay-form__item__content">
                      <div class="card-info">
                        <div class="card-info__name">
                          <img class="card-info__name__icon" />
                          <span class="card-info__name__name"></span>
                        </div>
                        <div class="card-info__no">
                          <span class="card-info__no__no"></span> |
                          <span>信用卡</span>
                        </div>
                      </div></span>
                  </div>
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">姓名</label>
                    <span class="pay-form__item__content"><input class="input-box large" id="C_name" data-placeholder="请输入您的真实姓名"
                        required="" /></span>
                  </div>
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">身份证号</label>
                    <span class="pay-form__item__content"><input class="input-box large" id="C_IDCard" data-placeholder="请输入您的身份证号"
                        required="" /></span>
                  </div>
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">手机号</label>
                    <span class="pay-form__item__content"><input class="input-box large" id="C_phone" data-placeholder="请输入银行预留手机号"
                        required="" /></span>
                  </div>
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">CVN</label>
                    <span class="pay-form__item__content"><input class="input-box large" id="C_cvn" data-placeholder="请输入CVN"
                        required="" /></span>
                  </div>
                  <div class="pay-form__item" style="margin-top: 20px">
                    <label class="pay-form__item__label">信用卡有效期</label>
                    <span class="pay-form__item__content"><input class="input-box large" id="C_expDt" data-placeholder="请输入信用卡有效期"
                        required="" /></span>
                  </div>
                </div>
                <div class="pay-form__item" style="margin-top: 40px">
                  <label class="pay-form__item__label"></label>
                  <span class="pay-form__item__content"><button class="button primary" id="shortcut_next">下一步</button><i
                      class="loading-block"></i></span>
                </div>
              </div>
            </div>
            <div class="pay-wrap" id="ebank">
              <div class="pay-type__title">
                <h3>网银支付</h3>
                <em> / 请选择银行</em>
              </div>
              <div class="notify"></div>
              <!--.pay-type__arrow-->
              <!--  i-->
              <div class="ebank">
                <ul class="ebank__list" id="ebank_list"></ul>
              </div>
              <div id="charge_form">
                <form target="_blank"></form>
              </div>
              <div style="margin-top: 20px">
                <button class="button primary" id="ebank_next_btn">下一步</button><i class="loading-block"></i>
              </div>
            </div>
            <div class="pay-wrap" id="qr_code">
              <div class="notify"></div>
              <div class="qr-code">
                <div class="qr-code__wrap">
                  <p class="code" style="display:none"></p>
                  <p class="desc"></p>
                </div>
                <div class="qr-code__toggle">
                  <a id="wechat_btn"></a>
                  <a id="alipay_btn"></a>
                </div>
              </div>
            </div>
            <div class="pay-wrap" id="credit_installment">
              <div class="pay-type__title">
                <h3>网银支付</h3>
                <em> / 请选择银行</em>
              </div>
              <div class="notify"></div>
              <!--.pay-type__arrow-->
              <!--  i-->
              <div class="ebank">
                <ul class="ebank__list" id="ebank_list"></ul>
              </div>
              <div id="charge_form">
                <form target="_blank"></form>
              </div>
              <div style="margin-top: 20px">
                <button class="button primary" id="ebank_next_btn">下一步</button><i class="loading-block"></i>
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
    window.mercPermiInfo = '{{mercPermiInfo}}'
    var config = {
      showSupportBanks: false, // 可用银行与限额是否显示,
      payTypeConfig: {
        types: [
          { id: 'nocard_pay', title: '无卡支付', busType: 2007 },
          { id: 'quick_pay', title: '银行卡快捷支付', busType: 2002 },
          { id: 'ebank', title: '网银支付', busType: 2001 },
          { id: 'qr_code', title: '二维码支付', busType: [2003, 2004] },
          { id: 'credit_installment', title: '信用卡分期', busType: 2010 }
        ],
        activeIdx: 0
      },
      orderData: {
        orderNo: '{{orderData.orderNo}}',
        mercCd: '{{orderData.mercCd}}',
        orderAmt: '{{orderData.orderAmt}}',
        outOrderNo: '{{orderData.outOrderNo}}',
        attach: '{{orderData.attach}}',
        notifyUrl: '{{orderData.notifyUrl}}',
        callBackUrl: '{{orderData.callBackUrl}}'
      },
      tranType: '{{orderData.tranType}}'
    }
  </script>
  <script src="/javascripts/jquery.js"></script>
  <script src="/javascripts/jquery.qrcode.min.js"></script>
  <script src="/javascripts/lib.js"></script>
  <script src="/javascripts/index.js"></script>


  <div class="mask-layer"></div>
  <div class="popup-box">
    <a class="closer">&times;</a>
    <div class="title">
      请在新打开的页面完成支付
    </div>
    <div class="desc">
      如未看到新打开的页面，请检查弹出页面是否被浏览器是拦截
    </div>
    <div class="buttons">
      <button class="button primary" id="ebank_pay_done_btn">已完成支付</button>
      <button class="button" id="ebank_pay_fail_btn" style="margin-left: 30px">支付遇到问题</button>
    </div>
    <div class="footer">
      <div class="left">
        <span>跳转不到银行页面？</span>
        <a>解决办法</a>
      </div>
      <div class="right">
        <span>若支付不成功，您可以</span>
        <a class="other-way">选择其它支付方式</a>
      </div>
    </div>
  </div>
</body>

</html>