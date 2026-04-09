import { COA } from "./data/coa.js";
import { TRANSACTIONS } from "./data/transactions.js";

const $ = (id) => document.getElementById(id);

let score = 0;
let txIndex = 0;

// Ledger stores debit-positive balances
const ledger = Object.fromEntries(COA.map(a => [a.id, 0]));

// Current JE lines being built
let je = [newLine(), newLine()];

function newLine() {
  return { accountId: COA[0].id, dc:"D", amount:0 };
}

function fmt(n) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return sign + abs.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function accountById(id) {
  return COA.find(a => a.id === id);
}

function renderTransaction() {
  const tx = TRANSACTIONS[txIndex];
  $("txPrompt").textContent = `${txIndex+1}/${TRANSACTIONS.length} — ${tx.prompt}`;
  $("feedback").textContent = "";
}

function renderJELines() {
  const container = $("jeLines");
  container.innerHTML = "";

  je.forEach((line, i) => {
    const div = document.createElement("div");
    div.className = "je-line";

    const sel = document.createElement("select");
    COA.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = a.name;
      if (a.id === line.accountId) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = (e) => { je[i].accountId = e.target.value; renderTotals(); };

    const dc = document.createElement("select");
    ["D","C"].forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v === "D" ? "Debit" : "Credit";
      if (v === line.dc) opt.selected = true;
      dc.appendChild(opt);
    });
    dc.onchange = (e) => { je[i].dc = e.target.value; renderTotals(); };

    const amt = document.createElement("input");
    amt.type = "number";
    amt.min = "0";
    amt.step = "1";
    amt.value = line.amount;
    amt.oninput = (e) => { je[i].amount = Number(e.target.value || 0); renderTotals(); };

    const rm = document.createElement("button");
    rm.className = "remove";
    rm.textContent = "✕";
    rm.onclick = () => { je.splice(i,1); renderJELines(); renderTotals(); };

    div.appendChild(sel);
    div.appendChild(dc);
    div.appendChild(amt);
    div.appendChild(rm);
    container.appendChild(div);
  });

  renderTotals();
}

function totals() {
  const d = je.filter(l=>l.dc==="D").reduce((s,l)=>s+l.amount,0);
  const c = je.filter(l=>l.dc==="C").reduce((s,l)=>s+l.amount,0);
  return { d, c };
}

function renderTotals() {
  const { d, c } = totals();
  $("debits").textContent = d.toLocaleString();
  $("credits").textContent = c.toLocaleString();
  const ok = d > 0 && d === c;
  $("balanced").textContent = ok ? "Balanced" : "Not Balanced";
  $("balanced").style.color = ok ? "var(--ok)" : "var(--bad)";
}

function postToLedger(lines) {
  // debit-positive posting
  for (const line of lines) {
    const amt = Number(line.amount || 0);
    ledger[line.accountId] += (line.dc === "D" ? +amt : -amt);
  }
}

function linesEqualAsMultiset(a, b) {
  // compare (accountId, dc, amount) regardless of ordering
  const norm = (xs) => xs
    .map(x => `${x.accountId}|${x.dc}|${Number(x.amount)}`)
    .sort()
    .join(";");
  return norm(a) === norm(b);
}

function buildStatements() {
  const byType = (type) => COA.filter(a => a.type === type).map(a => ({...a, bal: ledger[a.id]}));

  // Display balance in "normal" direction
  const display = (a) => {
    // For credit-normal accounts, a negative internal bal means credit.
    // Convert so that normal direction shows positive.
    const normal = a.normal;
    const val = normal === "D" ? a.bal : -a.bal;
    return val;
  };

  const assets = byType("asset");
  const liab = byType("liability");
  const eq = byType("equity");
  const rev = byType("revenue");
  const exp = byType("expense");

  const total = (arr) => arr.reduce((s,a)=>s+display(a),0);

  const revTotal = total(rev);
  const expTotal = total(exp);
  const netIncome = revTotal - expTotal;

  // Equity statement: Begin RE = 0 for MVP
  const dividends = display(eq.find(a=>a.id==="div") ?? {normal:"D", bal:0});
  const endRE = 0 + netIncome - dividends;

  const bsAssets = total(assets);
  const bsLiab = total(liab);

  // Equity section: contributed capital + RE - Div (Div already in equity ledger; for statement we show explicitly)
  const commonStock = display(eq.find(a=>a.id==="cs") ?? {normal:"C", bal:0});
  const retainedEarnings = endRE;

  const bsEquity = commonStock + retainedEarnings; // (div already netted into endRE)

  return {
    income: { rev, exp, revTotal, expTotal, netIncome },
    balance: { assets, liab, bsAssets, bsLiab, bsEquity },
    equity: { commonStock, beginRE:0, netIncome, dividends, endRE }
  };
}

