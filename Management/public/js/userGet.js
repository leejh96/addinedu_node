const tableBody = document.querySelector('#list-table-body');

let userList = [];

function loadData(users) {
    let tblist = '';
    for (let i in users) {
        tblist += `<tr class="table-row" data-object=${JSON.stringify(users[i])}>
            <td>${i}</td>
            <td><img width="150" src="${users[i].fileList[0] ? users[i].fileList[0].url : ''}" /></td>
            <td>${users[i].userId}</td>
            <td>${users[i].username}</td>
            <td>${users[i].email}</td>
            <td>
                <input type="password" placeholder="비밀번호" class="confirmPassword">
                <input type="button" data-password=${users[i].password} data-object=${JSON.stringify(users[i])} value="삭제" class="deleteBtn">
            </td>
        </tr>`
    }
    tableBody.innerHTML = tblist;
}

db.collection('users').get()
    .then(res => {
        res.forEach(doc => {
            userList.push({
                ObjectId: doc.id,
                userId: doc.data().userId,
                username: doc.data().username,
                email: doc.data().email,
                password: doc.data().password,
                fileList: doc.data().fileList
            })
        })
        return userList;
    })
    .then(res => {
        loadData(res);
    })
    .then(() => {
        const tableRow = document.querySelectorAll('.table-row');
        const editBtn = document.querySelector('#editBtn');

        for (let i = 0; i < tableRow.length; i++) {

            tableRow[i].addEventListener('click', () => {
                editBtn.disabled = false;
                const obj = JSON.parse(tableRow[i].dataset.object);
                document.querySelector('#firebaseId').innerHTML = obj.ObjectId;
                document.querySelector('#userId').value = obj.userId
                document.querySelector('#username').value = obj.username
                document.querySelector('#email').value = obj.email
                document.querySelector('#password').value = obj.password

                if (obj.fileList.length === 0) {
                    document.querySelector('#table-image').innerHTML = `<img src="https://image.shutterstock.com/image-vector/missing-picture-page-website-design-600w-1552421075.jpg" width="200">`
                } else {
                    let tbImg = '';
                    for (let i = 0; i < obj.fileList.length; i++) {
                        tbImg += `<img src=${obj.fileList[i].url} width="200" />`
                    }
                    document.querySelector('#table-image').innerHTML = tbImg
                }


            });
        }
    })
    .then(() => {
        const editBtn = document.querySelector('#editBtn');

        function editData(userId, username, email, password, fileList, objectId) {
            db.collection('users').doc(objectId).set({
                userId,
                username,
                email,
                password,
                fileList
            })
                .then(() => {
                    userList = [];
                    db.collection('users').get()
                        .then(res => {
                            res.forEach(doc => {
                                userList.push({
                                    ObjectId: doc.id,
                                    userId: doc.data().userId,
                                    username: doc.data().username,
                                    email: doc.data().email,
                                    password: doc.data().password,
                                    fileList: doc.data().fileList
                                })
                            })
                            return userList;
                        })
                        .then(res => {
                            loadData(res);
                        })
                })
                .then(() => {
                    document.querySelector('#userId').value = '';
                    document.querySelector('#username').value = '';
                    document.querySelector('#email').value = '';
                    document.querySelector('#password').value = '';
                    document.querySelector('#imgSelector').value = '';
                })
        }
        editBtn.addEventListener('click', () => {
            const objectId = document.querySelector('#firebaseId').innerHTML;
            db.collection('users').doc(objectId).get()
                .then(doc => {
                    if (doc.data().fileList.length !== 0) {
                        //제거할 파일이 있는 경우
                        for (let i = 0; i < doc.data().fileList.length; i++) {
                            const deleteFileName = doc.data().fileList[i].fileName;
                            storage.ref().child(`/images/${deleteFileName}`).delete()
                                .then(() => console.log('이미지 제거'))
                        }
                    }
                })
                .then(() => {
                    const imgs = document.querySelector('#imgSelector');
                    if (imgs.files.length !== 0) {
                        const newFileList = [];
                        for (let i = 0; i < imgs.files.length; i++) {
                            const imgObj = {};
                            const date = new Date().getTime();
                            const ext = imgs.files[i].name.substr(imgs.files[i].name.lastIndexOf('.'));
                            const newFileName = date + i + ext;
                            const uploadRef = storage.ref();
                            const fileSavePath = uploadRef.child(`images/${newFileName}`)
                            fileSavePath.put(imgs.files[i])
                                .then(snapshot => {
                                    return snapshot.ref.getDownloadURL()
                                })
                                .then(res => {
                                    imgObj.fileName = newFileName;
                                    imgObj.url = res;
                                    return imgObj;
                                })
                                .then(res => {
                                    // 비동기라서 먼저 넣은 이미지가 나중에 저장될 수 있어서
                                    // if문에 i를 쓰지않고 길이를 넣어줌
                                    newFileList.push(res);
                                    if (newFileList.length === imgs.files.length) {
                                        editData(userId.value, username.value, email.value, password.value, newFileList, objectId)
                                    }
                                })
                                .catch(err => {
                                    console.error("Error put file" + err);
                                })
                        }
                    } else {
                        editData(userId.value, username.value, email.value, password.value, [], objectId.value);
                        userId.value = '';
                        username.value = '';
                        email.value = '';
                        password.value = '';
                        objectId.value = '';
                        editBtn.disabled = true;
                    }
                })


        })
    })
    .then(() => {
        const deleteBtn = document.querySelectorAll('.deleteBtn');
        const confirmPassword = document.querySelectorAll('.confirmPassword');
        for (let i = 0; i < deleteBtn.length; i++) {
            deleteBtn[i].addEventListener('click', (e) => {
                if (e.target.dataset.password === confirmPassword[i].value) {
                    const obj = JSON.parse(e.target.dataset.object);
                    db.collection('users').doc(obj.ObjectId).delete()
                        .then(() => {
                            for (let i = 0; i < obj.fileList.length; i++) {
                                storage.ref().child(`images/${obj.fileList[i].fileName}`).delete()
                            }
                        })
                        .then(() => {
                            let delIdx;
                            for (let i = 0; i < userList.length; i++) {
                                if (userList[i].ObjectId === obj.ObjectId) {
                                    delIdx = i;
                                    break;
                                }
                            }
                            userList.splice(delIdx, 1);
                            loadData(userList);
                        })
                        .catch((e) => {
                            console.error(e);
                        })
                } else {
                    alert('비밀번호가 틀립니다');
                }
            })
        }
    })
