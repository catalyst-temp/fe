import { useState } from "react";
import { PageIntro } from "../components/ui/PageIntro.jsx";
import { qnaItems } from "../data/qna.js";

export function QnaPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="qna-section page active">
      <PageIntro
        title="Q&A - Pertanyaan Paling Sering"
        description="Jawaban praktis untuk keputusan yang sering bikin seller pemula ragu."
      />

      {qnaItems.map((item, index) => {
        const open = openIndex === index;
        return (
          <article className={`qna-item ${open ? "open" : ""}`} key={item.question}>
            <button className="qna-question" onClick={() => setOpenIndex(open ? -1 : index)} type="button">
              <span className="q-icon">Q</span>
              <span className="q-text">{item.question}</span>
              <span className="q-arrow">v</span>
            </button>
            <div className="qna-answer">
              <p>{item.answer}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
