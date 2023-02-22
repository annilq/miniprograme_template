export function version() {
  let version = __wxConfig.envVersion;
  const configUrl = "https://ybzd.ncyunqi.com/szyy_online_test";
  // const configUrl = "https://school.ncyunqi.com";
  // const configUrl = "http://192.168.0.51:9002";//花花
  // const configUrl = "http://192.168.0.90:9002";//倩倩
  // const configUrl = "http://192.168.0.217:9002";//张贵明
  // const configUrl = "http://192.168.0.87:9002";//汪宁
  switch (version) {
    case 'develop':
      return configUrl; // 本地环境
    case 'trial':
      return 'https://zxzl.jxszyy.com' // 体验环境
    case 'release':
      return 'https://zxzl.jxszyy.com'; // 线上环境
    default:
      return 'https://ybzd.ncyunqi.com/szyy_online_test'; // 其他环境
  }
}

export const wxId = 2
export const configUrl = version()

