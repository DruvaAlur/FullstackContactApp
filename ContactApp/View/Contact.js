const uuid = require("uuid");
const { ContactDetail } = require("./ContactDetail.js");
const { DatabaseMongoose } = require("../Repository/Repository");
// const { User } = require("./User.js");
class Contact {
  constructor(fname, lname) {
    this.contactId = uuid.v4();
    this.fname = fname;
    this.lname = lname;
    this.isActive = true;
    this.fullname = fname + " " + lname;
    this.contactDetails = [];
  }
  findContactDetail(type) {
    for (let index = 0; index < this.contactDetails.length; index++) {
      if (this.contactDetails[index].type === type) {
        return [true, index];
      }
    }
    return [false, -1];
  }
  static async updateContactDetail(
    contact,
    type,
    propertTobeUpdated,
    propvalue
  ) {
    const dbs = await new DatabaseMongoose();
    console.log(contact);
    let UpdateContactDetail = await dbs.updateContactDetail(
      contact.contactDetails,
      type,
      propertTobeUpdated,
      propvalue
    );
    return UpdateContactDetail;
    // if (user.isActive == false) {
    //   return [false, this, "invalid contact"];
    // }
    // let [isContactDetailExists, indexOfContactDetail] =
    //   this.findContactDetail(type);
    // console.log(indexOfContactDetail);
    // switch (propertTobeUpdated) {
    //   case "type": {
    //     this.contactDetails[indexOfContactDetail].type = propvalue;

    //     return true;
    //   }
    //   case "value": {
    //     this.contactDetails[indexOfContactDetail].value = propvalue;

    //     return true;
    //   }
    //   default:
    //     return false;
    // }
  }
  static async createContactDetail(contact, type, value) {
    // if (this.isActive === false) {
    //   return "invalid contact";
    // }
    // let [isContactDetailExists, indexOfContactDetail] =
    //   this.findContactDetail(type);
    // if (isContactDetailExists) {
    //   return false;
    // }
    let newContactDetail = new ContactDetail(type, value);
    const dbs = await new DatabaseMongoose();
    let contactDetail = await dbs.insertOneContactDetail(newContactDetail);
    if (contactDetail == null) {
      // console.log("in false");
      return false;
    }
    const updatedCD = await dbs.insertContactDetailInUserContact(
      contact,
      contactDetail
    );
    // console.log(updatedCD);
    // this.contactDetails.push(newContactDetail);
    return contactDetail;
  }
  deleteContact() {
    if (this.isActive == false) {
      return "invalid Contact";
    }
    this.isActive = false;
    return true;
  }
  static async getContact(user, fullname) {
    const contacts = user.contacts;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].fullname == fullname && contacts[i].isActive == true) {
        const dbs = await new DatabaseMongoose();
        let record = await dbs.getContact(contacts[i]._id);
        // console.log(record);
        return record;
      }
    }
    // const dbs = await new DatabaseMongoose();
    // let record = await dbs.getContact(fullname);
    // console.log(record);

    return null;
  }

  update(propertTobeUpdated, value) {
    if (this.isActive == false) {
      return [false, this, "invalid contact"];
    }
    // console.log(propertTobeUpdated);
    switch (propertTobeUpdated) {
      case "firstname": {
        this.fname = value;
        this.UpdateFullname();
        return [true, this, "firstname updated successfully"];
      }
      case "lastname": {
        this.lname = value;
        this.UpdateFullname();
        return [true, this, "lastname updated successfully"];
      }
      default:
        return [false, this, "contact not updated "];
    }
  }

  UpdateFullname() {
    this.fullname = this.fname + " " + this.lname;
  }
}
module.exports = { Contact };
