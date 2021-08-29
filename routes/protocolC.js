const commonUtil = require("../util/commonUtil");
const router = require("./api");

// 함수들을 담을 객체 선언
let func = {};

// 여기서 프로토콜 함수 리스트에 있는 함수를 찾는다.
router.post('/', (req, res, next) => {
    let jsonData = req.body;
    let funcName = jsonData['funcName'];

    if(funcName.hasOwnProperty(funcName) != false){
        func[funcName](req, res, next, jsonData);
    } else {
        commonUtil.sendResponse(res, 200, 1, '프로토콜을 확인하세요.');
    }
});

// --------------------------------
// 프로토콜 함수 리스트
// --------------------------------


// 로그인
func.login = (req, res, next, jsonData) => {

}


module.exports = router;