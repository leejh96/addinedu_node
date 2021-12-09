// Ajax 학습을 위한 서버
// Javascript 비동기 통신 기술
// 동기 : Sync (순서가 있다)
// 비동기 : 각자 움직임 (쓰레드 기술과 유사한)
const http = require("http");
const express = require("express");
const app = express();
const router = express.Router();
// npm install -S cors
const cors = require("cors");

// mysql_conn_test01.js
const mysql = require("mysql");

const dao = require("./db_message");

// pool 생성
const pool = mysql.createPool({
    connection: 10,
    host: "localhost",
    user: "root",
    password: "123123",
    database: "test",
    debug: false,
    port: 5306
});

app.set("port", 3000);

// 크로스 도메인 문제를 해결 해 주는 미들웨어 등록
app.use(cors());
app.use(express.static("public"));

router.route("/").get((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello world</h1>");
    res.end();
});

var msg_list = [
    { no: 1, user: "KIM", msg: "hello", score: 1 },
    { no: 2, user: "PARK", msg: "I love you", score: 5 },
];

// insert 부분
//http://localhost:3000/data/KIM/LOVE
router.route("/data/:user/:msg").get((req, res) => {
    var user = req.params.user;
    var message = req.params.msg;
    if (pool) {
        dao.insertMsg(pool, user, message, function (err, result) {
            if (err) throw err;
            // 입력이 끝난 후 목록을 보내 준다.
            dao.selectAll(pool, function (err2, result) {
                res.send(result);
            });
        });
    }
});

router.route("/loadData").get((req, res) => {
    // msg_list를 전송한다.
    dao.selectAll(pool, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

router.route("/search/:keyword/:word").get((req, res) => {
    var keyword = req.params.keyword;
    var word = req.params.word;
    dao.selectSearch(pool, keyword, word, (err, data) => {
        if (err) throw err
        res.send(data);
    })
});

const findIndex = (no) => {
    let idx = -1;
    for (var i = 0; i < msg_list.length; i++) {
        if (msg_list[i].no == no) {
            idx = i;
            break;
        }
    } // end of for
    return idx;
};

router.route("/delete/:no").get((req, res) => {
    var no = req.params.no;
    if (pool) {
        dao.deleteMsg(pool, no, function (err, result) {
            if (err) throw err;
            dao.selectAll(pool, function (err2, result2) {
                res.send(result2);
            });
        });
    }
});

// score 반영
router.route("/score/:no/:value").get((req, res) => {
    var no = req.params.no;
    var value = req.params.value;
    dao.updateScore(pool, no, value, (err, data) => {
        if (err) throw err;
        dao.selectAll(pool, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    })
});

// 수정기능
router.route("/update/:no/:user/:msg/:score").get((req, res) => {
    var no = req.params.no;
    var user = req.params.user;
    var msg = req.params.msg;
    var score = req.params.score;
    dao.updateMsg(pool, no, user, msg, (err, data) => {
        if (err) throw err;
        dao.selectOne(pool, no, function (err2, result2) {
            console.log(result2)
            res.send(result2);
        });
    })
});

app.use("/", router);
const server = http.createServer(app);
server.listen(app.get("port"), () => {
    console.log("서버 실행 중 >> http://localhost:" + app.get("port"));
});