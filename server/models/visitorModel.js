const db = require('../config/db.js');

exports.findUserByEmail = async (email) => {
    const [user] = await db.query('SELECT * FROM visitors WHERE email = ?', [email]);
    return user.length > 0 ? user[0] : null;  // Ensure it doesn't return undefined
};

exports.createUser = async (userData) => { // ✅ Changed `createUsers` → `createUser`
    const { first_name, last_name, email, password, phone, address } = userData;
    await db.query(
        'INSERT INTO visitors (First_name, Last_name, Email, Password, Phone, Address) VALUES (?, ?, ?, ?, ?, ?)',
        [first_name, last_name, email, password, phone, address]
    );
};

exports.getAllUsers = async () => {
    const [users] = await db.query('SELECT * FROM visitors');
    return users;
};

exports.getUserById = async (id) => {
    const [user] = await db.query('SELECT * FROM visitors WHERE Visitor_ID = ?', [id]);
    return user.length > 0 ? user[0] : null;  // Ensure it doesn't return undefined
};

// ✅ Added missing updateUserById function
exports.updateUserById = async (id, userData) => {
    const { first_name, last_name, email, phone, address } = userData;
    await db.query(
        'UPDATE visitors SET First_name = ?, Last_name = ?, Email = ?, Phone = ?, Address = ? WHERE Visitor_ID = ?',
        [first_name, last_name, email, phone, address, id]
    );
};

// ✅ Added missing getOrderHistoryByUserId function
exports.getOrderHistoryByUserId = async (id) => {
    const [orders] = await db.query(
        'SELECT * FROM orders WHERE Visitor_ID = ?',
        [id]
    );
    return orders;
};

exports.deleteAllUsers = async () => {
    await db.query('DELETE FROM visitors');
};

exports.deleteUserById = async (id) => {
    await db.query('DELETE FROM visitors WHERE Visitor_ID = ?', [id]);
};
