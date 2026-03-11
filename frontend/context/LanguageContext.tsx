import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Layout & Navigation
    'nav.dashboard': 'Dashboard',
    'nav.inventory': 'Inventory',
    'nav.categories': 'Categories',
    'nav.purchases': 'Purchases',
    'nav.billing': 'Billing',
    'nav.activity': 'Activity',
    'nav.management': 'Management',
    'nav.operations': 'Operations',
    'nav.system': 'System',
    'nav.lock': 'Lock System',
    'nav.signout': 'Sign Out',
    'nav.home': 'Home',
    'nav.stock': 'Stock',
    'nav.tags': 'Tags',
    'nav.buy': 'Buy',
    'nav.account': 'Account',
    'nav.system_actions': 'System Actions',
    'nav.admin_panel': 'Admin Panel',
    'nav.language': 'Language',

    // Login & Lock Screen
    'auth.welcome': 'Welcome back',
    'auth.title': 'Swami Inventory',
    'auth.subtitle': 'Business Operations Portal',
    'auth.identity': 'Identity',
    'auth.access_key': 'Access Key',
    'auth.enter': 'Enter System',
    'auth.unlock': 'Unlock',
    'auth.unlock_placeholder': 'Enter password to unlock',
    'auth.switch_account': 'Switch Account',
    'auth.invalid_creds': 'Invalid credentials. Please try again.',
    'auth.error': 'An error occurred during login.',

    // Common Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.add': 'Add',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.search': 'Search',
    'action.filter': 'Filter',
  },
  mr: {
    // Layout & Navigation
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.inventory': 'मालसाठा',
    'nav.categories': 'वर्ग',
    'nav.purchases': 'खरेदी',
    'nav.billing': 'बिलिंग',
    'nav.activity': 'हालचाल इतिहास',
    'nav.management': 'व्यवस्थापन',
    'nav.operations': 'कामकाज',
    'nav.system': 'सिस्टम',
    'nav.lock': 'सिस्टम लॉक करा',
    'nav.signout': 'बाहेर पडा',
    'nav.home': 'मुख्यपृष्ठ',
    'nav.stock': 'साठा',
    'nav.tags': 'टॅग्स',
    'nav.buy': 'खरेदी करा',
    'nav.account': 'खाते',
    'nav.system_actions': 'सिस्टम क्रिया',
    'nav.admin_panel': 'प्रशासक पॅनेल',
    'nav.language': 'भाषा',

    // Login & Lock Screen
    'auth.welcome': 'स्वागत आहे',
    'auth.title': 'स्वामी इन्व्हेंटरी',
    'auth.subtitle': 'व्यवसाय ऑपरेशन्स पोर्टल',
    'auth.identity': 'ओळख',
    'auth.access_key': 'प्रवेश की',
    'auth.enter': 'सिस्टममध्ये प्रवेश करा',
    'auth.unlock': 'अनलॉक करा',
    'auth.unlock_placeholder': 'अनलॉक करण्यासाठी पासवर्ड टाका',
    'auth.switch_account': 'खाते बदला',
    'auth.invalid_creds': 'अवैध क्रेडेंशियल. कृपया पुन्हा प्रयत्न करा.',
    'auth.error': 'लॉगिन दरम्यान त्रुटी आली.',

    // Common Actions
    'action.save': 'जतन करा',
    'action.cancel': 'रद्द करा',
    'action.add': 'जोडा',
    'action.edit': 'संपादन करा',
    'action.delete': 'हटवा',
    'action.search': 'शोधा',
    'action.filter': 'फिल्टर',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
