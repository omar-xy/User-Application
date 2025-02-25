import { Application, Request, Response } from "express";
import { OpenApi, textPlain } from "ts-openapi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUsers(_request: Request, response: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      take: 10,
    });
    response.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    response.status(500).send("Internal Server Error");
  }
}

export function initGetUsers(app: Application, openApi: OpenApi) {
  app.get("/users", getUsers);

  openApi.addPath(
    "/users",
    {
      get: {
        description: "Get the first 10 users",
        summary: "Fetch the first 10 users from the database",
        operationId: "get-users-op",
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    description: "List of Users",
                    properties: {
                      id: { type: "number", description: "User ID" },
                      name: { type: "string", description: "User name" },
                      createdAt: { type: "string", description: "Creation timestamp" },
                    },
                  },
                },
              },
            },
          },
          500: textPlain("Internal Server Error"),
        },
        tags: ["User APIs"],
      },
    },
    true
  );
}