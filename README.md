# Firebase & Node

## 파일업로드(Client)

```
<body>
<!-- multiple 설정 시 여러개의 이미지 가져올 수 있음  -->
  <input type="file" class="file" id="imageSelector" name="imageSelector"
      accept="image/jpeg, image/jpg, image/png" multiple>
  <div id="preview-image"></div>
</body>
<script>
    function readImage(input) {
        //파일이 한개이상 선택됨
        if (input.files.length !== 0 && input.files[0]) {
            //file reader 객체 : 파일소스를 읽어오는 객체(js 내부객체)
            const reader = new FileReader();
            //이미지를 모두 읽어온 후 실행
            reader.onload = (e) => {
                const img = `<img src=${e.target.result} width="150"/>`
                $('#preview-image').append(img);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    function deleteImg(id) {
        $(`#${id}`).remove();
    }

    function readImagePreview(input) {
        if (input.files.length !== 0 && input.files[0]) {
            const readfileURL = URL.createObjectURL(input.files[0]);
            const img = `<img src=${readfileURL} width="150"/>
            <button type='button' id='deleteBtn'>삭제</button>
            `
            $('#preview-image').append(img);

            // 이미지 로딩 후 객체 URL을 해제하여 메모리 해제
            $('#preview-image > img').on('load', function (e) {
                URL.revokeObjectURL($(this).attr('src'));
            })
            $('#deleteBtn').on('click', () => {
                input.value = '';
                deleteImg();
            })
        }
    }
    // 다중파일 업로드
    function readImageMultiPreview(input) {
        for (let i = 0; i < input.files.length; i++) {
            const readfileURL = URL.createObjectURL(input.files[i]);
            let img = `
                <img src=${readfileURL} class="img" width="150"/>
                <button data-index=${input.files[i].lastModified} type='button' class='deleteBtn'>삭제</button>
            `
            $('#preview-image').append(img);

            // 이미지 로딩 후 메모리 해제
            $('#preview-image>img').on('load', function (e) {
                URL.revokeObjectURL($(this).attr('src'));
                $('.deleteBtn').on('click', function (e) {
                    const dataTranster = new DataTransfer();
                    const arr = Array.from(input.files)
                    const newArr = arr.filter(file => file.lastModified != e.target.dataset.index)

                    newArr.forEach(file => {
                        dataTranster.items.add(file);
                    });
                    input.files = dataTranster.files;

                    if (this) {
                        const imgItem = $(this).prev();
                        $(this).remove()
                        imgItem.remove();

                    });
            });
        }

    }
    $('#imageSelector').on('change', (e) => {
        // 첫번째 방법
        // readImage(e.target);

        // 두번째 방법
        // readImagePreview(e.target);
        
        // 세번째 방법(다중업로드)
        readImageMultiPreview(e.target);
    });
</script>
```

## Firebase
- 구글에서 제공하는 DB, Storage, hosting 등 다양한 기능 제공
- [공식문서](https://firebase.google.com/docs)

- Firebase
> npm i -g firebase-tools
> - firebase의 login, init, deploy 등 cmd에서 firebase로 시작하는 명령어를 사용할 수 있도록 설치
>
> firebase login
>
> firebase init 
> - 자신이 작업할 워크스페이스에 들어가서 실행
> - 자신이 선택한 옵션을 방향키와 스페이스바로 설정 후 엔터
>
> firebase serve
> - localhost로 서버를 켜는 명령어
>
> firebase deploy
> - 배포
>
> SDK 설정 및 구성( Firebase Config )
> - firebase 사이트 들어가서 원하는 프로젝트를 클릭
> - 사이드바에 프로젝트 개요 옆 톱니바퀴 클릭 후 프로젝트 설정 클릭
> - 자신이 만들고자 하는 서비스를 선택한 후 추가하면 SDK를 가져올 수 있음

### FireStore
- Firebase에서 제공하는 NoSQL DB
- 규칙을 설정하여 읽고 쓰는 것을 제한할 수 있음

**시작하기**
- 웹 버전8(namespaced)
```
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>

firebase.initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
  projectId: '### CLOUD FIRESTORE PROJECT ID ###'
});

var db = firebase.firestore();
```

- 웹 버전9(modular)
```
npm install firebase

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
const firebaseApp = initializeApp({
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
  projectId: '### CLOUD FIRESTORE PROJECT ID ###'
});

const db = getFirestore();
```

**데이터 읽기**
- 웹 버전8(namespaced)
```
db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
```

- 웹 버전9(modular)
```
import { collection, getDocs } from "firebase/firestore";

