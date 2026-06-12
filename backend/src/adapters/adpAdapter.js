const normalizeADPEmployee =
    (employee) => {

        return {

            externalId:
                employee.associateId,

            firstName:
                employee.givenName,

            lastName:
                employee.familyName,

            email:
                employee.email

        };

    };

module.exports = {
    normalizeADPEmployee
};