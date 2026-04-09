import { COA } from "./data/coa.js";
import { TRANSACTIONS } from "./data/transactions.js";

const $ = (id) => document.getElementById(id);

let score = 0;
let txIndex = 0;
let gameTransactions = [];
let answeredTransactions = new Set();
let correctAnswers = 0;

// Internal ledger uses debit-positive balances
const ledger = Object.fromEntries(COA.map((account) => [account.id, 0]));

let je = [newLine(), newLine()];

function newLine() {
  return {
    accountId: COA[0].id,
    dc: "D",
    amount: 0
  };
}

function displayAmount(account) {
  if (!account) return 0;
  return account.normal === "D" ? account.bal : -account.bal;
}

function totals() {
  const d = je
    .filter((line) => line.dc === "D")
    .reduce((sum, line) => sum + Number(line.amount || 0), 0);

  const c = je
    .filter((line) => line.dc === "C")
    .reduce((sum, line) => sum + Number(line.amount || 0), 0);

  return { d, c };
}

function moneyHTML(n) {
  const abs = Math.abs(n).toLocaleString();

  if (n < 0) {
    return `($${abs})`;
  }

  return `$${abs}`;
}

function rowHTML(label, amount, options = {}) {
  const labelClass = options.indent ? "statement-label indent" : "statement-label";
  const rowClass = options.rowClass ? `statement-row ${options.rowClass}` : "statement-row";

  return `
    <div class="${rowClass}">
      <div class="${labelClass}">${label}</div>
      <div class="statement-amount">${moneyHTML(amount)}</div>
    </div>
  `;
}
function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getRandomTransactions(allTransactions, count) {
  return shuffleArray(allTransactions).slice(0, count);
}

function renderTransaction() {
  const tx = gameTransactions[txIndex];
$("txPrompt").textContent = `${txIndex + 1}/${gameTransactions.length} — ${tx.prompt}`;
  $("feedback").textContent = "";
  $("feedback").style.color = "var(--muted)";
}

function renderJELines() {
  const container = $("jeLines");
  container.innerHTML = "";

  je.forEach((line, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "je-line";

    const accountSelect = document.createElement("select");
    COA.forEach((account) => {
      const option = document.createElement("option");
      option.value = account.id;
      option.textContent = account.name;
      option.selected = account.id === line.accountId;
      accountSelect.appendChild(option);
    });
    accountSelect.addEventListener("change", (event) => {
      je[i].accountId = event.target.value;
      renderTotals();
    });

    const dcSelect = document.createElement("select");
    [
      { value: "D", label: "Debit" },
      { value: "C", label: "Credit" }
    ].forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      option.selected = item.value === line.dc;
      dcSelect.appendChild(option);
    });
    dcSelect.addEventListener("change", (event) => {
      je[i].dc = event.target.value;
      renderTotals();
    });

    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.min = "0";
    amountInput.step = "1";
    amountInput.value = line.amount;
    amountInput.addEventListener("input", (event) => {
      je[i].amount = Number(event.target.value || 0);
      renderTotals();
    });

    const removeButton = document.createElement("button");
    removeButton.className = "remove";
    removeButton.type = "button";
    removeButton.textContent = "✕";
    removeButton.addEventListener("click", () => {
      if (je.length <= 1) return;
      je.splice(i, 1);
      renderJELines();
      renderTotals();
    });

    wrapper.appendChild(accountSelect);
    wrapper.appendChild(dcSelect);
    wrapper.appendChild(amountInput);
    wrapper.appendChild(removeButton);

    container.appendChild(wrapper);
  });

  renderTotals();
}

function renderTotals() {
  const { d, c } = totals();
  const isBalanced = d > 0 && d === c;

  $("debits").textContent = d.toLocaleString();
  $("credits").textContent = c.toLocaleString();
  $("balanced").textContent = isBalanced ? "Balanced" : "Not Balanced";
  $("balanced").className = isBalanced ? "status-good" : "status-bad";
}

