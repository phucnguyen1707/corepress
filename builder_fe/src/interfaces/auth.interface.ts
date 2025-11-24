export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  email: string;
  name: string;
  password: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface UserInfoPage {
  id: number;
  name: string;
}

export interface UserInfoResponse {
  user: UserInfo;
  pages: UserInfoPage[];
}
