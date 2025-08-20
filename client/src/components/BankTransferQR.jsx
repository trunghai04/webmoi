import React from 'react';
import { FaCopy, FaCheckCircle } from 'react-icons/fa';

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Copy failed:', e);
    return false;
  }
};

const BankTransferQR = ({ bankInfo, orderAmount, orderId }) => {
  if (!bankInfo) return null;

  const bankBin = bankInfo.bankBin || '970436';
  const accountNumber = bankInfo.accountNumber || '';
  const accountHolder = bankInfo.accountHolder || '';
  const bankName = bankInfo.bankName || '';

  const amount = Math.max(0, Math.round(Number(orderAmount || 0)));
  const addInfo = `Thanh toan don hang ${orderId || ''}`.trim();

  // VietQR image API
  const qrUrl = `https://img.vietqr.io/image/${encodeURIComponent(bankBin)}-${encodeURIComponent(accountNumber)}-compact.png?amount=${encodeURIComponent(amount)}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(accountHolder)}`;

  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Quét mã QR để chuyển khoản nhanh</h3>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="bg-white p-4 rounded-lg border w-full md:w-auto">
          <img
            src={qrUrl}
            alt="VietQR"
            className="w-56 h-56 object-contain"
          />
        </div>

        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow label="Ngân hàng" value={`${bankName} (${bankBin})`} copyable={false} />
            <InfoRow label="Số tài khoản" value={accountNumber} />
            <InfoRow label="Chủ tài khoản" value={accountHolder} />
            <InfoRow label="Số tiền" value={amount.toLocaleString('vi-VN')} copyable={false} />
            <InfoRow label="Nội dung" value={addInfo} />
          </div>
          <p className="text-xs text-gray-500 mt-3">Lưu ý: Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng.</p>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, copyable = true }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!copyable) return;
    const ok = await copyToClipboard(value);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-800 break-all">{value}</div>
      </div>
      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="ml-3 text-gray-500 hover:text-gray-700"
          title="Sao chép"
        >
          {copied ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
        </button>
      )}
    </div>
  );
};

export default BankTransferQR;
