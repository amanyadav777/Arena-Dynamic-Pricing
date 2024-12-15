import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Arena } from "../models/arena.model.js";
import { DynamicPricing } from "../models/dynamicPricing.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { checkTimeValidity } from "../utils/extraFunctions.js";

const createDynamicPricingArena = asyncHandler(async (req, res) => {
    let { arenaId, date, day, startTime, endTime, price } = req.body;
    date=date?.trim();
    day=day?.trim();
    day=day?.toUpperCase();
    startTime=startTime?.trim();
    endTime=endTime?.trim();

  if (!arenaId) {
    throw new ApiError(400, "Arena ID is required.");
  }

  // Find the arena by ID
  const arena = await Arena.findById(arenaId);

  if (!arena) {
    throw new ApiError(404, "Arena not found, Invalid Arena Id");
  }

  // validating all other fields
  // startTime is required and non-empty string
  // endTime is required and non-empty string
  // price is required and non-empty string
  if (!startTime?.trim() || !endTime?.trim() || !price?.trim()) {
    throw new ApiError(400, "Start time, End time and price is required");
  }

  // Matches HH:mm format
  if (!checkTimeValidity(startTime)) {
    throw new ApiError(400, "Invalid startTime format. Use HH:mm.");
  }
  if (!checkTimeValidity(endTime)) {
    throw new ApiError(400, "Invalid endTime format. Use HH:mm.");
  }

  // Ensure startTime is before endTime
  const start = new Date(`1970-01-01T${startTime}:00Z`);
  const end = new Date(`1970-01-01T${endTime}:00Z`);
  if (start >= end) {
    throw new ApiError(400, "startTime must be before endTime.");
  }

  // Validate price
  const parsedPrice = Number(price); // Convert to a number
  if (isNaN(parsedPrice)) {
    throw new ApiError(400, "Price must be a valid number.");
  }

  // date validation
  if (date) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Matches DD-MM-YYYY
    if (!dateRegex.test(date)) {
      throw new ApiError(400, "Invalid date format. Use DD-MM-YYYY.");
    }

    // Split the date into day, month, and year
    const [day, month, year] = date.split("-").map(Number);

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
  } else {
    date = "N/A";
  }

  // Validate day if provided
  if (day) {
    const validDays = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    if (!validDays.includes(day)) {
      throw new ApiError(400, "Invalid day. Must be a valid day of the week.");
    }
  } else {
    day = "N/A";
  }

  // Check if an arena with the same name already exists
  const existedDynamicPricingArena = await DynamicPricing.findOne({
    arenaDetails: arenaId,
    date,
    day: day.toUpperCase(),
    startTime,
    endTime,
  });

  if (existedDynamicPricingArena) {
    throw new ApiError(
      409,
      "Dynamic Pricing Arena with these details already exists, Update the existing one."
    );
  }

  const dynamicPricingArena = await DynamicPricing.create({
    arenaDetails: arenaId,
    date,
    day: day.toUpperCase(),
    startTime,
    endTime,
    priceChange: price,
  });

  const createdDynamicPricingArena = await DynamicPricing.findById(
    dynamicPricingArena._id
  );

  if (!createdDynamicPricingArena) {
    throw new ApiError(500, "Something went wrong while creating the Arena");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdDynamicPricingArena,
        "Dynamic Pricing Arena created Successfully"
      )
    );
});

