var express = require('express');
var router = express.Router();
var datetime = new Date();

/**
 * Main index page route
 */
router.get('/', function (req, res) {
  var prototypes = [];

    res.render('index', {
      prototypes: prototypes
    });
});

router.get('/llc-:version/create-:screen', function (req, res) {
  desc = '';
  today ='';
  charge_type='';
  if (req.params.screen == 1) {
    desc = 'charge-type' }
  else if (req.params.screen == 2) {
    charge_type = req.body.charge_type;
    desc = 'statutory-provisions'}
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
  res.render('llc-' + req.params.version + '/create/create_' +req.params.screen + '-' + desc,
    {'title' : '', 'today' : today, 'charge_type' : 'light obstruction notice'});
});

module.exports = router;