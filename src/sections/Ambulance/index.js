import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography
} from '@mui/material';
import Loading from '../../components/loading';
import Iconify from '../../components/iconify/iconify';
import { useRouter } from '../../routes/hooks';
import Scrollbar from '../../components/scrollbar';
import TableNoData from './ViewAmbulanceTable/table-no-data';
import UserTableRow from './ViewAmbulanceTable/user-table-row';
import UserTableHead from './ViewAmbulanceTable/user-table-head';
import TableEmptyRows from './ViewAmbulanceTable/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from './ViewAmbulanceTable/utils';
import UserTableToolbar from './ViewAmbulanceTable/user-table-toolbar';
import { useNavigate } from 'react-router-dom';
import { useLabTestContext } from '../../firebase/LabTestService';
import { useAmbulanceContext } from '../../firebase/AmbulanceService';

export const Ambulance = () => {
  const router = useRouter();
  const { AmbulanceNotPublished , AmbulancePublished , loading } = useAmbulanceContext();

  const handleAddHospitalClick = () => {
    router.push('/ambulance/add-ambulance');
  };

  const [alignment, setAlignment] = useState('Published');
  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const navigate = useNavigate();
  const send = (location) => {
    navigate('/ambulance/view-ambulance', {
      state: {
        id: location.id,
      },
    });
  };

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

  const handleSelectAllClickPublished = (event) => {
    if (event.target.checked) {
      const newSelecteds = AmbulancePublished.map((n) => ({ name: n.name, area: n.area }));
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectAllClickUnPublished = (event) => {
    if (event.target.checked) {
      const newSelecteds = AmbulanceNotPublished.map((n) => ({ name: n.name, area: n.area }));
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataToFilter = alignment === 'Published' ? AmbulancePublished : AmbulanceNotPublished;

  const dataFiltered = applyFilter({
    inputData: dataToFilter,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      {loading && <Loading />}
      <div style={{ maxWidth: 'calc(100% - 3px)', overflow: 'unset' }}>
        <Card style={{ margin: 12 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" pb={1} pt={1} mr={4} mb={1} ml={4} mt={1}>
            <Typography variant="h4">Ambulances</Typography>
            <Button variant="contained" color="inherit" onClick={handleAddHospitalClick} startIcon={<Iconify icon="eva:plus-fill" />}>
              New Ambulance
            </Button>
          </Stack>
        </Card>
        <Box style={{ marginLeft: 12, margin: 15 }}>
          {alignment === 'Published' ? (
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
                      rowCount={AmbulancePublished.length}
                      numSelected={selected.length}
                      onRequestSort={handleSort}
                      onSelectAllClick={handleSelectAllClickPublished}
                      headLabel={[
                        { id: 'Ambulance_name', label: 'Ambulance Name', align: 'center' },
                        { id: 'Area', label: 'Area', align: 'center' },
                        { id: 'Pincode', label: 'Pincode', align: 'center' },
                        { id: 'Active', label: 'Active/InActive', align: 'center' },
                        { id: 'Images', label: 'Images', align: 'center' },
                      ]}
                    />
                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <UserTableRow
                            key={row.id}
                            name={row.name}
                            pincode={row.pincode}
                            area={row.area}
                            isActive={row.isActive}
                            images={row.image}
                            view={() => send(row)}
                            loading={loading}
                            handleClick={(event) => handleClick(event, row.name)}
                          />
                        ))}

                      <TableEmptyRows
                        height={77}
                        emptyRows={emptyRows(page, rowsPerPage, AmbulancePublished.length)}
                      />

                      {notFound && <TableNoData query={filterName} />}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                page={page}
                component="div"
                count={AmbulancePublished.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          ) : (
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
                      rowCount={AmbulanceNotPublished.length}
                      numSelected={selected.length}
                      onRequestSort={handleSort}
                      onSelectAllClick={handleSelectAllClickUnPublished}
                      headLabel={[
                        { id: 'Ambulance_name', label: 'Ambulance Name', align: 'center' },
                        { id: 'Area', label: 'Area', align: 'center' },
                        { id: 'Pincode', label: 'Pincode', align: 'center' },
                        { id: 'Active', label: 'Active/InActive', align: 'center' },
                        { id: 'Images', label: 'Images', align: 'center' },
                      ]}
                    />
                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <UserTableRow
                            key={row.id}
                            name={row.name}
                            pincode={row.pincode}
                            area={row.area}
                            isActive={row.isActive}
                            images={row.image}
                            view={() => send(row)}
                            loading={loading}
                            handleClick={(event) => handleClick(event, row.name)}
                          />
                        ))}

                      <TableEmptyRows
                        height={77}
                        emptyRows={emptyRows(page, rowsPerPage, AmbulanceNotPublished.length)}
                      />

                      {notFound && <TableNoData query={filterName} />}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                page={page}
                component="div"
                count={AmbulanceNotPublished.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          )}
        </Box>
      </div>
    </>
  );
};