import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { IconMenu2, IconShoppingCart, IconPackage, IconClipboardList, IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/features/authSlice';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout()).then(() => navigate('/'));
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
            {/* Logo */}
            <div className="w-9 h-9">
              <img
                src="/logo.jpg"
                alt="InstaSip Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Brand Name */}
            <Link
              to="/"
              className="font-archivo flex-shrink-0 text-primary font-bold hover:opacity-80 transition text-2xl tracking-tighter "
            >
              InstaSip
            </Link>
          </div>

          <div className="hidden sm:flex sm:space-x-8 items-center">
            <Link to="/products" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium">
              Products
            </Link>
            {user ? (
              <>
                {user.isAdmin ? (
                  <>
                    <Link to="/admin/products" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium flex items-center">
                      <IconPackage className="mr-1" size={18} /> Manage Products
                    </Link>
                    <Link to="/admin/orders" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium flex items-center">
                      <IconClipboardList className="mr-1" size={18} /> Manage Orders
                    </Link>
                  </>
                ) : (
                  <Link to="/orders" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium">
                    My Orders
                  </Link>
                )}
                <Link to="/cart" className="relative text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium flex items-center">
                  <IconShoppingCart size={18} />
                  {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">{cartCount}</span>}
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center">
                  <IconLogout size={18} className="mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-primary text-primary-soft hover:opacity-80 px-4 md:px-8 py-2 rounded-3xl text-md font-medium">
                  Login
                </Link>
                {/* <Link to="/signup" className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium">
                  Signup
                </Link> */}
              </>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost"><IconMenu2 /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="animate-fade-in">
                <div className="flex flex-col space-y-4 mt-4">
                  <Link to="/products" className="text-gray-900 hover:text-primary">Products</Link>
                  {user ? (
                    <>
                      {user.isAdmin ? (
                        <>
                          <Link to="/admin/products" className="flex items-center"><IconPackage className="mr-1" size={18} /> Manage Products</Link>
                          <Link to="/admin/orders" className="flex items-center"><IconClipboardList className="mr-1" size={18} /> Manage Orders</Link>
                        </>
                      ) : (
                        <Link to="/orders">My Orders</Link>
                      )}
                      <Link to="/cart" className="flex items-center"><IconShoppingCart size={18} /> Cart {cartCount > 0 && `(${cartCount})`}</Link>
                      <Button variant="ghost" onClick={handleLogout} className="flex items-center"><IconLogout size={18} className="mr-1" /> Logout</Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">Login</Link>
                      <Link to="/signup">Signup</Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;