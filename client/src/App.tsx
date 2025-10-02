import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Navbar from '@/components/Navbar';
import {Toaster} from 'react-hot-toast';
import Home from '@/pages/Home';
import Signup from '@/pages/SignUp';
import Login from '@/pages/Login';
import Products from '@/pages/Products';
import Cart from '@/pages/Cart';
import AdminOrders from '@/pages/AdminOrders';
import MyOrders from '@/pages/MyOrders';
import AdminProducts from './pages/AdminProducts';
import ProductDetails from './pages/ProductDetails';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/products" element={<Products />} />
  <Route path="/products/:slug" element={<ProductDetails />} />

    {/* Protected routes */}
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/products"
      element={
        <ProtectedRoute adminOnly>
          <AdminProducts />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/orders"
      element={
        <ProtectedRoute adminOnly>
          <AdminOrders />
        </ProtectedRoute>
      }
    />
  </Routes>
        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
};

export default App;