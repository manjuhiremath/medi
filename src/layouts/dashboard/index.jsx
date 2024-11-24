
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Nav from './nav';
import Main from './main';


export default function DashboardLayout({ children }) {
  return (
    <>
    <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav />
        <Main>{children}</Main>
      </Box>
      </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
