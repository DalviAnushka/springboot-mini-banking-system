// import { useEffect, useState } from "react";

// export default function Dashboard() {

//   const [accounts, setAccounts] = useState([]);
//   const [transactions, setTransactions] = useState([]);

//   const fetchAccounts = () => {
//     fetch("http://localhost:8080/api/accounts")
//       .then(res => res.json())
//       .then(data => setAccounts(data));
//   };

//   const fetchTransactions = () => {
//     fetch("http://localhost:8080/api/accounts/transactions/all")
//       .then(res => res.json())
//       .then(data => setTransactions(data.slice(-5).reverse()));
//   };

//   useEffect(() => {
//     fetchAccounts();
//     fetchTransactions();
//   }, []);

//   const getTotalBalance = () => {
//     return accounts.reduce((sum, a) => sum + a.balance, 0);
//   };

//   const totalDeposits = transactions
//     .filter(t => t.type.includes("DEPOSIT"))
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalWithdrawals = transactions
//     .filter(t => t.type.includes("WITHDRAW"))
//     .reduce((sum, t) => sum + t.amount, 0);

//   return (
//     <div style={styles.container}>

//       <div style={styles.header}>
//         <img src="/banklogo.jpg" alt="logo" style={styles.logo} />
//         <h1>Dashboard Overview</h1>
//       </div>

//       <div style={styles.cardRow}>

//         <div style={styles.card}>
//           <h3>Total Accounts</h3>
//           <p style={styles.bigText}>{accounts.length}</p>
//         </div>

//         <div style={styles.card}>
//           <h3>Total Balance</h3>
//           <p style={styles.bigText}>₹{getTotalBalance()}</p>
//         </div>

//         <div style={styles.card}>
//           <h3>Total Deposits</h3>
//           <p style={styles.bigText}>₹{totalDeposits}</p>
//         </div>

//         <div style={styles.card}>
//           <h3>Total Withdrawals</h3>
//           <p style={styles.bigText}>₹{totalWithdrawals}</p>
//         </div>

//       </div>

//       <h2 style={{ marginTop: "30px" }}>Recent Transactions</h2>

//       <table style={styles.table}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Type</th>
//             <th>Amount</th>
//             <th>From</th>
//             <th>To</th>
//             <th>DateTime</th>
//           </tr>
//         </thead>

//         <tbody>
//           {transactions.map(t => (
//             <tr key={t.id}>
//               <td>{t.id}</td>
//               <td>{t.type}</td>
//               <td>₹{t.amount}</td>
//               <td>{t.fromAccount || "-"}</td>
//               <td>{t.toAccount || "-"}</td>
//               <td>{new Date(t.dateTime).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </div>
//   );
// }


// // CSS styles
// const styles = {
//   container: {
//     padding: "30px",
//     background: "#F7F7F7",
//     minHeight: "95vh"
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px"
//   },
//   logo: {
//     width: "60px",
//     height: "60px",
//     borderRadius: "50%"
//   },
//   cardRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: "30px",
//     gap: "20px"
//   },
//   card: {
//     background: "#FFFFFF",
//     padding: "20px",
//     borderRadius: "10px",
//     width: "23%",
//     boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
//   },
//   bigText: {
//     fontSize: "26px",
//     marginTop: "10px",
//     fontWeight: "bold",
//     color: "#C1121F"
//   },
//   table: {
//     width: "100%",
//     marginTop: "15px",
//     borderCollapse: "collapse",
//     background: "#FFFFFF",
//     borderRadius: "10px",
//     overflow: "hidden"
//   }
// };


import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend
);

