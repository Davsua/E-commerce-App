import { tesloApi } from '<@davsua>/api';
import { AdminLayout } from '<@davsua>/components/layouts';
import { IUser } from '<@davsua>/interfaces';
import { PeopleAltOutlined } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import User from '../../models/User';

const UserPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <></>;

  const onRoleUpdated = async (userId: string, newRole: string) => {
    //Si hay un error se revierte el cambio a como estaba
    const previousUsers = users.map((user) => ({ ...user }));

    //comparar para modificar el role
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));

    setUsers(updatedUsers);

    try {
      await tesloApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      console.log(error);
      alert('No se pudo actualizar el role del usuario');
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => {
        //console.log(row.role);
        return (
          <Select
            value={row.role}
            label='Rol'
            sx={{ width: '300px' }}
            onChange={({ target }) => onRoleUpdated(row.id, target.value)}
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='client'>Client</MenuItem>
            <MenuItem value='super-user'>Super User</MenuItem>
            <MenuItem value='SEO'>SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout title={'Usuarios'} subTitle={'Mantenimiento de usuarios'} icon={<PeopleAltOutlined />}>
      <Grid container className='fadeIn'>
        <Grid xs={12} sx={{ height: 650, width: '100%' }} item>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UserPage;
