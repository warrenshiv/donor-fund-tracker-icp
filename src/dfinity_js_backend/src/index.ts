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
  Address,
  Ledger,
  binaryAddressFromAddress,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

// Donor Profile Struct
const DonorProfile = Record({
  id: text,
  owner: Principal,
  name: text,
  phoneNumber: text,
  email: text,
  address: text,
  donationAmount: nat64,
  donations: Vec(text),
  donationsCount: nat64,
  status: text,
  joinedAt: text,
});

// Donor Status Enum
const DonorStatus = Variant({
  Active: text,
  Inactive: text,
  Suspended: text,
});

// Charity Profile Struct
const Charity = Record({
  id: text,
  owner: Principal,
  name: text,
  phoneNumber: text,
  email: text,
  address: text,
  missionStatement: text,
  totalReceived: nat64,
  donationsReceived: Vec(text),
  donationsCount: nat64,
  status: text,
  registeredAt: text,
});

// Message Struct
const Message = Variant({
  Success: text,
  Error: text,
  NotFound: text,
  InvalidPayload: text,
  PaymentFailed: text,
  PaymentCompleted: text,
});

// Payloads

// Donor Profile Payload
const DonorProfilePayload = Record({
  name: text,
  phoneNumber: text,
  email: text,
  address: text,
});

// Charity Profile Payload
const CharityProfilePayload = Record({
  name: text,
  phoneNumber: text,
  email: text,
  address: text,
  missionStatement: text,
});

// Storage
const donorProfileStorage = StableBTreeMap(0, text, DonorProfile);
const charityProfileStorage = StableBTreeMap(1, text, Charity);

const TIMEOUT_PERIOD = 9600n; // reservation period in seconds

/* 
    initialization of the Ledger canister. The principal text value is hardcoded because 
    we set it in the `dfx.json`
*/
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

// Functions

export default Canister({
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
      const donor = {
        ...payload,
        id: donorId,
        owner: ic.caller(),
        donationAmount: 0n,
        donations: [],
        donationsCount: 0n,
        status: "Active",
        joinedAt: new Date().toISOString(),
      };
      donorProfileStorage.insert(donorId, donor);
      return Ok(donor); // Successfully return the created donor profile
    }
  ),

  // Create a Charity Profile with validation
  createCharityProfile: update(
    [CharityProfilePayload],
    Result(Charity, Message),
    (payload) => {
      // Validate the payload
      if (
        !payload.name ||
        !payload.email ||
        !payload.phoneNumber ||
        !payload.address ||
        !payload.missionStatement
      ) {
        return Err({ InvalidPayload: "Missing required fields" });
      }

      // Check for valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        return Err({ InvalidPayload: "Invalid email format" });
      }

      // Validation for unique email check
      const charityProfiles = charityProfileStorage.values();
      const emailExists = charityProfiles.some(
        (profile) => profile.email === payload.email
      );
      if (emailExists) {
        return Err({ InvalidPayload: "Email already exists" });
      }

      // Assuming validation passes, proceed to create the charity profile
      const charityId = uuidv4();
      const charity = {
        id: charityId,
        owner: ic.caller(),
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        email: payload.email,
        address: payload.address,
        missionStatement: payload.missionStatement,
        totalReceived: 0n,
        donationsReceived: [],
        donationsCount: 0n,
        status: "Active",
        registeredAt: new Date().toISOString(), // Use text here, but ideally should use Date or similar
      };
      charityProfileStorage.insert(charityId, charity);
      return Ok(charity); // Successfully return the created charity profile
    }
  ),
});

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
