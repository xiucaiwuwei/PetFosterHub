import {UserRole} from "../enums";

export interface UserInfo {
    userId: string;
    phone: string;
    role: UserRole;
    nickname: string;
    avatar: string;
}