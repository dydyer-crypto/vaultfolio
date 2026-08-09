import type { Address } from "viem";

export interface TokenDef {
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  logo?: string;
  cgId?: string;
}

const ZERO: Address = "0x0000000000000000000000000000000000000000";

export const nativeTokenByChain: Record<number, { symbol: string; name: string; cgId: string }> = {
  1: { symbol: "ETH", name: "Ethereum", cgId: "ethereum" },
  137: { symbol: "MATIC", name: "Polygon", cgId: "matic-network" },
  8453: { symbol: "ETH", name: "Ethereum", cgId: "ethereum" },
  42161: { symbol: "ETH", name: "Ethereum", cgId: "ethereum" },
  10: { symbol: "ETH", name: "Ethereum", cgId: "ethereum" },
  43114: { symbol: "AVAX", name: "Avalanche", cgId: "avalanche-2" },
  56: { symbol: "BNB", name: "BNB", cgId: "binancecoin" },
  81457: { symbol: "ETH", name: "Ethereum", cgId: "ethereum" },
  42220: { symbol: "CELO", name: "Celo", cgId: "celo" },
  25: { symbol: "CRO", name: "Cronos", cgId: "crypto-com-chain" },
  250: { symbol: "FTM", name: "Fantom", cgId: "fantom" },
  100: { symbol: "xDAI", name: "xDAI", cgId: "xdai" },
  2222: { symbol: "KAVA", name: "Kava", cgId: "kava" },
  59144: { symbol: "ETH", name: "Ethereum", cgId: "ethereum" },
  5000: { symbol: "MNT", name: "Mantle", cgId: "mantle" },
  1284: { symbol: "GLMR", name: "Moonbeam", cgId: "moonbeam" },
  1285: { symbol: "MOVR", name: "Moonriver", cgId: "moonriver" },
  534352: { symbol: "ETH", name: "Ethereum", cgId: "ethereum" },
  324: { symbol: "ETH", name: "Ethereum", cgId: "ethereum" },
};

type ChainTokens = Record<number, TokenDef[]>;

