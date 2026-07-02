import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    dashboard: "Dashboard",
    myProfile: "My Profile",
    jobSearch: "Job Search",
    savedJobs: "Saved Jobs",
    applications: "Applications",
    messages: "Messages",
    notifications: "Notifications",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    employerHub: "Employer Hub",
    companyProfile: "Company Profile",
    jobPostings: "Job Postings",
    candidates: "Candidates",
    overview: "Overview",
    resumeBuilder: "Resume Builder"
  },
  es: {
    dashboard: "Panel",
    myProfile: "Mi Perfil",
    jobSearch: "Buscar Empleo",
    savedJobs: "Empleos Guardados",
    applications: "Aplicaciones",
    messages: "Mensajes",
    notifications: "Notificaciones",
    login: "Iniciar Sesión",
    signup: "Regístrate",
    logout: "Cerrar Sesión",
    employerHub: "Centro de Empleadores",
    companyProfile: "Perfil de Empresa",
    jobPostings: "Publicaciones",
    candidates: "Candidatos",
    overview: "Visión General",
    resumeBuilder: "Creador de CV"
  },
  fr: {
    dashboard: "Tableau de Bord",
    myProfile: "Mon Profil",
    jobSearch: "Recherche d'Emploi",
    savedJobs: "Emplois Enregistrés",
    applications: "Candidatures",
    messages: "Messages",
    notifications: "Notifications",
    login: "Connexion",
    signup: "S'inscrire",
    logout: "Déconnexion",
    employerHub: "Espace Employeur",
    companyProfile: "Profil de l'Entreprise",
    jobPostings: "Offres d'Emploi",
    candidates: "Candidats",
    overview: "Aperçu",
    resumeBuilder: "Créateur de CV"
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('jobPortalLang') || 'en';
    setLang(savedLang);
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('jobPortalLang', newLang);
  };

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
