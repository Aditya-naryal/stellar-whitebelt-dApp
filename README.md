

# 🚀 Stellar White Belt dApp

A modern dark-themed Stellar Testnet dApp built for the **Level 1 – White Belt Challenge**.
This application demonstrates wallet integration, balance retrieval, and XLM transaction execution using the Stellar blockchain.

---

## 🌌 Project Overview

This dApp allows users to:

* Connect their Stellar wallet (Freighter)
* View their XLM balance on Testnet
* Send XLM to another Stellar account
* View transaction hash
* Verify transactions via Stellar Explorer

The application is built using **React + TypeScript + Vite + TailwindCSS**, and interacts with Stellar via:

* `@stellar/stellar-sdk`
* `@stellar/freighter-api`

All transactions occur on the **Stellar Testnet**.

---

# 🛠 Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* TailwindCSS

### Blockchain Integration

* `@stellar/stellar-sdk`
* `@stellar/freighter-api`
* Horizon Testnet API

---

# 📦 Libraries Used

| Library                  | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `@stellar/stellar-sdk`   | Build and submit transactions           |
| `@stellar/freighter-api` | Wallet connection & transaction signing |
| `react`                  | UI rendering                            |
| `vite`                   | Build tooling                           |
| `tailwindcss`            | Styling                                 |

---

# 🧠 Features Implemented

## ✅ 1. Wallet Connection

* Detect Freighter installation
* Request wallet access
* Display connected address

## ✅ 2. Balance Fetching

* Fetch XLM balance from Horizon
* Display loading state
* Handle 404 (account not activated)
* Error handling for failed requests

## ✅ 3. XLM Transaction Flow

* Validate recipient address
* Prevent self-transfers
* Prevent negative or invalid amounts
* Build Stellar payment transaction
* Sign transaction via Freighter
* Submit signed transaction to Horizon
* Display transaction hash
* Display success/failure state

## ✅ 4. UX Improvements

* Self-transfer validation
* Negative amount restriction
* Clean dark UI
* Real-time feedback
* Professional transaction state messages

---

# ⚠️ Requirements

Before using this dApp:

## 🔹 1. Install Freighter Wallet

Freighter extension must be installed:

👉 [https://www.freighter.app/](https://www.freighter.app/)

## 🔹 2. Use Testnet

Switch Freighter network to:

```
Testnet
```

## 🔹 3. Fund Your Account

You must have Testnet XLM to send transactions.

Use Stellar Testnet Faucet:

👉 [https://laboratory.stellar.org/#account-creator?network=test](https://laboratory.stellar.org/#account-creator?network=test)

---

# 🚨 Important Notes

* This dApp works ONLY on **Stellar Testnet**
* Transactions will fail if:

  * Recipient account is not activated
  * Insufficient balance
  * Amount is invalid
* Minimum reserve must remain in account (~1 XLM)

---

# 📁 Project Structure

```
stellar-whitebelt-dapp/
│
├── dist/                   # Production build output
├── node_modules/           # Dependencies
├── public/
│   └── vite.svg
│
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.tsx             # Main dApp logic
│   ├── index.css           # Tailwind setup
│   └── main.tsx            # React entry point
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 🔗 How to Run Locally

```bash
git clone <your-repo-url>
cd stellar-whitebelt-dapp
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 🏗 Build For Production

```bash
npm run build
```

Output will be generated in:

```
/dist
```

---

# 🌍 Deployment

This project is deployed using **Vercel**.

Build Settings:

* Framework: Vite
* Build Command: `npm run build`
* Output Directory: `dist`

---

# 🔍 How to Verify Transactions

After sending XLM, a transaction hash is displayed.

You can verify it using:

### 🌐 Stellar Expert (Recommended Explorer)

[https://stellar.expert](https://stellar.expert)
Switch to **Testnet**

Example:

```
https://stellar.expert/explorer/testnet/tx/<TX_HASH>
```

### 🌐 Horizon API (Raw JSON)

```
https://horizon-testnet.stellar.org/transactions/<TX_HASH>
```

---

# 📚 Useful Resources

### Stellar Official Docs

[https://developers.stellar.org/](https://developers.stellar.org/)

### Horizon API Reference

[https://developers.stellar.org/api/horizon](https://developers.stellar.org/api/horizon)

### Freighter Documentation

[https://docs.freighter.app/](https://docs.freighter.app/)

### Stellar Laboratory (Testnet Tools)

[https://laboratory.stellar.org/](https://laboratory.stellar.org/)

---

# 🛡 Security Considerations

* Private keys are NEVER stored in the application
* Signing is handled securely by Freighter
* No secrets are exposed in frontend code
* No `.env` file required
* Only public Horizon Testnet endpoint used

---

# 🎯 Challenge Requirements Covered

✔ Wallet setup
✔ Wallet connect & disconnect detection
✔ Balance display
✔ XLM transaction on testnet
✔ Transaction success/failure feedback
✔ Transaction hash display
✔ Public GitHub repository
✔ Deployment ready

---

# 🌌 Future Improvements

* Add disconnect wallet functionality
* Auto-refresh balance after transaction
* Add transaction history viewer
* Improve error decoding from Horizon
* Add explorer link button
* Add loading spinner animations

---

# 👨‍💻 Author

Built as part of Stellar White Belt Challenge
Focused on clean architecture, proper validation, and UX improvements.


