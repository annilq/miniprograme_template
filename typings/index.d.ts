/// <reference path="./types/index.d.ts" />

interface UserInfo {
  deptId: string;
}
interface PatientInfo {
  clinicNo: string;
  deptCode: string;
  deptId: number;
  deptName: string;
  doctorCode: string;
  doctorId: number;
  doctorName: string;
  gmtCreate: string;
  gmtRegistration: string;
  id: number;
  orderNum: string;
  patientAge: number;
  patientCellphone: string;
  patientGender: boolean;
  patientId: string;
  patientName: string;
  registrationFee: number;
  registrationNum: number;
  roomNum: number;
  scene: number;
  treatmentNum: number;
  treatmentRecordNum: number;
  userId: number;
  videoCallSign: string;
  videoCallUser: string;
  videoSdkAppId: number;
}

interface PatientOrder {
  clinicNo: string;
  clinicType: string;
  deptCode: string;
  deptId: number;
  deptName: string;
  doctorCode: string;
  doctorId: number;
  doctorName: string;
  effective: true;
  gmtCreate: string;
  gmtPay: string;
  gmtRefund: string;
  gmtTreatment: string;
  id: number;
  ifErrorInfo: string;
  newsNum: number;
  num: number;
  orderNum: string;
  orderStatus: number;
  patientAge: number;
  patientGender: true;
  patientId: string;
  patientName: string;
  patientPhone: string;
  refundApplyStatus: number;
  refundApplyTime: string;
  refundType: number;
  refundUser: number;
  registrationFee: number;
  scene: number;
  treatmentNum: number;
  treatmentStatus: number;
  userId: number;
}

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo & UserInfo;
    doctorInfo?: WechatMiniprogram.UserInfo & UserInfo;
    patientInfo?: PatientInfo;
    systeminfo?: any;
    token?: string;
    lastClickTime?: number;
    webViewConfig: {
      title: string;
      path: string;
      params: object;
    };
  };
  getSetting: () => Promise<any>;
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
  checkVersion: () => void;
}
declare interface YQResponse<T> {
  // 属性名
  code: number;
  resp: T;
  info: string;
}

declare interface ListData<T> {
  list: T[];
  /** 列表的内容总数 */
  currentPage: number;
  totalPage: number;
  totalSize: number;
  pageSize: number;
}
interface Message {
  id: string;
  content: string;
  contentType: 1 | 2 | 3;
  orderNum: string;
  read: false;
  sendTime: string;
  senderId: string;
  senderName: string;
  senderType: 1 | 2;
}
