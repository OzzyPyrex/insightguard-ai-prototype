/*
  Portfolio-prototype boundary.
  This static site cannot enable real payments, payment-provider redirects,
  subscriptions, or webhooks. Do not add API keys or provider configuration.
*/
window.INSIGHTGUARD_PROTOTYPE_CONFIG = Object.freeze({
  mode: "prototype",
  paymentsEnabled: false,
  dataHandling: "browser-only"
});
