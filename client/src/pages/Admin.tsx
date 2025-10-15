import { useState } from 'react';
import { IconPackage, IconTruck, IconCreditCard } from '@tabler/icons-react';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminPayments from './AdminPayments';

type TabType = 'orders' | 'products' | 'payments';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabType>('orders');

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-24">
        {/* Header Section */}
        <div className="my-4 md:mt-0 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-accent mb-2 tracking-tight">Admin Panel</h1>
        </div>

        {/* Tabs Section */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white rounded-4xl p-2 shadow-md border border-gray-200">
            <button
              onClick={() => setActiveTab('orders')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-3xl font-medium transition-all duration-200
                ${activeTab === 'orders'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }
              `}
            >
              <IconTruck className="w-5 h-5" />
              <span className="hidden sm:inline">Manage Orders</span>
              <span className="sm:hidden">Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-3xl font-medium transition-all duration-200
                ${activeTab === 'products'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }
              `}
            >
              <IconPackage className="w-5 h-5" />
              <span className="hidden sm:inline">Manage Products</span>
              <span className="sm:hidden">Products</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-3xl font-medium transition-all duration-200
                ${activeTab === 'payments'
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }
              `}
            >
              <IconCreditCard className="w-5 h-5" />
              <span className="hidden sm:inline">Manage Payments</span>
              <span className="sm:hidden">Payments</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="animate-fade-in pb-20 md:pb-0">
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'payments' && <AdminPayments />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
