const TripService = require('../service/tripService');

const tripService = new TripService()

class TripController {
    async getAll(req, res, next) {
        try {
            // let { id , role } = req.decodedAccess || null;
            let role ; // deleted
            if (role == null) role = 'user'
            // id ,
            let result = await tripService.getAll({  role })

            return result.success ?
                res.status(200).json(result)
                :
                res.status(400).json(result)

        } catch (err) {
            if (typeof err === 'object' && !err.from) {
                err.from = 'TripController.getAll'
            }

            next(err)
        }
    }

    async filterByInitial(req, res, next) {
        try {
            let { initialPlace } = req.validatedQueryParams

            let result = await tripService.filterByInitial(initialPlace)

            return result.success ?
                res.status(200).json(result)
                :
                res.status(400).json(result)

        } catch (err) {
            if (typeof err === 'object' && !err.from) {
                err.from = 'TripController.filterByInitial'
            }

            next(err)
        }
    }


    // async filterByDestination(){
    //     try{

    //     }catch (err){
    //         if (typeof err === 'object' && !err.from){
    //             err.from = 'TripController.filterByDestination'
    //         }
    //         next(err)
    //     }
    // }


    // async filterByPrice(req , res , next){
    //     try{

    //     }catch (err){
    //         if (typeof err === 'object' && !err.from){
    //             err.from = 'TripFilterController.filterByPrice'
    //         }

    //         next(err)
    //     }
    // }
}

module.exports = TripController