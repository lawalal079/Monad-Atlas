import { NextResponse } from "next/server";
import { loadProjects } from "@/app/lib/projects";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = loadProjects();
    const compiledPath = path.resolve(process.cwd(), "data", "projects_compiled.json");
    const exists = fs.existsSync(compiledPath);
    return NextResponse.json({ ok: true, count: projects.length, compiledPath, exists });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
