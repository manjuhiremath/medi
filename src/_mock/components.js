import { Box, Card, Checkbox, Chip, Divider, FormControl, FormControlLabel, ListItemText, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback } from "react";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

function RadioButtonGroup({ name, value, onChange, disabled, options }) {
  return (
    <Box display="flex" alignItems="top" sx={{ ml: 2, width: 280, px: 2 }}>
      <FormControl component="fieldset">
        <RadioGroup row value={value} onChange={onChange}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              disabled={disabled}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}


const filter = createFilterOptions();

function Dropdown({
  multiple = true,
  name,
  value,
  onChange,
  Items = [],
  error,
  helperText,
  disabled,
  isEmpty,
  isSelectAll = true,
  isChecked
}) {
  const [item, setItem] = useState(value);

  const handleAddItem = useCallback(
    async (newItem) => {
      if (newItem && !Items.includes(newItem)) {
        try {
          const updatedValue = multiple
            ? Array.isArray(item)
              ? [...item, newItem]
              : [newItem]
            : newItem; // For single selection, store only one value.

          setItem(updatedValue);
          onChange({ target: { value: updatedValue } });
        } catch (error) {
          console.error('Error adding item: ', error);
        }
      }
    },
    [Items, item, multiple, onChange]
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setItem(Items); // Add all items to the dropdown
      onChange({ target: { value: Items } });
    } else {
      setItem([]); // Clear all selected items
      onChange({ target: { value: [] } });
    }
  };

  return (
    <Box sx={{ width: 'calc(100% - 48px)' }}>
      <Autocomplete
        size="small"
        fullWidth
        multiple={multiple}
        disabled={isEmpty}
        value={multiple ? (Array.isArray(item) ? item : [item]) : item}
        onChange={(event, newValue) => {
          if (multiple) {
            const lastValue = newValue?.[newValue.length - 1];
            if (lastValue && lastValue.startsWith('Add New:')) {
              const newItem = lastValue.replace('Add New: "', '').replace('"', '');
              handleAddItem(newItem);
            } else {
              setItem(newValue);
              onChange({ target: { value: newValue } });
            }
          } else {
            const selectedValue = newValue ? newValue.replace('Add New: "', '').replace('"', '') : null;
            setItem(selectedValue);
            onChange({ target: { value: selectedValue } });
          }
        }}
        options={Array.isArray(Items) ? Items : []}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;
          if (inputValue !== '' && !options.includes(inputValue)) {
            filtered.push(`Add New: "${inputValue}"`);
          }
          return filtered;
        }}
        renderInput={(params) => (
          <TextField
            disabled={disabled}
            size="small"
            {...params}
            placeholder={'Select ' + name}
            error={error}
            helperText={helperText}
          />
        )}
        renderTags={(value, getTagProps) => {
          if (!multiple) {
            return null;
          }

          const items = Array.isArray(item) ? item : [item];
          if (items.length > 0) {
            return items.map((option, index) => (
              <Chip
                key={index}
                label={option}
                sx={{
                  fontSize: '0.75rem',
                  height: '20px',
                  borderRadius: '10px',
                  '& .MuiChip-deleteIcon': {
                    width: '15px',
                    height: '15px',
                  },
                }}
                variant="outlined"
                {...getTagProps({ index })}
              />
            ));
          } else {
            return ' ';
          }
        }}
      />
         {isSelectAll && (
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isChecked}
                onChange={handleSelectAll} 
              />
            }
            color="primary"
            label="Select all"
          />
        </Box>
      )}
    </Box>
  );
}


function MultiInput({ value,handleAddItem, disabled, error, helperText, inputValue, setInputValue, Items = [], handleDeleteItem, errors, isDisabled }) {
  if (!Array.isArray(Items)) {
    Items = [];
  }

  return (
    <Box>
      <Box display="flex" alignItems="top" sx={{ width: 270 }}>
        <TextField
          placeholder="Enter the items"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddItem(e);
            }
          }}
          disabled={disabled}
          style={{ width: 260 }}
          size="small"
          error={error}
          helperText={helperText}
        />
      </Box>
      <Box sx={{ ml: 3, mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: 900 }}>
        {value.map((name, index) => (
          <Chip
            key={index}
            label={name}
            disabled={isDisabled}
            onDelete={isDisabled ? undefined : () => handleDeleteItem(index)}
            deleteIcon={isDisabled ? undefined : <DeleteIcon />}
          />
        ))}
      </Box>
    </Box>
  );
}


