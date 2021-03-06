import { dbService, storageService } from 'fbase'
import Table from './Table';
import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';

function Home({ userObj }) {
    const [introduce, setIntroduce] = useState('');
    const [board, setBoard] = useState([]);
    const introRef = useRef();
    const imgRef = useRef();
    const [prevImg, setPrevImg] = useState('');
    useEffect(() => {
        //fireStore의 변경이 생기면 실행되는 것
        dbService.collection('board').onSnapshot(snapshot => {
            const newBoard = snapshot.docs.map(doc => {
                return({
                    ...doc.data(),
                    id :doc.id,
                })
            })
            setBoard(newBoard);
        })
        introRef.current.focus();

        return () => {
            setBoard([]);
        }
    },[]);
    const onChangeInput = (e) => {
        setIntroduce(e.target.value)
    }
    const onSubmit = async(e) => {
        try {
            e.preventDefault();
            if(imgRef.current.files[0]){
                const imgName = imgRef.current.files[0].name;
                const ext = imgName.substr(imgName.lastIndexOf('.'));
                const newFileName = `${uuidv4()}${ext}`;
                const fileSavePath = storageService.ref().child(`${userObj.email}/${newFileName}`)
    
                const snapshot = await fileSavePath.put(imgRef.current.files[0])
                const imgUrl = await snapshot.ref.getDownloadURL();
                await dbService.collection('board').add({
                    email : userObj.email,
                    introduce,
                    fileList : [{
                        fileName : newFileName,
                        imgUrl
                    }]
                });
            }else{
                await dbService.collection('board').add({
                    email : userObj.email,
                    introduce,
                    fileList : []
                });
            }
            introRef.current.value = '';
            imgRef.current.value = '';
            setPrevImg('');
        } catch (error) {
            console.error(error);
        }

    }

    const onClickDelete = async(id, email, fileList) => {
        if(userObj.email === email){
            if(fileList.length){
                // dbService.doc(`board/${objId}`).delete()
                await storageService.ref().child(`${userObj.email}/${fileList[0].fileName}`).delete()
                await dbService.collection('board').doc(id).delete()
            }else{
                await dbService.collection('board').doc(id).delete()
            }
        }else{
            alert('내가 쓴 글이 아닙니다');
        }   
    }

    const onClickEdit = async(id, email, fileList) => {
        if(userObj.email === email){
            if(imgRef.current.files[0]){
                await storageService.ref().child(`${userObj.email}/${fileList[0].fileName}`).delete()
                await dbService.collection('board').doc(id).delete()
                const imgName = imgRef.current.files[0].name;
                const ext = imgName.substr(imgName.lastIndexOf('.'));
                const newFileName = `${uuidv4()}${ext}`;
                const fileSavePath = storageService.ref().child(`${userObj.email}/${newFileName}`)
    
                const snapshot = await fileSavePath.put(imgRef.current.files[0])
                const imgUrl = await snapshot.ref.getDownloadURL();
                await dbService.collection('board').doc(id).set({
                    email : userObj.email,
                    introduce : introRef.current.value,
                    fileList : [{
                        fileName : newFileName,
                        imgUrl
                    }]
                })
            }else{
                await dbService.collection('board').doc(id).set({
                    email : userObj.email,
                    introduce : introRef.current.value,
                    fileList : []
                })
            }
            introRef.current.value = '';
            imgRef.current.value = '';
            setPrevImg('');

        }else{
            alert('내가 쓴 글이 아닙니다');
        }
    }

    const onChangeImage = (e) => {
        const readfileURL = URL.createObjectURL(e.target.files[0]);
        setPrevImg(readfileURL)
    }

    return (
        <div>
            <h3>Home page</h3>
            <br />
            {board.length > 0 &&
                <Table 
                    board={board}
                    onClickDelete={onClickDelete} 
                    onClickEdit={onClickEdit}
                    userObj={userObj}
                />
            }
            <form onSubmit={onSubmit}>
                <input ref={introRef} type="text" name="introduce" maxLength={120} placeholder="introduce" onChange={onChangeInput}/>
                <input
                    ref={imgRef} 
                    type="file" 
                    name="imageSelector" 
                    accept='image/*'
                    onChange={onChangeImage}
                />
                <br/>
                <input type="submit" />
            </form>
            {
                prevImg && 
                <img src={prevImg} alt="미리보기 이미지" width='500' />
            }
        </div>
    )
}
export default Home
