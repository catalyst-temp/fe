import { useState } from "react";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { adChecklist, adDecisions, adMetrics } from "../data/ads.js";
import { formatRpFull } from "../utils/formatters.js";

const initialForm = {
  budget: "",
  revenue: "",
  price: "",
  cogs: "",
};

export function AdsPage() {
  const [form, setForm] = useState(initialForm);
  const budget = Number(form.budget) || 0;
  const revenue = Number(form.revenue) || 0;
  const price = Number(form.price) || 0;
  const cogs = Number(form.cogs) || 0;
  const roas = budget ? revenue / budget : 0;
  const units = price ? Math.round(revenue / price) : 0;
  const platformFee = revenue * 0.05;
  const profit = revenue - cogs * units - budget - platformFee;
  const hasResult = budget > 0 && revenue > 0;

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  const verdict =
    roas >= 3
      ? { className: "verdict-good", text: "ROAS bagus. Pertimbangkan scale budget bertahap." }
      : roas >= 1.5
        ? { className: "verdict-warn", text: "ROAS masih perlu optimasi. Cek foto, harga, dan targeting." }
        : { className: "verdict-bad", text: "ROAS terlalu rendah. Matikan dulu dan evaluasi fondasi produk." };

  return (
    <section className="ad-section page active">
      <PageIntro
        title="Panduan Evaluasi Iklan"
        description="Baca angka sebelum bakar uang. Iklan hanya alat amplifikasi, bukan pengganti produk dan toko yang belum siap."
      />

      <div className="calc-box">
        <div className="calc-title">Kalkulator ROAS & Iklan</div>
        <div className="calc-grid">
          <label className="calc-field">
            <span>Budget iklan</span>
            <input className="calc-input" name="budget" onChange={updateField} placeholder="cth: 50000" type="number" value={form.budget} />
          </label>
          <label className="calc-field">
            <span>Omzet dari iklan</span>
            <input className="calc-input" name="revenue" onChange={updateField} placeholder="cth: 180000" type="number" value={form.revenue} />
          </label>
          <label className="calc-field">
            <span>Harga jual/item</span>
            <input className="calc-input" name="price" onChange={updateField} placeholder="cth: 90000" type="number" value={form.price} />
          </label>
          <label className="calc-field">
            <span>HPP/item</span>
            <input className="calc-input" name="cogs" onChange={updateField} placeholder="cth: 45000" type="number" value={form.cogs} />
          </label>
        </div>
        {hasResult ? (
          <div className="calc-result">
            <div className="calc-result-label">HASIL EVALUASI</div>
            <div className="calc-result-value">{roas.toFixed(1)}x</div>
            <div className="calc-result-sub">Estimasi profit: {formatRpFull(profit)}</div>
            <div className={`calc-result-verdict ${verdict.className}`}>{verdict.text}</div>
          </div>
        ) : null}
      </div>

      <div className="metrics-grid">
        {adMetrics.map((metric) => (
          <div className="metric-card" key={metric.name}>
            <div className="metric-name">{metric.name}</div>
            <div className="metric-full">{metric.full}</div>
            <div className="metric-desc">{metric.description}</div>
            <div className={`metric-benchmark bench-${metric.status}`}>{metric.benchmark}</div>
          </div>
        ))}
      </div>

      <div className="decision-tree">
        <div className="dt-header">Apa yang harus dilakukan dengan iklanmu?</div>
        {adDecisions.map((decision) => (
          <div className="dt-row" key={decision.condition}>
            <div className="dt-condition">{decision.condition}</div>
            <div className="dt-arrow">-&gt;</div>
            <div className="dt-action">
              <div className="dt-action-title">{decision.action}</div>
              <div className="dt-action-desc">{decision.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ad-checklist">
        <div className="ad-check-header">Checklist Sebelum Jalankan Iklan</div>
        {adChecklist.map((item) => (
          <div className="check-item static" key={item}>
            <span className="checkbox mini">OK</span>
            <span className="check-body">
              <span className="check-title">{item}</span>
            </span>
          </div>
        ))}
      </div>

      <InfoBox title="Mindset iklan" variant="dark">
        Seller yang berhasil bukan selalu yang budgetnya paling besar, tapi yang paling rajin membaca data dan berani
        menghentikan iklan yang tidak perform.
      </InfoBox>
    </section>
  );
}
