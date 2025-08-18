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
    res.status(400).send(err);
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
    res.status(400).send(err);
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
    res.status(400).send(err);
  }
};

// PUTS
// update/edit
// Think about forms

// editPost (everything: title, content, slug, author, published, etc.)

// editPostStatus (just updates status)

// editPostAuthor.... probalby unnecessary


// DELETE
// delete
