const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const hbs = require("hbs");
require("./src/libs/hbs.helper")


const config = require("./config/config.js");
const { Sequelize, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/upload-file");

require("dotenv").config()

const environment = process.env.NODE_ENV
const sequelize = new Sequelize(config[environment]);


app.use(express.json());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/src/views"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "yourSecretKey", // Kunci rahasia untuk session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
              maxAge:1000 * 60 * 60 * 24,

     },
  })
);



app.use(flash()); // Mengaktifkan flash messages

// Direktori statis untuk CSS dan aset lainnya
app.use("/css", express.static(path.join(__dirname, "./src/css")));
app.use("/js",express.static(path.join(__dirname,"./src/js")))
app.use("/asset", express.static(path.join(__dirname, "./src/asset")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Rute GET
app.get("/", home);
app.get("/testimonial", testimonial);
app.get("/login", login);
app.get("/register", register);
app.get("/add-project", project);
app.get("/detail-project/:id", detailProject);
app.get("/contact", contact);

// Route Post
app.post("/login", loginPost);
app.post("/register", registerPost);
app.post("/add-project", upload.single("image"), projectPost);
app.post("/delete-project/:id", deleteProject);
app.post("/edit-project/:id", editProject);
app.post("/logout", logoutPost);


// Helper Handlebars untuk perbandingan
hbs.registerHelper("eq", (a, b) => a === b);



function home(req, res) {
  const user = req.session.user;
  res.render("index", { title: "Welcome To My Hunt", user });
}

function testimonial(req, res) {
    const user = req.session.user;
  res.render("testimonial", {user});
}

function login(req, res) {
  res.render("login");
}
function register(req, res) {
  res.render("register");
}

// Fungsi registrasi pengguna
async function registerPost(req, res) {
  const { name, email, password } = req.body;

    // Menghasilkan salt
    const salt = await bcrypt.genSalt(10);

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Menggunakan parameterized query untuk memasukkan data ke database
    const query = `INSERT INTO users (name, email, password) VALUES ('${name}','${email}','${hashedPassword}')`;
    await sequelize.query(query, {type: QueryTypes.INSERT,});

    // Redirect ke halaman login setelah registrasi berhasil
    res.redirect("login");
}

// Fungsi login
async function loginPost(req, res) {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  const user = await sequelize.query(query, {type: QueryTypes.SELECT})

  if (!user.length) {
    req.flash("error", "Email atau kata sandi salah");
    return res.redirect("login");
  }

  const isVerifiedPassword = await bcrypt.compare(password, user[0].password);
  if (!isVerifiedPassword) {
    req.flash("error", "Email atau kata sandi salah");
    return res.redirect("login");
  }

  req.flash("success", "Berhasil login");
  req.session.user = user[0];
  res.redirect("/");
}

function logoutPost (req, res){
  req.session.destroy((err) =>{
    if(err)return console.error("logout gagal")


      console.log("logout berhasil")

    res.redirect("/login")
  })
}



async function projectPost (req, res) {
  try {
    const { project_name, start_date, end_date, description, technologies} =req.body;

      const { id } = req.session.user;

    const image = req.file.path

    const query = `INSERT INTO projects (project_name, start_date, end_date, description, technologies, image,author_id) 
                VALUES('${project_name}', '${start_date}', '${end_date}', '${description}', '${technologies}', '${image}','${id}')`;

    await sequelize.query(query, { type: QueryTypes.INSERT });

    res.redirect("/add-project");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding project", error });
  }
};

// Menampilkan halaman project
async function project(req, res) {
  const query = `SELECT projects.*, users.name AS author FROM projects LEFT JOIN users ON projects.author_id=users.id`;
  let projects = await sequelize.query(query, { type: QueryTypes.SELECT });

  const user = req.session.user

  res.render("project",{projects, user});
}

// Edit proyek berdasarkan ID
async function editProject(req, res) {
  const { id } = req.params;
  const query = `SELECT * FROM projects WHERE id = '${id}'`;
  const project = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements: { id },
  });
  res.render("edit-project", { project: project[0], id });
}

// Rute untuk mengedit project
app.post("/edit-projectPost/:id", async (req, res) => {
  const { id } = req.params;
  const { name, star_date, end_date, description, technologies } = req.body;


  const query = `UPDATE projects SET name = '${name}', star_date = '${star_date}', end_date = '${end_date}', description = '${description}', technologies = '${technologies} WHERE id = '${id}'`;
  await sequelize.query(query, {type: QueryTypes.UPDATE})

  res.redirect("/add-project")
})

// Hapus project berdasarkan ID
async function deleteProject(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM projects WHERE id=${id}`;
  await sequelize.query(query, {type: QueryTypes.DELETE,});
  res.redirect("/add-project");
}

// Detail project berdasarkan ID
async function detailProject(req, res) {
  const { id } = req.params;
  const query = `SELECT * FROM projects WHERE id=${id}`;
  const result = await sequelize.query(query, {type: QueryTypes.SELECT});
  res.render("detail-project", { result: result[0] });
}

function contact (req, res) {
      const user = req.session.user;
  res.render("contact",{user})
}

// Menjalankan server di port yang ditentukan
app.listen(port, () => {
  console.log(`Aplikasi berjalan di port ${port}`);
});