export default function Home() {

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // fetch accounts + all transactions
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/accounts").then(r => r.json()),
      fetch("http://localhost:8080/api/accounts/transactions/all").then(r => r.json())
    ]).then(([accs, txns]) => {
      setAccounts(accs || []);
      const norm = txns.map(t => ({
        ...t,
        dateTime: t.dateTime || new Date().toISOString()
      }));
      setTransactions(norm);
    });
  }, []);

  // ---------- KPI CALCULATIONS ----------
  const kpis = useMemo(() => {
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((a, b) => a + (Number(b.balance) || 0), 0);

    let deposits = 0, withdrawals = 0;
    transactions.forEach(t => {
      let amt = Number(t.amount) || 0;
      if (t.type.includes("DEPOSIT") || t.type.includes("CREDIT")) deposits += amt;
      if (t.type.includes("WITHDRAW") || t.type.includes("DEBIT")) withdrawals += amt;
    });

    return { totalAccounts, totalBalance, deposits, withdrawals };
  }, [accounts, transactions]);

  // ---------- MINI LINE CHART ----------
  const lineChart = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const d = new Date(t.dateTime).toISOString().slice(0, 10);
      if (!map[d]) map[d] = 0;

      const amt = Number(t.amount) || 0;
      if (t.type.includes("DEPOSIT") || t.type.includes("CREDIT")) map[d] += amt;
      if (t.type.includes("WITHDRAW") || t.type.includes("DEBIT")) map[d] -= amt;
    });

    const days = Object.keys(map).sort();
    let cum = 0;
    const vals = days.map(d => (cum += map[d]));

    return {
      labels: days,
      datasets: [{
        label: "Net Change",
        data: vals,
        fill: true,
        borderColor: "#C1121F",
        backgroundColor: "rgba(193,18,31,0.12)",
        tension: 0.3
      }]
    };
  }, [transactions]);

  // ---------- MINI PIE ----------
  const pieChart = useMemo(() => {
    const count = {};
    transactions.forEach(t => {
      const type = t.type || "OTHER";
      count[type] = (count[type] || 0) + 1;
    });

    return {
      labels: Object.keys(count),
      datasets: [{
        data: Object.values(count),
        backgroundColor: ["#118ab2", "#ef476f", "#06d6a0", "#ffd166"]
      }]
    };
  }, [transactions]);

  // ---------- MINI BAR ----------
  const topAccounts = useMemo(() => {
    const sorted = [...accounts].sort((a, b) => b.balance - a.balance).slice(0, 5);
    return {
      labels: sorted.map(s => s.accountNo),
      datasets: [{
        label: "Balance",
        data: sorted.map(s => s.balance),
        backgroundColor: "#C1121F"
      }]
    };
  }, [accounts]);

  return (
    <div style={{ padding: "25px" }}>

      {/* ★★★ The Styled Heading ★★★ */}
      <h1 style={styles.heading}>Dashboard</h1>

      <p style={{ color: "#666" }}>Quick overview of your bank performance</p>

      {/* KPI CARDS */}
      <div style={styles.kpiGrid}>
        <Card title="Total Accounts" value={kpis.totalAccounts} />
        <Card title="Total Balance" value={"₹" + kpis.totalBalance} />
        <Card title="Total Deposits" value={"₹" + kpis.deposits} />
        <Card title="Total Withdrawals" value={"₹" + kpis.withdrawals} />
      </div>

      {/* MINI CHARTS */}
      <div style={styles.chartGrid}>

        <div style={chartBox}>
          <h3>Balance Trend</h3>
          <div style={{ height: "220px" }}>
            <Line data={lineChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div style={chartBox}>
          <h3>Transaction Types</h3>
          <div style={{ height: "220px" }}>
            <Pie data={pieChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div style={chartBox}>
          <h3>Top Accounts</h3>
          <div style={{ height: "220px" }}>
            <Bar data={topAccounts} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "35px" }}>
        <Link 
          to="/analytics"
          style={styles.analyticsBtn}
        >
          View Full Analytics →
        </Link>
      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <div style={{ fontSize: "15px", color: "#555" }}>{title}</div>
      <div style={styles.cardValue}>{value}</div>
    </div>
  );
}

const chartBox = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
};

/* ------------------ STYLES OBJECT ADDED HERE ------------------- */
const styles = {
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "25px",
    color: "#1b263b",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginTop: "20px"
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "20px",
    marginTop: "30px"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  cardValue: {
    marginTop: "10px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#C1121F"
  },

  analyticsBtn: {
    padding: "12px 22px",
    background: "#C1121F",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px"
  }
};