const updateDynamicPricingArenaDetails = asyncHandler(async (req, res) => {
  const { id } = req.params; // get arena id from params

  // ID should not be null
  if (!id) {
    throw new ApiError(400, "Arena ID is required.");
  }

    let { date, day, startTime, endTime, price } = req.body;
    date = date?.trim();
    day = day?.trim();
    day = day?.toUpperCase();
    startTime = startTime?.trim();
    endTime = endTime?.trim();

  // Find the arena by ID
  const dynamicPricingArena = await DynamicPricing.findById(id);

  if (!dynamicPricingArena) {
    throw new ApiError(404, "Arena not found.");
  }

  // Update the fields if they are provided in the request body
  if (date?.trim()) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Matches DD-MM-YYYY
    if (!dateRegex.test(date.trim())) {
      throw new ApiError(400, "Invalid date format. Use DD-MM-YYYY.");
    }

    // Split the date into day, month, and year
    const [day, month, year] = date.split("-").map(Number);

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

    dynamicPricingArena.date = date;
  }

  // if day exists
  if (day?.trim()) {
    const validDays = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    if (!validDays.includes(day.toUpperCase())) {
      throw new ApiError(400, "Invalid day. Must be a valid day of the week.");
    }
    dynamicPricingArena.day = day.toUpperCase();
  }

  // if price exists
  if (price?.trim()) {
    const parsedPrice = Number(price); // Convert to a number
    if (isNaN(parsedPrice)) {
      throw new ApiError(400, "Price must be a valid number.");
    }
    dynamicPricingArena.priceChange = price;
  }

  // for timing
  if (startTime?.trim() && endTime?.trim()) {
    if (!checkTimeValidity(startTime)) {
      throw new ApiError(400, "Invalid startTime format. Use HH:mm.");
    }
    if (!checkTimeValidity(endTime)) {
      throw new ApiError(400, "Invalid endTime format. Use HH:mm.");
    }
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${endTime}:00Z`);
    if (start >= end) {
      throw new ApiError(400, "startTime must be before endTime.");
    }
    dynamicPricingArena.startTime = startTime;
    dynamicPricingArena.endTime = endTime;
  } else if (startTime?.trim()) {
    if (!checkTimeValidity(startTime)) {
      throw new ApiError(400, "Invalid startTime format. Use HH:mm.");
    }
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${dynamicPricingArena.endTime}:00Z`);
    if (start >= end) {
      throw new ApiError(400, "startTime must be before endTime.");
    }
    dynamicPricingArena.startTime = startTime;
  } else if (endTime?.trim()) {
    if (!checkTimeValidity(endTime)) {
      throw new ApiError(400, "Invalid endTime format. Use HH:mm.");
    }
    const start = new Date(`1970-01-01T${dynamicPricingArena.startTime}:00Z`);
    const end = new Date(`1970-01-01T${endTime}:00Z`);
    if (start >= end) {
      throw new ApiError(400, "startTime must be before endTime.");
    }
    dynamicPricingArena.endTime = endTime;
  }

  // Save the updated arena
  const updatedDynamicPricingArena = await dynamicPricingArena.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedDynamicPricingArena,
        "Arena updated successfully"
      )
    );
});

const deleteDynamicPricingArena = asyncHandler(async (req, res) => {
  const { id } = req.params; // get arena id from params

  // ID should not be null
  if (!id) {
    throw new ApiError(400, "Dynamic Pricing Arena ID is required.");
  }

  // Find the arena by ID and delete it
  const dynamicPricingArena = await DynamicPricing.findByIdAndDelete(id);

  if (!dynamicPricingArena) {
    throw new ApiError(404, "Dynamic Pricing Arena not found.");
  }

  // Respond with success message
  return res
    .status(200)
    .json(new ApiResponse(200, "Dynamic Pricing Arena deleted successfully"));
});

const getArenaDynamicPricingList = asyncHandler(async (req, res) => {
  const { arenaId } = req.params; // get arena id from params

  // ID should not be null
  if (!arenaId) {
    throw new ApiError(400, "Arena ID is required.");
  }

  const dynamicPricingArenas = await DynamicPricing.find({
    arenaDetails: arenaId,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dynamicPricingArenas,
        "All Arenas fetched successfully"
      )
    );
});

const getArenaDynamicPricingDetails = asyncHandler(async (req, res) => {
  const { id } = req.params; // get arena id from params

  // ID should not be null
  if (!id) {
    throw new ApiError(400, "Dynamic Pricing Arena ID is required.");
  }
  // Find the arena by ID
  const dynamicPricingArena = await DynamicPricing.findById(id);

  if (!dynamicPricingArena) {
    throw new ApiError(404, "Dynamic Pricing Arena not found, Invalid ID.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dynamicPricingArena,
        "Dynamic Pricing Arena Details fetched successfully"
      )
    );
});

export {
  createDynamicPricingArena,
  updateDynamicPricingArenaDetails,
  deleteDynamicPricingArena,
  getArenaDynamicPricingDetails,
  getArenaDynamicPricingList,
};
