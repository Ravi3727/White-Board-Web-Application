const asyncHandler = require("../Api/asyncHandler.js");
const ApiError = require("../Api/ApiError.js");
const Canvas = require("../Models/CanvasSchema.js");
const ApiResponse = require("../Api/ApiResponse.js");
const mongoose = require("mongoose");
const User = require("../Models/User.js");

exports.getUserCanvases = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log("userId", userId);

        // Ensure userId is an ObjectId for proper comparison
        const userObjectId = new mongoose.Types.ObjectId(userId);
        // console.log("userObjectId", userObjectId);

        const canvases = await Canvas.find({
            $or: [{ owner: userObjectId }, { shared: userObjectId }]
        }).sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, canvases, "Canvas fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error?.message || "Error fetching canvases");
    }
});

exports.loadCanvas = asyncHandler(async (req, res) => {
    try {
        const canvasId = req.params.id;
        const userId = req.user._id;

        const canvas = await Canvas.findById(canvasId);
        if (!canvas) {
            throw new ApiError(404, "Canvas not found");
        }
        if (canvas.owner.toString() !== userId.toString() && !canvas.shared.includes( userId)) {
            throw new ApiError(403, "Unauthorized to access this canvas");
        }

        return res.status(200).json(new ApiResponse(200, canvas, "Canvas loaded successfully"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to load canvas");
    }
});

exports.createCanvas = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, element } = req.body;
        console.log(`createCanvas: ${name} ${element}`);
        console.log(userId);
        if (!name) {
            throw new ApiError(400, "Canvas name is required");
        }

        const newCanvas = new Canvas({
            name,
            owner: userId,
            shared: [],
            elements: element
        });

        await newCanvas.save();
        return res.status(201).json(
            new ApiResponse(201, { canvasId: newCanvas._id }, "Canvas created successfully")
        );
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to create canvas");
    }
});

exports.updateCanvas = asyncHandler(async (req, res) => {
    try {
        const { canvasId, elements } = req.body;
        const userId = req.user._id;

        const canvas = await Canvas.findById(canvasId);
        // console.log(canvas);
        if (!canvas) {
            throw new ApiError(404, "Canvas not found");
        }

         if (canvas.owner.toString() !== userId.toString() && !canvas.shared.includes( userId)) {
            throw new ApiError(403, "Unauthorized to access this canvas");
        }

        canvas.elements = elements;
        await canvas.save();

        return res.status(200).json(new ApiResponse(200, null, "Canvas updated successfully"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to update canvas");
    }
});

exports.deleteCanvas = asyncHandler(async (req, res) => {
    try {
        const canvasId = req.params.canvasId;
        const userId = req.user._id;

        // console.log("delete",canvasId);
        const canvas = await Canvas.findById(canvasId);
        if (!canvas) {
            throw new ApiError(404, "Canvas not found");
        }

        if (canvas.owner.toString() !== userId.toString()) {
            throw new ApiError(403, "Only the owner can delete this canvas");
        }

        await Canvas.findByIdAndDelete(canvasId);
        return res.status(200).json(new ApiResponse(200, null, "Canvas deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to delete canvas");
    }
});



exports.shareCanvas = asyncHandler(async (req, res) => {
    try {
        const { canvasId } = req.params;
        const { email } = req.body;
        const userId = req.user._id;

        const canvas = await Canvas.findById(canvasId);
        if (!canvas) {
            throw new ApiError(404, "Canvas not found");
        }

        // Check if the logged-in user is the owner of the canvas
        if (canvas.owner.toString() !== userId.toString()) {
            throw new ApiError(403, "Unauthorized to share this canvas");
        }

        // Find the user by email
        const userToShare = await User.findOne({ email });
        if (!userToShare) {
            throw new ApiError(404, "User not found in WhiteBoard application");
        }

        // Check if the user is already in the shared array
        if (canvas.shared.includes(userToShare._id) || canvas.owner.toString() === userToShare._id.toString()) {
            return res.status(400).json(new ApiResponse(400, null, "User already has access to this canvas"));
        }

        // Add user to the shared list
        canvas.shared.push(userToShare._id);
        await canvas.save();

        return res.status(200).json(new ApiResponse(200, null, "Canvas shared successfully"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to share canvas");
    }
});
