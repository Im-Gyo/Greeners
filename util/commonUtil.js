let commonUtil = (module.exports = {

    //응답정보를 받아 전송
    sendResponse: function(res, status, resultCode, resultMessage, resultData, jsonObject ={}) {
        jsonObject['resultCode'] = resultCode;
        jsonObject['resultMessage'] = resultMessage;
        jsonObject['resultData'] = resultData;

        res.status(status).json(jsonObject);
    }
})