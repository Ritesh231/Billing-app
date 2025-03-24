// frontend/src/components/Report.js
import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import './Report.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Report = () => {
  const [reportData, setReportData] = useState({
    totalProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    productsByCategory: {},
    monthlyRevenue: {}
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const res = await axios.get('http://billing-app-1.onrender.com/api/reports/summary');
      setReportData(res.data);
    } catch (err) {
      console.error("Failed to fetch report:", err);
    }
  };

  const pieData = Object.entries(reportData.productsByCategory || {}).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(reportData.monthlyRevenue || {}).map(([month, revenue]) => ({ month, revenue }));

  return (
    <div className="report-container">
      <h2>Dashboard Report</h2>

      <div className="summary-cards">
        <div className="card">Total Products: <strong>{reportData.totalProducts}</strong></div>
        <div className="card">Total Invoices: <strong>{reportData.totalInvoices}</strong></div>
        <div className="card">Total Revenue: <strong>₹{reportData.totalRevenue}</strong></div>
        <div className="card">Low Stock Items: <strong>{reportData.lowStockItems}</strong></div>
      </div>

      <div className="charts-section">
        <div className="chart-wrapper">
          <h3>Products by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h3>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Report;
