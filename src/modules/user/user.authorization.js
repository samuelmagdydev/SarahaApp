import { roleEnum } from "../../DB/models/User.model.js";

export const endpoint = {
  profile: [roleEnum.user, roleEnum.admin],
  restoreAccount: [roleEnum.admin],
  deleteAccount: [roleEnum.admin],
};
