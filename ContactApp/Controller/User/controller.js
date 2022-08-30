const { JWTPayload } = require("../../View/Authentication.js");
let [admin, message] = [null, "not Admin"];
const { User } = require("../../View/User");
async function createAdmin() {
  [admin, message] = await User.createAdmin();
}
async function createUser(req, resp) {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  // console.log("_+_+++_+_+_+_+_");
  // console.log(isValidAdmin);
  if (!isValidAdmin) {
    return;
  }
  const { fname, lname, username, password, role } = req.body;

  if (
    lname == null ||
    fname == null ||
    password == null ||
    role == null ||
    lname == "" ||
    fname == "" ||
    password == "" ||
    role == "" ||
    username == ""
  ) {
    return resp.status(401).send("please fill all fields in the form");
  }
  let [newUser, message] = await User.createUser(
    fname,
    lname,
    username,
    password,
    role
  );
  if (newUser == null) {
    resp.status(401).send(message);
    return;
  }
  resp.status(201).send(newUser);
  return message;
}
async function getUsers(req, resp) {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return "please login";
  }
  const { limit, pageNumber } = req.body;
  // console.log(limit + "{}");
  // console.log(pageNumber);
  // if (User.allUsers.length === 0) {
  //   return resp.status(400).send("No users yet");
  // }
  let startIndex = (pageNumber - 1) * limit;
  let endIndex = pageNumber * limit;
  let allusers = await User.getAllUsers();
  console.log(allusers);
  if (allusers == null) {
    resp.status(400).send("Get Users Failed");
  }
  let users = [];
  for (let i = 0; i < allusers.length; i++) {
    // console.log(allusers[i].role);
    if (allusers[i].role != "admin") {
      users.push(allusers[i]);
    }
  }
  resp.status(200).send(users.slice(startIndex, endIndex));
}

function deleteUser(req, resp) {
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return "not valid admin please login as admin";
  }
  const { usernameOfUserToBeDeleted } = req.body;
  if (usernameOfUserToBeDeleted == null) {
    return resp.status(400).send("please send all required parameters");
  }
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(
    usernameOfUserToBeDeleted
  );

  if (!isUserExists || !isUserActive) {
    resp.status(400).send("user doesnt exists");
  } else {
    admin.deleteUser(usernameOfUserToBeDeleted);

    resp.status(200).send("user deleted");
  }
}
async function updateUser(req, resp) {
  // console.log(User.allUsers);
  // console.log("+++++++++++++++++++");
  const isValidAdmin = JWTPayload.isValidAdmin(req, resp);
  if (!isValidAdmin) {
    return;
  }

  const { username, propertyToUpdate, value } = req.body;
  // console.log(username + "{{}{}}}");
  // console.log(propertyToUpdate);
  // console.log(value);
  if (
    username == null ||
    propertyToUpdate == null ||
    value == null ||
    username == "" ||
    propertyToUpdate == "" ||
    value == ""
  ) {
    return resp.status(400).send("please fill all fields in the form");
  }

  // let [indexofUser, isUserActive, isUserExists] = User.isUserExists(value);
  // if (isUserExists) {
  //   return resp.status(400).send("username already exists");
  // }
  // [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);
  // if (!isUserExists || !isUserActive) {
  //   return resp.status(400).send("user doesnt exists");
  // }
  // console.log("++");
  const user = await User.getUser(username);
  console.log(user);
  if (user == null) {
    return resp.status(400).send("User not exists");
  }
  let isUpdateSuccess = await User.updateUser(
    user._id,
    propertyToUpdate,
    value
  );
  if (isUpdateSuccess) {
    return resp.status(200).send("update success");
  }
  return resp.status(400).send("update failed");
}
function isValidAdmin(req, resp) {
  JWTPayload.isValidAdmin(req, resp);
  return;
}
async function toogleActiveFlag(req, resp) {
  const username = req.body.username;
  console.log(username);
  // console.log(userId);
  // console.log(User.allUsers[0].userId);
  // let [userIndex, isUserActive, isUserExists] = User.isUserIdExists(userId);
  // console.log(userIndex);
  const user = await User.getUser(username);
  if (user == null) {
    return resp.status(400).send("User doesnt exists");
  }
  // console.log("+");
  // console.log(user._id);
  user.isActive
    ? User.updateUser(user._id, "isActive", false)
    : User.updateUser(user._id, "isActive", true);
  // console.log(User.allUsers);
  resp.status(201).send("update done");
}
async function getAllUsersCount(req, resp) {
  // console.log(User.allUsers.length + "+++");
  const allusers = await User.getAllUsers();
  resp.status(200).send(allusers.length.toString());
}
module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
  createAdmin,
  isValidAdmin,
  toogleActiveFlag,
  getAllUsersCount,
};
