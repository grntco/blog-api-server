import prisma from "../config/prisma-config.js";
import { userWithoutPassword } from "../utils/prisma-selectors.js";
import { matchedData, validationResult } from "express-validator";

export const getUsers = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { search, page } = matchedData(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: errors.array(),
        formData: { search },
      });
    }

    const pageTake = 12;
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
      success: true,
      message: "Successfully retrieved users.",
      users,
      meta: {
        totalUsersFound,
        totalUsers,
        currentPage,
        totalPages: Math.ceil(totalUsersFound / pageTake),
      },
      ...(search
        ? {
            formData: {
              search,
            },
          }
        : {}),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve users.",
    });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      console.error("Error: Invalid user ID.");
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userWithoutPassword,
    });

    if (!user) {
      console.error("Error: No user found");
      return res
        .status(404)
        .json({ success: false, message: "No user found." });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const editUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      console.error("Error: Invalid user ID");
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const { firstName, lastName, email, admin } = matchedData(req);

    if (!firstName && !lastName && !email && admin === undefined) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update.",
      });
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

    res.json({ success: true, message: "Edited user successfully.", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to edit user. Please try again later.",
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      console.error("Error: Invalid user ID.");
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID." });
    }

    const user = await prisma.user.delete({ where: { id: userId } });

    res.json({
      success: true,
      message: `Successfully deleted user "${
        user.firstName + " " + user.lastName
      }".`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to delete user. Please try again later.",
    });
  }
};
