import { IconWifiOff, IconRefresh } from '@tabler/icons-react';

const YouAreOffline = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center">
              <IconWifiOff size={48} className="text-primary" stroke={1.5} />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-accent mb-3">
            You're Offline
          </h1>
          
          <p className="text-neutral-500 text-lg mb-6">
            Oops! It looks like you've lost your internet connection. Please check your network settings and try again.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 md:p-6 mb-6 shadow-sm">
          <h3 className="text-base font-semibold text-orange-700 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                 stroke="currentColor" className="w-5 h-5 text-orange-600">
              <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 
                    9 9 0 0118 0z" />
            </svg>
            Quick Fixes
          </h3>

          <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside flex flex-col justify-center items-start mx-auto">
            <li>Check if Wi-Fi or mobile data is enabled</li>
            <li>Try turning airplane mode off</li>
            <li>Restart your router if using Wi-Fi</li>
          </ul>
</div>

          
          <button
            onClick={handleRefresh}
            className="w-full bg-primary hover:bg-accent text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <IconRefresh size={20} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouAreOffline;