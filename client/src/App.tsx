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
import Admin from "@/pages/Admin";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from "react";
import { getMe } from "./store/features/authSlice";
import LoadingSpinner from "./components/LoadingSpinner";
import SEOManager from "./components/SEOManager";
import { fetchCart } from "./store/features/cartSlice";
import InstasipBenefits from "./pages/InstasipBenefits";

const AppContent = () => {
  const dispatch = useAppDispatch();
  const { isCheckingAuth,user: currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(()=>{
     if(!isCheckingAuth && currentUser){
        dispatch(fetchCart());
     }	
  },[dispatch,currentUser,isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <SEOManager/>
      <Navbar />
      <BottomNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/benefits" element={<InstasipBenefits />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Admin route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
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
