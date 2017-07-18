var express = require('express')
var session = require('express-session')
var router = express.Router()
var path = require('path')
var fs = require('fs')
var url = require('url')
var bodyParser = require('body-parser')
var S = require('string')
var app = express()
router.use(bodyParser.urlencoded({ extended: false }))
const adminController = require('./admin-controller')
const citizenController = require('./citizen-controller')
const payments = require('./payments')
const debug = require('debug')('demo:routes')

var legs = [
  'Ancient Monuments and ArchaeologicalAreas Act 1979 (as amended…): s.1(9), s.2(3), s.8(6), s.12, s.16(8), s.33(5)',
  'Highways Act 1980 (various sections)',
  'Localism Act 2011 (Part 5, Chapter 3): The Assets of Community Value (England) 2012 SI 2012 No. 2421……',
  'New Towns Act 1981: Order by Secretary of State - s.10 or s.11 (CPO by a Development Corporation)',
  'Part 8 Regulation 66 Community Infrastructure Levy Regulations 2010',
  'Part 8 Regulation 66 Community Infrastructure Levy Regulations 2011',
  'Part XI Highways Act 1980 (under code of 1875)',
  's.106 Town and Country Planning Act 1990',
  's.107 Building Act 1984',
  's.107(9) Housing Act 1996',
  's.11(1) Opencast Coal Act 1958',
  's.119 Housing Act 1996',
  's.156(a) Housing Act 1985',
  's.36(a) Housing Act 1985',
  's.17 Land Powers (Defence) Act 1958',
  's.172 Town and Country Planning Act 1990',
  's.178(1)(b) Town and Country Planning Act 1990',
  's.18 Clean Air Act 1993',
  's.18(8) Land Drainage Act 1991',
  's.198 Town and Country Planning Act 1990 (when confirmed)',
  's.201 Town and Country Planning Act 1990 (immediate effect)',
  's.207 Town and Country Planning Act 1990 (RE replacement)',
  's.208 Town and Country Planning Act 1990 (appeal)',
  's.209 Town and Country Planning Act 1990 (enter land)',
  's.2(4) Rights of Light Act 1959',
  's.278(8) Highways Act 1980',
  's.28 Wildlife and Countryside Act 1981',
  's.38 Highways Act 1980',
  's.42(1) Planning (Listed Buildings and Conservation Areas) Act 1990',
  's.43 Civil Aviation Act 1982',
  's.44 Civil Aviation Act 1982',
  's.45 Civil Aviation Act 1982',
  's.46(1) Civil Aviation Act 1982',
  's.52(2) Housing Grants Construction and Regeneration Act 1996',
  's.52(8) Land Compensation Act 1973',
  's.69(4) Planning (Listed Buildings and Conservation Areas) Act 1990',
  's.70 Town and Country Planning Act 1990 (as amended)',
  's.8 Coast Protection Act',
  's.8(4) Land Compensation Act 1973',
  's2 Planning (Listed Buildings and Conservation Areas) Act 1990',
  'Town and Country Planning (General Permitted Development) Order 1995',
  'Various',
  'No specific statutory provision']

