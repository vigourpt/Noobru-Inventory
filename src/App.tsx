import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/auth/AuthProvider";
import { InventoryProvider } from "./components/inventory/InventoryProvider";
import UsersPage from "./components/admin/UsersPage";
import InventoryList from "./components/inventory/InventoryList";
import ReportsPage from "./components/reports/ReportsPage";
import SettingsPage from "./components/admin/SettingsPage";
import StockMovementPage from "./components/movements/StockMovementPage";
import OrderManagement from "./components/orders/OrderManagement";
import routes from "tempo-routes";
import { Toaster } from "./components/ui/toaster";

function App() {
  // Create the tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <InventoryProvider>
          <>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <InventoryList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stock-movement"
                element={
                  <ProtectedRoute>
                    <StockMovementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
            {tempoRoutes}
          </>
        </InventoryProvider>
        <Toaster />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
