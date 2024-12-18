import React from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface LanguageSwitcherProps {
  authToken: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ authToken }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const handleLanguageChange = async (event: React.MouseEvent<HTMLElement>, newLang: string) => {
    if (newLang && newLang !== currentLang) {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/change-language`, { language: newLang }, {
          headers: { Authorization: `Bearer ${authToken}` },
        }).then((response) => {
          if(response.data && response.data.language) {
            const lang = response.data.language;
            i18n.changeLanguage(lang);
            localStorage.setItem('language', lang);
          }
        });
      } catch (error) {
        console.error('Error changing language:', error);
      }
    }
  }

  return (
    <ToggleButtonGroup
      value={currentLang}
      exclusive
      onChange={handleLanguageChange}
      aria-label="Language Switch"
      sx={{ position: 'absolute', top: 16, right: 16, display: 'flex' }}
    >
      <ToggleButton value="en" sx={{ textTransform: 'none' }}>
        EN
      </ToggleButton>
      <ToggleButton value="bg" sx={{ textTransform: 'none' }}>
        BG
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageSwitcher;
