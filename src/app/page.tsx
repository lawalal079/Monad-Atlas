import HomeSearchClient from "./components/HomeSearchClient";
import { loadProjects } from "./lib/projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const projects = loadProjects();
  return <HomeSearchClient projects={projects} />;
}
