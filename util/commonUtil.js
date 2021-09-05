let commonUtil = (module.exports = {

    //응답정보를 받아 전송
    sendResponse: function(res, status, resultCode, resultMessage, resultData, jsonObject ={}) {
        jsonObject['resultCode'] = resultCode;
        jsonObject['resultMessage'] = resultMessage;
        jsonObject['resultData'] = resultData;

        res.status(status).json(jsonObject);

        if(process.env.NODE_ENV !== 'production'){
            console.log(`status = ${status}, resultCode = ${resultCode}, resultMessage = ${resultMessage}, resultData = ${resultData}`);
        }
    },
    isLoggedIn : (req, res, next) => {
        if(req.isAuthenticated()){//isAuthenticated는 로그인 시 true
            next();
        } else {
            res.status(403).send('로그인 필요');
        }
    },
    isNotLoggedIn : (req, res, next) => {
        if(!req.isAuthenticated()){
            next();
        } else {
            const message = encodeURIComponent('로그인한 상태입니다.');
            res.redirect(`/?error=${message}`);
        }
    }

    
})