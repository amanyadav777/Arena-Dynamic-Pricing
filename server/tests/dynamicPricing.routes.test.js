import request from "supertest";
import sinon from "sinon";
import { expect } from "chai";
import { app } from "../src/app.js";
import mongoose from "mongoose";
import { Arena } from "../src/models/arena.model.js";
import { DynamicPricing } from "../src/models/dynamicPricing.model.js";
import { calculatePriceChange } from "../src/controllers/arena.controller.js";
import { checkTimeValidity } from "../src/utils/extraFunctions.js";
