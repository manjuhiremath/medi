import { Alert, Box, Button, Card, Divider, IconButton, Snackbar, Switch, TextField, Tooltip, Typography } from "@mui/material";
import Scrollbar from "../../../components/scrollbar";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PopUp from "../../../components/popup";
import { v4 as uuidv4 } from 'uuid';

const DraggableList = ({ items, setItems, length, setLoading, id, disabled }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');

  const handleChange = async (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      setSnackbarColor('error');
      setSnackbarMessage('Please select image files');
      setSnackbarOpen(true);
      return;
    }
  
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setSnackbarColor('error');
      setSnackbarMessage('Invalid format. Only image files are allowed.');
      setSnackbarOpen(true);
      return;
    }
  
    const newItems = imageFiles.map((file, index) => {
      const uniqueFileName = `${uuidv4()}-${file.name}`;
      const newFile = new File([file], uniqueFileName, { type: file.type });
      return {
        sequenceNo: items.length + index + 1,
        imageUrl: URL.createObjectURL(file),
        isPublished: true,
        file: newFile
      };
    });
  
    if (newItems.length === 0) return;
  
    setLoading(true);
  
    try {
      const uploadPromises = newItems.map(async (item) => {
        const storageRef = ref(storage, `Pharmacy/${item.file.name}`);
        await uploadBytes(storageRef, item.file);
        const url = await getDownloadURL(storageRef);
        const imageObj = {
          sequenceNo: item.sequenceNo,
          imageUrl: url,
          isPublished: item.isPublished,
        };
        return imageObj;
      });
  
      const uploadedImages = await Promise.all(uploadPromises);
      const docRef = doc(db, 'services', id);
      await updateDoc(docRef, {
        images: arrayUnion(...uploadedImages),
      });
      setItems(prevItems => [...prevItems, ...uploadedImages]);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = [...items];
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      sequenceNo: index + 1
    }));

    setItems(updatedItems);
  };

  const togglePublish = (sequenceNo) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.sequenceNo === sequenceNo ? { ...item, isPublished: !item.isPublished } : item
      )
    );
  };

  const handleDelete = (sequenceNo) => {
    setItems(prevItems =>
      prevItems
        .filter(item => item.sequenceNo !== sequenceNo)
        .map((item, index) => ({
          ...item,
          sequenceNo: index + 1
        }))
    );
  };

  return (
    <Box sx={{ paddingBottom: 2, ml: 5 }}>
      <Card sx={{ pb: 4, mr: 10, mb: 2 }}>
        <Box display="flex" alignItems="center" sx={{ ml: 4, mt: 2, mb: 2 }}>
          <Typography variant="h6">Photos</Typography>
          <Tooltip title="Drag and drop the photos to adjust the sequence.">
            <IconButton >
              <InfoOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <TextField
            type='file'
            size='small'
            sx={{ width: '250px', ml: 3 }}
            accept="image/*"
            inputProps={{
              multiple: true
            }}
            onChange={handleChange}
            disabled={disabled}
          />
        </Box>
        <Divider />
        <Box mt={2} ml={2} mr={2}>
          {length === 0 || items.length === 0 ? (
            <Typography variant="body1" color="textSecondary" align="center">
              No Photos to preview.
            </Typography>
          ) : (
            <DragDropContext disabled={disabled} onDragEnd={handleDragEnd}>
              <Droppable isDropDisabled={disabled} droppableId="droppable" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ display: 'flex', overflowX: 'auto' }}
                  >
                    <Scrollbar style={{ height: '260px', width: '100%' }}>
                      <Box display="flex" flexDirection="row" sx={{ flexWrap: 'nowrap' }}>
                        {Array.isArray(items) && items.map((item, index) => (
                          <Draggable key={item.sequenceNo.toString()} draggableId={item.sequenceNo.toString()} index={index}>
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  userSelect: 'none',
                                  padding: 2,
                                  mr: 2,
                                  borderRadius: 1,
                                  minHeight: '230px',
                                  width: '260px',
                                  flex: '0 0 260px',
                                  border: '1px solid #ccc',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  backgroundColor: 'background.paper',
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={`banner-${item.sequenceNo}`}
                                  style={{
                                    width: '250px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '5px',
                                    opacity: disabled ? '0.8' : '1'
                                  }}
                                />
                                <Box mt={.5} display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                  <Box>
                                    <Switch
                                      size="small"
                                      checked={item.isPublished}
                                      disabled={disabled}
                                      onChange={() => togglePublish(item.sequenceNo)}
                                      color={item.isPublished ? 'primary' : 'error'}
                                    />
                                  </Box>
                                  <Typography variant='button' mr={1}>{item.sequenceNo}</Typography>

                                  <IconButton size="small" disabled={disabled} onClick={() => handleDelete(item.sequenceNo)} color="error">
                                    <DeleteIcon size="small" />
                                  </IconButton>
                                </Box>
                                <Typography variant='caption'>{item.isPublished ? 'published' : 'unpublished'}</Typography>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    </Scrollbar>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Box>
      </Card>
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
    </Box>
  );
};

export default DraggableList;