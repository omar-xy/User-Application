import express from "express"
import cors from "cors";

import { initOpenApi, openApiInstance } from "./openapi";
import userRoutes from './routes/useRouter';




const app = express();


const port = process.env.PORT || 8000;

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Allow cookies and credentials
}));

// api/users 
app.use('/api', userRoutes);

// for api documentation openapi
// initOpenApi(app, openApiInstance);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




