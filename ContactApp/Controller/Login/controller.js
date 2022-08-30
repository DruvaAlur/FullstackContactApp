const { User } = require("../../View/User.js");
const { DatabaseMongoose } = require("../../Repository/Repository");
const { Credential } = require("../../View/Credential");
const { JWTPayload } = require("../../View/Authentication.js");
async function login(req, resp) {
  const { username, password } = req.body;
  // console.log(username);
  // console.log(password);
  if (
    username == null ||
    password == null ||
    username == "" ||
    password == ""
  ) {
    return resp.status(401).send("please fill all fields in the form");
  }
  // let [indexOfUser, isUserActive, isUserExists] = User.isUserExists(username);
  // // if (!isUserExists) {
  // //   resp.status(400).send("user not exists");
  // // }

  // if (
  //   !isUserExists ||
  //   !(await Credential.comparePassword(
  //     password,
  //     User.allUsers[indexOfUser].credential.password
  //   )) ||
  //   !isUserActive
  // ) {
  //   return resp.status(401).send("Invalid Credentials");
  // }
  const dbs = await new DatabaseMongoose();
  const user = await User.getUser(username);
  if (user == null) {
    return resp.status(401).send("Invalid Credentials");
  }
  if (!(await Credential.comparePassword(password, user.credential.password))) {
    return resp.status(401).send("wrong password");
  }
  if (!user.isActive) {
    return resp.status(401).send("User not Active");
  }

  // console.log(user);
  const newPayload = new JWTPayload(user);
  const newToken = newPayload.createToken();

  resp.cookie("myToken", newToken);

  resp.status(200).send(user);
}
module.exports = { login };
