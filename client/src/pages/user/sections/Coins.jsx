import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Coins = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">MuaSamViet Xu</h1>
      <p className="text-gray-600">Xu tích lũy của {user?.username || 'bạn'}</p>
    </div>
  );
};

export default Coins;

