import React from 'react';

function Table({ board, onClickDelete, onClickEdit, userObj }) {
    return (
        <table border='1' style={{ width : "500px", textAlign : 'center'}}>
            <thead>
                <tr>
                    <th>id</th>
                    <th>email</th>
                    <th>introduce</th>
                    <th>이미지</th>
                    <th>수정</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                {
                    board.map((post, idx) => (
                        <tr key={post.id}>
                            <td>{idx + 1}</td>
                            <td>{post.email}</td>
                            <td>{post.introduce}</td>
                            <td><img src={post.fileList[0].imgUrl} width='150' alt="설정이미지" /></td>
                            { userObj.email === post.email ?
                                <>
                                    <td><button onClick={() => onClickEdit(post.id, post.email)}>수정</button></td>
                                    <td><button onClick={() => onClickDelete(post.id, post.email, post.fileList[0].fileName)}>삭제</button></td>
                                </>
                                :
                                <>
                                    <td></td>
                                    <td></td>
                                </>
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}

export default Table;