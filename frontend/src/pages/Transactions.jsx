import { useEffect, useState } from "react";

// ---- DATE FORMATTER (DD-MM-YY HH:mm) ----
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(2);
  const time = d.toLocaleTimeString("en-IN", { hour12: false }); // 24-hour

  return `${day}-${month}-${year} ${time}`;
}

export default function Transaction() {

  const [id, setId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [transactions, setTransactions] = useState([]);

  const fetchAllHistory = () => {
    fetch("http://localhost:8080/api/accounts/transactions/all")
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.log(err));
  };

  const fetchAccountHistory = () => {
    if (!id) return fetchAllHistory();

    fetch(`http://localhost:8080/api/accounts/${id}/transactions`)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchAllHistory();
  }, []);

  const depositMoney = () => {
    fetch(`http://localhost:8080/api/accounts/${id}/deposit?amount=${amount}`, { method: "PUT" })
      .then(res => res.json())
      .then(data => {
        setMsg(`Deposited ₹${amount} successfully! New Balance: ${data.balance}`);
        fetchAccountHistory();
      });
  };

  const withdrawMoney = () => {
    fetch(`http://localhost:8080/api/accounts/${id}/withdraw?amount=${amount}`, { method: "PUT" })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setMsg(`Withdrawn ₹${amount} successfully! New Balance: ${data.balance}`);
        fetchAccountHistory();
      })
      .catch(() => setMsg("❌ Insufficient Balance"));
  };

  const transferMoney = () => {
    fetch(`http://localhost:8080/api/accounts/transfer?fromId=${id}&toId=${toId}&amount=${amount}`, {
      method: "POST"
    })
      .then(res => res.text())
      .then(() => {
        setMsg("Transfer Successful!");
        fetchAccountHistory();
      })
      .catch(() => setMsg("❌ Transfer failed"));
  };

  return (
    <div style={styles.container}>

      <h1 style={styles.heading}>Transaction Center</h1>

      {/* ------- CARDS IN CENTER ------- */}
      <div style={styles.cardRow}>

        {/* Deposit / Withdraw */}
        <div style={styles.card}>
          <h3>Deposit / Withdraw</h3>

          <label>Account ID</label>
          <input
            style={styles.input}
            value={id}
            onChange={(e) => setId(e.target.value)}
            onBlur={fetchAccountHistory}
          />

          <label>Amount</label>
          <input
            style={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button style={styles.btnPrimary} onClick={depositMoney}>Deposit</button>
          <button style={styles.btnDanger} onClick={withdrawMoney}>Withdraw</button>
        </div>

        {/* Transfer Card */}
        <div style={styles.card}>
          <h3>Transfer Money</h3>

          <label>From Account ID</label>
          <input style={styles.input} value={id} onChange={(e) => setId(e.target.value)} />

          <label>To Account ID</label>
          <input style={styles.input} value={toId} onChange={(e) => setToId(e.target.value)} />

          <label>Amount</label>
          <input style={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} />

          <button style={styles.btnSecondary} onClick={transferMoney}>Transfer</button>
        </div>
      </div>

      <p style={styles.message}>{msg}</p>

      {/* EXPORT BUTTONS */}
      <div style={{ marginTop: "20px" }}>
        <button
          style={styles.exportBtn}
          onClick={() => {
            if (!id) return alert("⚠️ Enter Account ID");
            window.open(`http://localhost:8080/api/accounts/${id}/transactions/export`);
          }}
        >
          Export Selected Account CSV
        </button>

        <button
          style={styles.exportAllBtn}
          onClick={() => window.open("http://localhost:8080/api/accounts/transactions/export")}
        >
          Export All Transactions CSV
        </button>
      </div>

      {/* TABLE */}
      <h2 style={{ marginTop: "30px" }}>📊 Transaction History</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>From</th>
              <th>To</th>
              <th>DateTime</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.type}</td>
                <td>₹{t.amount}</td>
                <td>{t.fromAccount || "-"}</td>
                <td>{t.toAccount || "-"}</td>
                {/* ★ NEW DATE FORMAT HERE */}
                <td>{formatDate(t.dateTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ---------- STYLES ----------
const styles = {
  container: {
    padding: "30px",
    background: "#f7f9fc",
    minHeight: "100vh"
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "25px",
    color: "#1b263b"
  },
  cardRow: {
    display: "flex",
    gap: "25px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  card: {
    width: "330px",
    padding: "20px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "6px 0 12px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  btnPrimary: {
    padding: "8px 15px",
    background: "#0077b6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px"
  },
  btnDanger: {
    padding: "8px 15px",
    background: "#d90429",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  btnSecondary: {
    padding: "8px 15px",
    background: "#2a9d8f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  message: {
    marginTop: "10px",
    color: "#1d3557",
    fontWeight: "bold",
    textAlign: "center"
  },
  exportBtn: {
    padding: "10px 18px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "6px",
    marginRight: "12px",
    cursor: "pointer"
  },
  exportAllBtn: {
    padding: "10px 18px",
    background: "darkblue",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  tableWrapper: {
    marginTop: "20px",
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  }
};
