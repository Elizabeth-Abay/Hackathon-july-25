const joi = require('joi')

class TripSchema{
    static filterByInitial = joi.object({
        initialPlace : joi.string().required().trim().lowercase()
    })

}


module.exports = TripSchema