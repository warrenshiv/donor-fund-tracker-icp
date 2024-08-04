import { verify } from "@dfinity/agent";
import { auto } from "@popperjs/core";
import {
  query,
  update,
  text,
  Null,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  None,
  Some,
  Ok,
  Err,
  ic,
  Principal,
  Opt,
  nat64,
  Duration,
  Result,
  bool,
  Canister,
} from "azle";
import {
  Ledger,
  binaryAddressFromAddress,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

// Food Contract Status
const Status = Variant({
  Pending: text,
  Completed: text,
  Cancelled: text,
  Accepted: text,
});

// Business Type
const BusinessType = Variant({
  Restaurant: text,
  Grocery: text,
  Bakery: text,
  Other: text,
});

// Food Contract
const FoodContract = Record({
  contractId: text,
  postId: text,
  donorId: text,
  receiverId: Opt(text),
  agreedQuantity: nat64,
  status: Status,
});

// Donor Profile
const DonorProfile = Record({
  donorId: text,
  owner: Principal,
  name: text,
  email: text,
  phoneNumber: text,
  address: text,
  businessType: BusinessType,
});

// Receiver Profile
const ReceiverProfile = Record({
  receiverId: text,
  owner: Principal,
  name: text,
  email: text,
  phoneNumber: text,
  address: text,
  needs: text,
});

// FoodSurplusPost Status
const FoodSurplusStatus = Variant({
  Available: text,
  Claimed: text,
});

// Food Details
// const FoodDetails = Variant({
//     type: text,
//     Quantity: nat64,
//     ExpiryDate: text
// });

// FoodSurplusPost
const FoodSurplusPost = Record({
  postId: text,
  donorId: text,
  description: text,
  location: text,
  foodType: text,
  quantity: nat64,
  expiryDate: text,
  status: FoodSurplusStatus,
});

// Delivery Status
const DeliveryStatus = Variant({
  Pending: text,
  InTransit: text,
  Delivered: text,
  Cancelled: text,
});

// Vehicle Types
const VehicleType = Variant({
  Car: text,
  Van: text,
  Motorcycle: text,
  Bicycle: text,
  Truck: text,
  Other: text,
});

// Delivery Driver Profile
const DeliveryDriverProfile = Record({
  driverId: text,
  owner: Principal,
  name: text,
  email: text,
  phoneNumber: text,
  vehicle: VehicleType,
});

// Delivery Assignment
const DeliveryAssignment = Record({
  assignmentId: text,
  contractId: text,
  driverId: Opt(text),
  receiverId: text,
  wages: nat64,
  status: DeliveryStatus,
  pickupLocation: text,
  deliveryLocation: text,
});

// Food Contract Payload
const FoodContractPayload = Record({
  donorId: text,
  postId: text,
  agreedQuantity: nat64,
});

// AcceptFoodContract payload
const AcceptFoodContractPayload = Record({
  receiverId: text,
  contractId: text,
});

// AcceptDeliveryAssignment payload
const AcceptDeliveryAssignmentPayload = Record({
  driverId: text,
  assignmentId: text,
});

// Donor Profile Payload
const DonorProfilePayload = Record({
  name: text,
  email: text,
  phoneNumber: text,
  address: text,
  businessType: BusinessType,
});

// Receiver Profile Payload
const ReceiverProfilePayload = Record({
  name: text,
  email: text,
  phoneNumber: text,
  address: text,
  needs: text,
});

// FoodSurplusPost Payload
const FoodSurplusPayload = Record({
  donorId: text,
  description: text,
  location: text,
  foodType: text,
  quantity: nat64,
  expiryDate: text,
});

// Delivery Driver Profile Payload
const DeliveryDriverProfilePayload = Record({
  name: text,
  email: text,
  phoneNumber: text,
  vehicle: VehicleType,
});

// Delivery Assignment Payload
const DeliveryAssignmentPayload = Record({
  contractId: text,
  receiverId: text,
  wages: nat64,
  pickupLocation: text,
  deliveryLocation: text,
});

const PayStatus = Variant({
  PaymentPending: text,
  Completed: text,
  Cancelled: text,
});

// Assigment Payment Struct
const AssignmentPayment = Record({
  assignmentId: text,
  amount: nat64,
  status: PayStatus,
  receiver: Principal,
  driver: Principal,
  paid_at_block: Opt(nat64),
  memo: nat64,
  paidAt: text,
});

// Message
const Message = Variant({
  Success: text,
  Error: text,
  NotFound: text,
  InvalidPayload: text,
  PaymentFailed: text,
  PaymentCompleted: text,
});

// Storage
const foodContractStorage = StableBTreeMap(0, text, FoodContract);
const donorProfileStorage = StableBTreeMap(1, text, DonorProfile);
const receiverProfileStorage = StableBTreeMap(2, text, ReceiverProfile);
const foodSurplusPostStorage = StableBTreeMap(3, text, FoodSurplusPost);
const deliveryDriverProfileStorage = StableBTreeMap(
  4,
  text,
  DeliveryDriverProfile
);
const deliveryAssignmentStorage = StableBTreeMap(5, text, DeliveryAssignment);
const pendingJobPaymentStorage = StableBTreeMap(6, nat64, AssignmentPayment);
const persistedJobPaymentStorage = StableBTreeMap(
  7,
  Principal,
  AssignmentPayment
);

const TIMEOUT_PERIOD = 9600n; // reservation period in seconds

/* 
    initialization of the Ledger canister. The principal text value is hardcoded because 
    we set it in the `dfx.json`
*/
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

export default Canister({
  // Create FoodContract with validation
  createFoodContract: update(
    [FoodContractPayload],
    Result(FoodContract, Message),
    (payload) => {
      // Validate required fields
      if (!payload.donorId || !payload.postId || payload.agreedQuantity <= 0) {
        return Err({ InvalidPayload: "Missing or invalid fields" });
      }

      // Check for existence of donor and post
      if (!donorProfileStorage.get(payload.donorId)) {
        return Err({ InvalidPayload: "Invalid donor ID" });
      }
      if (!foodSurplusPostStorage.get(payload.postId)) {
        return Err({ InvalidPayload: "Invalid post ID" });
      }

      // Create the Food Contract if all validations pass
      const contractId = uuidv4();
      const foodContract = {
        ...payload,
        contractId,
        receiverId: None,
        status: { Pending: "Waiting for approval" }, // Initial status
      };

      // Insert the newly created contract into the storage
      foodContractStorage.insert(contractId, foodContract);
      return Ok(foodContract); // Successfully return the created food contract
    }
  ),

  // Create Delivery Assignment with validation
  createDeliveryAssignment: update(
    [DeliveryAssignmentPayload],
    Result(DeliveryAssignment, Message),
    (payload) => {
      // Validate required fields
      if (
        !payload.contractId ||
        !payload.receiverId ||
        payload.wages <= 0 ||
        !payload.pickupLocation ||
        !payload.deliveryLocation
      ) {
        return Err({ InvalidPayload: "Missing or invalid fields" });
      }

      // Check for valid contractId
      if (!foodContractStorage.get(payload.contractId)) {
        return Err({ InvalidPayload: "Invalid contract ID" });
      }

      // Check for valid receiverId
      if (!receiverProfileStorage.get(payload.receiverId)) {
        return Err({ InvalidPayload: "Invalid receiver ID" });
      }

      // Create the Delivery Assignment if all validations pass
      const assignmentId = uuidv4();
      const deliveryAssignment = {
        ...payload,
        assignmentId,
        driverId: None,
        status: { Pending: "Waiting for driver" }, // Initial status
      };

      // Insert the newly created assignment into the storage
      deliveryAssignmentStorage.insert(assignmentId, deliveryAssignment);
      return Ok(deliveryAssignment); // Successfully return the created delivery assignment
    }
  ),

  // Create a Donor Profile with validation
  createDonorProfile: update(
    [DonorProfilePayload],
    Result(DonorProfile, Message),
    (payload) => {
      // Validate the payload
      if (
        !payload.name ||
        !payload.email ||
        !payload.phoneNumber ||
        !payload.address
      ) {
        return Err({ InvalidPayload: "Missing required fields" });
      }

      // Check for valid email format (simple regex example)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        return Err({ InvalidPayload: "Invalid email format" });
      }

      // Validation for unique email check
      const donorProfiles = donorProfileStorage.values();
      const emailExists = donorProfiles.some(
        (profile) => profile.email === payload.email
      );
      if (emailExists) {
        return Err({ InvalidPayload: "Email already exists" });
      }

      // Assuming validation passes, proceed to create the donor profile
      const donorId = uuidv4();
      const donor = { ...payload, donorId, owner: ic.caller() };
      donorProfileStorage.insert(donorId, donor);
      return Ok(donor); // Successfully return the created donor profile
    }
  ),

  // Create a Receiver Profile with validation
  createReceiverProfile: update(
    [ReceiverProfilePayload],
    Result(ReceiverProfile, Message),
    (payload) => {
      // Validate required fields
      if (
        !payload.name ||
        !payload.email ||
        !payload.phoneNumber ||
        !payload.address ||
        !payload.needs
      ) {
        return Err({ InvalidPayload: "Missing required fields" });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        return Err({ InvalidPayload: "Invalid email format" });
      }

      // Validation for unique email check
      const receiverProfiles = receiverProfileStorage.values();
      const emailExists = receiverProfiles.some(
        (profile) => profile.email === payload.email
      );
      if (emailExists) {
        return Err({ InvalidPayload: "Email already exists" });
      }

      // If all validations pass, proceed to create the receiver profile
      const receiverId = uuidv4();
      const receiver = { ...payload, receiverId, owner: ic.caller() };
      receiverProfileStorage.insert(receiverId, receiver);
      return Ok(receiver); // Successfully return the created receiver profile
    }
  ),

  // Create Delivery Driver Profile with validation
  createDeliveryDriverProfile: update(
    [DeliveryDriverProfilePayload],
    Result(DeliveryDriverProfile, Message),
    (payload) => {
      // Validate required fields
      if (
        !payload.name ||
        !payload.email ||
        !payload.phoneNumber ||
        !payload.vehicle
      ) {
        return Err({ InvalidPayload: "Missing required fields" });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        return Err({ InvalidPayload: "Invalid email format" });
      }

      // Validation for unique email check
      const driverProfiles = deliveryDriverProfileStorage.values();
      const emailExists = driverProfiles.some(
        (profile) => profile.email === payload.email
      );
      if (emailExists) {
        return Err({ InvalidPayload: "Email already exists" });
      }

      // If all validations pass, proceed to create the driver profile
      const driverId = uuidv4();
      const driver = { ...payload, driverId, owner: ic.caller() };
      deliveryDriverProfileStorage.insert(driverId, driver);
      return Ok(driver); // Successfully return the created driver profile
    }
  ),

  // Create FoodSurplusPost with validation
  createFoodSurplusPost: update(
    [FoodSurplusPayload],
    Result(FoodSurplusPost, Message),
    (payload) => {
      // Validate required fields
      if (
        !payload.donorId ||
        !payload.description ||
        payload.quantity <= 0 ||
        !payload.expiryDate
      ) {
        return Err({ InvalidPayload: "Missing or invalid fields" });
      }

      // Validate that expiryDate is in the future
      const currentDate = new Date();
      const expiryDate = new Date(payload.expiryDate);
      if (expiryDate <= currentDate) {
        return Err({ InvalidPayload: "Expiry date must be in the future" });
      }

      // Optional: Check if donor exists (if donor profiles are stored)
      if (!donorProfileStorage.get(payload.donorId)) {
        return Err({ InvalidPayload: "Invalid donor ID" });
      }

      try {
        const postId = uuidv4();
        const foodSurplusPost = {
          ...payload,
          postId,
          status: { Available: "Available" }, // Set initial status
        };

        // Insert the newly created post into the storage
        foodSurplusPostStorage.insert(postId, foodSurplusPost);
        return Ok(foodSurplusPost); // Successfully return the created food surplus post
      } catch (error) {
        // Handle any errors that might occur during the creation process
        return Err({
          Error: `An error occurred while creating the food surplus post: ${Err}`,
        });
      }
    }
  ),

  // Get FoodContract by id
  getFoodContract: query(
    [text],
    Result(FoodContract, Message),
    (contractId) => {
      const foodContractOpt = foodContractStorage.get(contractId);
      if ("None" in foodContractOpt) {
        return Err({ NotFound: "contract with id=${contractId} not found" });
      }
      return Ok(foodContractOpt.Some);
    }
  ),

  // Get FoodContract by donorId
  getFoodContractByDonorId: query(
    [text],
    Result(FoodContract, Message),
    (donorId) => {
      const foodContract = foodContractStorage
        .values()
        .filter((contract) => contract.donorId === donorId);
      if (foodContract.length === 0) {
        return Err({ NotFound: "contract with donorId=${donorId} not found" });
      }
      return Ok(foodContract[0]);
    }
  ),

  // Get Delivery Assignment by id
  getDeliveryAssignment: query(
    [text],
    Result(DeliveryAssignment, Message),
    (assignmentId) => {
      const deliveryAssignmentOpt = deliveryAssignmentStorage.get(assignmentId);
      if ("None" in deliveryAssignmentOpt) {
        return Err({
          NotFound: "assignment with id=${assignmentId} not found",
        });
      }
      return Ok(deliveryAssignmentOpt.Some);
    }
  ),

  // Get Receiver Profile by id
  getReceiverProfile: query(
    [text],
    Result(ReceiverProfile, Message),
    (receiverId) => {
      const receiverProfileOpt = receiverProfileStorage.get(receiverId);
      if ("None" in receiverProfileOpt) {
        return Err({ NotFound: "receiver with id=${receiverId} not found" });
      }
      return Ok(receiverProfileOpt.Some);
    }
  ),

  // Get Receiver by owner principal using filter
  getReceiverProfileByOwner: query([], Result(ReceiverProfile, Message), () => {
    const receiverProfile = receiverProfileStorage
      .values()
      .filter((receiver) => {
        return receiver.owner.toText() === ic.caller().toText();
      });
    if (receiverProfile.length === 0) {
      return Err({ NotFound: "receiver profile not found" });
    }
    return Ok(receiverProfile[0]);
  }),

  // Get Donor Profile by id
  getDonorProfile: query([text], Result(DonorProfile, Message), (donorId) => {
    const donorProfileOpt = donorProfileStorage.get(donorId);
    if ("None" in donorProfileOpt) {
      return Err({ NotFound: "donor with id=${donorId} not found" });
    }
    return Ok(donorProfileOpt.Some);
  }),

  // Get Donor Profile by owner principal using filter
  getDonorProfileByOwner: query([], Result(DonorProfile, Message), () => {
    const donorProfile = donorProfileStorage.values().filter((donor) => {
      return donor.owner.toText() === ic.caller().toText();
    });
    if (donorProfile.length === 0) {
      return Err({ NotFound: "donor profile not found" });
    }
    return Ok(donorProfile[0]);
  }),

  // Get Delivery Driver Profile by id
  getDeliveryDriverProfile: query(
    [text],
    Result(DeliveryDriverProfile, Message),
    (driverId) => {
      const driverProfileOpt = deliveryDriverProfileStorage.get(driverId);
      if ("None" in driverProfileOpt) {
        return Err({ NotFound: "driver with id=${driverId} not found" });
      }
      return Ok(driverProfileOpt.Some);
    }
  ),

  // Get Delivery Driver Profile by owner principal using filter
  getDeliveryDriverProfileByOwner: query(
    [],
    Result(DeliveryDriverProfile, Message),
    () => {
      const driverProfile = deliveryDriverProfileStorage
        .values()
        .filter((driver) => {
          return driver.owner.toText() === ic.caller().toText();
        });
      if (driverProfile.length === 0) {
        return Err({ NotFound: "driver profile not found" });
      }
      return Ok(driverProfile[0]);
    }
  ),

  // Get FoodSurplusPost by id
  getFoodSurplusPost: query(
    [text],
    Result(FoodSurplusPost, Message),
    (postId) => {
      const foodSurplusPostOpt = foodSurplusPostStorage.get(postId);
      if ("None" in foodSurplusPostOpt) {
        return Err({ NotFound: "post with id=${postId} not found" });
      }
      return Ok(foodSurplusPostOpt.Some);
    }
  ),

  // Fetch Accepted FoodContracts
  getAcceptedFoodContracts: query([], Vec(FoodContract), () => {
    const acceptedContracts = foodContractStorage
      .values()
      .filter((contract) => {
        return contract.status.Accepted !== undefined;
      });
    return acceptedContracts;
  }),

  // Fetch Completed FoodContracts
  getPendingFoodContracts: query([], Vec(FoodContract), () => {
    const pendingContracts = foodContractStorage.values().filter((contract) => {
      return contract.status.Pending !== undefined;
    });
    return pendingContracts;
  }),

  // Fetch Completed FoodContracts
  getCompletedFoodContracts: query([], Vec(FoodContract), () => {
    const foodContracts = foodContractStorage.values().filter((contract) => {
      // Check if the status is 'Completed' and handle the case appropriately
      return contract.status.Completed !== undefined;
    });
    return foodContracts;
  }),

  // Fetch Cancelled FoodContracts
  getCancelledFoodContracts: query([], Vec(FoodContract), () => {
    const cancelledContracts = foodContractStorage
      .values()
      .filter((contract) => {
        return contract.status.Cancelled !== undefined;
      });
    return cancelledContracts;
  }),

  // Fetch Pending Delivery Assignments
  getPendingDeliveryAssignments: query([], Vec(DeliveryAssignment), () => {
    const pendingAssignments = deliveryAssignmentStorage
      .values()
      .filter((assignment) => {
        return assignment.status.Pending !== undefined;
      });
    return pendingAssignments;
  }),

  // Fetch InTransit Delivery Assignments
  getInTransitDeliveryAssignments: query([], Vec(DeliveryAssignment), () => {
    const inTransitAssignments = deliveryAssignmentStorage
      .values()
      .filter((assignment) => {
        return assignment.status.InTransit !== undefined;
      });
    return inTransitAssignments;
  }),

  // Fetch Delivered Delivery Assignments
  getDeliveredDeliveryAssignments: query([], Vec(DeliveryAssignment), () => {
    const deliveredAssignments = deliveryAssignmentStorage
      .values()
      .filter((assignment) => {
        return assignment.status.Delivered !== undefined;
      });
    return deliveredAssignments;
  }),

  // Fetch Cancelled Delivery Assignments
  getCancelledDeliveryAssignments: query([], Vec(DeliveryAssignment), () => {
    const cancelledAssignments = deliveryAssignmentStorage
      .values()
      .filter((assignment) => {
        return assignment.status.Cancelled !== undefined;
      });
    return cancelledAssignments;
  }),

  // Change Delivery Assignment status to Delivered(requires the receiverId and assignmentId)
  markDeliveryAssignmentDelivered: update(
    [text, text],
    Result(DeliveryAssignment, Message),
    (receiverId, assignmentId) => {
      const deliveryAssignmentOpt = deliveryAssignmentStorage.get(assignmentId);
      if ("None" in deliveryAssignmentOpt) {
        return Err({
          NotFound: "assignment with id=${assignmentId} not found",
        });
      }

      const deliveryAssignment = deliveryAssignmentOpt.Some;
      if (deliveryAssignment.receiverId !== receiverId) {
        return Err({
          Error: "Receiver ID does not match the assignment receiver ID",
        });
      }

      deliveryAssignment.status = { Delivered: "Assignment delivered" };
      deliveryAssignmentStorage.insert(assignmentId, deliveryAssignment);
      return Ok(deliveryAssignment);
    }
  ),

  // Get All FoodContracts
  getAllFoodContracts: query([], Vec(FoodContract), () => {
    try {
      const contracts = foodContractStorage.values();
      if (!contracts) {
        throw new Error("No food contracts found.");
      }
      return contracts;
    } catch (error) {
      console.error("Error fetching food contracts:", error);
      return [];
    }
  }),

  // Get All Delivery Assignments with no error handling
  getAllDeliveryAssignments: query([], Vec(DeliveryAssignment), () => {
    return deliveryAssignmentStorage.values();
  }),

  // Get All FoodSurplusPosts
  getAllFoodSurplusPosts: query([], Vec(FoodSurplusPost), () => {
    try {
      const posts = foodSurplusPostStorage.values();
      if (!posts) {
        throw new Error("No food surplus posts found.");
      }
      return posts;
    } catch (error) {
      console.error("Error fetching food surplus posts:", error);
      return [];
    }
  }),

  // Update FoodContract
  updateFoodContract: update(
    [text, Status],
    Result(FoodContract, Message),
    (contractId, status) => {
      const foodContractOpt = foodContractStorage.get(contractId);
      if ("None" in foodContractOpt) {
        return Err({ NotFound: "contract with id=${contractId} not found" });
      }
      const foodContract = foodContractOpt.Some;
      foodContract.status = status;
      foodContractStorage.insert(contractId, foodContract);
      return Ok(foodContract);
    }
  ),

  // Update Delivery Assignment
  updateDeliveryAssignment: update(
    [text, DeliveryStatus],
    Result(DeliveryAssignment, Message),
    (assignmentId, status) => {
      const deliveryAssignmentOpt = deliveryAssignmentStorage.get(assignmentId);
      if ("None" in deliveryAssignmentOpt) {
        return Err({
          NotFound: "assignment with id=${assignmentId} not found",
        });
      }
      const deliveryAssignment = deliveryAssignmentOpt.Some;
      deliveryAssignment.status = status;
      deliveryAssignmentStorage.insert(assignmentId, deliveryAssignment);
      return Ok(deliveryAssignment);
    }
  ),

  // Update Receivers Profile
  updateReceiverProfile: update(
    [ReceiverProfilePayload],
    Result(ReceiverProfile, Message),
    (payload) => {
      const receiverProfile = receiverProfileStorage
        .values()
        .filter((receiver) => {
          return receiver.owner.toText() === ic.caller().toText();
        });
      if (receiverProfile.length === 0) {
        return Err({ NotFound: "receiver profile not found" });
      }
      const receiver = receiverProfile[0];
      receiver.name = payload.name;
      receiver.email = payload.email;
      receiver.phoneNumber = payload.phoneNumber;
      receiver.address = payload.address;
      receiver.needs = payload.needs;
      receiverProfileStorage.insert(receiver.receiverId, receiver);
      return Ok(receiver);
    }
  ),

  // Update Donors Profile
  updateDonorProfile: update(
    [DonorProfilePayload],
    Result(DonorProfile, Message),
    (payload) => {
      const donorProfile = donorProfileStorage.values().filter((donor) => {
        return donor.owner.toText() === ic.caller().toText();
      });
      if (donorProfile.length === 0) {
        return Err({ NotFound: "donor profile not found" });
      }
      const donor = donorProfile[0];
      donor.name = payload.name;
      donor.email = payload.email;
      donor.phoneNumber = payload.phoneNumber;
      donor.address = payload.address;
      donor.businessType = payload.businessType;
      donorProfileStorage.insert(donor.donorId, donor);
      return Ok(donor);
    }
  ),

  // Update Delivery Driver Profile
  updateDeliveryDriverProfile: update(
    [DeliveryDriverProfilePayload],
    Result(DeliveryDriverProfile, Message),
    (payload) => {
      const driverProfile = deliveryDriverProfileStorage
        .values()
        .filter((driver) => {
          return driver.owner.toText() === ic.caller().toText();
        });
      if (driverProfile.length === 0) {
        return Err({ NotFound: "driver profile not found" });
      }
      const driver = driverProfile[0];
      driver.name = payload.name;
      driver.email = payload.email;
      driver.phoneNumber = payload.phoneNumber;
      driver.vehicle = payload.vehicle;
      deliveryDriverProfileStorage.insert(driver.driverId, driver);
      return Ok(driver);
    }
  ),

  // Update FoodSurplusPost
  updateFoodSurplusPost: update(
    [text, FoodSurplusStatus],
    Result(FoodSurplusPost, Message),
    (postId, status) => {
      const foodSurplusPostOpt = foodSurplusPostStorage.get(postId);
      if ("None" in foodSurplusPostOpt) {
        return Err({ NotFound: "post with id=${postId} not found" });
      }
      const foodSurplusPost = foodSurplusPostOpt.Some;
      foodSurplusPost.status = status;
      foodSurplusPostStorage.insert(postId, foodSurplusPost);
      return Ok(foodSurplusPost);
    }
  ),

  // Delete a FoodContract
  deleteFoodContract: update(
    [text],
    Result(FoodContract, Message),
    (contractId) => {
      const foodContractOpt = foodContractStorage.remove(contractId);
      if ("None" in foodContractOpt) {
        return Err({ NotFound: "contract with id=${contractId} not found" });
      }
      return Ok(foodContractOpt.Some);
    }
  ),

  // Delete a Delivery Assignment
  deleteDeliveryAssignment: update(
    [text],
    Result(DeliveryAssignment, Message),
    (assignmentId) => {
      const deliveryAssignmentOpt =
        deliveryAssignmentStorage.remove(assignmentId);
      if ("None" in deliveryAssignmentOpt) {
        return Err({
          NotFound: "assignment with id=${assignmentId} not found",
        });
      }
      return Ok(deliveryAssignmentOpt.Some);
    }
  ),

  // Delete FoodSurplusPost
  deleteFoodSurplusPost: update(
    [text],
    Result(FoodSurplusPost, Message),
    (postId) => {
      const foodSurplusPostOpt = foodSurplusPostStorage.remove(postId);
      if ("None" in foodSurplusPostOpt) {
        return Err({ NotFound: "post with id=${postId} not found" });
      }
      return Ok(foodSurplusPostOpt.Some);
    }
  ),

  // Delete a Donor Profile
  deleteDonorProfile: update(
    [text],
    Result(DonorProfile, Message),
    (donorId) => {
      const donorProfileOpt = donorProfileStorage.remove(donorId);
      if ("None" in donorProfileOpt) {
        return Err({ NotFound: "donor with id=${donorId} not found" });
      }
      return Ok(donorProfileOpt.Some);
    }
  ),

  // Delete a Receiver Profile
  deleteReceiverProfile: update(
    [text],
    Result(ReceiverProfile, Message),
    (receiverId) => {
      const receiverProfileOpt = receiverProfileStorage.remove(receiverId);
      if ("None" in receiverProfileOpt) {
        return Err({ NotFound: "receiver with id=${receiverId} not found" });
      }
      return Ok(receiverProfileOpt.Some);
    }
  ),

  // Delete a Delivery Driver Profile
  deleteDeliveryDriverProfile: update(
    [text],
    Result(DeliveryDriverProfile, Message),
    (driverId) => {
      const driverProfileOpt = deliveryDriverProfileStorage.remove(driverId);
      if ("None" in driverProfileOpt) {
        return Err({ NotFound: "driver with id=${driverId} not found" });
      }
      return Ok(driverProfileOpt.Some);
    }
  ),

  // Receiver Accepts a FoodContract by passing the recieverId and contractId
  acceptFoodContract: update(
    [AcceptFoodContractPayload],
    Result(FoodContract, Message),
    (payload) => {
      // Validate the contractId
      const foodContractOpt = foodContractStorage.get(payload.contractId);
      if ("None" in foodContractOpt) {
        return Err({
          NotFound: "contract with id=${payload.contractId} not found",
        });
      }

      // Validate the receiverId
      const receiverProfileOpt = receiverProfileStorage.get(payload.receiverId);
      if ("None" in receiverProfileOpt) {
        return Err({
          NotFound: "receiver with id=${payload.receiverId} not found",
        });
      }

      // Throw an error if the contract already has a receiver
      const contract = foodContractOpt.Some;
      if (contract.receiverId.length > 0) {
        return Err({ Error: "Contract already has a receiver" });
      }

      foodContractStorage.insert(payload.contractId, {
        ...contract,
        receiverId: Some(payload.receiverId),
        status: { Accepted: "Contract accepted" },
      });
      return Ok(contract);
    }
  ),

  // The Delivery Driver accepts a Delivery Assignment by passing his Id and the delivery assignment Id
  acceptDeliveryAssignment: update(
    [AcceptDeliveryAssignmentPayload],
    Result(DeliveryAssignment, Message),
    (payload) => {
      // Validate the assignmentId
      const deliveryAssignmentOpt = deliveryAssignmentStorage.get(
        payload.assignmentId
      );
      if ("None" in deliveryAssignmentOpt) {
        return Err({
          NotFound: "assignment with id=${payload.assignmentId} not found",
        });
      }

      // Validate the driverId
      const driverProfileOpt = deliveryDriverProfileStorage.get(
        payload.driverId
      );
      if ("None" in driverProfileOpt) {
        return Err({
          NotFound: "driver with id=${payload.driverId} not found",
        });
      }

      // Check if the DeliveryAssignment already has a driver
      const assignment = deliveryAssignmentOpt.Some;
      const assignmentOpt = deliveryAssignmentStorage.get(payload.driverId);
      if (assignmentOpt === null) {
        return Err({ Error: "Assignment already has a driver" });
      }

      deliveryAssignmentStorage.insert(payload.assignmentId, {
        ...assignment,
        driverId: Some(payload.driverId),
        status: { InTransit: "Assignment in transit" },
      });

      return Ok(assignment); // Successfully return the updated delivery assignment
    }
  ),

  // Create a reserve for a delivery assignment
  // Create a reserve for a delivery assignment
  createReserveAssignmentPayment: update(
    [text],
    Result(AssignmentPayment, Message),
    (assignmentId) => {
      const assignmentOpt = deliveryAssignmentStorage.get(assignmentId);
      if ("None" in assignmentOpt) {
        return Err({
          NotFound: `Cannot reserve Assignment: Assignment with id=${assignmentId} not found`,
        });
      }

      const assignment = assignmentOpt.Some;

      const receiverOpt = receiverProfileStorage.get(assignment.receiverId);

      if ("None" in receiverOpt) {
        return Err({
          NotFound: `Cannot reserve Assignment: Receiver with id=${assignment.receiverId} not found`,
        });
      }
      const receiver = receiverOpt.Some;

      if (assignment.driverId.None === null) {
        return Err({
          NotFound: `Cannot reserve Assignment: Driver not assigned to the assignment with id=${assignmentId}`,
        });
      }

      const driverOpt = deliveryDriverProfileStorage.get(
        assignment.driverId.Some
      );
      if ("None" in driverOpt) {
        return Err({
          NotFound: `Cannot reserve Assignment: Driver with id=${assignment.driverId.Some} not found`,
        });
      }

      const driver = driverOpt.Some;

      try {
        const reserve = {
          assignmentId: assignment.assignmentId,
          amount: assignment.wages, // Ensure this is correct field for amount
          status: { PaymentPending: "Payment pending" },
          receiver: receiver.owner,
          driver: driver.owner,
          paid_at_block: None,
          memo: generateCorrelationId(assignmentId), // Ensure memo is handled as nat64
          paidAt: "",
        };

        // console.log(`Reserve created: ${reserve}`);
        // console.log("memo", reserve.memo);

        pendingJobPaymentStorage.insert(reserve.memo, reserve);
        discardByTimeout(reserve.memo, TIMEOUT_PERIOD);
        return Ok(reserve);
      } catch (error) {
        return Err({
          Error: `An error occurred while creating the reserve: ${error}`,
        });
      }
    }
  ),

  // Complete an Assignment Payment to driver
  completeAssignmentPayment: update(
    [Principal, text, nat64, nat64, nat64],
    Result(AssignmentPayment, Message),
    async (driver, assignmentId, payAmount, block, memo) => {
      const paymentVerified = await verifyPaymentInternal(
        driver,
        payAmount,
        block,
        memo
      );
      if (!paymentVerified) {
        return Err({
          PaymentFailed: `Payment verification failed: Cannot verify the payment, memo=${memo}`,
        });
      }

      const pendingAssignmentPaymentOpt = pendingJobPaymentStorage.remove(memo);
      if ("None" in pendingAssignmentPaymentOpt) {
        return Err({
          NotFound: `Cannot complete payment: There is no pending Assignment Pay with id=${assignmentId}`,
        });
      }

      const assignmentPayment = pendingAssignmentPaymentOpt.Some;
      const updatedReserve = {
        ...assignmentPayment,
        status: { Completed: "Payment completed" },
        paid_at_block: Some(block),
        paidAt: ic.time().toString(),
      };

      const assignmentOpt = deliveryAssignmentStorage.get(assignmentId);
      if ("None" in assignmentOpt) {
        return Err({
          NotFound: `Cannot complete payment: Assignment with id=${assignmentId} not found`,
        });
      }

      const assignment = assignmentOpt.Some;
      deliveryAssignmentStorage.insert(assignmentId, {
        ...assignment,
        status: { Delivered: "Assignment delivered" },
      });
      
      // console.log("memo type:", typeof memo, "memo value:", memo);

      persistedJobPaymentStorage.insert(ic.caller(), updatedReserve);
      return Ok(updatedReserve);
    }
  ),

  /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
  getAddressFromPrincipal: query([Principal], text, (principal) => {
    return hexAddressFromPrincipal(principal, 0);
  }),

  // Function to generate correlation id
  generateCorrelationId: query([text], nat64, (assignmentId) => {
    return generateCorrelationId(assignmentId);
  }),
});