export const knownTokens: ChainTokens = {
  1: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      cgId: "usd-coin",
      logo: "https://assets.coingecko.com/coins/6319/small/usdc.png",
    },
    {
      symbol: "USDT",
      name: "Tether",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
      cgId: "tether",
      logo: "https://assets.coingecko.com/coins/325/small/Tether.png",
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      decimals: 18,
      cgId: "uniswap",
      logo: "https://assets.coingecko.com/coins/12504/small/uni.jpg",
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      decimals: 18,
      cgId: "chainlink",
      logo: "https://assets.coingecko.com/coins/877/small/chainlink-new-logo.png",
    },
    {
      symbol: "WBTC",
      name: "Wrapped BTC",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      decimals: 8,
      cgId: "wrapped-bitcoin",
      logo: "https://assets.coingecko.com/coins/7598/small/wrapped_bitcoin.png",
    },
    {
      symbol: "DAI",
      name: "Dai",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      cgId: "dai",
      logo: "https://assets.coingecko.com/coins/9947/small/Screen_Shot_2020-06-25_at_5.53.45_PM.png",
    },
  ],
  137: [
    {
      symbol: "USDC.e",
      name: "USD Coin (PoS)",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      cgId: "usd-coin",
      logo: "https://assets.coingecko.com/coins/6319/small/usdc.png",
    },
    {
      symbol: "USDT",
      name: "Tether (PoS)",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
      cgId: "tether",
      logo: "https://assets.coingecko.com/coins/325/small/Tether.png",
    },
    {
      symbol: "WMATIC",
      name: "Wrapped Matic",
      address: "0x0d500B1d8E8eF31D7C4a6d4bC0B5e21b1d4e3b2B",
      decimals: 18,
      cgId: "matic-network",
      logo: "https://assets.coingecko.com/coins/4713/small/matic-token.png",
    },
    {
      symbol: "AAVE",
      name: "Aave (PoS)",
      address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      decimals: 18,
      cgId: "aave",
      logo: "https://assets.coingecko.com/coins/12629/small/aave.png",
    },
  ],
  8453: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA9bD6d",
      decimals: 6,
      cgId: "usd-coin",
      logo: "https://assets.coingecko.com/coins/6319/small/usdc.png",
    },
    {
      symbol: "DEGEN",
      name: "Degen",
      address: "0x4ed4E862860beD51a307325cec296b8392a9FbD6",
      decimals: 18,
      cgId: "degen-base",
      logo: "https://assets.coingecko.com/coins/33802/small/degen.jpg",
    },
    {
      symbol: "BRETT",
      name: "Brett",
      address: "0x9315475B66bB82d01224F2a4EC5012a9a5c4c4aE",
      decimals: 18,
      cgId: "brettt-base",
      logo: "https://assets.coingecko.com/coins/39712/small/brett.jpg",
    },
  ],
  42161: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xaf88d6a7e5c8ffe96666bbe452cd9361d34cc0e1",
      decimals: 6,
      cgId: "usd-coin",
      logo: "https://assets.coingecko.com/coins/6319/small/usdc.png",
    },
    {
      symbol: "ARB",
      name: "Arbitrum",
      address: "0x912CE59144173C449284711801E6641CDE53Ff6A",
      decimals: 18,
      cgId: "arbitrum",
      logo: "https://assets.coingecko.com/coins/22390/small/arb.jpg",
    },
    {
      symbol: "GMX",
      name: "GMX",
      address: "0x2D8e1E6b41920F8BdCaa3aB7A87C5d9c11d3A2D1",
      decimals: 18,
      cgId: "gmx",
      logo: "https://assets.coingecko.com/coins/18024/small/gmx.jpg",
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      address: "0xFa7F8980b0f1E64A2062791cc3b08A1572f797Ca",
      decimals: 18,
      cgId: "uniswap",
      logo: "https://assets.coingecko.com/coins/12504/small/uni.jpg",
    },
  ],
  10: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x0b2c639c533813f4aa9d7837caf61653d7144fe3",
      decimals: 6,
      cgId: "usd-coin",
      logo: "https://assets.coingecko.com/coins/6319/small/usdc.png",
    },
    {
      symbol: "OP",
      name: "Optimism",
      address: "0x4200000000000000000000000000000000000042",
      decimals: 18,
      cgId: "optimism",
      logo: "https://assets.coingecko.com/coins/25244/small/optimism.png",
    },
    {
      symbol: "VELO",
      name: "Velodrome",
      address: "0x3c8B650257cFb5fA277E59E3a336456C6b3f1F37",
      decimals: 18,
      cgId: "velodrome-finance",
      logo: "https://assets.coingecko.com/coins/24033/small/VELO.png",
    },
  ],
  43114: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      decimals: 6,
      cgId: "usd-coin",
      logo: "https://assets.coingecko.com/coins/6319/small/usdc.png",
    },
    {
      symbol: "WAVAX",
      name: "Wrapped AVAX",
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      decimals: 18,
      cgId: "avalanche-2",
      logo: "https://assets.coingecko.com/coins/12559/small/Avalanche_Circle_Redwhite_Update.png",
    },
    {
      symbol: "JOE",
      name: "JOE",
      address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0DdD",
      decimals: 18,
      cgId: "joe",
      logo: "https://assets.coingecko.com/coins/14403/small/JOE_200x200.png",
    },
    {
      symbol: "sAVAX",
      name: "Staked AVAX",
      address: "0x2b2C81e08f1Af8835a78BcCA89BE933a5Cf84b6e",
      decimals: 18,
      cgId: "avalanche-2",
      logo: "https://assets.coingecko.com/coins/28369/small/savax.png",
    },
  ],
};

