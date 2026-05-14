// Mock data for A2P 10DLC Provisioning Admin
// All identifiers and stats reflect the SPIKE: 285 existing customers + new onboarding.

const STATUSES = {
  NotStarted:        { label: "Not started",       tone: "neutral", group: "pending"  },
  BrandPending:      { label: "Brand pending",     tone: "info",    group: "pending"  },
  BrandApproved:     { label: "Brand approved",    tone: "info",    group: "pending"  },
  BrandRejected:     { label: "Brand rejected",    tone: "error",   group: "failed"   },
  CampaignPending:   { label: "Campaign pending",  tone: "info",    group: "pending"  },
  CampaignApproved:  { label: "Campaign approved", tone: "info",    group: "pending"  },
  CampaignRejected:  { label: "Campaign rejected", tone: "error",   group: "failed"   },
  Active:            { label: "Active",            tone: "success", group: "active"   },
  Suspended:         { label: "Suspended",         tone: "warning", group: "failed"   },
  Failed:            { label: "Failed",            tone: "error",   group: "failed"   },
};

const USE_CASES = ["CUSTOMER_CARE", "ACCOUNT_NOTIFICATION", "PUBLIC_SERVICE_ANNOUNCEMENT", "LOW_VOLUME_MIXED"];

// Hand-built sample of customers across all states. 24 rows is enough to feel
// like a real CRM without making the demo data file huge — we extrapolate the
// "285 customers" headline from this list.
const CUSTOMERS = [
  // Active (fully provisioned)
  { id: "CUS-00042", name: "Northwind Logistics",        ein: "47-2918374", state: "TX", areaCode: "512", number: "+1 (512) 555-0118", brand: "BN2918a4b5c6d7e8f9a0b1c2d3e4f5a6b7", campaign: "CN9384c0d1e2f3a4b5c6d7e8f9a0b1c2d3", status: "Active",          provisionedOn: "2026-04-18", employees: 1280, monthlyMessages: 3214, owner: "B. Carlton" },
  { id: "CUS-00118", name: "Atlas Manufacturing Co.",    ein: "82-4471823", state: "OH", areaCode: "614", number: "+1 (614) 555-0294", brand: "BN1234ab5c6d7e8f9a0b1c2d3e4f5a6b8", campaign: "CN7765c0d1e2f3a4b5c6d7e8f9a0b1c2e4", status: "Active",          provisionedOn: "2026-03-29", employees: 624,  monthlyMessages: 1547, owner: "B. Carlton" },
  { id: "CUS-00203", name: "Sundial Foods",              ein: "91-8273645", state: "CA", areaCode: "415", number: "+1 (415) 555-0732", brand: "BN5678ab9c0d1e2f3a4b5c6d7e8f9a0b1", campaign: "CN4421c0d1e2f3a4b5c6d7e8f9a0b1c2f5", status: "Active",          provisionedOn: "2026-03-12", employees: 4810, monthlyMessages: 9821, owner: "D. Ahmed"  },
  { id: "CUS-00216", name: "Verdant Health Partners",    ein: "53-9182734", state: "MA", areaCode: "617", number: "+1 (617) 555-0184", brand: "BN91823abcdef0123456789abcdef0123", campaign: "CN1182c0d1e2f3a4b5c6d7e8f9a0b1c2a6", status: "Active",          provisionedOn: "2026-02-04", employees: 12400,monthlyMessages: 18203,owner: "D. Ahmed"  },
  { id: "CUS-00284", name: "Coastline Insurance Group",  ein: "21-4736192", state: "FL", areaCode: "904", number: "+1 (904) 555-0921", brand: "BN44a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9", campaign: "CN552ac0d1e2f3a4b5c6d7e8f9a0b1c2b7", status: "Active",          provisionedOn: "2026-01-22", employees: 920,  monthlyMessages: 2104, owner: "J. Martin" },
  { id: "CUS-00301", name: "Polaris Energy",             ein: "68-1928374", state: "CO", areaCode: "720", number: "+1 (720) 555-0451", brand: "BN77a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2", campaign: "CN333ac0d1e2f3a4b5c6d7e8f9a0b1c2c8", status: "Active",          provisionedOn: "2026-01-09", employees: 2150, monthlyMessages: 4502, owner: "J. Martin" },

  // Brand pending
  { id: "CUS-00412", name: "Greenleaf Public Schools",   ein: "30-7172921", state: "MN", areaCode: "612", number: null,                brand: "BN03cd4ef5a6b7c8d9e0f1a2b3c4d5e6f7a", campaign: null,                                  status: "BrandPending",    submittedOn:   "2026-05-12", employees: 3200, monthlyMessages: 0,    owner: "B. Carlton", eta: "1–5 business days" },
  { id: "CUS-00417", name: "Harbor Maritime Services",   ein: "55-8273645", state: "WA", areaCode: "206", number: null,                brand: "BN18de4ef5a6b7c8d9e0f1a2b3c4d5e6f9b", campaign: null,                                  status: "BrandPending",    submittedOn:   "2026-05-11", employees: 480,  monthlyMessages: 0,    owner: "J. Martin", eta: "1–5 business days" },
  { id: "CUS-00421", name: "Lone Star Outpatient",       ein: "76-2849173", state: "TX", areaCode: "210", number: null,                brand: "BN29de4ef5a6b7c8d9e0f1a2b3c4d5e6fa0", campaign: null,                                  status: "BrandPending",    submittedOn:   "2026-05-10", employees: 1900, monthlyMessages: 0,    owner: "D. Ahmed",  eta: "1–5 business days" },

  // Campaign pending
  { id: "CUS-00388", name: "Ridgeway Construction",      ein: "14-9183746", state: "PA", areaCode: "412", number: null,                brand: "BN64ef4ab5c6d7e8f9a0b1c2d3e4f5a6b9c", campaign: "CN02ef4ab5c6d7e8f9a0b1c2d3e4f5a6c0d", status: "CampaignPending", submittedOn:   "2026-05-09", employees: 870,  monthlyMessages: 0,    owner: "D. Ahmed",  eta: "1–3 business days" },
  { id: "CUS-00392", name: "Whitestone Property Mgmt",   ein: "82-7283641", state: "NY", areaCode: "212", number: null,                brand: "BN74ef4ab5c6d7e8f9a0b1c2d3e4f5a6b9d", campaign: "CN12ef4ab5c6d7e8f9a0b1c2d3e4f5a6c1e", status: "CampaignPending", submittedOn:   "2026-05-08", employees: 340,  monthlyMessages: 0,    owner: "J. Martin", eta: "1–3 business days" },

  // Failed / needs attention
  { id: "CUS-00355", name: "Cedar & Co. Consulting",     ein: "31-2837465", state: "OR", areaCode: "503", number: null,                brand: "BN91ab4cd5e6f7a8b9c0d1e2f3a4b5c6d7e", campaign: null,                                  status: "BrandRejected",   rejectedOn:    "2026-05-07", employees: 96,   monthlyMessages: 0,    owner: "B. Carlton", reason: "EIN does not match IRS records. Verify TaxId on Customer profile and resubmit." },
  { id: "CUS-00362", name: "Birchwood Realty",           ein: "62-1928374", state: "IL", areaCode: "312", number: null,                brand: "BN13ab4cd5e6f7a8b9c0d1e2f3a4b5c6d7f", campaign: "CN33ab4cd5e6f7a8b9c0d1e2f3a4b5c6e80", status: "CampaignRejected",rejectedOn:    "2026-05-06", employees: 220,  monthlyMessages: 0,    owner: "D. Ahmed",   reason: "Sample messages contain disallowed content (loan offer). Update copy and resubmit campaign." },
  { id: "CUS-00370", name: "Beacon Hill Diagnostics",    ein: "75-3829174", state: "MA", areaCode: "508", number: null,                brand: null,                                       campaign: null,                                  status: "Failed",          failedOn:      "2026-05-05", employees: 540,  monthlyMessages: 0,    owner: "J. Martin",  reason: "TaxId field is empty on Customer record. Cannot register Brand without EIN." },

  // Not started (legacy customers on shared number)
  { id: "CUS-00071", name: "Hillcrest Academy District", ein: "44-3829174", state: "GA", areaCode: null,  number: "+1 (949) 555-0100 (shared)", brand: null, campaign: null,                                  status: "NotStarted",      employees: 720,  monthlyMessages: 1840, owner: "B. Carlton", note: "Legacy — on shared number" },
  { id: "CUS-00094", name: "Riverbend Senior Living",    ein: "27-9182374", state: "WI", areaCode: null,  number: "+1 (949) 555-0100 (shared)", brand: null, campaign: null,                                  status: "NotStarted",      employees: 410,  monthlyMessages: 920,  owner: "B. Carlton", note: "Legacy — on shared number" },
  { id: "CUS-00105", name: "Magnolia School District",   ein: "59-4827361", state: "AL", areaCode: null,  number: "+1 (949) 555-0100 (shared)", brand: null, campaign: null,                                  status: "NotStarted",      employees: 1860, monthlyMessages: 3220, owner: "D. Ahmed",   note: "Legacy — on shared number" },
  { id: "CUS-00134", name: "Westfield Retail Partners",  ein: "83-1827364", state: "NJ", areaCode: null,  number: "+1 (949) 555-0100 (shared)", brand: null, campaign: null,                                  status: "NotStarted",      employees: 290,  monthlyMessages: 410,  owner: "J. Martin",  note: "Legacy — on shared number" },
  { id: "CUS-00148", name: "Cascade Public Utilities",   ein: "71-2837461", state: "OR", areaCode: null,  number: "+1 (949) 555-0100 (shared)", brand: null, campaign: null,                                  status: "NotStarted",      employees: 1140, monthlyMessages: 2740, owner: "B. Carlton", note: "Legacy — on shared number" },

  // Recently approved (active, but new)
  { id: "CUS-00451", name: "Summit Pediatrics Network",  ein: "12-4827361", state: "UT", areaCode: "801", number: "+1 (801) 555-0227", brand: "BN82ab4cd5e6f7a8b9c0d1e2f3a4b5c6d8a", campaign: "CN12ab4cd5e6f7a8b9c0d1e2f3a4b5c6d9b", status: "Active",          provisionedOn: "2026-05-04", employees: 380,  monthlyMessages: 612,  owner: "D. Ahmed"  },
  { id: "CUS-00458", name: "Plainfield County HR",       ein: "29-3827461", state: "IN", areaCode: "317", number: "+1 (317) 555-0844", brand: "BN92ab4cd5e6f7a8b9c0d1e2f3a4b5c6d8b", campaign: "CN22ab4cd5e6f7a8b9c0d1e2f3a4b5c6d9c", status: "Active",          provisionedOn: "2026-04-30", employees: 1500, monthlyMessages: 2940, owner: "J. Martin" },
  { id: "CUS-00463", name: "Tidewater Logistics Group",  ein: "38-9283746", state: "VA", areaCode: "757", number: "+1 (757) 555-0163", brand: "BN02bc4cd5e6f7a8b9c0d1e2f3a4b5c6d8c", campaign: "CN32bc4cd5e6f7a8b9c0d1e2f3a4b5c6d9d", status: "Active",          provisionedOn: "2026-04-25", employees: 700,  monthlyMessages: 1320, owner: "B. Carlton" },

  // Suspended (carrier-level)
  { id: "CUS-00229", name: "Pinecrest Staffing",         ein: "67-1827364", state: "NC", areaCode: "704", number: "+1 (704) 555-0671", brand: "BN12bc4cd5e6f7a8b9c0d1e2f3a4b5c6d8d", campaign: "CN42bc4cd5e6f7a8b9c0d1e2f3a4b5c6d9e", status: "Suspended",       provisionedOn: "2025-12-04", employees: 410,  monthlyMessages: 0,    owner: "D. Ahmed",   reason: "Carrier suspended for opt-out compliance review. No new messages will be delivered until lifted." },
];