var legs2 = [
  ['s.1(9), s.2(3), s.8(6), s.12, s.16(8), s.33(5)', 'Ancient Monuments and Archaeological Areas Act 1979 (as amended…)'],
  ['various sections', 'Highways Act 1980'],
  ['(Part 5, Chapter 3)', 'Localism Act 2011', 'The Assets of Community Value (England) 2012 SI 2012 No. 2421……'],
  ['s.10 or s.11', 'New Towns Act 1981: Order by Secretary of State', '(CPO by a Development Corporation)'],
  ['Part 8 Regulation 66', 'Community Infrastructure Levy Regulations 2010', ''],
  ['Part 8 Regulation 66', 'Community Infrastructure Levy Regulations 2011', ''],
  ['Part XI', 'Highways Act 1980', '(under code of 1875)'],
  ['s.106', 'Town and Country Planning Act 1990', ''],
  ['s.107', 'Building Act 1984', ''],
  ['s.107(9)', 'Housing Act 1996', ''],
  ['s.11(1)', 'Opencast Coal Act 1958', ''],
  ['s.119', 'Housing Act 1996', ''],
  ['s.156(a)', 'Housing Act 1985', ''],
  ['s.36(a)', 'Housing Act 1985', ''],
  ['s.17', 'Land Powers (Defence) Act 1958', ''],
  ['s.172', 'Town and Country Planning Act 1990', ''],
  ['s.178(1)(b)', 'Town and Country Planning Act 1990', ''],
  ['s.18', 'Clean Air Act 1993', ''],
  ['s.18(8)', 'Land Drainage Act 1991', ''],
  ['s.198', 'Town and Country Planning Act 1990', '(when confirmed)'],
  ['s.201', 'Town and Country Planning Act 1990', '(immediate effect)'],
  ['s.207', 'Town and Country Planning Act 1990', '(RE replacement)'],
  ['s.208', 'Town and Country Planning Act 1990', '(appeal)'],
  ['s.209', 'Town and Country Planning Act 1990', '(enter land)'],
  ['s.2(4)', 'Rights of Light Act 1959', ''],
  ['s.278(8)', 'Highways Act 1980', ''],
  ['s.28', 'Wildlife and Countryside Act 1981', ''],
  ['s.38', 'Highways Act 1980', ''],
  ['s.42(1)', 'Planning Act 1990', '(Listed Buildings and Conservation Areas)'],
  ['s.43', 'Civil Aviation Act 1982', ''],
  ['s.44', 'Civil Aviation Act 1982', ''],
  ['s.45', 'Civil Aviation Act 1982', ''],
  ['s.46(1)', 'Civil Aviation Act 1982', ''],
  ['s.52(2)', 'Housing Grants Construction and Regeneration Act 1996', ''],
  ['s.52(8)', 'Land Compensation Act 1973', ''],
  ['s.69(4)', 'Planning Act 1990', '(Listed Buildings and Conservation Areas)', ''],
  ['s.70', 'Town and Country Planning Act 1990', '(as amended)'],
  ['s.8', 'Coast Protection Act', ''],
  ['s.8(4)', 'Land Compensation Act 1973'],
  ['s2', 'Planning Act 1990', '(Listed Buildings and Conservation Areas)'],
  ['Town and Country Planning Order 1995', '(General Permitted Development)'],
  ['Various sections', 'Or various acts', ''],
  ['None', 'No specific statutory provision', '']]

// Initialise express-session so we can do some fake sign stuff
router.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'doesnt-matter-because-its-a-prototype'
}))

/**
 * Main index page route
 */
router.get('/', function (req, res) {
  var prototypes = []
  res.render('index', {
    prototypes: prototypes
  })
})

router.get('/llc-01/create-:screen', function (req, res) {
  var desc = ''
  var today = ''
  var charge_type = ''
  if (req.params.screen == 1) {
    desc = 'charge-type'
  } else if (req.params.screen == 2) {
    charge_type = req.body.charge_type
    desc = 'statutory-provisions'
  } else if (req.params.screen == 3) {
    desc = 'document'
  } else if (req.params.screen == 4) {
    desc = 'term'
  } else if (req.params.screen == 5) {
    desc = 's8'
  } else if (req.params.screen == 6) {
    desc = 's52'
  } else if (req.params.screen == 7) {
    desc = 'add-info'
  } else if (req.params.screen == 8) {
    desc = 'orig-auth'
  } else if (req.params.screen == 9) {
    desc = 'where'
  } else if (req.params.screen == 10) {
    desc = 'where-uprn'
  } else if (req.params.screen == 11) {
    desc = 'submit'
  } else if (req.params.screen == 12) {
    desc = 'confirm'
  }
  res.render('llc-' + '01' + '/create/create_' + req.params.screen + '-' + desc,
    {'title': '', 'today': today, 'charge_type': charge_type})
})

router.get('/llc-02/register-:screen', function (req, res) {
  var desc = ''
  var today = ''
  var charge_type = ''
  if (req.params.screen == 1) {
    desc = 'charge-type'
  } else if (req.params.screen == 2) {
    req.session.charge_type = req.body.charge_type
    desc = 'where'
  } else if (req.params.screen == 3) {
    desc = 'where-map'
  } else if (req.params.screen == 4) {
    desc = 'description'
  } else if (req.params.screen == 5) {
    desc = 'law'
  } else if (req.params.screen == 6) {
    desc = 'instrument'
  } else if (req.params.screen == 7) {
    desc = 'further-info'
  } else if (req.params.screen == 8) {
    desc = 'term'
  } else if (req.params.screen == 9) {
    desc = 'submit'
  } else if (req.params.screen == 10) {
    desc = 'confirm'
  }
  res.render('llc-' + '02' + '/register/register_' + req.params.screen + '-' + desc,
    {'title': '', 'today': today, 'charge_type': session.charge_type })
})

