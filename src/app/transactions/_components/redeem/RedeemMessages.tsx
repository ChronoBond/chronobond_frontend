"use client";

import { type RedeemMessagesProps } from "@/types/redeem.types";

export const RedeemMessages = ({ error, success, onClearMessages }: RedeemMessagesProps) => {
  return (
    <>
      {error && (
        <div className="bg-error/10 text-error border border-error/20 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={onClearMessages}
              className="text-error hover:text-error/80"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-success/10 text-success border border-success/20 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button
              onClick={onClearMessages}
              className="text-success hover:text-success/80"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};
