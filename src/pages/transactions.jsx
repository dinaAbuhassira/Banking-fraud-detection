import { useEffect, useState } from "react";
import "../styles/transactions.css";

const badgeClass = {
  BLOCKED: "badge-fraud",
  FRAUD: "badge-fraud",
  SAFE: "badge-safe",
  REVIEW: "badge-review",
};

const ROWS_PER_PAGE = 10;
const API_URL = "http://127.0.0.1:5000";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [hour, setHour] = useState("");
  const [isInternational, setIsInternational] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      alert("Backend is not running. Please run: python app.py");
    }
  }

  async function handleAddTransaction(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: customer,
          amount: Number(amount),
          hour: Number(hour),
          is_international: Number(isInternational),
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      await response.json();

      await fetchTransactions();

      setCustomer("");
      setAmount("");
      setHour("");
      setIsInternational("0");
      setCurrentPage(1);
      setStatusFilter("All Status");
    } catch (error) {
      alert("Backend is not running. Please run: python app.py");
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    statusFilter === "All Status"
      ? transactions
      : transactions.filter(
          (tx) => tx.status === statusFilter.toUpperCase()
        );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ROWS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginated = filtered.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  function handleFilterSelect(value) {
    setStatusFilter(value);
    setDropdownOpen(false);
    setCurrentPage(1);
  }

  function handleExportCSV() {
    const headers = [
      "ID",
      "Customer",
      "Date",
      "Amount",
      "Location",
      "Status",
      "Risk Score",
    ];

    const rows = filtered.map((tx) =>
      [
        tx.id,
        tx.customer,
        tx.date,
        tx.amount,
        tx.location,
        tx.status,
        tx.risk_score ?? "",
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "transactions.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="content">
      <form className="tx-toolbar" onSubmit={handleAddTransaction}>
        <input
          type="text"
          placeholder="Customer name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Hour 0-23"
          min="0"
          max="23"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          required
        />

        <select
          value={isInternational}
          onChange={(e) => setIsInternational(e.target.value)}
        >
          <option value="0">Local</option>
          <option value="1">International</option>
        </select>

        <button className="export-btn" type="submit" disabled={loading}>
          {loading ? "Checking..." : "Add Transaction"}
        </button>
      </form>

      <div className="tx-toolbar">
        <div className="filter-wrapper">
          <button
            className="filter-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <i className="fa-solid fa-filter"></i>
            {statusFilter}
            <i className="fa-solid fa-chevron-down"></i>
          </button>

          {dropdownOpen && (
            <ul className="filter-dropdown">
              {["All Status", "Safe", "Fraud", "Review"].map((opt) => (
                <li
                  key={opt}
                  className={`filter-option${
                    statusFilter === opt ? " selected" : ""
                  }`}
                  onClick={() => handleFilterSelect(opt)}
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="export-btn" onClick={handleExportCSV}>
          <i className="fa-solid fa-download"></i>
          Export CSV
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr key={tx.id}>
                    <td className="tx-id">{tx.id}</td>
                    <td className="tx-customer">{tx.customer}</td>
                    <td className="tx-date">{tx.date}</td>
                    <td className="tx-amount">{tx.amount}</td>
                    <td className="tx-location">{tx.location}</td>
                    <td>
                      <span className={`badge ${badgeClass[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                className={`page-btn${
                  currentPage === page ? " active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="page-btn"
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