router.all('/llc-03/register-:screen', function (req, res) {
  var desc = ''
  var next = ''
  if (req.params.screen == 0) {
    next = 1
    desc = 'charge-type'
  }
  if (req.params.screen == 1) {
    req.session.charge_type = req.body.charge_type
    next = 2
    desc = 'legal'
  } else if (req.params.screen == 2) {
    req.session.act_agree = S(req.body.act_agree).chompLeft(',').s
    req.session.section = req.body.section
    next = 31
    desc = 'where-search'
  } else if (req.params.screen == 31) {
    req.session.search_term = req.body.search_term
    // TODO test if search param = exeter and go to city map 41
    next = 32
    desc = 'where-search-results'
  } else if (req.params.screen == 32) {
    req.session.search_term = req.body.search_term
    next = 42
    desc = 'where-map-address'
  } else if (req.params.screen == 42) {
    next = 6
    desc = 'description'
  } else if (req.params.screen == 6) {
    req.session.description = req.body.description
    next = 7
    desc = 'further-info'
  } else if (req.params.screen == 7) {
    req.session.further_info = req.body.further_info
    req.session.reference = req.body.reference
    next = 8
    desc = 'instrument'
  } else if (req.params.screen == 8) {
    req.session.instrument = req.body.instrument
    req.session.creation_date = req.body.doc_day + '/' + req.body.doc_month + '/' + req.body.doc_year
    next = 9
    desc = 'term'
  } else if (req.params.screen == 9) {
    req.session.expiry = req.body.expiry
    next = 10
    desc = 'submit'
  } else if (req.params.screen == 10) {
    next = 11
    desc = 'confirm'
    req.session.destroy
  }
  res.render('llc-' + '03' + '/register/register_' + next + '-' + desc,
    {'title': '',
      charge_type: req.session.charge_type,
      act_agree: req.session.act_agree,
      section: req.session.section,
      search_term: req.session.search_term,
      address: req.session.address,
      description: req.session.description,
      further_info: req.session.further_info,
      reference: req.session.reference,
      instrument: req.session.instrument,
      creation_date: req.session.creation_date,
      expiry: req.session.expiry
    })
})

router.all('/llc-03/register-:screen/address=:address', function (req, res) {
  req.session.address = req.params.address
  var next = 42
  var desc = 'where-map-address'
  res.render('llc-' + '03' + '/register/register_' + next + '-' + desc,
    {'title': '',
      charge_type: req.session.charge_type,
      act_agree: req.session.act_agree,
      section: req.session.section,
      search_term: req.session.search_term,
      address: req.session.address,
      description: req.session.description,
      further_info: req.session.further_info,
      reference: req.session.reference,
      instrument: req.session.instrument,
      creation_date: req.session.creation_date,
      expiry: req.session.expiry
    })
})

router.all('/add_charge/v2-2/03_charge_search_results', function (req, res) {
  var searchTerm = req.body.legislation
  var searchResult = inArray(searchTerm, legs2)
  res.render('add_charge/v2-2/03_charge_search',
    {'title': '', reply: searchResult
    })
})

router.all('/add_charge/v4/06_map', function (req, res) {
  var source = req.query.source
  var values = {'title': ''}
  if (source === 'link') {
    values['geometry'] = JSON.stringify({'type': 'Polygon', 'coordinates': [[[289271.8965749566, 86964.19601306657], [289271.8965749566, 96855.00479850252], [297579.1996423088, 96855.00479850252], [297579.1996423088, 86964.19601306657], [289271.8965749566, 86964.19601306657]]]})
  } else if (source === 'search') {
    values['geometry'] = JSON.stringify({'type': 'LineString', 'coordinates': [[292038.4200000003, 92423.00500000002], [291874.27000000025, 92342.33000000002]]})
  }
  res.render('add_charge/v4/06_map', values)
})

