import { useEffect, useState } from "react";

export default function Home() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/accounts")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched Data:", data);
        setAccounts(data);
      })
      .catch(err => console.error("Fetch Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Accounts</h2>

      {accounts.length === 0 ? (
        <p style={{ color: "red" }}>❌ No Data Found...</p>
      ) : (
        <table border="1" style={{ marginTop: "10px", width: "70%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Account No</th>
              <th>Balance</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id}>
                <td>{acc.id}</td>
                <td>{acc.accountNo}</td>
                <td>{acc.balance}</td>
                <td>{acc.customer ? acc.customer.name : "No Name"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
