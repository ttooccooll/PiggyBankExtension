import React, { useEffect, useState, useCallback } from "react";
import Buttons from "./components/Buttons";
import Transactions from "./components/Transactions";
import axios from "axios";
import "./App.css";
import PdfModal from './components/PdfModal';
import Bio from './components/Bio';
import LifeSkillsLink from './components/LNmodal';

function App() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [webln, setWebln] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleLogout = () => {
    setWebln(null);
    window.location.reload();
  };

  const getPrice = useCallback(() => {
    // Keeping API call for future use, but not setting any state
    axios
      .get("https://api.coinbase.com/v2/prices/BTC-USD/spot")
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getWalletBalance = useCallback(async () => {
    if (!webln) return;
    try {
      console.log("Fetching balance...");
      const balanceRes = await webln.getBalance();
      console.log("Balance response:", balanceRes);
      setBalance(Math.floor(balanceRes.balance / 1000));
    } catch (err) {
      console.log("Balance error:", err);
    }
  }, [webln]);

  const getTransactions = useCallback(async () => {
    if (!webln) return;
    try {
      console.log("Fetching transactions...");
      // Use getInvoices and getSentPayments from WebLN if available
      // Otherwise, use a fallback approach
      let transactions = [];
      
      try {
        // For Alby extensions, we can use listTransactions if available
        if (webln.listTransactions) {
          const txs = await webln.listTransactions();
          transactions = txs.map(tx => ({
            type: tx.direction === 'incoming' ? 'receive' : 'send',
            amount: Math.floor(tx.amount / 1000),
            time: tx.timestamp || Math.floor(Date.now() / 1000),
            memo: tx.description || tx.memo || ""
          }));
        }
      } catch (e) {
        console.log("Could not get transactions from WebLN:", e);
      }
      
      setTransactions(transactions.sort((a, b) => b.time - a.time));
    } catch (err) {
      console.log("Transactions error:", err);
    }
  }, [webln]);

  useEffect(() => {
    const initWebLN = async () => {
      try {
        console.log("Initializing WebLN...");
        
        // Try to get WebLN from the Alby extension
        if (window.webln) {
          await window.webln.enable();
          setWebln(window.webln);
        } else if (window.alby && window.alby.webln) {
          await window.alby.webln.enable();
          setWebln(window.alby.webln);
        } else {
          throw new Error("No WebLN provider found. Please install Alby extension.");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize WebLN:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    initWebLN();
  }, []);

  useEffect(() => {
    if (webln) {
      getPrice();
      getWalletBalance();
      getTransactions();
    }
  }, [webln, getPrice, getWalletBalance, getTransactions]);

  useEffect(() => {
    const priceInterval = setInterval(() => {
      getPrice();
    }, 1000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
  
    const walletAndTransactionsInterval = setInterval(() => {
      if (webln) {
        getWalletBalance();
        getTransactions();
      }
    }, 5000);
  
    return () => {
      clearInterval(priceInterval);
      clearInterval(walletAndTransactionsInterval);
      clearInterval(timeInterval);
    };
  }, [webln, getPrice, getWalletBalance, getTransactions]);
  
  const [audio, setAudio] = useState(null);

  const playMP3 = () => {
    const newAudio = new Audio("/80s-alarm-clock-sound.mp3");
    newAudio.volume = 0.1;
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);
  };

  const stopMP3 = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const playMP4 = () => {
    const newAudio = new Audio("/oink-40664.mp3");
    newAudio.volume = 0.1;
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);
  };

  const stopMP4 = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const playMP7 = () => {
    const audio = new Audio("/pg10.mp3");
    audio.play();
  };

  return (
    <div className="App" id="everything">
      {loading && <div className="title-screen"><div className="title">Loading...</div></div>}
      {error && <div className="title-screen"><div className="title">Error: {error}</div></div>}
      {!loading && !error && (
      <div className="pigpic" id="thisisit">
        <h1>
          PiggyBank
        </h1>
        <h2 onMouseEnter={playMP3} onMouseLeave={stopMP3} >
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h2>
        <div className="row">
        <div className="balance-card">
          <p style={{ fontSize: '40px', fontStyle: '#2b1603' }} onMouseEnter={playMP4} onMouseLeave={stopMP4} >{balance}</p>
          <p style={{ fontSize: '35px', fontStyle: '#2b1603' }} onMouseEnter={playMP4} onMouseLeave={stopMP4} >sats</p>
        </div>
        <Buttons webln={webln} />
        </div>
        <div className="hungry">
          <img src="/hungry.png" alt="" style={{ width: "120px", opacity:.7, cursor: "pointer" }} onClick={handleLogout} title="Go outside and play! (logout)"/>
        </div>
        <div className="bookgo">
          <Bio />
          <PdfModal />
          <LifeSkillsLink />
          <div className="full" onClick={() => {
            playMP7();
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen()
                .catch((err) => {
                  console.error("Error attempting to enable full screen:", err);
                  document.getElementById("everything").classList.add("fullscreen-mode");
                });
              }
            }}>
            World Atlas
          </div>
        </div>
        <div className="row">
          <div className="row-item">
            <Transactions transactions={transactions} />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;