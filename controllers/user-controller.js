import prisma from "../config/prisma-config.js";
import { userWithoutPassword } from "../utils/prisma-selectors.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: userWithoutPassword,
    });

    res.json(users);
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
    const { firstName, lastName, email } = req.body;

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
