import { appState } from "../app";
import { User } from "../models/User";

export const authUser = function (login, password, isAdmin) {
  const user = new User(login, password, isAdmin);
  if (!user.hasAccess) return false;
  appState.currentUser = user;
  return true;
};
