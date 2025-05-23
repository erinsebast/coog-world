const rideModel = require('../models/rideModel.js');
const db = require('../config/db.js');
const url = require('url');

exports.createRide = async (req, res, body) => {
    const { Ride_name, Ride_type, Ride_loc, Ride_cost, Ride_staff } = body;
    if (!Ride_name || !Ride_type || !Ride_loc || !Ride_cost || !Ride_staff) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'All fields are required! Somethings missing.' }));
    }
    try {
        const existingRide = await rideModel.findRideByName(Ride_name);
        if (existingRide) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'A ride with that name already exits. Please try a new name.' }));
        }
        await rideModel.createRide({ Ride_name, Ride_type, Ride_loc, Ride_cost, Ride_staff });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'New ride added successfully.' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.updateRide = async (req, res, id, body) => {
    try {
        const updatedData = body;
        const selectedRide = { ...updatedData, Ride_ID: id };
        const updatedRide = await rideModel.updateRide(selectedRide);
        if (!updatedRide) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Ride not found or not updated.' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Ride updated successfully.', ride: updatedData }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getAllRides = async (req, res) => {
    try {
        const rides = await rideModel.getAllRides();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rides));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getRideInfo = async (req, res) => {
    try {
        const info = await rideModel.getRideInfo();
        if (!info) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Ride information not found.' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(info));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getRideForCard = async (req, res) => {
    try {
        const ride = await rideModel.getRideForCard();
        if (!ride) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Ride information not found.' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(ride));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getRideById = async (req, res, id) => {
    try {
        const ride = await rideModel.getRideById(id);
        if (!ride) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Ride not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(ride));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getRidesTotalCost = async (req, res) => {
    try {
        const rides = await rideModel.getRidesCost();
        if (!rides) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Rides not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rides));
    } catch (err) {
        console.error('Error fetching rides:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error fetching rides' }));
    }
};

exports.deleteAllRides = async (req, res) => {
    try {
        await rideModel.deleteAllRides();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'All rides deleted successfully.' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.deleteRideById = async (req, res, body) => {
    try {
        const { Ride_ID } = body;
        if (!Ride_ID) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid ride ID provided. Check server status.' }));
        }
        await rideModel.deleteRideById(Ride_ID);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Ride deleted successfully.' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.logVisitorRide = async (req, res, body) => {
    const { Visitor_ID, Ride_ID } = body;
    if (!Visitor_ID || !Ride_ID) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Visitor_ID and Ride_ID are required.' }));
    }
    try {
        await db.query(
            'INSERT INTO visitor_ride_log (Visitor_ID, Ride_ID) VALUES (?, ?)',
            [Visitor_ID, Ride_ID]
        );
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Ride logged successfully.' }));
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Failed to log ride.', error: err.message }));
    }
};

exports.getVisitorRideHistory = async (req, res, id) => {
    try {
        const history = await rideModel.getVisitorRideHistory(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ rides: history }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Failed to fetch ride history.', error: error.message }));
    }
};

exports.getRideStatsByMonth = async (req, res) => {
    const { query } = url.parse(req.url, true);
    const { month } = query;
    const monthFormatRegex = /^\d{4}-\d{2}$/;
    if (!month) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Month is required.' }));
    }
    if (!monthFormatRegex.test(month)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid month format. Please use YYYY-MM format.' }));
    }
    try {
        const stats = await rideModel.getRideStatsByMonth(month); 
        if (stats.length === 0) { 
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'No ride stats found for this month.' }));
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));
    } catch (error) {
        
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

exports.getDetailedRideLog = async (req, res, body) => {
    try {
        const {query} = url.parse(req.url, true);
        const {month, rideName} = query;
        let sqlquery = `
        SELECT
        r.Ride_name,
        CONCAT(v.First_name, ' ', v.Last_name) AS visitor_name,
        DATE(vrl.ride_date) AS ride_date
        FROM visitor_ride_log vrl
        JOIN rides r ON vrl.Ride_ID = r.Ride_ID
        JOIN visitors v ON v.Visitor_ID = vrl.Visitor_ID
        WHERE 1=1`;
        const params = [];
        if(month){
            sqlquery += ` AND DATE_FORMAT(vrl.ride_date, '%Y-%m') = ?`;
            params.push(month);
        }
        if(rideName){
            sqlquery += ` AND r.Ride_name = ?`;
            params.push(rideName);
        }
        sqlquery += ` ORDER BY r.Ride_name, vrl.ride_date`;
        const [rows] = await db.query(sqlquery, params);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(rows));
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: `Error while generating ride log: ${error.message}`}));
    }
};