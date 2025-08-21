import prisma from "../config/prisma-config.js";

// TODO: add server logs
// TODO: remove password hash from returns
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const editUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const { firstName, lastName, email } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
      },
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await prisma.user.delete({ where: { id: userId } });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
};
