import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  IconMenu2,
  IconShoppingCart,
  IconLogout,
  IconBox,
  IconUser,
  IconUserPlus,
  IconLayoutDashboard
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { logout } from '@/store/features/authSlice';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only hide navbar on mobile screens
      if (window.innerWidth < 1024) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate('/');
      setIsSheetOpen(false);
    });
  };

  const handleLinkClick = () => setIsSheetOpen(false);

  return (
    <nav
      className={`fixed w-full z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-5xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-white/60 backdrop-blur-md shadow-lg rounded-4xl border border-gray-200">
          <div className="flex justify-between h-16 lg:h-14 2xl:h-16 items-center px-4 md:px-3">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-9 h-9">
                <img
                  src="/logo.jpg"
                  alt="InstaSip Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-primary font-bold hover:opacity-80 transition text-2xl md:text-2xl tracking-tighter ">
                InstaSip
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                to="/products"
                className="text-gray-700 hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
              >
                <IconBox size={18} />
                Products
              </Link>

              {user ? (
                <>
                  {user.isAdmin ? (
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                    >
                      <IconLayoutDashboard size={18} />
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                    >
                      <IconUser size={18} />
                      Profile
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 h-auto"
                  >
                    <IconLogout size={18} />
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-md"
                >
                  <IconUser size={18} />
                  Login
                </Link>
              )}

              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-primary hover:bg-primary/5 p-2.5 rounded-xl transition-all"
              >
                <IconShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center lg:hidden space-x-2">
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-primary p-2 rounded-xl transition-all"
              >
                <IconShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="text-primary p-2">
                    <IconMenu2 size={22} />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-white/95 backdrop-blur-md p-6 space-y-4 text-gray-900 w-64"
                >
                  <div className="space-y-3">
                    <Link
                      to="/products"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 hover:text-primary hover:bg-primary/5 p-3 rounded-xl transition-all"
                    >
                      <IconBox size={20} />
                      <span className="font-medium">Products</span>
                    </Link>

                    {user ? (
                      <>
                        {user.isAdmin ? (
                          <Link
                            to="/admin"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 hover:text-primary hover:bg-primary/5 p-3 rounded-xl transition-all"
                          >
                            <IconLayoutDashboard size={20} />
                            <span className="font-medium">Admin Panel</span>
                          </Link>
                        ) : (
                          <Link
                            to="/profile"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 hover:text-primary hover:bg-primary/5 p-3 rounded-xl transition-all"
                          >
                            <IconUser size={20} />
                            <span className="font-medium">Profile</span>
                          </Link>
                        )}

                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="flex items-center gap-3 hover:text-primary hover:bg-primary/5 p-3 rounded-xl transition-all w-full justify-start"
                        >
                          <IconLogout size={20} />
                          <span className="font-medium">Logout</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 hover:text-primary hover:bg-primary/5 p-3 rounded-xl transition-all"
                        >
                          <IconUser size={20} />
                          <span className="font-medium">Login</span>
                        </Link>
                        <Link
                          to="/signup"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 hover:text-primary hover:bg-primary/5 p-3 rounded-xl transition-all"
                        >
                          <IconUserPlus size={20} />
                          <span className="font-medium">Signup</span>
                        </Link>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;