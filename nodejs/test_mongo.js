const mongojs = require('mongojs');
const mongodb = require('mongodb');
const mongoose = require('mongoose');

//db 및 컬렉션 지정
// 1.mongojs
// const db = mongojs('vehicle', ['car']);

// 2. mongodb
const mongoClient = mongodb.MongoClient;

let dbUrl = 'mongodb://localhost';
let carData = { name: 'Hybrid', price: '4000', company: 'HYUNDAI', year: 2021 }
let client = null
mongoClient.connect(dbUrl, (err, _client) => {
    if (err) {
        console.log('error : ' + err);
        throw err;
    }
    const db = _client.db('vehicle');
    client = _client
    console.log('몽고디비 접속 성공');
    // selectOne(db, '61a823ce3c4bede528ce7812')
    selectAll(db)
    // insert(db, carData);
    // update(db, carData, '61a823ce3c4bede528ce7812');
    // deleteFn(db, '61a851063db49cdcd1a5bdd9')
})


// 컬렉션 검색
// 1. mongojs
// db.car.find((err, data) => {
//     console.log(data);
//     db.close();
// })

// 2. mongodb
const selectOne = (db, ObjectId) => {
    if (db) {
        db.collection('car').findOne({ _id: mongodb.ObjectId(ObjectId) }, (err, result) => {
            if (err) {
                throw err
            }
            console.log(result);
            client.close();

        })
    } else {
        console.log('db접속 안됨')
    }
}

const selectAll = (db) => {
    if (db) {
        const carRef = db.collection('car');
        carRef.find().toArray((err, arr) => {
            console.log(arr);
            client.close();
        });
    } else {
        console.log('db접속 안됨')
    }
}

const insert = (db, carData) => {
    if (db) {
        db.collection('car').insertOne(carData, (err, data) => {
            if (err) {
                throw err;
            }
            // console.log(data);
            selectAll(db);
        });
    } else {
        console.log('db접속안됨');
    }
}

const update = (db, carData, ObjectId) => {
    if (db) {
        const queryObj = { _id: mongodb.ObjectId(ObjectId) };
        const newValue = { $set: carData }
        db.collection('car').updateOne(queryObj, newValue, (err, data) => {
            if (err) throw err;
            console.log(data);
            selectAll(db);
        })
    } else {
        console.log('db접속안됨')
    }
}

const deleteFn = (db, ObjectId) => {
    if (db) {
        db.collection('car').deleteOne({ _id: mongodb.ObjectId(ObjectId) }, (err, data) => {
            if (err) throw err;
            console.log(data);
            selectAll(db);
        })
    } else {
        console.log('db접속안됨');
    }
}