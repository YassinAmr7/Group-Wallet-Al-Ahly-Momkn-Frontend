import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, CreditCard, Wallet2 } from "lucide-react";
import api from "../api/axiosConfig";

const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function GroupDetailsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const groupNameFromState = location.state?.groupName;
  const [wallet, setWallet] = useState({ balance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchGroupData = async () => {
      setLoading(true);
      setError("");

      try {
        const walletResponse = await api.get(`/api/groups/${groupId}/wallet`);

        if (!ignore) {
          setWallet(walletResponse.data);
        }
      } catch (err) {
        if (!ignore) {
          setError("Unable to load this group wallet right now.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchGroupData();

    return () => {
      ignore = true;
    };
  }, [groupId]);

  const quickActions = useMemo(
    () => [
      {
        label: "Deposit",
        icon: CreditCard,
        color: "bg-[#0A7D6B]",
      },
      {
        label: "Expense",
        icon: ArrowRightLeft,
        color: "bg-[#FA9905]",
      },
    ],
    [],
  );

  const displayName = groupNameFromState || `Group #${groupId}`;

  return (
    <div className="space-y-8 pb-12 pt-4">
      <button
        type="button"
        onClick={() => navigate("/groups")}
        className="inline-flex items-center gap-2 rounded-xl border border-[#0A7D6B]/20 bg-white px-3 py-2 text-sm font-bold text-[#0A7D6B] shadow-sm transition hover:bg-[#E8F6F4]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to groups
      </button>

      <div className="rounded-[28px] border border-[#E8F6F4] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#FA9905]">
              Group dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-800">
              {loading ? "Loading..." : displayName}
            </h1>
          </div>

          {error && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0A7D6B_0%,#07594C_100%)] p-6 text-white shadow-[0_24px_60px_rgba(7,89,76,0.18)]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#E8F6F4]">
              <Wallet2 className="h-4 w-4" />
              Group wallet
            </div>

            <div className="mt-6 flex items-end justify-between gap-3">
              <div className="text-4xl font-black tracking-tight sm:text-[3rem]">
                {loading ? "--" : `${formatCurrency(wallet.balance)} `}
              </div>
              <div className="pb-1 text-lg font-semibold text-[#E8F6F4]">
                EGP
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {quickActions.map(({ label, icon: Icon, color }) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center justify-between rounded-2xl ${color} px-4 py-4 text-left text-white shadow-md transition hover:brightness-105`}
              >
                <span className="text-lg font-bold">{label}</span>
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetailsPage;
