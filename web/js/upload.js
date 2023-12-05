let uploadData = {
    versionJson: null,
    files: [],
};

const version_json = "version.json";

async function init() {
    // 判断是否登录成功
    const token = localStorage.getItem(common.enums.token);
    if (token == null) {
        window.location.href = 'index.html';
        return;
    }

    // 设置 uploadFiles 的 change 事件
    const uploadFiles = document.getElementById("uploadFiles");
    uploadFiles.addEventListener("change", async (e) => {
        e.preventDefault(); // 阻止默认事件

        uploadData.files = [];
        uploadData.paths = [];
        uploadData.versionJson = null;

        const files = e.target.files;
        if (files.length == 0) {
            return;
        }

        // 读取版本信息文件
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.name == version_json) {
                uploadData.versionJson = await common.loadJson(file);
                break;
            }
        }
        if (!uploadData.versionJson) {
            alert("version.json not found");
            return;
        }

        // 设置文件列表
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadData.files.push(file);
        }
        //console.log(uploadData);
        console.log(`upload count: ${uploadData.files.length}`);

        // 设置上传项目名称
        const uploadHelp = document.getElementById("uploadHelp");
        uploadHelp.innerText = `${uploadData.versionJson.project} ${uploadData.versionJson.version}`;

        // 重置上传进度
        const uploadProgress = document.getElementById("uploadProgress");
        uploadProgress.innerText = "";
    });
};


init();

async function upload() {
    const project = uploadData.versionJson.project;

    if (uploadData.files.length == 0 || !uploadData.versionJson) {
        alert("no file selected");
        return;
    }

    // 获取当前项目信息
    const url = `${common.version_server}/version/project_files/${project}/0.0.0`;
    const infoResult = await common.http_get(url);
    if (infoResult.code != 0) {
        alert(infoResult.msg);
        return;
    }
    const serverFileJson = infoResult.data.file_json || { files: [] };

    // 获取本地版本信息文件
    const isNewVersion = VersionUtil.compareFileStats(serverFileJson.files, uploadData.versionJson.files);
    if (!isNewVersion) {
        alert("no file changed");
        return;
    }

    // 获取新增和更新的文件
    const uploadList = VersionUtil.getAddAndUpdateFileStats(serverFileJson.files, uploadData.versionJson.files);
    if (uploadList.length == 0) {
        alert("no files need upload");
        return;
    }
    // 添加版本文件到上传列表
    uploadList.push(version_json);

    // 上传文件
    const formData = new FormData();
    for (let i = 0; i < uploadList.length; i++) {
        const index = uploadData.files.findIndex(file => file.name === uploadList[i]);
        if (index >= 0) {
            const file = uploadData.files[index];
            formData.append("files", file);

            // 去掉相对目录的第一级目录
            const path = file.webkitRelativePath.split("/");
            path.shift();
            const server_path = `version/${project}/${uploadData.versionJson.version}/${path.join("/")}`;
            formData.append("paths", server_path);
        }
    }
    const uploadUrl = `${common.file_server}/upload/files-paths`;
    
    const uploadProgress = document.getElementById("uploadProgress");
    const uploadResult = await common.http_upload(uploadUrl, formData, progress =>{
        uploadProgress.innerText = `${progress}%`;
    });
    if (uploadResult.code != 0) {
        alert(uploadResult.msg);
        return;
    }

    // 上传完毕，通知检测版本
    const checkUrl = `${common.version_server}/version/check/${project}/${uploadData.versionJson.version}`;
    const checkResult = await common.http_get(checkUrl);
    if (checkResult.code != 0) {
        alert(checkResult.msg);
        return;
    }

    // 马上切换版本
}