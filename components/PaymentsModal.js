import React, { useState } from "react";
import Modal from "react-modal";
import "./PaymentsModal.css";
import QRCode from "qrcode.react";

const PaymentsModal = ({ modalState, setModalState, webln }) => {
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRequestClose = () => {
    if (!success) {
      setModalState({ type: "", open: false });
      setAmount("");
      setMemo("");
      setInvoice(null);
      setError(null);
      setSuccess(false);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setInvoice(null);
    setError(null);
    
    try {
      if (!webln) {
        throw new Error("WebLN not available");
      }

      if (amount.trim() === "" || isNaN(parseFloat(amount))) {
        throw new Error("Please enter a valid amount");
      }

      // Create an invoice using WebLN
      const amountSats = parseFloat(amount);
      const response = await webln.makeInvoice({
        amount: amountSats,
        defaultMemo: memo || "PiggyBank deposit",
      });

      if (response && response.paymentRequest) {
        setInvoice(response.paymentRequest);
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (err) {
      console.error("Error creating invoice:", err);
      setError(err.message || "Failed to create invoice");
    }
  };

  const playMP3 = () => {
    const audio = new Audio("/pg10.mp3");
    audio.play();
  };

  const playMP4 = () => {
    const audio = new Audio("/put-away-book.mp3");
    audio.play();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invoice);
      alert("Invoice copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Lightning Invoice",
          text: invoice,
        });
      } else {
        throw new Error("Web Share API not supported");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      // Fallback to copy
      handleCopy();
    }
  };

  return (
    <Modal
      isOpen={modalState.open}
      onRequestClose={handleRequestClose}
      onAfterOpen={playMP3}
      onAfterClose={playMP4}
      contentLabel="Payment Modal"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="payment-modal">
        <h2>Bitcoin Piggy Bank</h2>
        <button className="close-button" onClick={handleRequestClose}>
          &times;
        </button>

        <div className="payment-content">
          {modalState.type === "receive" && (
            <div className="receive-section">
              <h3>Add Funds to Your Piggy Bank</h3>
              {!invoice ? (
                <form onSubmit={handleCreateInvoice}>
                  <div className="form-group">
                    <label>Amount (sats)</label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount in sats"
                    />
                  </div>
                  <div className="form-group">
                    <label>Memo (optional)</label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="What's this for?"
                    />
                  </div>
                  <button type="submit" className="primary-button">
                    Generate Invoice
                  </button>
                </form>
              ) : (
                <div className="invoice-display">
                  <div className="qr-container">
                    <QRCode value={invoice} size={200} />
                  </div>
                  <div className="invoice-actions">
                    <button onClick={handleCopy} className="secondary-button">
                      Copy Invoice
                    </button>
                    <button onClick={handleShare} className="secondary-button">
                      Share
                    </button>
                  </div>
                </div>
              )}
              {error && <div className="error-message">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PaymentsModal;