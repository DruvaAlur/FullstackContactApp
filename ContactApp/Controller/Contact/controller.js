const { User } = require("../../View/User.js");

const { JWTPayload } = require("../../View/Authentication.js");
const { Contact } = require("../../View/Contact.js");
async function createContact(req, resp) {
  // console.log(User.allUsers);
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  // console.log(username + "++");
  const { fname, lname } = req.body;
  // console.log(username + "+++++++++++++++");
  if (
    username == null ||
    fname == null ||
    lname == null ||
    username == "" ||
    fname == "" ||
    lname == ""
  ) {
    return resp.status(400).send("please send all required parameters");
  }
  // let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  // if (!isUserExists || !isUserActive) {
  //   resp.status(400).send("user doesnt exists");
  // }
  // const user = await User.getUser(username);
  // console.log(user);
  const contact = await User.createContact(username, fname, lname);
  // console.log(newcontact);
  if (contact == null) {
    resp.status(401).send("contact already exists");
    return;
  }
  resp.status(201).send(contact);
}
async function toggleContact(req, resp) {
  const fullname = req.body.fullname;
  const username = req.params.username;
  if (
    fullname == null ||
    username == null ||
    fullname == "" ||
    username == ""
  ) {
    return resp.status(400).send("please send all required parameters");
  }
  // let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  // if (!isUserExists || !isUserActive) {
  //   resp.status(400).send("user doesnt exists");
  // }
  // let [indexOfContact, isContactActive, isContactExist] =
  //   User.allUsers[indexofUser].isContactExists(fullname);
  // if (!isContactExist) {
  //   resp.status(400).send("Contact doesnt exists");
  // }
  const user = await User.getUser(username);
  if (user == null) {
    console.log("user doesnt exists");
  }
  const contact = await Contact.getContact(user, fullname);
  if (contact == null) {
    console.log("contact doesnt exists");
  }

  await User.updateContact(contact._id, "isActive", false);

  // User.allUsers[indexofUser].contacts[indexOfContact].isActive
  //   ? (User.allUsers[indexofUser].contacts[indexOfContact].isActive = false)
  //   : (User.allUsers[indexofUser].contacts[indexOfContact].isActive = true);
  // console.log(User.allUsers);
  resp.status(201).send("Contact toggled");
  return;
}
async function getAllContactsCount(req, resp) {
  const username = req.params.username;
  // let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  // if (!isUserExists || !isUserActive) {
  //   return resp.status(400).send("user doesnt exists");
  // }
  const user = await User.getUser(username);
  if (user == null) {
    return resp.status(401).send("User not exists");
  }
  resp.status(201).send(user.contacts.length.toString());
}
async function getContacts(req, resp) {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  const { limit, pageNumber } = req.body;
  let startIndex = (pageNumber - 1) * limit;
  let endIndex = pageNumber * limit;
  // console.log(startIndex + "++++++");
  // console.log(endIndex);
  // console.log(pageNumber);
  // console.log(limit);
  // console.log(username);
  if (username == null || username == "") {
    return resp.status(400).send("please send all required parameters");
  }
  // let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  // if (!isUserExists || !isUserActive) {
  //   resp.status(400).send("user doesnt exists");
  // }
  // const user=User.getC
  const contacts = await User.getContacts(username);
  let activeContacts = [];
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].isActive == true) {
      activeContacts.push(contacts[i]);
    }
  }
  if (contacts == null) {
    return resp.status(400).send("Contact Doesnt exists");
  }
  console.log(contacts);
  resp.status(201).send(activeContacts.slice(startIndex, endIndex));
}

async function updateContact(req, resp) {
  const isUser = JWTPayload.isValidUser(req, resp);
  if (!isUser) {
    return "unauthorized access";
  }
  const username = req.params.username;

  const propertTobeUpdated = req.body.propertyTobeUpdated;
  const value = req.body.value;
  const fullname = req.body.fullname;
  // console.log(username);
  // console.log(propertTobeUpdated);
  // console.log(value);
  // console.log(fullname);
  if (
    username == null ||
    propertTobeUpdated == null ||
    value == null ||
    fullname == null ||
    username == "" ||
    propertTobeUpdated == "" ||
    value == "" ||
    fullname == ""
  ) {
    return resp.status(400).send("please send all required parameters");
  }
  // const [indexOfUser, isuseractive, isUserExist] = User.isUserExists(username);
  // if (!isUserExist) {
  //   resp.status(504).send("invalid username");
  // }
  const user = await User.getUser(username);
  if (user == null) {
    return resp.status(401).send("User not exists");
  }
  let contact = await Contact.getContact(user, fullname);
  if (contact == null) {
    return resp.status(401).send("contact not exists");
  }
  if (propertTobeUpdated == "fname") {
    let isContactExists = await Contact.getContact(
      user,
      value + " " + contact.lname
    );
    console.log("++++++++++++++++++++++");
    console.log(isContactExists);
    if (isContactExists != null) {
      return resp.status(401).send("contact already exists");
    }
  }
  console.log(contact.fname);
  if (propertTobeUpdated == "lname") {
    let isContactExists = await Contact.getContact(
      user,
      contact.fname + " " + value
    );
    console.log("++++++++++++++++++++++");
    console.log(isContactExists);
    if (isContactExists != null) {
      return resp.status(401).send("contact already exists");
    }
  }

  console.log(contact);
  // let user=User.getUser(username)
  let updated = await User.updateContact(
    contact._id,
    propertTobeUpdated,
    value
  );
  if (!updated) {
    return resp.status(504).send("update failed");
  }
  contact = await Contact.getContact(user, fullname);
  if (contact == null) {
    return resp.status(401).send("contact not exists");
  }
  updated = await User.updateContact(
    contact._id,
    "fullname",
    contact.fname + " " + contact.lname
  );
  if (!updated) {
    return resp.status(504).send("update failed");
  }
  resp.status(200).send("update done");
}
function deleteContact(req, resp) {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  const { fullname } = req.body;
  if (
    username == null ||
    fullname == null ||
    username == "" ||
    fullname == ""
  ) {
    return resp.status(400).send("please send all required parameters");
  }
  let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);
  // console.log(isUserActive);
  if (!isUserExists || !isUserActive) {
    return resp.status(400).send("user doesnt exists");
  }
  resp.status(201).send(User.allUsers[indexofUser].deleteContact(fullname));
}
async function getContact(req, resp) {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  const { fullname } = req.body;

  // if (username == null) {
  //   resp.status(400).send("please send all required parameters");
  // }
  // let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);
  // let [indexofcontact, isContactActive, isContactExists] =
  //   User.allUsers[indexofUser].isContactExists(fullname);
  // if (!isUserExists || !isUserActive) {
  //   return resp.status(400).send("user doesnt exists");
  // }
  // if (!isContactActive || !isContactExists) {
  //   return resp.status(400).send("contact doesnt exists");
  // }
  const user = await User.getUser(username);
  if (user == null) {
    return resp.status(400).send("User doesnt exists");
  }
  const contact = await Contact.getContact(user, fullname);
  if (contact == null) {
    return resp.status(400).send("contact doesnt exists");
  }
  console.log(contact);
  resp.status(201).send(contact);
}
module.exports = {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  toggleContact,
  getAllContactsCount,
  getContact,
};
