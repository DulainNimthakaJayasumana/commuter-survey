// All survey text in English (en), Sinhala (si) and Tamil (ta).
// Option `v` is the value saved to Firestore. Ordinal items use numbers so they are ready for analysis.

export const LANGS = [
  { code: "si", label: "සිංහල", sub: "Sinhala" },
  { code: "en", label: "English", sub: "English" },
  { code: "ta", label: "தமிழ்", sub: "Tamil" },
];

export const UI = {
  en: {
    briefTitle: "Before you begin",
    brief: [
      "Please fill this in <b>after you arrive at the university today</b>.",
      "Choose <b>one</b> answer for each question.",
      "Your name and index number are <b>not</b> asked. Answers are anonymous and used only for this project.",
      "Takes about 2 minutes. Taking part is voluntary.",
    ],
    start: "Start",
    ok: "OK",
    back: "Back",
    submit: "Submit",
    submitting: "Submitting…",
    pressEnter: "press <b>Enter ↵</b>",
    required: "Please choose an answer",
    otherPlaceholder: "Type your answer…",
    otherRequired: "Please specify",
    changeLang: "Language",
    doneTitle: "Thank you for your time!",
    doneSub: "Your response has been recorded.",
    declinedTitle: "No problem — thank you.",
    declinedSub: "You chose not to take part. You can close this page.",
    ineligibleTitle: "Thank you for your interest!",
    ineligibleSub: "This survey is for students who travel to the university at least 3 days a week.",
    error: "Couldn't submit. Please check your internet connection and try again.",
    sections: {
      A: "About you",
      B: "Your journey to the university",
      C: "How you felt during today's journey",
      D: "Other factors today",
    },
  },
  si: {
    briefTitle: "ආරම්භ කිරීමට පෙර",
    brief: [
      "කරුණාකර <b>අද දින විශ්වවිද්‍යාලයට පැමිණි පසු</b> මෙම ප්‍රශ්නාවලිය පුරවන්න.",
      "සෑම ප්‍රශ්නයකටම <b>එක්</b> පිළිතුරක් පමණක් තෝරන්න.",
      "ඔබේ නම හෝ ලියාපදිංචි අංකය <b>අසනු නොලැබේ</b>. ඔබේ පිළිතුරු රහසිගතව තබා මෙම ව්‍යාපෘතිය සඳහා පමණක් භාවිත කෙරේ.",
      "මිනිත්තු 2ක් පමණ ගත වේ. සහභාගී වීම ස්වේච්ඡාවෙනි.",
    ],
    start: "ආරම්භ කරන්න",
    ok: "ඉදිරියට",
    back: "ආපසු",
    submit: "යොමු කරන්න",
    submitting: "යොමු කරමින්…",
    pressEnter: "<b>Enter ↵</b> ඔබන්න",
    required: "කරුණාකර පිළිතුරක් තෝරන්න",
    otherPlaceholder: "ඔබේ පිළිතුර ලියන්න…",
    otherRequired: "කරුණාකර සඳහන් කරන්න",
    changeLang: "භාෂාව",
    doneTitle: "ඔබේ සහභාගීත්වයට ස්තූතියි!",
    doneSub: "ඔබේ ප්‍රතිචාරය සටහන් කර ඇත.",
    declinedTitle: "කමක් නැත — ස්තූතියි.",
    declinedSub: "ඔබ සහභාගී නොවීමට තීරණය කළා. ඔබට මෙම පිටුව වසා දැමිය හැක.",
    ineligibleTitle: "ඔබේ උනන්දුවට ස්තූතියි!",
    ineligibleSub: "මෙම සමීක්ෂණය සතියකට අවම වශයෙන් දින 3ක් විශ්වවිද්‍යාලයට පැමිණෙන සිසුන් සඳහා වේ.",
    error: "යොමු කිරීමට නොහැකි විය. කරුණාකර අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න.",
    sections: {
      A: "ඔබ ගැන",
      B: "විශ්වවිද්‍යාලයට ඔබේ ගමන",
      C: "අද ගමනේදී ඔබට දැනුණු ආකාරය",
      D: "අද දින වෙනත් සාධක",
    },
  },
  ta: {
    briefTitle: "தொடங்குவதற்கு முன்",
    brief: [
      "<b>இன்று பல்கலைக்கழகத்தை வந்தடைந்த பிறகு</b> இந்த வினாக்கொத்தை நிரப்பவும்.",
      "ஒவ்வொரு கேள்விக்கும் <b>ஒரு</b> பதிலை மட்டும் தேர்ந்தெடுக்கவும்.",
      "உங்கள் பெயரோ பதிவு இலக்கமோ <b>கேட்கப்படமாட்டாது</b>. உங்கள் பதில்கள் இரகசியமாக வைக்கப்பட்டு இந்த ஆய்வுக்கு மட்டுமே பயன்படுத்தப்படும்.",
      "சுமார் 2 நிமிடங்கள் ஆகும். பங்கேற்பது உங்கள் விருப்பம்.",
    ],
    start: "தொடங்கு",
    ok: "சரி",
    back: "பின்",
    submit: "சமர்ப்பி",
    submitting: "சமர்ப்பிக்கிறது…",
    pressEnter: "<b>Enter ↵</b> அழுத்தவும்",
    required: "தயவுசெய்து ஒரு பதிலைத் தேர்ந்தெடுக்கவும்",
    otherPlaceholder: "உங்கள் பதிலை எழுதவும்…",
    otherRequired: "தயவுசெய்து குறிப்பிடவும்",
    changeLang: "மொழி",
    doneTitle: "உங்கள் நேரத்திற்கு நன்றி!",
    doneSub: "உங்கள் பதில் பதிவு செய்யப்பட்டது.",
    declinedTitle: "பரவாயில்லை — நன்றி.",
    declinedSub: "நீங்கள் பங்கேற்க வேண்டாம் எனத் தெரிவு செய்தீர்கள். இந்தப் பக்கத்தை மூடலாம்.",
    ineligibleTitle: "உங்கள் ஆர்வத்திற்கு நன்றி!",
    ineligibleSub: "இந்த ஆய்வு வாரத்தில் குறைந்தது 3 நாட்கள் பல்கலைக்கழகத்திற்குப் பயணம் செய்யும் மாணவர்களுக்கானது.",
    error: "சமர்ப்பிக்க முடியவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
    sections: {
      A: "உங்களைப் பற்றி",
      B: "பல்கலைக்கழகத்திற்கான உங்கள் பயணம்",
      C: "இன்றைய பயணத்தின்போது நீங்கள் உணர்ந்த விதம்",
      D: "இன்றைய பிற காரணிகள்",
    },
  },
};

