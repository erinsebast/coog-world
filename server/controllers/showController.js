const showModel = require('../models/showModel.js');
const db = require('../config/db.js');

exports.createShow = async (req, res) => {
    try {
        const {Show_name, Stage_ID, Show_start, Show_end, Perf_num, Show_date, Show_cost} = req.body;
        const showId = await showModel.createShow({Show_name, Stage_ID, Show_start, Show_end, Perf_num, Show_date, Show_cost});
        res.status(201).json({id: showId, Show_name, Stage_ID, Show_start, Show_end, Perf_num, Show_date, Show_cost});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateShow = async (req, res) => {
    try {
        const showID = req.params.id;
        const updatedData = req.body;
        const selectedShow = {...updatedData, Show_ID: showID};
        const updatedShow = await showModel.updateShow(selectedShow);
        if(!updatedShow){
            return res.status(404).json({message: 'Show not found or not updated.'});
        }
        res.status(200).json({message: 'Show updated successfully.', show: updatedData});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllShows = async (req, res) => {
    try {
        const shows = await showModel.getAllShows();
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getShowForCard = async (req, res) => {
    try {
        const show = await showModel.getShowForCard();
        res.status(200).json(show);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getShowInfo = async (req, res) => {
    try {
        const shows = await showModel.getShowInfo();
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getShowById = async (req, res) => {
    try {
        const show = await showModel.getShowById(req.params.id);
        if(!show){
            return res.status(404).json({message: 'Show not found'});
        }
        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllShows = async (req, res) => {
    try {
        await showModel.deleteAllShows();
        res.status(200).json({message: 'All shows deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteShowById = async (req, res) => {
    try {
        const {Show_ID} = req.body;
        if(!Show_ID){
            res.status(400).json({message: 'Invalid show ID.'});
        }
        await showModel.deleteShowById(Show_ID);
        res.status(200).json({message: 'Show deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.logVisitorShow = async (req, res) => {
    const {Visitor_ID, Show_ID} = req.body;
    if (!Visitor_ID || !Show_ID) {
        return res.status(400).json({ message: 'Visitor_ID and Show_ID are required.' });
    }
    try {
        await db.query(
            'INSERT INTO visitor_show_log (Visitor_ID, Show_ID) VALUES (?, ?)',
            [Visitor_ID, Show_ID]);
        res.status(200).json({success: true, message: 'Show Logged Successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Failed to log show.', error: error.message});
    }
};

exports.getVisitorShowHistory = async (req, res) => {
    const visitorId = req.params.id;
    try {
        const history = await showModel.getVisitorShowHistory(visitorId);
        res.status(200).json({shows: history});
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch watch history.', error: error.message})
    }
};