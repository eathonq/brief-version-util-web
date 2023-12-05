async function init(){
    // 判断是否登录成功
    const token = localStorage.getItem(common.enums.token);
    if (token == null) {
        window.location.href = 'index.html';
        return;
    }

    // 更新项目列表
    updateProjectNames();
}
init();

async function updateProjectNames(){
    // 获取项目列表
    const projectNamesUrl = `${common.version_server}/version/project_names`;
    const projectNamesResult = await common.http_get(projectNamesUrl);
    if (projectNamesResult == null || projectNamesResult.code != 0) {
        alert("获取项目列表失败");
        return;
    }

    // 设置项目下拉列表
    const projectNames = document.getElementById("projectNames");
    projectNames.innerHTML = "";
    for (let i = 0; i < projectNamesResult.data.length; i++) {
        const projectName = projectNamesResult.data[i];
        const option = document.createElement("option");
        option.value = projectName;
        option.innerText = projectName;
        projectNames.appendChild(option);
    }

    // 设置项目列表 change 事件
    projectNames.addEventListener("change", (e) => {
        e.preventDefault(); // 阻止默认事件

        const projectName = e.target.value;
        if (projectName == "") {
            return;
        }

        // 更新版本下拉列表
        updateVersionVersions(projectName);
    });

    // 触发一次 change 事件
    const event = new Event("change");
    projectNames.dispatchEvent(event);
}

async function updateVersionVersions(projectName) {
    // 获取当前项目版本信息
    const projectVersionsUrl = `${common.version_server}/version/project_versions/${projectName}`;
    const projectVersionsResult = await common.http_get(projectVersionsUrl);
    if (projectVersionsResult == null || projectVersionsResult.code != 0) {
        alert("获取项目信息失败");
        return;
    }

    // 设置版本下拉列表
    const projectVersions = document.getElementById("projectVersions");
    // 版本排序
    projectVersionsResult.data.sort((a, b) => {
        return common.compareVersion(b.version, a.version);
    });
    projectVersions.innerHTML = "";
    for (let i = 0; i < projectVersionsResult.data.length; i++) {
        const projectVersion = projectVersionsResult.data[i];
        const option = document.createElement("option");
        option.value = projectVersion.version;
        option.innerText = `${projectVersion.version} ${projectVersion.state == 0 ? "" : `(current)`}`;
        projectVersions.appendChild(option);
    }
}

async function switchVersion(){
    const projectNames = document.getElementById("projectNames");
    const projectName = projectNames.value;

    const projectVersions = document.getElementById("projectVersions");
    const projectVersion = projectVersions.value;

    if (projectName == "" || projectVersion == "") {
        alert("请选择项目和版本");
        return;
    }

    // 切换版本
    const switchVersionUrl = `${common.version_server}/version/switch/${projectName}/${projectVersion}`;
    const switchVersionResult = await common.http_get(switchVersionUrl);
    if (switchVersionResult == null || switchVersionResult.code != 0) {
        alert("切换版本失败");
        return;
    }

    // 刷新版本列表
    updateVersionVersions(projectName);

    alert("切换版本成功");
}