/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
*/
function hash(input: any): nat64 {
  return BigInt(Math.abs(hashCode().value(input)));
}

// a workaround to make uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};

// HELPER FUNCTIONS
function generateCorrelationId(assignmentId: text): nat64 {
  const correlationId = `${assignmentId}_${ic.caller().toText()}_${ic.time()}`;
  return hash(correlationId);
}
/*
    after the order is created, we give the `delay` amount of minutes to pay for the order.
    if it's not paid during this timeframe, the order is automatically removed from the pending orders.
*/
function discardByTimeout(memo: nat64, delay: Duration) {
  ic.setTimer(delay, () => {
    const order = pendingJobPaymentStorage.remove(memo);
    console.log(`Reserve discarded ${order}`);
  });
}

async function verifyPaymentInternal(
  receiver: Principal,
  amount: nat64,
  block: nat64,
  memo: nat64
): Promise<bool> {
  const blockData = await ic.call(icpCanister.query_blocks, {
    args: [{ start: block, length: 1n }],
  });
  const tx = blockData.blocks.find((block) => {
    if ("None" in block.transaction.operation) {
      return false;
    }
    const operation = block.transaction.operation.Some;
    const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
    const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
    return (
      block.transaction.memo === memo &&
      hash(senderAddress) === hash(operation.Transfer?.from) &&
      hash(receiverAddress) === hash(operation.Transfer?.to) &&
      amount === operation.Transfer?.amount.e8s
    );
  });
  return tx ? true : false;
}
