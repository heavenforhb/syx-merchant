function initSupporBanks(banks, show) {
	if (!banks || !banks.length) return false
	var parent = $('.support-banks'),
		container = $('.support-banks__list'),
		toggler = $('#support_banks_toggler'),
		closer = $('#support_banks_closer')

	for (var i = 0, len = banks.length; i < len; i++) {
		var bank = banks[i], li = document.createElement('li'), ls0 = bank.ls[0], ls1 = bank.ls[1]
		bankIcon = '/images/bank-icons/' + bank.bc + '.png'
		li.className = 'support-banks__list__item'
		li.innerHTML = '<span class="span1"><img src="' + bankIcon + '" class="bank-icon" /> <em>' + bank.nm + '</em></span>' +
			'<span class="span2"><p class="line1"><span class="span1">' + ls0.t + '</span><span class="span2">' + ls0.p +
			'</span><span class="span3">' + ls0.d + '</span><span class="span4">' + ls0.m + '</span></p><p class="line2">' +
			'<span class="span1">' + ls1.t + '</span><span class="span2">' + ls1.p + '</span><span class="span3">' + ls1.d +
			'</span><span class="span4">' + ls1.m + '</span></p></span>'
		container.appendChild(li)
	}

	var toggleFn = function (e) {
		config.showSupportBanks = !config.showSupportBanks
		if (window.isIe) {
			e.cancelBubble = true
		} else {
			e.stopPropagation()
		}
		toggleSupportBanks()
	}
	toggleSupportBanks()
	toggler.on('click', toggleFn)
	closer.on('click', toggleFn)
	parent.on('click', function (e) {
		if (window.isIe) {
			e.cancelBubble = true
		} else {
			e.stopPropagation()
		}
	})
}

var bodyMaskFnQueue = null

function toggleSupportBanks() {
	var div = $('.support-banks')
	if (config.showSupportBanks) {
		document.body.addClass('mask')
		bodyMaskFnQueue = function () {
			config.showSupportBanks = false
			toggleSupportBanks()
		}
		div.addClass('show')
	} else {
		document.body.removeClass('mask')
		div.removeClass('show')
	}
}
$("#wechat_btn").hide()
$("#alipay_btn").hide()
if(~window.mercPermiInfo.indexOf(2003)){
	$("#wechat_btn").show()
}
if(~window.mercPermiInfo.indexOf(2004)){
	$("#alipay_btn").show()
}
if($('.qr-code__toggle').find("a").length>1){
	$("#wechat_btn").css("margin-right","100px")
}
var ajax_flag=true
function wechantClick() {
	erType = "wxpay";
	$("#wechat_btn").addClass("active")
	$("#wechat_btn").siblings().removeClass("active")
	
	$('.code').html("")
	$('.desc').html("")
	if(wxtime > 0 ){
		$('.code').qrcode(wxData);
		return
	}
	
	if(!ajax_flag) {
	    return
	}
	ajax_flag = false
 
	$.ajax({
		type: 'POST',
		url: '/erCode',
		data: {
			type:"wx",
			mercCd:window.orderData.mercCd,
			orderNo:window.orderData.orderNo,
			tranAmt:window.orderData.orderAmt,
		},
		success: function (res) {
			ajax_flag=true;
			res = JSON.parse(res)
			if(res.success && !res.data.errCode){
			$('.code').show();
	        getOrderStatus();
				var codeUrl = res.data.codeUrl;
				wxtime = 180;
				wxData = {
					render: "canvas", //也可以替换为table
					width: 200,
					height: 200,
					text:codeUrl
				}
				wxtime = 180
				wxtimeout()
				var qrcode = $('.code').qrcode({
					render: "canvas", //也可以替换为table
					width: 200,
					height: 200,
					text:codeUrl
				})
			}else{
				ajax_flag=true;
				$('.code').hide();
				$.notify(res.message || res.data.errCodeDesc)
			}
		},
		error: function (error) {
			ajax_flag=true;
		}
	})
}
$("#wechat_btn").on("click", wechantClick);
var alitime = 0;
var wxtime = 0;
var aliData,wxData;
var setTime = null
function alitimeout(){
	setTime = setTimeout(function(){
		if(alitime<=0){
			if(erType=="alipay"){
        ajax_flag = true;
				$('.desc').html("支付宝二维码已过期，请<a id='getEr_ali' style='color:red;cursor:pointer'>刷新</a>")
			}
		}else{
			alitime--;
			if(erType=="alipay"){
				$('.desc').html("过期时间：<a style='color:red;float:none'>"+alitime+"</a>秒")
			}
			alitimeout()
		}
	},1000)
}
function wxtimeout(){
	setTime = setTimeout(function(){
		if(wxtime<=0){
			if(erType!="alipay"){
        ajax_flag = true;
				$('.desc').html("微信二维码已过期，请<a id='getEr_wx' style='color:red;cursor:pointer'>刷新</a>")
			}
			
		}else{
			wxtime--;
			if(erType!="alipay"){
				$('.desc').html("过期时间：<a style='color:red;float:none'>"+wxtime+"</a>秒")
			}
			wxtimeout()
		}
	},1000)
}

