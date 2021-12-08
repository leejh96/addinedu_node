import { useState, useEffect } from 'react';
import axios from 'axios';
import layout from './app.module.css';


function App() {
  const [input, setInput] = useState({
    id : '',
    name : '',
    email : '',
    password : ''
  });
  const [img, setImg] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users')
    .then(res => {
      setUsers(res.data.users)
    })
  }, [])


  const onChangeImg = (e) => {
    const readfileURL = URL.createObjectURL(e.target.files[0]);
    setImg(readfileURL)    
  }
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name] : value
    })
  }
  const onClickSave = (e) => {
    axios.post('/api/user', {
      ...input,
      img
    })
    .then((res) => {
      console.log(res.data);
      setUsers([
        ...users,
        {
          ...input,
          img,
          _id : res.data.objId
        }
      ])
      setImg('');
      document.querySelector("#id").value = '';
      document.querySelector("#name").value = '';
      document.querySelector("#email").value = '';
      document.querySelector("#photo").value = '';
      document.querySelector("#password").value = '';
    })
  }
  const onClickDelete = ( _id) => {
    axios.post('/api/user/delete', {_id})
    .then(res => {
      if(res.data.success){
        return users.filter(user => ( user._id !== _id ))
      }
    })
    .then(res => {
      setUsers(res);
    })

  }

  const onClickRow = (user) => {
    document.querySelector("#objId").innerHTML = user._id
    document.querySelector("#id").value = user.id
    document.querySelector("#name").value = user.name
    document.querySelector("#email").value = user.email
    document.querySelector("#updateBtn").disabled = false;
    document.querySelector("#hiddenPassword").value = user.password;

  }

  const onClickUpdate = () => {
    axios.post('/api/user/update', {
      ...input,
      img,
      objId : document.querySelector("#objId").innerHTML
    })
    .then(res => {
      if(res.data.success){
        setInput({
          ...input,
          id : '',
          name : '',
          email : '',
          password : ''
        })
        setImg('');
        document.querySelector("#id").value = '';
        document.querySelector("#name").value = '';
        document.querySelector("#email").value = '';
        document.querySelector("#photo").value = '';
        document.querySelector("#password").value = '';
      }
    }) 
  }
  return (
    <>
      <div className={layout.wrap}>
        <div className={layout.form}>
          <div className={layout.objId}>
            <span>ObjectID</span>
            <span id="objId"></span>
          </div>
          <div className={layout.id}>
            <span>ID</span><input type="text" name='id' id="id" onChange={onChangeInput}/>
          </div>
          <div className={layout.name}>
            <span>NAME</span><input type="text" name='name' id="name" onChange={onChangeInput}/>
          </div>
          <div className={layout.email}>
            <span>EMAIL</span><input type="text" name='email' id="email" onChange={onChangeInput}/>
          </div>
          <div className={layout.photo}>
            <span>PHOTO</span><input type="file" name="photo" id="photo" onChange={onChangeImg}/>
          </div>
          <div className={layout.password}>
            <span>PASSWORD</span><input type="password" name='password' id="password" onChange={onChangeInput}/>
            <button onClick={onClickSave}>SAVE</button>
            <button id="updateBtn" onClick={onClickUpdate}>UPDATE</button>
          </div>
          <input type="hidden" name="passwordConfirm" id="hiddenPassword"/>
        </div>
        <div>
          {
            img &&
            <img src={img} width="200" alt="prevImg" />
          }
        </div>
      </div>
      <div>
        <table className={layout.table} border="1">
          <thead>
            <tr>
              <th>No</th>
              <th>PHOTO</th>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {
              users.length !== 0 &&
              users.map((user, idx) =>(
                <tr key={idx} onClick={() => onClickRow(user)}>
                  <td>{idx}</td>
                  <td><img width="150" src={user.img} alt="img"/></td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="deleteSection"><input type="password"/><button type="button" onClick={() => onClickDelete( user._id )}>삭제</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