const o = (v, en, si, ta, extra = {}) => ({ v, label: { en, si, ta }, ...extra });

const ACCESS = [
  o("walk", "Walk", "පයින්", "நடந்து"),
  o("bus", "Bus", "බස්", "பேருந்து"),
  o("bicycle", "Bicycle", "බයිසිකලය", "சைக்கிள்"),
  o("three_wheeler", "Three-wheeler", "ත්‍රීරෝද රථය", "முச்சக்கர வண்டி"),
  o("dropped", "Dropped by someone", "කෙනෙකු ඇරලවයි", "யாராவது இறக்கிவிடுவார்கள்"),
  o("na", "Not applicable", "අදාළ නොවේ", "பொருந்தாது"),
];

const FEEL_PRE = {
  en: "Think about your journey to the university TODAY. Choose the ONE option that best describes how you felt during the journey.",
  si: "අද විශ්වවිද්‍යාලයට පැමිණි ගමන ගැන සිතන්න. ගමනේදී ඔබට දැනුණු ආකාරය වඩාත් හොඳින් විස්තර කරන එක් පිළිතුරක් තෝරන්න.",
  ta: "இன்று பல்கலைக்கழகத்திற்கு வந்த பயணத்தைப் பற்றி சிந்தியுங்கள். பயணத்தின்போது நீங்கள் உணர்ந்ததை மிகச் சிறப்பாக விவரிக்கும் ஒரு பதிலைத் தேர்ந்தெடுக்கவும்.",
};

