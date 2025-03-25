import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchProducts, addProduct } from "../services/api";
import "./productmodel.css";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    console.log("📡 Fetching products...");
    try {
        const res = await fetchProducts();
        console.log("✅ API Response:", res.data); // Debug API response
        
        if (!Array.isArray(res.data)) {
            console.error("❌ Unexpected API response format:", res.data);
            return;
        }

        setProducts(res.data);
        console.log("🟢 Products state updated:", res.data);
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        alert("Failed to load products.");
    }
};

  
  
  useEffect(() => {
    console.log("🟢 useEffect triggered, calling loadProducts...");
    loadProducts();
  }, []);
  

  const handleAddOrUpdateProduct = async () => {
    const productData = {
      name: newProduct.name.trim(),
      description: newProduct.description?.trim(),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      sku: newProduct.sku?.trim(),
    };
  
    if (!productData.name || isNaN(productData.price) || isNaN(productData.stock)) {
      alert("Please fill out all fields with valid data.");
      return;
    }
  
    try {
      let res;
      if (isEditing) {
        // ✅ UPDATE PRODUCT (PUT request)
        console.log("🔧 Editing product ID:", editingId);
        console.log("🔧 Sending data:", productData);
        res = await axios.put(
          `https://billing-app-1.onrender.com/api/products/${editingId}`,
          productData
        );
        console.log("✅ Response from backend:", res.data);
        alert("✅ Product updated!");
      } else {
        // ✅ ADD NEW PRODUCT (POST request)
        console.log("🆕 Adding product:", productData);
        res = await axios.post(
          "https://billing-app-1.onrender.com/api/products/add",
          productData
        );
        console.log("✅ Response from backend:", res.data);
        alert("✅ Product added!");
      }
  
      setNewProduct({ name: "", description: "", price: "", stock: "", sku: "" });
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      loadProducts(); // ✅ Refresh products list
    } catch (err) {
      console.error("❌ API error:", err);
      alert("Error adding/updating product. Check console for details.");
    }
  };
  
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`https://billing-app-1.onrender.com/api/products/${productId}`);
      alert("🗑️ Product deleted!");
      loadProducts();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (product) => {
    setShowForm(true);
    setIsEditing(true);
    setEditingId(product._id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
    });
  };

  
  

  return (
    <div className="product-manager-container">
      <h2>Products</h2>
      <button
        className="add-product-btn"
        onClick={() => {
          setShowForm(true);
          setIsEditing(false);
          setNewProduct({ name: "", description: "", price: "", stock: "", sku: "" });
        }}
      >
        + Add Product
      </button>

      {showForm && (
        <div className="add-product-form">
          <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
          <input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <textarea
            placeholder="Description (e.g. Customer Name)"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            placeholder="Quantity"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />
          <input
            placeholder="SKU"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
          />
          <div className="form-buttons">
            <button onClick={handleAddOrUpdateProduct}>
              {isEditing ? "Update Product" : "Save Product"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setEditingId(null);
                setNewProduct({ name: "", description: "", price: "", stock: "", sku: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    {products.length > 0 ? (
        products.map(product => (
            <tr key={product._id}>
                <td><strong>{product.name}</strong></td>
                <td>{product.sku || "-"}</td>
                <td>₹{parseFloat(product.price).toFixed(2)}</td>
                <td>{product.stock ?? "N/A"}</td>
                <td className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(product)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(product._id)}>🗑️</button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="5">⚠️ No products found.</td>
        </tr>
    )}
</tbody>

      </table>
    </div>
  );
};

export default ProductManager;
