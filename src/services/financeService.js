import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "./apiClient.js";

export const incomeCategories = [
  "Penjualan Produk",
  "Refund Diterima",
  "Bonus / Insentif Platform",
  "Penjualan Affiliate",
  "Lainnya (Masuk)",
];

export const expenseCategories = [
  "Modal / Stok Produk",
  "Biaya Iklan",
  "Packaging & Packing",
  "Ongkir",
  "Fee Platform",
  "Gaji / Upah",
  "Operasional",
  "Lainnya (Keluar)",
];

export function useTransactions(enabled = true) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTransactions() {
    if (!enabled) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/transactions");
      setTransactions(data.transactions || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTransaction(payload) {
    if (!enabled) return false;

    setError("");
    try {
      const data = await apiRequest("/api/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setTransactions((current) => [data.transaction, ...current]);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  }

  async function deleteTransaction(id) {
    if (!enabled) return;

    const previous = transactions;
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    setError("");
    try {
      await apiRequest(`/api/transactions/${id}`, { method: "DELETE" });
    } catch (requestError) {
      setTransactions(previous);
      setError(requestError.message);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, [enabled]);

  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const profit = income - expense;
    const adsExpense = transactions
      .filter((transaction) => transaction.type === "expense" && transaction.category === "Biaya Iklan")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const opsExpense = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          !["Biaya Iklan", "Modal / Stok Produk"].includes(transaction.category),
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      income,
      expense,
      profit,
      margin: income ? Math.round((profit / income) * 100) : 0,
      adsRatio: income ? Math.round((adsExpense / income) * 100) : 0,
      opsRatio: income ? Math.round((opsExpense / income) * 100) : 0,
    };
  }, [transactions]);

  return { transactions, summary, loading, error, addTransaction, deleteTransaction, reload: loadTransactions };
}
