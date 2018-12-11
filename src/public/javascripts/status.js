// init
window.onload = function () {
	var reCheckBtn = $('.pay-status .button'),
		moreDetailBtn = $('#more_detail_btn'),
		detail = $('.pay-order__detail')

	moreDetailBtn.on('click', function () {
		if (detail.hasClass('more')) {
			detail.removeClass('more')
			this.removeClass('up')
		} else {
			this.addClass('up')
			detail.addClass('more')
		}
	})

	reCheckBtn.on('click', function () {
		window.location.reload()
	})
	checkStatus()
}

function checkStatus() {
	var messageLabel = $('.pay-status .message'),
		primaryBtn = $('.pay-status .button'),
		icon = $('.pay-status .icon')
	$.ajax({
		url: '/checkStatus',
		data: {
			mercCd: mercCd,
			outOrderNo: outOrderNo,
			orderNo: orderNo
		},
		success: function (data) {
			data = JSON.parse(data)
			var status = data.data, message = '订单状态异常', recheck = true
			if (data.success) {
				var tradeState = status.tradeState
				if (tradeState == 'WAITPAY') {
					message = '等待支付'
				}
				if (tradeState == 'PENDING') {
					message = '用户支付中'
				}
				if (tradeState == 'USERPAYING') {
					message = '支付后台处理中, 请耐心等待'
				}
				if (tradeState == 'REFUND') {
					message = '该笔订单已退款'
					primaryBtn.hide()
					recheck = false
				}
				if (tradeState == 'SUCCESS') {
					recheck = false
					message = '支付成功, 页面跳转中...'
					setTimeout(function () {
						window.location.href = callBackUrl
					}, 1500)
				}
				if (tradeState == 'CLOSED') {
					recheck = false
					icon.addClass('error')
					message = '订单已关闭'
					primaryBtn.hide()
				}

				if (tradeState == 'PAYERROR') {
					recheck = false
					icon.addClass('error')
					message = '支付失败'
					primaryBtn.hide()
				}
				if (tradeState == 'FAIL') {
					recheck = false
					icon.addClass('error')
					message = '下单失败'
					primaryBtn.hide()
				}
			}
			if (recheck) {
				setTimeout(checkStatus, 1000)
			}
			messageLabel.innerText = message
		}
	})
}