$(document).on("click","#getEr_ali", alipayClick);
$(document).on("click","#getEr_wx", wechantClick);


function alipayClick() {
	
	$("#alipay_btn").addClass("active");
	$("#alipay_btn").siblings().removeClass("active");
	erType = "alipay";
	
	$('.code').html("");
	$('.desc').html("");
	if(alitime > 0 ){
		$('.code').qrcode(aliData);
		return
	}
	
    if(!ajax_flag) {
      return
    }
    ajax_flag=false
	
	$.ajax({
		type: 'POST',
		url: '/erCode',
		data: {
			type:"alipay",
			mercCd:window.orderData.mercCd,
			orderNo:window.orderData.orderNo,
			tranAmt:window.orderData.orderAmt,
		},
		success: function (res) {
			ajax_flag = true;
			res = JSON.parse(res)
			if(res.success && !res.data.errCode){
				$('.code').show();
		        getOrderStatus();
				var codeUrl = res.data.codeUrl;
				alitime = 180;
				aliData = {
					render: "canvas", //也可以替换为table
					width: 200,
					height: 200,
					text:codeUrl
				}
				alitime = 180
				alitimeout()
				var qrcode = $('.code').qrcode({
					render: "canvas", //也可以替换为table
					width: 200,
					height: 200,
					text:codeUrl
				})
				
			}else{
				ajax_flag=true;
				$('.code').hide();
				$.notify(res.message || res.data.errCodeDesc)
			}
		},
		error: function (error) {
			ajax_flag=true
			cbk && cbk({
				success: false,
				message: error.toString()
			})
		}
	})
}
$("#alipay_btn").on("click", alipayClick)

var searchOrderStart = false
var searchOver = false;
function getOrderStatus(){
	if(searchOrderStart){
		return
	}
	if(searchOver){
		
		return
	}
	setTimeout(function(){
    searchOver = true
    searchOrderStart = true
	},600000)
	setTimeout(function(){
		$.ajax({
			type: 'POST',
			url: '/order/qrpay/result',
			data: {
				mercCd:window.orderData.mercCd,
				orderNo:window.orderData.orderNo,
				outOrderNo:window.orderData.outOrderNo,
			},
			success: function (res) {
				res = JSON.parse(res)
				if(res.success && res.data.tradeState!="PENDING"){
					window.location.href="/status?mercCd="+window.orderData.mercCd+"&orderNo="+window.orderData.orderNo
				}else{
					getOrderStatus()
				}
			},
		})
	},5000)
	
}

function initPayTypes(payTypeConfig) {
	var types = payTypeConfig.types,
		activeIdx = payTypeConfig.activeIdx,
		payTypeTab = $('#pay_type_tab')

	payTypeTab.on('click', 'li', function () {
		var activeTab = $('.pay-type__tab .active'),
			activeWrap = $('.pay-wrap.active')
		target = this.attr('data-target')

		if (activeTab !== this) {
			if (activeTab) activeTab.removeClass('active')
			this.addClass('active')
			var targetWrap = $('#' + target)
			if (activeWrap) activeWrap.removeClass('active')
			if (targetWrap) targetWrap.addClass('active')
			// if (target == 'qr_code') {
			// 	$('#wechat_btn').trigger('click')
			// }
		}
	})
	for (var i = 0, len = types.length; i < len; i++) {
		var type = types[i];
		var result = false
		if(typeof type.busType == "number"){
			if(~window.mercPermiInfo.indexOf(type.busType)){
				result = true
			}
		}else{
			for (var j = 0; j < type.busType.length; j++) {
				if(~window.mercPermiInfo.indexOf(type.busType[j])){
					result = true
				}
			}
		}
		if(result){
			var li = document.createElement('li');
			li.className = 'pay-type__item'
			li.innerHTML = '<a>' + type.title + '</a>'
			li.attr('data-target', type.id)
			payTypeTab.append(li)
		}
		result = false
	}
	$('.pay-type__item:first').click()
}