export const defiTokens: Record<number, TokenDef[]> = {
  1: [
    { symbol: "UNI-V2", name: "Uniswap V2 LP", address: "0x0d4a11d5EEaaC28EC3F61B100cD2454c0dAB4B5e", decimals: 18, cgId: "", logo: "" },
    { symbol: "UNI-V2-USDC", name: "Uniswap USDC/ETH LP", address: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc", decimals: 18, cgId: "", logo: "" },
    { symbol: "aUSDC", name: "Aave aUSDC", address: "0xBcca60bB61934080951369a647Fb445F3C90df8f", decimals: 6, cgId: "usd-coin", logo: "https://assets.coingecko.com/coins/6319/small/usdc.png" },
    { symbol: "aDAI", name: "Aave aDAI", address: "0x028171bCA77440897B824Ca71D1c7A026C6A21d5", decimals: 18, cgId: "dai", logo: "https://assets.coingecko.com/coins/9947/small/Screen_Shot_2020-06-25_at_5.53.45_PM.png" },
    { symbol: "cUSDC", name: "Compound cUSDC", address: "0x39AA39c021dfbaE8faC5459365833acB0c5Ec2f7", decimals: 8, cgId: "usd-coin", logo: "https://assets.coingecko.com/coins/6319/small/usdc.png" },
    { symbol: "cDAI", name: "Compound cDAI", address: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643", decimals: 8, cgId: "dai", logo: "https://assets.coingecko.com/coins/9947/small/Screen_Shot_2020-06-25_at_5.53.45_PM.png" },
  ],
  137: [
    { symbol: "aUSDC", name: "Aave aUSDC", address: "0x1a13F4CaAf6EFb54e0a7BbF89cA249bDb6E1D7b5", decimals: 6, cgId: "usd-coin", logo: "https://assets.coingecko.com/coins/6319/small/usdc.png" },
    { symbol: "aWMATIC", name: "Aave aWMATIC", address: "0x0d500B1d8E8eF31D7C4a6d4bC0B5e21b1d4e3b2B", decimals: 18, cgId: "matic-network", logo: "https://assets.coingecko.com/coins/4713/small/matic-token.png" },
    { symbol: "sLP-USDC-WETH", name: "Sushi USDC/WETH LP", address: "0x397FF39223Bc04864702e1E2667F1B5d1c1b4b1E", decimals: 18, cgId: "", logo: "" },
  ],
  42161: [
    { symbol: "aUSDC", name: "Aave aUSDC", address: "0x625E770810Bd6D08a526C56eBd6543c4D2D6e1D7", decimals: 6, cgId: "usd-coin", logo: "https://assets.coingecko.com/coins/6319/small/usdc.png" },
    { symbol: "aETH", name: "Aave aETH", address: "0x724203f5B3a0a9A5fC36D56C1E8cFB1e0e1c6b2D", decimals: 18, cgId: "ethereum", logo: "https://assets.coingecko.com/coins/279/small/ethereum.png" },
  ],
  10: [
    { symbol: "aUSDC", name: "Aave aUSDC", address: "0x625E770810Bd6D08a526C56eBd6543c4D2D6e1D7", decimals: 6, cgId: "usd-coin", logo: "https://assets.coingecko.com/coins/6319/small/usdc.png" },
  ],
  43114: [
    { symbol: "aUSDC", name: "Aave aUSDC", address: "0x625E770810Bd6D08a526C56eBd6543c4D2D6e1D7", decimals: 6, cgId: "usd-coin", logo: "https://assets.coingecko.com/coins/6319/small/usdc.png" },
  ],
  8453: [],
};

export function isDefiToken(chainId: number, address: Address): boolean {
  return defiTokens[chainId]?.some((t) => t.address.toLowerCase() === address.toLowerCase()) ?? false;
}

export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function" as const,
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function" as const,
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function" as const,
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function" as const,
  },
] as const;

export const ZERO_ADDRESS = ZERO;