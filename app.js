import { COA } from "./data/coa.js";
import { TRANSACTIONS } from "./data/transactions.js";

const $ = (id) => document.getElementById(id);

let score = 0;
let txIndex = 0;

// debit-positive internal ledger
const ledger = Object.fromEntries(COA.map((account) => [account.id, 0]));

let je = [newLine(), newLine()];

function newLine() {
  return {
    accountId: COA[0].id,
    dc: "D",
    amount: 0
  };
}

function fmt(n) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return sign + abs.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function accountById(id) {
  return COA.find((account) => account.id === id);
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

function renderTransaction() {
  const tx = TRANSACTIONS[txIndex];
  $("txPrompt").textContent = `${txIndex + 1}/${TRANSACTIONS.length} — ${tx.prompt}`;
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
      if (je.length <= 1) {
        return;
      }
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

  const incomeLines = [];
  incomeLines.push("REVENUES");
  for (const account of statements.income.revenues) {
    incomeLines.push(` ${account.name}: ${fmt(displayAmount(account))}`);
  }
  incomeLines.push(`Total Revenues: ${fmt(statements.income.revTotal)}`);
  incomeLines.push("");
  incomeLines.push("EXPENSES");
  for (const account of statements.income.expenses) {
    incomeLines.push(` ${account.name}: ${fmt(displayAmount(account))}`);
  }
  incomeLines.push(`Total Expenses: ${fmt(statements.income.expTotal)}`);
  incomeLines.push("");
  incomeLines.push(`Net Income: ${fmt(statements.income.netIncome)}`);
  $("incomeStmt").textContent = incomeLines.join("\n");

  const balanceLines = [];
  balanceLines.push("ASSETS");
  for (const account of statements.balance.assets) {
    balanceLines.push(` ${account.name}: ${fmt(displayAmount(account))}`);
  }
  balanceLines.push(`Total Assets: ${fmt(statements.balance.bsAssets)}`);
  balanceLines.push("");
  balanceLines.push("LIABILITIES");
  for (const account of statements.balance.liabilities) {
    balanceLines.push(` ${account.name}: ${fmt(displayAmount(account))}`);
  }
  balanceLines.push(`Total Liabilities: ${fmt(statements.balance.bsLiabilities)}`);
  balanceLines.push("");
  balanceLines.push("EQUITY");
  balanceLines.push(` Common Stock: ${fmt(statements.equity.commonStock)}`);
  balanceLines.push(` Retained Earnings: ${fmt(statements.equity.endRE)}`);
  balanceLines.push(`Total Equity: ${fmt(statements.balance.bsEquity)}`);
  balanceLines.push("");
  balanceLines.push(
    `A = L + E ? ${fmt(statements.balance.bsAssets)} = ${fmt(
      statements.balance.bsLiabilities
    )} + ${fmt(statements.balance.bsEquity)}`
  );
  $("balanceSheet").textContent = balanceLines.join("\n");

  const equityLines = [];
  equityLines.push("Contributed Capital");
  equityLines.push(` Common Stock: ${fmt(statements.equity.commonStock)}`);
  equityLines.push("");
  equityLines.push("Retained Earnings");
  equityLines.push(` Beginning RE: ${fmt(statements.equity.beginRE)}`);
  equityLines.push(` + Net Income: ${fmt(statements.equity.netIncome)}`);
  equityLines.push(` - Dividends: ${fmt(statements.equity.dividends)}`);
  equityLines.push(` Ending RE: ${fmt(statements.equity.endRE)}`);
  $("equityStmt").textContent = equityLines.join("\n");
}

function tryPostJE() {
  const { d, c } = totals();

  if (!(d > 0 && d === c)) {
    $("feedback").textContent = "Entry must balance before posting.";
    $("feedback").style.color = "var(--bad)";
    return;
  }

  const tx = TRANSACTIONS[txIndex];
  const cleanLines = je.filter((line) => Number(line.amount) > 0);
  const correct = linesEqualAsMultiset(cleanLines, tx.entry);

  if (correct) {
    score += 10;
    $("feedback").textContent = `✅ Correct! Posted.\n${tx.explain}`;
    $("feedback").style.color = "var(--ok)";
    $("score").textContent = `Score: ${score}`;

    postToLedger(cleanLines);
    renderStatements();
  } else {
    score -= 2;
    $("feedback").textContent =
      "❌ Not quite.\nHint: think about which accounts change and their normal balances.";
    $("feedback").style.color = "var(--bad)";
    $("score").textContent = `Score: ${score}`;
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
    txIndex = Math.min(txIndex + 1, TRANSACTIONS.length - 1);
    renderTransaction();
  });

  $("prevTx").addEventListener("click", () => {
    txIndex = Math.max(txIndex - 1, 0);
    renderTransaction();
  });
}

function init() {
  bindEvents();
  renderTransaction();
  renderJELines();
  renderStatements();
}

init();
