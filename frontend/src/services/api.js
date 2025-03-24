import axios from 'axios';

const API_URL = "http://localhost:5000/api";

export const fetchProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (product) => axios.post(`${API_URL}/products/add`, product);
export const generateBill = (bill) => axios.post(`${API_URL}/bills/generate`, bill);
export const fetchBills = () => axios.get(`${API_URL}/bills`);


export const fetchDashboardStats = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/dashboard/stats");
        return res.data;
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return {
            totalProducts: 0,
            totalInvoices: 0,
            totalRevenue: 0,
            lowStockItems: 0
        };
    }
};

