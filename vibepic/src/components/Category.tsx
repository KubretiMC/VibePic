import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CategoryProps {
    categoryName: string;
    items: string[];
    onItemClick?: (item: string) => void;
}

const Category: React.FC<CategoryProps> = ({ categoryName, items, onItemClick }) => {
  return (
    <Accordion elevation={0} style={{backgroundColor: '#00A2E8'}}>
        <AccordionSummary className='acccordion-summary' expandIcon={<ExpandMoreIcon  sx={{ color: 'white' }} />}>
            <Typography fontSize={24} color='white'>{categoryName}</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ paddingTop: 0 }} className='accordion-details'>
        {items.map((category, key) => (
            <Button
                key={key}
                onClick={() => onItemClick && onItemClick(category)}
                sx={{
                    color: 'white',
                    paddingLeft: 0,
                    textTransform: 'none',
                    display: 'block',
                }}
            >
                <Typography sx={{ textAlign: 'left', width: '100%' }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </Typography>
            </Button>
        ))}
        </AccordionDetails>
    </Accordion>
  );
};

export default Category;
