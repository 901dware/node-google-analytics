var express = require('express');
var router = express.Router();

const {google} = require('googleapis');
const analyticsreporting = google.analyticsreporting({
  version: 'v4'
});

/* GET users listing. */
router.post('/', async function(req, res, next) {

	await analyticsreporting.reports.batchGet(req.body).then(ret =>{
		//console.log(ret.data)
		res.send(JSON.stringify(ret.data));
	}).catch(err => {
		console.log(err);
		res.status(500).send({ error: err })
	});
	/*const result = await google.analytics('v3').data.ga.get({
    'ids': 'ga:' + 197429504,
    'start-date': '30daysAgo',
    'end-date': 'today',
    'metrics': 'ga:pageviews'
  })*/
	//console.log(JSON.stringify(result.data));
	
});

module.exports = router;
