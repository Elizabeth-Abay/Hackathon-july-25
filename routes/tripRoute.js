const express = require('express')
const TokenDecoder = require('../middleware/tokenDecoder')
const TripController = require('../controller/tripController')
const Validator = require('../middleware/schemaValidator');
const TripSchema = require('../schemas/tripSchema')


const tripRouter = express.Router()
const tripController = new TripController()
const validatorObj = new Validator()


tripRouter.get('/' ,TokenDecoder.accessDecode, tripController.getAll);
tripRouter.get('/filter' , TokenDecoder.accessDecode , validatorObj.queryParamValidator(TripSchema.filterByInitial) ,tripController.filterByInitial);


module.exports = tripRouter