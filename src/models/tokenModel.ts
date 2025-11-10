export interface TokenModel {
  token: string;
  expiration: string;
}

export interface TokenResponse {
  data: TokenModel;
  success: boolean;
  message: string;
}
