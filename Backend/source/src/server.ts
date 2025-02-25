import express from "express"

import { initGetUsers } from "./routes/test";
import { initOpenApi, openApiInstance } from "./openapi";
import userRoutes from './routes/useRouter';




const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

// api 
app.use('/api', userRoutes);

// for api documentation openapi
// initOpenApi(app, openApiInstance);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




