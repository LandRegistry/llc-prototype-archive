var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))

// Account management Routes

exports.searchPage = (req, res) => {
  res.render('admin/search')
}

exports.searchResults = (req, res) => {
  res.render('search-results')
}

exports.addUserDetails = (req, res) => {
  res.render('admin/add-user-details')
}

exports.confirmUserDetails = (req, res) => {
  res.render('admin/add-user-confirm')
}

exports.confirmUserDetailsPage = (req, res) => {
  res.render('admin/add-user-confirm')
}

exports.confirmationPage = (req, res) => {
  res.render('admin/confirmation')
}

exports.addedUser = (req, res) => {
  var string = 'User added successfully'
  res.render('admin/confirmation', {message: string})
}

exports.updateUserConfirmPage = (req, res) => {
  res.render('admin/update-user-confirm')
}

exports.updatedUser = (req, res) => {
  var string = 'User details updated successfully'
  res.render('admin/confirmation', {message: string})
}
