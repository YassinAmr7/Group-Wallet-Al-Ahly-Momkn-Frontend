import { useState } from "react";
import { ChevronDown, WalletCards } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { currentUser, setCurrentUser, availableUsers } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#0A7D6B] text-white shadow-[0_8px_24px_rgba(10,125,107,0.2)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FA9905] text-white shadow-md ring-2 ring-white/20">
            <WalletCards className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight sm:text-2xl">
              Al Ahly Momkn
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#E8F6F4]">
              Group Wallets
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-bold transition ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-[#E8F6F4] hover:bg-white/10"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/groups"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-bold transition ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-[#E8F6F4] hover:bg-white/10"
              }`
            }
          >
            Groups
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-bold transition ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-[#E8F6F4] hover:bg-white/10"
              }`
            }
          >
            Transactions
          </NavLink>
        </nav>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#FED7A2]"
          >
            <span className="hidden text-[#E8F6F4] sm:inline">Viewing as:</span>
            <span className="font-bold">{currentUser.name}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-3 w-56 overflow-hidden rounded-2xl border border-[#E8F6F4] bg-white p-2 text-left shadow-2xl">
              {availableUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setCurrentUser(user);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                    user.id === currentUser.id
                      ? "bg-[#E8F6F4] text-[#07594C]"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{user.name}</span>
                  {user.id === currentUser.id && (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FA9905]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
