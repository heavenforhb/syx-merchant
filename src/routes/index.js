
const router = require('koa-router')()
import fetch from 'node-fetch'
import MicroService from '../utils/MicroService'
import provider from '../provider'

import orderUtil from '../utils/order'
import moment from 'moment'
import { getClientIp } from '../utils/utils'

import Handlebars from 'handlebars'

const fs = require('fs')
const path = require('path')
let preRoute
function sortFields(obj) {
  const keys = Object.keys(obj), tmpArr = {}
  keys.sort((a, b) => a.charCodeAt(0) < b.charCodeAt(0) ? -1 : 1)
  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    tmpArr[key] = obj[key]
  }
  return tmpArr
}

Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context)
})
function v(req) {
  var deviceAgent = req.headers["user-agent"].toLowerCase();
  var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
  if (agentID) {
    return false //false为移动端
  } else {
    return true//true 为PC端
  }
	// return false
}
function render(tpl, ctx) {
  let tplPath = path.resolve(__dirname + '/../views/' + tpl + '.tpl')
  return new Promise((resolve, reject) => {
    fs.readFile(tplPath, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        const template = Handlebars.compile(data, { noEscape: true })
        resolve(template(ctx))
      }
    })
  })
}

function success(data) {
  return {
    success: true, data
  }
}

