import { useEffect, useState } from "react";
import { ArrowLeft, ReceiptText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import TransactionList from "../components/TransactionList";
import { useAuth } from "../context/AuthContext";

function TransactionsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/wallet/transactions");
        if (!ignore) setTransactions(response.data || []);
      } catch (requestError) {
        if (!ignore) {
          setTransactions([]);
          setError("Unable to load your transaction history right now.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [currentUser?.id]);

  return (
    <div className="space-y-8 pb-12 pt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0A7D6B]">
            Personal wallet
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-800">
            Transaction history
          </h1>
          <p className="mt-2 text-slate-500">
            A record of activity in your personal wallet.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-[#0A7D6B]/20 bg-white px-3 py-2 text-sm font-bold text-[#0A7D6B] transition hover:bg-[#E8F6F4] sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {error}
        </div>
      )}

      <section className="rounded-[28px] border border-[#E8F6F4] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-[#E8F6F4] p-3 text-[#0A7D6B]">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Your ledger</h2>
            <p className="text-sm text-slate-500">
              {loading
                ? "Loading activity..."
                : `${transactions.length} recorded transaction${transactions.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[#E8F6F4] bg-[#F8FCFB] p-8 text-center font-bold text-[#07594C]">
            Loading transactions...
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </section>
    </div>
  );
}

export default TransactionsPage;
