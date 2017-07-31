const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./scratch')
router.use(bodyParser.urlencoded({ extended: false }))

// Account management Routes

exports.signInPage = (req, res) => {
  res.render('admin/v1/sign_in')
}

exports.signInAuth = (req, res) => {
  localStorage.setItem('username', req.body.username)
  console.log(localStorage.getItem('username'))
  res.render('admin/v1/search')
}

exports.searchPage = (req, res) => {
  res.render('admin/v1/search')
}

exports.searchResults = (req, res) => {
  res.render('search-results')
}

exports.addedUserRolePage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/v1/add-user-role', {admin: user})
  } else {
    res.render('admin/v1/add-user-role')
  }
}

exports.addUserDetailsPage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/v1/add-user-details', {admin: user})
  } else {
    res.render('admin/v1/add-user-details')
  }
}

exports.confirmUserDetails = (req, res) => {
  res.render('admin/v1/add-user-confirm')
}

exports.confirmUserDetailsPage = (req, res) => {
  res.render('admin/v1/add-user-confirm')
}

exports.confirmationPage = (req, res) => {
  res.render('admin/v1/add-confirmation')
}

exports.addedUser = (req, res) => {
  res.render('admin/v1/add-confirmation')
}

exports.userPage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/v1/user', {admin: user})
  } else {
    res.render('admin/v1/user')
  }
}

exports.updatedUserPage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/v1/update-user', {admin: user})
  } else {
    res.render('admin/v1/update-user')
  }
}

exports.updateUserConfirmPage = (req, res) => {
  const user = localStorage.getItem('username')
  if (user === 'admin') {
    res.render('admin/v1/update-user-confirm', {admin: user})
  } else {
    res.render('admin/v1/update-user-confirm')
  }
}

exports.updatedUser = (req, res) => {
  res.render('admin/v1/update-confirmation')
}
