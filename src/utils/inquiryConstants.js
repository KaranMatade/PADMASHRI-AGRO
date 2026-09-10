/**
 * Inquiry Status Constants
 * Author: Anushka Shete
 * Used by both frontend (InquiryModal) and backend (server/routes/inquiries.js)
 */

export const INQUIRY_STATUS = {
  PENDING: 'Pending',
  CONTACTED: 'Contacted',
  QUOTED: 'Quoted',
  CONVERTED: 'Converted',
  CLOSED: 'Closed',
};

export const INQUIRY_STATUS_LABELS = {
  en: {
    Pending: '🟡 Pending',
    Contacted: '🔵 Contacted',
    Quoted: '🟠 Quote Sent',
    Converted: '🟢 Converted to Sale',
    Closed: '⚫ Closed',
  },
  mr: {
    Pending: '🟡 प्रलंबित',
    Contacted: '🔵 संपर्क झाला',
    Quoted: '🟠 कोटेशन दिले',
    Converted: '🟢 विक्री झाली',
    Closed: '⚫ बंद केले',
  }
};

export const BRANCH_LIST = [
  { id: 'main',     label: 'Main Factory — Sadatpur, Sangamner', labelMr: 'मुख्य कारखाना — सादतपूर, संगमनेर' },
  { id: 'rahata',   label: 'Rahata Branch',                      labelMr: 'राहाता शाखा' },
  { id: 'vaijapur', label: 'Vaijapur Branch',                    labelMr: 'वैजापूर शाखा' },
  { id: 'khultabad',label: 'Khultabad Branch',                   labelMr: 'खुलताबाद शाखा' },
];
