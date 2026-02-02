# Mini Service Catalog & Request App

A full-stack application for Service Providers to manage their categories and services, and for customers to view public service pages and make requests.

## 🚀 Technology Stack

-   **Backend**: Node.js, Express.js, MySQL
-   **Frontend**: React (Vite), Vanilla CSS, React Router DOM
-   **Authentication**: JWT (JSON Web Tokens)
-   **Database**: MySQL

## 📂 Project Structure

```
/
├── frontend/           # React Frontend Application
├── config/             # Database & Multer Config
├── controller/         # API Controllers
├── models/             # Database Models
├── routes/             # API Routes
├── utils/              # Validators & Helpers
├── app.js              # Backend Entry Point
└── schema.txt          # Database Schema
```

## 🛠️ Setup & Installation

### 1. Database Setup

1.  Create a MySQL database named `qelemeda` (or update `.env`).
2.  Import the schema from `schema.txt` into your database to create the necessary tables (`providers`, `catagories`, `services`, `service_requests`).

### 2. Backend Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Configure Environment Variables:
    -   Ensure `.env` exists in the root directory.
    -   Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
3.  Start the Server:
    ```bash
    npm start
    # Server usually runs on http://localhost:5000
    ```

### 3. Frontend Setup

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
4.  Open the link shown in the terminal (default: `http://localhost:5173`).

---

## ✨ Features

### Manufacturer / Provider (Protected Area)
-   **Registration & Login**: Secure account creation with password hashing and JWT.
-   **Dashboard**: Overview of service categories.
-   **Category Management**: Create, Update, Delete categories with images.
-   **Service Management**: Add specific services (prices, VAT, discounts) to categories.

### Customer (Public Area)
-   **Public Page**: Accessible via `/services/:slug` (e.g., `/services/my-company-1`).
-   **View Catalog**: Browse categories and services offered by the provider.
-   **Request Service**: Submit a request for a specific service without logging in.

## 🔗 API Endpoints

## 🔗 API Endpoints

### Provider (`/api/provider`)
-   `POST /register` - Register new provider
-   `POST /login` - Login
-   `POST /createCatagory` - Create Category (Multipart/form-data)
-   `PATCH /updateCatagory` - Update Category
-   `DELETE /deleteCatagory` - Delete Category
-   `GET /getCatagory` - Fetch Categories
-   `GET /searchCatagory` - Search Categories
-   `POST /createService` - Create Service
-   `PATCH /updateService` - Update Service
-   `DELETE /deleteService` - Delete Service
-   `GET /getService` - Get Services
-   `GET /searchService` - Search Services

### User / Public (`/api/user`)
-   `GET /getCatagory` - Get Public Categories
-   `GET /serachService` - Search Services (Note: typo in route `serach`)

//unimplemented
-   `GET /provider/:slug` - Get Provider Public Page (Added Feature)
-   `POST /request` - Submit Service Request (Added Feature)


## 📝 Notes
-   Ensure both backend and frontend servers are running simultaneously.
