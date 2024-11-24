import { Chat } from "../models/chat.model.js";

export const saveMessage = async (req, res) => {
  const { senderId, recipientId, message } = req.body;

  try {
    const chatMessage = new Chat({ senderId, recipientId, message });
    const savedMessage = await chatMessage.save();
    res.status(201).json({ message: "Message saved", data: savedMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving message", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { senderId, recipientId } = req.query;

  try {
    const messages = await Chat.find({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};
