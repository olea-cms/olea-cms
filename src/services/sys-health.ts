import { max, min, sql } from "drizzle-orm";
import { db } from "../db";
import { avgResponseTimes } from "../schema";

export const SysHealthService = {
  async getInitTime() {
    // Get the current timestamp
    const currentTime = Date.now();
    // Get the process uptime in seconds and convert it to milliseconds
    const uptimeInMilliseconds = Bun.nanoseconds() / 1000000;
    // Calculate the start time of the process
    const startTime = currentTime - uptimeInMilliseconds;
    // Convert the start time to a Date object
    const startDate = new Date(startTime);

    return startDate;
  },
  // on objects, arrow functions do not get a `this` reference due to
  // their lexical scoping, so you have to use the function keyword
  async getFormattedInitTime() {
    const startDate = await this.getInitTime();
    // Format the date for readability
    const formattedStartDate = startDate.toISOString();

    console.log(`Process started at: ${formattedStartDate}`);

    return formattedStartDate;
  },
  async getAvgResponseTime(): Promise<number> {
    const { avgResponseTime } = (
      await db
        .select({
          avgResponseTime: sql`COALESCE (SUM(${avgResponseTimes.avgResponseTime} * ${avgResponseTimes.numRequests}) / SUM(${avgResponseTimes.numRequests}), 0) AS overallAvgResponseTime`,
        })
        .from(avgResponseTimes)
    ).pop()!;
    return <number>avgResponseTime;
  },
  async getMaxResponseTime(): Promise<number> {
    const { maxResponseTime } = (
      await db
        .select({
          maxResponseTime: max(avgResponseTimes.avgResponseTime),
        })
        .from(avgResponseTimes)
    ).pop()!;

    return <number>maxResponseTime;
  },
  async getMinResponseTime(): Promise<number> {
    const { minResponseTime } = (
      await db
        .select({
          minResponseTime: min(avgResponseTimes.avgResponseTime),
        })
        .from(avgResponseTimes)
    ).pop()!;

    return <number>minResponseTime;
  },
};