function match (query, array) {
  return array.filter(function (el) {
    return el.toLowerCase().indexOf(query.toLowerCase()) > -1
  })
}

function inArray (query, outerArray) {
  var lengthOuter = outerArray.length
  var matches = []
  for (var i = 0; i < lengthOuter; i++) {
    var innerArray = outerArray[i]
    var matched = match(query, innerArray)
    if (matched.length >= 1) {
      matches.push(innerArray)
    }
  }
  return matches
}

// shape upload routes
router.get('/add_charge/v2-4/05_postcode', function (req, res) {
  var shape = req.query.shape
  if (shape === 'true') {
    res.redirect('/add_charge/v2-4/check-charge-boundary')
  } else {
    res.render('add_charge/v2-4/05_postcode')
  }
})

router.get('/add_charge/v2-4/check-charge-boundary', function (req, res) {
  var shape = req.query.shape
  if (shape === 'false') {
    res.redirect('/add_charge/v2-4/05_postcode')
  } else {
    res.render('add_charge/v2-4/check-charge-boundary')
  }
})

router.get('/add_charge/v2-5/05_postcode', function (req, res) {
  var shape = req.query.shape
  if (shape === 'true') {
    res.redirect('/add_charge/v2-5/check-charge-boundary')
  } else {
    res.render('add_charge/v2-5/05_postcode')
  }
})

router.get('/add_charge/v2-5/check-charge-boundary', function (req, res) {
  var shape = req.query.shape
  if (shape === 'false') {
    res.redirect('/add_charge/v2-5/05_postcode')
  } else {
    res.render('add_charge/v2-5/check-charge-boundary')
  }
})

// Account management home
router.get('/admin/sign_in', adminController.signInPage)
router.post('/admin/sign_in', adminController.signInAuth)
router.get('/admin/search', adminController.searchPage)
router.post('/admin/search', adminController.searchResults)

// Add user
router.get('/admin/add-user-role', adminController.addedUserRolePage)
router.get('/admin/add-user-details', adminController.addUserDetailsPage)
router.post('/admin/add-user-details', adminController.confirmUserDetails)
router.get('/admin/add-user-confirm', adminController.confirmUserDetailsPage)
router.post('/admin/add-user-confirm', adminController.addedUser)

// update user
router.get('/admin/user', adminController.userPage)
router.get('/admin/update-user', adminController.updatedUserPage)
router.get('/admin/update-user-confirm', adminController.updateUserConfirmPage)
router.post('/admin/update-user-confirm', adminController.updatedUser)

// UPRN search
router.get('/maintain_llc/new_search_v1-1/map_new', function (req, res) {
  var uprn = req.query.searched_term
  if (uprn === 'UPRN12345ABC') {
    res.redirect('/maintain_llc/new_search_v1-1/map_uprn')
  } else {
    res.render('maintain_llc/new_search_v1-1/map_new')
  }
})

/* v2 */

// Citizen Service Routes
/* router.get('/citizen-service/v1/search', citizenController.searchPage)
router.post('/citizen-service/v1/search', citizenController.search) */

router.get('/citizen-service/v1/search-results', function (req, res) {
  var citizenPostcode = req.query.location
  if (citizenPostcode === 'EX4 1AY') {
    res.redirect('/citizen-service/v1/search-results_address_list')
  } else {
    res.render('citizen-service/v1/search-results')
  }
})

/**
 * GOV.UK Pay routes
 */
router.get('/citizen-service/v1/pay-continue', (req, res, next) => {
  res.render('citizen-service/v1/pay-continue')
})

router.post('/citizen-service/v1/pay-continue', (req, res, next) => {
  req.body.amount = '16500'
  req.body.reference = 'Official Local Land Search'
  req.body.description = 'Payment Offical Local Land Search'

  payments.sendRequstForPayment(req.body.amount, req.body.reference, req.body.description, (result) => {
    debug('Initial request completed')

    debug('State : %s', result.status)
    debug('Payment id: %s', result.payment_id)
    debug('Reference: %s', result.reference)
    debug('URL: %s', result._links.next_url.href)

    console.log(result)
    res.redirect(result._links.next_url.href)
  })
})

module.exports = router
