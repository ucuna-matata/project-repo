import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        dashboard: 'Dashboard',
        cv: 'CV Master',
        interview: 'Interview Prep',
        trainer: 'Trainer',
        settings: 'Settings',
      },
      auth: {
        login: 'Sign in with Google',
        logout: 'Logout',
      },
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome back!',
      },
      cv: {
        title: 'CV Master',
        create: 'Create CV',
        export: 'Export',
        generate: 'Generate with AI',
      },
      interview: {
        title: 'Interview Preparation',
        start: 'Start Interview',
        submit: 'Submit',
      },
      trainer: {
        title: 'Skills Trainer',
        start: 'Start Quiz',
      },
      settings: {
        title: 'Settings',
      },
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
      },
    },
  },
  uk: {
    translation: {
      nav: {
        dashboard: 'Панель',
        cv: 'Майстер CV',
        interview: 'Підготовка до співбесіди',
        trainer: 'Тренер',
        settings: 'Налаштування',
      },
      auth: {
        login: 'Увійти через Google',
        logout: 'Вийти',
      },
      dashboard: {
        title: 'Панель',
        welcome: 'З поверненням!',
      },
      cv: {
        title: 'Майстер CV',
        create: 'Створити CV',
        export: 'Експорт',
        generate: 'Згенерувати з AI',
      },
      interview: {
        title: 'Підготовка до співбесіди',
        start: 'Почати співбесіду',
        submit: 'Надіслати',
      },
      trainer: {
        title: 'Тренер навичок',
        start: 'Почати тест',
      },
      settings: {
        title: 'Налаштування',
      },
      common: {
        save: 'Зберегти',
        cancel: 'Скасувати',
        delete: 'Видалити',
        edit: 'Редагувати',
        loading: 'Завантаження...',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

