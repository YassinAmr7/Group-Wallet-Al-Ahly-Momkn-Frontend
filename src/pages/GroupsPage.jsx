import { useEffect, useState } from "react";
import { ArrowRight, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

function GroupsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.id) {
      setGroups([]);
      setLoading(false);
      return;
    }

    const fetchGroups = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/groups", {
          headers: {
            userId: currentUser.id,
          },
        });

        setGroups(response.data || []);
      } catch (err) {
        console.error("Failed to fetch groups", err);
        setGroups([]);
        setError("Unable to load your groups right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser?.id]);

  return (
    <div className="space-y-8 pb-12 pt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0A7D6B]">
            Group management
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-800">
            Your groups
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate("/groups/new")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FA9905] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#FA9905]/20 transition hover:-translate-y-0.5 hover:bg-[#CB7C04]"
        >
          <Plus className="h-4 w-4" />
          Create group
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-[28px] border border-[#E8F6F4] bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-[#07594C]">Loading groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#0A7D6B]/30 bg-white p-10 text-center shadow-sm">
          <Users className="mx-auto h-10 w-10 text-[#0A7D6B]" />
          <h2 className="mt-4 text-xl font-bold text-slate-800">
            No groups yet
          </h2>
          <p className="mt-2 text-slate-500">
            You are not in any groups yet. Create your first group to begin.
          </p>
          <button
            type="button"
            onClick={() => navigate("/groups/new")}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0A7D6B] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#07594C]"
          >
            <Plus className="h-4 w-4" />
            Create your first group
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() =>
                navigate(`/groups/${group.id}`, {
                  state: { groupName: group.name },
                })
              }
              className="group rounded-[28px] border border-[#E8F6F4] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0A7D6B]">
                    Group
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-800">
                    {group.name}
                  </h2>
                </div>
                <div className="rounded-full bg-[#E8F6F4] p-2 text-[#0A7D6B]">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0A7D6B]">
                View dashboard
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupsPage;
