import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

import {  NAV ,HEADER } from './config-layout';

const SPACING = 8;
export default function Main({selected, children, sx, ...other }) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        
        ...(selected && {
          px: 2,
          py: `${HEADER.H_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.MAXWIDTH}px)`,
        }),
        ...sx,
      }}
      {...other}
    >
      {children} 
    </Box>
  );
}

Main.propTypes = {
  selected: PropTypes.bool,
  children: PropTypes.node,
  sx: PropTypes.object,
};
