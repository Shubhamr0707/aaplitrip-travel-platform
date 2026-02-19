# 🌍 AapliTrip - TravelMates 🚀

A comprehensive travel platform for booking trips, discovering destinations, and seamlessly managing travel experiences. **TravelMates** (AapliTrip) connects travelers with their dream destinations, offering secure bookings, easy payments, and comprehensive trip management.

---

## 🌟 Key Features

### for Users 👤
*   **Secure Authentication**: Easy Sign-up and Login using JWT-based authentication.
*   **Destination Discovery**: Browse a wide range of curated travel destinations with detailed information.
*   **Trip Booking**: Simple and intuitive booking process for your next adventure.
*   **My Bookings**: Manage your current and past bookings in one place.
*   **Secure Payments**: Integrated with **Razorpay** for safe and hassle-free transactions.
*   **Contact & Support**: Easy way to get in touch for queries or support.

### for Admins 🛡️
*   **Admin Dashboard**: Overview of platform activities.
*   **Manage Destinations**: Add, update, or remove travel destinations.
*   **Monitor Bookings**: View and manage user bookings.

---

## 🛠️ Technology Stack

### Frontend 🖥️
*   **React** (v19) - A JavaScript library for building user interfaces.
*   **Vite** - Next Generation Frontend Tooling for faster development.
*   **Bootstrap 5** & **React Bootstrap** - For responsive, mobile-first web development.
*   **React Router** (v7) - Dynamic routing for React applications.
*   **Axios** - Promise-based HTTP client for the browser.
*   **React Toastify** - For elegant notifications.

### Backend ⚙️
*   **Java 21** - The latest LTS version of Java.
*   **Spring Boot 3** (v3.2.3) - Framework for building production-ready applications.
*   **Spring Security & JWT** - Robust security and stateless authentication.
*   **Spring Data JPA** - Simplifies database access and manipulation.
*   **MySQL** - Reliable relational database management system.
*   **Razorpay** - Secure payment gateway integration.
*   **Lombok** - Reduces boilerplate code.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

*   **Java JDK 21** or higher
*   **Node.js** (v18+) & **npm**
*   **MySQL Server**
*   **Maven**

### 1. Database Setup 🗄️

1.  Open your MySQL command line or a GUI tool (like Workbench).
2.  Create a database named `travelmates_db`:
    ```sql
    CREATE DATABASE travelmates_db;
    ```
3.  (Optional) The application uses `hibernate.ddl-auto=update`, so tables will be created automatically upon the first run.

### 2. Backend Setup (`backend/`)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Open `src/main/resources/application.properties` and configure your database credentials:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/travelmates_db?createDatabaseIfNotExist=true
    spring.datasource.username=YOUR_MYSQL_USERNAME  # e.g., root
    spring.datasource.password=YOUR_MYSQL_PASSWORD
    ```
3.  Configure JWT and Razorpay keys in the same file:
    ```properties
    # Razorpay Configuration
    razorpay.key_id=YOUR_RAZORPAY_KEY_ID
    razorpay.key_secret=YOUR_RAZORPAY_KEY_SECRET

    # JWT Configuration
    jwt.secret=YOUR_SECURE_JWT_SECRET_KEY
    jwt.expiration=86400000
    ```
4.  Build and run the backend application:
    ```bash
    mvn spring-boot:run
    ```
    The backend server will start at `http://localhost:8080`.

### 3. Frontend Setup (`frontend/`)

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend application will form at `http://localhost:5173`.

---

## 📂 Project Structure

```
AapliTrip/
├── backend/            # Spring Boot Backend
│   ├── src/main/java   # Java Source Code
│   ├── src/main/resources # Configuration & Static Files
│   └── pom.xml         # Maven Dependencies
│
└── frontend/           # React Frontend
    ├── src/            # React Components & Pages
    ├── public/         # Static Assets
    └── package.json    # NPM Dependencies
```

---

## 📸 Screenshots

*(Add screenshots of your application here)*

| Home Page | Destination Details |
| :---: | :---: |
| ![Home Page Placeholder](https://via.placeholder.com/600x400?text=Home+Page) | ![Destination Placeholder](https://via.placeholder.com/600x400?text=Destination+Details) |

| Booking Form | Admin Dashboard |
| :---: | :---: |
| ![Booking Placeholder](https://via.placeholder.com/600x400?text=Booking+Form) | ![Admin Placeholder](https://via.placeholder.com/600x400?text=Admin+Dashboard) |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed by [Your Name/Team Name]**
