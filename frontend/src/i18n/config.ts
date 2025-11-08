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
        subtitle: 'Manage your account and preferences',
        
        profile: {
          title: 'Profile Information',
          fullName: 'Full Name',
          fullNamePlaceholder: 'Enter your full name',
          email: 'Email Address',
          emailPlaceholder: 'your.email@example.com',
          summary: 'Professional Summary',
          summaryPlaceholder: 'Brief description about yourself and your professional background...',
          saveChanges: 'Save Changes',
          saving: 'Saving...',
        },
        
        language: {
          title: 'Language',
          description: 'Choose your preferred language',
        },
        
        notifications: {
          title: 'Notifications',
          email: 'Email notifications',
          reminders: 'Interview reminders',
        },
        
        export: {
          title: 'Export Data',
          description: 'Download all your data including CV, interview results, and trainer scores in JSON format.',
          button: 'Export My Data',
          exporting: 'Exporting...',
        },
        
        privacy: {
          title: 'Privacy',
          analytics: 'Allow analytics cookies',
          essential: 'Essential cookies (required)',
        },
        
        danger: {
          title: 'Danger Zone',
          warning: 'Proceed with caution',
          description: 'Permanently delete your account and all associated data. This action cannot be undone.',
          button: 'Erase My Data',
          erasing: 'Erasing...',
        },
        
        profileUpdated: 'Profile updated successfully!',
        profileUpdateFailed: 'Failed to update profile. Please try again.',
        dataExported: 'Data exported successfully!',
        exportFailed: 'Failed to export data. Please try again.',
        dataErased: 'Data erasure request submitted. You will be logged out.',
        eraseFailed: 'Failed to erase data. Please try again.',
        eraseConfirm: 'Are you absolutely sure you want to erase all your data?\n\nThis will permanently delete:\n• Your profile and CV data\n• All interview sessions\n• All training results\n• Your account\n\nThis action CANNOT be undone!\n\nType "DELETE" in the next prompt to confirm.',
        erasePrompt: 'Type "DELETE" to confirm permanent deletion:',
        eraseCancelled: 'Deletion cancelled. Text did not match.',
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
        subtitle: 'Керуйте своїм акаунтом та налаштуваннями',
        
        profile: {
          title: 'Інформація профілю',
          fullName: 'Повне ім\'я',
          fullNamePlaceholder: 'Введіть ваше повне ім\'я',
          email: 'Email адреса',
          emailPlaceholder: 'your.email@example.com',
          summary: 'Професійне резюме',
          summaryPlaceholder: 'Короткий опис про вас та вашу професійну кар\'єру...',
          saveChanges: 'Зберегти зміни',
          saving: 'Збереження...',
        },
        
        language: {
          title: 'Мова',
          description: 'Оберіть бажану мову',
        },
        
        notifications: {
          title: 'Сповіщення',
          email: 'Email сповіщення',
          reminders: 'Нагадування про співбесіди',
        },
        
        export: {
          title: 'Експорт даних',
          description: 'Завантажте всі ваші дані включаючи CV, результати співбесід та оцінки тренувань у форматі JSON.',
          button: 'Експортувати мої дані',
          exporting: 'Експортування...',
        },
        
        privacy: {
          title: 'Приватність',
          analytics: 'Дозволити аналітичні cookies',
          essential: 'Необхідні cookies (обов\'язкові)',
        },
        
        danger: {
          title: 'Небезпечна зона',
          warning: 'Будьте обережні',
          description: 'Permanently видалити ваш акаунт та всі пов\'язані дані. Цю дію неможливо скасувати.',
          button: 'Видалити мої дані',
          erasing: 'Видалення...',
        },
        
        profileUpdated: 'Профіль успішно оновлено!',
        profileUpdateFailed: 'Не вдалося оновити профіль. Спробуйте ще раз.',
        dataExported: 'Дані успішно експортовано!',
        exportFailed: 'Не вдалося експортувати дані. Спробуйте ще раз.',
        dataErased: 'Запит на видалення даних надіслано. Ви будете вийшли з системи.',
        eraseFailed: 'Не вдалося видалити дані. Спробуйте ще раз.',
        eraseConfirm: 'Ви абсолютно впевнені, що хочете видалити всі свої дані?\n\nЦе назавжди видалить:\n• Ваш профіль та CV дані\n• Всі сесії співбесід\n• Всі результати тренувань\n• Ваш акаунт\n\nЦю дію НЕМОЖЛИВО скасувати!\n\nНаберіть "DELETE" в наступному запиті для підтвердження.',
        erasePrompt: 'Наберіть "DELETE" для підтвердження безповоротного видалення:',
        eraseCancelled: 'Видалення скасовано. Текст не співпав.',
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
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Зберігати мову при зміні
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;