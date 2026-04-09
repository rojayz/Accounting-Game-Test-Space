import { COA } from "./data/coa.js";
import { TRANSACTIONS } from "./data/transactions.js";

const $ = (id) => document.getElementById(id);

let txIndex = 0;
let gameTransactions = [];
let answeredTransactions = new Set();
let lockedTransactions = new Set();
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
  return n < 0 ? `($${abs})` : `$${abs}`;
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

function currentTransaction() {
  return gameTransactions[txIndex];
}

function renderTransaction() {
  const tx = currentTransaction();

  if (!tx) {
    $("txPrompt").textContent = "No transaction available.";
    return;
  }

  const locked = lockedTransactions.has(tx.id);
  const answered = answeredTransactions.has(tx.id);

  let status = "";
  if (locked && answered) {
    status = " — Answered";
  }

  $("txPrompt").textContent = `${txIndex + 1}/${gameTransactions.length} — ${tx.prompt}${status}`;
  updateButtonStates();
}

function renderJELines() {
  const container = $("jeLines");
  container.innerHTML = "";

  const tx = currentTransaction();
  const locked = tx ? lockedTransactions.has(tx.id) : false;

  je.forEach((line, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "je-line";

    const accountSelect = document.createElement("select");
    accountSelect.disabled = locked;

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
    dcSelect.disabled = locked;

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
    amountInput.disabled = locked;

    amountInput.addEventListener("input", (event) => {
      je[i].amount = Number(event.target.value || 0);
      renderTotals();
    });

    const removeButton = document.createElement("button");
    removeButton.className = "remove";
    removeButton.type = "button";
    removeButton.textContent = "✕";
    removeButton.disabled = locked;

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

  $("debits").textContent = moneyHTML(d);
  $("credits").textContent = moneyHTML(c);
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
    <div class="statement-subtitle">For the Current Round</div>

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
    <div class="statement-subtitle">Current Position</div>

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
    <div class="statement-subtitle">For the Current Round</div>

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

function updateScoreDisplay() {
  $("score").textContent = `Score: ${correctAnswers} / ${gameTransactions.length}`;
}

function updateButtonStates() {
  const tx = currentTransaction();
  if (!tx) return;

  const locked = lockedTransactions.has(tx.id);

  $("postJE").disabled = locked;
  $("addLine").disabled = locked;
  $("clearJE").disabled = locked;
}

function resetJEForNextQuestion() {
  je = [newLine(), newLine()];
  renderJELines();
}

function finishGame() {
  $("feedback").textContent = `🏁 Game complete. Final score: ${correctAnswers} out of ${gameTransactions.length}. Refresh the page to play again.`;
  $("feedback").style.color = "var(--auburn-navy)";
  updateButtonStates();
}

function moveToNextTransaction() {
  if (txIndex < gameTransactions.length - 1) {
    txIndex += 1;
    resetJEForNextQuestion();
    renderTransaction();
    updateButtonStates();
  } else {
    finishGame();
  }
}

function tryPostJE() {
  const tx = currentTransaction();

  if (!tx) return;

  if (lockedTransactions.has(tx.id)) {
    $("feedback").textContent = "This transaction is already locked.";
    $("feedback").style.color = "var(--auburn-navy)";
    return;
  }

  const { d, c } = totals();

  if (!(d > 0 && d === c)) {
    $("feedback").textContent = "Entry must balance before posting.";
    $("feedback").style.color = "var(--bad)";
    return;
  }

  const cleanLines = je.filter((line) => Number(line.amount) > 0);
  const correct = linesEqualAsMultiset(cleanLines, tx.entry);

  answeredTransactions.add(tx.id);
  lockedTransactions.add(tx.id);

  if (correct) {
    correctAnswers += 1;
    $("feedback").textContent = `✅ Correct! ${tx.explain}`;
    $("feedback").style.color = "var(--ok)";
    postToLedger(cleanLines);
    renderStatements();
  } else {
    $("feedback").textContent = `❌ Incorrect. ${tx.explain}`;
    $("feedback").style.color = "var(--bad)";
  }

  updateScoreDisplay();
  renderTransaction();
  renderJELines();

  setTimeout(() => {
    if (answeredTransactions.size === gameTransactions.length) {
      finishGame();
    } else {
      moveToNextTransaction();
    }
  }, 900);
}

function showGame() {
  $("landingPage").classList.add("is-hidden");
  $("gameWrapper").classList.remove("is-hidden");
}

function bindEvents() {
  $("startGame").addEventListener("click", showGame);

  $("addLine").addEventListener("click", () => {
    const tx = currentTransaction();
    if (tx && lockedTransactions.has(tx.id)) return;

    je.push(newLine());
    renderJELines();
  });

  $("clearJE").addEventListener("click", () => {
    const tx = currentTransaction();
    if (tx && lockedTransactions.has(tx.id)) return;

    je = [newLine(), newLine()];
    renderJELines();
    $("feedback").textContent = "";
    $("feedback").style.color = "var(--muted)";
  });

  $("postJE").addEventListener("click", tryPostJE);

}

function init() {
  gameTransactions = getRandomTransactions(TRANSACTIONS, 10);
  txIndex = 0;
  correctAnswers = 0;
  answeredTransactions = new Set();
  lockedTransactions = new Set();

  updateScoreDisplay();
  bindEvents();
  renderTransaction();
  renderJELines();
  renderStatements();
}

init();
