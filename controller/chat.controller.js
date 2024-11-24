import { Chat } from "../models/chat.model.js";
import mongoose from "mongoose";

const saveMessage = async (req, res) => {
  const { senderId, recipientId, message } = req.body;

  try {
    const chatMessage = new Chat({ senderId, recipientId, message });
    const savedMessage = await chatMessage.save();
    console.log(savedMessage)
    res.status(201).json({ message: "Message saved", data: savedMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving message", error: error.message });
  }
};

const getMessages = async (req, res) => {
  const { senderId, recipientId } = req.body;
 
  if (!senderId || !recipientId) {
    return res
      .status(400)
      .json({ message: "senderId and recipientId are required" });
  }

  try {
    const messages = await Chat.find({
      $or: [
        {
          senderId: new mongoose.Types.ObjectId(`${senderId}`),
          recipientId: new mongoose.Types.ObjectId(`${recipientId}`),
        },
        {
          senderId: new mongoose.Types.ObjectId(`${recipientId}`),
          recipientId: new mongoose.Types.ObjectId(`${senderId}`),
        },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};


export { saveMessage, getMessages };