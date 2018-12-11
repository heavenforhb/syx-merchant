import {CONSTANTS} from '../config'

import moment from 'moment'

const error = msg => ({success: false, message: msg}),
	success = data => ({success: true, data})

const validateForm = function ({
	                               outOrderDt = '',
	                               outOrderTm = '',
	                               outOrderNo = '', mercCd = '', tranType = '',
	                               subMercCd = '', goodsName = '', goodsDesc = '',
	                               orderType = '', goodsDetail = '', orderUrl = '',
	                               orderAmt = '', orderExpTm = '30', orderRmk = '', attach = '',
	                               notifyUrl = '', callBackUrl = '', privateKey = ''
                               }) {

	if (moment(outOrderDt, CONSTANTS.formatDT).isValid === false) {
		return error(`参数不合法 - 商户下单日期: ${outOrderDt}`)
	}

	if (!outOrderNo) {
		return error(`缺少必要参数: 商户订单号`)
	}

	if (!tranType) {
		return error(`缺少必要参数: 交易类型`)
	}

	if (!mercCd) {
		return error(`缺少必要参数: 商户编号`)
	}

	if (!subMercCd) {
		return error(`缺少必要参数: 子商户标识`)
	}

	if (!goodsName) {
		return error(`缺少必要参数: 商品名称`)
	}

	if (!goodsDesc) {
		return error(`缺少必要参数: 商品描述`)
	}

	if (!goodsDetail) {
		return error(`缺少必要参数: 商品详情`)
	}

	if (!orderType) {
		return error(`缺少必要参数: 订单类型`)
	}

	if (!privateKey) {
		return error(`当前为测试环境，需填写商户私钥`)
	}

	if (!callBackUrl) {
		return error(`参数不合法 - 返回地址: ${callBackUrl}`)
	}

	// if (!orderUrl) {
	//   return error(`参数不合法 - 订单地址: ${orderUrl}`)
	// }
	if (!orderAmt) {
		return error(`缺少必要参数: 订单金额`)
	} else if (isNaN(orderAmt) || orderAmt < 0.01) {
		return error(`参数不合法 - 订单金额: ${orderAmt}`)
	}

	let simpleOrderExpTm = 60 //订单超时日期时间，默认下单时间+60分钟
	orderExpTm = orderExpTm || simpleOrderExpTm
	if (moment(orderExpTm, CONSTANTS.formatFull).isValid == false) {
		error(`参数不合法 - 订单超时日期时间: ${orderExpTm}`)
	}

	let rmk = `商户下单, 商户编号: ${mercCd}, 商户订单编号: ${outOrderNo}`

	return success({
		outOrderDt, outOrderTm, outOrderNo, mercCd, subMercCd, goodsName, tranType,
		goodsDesc, orderType, goodsDetail, orderUrl, orderAmt, orderExpTm, orderRmk,
		attach, notifyUrl, callBackUrl, rmk
	})
}

const validateB2CForm = function ({
	                                  outOrderDt = moment().format(CONSTANTS.formatDT),
	                                  outOrderTm = moment().format(CONSTANTS.formatTM),
	                                  outOrderNo = '', mercCd = '', tranType = '',
	                                  subMercCd = '', goodsName = '', goodsDesc = '',
	                                  orderType = '', goodsDetail = '', orderUrl = '', orderAmt = '',
	                                  orderExpTm = '30', orderRmk = '', attach = '', notifyUrl = '',
                                    callBackUrl = '', bankCd = '', cardType = 'DEBIT', bankName = '',
                                    isInstal='', instalNum='', instalRate='', mchntFeeSubsidy=''
                                  }) {

	if (moment(outOrderDt, CONSTANTS.formatDT).isValid === false) {
		return error(`参数不合法 - 商户下单日期: ${outOrderDt}`)
	}
	if (!outOrderNo) {
		return error(`缺少必要参数: 商户订单号`)
	}
	if (!tranType) {
		return error(`缺少必要参数: 交易类型`)
	}
	if (!mercCd) {
		return error(`缺少必要参数: 商户编号`)
	}
	if (!subMercCd) {
		return error(`缺少必要参数: 子商户标识`)
	}
	if (!goodsName) {
		return error(`缺少必要参数: 商品名称`)
	}
	if (!goodsDesc) {
		return error(`缺少必要参数: 商品描述`)
	}
	if (!goodsDetail) {
		return error(`缺少必要参数: 商品详情`)
	}

	if (!orderType) {
		return error(`缺少必要参数: 订单类型`)
	}

	if (!callBackUrl) {
		return error(`参数不合法 - 返回地址: ${callBackUrl}`)
	}
	if (!bankCd) {
		return error(`缺少必要参数: 发卡行代码`)
	}
	if (!orderAmt) {
		return error(`缺少必要参数: 订单金额`)
	} else if (isNaN(orderAmt) || orderAmt < 0.01) {
		return error(`参数不合法 - 订单金额: ${orderAmt}`)
	}

	let simpleOrderExpTm = 60 //订单超时日期时间，默认下单时间+60分钟
	orderExpTm = orderExpTm || simpleOrderExpTm
	if (moment(orderExpTm, CONSTANTS.formatFull).isValid == false) {
		error(`参数不合法 - 订单超时日期时间: ${orderExpTm}`)
	}

	let rmk = `商户下单, 商户编号: ${mercCd}, 商户订单编号: ${outOrderNo}`

	return success({
		outOrderDt, outOrderTm, outOrderNo, mercCd, subMercCd, goodsName, tranType,
		goodsDesc, goodsDetail, orderUrl, orderAmt, orderExpTm, orderRmk,
    attach, notifyUrl, callBackUrl, rmk, bankCd, cardType, bankName,
    isInstal, instalNum, instalRate, mchntFeeSubsidy
	})
}

module.exports = {
	validateForm,
	validateB2CForm
}