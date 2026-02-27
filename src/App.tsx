import {
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import {
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
} from "@stellar/stellar-sdk";
import { useEffect, useState } from "react";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const connection = await isConnected();

      if (!connection.isConnected) {
        alert("Freighter not installed");
        return;
      }

      const result = await requestAccess();

      if (result.error) {
        alert("Connection failed");
        return;
      }

      setAddress(result.address);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);

      try {
        const account = await server.loadAccount(address);

        const nativeBalance = account.balances.find(
          (bal) => bal.asset_type === "native"
        );

        setBalance(nativeBalance?.balance ?? "0");
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setError("Account not activated. Fund via testnet faucet.");
        } else {
          setError("Failed to fetch balance");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  const sendXLM = async () => {
    if (!address) return;

    if (!recipient) {
      setTxStatus("Please enter recipient address.");
      return;
    }

    if (recipient.trim() === address?.trim()) {
      setTxStatus("You cannot send XLM to your own address.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setTxStatus("Amount must be greater than 0.");
      return;
    }

    try {
      setTxStatus("Building transaction...");
      setTxHash(null);

      const account = await server.loadAccount(address);

      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: recipient,
            asset: Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(30)
        .build();

      const xdr = transaction.toXDR();

      setTxStatus("Awaiting signature...");

      const signed = await signTransaction(xdr, {
        networkPassphrase: Networks.TESTNET,
      });

      const signedTx = TransactionBuilder.fromXDR(
        signed.signedTxXdr,
        Networks.TESTNET
      );

      setTxStatus("Submitting transaction...");

      const result = await server.submitTransaction(signedTx);

      setTxHash(result.hash);
      setTxStatus("Transaction successful!");
    } catch (err) {
      setTxStatus("Transaction failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center text-white">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-2xl rounded-3xl p-10 w-full max-w-lg backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Stellar White Belt dApp
        </h1>

        {!address ? (
          <button
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 transition duration-300 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/40"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-6">
            {/* Connected Address */}
            <div className="bg-gray-800/60 border border-gray-700 p-4 rounded-xl text-sm break-all">
              <p className="text-gray-400 mb-1">Connected Address</p>
              <p className="text-white font-medium">{address}</p>
            </div>

            {/* Balance */}
            {loading && (
              <p className="text-blue-400 font-medium">Loading balance...</p>
            )}

            {error && <p className="text-red-400 font-medium">{error}</p>}

            {balance && !loading && !error && (
              <div className="bg-gray-800/60 border border-gray-700 p-4 rounded-xl">
                <p className="text-gray-400 mb-1">Balance</p>
                <p className="text-2xl font-semibold text-green-400">
                  {balance} XLM
                </p>
              </div>
            )}

            {/* Send Section */}
            <div className="bg-gray-800/60 border border-gray-700 p-5 rounded-xl space-y-4">
              <h2 className="text-lg font-semibold text-blue-400">Send XLM</h2>

              <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={`w-full p-3 rounded-lg bg-gray-900 border ${
                  recipient.trim() === address?.trim()
                    ? "border-red-500"
                    : "border-gray-700"
                } focus:border-blue-500 focus:outline-none transition`}
              />

              <input
                type="text"
                inputMode="decimal"
                placeholder="Amount"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                    setAmount(value);
                  }
                }}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none transition"
              />

              <button
                onClick={sendXLM}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 transition duration-300 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/40"
              >
                Send
              </button>

              {txStatus && <p className="text-sm text-gray-300">{txStatus}</p>}

              {txHash && (
                <p className="text-sm break-all text-green-400">
                  Tx Hash: {txHash}
                </p>
              )}
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                View on Explorer
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
