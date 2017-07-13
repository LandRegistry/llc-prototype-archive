const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./scratch')
router.use(bodyParser.urlencoded({ extended: false }))

// Account management Routes

exports.searchPage = (req, res) => {
  res.render('citizen-service/v1/search')
}

exports.search = (req, res) => {
  // localStorage.setItem('username', req.body.username)
  // console.log(localStorage.getItem('username'))
  const q = req.body.location
  res.render('citizen-service/v1/search-results', {search: q})
}
