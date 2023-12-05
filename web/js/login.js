async function validateToken() {
    let token = document.getElementById("exampleInputToken1").value;
    const result = await common.http_get(`${common.version_server}/version/verify_token/${token}`);
    if (result.code == 0) {
        localStorage.setItem(common.enums.token, token);
        window.location.href = 'home.html';
    } else {
        localStorage.removeItem(common.enums.token);
        alert(result.msg);
    }
};