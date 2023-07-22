import React, { ChangeEvent, FC, use, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { AdminLayout } from '../../../components/layouts';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  ListItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { ISize, Iproduct } from '<@davsua>/interfaces';
import { Controller, useForm } from 'react-hook-form';
import { tesloApi } from '<@davsua>/api';
import { Product } from '<@davsua>/models';
import { useRouter } from 'next/router';

const validTypes = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender = ['men', 'women', 'kid', 'unisex'];
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ISize[];
  slug: string;
  tags: string[];
  title: string;
  type: string;
  gender: string;
}

interface Props {
  product: Iproduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null); // useRef -> crea referencias para mejorar exp usuario
  const [newTagValue, setNewTagValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    control,
    watch,
  } = useForm({
    // elementos que quiero cargar por defecto y de pirmera
    defaultValues: product,
  });

  /* -------- Modificar el slug --------*/

  useEffect(() => {
    // watch me permite observar cuando un input se modifica
    // name: cambio que cambia
    // type: accion realizada
    // subcription: generador del watch, si no se le indica que pare se seguira modificando eternamente
    const subscription = watch((value, { name, type }) => {
      //console.log({ value, name, type });
      if (name === 'title') {
        const regex = /[^a-zA-Z0-9_]/gi; // ^ : lo contrario (reemplazamos todos los valores que no quiero)
        const newSlug =
          value.title?.trim().replaceAll(' ', '_').replaceAll(regex, '').toLocaleLowerCase() || '';

        setValue('slug', newSlug); // set value modifica el campo por el nuevo valor
      }

      return () => {
        //perdirle a subscription que pare pq ya no se necsita mas
        subscription.unsubscribe;
      };
    });
  }, [setValue, watch]);

  /* ---------- TAGS -----------*/

  const onNewTag = () => {
    const newTag = newTagValue.trim().toLocaleLowerCase();
    setNewTagValue('');
    const currentTags = getValues('tags');
    if (currentTags.includes(newTag)) {
      return;
    }

    currentTags.push(newTagValue.trim());
  };

  /*----------------------------------
                Delete 
  ----------------------------------*/

  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues('tags').filter((t) => t !== tag);
    // shouldValidate: permite o no ver los cambios inmediatamente
    setValue('tags', updatedTags, { shouldValidate: true });
  };

  /*----------------------------------
            import image
  ----------------------------------*/

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    //console.log(event.target.files);

    // si hay elem seleccionados
    try {
      for (const file of event.target.files) {
        const formData = new FormData();
        //console.log(file);

        // agg el file al format data
        formData.append('file', file);

        //hacer la peticion
        const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);
        console.log(data.message);
        // añadiendo la nueva imagen al arreglo de imagenes para mosrarla inmediatamente
        setValue('images', [...getValues('images'), data.message], { shouldValidate: true });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  /*---------------------------------
          Delete Img
  ----------------------------------*/

  const onDeleteImg = (image: string) => {
    // filtrar imagenes que sean diferentes a la saleccionada
    setValue(
      'images',
      getValues('images').filter((img) => img !== image),
      { shouldValidate: true }
    );
  };

  /*----------------------------------
                sending form
  ----------------------------------*/

  const onSubmit = async (form: FormData) => {
    if (form.images.length < 2) return alert('Minimo 2 imagenes');

    setIsSaving(true);

    try {
      const { data } = await tesloApi({
        url: '/admin/products',
        method: form._id ? 'PUT' : 'POST', // si tenemos un :id actualizamos, si no crear
        data: form,
      });

      console.log(data);
      if (!form._id) {
        // navegar a otra pantalla
        router.replace(`/admin/products/${form.slug}`);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title={'Producto'} subTitle={`Editando: ${product.title}`} icon={<DriveFileRenameOutline />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
          <Button
            color='secondary'
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type='submit'
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label='Título'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label='Descripción'
              variant='filled'
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register('description', {
                required: 'Este campo es requerido',
                //minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label='Inventario'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Este campo es requerido',
                minLength: { value: 0, message: 'Mínimo de valor 0' },
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label='Precio'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('price', {
                required: 'Este campo es requerido',
                minLength: { value: 0, message: 'Mínimo de valor 0' },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <Controller
              name='type'
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Tipo</FormLabel>
                  <RadioGroup row {...field}>
                    {validTypes.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio color='secondary' />}
                        label={capitalize(option)}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />

            <Controller
              name='gender'
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup row {...field}>
                    {validGender.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio color='secondary' />}
                        label={capitalize(option)}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />

            {/* <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel key={size} control={<Checkbox checked={getValues('sizes').includes(size)}/>} label={size} />
              ))}
            </FormGroup> */}

            <Controller
              name='sizes'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin='dense' error={!!errors.sizes}>
                  <FormLabel>Sizes</FormLabel>
                  <FormGroup>
                    {validSizes.map((size) => (
                      <FormControlLabel
                        key={size}
                        label={size}
                        control={
                          <Checkbox
                            value={size}
                            checked={field.value.some((val) => val === size)}
                            onChange={({ target: { value } }, checked) => {
                              checked
                                ? field.onChange([...field.value, value])
                                : field.onChange(field.value.filter((val) => val !== value));
                            }}
                          />
                        }
                      />
                    ))}
                  </FormGroup>
                  <FormHelperText>{capitalize(`${(errors.sizes as any)?.message || ''}`)}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label='Slug - URL'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Este campo es requerido',
                validate: (val) =>
                  val.trim().includes(' ') ? 'No se puede tener espacios en blanco' : undefined,
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label='Etiquetas'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              helperText='Presiona [spacebar] para agregar'
              value={newTagValue}
              onChange={({ target }) => setNewTagValue(target.value)}
              onKeyUp={({ code }) => (code === 'Space' ? onNewTag() : undefined)}
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
              component='ul'
            >
              {getValues('tags').map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    //onChange={OnNewTag(tag)}
                    color='primary'
                    size='small'
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display='flex' flexDirection='column'>
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color='secondary'
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()} //Llamar la ref del input para que funcione IGUAL
              >
                Cargar imagen
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='image/png image/gif image/jpeg'
                style={{ display: 'none' }}
                onChange={onFileSelected}
              />

              <Chip
                label='Es necesario almenos 2 imagenes'
                color='error'
                variant='outlined'
                sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }}
              />

              <Grid container spacing={2}>
                {getValues('images').map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      {/* ${img} -> solo leera las imagenes de cloudinary */}
                      {/* /products/${img} -> lee imagenes del filesystem (no recomendado), bueno para pruebas */}
                      {/* en database/dProducts se hace funcion para permitir leer los dos (SOLO DE SER NECESARIO SE HACE ESTO) */}
                      <CardMedia component='img' className='fadeIn' image={`${img}`} alt={img} />
                      <CardActions>
                        <Button fullWidth color='error' onClick={() => onDeleteImg(img)}>
                          Borrar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query;

  let product: Iproduct | null;

  if (slug === 'new') {
    // crear producto
    const tempProduct = JSON.parse(JSON.stringify(new Product())); // Base del modelo
    // eliminar el _id para evitar errores en la peticion de ID que no son validos para mongoose
    delete tempProduct._id;
    // add imagenes por que por ahora no es posible agregarlas y asi evitamos error
    tempProduct.images = ['img1.jpg', 'img2.jpg'];
    product = tempProduct;
  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
