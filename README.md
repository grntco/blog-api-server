This repo is the backend API server for The Odin Project's Blog API project.

# Blog API

This is a project created for The Odin Project's Node.js course to build an [API server](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api) and two front-end websites to make requests to the API endpoints to view and manage blog posts, comments, and users. 

The server is built with Node.js and Express. I chose to write both front-end sites in React to get some more practice with the library, specifically in making calls to an API.

## API Server

**Repo:** https://github.com/grntco/blog-api-server

Building the API server was the focus of this project. The endpoints follow RESTful principles, with clear relationships between resources in the URL paths (i.e., `/posts/:postId/comments`) and correct HTTP methods for requested actions. All endpoints return standardized JSON objects.

One of the main learning outcomes of this project was to use JSON Web Tokens (JWTs) for request authentication. So, when a user has a successful login, a JWT token is generated on the server and then sent back to the client, where it is stored in localStorage and applied to the header on certain user- and admin-only requests (like creating and modifying data), which require a JWT in order to provide a successful response. I used `passport`'s JWT strategy to help implement this since I was already using `passport`'s local strategy for user's account creation and logging in.

For my PostgreSQL database, I used Prisma ORM to define model schema and retrieve/modify data. I had used Prisma on other projects before, but it was helpful to get more experience here on a bigger project, specifically in creating relationships between tables and querying them to retrieve related data (i.e., returning one object with the post data and comments associated with it).

I also added rate limiting to requests with `express-rate-limit` to limit the amount of requests per IP and `express-validator` to validate requests' body data.

### Tools: 

- Prisma
- bcryptjs
- cors
- express
- express-rate-limit
- express-validator
- jsonwebtoken
- passport
- passport-jwt
- passport-local

## User Blog

**Repo:** https://github.com/grntco/blog-api-user-client
**Demo:** https://blog-api-user-client.vercel.app/

This site is the public blog built in React. Any user can view the list of posts and a single post, but to leave a comment on any post they must first create an account and login. 

On the blog post list, pagination is done on the server by providing parameters to the request (i.e., `/posts?page=2`), and each page fetches the next set of results for that page. For displaying the posts, I used React Markdown to convert the post's content formatted in markdown to HTML. For making requests, I defined custom hooks called `useFetch` and `useMutation` to retrieve and modify data.

For demo purposes, I used ChatGPT to generate the posts' content.

### Features:

- View a list of posts sorted by most recent. 
- Create an account and login to leave a comment on a post.

### Tools:

- React
- React Router
- React Markdown

## Admin Dashboard

**Repo:** https://github.com/grntco/blog-api-admin-client
**Demo:** https://blog-api-admin-client.vercel.app/

I also used React to create this Admin Dashboard. Only admin users are able to view the pages on this website for managing the posts, comments, and users. 

The page tables are set up similarly to the post list on the User Blog with pagination handled by request parameters. Also, admins can search table results, which is similarly handled by a `?search=` parameter on the API requests. 

### Features:

- Login with these credentials: 
	- `Email: adminuser@example.com`
	- `Password: Password2@`
- View tables for the posts, comments, and users.
- On the Posts page, you can filter by published posts.
- Add a new post, give it a title and write your content, which supports markdown formatting.
- Edit a post to publish it or set it as a draft, causing it to show up or not show up on the User Blog site.
- Edit a user to make them an admin.
- Delete comments.

### Tools:

- React
- React Router