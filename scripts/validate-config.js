/* Fails the build if a creator config still has REPLACE placeholders
   in the fields that would break checkout. Run: npm run validate */
const CREATOR = require("../src/config/creator.config.js");
const errors = [];
const must = [
  ["businessName", CREATOR.businessName],
  ["checkout.connectedAccountId", CREATOR.checkout?.connectedAccountId],
  ["access.creatorEmails", (CREATOR.access?.creatorEmails || [])[0]],
  ["notifyEmail", CREATOR.notifyEmail],
];
for (const [name, val] of must) {
  if (!val || String(val).includes("REPLACE")) errors.push(`Missing/placeholder: ${name}`);
}
if ((CREATOR.checkout?.creatorSplitPercent || 0) < 1 || CREATOR.checkout.creatorSplitPercent > 100)
  errors.push("checkout.creatorSplitPercent must be 1–100");
if (errors.length) { console.error("CONFIG INVALID:\n" + errors.map(e => "  - " + e).join("\n")); process.exit(1); }
console.log("Config valid.");
