import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Divider, Icon } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const style = {
  box: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    boxShadow: 3,
    pb: 2,
    pr: 3,
    pl: 3,
    borderRadius: 2,
  },
};

export default function PopUp({
  open,
  onClose,
  loading,
  Title,
  onSubmit,
  savetitle,
  closetitle,
  description,
  color,
  icon,
  disabled
}) {

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "scroll" }}>
        <Box sx={style.box}>
          <Grid container direction="row" alignItems="center"> 
          <Icon sx={{mr:.2, mt:1.2}} color="primary.main"> {icon}</Icon>
            <Typography sx={{ mt: 2, fontWeight: 500, fontSize: "1.2rem" }}>
              {Title}
            </Typography>
          </Grid>
          <Divider sx={{ background: "grey", height: "1px", mt: 0,mb:2 }} />
          <Typography>{description}</Typography>
          <Box>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              sx={{ mt: 4 }}
            >
              <Button variant="contained"
              color={color}
               onClick={onSubmit} 
               disabled={disabled}
               >
                {/* <div style={style.button} > */}
                  {savetitle}
                  {/* </div> */}
              </Button>
              <Button variant="text"
               onClick={onClose} 
               sx={{ml:2}}
               >
                {closetitle}
              </Button>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