function fail(message) {
  return {
    success: false, message: message ? message.toString() : '未知错误'
  }
}
router.get("/first",async (ctx,next)=>{
	ctx.body = await render('first', {
		title: '支付收款码',
	})
})
router.get("/scan",async (ctx,next)=>{
	ctx.body = await render('mobile', {
		title: '支付收款码',
	})
})
// 收银台页面
router.post('/order', async (ctx, next) => {
	let clientIp = getClientIp(ctx.req)
	
	const formData = ctx.request.body || {}
	let {tranType,mercCd} = formData;
	
	if(formData.orderNo){
		return ctx.body = success(orderAll[formData.orderNo])
	}
	formData.spbillIp = formData.spbillIp || clientIp

	const checkData = orderUtil.validateForm(formData)

	try {

		if (!checkData.success) {
			throw new Error(checkData.message)
		}

		const sortData = sortFields(checkData.data)

		const signature = await MicroService.request(provider.sign, {
			privateKey: formData.privateKey,
			signType: 'RSA2',
			signFileds: JSON.stringify(sortData),
			inputCharset: 'UTF-8'
		})
		
		checkData.data['signature'] = signature.sign

		const orderData = await MicroService.request(provider.submitOrder, checkData.data)

		if (orderData.resultCode == 'FAIL') {
			throw new Error(orderData.errCodeDesc)
		}
		
		let mercInfo = await MicroService.request(provider.mercInfoDetail, {mercCd})
		let {mercPermiInfo = []} = mercInfo;
		let arr = [];
		
		mercPermiInfo.map(item=>{
			if(item.tranType == tranType && item.busSts == "Y"){
				arr.push(item.busType)
			}
		})
		
		const {orderDt, orderTm, orderExpTm} = orderData

		orderData.orderTime = moment(orderDt + orderTm, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
		orderData.orderExpireTime = moment(orderExpTm, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
		if(v(ctx.req)){
			ctx.body = await render('index', {
				title: '收银台 - 商银信支付',
				orderData,
				mercPermiInfo:arr
			})
		}else{
			ctx.body = await render('mobile', {
				title: '收银台 - 商银信支付',
				orderData,
				mercPermiInfo:arr
			})
		}
	} catch (error) {
		ctx.body = await render('error', {
			title: `提示 - 商银信支付`,
			message: error.toString()
		})

	}
})
async function limitData(ctx) {
  const { tranType } = ctx.params
  
  try {
    let bankLimitData = [], ebankListData = [], bankLimitArr = [], ebankListArr = []
    await Promise.all([
      MicroService.request(provider.cardLimit, { tranType: tranType, busType: '2002', chnBizType: 'B2B' }),
      MicroService.request(provider.cardLimit, { tranType: tranType, busType: '2001', chnBizType: 'B2C' })
    ]).then(results => {
      bankLimitData = results[0]
      ebankListData = results[1]
    }).catch(err => {
      throw new Error(err)
    })


    if (bankLimitData && bankLimitData.length) {
      bankLimitArr = bankLimitData.map(bank => {
        const { DEBIT, CREDIT } = bank
        return {
          nm: bank.bankName,
          bc: bank.bankCd,
          ls: [
            {
              t: '信用卡',
              p: CREDIT ? CREDIT.scspAmt : '',
              d: CREDIT ? CREDIT.scsdAmt : '',
              m: CREDIT ? CREDIT.scsmAmt : ''
            },
            {
              t: '储蓄卡',
              p: DEBIT ? DEBIT.scspAmt : '',
              d: DEBIT ? DEBIT.scsdAmt : '',
              m: DEBIT ? DEBIT.scsmAmt : ''
            }
          ]
        }
      })
    } else {
      throw new Error('未查询到限额信息')
    }

    if (ebankListData && ebankListData.length) {
      ebankListArr = ebankListData.map(bank => {
        const { DEBIT, CREDIT } = bank
        return {
          nm: bank.bankName,
          bc: bank.bankCd,
          debit: DEBIT ? true : false,
          credit: CREDIT ? true : false
        }
      })
    } else {
      throw new Error('未查询到限额信息')
    }

    ctx.body = success({ bankLimitArr, ebankListArr })
  } catch (e) {
    ctx.body = fail(e)
  }
}
router.get('/limitData/:tranType', limitData)
router.get('/cashier/limitData/:tranType', limitData)
router.post('/cashier/getMercName', getMercName)
async function getMercName(ctx, next) {
	const { mercCd } = ctx.request.body;
	try {
		const res = await MicroService.request(provider.mercInfoDetail, { mercCd })
		let mercName = res.mercInfo.mercName
		ctx.body = success({mercName})
	} catch (error) {
		ctx.body = fail(error)
	}
}
router.post("/cashier/getOpenId",async (ctx)=>{
	let body = ctx.request.body;
	try {
		let {code} = body
		let appid = "wx23d10587e03a7720"
		let secret = "2f9e860547472f972d7a64ae1d14e1b3"
		return fetch(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`,{method:"GET"}).then((response)=>response.json()).then(data=>{
			console.log(data)
			ctx.body = success(data)
		})
	}catch (error) {
		ctx.body = fail(error)
	}
})
router.post("/cashier/H5Order",async (ctx)=>{
	try {
		let body = ctx.request.body;
		console.log(body)
		let result = await MicroService.request(provider.H5OrderPay, body)
		console.log(result)
		ctx.body = success(result)
	} catch (e) {
		ctx.body = error(e)
	}
})
// 银行卡信息
router.get('/cardInfo', cardInfo)
router.get('/cashier/cardInfo', cardInfo)
async function cardInfo(ctx, next) {
  const { cardNo } = ctx.request.query
  try {
    if (!cardNo) {
      throw new Error('卡号不能为空')
    }
    const cardInfo = await MicroService.request(provider.checkCard, { cardNo })
    ctx.body = success(cardInfo)
  } catch (error) {
    ctx.body = fail(error)
  }
}

router.post('/noCardPay', async (ctx, next) => {
  const { orderNo, mercCd, tranAmt, cardNo } = ctx.request.body
  try {
    if (!orderNo || !mercCd || !tranAmt || !cardNo) {
      throw new Error('参数错误')
    }
    const payData = await MicroService.request(provider.noCardPay, { orderNo, mercCd, tranAmt, cardNo })
    ctx.body = success(payData)
  } catch (error) {
    ctx.body = fail(error)
  }
})

router.post('/order/qrpay/result', async (ctx, next) => {
	const { orderNo, mercCd, outOrderNo } = ctx.request.body
	try {
		const res = await MicroService.request("PROVIDER-ORDER:/order/qrpay/result", { orderNo, mercCd, outOrderNo })
		console.log(res)
		ctx.body = success(res)
	} catch (error) {
		ctx.body = fail(error)
	}
})

router.post('/noCardConsume', async (ctx, next) => {
  const { orderNo, mercCd, tranAmt, smsCode } = ctx.request.body
  try {
    if (!orderNo || !mercCd || !tranAmt || !smsCode) {
      throw new Error('参数错误')
    }
    const payData = await MicroService.request(provider.noCardConsume, { orderNo, mercCd, tranAmt, smsCode })
    ctx.body = success(payData)
  } catch (error) {
    ctx.body = fail(error)
  }
})

// 无卡支付 - 银行卡信息
router.get('/noCardQuery', async (ctx, next) => {
  const { mercCd, cardNo } = ctx.request.query
  try {
    if (!cardNo || !mercCd) {
      throw new Error('卡号或商户号不能为空')
    }
    const cardInfo = await MicroService.request(provider.noCardQuery, { cardNo, mercCd })
    ctx.body = success(cardInfo)
  } catch (error) {
    ctx.body = fail(error)
  }
})

// 无卡支付 - 获取验证码
// 无卡支付 - 银行卡信息
router.get('/getSmsCode', async (ctx, next) => {
  const { orderNo, mercCd, tranAmt, cardNo, phoneNo } = ctx.request.query
  try {
    if (!orderNo || !mercCd || !tranAmt || !cardNo || !phoneNo) {
      throw new Error('参数错误')
    }
    const res = await MicroService.request(provider.formOrder, { orderNo, mercCd, tranAmt, cardNo, phoneNo })
    ctx.body = success(res)
  } catch (error) {
    ctx.body = fail(error)
  }
})
router.post('/order/credit/instalOrder', async (ctx, next) => {
	let clientIp = getClientIp(ctx.req)
  const formData = ctx.request.body || {}
	formData.spbillIp = formData.spbillIp || clientIp
		try {
			const formData = ctx.request.body || {}
			const signature = await MicroService.request(provider.sign, {
				privateKey: formData.privateKey,
				signType: 'RSA2',
				signFileds: JSON.stringify(formData),
				inputCharset: 'UTF-8'
			})
			
			let orderData = await MicroService.request("PROVIDER-ORDER:/order/ebank/instalOrder", formData)
			
			if (orderData.resultCode && orderData.resultCode == 'FAIL') {
				throw new Error(orderData.errCodeDesc)
			}
			
			let formInnerHtml = ''
			const payInfo = orderData.payInfo
			for (let key in payInfo) {
				let val = payInfo[key]
				formInnerHtml += `<input name="${key}" type="hidden" value="${val}" />`
			}
			ctx.body = `<!DOCTYPE html><html><head><title>页面跳转中-商银信支付</title><link re="stylesheet"href="/stylesheets/style.css"/><script src="/javascripts/lib.js"></script><style>body{background:#fff}#my_form{display:none}</style></head><body><h1>页面跳转中...</h1><form action="${orderData.payUrl}"method="${orderData.payType}"id="my_form">${formInnerHtml}</form><script>var myForm=document.getElementById('my_form');setTimeout(function(){myForm.submit()},1000)</script></body></html>`
			
		} catch (error) {
			
			ctx.body = await render('error', {
				title: '提示 - 商银信支付',
				message: error.toString()
			})
			
		}
})
router.post('/b2cOrder', async (ctx, next) => {
	let clientIp = getClientIp(ctx.req)
	const formData = ctx.request.body || {}
	formData.spbillIp = formData.spbillIp || clientIp

	const checkData = orderUtil.validateB2CForm(formData)
		
	if (checkData.success) {
		try {
			const formData = ctx.request.body || {}

			const sortData = sortFields(checkData.data)

			const signature = await MicroService.request(provider.sign, {
				privateKey: formData.privateKey,
				signType: 'RSA2',
				signFileds: JSON.stringify(sortData),
				inputCharset: 'UTF-8'
			})

			checkData.data['signature'] = signature.sign
			let orderData
			if(formData.orderCnl && formData.orderCnl=="WAP"){
				orderData = await MicroService.request("PROVIDER-ORDER:/order/ebank/b2cInstalOrder", formData)
			}else if(formData["isInstal"]=="Y"){
				orderData = await MicroService.request("PROVIDER-ORDER:/order/ebank/b2cInstalOrder", formData)
			}else{
				orderData = await MicroService.request(provider.submitB2COrder, checkData.data)
			}
			
			if (orderData.resultCode && orderData.resultCode == 'FAIL') {
				throw new Error(orderData.errCodeDesc)
			}

			let formInnerHtml = ''
			const payInfo = orderData.payInfo
			for (let key in payInfo) {
				let val = payInfo[key]
				formInnerHtml += `<input name="${key}" type="hidden" value="${val}" />`
			}
			ctx.body = `<!DOCTYPE html><html><head><title>页面跳转中-商银信支付</title><link re="stylesheet"href="/stylesheets/style.css"/><script src="/javascripts/lib.js"></script><style>body{background:#fff}#my_form{display:none}</style></head><body><h1>页面跳转中...</h1><form action="${orderData.payUrl}"method="${orderData.payType}"id="my_form">${formInnerHtml}</form><script>var myForm=document.getElementById('my_form');setTimeout(function(){myForm.submit()},1000)</script></body></html>`

		} catch (error) {

			ctx.body = await render('error', {
				title: '提示 - 商银信支付',
				message: error.toString()
			})

		}

	} else {

		ctx.body = await render('error', {
			title: '提示 - 商银信支付',
			message: checkData.message
		})
	}
})
// b2b下单
router.post('/b2bOrder', async (ctx, next) => {
	let clientIp = getClientIp(ctx.req)
	
	const formData = ctx.request.body || {}
	formData.spbillIp = formData.spbillIp || clientIp
	console.log(formData)
	const checkData = orderUtil.validateB2CForm(formData)
	
	if (checkData.success) {
		try {
			const formData = ctx.request.body || {}
			
			const sortData = sortFields(checkData.data)
			
			const signature = await MicroService.request(provider.sign, {
				privateKey: formData.privateKey,
				signType: 'RSA2',
				signFileds: JSON.stringify(sortData),
				inputCharset: 'UTF-8'
			})
			checkData.data['signature'] = signature.sign
			
			const orderData = await MicroService.request(provider.submitB2BOrder, checkData.data)

			
			if (orderData.resultCode && orderData.resultCode == 'FAIL') {
				throw new Error(orderData.errCodeDesc)
			}
			
			let formInnerHtml = ''
			const payInfo = orderData.payInfo
			for (let key in payInfo) {
				let val = payInfo[key]
				formInnerHtml += `<input name="${key}" type="hidden" value="${val}" />`
			}
			ctx.body = `<!DOCTYPE html><html><head><title>页面跳转中-商银信支付</title><link re="stylesheet"href="/stylesheets/style.css"/><script src="/javascripts/lib.js"></script><style>body{background:#fff}#my_form{display:none}</style></head><body><h1>页面跳转中...</h1><form action="${orderData.payUrl}"method="${orderData.payType}"id="my_form">${formInnerHtml}</form><script>var myForm=document.getElementById('my_form');setTimeout(function(){myForm.submit()},1000)</script></body></html>`
			
		} catch (error) {
			
			ctx.body = await render('error', {
				title: '提示 - 商银信支付',
				message: error.toString()
			})
			
		}
		
	} else {
		
		ctx.body = await render('error', {
			title: '提示 - 商银信支付',
			message: checkData.message
		})
	}
	
})
// 订单状态页面
router.get('/status', async (ctx, next) => {
  const { orderNo, mercCd } = ctx.request.query
  try {
    const orderData = await MicroService.request(provider.orderInfo, { orderNo, mercCd })
    const { orderTime } = orderData
    orderData.orderTime = moment(orderTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
    ctx.body = await render('status', {
      title: '支付结果 - 商银信支付',
      orderData
    })
  } catch (error) {
    ctx.body = await render('error', {
      title: '提示 - 商银信支付',
      message: error.toString()
    })
  }
})
// 订单状态页面
router.all('/getStatus', async (ctx, next) => {
	// const { orderNo, mercCd } = ctx.request.method=="GET"?ctx.request.query:ctx.request.body;
	const { orderNo, mercCd } = ctx.request.query;
	let {body} = ctx.request
	console.log(body)
	// if(body.resultCode == "SUCCESS"){
		try {
			const orderData = await MicroService.request("PROVIDER-ORDER:/order/tran/findByPayOrder", { payOrder:orderNo, mercCd });
			if(orderData && orderData.callBackUrl){
				ctx.body = `<!DOCTYPE html><html><head><title>页面跳转中-商银信支付</title><link re="stylesheet"href="/stylesheets/style.css"/><script src="/javascripts/lib.js"></script><style>body{background:#fff}#my_form{display:none}</style></head><body><h1>页面跳转中...</h1><script>
setTimeout(function(){window.location.href="${orderData.callBackUrl}"},1000)</script></body></html>`
			}else{
				ctx.body = await render('error', {
					title: '提示 - 商银信支付',
					message: "未配置返回地址"
				})
			}
			
		} catch (error) {
			ctx.body = await render('error', {
				title: '提示 - 商银信支付',
				message: error.toString()
			})
		}
	// }else{
	// 	ctx.body = await render('error', {
	// 		title: '提示 - 商银信支付',
	// 		message: ""
	// 	})
	// }
	
});
// 订单结果查询
router.get('/paymentPage', async (ctx, next) => {
	const { orderNo } = ctx.request.query
	try {
		const res = await MicroService.request(provider.orderInfo, { orderNo })
		console.log(res)
		ctx.body = res;
	} catch (error) {
		ctx.body = await render('error', {
			title: '提示 - 商银message: error.toString()\n' +
			'\t\t})信支付',
		})
	}
})
// 轮询订单状态
router.get('/checkStatus', async (ctx, next) => {
	const { orderNo, mercCd, outOrderNo } = ctx.request.query
	try {
		const status = await MicroService.request(provider.orderStatus, { orderNo, mercCd, outOrderNo })
		ctx.body = success(status)
	} catch (error) {
		ctx.body = fail(error)
	}
})
router.post('/erCode', async (ctx, next) => {
	const { type,mercCd,orderNo,tranAmt } = ctx.request.body
	let  status;
	try {
		if(type == "wx"){
			status = await MicroService.request("PROVIDER-ORDER:/order/qrpay/wxqrMPay", { mercCd,orderNo,tranAmt})
		}else{
			status = await MicroService.request("PROVIDER-ORDER:/order/qrpay/aliqrMPay", { mercCd,orderNo,tranAmt })
		}
		ctx.body = success(status)
	} catch (error) {
		ctx.body = fail(error)
	}
})
// 获取支付数据
router.post('/payment',payment)
router.post('/cashier/payment',payment)
async function payment(ctx, next) {
	const {type, data, busType} = ctx.request.body
	console.log(type,data,busType)
	try {
		if (!type) {
			throw new Error('支付类型不能为空')
		}
		if (type == 'ebank') {
			if (busType == "b2b") {
				const paymentResult = await MicroService.request(provider.paymentEbankB2B, JSON.parse(data))
				ctx.body = success(paymentResult)
				
			} else {
				const paymentResult = await MicroService.request(provider.paymentEbankB2C, JSON.parse(data))
				console.log(paymentResult)
				ctx.body = success(paymentResult)
			}
			
		} else {
			throw new Error('暂不支付该支付类型')
		}
	} catch (error) {
		ctx.body = fail(error)
	}
}
//////
router.post('/order/quickPay/apply', quickApply)
router.post('/cashier/order/quickPay/apply', quickApply)
async function quickApply(ctx) {
  const {
    orderNo,
    mercCd,
    // tranAmt,
    cardNo,
    bankCd,
    cardType,
    bankName,
    acctName,
    idType,
    idNo,
    cvn,
    expDt,
    phoneNo } = ctx.request.body

  try {
    const res = await MicroService.request(provider.agreeApply, {
      orderNo, mercCd, cardNo, bankCd, cardType, bankName, acctName, idType, idNo, cvn, expDt, phoneNo
    })
    ctx.body = success(res)
  } catch (error) {
    ctx.body = fail(error)
  }
}
router.post('/order/quickPay/orderPay', quickOrderPay)
router.post('/cashier/order/quickPay/orderPay', quickOrderPay)
async function quickOrderPay(ctx, next) {
  const { orderNo, mercCd, tranAmt, smsCode } = ctx.request.body
  try {
    const res = await MicroService.request(provider.agreeOrderPay, {
      orderNo, mercCd, tranAmt, smsCode
    })
    ctx.body = success(res)
  } catch (error) {
    ctx.body = fail(error)
  }
}
preRoute = '/common'
router.get(`/common/*`, async function (ctx) {
    let url = ctx.url;
    let arr = url.split("/")
    arr.splice(0, 2)
    let img = "./src/public/" + arr.join("/")
    let image = await new Promise((reslove) => {
      fs.readFile(img, function (err, data) {
        reslove(data)
      })
    })
    ctx.body = image
  });
	
export default router
