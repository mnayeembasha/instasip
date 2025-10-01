const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-red-500 text-center p-4 bg-red-100 rounded-md">
    {message}
  </div>
);

export default ErrorMessage;