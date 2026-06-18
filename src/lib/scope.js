/* Role-based data scoping — the security core of the multi-tenant model.
   A creator or parent may ONLY ever read rows for their own creator_id.
   Admin bypasses the scope. Enforced server-side on every request. */

export function resolveRole(email, creatorConfig) {
  if (!email) return { role: null, creatorId: null };
  const e = email.toLowerCase();
  const a = creatorConfig.access || {};
  const inList = (list) => (list || []).map((x) => x.toLowerCase()).includes(e);
  if (inList(a.adminEmails))   return { role: "admin",   creatorId: null };
  if (inList(a.parentEmails))  return { role: "parent",  creatorId: creatorConfig.slug || creatorConfig.id };
  if (inList(a.creatorEmails)) return { role: "creator", creatorId: creatorConfig.slug || creatorConfig.id };
  return { role: null, creatorId: null };
}

export const CAPABILITIES = {
  creator: { updateStatus: true,  respondQuotes: true,  viewPayouts: false, seeAllCreators: false, exportCsv: true },
  parent:  { updateStatus: false, respondQuotes: false, viewPayouts: true,  seeAllCreators: false, exportCsv: true },
  admin:   { updateStatus: true,  respondQuotes: true,  viewPayouts: true,  seeAllCreators: true,  exportCsv: true },
};

export function scopeQuery(query, role, creatorId) {
  if (role === "admin") return query;
  return query.eq("creator_id", creatorId);
}
