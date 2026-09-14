import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { currentUser, setCurrentUser, availableUsers } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <span className="text-xl font-bold text-primary">Group Wallet</span>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            Viewing as: {currentUser.name}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow"
          >
            {availableUsers.map((user) => (
              <li key={user.id}>
                <button
                  onClick={() => setCurrentUser(user)}
                  className={user.id === currentUser.id ? "active" : ""}
                >
                  {user.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
