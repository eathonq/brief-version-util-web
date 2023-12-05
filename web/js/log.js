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
}

async function refreshLog(){
    // 设置刷新时间
    const refreshTime = document.getElementById("projectLogRefreshTime");
    const priRefreshTime = localStorage.getItem("preRefreshTime") || 0;
    const currentTime = new Date().getTime();
    // 校验刷新间隔（刷新间隔不能小于 5 秒）
    const refreshInterval = currentTime - priRefreshTime;
    if (refreshInterval < 5000) {
        alert("刷新间隔不能小于 5 秒");
        return;
    }
    // 保存刷新时间
    localStorage.setItem("preRefreshTime", currentTime);
    refreshTime.innerText = common.time_format(new Date(), "yyyy-MM-dd hh:mm:ss");


    const projectName = document.getElementById("projectNames").value;
    const logLimit = document.getElementById("projectLogLimit").value;

    // 获取日志信息
    const projectLogUrl = `${common.version_server}/version/log/${projectName}/${logLimit}`;
    const projectLogResult = await common.http_get(projectLogUrl);
    if (projectLogResult == null || projectLogResult.code != 0) {
        alert("获取日志信息失败");
        return;
    }

    // 设置日志信息 <ul class="list-group"> -> <li class="list-group-item">日志条目 1</li>
    const listGroup = document.getElementById("projectLogList");
    // 清空日志信息
    listGroup.innerHTML = "";
    for (let i = 0; i < projectLogResult.data.length; i++) {
        const log = projectLogResult.data[i];
        const li = document.createElement("li");
        li.className = "list-group-item";
        if(log.count > 1){
            li.innerHTML = `${log.text} <span class="badge bg-primary rounded-pill">${log.count}</span>`;
        }
        else{
            li.innerText = `${log.text}`;
        }
        listGroup.appendChild(li);
    }
}