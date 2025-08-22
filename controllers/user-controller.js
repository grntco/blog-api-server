import prisma from "../config/prisma-config.js";
import { userWithoutPassword } from "../utils/prisma-selectors.js";

export const getUsers = async (req, res, next) => {
  try {
    const { search, page } = req.query;
    const pageTake = 3;
    const currentPage = parseInt(page) || 1;
    const pageSkip = (currentPage - 1) * pageTake;

    const searchWhere = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [users, totalUsersFound, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: searchWhere,
        skip: pageSkip,
        take: pageTake,
        select: userWithoutPassword,
        orderBy: [
          { createdAt: "desc" },
          { firstName: "asc" },
          { lastName: "asc" },
          { email: "asc" },
        ],
      }),
      prisma.user.count({ where: searchWhere }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      meta: {
        totalUsersFound,
        totalUsers,
        currentPage,
        totalPages: Math.ceil(totalUsersFound / pageTake),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      console.error("Error: Invalid user ID");
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userWithoutPassword,
    });

    if (!user) {
      console.error("Error: No user found");
      return res.status(404).json({ error: "No user found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const editUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const { firstName, lastName, email, admin } = req.body;

    if (isNaN(userId)) {
      console.error("Error: Invalid user ID");
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        admin: admin === "true" || admin === true,
      },
      select: userWithoutPassword,
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      console.error("Error: Invalid user ID");
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.delete({ where: { id: userId } });

    res.json({
      message: `Successfully deleted user "${
        user.firstName + " " + user.lastName
      }".`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
