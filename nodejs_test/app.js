const express = require('express');
const app = express();
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const dbUrl = 'mongodb://localhost';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoClient.connect(dbUrl, (err, client) => {
    if (err) {
        console.log('error : ' + err);
        throw err;
    }
    db = client.db('user');

    //get
    app.get('/api/users', (req, res) => {
        if (db) {
            const userRef = db.collection('user');
            userRef.find().toArray((err, arr) => {
                if (err) throw err
                res.json({
                    users: arr
                })
            });
        } else {
            console.log('db접속 안됨')
        }
    })
    //delete
    app.post('/api/user/delete', (req, res) => {
        if (db) {
            const { _id } = req.body;
            db.collection('user').deleteOne({ _id: mongodb.ObjectId(_id) }, (err, data) => {
                if (err) throw err;
                res.json({
                    success: true
                })
            })
        } else {
            console.log('db접속안됨');
        }
    })
    //create
    app.post('/api/user', (req, res) => {
        const { id, email, password, img, name } = req.body;
        const userData = { id, email, password, img, name };
        if (db) {
            db.collection('user').insertOne(userData, (err, data) => {
                console.log(data);
                if (err) {
                    return res.json({
                        error: true
                    })
                }
                res.json({
                    success: true,
                    objId: data.insertedId
                })
            });
        } else {
            console.log('db접속안됨');
        }
    })
    //update
    app.post('/api/user/update', (req, res) => {
        console.log(req.body);
        if (db) {
            const { id, email, password, img, name, objId } = req.body;
            const userData = { id, email, password, img, name };
            const newValue = { $set: userData }
            db.collection('user').updateOne({ _id: mongodb.ObjectId(objId) }, newValue, (err, data) => {
                if (err) throw err;
                console.log(data);
                res.json({
                    success: true
                })
            })
        } else {
            console.log('db접속안됨')
        }
    })
});

app.listen(5000, () => {
    console.log('server on');
})