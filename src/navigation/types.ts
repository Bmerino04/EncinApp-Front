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
  EditUserName: { id: string; value: string };
  EditUserAddress: { id: string; value: string };
  EditUserRut: { id: string; value: string };
  EditUserPin: { id: string };
  CreateAnnouncement: undefined;
  SelectAlertType: undefined;
  CreateAlert: { alertType: 'seguridad' | 'salud' | 'siniestro' };
  Map: undefined;
  AlertHistory: undefined;
  AlertDetail: { id: number };
  CreatePOI: undefined;
};

export type MainTabParamList = {
  Announcements: undefined;
  Users: undefined;
  Profile: undefined;
};
