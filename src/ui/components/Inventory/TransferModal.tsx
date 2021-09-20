import { Principal } from "@dfinity/principal";
import classNames from "classnames";
import React, { useState } from "react";
import { useTransfer } from "../../lib/hooks/useTransfer";
import { TypedItem } from "../../lib/types";
import { formatNumber } from "../../lib/utils";
import SpinnerButton from "../Buttons/SpinnerButton";
import ErrorAlert from "../Labels/ErrorAlert";
import Modal from "../Layout/Modal";

export default function TransferModal({ item }: { item: TypedItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const balance = BigInt(1);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const transfer = useTransfer(item);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    let principal: Principal;
    if (recipient) {
      try {
        principal = Principal.fromText(recipient);
      } catch (err) {
        setError("Invalid principal");
        return;
      }
    }

    transfer.mutate(
      {
        recipient: principal,
      },
      { onSuccess: closeModal }
    );
  };

  return (
    <>
      <div>
        <button
          type="button"
          onClick={openModal}
          className="btn-inventory btn-primary"
        >
          Transfer
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        title="Transfer Item"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col divide-gray-300 divide-y">
            <div className="flex flex-col gap-2 pb-4">
              <p className="text-sm leading-tight">
                Transfer this item to another Principal.
              </p>

              <label className="block">
                <span>Recipient</span>
                <input
                  type="text"
                  placeholder="Enter Principal"
                  className="w-full mt-1"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  maxLength={64}
                  required
                />
              </label>

              {!!error && <ErrorAlert>{error}</ErrorAlert>}

              {balance > 1 && (
                <label className="block">
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span
                      className={classNames({
                        "text-gray-400": balance > BigInt(0),
                        "text-red-400": balance === BigInt(0),
                      })}
                    >
                      Your Balance: {formatNumber(balance)}
                    </span>
                  </div>
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-full mt-1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={0}
                    max={Number(balance)}
                    required
                  />
                </label>
              )}
            </div>

            <div className="flex flex-col gap-2 py-4">
              <SpinnerButton
                className="w-20 p-2"
                isLoading={transfer.isLoading}
                isDisabled={
                  !recipient ||
                  (balance > 1 && (!amount || Number(amount) <= 0))
                }
              >
                Submit
              </SpinnerButton>

              {!!transfer.error && <ErrorAlert>{transfer.error}</ErrorAlert>}
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
