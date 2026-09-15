import { useEffect, useState } from "react";
import { ArrowRight, History, Plus, Wallet2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";

const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fundsModalOpen, setFundsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    api
      .get("/wallet")
      .then((res) => {
        if (!ignore) setWallet(res.data);
      })
      .catch((error) => {
        if (!ignore) console.error("Failed to fetch wallet", error);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentUser.id]);

  const handleAddFunds = async (event) => {
    event.preventDefault();

    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setActionMessage("Please enter a valid amount greater than zero.");
      return;
    }

    setSubmitting(true);
    setActionMessage("");

    try {
      const response = await api.post("/wallet", null, {
        params: { amount: numericAmount },
      });
      setWallet(response.data);
      setAmount("");
      setFundsModalOpen(false);
    } catch (error) {
      setActionMessage(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Funds could not be added right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const balance = wallet?.balance ?? 0;

  return (
    <div className="flex flex-col items-center pb-12 pt-8">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-3xl font-black tracking-tight text-[#0A7D6B] sm:text-4xl">
          Welcome back, {currentUser.name}
        </h1>
        <p className="mt-3 text-base text-[#07594C] opacity-80">
          Here is the status of your personal wallet.
        </p>
      </div>

      <div className="mt-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[#FED7A2] bg-[linear-gradient(135deg,#FA9905_0%,#CB7C04_100%)] shadow-[0_24px_60px_rgba(202,124,4,0.22)]">
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#FFF7ED]">
            <Wallet2 className="h-4 w-4" />
            Personal Wallet
          </div>

          <div className="mt-8 flex items-end justify-between gap-3 text-white">
            <div className="text-4xl font-black tracking-tight sm:text-[3.1rem]">
              {loading ? "--" : formatCurrency(balance)}
            </div>
            <div className="pb-1 text-xl font-semibold text-[#FFF7ED]">EGP</div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setActionMessage("");
                setFundsModalOpen(true);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0A7D6B] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#07594C]/20 transition hover:-translate-y-0.5 hover:bg-[#07594C]"
            >
              <Plus className="h-4 w-4" />
              Add Funds
            </button>

            <button
              type="button"
              onClick={() => navigate("/groups")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/50 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              View Groups
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/50 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              <History className="h-4 w-4" />
              History
            </button>
          </div>
        </div>
      </div>

      {fundsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-slate-800">Add funds</h2>
              <button
                type="button"
                onClick={() => {
                  setFundsModalOpen(false);
                  setAmount("");
                  setActionMessage("");
                }}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close add funds dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddFunds} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="personal-funds-amount"
                  className="mb-2 block text-sm font-bold text-[#07594C]"
                >
                  Amount (EGP)
                </label>
                <input
                  id="personal-funds-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="1000"
                  autoFocus
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-slate-800 outline-none transition focus:border-[#FA9905] focus:ring-4 focus:ring-[#FED7A2]"
                />
              </div>

              {actionMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {actionMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#0A7D6B] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0A7D6B]/20 transition hover:bg-[#07594C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Adding funds..." : "Confirm add funds"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
