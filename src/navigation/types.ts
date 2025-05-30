export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Announcements: undefined;
  AnnouncementDetail: { id: string };
  UserDetail: { id: string };
  EditUser: { id: string };
};

export type MainTabParamList = {
  Announcements: undefined;
  Users: undefined;
  Profile: undefined;
};
