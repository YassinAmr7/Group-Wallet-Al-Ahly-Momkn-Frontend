import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import GroupsPage from "./pages/GroupsPage";
import CreateGroupPage from "./pages/CreateGroupPage";
import GroupDetailsPage from "./pages/GroupDetailsPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/new" element={<CreateGroupPage />} />
        <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
