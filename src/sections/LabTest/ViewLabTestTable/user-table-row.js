import PropTypes from "prop-types";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import { Box, Button, Icon } from "@mui/material";
import { useState } from "react";
import ImagePopUp from '../../../components/popup/imagePopUp';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import Label from '../../../components/label';

export default function UserTableRow({
  selected,
  name,
  area,
  pincode,
  images,
  loading,
  view,
  isActive
}) {

  const [preview, setPreview] = useState(false);
  const handlePreview = (event) => {
    event.stopPropagation();
    setPreview(true)
  }


  return (
    <>
      <TableRow onClick={view} hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell align="center" style={{ padding: "1px" }}>
          <Typography align="center" variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>
        <TableCell align="center" style={{ padding: "1px" }}>
          {area}
        </TableCell>
        <TableCell align="center" style={{ padding: "1px" }}>
          {pincode}
        </TableCell>
        <TableCell align="center" style={{ padding: "1px" }}>
          <Label color={isActive ? 'success' : 'error'}>{isActive ? ('Active') : ('InActive')}</Label>
        </TableCell>
        <TableCell align="center" style={{ padding: "1px" }}>
          <Box display="flex" alignItems="center" width="100%">
            <Box display="flex" justifyContent="center" ml={5} flexGrow={1}>
              <Button onClick={handlePreview} color="info">
                Preview
              </Button>
            </Box>
            <Box pr={2} display="flex" justifyContent="flex-end">
              <Icon color='disabled'>
                <KeyboardArrowRightRoundedIcon />
              </Icon>
            </Box>
          </Box>
        </TableCell>
        <TableCell align="center" style={{ padding: "1px" }}>
        </TableCell>
      </TableRow>
      {preview && (
        <ImagePopUp
          open={preview}
          onClose={() => {
            setPreview(false)
          }}
          submitText={"Update"}
          loading={loading}
          Title={'Images'}
          closetitle={"Close"}
          images={images}
          color={'success'}
          description={"The following details will be added"}
        />
      )}
    </>
  );
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func,
  name: PropTypes.any,
  selected: PropTypes.any,
  area: PropTypes.any,
  pincode: PropTypes.number,
  images: PropTypes.any,
};
