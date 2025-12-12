// import { useEffect, useState, useMemo } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";
// import { Line, Bar, Pie, HorizontalBar } from "react-chartjs-2"; // Note: HorizontalBar isn't exported in new chartjs; we'll use a bar with indexAxis:'y'
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function Analytics() {
//   const [accounts, setAccounts] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // fetch data
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       fetch("http://localhost:8080/api/accounts").then(r => r.json()),
//       fetch("http://localhost:8080/api/accounts/transactions/all").then(r => r.json())
//     ]).then(([accs, txns]) => {
//       setAccounts(accs || []);
//       setTransactions(txns || []);
//       setLoading(false);
//     }).catch(err => {
//       console.error("Analytics fetch error", err);
//       setLoading(false);
//     });
//   }, []);

//   // helper: format date -> yyyy-mm-dd
//   const toDay = (iso) => {
//     if (!iso) return "";
//     const d = new Date(iso);
//     // iso may be "2025-12-08T02:18:52.903" or similar
//     return d.toISOString().slice(0,10);
//   };

//   // KPI calculations
//   const kpis = useMemo(() => {
//     const totalAccounts = accounts.length;
//     const totalBalance = accounts.reduce((s,a) => s + (Number(a.balance) || 0), 0);

//     let totalDeposits = 0;
//     let totalWithdrawals = 0;
//     transactions.forEach(t => {
//       const amt = Number(t.amount) || 0;
//       if (!t.type) return;
//       const type = t.type.toUpperCase();
//       if (type.includes("DEPOSIT")) totalDeposits += amt;
//       if (type.includes("WITHDRAW")) totalWithdrawals += amt;
//       if (type.includes("TRANSFER_CREDIT")) totalDeposits += amt;
//       if (type.includes("TRANSFER_DEBIT")) totalWithdrawals += amt;
//     });

//     return {
//       totalAccounts,
//       totalBalance,
//       totalDeposits,
//       totalWithdrawals
//     };
//   }, [accounts, transactions]);

//   // Transactions grouped by date for line chart (cumulative balance over time)
//   const lineData = useMemo(() => {
//     // Build daily net change map
//     const dayMap = {}; // date -> net change (debits negative)
//     transactions.forEach(t => {
//       const date = toDay(t.dateTime || t.date);
//       if (!date) return;
//       let delta = 0;
//       const type = (t.type || "").toUpperCase();
//       const amt = Number(t.amount) || 0;
//       if (type.includes("DEPOSIT") || type.includes("CREDIT")) delta += amt;
//       if (type.includes("WITHDRAW") || type.includes("DEBIT")) delta -= amt;
//       // For transfer we have both debit and credit entries in DB — they cancel for overall net if both present; this works fine.
//       dayMap[date] = (dayMap[date] || 0) + delta;
//     });

//     // Build sorted dates array
//     const dates = Object.keys(dayMap).sort();
//     // If none, add today
//     if (dates.length === 0) {
//       const today = new Date().toISOString().slice(0,10);
//       dates.push(today);
//       dayMap[today] = 0;
//     }

//     // cumulative sum
//     const values = [];
//     let cum = 0;
//     for (const d of dates) {
//       cum += dayMap[d];
//       values.push(Number(cum.toFixed(2)));
//     }

//     return {
//       labels: dates,
//       datasets: [
//         {
//           label: "Cumulative Net Change",
//           data: values,
//           fill: true,
//           tension: 0.3,
//           borderWidth: 2
//         }
//       ]
//     };
//   }, [transactions]);

//   // Monthly deposits vs withdrawals (bar)
//   const barData = useMemo(() => {
//     const monthMap = {}; // yyyy-mm -> {dep, wd}
//     transactions.forEach(t => {
//       const dt = new Date(t.dateTime || t.date || "");
//       if (isNaN(dt)) return;
//       const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`;
//       if (!monthMap[key]) monthMap[key] = {dep:0, wd:0};
//       const amt = Number(t.amount) || 0;
//       const type = (t.type||"").toUpperCase();
//       if (type.includes("DEPOSIT") || type.includes("CREDIT")) monthMap[key].dep += amt;
//       if (type.includes("WITHDRAW") || type.includes("DEBIT")) monthMap[key].wd += amt;
//     });

//     // sort month keys ascending
//     const months = Object.keys(monthMap).sort();
//     // if none create current month
//     if (months.length===0) {
//       const now = new Date();
//       const key = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
//       months.push(key);
//       monthMap[key] = {dep:0, wd:0};
//     }
//     return {
//       labels: months,
//       datasets: [
//         { label: "Deposits", data: months.map(m=>monthMap[m].dep) , stack: "a", borderWidth: 0 },
//         { label: "Withdrawals", data: months.map(m=>monthMap[m].wd) , stack: "a", borderWidth: 0 }
//       ]
//     };
//   }, [transactions]);

//   // Pie - type distribution
//   const pieData = useMemo(() => {
//     const counts = {};
//     transactions.forEach(t => {
//       const type = ((t.type||"UNKNOWN").toUpperCase());
//       counts[type] = (counts[type] || 0) + 1;
//     });
//     const labels = Object.keys(counts);
//     if (labels.length===0) {
//       labels.push("NO_TRANSACTIONS");
//       counts["NO_TRANSACTIONS"] = 1;
//     }
//     return {
//       labels,
//       datasets: [{
//         data: labels.map(l => counts[l]),
//         borderWidth: 1
//       }]
//     };
//   }, [transactions]);

//   // Top accounts by balance
//   const topAccounts = useMemo(() => {
//     const sorted = [...accounts].sort((a,b) => (b.balance||0) - (a.balance||0));
//     return sorted.slice(0,5);
//   }, [accounts]);

//   // horizontal bar data
//   const topBarData = useMemo(() => {
//     const labels = topAccounts.map(a => a.accountNo || `#${a.id}`);
//     const data = topAccounts.map(a => Number(a.balance) || 0);
//     return { labels, datasets: [{ label: "Balance", data }] };
//   }, [topAccounts]);

//   if (loading) return <div style={{padding:30}}>Loading analytics...</div>;

//   return (
//     <div style={{ padding: 24 }}>
//       <div style={{ display:"flex", gap:20, alignItems:"center", marginBottom:24 }}>
//         <img src="/bank.jpg" alt="logo" style={{ width:64, height:64, borderRadius:8 }}/>
//         <div>
//           <h1 style={{ margin:0 }}>Dashboard Overview</h1>
//           <small style={{ color:"#666" }}>Bank analytics snapshot</small>
//         </div>
//       </div>

//       {/* KPI cards */}
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16, marginBottom:24 }}>
//         <Card title="Total Accounts" value={kpis.totalAccounts} />
//         <Card title="Total Balance" value={`₹${Number(kpis.totalBalance).toLocaleString()}`} />
//         <Card title="Total Deposits" value={`₹${Number(kpis.totalDeposits).toLocaleString()}`} />
//         <Card title="Total Withdrawals" value={`₹${Number(kpis.totalWithdrawals).toLocaleString()}`} />
//       </div>

