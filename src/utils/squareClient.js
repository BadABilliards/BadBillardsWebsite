import { Client, Environment, ApiError } from "square";

export const client = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: Environment.Production,
    });
