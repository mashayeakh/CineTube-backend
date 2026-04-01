import fs from "fs";
import path from "path";

function fixPrismaImports(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			fixPrismaImports(fullPath);
			continue;
		}

		if (!entry.name.endsWith(".js")) continue;

		let content = fs.readFileSync(fullPath, "utf8");
		const currentDir = path.dirname(fullPath);

		content = content.replace(
			/from\s+["']prisma\/generated\/prisma\/([^"']+)["']/g,
			(_match, subPath) => {
				const target = path.resolve("dist", "prisma", "generated", "prisma", `${subPath}.js`);
				let relativePath = path.relative(currentDir, target).replace(/\\/g, "/");
				if (!relativePath.startsWith(".")) {
					relativePath = `./${relativePath}`;
				}
				return `from \"${relativePath}\"`;
			},
		);

		fs.writeFileSync(fullPath, content);
	}
}

fixPrismaImports("dist");
// console.log("Fixed Prisma generated imports in dist/**/*.js");