//       <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
//         <div style={{ background:"#fff", padding:16, borderRadius:10, boxShadow:"0 6px 16px rgba(0,0,0,0.06)" }}>
//           <h3 style={{ marginTop:0 }}>Balance Over Time</h3>
//           <Line data={lineData} options={{
//             maintainAspectRatio:false,
//             height: 220,
//             plugins:{ legend:{ display:false } }
//           }} />
//         </div>

//         <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
//           <div style={{ background:"#fff", padding:16, borderRadius:10, boxShadow:"0 6px 16px rgba(0,0,0,0.06)", minHeight:200 }}>
//             <h4 style={{ marginTop:0 }}>Transaction Types</h4>
//             <Pie data={pieData} options={{ maintainAspectRatio:false, height:160 }} />
//           </div>

//           <div style={{ background:"#fff", padding:16, borderRadius:10, boxShadow:"0 6px 16px rgba(0,0,0,0.06)" }}>
//             <h4 style={{ marginTop:0 }}>Top Accounts</h4>
//             {/* horizontal bar using Bar with indexAxis:'y' */}
//             <Bar data={topBarData} options={{ indexAxis:'y', maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ beginAtZero:true } } }} />
//           </div>
//         </div>
//       </div>

//       <div style={{ marginTop:24, background:"#fff", padding:16, borderRadius:10, boxShadow:"0 6px 16px rgba(0,0,0,0.06)" }}>
//         <h3 style={{ marginTop:0 }}>Monthly Deposits vs Withdrawals</h3>
//         <Bar data={barData} options={{ maintainAspectRatio:false, height:200, plugins:{ legend:{ position:"top" } } }} />
//       </div>

