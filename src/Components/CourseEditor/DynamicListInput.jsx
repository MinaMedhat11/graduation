// src/Components/Shared/DynamicListInput.jsx
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Link } from '../../../node_modules/@mui/icons-material/index';

const DynamicListInput = ({ label, placeholder, values, onChange, name }) => {
  const handleAddInput = () => {
    onChange(name, [...values, '']);
  };

  const handleRemoveInput = (index) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(name, newValues);
  };

  const handleInputChange = (index, event) => {
    const newValues = values.map((value, i) => 
      i === index ? event.target.value : value
    );
    onChange(name, newValues);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
        {label} ({values.length}/8)
      </Typography>
      {values.map((value, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(index, e)}
            inputProps={{ maxLength: 120 }}
            helperText={value.length > 0 ? `${value.length}/120` : ' '}
            sx={{ mr: 1 }}
          />
          {values.length > 1 && (
            <IconButton 
              onClick={() => handleRemoveInput(index)} 
              size="small" 
              color="error"
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          )}
        </Box>
      ))}
      {values.length < 8 && (
        <Link 
          size="small" 
          startIcon={<AddCircleOutlineIcon />} 
          onClick={handleAddInput} 
          sx={{ textTransform: 'none' }}
        >
          Add new
        </Link>
      )}
    </Box>
  );
};

export default DynamicListInput;