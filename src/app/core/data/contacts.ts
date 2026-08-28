export interface ContactInfo {
  state: string;
  nodalOfficer: {
    name: string;
    rank: string;
    email: string;
  };
  grievanceOfficer: {
    name: string;
    rank: string;
    contact: string;
    email: string;
  };
}

export const CONTACTS: ContactInfo[] = [
  { state: "ANDAMAN & NICOBAR", nodalOfficer: { name: "Sh. Jitendra Kumar Meena, IPS", rank: "SSP (CID)", email: "spcid.and@nic.in" }, grievanceOfficer: { name: "Smt. Sindhu Pillai A, IPS", rank: "DIGP(Intl.)", contact: "03192-232334", email: "igp.and@nic.in" } },
  { state: "ANDHRA PRADESH", nodalOfficer: { name: "Sh. Adhiraj Singh Rana", rank: "IPS., S.P Cyber Crimes, CID", email: "cybercrimes1930@cid.appolice.gov.in" }, grievanceOfficer: { name: "SP Cyber Crimes, CID", rank: "Superintendent of Police", contact: "0863-2340559", email: "cybercrimescid@ap.gov.in" } },
  { state: "ARUNACHAL PRADESH", nodalOfficer: { name: "Sh Shivendu Bhushan", rank: "IPS", email: "spsit@arunpol.nic.in" }, grievanceOfficer: { name: "Sh. Take Ringu, IPS", rank: "IGP (Crime)", contact: "9436040703", email: "takeringu@ips.gov.in" } },
  { state: "ASSAM", nodalOfficer: { name: "Sh. Saurav Jyoti Saikia", rank: "APS, SP Cyber Crime 2, CID", email: "sp-cidcyber2@assampolice.gov.in" }, grievanceOfficer: { name: "Sh. Debaraj Upadhaya, IPS", rank: "IGP,CID", contact: "0361-2521618", email: "igpcid@assampolice.gov.in" } },
  { state: "BIHAR", nodalOfficer: { name: "Shri. Sushil Kumar IPS", rank: "SP", email: "cybercell-bih@nic.in" }, grievanceOfficer: { name: "Shri. Rajesh Tripathi", rank: "SSP", contact: "0612-2238098", email: "cybercell-bih@nic.in" } },
  { state: "CHANDIGARH", nodalOfficer: { name: "Ms. Geetanjali", rank: "SP, Cyber Crime", email: "spops-chd@nic.in" }, grievanceOfficer: { name: "Sh. Raj Kumar Singh, IPS", rank: "IGP-UT", contact: "0172-2700056", email: "dig-chd@nic.in" } },
  { state: "CHHATTISGARH", nodalOfficer: { name: "Sh. Kavi Gupta", rank: "AIG", email: "aigtech-phq.cg@gov.in" }, grievanceOfficer: { name: "Shri Girija Shankar Jaiswal", rank: "DIG(Technical Services)", contact: "0771-2511989", email: "girijashankar.ips.@gov.in" } },
  { state: "DADRA & NAGAR HAVELI AND DAMAN & DIU", nodalOfficer: { name: "Sh. Ketan Bansal", rank: "IPS", email: "sp-dmn-dd@nic.in" }, grievanceOfficer: { name: "Sh. Vikramjit Singh, IPS", rank: "DIGP", contact: "0260-2220140", email: "digp-daman-dd@nic.in" } },
  { state: "DELHI", nodalOfficer: { name: "Sh. Vinit Kumar, IPS", rank: "DCP/IFSO", email: "dcpifso@delhipolice.gov.in" }, grievanceOfficer: { name: "Sh Sanjay Bhatia, IPS", rank: "Addl.Commissioner of Police", contact: "011-20892633", email: "Jtcpifso@delhipolice.gov.in" } },
  { state: "GOA", nodalOfficer: { name: "Shri Rajendra Raut Dessai", rank: "SP, Cyber Crime", email: "spcyber@goapolice.gov.in" }, grievanceOfficer: { name: "Sh. Paramaditya", rank: "DIGP", contact: "0832-2420883", email: "digpgoa@goapolice.gov.in" } },
  { state: "GUJARAT", nodalOfficer: { name: "Shri. Vivek Bheda", rank: "Superintendent of Police", email: "cc-cid@gujarat.gov.in" }, grievanceOfficer: { name: "Sh. S.G. Trivedi", rank: "IGP", contact: "079-23250798", email: "cc-cid@gujarat.gov.in" } },
  { state: "HARYANA", nodalOfficer: { name: "Sh. Sibash Kabiraj", rank: "IPS, ADGP Cyber Haryana", email: "spcybercrimephq.pol@hry.gov.in" }, grievanceOfficer: { name: "Sh. Mayank Gupta", rank: "SP", contact: "0172-2524058", email: "spcybercrimephq.pol@hry.gov.in" } },
  { state: "HIMACHAL PRADESH", nodalOfficer: { name: "IPS Mohit Chawla", rank: "DIG", email: "dig-cybercr-hp@nic.in" }, grievanceOfficer: { name: "Sh. D. K. Chaudhary", rank: "DIGP/Crime", contact: "0177-2620331", email: "adgp-cid-hp@nic.in" } },
  { state: "JAMMU & KASHMIR", nodalOfficer: { name: "Sh. Ramnesh Gupta", rank: "JEPS, SSP CICE J&K", email: "sspcicejk@jkpolice.gov.in" }, grievanceOfficer: { name: "Sh. RR Swan", rank: "DGP", contact: "0191-25822926", email: "adgpcidjk@jkpolice.gov.in" } },
  { state: "JHARKHAND", nodalOfficer: { name: "Sh. Ehtesham Waquarib", rank: "IPS, SP, CID", email: "sp-cid@jhpolice.gov.in" }, grievanceOfficer: { name: "S.P. Cyber Crime, CID", rank: "N/A", contact: "0651-2220060", email: "cyberps@jhpolice.gov.in" } },
  { state: "KARNATAKA", nodalOfficer: { name: "Sh. S Ravi", rank: "ADGP/Intl.", email: "spctrcid@ksp.gov.in" }, grievanceOfficer: { name: "Sri Shantanu Sinha, IPS", rank: "DIG, Cyber Crimes,Narcotic,CID", contact: "080-22942475", email: "spctrcid@ksp.gov.in" } },
  { state: "KERALA", nodalOfficer: { name: "Sh. Ankit Ashokan", rank: "IPS, SP Cyber Crime", email: "spcyberops.pol@kerala.gov.in" }, grievanceOfficer: { name: "Sh H Venkatesh, IPS", rank: "ADGP", contact: "0471-2300042", email: "adgpcyberops.pol@kerala.gov.in" } },
  { state: "LADAKH", nodalOfficer: { name: "Sh. Altaf Ahmad Shah", rank: "IPS, SSP", email: "sotoigp@police.ladakh.gov.in" }, grievanceOfficer: { name: "Sh. Deepak Digra- JKPS", rank: "SP (AIG CIV PHQ UT Ladakh)", contact: "9541902324", email: "aigcivl@police.ladakh.gov.in" } },
  { state: "LAKSHADWEEP", nodalOfficer: { name: "Sh. Utkarsha", rank: "IPS, SP Cyber Crime", email: "lak-sop@nic.in" }, grievanceOfficer: { name: "Sh.Hareshwar V Swami, IPS", rank: "SP (L&O)", contact: "04896262258", email: "lak-sop@nic.in" } },
  { state: "MADHYA PRADESH", nodalOfficer: { name: "Sh. Shiyas A", rank: "IG Cyber", email: "dig2cybercell@mppolice.gov.in" }, grievanceOfficer: { name: "Shri Shiyas A", rank: "DIG Cyber", contact: "N/A", email: "dig2cybercell@mppolice.gov.in" } },
  { state: "MAHARASHTRA", nodalOfficer: { name: "Sh. Sanjay Shintre", rank: "DIG Cyber Crime Maharashtra", email: "dig.cbr-mah@gov.in" }, grievanceOfficer: { name: "Sh. Sanjay Vilas Shintre", rank: "SP", contact: "022-22160080", email: "sp.cbr-mah@gov.in" } },
  { state: "MANIPUR", nodalOfficer: { name: "Shri N. John", rank: "Superintendent of Police", email: "spcybercrime.mn@manipur.gov.in" }, grievanceOfficer: { name: "Sh. Ningshem Worngam", rank: "DIGP (Int)", contact: "0385-2444888", email: "grievance.ncrp@gmail.com" } },
  { state: "MEGHALAYA", nodalOfficer: { name: "Shri Basant Kumar Mishra, MPS", rank: "DSP", email: "ccw-meg@gov.in" }, grievanceOfficer: { name: "Shri Dheeraj Yadav, IPS", rank: "SP (Cyber)", contact: "9402519391", email: "ccw-meg@gov.in" } },
  { state: "MIZORAM", nodalOfficer: { name: "Sh. Zonun Sanga", rank: "MPS", email: "cybercrime.sp@mizoram.gov.in" }, grievanceOfficer: { name: "Sh Devesh Chandra Srivastava, IPS", rank: "DGP", contact: "0389-2334682", email: "polmizo@rediffmail.com" } },
  { state: "NAGALAND", nodalOfficer: { name: "Sh. Vikram M Khalate", rank: "IPS, IGP CID", email: "spcyber-ngl@gov.in" }, grievanceOfficer: { name: "Sh. Sandeep M. Tamgadge, IPS", rank: "ADGP (L&O)", contact: "6009308003", email: "adgplo.ngl@gov.in" } },
  { state: "ODISHA", nodalOfficer: { name: "Shri. Shefeen Ahamed K, lPS", rank: "lGP, CID CB", email: "igp2cidcb@odishapolice.gov.in" }, grievanceOfficer: { name: "Sh. Arun Bothra, lPS", rank: "ADGP", contact: "0674-2913100", email: "adgcidcb.orpol@nic.in" } },
  { state: "PUDUCHERRY", nodalOfficer: { name: "Ms. Shruti Yaragatti", rank: "IPS SP Cyber Crime", email: "cybercellpolice.py@gov.in" }, grievanceOfficer: { name: "Sh. Dr. VJ Chandran", rank: "IGP", contact: "0413-2231313", email: "igp@py.gov.in" } },
  { state: "PUNJAB", nodalOfficer: { name: "Jashandeep Singh Gill", rank: "Superintendent of Police", email: "aigcc@punjabpolice.gov.in" }, grievanceOfficer: { name: "Sh. P. K. Sinha, IPS", rank: "ADGP, Cyber Crime", contact: "0172-2226258", email: "igp.cyber.c.police@punjabpolice.gov.in" } },
  { state: "RAJASTHAN", nodalOfficer: { name: "Shri Shantanu Kumar Singh", rank: "Superintendent of Police", email: "sp.cybercrime@rajpolice.gov.in" }, grievanceOfficer: { name: "Shri Sharat Kaviraj", rank: "Inspector General of Police", contact: "01412821741", email: "sp.cybercrime@rajpolice.gov.in" } },
  { state: "SIKKIM", nodalOfficer: { name: "Sh. Tenzing Loden Lepcha", rank: "IPS, DIGP CB-CID", email: "spcid@sikkimpolice.nic.in" }, grievanceOfficer: { name: "Sh. Abhishek Dahal", rank: "Police Inspector/CID", contact: "9046245066", email: "cybercrime666sk@gmail.com" } },
  { state: "TAMIL NADU", nodalOfficer: { name: "Ms. Shahnaz Illiyas", rank: "Superintendent of Police Cyber", email: "sp1-ccdtnpolice@gov.in" }, grievanceOfficer: { name: "Sh. D. Ashok Kumar", rank: "SP(for OTHER CYBER CRIMES)", contact: "044-29580300", email: "sp1-ccdtnpolice@gov.in" } },
  { state: "TELANGANA", nodalOfficer: { name: "Ms. B. Sai Sri", rank: "SP TGCSB", email: "spoperations-csbts@tspolice.gov.in" }, grievanceOfficer: { name: "Smt. Shikha Goel, IPS", rank: "Director, TSCSB", contact: "040-29320049", email: "directortscsb@tspolice.gov.in" } },
  { state: "TRIPURA", nodalOfficer: { name: "Sh. Nabadwip Jamatia", rank: "TPS", email: "spcybercrime@tripurapolice.nic.in" }, grievanceOfficer: { name: "Smt. Sudeshna Bhattacharyya, TPS", rank: "SP (SCRB)", contact: "0381-2376979", email: "spscrb@tripurapolice.nic.in" } },
  { state: "UTTARAKHAND", nodalOfficer: { name: "Sh. Nilesh Anand Bharne", rank: "IG Cyber Crime/STF", email: "nileshanad.bharne@ips.gov.in" }, grievanceOfficer: { name: "Sh. Ayush Agarwal", rank: "SSP/STF", contact: "0135-2655900", email: "spstf-uk@nic.in" } },
  { state: "UTTAR PRADESH", nodalOfficer: { name: "Sh. Rajesh Kumar", rank: "SP, Cyber Crime", email: "sp-cyber.lu@up.gov.in" }, grievanceOfficer: { name: "Binod Kumar Singh", rank: "ADG", contact: "0522-2390538", email: "adgcybercrime.lu@up.gov.in" } },
  { state: "WEST BENGAL", nodalOfficer: { name: "Sh. Suresh Kumar Chadive", rank: "IPS, DIG Cyber Crime", email: "dig1ccw@policewb.gov.in" }, grievanceOfficer: { name: "Shri Sanjay Singh, IPS", rank: "DG & IGP, Cyber Crime Wing", contact: "033 22021200", email: "ncrp-ccw@policewb.gov.in" } }
];
