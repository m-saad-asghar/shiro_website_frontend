/**
 * Translation Checker Script
 * سكريبت التحقق من الترجمات
 *
 * This script checks for hardcoded texts and missing translations
 * يقوم هذا السكريبت بالبحث عن النصوص الثابتة والترجمات المفقودة
 *
 * Usage: node check-translations.js
 */

const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

console.log(`${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║         Translation Checker - Shiro Real Estate          ║
║              فاحص الترجمات - شيرو العقارية               ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

// Load translation files
const enTranslationsPath = path.join(
  __dirname,
  "src",
  "assets",
  "Locales",
  "en",
  "translation.json"
);
const arTranslationsPath = path.join(
  __dirname,
  "src",
  "assets",
  "Locales",
  "ar",
  "translation.json"
);

let enTranslations = {};
let arTranslations = {};

try {
  enTranslations = JSON.parse(fs.readFileSync(enTranslationsPath, "utf8"));
  arTranslations = JSON.parse(fs.readFileSync(arTranslationsPath, "utf8"));
  console.log(
    `${colors.green}✓ Translation files loaded successfully${colors.reset}`
  );
} catch (error) {
  console.error(
    `${colors.red}✗ Error loading translation files:${colors.reset}`,
    error.message
  );
  process.exit(1);
}

// Compare translation files
console.log(
  `\n${colors.yellow}═══ Comparing Translation Files ═══${colors.reset}`
);

const enKeys = Object.keys(enTranslations);
const arKeys = Object.keys(arTranslations);

console.log(`English keys: ${enKeys.length}`);
console.log(`Arabic keys: ${arKeys.length}`);

// Find missing keys
const missingInEnglish = arKeys.filter((key) => !enKeys.includes(key));
const missingInArabic = enKeys.filter((key) => !arKeys.includes(key));

if (missingInEnglish.length > 0) {
  console.log(`\n${colors.red}✗ Keys missing in English:${colors.reset}`);
  missingInEnglish.forEach((key) => console.log(`  - ${key}`));
}

if (missingInArabic.length > 0) {
  console.log(`\n${colors.red}✗ Keys missing in Arabic:${colors.reset}`);
  missingInArabic.forEach((key) => console.log(`  - ${key}`));
}

if (missingInEnglish.length === 0 && missingInArabic.length === 0) {
  console.log(
    `${colors.green}✓ All keys are present in both languages${colors.reset}`
  );
}

// Common hardcoded patterns to check
const hardcodedPatterns = [
  {
    pattern: />\s*Login\s*</g,
    suggestion: '{t("login")}',
    description: "Login button",
  },
  {
    pattern: />\s*Call\s*</g,
    suggestion: '{t("Call")}',
    description: "Call button",
  },
  {
    pattern: />\s*Email\s*</g,
    suggestion: '{t("Email")}',
    description: "Email button",
  },
  {
    pattern: />\s*WhatsApp\s*</g,
    suggestion: '{t("WhatsApp")}',
    description: "WhatsApp button",
  },
  {
    pattern: />\s*Studio\s*</g,
    suggestion: '{t("Studio")}',
    description: "Studio label",
  },
  {
    pattern: />\s*Bedrooms\s*</g,
    suggestion: '{t("Bedrooms")}',
    description: "Bedrooms label",
  },
  {
    pattern: />\s*Bathrooms\s*</g,
    suggestion: '{t("Bathrooms")}',
    description: "Bathrooms label",
  },
  {
    pattern: />\s*Area\s*</g,
    suggestion: '{t("Area")}',
    description: "Area label",
  },
  {
    pattern: /"Weak"/g,
    suggestion: 't("Weak")',
    description: "Password strength: Weak",
  },
  {
    pattern: /"Medium"/g,
    suggestion: 't("Medium")',
    description: "Password strength: Medium",
  },
  {
    pattern: /"Strong"/g,
    suggestion: 't("Strong")',
    description: "Password strength: Strong",
  },
  { pattern: /"Grid"/g, suggestion: 't("Grid")', description: "Grid view" },
  { pattern: /"List"/g, suggestion: 't("List")', description: "List view" },
];

// Function to scan files recursively
function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, and other unnecessary directories
      if (!["node_modules", "dist", ".git", "build"].includes(file)) {
        scanDirectory(filePath, results);
      }
    } else if (file.match(/\.(tsx|ts|jsx|js)$/)) {
      results.push(filePath);
    }
  });

  return results;
}

// Scan for hardcoded texts
console.log(
  `\n${colors.yellow}═══ Scanning for Hardcoded Texts ═══${colors.reset}`
);

const srcPath = path.join(__dirname, "src");
const filesToScan = scanDirectory(srcPath);

console.log(`Scanning ${filesToScan.length} files...`);

let totalIssues = 0;
const issuesByFile = {};

filesToScan.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const relativeFilePath = path.relative(__dirname, filePath);

  hardcodedPatterns.forEach(({ pattern, suggestion, description }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      if (!issuesByFile[relativeFilePath]) {
        issuesByFile[relativeFilePath] = [];
      }
      issuesByFile[relativeFilePath].push({
        description,
        suggestion,
        count: matches.length,
      });
      totalIssues += matches.length;
    }
  });
});

// Display results
if (totalIssues > 0) {
  console.log(
    `\n${colors.red}✗ Found ${totalIssues} potential hardcoded texts:${colors.reset}\n`
  );

  Object.entries(issuesByFile).forEach(([file, issues]) => {
    console.log(`${colors.magenta}${file}${colors.reset}`);
    issues.forEach((issue) => {
      console.log(
        `  ${colors.yellow}⚠${colors.reset} ${issue.description} (${issue.count}x)`
      );
      console.log(
        `    Suggestion: ${colors.cyan}${issue.suggestion}${colors.reset}`
      );
    });
    console.log("");
  });
} else {
  console.log(`${colors.green}✓ No hardcoded texts found!${colors.reset}`);
}

// Summary
console.log(`${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║                         Summary                           ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}`);

console.log(`
Translation Keys:
  English: ${enKeys.length} keys
  Arabic:  ${arKeys.length} keys
  Missing in English: ${missingInEnglish.length}
  Missing in Arabic:  ${missingInArabic.length}

Hardcoded Texts:
  Files with issues: ${Object.keys(issuesByFile).length}
  Total issues found: ${totalIssues}
`);

// Exit code
const hasIssues =
  missingInEnglish.length > 0 || missingInArabic.length > 0 || totalIssues > 0;
if (hasIssues) {
  console.log(
    `${colors.red}✗ Translation check failed - Please fix the issues above${colors.reset}\n`
  );
  process.exit(1);
} else {
  console.log(
    `${colors.green}✓ All translation checks passed!${colors.reset}\n`
  );
  process.exit(0);
}
