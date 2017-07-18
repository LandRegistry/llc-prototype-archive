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
    return_url: return_url + '/' + reference
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
