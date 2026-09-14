// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";

function Dashboard() {
  const { currentUser, setCurrentUser, availableUsers } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [funding, setFunding] = useState(false);

  const loadWalletData = async () => {
    setLoading(true);
    setError("");
    try {
      const [walletRes, txRes] = await Promise.all([
        api.get("/wallet", { headers: { userId: currentUser.id } }),
        api.get("/wallet/transactions", {
          headers: { userId: currentUser.id },
        }),
      ]);
      setWallet(walletRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      setError(
        "Couldn't reach the wallet service. Is the backend running on :8080?",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  const handleFund = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setFunding(true);
    try {
      await api.post("/wallet", null, {
        params: { amount },
        headers: { userId: currentUser.id },
      });
      setAmount("");
      await loadWalletData();
    } catch (err) {
      setError("Funding failed. Please try again.");
    } finally {
      setFunding(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value ?? 0);

  const txIcon = (type) => {
    if (type === "DEPOSIT")
      return <ArrowDownRight className="text-emerald-500" size={18} />;
    if (type === "EXPENSE")
      return <ArrowUpRight className="text-rose-500" size={18} />;
    return <ArrowLeftRight className="text-[#47bfff]" size={18} />;
  };

  return (
    <div className="min-h-screen bg-base-200">
      <header className="bg-[#863bff] text-white shadow-md">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={26} />
            <span className="text-xl font-semibold tracking-tight">
              Group Wallet
            </span>
          </div>
          <div className="flex gap-1 bg-white/10 rounded-full p-1">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => setCurrentUser(u)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  currentUser.id === u.id
                    ? "bg-white text-[#863bff]"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="alert alert-error text-sm">
            <span>{error}</span>
          </div>
        )}

        <div className="card bg-gradient-to-br from-[#863bff] to-[#47bfff] text-white shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <User size={16} />
              {currentUser.name}'s personal wallet
            </div>
            {loading ? (
              <span className="loading loading-spinner loading-lg mt-2"></span>
            ) : (
              <p className="text-4xl font-bold mt-1">
                {formatCurrency(wallet?.balance)}
              </p>
            )}

            <form onSubmit={handleFund} className="flex gap-2 mt-4">
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="input w-32 bg-white text-black"
              />
              <button
                type="submit"
                disabled={funding}
                className="btn bg-white text-[#863bff] hover:bg-white/90 border-none"
              >
                <Plus size={16} />
                {funding ? "Funding..." : "Fund Wallet"}
              </button>
            </form>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-base">Recent Transactions</h2>
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : transactions.length === 0 ? (
              <p className="text-sm text-base-content/60">
                No transactions yet.
              </p>
            ) : (
              <ul className="divide-y divide-base-200">
                {transactions.map((tx) => (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      {txIcon(tx.type)}
                      <div>
                        <p className="text-sm font-medium">
                          {tx.type.replace("_", " ")}
                        </p>
                        <p className="text-xs text-base-content/50">
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(tx.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
