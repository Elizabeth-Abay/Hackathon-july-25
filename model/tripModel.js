const pg = require('../config/pgConfig')

class TripModel {
    async getAll() {
        try {
            let query = ` SELECT id , initial_place ,destination , price FROM  trips LIMIT 100`

            let result = await pg.query(query)

            return (result.rowCount === 0)
                ?
                {
                    success: false,
                    reason: "No trip is there"
                }
                :
                {
                    success: true,
                    data: result.rows
                }

        } catch (err) {
            if (err.type === 'obj' && !err.from) {
                err.from = 'TripModel.getAll'
            }

            throw err
        }

    }


    async getAllForAgent(id) {
        try {
            let query = ` 
                SELECT id , 
                initial_place ,
                destination , 
                price 
                FROM trips 
                WHERE 
                created_by = $1 
                LIMIT 100
            `
            let values = [id]

            let result = await pg.query(query , values)

            return (result.rowCount === 0)
                ?
                {
                    success: false,
                    reason: "No trip is there"
                }
                :
                {
                    success: true,
                    data: result.rows
                }

        } catch (err) {
            if (err.type === 'obj' && !err.from) {
                err.from = 'TripModel.getAll'
            }

            throw err
        }
    }


    async filterInitial(initialPlace) {
        try {
            let query = `
            SELECT id ,destination , price
            FROM trips WHERE initial_place = $1
            `

            let values = [initialPlace]

            let result = await pg.query(query, values)

            return (result.rowCount === 0)
                ?
                {
                    success: false,
                    reason: "No trip is there"
                }
                :
                {
                    success: true,
                    data: result.rows
                }


        } catch (err) {
            if (err.type === 'obj' && !err.from) {
                err.from = 'TripModel.filterInitial'
            }

            throw err
        }

    }

}


module.exports = TripModel