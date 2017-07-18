const debug = require('debug')('demo:router')
const express = require('express')
const router = express.Router()

var HashMap = require('hashmap')

const payments = require('./payments')

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// This is obviously not production ready !!
var map = new HashMap()

/**
 * GOV.UK Notify routes
 */
exports.notify = (req, res, next) => {
  res.render('notify', { layout: 'main' })
}

/**
 * GOV.UK Pay routes
 */

exports.getPaymentRef = (req, res, next) => {
  const reference = req.params[ 'reference' ]

  const id = map.get(reference)
  map.remove(reference)

  debug('Lookup id %s=%s', reference, id)

  payments.checkPaymentStatus(id, (result) => {
    debug(JSON.stringify(result))

    res.render('transaction', {
      transaction: result,
      layout: 'main' })
  })
}

exports.sendPayment = (req, res, next) => {
  const amount = '14000'
  const reference = 'llc'
  const description = 'Testing citizen service payment'

  payments.sendRequstForPayment(amount, reference, description, (result) => {
    debug('Initial request completed')

    debug('State : %s', result.state.status)
    debug('Payment id: %s', result.payment_id)
    debug('Reference: %s', result.reference)
    debug('URL: %s', result._links.next_url.href)

    map.set(result.reference, result.payment_id)

    res.redirect(result._links.next_url.href)
  })
}
