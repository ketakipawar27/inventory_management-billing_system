# Inventory & Billing Management System

A professional, offline-first Inventory Management and Billing solution designed for small to medium-sized businesses. This system provides a seamless experience for tracking stock, managing purchases, generating bills, and analyzing business performance.

## 🚀 Key Features

### 📊 Comprehensive Dashboard
*   **Real-time Analytics:** Track total inventory value, net revenue, and realized profit at a glance.
*   **Receivables Tracking:** Monitor pending payments from customers.
*   **Stock Alerts:** Visual indicators for low-stock items to prevent stockouts.
*   **Activity Feed:** A quick view of recent sales and purchase transactions.

### 📦 Inventory & Category Management
*   **Product Tracking:** Manage products with variants, categories, and SKU details.
*   **Smart Pricing:** Automated calculation of Weighted Average Cost (WAC) for accurate profit reporting.
*   **Stock Control:** Set minimum stock levels for automated alerts.
*   **Categorization:** Organize your catalog with customizable product categories.

### 💰 Billing & Sales (POS)
*   **Modern Billing Interface:** Fast and intuitive POS-style interface for creating sales.
*   **Customer Management:** Record customer names, contact info, and addresses for every sale.
*   **Flexible Payments:** Support for Cash, Online, and Pending (Credit) payment methods.
*   **Instant Inventory Sync:** Stock levels are automatically updated upon bill generation.

### 📥 Purchase Management
*   **Stock Inwarding:** Record purchases from dealers with detailed itemized entries.
*   **Cost Management:** Automatically updates product purchase prices and stock quantities.
*   **Dealer History:** Keep track of where your stock is coming from.

### 🔒 Security & Privacy
*   **Secure Authentication:** Protected login system to prevent unauthorized access.
*   **Session Lock:** Quick-lock feature to secure the screen without logging out.
*   **Data Portability:** Uses a local SQLite database, making the entire system portable and private.

---

## 🛠️ Tech Stack

*   **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
*   **UI Components:** Framer Motion (Animations), Lucide React (Icons)
*   **Backend:** Django, Django REST Framework (Python)
*   **Database:** SQLite (Local & Portable)
*   **API:** RESTful Architecture

---

## ⚙️ How the System Works

1.  **Inventory Setup:** Users start by creating categories and adding products with their initial stock and pricing.
2.  **Purchasing:** When new stock arrives, it is recorded in the "Purchases" section. The system automatically recalculates the **Weighted Average Cost** of the products to ensure profit margins are calculated accurately.
3.  **Sales:** Using the "Billing" section, users create invoices for customers. The system validates stock availability, deducts the sold quantity, and records the sale.
4.  **Analysis:** The Dashboard aggregates data from all sales and purchases to show a clear picture of business health, including cash flow and inventory investment.

---

## 📦 Installation & Setup

### Prerequisites
*   Node.js (for frontend development)
*   Python 3.10+ (for backend)

### Backend Setup
1. Navigate to the `backend` folder.
2. Create a virtual environment: `python -m venv venv`.
3. Activate venv: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows).
4. Install dependencies: `pip install -r requirements.txt`.
5. Run migrations: `python manage.py migrate`.
6. Start the server: `python manage.py runserver`.

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

---

## 📝 License
This project is private and intended for internal business use.
