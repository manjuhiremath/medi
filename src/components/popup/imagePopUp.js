import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Box, Divider, Icon, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Loading from "../loading";
import Scrollbar from "../scrollbar";
import { Image } from "@mui/icons-material";

const style = {
    box: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 550,
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
    Title,
    savetitle,
    closetitle,
    color,
    icon,
    images,
    loading

}) {

    return (
        <div>
            {loading && <Loading />}
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ overflow: "scroll" }}>
                <Box sx={style.box}>
                    <Grid container direction="row" alignItems="center">
                        <Icon sx={{ mr: .2, mt: 1.2 }} color="primary.main"> {icon}</Icon>
                        <Typography variant="h5" sx={{ mt: 2, fontWeight: 800 }}>
                            {Title}
                        </Typography>
                    </Grid>
                    <Divider sx={{ background: "grey", height: "1px", mt: 0, mb: 2 }} />
                    <ImageList sx={{ width: 1010, height: 350 }}>
                    <Scrollbar>
                        {images?(images.map((item) => (
                            <ImageListItem key={item.imageUrl}>
                                <img
                                    src={item.imageUrl}
                                    srcSet={item.imageUrl}
                                    alt={item.sequenceNo}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title={item.sequenceNo}
                                    position="below"
                                />
                            </ImageListItem>
                        ))):(<Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              height: '40vh'  // Adjust the height as needed
                            }}
                          >
                            <Typography variant="h5" align="center" sx={{ mt: 2, fontWeight: 200 }}>
                              No Images to preview.
                            </Typography>
                          </Box>)}
                    </Scrollbar>
                    </ImageList>
                    <Box>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            sx={{ mt: 4 }}
                        >
                            <Button variant="text"
                                onClick={onClose}
                                sx={{ ml: 2 }}
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
