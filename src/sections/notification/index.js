import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Loading from '../../components/loading';
import { useContext } from 'react';
import { AuthContext } from '../../firebase/AuthContext';
import { Alert, Box, Card, Snackbar, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
import TableNoData from './ViewNotificationsTable/table-no-data';
import UserTableRow from './ViewNotificationsTable/user-table-row';
import UserTableHead from './ViewNotificationsTable/user-table-head';
import TableEmptyRows from './ViewNotificationsTable/table-empty-rows';
import UserTableToolbar from './ViewNotificationsTable/user-table-toolbar';
import Scrollbar from '../../components/scrollbar';
import { useNotifications } from '../../firebase/NotificaionService';
import { v4 as uuidv4 } from 'uuid';
import { applyFilter, emptyRows, getComparator } from './ViewNotificationsTable/utils';

function TextAndTextarea({
  name,
  placeholder,
  type,
  value,
  onChange,
  required,
  multiline = false,
  minRows = 1,
}) {
  return (
    <Box display="flex" alignItems="center" sx={{ ml: 2, width: 430, mt: 2, px: 2 }}>
      <Typography sx={{ mr: 1, width: '220px' }}>
        {name} {required && <span style={{ color: 'red' }}>{'*'}</span>} :
      </Typography>
      <TextField
        size="small"
        sx={{ width: 'calc(100% - 48px)' }}
        placeholder={placeholder}
        type={type}
        value={value}
        multiline={multiline}
        onChange={onChange}
        required={required}
        minRows={minRows}
      />
    </Box>
  );
}

export const Notification = () => {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const { notifications, loading, addNotification } = useNotifications();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };


  useEffect(() => {
    if (title.trim() && description.trim()) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [title, description]);

  const handleAddNotification = async () => {
    await addNotification(title, description );
    setTitle('');
    setDescription('');
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const [alignment, setAlignment] = useState('Notifications');
  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const dataToFilter = alignment === 'Notifications' ? notifications : [];
  const dataFiltered = applyFilter({
    inputData: dataToFilter,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <div style={{ overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" ml={4} mt={1}>
        <Typography variant="h4">Manage Notification</Typography>
      </Stack>
      {loading && <Loading />}
      <Box  ml={3} mt={2}>
        <Card style={{ display: 'flex', maxWidth: 980 }}>
          <Box mb={2}>
            <TextAndTextarea
              name="Title"
              placeholder="Enter title"
              type="text"
              required={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextAndTextarea
              name="Description"
              placeholder="Enter description"
              type="text"
              multiline={true}
              required={true}
              minRows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box mt={12}>
            <Button variant="contained" color="success" disabled={isDisabled} onClick={handleAddNotification}>
              Save
            </Button>
          </Box>
        </Card>
      </Box>
      <Box sx={{ margin: 3, maxWidth:980 }}>
        <Card>
          <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          alignment={alignment}
          handleChange={handleChangeAlignment}
          />
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={notifications.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'title', label: 'Title', align: 'center' },
                    { id: 'description', label: 'Description', align: 'center' },
                    { id: 'trigger', label: 'Trigger', align: 'center' },
                    {id:'delete',label:'Delete',align:'center'}

                  ]}
                />
                <TableBody>
                   {notifications
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <UserTableRow
                            key={row.id}
                            id={row.id}
                            title={row.title}
                            description={row.description}
                            loading={loading}
                          />
                        ))}

                    <TableEmptyRows
                        height={77}
                        emptyRows={emptyRows(page, rowsPerPage, notifications.length)}
                      />

                      {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
                page={page}
                component="div"
                count={notifications.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
        </Card>
      </Box>
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
};
