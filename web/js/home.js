async function init() {
    // 判断是否登录成功
    const token = localStorage.getItem(common.enums.token);
    if (token == null) {
        window.location.href = 'index.html';
        return;
    }

    const projectsUrl = `${common.version_server}/version/projects`;
    const projectsResult = await common.http_get(projectsUrl);
    if (projectsResult.code == 0) {
        let projects = projectsResult.data;
        initTable("table_projects", projects);
    } else {
        alert(projectsResult.msg);
    }
}

function initTable(tableId, projects) {
    const table = document.getElementById(tableId);

    // 遍历项目
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const tr = document.createElement("tr");
        table.appendChild(tr);

        const th = document.createElement("th");
        th.innerText = i + 1;
        tr.appendChild(th);

        const td_name = document.createElement("td");
        td_name.innerText = project.name;
        tr.appendChild(td_name);

        const td_version = document.createElement("td");
        td_version.innerText = project.version;
        tr.appendChild(td_version);

        const td_isRunning = document.createElement("td");
        td_isRunning.innerText = project.isRunning ? "是" : "否";
        tr.appendChild(td_isRunning);

        const td_created = document.createElement("td");
        td_created.innerText = project.created;
        tr.appendChild(td_created);

        const td_updated = document.createElement("td");
        td_updated.innerText = project.updated;
        tr.appendChild(td_updated);

        const td_operate = document.createElement("td");
        tr.appendChild(td_operate);
        const button_group = document.createElement("div");
        button_group.className = "btn-group";
        td_operate.appendChild(button_group);

        const button_open = document.createElement("button");
        button_open.innerText = "开启";
        button_open.type = "button";
        button_open.className = "btn btn-success btn-sm";
        button_open.onclick = function () {
            openProject(project.name);
        }
        button_group.appendChild(button_open);

        const button_close = document.createElement("button");
        button_close.innerText = "关闭";
        button_close.type = "button";
        button_close.className = "btn btn-warning btn-sm";
        button_close.onclick = function () {
            closeProject(project.name);
        }
        button_group.appendChild(button_close);

        const button_delete = document.createElement("button");
        button_delete.innerText = "删除";
        button_delete.type = "button";
        button_delete.className = "btn btn-danger btn-sm";
        button_delete.onclick = function () {
            deleteProject(project.name);
        }
        button_group.appendChild(button_delete);
    }
}

init();

function openProject(name){
    //console.log(`open project: ${name}`);
    const openUrl = `${common.version_server}/version/open/${name}`;
    common.http_get(openUrl).then(result => {
        if (result.code == 0) {
            alert("开启成功");

            // 刷新页面
            window.location.reload();
        } else {
            alert(result.msg);
        }
    });
}

function closeProject(name){
    //console.log(`close project: ${name}`);
    const closeUrl = `${common.version_server}/version/close/${name}`;
    common.http_get(closeUrl).then(result => {
        if (result.code == 0) {
            alert("关闭成功");

            // 刷新页面
            window.location.reload();
        } else {
            alert(result.msg);
        }
    });
}

function deleteProject(name){
    if(!confirm(`确定要删除项目 ${name} （包括项目下所有版本数据）吗？`)){
        return;
    }

    //console.log(`delete project: ${name}`);
    const deleteUrl = `${common.version_server}/version/delete/${name}`;
    common.http_get(deleteUrl).then(result => {
        if (result.code == 0) {
            alert("删除成功");

            // 刷新页面
            window.location.reload();
        } else {
            alert(result.msg);
        }
    });
}