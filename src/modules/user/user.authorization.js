import { roleEnum } from "../../DB/models/User.model.js";
import { profile } from "./user.service.js";

export const endpoint = {
    profile: [roleEnum.user, roleEnum.admin],
}