function postToLedger(lines) {
  for (const line of lines) {
    const amount = Number(line.amount || 0);
    ledger[line.accountId] += line.dc === "D" ? amount : -amount;
  }
}

function linesEqualAsMultiset(a, b) {
  const normalize = (lines) =>
    lines
      .map((line) => `${line.accountId}|${line.dc}|${Number(line.amount)}`)
      .sort()
      .join(";");

  return normalize(a) === normalize(b);
}

function buildStatements() {
  const byType = (type) =>
    COA
      .filter((account) => account.type === type)
      .map((account) => ({
        ...account,
        bal: ledger[account.id]
      }));

  const assets = byType("asset");
  const liabilities = byType("liability");
  const equityAccounts = byType("equity");
  const revenues = byType("revenue");
  const expenses = byType("expense");

  const totalDisplayed = (accounts) =>
    accounts.reduce((sum, account) => sum + displayAmount(account), 0);

  const revTotal = totalDisplayed(revenues);
  const expTotal = totalDisplayed(expenses);
  const netIncome = revTotal - expTotal;

  const dividends = displayAmount(
    equityAccounts.find((account) => account.id === "div") ?? { normal: "D", bal: 0 }
  );

  const commonStock = displayAmount(
    equityAccounts.find((account) => account.id === "cs") ?? { normal: "C", bal: 0 }
  );

  const endRE = netIncome - dividends;
  const bsAssets = totalDisplayed(assets);
  const bsLiabilities = totalDisplayed(liabilities);
  const bsEquity = commonStock + endRE;

  return {
    income: {
      revenues,
      expenses,
      revTotal,
      expTotal,
      netIncome
    },
    balance: {
      assets,
      liabilities,
      bsAssets,
      bsLiabilities,
      bsEquity
    },
    equity: {
      commonStock,
      beginRE: 0,
      netIncome,
      dividends,
      endRE
    }
  };
}

function renderStatements() {
  const statements = buildStatements();

  $("incomeStmt").innerHTML = `
    <div class="statement-title">Income Statement</div>
    <div class="statement-subtitle">For the Current Period</div>

    <div class="statement-section">
      <div class="statement-section-label">Revenues</div>
      ${statements.income.revenues
        .map((account) => rowHTML(account.name, displayAmount(account), { indent: true }))
        .join("")}
      ${rowHTML("Total Revenues", statements.income.revTotal, { rowClass: "statement-total" })}
    </div>

    <div class="statement-section">
      <div class="statement-section-label">Expenses</div>
      ${statements.income.expenses
        .map((account) => rowHTML(account.name, displayAmount(account), { indent: true }))
        .join("")}
      ${rowHTML("Total Expenses", statements.income.expTotal, { rowClass: "statement-total" })}
    </div>

    <div class="statement-section">
      ${rowHTML("Net Income", statements.income.netIncome, { rowClass: "statement-grand-total" })}
    </div>
  `;

  $("balanceSheet").innerHTML = `
    <div class="statement-title">Balance Sheet</div>
    <div class="statement-subtitle">As of the Current Date</div>

    <div class="statement-section">
      <div class="statement-section-label">Assets</div>
      ${statements.balance.assets
        .map((account) => rowHTML(account.name, displayAmount(account), { indent: true }))
        .join("")}
      ${rowHTML("Total Assets", statements.balance.bsAssets, { rowClass: "statement-total" })}
    </div>

    <div class="statement-section">
      <div class="statement-section-label">Liabilities</div>
      ${statements.balance.liabilities
        .map((account) => rowHTML(account.name, displayAmount(account), { indent: true }))
        .join("")}
      ${rowHTML("Total Liabilities", statements.balance.bsLiabilities, { rowClass: "statement-total" })}
    </div>

    <div class="statement-section">
      <div class="statement-section-label">Stockholders' Equity</div>
      ${rowHTML("Common Stock", statements.equity.commonStock, { indent: true })}
      ${rowHTML("Retained Earnings", statements.equity.endRE, { indent: true })}
      ${rowHTML("Total Equity", statements.balance.bsEquity, { rowClass: "statement-total" })}
    </div>

    <div class="statement-eq">
      Assets = Liabilities + Equity<br>
      ${moneyHTML(statements.balance.bsAssets)} = ${moneyHTML(statements.balance.bsLiabilities)} + ${moneyHTML(statements.balance.bsEquity)}
    </div>
  `;

  $("equityStmt").innerHTML = `
    <div class="statement-title">Statement of Stockholders' Equity</div>
    <div class="statement-subtitle">For the Current Period</div>

    <div class="statement-section">
      <div class="statement-section-label">Contributed Capital</div>
      ${rowHTML("Common Stock", statements.equity.commonStock, { indent: true })}
    </div>

    <div class="statement-section">
      <div class="statement-section-label">Retained Earnings</div>
      ${rowHTML("Beginning Retained Earnings", statements.equity.beginRE, { indent: true })}
      ${rowHTML("Add: Net Income", statements.equity.netIncome, { indent: true })}
      ${rowHTML("Less: Dividends", statements.equity.dividends, { indent: true })}
      ${rowHTML("Ending Retained Earnings", statements.equity.endRE, { rowClass: "statement-grand-total" })}
    </div>
  `;
}

