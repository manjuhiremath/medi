import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { TextAndTextarea } from '../../_mock/components';
import FaqContext from '../../firebase/FaqContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Delete } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function Faq() {
    const { deleteFaq, addFaq, faqs,fetchRadius, updateFaqSequence,addRadius } = useContext(FaqContext);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [radius, setRadius] = useState();
    const [isDisabled,setIsDisabled] = useState(true);

    useEffect(() => {
        const fetchInitialRadius = async () => {
          const fetchedRadius = await fetchRadius(); // Call the async fetch function
          if (fetchedRadius) {
            setRadius(fetchedRadius); // Set radius once fetched
          }
        };
    
        fetchInitialRadius(); // Call the function inside useEffect
      }, []); // Empty dependency array to run this only once when component mounts
    
      const handleSubmitRadius = () => {
        const numericRadius = Number(radius);
        if (numericRadius) {
          addRadius(numericRadius); // Call the addRadius function to update Firestore
          setTimeout(() => {
            window.location.reload(); // Reload the page after 1 second
          }, 1000);
        }
      };
    const handleSubmit = () => {
        if (question && answer) {
            addFaq(question, answer);
            setQuestion('');
            setAnswer('');
        }
    };
    const handleEdit=()=>{
        setIsDisabled(false);
    }
    const sortedFaqs = [...faqs].sort((a, b) => a.sequenceNo - b.sequenceNo);
    const handleDragEnd = (result) => {
        updateFaqSequence(result);
    };
   
    return (
        <>
            <Card style={{ margin: 12 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" pb={1} pt={1} mr={4} mb={1} ml={4} mt={1}>
                    <Typography variant="h4">FAQ's</Typography>
                </Stack>

            </Card>
            <Card style={{ display: 'flex', margin: 12, paddingBottom: 15 }}>
                <TextAndTextarea
                    name="Question"
                    placeholder="Enter Question"
                    type="text"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <TextAndTextarea
                    name="Answer"
                    placeholder="Enter Answer"
                    type="text"
                    required
                    multiline
                    minRows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
                <Box m={2}>
                    <Button variant="outlined" color="success" onClick={handleSubmit}>
                        Save
                    </Button>
                </Box>

            </Card>
            <Card style={{ display: 'flex', margin: 12, paddingBottom: 15 }}>
                    <TextAndTextarea
                        name="Radius"
                        placeholder="Enter Radius"
                        type="number"
                        disabled={isDisabled}
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                    />
                    <Box mt={2} mb={2}>
                    {isDisabled?(<Button variant="contained" color="primary" onClick={handleEdit}>
                        Edit
                    </Button>):(<Button variant="outlined" color="success" onClick={handleSubmitRadius}>
                            Save
                        </Button>)}
                    </Box>
            </Card>
            <Box display={'flex'}>
                <Typography style={{ margin: 20 }} variant="h5" pb={.3}>
                    Faqs ({faqs.length})
                </Typography>
                <Tooltip title="Rearrange the sequence using drag and drop. Your changes here will reflect in the app's sequence as well." placement="top">
                    <InfoOutlinedIcon style={{ marginTop: 28 }} sx={{ fontSize: 18 }} color='primary' />
                </Tooltip>
            </Box>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="faqs">
                    {(provided) => (
                        <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ padding: '0 12px' }}
                        >
                            {sortedFaqs.map((faq, index) => (
                                <Draggable key={faq.id} draggableId={faq.id} index={index}>
                                    {(provided) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                marginBottom: '8px',
                                                maxWidth: '450px', // Set the width of the Card to 300px
                                                width: '100%',
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            <Stack direction="row" alignItems="center" p={2}>
                                                <Box>
                                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                                        <Typography variant="h6" style={{ fontSize: '1rem' }}>
                                                            {faq.sequenceNo}. {faq.question}
                                                        </Typography>
                                                        <IconButton onClick={(e) => deleteFaq(faq.id)} ><Delete color='error' fontSize='small' /></IconButton>
                                                    </Box>
                                                    <Typography ml={3} variant="h6" style={{ textAlign: 'justify', fontSize: '.8rem' }}>
                                                        {faq.answer}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

        </>
    );
}

export default Faq;