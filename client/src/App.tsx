import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "react-hot-toast";
import Home from "@/pages/Home";
import Signup from "@/pages/SignUp";
import Login from "@/pages/Login";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import Contact from "@/pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect, lazy, Suspense } from "react";
import { getMe } from "./store/features/authSlice";
import LoadingSpinner from "./components/LoadingSpinner";
import SEOManager from "./components/SEOManager";
import { fetchCart } from "./store/features/cartSlice";
import InstasipBenefits from "./pages/InstasipBenefits";
import NotFound from "./pages/NotFound";
import YouAreOffline from "./pages/YouAreOffline";
import useOffline from "./hooks/useOffline";

const Admin = lazy(() => import("@/pages/Admin"));

const AppContent = () => {
  const dispatch = useAppDispatch();
  const isOffline = useOffline();

    

  const { isCheckingAuth, user: currentUser } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);
  
  useEffect(() => {
    if (!isCheckingAuth && currentUser) {
      dispatch(fetchCart());
    }
  }, [dispatch, currentUser, isCheckingAuth]);

  if (isOffline) {
    return <YouAreOffline />;
  }
  
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <Router>
      <SEOManager />
      <Navbar />
      <BottomNav />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/benefits" element={<InstasipBenefits />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          {/* Admin route - lazy loaded */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background text-foreground">
        <AppContent />
        <Toaster position="top-center" />
      </div>
    </Provider>
  );
};

export default App;