function tryPostJE() {
  const { d, c } = totals();

  if (!(d > 0 && d === c)) {
    $("feedback").textContent = "Entry must balance before posting.";
    $("feedback").style.color = "var(--bad)";
    return;
  }

  const tx = gameTransactions[txIndex];
  const cleanLines = je.filter((line) => Number(line.amount) > 0);
  const correct = linesEqualAsMultiset(cleanLines, tx.entry);

  if (answeredTransactions.has(tx.id)) {
    $("feedback").textContent = "You already answered this transaction.";
    $("feedback").style.color = "var(--auburn-navy)";
    return;
  }

  answeredTransactions.add(tx.id);

  if (correct) {
    score += 10;
    correctAnswers += 1;
    $("feedback").textContent = `✅ Correct! Posted.\n${tx.explain}`;
    $("feedback").style.color = "var(--ok)";

    postToLedger(cleanLines);
    renderStatements();
  } else {
    $("feedback").textContent =
      "❌ Incorrect.\nHint: think about which accounts change and their normal balances.";
    $("feedback").style.color = "var(--bad)";
  }

  $("score").textContent = `Score: ${correctAnswers} / ${gameTransactions.length}`;

  if (answeredTransactions.size === gameTransactions.length) {
    $("feedback").textContent += `\n\nGame complete. Final score: ${correctAnswers} out of ${gameTransactions.length}. Refresh the page to start a new round.`;
  }
}

function showGame() {
  $("landingPage").classList.add("is-hidden");
  $("gameWrapper").classList.remove("is-hidden");
}

function bindEvents() {
  $("startGame").addEventListener("click", showGame);

  $("addLine").addEventListener("click", () => {
    je.push(newLine());
    renderJELines();
  });

  $("clearJE").addEventListener("click", () => {
    je = [newLine(), newLine()];
    renderJELines();
    $("feedback").textContent = "";
    $("feedback").style.color = "var(--muted)";
  });

  $("postJE").addEventListener("click", tryPostJE);

  $("nextTx").addEventListener("click", () => {
    txIndex = Math.min(txIndex + 1, gameTransactions.length - 1);
    renderTransaction();
  });

  $("prevTx").addEventListener("click", () => {
    txIndex = Math.max(txIndex - 1, 0);
    renderTransaction();
  });
}

function init() {
  gameTransactions = getRandomTransactions(TRANSACTIONS, 10);
  txIndex = 0;
  score = 0;
  correctAnswers = 0;
  answeredTransactions = new Set();

  $("score").textContent = `Score: 0 / ${gameTransactions.length}`;

  bindEvents();
  renderTransaction();
  renderJELines();
  renderStatements();
}

init();
