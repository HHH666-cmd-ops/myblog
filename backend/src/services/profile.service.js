import * as dataStore from "./data-store.service.js";

export async function getProfile() {
  return dataStore.getProfile();
}
