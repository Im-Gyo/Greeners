/*모듈 import*/
const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const ejs = require('ejs');

const passportConfig = require('./passport');
const api = require('./routes/api.js');
const protocolC = require('./routes/protocolC');
const auth = require('./routes/auth.js');
const { fstat } = require('fs');

const app = express();
const server = http.createServer(app);
passportConfig();

app.set('views', path.join(__dirname, './client'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(morgan('dev'));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : 'sample',
    cookie : {
        httpOnly : true,
        secure : false
    },
}));

/*
passport.initialize() : req객체에 passport 설정을 심음.
passport.session() : req.session객체에 passport정보를 저장. req.session은 express-session에서 생성하는것이므로
                     express-session 미들웨어보다 뒤에 연결애햐 함.
*/
app.use(passport.initialize());
app.use(passport.session());


//라우트로 분리
app.use('/', api);
app.use('/protocolC', protocolC);
app.use('/auth', auth);

app.use(express.static(__dirname + '/client'));


//잘못된 호출이나 파라미터로 서버 종료문제 잡는 곳
process.on('uncaughtException', function(err){
    console.log('uncaughtException : ', err);
    if(err.code == 'ECONNREFUSED' || err.code == 'EHOSTUNREACH'){
        handler_connect_error(err);
    } else if(err.code == 'ETIMEDOUT'){
        handler_timeout(err);
    }
});

//404 핸들러(아무런 url이 지정되어있지 않으므로 지정된 url이외에는 모두 에러로 처리)
app.use(function(req, res, next){
    let jsonObject = {};
    jsonObject['resultCode'] = 404;
    jsonObject['resultData'] = {};
    res.status(404).json(jsonObject);
});

//예기치못한 에러 처리
app.use(function(err, req, res, next){
    let jsonObject = {};
    jsonObject['resultCode'] = 500;
    jsonObject['resultData'] = {};
    //res.status(err.status || 500).json(jsonObject);
})

var port = 5000;
/*서버 실행*/
// port번호를 이용해 5000번 포트에 node.js 서버를 올림, 서버가 실행되는 경우에 실행

//listen, get과 같이 어떤 조건이 갖춰지면 실행되는 함수를 이벤트 리스너라고 함
server.listen(port, function(){    
    // 서버 실행 시 콘솔에 출력할 메시지
    console.log("server on [port : " + port + "]");     
}); 