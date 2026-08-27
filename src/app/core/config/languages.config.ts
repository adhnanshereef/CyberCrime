export interface LanguageConfig {
  code: string;
  label: string;
  nativeLabel: string;
  navigation: {
    home: string;
    register: string;
    track: string;
    contact: string;
    language: string;
    womenChildren: string;
    financialFraud: string;
  };
  fontStack: string;
  direction: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    navigation: {
      home: 'Home', register: 'Register Complaint', track: 'Track Complaint', contact: 'Contact',
      language: 'Language', womenChildren: 'Women & Children Related', financialFraud: 'Financial Fraud',
    },
    fontStack: "'DM Serif Display', Georgia, serif",
    direction: 'ltr',
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    navigation: {
      home: 'होम', register: 'शिकायत दर्ज करें', track: 'शिकायत ट्रैक करें', contact: 'संपर्क',
      language: 'Language', womenChildren: 'महिला और बाल संबंधित', financialFraud: 'वित्तीय धोखाधड़ी',
    },
    fontStack: "'Noto Serif Devanagari', serif",
    direction: 'ltr',
  },
  {
    code: 'ml',
    label: 'Malayalam',
    nativeLabel: 'മലയാളം',
    navigation: {
      home: 'ഹോം', register: 'പരാതി രജിസ്റ്റർ ചെയ്യുക', track: 'പരാതി പിന്തുടരുക', contact: 'ബന്ധപ്പെടുക',
      language: 'Language', womenChildren: 'സ്ത്രീകളും കുട്ടികളുമായി ബന്ധപ്പെട്ടത്', financialFraud: 'സാമ്പത്തിക തട്ടിപ്പ്',
    },
    fontStack: "'Noto Serif Malayalam', serif",
    direction: 'ltr',
  },
];
