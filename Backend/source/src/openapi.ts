import { Application } from "express";
import { bearerAuth, OpenApi } from "ts-openapi";
import swaggerUi from "swagger-ui-express";


export const openApiInstance = new OpenApi(
  "v1.0",
  "Our Awesome Api",
  "Describing how to keep APIs documented.",
  "nelson.gomes@pipedrive.com"
);

openApiInstance.setServers([{ url: "http://localhost:8000" }]);

// set API license
openApiInstance.setLicense(
  "Apache License, Version 2.0",
  "http://www.apache.org/licenses/LICENSE-2.0",
  "http://dummy.io/terms/"
);

export function initOpenApi(app: Application, openApi: OpenApi) {
  // generate our OpenApi schema
  const openApiJson = openApi.generateJson();

  app.get("/openapi.json", function (_req, res) {
    res.json(openApiJson);
  });
  
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiJson));
}
