import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconUser, IconPhone, IconShoppingBag } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import NotLoggedIn from '@/components/NotLoggedIn';

const Profile = () => {
  const { user, isCheckingAuth } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <NotLoggedIn />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 pt-20 md:pt-24 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold my-6">My Profile</h1>

      {/* User Info Card */}
      <Card className="mb-6 md:mb-8">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconUser className="w-6 h-6 text-primary" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <IconUser className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <IconPhone className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">{user.phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconShoppingBag className="w-6 h-6 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/myorders')}
              className="bg-primary text-white hover:bg-accent h-auto py-4 flex-col gap-2"
            >
              <IconShoppingBag className="w-6 h-6" />
              <span>View My Orders</span>
            </Button>
            <Button
              onClick={() => navigate('/products')}
              variant="outline"
              className="hover:bg-primary hover:text-white h-auto py-4 flex-col gap-2"
            >
              <IconShoppingBag className="w-6 h-6" />
              <span>Continue Shopping</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;