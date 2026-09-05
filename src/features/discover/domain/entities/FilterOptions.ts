export const SRI_LANKA = 'Sri Lanka';

export const COUNTRIES: string[] = [
  'Sri Lanka',
  'Australia',
  'Bahrain',
  'Bangladesh',
  'Canada',
  'China',
  'Denmark',
  'France',
  'Germany',
  'India',
  'Indonesia',
  'Ireland',
  'Italy',
  'Japan',
  'Kuwait',
  'Malaysia',
  'Maldives',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Oman',
  'Pakistan',
  'Philippines',
  'Qatar',
  'Saudi Arabia',
  'Singapore',
  'South Africa',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'Thailand',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Other',
];

export const SRI_LANKA_DISTRICT_CITIES: Record<string, string[]> = {
  Colombo: ['Colombo', 'Dehiwala', 'Moratuwa', 'Sri Jayawardenepura Kotte', 'Kolonnawa', 'Kesbewa'],
  Gampaha: ['Negombo', 'Gampaha', 'Ja-Ela', 'Wattala', 'Kelaniya', 'Minuwangoda'],
  Kalutara: ['Kalutara', 'Panadura', 'Horana', 'Beruwala', 'Matugama'],
  Kandy: ['Kandy', 'Peradeniya', 'Katugastota', 'Gampola', 'Nawalapitiya'],
  Matale: ['Matale', 'Dambulla', 'Galewela'],
  'Nuwara Eliya': ['Nuwara Eliya', 'Hatton', 'Talawakele'],
  Galle: ['Galle', 'Hikkaduwa', 'Ambalangoda', 'Baddegama'],
  Matara: ['Matara', 'Weligama', 'Akuressa'],
  Hambantota: ['Hambantota', 'Tangalle', 'Tissamaharama'],
  Jaffna: ['Jaffna', 'Chavakachcheri', 'Point Pedro'],
  Kilinochchi: ['Kilinochchi'],
  Mannar: ['Mannar'],
  Vavuniya: ['Vavuniya'],
  Mullaitivu: ['Mullaitivu'],
  Batticaloa: ['Batticaloa', 'Kattankudy', 'Eravur'],
  Ampara: ['Ampara', 'Kalmunai', 'Sammanthurai'],
  Trincomalee: ['Trincomalee', 'Kinniya', 'Kantale'],
  Kurunegala: ['Kurunegala', 'Kuliyapitiya', 'Narammala'],
  Puttalam: ['Puttalam', 'Chilaw', 'Wennappuwa'],
  Anuradhapura: ['Anuradhapura', 'Kekirawa', 'Medawachchiya'],
  Polonnaruwa: ['Polonnaruwa', 'Hingurakgoda'],
  Badulla: ['Badulla', 'Bandarawela', 'Haputale'],
  Monaragala: ['Monaragala', 'Wellawaya'],
  Ratnapura: ['Ratnapura', 'Embilipitiya', 'Balangoda'],
  Kegalle: ['Kegalle', 'Mawanella', 'Warakapola'],
};

export const SRI_LANKA_DISTRICTS: string[] = Object.keys(SRI_LANKA_DISTRICT_CITIES);

export const RELIGIONS: string[] = ['Buddhist', 'Hindu', 'Islam', 'Christian', 'Catholic', 'Other'];

export const RACES: string[] = ['Sinhalese', 'Tamil', 'Muslim', 'Moor', 'Burgher', 'Malay', 'Other'];

export const CASTES: string[] = [
  'Govigama',
  'Karava',
  'Salagama',
  'Durava',
  'Vellalar',
  'Radala',
  'Bathgama',
  'Berava',
  'Hena',
  'Kumbal',
  'Nekathi',
  'Navandanna',
  'Padu',
  'Rada',
  'Vahumpura',
  'Wahumpura',
  'Deva',
  'Chandar',
  'Nalavar',
  'Other',
];

export const JOB_TITLES: string[] = [
  // IT
  'Software Engineer',
  'System Analyst',
  'DevOps Engineer',
  'UI/UX Designer',
  'IT Manager',
  'Data Scientist',
  // Healthcare
  'Doctor',
  'Nurse',
  'Pharmacist',
  'Dentist',
  // Education
  'Teacher',
  'Lecturer',
  'Professor',
  'Principal',
  // Engineering
  'Civil Engineer',
  'Mechanical Engineer',
  'Electrical Engineer',
  // Finance
  'Accountant',
  'Auditor',
  'Banker',
  'Financial Analyst',
  // Legal
  'Lawyer',
  'Legal Advisor',
  // Hospitality
  'Chef',
  'Hotel Manager',
  // Creative
  'Graphic Designer',
  'Photographer',
  'Musician',
  // Agriculture
  'Farmer',
  'Agricultural Officer',
  // Science
  'Researcher',
  'Lab Technician',
  // Other
  'Business Owner',
  'Entrepreneur',
  'Other',
];

export type SortOption = 'newest' | 'oldest';

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
];

export const MIN_AGE = 18;
export const MAX_AGE = 65;
