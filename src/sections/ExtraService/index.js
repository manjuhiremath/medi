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
import TableNoData from './ViewExtraTable/table-no-data';
import UserTableRow from './ViewExtraTable/user-table-row';
import UserTableHead from './ViewExtraTable/user-table-head';
import TableEmptyRows from './ViewExtraTable/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from './ViewExtraTable/utils';
import UserTableToolbar from './ViewExtraTable/user-table-toolbar';
import { useNavigate } from 'react-router-dom';
import { usePharmacyContext } from '../../firebase/PharmacyService';
import { useExtraContext } from '../../firebase/ExtraService';

export const ExtraService = () => {
  const router = useRouter();
  // const { PharmacyNotPublished , PharmacyPublished , loading } = usePharmacyContext();
  const { ExtraNotPublished , ExtraPublished , loading } = useExtraContext();

  const handleAddHospitalClick = () => {
    router.push('/extra/add-extra');
  };

  const [alignment, setAlignment] = useState('Published');
  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const navigate = useNavigate();
  const send = (location) => {
    navigate('/extra/view-extra', {
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
      const newSelecteds = ExtraPublished.map((n) => ({ name: n.name, area: n.area }));
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectAllClickUnPublished = (event) => {
    if (event.target.checked) {
      const newSelecteds = ExtraNotPublished.map((n) => ({ name: n.name, area: n.area }));
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

  const dataToFilter = alignment === 'Published' ? ExtraPublished : ExtraNotPublished;

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
            <Typography variant="h4">Extra Service</Typography>
            <Button variant="contained" color="inherit" onClick={handleAddHospitalClick} startIcon={<Iconify icon="eva:plus-fill" />}>
              New Service
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
                      rowCount={ExtraPublished.length}
                      numSelected={selected.length}
                      onRequestSort={handleSort}
                      onSelectAllClick={handleSelectAllClickPublished}
                      headLabel={[
                        { id: 'Extra_name', label: 'Service Name', align: 'center' },
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
                        emptyRows={emptyRows(page, rowsPerPage, ExtraPublished.length)}
                      />

                      {notFound && <TableNoData query={filterName} />}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                page={page}
                component="div"
                count={ExtraPublished.length}
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
                      rowCount={ExtraNotPublished.length}
                      numSelected={selected.length}
                      onRequestSort={handleSort}
                      onSelectAllClick={handleSelectAllClickUnPublished}
                      headLabel={[
                        { id: 'Service_name', label: 'Service Name', align: 'center' },
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
                        emptyRows={emptyRows(page, rowsPerPage, ExtraNotPublished.length)}
                      />

                      {notFound && <TableNoData query={filterName} />}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                page={page}
                component="div"
                count={ExtraNotPublished.length}
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
