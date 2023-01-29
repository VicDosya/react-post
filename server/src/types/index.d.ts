import "express-session";
import { UserType } from "./Types";

declare module "express-session" {
  interface SessionData {
    user: UserType | undefined;
  }
}
