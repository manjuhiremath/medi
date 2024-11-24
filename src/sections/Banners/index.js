import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Dragable from './dragable';
import Loading from '../../components/loading';
import PopUp from '../../components/popup';
import { Alert, Box, Tooltip } from '@mui/material';
import { useBanner } from '../../firebase/BannerService';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Card from '@mui/material/Card';
import { v4 as uuidv4 } from 'uuid';

export default function Banner() {
    const { loading, handleAdd, bannerCount } = useBanner();
    const [popUp, setPopUp] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarColor, setSnackbarColor] = useState('');
    const [isdisabled, setIsDisabled] = useState(true);
    const [errors, setErrors] = useState({});
    const [link, setLink] = useState('');
    const handleChange = (e) => {
        const files = e.target.files;
        if (files.length === 0) {
            setIsDisabled(true);
            setPopUp(false);
            setSnackbarColor('error');
            setSnackbarMessage('Please select image files');
            setSnackbarOpen(true);
            return;
        }

        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            setIsDisabled(true);
            setSnackbarColor('error');
            setSnackbarMessage('Invalid format. Only image files are allowed.');
            setSnackbarOpen(true);
            return;
        }
        setIsDisabled(false);
        const validFiles = [];
        for (let file of files) {
            if (file && file.type.startsWith('image/')) {
                const uniqueFileName = `${uuidv4()}-${file.name}`;
                const newFile = new File([file], uniqueFileName, { type: file.type });
                validFiles.push(newFile);
            } else {
                setSnackbarColor('error');
                setSnackbarMessage('Invalid format: Only image files are allowed');
                setSnackbarOpen(true);
                return;
            }
        }
        setSelectedImages(validFiles);
        setIsDisabled(false);
    };
    const validateURL = (value) => {
        const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)\S*$/;
        return urlRegex.test(value) ? '' : 'Invalid URL';
    };

    const handleLink = (e) => {
        const value = e.target.value;
        setLink(value);
        const error = validateURL(value);
        setErrors((prevErrors) => ({ ...prevErrors, link: error }));
    };
    
    const handleAddImages = async () => {
        if (selectedImages.length > 0) {
            await handleAdd(selectedImages,link);
            setSelectedImages([]);
            setPopUp(false);
            setIsDisabled(true);
            setSnackbarMessage('Images Saved');
            setSnackbarColor('success');
            setSnackbarOpen(true);
        }

    };
    return (
        <div style={{ overflow: 'hidden' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" ml={4} mt={1}>
                <Typography variant="h4">Manage Banners</Typography>
            </Stack>
            {loading && <Loading />}
            <form noValidate autoComplete="off">
                <Card sx={{ ml: 5, mt: 1, mb: 1, pl: 5, pt: 2, pb: 2, mr: '10%' }}>
                    <Stack direction="row" alignItems="center" spacing={8}>
                        <Typography >Add Banner :</Typography>
                        <TextField
                            sx={{ width: 260 }}
                            ml={7}
                            size="small"
                            variant="outlined"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            inputProps={{
                                multiple: true
                            }}
                        />
                        <Typography >Add Link :</Typography>
                        <TextField
                            sx={{ width: 260 }}
                            ml={7}
                            size="small"
                            variant="outlined"
                            type="text"
                            value={link}
                            onChange={handleLink}
                            error={!!errors.link}
                            helperText={errors.link}
                        />
                        <Box alignItems="center">
                            <Button ml={1} variant="outlined" disabled={isdisabled} color="primary" onClick={() => { setPopUp(true); }}>
                                Save
                            </Button></Box>
                    </Stack>
                </Card>
            </form>
            <Stack direction="row" alignItems="center" ml={4} mt={2}>
                <Typography variant="h5" mr={1} pb={.3}>Banners({bannerCount}) </Typography>
                <Tooltip title="Rearrange the sequence using drag and drop. Your changes here will reflect in the app's sequence as well." placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 18 }} color='primary' />
                </Tooltip>
            </Stack>

            <Dragable />

            {popUp && (
                <PopUp
                    open={popUp}
                    onClose={() => setPopUp(false)}
                    submitText={"Update"}
                    loading={loading}
                    Title={'Are you sure?'}
                    savetitle={'Save'}
                    closetitle={"Close"}
                    onSubmit={handleAddImages}
                    icon={<InfoOutlinedIcon sx={{ fontSize: 22 }} />}
                    color={'success'}
                    description={"Once Saved Banner will be in unpublished state. Please publish to see in the app."}
                />
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarColor}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
