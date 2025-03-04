import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();


// /api/users GET
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;

    // here need to define how many items per page & how many items to skip
    const take = 10;
    const skip = (page - 1) * take;
  
    // here query with pagination
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      take,
      skip,
      orderBy: {
        name: 'asc' // alpha
      }
    });
    
    res.json({ users });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/users/by-letter', async (req, res) => {
  try {
    const letter = (req.query.letter as string)?.toUpperCase(); // case insensitive
    const page = parseInt(req.query.page as string) || 1;

    if (!letter || !/^[A-Z]$/.test(letter)) {
      return res.status(400).json({ error: "Invalid letter parameter" });
    }

    const take = 10;
    const skip = (page - 1) * take;

    const users = await prisma.user.findMany({
      where: {
        name: {
          startsWith: letter, // filtering by first letter
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      take,
      skip,
      orderBy: {
        name: 'asc',
      },
    });

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users by letter:", error);
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