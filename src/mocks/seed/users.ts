export type Department =
  | "Leadership"
  | "Sales"
  | "Customer Success"
  | "Product"
  | "Engineering"
  | "Marketing"
  | "Operations"
  | "Finance";

export const DEPARTMENTS: Department[] = [
  "Leadership",
  "Sales",
  "Customer Success",
  "Product",
  "Engineering",
  "Marketing",
  "Operations",
  "Finance",
];

export type Role =
  | "CEO"
  | "COO"
  | "VP"
  | "Director"
  | "Manager"
  | "Senior IC"
  | "IC";

export type User = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
  title: string;
  department: Department;
  is2FA: boolean;
};

const u = (
  id: string,
  name: string,
  email: string,
  role: Role,
  title: string,
  department: Department,
  is2FA = true
): User => ({
  id,
  name,
  initials: name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  email,
  role,
  title,
  department,
  is2FA,
});

/** 16 named users — covers every department + the demo's hero meetings. */
export const USERS: User[] = [
  // Leadership
  u("u-stefan",  "Stefan Trifan",  "stefan@northwind.com",  "COO",      "Chief Operating Officer", "Leadership"),
  u("u-priya",   "Priya Iyer",     "priya@northwind.com",   "CEO",      "Chief Executive Officer", "Leadership"),
  u("u-marcus",  "Marcus Doyle",   "marcus@northwind.com",  "VP",       "Chief Financial Officer", "Finance"),
  // Product
  u("u-amelia",  "Amelia Park",    "amelia@northwind.com",  "VP",       "VP, Product",             "Product"),
  u("u-jonas",   "Jonas Müller",   "jonas@northwind.com",   "Director", "Director, Product Mgmt",  "Product"),
  // Engineering
  u("u-ravi",    "Ravi Patel",     "ravi@northwind.com",    "VP",       "VP, Engineering",         "Engineering"),
  u("u-talia",   "Talia Brooks",   "talia@northwind.com",   "Director", "Director, Platform Eng",  "Engineering"),
  // Sales
  u("u-derek",   "Derek Owens",    "derek@northwind.com",   "VP",       "VP, Sales",               "Sales"),
  u("u-soraya",  "Soraya Khan",    "soraya@northwind.com",  "Director", "Enterprise Sales Lead",   "Sales"),
  // Customer Success
  u("u-maya",    "Maya Cole",      "maya@northwind.com",    "VP",       "VP, Customer Success",    "Customer Success"),
  u("u-devon",   "Devon Reyes",    "devon@northwind.com",   "Manager",  "Mgr, CS Operations",      "Customer Success"),
  // Marketing
  u("u-elena",   "Elena Bauer",    "elena@northwind.com",   "Director", "Director, Marketing",     "Marketing"),
  // Operations
  u("u-tariq",   "Tariq Williams", "tariq@northwind.com",   "Director", "Director, RevOps",        "Operations"),
  u("u-grace",   "Grace Park",     "grace@northwind.com",   "Manager",  "Mgr, Program Office",     "Operations", false),
  // Finance
  u("u-liam",    "Liam Cole",      "liam@northwind.com",    "Manager",  "FP&A Lead",               "Finance"),
  // The viewer / "you"
  u("u-adnan",   "Adnan Bashir",   "adnan@codeupscale.com", "VP",       "Chief of Staff",          "Leadership"),
];

export const HERO_USER = USERS.find((u) => u.id === "u-stefan")!;

export function userById(id: string) {
  return USERS.find((u) => u.id === id);
}

export const TENANT = {
  name: "Northwind Inc.",
  short: "NX",
  tier: "Enterprise",
  totalUsers: 100,
  totalDepartments: 8,
  totalMeetings: 1000,
  totalActions: 2000,
  totalDecisions: 600,
  totalRisks: 300,
  weeksOfHistory: 12,
};