function initEbankList(ebankConfig) {
	var activeIdx = ebankConfig.activeIdx,
		list = ebankConfig.list, wrap = $('#ebank_list'),
		nextBtn = $('#ebank_next_btn')
	wrap.innerHTML = ''

	wrap.on('click', 'li', function () {
		var activeBank = $('.ebank__list__item.active'),
			action = this.attr('data-action')

		if (action == 'showMore') {
			wrap.addClass('more')
			this.addClass('hide')
		} else {
			if (activeBank !== this) {
				if (activeBank) activeBank.removeClass('active')
				this.addClass('active')
			}
		}
	})
	for (var i = 0, len = list.length; i < len; i++) {
		var li = document.createElement('li'), bank = list[i],
			bankIcon = '/images/bank-icons/' + bank.bc + '.png'
		li.className = 'ebank__list__item'
		li.innerHTML = '<img src="' + bankIcon + '" /><span>' + bank.nm +
			'</span><span class="ebank__list__item__suppoort">' + (bank.debit ? '储蓄卡' + (bank.credit ? ' | ' : '') : '') + (bank.credit ? '信用卡' : '') + '</span>'
		li.attr('data-bank-code', bank.bc)
		li.attr('data-bank-support-debit', bank.debit ? '1' : '0')
		li.attr('data-bank-support-credit', bank.credit ? '1' : '0')
		if (!((i + 1) % 4)) {
			li.style.marginRight = '0px'
		}
		wrap.appendChild(li)
		if (i == activeIdx) {
			li.trigger('click')
		}
	}
	if (len > 11) {
		var btn = document.createElement('li')
		btn.className = 'ebank__list__show-more-btn'
		btn.innerHTML = '显示更多银行'
		btn.attr('data-action', 'showMore')
		wrap.appendChild(btn)
	}

	nextBtn.on('click', function () {
		var activeBank = $('.ebank__list__item.active'),
			loadingBlock = this.next(),
			bankCd = activeBank.attr('data-bank-code'),
			bankSupportDebit = 1 * activeBank.attr('data-bank-support-debit'),
			bankSupportCredit = 1 * activeBank.attr('data-bank-support-credit'),
			orderData = config.orderData
		if (loadingBlock.hasClass('show')) return false

		loadingBlock.addClass('show')
		submitPayment('ebank', {
			orderNo: orderData.orderNo,
			mercCd: orderData.mercCd,
			bankCd: bankCd,
			tranAmt: orderData.orderAmt,
			cardType:  'DEBIT'//写死借记卡
		}, function (data) {
			setTimeout(function () {
				loadingBlock.removeClass('show')
			}, 300)
			if (!data.success) {
				$.notify(data.message)
			} else {
				$.notify()
				data = data.data
				var chargeForm = $('#charge_form form'),
					payInfoObj = data.payInfo
				chargeForm.innerHTML = ''
				for (var i in payInfoObj) {
					var input = document.createElement('input')
					input.attr('name', i)
					input.attr('type', 'text')
					input.attr('value', payInfoObj[i])
					chargeForm.appendChild(input)
				}

				chargeForm.attr('method', data.payType)
				chargeForm.attr('action', data.payUrl)
				setTimeout(function () {
					chargeForm.submit()
					setTimeout(function () {
						ebankPayPop(true)
					}, 100)
				}, 10)
			}
		})
	})
	var ebankDoneBtn = $('#ebank_pay_done_btn'),
		ebankFailBtn = $('#ebank_pay_fail_btn'),
		popupCloser = $('.popup-box .closer'),
		popupOtherWay = $('.popup-box .other-way')
	ebankDoneBtn.on('click', function () {
		var orderData = config.orderData
		window.location.href = './status?orderNo=' + orderData.orderNo + '&mercCd=' + orderData.mercCd
	})
	ebankFailBtn.on('click', function () {
		ebankPayPop(false)
	})
	popupCloser.on('click', function () {
		ebankPayPop(false)
	})
	popupOtherWay.on('click', function () {
		ebankPayPop(false)
	})
}

