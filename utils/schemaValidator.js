class Validator {
    static validatorCreator(schema, data) {
        const { error, value } = schema.validate(
            data, {
            abortEarly: false
        }
        )

        if (error) {
            // err.details is an array of obj
            let reason = error.details.map(i => i.message).join(', ');
            error.from = `Validating the schema ${schema} `;
            error.message = reason
            throw error
        }


        return {
            data: value
        }

    }

}

module.exports = Validator;