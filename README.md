# Backend for my article on [TheWidlarzGroup](https://www.thewidlarzgroup.com/)

### How to run?!

- Step 1: Clone the project

```bash
git clone https://github.com/TheWidlarzGroup/JWTAuthBackend.git
```

- Step 2: Install packages

```bash
cd JWTAuthBackend && yarn
```

- Step 3: Add .env file

```
Add .env file with DATABASE_URL

example:
DATABASE_URL =  "postgresql://postgres:postgres@localhost:5432/prismadb"
REFRESH_TOKEN_SECRET = "refreshthesecretphrog"
ACCESS_TOKEN_SECRET = "accessthesecretphrog"
```

- Step 4: Run Prisma migration:

```bash
npx prisma migrate dev --name newMigration --preview-feature
```

- Step 5: Run the backend!

```bash
yarn dev
```
