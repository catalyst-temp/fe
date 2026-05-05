import { useMemo, useState } from "react";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { expenseCategories, incomeCategories, useTransactions } from "../services/financeService.js";
import { formatDate, formatRp, formatRpFull } from "../utils/formatters.js";

const transactionInitial = {
  type: "income",
  category: "",
  note: "",
  amount: "",
  transactionDate: new Date().toISOString().slice(0, 10),
};

const hppInitial = {
  mode: "reseller",
  beli: "",
  ongkirSup: "",
  bahan: "",
  tenaga: "",
  overhead: "",
  pack: "",
  bubble: "",
  jual: "",
  feePct: "",
  ongkirSub: "",
  iklan: "",
  budgetHari: "",
  targetOrder: "",
  autoAds: false,
};

export function FinancePage({ auth }) {
  const finance = useTransactions(auth.isAuthenticated);
  const [filter, setFilter] = useState("all");
  const [transactionForm, setTransactionForm] = useState(transactionInitial);
  const [hppForm, setHppForm] = useState(hppInitial);

  const categories = transactionForm.type === "income" ? incomeCategories : expenseCategories;
  const filteredTransactions =
    filter === "all"
      ? finance.transactions
      : finance.transactions.filter((transaction) => transaction.type === filter);

  const hpp = useMemo(() => calculateHpp(hppForm), [hppForm]);

  function updateTransaction(field, value) {
    setTransactionForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "type" ? { category: "" } : null),
    }));
  }

  async function submitTransaction(event) {
    event.preventDefault();
    if (!auth.isAuthenticated || !transactionForm.category || Number(transactionForm.amount) <= 0) return;
    const saved = await finance.addTransaction(transactionForm);
    if (saved) {
      setTransactionForm({ ...transactionInitial, type: transactionForm.type });
    }
  }

  function updateHpp(field, value) {
    setHppForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <section className="keu-section page active">
      <PageIntro
        title="Pencatatan Keuangan Bisnis"
        description="Catat arus uang sederhana agar kamu tahu bisnis benar-benar untung atau hanya terlihat ramai."
      />

      {!auth.isAuthenticated ? (
        <InfoBox title="Login untuk menyimpan transaksi">
          <p>Masuk dengan Google agar catatan keuangan tersimpan di database Catalyst.</p>
        </InfoBox>
      ) : null}

      {finance.error ? (
        <InfoBox title="API keuangan belum siap">
          <p>{finance.error}</p>
        </InfoBox>
      ) : null}

      <div className="keu-summary">
        <div className="keu-stat">
          <div className="keu-stat-label">Total Masuk</div>
          <div className="keu-stat-val green">{formatRp(finance.summary.income)}</div>
        </div>
        <div className="keu-stat">
          <div className="keu-stat-label">Total Keluar</div>
          <div className="keu-stat-val red">{formatRp(finance.summary.expense)}</div>
        </div>
        <div className="keu-stat full">
          <div className="keu-stat-label">Profit Bersih</div>
          <div className={`keu-stat-val ${finance.summary.profit >= 0 ? "green" : "red"}`}>
            {finance.summary.profit >= 0 ? "+" : ""}
            {formatRp(finance.summary.profit)}
          </div>
        </div>
      </div>

      <div className="health-panel">
        <HealthBar label="Margin Profit" value={finance.summary.margin} good={20} warn={10} />
        <HealthBar label="Rasio Pengeluaran Iklan" value={finance.summary.adsRatio} reverse good={20} warn={35} />
        <HealthBar label="Rasio Operasional" value={finance.summary.opsRatio} reverse good={20} warn={35} />
      </div>

      <form className="keu-form" onSubmit={submitTransaction}>
        <div className="keu-form-header">Tambah Catatan</div>
        <div className="keu-form-body">
          <div className="keu-type-btn">
            <button
              className={`type-btn ${transactionForm.type === "income" ? "active-masuk" : ""}`}
              onClick={() => updateTransaction("type", "income")}
              type="button"
            >
              Masuk
            </button>
            <button
              className={`type-btn ${transactionForm.type === "expense" ? "active-keluar" : ""}`}
              onClick={() => updateTransaction("type", "expense")}
              type="button"
            >
              Keluar
            </button>
          </div>
          <div className="keu-row">
            <select
              className="keu-select"
              onChange={(event) => updateTransaction("category", event.target.value)}
              value={transactionForm.category}
            >
              <option value="">Pilih kategori...</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              className="keu-input"
              onChange={(event) => updateTransaction("amount", event.target.value)}
              placeholder="Nominal"
              type="number"
              value={transactionForm.amount}
            />
          </div>
          <div className="keu-row">
            <input
              className="keu-input wide"
              onChange={(event) => updateTransaction("note", event.target.value)}
              placeholder="Catatan"
              value={transactionForm.note}
            />
            <input
              className="keu-input"
              onChange={(event) => updateTransaction("transactionDate", event.target.value)}
              type="date"
              value={transactionForm.transactionDate}
            />
          </div>
          <button className="calc-btn" disabled={!auth.isAuthenticated || finance.loading} type="submit">
            Simpan Catatan
          </button>
        </div>
      </form>

      <div className="filter-row">
        {[
          ["all", "Semua"],
          ["income", "Masuk"],
          ["expense", "Keluar"],
        ].map(([id, label]) => (
          <button className={`keu-filter-btn ${filter === id ? "active" : ""}`} key={id} onClick={() => setFilter(id)} type="button">
            {label}
          </button>
        ))}
      </div>

      <div className="keu-entries">
        {filteredTransactions.length ? (
          filteredTransactions.map((transaction) => (
            <div className="keu-entry" key={transaction.id}>
              <div className={`keu-entry-dot ${transaction.type === "income" ? "dot-masuk" : "dot-keluar"}`} />
              <div className="keu-entry-body">
                <div className="keu-entry-cat">{transaction.category}</div>
                <div className="keu-entry-note">{transaction.note}</div>
                <div className="keu-entry-date">{formatDate(transaction.transactionDate)}</div>
              </div>
              <div className={`keu-entry-amount ${transaction.type === "income" ? "amount-masuk" : "amount-keluar"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatRp(transaction.amount)}
              </div>
              <button className="keu-delete" onClick={() => finance.deleteTransaction(transaction.id)} type="button">
                x
              </button>
            </div>
          ))
        ) : (
          <div className="keu-empty">Belum ada catatan. Mulai catat transaksi pertama bisnis kamu.</div>
        )}
      </div>

      <HppCalculator form={hppForm} hpp={hpp} update={updateHpp} />

      <InfoBox title="Saran Keuangan Bisnis">
        <p>
          Pisahkan uang bisnis dan uang pribadi. Rekap minimal seminggu sekali agar perubahan biaya iklan, stok, dan
          margin cepat terlihat.
        </p>
      </InfoBox>
    </section>
  );
}

function HealthBar({ label, value, good, warn, reverse = false }) {
  const status = reverse
    ? value <= good
      ? "hf-green"
      : value <= warn
        ? "hf-yellow"
        : "hf-red"
    : value >= good
      ? "hf-green"
      : value >= warn
        ? "hf-yellow"
        : "hf-red";

  return (
    <div className="health-item">
      <div className="health-head">
        <span className="health-label">{label}</span>
        <span className="health-value">{value}%</span>
      </div>
      <div className="health-track">
        <div className={`health-fill ${status}`} style={{ width: `${Math.min(Math.max(value, 3), 100)}%` }} />
      </div>
    </div>
  );
}

function HppCalculator({ form, hpp, update }) {
  return (
    <div className="hpp-panel">
      <PageIntro
        title="Kalkulator HPP Produk"
        description="HPP bukan cuma modal produk. Isi semua komponen yang relevan agar harga jual tidak menipu."
      />
      <div className="keu-type-btn">
        <button className={`type-btn ${form.mode === "reseller" ? "active-masuk" : ""}`} onClick={() => update("mode", "reseller")} type="button">
          Reseller
        </button>
        <button className={`type-btn ${form.mode === "production" ? "active-masuk" : ""}`} onClick={() => update("mode", "production")} type="button">
          Produksi Sendiri
        </button>
      </div>

      <div className="calc-grid">
        {form.mode === "reseller" ? (
          <>
            <NumberField label="Harga beli produk" name="beli" update={update} value={form.beli} />
            <NumberField label="Ongkir supplier" name="ongkirSup" update={update} value={form.ongkirSup} />
          </>
        ) : (
          <>
            <NumberField label="Bahan baku" name="bahan" update={update} value={form.bahan} />
            <NumberField label="Tenaga kerja" name="tenaga" update={update} value={form.tenaga} />
            <NumberField label="Overhead" name="overhead" update={update} value={form.overhead} />
          </>
        )}
        <NumberField label="Packaging" name="pack" update={update} value={form.pack} />
        <NumberField label="Bubble/lakban" name="bubble" update={update} value={form.bubble} />
        <NumberField label="Harga jual" name="jual" update={update} value={form.jual} />
        <NumberField label="Fee platform (%)" name="feePct" update={update} value={form.feePct} />
        <NumberField label="Subsidi ongkir" name="ongkirSub" update={update} value={form.ongkirSub} />
        <NumberField label="Biaya iklan/item" name="iklan" update={update} value={form.iklan} />
      </div>

      <div className="hpp-auto">
        <div className="hpp-auto-head">
          <div>
            <strong>Estimasi biaya iklan per item</strong>
            <span>Hitung dari budget harian dibagi target order.</span>
          </div>
          <button
            className={`type-btn ${form.autoAds ? "active-masuk" : ""}`}
            onClick={() => update("autoAds", !form.autoAds)}
            type="button"
          >
            {form.autoAds ? "Auto aktif" : "Manual"}
          </button>
        </div>
        {form.autoAds ? (
          <>
            <div className="calc-grid">
              <NumberField label="Budget iklan/hari" name="budgetHari" update={update} value={form.budgetHari} />
              <NumberField label="Target order/hari" name="targetOrder" update={update} value={form.targetOrder} />
            </div>
            <div className="hpp-auto-result">Estimasi: {formatRpFull(hpp.adCostPerItem)} per item</div>
          </>
        ) : null}
      </div>

      {hpp.hasInput ? (
        <div className="hpp-result">
          <div className="hpp-stat-grid">
            <div>
              <span>HPP Total</span>
              <strong>{formatRpFull(hpp.total)}</strong>
            </div>
            <div>
              <span>Profit</span>
              <strong className={hpp.profit >= 0 ? "green" : "red"}>{formatRpFull(hpp.profit)}</strong>
            </div>
            <div>
              <span>Margin</span>
              <strong>{hpp.margin}%</strong>
            </div>
            <div>
              <span>Harga Min.</span>
              <strong>{formatRpFull(hpp.minPrice)}</strong>
            </div>
          </div>
          <div className="hpp-breakdown">
            {hpp.breakdown.map((item) => (
              <div className="hpp-breakdown-row" key={item.label}>
                <span>{item.label}</span>
                <strong>{formatRpFull(item.value)}</strong>
              </div>
            ))}
          </div>
          <div className={`hpp-verdict ${hpp.margin >= 20 ? "good" : hpp.margin >= 10 ? "warn" : "bad"}`}>
            {hpp.verdict}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NumberField({ label, name, value, update }) {
  return (
    <label className="calc-field">
      <span>{label}</span>
      <input className="calc-input" onChange={(event) => update(name, event.target.value)} placeholder="0" type="number" value={value} />
    </label>
  );
}

function calculateHpp(form) {
  const n = (key) => Number(form[key]) || 0;
  const breakdown = [];
  let base = 0;

  if (form.mode === "reseller") {
    base = n("beli") + n("ongkirSup");
    if (n("beli")) breakdown.push({ label: "Harga beli produk", value: n("beli") });
    if (n("ongkirSup")) breakdown.push({ label: "Ongkir supplier", value: n("ongkirSup") });
  } else {
    base = n("bahan") + n("tenaga") + n("overhead");
    if (n("bahan")) breakdown.push({ label: "Bahan baku", value: n("bahan") });
    if (n("tenaga")) breakdown.push({ label: "Tenaga kerja", value: n("tenaga") });
    if (n("overhead")) breakdown.push({ label: "Overhead", value: n("overhead") });
  }

  const feePlatform = n("jual") * (n("feePct") / 100);
  const adCostPerItem = form.autoAds && n("targetOrder") ? Math.round(n("budgetHari") / n("targetOrder")) : n("iklan");
  const costs = [
    ["Packaging", n("pack")],
    ["Bubble/lakban", n("bubble")],
    ["Fee platform", feePlatform],
    ["Subsidi ongkir", n("ongkirSub")],
    ["Biaya iklan/item", adCostPerItem],
  ];
  costs.forEach(([label, value]) => {
    if (value) breakdown.push({ label, value });
  });

  const total = base + costs.reduce((sum, [, value]) => sum + value, 0);
  const profit = n("jual") - total;
  const margin = n("jual") ? Math.round((profit / n("jual")) * 100) : 0;
  const minPrice = Math.ceil(total * 1.15);
  const verdict =
    margin >= 20
      ? "Margin sehat. Harga jual sudah cukup baik."
      : margin >= 10
        ? `Margin tipis. Pertimbangkan harga minimal ${formatRpFull(minPrice)}.`
        : profit < 0
          ? `Harga jual di bawah HPP. Kamu rugi ${formatRpFull(Math.abs(profit))} per item.`
          : "Margin sangat rendah. Cari supplier lebih murah atau naikkan harga.";

  return {
    total,
    profit,
    margin,
    minPrice,
    breakdown,
    verdict,
    adCostPerItem,
    hasInput: total > 0,
  };
}
