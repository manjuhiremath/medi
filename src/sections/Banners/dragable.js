import React, { useEffect, useState } from 'react';
import { Box, Button, Card, IconButton, TextField, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useBanner } from '../../firebase/BannerService';
import PopUp from '../../components/popup';

function Dragable() {
    const {banners, fetchBanners, handleDragEnd, togglePublish, deleteBanner, updateBannerLink } = useBanner();
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [publishPopUp, setPublishPopUp] = useState(false);
    const [publishTarget, setPublishTarget] = useState(null);
    const [editingLinks, setEditingLinks] = useState({});
    const [editedLinks, setEditedLinks] = useState({}); // Object to hold the new link values

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleEditClick = (sequenceNo) => {
        setEditingLinks((prev) => ({
            ...prev,
            [sequenceNo]: !prev[sequenceNo],
        }));
    };

    const handleLinkChange = (e, sequenceNo) => {
        const newLink = e.target.value;
        setEditedLinks((prev) => ({
            ...prev,
            [sequenceNo]: newLink,
        }));
    };

    const handleUpdateLink = (sequenceNo) => {
        if (editedLinks[sequenceNo]) {
            updateBannerLink(sequenceNo, editedLinks[sequenceNo]); // Update the link in Firebase
        }
        handleEditClick(sequenceNo); // Close the edit mode
    };

    const handleDeleteClick = (sequenceNo, url) => {
        setDeleteTarget({ sequenceNo, url });
        setDeletePopUp(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteTarget) {
            deleteBanner(deleteTarget.sequenceNo, deleteTarget.url);
            setDeleteTarget(null);
            setDeletePopUp(false);
        }
    };

    const handlePublishClick = (sequenceNo) => {
        setPublishTarget(sequenceNo);
        setPublishPopUp(true);
    };

    const handlePublishConfirm = () => {
        if (publishTarget !== null) {
            togglePublish(publishTarget);
            setPublishTarget(null);
            setPublishPopUp(false);
        }
    };

    const isOnlyOneBannerPublished = () => {
        const publishedBanners = banners.filter(banner => banner.isPublished);
        return publishedBanners.length === 1;
    };

    const canUnpublish = (sequenceNo) => {
        return !(isOnlyOneBannerPublished() && banners.find(banner => banner.sequenceNo === sequenceNo)?.isPublished);
    };

    return (
        <Box style={{ maxWidth: '450px', marginLeft: '45px', marginTop: '20px', borderRadius: '5px' }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {banners.map((banner, index) => (
                                <Draggable key={banner.id} draggableId={banner.id} index={index}>
                                    {(provided) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            style={{
                                                userSelect: "none",
                                                padding: 16,
                                                margin: "0 0 8px 0",
                                                minHeight: "200px",
                                                border: '1px solid #8b8b8b',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                backdropFilter: 'blur(10px)',
                                                ...provided.draggableProps.style
                                            }}
                                        >

                                            <Box style={{ display: 'flex', }}>
                                                <div style={{ marginRight: '16px', cursor: 'grab' }}>
                                                    <img src={banner.url} alt={`banner-${index}`} style={{ marginLeft: "10px", width: '300px', height: '180px', borderRadius: '5px' }} />
                                                </div>
                                                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: "25px" }}>
                                                    <Typography variant='h5' mb={2}>{banner.sequenceNo}</Typography>
                                                    <Switch
                                                        color={banner.isPublished ? 'primary' : 'error'}
                                                        checked={banner.isPublished}
                                                        onClick={() => handlePublishClick(banner.sequenceNo)}
                                                    />
                                                    <Typography fontWeight={600} variant='caption' mb={4}>{banner.isPublished ? "Published" : "Unpublished"}</Typography>
                                                    <IconButton onClick={() => handleDeleteClick(banner.sequenceNo, banner.url)} color='error'><DeleteForeverRoundedIcon /></IconButton>
                                                </Box>
                                            </Box>
                                            <Box style={{ display: 'flex' }}>
                                                {editingLinks[banner.sequenceNo] ? (
                                                    <Box style={{ display: 'flex' }} ml={1} mt={1}>
                                                        <TextField
                                                            fullWidth
                                                            size='small'
                                                            value={editedLinks[banner.sequenceNo] || banner.link}
                                                            onChange={(e) => handleLinkChange(e, banner.sequenceNo)}
                                                            ml={4} mt={2}
                                                        />
                                                        <Button sx={{ ml: 2 }} onClick={() => handleUpdateLink(banner.sequenceNo)} variant='outlined'>Update</Button>
                                                    </Box>
                                                ) : (
                                                    <Box style={{ display: 'flex' }} sx={{ paddingTop: 1 }}>
                                                        <Typography mt={2} ml={3}>{banner.link}</Typography>
                                                        <Box ml={1} mt={1}>
                                                            <IconButton onClick={() => handleEditClick(banner.sequenceNo)}>
                                                                <EditRoundedIcon sx={{ fontSize: 20 }} />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {deletePopUp && (
                <PopUp
                    open={deletePopUp}
                    onClose={() => setDeletePopUp(false)}
                    submitText={"Delete"}
                    Title={isOnlyOneBannerPublished() && banners.find(b => b.sequenceNo === deleteTarget?.sequenceNo)?.isPublished
                        ? "Could not proceed with your request."
                        : 'Are you sure you want to delete?'}
                    savetitle={'Delete'}
                    closetitle={"Close"}
                    color={"error"}
                    disabled={(banners.length === 1) || (isOnlyOneBannerPublished() && banners.find(b => b.sequenceNo === deleteTarget?.sequenceNo)?.isPublished)}
                    onSubmit={handleDeleteConfirm}
                    icon={<WarningAmberRoundedIcon sx={{ fontSize: 22 }} />}
                    description={(banners.length === 1) || (isOnlyOneBannerPublished() && banners.find(b => b.sequenceNo === deleteTarget?.sequenceNo)?.isPublished)
                        ? "There should be at least one banner to display in Medblik app."
                        : "This action will permanently delete the banner. To keep it as a draft, mark it as unpublished."}
                />
            )}

            {publishPopUp && (
                <PopUp
                    open={publishPopUp}
                    onClose={() => setPublishPopUp(false)}
                    submitText={publishTarget && banners.find(b => b.sequenceNo === publishTarget)?.isPublished ? "Unpublish" : "Publish"}
                    Title={'Confirmation'}
                    savetitle={publishTarget && banners.find(b => b.sequenceNo === publishTarget)?.isPublished ? "Unpublish" : "Publish"}
                    closetitle={"Close"}
                    color={publishTarget && banners.find(b => b.sequenceNo === publishTarget)?.isPublished ? "error" : "success"}
                    onSubmit={handlePublishConfirm}
                    disabled={!canUnpublish(publishTarget)}
                    icon={<InfoOutlinedIcon sx={{ fontSize: 21 }} />}
                    description={
                        isOnlyOneBannerPublished() && banners.find(b => b.sequenceNo === publishTarget)?.isPublished
                            ? "Could not proceed with your request because there should be at least one banner to be published to display in Medblik app."
                            : `Are you sure you want to ${publishTarget && banners.find(b => b.sequenceNo === publishTarget)?.isPublished ? "unpublish this banner? Users won't see this banner in the app once unpublished." : "publish this banner? Users will see this banner in the app once published."}`
                    }
                />
            )}
        </Box>
    );
}

export default Dragable;
