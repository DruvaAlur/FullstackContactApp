const { User } = require("../../View/User");

const { JWTPayload } = require("../../View/Authentication.js");
const { getContact } = require("../Contact/controller");
const { Contact } = require("../../View/Contact");
const { ContactDetail } = require("../../View/ContactDetail");
async function createContactDetail(req, resp) {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;
  // console.log();
  const { type, value, fullname } = req.body;
  if (
    username == null ||
    fullname == null ||
    value == null ||
    type == null ||
    username == "" ||
    fullname == "" ||
    value == "" ||
    type == ""
  ) {
    return resp.status(400).send("please send all required parameters");
  }
  // let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  // if (!isUserExists || !isUserActive) {
  //   return resp.status(400).send("user doesnt exists");
  // }
  // [indexOfContact, isContactActive, isContactExists] =
  //   User.allUsers[indexofUser].isContactExists(fullname);
  // if (!isContactActive || !isContactExists) {
  //   return resp.status(400).send("contact doesnt exists");
  // }
  let user = await User.getUser(username);
  if (user == null) {
    return resp.status(401).send("User not exists");
  }
  let contact = await Contact.getContact(user, fullname);
  if (contact == null) {
    return resp.status(401).send("contact not exists");
  }
  let contactDetail = await ContactDetail.getContactDetail(user, contact, type);
  if (contactDetail != null) {
    return resp.status(401).send("Contact Detail Type Already Exists");
  }

  let newContactDetail = await User.createContactDetail(
    username,
    fullname,
    type,
    value
  );
  // console.log(username + "_______");
  // console.log(fullname);
  // console.log(type);
  // console.log(value);
  // if (newContactDetail == false) {
  //   console.log("Contact Detail Type Already Exists");
  //   return resp.status(401).send("Contact Detail Type Already Exists");
  // }
  resp.status(201).send(newContactDetail);
}
async function updateContactDetail(req, resp) {
  const isValidUser = JWTPayload.isValidUser(req, resp);
  if (!isValidUser) {
    return "please login";
  }
  const username = req.params.username;

  const { fullname, propertTobeUpdated, propvalue, type } = req.body;
  console.log(fullname + "_+_+_++");
  if (
    username == null ||
    fullname == null ||
    propvalue == null ||
    propertTobeUpdated == null ||
    username == "" ||
    fullname == "" ||
    propvalue == "" ||
    propertTobeUpdated == ""
  ) {
    return resp.status(400).send("please send all required parameters");
  }
  // let [indexofUser, isUserActive, isUserExists] = User.isUserExists(username);

  // if (!isUserExists || !isUserActive) {
  //   return resp.status(400).send("user doesnt exists");
  // }
  // let [indexOfContact, isContactActive, isContactExists] =
  //   User.allUsers[indexofUser].isContactExists(fullname);
  // if (!isContactActive || !isContactExists) {
  //   return resp.status(400).send("contact doesnt exists");
  // }
  const user = await User.getUser(username);
  if (user == null) {
    return resp.status(401).send("User not exists");
  }
  const contact = await Contact.getContact(user, fullname);
  if (contact == null) {
    return resp.status(401).send("contact not exists");
  }
  // console.log(contact);
  if (propertTobeUpdated == "type") {
    let isContactDetailExists = await ContactDetail.getContactDetail(
      user,
      contact,
      propvalue
    );
    if (isContactDetailExists != null) {
      return resp.status(401).send("contact already exists");
    }
  }
  let isUpdated = await Contact.updateContactDetail(
    contact,
    type,
    propertTobeUpdated,
    propvalue
  );
  if (!isUpdated) return resp.status(400).send("update not successfull");
  resp.status(201).send("update done");
}
async function deleteContactDetail(req, resp) {
  const fullname = req.body.fullname;
  const type = req.body.type;
  const username = req.params.username;
  console.log(fullname);
  console.log(type);
  console.log(username);
  if (
    fullname == null ||
    username == null ||
    fullname == "" ||
    username == "" ||
    type == ""
  ) {
    return resp.status(400).send("please send all required parameters");
  }
  const user = await User.getUser(username);
  if (user == null) {
    return resp.status(400).send("Delete failed");
  }
  console.log("__user__");
  console.log(user);
  const contact = await Contact.getContact(user, fullname);
  console.log("______________________");
  console.log(contact);
  if (contact == null) {
    return resp.status(400).send("Delete failed");
  }
  console.log("_____________");
  const contactDetail = await ContactDetail.getContactDetail(
    user,
    contact,
    type
  );
  console.log(contactDetail);
  if (contactDetail == null) {
    return resp.status(400).send("Delete failed");
  }
  const update = await Contact.updateContactDetail(
    contact,
    type,
    "isActive",
    false
  );
  if (update == null) {
    return resp.status(400).send("Delete failed");
  }
  return resp.status(201).send("update Done");
}
// function getContactDetails(req, resp) {
//   const isValidUser = JWTPayload.isValidUser(req, resp);
//   if (!isValidUser) {
//     return "please login";
//   }
//   const username = req.params.username;
//   const contact = User;
// }
async function getContactDetail(req, resp) {
  const fullname = req.body.fullname;
  // const type = req.body.type;
  const username = req.params.username;
  // console.log(fullname);
  // console.log(type);
  // console.log(username);
  if (
    fullname == null ||
    username == null ||
    fullname == "" ||
    username == ""
  ) {
    return resp.status(400).send("please send all required parameters");
  }
  const user = await User.getUser(username);
  if (user == null) {
    return resp.status(400).send("Delete failed");
  }
  console.log("__user__");
  console.log(user);
  const contact = await Contact.getContact(user, fullname);
  const contactDetails = contact.contactDetails;
  let activeContactDetails = [];
  for (let i = 0; i < contactDetails.length; i++) {
    if (contactDetails[i].isActive) {
      activeContactDetails.push(contactDetails[i]);
    }
  }
  return resp.status(201).send(activeContactDetails);
}
module.exports = {
  createContactDetail,
  updateContactDetail,
  deleteContactDetail,
  getContactDetail,
};
