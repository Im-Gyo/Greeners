const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const commonUtil = require('../util/commonUtil');
const db_info = require('../config/config');
const dbPool = mysql.createPool(db_info);

// 메인 페이지
router.all('/', (req, res, next) => {
    res.render('index.html', {req: req});
})

//샘플
router.get("/sample", function(req, res){
    let resultData = {};
    let query = `
        SELECT  *
        FROM    sample_entity
    `;
    dbPool.query(query, (error, results) => {
        if(error) {
            commonUtil.sendResponse(res, 500, '1000', error, resultData);
            return;
        }
        let resultData = results[0];

        commonUtil.sendResponse(res, 200, '0', 'sample', resultData);
    });
});

router.get("/test", (req, res) => {
    const queryString = parseInt(req.query.sample_id);


    let resultData = {};
    let query = `
        SELECT  * 
        FROM    sample_entity
    `;

    let successCallback = (error, results) => {
        if(error)
        {
            commonUtil.sendResponse(res, 500, '1000', error, resultData);
            return;
        }

        let testResult = results.filter(element => element.sample_id == queryString);
        
        if(testResult.length === 0){
            commonUtil.sendResponse(res, 400, '2000', 'Invalid queryString', resultData);
            return;
        }

        resultData = testResult[0].sample_name;

        commonUtil.sendResponse(res, 200, '0', 'sample', resultData);
    };

    dbPool.query(query, successCallback);
});

// function getConnection() {
//     return dbPool;
// };

module.exports = router;