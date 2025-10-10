import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import {
  IconHome,
  IconBox,
  IconUser,
  IconShoppingCart,
  IconLayoutDashboard
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';

const BottomNav = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show bottom nav when scrolling down on mobile
      if (window.innerWidth < 1024) {
        if (currentScrollY > 100) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16 px-2">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
              isActive('/')
                ? 'text-primary bg-primary/5'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            <IconHome size={22} />
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>

          {/* Products */}
          <Link
            to="/products"
            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
              isActive('/products')
                ? 'text-primary bg-primary/5'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            <IconBox size={22} />
            <span className="text-xs mt-1 font-medium">Products</span>
          </Link>

          {/* Profile or Admin */}
          {/* {user && ( */}
            <>
              {user && user.isAdmin ? (
                <Link
                  to="/admin"
                  className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
                    isActive('/admin')
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  <IconLayoutDashboard size={22} />
                  <span className="text-xs mt-1 font-medium">Admin</span>
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
                    isActive('/profile')
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  <IconUser size={22} />
                  <span className="text-xs mt-1 font-medium">Profile</span>
                </Link>
              )}
            </>
           {/* )} */}

          {/* Cart */}
          <Link
            to="/cart"
            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all relative ${
              isActive('/cart')
                ? 'text-primary bg-primary/5'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            <div className="relative">
              <IconShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">Cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
