import AuthForm from '@/components/AuthForm';

const Signup = () => {
  return (

    <div className="min-h-screen flex justify-center items-between w-full">
      <div className="w-full flex flex-col lg:flex-row items-center justify-center  animate-fade-in">
        <div className="hidden lg:block lg:w-1/2 w-full h-full pt-10">
          {/* <h2 className="text-3xl font-bold text-primary">Join InstaSip Today</h2>
          <p className="mt-4 text-gray-600">Create an account to start shopping in bulk with exclusive deals.</p> */}
          <img src="/logo_trf.jpeg" alt='InstaSip' className='w-full h-full object-fill object-center'/>
        </div>
        <div className="flex flex-col justify-center lg:w-1/2 lg:px-20 lg:pt-20 max-w-7xl  w-full h-full  p-8 rounded-lg shadow-md bg-white">
          <AuthForm type="signup" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
