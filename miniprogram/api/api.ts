import { configUrl } from "~/api/config";
const api = `${configUrl}/api/app/`;

export const login = api + "qywx/login";
export const userBind = api + "qywx/userBind";
export const user_logout = api + "loginOut";
//统计
export const home_data = api + "registrationOrder/countData";
export const home_patient = api + "registrationOrder/pageList";
export const detail_patient = api + "registrationOrder/getRegistrationNewsAndDetail";
export const get_registration_order = api + "registrationOrder/getRegistrationOrder";
//保存或更新问诊诊断
export const user_diagnose = api + "registrationOrder/inquiryDiagno";
// 重置密码
export const modify_password = api + "/doctorInfo/passwdModify";
//人脸识别
export const user_face = api + "faceVerify/";
export const user_upload = api + "fileUpload/picture";
//所属部门
export const user_set_dept = api + "doctorInfo/listDept";
export const user_info = api + "doctorInfo/getDoctor";
//设置在线状态
export const user_set_status = api + "doctorInfo/setOnlineStatus";
//诊前描述
export const user_detail_desc = api + "treatmentDescription/listByOrderNum";

//查询队列，按预约日期、预约号升序排序
export const user_queue_list = api + "queue/listByDeptIdAndDoctorId";
//结束诊疗
export const user_queue_end = api + "queue/endTreatment";
//结束诊疗
export const user_queue_in = api + "queue/inTreatment";
//就诊室还剩多少人
export const user_queue_num_leave = api + "queue/leaveNum";
//拒绝就诊
export const user_queue_refuse = api + "queue/refuse";
//诊断建议
export const user_queue_diagnose = api + "treatmentRecord/diagnose";
//立即接诊
export const user_queue_access = api + "queue/access";
//诊断记录
export const user_queue_record_doctor = api + "treatmentRecord/pageListByDoctorCode";
export const user_queue_record_card = api + "treatmentRecord/pageListByCardNO";
//接入下一位患者。之后开启视频诊疗
export const user_queue_next = api + "queue/nextPatient";
//意见反馈
export const info_opinion = api + "suggestion/save";
//检查报告
export const report_exam = api + "his/queryExamReport/listByPatientId";
//查询检查报告
export const report_survey = api + "his/querySurveyReport/listByPatientId";
export const report_survey_detail = api + "his/querySurveyReport/listByTestNo";
//心跳包
export const heart = api + "doctorInfo/treatmentHeartbeat";
// 单发消息
export const sendMsg = api + "/subscribeMessage/send";
// 群发消息
export const sendMsgMass = api + "/subscribeMessage/massSend";
//留言列表
export const news = api + "registrationNews/scroll";
export const notice_count = api + "notice/countUnreadNum"; // 系统通知数量

export const message = {
  list: `${api}/registrationNews/list`, // 医生：查询留言列表
  send: `${api}/registrationNews/send`, // 医生：发送留言消息
  msgList: `${api}/registrationNews/scroll`, // 医生与患者之间的消息内容
  orderInfo: `${api}/registrationOrder/getRegistrationOrder`, // 用户的信息
  descr: `${api}/treatmentDescription/listByOrderNum`, // 诊前描述
  zl_uploadPicture: `${api}/fileUpload/picture`, // 上传图片
};

// 已挂号患者
export const registration = {
  pageList: `${api}/registrationOrder/pageList`, // 医生app：预约挂号
  sendMsgMass: `${api}/subscribeMessage/massSend`, // 群发消息
  sendMsg: `${api}/subscribeMessage/send`, // 单发消息
  sendPaymentMessage: `${api}/subscribeMessage/sendPaymentMessage`, // 缴费消息
};

// 历史记录
export const history = {
  pageList: `${api}/registrationOrder/historyPageList`, // 医生app：预约挂号
};