const express = require('express')
const TokenDecoder = require('../middleware/tokenDecoder')
const TripController = require('../controller/tripController')
const Validator = require('../middleware/schemaValidator');
const TripSchema = require('../schemas/tripSchema')


const tripRouter = express.Router()
const tripController = TripController()
const validatorObj = Validator()


// ,TokenDecoder.accessDecode 
tripRouter.get('/' , tripController.getAll);
tripRouter.get('/filter' , validatorObj.queryParamValidator(TripSchema.filterByInitial) ,tripController.filterByInitial);


module.exports = tripRouter