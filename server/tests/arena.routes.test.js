import request from "supertest";
import sinon from "sinon";
import { expect } from "chai";
import { app } from "../src/app.js";
import mongoose from "mongoose";
import { Arena } from "../src/models/arena.model.js";
import {DynamicPricing} from "../src/models/dynamicPricing.model.js";
import { getArenaDetails,calculatePriceChange } from "../src/controllers/arena.controller.js";
import { checkTimeValidity } from "../src/utils/extraFunctions.js";

describe("POST /create-arena", () => {
  let createArenaStub;

  beforeEach(() => {
    // Stub Arena.create to avoid interacting with the database
    createArenaStub = sinon.stub(Arena, "create");
  });

  afterEach(() => {
    // Restore the stubbed method after each test
    createArenaStub.restore();
  });

  // it("should create an arena successfully when valid data is provided", async () => {
  //   const mockArenaData = {
  //     name: "BADMINTON",
  //     originalPricing: [
  //       { duration: "60 mins", price: "200" },
  //       { duration: "90 mins", price: "250" },
  //       { duration: "120 mins", price: "290" },
  //     ],
  //   };

  //   const mockArena = {
  //     _id: "676311f54a882899dd9de320",
  //     name: "BADMINTON",
  //     originalPricing: mockArenaData.originalPricing,
  //     imageUrl: "http://example.com/image.jpg",
  //     createdAt: "2024-12-18T18:18:29.769Z",
  //     updatedAt: "2024-12-18T18:18:29.769Z",
  //   };

  //   createArenaStub.resolves(mockArena);

  //   const response = await request(app)
  //     .post("/api/v1/arena/create-arena")
  //     .field("name", mockArenaData.name)
  //     .field("originalPricing", JSON.stringify(mockArenaData.originalPricing));

  //   expect(response.body.statusCode).to.equal(201);
  //   expect(response.body.success).to.be.true;
  //   expect(response.body.data).to.have.property("_id", mockArena._id);
  //   expect(response.body.message).to.equal("Arena created Successfully");
  // });

  it("should return 400 if the data is invalid (missing fields)", async () => {
    const invalidData = {
      name: "", 
      originalPricing: [], 
    };

    const response = await request(app)
      .post("/api/v1/arena/create-arena")
      .field("name", invalidData.name)
      .field("originalPricing", JSON.stringify(invalidData.originalPricing));

    expect(response.status).to.equal(400);
    expect(response.body.success).to.be.false;
    expect(response.body.message).to.equal(
      "All fields are required and must be valid"
    );
  });

  // it("should return 409 if an arena with the same name already exists", async () => {
  //   const duplicateArenaData = {
  //     name: "BADMINTON",
  //     originalPricing: [{ duration: "60 mins", price: "200" }],
  //   };

  //   createArenaStub.resolves(null); 

  //   const response = await request(app)
  //     .post("/api/v1/arena/create-arena")
  //     .field("name", duplicateArenaData.name)
  //     .field(
  //       "originalPricing",
  //       JSON.stringify(duplicateArenaData.originalPricing)
  //     );

  //   expect(response.status).to.equal(409);
  //   expect(response.body.success).to.be.false;
  //   expect(response.body.message).to.equal(
  //     "Arena with this name already exists"
  //   );
  // });
});

describe("GET /original-arena-details/:id", () => {
  let findByIdStub;

  beforeEach(() => {
    // Stub the Arena.findById method to mock the DB call
    findByIdStub = sinon.stub(Arena, "findById");
  });

  afterEach(() => {
    // Restore the stub after each test
    findByIdStub.restore();
  });

  it("should return arena details when a valid ID is provided", async () => {
    const mockArena = {
      _id: "676311f54a882899dd9de320",
      name: "BADMINTON",
      originalPricing: [
        { duration: "60 mins", price: "200", _id: "676311f54a882899dd9de321" },
        { duration: "90 mins", price: "250", _id: "676311f54a882899dd9de322" },
        { duration: "120 mins", price: "290", _id: "676311f54a882899dd9de323" },
      ],
      imageUrl:
        "http://res.cloudinary.com/sample_image.jpg",
      createdAt: "2024-12-18T18:18:29.769Z",
      updatedAt: "2024-12-18T18:18:29.769Z",
      __v: 0,
    };

    findByIdStub.resolves(mockArena);

    const response = await request(app).get(
      "/api/v1/arena/original-arena-details/676311f54a882899dd9de320"
    );

    expect(response.body.statusCode).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.message).to.equal(
      "Arena Details fetched successfully"
    );
    expect(response.body.data).to.deep.equal(mockArena);
  });

  it("should return an error when an invalid ID is provided", async () => {
    findByIdStub.resolves(null); // Arena not found

    const response = await request(app).get(
      "/api/v1/arena/original-arena-details/invalidId"
    );
    
    expect(response.status).to.equal(404);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal(
      "Arena not found, Invalid arena ID."
    );
  });

});

