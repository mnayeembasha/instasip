import {  IconHome, IconArrowLeft } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-20">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <div className="mb-6 flex justify-center">
            {/*<div className="w-32 h-32 rounded-full bg-orange-50 flex items-center justify-center">
              <IconError404 size={64} className="text-primary" stroke={1.5} />
            </div>*/}
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-primary mb-4">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-accent mb-4">
            Page Not Found
          </h2>
          
          <p className="text-neutral-500 text-lg mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the URL might be incorrect.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-accent font-semibold py-3 px-6 rounded-lg border-2 border-secondary transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <IconArrowLeft size={20} />
              Go Back
            </button>
            
            <Link
              to="/"
              className="w-full sm:w-auto bg-primary hover:bg-accent text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <IconHome size={20} />
              Home Page
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-neutral-500">
              If you believe this is a mistake, please{' '}
              <Link to="/contact" className="text-primary hover:text-accent font-semibold underline">
                contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;