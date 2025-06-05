export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Announcements: undefined;
  Users: undefined;
  PersonalInfo: undefined;
  AnnouncementDetail: { id: string };
  UserDetail: { id: string };
  EditUser: { id: string };
  UserRegister: undefined;
};

export type MainTabParamList = {
  Announcements: undefined;
  Users: undefined;
  Profile: undefined;
};
