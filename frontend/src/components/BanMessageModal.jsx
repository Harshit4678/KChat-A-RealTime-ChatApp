import React from "react";

export default function BanMessageModal({ message, adminEmail, onLogout }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Account Banned</h2>
        <p className="mb-4 text-gray-700">{message}</p>
        <p className="mb-2 text-gray-600">For appeal, please contact admin:</p>
        <a
          href={`mailto:${adminEmail}`}
          className="text-blue-600 underline mb-4 block"
        >
          {adminEmail}
        </a>
        <button className="btn btn-error w-full mt-4" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