describe("GET /list-of-arenas", () => {
  let findStub;

  beforeEach(() => {
    findStub = sinon.stub(Arena, "find");
  });

  afterEach(() => {
    findStub.restore();
  });

  it("should fetch all arenas and return a success response", async () => {
    // Mock data returned from the database
    const mockArenas = [{ name: "Arena 1" }, { name: "Arena 2" }];
    findStub.resolves(mockArenas);

    const response = await request(app).get("/api/v1/arena/list-of-arenas");

    // Assertions
    expect(response.body.statusCode).to.equal(200);
    expect(response.body.data).to.deep.equal(mockArenas);
    expect(response.body.message).to.equal("All Arenas fetched successfully");
  });

  it("should handle errors and return an error response", async () => {
    // Simulate an error in the controller
    findStub.rejects(new Error("Database error"));

    const response = await request(app).get("/api/v1/arena/list-of-arenas");

    // Assertions
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal("Something went wrong!");
  });
});

describe("DELETE /delete-arena/:id", () => {
  let findByIdAndDeleteStub;
  let deleteManyStub;

  beforeEach(() => {
    findByIdAndDeleteStub = sinon.stub(Arena, "findByIdAndDelete");
    deleteManyStub = sinon.stub(DynamicPricing, "deleteMany");
  });

  afterEach(() => {
    findByIdAndDeleteStub.restore();
    deleteManyStub.restore();
  });

  it("should delete the arena and return success message when a valid ID is provided", async () => {
    const mockArena = {
      _id: "676311f54a882899dd9de320",
      name: "BADMINTON",
      originalPricing: [
        { duration: "60 mins", price: "200", _id: "676311f54a882899dd9de321" },
        { duration: "90 mins", price: "250", _id: "676311f54a882899dd9de322" },
        { duration: "120 mins", price: "290", _id: "676311f54a882899dd9de323" },
      ],
      imageUrl: "http://res.cloudinary.com/sample_image.jpg",
      createdAt: "2024-12-18T18:18:29.769Z",
      updatedAt: "2024-12-18T18:18:29.769Z",
      __v: 0,
    };

    findByIdAndDeleteStub.resolves(mockArena); // Simulate successful arena deletion
    deleteManyStub.resolves(); // Simulate successful deletion from DynamicPricing

    const response = await request(app).delete(
      "/api/v1/arena/delete-arena/676311f54a882899dd9de320"
    );

    expect(response.body.statusCode).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.message).to.equal("Arena deleted successfully");
  });

  it("should return an error when the arena is not found (invalid ID)", async () => {
    // Simulate that the arena is not found
    findByIdAndDeleteStub.resolves(null); // Arena not found
    deleteManyStub.resolves(); // Simulate DynamicPricing deletion

    const response = await request(app).delete(
      "/api/v1/arena/delete-arena/invalidId"
    );

    expect(response.status).to.equal(404);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal("Arena not found.");
  });

});

