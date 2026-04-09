export const TRANSACTIONS = [
  {
    id: "t1",
    prompt: "Issued common stock for $100,000 cash.",
    entry: [
      { accountId: "cash", dc: "D", amount: 100000 },
      { accountId: "cs", dc: "C", amount: 100000 }
    ],
    explain: "Cash increases (debit). Equity increases via Common Stock (credit)."
  },
  {
    id: "t2",
    prompt: "Borrowed $50,000 cash by signing a note payable.",
    entry: [
      { accountId: "cash", dc: "D", amount: 50000 },
      { accountId: "notes", dc: "C", amount: 50000 }
    ],
    explain: "Cash increases; Notes Payable increases."
  },
  {
    id: "t3",
    prompt: "Purchased equipment for $30,000 cash.",
    entry: [
      { accountId: "equip", dc: "D", amount: 30000 },
      { accountId: "cash", dc: "C", amount: 30000 }
    ],
    explain: "Equipment increases; Cash decreases."
  },
  {
    id: "t4",
    prompt: "Purchased $4,000 supplies on account.",
    entry: [
      { accountId: "supplies", dc: "D", amount: 4000 },
      { accountId: "ap", dc: "C", amount: 4000 }
    ],
    explain: "Supplies increase; Accounts Payable increases."
  },
  {
    id: "t5",
    prompt: "Performed services for $12,000 cash.",
    entry: [
      { accountId: "cash", dc: "D", amount: 12000 },
      { accountId: "rev", dc: "C", amount: 12000 }
    ],
    explain: "Cash increases; Service Revenue increases."
  }
];
