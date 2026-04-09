export const TRANSACTIONS = [
  {
    id:"t1",
    prompt:"Issued common stock for $100,000 cash.",
    entry:[ {accountId:"cash", dc:"D", amount:100000}, {accountId:"cs", dc:"C", amount:100000} ],
    explain:"Cash increases (debit). Equity increases via Common Stock (credit)."
  },
  {
    id:"t2",
    prompt:"Borrowed $50,000 cash by signing a note payable.",
    entry:[ {accountId:"cash", dc:"D", amount:50000}, {accountId:"notes", dc:"C", amount:50000} ],
    explain:"Cash increases; Notes Payable increases."
  },
  {
    id:"t3",
    prompt:"Purchased equipment for $30,000 cash.",
    entry:[ {accountId:"equip", dc:"D", amount:30000}, {accountId:"cash", dc:"C", amount:30000} ],
    explain:"Equipment increases; Cash decreases."
  },
  {
    id:"t4",
    prompt:"Purchased $4,000 supplies on account.",
    entry:[ {accountId:"supplies", dc:"D", amount:4000}, {accountId:"ap", dc:"C", amount:4000} ],
    explain:"Supplies (asset) increases; Accounts Payable increases."
  },
  {
    id:"t5",
    prompt:"Performed services for $12,000 cash.",
    entry:[ {accountId:"cash", dc:"D", amount:12000}, {accountId:"rev", dc:"C", amount:12000} ],
    explain:"Cash increases; Service Revenue increases."
  },
  {
    id:"t6",
    prompt:"Performed services on account for $9,000.",
    entry:[ {accountId:"ar", dc:"D", amount:9000}, {accountId:"rev", dc:"C", amount:9000} ],
    explain:"Accounts Receivable increases; Service Revenue increases."
  },
  {
    id:"t7",
    prompt:"Paid $2,500 rent in cash.",
    entry:[ {accountId:"rentExp", dc:"D", amount:2500}, {accountId:"cash", dc:"C", amount:2500} ],
    explain:"Rent Expense increases; Cash decreases."
  },
  {
    id:"t8",
    prompt:"Paid $6,000 salaries in cash.",
    entry:[ {accountId:"salExp", dc:"D", amount:6000}, {accountId:"cash", dc:"C", amount:6000} ],
    explain:"Salaries Expense increases; Cash decreases."
  },
  {
    id:"t9",
    prompt:"Supplies used during the period: $1,500.",
    entry:[ {accountId:"supExp", dc:"D", amount:1500}, {accountId:"supplies", dc:"C", amount:1500} ],
    explain:"Supplies Expense increases; Supplies asset decreases."
  },
  {
    id:"t10",
    prompt:"Recorded depreciation expense on equipment: $1,000.",
    entry:[ {accountId:"depExp", dc:"D", amount:1000}, {accountId:"equip", dc:"C", amount:1000} ],
    explain:"Depreciation Expense increases; Equipment carrying amount decreases (MVP simplification)."
  }
];

