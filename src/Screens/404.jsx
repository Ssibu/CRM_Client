import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className=" flex flex-col items-center justify-center text-gray-800">
      <div className="max-w-lg text-center px-6 py-12 ">
        <h1 className="text-6xl font-bold text-red-700">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 bg-blue-800 text-white font-medium rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Return to Homepage
        </Link>
      </div>

      
    </div>
  );
};

export default Error;
