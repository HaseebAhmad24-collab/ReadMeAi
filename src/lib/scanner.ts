import { Octokit } from "octokit";

export async function scanRepo(repoName: string, owner: string, accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });

  // 1. Get Repo Metadata
  const { data: repo } = await octokit.rest.repos.get({
    owner,
    repo: repoName,
  });

  // 2. Fetch File Tree (Recursive)
  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo: repoName,
    tree_sha: repo.default_branch,
    recursive: "true",
  });

  const fileTree = treeData.tree
    .filter((f) => f.type === "blob")
    .map((f) => f.path);

  // 3. Identify Key Files to Read
  const keyFiles = [
    "package.json",
    "requirements.txt",
    "Cargo.toml",
    "go.mod",
    "pom.xml",
    ".env.example",
    "Dockerfile",
    "docker-compose.yml",
    "README.md",
    "LICENSE",
  ];

  const foundKeyFiles = fileTree.filter((path) => 
    keyFiles.some(kf => path?.toLowerCase().endsWith(kf.toLowerCase()))
  );

  // 4. Read File Contents
  const fileContents: Record<string, string> = {};
  
  for (const path of foundKeyFiles.slice(0, 15)) { // Limit to 15 key files for token safety
    if (!path) continue;
    try {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo: repoName,
        path,
      });

      if ("content" in fileData) {
        fileContents[path] = Buffer.from(fileData.content, "base64").toString("utf-8");
      }
    } catch (e) {
      console.warn(`Failed to read file: ${path}`, e);
    }
  }

  return {
    metadata: {
      name: repo.name,
      description: repo.description,
      language: repo.language,
      topics: repo.topics,
      url: repo.html_url,
    },
    fileTree: fileTree.slice(0, 100), // Limit tree size
    fileContents,
  };
}
