import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [accounts, setAccounts] = useState([]);

  // Fetch accounts when page loads
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/accounts")
      .then((res) => setAccounts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-blue-700">All Accounts</h1>

      <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 border">Account No</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Phone</th>
            <th className="p-3 border">Balance</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((acc) => (
            <tr
              key={acc.id}
              className="border-b hover:bg-gray-100 transition"
            >
              <td className="p-3 border text-center">{acc.accountNo}</td>
              <td className="p-3 border text-center">{acc.customer?.name ?? "-"}</td>
              <td className="p-3 border text-center">{acc.customer?.email ?? "-"}</td>
              <td className="p-3 border text-center">{acc.customer?.phone ?? "-"}</td>
              <td className="p-3 border text-center font-bold text-green-600">
                ₹ {acc.balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
