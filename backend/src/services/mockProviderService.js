const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily"];
const lastNames = ["Smith", "Johnson", "Brown", "Williams", "Miller", "Taylor"];

const getRandomItem = (items) => {
    return items[Math.floor(Math.random() * items.length)];
};

const generateMockEmployees = (providerName, count) => {
    return Array.from({
        length: count
    }).map((_, index) => {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const externalNumber = 1000 + index;

        if (providerName === "Workday") {
            return {
                workerId: `WD-${externalNumber}`,
                first_name: firstName,
                last_name: lastName,
                work_email: `${firstName}.${lastName}@workday-demo.com`.toLowerCase(),
            };
        }

        return {
            associateId: `ADP-${externalNumber}`,
            givenName: firstName,
            familyName: lastName,
            email: `${firstName}.${lastName}@adp-demo.com`.toLowerCase(),
        };
    });
};

module.exports = {
    generateMockEmployees,
};