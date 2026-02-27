import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import PageNotFound from "./Pages/PageNotFound";

import QRLoginPage from "./qrMain/QRLoginPage";
import AdminDashboard from "./menuAdmin/AdminDashboard";
import ManageWaiters from "./menuAdmin/ManageWaiters";
import ManageTables from "./menuAdmin/ManageTables";
import AddMenuItems from "./menuAdmin/AddMenuItems";
import ManageMenu from "./menuAdmin/ManageMenu";
import CustomerMenu from "./qrMain/CustomerMenu";
import WaiterDashboard from "./menuWaiter/WaiterDashboard";
import ManageOrders from "./menuWaiter/ManageOrders";
import ViewUpdateOrder from "./menuWaiter/ViewUpdateOrder";
import WaiterViewBills from "./menuWaiter/WaiterViewBills";
import TrackBills from "./menuAdmin/TrackBills";

const Router = () => {
  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path="/" element={<QRLoginPage />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="/customermenu/:id" element={<CustomerMenu />} />

        <Route element={<ProtectedRoute />}>
          {/* adminpages */}
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/manage-waiter" element={<ManageWaiters />} />
          <Route path="/manage-table" element={<ManageTables />} />
          <Route path="/add-menu" element={<AddMenuItems />} />
          <Route path="/manage-menu" element={<ManageMenu />} />
          <Route path="/track-bills" element={<TrackBills />} />
          
          {/* waiter pages */}
          <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
          <Route path="/manage-orders" element={<ManageOrders />} />
          <Route path="/view-update-order/:id" element={<ViewUpdateOrder />} />
          <Route path="/waiter-view-bills" element={<WaiterViewBills />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </UserAuthContextProvider>
  );
};

export default Router;
