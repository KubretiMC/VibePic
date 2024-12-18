import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import useBreakpoints from '../hooks/useBreakpoints';
import { useTranslation } from 'react-i18next';

interface CategoryProps {
    categoryName: string;
    items: string[];
    onItemClick?: (item: string) => void;
    isMobileDrawerOpen: boolean;
    selectedProp?: string;
}

const Category: React.FC<CategoryProps> = ({ categoryName, items, onItemClick, isMobileDrawerOpen, selectedProp }) => {
  const { t } = useTranslation();
  const { isLargeScreen, isMediumScreen } = useBreakpoints();
  
  return (
    <Accordion elevation={0} sx={{backgroundColor: '#00A2E8'}} defaultExpanded={!!selectedProp}>
        <AccordionSummary expandIcon={<ExpandMoreIcon  sx={{ color: 'white' }} />}>
            <Typography sx={{ fontSize: isMobileDrawerOpen ? 60 : isLargeScreen ? 24 : isMediumScreen ? 20 : 16 }} color='white'>{categoryName}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ paddingTop: 0 }}>
        {items.map((category, key) => (
            <Button 
                key={key} 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    paddingLeft: 0 
                }}  
                onClick={() => onItemClick && onItemClick(category)}
            >
                <Typography 
                    sx={{ 
                        fontSize: isMobileDrawerOpen ? 32 : 18, 
                        textAlign: 'left', 
                        width: '100%', 
                        color: 'white', 
                        textTransform: 'none'
                    }}
                >
                    {t(category.charAt(0).toUpperCase() + category.slice(1))}
                </Typography>
                {category.toLowerCase() === selectedProp?.toLowerCase() &&
                    <IconButton 
                        sx={{ 
                            textAlign: 'left', 
                            width: 'auto', 
                            backgroundColor: 'transparent', boxShadow: 'none'
                        }}
                    >
                        <CloseOutlinedIcon sx={{ color: 'white', fontSize: isMobileDrawerOpen ? 32 : 18 }} />
                    </IconButton >
                }
            </Button>
        ))}
        </AccordionDetails>
    </Accordion>
  );
};

export default Category;
