/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */

"use strict";

const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();

// Redis configuration
const connectRedis = () => {
  const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  });

  redis.on("connect", () => {
    console.log("Redis connected successfully");
  });

  redis.on("error", (error) => {
    console.error("Redis connection error:", error);
    process.exit(1);
  });

  redis.on("command", (command) => {
    console.log(
      `Redis command executed: ${command.name} with args: ${command.args}`
    );
  });

  return redis;
};

module.exports = connectRedis;
