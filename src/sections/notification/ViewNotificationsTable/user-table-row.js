import PropTypes from "prop-types";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";
import Image from "../../../components/popup/image";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useNotifications } from "../../../firebase/NotificaionService";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PopUp from "../../../components/popup";

export default function UserTableRow({
  selected,
  title,
  description,
  image,
  view,
  id
}) {

  const [preview, setPreview] = useState(false);
  const [popUp, setPopUp] = useState(false);

  const { fetchAndSendNotifications, loading, deleteNotification } = useNotifications();

  const handleDelete = (event) => {
    event.stopPropagation();
    deleteNotification(id, image);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    try {
      await fetchAndSendNotifications(title, description, image);
      setPopUp(false);  // Close the popup after sending
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  };

  return (
    <>
      <TableRow onClick={view} hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell align="center" style={{ padding: "1px" }}>
          <Typography align="center" variant="subtitle2" noWrap>
            {title}
          </Typography>
        </TableCell>
        <TableCell align="center" style={{ padding: "1px" }}>
          {description}
        </TableCell>
        <TableCell align="center" style={{ padding: "1px" }}>
          <Button color='primary' onClick={() => setPopUp(true)}>Send</Button>
        </TableCell>
        <TableCell align="center" style={{ padding: "1px" }}>
          <IconButton color='error' onClick={handleDelete}><DeleteForeverRoundedIcon /></IconButton>
        </TableCell>
      </TableRow>

      {popUp && (
        <PopUp
          open={popUp}
          onClose={() => setPopUp(false)}
          submitText={"Send"}
          loading={loading}
          Title={'Are you sure?'}
          savetitle={'Send'}
          closetitle={"Close"}
          onSubmit={handleSend}
          icon={<InfoOutlinedIcon sx={{ fontSize: 22 }} />}
          color={'success'}
          description={"The notification will be sent to the all user's devices."}
        />
      )}
      {preview && (
        <Image
          open={preview}
          onClose={() => setPreview(false)}
          submitText={"Update"}
          loading={loading}
          Title={'Images'}
          closetitle={"Close"}
          images={image}
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
