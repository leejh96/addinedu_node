import axios from 'axios'
import React, { useState, useEffect } from 'react'

function Book({ isLoggedIn }) {
    const [search, setSearch] = useState(null);
    const [searchData, setSearchData] = useState({
        searchText : '',
        condition : 'd_titl',
    })
    useEffect(() => {
        axios.get('/api/book?query=코딩')
        .then(res => {
            setSearch({
                ...search,
                data : res.data
            })
        })
    }, [])

    const onSubmitSearch = (e) => {
        e.preventDefault();
        axios.get(`/api/book?${searchData.condition}=${searchData.searchText}`)
        .then(res => {
            setSearch({
                ...search,
                data : res.data
            })
        })
    }

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name] : value
        })
    }
    return (
        <section>
            { search && 
                <>
                    <label>총 도서수 : {search.data.total}</label>
                    <table border='1'>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>이미지</th>
                                <th>제목</th>
                                <th>내용</th>
                                <th>가격</th>
                                <th>출판사</th>
                                <th>출판날짜</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                search.data.items.map((book, idx)=>(
                                    <tr key={book.isbn}>
                                        <td>{idx + 1}</td>
                                        <td><img width="150" src={book.image} alt="책 이미지" /></td>
                                        <td dangerouslySetInnerHTML={{ __html: book.title }}></td>
                                        <td dangerouslySetInnerHTML={{ __html: book.description }}></td>
                                        <td>{book.price}</td>
                                        <td>{book.publisher}</td>
                                        <td>{book.pubdate}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </>
            }
            <form onSubmit={onSubmitSearch}>
                <section>
                    <select name="condition" onChange={onChangeInput}>
                        <option value="d_titl">제목</option>
                        <option value="d_auth">저자</option>
                        <option value="d_cont">목차</option>
                        <option value="d_publ">출판사</option>
                    </select>
                    <input type="text" name="searchText" onChange={onChangeInput} />
                    <button type="submit">검색</button>
                </section>
            </form>
        </section> 
    )
}

export default Book