function renderStatements() {
  const s = buildStatements();

  const linesIS = [];
  linesIS.push("REVENUES");
  for (const a of s.income.rev) linesIS.push(`  ${a.name}: ${fmt(safeDisplay(a))}`);
  linesIS.push(`Total Revenues: ${fmt(s.income.revTotal)}`);
  linesIS.push("");
  linesIS.push("EXPENSES");
  for (const a of s.income.exp) linesIS.push(`  ${a.name}: ${fmt(safeDisplay(a))}`);
  linesIS.push(`Total Expenses: ${fmt(s.income.expTotal)}`);
  linesIS.push("");
  linesIS.push(`Net Income: ${fmt(s.income.netIncome)}`);
  $("incomeStmt").textContent = linesIS.join("\n");

  const linesBS = [];
  linesBS.push("ASSETS");
  for (const a of s.balance.assets) linesBS.push(`  ${a.name}: ${fmt(safeDisplay(a))}`);
  linesBS.push(`Total Assets: ${fmt(s.balance.bsAssets)}`);
  linesBS.push("");
  linesBS.push("LIABILITIES");
  for (const a of s.balance.liab) linesBS.push(`  ${a.name}: ${fmt(safeDisplay(a))}`);
  linesBS.push(`Total Liabilities: ${fmt(s.balance.bsLiab)}`);
  linesBS.push("");
  linesBS.push("EQUITY");
  linesBS.push(`  Common Stock: ${fmt(s.equity.commonStock)}`);
  linesBS.push(`  Retained Earnings: ${fmt(s.equity.endRE)}`);
  linesBS.push(`Total Equity: ${fmt(s.balance.bsEquity)}`);
  linesBS.push("");
  linesBS.push(`A = L + E ?  ${fmt(s.balance.bsAssets)} = ${fmt(s.balance.bsLiab)} + ${fmt(s.balance.bsEquity)}`);
  $("balanceSheet").textContent = linesBS.join("\n");

  const linesSE = [];
  linesSE.push("Contributed Capital");
  linesSE.push(`  Common Stock: ${fmt(s.equity.commonStock)}`);
  linesSE.push("");
  linesSE.push("Retained Earnings");
  linesSE.push(`  Beginning RE: ${fmt(s.equity.beginRE)}`);
  linesSE.push(`  + Net Income: ${fmt(s.equity.netIncome)}`);
  linesSE.push(`  - Dividends: ${fmt(s.equity.dividends)}`);
  linesSE.push(`  Ending RE: ${fmt(s.equity.endRE)}`);
  $("equityStmt").textContent = linesSE.join("\n");

  function safeDisplay(a){
    // mirror display() but scoped here
    return a.normal === "D" ? a.bal : -a.bal;
  }
}

function tryPostJE() {
  const { d, c } = totals();
  if (!(d > 0 && d === c)) {
    $("feedback").textContent = "Entry must balance before posting.";
    $("feedback").style.color = "var(--bad)";
    return;
  }

  const tx = TRANSACTIONS[txIndex];

  // Normalize JE lines: remove zeros
  const clean = je.filter(l => Number(l.amount) > 0);

  const correct = linesEqualAsMultiset(clean, tx.entry);

  if (correct) {
    score += 10;
    $("feedback").textContent = `✅ Correct! Posted. ${tx.explain}`;
    $("feedback").style.color = "var(--ok)";
    postToLedger(clean);
    renderStatements();
    $("score").textContent = `Score: ${score}`;
  } else {
    score -= 2;
    $("feedback").textContent = `❌ Not quite. Hint: think about which accounts change and their normal balances.`;
    $("feedback").style.color = "var(--bad)";
    $("score").textContent = `Score: ${score}`;
  }
}

$("addLine").onclick = () => { je.push(newLine()); renderJELines(); };
$("clearJE").onclick = () => { je = [newLine(), newLine()]; renderJELines(); };
$("postJE").onclick = tryPostJE;

$("nextTx").onclick = () => {
  txIndex = Math.min(txIndex + 1, TRANSACTIONS.length - 1);
  renderTransaction();
};
$("prevTx").onclick = () => {
  txIndex = Math.max(txIndex - 1, 0);
  renderTransaction();
};

renderTransaction();
renderJELines();
renderStatements();
