export type Category = string;

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
  network?: Network;
  tags: Tag[];
  labels?: string[];
}

export interface Filters {
  search: string;
  categories: Set<Category>;
  tags: Set<Tag>;
  labels: Set<string>;
}