//     </div>
//   );
// }

// // Small card component
// function Card({ title, value }) {
//   return (
//     <div style={{
//       background:"#fff",
//       padding:20,
//       borderRadius:12,
//       boxShadow:"0 8px 20px rgba(0,0,0,0.06)",
//       minHeight:90
//     }}>
//       <div style={{ color:"#555", fontSize:14 }}>{title}</div>
//       <div style={{ marginTop:12, color:"#b71c1c", fontWeight:700, fontSize:20 }}>{value}</div>
//     </div>
//   );
// }

// src/pages/Analytics.jsx


import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

function formatRupee(x) {
  if (x == null) return "₹0";
  return "₹" + Number(x).toLocaleString();
}

export default function Analytics() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [selectedAccountId, setSelectedAccountId] = useState(""); // empty => all
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // load data
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8080/api/accounts").then(r => r.json()),
      fetch("http://localhost:8080/api/accounts/transactions/all").then(r => r.json())
    ]).then(([accs, txns]) => {
      setAccounts(accs || []);
      // normalize dates: ensure transaction.dateTime exists
      const normalized = (txns || []).map(t => ({
        ...t,
        dateTime: t.dateTime || t.date || new Date().toISOString()
      }));
      setTransactions(normalized);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // filter transactions according to account + date range
  const filteredTxns = useMemo(() => {
    return transactions.filter(t => {
      // account filter: if selectedAccountId is empty -> pass
      if (selectedAccountId) {
        // account can be represented by id (number) or accountNo — we store id in input, so compare by account id:
        // incoming transactions have fromAccount/toAccount as accountNos; to support account id filtering we also fetch account->accountNo mapping
        const acc = accounts.find(a => String(a.id) === String(selectedAccountId));
        const accNo = acc ? acc.accountNo : null;
        // when selectedAccountId present, show transactions where fromAccount==accNo or toAccount==accNo
        if (!accNo) return false;
        if (t.fromAccount !== accNo && t.toAccount !== accNo) return false;
      }

      // date filters - compare only date part
      if (fromDate) {
        const d = new Date(t.dateTime).toISOString().slice(0, 10);
        if (d < fromDate) return false;
      }
      if (toDate) {
        const d = new Date(t.dateTime).toISOString().slice(0, 10);
        if (d > toDate) return false;
      }
      return true;
    });
  }, [transactions, selectedAccountId, fromDate, toDate, accounts]);

  // KPI calculations using filtered transactions + accounts
  const kpis = useMemo(() => {
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((s, a) => s + (Number(a.balance) || 0), 0);

    let totalDeposits = 0, totalWithdrawals = 0, totalTransfers = 0;
    filteredTxns.forEach(t => {
      const amt = Number(t.amount) || 0;
      const typ = (t.type || "").toUpperCase();
      if (typ.includes("DEPOSIT") || typ.includes("CREDIT")) totalDeposits += amt;
      else if (typ.includes("WITHDRAW") || typ.includes("DEBIT")) totalWithdrawals += amt;
      else if (typ.includes("TRANSFER")) totalTransfers += amt;
    });

    return {
      totalAccounts,
      totalBalance,
      totalDeposits,
      totalWithdrawals,
      totalTransfers
    };
  }, [accounts, filteredTxns]);

  // ------------------ Line chart: cumulative net change by day ------------------
  const lineChart = useMemo(() => {
    const dayMap = {}; // yyyy-mm-dd -> net change
    filteredTxns.forEach(t => {
      const d = new Date(t.dateTime);
      if (isNaN(d)) return;
      const key = d.toISOString().slice(0, 10);
      if (!dayMap[key]) dayMap[key] = 0;
      const amt = Number(t.amount) || 0;
      const typ = (t.type || "").toUpperCase();
      if (typ.includes("DEPOSIT") || typ.includes("CREDIT") || typ.includes("TRANSFER_CREDIT")) dayMap[key] += amt;
      if (typ.includes("WITHDRAW") || typ.includes("DEBIT") || typ.includes("TRANSFER_DEBIT")) dayMap[key] -= amt;
    });

    const dates = Object.keys(dayMap).sort();
    // ensure there is at least one date (today) to render
    if (dates.length === 0) {
      const today = new Date().toISOString().slice(0, 10);
      dates.push(today);
      dayMap[today] = 0;
    }
    const cumulative = [];
    let cum = 0;
    for (const d of dates) {
      cum += dayMap[d];
      cumulative.push(Number(cum.toFixed(2)));
    }

    return {
      labels: dates,
      datasets: [
        {
          label: "Cumulative Net Change (₹)",
          data: cumulative,
          fill: true,
          tension: 0.25,
          borderWidth: 2,
          backgroundColor: "rgba(193,18,31,0.08)",
          borderColor: "#C1121F"
        }
      ]
    };
  }, [filteredTxns]);

  // ------------------ Monthly deposits vs withdrawals (bar) ------------------
  const monthlyBar = useMemo(() => {
    const monthMap = {}; // YYYY-MM -> {dep, wd}
    filteredTxns.forEach(t => {
      const d = new Date(t.dateTime);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap[key]) monthMap[key] = { dep: 0, wd: 0 };
      const amt = Number(t.amount) || 0;
      const typ = (t.type || "").toUpperCase();
      if (typ.includes("DEPOSIT") || typ.includes("CREDIT") || typ.includes("TRANSFER_CREDIT")) monthMap[key].dep += amt;
      if (typ.includes("WITHDRAW") || typ.includes("DEBIT") || typ.includes("TRANSFER_DEBIT")) monthMap[key].wd += amt;
    });

    const months = Object.keys(monthMap).sort();
    if (months.length === 0) {
      const now = new Date();
      months.push(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`);
      monthMap[months[0]] = { dep: 0, wd: 0 };
    }

    return {
      labels: months,
      datasets: [
        { label: "Deposits (₹)", data: months.map(m => monthMap[m].dep), backgroundColor: "#118ab2" },
        { label: "Withdrawals (₹)", data: months.map(m => monthMap[m].wd), backgroundColor: "#ef476f" }
      ]
    };
  }, [filteredTxns]);

  // ------------------ Pie chart: transaction type distribution ------------------
  const pie = useMemo(() => {
    const cnt = {};
    filteredTxns.forEach(t => {
      const type = (t.type || "OTHER").toUpperCase();
      cnt[type] = (cnt[type] || 0) + 1;
    });
    const labels = Object.keys(cnt);
    if (labels.length === 0) {
      labels.push("NO_TRANSACTIONS");
      cnt["NO_TRANSACTIONS"] = 1;
    }
    return {
      labels,
      datasets: [
        { data: labels.map(l => cnt[l]), backgroundColor: ["#2a9d8f", "#ef476f", "#ffd166", "#a2d2ff"] }
      ]
    };
  }, [filteredTxns]);

  // ------------------ Top accounts (by balance) horizontal bar ------------------
  const topAccountsData = useMemo(() => {
    const sorted = [...accounts].sort((a, b) => (b.balance || 0) - (a.balance || 0)).slice(0, 5);
    return {
      labels: sorted.map(s => s.accountNo || `#${s.id}`),
      datasets: [{ label: "Balance", data: sorted.map(s => Number(s.balance) || 0), backgroundColor: "#C1121F" }]
    };
  }, [accounts]);

  // ------------------ Export CSV for filteredTxns ------------------
  const exportCSV = () => {
    const rows = [
      ["id","type","amount","fromAccount","toAccount","dateTime"]
    ];
    filteredTxns.forEach(t => {
      rows.push([t.id, t.type, t.amount, t.fromAccount || "", t.toAccount || "", t.dateTime]);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
    a.download = `transactions_${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ padding: 24 }}>Loading analytics...</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
        {/* <img src="/bank_logo.png" style={{ width: 64, height: 64, borderRadius: 10 }} alt="logo"/> */}
        <div>
          <h1 style={styles.heading}>Full Analytics</h1>
          <small style={{ color: "#666" }}>Interactive reports & export</small>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
        <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)}>
          <option value="">All accounts</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.accountNo} — {a.name || ("#"+a.id)}</option>)}
        </select>

        <label>
          From: <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </label>

        <label>
          To: <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        </label>

        <button onClick={() => { setFromDate(""); setToDate(""); setSelectedAccountId(""); }}>
          Reset
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={exportCSV} style={{ background: "#2b2d42", color: "white", padding: "8px 12px", borderRadius: 6 }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <KpiCard title="Total Accounts" value={kpis.totalAccounts} />
        <KpiCard title="Total Balance" value={formatRupee(kpis.totalBalance)} />
        <KpiCard title="Total Deposits" value={formatRupee(kpis.totalDeposits)} />
        <KpiCard title="Total Withdrawals" value={formatRupee(kpis.totalWithdrawals)} />
      </div>

      {/* Charts layout */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>
          <h3 style={{ marginTop: 0 }}>Balance Over Time</h3>
          <div style={{ height: 260 }}>
            <Line data={lineChart} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>
            <h4 style={{ marginTop: 0 }}>Transaction Types</h4>
            <div style={{ height: 180 }}>
              <Pie data={pie} options={{ maintainAspectRatio:false }} />
            </div>
          </div>

          <div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>
            <h4 style={{ marginTop: 0 }}>Top Accounts by Balance</h4>
            <div style={{ height: 180 }}>
              <Bar data={topAccountsData} options={{ indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly deposits/withdrawals bar */}
      <div style={{ marginTop: 16, background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>
        <h3 style={{ marginTop: 0 }}>Monthly Deposits vs Withdrawals</h3>
        <div style={{ height: 260 }}>
          <Bar data={monthlyBar} options={{ maintainAspectRatio: false, plugins: { legend: { position: "top" } } }} />
        </div>
      </div>

      {/* Transactions table */}
      <div style={{ marginTop: 16, background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>
        <h3 style={{ marginTop: 0 }}>Transactions ({filteredTxns.length})</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>ID</th><th>Type</th><th>Amount</th><th>From</th><th>To</th><th>DateTime</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.slice().reverse().map(t => (
                <tr key={t.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{t.id}</td>
                  <td style={{ padding: 8 }}>{t.type}</td>
                  <td style={{ padding: 8 }}>{formatRupee(t.amount)}</td>
                  <td style={{ padding: 8 }}>{t.fromAccount || "-"}</td>
                  <td style={{ padding: 8 }}>{t.toAccount || "-"}</td>
                  <td style={{ padding: 8 }}>{new Date(t.dateTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// small components
function KpiCard({ title, value }) {
  return (
    <div style={{ background: "#fff", padding: 14, borderRadius: 10, boxShadow: "0 6px 16px rgba(0,0,0,0.06)" }}>
      <div style={{ color: "#666", fontSize: 13 }}>{title}</div>
      <div style={{ marginTop: 8, fontWeight: 700, color: "#C1121F", fontSize: 18 }}>{value}</div>
    </div>
  );
}

/* ------------------ STYLES OBJECT ------------------- */
const styles = {
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#1b263b",
    textTransform: "uppercase",
    letterSpacing: "1px"
  }
};
