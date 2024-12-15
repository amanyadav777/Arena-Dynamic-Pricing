import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Arena } from "../models/arena.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DynamicPricing } from "../models/dynamicPricing.model.js";
import { checkTimeValidity } from "../utils/extraFunctions.js";

const createArena = asyncHandler(async (req, res) => {
  const { name, originalPricing } = req.body;
  const parsedOriginalPricing = JSON.parse(originalPricing);
  // console.log(name, parsedOriginalPricing);

  // validating all fields
  // name is required and non-empty string
  //Check that 'originalPricing' is an array
  //Ensure the array is not empty
  // Validate that each array item has non-empty 'duration' and 'price'
  if (
    !name?.trim() ||
    !Array.isArray(parsedOriginalPricing) ||
    parsedOriginalPricing.length === 0 ||
    parsedOriginalPricing.some(
      (item) => !item.duration?.trim() || !item.price?.trim()
    )
  ) {
    throw new ApiError(400, "All fields are required and must be valid");
  }

  // Check if an arena with the same name already exists
  const existedArena = await Arena.findOne({ name });

  if (existedArena) {
    throw new ApiError(409, "Arena with this name already exists");
  }
  //   console.log(req.files);

  // handling image and uploading it to cloudinary
  // taking image url of cloudinary and storing it in db
  let arenaImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.arenaImage) &&
    req.files.arenaImage.length > 0
  ) {
    arenaImageLocalPath = req.files.arenaImage[0].path;
  }
  // console.log(arenaImageLocalPath);

  const arenaImage = await uploadOnCloudinary(arenaImageLocalPath);
  //   console.log(arenaImage);
  //   console.log(arenaImage?.url);

  // creating arena in db
  const arena = await Arena.create({
    name: name.toUpperCase(),
    originalPricing: parsedOriginalPricing,
    imageUrl: arenaImage?.url,
  });

  const createdArena = await Arena.findById(arena._id);

  if (!createdArena) {
    throw new ApiError(500, "Something went wrong while creating the Arena");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdArena, "Arena created Successfully"));
});

const updateArenaDetails = asyncHandler(async (req, res) => {
  const { id } = req.params; // get arena id from params

  // ID should not be null
  if (!id) {
    throw new ApiError(400, "Arena ID is required.");
  }

  const { name, originalPricing } = req.body;

  // Find the arena by ID
  const arena = await Arena.findById(id);

  if (!arena) {
    throw new ApiError(404, "Arena not found.");
  }

  // Update the fields if they are provided in the request body
  if (name?.trim()) {
    arena.name = name.trim();
  }

  if (originalPricing) {
    if (!Array.isArray(originalPricing)) {
      throw new ApiError(400, "Original pricing must be an array.");
    } else if (originalPricing.length === 0) {
      throw new ApiError(400, "Original pricing array should not be empty.");
    } else if (
      originalPricing.some(
        (item) => !item.duration?.trim() || !item.price?.trim()
      )
    ) {
      throw new ApiError(400, "Original pricing values should be valid.");
    }
    arena.originalPricing = originalPricing;
  }

  // Save the updated arena
  const updatedArena = await arena.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedArena, "Arena updated successfully"));
});

const deleteArena = asyncHandler(async (req, res) => {
  const { id } = req.params; // get arena id from params

  // ID should not be null
  if (!id) {
    throw new ApiError(400, "Arena ID is required.");
  }

  // Find the arena by ID and delete it
  const arena = await Arena.findByIdAndDelete(id);

  if (!arena) {
    throw new ApiError(404, "Arena not found.");
  }

  // Respond with success message
  return res
    .status(200)
    .json(new ApiResponse(200, "Arena deleted successfully"));
});

