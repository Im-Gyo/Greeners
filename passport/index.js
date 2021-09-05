const passport = require('passport');
const local = require('./localStrategy');
const commonUtil = require('../util/commonUtil');
const mysql = require('mysql');
const config = require('../config/config.json');
const connection = mysql.createConnection(config.dbInfo);

module.exports = () => {
    //로그인시 실행. res.session객체에 어떤값을 저장할지 정한다.
    passport.serializeUser((user, done) => {
        done(null, user[0].id);
    });

    //매 요청시 마다 실행. serializeUser의 done의 두번째 인수가 매개변수가 된다.(user[0].id로 받은걸 여기서 id로사용)
    passport.deserializeUser((id, done) => {
        let query = `
            SELECT  *
            FROM    user
            WHERE   id = ${id}
        `;
        connection.query(query, (error, results) => {
            if(error){
                console.log(error);
                done(error);
            }
            done(null, results);
        });
    });
    /*
    serializeUser는 사용자 정보 객체를 세션아이디로 저장. deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴.
    세션에 불필요한 데이터를 담아두지 않기 위한 과정이다.
    */

    local();
}