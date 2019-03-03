/*/
 *
 * Garage REST API
 * REST API that responds with data from garage_db
 *
/*/ 
 
//InfluxDB Library
const Influx = require('influx');

//Environment Variable Import
const dotenv = require('dotenv');
dotenv.config({path:'/opt/www/garageapi/.env'});

const express = require('express');

//Influx Connection
const garageDB = new Influx.InfluxDB({
	host: 'localhost',
	port: 8086,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: 'garage_db',
	schema: [
		{
			measurement: 'load',
			tags: [
				'garage',
				'weekday',
				'hour',
				'minute'
			],
			fields: {
				available: Influx.FieldType.INTEGER
			}
		}
	]
});

const app = express();

//Get Current Load of Garages
app.get('/garages', function (req, res) {
	garageDB.query(`
		SELECT * FROM load
		ORDER BY time DESC
		LIMIT 7
	`).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
});

//Basic Seasonal Prediction
app.get('/prediction/:weekday/:hour/:minute', function (req, res) {
	garageDB.query(`
		SELECT * FROM load
		WHERE weekday=${Influx.escape.stringLit(req.params.weekday)}
		AND hour=${Influx.escape.stringLit(req.params.hour)}
		AND minute=${Influx.escape.stringLit(req.params.minute)}
		ORDER BY time DESC
		LIMIT 7
	`).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
});

//Seasonal Prediction Using Holt Winters - In Progress
app.get('/predictionHW/:weekday/:hour/:minute', function (req, res) {
	garageDB.query(`
		SELECT * FROM load
		WHERE weekday=${Influx.escape.stringLit(req.params.weekday)}
		AND hour=${Influx.escape.stringLit(req.params.hour)}
		AND minute=${Influx.escape.stringLit(req.params.minute)}
		ORDER BY time DESC
		LIMIT 7
	`).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
}

//Listen on Port
app.listen(8080, () => {
	console.log("Server Running on Port 8080");
});

