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
const Donor = Record({
  id: text,
  owner: Principal,
  name: text,
  phoneNumber: text,
  email: text,
  Address: text,
  donationAmount: nat64,
  donations: Vec(text),
  donationsCount: nat64,
  status: text,
  joinedAt: Duration,

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
  registeredAt: Duration            
});
