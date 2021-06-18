const request = require("request");
var config = ["123456", "789102", "234566"];//请在此处填写要自动上报的团员id，具体格式参考前面那个！
exports.main_handler = async (event, context) => {main();}//不在云函数上运行请注释这个
//main();//不在云函数上运行请不要注释这个
async function main() {
  for (let i in config) {
    let mid = config[i];
    console.log("开始第" + i + "个：" + mid);
    try {
      let cid = await getChapterId();
      let sign = await getSign(mid);
      let token = await getToken(sign);
      var res = await saveHistory(token, cid);
    } catch (error) {
      console.log(error);
      console.log(mid + "异常");
      continue;
    }
    if (res.errno == 0) {
      console.log("保存观看记录成功");
    } else {
      console.log("出错啦");
      console.log(res);
    }
  }
}
function saveHistory(token, cid) {
  let url =
    "https://youthstudy.12355.net/apih5/api/young/course/chapter/saveHistory?chapterId=" +
    encodeURI(cid);
  let headers = {
    Host: "youthstudy.12355.net",
    Connection: "keep-alive",
    "Content-Length": "134",
    Origin: "https://youthstudy.12355.net",
    "X-Litemall-Token": "",
    "X-Litemall-IdentiFication": "young",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 11; M2012K11AC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.62 XWEB/2691 MMWEBSDK/201101 Mobile Safari/537.36 MMWEBID/8628 MicroMessenger/7.0.21.1783(0x27001543) Process/tools WeChat/arm64 Weixin GPVersion/1 NetType/WIFI Language/zh_CN ABI/arm64",
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "*/*",
    "X-Requested-With": "com.tencent.mm",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    Referer: "https://youthstudy.12355.net/h5/",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  };
  headers["X-Litemall-Token"] = token;
  return new Promise((resolve, rejects) => {
    request(
      { url: url, method: "POST", headers: headers },
      (error, res, body) => {
        body = JSON.parse(body);
        console.log(body);
        resolve(body);
      }
    );
  });
}

function getToken(sign) {
  let url =
    "https://youthstudy.12355.net/apih5/api/user/get?sign=" + encodeURI(sign);
  let headers = {
    Host: "youthstudy.12355.net",
    Connection: "keep-alive",
    "Content-Length": "134",
    Origin: "https://youthstudy.12355.net",
    "X-Litemall-Token": "",
    "X-Litemall-IdentiFication": "young",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 11; M2012K11AC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.62 XWEB/2691 MMWEBSDK/201101 Mobile Safari/537.36 MMWEBID/8628 MicroMessenger/7.0.21.1783(0x27001543) Process/tools WeChat/arm64 Weixin GPVersion/1 NetType/WIFI Language/zh_CN ABI/arm64",
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "*/*",
    "X-Requested-With": "com.tencent.mm",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    Referer: "https://youthstudy.12355.net/h5/",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  };
  return new Promise((resolve, rejects) => {
    request(
      { url: url, method: "POST", headers: headers },
      (error, res, body) => {
        body = JSON.parse(body);
        // console.log(body)
        let token = body.data.entity.token;
        console.log(token);
        resolve(token);
      }
    );
  });
}
function getSign(mid) {
  let url =
    "https://tuanapi.12355.net/questionnaire/getYouthLearningUrl?mid=" +
    Number(mid);
  let headers = {
    Host: "tuanapi.12355.net",
    Connection: "keep-alive",
    Accept: "application/json, text/javascript, */*; q=0.01",
    Origin: "https://tuan.12355.net",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 11; M2012K11AC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.62 XWEB/2691 MMWEBSDK/201101 Mobile Safari/537.36 MMWEBID/8628 MicroMessenger/7.0.21.1783(0x27001543) Process/tools WeChat/arm64 Weixin GPVersion/1 NetType/WIFI Language/zh_CN ABI/arm64",
    "X-Requested-With": "com.tencent.mm",
    "Sec-Fetch-Site": "same-site",
    "Sec-Fetch-Mode": "cors",
    Referer: "https://tuan.12355.net/wechat/view/YouthLearning/page.html",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  };
  return new Promise((resolve, rejects) => {
    request(
      { url: url, method: "GET", headers: headers },
      (error, res, body) => {
        body = JSON.parse(body);
        let signUrl = body.youthLearningUrl;
        let sign = signUrl.split("?sign=")[1];
        console.log(sign);
        resolve(sign);
      }
    );
  });
}
function getChapterId() {
  let url = "https://youthstudy.12355.net/apih5/api/young/chapter/new";
  let headers = {
    "X-Litemall-IdentiFication": "young",
  };
  return new Promise((resolve, rejects) => {
    request(
      { url: url, method: "GET", headers: headers },
      (error, res, body) => {
        body = JSON.parse(body);
        let id = body.data.entity.id;
        resolve(id);
      }
    );
  });
}
