import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || "https://billing-app-1.onrender.com/api";

export const fetchProducts = async () => {
    try {
        console.log("📡 Fetching products from:", `${API_URL}/products`);
        const res = await axios.get(`${API_URL}/products`);
        console.log("✅ API Response:", res.data);
        return res;
    } catch (error) {
        console.error("❌ Fetch Products Error:", error);
        return { data: [] }; // Avoids crashing the UI
    }
};

export const addProduct = (product) => axios.post(`${API_URL}/products/add`, product);
export const generateBill = (bill) => axios.post(`${API_URL}/bills/generate`, bill);
export const fetchBills = () => axios.get(`${API_URL}/bills`);



export const fetchDashboardStats = async () => {
    try {
        const res = await axios.get("https://billing-app-1.onrender.com/api/dashboard/stats");
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

