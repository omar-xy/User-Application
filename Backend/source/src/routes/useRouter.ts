import { response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();


// /api/users GET
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      take: 10,
    });
      res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// /api/users POST
router.post('/users', async (req, res) => {
  const { name } = req.body;
  const newUser = await prisma.user.create({
    data: {
      name,
    },
  });
  res.json(newUser);
});

export default router;