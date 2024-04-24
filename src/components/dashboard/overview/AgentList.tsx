"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import axios from 'axios';
import { TableContainer } from '@mui/material';

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  delivered: { label: 'Delivered', color: 'success' },
  refunded: { label: 'Refunded', color: 'error' },
} as const;

export function AgentList(): React.JSX.Element {

  let [data,setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    reloadValues()
  },[])

  const reloadValues = async () => {
    if(localStorage.getItem("custom-auth-token") === "admin" && window.location.pathname === "/dashboard"){
        let response = await axios.post("http://38.242.146.83:3001/getActiveAgentConnection");
        setData(response.data);
        setTimeout(reloadValues, 5000);
    }
  };

  return (
    <Card>
      <CardHeader title="Çağrı Listesi" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer sx={{height:440}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Arayan No</TableCell>
              <TableCell>Arayan İsim</TableCell>
              <TableCell>Agent Adı</TableCell>
              <TableCell>Konuşma Süresi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{maxHeight:"100px"}}>
            {data.filter(item => item.connectionNumber !== "-").map((item,index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell style={{padding:"2px"}}>{item.connectionNumber}</TableCell>
                  <TableCell style={{padding:"2px"}}>{item.connectionName}</TableCell>
                  <TableCell style={{padding:"2px"}}>{item.agentName}</TableCell>
                  {item.connectionTime !== "-" && <TableCell style={{padding:"2px"}}>
                    <Chip color="success" label={item.connectionTime.slice(0,-8)} size="small" />
                  </TableCell>}
                  {item.connectionTime === "-" && <TableCell style={{padding:"2px"}}>-</TableCell>}
                </TableRow>
              );
            })}
            {data.filter(item => item.connectionNumber === "-").map((item,index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell style={{padding:"2px"}}>{item.connectionNumber}</TableCell>
                  <TableCell style={{padding:"2px"}}>{item.connectionName}</TableCell>
                  <TableCell style={{padding:"2px"}}>{item.agentName}</TableCell>
                  {item.connectionTime !== "-" && <TableCell style={{padding:"2px"}}>
                    <Chip color="success" label={item.connectionTime.slice(0,-8)} size="small" />
                  </TableCell>}
                  {item.connectionTime === "-" && <TableCell style={{padding:"2px"}}>-</TableCell>}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </TableContainer>
        
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {data.filter(item => item.connectionNumber !== "-").length} Adet Aktif Çağrı Mevcut
      </CardActions>
    </Card>
  );
}
