const express = require('express');
const router = express.Router();

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const dbUrl = 'mongodb://localhost';
const { selectAll, selectOne, update, insert, deleteFn } = require('../model/crud');

mongoClient.connect(dbUrl, (err, client) => {
    if (err) {
        console.log('error : ' + err);
        throw err;
    }
    db = client.db('vehicle');
    console.log('몽고디비 접속 성공');

    router.get('/', (req, res) => {
        selectAll(db, (err, arr) => {
            if (err) throw err;
            const carList = arr;
            res.render('car', {
                title: '자동차 리스트',
                carList
            })
        })
    });

    router.get('/detail/:_id', (req, res) => {
        const { _id } = req.params;
        selectOne(db, _id, (err, data) => {
            if (err) throw err;
            res.render('detail', {
                title: '자동차 상세정보',
                detail: data,
                _id,
            })
        })
    });

    router.get('/edit/:_id', (req, res) => {
        const { _id } = req.params;
        selectOne(db, _id, (err, data) => {
            if (err) throw err;
            res.render('edit', {
                car: data,
            })

        })
    })

    router.get('/delete/:_id', (req, res) => {
        const { _id } = req.params;
        deleteFn(db, _id, (err, data) => {
            if (err) throw err;
            res.redirect('/car')
        })
    })

    router.post('/', (req, res) => {
        const { name, price, company, year } = req.body;
        const carData = { name, price, company, year };
        insert(db, carData, (err, result) => {
            if (err) throw err;
            res.redirect('/car');
        })
    })

    router.post('/edit/:_id', (req, res) => {
        const { _id } = req.params;
        const { name, price, company, year } = req.body;
        const carData = { name, price, company, year };
        update(db, carData, _id, (err, data) => {
            if (err) throw err;
            res.redirect('/car')
        })
    })
})

module.exports = router;