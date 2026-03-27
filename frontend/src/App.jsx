import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateRoute from "./components/PrivateRoute";
import ToastContainer from "./components/Toast";

// Lazy load semua pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Wallets = lazy(() => import("./pages/Wallets"));
const Categories = lazy(() => import("./pages/Categories"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Budgets = lazy(() => import("./pages/Budgets"));
const SavingGoals = lazy(() => import("./pages/SavingGoals"));
const Debts = lazy(() => import("./pages/Debts"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const Profile = lazy(() => import("./pages/Profile"));
const RecurringTransactions = lazy(() => import("./pages/RecurringTransactions"));

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-surface dark:bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Memuat...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/wallets" element={<PrivateRoute><Wallets /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/budgets" element={<PrivateRoute><Budgets /></PrivateRoute>} />
          <Route path="/saving-goals" element={<PrivateRoute><SavingGoals /></PrivateRoute>} />
          <Route path="/debts" element={<PrivateRoute><Debts /></PrivateRoute>} />
          <Route path="/subscriptions" element={<PrivateRoute><Subscriptions /></PrivateRoute>} />
          <Route path="/recurring" element={<PrivateRoute><RecurringTransactions /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