const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});
```

**데이터 추가**
- set : 문서를 만들거나 덮어쓰려는 경우에 사용, 문서의 ID 필요(수정도 가능)
- add : 유의미한 ID를 두지 않을 경우에 자동으로 ID를 생성하고 데이터를 추가하는 메소드
- 웹 버전8(namespaced)
```
//set
db.collection("cities").doc("LA").set({
    name: "Los Angeles",
    state: "CA",
    country: "USA"
})
.then(() => {
    console.log("Document successfully written!");
})
.catch((error) => {
    console.error("Error writing document: ", error);
});

//add
db.collection("cities").add({
    name: "Tokyo",
    country: "Japan"
})
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
```

- 웹 버전9(modular)
```
//set
import { doc, setDoc } from "firebase/firestore";

// Add a new document in collection "cities"
await setDoc(doc(db, "cities", "LA"), {
  name: "Los Angeles",
  state: "CA",
  country: "USA"
});

//add
import { collection, addDoc } from "firebase/firestore";

// Add a new document with a generated id.
const docRef = await addDoc(collection(db, "cities"), {
  name: "Tokyo",
  country: "Japan"
});
```
**데이터 삭제**
```
db.collection("cities").doc("DC").delete().then(() => {
    console.log("Document successfully deleted!");
}).catch((error) => {
    console.error("Error removing document: ", error);
});
```

### Storage
- 이미지나 업로드 파일을 저장하는 공간
- 접근이 거부되면 스토리지의 rules를 봐야함

**시작하기**
```
var db = firebase.firestore();

var storageRef = storage.ref(); //스토리지와 연결하기 위한 참조설정
var imagesRef = storageRef.child('폴더이름/파일이름'); //스토리지에 images폴더로 패스 지정
```

**파일 업로드**
```
//이미지 업로드
const fileData = $('#imageSelector')[0].files[0];

imagesRef.put(fileData)
.then(snapshot => {
  snapshot.ref.getDownloadURL()
    .then(res => {
      const imgUrl = res;
      putData(name, price, company, year, newFileName, imgUrl);
    })
    .catch(err => {
      console.error("Error put file" + err);
    })
})
.catch(err => {
  console.error("Error getDownloadURL" + err);
})

//이미지 삭제
imagesRef(`photo/${imgUrl}`).delete()
.then(res => {
  console.log('이미지삭제 완료')
  loadData();
})
.catch(err => {
  console.error('del Storage err' + err);
})
```
### Authentication
firebase에서 제공하는 인증
- 가장 일반적인 email, password로 하는 로그인 인증 제공
- OAuth를 통한 로그인 인증 제공
- 로그인 후 세션 구현 제공
- 로그아웃 기능 제공

```
//fbase.js
//firebase 설정파일
import firebase from "firebase/app";
...
export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();
export const firebaseInstance = firebase;
export const firebaseInstance = firebase;
```

**email password 회원가입**
```
import { authService } from 'fbase';

await authService.createUserWithEmailAndPassword(email, password);
```

**email password 로그인 방식**
```
import { authService } from 'fbase';

await authService.signInWithEmailAndPassword(email, password);
```

**SNS OAuth 로그인 방식**
- 사전작업
    - firebase console의 Authentication > sign-in method
    - 제공업체 추가를 클릭하여 로그인 방식 설정 및 클라이언트 키 및 비밀번호 입력
- OAuth의 provider를 가져오기 위해서는 firebase 객체를 사용해야 함
- fbase.js 안에 firebaseInstance변수를 만들어 import한 firebase 객체를 담고 export

```
//Auth.js
import { authService, firebaseInstance } from 'fbase';
if(name === 'google'){
    provider = new firebaseInstance.auth.GoogleAuthProvider();
}else if(name === 'github'){
    provider = new firebaseInstance.auth.GithubAuthProvider();
}
//팝업창으로 통한 로그인
const data = await authService.signInWithPopup(provider);
```

**로그인 유저 가져오기**
```
import { authService } from 'fbase';

authService.onAuthStateChanged(user => {
    if(user){
        setIsLoggedIn(user);
    }else{
        setIsLoggedIn(false);
    }
})
```

**로그아웃**
```
import { authService } from 'fbase'

await authService.signOut();
```
## React-Firebase

### Deploy
- React 파일을 bulid하여 build 폴더 생성
- build 폴더 안에 firebase init 명령어 실행
- React file build시 생성된 모든 파일을 firebase init 후 생긴 public 폴더에 붙여넣기
- firebase deploy

## MongoDB
- NoSQL Database
- Nodejs와 사용할 경우 Mongojs, Mongodb, Mongoose 등의 패키지들과 사용가능
- Mongodb 모듈에서 문자열로 ObjectId를 주면 값을 읽어오지 못하기 때문에 Mongodb.ObjectId(문자열)로 _id 값을 만들어줄 수 있음