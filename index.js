const express = require("express");
const shortid = require("shortid");

const server = express();

server.use(express.json());

let users = [
  {
    id: 1,
    name: "Jane Doe",
    bio: "Not Tarzan's Wife, another Jane",
  },
];

server.get("/", (req, res) => {
  res.json({
    api: "running...",
  });
});

server.post("/api/users", (req, res) => {
  const userInfo = req.body;

  if (!userInfo.hasOwnProperty("name") || !userInfo.hasOwnProperty("bio")) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    const newUser = {
      id: shortid.generate(),
      ...userInfo,
    };
    users.push(newUser);
    if (users.find((u) => u.id == newUser.id)) {
      res.status(201).json(newUser);
    } else {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
    }
  }
});

server.get("/api/users", (req, res) => {
  users == undefined
    ? res
        .status(500)
        .json({ errorMessage: "The users information could not be retrieved." })
    : res.status(201).json(users);
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  if (users == undefined) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  } else {
    const user = users.find((u) => u.id == id);
    if (!user) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      res.status(201).json(user);
    }
  }
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((u) => u.id == id);
  const newUsers = { ...users };
  if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    users = users.filter((u) => u !== user);
    res.status(202).json(users);
    if (newUsers === users) {
      res.status(500).json({ errorMessage: "The user could not be removed" });
    }
  }
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const userInfo = req.body;
  const user = users.find((u) => u.id == id);
  //   if (users == undefined) {
  //     res
  //       .status(500)
  //       .json({ errorMessage: "The user information could not be modified." });
  //   }
  if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else if (
    !userInfo.hasOwnProperty("name") ||
    !userInfo.hasOwnProperty("bio")
  ) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == id) {
        users[i].name = userInfo.name;
        users[i].bio = userInfo.bio;
        res.status(200).json(users);
      }
    }
  }
});

const port = 5000;
server.listen(port, () => {
  console.log(`server listening on port - ${port}`);
});
