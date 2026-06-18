/* ============================================================
   SUBJECT MEDIA CONFIG — network-level (NOT per-creator).
   Holds the community membership + HighLevel bridge config.
   ============================================================ */
const SUBJECT_MEDIA_CONFIG = {
  coachingMembership: {
    tiers: {
      basic:   { name: "Tools + Community", monthlyPrice: 8.97,
                 stripeMonthlyPriceId: "REPLACE_price_basic" },
      premium: { name: "Community + 2 Meetings/Week", monthlyPrice: 0, meetingsPerWeek: 2,
                 stripeMonthlyPriceId: "REPLACE_price_premium" },
    },
    highlevel: {
      inboundWebhookUrl: process.env.HL_INBOUND_WEBHOOK_URL || "REPLACE_HL_workflow_inbound_webhook_url",
      communityGroupId: "REPLACE_group_id",
      meetingsGroupId:  "REPLACE_group_id",
    },
  },
};
module.exports = SUBJECT_MEDIA_CONFIG;
