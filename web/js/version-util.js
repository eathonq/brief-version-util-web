const VersionUtil = {};

/**
 * 检查文件是否有变化
 * @param {*} oldFiles 
 * @param {*} newFiles 
 * @returns 
 */
VersionUtil.compareFileStats = function compareFileStats(oldFiles, newFiles) {
    if (oldFiles.length == 0 && newFiles.length > 0) {
        return true;
    }

    let isNewVersion = false;
    for (const newFile of newFiles) {
        const oldFile = oldFiles.find(file => file.path === newFile.path);
        if (oldFile) {
            // 检查文件是否有变化
            if (oldFile.mtimeMs !== newFile.mtimeMs || oldFile.size !== newFile.size) {
                isNewVersion = true;
            }
            else {
                // 没有变化的文件，版本号修改成旧的版本号
                newFile.version = oldFile.version;
            }
        }
    }

    return isNewVersion;
};

/**
 * 获取新增和更新的文件
 * @param oldFiles 旧的文件信息列表
 * @param newFiles 新的文件信息列表
 * @returns 
 */
VersionUtil.getAddAndUpdateFileStats = function getAddAndUpdateFileStats(oldFiles, newFiles) {
    const files = [];
    for (const newFile of newFiles) {
        const oldFile = oldFiles.find(file => file.path === newFile.path);
        if (!oldFile || oldFile.mtimeMs !== newFile.mtimeMs || oldFile.size !== newFile.size) {
            files.push(newFile.path);
        }
    }

    return files;
};