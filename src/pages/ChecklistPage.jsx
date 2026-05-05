import { ChecklistItem } from "../components/ui/ChecklistItem.jsx";
import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { StatCard } from "../components/ui/StatCard.jsx";

export function ChecklistPage({ auth, checklist }) {
  const { phases, completedIds, progress, toggleItem, reset } = checklist;
  const completedPhases = phases.filter((phase) =>
    phase.items.every((item) => completedIds.includes(item.id)),
  ).length;

  return (
    <section className="content page active">
      <div className="overview">
        <div className="overview-grid">
          <StatCard label="Progress" value={`${progress.percent}%`} />
          <StatCard label="Checklist" value={`${progress.done}/${progress.total}`} />
          <StatCard label="Fase Selesai" value={completedPhases} />
          <StatCard label="Fase Total" value={phases.length} />
        </div>
      </div>

      <div className="quote-banner">
        <div className="quote-eyebrow">PRINSIP UTAMA</div>
        <div className="quote-text">
          Jangan scale sesuatu yang belum terbukti. Rapikan fondasi, baca angka, lalu naikkan volume dengan sadar.
        </div>
      </div>

      <PageIntro
        title="Checklist Bisnis Online"
        description="Urutan kerja praktis untuk membangun toko yang siap jual, siap iklan, dan siap scale."
      />

      {!auth.isAuthenticated ? (
        <InfoBox title="Login untuk menyimpan progress">
          <p>Masuk dengan Google agar checklist tersimpan di database Catalyst dan bisa dibuka lagi nanti.</p>
        </InfoBox>
      ) : null}

      {checklist.error ? (
        <InfoBox title="API checklist belum siap">
          <p>{checklist.error}</p>
        </InfoBox>
      ) : null}

      {phases.map((phase) => {
        const phaseDone = phase.items.every((item) => completedIds.includes(item.id));
        return (
          <section className="phase" key={phase.id}>
            <div className="phase-header">
              <div className="phase-num">{phase.number}</div>
              <div className="phase-info">
                <div className="phase-title">{phase.title}</div>
                <div className="phase-sub">{phase.subtitle}</div>
              </div>
              {phaseDone ? <div className="phase-badge visible">Selesai</div> : null}
            </div>
            <div className="checklist">
              {phase.items.map((item) => (
                <ChecklistItem
                  disabled={!auth.isAuthenticated || checklist.loading}
                  done={completedIds.includes(item.id)}
                  item={item}
                  key={item.id}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {progress.percent === 100 ? (
        <div className="celebration show">
          <h2>Fondasi bisnis kamu sudah rapi</h2>
          <p>Sekarang fokus ke evaluasi angka, iklan kecil, dan konsistensi operasional.</p>
        </div>
      ) : null}

      <InfoBox title="Catatan MVP">
        <p>
          Progress sekarang tersimpan lewat API Catalyst setelah kamu login dengan Google.
        </p>
      </InfoBox>

      <button className="reset-btn" disabled={!auth.isAuthenticated || checklist.loading} onClick={reset} type="button">
        Reset semua checklist
      </button>
    </section>
  );
}
