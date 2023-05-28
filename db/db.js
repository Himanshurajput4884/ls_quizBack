const cassandra = require("cassandra-driver");
const datacenter="datacenter1";
const contactPoints = ['localhost'];

const client = new cassandra.Client({
    contactPoints: contactPoints,
});


module.exports = client;