describe("PATCH /update-arena/:id", () => {
  let findByIdStub, findOneStub, saveStub;

  beforeEach(() => {
    findByIdStub = sinon.stub(Arena, "findById");
    findOneStub = sinon.stub(Arena, "findOne");
    saveStub = sinon.stub(Arena.prototype, "save");
  });

  afterEach(() => {
    findByIdStub.restore();
    findOneStub.restore();
    saveStub.restore();
  });

  it("should update an arena successfully when valid data is provided", async () => {
    const mockArena = {
      _id: "676311f54a882899dd9de320",
      name: "BADMINTON",
      originalPricing: [
        { duration: "60 mins", price: "200" },
        { duration: "90 mins", price: "250" },
        { duration: "120 mins", price: "290" },
      ],
      save: sinon.stub().resolves(this),
    };

    const updatedArenaData = {
      name: "TENNIS",
      originalPricing: [
        { duration: "60 mins", price: "150" },
        { duration: "90 mins", price: "200" },
      ],
    };

    findByIdStub.resolves(mockArena);
    findOneStub.resolves(null); // No existing arena with the new name
    saveStub.resolves(mockArena);

    const response = await request(app)
      .patch(`/api/v1/arena/update-arena/${mockArena._id}`)
      .send(updatedArenaData);

    expect(response.body.statusCode).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.message).to.equal("Arena updated successfully");
  });

  it("should return 400 if the arena name already exists", async () => {
    const mockArena = {
      _id: "676311f54a882899dd9de320",
      name: "BADMINTON",
      originalPricing: [{ duration: "60 mins", price: "200" }],
    };

    const invalidArenaData = {
      name: "BADMINTON", // Same name as the existing arena
      originalPricing: [{ duration: "60 mins", price: "200" }],
    };

    findByIdStub.resolves(mockArena);
    findOneStub.resolves(mockArena); // Arena with the same name already exists

    const response = await request(app)
      .patch(`/api/v1/arena/update-arena/${mockArena._id}`)
      .send(invalidArenaData);

    expect(response.status).to.equal(400);
    expect(response.body.success).to.be.false;
    expect(response.body.message).to.equal(
      "Name with this arena already Exists!."
    );
  });

  it("should return 400 if the original pricing array is invalid", async () => {
    const mockArena = {
      _id: "676311f54a882899dd9de320",
      name: "BADMINTON",
      originalPricing: [{ duration: "60 mins", price: "200" }],
    };

    const invalidPricingData = {
      name: "TENNIS",
      originalPricing: [
        { duration: "", price: "150" }, // Invalid pricing (duration is empty)
        { duration: "90 mins", price: "" }, // Invalid pricing (price is empty)
      ],
    };

    findByIdStub.resolves(mockArena);
    findOneStub.resolves(null); // No arena with the new name
    saveStub.resolves(mockArena);

    const response = await request(app)
      .patch(`/api/v1/arena/update-arena/${mockArena._id}`)
      .send(invalidPricingData);

    // Validate the response
    expect(response.status).to.equal(400);
    expect(response.body.success).to.be.false;
    expect(response.body.message).to.equal(
      "Original pricing values should be valid."
    );
  });

  it("should return 404 if the arena is not found", async () => {
    const mockArenaId = "676311f54a882899dd9de320";
    const invalidArenaData = {
      name: "TENNIS",
      originalPricing: [{ duration: "60 mins", price: "150" }],
    };

    findByIdStub.resolves(null);

    const response = await request(app)
      .patch(`/api/v1/arena/update-arena/${mockArenaId}`)
      .send(invalidArenaData);

    expect(response.status).to.equal(404);
    expect(response.body.success).to.be.false;
    expect(response.body.message).to.equal("Arena not found.");
  });

});

describe("GET /get-arean-details/:id", function () {
  let findByIdStub;
  let findStub;

  beforeEach(() => {
    findByIdStub = sinon.stub(Arena, "findById");
    findStub = sinon.stub(DynamicPricing, "find");
  });

  afterEach(() => {
    findByIdStub.restore();
    findStub.restore();
  });

  it("should return an error if Arena is not found", async () => {
    const mockArenaId = "123";
    const reqData = {
      date: "01-12-2024",
      startTime: "14:00",
      duration: "60 mins",
    };

    findByIdStub.resolves(null);

    const response = await request(app)
      .get(`/api/v1/arena/get-arean-details/${mockArenaId}`)
      .query(reqData);
    
    
    // Assertions
    expect(response.status).to.equal(404);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal(
      "Arena not found, Invalid arena ID."
    );
  });

  it("should return error if invalid date format is provided", async () => {
    const mockArenaId = "123";
    const reqData = {
      date: "invalid-date", // Invalid date
      startTime: "14:00",
      duration: "60 mins",
    };
    findByIdStub.resolves({
      originalPricing: [{ duration: "60 mins", price: "200" }],
    });

    const response = await request(app)
      .get(`/api/v1/arena/get-arean-details/${mockArenaId}`)
      .query(reqData);
    
    // Assertions
    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal(
      "Invalid date format. Use DD-MM-YYYY."
    );
  });
});