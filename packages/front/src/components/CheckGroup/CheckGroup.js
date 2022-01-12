
import { Button, ButtonGroup } from '@mui/material';
import React from 'react';

const CheckGroup = ({ value, onChange, options, ...props }) => {
  const handleChange = (index) => {
    onChange(options[index].value);
  };

  return <ButtonGroup variant="outlined" aria-label="outlined button group" {...props}>
    {options.map((option, index) => {
      const readOnly = option.value === value;
      return <Button key={option.value} readOnly={readOnly} variant={readOnly ? "contained" : "outlined"} onClick={() => handleChange(index)}>{option.label || option.value}</Button>;
    })}
  </ButtonGroup>;
};

export default CheckGroup