// Builds the 7 labels (−3 … +3): Very / Quite / Slightly <left>, Neither, Slightly / Quite / Very <right>.
const DEG = {
  en: ["Very", "Quite", "Slightly"],
  si: ["ඉතා", "තරමක්", "මඳක්"],
  ta: ["மிகவும்", "ஓரளவு", "சற்று"],
};
const NEITHER = { en: "Neither", si: "දෙකම නොවේ", ta: "இரண்டுமில்லை" };
function points(left, right) {
  return [0, 1, 2, "n", 2, 1, 0].map((d, i) => {
    if (d === "n") return NEITHER;
    const word = i < 3 ? left : right;
    return Object.fromEntries(["en", "si", "ta"].map((l) => [l, `${DEG[l][d]} ${word[l]}`]));
  });
}

export const QUESTIONS = [
  // ---------------- Section A ----------------
  {
    id: "A1", section: "A", type: "single",
    q: {
      en: "Do you agree to take part in this survey?",
      si: "මෙම සමීක්ෂණයට සහභාගී වීමට ඔබ එකඟද?",
      ta: "இந்த ஆய்வில் பங்கேற்க நீங்கள் சம்மதிக்கிறீர்களா?",
    },
    options: [
      o("yes", "Yes, I agree", "ඔව්, මම එකඟයි", "ஆம், நான் சம்மதிக்கிறேன்"),
      o("no", "No", "නැත", "இல்லை", { stop: "declined" }),
    ],
  },
  {
    id: "A2", section: "A", type: "single",
    q: {
      en: "How many days a week do you usually travel to the university?",
      si: "ඔබ සාමාන්‍යයෙන් සතියකට දින කීයක් විශ්වවිද්‍යාලයට පැමිණෙනවාද?",
      ta: "நீங்கள் வழக்கமாக வாரத்தில் எத்தனை நாட்கள் பல்கலைக்கழகத்திற்குப் பயணம் செய்கிறீர்கள்?",
    },
    options: [
      o("1-2", "1–2 days", "දින 1–2", "1–2 நாட்கள்", { stop: "ineligible" }),
      o("3-4", "3–4 days", "දින 3–4", "3–4 நாட்கள்"),
      o("5+", "5 days or more", "දින 5 හෝ වැඩි", "5 நாட்கள் அல்லது அதற்கு மேல்"),
    ],
  },
  {
    id: "A3", section: "A", type: "single",
    q: { en: "Your faculty", si: "ඔබේ පීඨය", ta: "உங்கள் பீடம்" },
    options: [
      o("applied_sciences", "Applied Sciences", "ව්‍යවහාරික විද්‍යා", "பிரயோக விஞ்ஞானம்"),
      o("engineering", "Engineering", "ඉංජිනේරු", "பொறியியல்"),
      o("management_commerce", "Management Studies and Commerce", "කළමනාකරණ අධ්‍යයන හා වාණිජ", "முகாமைத்துவ கற்கைகள் மற்றும் வணிகம்"),
      o("technology", "Technology", "තාක්ෂණ", "தொழில்நுட்பம்"),
      o("humanities_social", "Humanities and Social Sciences", "මානව ශාස්ත්‍ර හා සමාජ විද්‍යා", "மானுடவியல் மற்றும் சமூக விஞ்ஞானம்"),
      o("computing", "Computing", "පරිගණක", "கணினி"),
      o("medical", "Medical Sciences", "වෛද්‍ය විද්‍යා", "மருத்துவ விஞ்ஞானம்"),
      o("dental", "Dental Sciences", "දන්ත වෛද්‍ය විද්‍යා", "பல் மருத்துவ விஞ்ஞானம்"),
      o("allied_health", "Allied Health Sciences", "සහායක සෞඛ්‍ය විද්‍යා", "துணை சுகாதார விஞ்ஞானம்"),
      o("urban_aquatic", "Urban and Aquatic Bioresources", "නාගරික හා ජලජ ජෛව සම්පත්", "நகர்ப்புற மற்றும் நீர்வாழ் உயிர்வளங்கள்"),
    ],
  },
  {
    id: "A4", section: "A", type: "single",
    q: { en: "Year of study", si: "අධ්‍යයන වර්ෂය", ta: "கல்வி ஆண்டு" },
    options: [
      o(1, "1st year", "1 වන වසර", "முதலாம் ஆண்டு"),
      o(2, "2nd year", "2 වන වසර", "இரண்டாம் ஆண்டு"),
      o(3, "3rd year", "3 වන වසර", "மூன்றாம் ஆண்டு"),
      o(4, "4th year", "4 වන වසර", "நான்காம் ஆண்டு"),
      o(5, "5th year or above", "5 වන වසර හෝ ඊට වැඩි", "ஐந்தாம் ஆண்டு அல்லது அதற்கு மேல்"),
    ],
  },
  {
    id: "A5", section: "A", type: "single",
    q: { en: "Gender", si: "ස්ත්‍රී / පුරුෂ භාවය", ta: "பாலினம்" },
    options: [
      o("male", "Male", "පුරුෂ", "ஆண்"),
      o("female", "Female", "ස්ත්‍රී", "பெண்"),
      o("prefer_not", "Prefer not to say", "පැවසීමට අකමැතියි", "கூற விரும்பவில்லை"),
    ],
  },
  {
    id: "A6", section: "A", type: "single",
    q: {
      en: "Where do you stay during the semester?",
      si: "අධ්‍යයන වාරය තුළ ඔබ නවාතැන් ගන්නේ කොහේද?",
      ta: "செமஸ்டர் காலத்தில் நீங்கள் எங்கே தங்குகிறீர்கள்?",
    },
    options: [
      o("home", "Home", "නිවස", "வீடு"),
      o("boarding", "Boarding place", "බෝඩිම", "வாடகைத் தங்குமிடம் (போர்டிங்)"),
      o("hostel", "University hostel", "විශ්වවිද්‍යාල නේවාසිකාගාරය", "பல்கலைக்கழக விடுதி"),
      o("other", "Other (please specify)", "වෙනත් (සඳහන් කරන්න)", "வேறு (குறிப்பிடவும்)", { other: true }),
    ],
  },

  // ---------------- Section B ----------------
  {
    id: "B1", section: "B", type: "single",
    q: {
      en: "Approximate ONE-WAY distance from where you stay to the university",
      si: "ඔබ නවාතැන් ගන්නා ස්ථානයේ සිට විශ්වවිද්‍යාලයට ඇති දළ දුර (එක් පැත්තකට පමණි)",
      ta: "நீங்கள் தங்கும் இடத்திலிருந்து பல்கலைக்கழகத்திற்கான தோராயமான ஒருவழித் தூரம்",
    },
    help: {
      en: "Not the return trip. If you are not sure, you may check on Google Maps.",
      si: "ආපසු ගමන ඇතුළත් නොකරන්න. විශ්වාස නැත්නම් Google Maps මගින් බලන්න.",
      ta: "திரும்பும் பயணத்தைச் சேர்க்க வேண்டாம். உறுதியாகத் தெரியாவிட்டால் Google Maps இல் பார்க்கலாம்.",
    },
    options: [
      o(1, "Less than 5 km", "කි.මී. 5ට අඩු", "5 கி.மீ.க்கும் குறைவு"),
      o(2, "5–14 km", "කි.මී. 5–14", "5–14 கி.மீ."),
      o(3, "15–29 km", "කි.මී. 15–29", "15–29 கி.மீ."),
      o(4, "30–49 km", "කි.මී. 30–49", "30–49 கி.மீ."),
      o(5, "50 km or more", "කි.මී. 50 හෝ වැඩි", "50 கி.மீ. அல்லது அதற்கு மேல்"),
    ],
  },
  {
    id: "B2", section: "B", type: "single",
    q: {
      en: "Main transport mode",
      si: "ප්‍රධාන ප්‍රවාහන මාධ්‍යය",
      ta: "முக்கிய போக்குவரத்து முறை",
    },
    help: {
      en: "The vehicle you spend the most time in.",
      si: "ඔබ වැඩි කාලයක් ගත කරන වාහනය.",
      ta: "நீங்கள் அதிக நேரம் செலவிடும் வாகனம்.",
    },
    options: [
      o("bus", "Bus", "බස්", "பேருந்து"),
      o("train", "Train", "දුම්රිය", "ரயில்"),
      o("three_wheeler", "Three-wheeler / PickMe / Uber", "ත්‍රීරෝද රථය / PickMe / Uber", "முச்சக்கர வண்டி / PickMe / Uber"),
      o("private", "Private vehicle (own, or dropped by someone)", "පෞද්ගලික වාහනය (තමාගේ හෝ කෙනෙකු ඇරලවීම)", "தனிப்பட்ட வாகனம் (சொந்தம் அல்லது யாராவது இறக்கிவிடுதல்)"),
      o("walk_bicycle", "Walk or bicycle", "පයින් හෝ බයිසිකලයෙන්", "நடை அல்லது சைக்கிள்"),
    ],
  },
  {
    id: "B3", section: "B", type: "single",
    q: {
      en: "On your trip from HOME (or where you stay) to the CAMPUS, how many times do you change from one vehicle to another?",
      si: "නිවසේ (හෝ නවාතැනේ) සිට විශ්වවිද්‍යාලයට එන ගමනේදී ඔබ එක් වාහනයකින් තවත් වාහනයකට මාරු වන්නේ කී වතාවක්ද?",
      ta: "வீட்டிலிருந்து (அல்லது தங்குமிடத்திலிருந்து) பல்கலைக்கழகத்திற்கு வரும் பயணத்தில், நீங்கள் எத்தனை முறை ஒரு வாகனத்திலிருந்து மற்றொரு வாகனத்திற்கு மாறுகிறீர்கள்?",
    },
    help: {
      en: "Count every change of vehicle, including changing from one bus to another bus. Walking is not counted.",
      si: "එක් බසයකින් තවත් බසයකට මාරු වීම ද ඇතුළුව සෑම වාහන මාරුවක්ම ගණන් කරන්න. පයින් යාම ගණන් නොකෙරේ.",
      ta: "ஒரு பேருந்திலிருந்து மற்றொரு பேருந்துக்கு மாறுவது உட்பட, ஒவ்வொரு வாகன மாற்றத்தையும் கணக்கிடுங்கள். நடப்பது கணக்கிடப்படாது.",
    },
    examples: [
      { en: "Home → one bus → Campus = <b>0 changes</b>", si: "නිවස → එක් බසයක් → විශ්වවිද්‍යාලය = <b>මාරු වීම් 0</b>", ta: "வீடு → ஒரு பேருந்து → பல்கலைக்கழகம் = <b>0 மாற்றங்கள்</b>" },
      { en: "Home → Bus → another Bus → Campus = <b>1 change</b> (2 buses)", si: "නිවස → බස් → තවත් බසයක් → විශ්වවිද්‍යාලය = <b>මාරු වීම් 1</b> (බස් 2ක්)", ta: "வீடு → பேருந்து → இன்னொரு பேருந்து → பல்கலைக்கழகம் = <b>1 மாற்றம்</b> (2 பேருந்துகள்)" },
      { en: "Home → Three-wheeler → Bus → Train → Campus = <b>2 changes</b>", si: "නිවස → ත්‍රීරෝද රථය → බස් → දුම්රිය → විශ්වවිද්‍යාලය = <b>මාරු වීම් 2</b>", ta: "வீடு → முச்சக்கர வண்டி → பேருந்து → ரயில் → பல்கலைக்கழகம் = <b>2 மாற்றங்கள்</b>" },
    ],
    options: [
      o(0, "0", "0", "0"),
      o(1, "1", "1", "1"),
      o(2, "2", "2", "2"),
      o(3, "3 or more", "3 හෝ වැඩි", "3 அல்லது அதற்கு மேல்"),
    ],
  },
  {
    id: "B4", section: "B", type: "single",
    q: {
      en: "How do you get from where you stay to your main vehicle?",
      si: "ඔබ නවාතැනේ සිට ප්‍රධාන වාහනය වෙත යන්නේ කෙසේද?",
      ta: "நீங்கள் தங்கும் இடத்திலிருந்து முக்கிய வாகனத்தை எவ்வாறு அடைகிறீர்கள்?",
    },
    help: { en: "First part of the trip.", si: "ගමනේ මුල් කොටස.", ta: "பயணத்தின் முதல் பகுதி." },
    options: ACCESS,
  },
  {
    id: "B5", section: "B", type: "single",
    q: {
      en: "How do you get from your main vehicle to the university gate?",
      si: "ප්‍රධාන වාහනයෙන් බැස විශ්වවිද්‍යාල දොරටුවට පැමිණෙන්නේ කෙසේද?",
      ta: "முக்கிய வாகனத்திலிருந்து இறங்கி பல்கலைக்கழக வாயிலை எவ்வாறு அடைகிறீர்கள்?",
    },
    help: { en: "Last part of the trip.", si: "ගමනේ අවසාන කොටස.", ta: "பயணத்தின் இறுதிப் பகுதி." },
    options: ACCESS,
  },
  {
    id: "B6", section: "B", type: "single",
    q: {
      en: "During the journey, do you usually get a seat?",
      si: "ගමනේදී ඔබට සාමාන්‍යයෙන් ආසනයක් ලැබෙනවාද?",
      ta: "பயணத்தின்போது உங்களுக்கு வழக்கமாக இருக்கை கிடைக்குமா?",
    },
    options: [
      o("seat", "Usually get a seat", "සාමාන්‍යයෙන් ආසනයක් ලැබේ", "வழக்கமாக இருக்கை கிடைக்கும்"),
      o("stand", "Usually stand", "සාමාන්‍යයෙන් සිටගෙනයි", "வழக்கமாக நின்றுகொண்டே பயணிப்பேன்"),
      o("na", "Not applicable (walk / bicycle)", "අදාළ නොවේ (පයින් / බයිසිකලය)", "பொருந்தாது (நடை / சைக்கிள்)"),
    ],
  },
  {
    id: "B7", section: "B", type: "single",
    q: {
      en: "How often do you arrive 15 or more minutes later than you expected?",
      si: "ඔබ බලාපොරොත්තු වූ වේලාවට වඩා විනාඩි 15ක් හෝ ඊට වැඩි ප්‍රමාද වී පැමිණෙන්නේ කොපමණ වාරයක්ද?",
      ta: "நீங்கள் எதிர்பார்த்ததை விட 15 நிமிடங்கள் அல்லது அதற்கு மேல் தாமதமாக எவ்வளவு அடிக்கடி வந்தடைகிறீர்கள்?",
    },
    options: [
      o(0, "0 days per week (Never)", "සතියකට දින 0 (කිසිදා නැත)", "வாரத்திற்கு 0 நாட்கள் (ஒருபோதும் இல்லை)"),
      o(1, "1 day per week", "සතියකට දින 1ක්", "வாரத்திற்கு 1 நாள்"),
      o(2, "2–3 days per week", "සතියකට දින 2–3", "வாரத்திற்கு 2–3 நாட்கள்"),
      o(3, "4+ days per week", "සතියකට දින 4 හෝ වැඩි", "வாரத்திற்கு 4 அல்லது அதற்கு மேற்பட்ட நாட்கள்"),
    ],
  },

  // ---------------- Section C ----------------
  {
    id: "C1", section: "C", type: "scale7", pre: FEEL_PRE,
    q: {
      en: "During the journey, did you feel stressed or relaxed?",
      si: "ගමනේදී ඔබට ආතතියක් දැනුණාද, නැතහොත් සැහැල්ලුවක් දැනුණාද?",
      ta: "பயணத்தின்போது நீங்கள் மன அழுத்தமாக உணர்ந்தீர்களா அல்லது நிம்மதியாக உணர்ந்தீர்களா?",
    },
    points: points(
      { en: "stressed", si: "ආතතියෙන්", ta: "மன அழுத்தத்துடன்" },
      { en: "relaxed", si: "සැහැල්ලුවෙන්", ta: "நிம்மதியாக" },
    ),
  },
  {
    id: "C2", section: "C", type: "scale7", pre: FEEL_PRE,
    q: {
      en: "During the journey, did you feel worried or confident?",
      si: "ගමනේදී ඔබට කනස්සල්ලක් දැනුණාද, නැතහොත් විශ්වාසයක් දැනුණාද?",
      ta: "பயணத்தின்போது நீங்கள் கவலையாக உணர்ந்தீர்களா அல்லது நம்பிக்கையுடன் உணர்ந்தீர்களா?",
    },
    points: points(
      { en: "worried", si: "කනස්සල්ලෙන්", ta: "கவலையுடன்" },
      { en: "confident", si: "විශ්වාසයෙන්", ta: "நம்பிக்கையுடன்" },
    ),
  },
  {
    id: "C3", section: "C", type: "scale7", pre: FEEL_PRE,
    q: {
      en: "During the journey, did you feel hurried or calm?",
      si: "ගමනේදී ඔබට කලබලයක් දැනුණාද, නැතහොත් සන්සුන් බවක් දැනුණාද?",
      ta: "பயணத்தின்போது நீங்கள் அவசரமாக உணர்ந்தீர்களா அல்லது அமைதியாக உணர்ந்தீர்களா?",
    },
    points: points(
      { en: "hurried", si: "කලබලයෙන්", ta: "அவசரமாக" },
      { en: "calm", si: "සන්සුන්ව", ta: "அமைதியாக" },
    ),
  },
  {
    id: "C4", section: "C", type: "single",
    pre: {
      en: "Stress means a situation in which a person feels tense, restless, nervous or anxious, or is unable to sleep at night because his/her mind is troubled all the time.",
      si: "ආතතිය යනු පුද්ගලයෙකුට නොසන්සුන්, නොඉවසිලිමත්, කලබල හෝ කනස්සල්ල සහිත බවක් දැනෙන, හෝ සිත නිතර කරදරයට පත්ව ඇති නිසා රාත්‍රියේ නින්ද නොයන තත්ත්වයකි.",
      ta: "மன அழுத்தம் என்பது ஒருவர் பதற்றம், அமைதியின்மை, படபடப்பு அல்லது கவலையை உணரும் நிலை, அல்லது மனம் எப்போதும் கலக்கமாக இருப்பதால் இரவில் தூங்க முடியாத நிலை ஆகும்.",
    },
    q: {
      en: "Do you feel this kind of stress these days?",
      si: "මේ දිනවල ඔබට මෙවැනි ආතතියක් දැනෙනවාද?",
      ta: "இந்நாட்களில் நீங்கள் இவ்வாறான மன அழுத்தத்தை உணர்கிறீர்களா?",
    },
    options: [
      o(1, "Not at all", "කිසිසේත් නැත", "இல்லவே இல்லை"),
      o(2, "Only a little", "ඉතා සුළු වශයෙන්", "சிறிதளவு மட்டும்"),
      o(3, "To some extent", "යම් ප්‍රමාණයකට", "ஓரளவுக்கு"),
      o(4, "Rather much", "තරමක් වැඩියෙන්", "ஓரளவு அதிகமாக"),
      o(5, "Very much", "ඉතා වැඩියෙන්", "மிக அதிகமாக"),
    ],
  },

  // ---------------- Section D ----------------
  {
    id: "D1", section: "D", type: "single",
    q: {
      en: "How would you rate the quality of your sleep last night?",
      si: "ඊයේ රාත්‍රියේ ඔබේ නින්දේ ගුණාත්මකභාවය කෙසේද?",
      ta: "நேற்றிரவு உங்கள் தூக்கத்தின் தரத்தை எவ்வாறு மதிப்பிடுவீர்கள்?",
    },
    options: [
      o(1, "Very poor", "ඉතා දුර්වලයි", "மிகவும் மோசம்"),
      o(2, "Poor", "දුර්වලයි", "மோசம்"),
      o(3, "Average", "සාමාන්‍යයි", "சராசரி"),
      o(4, "Good", "හොඳයි", "நல்லது"),
      o(5, "Very good", "ඉතා හොඳයි", "மிகவும் நல்லது"),
    ],
  },
  {
    id: "D2", section: "D", type: "single",
    q: {
      en: "How much academic workload pressure do you feel today?",
      si: "අද දින ඔබට දැනෙන අධ්‍යයන වැඩ බරෙහි පීඩනය කොපමණද?",
      ta: "இன்று நீங்கள் உணரும் கல்விப் பணிச்சுமை அழுத்தம் எவ்வளவு?",
    },
    help: {
      en: "Assignments, tests, deadlines.",
      si: "පැවරුම්, පරීක්ෂණ, නියමිත දින.",
      ta: "ஒப்படைப்புகள், பரீட்சைகள், காலக்கெடுக்கள்.",
    },
    options: [
      o(1, "Very low", "ඉතා අඩුයි", "மிகக் குறைவு"),
      o(2, "Low", "අඩුයි", "குறைவு"),
      o(3, "Moderate", "මධ්‍යයි", "மிதமானது"),
      o(4, "High", "ඉහළයි", "அதிகம்"),
      o(5, "Very high", "ඉතා ඉහළයි", "மிக அதிகம்"),
    ],
  },
];
