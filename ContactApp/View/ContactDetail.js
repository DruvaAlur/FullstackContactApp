const uuid = require("uuid");
const { Contact } = require("./Contact");
// const { User } = require("./User");
class ContactDetail {
  constructor(type, value) {
    this.contactDetailId = uuid.v4();
    this.type = type;
    this.value = value;
    this.isActive = true;
  }
  static async getContactDetail(user, contact, type) {
    // console.log(username);
    // console.log(fullname);
    // console.log(type);
    // const user = await User.getUser(username);
    // const contact = await Contact.getContact(user, fullname);
    const contactDetail = contact.contactDetails;
    for (let i = 0; i < contactDetail.length; i++) {
      if (contactDetail[i].type == type && contactDetail[i].isActive == true) {
        return contactDetail[i];
      }
    }
    return null;
  }
}
module.exports = { ContactDetail };
