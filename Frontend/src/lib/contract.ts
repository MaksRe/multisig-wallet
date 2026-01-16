export const multisigAbi = [
  {
    type: "function",
    name: "getOwnerCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    type: "function",
    name: "getTransactionCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    type: "function",
    name: "getTransaction",
    stateMutability: "view",
    inputs: [{ name: "_txId", type: "uint256" }],
    outputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
      { name: "executed", type: "bool" },
      { name: "numConfirmations", type: "uint256" }
    ]
  },
  {
    type: "function",
    name: "owners",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ type: "address" }]
  },
  {
    type: "function",
    name: "requiredSignatures",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    type: "function",
    name: "getBalance",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    type: "function",
    name: "createTransaction",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
      { name: "_data", type: "bytes" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "confirmTransaction",
    stateMutability: "nonpayable",
    inputs: [{ name: "_txId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "revokeConfirmation",
    stateMutability: "nonpayable",
    inputs: [{ name: "_txId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "executeTransaction",
    stateMutability: "nonpayable",
    inputs: [{ name: "_txId", type: "uint256" }],
    outputs: []
  }
] as const;
