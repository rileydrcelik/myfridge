'use client'
import Image from "next/image"
import { useState, useEffect } from 'react'
import {firestore} from '@/firebase'
import { Box, Typography, Modal, Stack, TextField, Button, List, ListItem } from '@mui/material'
import { collection, getDocs, query, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme.js';
import RecipeSuggester from './components/recipeSuggester';


export default function Home() {
  
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [qty, setQty] = useState('')
  const [searchName, searchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false);

  //creating function to update inventory, uses async so i does fuck it up i think...
  const updateInventory = async() => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      //this is what gets pushed to the inventory list, name, and associated data
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const setItem = async(item, amount) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(amount === 0){
      await deleteDoc(docRef)
    }
    else{
      await setDoc(docRef, {quantity: amount})
    }
    await updateInventory()
  }

  const addItem = async(qty, item) =>{
    for(let i = 0; i < qty; i++){
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      //if it exists, add one, if it doesnt create one
      if(docSnap.exists()){
        const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity: quantity  + 1})
      }
      else{
        await setDoc(docRef, {quantity: 1})
      }
      await updateInventory()
    }
  }

  //remove item gets the docRef, im guessing that checks the current state of the page
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
//if it doesnt exist do nothing, but if it does delete it
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity  - 1})
      }
    }
    await updateInventory()
  }

  const filteredItems = inventory.filter(item => 
    typeof item.name === 'string' && item.name.toLowerCase().includes(searchName.toLowerCase())
  )


