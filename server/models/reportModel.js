const db = require('../config/db.js');

exports.getRainoutsPerMonth = async () => {
  const query = `
    SELECT
      YEAR(Wtr_created) AS year,
      MONTH(Wtr_created) AS month,
      COUNT(*) AS rainouts
    FROM weather
    WHERE Wtr_level = 'Severe'
      AND Is_park_closed = 1
      AND Wtr_cond NOT IN ('Sunny', 'Foggy')
    GROUP BY YEAR(Wtr_created), MONTH(Wtr_created)
    ORDER BY year, month;
  `;

  try {
    const [rainouts] = await db.query(query);
    if (rainouts.length === 0) {
      throw new Error('No rainouts found for the given criteria');
    }
    return rainouts;
  } catch (error) {
    throw new Error('Error fetching rainouts data: ' + error.message);
  }
};

exports.getRainoutRows = async () => {
  const query = `
    SELECT
      w.Wtr_id,
      w.Wtr_created,
      w.Wtr_level,
      w.Wtr_cond,
      w.Is_park_closed,
      (
          SELECT COALESCE(SUM(pp.quantity_sold), 0)
          FROM product_purchases pp
          WHERE DATE(pp.visit_date) = DATE(w.Wtr_created)
            AND pp.product_type = 'Ticket'
      ) AS Tickets_sold
  FROM weather w
  WHERE w.Wtr_level = 'Severe'
    AND w.Is_park_closed = 1
    AND w.Wtr_cond NOT IN ('Sunny', 'Foggy')
  ORDER BY w.Wtr_created ASC;
  `;

  try {
    const [rows] = await db.query(query);
    if (rows.length === 0) {
      throw new Error('No rainout entries found');
    }
    return rows;
  } catch (error) {
    throw new Error('Error fetching rainout rows: ' + error.message);
  }
};

/*exports.getTotalRevenue = async () => {
  // Return mock data instead of querying the database
  return {
    ticketRevenue: 12000.50,
    merchRevenue: 8700.25,
    totalRevenue: 20700.75
  };
};*/

exports.getRevenueSummary = async () => {
  const query = `
  SELECT 
    SUM(CASE WHEN pp.product_type = 'Ticket' THEN pp.total_amount ELSE 0 END) AS ticketRevenue,
    SUM(CASE WHEN pp.product_type = 'Merchandise' THEN pp.total_amount ELSE 0 END) AS merchRevenue,
    SUM(CASE WHEN pp.product_type = 'Food' THEN pp.total_amount ELSE 0 END) AS foodRevenue,
    SUM(CASE WHEN pp.product_type = 'Service' THEN pp.total_amount ELSE 0 END) AS serviceRevenue,
    SUM(pp.total_amount) AS totalRevenue
  FROM product_purchases pp;
  `;

  try {
    const [results] = await db.query(query);
    if (!results || results.length === 0) {
      throw new Error('No revenue data found');
    }
    return results[0]; 
  } catch (error) {
    throw new Error('Error fetching revenue summary: ' + error.message);
  }
};

exports.getRevenueDetails = async () => {
  const query = `
    SELECT 
      pp.product_type,
      pp.quantity_sold,
      pp.purchase_price,
      pp.total_amount,
      pp.purchase_created,
      v.First_name,
      v.Last_name
    FROM product_purchases pp
    LEFT JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
    LEFT JOIN visitors v ON t.Visitor_ID = v.Visitor_ID
  `;

  try {
    const [results] = await db.query(query);
    return results;
  } catch (error) {
    throw new Error('Error fetching revenue details with visitor info: ' + error.message);
  }
};

exports.getTopRidePerMonth = async () => {
    const query = `
      SELECT
        YEAR(ride_date) AS year,
        MONTH(ride_date) AS month,
        r.Ride_name
      FROM visitor_ride_log as v, rides as r
      WHERE v.Ride_ID = r.Ride_ID
      GROUP BY YEAR(ride_date), MONTH(ride_date)
      ORDER BY year, month;
    `;
    try {
      console.log("Executing query:", query); 
      const [rainouts] = await db.query(query);
      if (rainouts.length === 0) {
        throw new Error('No data found for the given criteria');
      }
      return rainouts;
    } catch (error) {
      console.error("Database query error:", error); 
      throw new Error('Error fetching monthly ride data: ' + error.message);
    }
};  
exports.getTicketsSoldToday = async () => {
  const query = `
    SELECT SUM(quantity_sold) AS total_tickets
    FROM product_purchases
    WHERE product_type = 'Ticket'
      AND DATE(purchase_created) = CURDATE();
  `;
  const [results] = await db.query(query);
  return results[0].total_tickets || 0;
};

exports.getTicketSalesTrends = async () => {
  const query = `
    SELECT
      tt.ticket_type,
      DATE_FORMAT(pp.purchase_created, '%Y-%m-%d') AS day,
      DATE_FORMAT(pp.purchase_created, '%Y-%u') AS week,
      DATE_FORMAT(pp.purchase_created, '%Y-%m') AS month,
      DATE_FORMAT(pp.purchase_created, '%Y') AS year,
      SUM(pp.quantity_sold) AS total_sold
    FROM product_purchases pp
    JOIN ticket_type tt ON pp.product_id = tt.ticket_id
    WHERE pp.product_type = 'Ticket'
    GROUP BY tt.ticket_type, day, week, month, year
    ORDER BY day;
  `;
  const [results] = await db.query(query);
  return results;
};

exports.getTotalVisitorsToday = async () => {
    const [data] = await db.query(
        'SELECT COUNT(*) AS visitors_today FROM product_purchases WHERE visit_date = CURDATE()');
    return data;
};

