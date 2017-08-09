var express = require('express')
var session = require('express-session')
var router = express.Router()
var path = require('path')
var fs = require('fs')
var url = require('url')
var bodyParser = require('body-parser')
var S = require('string')
var app = express()
var HashMap = require('hashmap')
router.use(bodyParser.urlencoded({ extended: false }))
const citizenController = require('./citizen-controller')
const payments = require('./payments')
const debug = require('debug')('demo:routes')

var map = new HashMap()

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
    'No specific statutory provision'
]

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
    ['None', 'No specific statutory provision', '']
]

// Initialise express-session so we can do some fake sign stuff
router.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'doesnt-matter-because-its-a-prototype'
}))

/**
 * Main index page route
 */
router.get('/', function(req, res) {
    var prototypes = []
    res.render('index', {
        prototypes: prototypes
    })
})

router.get('/llc-01/create-:screen', function(req, res) {
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
    res.render('llc-' + '01' + '/create/create_' + req.params.screen + '-' + desc, { 'title': '', 'today': today, 'charge_type': charge_type })
})

router.get('/llc-02/register-:screen', function(req, res) {
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
    res.render('llc-' + '02' + '/register/register_' + req.params.screen + '-' + desc, { 'title': '', 'today': today, 'charge_type': session.charge_type })
})

