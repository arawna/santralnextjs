"use client"
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useState } from 'react'
import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { ListBullets as ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import axios from 'axios';

export default function Cards() {

    let [data,setData] = useState({answeredCallCount:"0",availableAgentCount:"0",totalCallCount:"0",unAnsweredCallCount:"0"});

    React.useEffect(() => {
        reloadValues()
      },[])
    
      const reloadValues = async () => {
        if(localStorage.getItem("custom-auth-token") === "admin" && window.location.pathname === "/dashboard"){
            let response = await axios.post("http://38.242.146.83:3001/GetCardInfo");
            setData(response.data)
            setTimeout(reloadValues, 15000);
        }
      };

  return (
    <>
        <Grid container spacing={3}>
            <Grid lg={3} sm={6} xs={12}>
                <Card style={{margin:"10px"}}>
                    <CardContent>
                        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
                        <Stack spacing={1}>
                            <Typography color="text.secondary" variant="overline">
                            Toplam Çağrı
                            </Typography>
                            <Typography variant="h4">{data.totalCallCount}</Typography>
                        </Stack>
                        <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
                            <ReceiptIcon fontSize="var(--icon-fontSize-lg)" />
                        </Avatar>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid> 
            <Grid lg={3} sm={6} xs={12}>
                <Card style={{margin:"10px"}}>
                    <CardContent>
                        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
                        <Stack spacing={1}>
                            <Typography color="text.secondary" variant="overline">
                            Cevaplanan Çağrı
                            </Typography>
                            <Typography variant="h4">{data.answeredCallCount}</Typography>
                        </Stack>
                        <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
                            <ListBulletsIcon fontSize="var(--icon-fontSize-lg)" />
                        </Avatar>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid> 
            <Grid lg={3} sm={6} xs={12}>
                <Card style={{margin:"10px"}}>
                    <CardContent>
                        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
                        <Stack spacing={1}>
                            <Typography color="text.secondary" variant="overline">
                            Cevaplanmayan Çağrı
                            </Typography>
                            <Typography variant="h4">{data.unAnsweredCallCount}</Typography>
                        </Stack>
                        <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
                            <ListBulletsIcon fontSize="var(--icon-fontSize-lg)" />
                        </Avatar>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid> 
            <Grid lg={3} sm={6} xs={12}>
                <Card style={{margin:"10px"}}>
                    <CardContent>
                        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
                        <Stack spacing={1}>
                            <Typography color="text.secondary" variant="overline">
                            Müsait Agent
                            </Typography>
                            <Typography variant="h4">{data.availableAgentCount}</Typography>
                        </Stack>
                        <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
                            <UsersIcon fontSize="var(--icon-fontSize-lg)" />
                        </Avatar>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid> 
        </Grid>
    </>
  )
}
