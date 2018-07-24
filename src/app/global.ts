export var GLOBAL = {
    APP_VERSION: '1.0',
    API_URL: 'http://desaifamily.qseksolutions.com/api/v1',
    API_HEADER: 'a2309455-13c0-4b5a-b9c1-5e9e65dc0704',
    IS_LOGGEDIN: localStorage.getItem("is_loggedin")?true:false,
    USER: JSON.parse(localStorage.getItem("is_loggedin")),
    AVATAR: 'assets/img/default-user-avatars.png',
    ONESIGNAL_APPID: 'c4c88875-5751-4a69-8f2f-c2e82276c83b',
    SENDER_ID: '825066172517',
};