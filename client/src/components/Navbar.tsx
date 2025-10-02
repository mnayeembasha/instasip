import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  IconMenu2,
  IconShoppingCart,
  IconPackage,
  IconClipboardList,
  IconLogout,
  IconBox,
  IconUser,
  IconUserPlus
} from '@tabler/icons-react';
import { useState } from 'react';
import { logout } from '@/store/features/authSlice';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate('/');
      setIsSheetOpen(false);
    });
  };

  const handleLinkClick = () => setIsSheetOpen(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9">
              <img
                src="/logo.jpg"
                alt="InstaSip Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <Link
              to="/"
              className="font-archivo flex-shrink-0 text-primary font-bold hover:opacity-80 transition text-2xl tracking-tighter"
            >
              InstaSip
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-8 items-center">
            <Link
              to="/products"
              onClick={handleLinkClick}
              className={`text-gray-900 hover:text-primary px-3 py-2 rounded-4xl text-md font-medium flex items-center ${user?.isAdmin ? '' : 'bg-[#F9EEDC]'}`}
            >
              <IconBox size={18} className="mr-1" /> Products
            </Link>
            {/* <Link
                  to="/products"
                  onClick={handleLinkClick}
                  className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium flex items-center"
                >
                  <IconPackage size={18} className="mr-1" /> Explore
                </Link> */}

            {user ? (
              <>
                {user.isAdmin ? (
                  <>
                    <Link
                      to="/admin/products"
                      onClick={handleLinkClick}
                      className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium flex items-center"
                    >
                      <IconPackage className="mr-1" size={18} /> Manage Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      onClick={handleLinkClick}
                      className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium flex items-center"
                    >
                      <IconClipboardList className="mr-1" size={18} /> Manage Orders
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/orders"
                    onClick={handleLinkClick}
                    className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium"
                  >
                    My Orders
                  </Link>
                )}
                <Button variant="ghost" onClick={handleLogout} className="flex items-center text-gray-900 hover:bg-primary hover:text-primary-soft px-3 py-2 rounded-4xl text-md font-medium transition-all duration-300">
                  <IconLogout size={18} className="mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="bg-primary text-primary-soft hover:opacity-80 px-4  py-2 rounded-4xl text-md font-medium flex items-center"
                >
                  <IconUser size={18} className="mr-1" /> Login
                </Link>

              </>
            )}

            <Link
              to="/cart"
              onClick={handleLinkClick}
              className="relative text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium flex items-center"
            >
              <IconShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center sm:hidden space-x-3">
            {/* Cart icon outside the menu */}
            <Link
              to="/cart"
              onClick={handleLinkClick}
              className="relative text-gray-900 hover:text-primary flex items-center"
            >
              <IconShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile sheet menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-primary">
                  <IconMenu2 size={22} className='text-2xl'/>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-white p-6 space-y-4 text-gray-900"
              >
                <Link
                  to="/products"
                  onClick={handleLinkClick}
                  className="flex items-center hover:text-primary"
                >
                  <IconBox className="mr-2" size={18} /> Products
                </Link>
                {/* <Link
                  to="/products"
                  onClick={handleLinkClick}
                  className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-md font-medium flex items-center"
                >
                  <IconPackage size={18} className="mr-1" /> Explore
                </Link> */}

                {user ? (
                  <>
                    {user.isAdmin ? (
                      <>
                        <Link
                          to="/admin/products"
                          onClick={handleLinkClick}
                          className="flex items-center hover:text-primary"
                        >
                          <IconPackage className="mr-2" size={18} /> Manage Products
                        </Link>
                        <Link
                          to="/admin/orders"
                          onClick={handleLinkClick}
                          className="flex items-center hover:text-primary"
                        >
                          <IconClipboardList className="mr-2" size={18} /> Manage Orders
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/orders"
                        onClick={handleLinkClick}
                        className="flex items-center hover:text-primary"
                      >
                        <IconClipboardList className="mr-2" size={18} /> My Orders
                      </Link>
                    )}

                    <Button variant="ghost" onClick={handleLogout} className="flex items-center">
                      <IconLogout size={18} className="mr-2" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={handleLinkClick}
                      className="flex items-center hover:text-primary"
                    >
                      <IconUser className="mr-2" size={18} /> Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={handleLinkClick}
                      className="flex items-center hover:text-primary"
                    >
                      <IconUserPlus className="mr-2" size={18} /> Signup
                    </Link>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
