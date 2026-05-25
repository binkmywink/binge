import { useState } from "react";

export default function Stars({ value = 0, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="stars" style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star ${n <= display ? "lit" : ""}`}
          onClick={readonly ? undefined : () => onChange?.(n === value ? 0 : n)}
          onMouseEnter={readonly ? undefined : () => setHover(n)}
          onMouseLeave={readonly ? undefined : () => setHover(0)}
          style={{ cursor: readonly ? "default" : "pointer" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
