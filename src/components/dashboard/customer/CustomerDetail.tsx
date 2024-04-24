"use client"
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';

export default function CustomerDetail() {

  let socket = io("http://38.242.146.83:3005", {query:{token:"asdfghasdfg"}});

  let [caller, setCaller] = useState({
    name: "",
    surName: "",
    phone: "",
    tc: "",
    payment: "",
    Id: null
  });

  let [note,setNote] = useState("");

  let [joined,setJoined] = useState(false);

  useEffect(() => {
    if(!joined){
      socket.emit("joinRoom", localStorage.getItem("custom-auth-token"));
      setJoined(true)
    }
  },[joined])

  socket.on("receiveMessage", (data) => {
    console.log(data)
    setCaller({
      name:data.callerName || "",
      surName:data.callerName || "",
      phone:data.callerNumber || "",
      tc:data.tc || "",
      payment: data.payment || "",
      Id: data.Id || null
    })
    setNote(data.note)
  })

  const handleSave = () => {
    if(caller.Id){
      axios.post("http://38.242.146.83:3001/updateNote",{
        Id:caller.Id,
        Note:note
      }).then((res) => {
        Swal.fire({
          icon:"success",
          text:"Kayıt yapıldı"
        })
      })
    }else{
      Swal.fire({
        icon:"error",
        text:"Boş kayıt yapılamaz"
      })
    }
    
  }

  return (
    <Card>
      <CardHeader subheader="" title="Müşteri Detayları" />
      <Divider />
      <CardContent>
      <Grid container>
          <Grid xs={6}>
            <div style={{padding:"10px"}}>
                <TextField
                disabled
                id="name"
                label="Ad"
                value={caller.name}
                style={{ width: "100%", marginTop:"10px"}}
                />
            </div>
          </Grid>
          <Grid xs={6}>
            <div style={{padding:"10px"}}>
                <TextField
                disabled
                id="payment"
                label="Ödeme"
                value={caller.payment}
                style={{ width: "100%", marginTop:"10px"}}
                />
            </div>
          </Grid>
          <Grid xs={6}>
            <div style={{padding:"10px"}}>
                <TextField
                disabled
                id="phone"
                label="Telefon Numarası"
                value={caller.phone}
                style={{ width: "100%", marginTop:"10px"}}
                />
            </div>
          </Grid>
          <Grid xs={6}>
            <div style={{padding:"10px"}}>
                <TextField
                disabled
                id="tc"
                label="Tc Numarası"
                value={caller.tc}
                style={{ width: "100%", marginTop:"10px"}}
                />
            </div>
          </Grid>
          <Grid xs={12}>
            <div style={{padding:"10px"}}>
                <TextField
                multiline
                rows={4}
                id="note"
                label="Not"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ width: "100%", marginTop:"10px"}}
                />
            </div>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={() => handleSave()} variant="contained">Kaydet</Button>
      </CardActions>
    </Card>
  )
}
