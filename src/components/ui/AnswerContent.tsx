import type { AnswerSection } from '@/lib/types';

export function AnswerContent({ sections }: { sections: AnswerSection[] }) {
  return (
    <div className="ai-content">
      {sections.map((s, i) => (
        <div key={i}>
          <h3>{s.heading}</h3>
          {s.body && <p>{s.body}</p>}
          {s.bullets && (
            <ul>
              {s.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
