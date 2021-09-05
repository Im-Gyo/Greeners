const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
const mysql = require('mysql');
const config = require('../config/config.json');
const connection = mysql.createConnection(config.dbInfo);

module.exports = () => {
    passport.use(new kakaoStrategy({
        clientID : '2a61fdd8c4bd1f10e300fc3d0ecfd730',
        callbackURL : '/auth/kakao/callback'
    }, (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try{
            let exUser = [];
            let query = `
                SELECT  *
                FROM    user
                WHERE   user_snsId = '${profile.id}' AND user_provider = 'kakao'
            `;
            connection.query(query, (error, results) => {
                exUser = results;
                if(results.length !== 0){
                    console.log('결과 있을때');
                    console.log(results);
                    done(null, results);
                } else {
                    console.log('결과 없을때 아이디 만들어줌');
                    let query = `
                        INSERT INTO user
                            (user_email, user_provider, user_snsId)
                        VALUES
                            ('${profile._json.kakao_account.email}', '${profile.provider}', '${profile.id}');
                    `;
                    connection.query(query, (error, results) => {
                        let newUser = {
                            user_email      :   profile._json.kakao_account.email,
                            user_provider   :   profile.provider,
                            user_snsId      :   profile.id,
                            user_number     :   1
                        };
                        done(null, newUser);
                    });
                }
            });
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
}