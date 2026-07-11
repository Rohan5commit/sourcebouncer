import { AGENT_STORE_LISTING } from "./agent-store";

export function getListingMetadata() {
  return AGENT_STORE_LISTING;
}

export function getListingJSON() {
  return JSON.stringify(AGENT_STORE_LISTING, null, 2);
}