function ebankPayPop(show) {
	var maskLayer = $('.mask-layer'),
		popupBox = $('.popup-box'),
		bodyContainer = $('.body')
	if (show) {
		maskLayer.addClass('show')
		popupBox.addClass('show')
		bodyContainer.addClass('blur')
	} else {
		maskLayer.removeClass('show')
		popupBox.removeClass('show')
		bodyContainer.removeClass('blur')
	}
}

function submitPayment(type, data, cbk) {
	$.ajax({
		type: 'POST',
		url: '/payment',
		data: {
			type: type,
			data: JSON.stringify(data)
		},
		success: function (res) {
			res = JSON.parse(res)
			if (cbk) {
				if(res.success){
					var data = res.data
					cbk(data.resultCode == 'SUCCESS' ? {
						success: true,
						data: data
					} : {
						success: false,
						message: data.errCodeDesc
					})
				}else{
					$.notify(res.message)
				}
				
			}
		},
		error: function (error) {
			cbk && cbk({
				success: false,
				message: error.toString()
			})
		}
	})
}
// init
window.onload = function () {
	var moreDetailBtn = $('#more_detail_btn'),
		detail = $('.pay-order__detail'),
		cardIpt = $('#card_ipt')

	moreDetailBtn.on('click', function () {
		if (detail.hasClass('more')) {
			detail.removeClass('more')
			this.removeClass('up')
		} else {
			this.addClass('up')
			detail.addClass('more')
		}
	})

	// placeholder
	var ipts = $('input[data-placeholder]')
	ipts.each(function (idx,item) {
		var placeholder = item.getAttribute('data-placeholder'),
			required = item.getAttribute('required')
		this.inited = false
		item.on('focus', function () {
			var val = this.val()
			this.style.color = '#333'
			if (!this.hasClass('active')) this.addClass('active')
			if (!val) {
				this.val("")
			}
			if (this.hasClass('error')) {
				this.removeClass('error')
			}
			this.inited = true
		})
		item.on('blur', function () {
			var val = this.val()
			if (this.hasClass('active')) this.removeClass('active')
			if (val == '') {
				if (this.inited && required !== null) {
					this.addClass('error')
				} else {
					this.style.color = '#999'
				}
				this.val(placeholder)
			} else {
				this.style.color = '#333'
			}
		})
		item.trigger('blur')
	})

	// qr-code
	// var alipayBtn = $('#alipay_btn'),
	// 	wechatBtn = $('#wechat_btn'),
	// 	codeBox = $('.qr-code__wrap .code'),
	// 	descBox = $('.qr-code__wrap .desc')
	// alipayBtn.on('click', function () {
	// 	codeBox.innerHTML = '<img src="https://qr.api.cli.im/qr?data=http%253A%252F%252Fwww.allscore.com&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=38d93882e99de62d8cfe587996c12947" />'
	// 	descBox.innerHTML = '<i class="alipay"></i><span>打开支付宝<br/>扫一扫直接付款</span>'
	// 	wechatBtn.removeClass('active'), this.addClass('active')
	// })
	// wechatBtn.on('click', function () {
	// 	codeBox.innerHTML = '<img src="https://qr.api.cli.im/qr?data=http%253A%252F%252Fwww.allscore.com&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=38d93882e99de62d8cfe587996c12947" />'
	// 	descBox.innerHTML = '<i class="wechat"></i><span>打开微信<br/>扫一扫直接付款</span>'
	// 	alipayBtn.removeClass('active'), this.addClass('active')
	// })

	// 初始化支付方式
	initPayTypes(config.payTypeConfig)

	getLimitData(config.tranType)

	document.body.on('click', function () {
		var mask = this.hasClass('mask')
		if (mask && bodyMaskFnQueue) {
			bodyMaskFnQueue()
			setTimeout(function () {
				bodyMaskFnQueue = null
			}, 0)
		}
	})

	cardIpt.on('blur', checkCard)

	function checkCard() {
		var that = cardIpt, loadingBlock = that.next(), val = that.val()
		activeForm = $('.card-form.show'),
			depositCardForm = $('#deposit_card_form'),
			creditCardForm = $('#credit_card_form')
		if (!val) {
			activeForm && activeForm.removeClass('show')
			return false
		}
		// that.addClass('loading'), that.attr('readonly', true),
		loadingBlock.addClass('show')
		getCardInfo(val.replace(/\s/g, ''), function (cardInfo) {
			window.cardInfo = cardInfo;
			// that.removeClass('loading'),  that.attr('readonly', null),
			setTimeout(function () {
				loadingBlock.removeClass('show')
			}, 300)
			activeForm && activeForm.removeClass('show')
			if (cardInfo) {
				var cardType = cardInfo.cardType,
					targetForm = cardType == 'DEBIT' ? depositCardForm : creditCardForm,
					spanCardName = targetForm.find('span.card-info__name__name'),
					spanCardNo = targetForm.find('span.card-info__no__no'),
					imgBankIco = targetForm.find('img.card-info__name__icon')
				// spanCardName.innerText = cardInfo.bankName
        // spanCardNo.innerText = cardInfo.cardNo
        spanCardName.html(cardInfo.bankName)
        spanCardNo.html(cardInfo.cardNo)
				imgBankIco.attr('src', './images/bank-icons/' + cardInfo.bankCd + '.png')
				targetForm.addClass('show')
			}
		})
	}

	var oldLen = 0
	cardIpt.on('input', function (e) {
		var value = this.val(), len = value.replace(/\s/g, '').length
		if (len == 16 || len == 19) {
			checkCard()
		}
		if (len <= oldLen) {
			oldLen = len
			// if (value.slice(-1) == ' ') {
			//   this.value = value.slice(0, -1)
			// }
			return false
		} else if (!(len % 4)) {
			this.val( value + ' ')
			oldLen = len
		}

	})
}

$('.modal_close').on('click', function () {
	$('#modal').hide()
})

$('#shortcut_pay').on('click', function () {
	if ($('#shortcut_pay').hasClass('disabled')) {
		return
	}
	$('#modal').hide()
	var data = {
		orderNo: window.shortcut_post_data.orderNo,
		mercCd: window.shortcut_post_data.mercCd,
		tranAmt: window.shortcut_post_data.tranAmt,
		smsCode: $('#smsCode').val()
	};
	$.ajax({
		type: 'POST',
		url: '/order/quickPay/orderPay',
		data: data,
		success: function (res) {
			res = JSON.parse(res)
			if (res.success) {
				if (res.data.resultCode == "SUCCESS") {
					
					$('#shortcut_pay').addClass('disabled')
					window.location.href = "/status?orderNo=" + config.orderData.orderNo + "&mercCd=" + config.orderData.mercCd;
				} else {
					$.notify(res.data.errCodeDesc)
				}
			} else {
				$.notify(res.message)
			}
		},
	})
})

$('#shortcut_next').on('click', function () {
	if ($('#shortcut_next').hasClass('disabled')) {
		return
	}
	// $('.pay-wrap.active .notify').style.marginBottom = "30px"
	$('.pay-wrap.active .notify').css("marginBottom","30px")
	var cardInfo = window.cardInfo
	if (!cardInfo) return false
	var data = {
		orderNo: config.orderData.orderNo,
		mercCd: config.orderData.mercCd,
		tranAmt: (+config.orderData.orderAmt).toFixed(2) + "",
		cardNo: cardInfo.cardNo,
		bankCd: cardInfo.bankCd,
		cardType: cardInfo.cardType,
		bankName: cardInfo.bankName,
		idType: "00"
	}
	if (cardInfo.cardType == "CREDIT") {
		var CName = $('#C_name').val(),
			CCard = $('#C_IDCard').val(),
			CPhone = $('#C_phone').val(),
			CCvn = $('#C_cvn').val(),
			ExpDt = $('#C_expDt').val()

		if (!CName || !CCard || !CPhone) return false

		data.acctName = CName
		data.idNo = CCard
		data.phoneNo = CPhone
		data.cvn = CCvn
		data.expDt = ExpDt
	} else {
		var DName = $('#D_name').val(),
			DCard = $('#D_IDCard').val(),
			DPhone = $('#D_phone').val()

		if (!DName || !DCard || !DPhone) return false

		data.acctName = DName
		data.idNo = DCard
		data.phoneNo = DPhone
	}
	$.ajax({
		type: 'POST',
		url: '/order/quickPay/apply',
		data: data,
		success: function (res) {
			res = JSON.parse(res)
			if (res.success) {
				if (res.data.resultCode == "SUCCESS") {
					$('#shortcut_next').addClass('disabled')
					$('#modal').show()
					window.shortcut_post_data = data
				} else {
					$.notify(res.data.errCodeDesc)
				}
			} else {
				$.notify(res.message)
			}
		},
		error: function (error) {

		}
	})
})

