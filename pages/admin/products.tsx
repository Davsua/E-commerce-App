import { AdminLayout } from '<@davsua>/components/layouts';
import { Iproduct } from '<@davsua>/interfaces';
import { AddOutlined, CategoryOutlined, ConfirmationNumberOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

const columns: GridColDef[] = [
  {
    field: 'images',
    headerName: 'Image',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank'>
          <CardMedia component='img' /*className='fadeIn'*/ image={row.images} />
        </a>
      );
    },
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 300,
    renderCell: ({ row }: GridRenderCellParams) => {
      //console.log({ row });
      return (
        <Link underline='always' href={`/admin/products/${row.slug}`}>
          {row.title}
        </Link>
      );
    },
  },
  { field: 'gender', headerName: 'Gender' },
  { field: 'type', headerName: 'Type' },
  { field: 'inStock', headerName: 'In Stock' },
  { field: 'price', headerName: 'Price' },
  { field: 'sizes', headerName: 'Sizes', width: 250 },
];

const ProductsPage = () => {
  const { data, error } = useSWR<Iproduct[]>('/api/admin/products');
  const [products, setProducts] = useState<Iproduct[]>([]);

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  if (!data && !error) {
    <></>;
  }

  //console.log(products[0]);

  const rows = products.map((product) => ({
    id: product._id,
    images: product?.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
    slug: product.slug,
  }));

  return (
    <AdminLayout title={'Productos'} subTitle={'Mantenimiento de productos'} icon={<CategoryOutlined />}>
      <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
        <Button startIcon={<AddOutlined />} color='secondary' href='/admin/products/new'>
          Crear producto
        </Button>
      </Box>

      <Grid container className='fadeIn'>
        <Grid xs={12} sx={{ height: 650, width: '100%' }} item>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
