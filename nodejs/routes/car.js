const express = require('express');
const router = express.Router();
const carList = [
    {
        name: 'Sonata',
        price: 2500,
        company: 'HYUNDAI',
        year: 2020
    },
    {
        name: 'BMW',
        price: 5500,
        company: 'BMW',
        year: 2021
    },
    {
        name: 'Grandeur',
        price: 3500,
        company: 'HYUNDAI',
        year: 2019
    },
]

router.get('/', (req, res) => {
    res.render('car', {
        title: '자동차 리스트',
        carList
    })
});

router.get('/detail', (req, res) => {
    const { no } = req.query;
    res.render('detail', {
        title: '자동차 상세정보',
        detail: carList[parseInt(no) - 1],
        no,
    })
});

router.get('/edit/:no', (req, res) => {
    const { no } = req.params
    res.render('edit', {
        car: carList[parseInt(no) - 1],
        no
    })
})

router.get('/delete/:no', (req, res) => {
    const { no } = req.params;
    carList.splice(parseInt(no) - 1, 1);
    res.redirect('/car');
})

router.post('/', (req, res) => {
    const { name, price, company, year } = req.body;
    carList.push({
        name,
        price,
        company,
        year
    })
    res.redirect('/car')
})

router.post('/edit', (req, res) => {
    const { no, name, price, company, year } = req.body;
    carList[parseInt(no) - 1] = {
        name,
        price,
        company,
        year
    }
    // res.json({
    //     success: true
    // })
    res.redirect('/car')
})
module.exports = router;