import { BaseRequest } from "@/types";

export interface RefreshTokenRequest extends BaseRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
}