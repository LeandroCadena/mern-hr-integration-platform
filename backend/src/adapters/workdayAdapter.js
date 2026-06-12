const normalizeWorkdayEmployee =
    (employee) => {

        return {

            externalId:
                employee.workerId,

            firstName:
                employee.first_name,

            lastName:
                employee.last_name,

            email:
                employee.work_email

        };

    };

module.exports = {
    normalizeWorkdayEmployee
};