router.all('/llc-03/register-:screen', function(req, res) {
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
    res.render('llc-' + '03' + '/register/register_' + next + '-' + desc, {
        'title': '',
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

router.all('/llc-03/register-:screen/address=:address', function(req, res) {
    req.session.address = req.params.address
    var next = 42
    var desc = 'where-map-address'
    res.render('llc-' + '03' + '/register/register_' + next + '-' + desc, {
        'title': '',
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

router.all('/add_charge/v2-2/03_charge_search_results', function(req, res) {
    var searchTerm = req.body.legislation
    var searchResult = inArray(searchTerm, legs2)
    res.render('add_charge/v2-2/03_charge_search', {
        'title': '',
        reply: searchResult
    })
})

router.all('/add_charge/v4/06_map', function(req, res) {
    var source = req.query.source
    var values = { 'title': '' }
    if (source === 'link') {
        values['geometry'] = JSON.stringify({
            'type': 'Polygon',
            'coordinates': [
                [
                    [289271.8965749566, 86964.19601306657],
                    [289271.8965749566, 96855.00479850252],
                    [297579.1996423088, 96855.00479850252],
                    [297579.1996423088, 86964.19601306657],
                    [289271.8965749566, 86964.19601306657]
                ]
            ]
        })
    } else if (source === 'search') {
        values['geometry'] = JSON.stringify({
            'type': 'LineString',
            'coordinates': [
                [292038.4200000003, 92423.00500000002],
                [291874.27000000025, 92342.33000000002]
            ]
        })
    }
    res.render('add_charge/v4/06_map', values)
})

function match(query, array) {
    return array.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) > -1
    })
}

function inArray(query, outerArray) {
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
router.get('/add_charge/v2-4/05_postcode', function(req, res) {
    var shape = req.query.shape
    if (shape === 'true') {
        res.redirect('/add_charge/v2-4/check-charge-boundary')
    } else {
        res.render('add_charge/v2-4/05_postcode')
    }
})

router.get('/add_charge/v2-4/check-charge-boundary', function(req, res) {
    var shape = req.query.shape
    if (shape === 'false') {
        res.redirect('/add_charge/v2-4/05_postcode')
    } else {
        res.render('add_charge/v2-4/check-charge-boundary')
    }
})

router.get('/add_charge/v2-5/05_postcode', function(req, res) {
    var shape = req.query.shape
    if (shape === 'true') {
        res.redirect('/add_charge/v2-5/check-charge-boundary')
    } else {
        res.render('add_charge/v2-5/05_postcode')
    }
})

router.get('/add_charge/v2-5/check-charge-boundary', function(req, res) {
    var shape = req.query.shape
    if (shape === 'false') {
        res.redirect('/add_charge/v2-5/05_postcode')
    } else {
        res.render('add_charge/v2-5/check-charge-boundary')
    }
})

router.get('add_charge/v4-1/03_charge_list_top', function(req, res) {
    console.log('HIT')
    res.render('add_charge/v4-1/04_doc_mand', {
        'title': '',
        charge_type: 'HIT'
    })
})

/* router.all('add_charge/v:version/:screen', function (req, res) {
  var version = req.params.version
  var screen = req.params.screen
  var next = ''
  console.log(req.params.version)
  console.log(req.params.screen)
  if (screen =='03_charge_list_top') {
    req.session.charge_type = req.body.charge_type
    next = '04_doc_mand'
  }
  console.log('NEXT ' + 'add_charge/' + version + '/'+ next)
  res.render('add_charge/' + version + '/'+ next,
    {'title': '',
      charge_type: ''
    })
}) */

router.get('/add_charge/v4-2/start', function(req, res) {
    res.render('/add_charge/v4-2/001_start', {
        'title': '',
        charge_type: ''
    })
})

router.get('/add_charge/v4-1/start', function(req, res) {
    res.render('/add_charge/v4-1/1_start', {
        'title': '',
        charge_type: ''
    })
})

router.all('/add_charge/v4-1/:screen', function(req, res) {
    var desc = ''
    var next = ''
    if (req.params.screen == 0) {
        next = 10
        desc = 'start'
    }
    if (req.params.screen == 10) {
        next = 20
        desc = 'sign_in'
    } else if (req.params.screen == 20) {
        next = 21
        desc = 'home'
    } else if (req.params.screen == 21) {
        if (req.query.behalf_of == 'false') {
            next = 40
            desc = 'doc_mand'
        } else {
            next = 25
            desc = 'behalf_of'
        }
    } else if (req.params.screen == 25) { // ON BEHALF OF
        req.session.destroy
        next = 26
        desc = 'org_results'
    } else if (req.params.screen == 26) { // CHOOSE ON BEHALF OF
        req.session.on_behalf_of = req.query.on_behalf_of
        next = 40
        desc = 'doc_mand'
    } else if (req.params.screen == 30) { // CHARGE TYPE LIST
        next = 40
        desc = 'doc_mand'
        req.session.charge_type = req.body.charge_type
    } else if (req.params.screen == 31) {
        next = 32
        desc = 'charge_search'
    } else if (req.params.screen == 32) { // CHARGE LIST
        next = 40
        desc = 'doc_mand'
        req.session.charge_type = req.body.charge_type
    } else if (req.params.screen == 40) { // INSTRUMENT AND CREATION DATE
        req.session.instrument = req.body.instrument
        req.session.creation_date = req.body.doc_day + '/' + req.body.doc_month + '/' + req.body.doc_year
        next = 50
        desc = 'postcode'
    } else if (req.params.screen == 50) {
        next = 51
        desc = 'uprn_results'
        req.session.search_term = req.body.search_term
    } else if (req.params.screen == 51) { // SELECT ADDRESS
        req.session.address = req.query.address
        next = 60
        desc = 'map'
    } else if (req.params.screen == 50) {
        next = 60
        desc = 'shapefile'
    } else if (req.params.screen == 60) {
        next = 70
        desc = 'more_info'
    } else if (req.params.screen == 70) { // MORE INFO (ABOUT THE LOCATION)
        req.session.extent = req.body.extent
        req.session.part_extent = req.body.part_extent
        next = 80
        desc = 'description'
    } else if (req.params.screen == 80) { // DESCRIPTION SCREEN
        next = 90
        desc = 'additional_info'
        req.session.description = req.body.description
    } else if (req.params.screen == 90) { // ADDITIONAL INFO
        req.session.more_info = req.body.more_information
        req.session.reference = req.body.reference
        req.session.planning_link = req.body.link
        next = 100
        desc = 'expiration'
    } else if (req.params.screen == 100) { // EXPIRE
        req.session.expiry_date = req.body.end_day + '/' + req.body.end_month + '/' + req.body.end_year
        req.session.expiry_text = req.body.expire_text
        next = 110
        desc = 'check'
    } else if (req.params.screen == 110) {
        next = 120
        desc = 'confirmation'
    }
    res.render('add_charge/v4-1/' + next + '_' + desc, {
        'title': '',
        on_behalf_of: req.session.on_behalf_of,
        charge_type: req.session.charge_type,
        instrument: req.session.instrument,
        creation_date: req.session.creation_date,
        search_term: req.session.search_term,
        address: req.session.address,
        extent: req.session.extent,
        part_extent: req.session.part_extent,
        description: req.session.description,
        more_info: req.session.more_info,
        reference: req.session.reference,
        planning_link: req.session.planning_link,
        expiry_date: req.session.expiry_date,
        expiry_text: req.session.expiry_text
    })
})

// Account management home
const adminControllerV1 = require('./views/admin/v1/admin-controllerV1') // Create adminControllerV2 if you add another version

router.get('/admin/v1/sign_in', adminControllerV1.signInPage)
router.post('/admin/v1/sign_in', adminControllerV1.signInAuth)
router.get('/admin/v1/search', adminControllerV1.searchPage)
router.post('/admin/v1/search', adminControllerV1.searchResults)

// Add user
router.get('/admin/v1/add-user-role', adminControllerV1.addedUserRolePage)
router.get('/admin/v1/add-user-details', adminControllerV1.addUserDetailsPage)
router.post('/admin/v1/add-user-details', adminControllerV1.confirmUserDetails)
router.get('/admin/v1/add-user-confirm', adminControllerV1.confirmUserDetailsPage)
router.post('/admin/v1/add-user-confirm', adminControllerV1.addedUser)

// update user
router.get('/admin/v1/user', adminControllerV1.userPage)
router.get('/admin/v1/update-user', adminControllerV1.updatedUserPage)
router.get('/admin/v1/update-user-confirm', adminControllerV1.updateUserConfirmPage)
router.post('/admin/v1/update-user-confirm', adminControllerV1.updatedUser)

// UPRN search
router.get('/maintain_llc/new_search_v1-1/map_new', function(req, res) {
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

router.get('/citizen-service/v1/search-results', function(req, res) {
    var citizenPostcode = req.query.location
    if (citizenPostcode === 'EX4 1AY' || citizenPostcode === 'ex4 1ay') {
        res.redirect('/citizen-service/v1/search-results_address_list')
    } else {
        res.render('citizen-service/v1/search-results')
    }
})

/*router.get('/citizen-service/v2/search-results', function(req, res) {
    var citizenPostcode = req.query.location
    if (citizenPostcode === 'EX4 1AY' || citizenPostcode === 'ex4 1ay') {
        res.redirect('/citizen-service/v2/search-results_address_list')
    } else {
        res.render('citizen-service/v2/search-results')
    }
})*/

/**
 * GOV.UK Pay routes
 */
router.get('/citizen-service/v2/free-charge-details', (req, res, next) => {
    res.render('citizen-service/v2/free-charge-details')
})

router.get('/citizen-service/v2/pay-confirmation', (req, res, next) => {
    const reference = req.params['reference']

    const id = map.get(reference)
    map.remove(reference)

    debug('Lookup id %s=%s', reference, id)

    payments.checkPaymentStatus(id, (result) => {
        debug(JSON.stringify(result))

        res.render('citizen-service/v2/pay-confirmation', {
            transaction: result
        })
    })
})

router.post('/citizen-service/v2/free-charge-details', (req, res, next) => {
    req.body.amount = '1500'
    req.body.reference = 'Official search result of local land charges'
    req.body.description = 'Official search result of local land charges'

    payments.sendRequstForPayment(req.body.amount, req.body.reference, req.body.description, (result) => {
        debug('Initial request completed')

        debug('State : %s', result.status)
        debug('Payment id: %s', result.payment_id)
        debug('Reference: %s', result.reference)
        debug('URL: %s', result._links.next_url.href)

        map.set(result.reference, result.payment_id)

        res.redirect(result._links.next_url.href)
    })
})

module.exports = router