const express = require('express');
const router = express.Router();

//책 로드
router.get('/', (req, res, next) => {
    const key = Object.keys(req.query)[0];
    const value = req.query[key];
    let api_url = ''
    if (key === 'query') {
        api_url = `https://openapi.naver.com/v1/search/book?${key}=${encodeURI(value)}`;
    } else {
        api_url = `https://openapi.naver.com/v1/search/book_adv?${key}=${encodeURI(value)}`;
    }
    const request = require('request');
    const options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': process.env.NAVER_BOOK_API_CLIENT_ID, 'X-Naver-Client-Secret': process.env.NAVER_BOOK_API_CLIENT_SECRET }
    };
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});

//책 검색
module.exports = router;