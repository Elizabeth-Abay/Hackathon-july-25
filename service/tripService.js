const TripModel = require('../model/tripModel')

const tripModel = new TripModel()

class TripService {
    async getAll({ role, id }) {
        try {
            let result;

            // if role is user
            if (role === 'user' || role == null) {
                // maybe if we allow users to see things
                result = await tripModel.getAll()
            } 
            else if (role === 'agent'){
                result = await tripModel.getAllForAgent(id)
            }

            return result;

        } catch (err) {
            if (typeof err === 'object' && !err.from) {
                err.from = 'TripService.getAll'
            }

            throw err
        }
    }

    async filterByInitial(initialPlace) {
        try {
            let result = await tripModel.filterByInitial(initialPlace);

            return result;

        } catch (err) {
            if (typeof err === 'object' && !err.from) {
                err.from = 'TripService.filterByInitial'
            }

            throw err
        }
    }

}

module.exports = TripService