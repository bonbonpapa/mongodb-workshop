let express = require("express");
let app = express();
let MongoDb = require("mongodb");
let MongoClient = MongoDb.MongoClient;
let ObjectID = MongoDb.ObjectID;
let reloadMagic = require("./reload-magic.js");
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads/" });
let passwordHash = require("password-hash");
reloadMagic(app);
app.use("/", express.static("build"));
app.use("/uploads", express.static("uploads"));
let dbo = undefined;
let url =
  "mongodb+srv://bob:bobuse@cluster0-peipd.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  dbo = client.db("media-board");
});
app.get("/all-posts", (req, res) => {
  console.log("request to /all-posts");
  dbo
    .collection("posts")
    .find({})
    .toArray((err, ps) => {
      if (err) {
        console.log("error", err);
        res.send("fail");
        return;
      }
      console.log("posts", ps);
      res.send(JSON.stringify(ps));
    });
});
let login = (req, res) => {
  console.log("login", req.body);
  let name = req.body.username;
  let pwd = req.body.password;
  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    let uPwd = user.password;
    if (passwordHash.isHashed(uPwd) && passwordHash.verify(pwd, uPwd)) {
      res.send(JSON.stringify({ success: true }));
      return;
    } else if (user.password === pwd) {
      res.send(JSON.stringify({ success: true }));
      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
};

app.post("/login", upload.none(), login);

app.post("/signup", upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log("this is the body", req.body);
  let name = req.body.username;
  let enteredPwd = req.body.password;
  let hashedPwd = passwordHash.generate(enteredPwd);

  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("sign up error, err");
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user !== null) {
      res.send(JSON.stringify({ success: false, message: "Username taken" }));
      return;
    }
    dbo
      .collection("users")
      .insertOne({
        username: name,
        password: hashedPwd
      })
      .then(() => {
        login(req, res);
      });
  });
});
app.post("/new-post", upload.array("mfiles",9), (req, res) => {
  console.log("request to /new-post. body: ", req.body);
  let description = req.body.description;
    let files = req.files;
    console.log("uploaded files,", files);
    let frontendPaths = files.map(file => {
        let filetype = file.mimetype;
        return { frontendPath: "/uploads/" + file.filename, filetype: filetype };
    })
    console.log("Frontend paths array", frontendPaths);

  let createdby = req.body.createdby;
  dbo.collection("posts").insertOne({
    description: description,
    frontendPaths: frontendPaths,
    createdby: createdby
  });
  res.send(JSON.stringify({ success: true }));
});

app.post("/delete-post", upload.none(), (req, res) => {
  console.log("request to /delete current post. body: ", req.body);
  let id = req.body.id;
  console.log("the post to be delete", id);
  try {
    dbo.collection("posts").deleteOne({ _id: ObjectID(id) });
  } catch (e) {
    console.log("message after delete post", e);
    return;
  }
  res.send(JSON.stringify({ success: true }));
});

app.post("/update", upload.single("mfile"), (req, res) => {
  console.log("request to /update");
  let id = req.body.id.toString();
  let file = req.file;
  let filetype = file.mimetype;
  let frontendPath = "/uploads/" + file.filename;
  let desc = req.body.description;
  let updatedby = req.body.updatedby;
  console.log("sent from client", desc, id);
  dbo.collection("posts").updateOne(
    { _id: ObjectID(id) },
    {
      $set: {
        description: desc,
        updatedby: updatedby,
        frontendPath: frontendPath,
        filetype: filetype
      }
    }
  );
  res.send(JSON.stringify({ success: true }));
});
app.post("/delete-all", upload.none(), async (req, res) => {
    console.log("request to /delete all");
    let username = req.body.username;
    console.log("Delete posts of the user", username);
    try {
        dbo.collection("posts").deleteMany({ createdby : username });
    }
    catch (e) {
        console.log("message after delete post", e);
        return;
    }
    let pst = await dbo.collection("posts").find({}).toArray();
        
  res.send(JSON.stringify({ success: true, posts: pst }));
});
app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
