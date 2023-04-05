# Next.js E-commerce Teslo App

To run locally we need the db

```
docker-compose up -d
```

-d means **detached**

## MongoDb URL local:

mongodb://localhost:27017/teslodb

## configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

´´´´´´´´
#Mongoose

- yarn add mongoose
- database/db.ts

´´´´´´´´

## Reconstruir modulos de node

yarn install

## Llenar DB con info de prueba

llamar a :
`http://localhost:3000/api/seed `

---

## Backend

``
**database**

- constants -> it have the constant that i must to use in my models
- db -> connection to DB
- getProductBySlug -> it will return a Promise that can be Iproduct type (product) or null if the product
  doesnt exist... "JSON.parse(JSON.stringify(product))" => converts the object(product) to string
- seed-data: contains test info (products, users)

**models**

- Product -> it have the the Schema and model of type Iproduct (interface of models) helping by mongoose

``

## Pages

´´´´´´´´

1. Product

- [slug] -> get the info about the product by _getServerSideProps_ using the ctx.params obtaining the
  slug and using the function getProductBySlug to find the exact product from DB
  if product doesnt exist, user will be redirect to main page

  -> to improve the time of loading, i use the get stativ props and get static path... get staticPath help
  me to take all the data that i need (slug) and create the paths; get static prop send the find the exactly slug that i need and send it as prop

´´´´´´´´

``
**api**

1. seed

   - test api page

2. products

   - [slug] -> searching product by slug
   - index -> searching all products or searching a group of products filtering by word

3. search
   - [query] -> searching by tag and title sending a query
   - index -> it will send a error message if you dont send any query

# Hooks

´´´´
SWR: is using in hooks/useProduct. Make the request to the api and catching the different situations
like error, empty data or success... fetching is using as global state in \_app

´´´´

# Context

´´´´´´
Hows work sideMenu:

1.  context, provider and reducer created
2.  reducer create the function that open or close the menu by boolean value
3.  provider calls the function by dispatch and provider is using in \_app allows their using in all aplication
4.  context calls the provider
5.  using function 'toggle menu' in button -> NavBar to change state of isMenuOpen
6.  using isMenuOpen in sideMenu
7.  to navigate a function was created calls naviteTo that receives the url and this url will be push to router
    and toggle menu function will be usign again to close the menu

´´´´´´

´´´´´´

# Cart

- Size selector:
  - in SIzeSelector create a method that receive the current size, this methos will be exported to [slug]
  - in slug i have an state "tempCartProduct" with the product
  - i create a function to set the state and change the size for the current size (onSelectedSize)
  - the last method will be use receiving the first method sending to the "father component" that is SizeSelector the size that was choising

´´´´´´

# Teslo
# E-commerce-App
