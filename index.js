import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const posts = [];

app.use(bodyParser.json());
app.use(morgan("combined"));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// Home
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
})

app.get("/allpost", (req, res) => {
  res.render("allpost.ejs", { posts });
});

// Create page
app.get("/create", (req, res) => {
  res.render("create.ejs");
});


// Create post
app.post("/create", (req, res) => {
  const { title, content } = req.body;

  posts.unshift({
    title,
    content,
    date: new Date().toLocaleDateString(),
  });

  res.redirect("/");
});


// View post
app.get("/post/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts[id];

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("post.ejs", {
    post,
    id
  });
});



app.get("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts[id];
  res.render("edit.ejs", { post, id });
});

app.post("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  if (!posts[id]) {
    return res.status(404).send("Post not found");
  }

  posts[id] = { ...posts[id], title, content };

  res.redirect(`/post/${id}`);
});

app.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts[id]; 
  posts.splice(id, 1);
  res.redirect("/");
});



const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});