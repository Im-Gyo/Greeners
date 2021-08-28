const express = require("express");
const config = require('../config/config.json');
const mysqlPool = mysql.createPool(config.database);
const dbConnection = mysql.createConnection(config.dbInfo);

let instance;

class DataCacheManager {
    constructor(){};
    
    static getInstance() {
        if(!instance) {
            instance = new DataCacheManager();
        }
    }

    init(){

    }
    
    async memberRegister(memberData, successCallBack, failedCallBack) {
        let nickName = memberData.nickName;
        let id = memberData.id;
        let pw = memberData.pw;

        let query = 'INSERT INTO memberList(id, pw, nickName) VALUES (?, ?, ?)';
        getConnection().query(query, [id,pw,nickName], 
            function(err, data) {
                if(err){
                    failedCallBack(err);
                    return;
                }
                successCallBack();                          
        });
    };
}

function getConnection() {
    return dbConnection;
};

// 커넥션풀 쿼리
connectionPoolQuery(queryStr, successCallBack, failedCallBack)
    {
        mysqlPool.getConnection(async function (err, conn)
        {
            if(err)
            {
                console.log(err);
                failedCallBack(err);
                return;
            }

            conn.query(queryStr,[], 
                //성공 콜백
                function (err, result) 
                {
                    if(err)
                    {
                        console.log(err);
                        failedCallBack(err);
                        return;
                    }
                    successCallBack(result);
                }
            );
            conn.release();
        });        
    }

module.exports = DataCacheManager;