import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionTable from './TransactionTable.jsx';

const TicketSalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/api/reports/revenue-details');
        setTransactionData(res.data || []);
      } catch (err) {
        console.error('Failed to load transactions');
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get('/api/reports/ticket-sales');
        console.log("📦 Ticket Sales Response:", res.data);
        setSalesData(res.data);
      } catch (err) {
        setError('Failed to fetch ticket sales report.');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);
  

  if (loading) return <div>Loading ticket sales report...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="table-container">
      <h2 style={{ padding: '1rem', color: 'black' }}>🎟️ Ticket Sales Summary</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Ticket Type</th>
            <th>Total Sold</th>
            <th>Monthly Average</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((row, index) => (
            <tr key={index}>
              <td>{row.ticket_type}</td>
              <td>{row.total_sold}</td>
              <td>{row.monthly_avg}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TransactionTable transactions={transactionData} />
    </div>
  );
};

export default TicketSalesReport;