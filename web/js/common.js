
/**
 * 公共数据
 */
const common = {};

/**
 * 文件服务器地址
 */
common.file_server = 'http://127.0.0.1:2990';   // 本地测试 47.102.98.114:3000

/**
 * 版本服务器地址
 */
common.version_server = 'http://127.0.0.1:2991';

/**
 * 常用枚举
 */
common.enums = {
    /** token */
    token: "version-token",
};

/**
 * 加载 json 文件
 * @param {any} file 
 * @returns 
 */
common.loadJson = async function loadJson(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
            const json = JSON.parse(e.target.result);
            resolve(json);
        };
    });
}

/**
 * 比较版本号
 * @param {string} v1 
 * @param {string} v2 
 * @returns 
 */
common.compareVersion = function compareVersion(v1, v2) {
    const v1s = v1.split(".");
    const v2s = v2.split(".");
    for (let i = 0; i < v1s.length; i++) {
        const v1 = parseInt(v1s[i]);
        const v2 = parseInt(v2s[i]);
        if (v1 > v2) {
            return 1;
        }
        else if (v1 < v2) {
            return -1;
        }
    }

    return 0;
}

/**
 * http get 请求
 * @param {string} url 
 * @returns {Promise<{code: number,msg?:string,data?:any}>}
 */
common.http_get = async function http_get(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    // 在这里处理获取到的 token 数据
                    //console.log(xhr.responseText);
                    resolve(response);
                } else {
                    // 处理请求错误
                    //console.error("请求错误：" + xhr.status);
                    resolve(null);
                }
            }
        };
        xhr.send();
    });
};

/**
 * http post 请求
 * @param {string} url 
 * @param {any} data 
 * @returns 
 */
common.host_post = async function host_post(url, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    // 在这里处理获取到的 token 数据
                    //console.log(xhr.responseText);
                    resolve(response);
                } else {
                    // 处理请求错误
                    //console.error("请求错误：" + xhr.status);
                    resolve(null);
                }
            }
        };

        if (typeof data === "string") {
            xhr.send(data);
        }
        else {
            xhr.send(JSON.stringify(data));
        }
    });
}

/**
 * http 上传文件
 * @param {string} url 
 * @param {*} form 
 * @returns 
 */
common.http_upload = async function http_upload(url, form, onProgress) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    // 在这里处理获取到的 token 数据
                    //console.log(xhr.responseText);
                    resolve(response);
                } else {
                    // 处理请求错误
                    //console.error("请求错误：" + xhr.status);
                    resolve(null);
                }
            }
        };
        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        });
        xhr.send(form);
    });
}

function prependZero(matched, num) {
    return matched.length > 1 && num < 10 ? "0" + num : "" + num;
}
common.time_format = function time_format(time, fmt) {
    let _this = time;
    let pattern = fmt;
    if (pattern === void 0) { pattern = 'YYYY-MM-DD hh:mm:ss'; }
    return pattern.replace(/y{2,}|Y{2,}/, function (v) { return (_this.getFullYear() + "").substring(4 - v.length); })
        .replace(/M{1,2}/, function (v) { return prependZero(v, _this.getMonth() + 1); })
        .replace(/D{1,2}|d{1,2}/, function (v) { return prependZero(v, _this.getDate()); })
        .replace(/Q|q/, function (v) { return prependZero(v, Math.ceil((_this.getMonth() + 1) / 3)); })
        .replace(/h{1,2}|H{1,2}/, function (v) { return prependZero(v, _this.getHours()); })
        .replace(/m{1,2}/, function (v) { return prependZero(v, _this.getMinutes()); })
        .replace(/s{1,2}/, function (v) { return prependZero(v, _this.getSeconds()); })
        .replace(/SSS|S/, function (v) {
            var ms = '' + _this.getMilliseconds();
            return v.length === 1 ? ms : "" + (ms.length === 1 ? '00' : ms.length === 2 ? '0' : '') + ms;
        });
}