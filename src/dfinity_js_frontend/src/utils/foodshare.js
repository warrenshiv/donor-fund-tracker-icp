import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

// CreateDonorProfile
export async function createDonorProfile(profile) {
  return window.canister.farmWorkChain.createDonorProfile(profile);
}

// CreateReceiverProfile
export async function createReceiverProfile(profile) {
  return window.canister.farmWorkChain.createReceiverProfile(profile);
}

// createDeliveryDriverProfile
export async function createDeliveryDriverProfile(profile) {
  return window.canister.farmWorkChain.createDeliveryDriverProfile(profile);
}

// CreateFoodContract
export async function createFoodContract(contract) {
  return window.canister.farmWorkChain.createFoodContract(contract);
}

// createDeliveryAssignment
export async function createDeliveryAssignment(assignment) {
  return window.canister.farmWorkChain.createDeliveryAssignment(assignment);
}

// getDeliveredDeliveryAssignments
export async function getDeliveredDeliveryAssignments() {
  return window.canister.farmWorkChain.getDeliveredDeliveryAssignments();
}

// getCancelledDeliveryAssignments
export async function getCancelledDeliveryAssignments() {
  return window.canister.farmWorkChain.getCancelledDeliveryAssignments();
}

// getInTransitDeliveryAssignments
export async function getInTransitDeliveryAssignments() {
  return window.canister.farmWorkChain.getInTransitDeliveryAssignments();
}

// getPendingDeliveryAssignments
export async function getPendingDeliveryAssignments() {
  return window.canister.farmWorkChain.getPendingDeliveryAssignments();
}

// CreateFoodSurplusPost
export async function createFoodSurplusPost(post) {
  return window.canister.farmWorkChain.createFoodSurplusPost(post);
}

// getFoodContract
export async function getFoodContract(id) {
  return window.canister.farmWorkChain.getFoodContract(id);
}

// getDeliveryAssignment
export async function getDeliveryAssignment(id) {
  return window.canister.farmWorkChain.getDeliveryAssignment(id);
}

// GetFoodContractByDonorId
export async function getFoodContractByDonorId(id) {
  return window.canister.farmWorkChain.getFoodContractByDonorId(id);
}

// GetReceiverProfileById
export async function getReceiverProfileById(id) {
  return window.canister.farmWorkChain.getReceiverProfileById(id);
}

//getReceiverProfileByOwner
export async function getReceiverProfileByOwner(owner) {
  return window.canister.farmWorkChain.getReceiverProfileByOwner();
}

// GetDonorProfileById
export async function getDonorProfile(id) {
  return window.canister.farmWorkChain.getDonorProfileBy(id);
}

// GetDonorByOwner
export async function getDonorProfileByOwner() {
  return window.canister.farmWorkChain.getDonorProfileByOwner();
}

// GetDeliveryDriverProfileByOwner
export async function getDeliveryDriverProfileByOwner() {
  return window.canister.farmWorkChain.getDeliveryDriverProfileByOwner();
}

// GetFoodSurplusPostById
export async function getFoodSurplusPostById(id) {
  return window.canister.farmWorkChain.getFoodSurplusPostById(id);
}

// GetAcceptedFoodContracts
export async function getAcceptedFoodContracts() {
  return window.canister.farmWorkChain.getAcceptedFoodContracts();
}

// GetCompletedFoodContracts
export async function getCompletedFoodContracts() {
  return window.canister.farmWorkChain.getCompletedFoodContracts();
}

// GetAllFoodContracts
export async function getAllFoodContracts() {
  return window.canister.farmWorkChain.getAllFoodContracts();
}

// GetAllDeliveryAssignments
export async function getAllDeliveryAssignments() {
  return window.canister.farmWorkChain.getAllDeliveryAssignments();
}

// GetAllFoodSurplusPosts
export async function getAllFoodSurplusPosts() {
  return window.canister.farmWorkChain.getAllFoodSurplusPosts();
}

// UpdateFoodContract
export async function updateFoodContract(contract) {
  return window.canister.farmWorkChain.updateFoodContract(contract);
}

// UpdateReceiverProfile
export async function updateReceiverProfile(profile) {
  return window.canister.farmWorkChain.updateReceiverProfile(profile);
}

// UpdateDonorProfile
export async function updateDonorProfile(profile) {
  return window.canister.farmWorkChain.updateDonorProfile(profile);
}

// UpdateFoodSurplusPost
export async function updateFoodSurplusPost(post) {
  return window.canister.farmWorkChain.updateFoodSurplusPost(post);
}

// DeleteFoodContract
export async function deleteFoodContract(id) {
  return window.canister.farmWorkChain.deleteFoodContract(id);
}

// DeleteFoodSurplusPost
export async function deleteFoodSurplusPost(id) {
  return window.canister.farmWorkChain.deleteFoodSurplusPost(id);
}

// DeleteReceiverProfile
export async function deleteReceiverProfile(id) {
  return window.canister.farmWorkChain.deleteReceiverProfile(id);
}

// DeleteDonorProfile
export async function deleteDonorProfile(id) {
  return window.canister.farmWorkChain.deleteDonorProfile(id);
}

//AcceptFoodContract
export async function acceptFoodContract(receiverId, contractId) {
  const payload = { receiverId, contractId };
  return window.canister.farmWorkChain.acceptFoodContract(payload);
}

// AcceptDeliveryAssignment
export async function acceptDeliveryAssignment(driverId, assignmentId) {
  const payload = { driverId, assignmentId };
  return window.canister.farmWorkChain.acceptDeliveryAssignment(payload);
}

// AcceptedFoodContract
export async function acceptedFoodContract(id) {
  return window.canister.farmWorkChain.acceptFoodContract(id);
}

// CompletedContracts
export async function completedContracts(id) {
  return window.canister.farmWorkChain.completedContracts(id);
}

// markDeliveryAssignmentDelivered
export async function markDeliveryAssignmentDelivered(
  receiverId,
  assignmentId
) {
  return window.canister.farmWorkChain.markDeliveryAssignmentDelivered(
    receiverId,
    assignmentId
  );
}

// Pay Driver
export async function payDriver(assignment) {
  const farmWorkChainCanister = window.canister.farmWorkChain;
  const jobPayResp = await farmWorkChainCanister.createReserveAssignmentPayment(
    assignment.id
  );
  const driverPrincipal = Principal.from(jobPayResp.Ok.driver);
  const driverAddress = await farmWorkChainCanister.getAddressFromPrincipal(
    driverPrincipal
  );
  const block = await transferICP(
    driverAddress,
    jobPayResp.Ok.amount,
    jobPayResp.Ok.memo
  );
  console.log(
    driverPrincipal,
    assignment.id,
    jobPayResp.Ok.amount,
    block,
    jobPayResp.Ok.memo
  );
  await farmWorkChainCanister.completeReserveAssignmentPayment(
    driverPrincipal,
    assignment.id,
    block,
    jobPayResp.Ok.amount.toString(),
    jobPayResp.Ok.memo
  );
}
