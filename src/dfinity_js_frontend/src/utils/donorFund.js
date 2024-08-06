import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

// CreateDonorProfile
export async function createDonorProfile(profile) {
  return window.canister.farmWorkChain.createDonorProfile(profile);
}

// getDonorProfileById
export async function getDonorProfileById(id) {
  return window.canister.farmWorkChain.getDonorProfileById(id);
}

// getDonorProfileByOwner
export async function getDonorProfileByOwner() {
  return window.canister.farmWorkChain.getDonorProfileByOwner();
}

// CreateCharityProfile
export async function createCharityProfile(profile) {
  return window.canister.farmWorkChain.createCharityProfile(profile);
}

// getCharityProfileById
export async function getCharityProfileById(id) {
  return window.canister.farmWorkChain.getCharityProfileById(id);
}

// getCharityProfileByOwner
export async function getCharityProfileByOwner() {
  return window.canister.farmWorkChain.getCharityProfileByOwner();
}

// createCampaign
export async function createCampaign(campaign) {
  return window.canister.farmWorkChain.createCampaign(campaign);
}

// getCampaignById
export async function getCampaignById(id) {
  return window.canister.farmWorkChain.getCampaignById(id);
}


// getAllCampaigns
export async function getAllCampaigns() {
  return window.canister.farmWorkChain.getAllCampaigns();
}

// deleteCampaignById
export async function deleteCampaignById(id) {
  return window.canister.farmWorkChain.deleteCampaignById(id);
}

// getDonorCampaigns
export async function getDonorCampaigns(donorId) {
  return window.canister.farmWorkChain.getDonorCampaigns(donorId);
}

// acceptCampaign
export async function acceptCampaign() {
  return window.canister.farmWorkChain.acceptCampaign();
}


export async function makeDonation(donor, amount, campaignId) {
  const donationCanister = window.canister.donation;
  const donationResponse = await donationCanister.createReserveDonation(donor.id, campaignId, amount);
  const recieverPrincipal = Principal.from(donationResponse.Ok.reciever);
  const recieverAddress = await donationCanister.getAddressFromPrincipal(recieverPrincipal);
  const block = await transferICP(recieverAddress, donationResponse.Ok.price, donationResponse.Ok.memo);
  await donationCanister.completeReserveDonation(recieverPrincipal, donor.id, donationResponse.Ok.price, block, donationResponse.Ok.memo);
  await donationCanister.changeRaised(campaignId, amount);
}
