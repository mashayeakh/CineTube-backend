import fs from "fs";
import path from "path";

function toRelativeImport(currentDir, targetAbsolutePath) {
  let relativePath = path.relative(currentDir, targetAbsolutePath).replace(/\\/g, "/");
  if (!relativePath.startsWith(".")) {
    relativePath = `./${relativePath}`;
  }
  return relativePath;
}

function fixDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      fixDir(full);
      continue;
    }

    if (!file.endsWith(".js")) continue;

    let content = fs.readFileSync(full, "utf8");
    const currentDir = path.dirname(full);

    // Rewrite TS path alias imports (e.g. @/app/...) to dist-relative imports.
    content = content.replace(
      /from\s+["']@\/([^"']+)["']/g,
      (_match, aliasPath) => {
        const target = path.resolve("dist", "src", `${aliasPath}.js`);
        const relativePath = toRelativeImport(currentDir, target);
        return `from \"${relativePath}\"`;
      },
    );

    // Ensure relative ESM imports include .js extension.
    content = content.replace(
      /from\s+["'](\.\.?\/[^"']+)["']/g,
      (match, p1) => {
        if (p1.endsWith(".js")) return match;
        return match.replace(p1, `${p1}.js`);
      },
    );

    // Rewrite invalid Prisma package subpath imports to local dist-relative imports.
    content = content.replace(
      /from\s+["']prisma\/generated\/prisma\/([^"']+)["']/g,
      (_match, subPath) => {
        const target = path.resolve("dist", "prisma", "generated", "prisma", `${subPath}.js`);
        const relativePath = toRelativeImport(currentDir, target);
        return `from \"${relativePath}\"`;
      },
    );

    fs.writeFileSync(full, content);
  }
}

fixDir("./dist");
