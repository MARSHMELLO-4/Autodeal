export type Language = "en" | "hi";

export interface Translations {
  // Brand & Header
  verifiedTagline: string;
  inventory: string;
  categories: string;
  whyUs: string;
  contact: string;
  getAlerts: string;
  alerts: string;
  whatsApp: string;
  callDealer: string;
  showroomLocationInfo: string;

  // Hero Banner
  heroHubTag: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  chatWhatsApp: string;
  inspectedBadgeTitle: string;
  inspectedBadgeSub: string;
  rcBadgeTitle: string;
  rcBadgeSub: string;
  priceBadgeTitle: string;
  priceBadgeSub: string;

  // Filters & Search
  searchPlaceholder: string;
  clearSearch: string;
  allBikes: string;
  availableOnly: string;
  allInventory: string;
  reserved: string;
  sold: string;
  resetFilters: string;
  bikesCount: string;
  verifiedInventory: string;
  readyForDelivery: string;

  // Empty State & Errors
  noBikesFound: string;
  noBikesSub: string;
  resetAll: string;
  featuredMotorcycles: string;
  vehicleAddedAlert: string;

  // Vehicle Card
  statusAvailable: string;
  statusReserved: string;
  statusSold: string;
  verified: string;
  priceLabel: string;
  viewDetails: string;
  km: string;
  year: string;

  // Vehicle Details Drawer
  vehicleDetailsTitle: string;
  verifiedMotorcycleSub: string;
  tapToEnlarge: string;
  listedPrice: string;
  kilometers: string;
  manufactureYear: string;
  fuelType: string;
  ownership: string;
  ownerSerial: string;
  aboutMotorcycle: string;
  defaultDescription: string;
  specifications: string;
  brand: string;
  model: string;
  color: string;
  categoryLabel: string;
  location: string;
  closeDrawer: string;

  // Why Us / Footer
  whyChooseUs: string;
  buyWithConfidence: string;
  whyUsDesc: string;
  haveInquiry: string;
  inquirySub: string;
  emailUs: string;
  instantSupport: string;
  preferTalking: string;
  visitShowroom: string;
  visitUsIndore: string;
  showroomDesc: string;
  showroomAddress: string;
  showroomAddressVal: string;
  directPhone: string;
  emailAddress: string;
  mapTitle: string;
  openDays: string;
  callNow: string;

  // Mobile Bottom Bar
  showroom: string;
  call: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Brand & Header
    verifiedTagline: "Verified Pre-Owned Bikes",
    inventory: "Inventory",
    categories: "Categories",
    whyUs: "Why Us",
    contact: "Contact",
    getAlerts: "Get Alerts",
    alerts: "Alerts",
    whatsApp: "WhatsApp",
    callDealer: "Call Dealer",
    showroomLocationInfo: "Indore, Madhya Pradesh • Open All Days",

    // Hero Banner
    heroHubTag: "Indore's Trusted Two-Wheeler Hub",
    heroTitle1: "Ride Your Dream Bike",
    heroTitle2: "With Total Peace of Mind",
    heroSubtitle: "Every pre-owned motorcycle is mechanically inspected, RC-verified, and priced transparently.",
    chatWhatsApp: "Chat on WhatsApp",
    inspectedBadgeTitle: "100% Inspected",
    inspectedBadgeSub: "Full mechanical check",
    rcBadgeTitle: "RC Assistance",
    rcBadgeSub: "Hassle-free transfer",
    priceBadgeTitle: "Best Prices",
    priceBadgeSub: "No hidden charges",

    // Filters & Search
    searchPlaceholder: "Search by brand, model, colour...",
    clearSearch: "Clear search",
    allBikes: "All Bikes",
    availableOnly: "Available Only",
    allInventory: "All Inventory",
    reserved: "Reserved",
    sold: "Sold",
    resetFilters: "Reset",
    bikesCount: "Bikes",
    verifiedInventory: "Verified Inventory",
    readyForDelivery: "• Inspected & Ready for Delivery",

