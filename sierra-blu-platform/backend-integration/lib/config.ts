/**
 * SIERRA BLU — GLOBAL CONFIGURATION
 * Re-exports from main lib/config to ensure single source of truth across codebase.
 */

export {
  SBR_CONFIG,
  getContractPreviewUrl,
  getPropertyShareUrl,
} from '../../../lib/config';

// Legacy SiteConfig alias for backwards compatibility (deprecated)
export const SiteConfig = {
  branding: {
    name: "Sierra Blu Realty",
    legalName: "Sierra Blu Real Estate Investment",
    tagline: "Ultra-Cinematic Asset Intelligence",
    foundedIn: "2026",
  },
  links: {
    portal: "/",
    landing: "/landing",
  }
};

/**
 * OS V4.0 Intelligence Thresholds
 * Used by Matching and Ranking engines.
 */
export const SierraBluOS = {
  version: "4.0.0",
  thresholds: {
    matchingScore: 0.75,
    highIntensityLead: 0.85,
    priceDeviation: 0.15,
  },
  stages: [
    "acquisition", "parsing", "branding", "distribution",
    "intelligence", "matching", "sales", "viewing",
    "closing", "feedback"
  ],
  enabledEngines: {
    geminiNLP: true,
    matchingNeuralNet: true,
    marketingAutomation: true,
    orchestrationLedger: true
  }
};
