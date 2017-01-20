var express = require('express');
var session = require('express-session');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var S = require('string');
var app = express();
router.use(bodyParser.urlencoded({ extended: false }));

// Initialise express-session so we can do some fake sign stuff
router.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'doesnt-matter-because-its-a-prototype'
}));

/**
 * Main index page route
 */
router.get('/', function (req, res) {
  var prototypes = [];
    res.render('index', {
      prototypes: prototypes
    });
});

router.get('/llc-01/create-:screen', function (req, res) {
  desc = '';
  today ='';
  charge_type='';
  if (req.params.screen == 1) {
    desc = 'charge-type' }
  else if (req.params.screen == 2) {
    charge_type = req.body.charge_type;
    desc = 'statutory-provisions' }
  else if (req.params.screen == 3)
    desc = 'document'
  else if (req.params.screen == 4)
    desc = 'term'
  else if (req.params.screen == 5)
    desc = 's8'
  else if (req.params.screen == 6)
    desc = 's52'
  else if (req.params.screen == 7)
    desc = 'add-info'
  else if (req.params.screen == 8)
    desc = 'orig-auth'
  else if (req.params.screen == 9)
    desc = 'where'
  else if (req.params.screen == 10)
    desc = 'where-uprn'
  else if (req.params.screen == 11)
    desc = 'submit'
  else if (req.params.screen == 12)
    desc = 'confirm'
  res.render('llc-' + '01' + '/create/create_' +req.params.screen + '-' + desc,
    {'title' : '', 'today' : today, 'charge_type' : charge_type});
});

router.get('/llc-02/register-:screen', function (req, res) {
  desc = '';
  today = '';
  charge_type = '';
  if (req.params.screen == 1)
    desc = 'charge-type'
  else if (req.params.screen == 2) {
    req.session.charge_type = req.body.charge_type;
    desc = 'where' }
  else if (req.params.screen == 3)
    desc = 'where-map'
  else if (req.params.screen == 4)
    desc = 'description'
  else if (req.params.screen == 5)
    desc = 'law'
  else if (req.params.screen == 6)
    desc = 'instrument'
  else if (req.params.screen == 7)
    desc = 'further-info'
  else if (req.params.screen == 8)
    desc = 'term'
  else if (req.params.screen == 9)
    desc = 'submit'
  else if (req.params.screen == 10)
    desc = 'confirm'
  res.render('llc-' + '02' + '/register/register_' + req.params.screen + '-' + desc,
    {'title' : '', 'today' : today, 'charge_type' : session.charge_type });
});

router.all('/llc-03/register-:screen', function (req, res) {
  desc = '';
  next = '';
  if (req.params.screen == 0) {
    next = 1;
    desc = 'charge-type'
  }
  if (req.params.screen == 1) {
    req.session.charge_type = req.body.charge_type;
    next = 2;
    desc = 'legal'
  }
  else if (req.params.screen == 2) {
    req.session.act_agree = S(req.body.act_agree).chompLeft(',').s;
    req.session.section = req.body.section;
    next = 31;
    desc = 'where-search'
  }
  else if (req.params.screen == 31) {
    req.session.search_term = req.body.search_term;
    //TODO test if search param = exeter and go to city map 41
    next = 32;
    desc = 'where-search-results'
  }
  else if (req.params.screen == 32) {
    req.session.search_term = req.body.search_term;
    next = 42;
    desc = 'where-map-address'
  }
  else if (req.params.screen == 42) {
    next = 6;
    desc = 'description'
  }
  else if (req.params.screen == 6) {
    req.session.description = req.body.description;
    next = 7;
    desc = 'further-info'
  }
  else if (req.params.screen == 7) {
    req.session.further_info = req.body.further_info;
    req.session.reference = req.body.reference;
    next = 8;
    desc = 'instrument'
  }
  else if (req.params.screen == 8) {
    req.session.instrument = req.body.instrument;
    req.session.creation_date = req.body.doc_day + "/" +req.body.doc_month + "/" +req.body.doc_year;
    next = 9;
    desc = 'term'
  }
  else if (req.params.screen == 9) {
    req.session.expiry = req.body.expiry;
    next = 10;
    desc = 'submit'
  }
  else if (req.params.screen == 10) {
    next = 11;
    desc = 'confirm'
    req.session.destroy;
  }
  res.render('llc-' + '03' + '/register/register_' + next + '-' + desc,
    {'title' : '',
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
    });
});

router.all('/llc-03/register-:screen/address=:address', function (req, res) {
  req.session.address = req.params.address;
  next = 42;
  desc = 'where-map-address';
  res.render('llc-' + '03' + '/register/register_' + next + '-' + desc,
    {'title' : '',
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
    });
});


module.exports = router;