var noCardCardIpt = $('#nocard_card_ipt'), noCardOldLen = 0, countDownSeconds = 60

noCardCardIpt.on('blur', noCardCheck)

function mosaicPhone(phone) {
	return phone
	// return phone.substr(0, 4) + '****' + phone.substr(-3)
}

$('#btn_sms_code').on('click', function () {
	var that = this, noCardPhone = $('#nocard_phone').val(), orderData = config.orderData

	if (that.hasClass('disable')) return false

	if (!noCardPhone) return $.notify('银行预留手机号不能为空')
	that.innerHTML = '正在获取...'
	that.addClass('disable')
	getSmsCode({
		orderNo: orderData.orderNo,
		mercCd: orderData.mercCd,
		tranAmt: orderData.orderAmt,
		cardNo: noCardCardIpt.val().replace(/\s/g, ''),
		phoneNo: noCardPhone
	}, function (success) {
		if (success === true) {
			countDown()
		} else {
			that.innerHTML = '获取验证码'
			that.removeClass('disable')
			$.notify(success)
		}
	})
})

function countDown() {
	var btn = $('#btn_sms_code')
	if (countDownSeconds > 0) {
		countDownSeconds--
		btn.innerHTML = '重试 (' + countDownSeconds + '秒)'
		setTimeout(function () {
			countDown()
		}, 1000)
	} else {
		btn.removeClass('disable')
		btn.innerHTML = '获取验证码'
		countDownSeconds = 60
	}
}

function getSmsCode(reqData, cbk) {
	$.ajax({
		url: '/getSmsCode',
		data: reqData,
		success: function (data) {
			data = JSON.parse(data)

			if (data.success) {
				if (data.data.resultCode == "SUCCESS") {
					cbk && cbk(true)
				} else {
					cbk && cbk(data.data.errCodeDesc)
				}
			} else {
				cbk && cbk(data.message)
			}
		},
		error: function (err) {
			cbk && cbk(null)
		}
	})
}

;

function noCardCheck() {
	var loadingBlock = noCardCardIpt.next(), val = noCardCardIpt.val(),
		noCardAgess = $('#nocard_agess'), noCardPhone = $('#nocard_phone'),
		orderData = config.orderData
	noCardAgessSts = ''
	if (!val) return false
	loadingBlock.addClass('show')
	noCardQuery({
		mercCd: orderData.mercCd,
		subMercCd: orderData.subMercCd,
		cardNo: val.replace(/\s/g, '')
	}, function (cardInfo) {

		setTimeout(function () {
			loadingBlock.removeClass('show')
		}, 300)

		if (!cardInfo) {
			noCardAgess.hide()
			return false
		} else {
			if (cardInfo.agessSts) {
				noCardAgessSts = cardInfo.agessSts
			}
			noCardPhone.val(mosaicPhone(cardInfo.phoneNo))
		}
		if (cardInfo.agessSts == 'S1') {
			noCardAgess.show()
		} else {
			noCardAgess.hide()
		}
	})
}

noCardCardIpt.on('input', function (e) {

	var value = this.val(), len = value.replace(/\s/g, '').length
	if (len == 16 || len == 19) {
		noCardCheck()
	}
	if (len <= noCardOldLen) {
		return false
	} else if (!(len % 4)) {
		this.val(value + ' ')
		noCardOldLen = len
	}
})
var noCardAgessSts = ''
$('#nocard_next').on('click', function () {
	var orderData = config.orderData,
		loadingBlock = this.next(),
		cardNo = noCardCardIpt.val(),
		smsCode = $('#nocard_sms_code').val()

	if (loadingBlock.hasClass('show')) return false

	loadingBlock.addClass('show')

	if (!cardNo) return false
	if (noCardAgessSts == 'S1') {
		noCardConsume({
			orderNo: orderData.orderNo,
			mercCd: orderData.mercCd,
			tranAmt: orderData.orderAmt,
			smsCode: smsCode
		}, function (success, data) {
			setTimeout(function () {
				loadingBlock.removeClass('show')
			}, 300)
			if (success) {
				if (data.resultCode == 'SUCCESS') {
					window.location.href = './status?orderNo=' + orderData.orderNo + '&mercCd=' + orderData.mercCd
				}
			} else {
				$.notify(data)
			}
		})
	} else {
		noCardPay({
			orderNo: orderData.orderNo,
			mercCd: orderData.mercCd,
			tranAmt: orderData.orderAmt,
			cardNo: cardNo
		}, function (success, data) {
			setTimeout(function () {
				loadingBlock.removeClass('show')
			}, 300)
			if (success) {
				var chargeForm = $('#charge_form form'),
					payInfoObj = data.payInfo
				chargeForm.innerHTML = ''
				for (var i in payInfoObj) {
					var input = document.createElement('input')
					input.attr('name', i)
					input.attr('type', 'text')
					input.attr('value', payInfoObj[i])
					chargeForm.appendChild(input)
				}

				chargeForm.attr('method', data.payType)
				chargeForm.attr('action', data.payUrl)
				setTimeout(function () {
					chargeForm.submit()
					setTimeout(function () {
						ebankPayPop(true)
					}, 100)
				}, 10)
			} else {
				$.notify(data)
			}
		})
	}
})

