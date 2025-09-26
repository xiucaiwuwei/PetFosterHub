import { BaseRequest, BaseResponse } from "@/types";
import { UserRole } from "../enums";

export interface ResetPasswordRequest extends BaseRequest {
    phone: string;
    role: UserRole;
    verificationCode: string;
    newPassword: string;
}

export interface ResetPasswordResponse extends BaseResponse {
}