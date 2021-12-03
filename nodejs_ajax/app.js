const express = require('express');
const app = express();
const cors = require('cors');
app.set('port', 3000);// 변수만들기
app.use(cors());// cors 오류를 위한 미들웨어
app.route('/').get((req, res) => {
    res.send('<h1>헬로우</h1>')
})

app.route('/data/:user/:message').get((req, res) => {
    const { user, message } = req.params;
    res.json({
        user,
        message
    })
    // res.end`: 문자열만 처리
    // res.send : 오브젝트 처리
    // 
});

app.route('/data2/:user/:message').get((req, res) => {
    const { user, message } = req.params;
    res.send({
        user,
        message,
    })
});

app.route('*').get((req, res) => {
    res.send('<h1>Error 404</h1>')
})


app.listen(app.get('port'), () => {
    console.log(`server on... >>> localhost:${app.get('port')}`);
})