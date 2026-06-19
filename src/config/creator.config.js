/* ============================================================
   CREATOR CONFIG — THE ONLY FILE YOU EDIT PER CREATOR
   ============================================================
   Each field maps to a Jotform question (noted in comments).
   To onboard a new creator: copy this file, swap the values,
   redeploy. Nothing else in the project needs to change.
   ============================================================ */

const CREATOR_CONFIG = {
  slug: "cmc-visuals",                   // unique id; matches creators.id in DB

  /* --- IDENTITY --- */
  businessName: "CMC VISUALS",
  creatorName: "Carson McCauley",         // confirmed via discovery — real name behind the brand
  handle: "@cmcvisualz",
  location: "Fishers / Indianapolis, IN", // corrected from discovery (was a placeholder guess)
  portfolioUrl: "https://cmcvisualz.myportfolio.com", // his real existing portfolio
  tagline: "Done-for-you photo & video coverage for your athlete. Delivered fast. Built for recruiting.",
  heroHeadline: ["PROFESSIONAL", "SPORTS MEDIA", "COVERAGE"],
  logoUrl: "",                            // no logo — photo-led identity, standard at this stage

  /* --- SEO / SOCIAL SHARING --- */
  seo: {
    pageTitle: "CMC Visuals — Sports Media Coverage",
    description: "Pro photo & video coverage for athletes and teams. Book your event.",
    ogImage: ""
  },

  /* --- THEME --- */
  theme: {
    primary:   "#e10f1c",
    accent:    "#ff2433",
    bg:        "#0a0a0a",
    bgCard:    "#1a1a1a",
    text:      "#f5f5f5",
    gold:      "#ffcc55",
    displayFont: "Anton",
    bodyFont:  "DM Sans"
  },

  /* --- PACKAGES --- */
  packages: [
    {
      id: "photo", icon: "📸", name: "PHOTO COVERAGE", price: 49,
      desc: "Game-day photo coverage. Edited and delivered fast.",
      features: ["Full event coverage", "15+ professionally edited photos", "Labeled & organized delivery"],
      featured: false
    },
    {
      id: "video", icon: "🎥", name: "VIDEO COVERAGE", price: 99,
      desc: "Highlight-ready video, shot and edited for coaches.",
      features: ["Game or event coverage (1 event)", "Color-graded highlight videos", "Access to raw edited footage", "Optimized clips for social media"],
      featured: true
    },
    {
      id: "elite", icon: "⚡", name: "ELITE COVERAGE", price: 139,
      desc: "Full event photo & video coverage in one package.",
      features: ["Full event photo & video coverage", "Professional photos & highlight videos", "Optimized clips for social media", "Labeled & organized delivery"],
      featured: false
    }
  ],

  /* --- TEAM / PREMIUM TIER --- */
  teamTier: {
    show: true,
    name: "TEAM ELITE PACKAGE",
    price: 399,
    desc: "Full team coverage — coaches, roster, game film. Everything your program needs."
  },

  /* --- SUBSCRIPTION --- */
  subscription: { show: true, name: "CMC Visuals Membership", price: 8.97 },

  /* --- CHECKOUT (Stripe Connect — money flows through central account) --- */
  checkout: {
    provider: "stripe_connect",
    legalEntity: "XPAND Media LLC",
    connectedAccountId: "REPLACE_WITH_CREATOR_CONNECT_ID", // set via /onboard or paste here
    creatorSplitPercent: 80,
    refundPolicy: "All sales are final. No refunds.",
    customFields: [
      { label: "Team Name & Jersey Number", required: true },
      { label: "Instagram Handle", required: false },
      { label: "Media Contact", required: false }
    ],
    paymentMethods: ["card", "google_pay", "cashapp", "klarna", "link"],
    allowPayLater: true,
    collectPhone: true,
    parentalConsent: true
  },

  /* --- NOTIFICATIONS --- */
  notifications: { sendConfirmationEmail: true, sendDeliveryEmail: true },

  /* --- ORDER STATUS STAGES --- */
  orderStages: ["Paid", "Shooting", "Editing", "Delivered"],

  /* --- OPERATIONS --- */
  notifyEmail: "REPLACE_WITH_CREATOR_EMAIL",

  /* --- ACCESS ROLES --- */
  access: {
    creatorEmails: ["REPLACE_WITH_CREATOR_EMAIL"],
    parentEmails:  ["REPLACE_WITH_PARENT_GUARDIAN_EMAIL"],
    adminEmails:   ["REPLACE_WITH_SUBJECT_MEDIA_ADMIN_EMAIL"]
  },

  /* --- FOOTER --- */
  footerNote: "Carson McCauley · CMC Visuals · Built for athletes"
};

export default CREATOR_CONFIG;
if (typeof module !== "undefined") module.exports = CREATOR_CONFIG;
