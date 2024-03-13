const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const { default: mongoose } = require("mongoose");

//@desc Get Contact
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc Get Contacts
const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Invalid Id");
  }

  const contact = await Contact.findById(id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@desc Create Contact
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    throw new Error("Data missing");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

//@desc Update Contact
const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Invalid Id");
  }

  const contact = await Contact.findById(id);

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Cannot alter this contact");
  }

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  const updateContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(201).json(updateContact);
});

//@desc Delete Contact
const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Invalid Id");
  }

  const contact = await Contact.findById(id);

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Cannot delete this contact");
  }

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  await Contact.findByIdAndDelete(id);
  res.status(204).json({ message: "deleted" });
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
