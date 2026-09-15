# Group Wallet UI (Frontend)

## 📌 Project Overview
This is the frontend dashboard for the **Group Wallet System**, developed as a collaborative internship project at **Al Ahly Momkn**. This application provides a secure, intuitive interface for users to manage personal finances, participate in group wallets, and oversee financial contributions within their teams.

The frontend is built as a **Single Page Application (SPA)** that interacts with our backend Modular Monolith, ensuring a seamless experience for managing deposits, expenses, and transaction reporting.

## 🎨 Design Language
- **Brand Identity**: Built with a corporate Teal (`#0A7D6B`) and Orange (`#FA9905`) palette, aligning with Al Ahly Momkn's design standards.
- **Framework**: React with Vite.
- **Styling**: Tailwind CSS for responsive design + DaisyUI for robust, professional component primitives.

## 🚀 Key Frontend Features
- **Dynamic User Simulation**: Allows developers to switch between pre-seeded users (Khaled, Intern, Team Lead) to test role-based access and permissions.
- **Responsive Dashboard**: Real-time visualization of personal wallet balances and group treasury.
- **Secure Transactions**: UI-driven flows for depositing funds and recording expenses with integrated error handling.
- **Ledger Reporting**: Dedicated view for monitoring group transaction history.
- **Dynamic Group Management**: Interface to create groups and navigate through active group memberships.

## 🛠️ Technical Stack
- **Library**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios (with centralized Interceptors for auth-headers)
- **Routing**: React Router DOM
- **Icons**: Lucide-React
- **UI Components**: Tailwind CSS & DaisyUI

## ⚙️ How to Run
1. **Prerequisites**: Ensure your Spring Boot backend is running on `localhost:8080`.
2. **Install Dependencies**:
   ```bash
   npm install
