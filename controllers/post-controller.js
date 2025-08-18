import prisma from "../config/prisma-config.js";

// GETS
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();

    if (posts.length === 0) {
      return res.status(404).send({ error: "Posts not found" });
    }

    res.send(posts);
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

export const getPost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      return res.status(400).send({ error: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    res.send(post);
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

// filtered or search

// POSTS
export const createPost = async (req, res, next) => {
  // TODO: temp, make sure to switch for req.user.id
  const userId = 1;

  try {
    const newPost = await prisma.post.create({
      data: {
        authorId: userId,
        title: "A test post",
        content:
          "This is the content of a blog, I wonder if I should store in md.",
        published: false,
        slug: "a-test-post",
      },
    });

    if (!newPost) {
      return res.status(400).send({ error: "Unable to create post." });
    }

    res.send(newPost);
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

// PUTS

// TODO: must be authorized
export const editPost = async (req, res, next) => {
  const postId = parseInt(req.params.postId);
  try {
    const data = req.body;
    console.log(data);

    if (isNaN(postId)) {
      console.error("Error: Invalid post id");
      return res.status(400).send({ error: "Invalid post id" });
    }

    // TODO: validate this a different way with express-validator
    if (!data || Object.keys(data).length === 0) {
      console.error("Error: No form data received");
      return res.status(400).send({ error: "No form data received" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: data.title,
        content: data.content,
        slug: data.slug,
        published: data.published === "true" || data.published === true,
      },
    });

    res.send(updatedPost);
  } catch (err) {
    console.error(`Error: Unable to update post with id ${postId}`);
    res.status(400).send({ error: err.message });
  }
};

// Maybe... editPostStatus (just updates status)

// DELETE

// TODO: must be authorized
export const deletePost = async (req, res, next) => {
  const postId = parseInt(req.params.postId);

  try {
    if (isNaN(postId)) {
      console.error("Error: Invalid post id");
      return res.status(400).send({ error: "Invalid post id" });
    }

    const deletedPost = await prisma.post.delete({ where: { id: postId } });

    res.send(deletedPost);
  } catch (err) {
    console.error(`Error: Unable to delete post with id ${postId}`);
    res.status(400).send({ error: err.message });
  }
};
