import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

interface CategoryProps {
    categoryName: string;
    items: string[];
    onItemClick?: (item: string) => void;
    selectedProp?: string;
}

const Category: React.FC<CategoryProps> = ({ categoryName, items, onItemClick, selectedProp }) => {
  return (
    <Accordion elevation={0} style={{backgroundColor: '#00A2E8'}}>
        <AccordionSummary className='acccordion-summary' expandIcon={<ExpandMoreIcon  sx={{ color: 'white' }} />}>
            <Typography fontSize={24} color='white'>{categoryName}</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ paddingTop: 0 }} className='accordion-details'>
        {items.map((category, key) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Button
                    onClick={() => onItemClick && onItemClick(category)}
                    style={{
                        color: 'white',
                        paddingLeft: 0,
                        textTransform: 'none',
                    }}
                >
                    <Typography style={{ textAlign: 'left', width: '100%' }}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Typography>
                </Button>
                {category.toLowerCase() === selectedProp?.toLowerCase() &&
                    <IconButton  style={{ textAlign: 'left', width: 'auto', backgroundColor: 'transparent', boxShadow: 'none' }}>
                        <CloseOutlinedIcon style={{ color: 'white', fontSize: 18 }} />
                    </IconButton >
                }
            </div>
        ))}
        </AccordionDetails>
    </Accordion>
  );
};

export default Category;