// Aggregate counters for dashboards — used to fake the "285 customers" total
// without modeling all 285 individually.
const FLEET = {
  total: 285,
  active: 168,         // fully provisioned new customers
  pending: 24,         // in flight
  failed: 11,          // need attention
  legacy: 82,          // still on shared number, awaiting migration
  monthlyMessagesM: 0.94, // 940k messages/month aggregate
};

// Sample available phone numbers from a Twilio number search.
const AVAILABLE_NUMBERS = [
  { number: "+1 (612) 555-0212", city: "Minneapolis", region: "MN", sms: true, mms: true, voice: true,  monthly: "$1.15" },
  { number: "+1 (612) 555-0418", city: "Minneapolis", region: "MN", sms: true, mms: true, voice: true,  monthly: "$1.15" },
  { number: "+1 (612) 555-0773", city: "St. Paul",    region: "MN", sms: true, mms: true, voice: false, monthly: "$1.15" },
  { number: "+1 (612) 555-0866", city: "Minneapolis", region: "MN", sms: true, mms: true, voice: true,  monthly: "$1.15" },
  { number: "+1 (612) 555-0941", city: "Bloomington", region: "MN", sms: true, mms: false,voice: true,  monthly: "$1.15" },
];

// Recent activity feed used in Overview.
const ACTIVITY = [
  { at: "Today · 2 min ago",    who: "system",       what: "TCR approved Campaign for", target: "Tidewater Logistics Group",  tone: "success" },
  { at: "Today · 18 min ago",   who: "B. Carlton",   what: "Resubmitted Brand for",     target: "Cedar & Co. Consulting",     tone: "info"    },
  { at: "Today · 47 min ago",   who: "system",       what: "Purchased +1 (801) 555-0227 for", target: "Summit Pediatrics Network", tone: "info" },
  { at: "Today · 1 hr ago",     who: "system",       what: "TCR rejected Campaign for", target: "Birchwood Realty",           tone: "error"   },
  { at: "Yesterday · 4:22 PM",  who: "D. Ahmed",     what: "Started migration batch (10 customers, dry-run)", target: null, tone: "info" },
  { at: "Yesterday · 11:08 AM", who: "system",       what: "TCR approved Brand for",    target: "Plainfield County HR",       tone: "success" },
  { at: "Yesterday · 9:14 AM",  who: "J. Martin",    what: "Enabled texting on",        target: "Harbor Maritime Services",   tone: "info"    },
  { at: "May 12 · 3:46 PM",     who: "system",       what: "Brand registration submitted for", target: "Lone Star Outpatient", tone: "info" },
];

