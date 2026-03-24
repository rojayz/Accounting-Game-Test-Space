:root {
  --bg: #f1f2f4;
  --card: #ffffff;
  --card-2: #f7f7f8;
  --border: #d8dbe1;
  --text: #102c4a;
  --muted: #6a7280;
  --accent: #d96b27;
  --accent-soft: #f6e2d4;
  --accent-border: #ebb089;
  --navy-soft: #eef2f7;
  --shadow: 0 1px 2px rgba(16, 44, 74, 0.06);
  --radius: 16px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
}

.app-shell {
  max-width: 1500px;
  margin: 0 auto;
  padding: 12px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.topbar h1 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.score-pill {
  background: var(--navy-soft);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
  color: var(--muted);
  font-size: 0.95rem;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.card-inner {
  background: #f3f4f6;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px;
}

.top-controls {
  padding: 12px;
  margin-bottom: 12px;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.controls-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-label {
  color: var(--accent);
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}

.small-label {
  font-size: 0.9rem;
  color: #404956;
  font-weight: 700;
}

.right-label {
  text-align: right;
}

.slider-wrap {
  margin-bottom: 12px;
}

input[type="range"] {
  width: 100%;
  accent-color: var(--accent);
}

.top-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.ghost-btn {
  background: #ffffff;
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.8rem;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.transaction-item {
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: 10px;
  background: #f8f8f9;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: 0.15s ease;
}

.transaction-item:hover {
  background: #fffaf7;
  border-color: var(--accent-border);
}

.transaction-item.active {
  border-color: var(--accent);
  background: #fff6f0;
}

.tx-number {
  color: var(--accent);
  font-weight: 800;
  font-size: 0.9rem;
}

.tx-text {
  color: var(--text);
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.25;
}

.transaction-title {
  margin: 0 0 10px;
  font-size: 1.1rem;
  color: var(--text);
  font-weight: 800;
}

.journal-card {
  background: #f3f4f6;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px;
}

.journal-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 12px;
}

.journal-table th,
.journal-table td {
  border: 1px solid var(--border);
  padding: 8px 10px;
  font-size: 0.95rem;
}

.journal-table th {
  background: #eef1f5;
  text-align: left;
  font-weight: 800;
}

.journal-table td.num {
  text-align: right;
  font-weight: 800;
}

.entry-note {
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 700;
}

.nav-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.nav-btn {
  border-radius: 999px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.95rem;
}

.nav-btn.primary {
  border: 1px solid var(--accent);
  background: #fff7f1;
  color: var(--accent);
}

.nav-btn.secondary {
  border: 1px solid var(--border);
  background: #f4f5f7;
  color: var(--text);
}

.jump-text {
  margin-top: 10px;
  font-size: 0.9rem;
  color: var(--muted);
  font-weight: 700;
}

.statements-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.statement-card {
  padding: 12px;
}

.statement-body {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.statement-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 12px;
}

.total-row {
  background: var(--accent-soft);
}

.row-label {
  font-weight: 800;
  color: var(--text);
}

.row-change {
  min-width: 84px;
  text-align: right;
  font-size: 0.78rem;
  font-weight: 800;
  color: #b55b22;
}

.row-value {
  min-width: 96px;
  text-align: right;
  font-weight: 900;
  color: var(--text);
}

.effect-summary {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.effect-chip {
  display: inline-block;
  width: fit-content;
  background: #fff7f1;
  border: 1px solid var(--accent-border);
  color: #b55b22;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.82rem;
  font-weight: 800;
}

.hidden {
  display: none !important;
}

@media (max-width: 1100px) {
  .top-grid,
  .statements-grid {
    grid-template-columns: 1fr;
  }
}
