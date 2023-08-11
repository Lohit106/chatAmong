import React, { useEffect, useState, useRef } from 'react'
import {Box,Button,Container,HStack,Input,VStack} from "@chakra-ui/react"
import Message from "./files/Message"
import {app} from "./firebase"
import {onAuthStateChanged,signOut,getAuth,GoogleAuthProvider,signInWithPopup} from "firebase/auth"
import {getFirestore,addDoc, collection, serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore"

const auth = getAuth(app);
const db=getFirestore(app);

const loginHandle= () =>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth,provider);
}

const logOuthandle=()=>{
  signOut(auth);
}

const App = () => {

  const [user,setUser] = useState(false);
  const [message,setmessage]=useState("");
  const [messages,setmessages]=useState([]);
  const divforscroll=useRef(null);

  const submithandler=async(e)=>{
    e.preventDefault();
    try {
      setmessage("");
      await addDoc(collection(db,"Messages"),{
        text : message,
        uid : user.uid,
        uri : user.photoURL,
        createdAt:serverTimestamp()
      });
      
      divforscroll.current.scrollIntoView({behavior:"smooth"});
      
      
      
    } catch (error) {
      alert(error);
    }

  };

  useEffect(()=>{
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onAuthStateChanged(auth , (data)=>{
        setUser(data);
    });

    const unsubscribeForMessage = onSnapshot(q,(snap)=>{
        setmessages(
          snap.docs.map((item)=>{
          const id = item.id;
          return {id, ...item.data()};

        })
        );
    });

    return ()=>{
      unsubscribe();
      unsubscribeForMessage();
    };

  },[]);

  return <Box bg={"red.50"}>
      {
        user?(
          <Container h={"100vh"} bg={"white "}>
      <VStack h={"full"} paddingY={"2"}>
        <Button onClick={logOuthandle}  w={"full"} colorScheme={"red"}>LogOut</Button>

        <VStack h={"full"} w={"full"} overflowY={"auto"} css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}>
          {
            messages.map((item)=>(
            <Message key={item.id} text={item.text} uri={item.uri} user={item.uid===user.uid?"me":"other"} />))
          } 
          <div ref={divforscroll}></div> 
        </VStack> 

          <form onSubmit={submithandler} style={{ width:"100%"}}>
              <HStack>
                <Input value={message} onChange={(e)=>setmessage(e.target.value)} required placeholder='Enter a message..'/>
                <Button colorScheme={"purple"}  type='submit'>Send</Button>
              </HStack>
          </form> 

      </VStack>

    </Container>
        ):<VStack onClick={loginHandle} justifyContent={"center"} alignItems={"center"} h={"100vh"}>
              <Button>Sign In with Google</Button>
        </VStack>
      }
    </Box>
}

export default App