    // Empty State & Errors
    noBikesFound: "No motorcycles found",
    noBikesSub: "Try adjusting your search terms or select another category above.",
    resetAll: "Reset Filters",
    featuredMotorcycles: "Featured Motorcycles",
    vehicleAddedAlert: "A new vehicle has just been added to the inventory!",

    // Vehicle Card
    statusAvailable: "AVAILABLE",
    statusReserved: "RESERVED",
    statusSold: "SOLD",
    verified: "Verified",
    priceLabel: "Price",
    viewDetails: "View Details",
    km: "km",
    year: "Year",

    // Vehicle Details Drawer
    vehicleDetailsTitle: "Vehicle Details",
    verifiedMotorcycleSub: "Verified Pre-Owned Motorcycle",
    tapToEnlarge: "Tap to enlarge",
    listedPrice: "Listed Price",
    kilometers: "Kilometers",
    manufactureYear: "Year",
    fuelType: "Fuel",
    ownership: "Ownership",
    ownerSerial: "Owner",
    aboutMotorcycle: "About this motorcycle",
    defaultDescription: "Every motorcycle at Shree Ganesh Autodeal goes through a thorough mechanical inspection before being listed for sale. Contact us for a test ride or RC documentation details.",
    specifications: "Specifications & Details",
    brand: "Brand",
    model: "Model",
    color: "Color",
    categoryLabel: "Category",
    location: "Location",
    closeDrawer: "Close drawer",

    // Why Us / Footer
    whyChooseUs: "Why Choose Us",
    buyWithConfidence: "Buy With Confidence",
    whyUsDesc: "We believe buying a pre-owned motorcycle should be simple, transparent and trustworthy. Every bike is inspected before reaching our showroom floor.",
    haveInquiry: "Have an Inquiry?",
    inquirySub: "We'd be happy to answer your questions.",
    emailUs: "Email Us",
    instantSupport: "Instant Support",
    preferTalking: "Prefer talking?",
    visitShowroom: "Showroom Location",
    visitUsIndore: "Visit Us in Indore",
    showroomDesc: "Inspect bikes in person, take test rides, and complete documentation under one roof.",
    showroomAddress: "Showroom Address",
    showroomAddressVal: "Shree Ganesh Autodeal, Indore, Madhya Pradesh",
    directPhone: "Direct Phone",
    emailAddress: "Email Address",
    mapTitle: "Showroom Location Map",
    openDays: "Open 7 Days",
    callNow: "Call Dealer",

