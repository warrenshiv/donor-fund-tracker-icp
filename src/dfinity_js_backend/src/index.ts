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
import Donor from "../../dfinity_js_frontend/src/pages/Donor/Donor";
import { getDonorProfile } from "../../dfinity_js_frontend/src/utils/foodshare";
import { title } from "process";

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

// Campaign Status Enum
const CampaignStatus = Variant({
  Active: text,
  Completed: text,
  Cancelled: text,
  Pending: text,
});

// Campaign Struct
const Campaign = Record({
  id: text,
  title: text,
  description: text,
  targetAmount: nat64,
  totalReceived: nat64,
  donors: Vec(text),
  status: CampaignStatus,
  creator: Principal,
  startedAt: text,
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

// Campaign Payload
const CampaignPayload = Record({
  title: text,
  description: text,
  targetAmount: nat64,
});

// Storage
const donorProfileStorage = StableBTreeMap(0, text, DonorProfile);
const charityProfileStorage = StableBTreeMap(1, text, Charity);
const campaignStorage = StableBTreeMap(2, text, Campaign);

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

  // Function to update a Donor Profile
  updateDonorProfile: update(
    [text, DonorProfilePayload],
    Result(DonorProfile, Message),
    (donorId, payload) => {
      const donorProfileOpt = donorProfileStorage.get(donorId);

      if ("None" in donorProfileOpt) {
        return Err({
          NotFound: `Donor profile with id=${donorId} not found`,
        });
      }

      const donorProfile = donorProfileOpt.Some;

      // Check if the caller is the owner of the donor profile
      if (donorProfile.owner !== ic.caller()) {
        return Err({ Error: "Unauthorized" });
      }

      // Update the donor profile
      const updatedDonorProfile = {
        ...donorProfile,
        ...payload,
      };
      donorProfileStorage.insert(donorId, updatedDonorProfile);

      return Ok(updatedDonorProfile);
    }
  ),

  // Function to get a Donor Profile by ID
  getDonorProfile: query([text], Result(DonorProfile, Message), (donorId) => {
    const donorProfileOpt = donorProfileStorage.get(donorId);

    if ("None" in donorProfileOpt) {
      return Err({
        NotFound: `Donor profile with id=${donorId} not found`,
      });
    }

    return Ok(donorProfileOpt.Some);
  }),

  // Function to get a Donor Profile by Owner Principal using filter
  getDonorProfileByOwner: query([], Result(DonorProfile, Message), () => {
    const donorProfiles = donorProfileStorage.values().filter((donor) => {
      return donor.owner.toText === ic.caller().toText;
    });

    if (donorProfiles.length === 0) {
      return Err({
        NotFound: `Donor profile for owner=${ic.caller()} not found`,
      });
    }

    return Ok(donorProfiles[0]);
  }),

  // Function to get all Donor Profiles with error handling
  getAllDonorProfiles: query([], Result(Vec(DonorProfile), Message), () => {
    const donorProfiles = donorProfileStorage.values();

    // Check if there are any donor profiles
    if (donorProfiles.length === 0) {
      return Err({ NotFound: "No donor profiles found" });
    }

    return Ok(donorProfiles);
  }),

  // Funtion to delete a Donor Profile
  deleteDonorProfile: update([text], Result(Null, Message), (donorId) => {
    const donorProfileOpt = donorProfileStorage.get(donorId);

    if ("None" in donorProfileOpt) {
      return Err({
        NotFound: `Donor profile with id=${donorId} not found`,
      });
    }

    const donorProfile = donorProfileOpt.Some;

    // Check if the caller is the owner of the donor profile
    if (donorProfile.owner !== ic.caller()) {
      return Err({ Error: "Unauthorized" });
    }

    donorProfileStorage.remove(donorId);

    return Ok(null);
  }),

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
        registeredAt: new Date().toISOString(),
      };
      charityProfileStorage.insert(charityId, charity);
      return Ok(charity); // Successfully return the created charity profile
    }
  ),

  // Function to update a Charity Profile
  updateCharityProfile: update(
    [text, CharityProfilePayload],
    Result(Charity, Message),
    (charityId, payload) => {
      const charityProfileOpt = charityProfileStorage.get(charityId);

      if ("None" in charityProfileOpt) {
        return Err({
          NotFound: `Charity profile with id=${charityId} not found`,
        });
      }

      const charityProfile = charityProfileOpt.Some;

      // Check if the caller is the owner of the charity profile
      if (charityProfile.owner !== ic.caller()) {
        return Err({ Error: "Unauthorized" });
      }

      // Update the charity profile
      const updatedCharityProfile = {
        ...charityProfile,
        ...payload,
      };
      charityProfileStorage.insert(charityId, updatedCharityProfile);

      return Ok(updatedCharityProfile);
    }
  ),

  // Function to get a Charity Profile by ID
  getCharityProfile: query([text], Result(Charity, Message), (charityId) => {
    const charityProfileOpt = charityProfileStorage.get(charityId);

    if ("None" in charityProfileOpt) {
      return Err({
        NotFound: `Charity profile with id=${charityId} not found`,
      });
    }

    return Ok(charityProfileOpt.Some);
  }),

  // Function to get a Charity Profile by Owner Principal using filter
  getCharityProfileByOwner: query([], Result(Charity, Message), () => {
    const charityProfiles = charityProfileStorage.values().filter((charity) => {
      return charity.owner.toText === ic.caller().toText;
    });

    if (charityProfiles.length === 0) {
      return Err({
        NotFound: `Charity profile for owner=${ic.caller()} not found`,
      });
    }

    return Ok(charityProfiles[0]);
  }),

  // Function to get all Charity Profiles with error handling
  getAllCharityProfiles: query([], Result(Vec(Charity), Message), () => {
    const charityProfiles = charityProfileStorage.values();

    // Check if there are any charity profiles
    if (charityProfiles.length === 0) {
      return Err({ NotFound: "No charity profiles found" });
    }

    return Ok(charityProfiles);
  }),

  // Funtion to delete a Charity Profile
  deleteCharityProfile: update([text], Result(Null, Message), (charityId) => {
    const charityProfileOpt = charityProfileStorage.get(charityId);

    if ("None" in charityProfileOpt) {
      return Err({
        NotFound: `Charity profile with id=${charityId} not found`,
      });
    }

    const charityProfile = charityProfileOpt.Some;

    // Check if the caller is the owner of the charity profile
    if (charityProfile.owner !== ic.caller()) {
      return Err({ Error: "Unauthorized" });
    }

    charityProfileStorage.remove(charityId);

    return Ok(null);
  }),

  // Campaign Functions
  // Create a Campaign with validation
  createCampaign: update(
    [CampaignPayload],
    Result(Campaign, Message),
    (payload) => {
      // Validate the payload
      if (!payload.title || !payload.description || !payload.targetAmount) {
        return Err({ InvalidPayload: "Missing required fields" });
      }

      // Assuming validation passes, proceed to create the campaign
      const campaignId = uuidv4();
      const campaign = {
        ...payload,
        id: campaignId,
        totalReceived: 0n,
        donors: [],
        status: { Pending: "Pending" },
        creator: ic.caller(),
        startedAt: new Date().toISOString(),
      };

      campaignStorage.insert(campaignId, campaign);
      return Ok(campaign); // Successfully return the created campaign
    }
  ),

  // Function to update a Campaign
  updateCampaign: update(
    [text, CampaignPayload],
    Result(Campaign, Message),
    (campaignId, payload) => {
      const campaignOpt = campaignStorage.get(campaignId);

      if ("None" in campaignOpt) {
        return Err({
          NotFound: `Campaign with id=${campaignId} not found`,
        });
      }

      const campaign = campaignOpt.Some;

      // Check if the caller is the creator of the campaign
      if (campaign.creator !== ic.caller()) {
        return Err({ Error: "Unauthorized" });
      }

      // Update the campaign
      const updatedCampaign = {
        ...campaign,
        ...payload,
      };
      campaignStorage.insert(campaignId, updatedCampaign);

      return Ok(updatedCampaign);
    }
  ),

  // Function to get a Campaign by ID
  getCampaign: query([text], Result(Campaign, Message), (campaignId) => {
    const campaignOpt = campaignStorage.get(campaignId);

    if ("None" in campaignOpt) {
      return Err({
        NotFound: `Campaign with id=${campaignId} not found`,
      });
    }

    return Ok(campaignOpt.Some);
  }),

  // Function to get all Campaigns with error handling
  getAllCampaigns: query([], Result(Vec(Campaign), Message), () => {
    const campaigns = campaignStorage.values();

    // Check if there are any campaigns
    if (campaigns.length === 0) {
      return Err({ NotFound: "No campaigns found" });
    }

    return Ok(campaigns);
  }),

  // Function to delete a Campaign
  deleteCampaign: update([text], Result(Null, Message), (campaignId) => {
    const campaignOpt = campaignStorage.get(campaignId);

    if ("None" in campaignOpt) {
      return Err({
        NotFound: `Campaign with id=${campaignId} not found`,
      });
    }

    const campaign = campaignOpt.Some;

    // Check if the caller is the creator of the campaign
    if (campaign.creator !== ic.caller()) {
      return Err({ Error: "Unauthorized" });
    }

    campaignStorage.remove(campaignId);

    return Ok(null);
  }),
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
