import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  Outlet,
} from "react-router"; // Import Navigate
import "./index.css";
import "./styles/animation.css";
import App from "./App.jsx";

import {
  Register,
  Login,
  Dashboard,
  SelfPickUp,
  BusinessDashboard,
  Listings,
  PickUpRequests,
  Notification,
  AddProduct,
  EditProduct,
  Category,
  Product,
  Shops,
} from "./pages";
import { BusinessLayout, ProtectedRoute } from "./components";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <SocketProvider>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Outlet />}>
              <Route path="" element={<Dashboard />} />
              <Route path="category/:name" element={<Outlet />}>
                <Route path="" element={<Category />} />
                <Route path=":id" element={<Product />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="self-pick-up" element={<Outlet />}>
                <Route path="" element={<SelfPickUp />} />
                <Route path="shop/:id" element={<Shops />} />
              </Route>
              <Route path="business" element={<BusinessLayout />}>
                <Route path="dashboard" element={<BusinessDashboard />} />
                <Route path="listings" element={<Outlet />}>
                  <Route path="" element={<Listings />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="edit-product/:id" element={<EditProduct />} />
                </Route>
                <Route path="pick-up-requests" element={<PickUpRequests />} />
                <Route path="notifications" element={<Notification />} />
              </Route>
            </Route>
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  </SocketProvider>

  // </StrictMode>
);
