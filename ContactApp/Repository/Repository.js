let { ContactDetailModel } = require("../model/ContactDetail/ContactDetail");
let { ContactModel } = require("../model/Contact/Contact");
let { CredentialModel } = require("../model/Credential/Credential");
let { UserModel } = require("../model/User/User");
let mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/ContactApp";
class DatabaseMongoose {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(url)
      .then(() => {
        ("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
  async insertOneCredential(credential) {
    try {
      // console.log(CredentialModel);
      let newRecord = await CredentialModel.create(credential);
      // console.log(newRecord);
      return newRecord;
    } catch (e) {
      console.log(e.message);
    }
  }
  async insertOneUser(user) {
    try {
      let newRecord = await UserModel.create(user);
      // console.log(newRecord);
      return newRecord;
    } catch (e) {
      console.log(e.message);
    }
  }
  async insertOneContact(Contact) {
    try {
      let newRecord = await ContactModel.create(Contact);
      // console.log(newRecord);
      return newRecord;
    } catch (e) {
      console.log(e.message);
    }
  }
  async insertOneContactDetail(contactDetail) {
    try {
      let newRecord = await ContactDetailModel.create(contactDetail);
      // console.log(newRecord);
      return newRecord;
    } catch (e) {
      console.log(e.message);
    }
  }
  async getCredential(username) {
    try {
      let record = await CredentialModel.findOne({ username: username });
      // console.log(record);
      return record;
    } catch (e) {
      console.log(e.message);
    }
  }
  async getUser(id) {
    // let record = await BookModel.find({ name: name })
    try {
      let record = await UserModel.findOne({ credential: id })
        .populate("credential")
        .populate("contacts");

      return record;
    } catch (e) {
      console.log(e.message);
    }
  }
  async getAllUsers() {
    // let record = await BookModel.find({ name: name })
    try {
      let record = await UserModel.find().populate("credential");

      return record;
    } catch (e) {
      console.log(e.message);
    }
  }
  async insertOneContactInUser(user, Contact) {
    try {
      let record = await UserModel.update(
        { _id: user._id },
        // { $set: { books: [...user[0].books, book[0]._id] } }
        { $push: { contacts: Contact._id } }
      );
      return record;
    } catch (e) {
      console.log(e.message);
    }
  }
  async getContact(id) {
    // let record = await BookModel.find({ name: name })
    try {
      // console.log(fullname);
      let record = await ContactModel.findOne({ _id: id }).populate(
        "contactDetails"
      );
      // console.log(record);
      return record;
    } catch (e) {
      console.log(e.message);
    }
  }
  //   async getContact()

  async insertContactDetailInUserContact(contact, contactDetail) {
    try {
      let record = await ContactModel.update(
        { _id: contact._id },
        // { $set: { books: [...user[0].books, book[0]._id] } }
        { $push: { contactDetails: contactDetail._id } }
      );
      return record;
    } catch (e) {
      console.log(e.message);
    }
  }
  async updateUser(id, propertyToUpdate, value) {
    try {
      if (propertyToUpdate == "username") {
        let user = await UserModel.findOne({ _id: id });
        let credentialId = user.credential._id;
        let updatedCred = this.updateCredential(
          credentialId,
          propertyToUpdate,
          value
        );
        return updatedCred;
      }
      let updatedUser = await UserModel.update(
        { _id: id },
        { $set: { [propertyToUpdate]: value } }
      );
      return updatedUser;
    } catch (e) {
      console.log(e.message);
    }
  }
  async updateCredential(credentialId, propertyToUpdate, value) {
    try {
      let updatedCred = await CredentialModel.update(
        { _id: credentialId },
        { $set: { [propertyToUpdate]: value } }
      );
      return updatedCred;
    } catch (e) {
      console.log(e.message);
    }
  }
  async updateContact(id, propertyToUpdate, value) {
    try {
      let updatedContact = await ContactModel.update(
        { _id: id },
        { $set: { [propertyToUpdate]: value } }
      );
      return updatedContact;
    } catch (e) {
      console.log(e.message);
    }
  }
  async updateContactDetail(contactDetail, type, propertyToUpdate, value) {
    // console.log(contactDetail);
    // console.log(type);
    // console.log(propertyToUpdate);
    // console.log(value);
    try {
      let updatedContact = await ContactDetailModel.update(
        { type: type },
        { $set: { [propertyToUpdate]: value } }
      );
      return updatedContact;
    } catch (e) {
      console.log(e.message);
    }
  }
}
module.exports = { DatabaseMongoose };
