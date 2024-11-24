import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../../components/iconify';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function UserTableToolbar({ filterName, onFilterName, alignment, handleChange }) {
  return (
    <Toolbar
      sx={{
        display: 'flex',
        justifyContent: 'end',
      }}
    >
      <OutlinedInput
        sx={{ width: 140, height: 30 }}
        value={filterName}
        onChange={onFilterName}
        placeholder="Search..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 15, height: 15 }} />
          </InputAdornment>
        }
      />
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  alignment: PropTypes.string,
  handleChange: PropTypes.func,
};
