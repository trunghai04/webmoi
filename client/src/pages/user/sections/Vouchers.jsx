import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Vouchers = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kho Voucher</h1>
      <p className="text-gray-600">Voucher của {user?.username || 'bạn'}</p>
    </div>
  );
};

export default Vouchers;

