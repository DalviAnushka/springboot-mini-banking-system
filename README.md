# Mini Banking System (Spring Boot + React)

A full-stack **banking management system** built using **Spring Boot**, **MySQL**, and **React.js**.
It supports:

- Create Account  
- Deposit / Withdraw / Transfer  
- Transaction History  
- CSV Export  
- Analytics Dashboard (Charts + KPIs)  
- Clean UI with beautiful charts  


## 🎥 Project Demo Video

> [https://drive.google.com/file/d/11nFrPyCOZUTolOsaDwUjEWC78DCIWefk/view?usp=sharing](https://drive.google.com/file/d/11nFrPyCOZUTolOsaDwUjEWC78DCIWefk/view?usp=sharing)

## 📸 Screenshots

### 🏠 Dashboard

![Dashboard Screenshot](https://raw.githubusercontent.com/DalviAnushka/springboot-mini-banking-system/main/screenshots/dashboard.png)

### 💸 Transaction Page

![Transaction Screenshot](https://raw.githubusercontent.com/DalviAnushka/springboot-mini-banking-system/main/screenshots/transaction.png)


### 📊 Full Analytics

![Analytics Screenshot](https://raw.githubusercontent.com/DalviAnushka/springboot-mini-banking-system/main/screenshots/Analytics.png)


# 🏗️ Tech Stack

### **Backend**

* Spring Boot 3+
* MySQL (JPA + Hibernate)
* REST APIs
* HikariCP Connection Pool

### **Frontend**

* React.js (Vite)
* Chart.js
* Modern UI (Custom CSS)
* Fetch API calls

# ✨ Features

### **Account Management**

* Create New Account
* Auto-generate Account Number

### **Transactions**

* Deposit
* Withdraw
* Transfer between accounts
* Balance auto-updates

### **Transaction History**

* View history for a specific account
* View all transactions
* Filters + sorting (in analytics page)

### **Export**

* Export **selected account** transactions (CSV)
* Export **ALL transactions** (CSV)

### **Analytics Dashboard**

* KPI Cards
* Line Chart (Net Balance Trend)
* Pie Chart (Transaction Types)
* Bar Chart (Top Accounts)
* Monthly Deposit vs Withdrawal chart

# ⚙️ Backend Setup (Spring Boot)

### 1️⃣ Update MySQL Credentials

In `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/banking_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 2️⃣ Run Backend

Using IntelliJ / VS Code:

```
mvn spring-boot:run
```

Server will start at:

👉 [http://localhost:8080](http://localhost:8080)

---

# 💻 Frontend Setup (React)

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Start React App

```
npm run dev
```

Frontend starts at:

👉 [http://localhost:5173/](http://localhost:5173/)

---

# 📦 Folder Structure

```
springboot-mini-banking-system/
│
├── backend/        # Spring Boot Application
│   ├── src/
│   ├── pom.xml
│
└── frontend/       # React UI
    ├── src/
    ├── package.json
```

---

# Future Enhancements

* JWT Authentication (Login system)
* Admin dashboard
* Email notifications
* PDF Bank Statement

---

# 🤝 Contribute

Feel free to fork this repo and submit improvements!
PRs are welcome. 🌟

---

# Author

**Anushka Dalvi**

---