function noCardPay(payData, cbk) {
	if (!payData || typeof payData != 'object') {
		return cbk(false, '数据错误')
	}
	$.ajax({
		url: '/noCardPay',
		type: 'POST',
		data: {
			orderNo: payData.orderNo,
			mercCd: payData.mercCd,
			tranAmt: payData.tranAmt,
			cardNo: payData.cardNo
		},
		success: function (data) {
			data = JSON.parse(data)
			if (data.success) {
				if (data.data.resultCode == 'SUCCESS') {
					cbk && cbk(true, data.data)
				} else {
					cbk && cbk(false, data.data.errCodeDesc)
				}
			} else {
				cbk && cbk(false, data.message)
			}
		},
		error: function (err) {
			cbk && cbk(false, err.toString())
		}
	})
}

function noCardConsume(payData, cbk) {
	if (!payData || typeof payData != 'object') {
		return cbk(false, '数据错误')
	}
	$.ajax({
		url: '/noCardConsume',
		type: 'POST',
		data: {
			orderNo: payData.orderNo,
			mercCd: payData.mercCd,
			tranAmt: payData.tranAmt,
			smsCode: payData.smsCode
		},
		success: function (data) {
			data = JSON.parse(data)
			if (data.success) {
				if (data.data.resultCode == 'SUCCESS') {
					cbk && cbk(true, data.data)
				} else {
					cbk && cbk(false, data.data.errCodeDesc)
				}
			} else {
				cbk && cbk(false, data.message)
			}
		},
		error: function (err) {
			cbk && cbk(false, err.toString())
		}
	})
}

function getCardInfo(cardNo, cbk) {
	$.ajax({
		url: '/cardInfo',
		data: {
			cardNo: cardNo
		},
		success: function (data) {
			data = JSON.parse(data)
			if (data.success) {
				if (data.data.cardBin.resultCode == 'SUCCESS') {
					cbk && cbk(data.data.cardBin)
				} else {
					cbk && cbk(null)
					$.notify(data.data.errCodeDesc)
				}
			} else {
				cbk && cbk(null)
			}
		},
		error: function (err) {
			
			
			cbk && cbk(null)
		}
	})
	//cbk(null)
}

function noCardQuery(queryData, cbk) {
	$.ajax({
		url: '/noCardQuery',
		data: {
			mercCd: queryData.mercCd,
			subMercCd: queryData.subMercCd,
			cardNo: queryData.cardNo
		},
		success: function (data) {
			data = JSON.parse(data)
			if (data.success) {
				if (data.data.resultCode == 'SUCCESS') {
					cbk && cbk(data.data)
				} else {
					cbk && cbk(null)
				}
			} else {
				cbk && cbk(null)
			}
		},
		error: function (err) {
			cbk && cbk(null)
		}
	})
	//cbk(null)
}

// 获取银行列表和限额信息
function getLimitData(tranType) {
	$.ajax({
		url: '/limitData/' + tranType,
		success: function (data) {
			data = JSON.parse(data)
			if (data.success) {
				initEbankList({
					list: data.data.ebankListArr,
					activeIdx: 0
				})
				initSupporBanks(data.data.bankLimitArr, false)
			} else {
				$.notify(data.message)
			}
		},
		error: function (err) {
			$.notify('获取银行列表出错')
		}
	})
}