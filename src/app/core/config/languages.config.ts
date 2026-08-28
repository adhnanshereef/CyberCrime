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
  screens: {
    languageSelectTitle: string;
    reportAnonymously: string;
    reportAnonymouslyDesc: string;
    reportComplaint: string;
    reportComplaintDesc: string;
    urgencyTitle: string;
    urgencyDesc: string;
    call1930: string;
    continueFiling: string;
    loginTitle: string;
    loginDesc: string;
    mobilePlaceholder: string;
    sendOtp: string;
    otpSent: string;
    enterOtp: string;
    verifyOtp: string;
    whatHappenedTitle: string;
    whatHappenedDesc: string;
    recordVoice: string;
    typeText: string;
    holdToTalk: string;
    recording: string;
    textPlaceholder: string;
    permissionError: string;
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
    screens: {
      languageSelectTitle: 'Select your language',
      reportAnonymously: 'Report Anonymously',
      reportAnonymouslyDesc: 'Case of Women/Children',
      reportComplaint: 'Report a Complaint',
      reportComplaintDesc: 'Financial Fraud',
      urgencyTitle: 'Money lost just now?',
      urgencyDesc: 'If money was just taken, call 1930 immediately to block the transaction and reduce damage.',
      call1930: 'Call 1930 Now',
      continueFiling: 'Continue registering case after calling',
      loginTitle: 'Enter your mobile number',
      loginDesc: 'We will send an OTP to verify your number.',
      mobilePlaceholder: 'Mobile Number',
      sendOtp: 'Send OTP',
      otpSent: 'OTP Sent!',
      enterOtp: 'Enter OTP',
      verifyOtp: 'Verify & Continue',
      whatHappenedTitle: 'Tell us what happened',
      whatHappenedDesc: 'How would you like to explain?',
      recordVoice: 'Record a voice message',
      typeText: 'Type a message',
      holdToTalk: 'Hold to talk',
      recording: 'Recording...',
      textPlaceholder: 'Type your message here...',
      permissionError: 'Microphone access denied. Please allow it in your browser settings to record voice.',
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
    screens: {
      languageSelectTitle: 'अपनी भाषा चुनें',
      reportAnonymously: 'अनाम रूप से रिपोर्ट करें',
      reportAnonymouslyDesc: 'महिला/बच्चों का मामला',
      reportComplaint: 'शिकायत दर्ज करें',
      reportComplaintDesc: 'वित्तीय धोखाधड़ी',
      urgencyTitle: 'क्या अभी पैसे कटे हैं?',
      urgencyDesc: 'यदि अभी पैसे कटे हैं, तो लेनदेन रोकने और नुकसान कम करने के लिए तुरंत 1930 पर कॉल करें।',
      call1930: 'अभी 1930 पर कॉल करें',
      continueFiling: 'शिकायत दर्ज करना जारी रखें',
      loginTitle: 'अपना मोबाइल नंबर दर्ज करें',
      loginDesc: 'हम आपके नंबर को सत्यापित करने के लिए एक OTP भेजेंगे।',
      mobilePlaceholder: 'मोबाइल नंबर',
      sendOtp: 'OTP भेजें',
      otpSent: 'OTP भेजा गया!',
      enterOtp: 'OTP दर्ज करें',
      verifyOtp: 'सत्यापित करें और जारी रखें',
      whatHappenedTitle: 'हमें बताएं कि क्या हुआ',
      whatHappenedDesc: 'आप कैसे समझाना चाहेंगे?',
      recordVoice: 'एक ध्वनि संदेश रिकॉर्ड करें',
      typeText: 'एक संदेश टाइप करें',
      holdToTalk: 'बोलने के लिए दबाए रखें',
      recording: 'रिकॉर्ड हो रहा है...',
      textPlaceholder: 'अपना संदेश यहां टाइप करें...',
      permissionError: 'माइक्रोफ़ोन एक्सेस अस्वीकार कर दिया गया। ध्वनि रिकॉर्ड करने के लिए कृपया इसे अपनी ब्राउज़र सेटिंग में अनुमति दें।',
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
    screens: {
      languageSelectTitle: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
      reportAnonymously: 'അജ്ഞാതമായി റിപ്പോർട്ട് ചെയ്യുക',
      reportAnonymouslyDesc: 'സ്ത്രീകളുടെ/കുട്ടികളുടെ കേസ്',
      reportComplaint: 'ഒരു പരാതി റിപ്പോർട്ട് ചെയ്യുക',
      reportComplaintDesc: 'സാമ്പത്തിക തട്ടിപ്പ്',
      urgencyTitle: 'ഇപ്പോൾ പണം നഷ്ടപ്പെട്ടോ?',
      urgencyDesc: 'ഇപ്പോൾ പണം നഷ്ടപ്പെട്ടെങ്കിൽ, ഇടപാട് തടയാനും നഷ്ടം കുറയ്ക്കാനും ഉടൻ 1930 ൽ വിളിക്കുക.',
      call1930: 'ഇപ്പോൾ 1930 ലേക്ക് വിളിക്കുക',
      continueFiling: 'പരാതി നൽകുന്നത് തുടരുക',
      loginTitle: 'നിങ്ങളുടെ മൊബൈൽ നമ്പർ നൽകുക',
      loginDesc: 'നിങ്ങളുടെ നമ്പർ പരിശോധിക്കാൻ ഞങ്ങൾ ഒരു OTP അയയ്ക്കും.',
      mobilePlaceholder: 'മൊബൈൽ നമ്പർ',
      sendOtp: 'OTP അയയ്ക്കുക',
      otpSent: 'OTP അയച്ചു!',
      enterOtp: 'OTP നൽകുക',
      verifyOtp: 'പരിശോധിച്ചുറപ്പിച്ച് തുടരുക',
      whatHappenedTitle: 'എന്താണ് സംഭവിച്ചതെന്ന് ഞങ്ങളോട് പറയുക',
      whatHappenedDesc: 'നിങ്ങൾ എങ്ങനെ വിശദീകരിക്കാൻ ആഗ്രഹിക്കുന്നു?',
      recordVoice: 'ഒരു വോയ്‌സ് സന്ദേശം റെക്കോർഡുചെയ്യുക',
      typeText: 'ഒരു സന്ദേശം ടൈപ്പ് ചെയ്യുക',
      holdToTalk: 'സംസാരിക്കാൻ അമർത്തിപ്പിടിക്കുക',
      recording: 'റെക്കോർഡുചെയ്യുന്നു...',
      textPlaceholder: 'നിങ്ങളുടെ സന്ദേശം ഇവിടെ ടൈപ്പ് ചെയ്യുക...',
      permissionError: 'മൈക്രോഫോൺ ആക്സസ് നിരസിച്ചു. വോയ്‌സ് റെക്കോർഡുചെയ്യാൻ ദയവായി നിങ്ങളുടെ ബ്രൗസർ ക്രമീകരണങ്ങളിൽ ഇത് അനുവദിക്കുക.',
    },
    fontStack: "'Noto Serif Malayalam', serif",
    direction: 'ltr',
  },
];
