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

app.set("port", 3000);

// 크로스 도메인 문제를 해결 해 주는 미들웨어 등록
app.use(cors());

router.route("/").get((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello world</h1>");
    res.end();
});

var msg_list = [
    { no: 1, user: "KIM", msg: "hello", score: 1 },
    { no: 2, user: "PARK", msg: "I love you", score: 5 },
];

var noSeq = 3;

//http://localhost:3000/data/KIM/LOVE
router.route("/data/:user/:msg").get((req, res) => {
    // 전달받은 데이터를 추가하고 msg_list 전송
    var data = {
        no: noSeq++,
        user: req.params.user,
        msg: req.params.msg,
        score: 0,
    };
    // data를 msg_list에 추가한다.
    msg_list.push(data);
    res.send(msg_list);
});

router.route("/loadData").get((req, res) => {
    // msg_list를 전송한다.
    res.send(msg_list);
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
    // no와 index는 일치하지 않는다.
    var index = findIndex(no);
    // index를 이용해서 배열에서 해당 요소를 삭제
    msg_list.splice(index, 1);
    // 결과를 출력
    res.send(msg_list);
});

//http://localhost:3000/data/KIM/LOVE
router.route("/data2/:user/:msg").get((req, res) => {
    let user = req.params.user;
    let msg = req.params.msg;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write(`{"USER":"${user}", "MESSAGE":"${msg}"}`);
    res.end();
});

// score 반영
router.route("/score/:no/:value").get((req, res) => {
    var no = req.params.no;
    var value = req.params.value;
    // score를 msg_list에 반영하기
    var index = findIndex(no);
    msg_list[index].score = value;

    res.send(msg_list);
});

// 수정기능
router.route("/update/:no/:user/:msg/:score").get((req, res) => {
    var no = req.params.no;
    var user = req.params.user;
    var msg = req.params.msg;
    var score = req.params.score;

    var index = findIndex(no);
    if (index != -1) {
        msg_list[index].user = user;
        msg_list[index].msg = msg;
        msg_list[index].score = score;
    }
    res.send(msg_list[index]);
});

app.use("/", router);
const server = http.createServer(app);
server.listen(app.get("port"), () => {
    console.log("서버 실행 중 >> http://localhost:" + app.get("port"));
});