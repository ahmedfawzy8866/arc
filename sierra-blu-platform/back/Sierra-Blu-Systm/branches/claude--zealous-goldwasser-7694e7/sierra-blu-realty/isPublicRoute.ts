import { createRouteMatcher } from "@clerk/nextjs/server";

export const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/listings(.*)",
  "/projects(.*)",
  "/services(.*)",
  "/residences(.*)",
  "/journal(.*)",
  "/advisors(.*)",
  "/portal(.*)",
  "/login(.*)",
  "/contact(.*)",
  "/api/propertyfinder(.*)",
  "/propertyfinder.xml(.*)",
  "/api/cron/track-leads(.*)",
]);

