import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './Category.css';

interface CategoryProps {
    categoryName: string;
    items: string[];
}

const Category: React.FC<CategoryProps> = ({ categoryName, items }) => {
  return (
    <Accordion elevation={0} style={{backgroundColor: '#00A2E8'}}>
        <AccordionSummary className='acccordion-summary' expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography className='title'>{categoryName}</Typography>
        </AccordionSummary>
        <AccordionDetails className='accordion-details'>
            {items.map((category, key) => {
                return <Typography key={key} className='items'>{category}</Typography>
            })}
        </AccordionDetails>
    </Accordion>
  );
};

export default Category;
