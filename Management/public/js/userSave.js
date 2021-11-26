const db = firebase.firestore();
const storage = firebase.storage();
const userId = document.querySelector('#userId');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const images = document.querySelector('#imgSelector');
const saveBtn = document.querySelector('#saveBtn');

function saveData(userId, username, email, password, fileList) {
    db.collection("users").add({
        userId,
        username,
        email,
        password,
        fileList
    })
        .then(() => {
            document.querySelector('#userId').value = '';
            document.querySelector('#username').value = '';
            document.querySelector('#email').value = '';
            document.querySelector('#password').value = '';
            document.querySelector('#imgSelector').value = '';
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
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}


saveBtn.addEventListener('click', () => {
    //이미지가 있을경우
    if (images.files.length !== 0) {
        const newFileList = [];
        for (let i = 0; i < images.files.length; i++) {
            const imgObj = {};
            const date = new Date().getTime();
            const ext = images.files[i].name.substr(images.files[i].name.lastIndexOf('.'));
            const newFileName = date + i + ext;
            const uploadRef = storage.ref();
            const fileSavePath = uploadRef.child(`images/${newFileName}`)
            fileSavePath.put(images.files[i])
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
                    if (newFileList.length === images.files.length) {
                        saveData(userId.value, username.value, email.value, password.value, newFileList)
                    }
                })
                .catch(err => {
                    console.error("Error put file" + err);
                })
        }
    } else {
        saveData(userId.value, username.value, email.value, password.value, []);
        userId.value = '';
        username.value = '';
        email.value = '';
        password.value = '';
    }

})


