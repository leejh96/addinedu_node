import React, { useState, useEffect, useRef } from 'react'
import { dbService, storageService } from '../fbase';
import { v4 } from 'uuid';
import { useNavigate} from 'react-router-dom';
import layout from '../css/chat.module.css';

function Chat({ userObj }) {
    const [chat, setChat] = useState('');
    const [imgList, setImgList] = useState([]);
    const imgRef = useRef();
    const chatRef = useRef();
    const homeRef = useRef();
    const navigate = useNavigate();
    const [chatting, setChatting] = useState([]);
    const [toggle, setToggle] = useState(false); 
    useEffect(() => {
        dbService.collection('chat').orderBy('createTime').onSnapshot(snapshot => {
            const record = []
            snapshot.docs.map(doc => (
                record.push({
                    docId : doc.id,
                    ...doc.data()
                })
                ))
                setChatting(record);
            })
            return () => {
                setChatting([]);
            }
        }, [])
        const onChangeChat = (e) => {
            setChat(e.target.value);
        }
        const onChangeImage = () => {
            setImgList([
                ...imgRef.current.files
            ])
        }

    const imgFileName = (imgList) => {
        const names = [];
        imgList.forEach(img => {
            names.push(img.name);
        })

        return names.join(' ');
    }

    const onClickSend = async(e) => {
        if(!chat && !imgList.length){
            return alert('메시지를 입력하세요')
        }
        const newFileList = [];
        if(imgList.length){
            for(let i = 0; i<imgList.length; i++){
                const newFileName = v4();
                const snapshot = await storageService.ref().child(`images/${newFileName}`).put(imgList[i])
                const url = await snapshot.ref.getDownloadURL();
                newFileList.push({ filename : newFileName, url});
            }
        }
        await dbService.collection('chat').add({
            uid : userObj.uid,
            email : userObj.email,
            chat,
            fileList : newFileList,
            createTime : new Date().getTime()
        })
        console.log(imgList);
        imgRef.current.value = '';
        chatRef.current.value = '';
        homeRef.current.focus();
        setChat('');
        setImgList([]);
    }


    const onClickDelete = async (fileList, docId) => {
        if(window.confirm('삭제하시겠습니까?')){
            if(fileList.length){
                fileList.forEach(async img => {
                    await storageService.ref().child(`images/${img.filename}`).delete()
                })   
            }
            await dbService.collection('chat').doc(docId).delete()
            chatRef.current.focus();
        }
    }

    // const onClickMyChat = (e) => {
    //     if(e.target.parentElement.dataset.toggle === 'false'){
    //         e.target.parentElement.dataset.toggle = true;
    //         setToggle(true);
    //     }else{
    //         e.target.parentElement.dataset.toggle = false;
    //         setToggle(false); 
    //     }
    // }

    const onClickToggle = () => {
        setToggle(!toggle)
    }
    return (
        <section className={layout.wrap}>
            <h1 className={layout.title}>애드인에듀 채팅방</h1>
            <section className={layout['chat-section']}>
                {chatting.map(chat => (
                    chat.uid === userObj.uid ?
                        <div key={chat.docId} className={layout.mychat} >
                            <div data-doc={chat.docId} onClick={onClickToggle}>{chat.email}</div>
                            <div  key={chat.docId} className={layout['mychat-detail']}>
                                {
                                    chat.fileList.length>0 && 
                                    chat.fileList.map((img, idx) => (
                                        <img
                                            width='150' 
                                            onClick={(e) => {
                                                if(e.target.alt === img.filename){
                                                    if(e.target.width === 150){
                                                        e.target.width = 150*3
                                                    }else{
                                                        e.target.width = 150

                                                    }
                                                }
                                            }}
                                            key={img.filename} 
                                            src={img.url} 
                                            alt={`${img.filename}`} 
                                            className={layout.img} 
                                        />
                                    ))

                                }
                                <div data-doc={chat.docId}>
                                    {
                                        chat.chat.split('\n').map((item, idx) => (
                                            chat.chat &&
                                            (
                                                <span data-doc={chat.docId} key={idx}>
                                                    {item}
                                                    <br/>
                                                </span>
                                            )
                                        ))
                                    }
                                </div>
                            </div>
                            {   
                                toggle &&
                                <div className={layout['delete-wrap']}>
                                    <button onClick={() => onClickDelete(chat.fileList, chat.docId)} className={layout.delete}>삭제</button>
                                </div>
                            }
                        </div>
                    :
                        <div key={chat.docId} className={layout.yourchat}>
                            <div>{chat.email}</div>
                            <div  key={chat.docId} className={layout['yourchat-detail']}>
                                {
                                    chat.fileList.length>0 && 
                                    chat.fileList.map((img, idx) => (
                                        <div key={idx*2}>
                                            <img 
                                                width='150' 
                                                src={img.url} 
                                                alt={img.filename}
                                                onClick={(e) => {
                                                    if(e.target.alt === img.filename){
                                                        if(e.target.width === 150){
                                                            e.target.width = 150*3
                                                        }else{
                                                            e.target.width = 150
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))
                                }
                                <div>
                                    {chat.chat.split('\n').map((item, idx) => {
                                        return (
                                            <span key={idx}>
                                                {item}
                                                <br/>
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                ))}
            </section>
            <section className={layout.input}>
                <textarea ref={chatRef}  className={layout.text} name="chat" cols="30" rows="10" onChange={onChangeChat}></textarea>
                <div className={layout.filebox}>
                    <input type="text" className={layout.['file-list']} value={imgFileName(imgList)} readOnly/>
                    <label htmlFor="file"><i className="far fa-images"></i></label> 
                    <input type="file" id="file" ref={imgRef} name="image" className={layout['img-selector']} onChange={onChangeImage} multiple/>
                </div>
                <button type="button" className={layout.send} onClick={onClickSend}>전송</button>
            </section>
            <section className={layout['home-section']}>
                <button ref={homeRef} className={layout.home} onClick={() => navigate('/')}><i className="fas fa-home"></i></button>
            </section>
        </section>
    )
}

export default Chat
