import {isConnected, requestAccess, signTransaction} from "@stellar/freighter-api";
import {Horizon, TransactionBuilder, Networks, Operation, Asset} from "@stellar/stellar-sdk";
import { useEffect, useState } from "react";

const server = new Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

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
          setError(
            "Account not activated. Fund via testnet faucet."
          );
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
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-gray-900 shadow-xl rounded-2xl p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold text-white-800 mb-6 text-center">
          Stellar White Belt dApp
        </h1>

        {!address ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-6">

            <div className="bg-gray-800 p-3 rounded-lg text-sm break-all">
              <p className="text-gray-400">Connected Address</p>
              <p>{address}</p>
            </div>

            {loading && (
              <p className="text-blue-400">Loading balance...</p>
            )}

            {error && (
              <p className="text-red-500">{error}</p>
            )}

            {balance && !loading && !error && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400">Balance</p>
                <p className="text-xl font-semibold text-green-400">
                  {balance} XLM
                </p>
              </div>
            )}

            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold text-blue-400">
                Send XLM
              </h2>

              <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white outline-none"
              />

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white outline-none"
              />

              <button
                onClick={sendXLM}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
              >
                Send
              </button>

              {txStatus && (
                <p className="text-sm text-gray-300">
                  {txStatus}
                </p>
              )}

              {txHash && (
                <p className="text-sm break-all text-green-400">
                  Tx Hash: {txHash}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;