function TextAndTextarea({
  name,
  placeholder,
  type,
  value,
  onChange,
  required,
  multiline = false,
  minRows = 1,
  Items,
  error,
  id,
  helperText,
  multiSelectedItems,
  disabled,
  radioOptions,
  errors,
  isDisabled,
  multiple,
  inputValue,
  setInputValue,
  handleAddItem,
  handleDeleteItem,
  isEmpty,
  isSelectAll
}) {
  const isDropdown = type === 'dropdown';
  const isRadio = type === 'radio';
  const isMultiInput = type === 'multiInput';
  const [showFullText, setShowFullText] = useState(false);
  const handleReadMoreClick = () => {
    setShowFullText(!showFullText);
  };
  const maxItemsToShow = 2;
  const displayText = Array.isArray(value) ? value.join(', ') : value;
  const shouldTruncate = Array.isArray(value) && value.length > maxItemsToShow && !showFullText;
  const truncatedText = Array.isArray(value)
    ? value.slice(0, maxItemsToShow).join(', ')
    : value;

  return (
    <Box display="flex" alignItems="top" sx={{ ml: 2, width: 480, mt: 2, px: 2 }}>
      <Typography
        sx={{
          mr: 1,
          color: disabled ? 'gray' : 'inherit',
          width: disabled ? '150px' : '350px',
        }}
      >
        {name}
        <span style={{ color: 'red' }}>{required && '*'}</span> :
      </Typography>
      {disabled ? (
        <Typography sx={{ mr: 1, width: '290px' }}>
          {shouldTruncate ? truncatedText + '...' : displayText}
          {Array.isArray(value) && value.length > maxItemsToShow && (
            <span
              onClick={handleReadMoreClick}
              style={{
                color: '#1976d2',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            >
              {showFullText ? '  Show Less' : ` +${value.length - maxItemsToShow} more`}
            </span>
          )}
        </Typography>
      ) : isDropdown ? (
        <Dropdown
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          Items={Items}
          error={error}
          id={id}
          isEmpty={isEmpty}
          multiple={multiple}
          helperText={helperText}
          multiSelectedItems={multiSelectedItems}
          isSelectAll = {isSelectAll}
        />
      ) : isRadio ? (
        <RadioButtonGroup
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          options={radioOptions}
        />
      ) : isMultiInput ? (
        <MultiInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleAddItem={handleAddItem}
          Items={Items}
          value={value}
          handleDeleteItem={handleDeleteItem}
          errors={errors}
          isDisabled={isDisabled}
        />
      ) : (
        <TextField
          size="small"
          sx={{ width: 'calc(100% - 48px)' }}
          placeholder={placeholder}
          type={type}
          value={value}
          multiline={multiline}
          onChange={onChange}
          required={required}
          minRows={minRows}
          error={error}
          helperText={helperText}
          disabled={disabled}
        />
      )}
    </Box>
  );
}


function FormSection({ title, fields }) {

  return (
    <Box sx={{ paddingBottom: 2, ml: 5 }}>
      <Card sx={{ pb: 4, mr: 10, mb: 2 }}>
        <Typography sx={{ ml: 4, mt: 2 }} variant="h6">{title}</Typography>
        <Divider />
        {fields.map((fieldGroup, index) => (
          <Box key={index} display="flex">
            {fieldGroup.map((field, idx) => (
              <TextAndTextarea
                key={idx}
                name={field.name}
                placeholder={field.placeholder}
                type={field.type}
                value={field.value}
                onChange={field.onChange}
                required={field.required}
                multiline={field.multiline}
                minRows={field.minRows}
                error={field.error}
                id={field.id}
                helperText={field.helperText}
                disabled={field.disabled}
                radioOptions={field.radioOptions}
                Items={field.Items}
                multiple={field.multiple}
                multiSelectedItems={field.multiSelectedItems}
                inputValue={field.inputValue}       // For MultiInput
                setInputValue={field.setInputValue} // For MultiInput
                handleAddItem={field.handleAddItem} // For MultiInput                // For MultiInput
                handleDeleteItem={field.handleDeleteItem} // For MultiInput
                errors={field.errors}               // For MultiInput
                isDisabled={field.isDisabled}
                isEmpty={field.isEmpty}
                isSelectAll={field.isSelectAll}
              />
            ))}
          </Box>
        ))}
      </Card>
    </Box>
  );
}

export {
  Dropdown,
  TextAndTextarea,
  FormSection,
  MultiInput
};