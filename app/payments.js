const debug = require('debug')('demo:payments')
const http = require('https')

module.exports = payments

function payments () {}

const api_key = process.env.API_KEY
const return_url = process.env.RETURN_URL

debug('API KEY: %s', api_key)
debug('Return URL: %s', return_url)

/**
 * Post a request for payment to GOV.UK Pay
 */
payments.sendRequstForPayment = function (amount, reference, description, callback) {
  const options = {
    'method': 'POST',
    'hostname': 'publicapi.payments.service.gov.uk',
    'port': null,
    'path': '/v1/payments',
    'headers': {
      'accept': 'application/json',
      'authorization': 'Bearer ' + api_key,
      'content-type': 'application/json'
    }
  }

  var req = http.request(options, function (res) {
    var chunks = []

    res.on('data', function (chunk) {
      chunks.push(chunk)
    })

    res.on('end', function () {
      debug('1. Response received from GOV.UK Pay')
      var body = Buffer.concat(chunks)
      callback(JSON.parse(body.toString()))
    })
  })

  req.write(JSON.stringify({
    amount: parseInt(amount, 10),
    reference: reference,
    description: description,
    return_url: return_url
  }))
  req.end()
}

/**
 * Check the status of a transaction in progress
 * @param id Transaction ID
 * @param callback
 */
payments.checkPaymentStatus = function (payment_id, callback) {
  debug('Checking transaction: %s', payment_id)
  const options = {
    'method': 'GET',
    'hostname': 'publicapi.payments.service.gov.uk',
    'port': null,
    'path': '/v1/payments/' + payment_id,
    'headers': {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + api_key,
      'accept': 'application/json',
      'cache-control': 'no-cache'
    }
  }

  var req = http.request(options, function (res) {
    var chunks = []

    res.on('data', function (chunk) {
      chunks.push(chunk)
    })

    res.on('end', function () {
      debug('2. Response received from GOV.UK Pay')
      var body = Buffer.concat(chunks)
      callback(JSON.parse(body.toString()))
    })
  })

  req.end()
}

// const https = require('https'), childProc = require('child_process')
// const apiHost = 'publicapi.payments.service.gov.uk',
//   apiPaymentsEndpointPath = '/v1/payments',
//   apiToken = process.env.API_KEY, // set up on command line with: export PAY_API_TOKEN=[token_here]
//   paymentReference = 'DAN-OCC-' + Math.floor(Math.random() * 10000),
//   returnUrl = `${process.env.RETURN_URL}/?ref=` + paymentReference,
//   paymentDescription = 'Pay Integration Demo',
//   amountInCents = '16500'

// var selfUrlHref

// // Initialising payment and launching the web payment form

// var dataString = JSON.stringify({
//   'amount': amountInCents,
//   'reference': paymentReference,
//   'description': paymentDescription,
//   'return_url': returnUrl
// })

// var options = {
//   host: apiHost,
//   port: 443,
//   path: apiPaymentsEndpointPath,
//   method: 'POST',
//   headers: {
//     'Authorization': 'Bearer ' + apiToken,
//     'Content-Type': 'application/json',
//     'Content-Length': dataString.length
//   }
// }

// var req = https.request(options, function (res) {
//   res.setEncoding('utf8')
//   res.on('data', function (responseBody) {
//     var jsonResponseBody = JSON.parse(responseBody)
//     var nextUrlHref = jsonResponseBody._links.next_url.href
//     selfUrlHref = jsonResponseBody._links.self.href

//     childProc.exec('open -a "Google Chrome" ' + nextUrlHref, function () {})
//   })
// })

// req.write(dataString)
// req.end()