//useeffect runs the update inventory func whenever something in the array changes. since its empty it only runs once when the page loads
  useEffect(() => {
    updateInventory()
  }, [])

  //modal helper functions
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  //bottom ones are for generate recipe
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  
  return (
  <ThemeProvider theme={theme}>
  <CssBaseline />
  <Box
  width="100vw"
  height="100vh"
  justifyContent="center" 
  alignItems="center"
  sx={{
    backgroundImage:'url("/bg.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100%',}}
  >
    <Box 
      width="80vw" 
      height ="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
      sx={{
        backgroundColor: 'white',
        backgroundPosition: 'center',
        position:'absolute',
        right:'0',
        }}
    >
      
      <Box
        border="2px solid lightgray"
        borderRadius="10px"
        sx={{backgroundColor:'white'}}
      >
        <Box
          width="1100px"
          height="200px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          borderRadius="10px 10px 0 0"
          borderBottom="2px solid lightgray"
        >
          <Typography 
            variant="h2" 
            color="slate"
          >
            MyFridge
          </Typography>
          <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          gap={3}
          >
            <TextField
              width="400px"
              //value={searchName}
              placeholder="Search..."
              display="flex"
              alignItems="center"
              justifyContent="center"
              onChange={(search)=> searchQuery(search.target.value)}
            />
                <Modal open ={open} onClose ={handleClose}>
                  <Box
                    position="absolute"
                    top="16%"
                    left="30%"
                    width={600}
                    bgcolor="white"
                    border="2px solid black"
                    borderRadius="10px"
                    boxShadow={24}
                    p={4}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                  >
                    <Typography variant="h6">Add Item</Typography>
                    <Stack
                      display="flex"
                      width="100%"
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={itemName}
                        placeholder="Enter item name"
                        onChange={(e)=>{
                          setItemName(e.target.value)
                        }}
                      />
                      <TextField
                        variant="outlined"
                        width="10%"
                        value={qty}
                        placeholder="Qty."
                        onChange={(x)=>{
                          setQty(x.target.value)
                        }}
                      />
                      <Button
                        variant="outlined"
                        sx={{ height: '50px', bottom: '0', display: 'inline-flex',textTransform: 'none', }}
                        onClick={()=>{
                          setItemName('')
                          setQty('')
                          setItem(itemName, qty)
                          handleClose()
                        }}
                        >Add</Button>
                    </Stack>
                  </Box>
                </Modal>
                <Button
                  variant="outlined"
                  sx={{textTransform: 'none',  }}
                  onClick={()=>{
                    handleOpen()
                  }}>
                    
                    Add New Item
                </Button>
                <Button
                  variant="outlined"
                  sx={{textTransform: 'none',  }}
                  onClick={()=>{
                    openModal()
                  }}
                >
                    Generate Recipe
                </Button>
                <Modal open={modalOpen} onClose={closeModal}>
                  <Box
                    position="absolute"
                    top="16%"
                    left="30%"
                    width={600}
                    bgcolor="white"
                    border="2px solid black"
                    borderRadius="10px"
                    boxShadow={24}
                    p={4}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                  >
                    <RecipeSuggester />
                  </Box>
                </Modal>
                
          </Box>
        </Box>
        <Stack
          width="100%"
          height="450px"
          spacing={1}
          overflow="auto"
        >
          {searchQuery === '' ? (
            inventory.map(({name, quantity}, index) => (
                <Box 
                key={name} 
                width="100%"
                minHeight="50px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="rgba(0,0,0,0)"
                sx={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#efefef',}}
                padding={5}
                >
                  <Typography
                  variant="h4"
                  color="black"
                  sx={{
                    flex: 8,                     // Allow name to take up remaining space
                    textAlign: 'left',
                  }}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography
                  variant="h3"
                  color="black"
                  sx={{
                    flex: 1,                     // Allow name to take up remaining space
                    textAlign: 'center',
                  }}
                  >
                    {quantity}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: 'none',  // Disables automatic capitalization
                      display: 'flex',
                      justifyContent: 'flex-end',  // Align buttons to the right
                      marginLeft: '50px',                      // Space between the buttons
                      flex: 1,                     // Ensure it takes up remaining space
                    }}
                    onClick={()=>{
                      addItem(1,name)
                    }}
                  >
                    Add
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: 'none',  // Disables automatic capitalization
                      display: 'flex',
                      justifyContent: 'flex-end',  // Align buttons to the right
                      marginLeft: '50px',                      // Space between the buttons
                      flex: 1,                     // Ensure it takes up remaining space
                    }}
                    onClick={()=>{
                      removeItem(name)
                    }}
                  >
                    Remove
                  </Button>

                  <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',  // Disables automatic capitalization
                    display: 'flex',
                    justifyContent: 'flex-end',  // Align buttons to the right
                    marginLeft: '50px',                      // Space between the buttons
                    flex: 1,                     // Ensure it takes up remaining space
                  }}
                  onClick={()=>{
                    setItem(name, 0)
                  }}
                  >
                    Clear
                  </Button>
                </Box>
            ))
           ) : (
              filteredItems.map(({ name, quantity }, index) => (
                <Box 
                  key={name} 
                  width="100%"
                  minHeight="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#efefef',}}
                  padding={5}
                >
                  <Typography
                    variant="h4"
                    color="black"
                    sx={{
                      flex: 8,                     // Allow name to take up remaining space
                      textAlign: 'center',
                    }}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography
                    variant="h3"
                    color="black"
                    sx={{
                      flex: 1,                     // Allow name to take up remaining space
                      textAlign: 'right',
                    }}
                  >
                    {quantity}
                  </Typography>
                  <Button
                    onClick={() => addItem(1, name)}
                    variant="outlined"
                    sx={{
                      textTransform: 'none',  // Disables automatic capitalization
                      display: 'flex',
                      justifyContent: 'flex-end',  // Align buttons to the right
                      marginLeft: '50px',                      // Space between the buttons
                      flex: 1,                     // Ensure it takes up remaining space
                    }}
                  >
                    Add
                  </Button>
      
                  <Button
                    onClick={() => removeItem(name)}
                    variant="outlined"
                    sx={{
                      textTransform: 'none',  // Disables automatic capitalization
                      display: 'flex',
                      justifyContent: 'flex-end',  // Align buttons to the right
                      marginLeft:'15px',                   // Space between the buttons
                      flex: 1,                     // Ensure it takes up remaining space
                    }}
                  >
                    Remove
                  </Button>
      
                  <Button
                    onClick={() => setItem(name, 0)}
                    variant="outlined"
                    sx={{
                      textTransform: 'none',  // Disables automatic capitalization
                      display: 'flex',
                      justifyContent: 'flex-end',  // Align buttons to the right
                      marginLeft:'15px',                     // Space between the buttons
                      flex: 1,                     // Ensure it takes up remaining space
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              ))
          )
        }
        </Stack>
      </Box>
    </Box>
  </Box>
  </ThemeProvider>
  )
}
