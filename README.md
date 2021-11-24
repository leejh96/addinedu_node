# Node

## Firebase
- 구글에서 제공하는 DB, Storage, hosting 등 다양한 기능 제공
- 공식문서(https://firebase.google.com/docs)

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
- set : 문서를 만들거나 덮어쓰려는 경우에 사용, 문서의 ID 필요
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