// Timeline events for a specific customer detail (used on Active example).
const SAMPLE_TIMELINE = [
  { at: "Apr 18, 2026 · 11:42 AM", event: "Number associated with campaign", detail: "+1 (512) 555-0118 → Campaign CN9384…",                 tone: "success" },
  { at: "Apr 18, 2026 · 11:41 AM", event: "Number added to messaging service", detail: "Messaging Service MG7710…",                          tone: "info"    },
  { at: "Apr 18, 2026 · 11:40 AM", event: "Phone number purchased",          detail: "+1 (512) 555-0118 — Austin, TX · $1.15/mo",            tone: "info"    },
  { at: "Apr 16, 2026 · 8:02 AM",  event: "TCR approved campaign",           detail: "Use case CUSTOMER_CARE · throughput 4,500 msg/day",    tone: "success" },
  { at: "Apr 15, 2026 · 4:18 PM",  event: "Campaign submitted to TCR",       detail: "3 sample messages, opt-in/opt-out language attached",   tone: "info"    },
  { at: "Apr 14, 2026 · 9:30 AM",  event: "TCR approved brand",              detail: "Standard Brand verification · score 78/100",            tone: "success" },
  { at: "Apr 12, 2026 · 2:15 PM",  event: "Brand submitted to TCR",          detail: "TrustProduct RN2891… · EndUser SID EU1827…",            tone: "info"    },
  { at: "Apr 12, 2026 · 2:14 PM",  event: "Texting enabled by ops",          detail: "B. Carlton enabled A2P provisioning in OpsAdmin",       tone: "neutral" },
];

