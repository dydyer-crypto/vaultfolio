import { http } from "wagmi";
import {
  arbitrum, avalanche, base, blast, bsc, celo, cronos, fantom, gnosis,
  kava, linea, mainnet, mantle, moonbeam, moonriver, optimism, polygon,
  scroll, zkSync,
} from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const supportedChains = [
  mainnet, polygon, base, arbitrum, optimism, avalanche,
  bsc, blast, celo, cronos, fantom, gnosis,
  kava, linea, mantle, moonbeam, moonriver, scroll, zkSync,
] as const;

export const chainMeta = {
  [mainnet.id]: { name: "Ethereum", shortName: "ETH", nativeSymbol: "ETH", explorer: "https://etherscan.io", color: "#627eea", cgId: "ethereum" },
  [polygon.id]: { name: "Polygon", shortName: "MATIC", nativeSymbol: "MATIC", explorer: "https://polygonscan.com", color: "#8247e5", cgId: "matic-network" },
  [base.id]: { name: "Base", shortName: "ETH", nativeSymbol: "ETH", explorer: "https://basescan.org", color: "#0052ff", cgId: "ethereum" },
  [arbitrum.id]: { name: "Arbitrum", shortName: "ARB", nativeSymbol: "ETH", explorer: "https://arbiscan.io", color: "#28a0f0", cgId: "ethereum" },
  [optimism.id]: { name: "Optimism", shortName: "OP", nativeSymbol: "ETH", explorer: "https://optimistic.etherscan.io", color: "#ff0420", cgId: "ethereum" },
  [avalanche.id]: { name: "Avalanche", shortName: "AVAX", nativeSymbol: "AVAX", explorer: "https://snowtrace.io", color: "#e84142", cgId: "avalanche-2" },
  [bsc.id]: { name: "BNB Chain", shortName: "BNB", nativeSymbol: "BNB", explorer: "https://bscscan.com", color: "#f3ba2f", cgId: "binancecoin" },
  [blast.id]: { name: "Blast", shortName: "ETH", nativeSymbol: "ETH", explorer: "https://blastscan.io", color: "#fcfc03", cgId: "ethereum" },
  [celo.id]: { name: "Celo", shortName: "CELO", nativeSymbol: "CELO", explorer: "https://celoscan.io", color: "#fbcc5c", cgId: "celo" },
  [cronos.id]: { name: "Cronos", shortName: "CRO", nativeSymbol: "CRO", explorer: "https://cronoscan.com", color: "#002d74", cgId: "crypto-com-chain" },
  [fantom.id]: { name: "Fantom", shortName: "FTM", nativeSymbol: "FTM", explorer: "https://ftmscan.com", color: "#13b5ec", cgId: "fantom" },
  [gnosis.id]: { name: "Gnosis", shortName: "xDAI", nativeSymbol: "xDAI", explorer: "https://gnosisscan.io", color: "#3e6957", cgId: "xdai" },
  [kava.id]: { name: "Kava", shortName: "KAVA", nativeSymbol: "KAVA", explorer: "https://kavascan.com", color: "#ff433e", cgId: "kava" },
  [linea.id]: { name: "Linea", shortName: "ETH", nativeSymbol: "ETH", explorer: "https://lineascan.build", color: "#61dfff", cgId: "ethereum" },
  [mantle.id]: { name: "Mantle", shortName: "MNT", nativeSymbol: "MNT", explorer: "https://mantlescan.xyz", color: "#65c7b0", cgId: "mantle" },
  [moonbeam.id]: { name: "Moonbeam", shortName: "GLMR", nativeSymbol: "GLMR", explorer: "https://moonscan.io", color: "#5d14a3", cgId: "moonbeam" },
  [moonriver.id]: { name: "Moonriver", shortName: "MOVR", nativeSymbol: "MOVR", explorer: "https://moonriver.moonscan.io", color: "#a3b0fa", cgId: "moonriver" },
  [scroll.id]: { name: "Scroll", shortName: "ETH", nativeSymbol: "ETH", explorer: "https://scrollscan.com", color: "#ff7d3b", cgId: "ethereum" },
  [zkSync.id]: { name: "zkSync", shortName: "ETH", nativeSymbol: "ETH", explorer: "https://explorer.zksync.io", color: "#8c8dfc", cgId: "ethereum" },
} as const;

export type ChainId = keyof typeof chainMeta;

const rpcUrls: Record<number, string> = {
  [mainnet.id]: "https://eth.llamarpc.com",
  [polygon.id]: "https://polygon-rpc.com",
  [base.id]: "https://mainnet.base.org",
  [arbitrum.id]: "https://arb1.arbitrum.io/rpc",
  [optimism.id]: "https://mainnet.optimism.io",
  [avalanche.id]: "https://api.avax.network/ext/bc/C/rpc",
  [bsc.id]: "https://bsc-dataseed.binance.org",
  [blast.id]: "https://rpc.blast.io",
  [celo.id]: "https://forno.celo.org",
  [cronos.id]: "https://evm.cronos.org",
  [fantom.id]: "https://rpc.ftm.tools",
  [gnosis.id]: "https://rpc.gnosischain.com",
  [kava.id]: "https://evm.kava.io",
  [linea.id]: "https://rpc.linea.build",
  [mantle.id]: "https://rpc.mantle.xyz",
  [moonbeam.id]: "https://rpc.api.moonbeam.network",
  [moonriver.id]: "https://rpc.api.moonriver.moonbeam.network",
  [scroll.id]: "https://rpc.scroll.io",
  [zkSync.id]: "https://mainnet.era.zksync.io",
};

export const wagmiConfig = getDefaultConfig({
  appName: "Vaultfolio",
  projectId: "vaultfolio-demo-project-id-0001",
  chains: supportedChains,
  transports: Object.fromEntries(
    supportedChains.map((c) => [c.id, http(rpcUrls[c.id] ?? "")])
  ),
  ssr: true,
});