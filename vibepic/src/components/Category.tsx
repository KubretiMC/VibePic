import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Typography, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import useBreakpoints from '../hooks/useBreakpoints';

interface CategoryProps {
    categoryName: string;
    items: string[];
    onItemClick?: (item: string) => void;
    selectedProp?: string;
}

const Category: React.FC<CategoryProps> = ({ categoryName, items, onItemClick, selectedProp }) => {
  const { isLargeScreen, isMediumScreen } = useBreakpoints();
  
  return (
    <Accordion elevation={0} style={{backgroundColor: '#00A2E8'}} defaultExpanded={!!selectedProp}>
        <AccordionSummary className='acccordion-summary' expandIcon={<ExpandMoreIcon  sx={{ color: 'white' }} />}>
            <Typography style={{ fontSize: isLargeScreen ? 24 : isMediumScreen ? 20 : 16 }} color='white'>{categoryName}</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ paddingTop: 0 }} className='accordion-details'>
        {items.map((category, key) => (
            <Button key={key} style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 0 }}  onClick={() => onItemClick && onItemClick(category)}>
                <Typography style={{ textAlign: 'left', width: '100%', color: 'white', textTransform: 'none', }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </Typography>
                {category.toLowerCase() === selectedProp?.toLowerCase() &&
                    <IconButton  style={{ textAlign: 'left', width: 'auto', backgroundColor: 'transparent', boxShadow: 'none' }}>
                        <CloseOutlinedIcon style={{ color: 'white', fontSize: 18 }} />
                    </IconButton >
                }
            </Button>
        ))}
        </AccordionDetails>
    </Accordion>
  );
};

export default Category;