const updateArenaImage = asyncHandler(async (req, res) => {
  const { id } = req.params; // get arena id from params

  // ID should not be null
  if (!id) {
    throw new ApiError(400, "Arena ID is required.");
  }

  const arenaImageLocalPath = req.file?.path;

  if (!arenaImageLocalPath) {
    throw new ApiError(400, "Arena image file is missing");
  }

  //TODO: delete old image

  const arenaImage = await uploadOnCloudinary(arenaImageLocalPath);

  if (!arenaImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const arena = await Arena.findByIdAndUpdate(
    id,
    {
      $set: {
        imageUrl: arenaImage.url,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, arena, "Cover image updated successfully"));
});

const getAllArenas = asyncHandler(async (req, res) => {
  const arenas = await Arena.find();
  return res
    .status(200)
    .json(new ApiResponse(200, arenas, "All Arenas fetched successfully"));
});

const orginalArenaDetails = asyncHandler(async (req, res) => {
  const { id } = req.params; // get arena id from params

  // ID should not be null
  if (!id) {
    throw new ApiError(400, "Arena ID is required.");
  }
  // Find the arena by ID
  const arena = await Arena.findById(id);

  if (!arena) {
    throw new ApiError(404, "Arena not found, Invalid arena ID.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, arena, "Arena Details fetched successfully"));
});

const calculatePriceChange = async (date, day, startTime, duration) => {
  // precedence is
  // 1. date and time
  // 2. day and time
  // 3. time
  // 4. original price
  
  // console.log(date,day,startTime);

  const conditions = [
    // Check for specific duration first
    {
      $and: [
        { date },
        { day: "N/A" },
        { startTime: { $lte: startTime } },
        { endTime: { $gt: startTime } },
        { duration },
      ],
    },
    // Check for "all" as fallback
    {
      $and: [
        { date },
        { day: "N/A" },
        { startTime: { $lte: startTime } },
        { endTime: { $gt: startTime } },
        { duration: "all" },
      ],
    },
    {
      $and: [
        { date: "N/A" },
        { day },
        { startTime: { $lte: startTime } },
        { endTime: { $gt: startTime } },
        { duration },
      ],
    },
    {
      $and: [
        { date: "N/A" },
        { day },
        { startTime: { $lte: startTime } },
        { endTime: { $gt: startTime } },
        { duration: "all" },
      ],
    },
    {
      $and: [
        { date: "N/A" },
        { day: "N/A" },
        { startTime: { $lte: startTime } },
        { endTime: { $gt: startTime } },
        { duration },
      ],
    },
    {
      $and: [
        { date: "N/A" },
        { day: "N/A" },
        { startTime: { $lte: startTime } },
        { endTime: { $gt: startTime } },
        { duration: "all" },
      ],
    },
  ];

  const pricingRules = await DynamicPricing.find({ $or: conditions })
    .sort({ price: -1 }) // Sort by price in descending order
    .exec();

  // Return the first matched rule based on precedence
  if (pricingRules.length > 0) {
    return pricingRules[0].priceChange;
  }

  // Default price change
  return "0";
};

const getArenaDetails = asyncHandler(async (req, res) => {
  const { id } = req.params; // get arena id from params

  // ID should not be null
  if (!id) {
    throw new ApiError(400, "Arena ID is required.");
  }
  // Find the arena by ID
  const arena = await Arena.findById(id);

  if (!arena) {
    throw new ApiError(404, "Arena not found, Invalid arena ID.");
  }

  let { date, startTime, duration } = req.body;

  date = date?.trim();
  startTime = startTime?.trim();

  if (!startTime || !date) {
    throw new ApiError(400, "Date and Start Time is required");
  }

  let todayDay = "";
  if (date) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Matches DD-MM-YYYY
    if (!dateRegex.test(date)) {
      throw new ApiError(400, "Invalid date format. Use DD-MM-YYYY.");
    }

    // Split the date into day, month, and year
    const [day, month, year] = date.split("-").map(Number);
    const newDate = new Date(year, month - 1, day); // month is 0-indexed
    const daysOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    todayDay = daysOfWeek[newDate.getDay()];

    // Validate the date components
    const isValidDate = (d, m, y) => {
      const dateObj = new Date(y, m - 1, d);
      return (
        dateObj.getFullYear() === y &&
        dateObj.getMonth() === m - 1 &&
        dateObj.getDate() === d
      );
    };

    if (!isValidDate(day, month, year)) {
      throw new ApiError(
        400,
        "Invalid date. Ensure the day, month, and year are correct."
      );
    }
  }

  const priceToChange = await calculatePriceChange(date, todayDay, startTime, duration);

  return res
    .status(200)
    .json(
      new ApiResponse(200, priceToChange, "Arena Details fetched successfully")
    );
});

export {
  createArena,
  updateArenaDetails,
  deleteArena,
  updateArenaImage,
  getAllArenas,
  orginalArenaDetails,
  getArenaDetails,
};
