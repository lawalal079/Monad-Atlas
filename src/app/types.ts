export type Category =
  | "DEX"
  | "Lending"
  | "NFT"
  | "Infrastructure"
  | "Wallet"
  | "Analytics"
  | "Other";

export type Network = "Monad Mainnet" | "Monad Testnet";

export type Tag = "Audited" | "New" | "Trending" | "Experimental";

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  docsUrl?: string;
  logo?: string;
  category: Category;
  network: Network;
  tags: Tag[];
}

export interface Filters {
  search: string;
  categories: Set<Category>;
  networks: Set<Network>;
  tags: Set<Tag>;
}
