export var GLOBAL = {
    APP_VERSION: '1.0',
    API_URL: 'https://fuskk.com/api/V1',
    API_HEADER: 'a2309455-13c0-4b5a-b9c1-5e9e65dc0704',
    IS_LOGGEDIN: localStorage.getItem("is_loggedin") ? true : false,
    USER: JSON.parse(localStorage.getItem("is_loggedin")),
    PUSHTOKEN: localStorage.getItem("pushtoken"),
    DEVICETOKEN: localStorage.getItem("devicetoken"),
    DEVICE_ID: localStorage.getItem("device_id"),
    AVATAR: 'assets/img/default-user-avatars.png',
    ONESIGNAL_APPID: 'e3d82941-8842-46a5-91d8-38e252a73d87',
    SENDER_ID: '1048363833289',
};