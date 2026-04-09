export const TRANSACTIONS = [
  {
    id: "t1",
    prompt: "Issued common stock for $100,000 cash.",
    entry: [
      { accountId: "cash", dc: "D", amount: 100000 },
      { accountId: "cs", dc: "C", amount: 100000 }
    ],
    explain: "Cash increases and common stock increases."
  },
  {
    id: "t2",
    prompt: "Borrowed $50,000 cash by signing a note payable.",
    entry: [
      { accountId: "cash", dc: "D", amount: 50000 },
      { accountId: "notes", dc: "C", amount: 50000 }
    ],
    explain: "Cash increases and notes payable increases."
  },
  {
    id: "t3",
    prompt: "Purchased equipment for $30,000 cash.",
    entry: [
      { accountId: "equip", dc: "D", amount: 30000 },
      { accountId: "cash", dc: "C", amount: 30000 }
    ],
    explain: "Equipment increases and cash decreases."
  },
  {
    id: "t4",
    prompt: "Purchased $4,000 supplies on account.",
    entry: [
      { accountId: "supplies", dc: "D", amount: 4000 },
      { accountId: "ap", dc: "C", amount: 4000 }
    ],
    explain: "Supplies increase and accounts payable increases."
  },
  {
    id: "t5",
    prompt: "Performed services for $12,000 cash.",
    entry: [
      { accountId: "cash", dc: "D", amount: 12000 },
      { accountId: "rev", dc: "C", amount: 12000 }
    ],
    explain: "Cash increases and service revenue increases."
  },
  {
    id: "t6",
    prompt: "Performed services on account for $9,000.",
    entry: [
      { accountId: "ar", dc: "D", amount: 9000 },
      { accountId: "rev", dc: "C", amount: 9000 }
    ],
    explain: "Accounts receivable increases and service revenue increases."
  },
  {
    id: "t7",
    prompt: "Collected $6,000 cash from customers on account.",
    entry: [
      { accountId: "cash", dc: "D", amount: 6000 },
      { accountId: "ar", dc: "C", amount: 6000 }
    ],
    explain: "Cash increases and accounts receivable decreases."
  },
  {
    id: "t8",
    prompt: "Received $8,500 cash in advance from a client for future services.",
    entry: [
      { accountId: "cash", dc: "D", amount: 8500 },
      { accountId: "unearned", dc: "C", amount: 8500 }
    ],
    explain: "Cash increases and unearned revenue increases."
  },
  {
    id: "t9",
    prompt: "Performed $3,000 of services that had previously been paid for in advance.",
    entry: [
      { accountId: "unearned", dc: "D", amount: 3000 },
      { accountId: "rev", dc: "C", amount: 3000 }
    ],
    explain: "Unearned revenue decreases and service revenue increases."
  },
  {
    id: "t10",
    prompt: "Paid $2,500 rent in cash.",
    entry: [
      { accountId: "rentExp", dc: "D", amount: 2500 },
      { accountId: "cash", dc: "C", amount: 2500 }
    ],
    explain: "Rent expense increases and cash decreases."
  },
  {
    id: "t11",
    prompt: "Paid $6,000 salaries in cash.",
    entry: [
      { accountId: "salExp", dc: "D", amount: 6000 },
      { accountId: "cash", dc: "C", amount: 6000 }
    ],
    explain: "Salaries expense increases and cash decreases."
  },
  {
    id: "t12",
    prompt: "Supplies used during the period totaled $1,500.",
    entry: [
      { accountId: "supExp", dc: "D", amount: 1500 },
      { accountId: "supplies", dc: "C", amount: 1500 }
    ],
    explain: "Supplies expense increases and supplies decrease."
  },
  {
    id: "t13",
    prompt: "Recorded depreciation expense on equipment of $1,000.",
    entry: [
      { accountId: "depExp", dc: "D", amount: 1000 },
      { accountId: "equip", dc: "C", amount: 1000 }
    ],
    explain: "Depreciation expense increases and equipment is reduced in this simplified model."
  },
  {
    id: "t14",
    prompt: "Paid $2,000 toward accounts payable.",
    entry: [
      { accountId: "ap", dc: "D", amount: 2000 },
      { accountId: "cash", dc: "C", amount: 2000 }
    ],
    explain: "Accounts payable decreases and cash decreases."
  },
  {
    id: "t15",
    prompt: "Purchased additional equipment for $18,000 by signing a note payable.",
    entry: [
      { accountId: "equip", dc: "D", amount: 18000 },
      { accountId: "notes", dc: "C", amount: 18000 }
    ],
    explain: "Equipment increases and notes payable increases."
  },
  {
    id: "t16",
    prompt: "Paid a $4,000 dividend to stockholders.",
    entry: [
      { accountId: "div", dc: "D", amount: 4000 },
      { accountId: "cash", dc: "C", amount: 4000 }
    ],
    explain: "Dividends increase and cash decreases."
  },
  {
    id: "t17",
    prompt: "Performed services for $15,000 cash.",
    entry: [
      { accountId: "cash", dc: "D", amount: 15000 },
      { accountId: "rev", dc: "C", amount: 15000 }
    ],
    explain: "Cash increases and revenue increases."
  },
  {
    id: "t18",
    prompt: "Performed services on account for $7,500.",
    entry: [
      { accountId: "ar", dc: "D", amount: 7500 },
      { accountId: "rev", dc: "C", amount: 7500 }
    ],
    explain: "Accounts receivable increases and revenue increases."
  },
  {
    id: "t19",
    prompt: "Collected $2,500 from customers on account.",
    entry: [
      { accountId: "cash", dc: "D", amount: 2500 },
      { accountId: "ar", dc: "C", amount: 2500 }
    ],
    explain: "Cash increases and accounts receivable decreases."
  },
  {
    id: "t20",
    prompt: "Received $10,000 cash in advance for future services.",
    entry: [
      { accountId: "cash", dc: "D", amount: 10000 },
      { accountId: "unearned", dc: "C", amount: 10000 }
    ],
    explain: "Cash increases and unearned revenue increases."
  },
  {
    id: "t21",
    prompt: "Completed $4,500 of services that were previously recorded as unearned revenue.",
    entry: [
      { accountId: "unearned", dc: "D", amount: 4500 },
      { accountId: "rev", dc: "C", amount: 4500 }
    ],
    explain: "Unearned revenue decreases and revenue increases."
  },
  {
    id: "t22",
    prompt: "Paid $3,200 rent in cash.",
    entry: [
      { accountId: "rentExp", dc: "D", amount: 3200 },
      { accountId: "cash", dc: "C", amount: 3200 }
    ],
    explain: "Rent expense increases and cash decreases."
  },
  {
    id: "t23",
    prompt: "Paid $4,800 salaries in cash.",
    entry: [
      { accountId: "salExp", dc: "D", amount: 4800 },
      { accountId: "cash", dc: "C", amount: 4800 }
    ],
    explain: "Salaries expense increases and cash decreases."
  },
  {
    id: "t24",
    prompt: "Used $900 of supplies during the period.",
    entry: [
      { accountId: "supExp", dc: "D", amount: 900 },
      { accountId: "supplies", dc: "C", amount: 900 }
    ],
    explain: "Supplies expense increases and supplies decrease."
  },
  {
    id: "t25",
    prompt: "Recorded depreciation expense on equipment of $1,400.",
    entry: [
      { accountId: "depExp", dc: "D", amount: 1400 },
      { accountId: "equip", dc: "C", amount: 1400 }
    ],
    explain: "Depreciation expense increases and equipment decreases in this simplified model."
  },
  {
    id: "t26",
    prompt: "Purchased $2,700 of supplies for cash.",
    entry: [
      { accountId: "supplies", dc: "D", amount: 2700 },
      { accountId: "cash", dc: "C", amount: 2700 }
    ],
    explain: "Supplies increase and cash decreases."
  },
  {
    id: "t27",
    prompt: "Paid $3,500 toward the note payable balance.",
    entry: [
      { accountId: "notes", dc: "D", amount: 3500 },
      { accountId: "cash", dc: "C", amount: 3500 }
    ],
    explain: "Notes payable decreases and cash decreases."
  },
  {
    id: "t28",
    prompt: "Issued additional common stock for $25,000 cash.",
    entry: [
      { accountId: "cash", dc: "D", amount: 25000 },
      { accountId: "cs", dc: "C", amount: 25000 }
    ],
    explain: "Cash increases and common stock increases."
  },
  {
    id: "t29",
    prompt: "Purchased equipment for $9,500 on account.",
    entry: [
      { accountId: "equip", dc: "D", amount: 9500 },
      { accountId: "ap", dc: "C", amount: 9500 }
    ],
    explain: "Equipment increases and accounts payable increases."
  },
  {
    id: "t30",
    prompt: "Paid a $2,200 dividend to stockholders.",
    entry: [
      { accountId: "div", dc: "D", amount: 2200 },
      { accountId: "cash", dc: "C", amount: 2200 }
    ],
    explain: "Dividends increase and cash decreases."
  }
];
