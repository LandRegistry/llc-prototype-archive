var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))

// Account management Routes
router.get('/admin/search', function (req, res) {
  res.render('admin/search')
})

router.post('/admin/search', function (req, res) {
  return res.render('search-results')
})

router.get('/admin/add-user-details', function (req, res) {
  res.render('admin/add-user-details')
})

router.post('/admin/add-user-details', function (req, res) {
  return res.render('admin/add-user-confirm')
})

router.get('/admin/add-user-confirm', function (req, res) {
  res.render('admin/add-user-confirm')
})

router.post('/admin/add-user-confirm', function (req, res) {
  var string = 'User added successfully'
  return res.render('admin/search', {message: string})
})

router.get('/admin/update-user-confirm', function (req, res) {
  res.render('admin/update-user-confirm')
})

router.post('/admin/update-user-confirm', function (req, res) {
  var string = 'User details updated successfully'
  return res.render('admin/search', {message: string})
})
