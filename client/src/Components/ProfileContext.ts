import { createContext } from "react";

type ProfileType = {
  _id: string,
  fname: string,
  lname: string,
  email: string,
  createdAt: string,
}

type ProfileContextType = {
  profile: ProfileType | null,
  loadProfile: Function,
};

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loadProfile: () => {},
});
