const { async } = require('@firebase/util');
const express = require('express');
const router = express.Router();
const {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,
    onAuthStateChanged, signOut
} = require('../model');

//로그인사용자 가져오기
router.get('/', async (req, res, next) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            res.json({
                user
            })
        } else {
            res.json({
                user: null
            })
        }
    });

});

//이메일 로그인
router.post('/', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
        res.json({
            success: true,
            user: userCredential.user
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//회원가입
router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password)
        res.json({
            success: true,
            user: userCredential.user
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
});
//구글 로그인
router.post('/google', async (req, res, next) => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(provider);
        res.json({
            success: true,
            user: result.user
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.get('/signout', async (req, res, next) => {
    try {
        const auth = getAuth();
        await auth.signOut();
        return res.end();
    } catch (error) {
        console.error(error);
        next(error);
    }

})

module.exports = router;