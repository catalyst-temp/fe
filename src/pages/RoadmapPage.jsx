import { InfoBox } from "../components/ui/InfoBox.jsx";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { roadmapStages } from "../data/roadmap.js";

export function RoadmapPage() {
  return (
    <section className="roadmap-section page active">
      <PageIntro
        title="Roadmap 5 Tahun"
        description="Roadmap ini bukan janji angka, tapi peta keputusan agar bisnis tumbuh dengan fondasi yang sehat."
      />

      <InfoBox title="Cara baca roadmap ini">
        <p>
          Pakai roadmap sebagai arah. Kalau angka belum sesuai, ulangi fase sebelumnya sampai produk, margin, dan
          operasional lebih stabil.
        </p>
      </InfoBox>

      <div className="timeline">
        {roadmapStages.map((stage) => (
          <article className="tl-item" key={stage.year}>
            <div className="tl-dot" />
            <div className="tl-card">
              <div className="tl-card-header">
                <div className="tl-year">{stage.year}</div>
                <div className="tl-phase-name">{stage.name}</div>
                <div className="revenue-tag">{stage.revenue}</div>
              </div>
              <div className="tl-body">
                <div className="tl-goal">{stage.goal}</div>
                <div className="tl-targets">
                  {stage.targets.map((target) => (
                    <div className="tl-target" key={target}>
                      <span className="tl-target-icon">-&gt;</span>
                      <span>{target}</span>
                    </div>
                  ))}
                </div>
                <div className="tl-decision">
                  <div className="tl-decision-label">DECISION POINT</div>
                  <div className="tl-decision-text">{stage.decision}</div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
