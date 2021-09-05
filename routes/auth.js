const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const commonUtil = require('../util/commonUtil');
const mysql = require('mysql');
const config = require('../config/config.json');
const connection = mysql.createConnection(config.dbInfo);

const router = express.Router();

//회원가입
router.post('/join', commonUtil.isNotLoggedIn, async (req, res, next) => {
    const { id, pw, email } = req.body;
    let resultData = [];
    try{
        let exUser = [];
        const query = `
            SELECT  *
            FROM    user
            WHERE   id = '${id}'
        `;
        //중복된 아이디 있는지 확인
        connection.query(query, (error, results) => {
            if(error){
                //commonUtil.sendResponse(res, 500, '5001', error, resultData);
            }
            exUser = results;
            if(exUser.length !== 0){
                return res.redirect('/join_sample.html?error=exist');
            }
        });
        const hash = await bcrypt.hash(pw, 12);
        const query2 = `
            INSERT INTO user (id, pw, email)
            VALUES ('${id}', '${hash}', '${email}')
        `;
        connection.query(query2, (error, results) => {
            if(error){
                //commonUtil.sendResponse(res, 500, '5001', error, resultData);
            }
            resultData = results;
            //commonUtil.sendResponse(res, 201, '5002', 'join success!', resultData);
        });
        return res.redirect('/');//회원가입 완료 후 돌아갈 페이지
    } catch(error){
        //console.log(error);
        return next(error);
    }

});

//로그인
router.post('/login', commonUtil.isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError){
            console.log(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/login_sample.html?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.log(loginError);
                return next(loginError);
            }
            return res.redirect('/mypage');
        });
    })(req, res, next);
});

//로그아웃
router.get('/logout', commonUtil.isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;