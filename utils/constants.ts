export const GLAYZE_TWITTER = "https://x.com/Glayze436915";
export const GLAYZE_DISCORD = "https://discord.gg/eHJfB5ZAbk";
export const GLAYZE_PRIVACY_POLICY =
  "https://www.termsfeed.com/live/a4fd1fb7-bc8d-486e-81a8-44ce82f147af";
export const GLAYZE_TERMS_OF_SERVICE = "https://docs.glayze.app/";
export const DEPLOYMENT_FEE = "1.00";
export const CREATE_POST_PRODUCT_ID = "app.glayze.createpost";
export const TRANSACTION_PRODUCT_ID = "app.glayze.transaction";

export const ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_usdc", type: "address", internalType: "address" },
      { name: "_aura", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "AURA",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_SUPPLY",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "SCALING_FACTOR",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "USDC",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "auraReferralAmount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "buyShares",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "shares", type: "uint256", internalType: "uint256" },
      { name: "aura", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createPost",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "name", type: "string", internalType: "string" },
      { name: "symbol", type: "string", internalType: "string" },
      { name: "postURI", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBuyPrice",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "shares", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBuyPriceAfterFees",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "shares", type: "uint256", internalType: "uint256" },
      { name: "aura", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFeeSplit",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "totalFees", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPrice",
    inputs: [
      { name: "supply", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "price", type: "uint256", internalType: "uint256" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getSellPrice",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "shares", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSellPriceAfterFees",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "shares", type: "uint256", internalType: "uint256" },
      { name: "aura", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalFees",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "price", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "glayzeCreatorFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "glayzeCreatorRemainingEarnings",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "remainingEarnings", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isOperator",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "posts",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "symbol", type: "string", internalType: "string" },
      { name: "postURI", type: "string", internalType: "string" },
      { name: "glayzeCreator", type: "address", internalType: "address" },
      { name: "realCreator", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "protocolFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "protocolFeeDestination",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "realCreatorFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "refer",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "referrer", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sellShares",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "shares", type: "uint256", internalType: "uint256" },
      { name: "aura", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAuraReferralAmount",
    inputs: [
      { name: "_auraReferralAmount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setGlazyCreatorFee",
    inputs: [
      { name: "_glazyCreatorFee", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setOperator",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      { name: "approved", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPrtocolFee",
    inputs: [
      { name: "_protocolFee", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setRealCreator",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "realCreator", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setRealCreatorFee",
    inputs: [
      { name: "_realCreatorFee", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setUsdcCreationPayment",
    inputs: [
      {
        name: "_usdcCreationPayment",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "shareInfo",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "price", type: "uint256", internalType: "uint256" },
      { name: "supply", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalValueDeposited",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "receiver", type: "address", internalType: "address" },
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      { name: "receiver", type: "address", internalType: "address" },
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "usdcCreationPayment",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "usersReferred",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "isReferred", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "spender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OperatorSet",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      { name: "approved", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PostCreated",
    inputs: [
      {
        name: "postId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "creator",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      { name: "name", type: "string", indexed: false, internalType: "string" },
      {
        name: "symbol",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "postURI",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RealCreatorSet",
    inputs: [
      {
        name: "postId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "realCreator",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Referral",
    inputs: [
      {
        name: "userReferred",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "referredBy",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Trade",
    inputs: [
      {
        name: "postId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "trader",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      { name: "isBuy", type: "bool", indexed: false, internalType: "bool" },
      {
        name: "aura",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "usdc",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newSupply",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TradeFees",
    inputs: [
      {
        name: "postId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "trader",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      { name: "isBuy", type: "bool", indexed: false, internalType: "bool" },
      {
        name: "aura",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "usdc",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      {
        name: "caller",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      { name: "from", type: "address", indexed: true, internalType: "address" },
      { name: "to", type: "address", indexed: true, internalType: "address" },
      { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InsufficientShareBalance",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "user", type: "address", internalType: "address" },
      { name: "balance", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InsufficientShareSupply",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "supply", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidPostId",
    inputs: [{ name: "postId", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "PostAlreadyExists",
    inputs: [{ name: "postId", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "RealCreatorAlreadyExists",
    inputs: [
      { name: "postId", type: "uint256", internalType: "uint256" },
      { name: "creator", type: "address", internalType: "address" },
    ],
  },
  {
    type: "error",
    name: "SharesZero",
    inputs: [{ name: "postId", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "UserAlreadyReferred",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
  },
] as const;

export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
] as const;
