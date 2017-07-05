const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./scratch')
router.use(bodyParser.urlencoded({ extended: false }))

// Account management Routes

exports.signInPage = (req, res) => {
  res.render('admin/sign_in')
}

exports.signInAuth = (req, res) => {
  localStorage.setItem('username', req.body.username)
  console.log(localStorage.getItem('username'))
  res.render('admin/search')
}

exports.searchPage = (req, res) => {
  res.render('admin/search')
}

exports.searchResults = (req, res) => {
  res.render('search-results')
}

exports.addedUserRolePage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/add-user-role', {admin: user})
  } else {
    res.render('admin/add-user-role')
  }
}

exports.addUserDetailsPage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/add-user-details', {admin: user})
  } else {
    res.render('admin/add-user-details')
  }
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
  var addMessage = 'User added'
  res.render('admin/confirmation', {message: addMessage})
}

exports.userPage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/user', {admin: user})
  } else {
    res.render('admin/user')
  }
}

exports.updatedUserPage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/update-user', {admin: user})
  } else {
    res.render('admin/update-user')
  }
}

exports.updateUserConfirmPage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/update-user-confirm', {admin: user})
  } else {
    res.render('admin/update-user-confirm')
  }
}

exports.updatedUser = (req, res) => {
  var updateMessage = 'Changes saved'
  res.render('admin/confirmation', {message: updateMessage})
}