    // Mobile Bottom Bar
    showroom: "Showroom",
    call: "Call",
  },
  hi: {
    // Brand & Header
    verifiedTagline: "सत्यापित सेकंड-हैंड बाइक्स",
    inventory: "इन्वेंटरी",
    categories: "श्रेणियाँ",
    whyUs: "हम क्यों?",
    contact: "संपर्क",
    getAlerts: "अलर्ट्स पाएं",
    alerts: "अलर्ट्स",
    whatsApp: "व्हाट्सएप",
    callDealer: "डीलर को कॉल करें",
    showroomLocationInfo: "इंदौर, मध्य प्रदेश • सातों दिन खुला",

    // Hero Banner
    heroHubTag: "इंदौर का विश्वसनीय टू-व्हीलर हब",
    heroTitle1: "अपनी मनपसंद बाइक चलाएं",
    heroTitle2: "पूरी तसल्ली और गारंटी के साथ",
    heroSubtitle: "प्रत्येक बाइक की पूरी तकनीकी जांच होती है, आरसी ट्रांसफर की सुविधा और बिना किसी छिपे शुल्क के सबसे सही दाम।",
    chatWhatsApp: "व्हाट्सएप पर बात करें",
    inspectedBadgeTitle: "100% जांची गई",
    inspectedBadgeSub: "संपूर्ण तकनीकी जांच",
    rcBadgeTitle: "आरसी सहायता",
    rcBadgeSub: "आसान नाम ट्रांसफर",
    priceBadgeTitle: "सर्वोत्तम मूल्य",
    priceBadgeSub: "बिना किसी छिपे शुल्क",

    // Filters & Search
    searchPlaceholder: "ब्रांड, मॉडल, रंग खोजें...",
    clearSearch: "सर्च हटाएं",
    allBikes: "सभी बाइक्स",
    availableOnly: "उपलब्ध केवल",
    allInventory: "सभी इन्वेंटरी",
    reserved: "बुक हो चुकी",
    sold: "बिक चुकी",
    resetFilters: "रीसेट",
    bikesCount: "बाइक्स",
    verifiedInventory: "सत्यापित इन्वेंटरी",
    readyForDelivery: "• पूरी तरह जांची गई और तैयार",

    // Empty State & Errors
    noBikesFound: "कोई मोटरसाइकिल नहीं मिली",
    noBikesSub: "कृपया अपने सर्च शब्द बदलें या ऊपर दी गई अन्य श्रेणी चुनें।",
    resetAll: "फिल्टर रीसेट करें",
    featuredMotorcycles: "प्रमुख मोटरसाइकिलें",
    vehicleAddedAlert: "इन्वेंटरी में एक नया वाहन जोड़ा गया है!",

    // Vehicle Card
    statusAvailable: "उपलब्ध",
    statusReserved: "आरक्षित",
    statusSold: "बिक चुकी",
    verified: "सत्यापित",
    priceLabel: "Price",
    viewDetails: "View Details",
    km: "किमी",
    year: "वर्ष",

    // Vehicle Details Drawer
    vehicleDetailsTitle: "वाहन विवरण",
    verifiedMotorcycleSub: "सत्यापित सेकंड-हैंड मोटरसाइकिल",
    tapToEnlarge: "बड़ा देखने के लिए टैप करें",
    listedPrice: "सूचीबद्ध मूल्य",
    kilometers: "किलोमीटर",
    manufactureYear: "वर्ष",
    fuelType: "ईंधन",
    ownership: "स्वामित्व",
    ownerSerial: "ओनर",
    aboutMotorcycle: "इस मोटरसाइकिल के बारे में",
    defaultDescription: "श्री गणेश ऑटोडील की प्रत्येक मोटरसाइकिल बिक्री से पहले पूरी जांच से गुजरती है। टेस्ट राइड या आरसी विवरण के लिए संपर्क करें।",
    specifications: "तकनीकी विवरण व जानकारी",
    brand: "ब्रांड",
    model: "मॉडल",
    color: "रंग",
    categoryLabel: "श्रेणी",
    location: "स्थान",
    closeDrawer: "बंद करें",

    // Why Us / Footer
    whyChooseUs: "हमें क्यों चुनें",
    buyWithConfidence: "विश्वास के साथ खरीदें",
    whyUsDesc: "हमारा मानना है कि सेकंड-हैंड बाइक खरीदना आसान, पारदर्शी और भरोसेमंद होना चाहिए। हर बाइक शोरूम तक आने से पहले जांची जाती है।",
    haveInquiry: "कोई सवाल है?",
    inquirySub: "हमें आपके प्रश्नों का उत्तर देने में खुशी होगी।",
    emailUs: "ईमेल भेजें",
    instantSupport: "त्वरित सहायता",
    preferTalking: "सीधी बात करें?",
    visitShowroom: "शोरूम का पता",
    visitUsIndore: "इंदौर में हमारे शोरूम पधारें",
    showroomDesc: "शोरूम पर बाइक देखें, टेस्ट राइड लें और एक ही छत के नीचे तुरंत कागजी कार्यवाही पूरी करें।",
    showroomAddress: "शोरूम का पता",
    showroomAddressVal: "श्री गणेश ऑटोडील, इंदौर, मध्य प्रदेश",
    directPhone: "सीधा फोन नंबर",
    emailAddress: "ईमेल पता",
    mapTitle: "शोरूम लोकेशन मैप",
    openDays: "सातों दिन खुला",
    callNow: "डीलर को कॉल करें",

    // Mobile Bottom Bar
    showroom: "शोरूम",
    call: "कॉल करें",
  },
};
