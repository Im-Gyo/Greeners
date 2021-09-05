const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const config = require('../config/config.json');
const connection = mysql.createConnection(config.dbInfo);

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField : 'id',
        passwordField : 'pw'
    }, (id, pw, done) => {
        const query = `
            SELECT  *
            FROM    user
            WHERE   id= '${id}'
        `;
        connection.query(query, async (error, result) => {
            if(error){
                console.error(error);
            }
            const exUser = result;
            if(exUser.length !== 0){
                const check = await bcrypt.compare(pw, exUser[0].pw);
                if(check){
                    console.log('로그인 성공');
                    done(null, exUser);
                } else {
                    done(null, false, { message : '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message : '가입되지 않은 회원입니다.' });
            }
        })
    }));
}