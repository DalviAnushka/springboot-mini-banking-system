import { useState } from "react";

export default function CreateAccount() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");

  const handleAccountCreation = () => {
    const body = {
      customer: { name, email, phone }
    };

    fetch("http://localhost:8080/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) throw new Error("Something went wrong");
        return res.json();
      })
      .then(data => {
        setMsg(`Account Created
ID: ${data.id}  
Account No: ${data.accountNo}`);
        setName("");
        setEmail("");
        setPhone("");
      })
      .catch(() => setMsg("❌ Failed to create account"));
  };

  return (
    <div style={styles.container}>

      <h1 style={styles.heading}>Create New Account</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Fill the details below to create a customer account.
      </p>

      <div style={styles.card}>
        
        <label style={styles.label}>Customer Name:</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter full name"
        />

        <label style={styles.label}>Email:</label>
        <input
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
        />

        <label style={styles.label}>Phone:</label>
        <input
          style={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
        />

        <button style={styles.button} onClick={handleAccountCreation}>
          Create Account
        </button>

        <p style={styles.message}>{msg}</p>

      </div>

    </div>
  );
}

/* ------------------ STYLES ------------------- */

const styles = {
  container: {
    padding: "25px",
    maxWidth: "600px",
    margin: "0 auto"
  },

  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#1b263b",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#444"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px"
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    background: "#C1121F",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(193,18,31,0.3)"
  },

  message: {
    marginTop: "15px",
    whiteSpace: "pre-line",
    color: "#0A8754",
    fontWeight: "600"
  }
};