// Migration batches for the Bulk Migration page.
const MIGRATION_BATCHES = [
  { id: "MIG-014", started: "Today · 9:02 AM",   mode: "Live",   size: 20, status: "running",  done: 14, ok: 12, fail: 1, skip: 1,  by: "D. Ahmed" },
  { id: "MIG-013", started: "Yesterday · 4:22 PM", mode: "Dry run", size: 10, status: "completed", done: 10, ok: 10, fail: 0, skip: 0,  by: "D. Ahmed" },
  { id: "MIG-012", started: "May 12 · 2:10 PM",  mode: "Live",   size: 20, status: "completed", done: 20, ok: 18, fail: 2, skip: 0,  by: "B. Carlton" },
  { id: "MIG-011", started: "May 11 · 3:48 PM",  mode: "Live",   size: 20, status: "completed", done: 20, ok: 19, fail: 0, skip: 1,  by: "B. Carlton" },
  { id: "MIG-010", started: "May 10 · 10:15 AM", mode: "Live",   size: 20, status: "completed", done: 20, ok: 17, fail: 3, skip: 0,  by: "D. Ahmed" },
];

Object.assign(window, { STATUSES, USE_CASES, CUSTOMERS, FLEET, AVAILABLE_NUMBERS, ACTIVITY, SAMPLE_TIMELINE, MIGRATION_BATCHES });
