import Conversation from "../models/coversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let converstion = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!converstion) {
      converstion = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      converstion.message.push(newMessage._id);
    }

    // await converstion.save();
    // await newMessage.save();
    await Promise.all([converstion.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error in sendMessage controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("message");

    if (!conversation) return res.status(200).json([]);

    const message = conversation.message;

    res.status(200).json(conversation.message);
  } catch (err) {
    console.log("Error in getMessage controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
