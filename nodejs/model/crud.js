const mongodb = require('mongodb');
const selectOne = (db, ObjectId, callback) => {
    if (db) {
        db.collection('car').findOne({ _id: mongodb.ObjectId(ObjectId) }, (err, data) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, data);
        })
    } else {
        console.log('db접속 안됨')
    }
}

const selectAll = (db, callback) => {
    if (db) {
        const carRef = db.collection('car');
        carRef.find().toArray((err, arr) => {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, arr);
        });
    } else {
        console.log('db접속 안됨')
    }
}

const insert = (db, carData, callback) => {
    if (db) {
        db.collection('car').insertOne(carData, (err, data) => {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, data);
        });
    } else {
        console.log('db접속안됨');
    }
}

const update = (db, carData, ObjectId, callback) => {
    if (db) {
        const queryObj = { _id: mongodb.ObjectId(ObjectId) };
        const newValue = { $set: carData }
        db.collection('car').updateOne(queryObj, newValue, (err, data) => {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, data);

        })
    } else {
        console.log('db접속안됨')
    }
}

const deleteFn = (db, ObjectId, callback) => {
    if (db) {
        db.collection('car').deleteOne({ _id: mongodb.ObjectId(ObjectId) }, (err, data) => {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, data);
        })
    } else {
        console.log('db접속안됨');
    }
}

module.exports = { selectOne, selectAll, insert, update, deleteFn }