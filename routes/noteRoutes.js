
const express = require("express");
const Note = require("../models/Note");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// CREATE NOTE
router.post("/", async (req, res) => {
    try {
        const note = await Note.create({
            title: req.body.title,
            content: req.body.content,
            owner: req.user.id
        });

        res.status(201).json(note);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ALL USER NOTES
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find({ owner: req.user.id });

        res.status(200).json(notes);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE NOTE
router.put("/:id", async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            {
                title: req.body.title,
                content: req.body.content
            },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json(note);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE NOTE
router.delete("/:id", async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
