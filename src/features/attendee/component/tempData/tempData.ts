// Define the interface for the data structure
export interface Attendee {
    attendeeID: number;
    firstName: string;
    lastName: string;
    Designation: string;
    Company: string;
    Email: string;
    mobile: string;
    Status: string;
  }
  
  // Sample array of attendees with 50 entries
  export const attendees: Attendee[] = [
    { attendeeID: 4162, firstName: "Joel", lastName: "Indwin", Designation: "Human Resources", Company: "Anubavam", Email: "indwinjoel@gmail.com", mobile: "9987532813", Status: "Pending" },
    { attendeeID: 4163, firstName: "Alice", lastName: "Smith", Designation: "Software Engineer", Company: "TechCorp", Email: "alice.smith@techcorp.com", mobile: "9876543210", Status: "Confirmed" },
    { attendeeID: 4164, firstName: "Bob", lastName: "Johnson", Designation: "Product Manager", Company: "InnovateX", Email: "bob.johnson@innovatex.com", mobile: "9876543211", Status: "Confirmed" },
    { attendeeID: 4165, firstName: "Catherine", lastName: "Wong", Designation: "Marketing Lead", Company: "GlobalTech", Email: "catherine.wong@globaltech.com", mobile: "9876543212", Status: "Pending" },
    { attendeeID: 4166, firstName: "David", lastName: "Miller", Designation: "HR Specialist", Company: "HR Solutions", Email: "david.miller@hrsolutions.com", mobile: "9876543213", Status: "Confirmed" },
    { attendeeID: 4167, firstName: "Eva", lastName: "Taylor", Designation: "Sales Executive", Company: "SalesPro", Email: "eva.taylor@salespro.com", mobile: "9876543214", Status: "Pending" },
    { attendeeID: 4168, firstName: "Frank", lastName: "Davis", Designation: "Senior Developer", Company: "TechCorp", Email: "frank.davis@techcorp.com", mobile: "9876543215", Status: "Confirmed" },
    { attendeeID: 4169, firstName: "Grace", lastName: "Wilson", Designation: "Data Analyst", Company: "DataVision", Email: "grace.wilson@datavision.com", mobile: "9876543216", Status: "Pending" },
    { attendeeID: 4170, firstName: "Henry", lastName: "Moore", Designation: "UI/UX Designer", Company: "DesignFlow", Email: "henry.moore@designflow.com", mobile: "9876543217", Status: "Confirmed" },
    { attendeeID: 4171, firstName: "Ivy", lastName: "White", Designation: "Project Coordinator", Company: "SyncGlobal", Email: "ivy.white@syncglobal.com", mobile: "9876543218", Status: "Pending" },
    { attendeeID: 4172, firstName: "Jack", lastName: "Harris", Designation: "Business Analyst", Company: "InnovateX", Email: "jack.harris@innovatex.com", mobile: "9876543219", Status: "Confirmed" },
    { attendeeID: 4173, firstName: "Kathy", lastName: "Martin", Designation: "Content Writer", Company: "WriteIt", Email: "kathy.martin@writeit.com", mobile: "9876543220", Status: "Pending" },
    { attendeeID: 4174, firstName: "Leo", lastName: "Lee", Designation: "SEO Specialist", Company: "SEOPro", Email: "leo.lee@seopro.com", mobile: "9876543221", Status: "Confirmed" },
    { attendeeID: 4175, firstName: "Mona", lastName: "Roberts", Designation: "Marketing Manager", Company: "AdWorld", Email: "mona.roberts@adworld.com", mobile: "9876543222", Status: "Pending" },
    { attendeeID: 4176, firstName: "Nina", lastName: "Clark", Designation: "Graphic Designer", Company: "CreativeLabs", Email: "nina.clark@creativelabs.com", mobile: "9876543223", Status: "Confirmed" },
    { attendeeID: 4177, firstName: "Oscar", lastName: "Walker", Designation: "Operations Head", Company: "OpEx Solutions", Email: "oscar.walker@opexsolutions.com", mobile: "9876543224", Status: "Pending" },
    { attendeeID: 4178, firstName: "Paul", lastName: "Young", Designation: "Senior Developer", Company: "TechVision", Email: "paul.young@techvision.com", mobile: "9876543225", Status: "Confirmed" },
    { attendeeID: 4179, firstName: "Quinn", lastName: "King", Designation: "Software Architect", Company: "TechLab", Email: "quinn.king@techlab.com", mobile: "9876543226", Status: "Pending" },
    { attendeeID: 4180, firstName: "Rita", lastName: "Scott", Designation: "Sales Manager", Company: "SalesPro", Email: "rita.scott@salespro.com", mobile: "9876543227", Status: "Confirmed" },
    { attendeeID: 4181, firstName: "Sam", lastName: "Green", Designation: "HR Manager", Company: "GlobalHR", Email: "sam.green@globalhr.com", mobile: "9876543228", Status: "Pending" },
    { attendeeID: 4182, firstName: "Tina", lastName: "Adams", Designation: "Lead Developer", Company: "DevTeam", Email: "tina.adams@devteam.com", mobile: "9876543229", Status: "Confirmed" },
    { attendeeID: 4183, firstName: "Ursula", lastName: "Nelson", Designation: "Business Development", Company: "BizDev Inc", Email: "ursula.nelson@bizdev.com", mobile: "9876543230", Status: "Pending" },
    { attendeeID: 4184, firstName: "Victor", lastName: "Parker", Designation: "System Administrator", Company: "NetWorks", Email: "victor.parker@networks.com", mobile: "9876543231", Status: "Confirmed" },
    { attendeeID: 4185, firstName: "Wendy", lastName: "Collins", Designation: "Product Designer", Company: "ProductX", Email: "wendy.collins@productx.com", mobile: "9876543232", Status: "Pending" },
    { attendeeID: 4186, firstName: "Xander", lastName: "Richards", Designation: "Lead Developer", Company: "WebWorks", Email: "xander.richards@webworks.com", mobile: "9876543233", Status: "Confirmed" },
    { attendeeID: 4187, firstName: "Yara", lastName: "Hughes", Designation: "Business Analyst", Company: "SmartTech", Email: "yara.hughes@smarttech.com", mobile: "9876543234", Status: "Pending" },
    { attendeeID: 4188, firstName: "Zach", lastName: "King", Designation: "QA Tester", Company: "QualityTech", Email: "zach.king@qualitytech.com", mobile: "9876543235", Status: "Confirmed" },
    { attendeeID: 4189, firstName: "Anna", lastName: "Lopez", Designation: "Marketing Coordinator", Company: "PromoTech", Email: "anna.lopez@promotech.com", mobile: "9876543236", Status: "Pending" },
    { attendeeID: 4190, firstName: "Bryan", lastName: "Martinez", Designation: "Project Manager", Company: "TechMinds", Email: "bryan.martinez@techminds.com", mobile: "9876543237", Status: "Confirmed" },
    { attendeeID: 4191, firstName: "Carla", lastName: "Gonzalez", Designation: "Data Scientist", Company: "DataCraft", Email: "carla.gonzalez@datacraft.com", mobile: "9876543238", Status: "Pending" },
    { attendeeID: 4192, firstName: "Daniel", lastName: "Lee", Designation: "Web Developer", Company: "DevGroup", Email: "daniel.lee@devgroup.com", mobile: "9876543239", Status: "Confirmed" },
    { attendeeID: 4193, firstName: "Ellen", lastName: "Taylor", Designation: "Content Specialist", Company: "MediaCo", Email: "ellen.taylor@mediaco.com", mobile: "9876543240", Status: "Pending" },
    { attendeeID: 4194, firstName: "Franklin", lastName: "Graham", Designation: "Cloud Engineer", Company: "CloudWorks", Email: "franklin.graham@cloudworks.com", mobile: "9876543241", Status: "Confirmed" },
    { attendeeID: 4195, firstName: "Gina", lastName: "Morris", Designation: "Security Specialist", Company: "SafeNet", Email: "gina.morris@safenet.com", mobile: "9876543242", Status: "Pending" },
    { attendeeID: 4196, firstName: "Howard", lastName: "Wilson", Designation: "Network Engineer", Company: "NetPlus", Email: "howard.wilson@netplus.com", mobile: "9876543243", Status: "Confirmed" },
    { attendeeID: 4197, firstName: "Isabel", lastName: "Hernandez", Designation: "Customer Support", Company: "HelpdeskPro", Email: "isabel.hernandez@helpdeskpro.com", mobile: "9876543244", Status: "Pending" },
    { attendeeID: 4198, firstName: "James", lastName: "Thomas", Designation: "Finance Analyst", Company: "FinTech", Email: "james.thomas@fintech.com", mobile: "9876543245", Status: "Confirmed" },
    { attendeeID: 4199, firstName: "Kim", lastName: "Lopez", Designation: "Business Development", Company: "TechGrow", Email: "kim.lopez@techgrow.com", mobile: "9876543246", Status: "Pending" },
    { attendeeID: 4200, firstName: "Liam", lastName: "Baker", Designation: "Software Developer", Company: "CodeLabs", Email: "liam.baker@codelabs.com", mobile: "9876543247", Status: "Confirmed" }
  ];
  