'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Avatar, CircularProgress, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Papa from "papaparse";
import axios from 'axios';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';
import { redirect } from 'next/navigation';
import { Box, fontSize } from '@mui/system';

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80vw",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius:"10px",
    boxShadow: 24,
    p: 4,
  };

export function UploadCsv(): React.JSX.Element {

    let [file,setFile] = React.useState<any>();
    let [arrayData, setArrayData] = React.useState<any[]>([]);

    let [dataCount,setDataCount] = React.useState(0);

    let [allDataList,setAllDataList] = React.useState<any[]>([]);
    let [detailList,setDetailList] = React.useState<any[]>([]);

    let [modalOpen,setModalOpen] = React.useState(false);
    const handleModelOpen = () => setModalOpen(true);
    const handleModelClose = () => setModalOpen(false);

    let [dialerState,setDialerState] = React.useState(false);

    let [loading,setLoading] = React.useState(false);

    React.useEffect(() => {
        //api istek at
        updateDataCount();
        getAllDataList();
        checkDialerState();
    },[])

    const MySwal = withReactContent(Swal)

    const handleSelectFile = (e:any) => {
        console.log(e.target.files[0])
        if(e.target.files[0].type !== "text/csv"){
          MySwal.fire({
            title: "Hata!!!",
            text: "Sadece csv uzantılı dosya yüklenebilir.",
            icon: 'error',
            confirmButtonText:"Tamam"
          })
          return;
        }
        setFile(e.target.files[0])
    }

    const checkDialerState = () => {
      axios.get("http://38.242.146.83:3001/CheckDialerState").then((res:any) => {
        setDialerState(res.data)
      })
    }

    const changeDialerState = (state:boolean) => {
      axios.get(`http://38.242.146.83:3001/CheckPaymentAndOpenOrCloseDialer?state=${state}`).then((res:any) => {
        MySwal.fire({
          text: res.data.message,
          icon: res.data.status ? "success" : "error",
          confirmButtonText:"Tamam"
        })
        checkDialerState();
      })
    }

    const getAllDataList = () => {
      axios.post("http://38.242.146.83:3001/getGroupCsv").then((res:any) => {
        console.log(res.data);
        setAllDataList(res.data)
      })
    }

    const handleUpload = () => {
        Papa.parse(file, {
          complete: function(results:any) {
            //console.log("Finished:", results.data.length);
            setArrayData(results.data)
          }}
        )
    }

    React.useEffect(() => {
        if(arrayData.length > 0){
          let dataList:any = [];
          arrayData.forEach((item:any) => {
            if(item.length > 1){
              dataList.push({
                Name: item[0],
                PhoneNumber: item[1],
                TC: item[2],
                Note: item[3],
                Payment: item[4]
              })
            }
          })
          console.log(dataList)
          // api isteği burada gidecek
          setLoading(true)
          axios.post("http://38.242.146.83:3001/insertCustomer",dataList).then((res) => {
            console.log(res.data)
            setLoading(false)
            if(res.data.success ){
              Swal.fire({
                icon:"success",
                text:"Yükleme başarılı"
              })
            }else {
              Swal.fire({
                icon:"error",
                text:"Dosya biçimi hatalı"
              })
            }
            updateDataCount();
            getAllDataList();
          }).catch((res) => {
            console.log(res)
          })
        }
      },[arrayData])

      const handleDeleteToday = () => {
        Swal.fire({
          icon:"question",
          title:"Silmek istediğinize emin misiniz?",
          text:"Bugün eklenen datalar silinecek silmek istediğinize emin misiniz?",
          showDenyButton:true,
          confirmButtonText:"Evet",
          denyButtonText:"Hayır"
        }).then((result) => {
          if(result.isConfirmed){
            axios.post("http://38.242.146.83:3001/deleteTodayInsertedDataCustomerData").then((res) => {
              Swal.fire({
                icon:"success",
                text:"Başarıyla silindi"
              })
              updateDataCount();
              getAllDataList();
            })
          }
        })
      }
      const handleDeleteAll = () => {
        Swal.fire({
          icon:"question",
          title:"Silmek istediğinize emin misiniz?",
          text:"Bütün datalar silinecek silmek istediğinize emin misiniz?",
          showDenyButton:true,
          confirmButtonText:"Evet",
          denyButtonText:"Hayır"
        }).then((result) => {
          if(result.isConfirmed){
            axios.post("http://38.242.146.83:3001/deleteAllData").then((res) => {
              Swal.fire({
                icon:"success",
                text:"Başarıyla silindi"
              })
              updateDataCount();
              getAllDataList();
            })
          }
        })
      }
    
      const updateDataCount = () => {
        axios.post("http://38.242.146.83:3001/getCountCustomerData").then((res) => {
          setDataCount(res.data)
        })
      }

      const openDetail = (groupGuid:string) => {
        setLoading(true);
        handleModelOpen()
        axios.post("http://38.242.146.83:3001/getGroupCsvDetails",{Id:groupGuid}).then((res:any) => {
          console.log(res.data)
          setDetailList(res.data)
          setLoading(false)
        })
      }

      const handleDeleteGroup = (groupGuid:string) => {
        Swal.fire({
          icon:"question",
          title:"Silmek istediğinize emin misiniz?",
          text:"Bu guruptaki datalar silinecek silmek istediğinize emin misiniz?",
          showDenyButton:true,
          confirmButtonText:"Evet",
          denyButtonText:"Hayır"
        }).then((result) => {
          if(result.isConfirmed){
              axios.post("http://38.242.146.83:3001/deleteDataByGuid",{Id:groupGuid}).then((res:any) => {
              updateDataCount();
              getAllDataList();
              console.log(res.data)
              Swal.fire({
                icon:"success",
                text:"Silme işlemi başarılı"
              })
            })
          }
        })
      }

      const handleOneDelete = (id:number) => {
        axios.post("http://38.242.146.83:3001/deleteDataById",{Id:id.toString()}).then((res) => {
          updateDataCount();
          getAllDataList();
          handleModelClose();
          Swal.fire({
            icon:"success",
            text:"Silme işlemi başarılı"
          })
        })
      }

      React.useEffect(() => {
        if(localStorage.getItem("custom-auth-token") !== "admin"){
          redirect("/dashboard/customers")
        }
      },[])

  return (
        <>
            <Grid container spacing={2}>
                <Grid lg={8} sm={12}>
                    <Card sx={{ width: '100%' }}>
                        <CardHeader subheader="Csv Dosyası Seçerek Yükleme Yapınız" title="Csv Yükle" />
                        <Divider />
                        <CardContent>
                            <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            >
                            Dosya Seç
                            <VisuallyHiddenInput onChange={(e) => handleSelectFile(e)} type="file" />
                            </Button>
                            {file && <span style={{marginLeft:"10px"}}><b>Seçilen Dosya:</b> {file.name}</span>}
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button disabled={loading} onClick={() => handleUpload()} variant="contained">Yükle</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid lg={4}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
                            <Stack spacing={1}>
                                <Typography color="text.secondary" variant="overline">
                                Toplam Data Sayısı
                                </Typography>
                                <Typography variant="h4">{dataCount}</Typography>
                            </Stack>
                            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
                                <ReceiptIcon fontSize="var(--icon-fontSize-lg)" />
                            </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid lg={6}>
                <Card sx={{ width: '100%' }}>
                  <CardHeader subheader="" title="Seçenekler" />
                  <Divider />
                  <CardContent>
                      <Button style={{marginRight:"10px",marginTop:"10px"}} onClick={() => handleDeleteToday()} variant="contained">Bugün Eklenen Datayı Sil</Button>
                      <Button style={{marginRight:"10px",marginTop:"10px"}} onClick={() => handleDeleteAll()} variant="contained">Tüm Datayı Sil</Button>
                  </CardContent>
                  <Divider />
                </Card>
              </Grid>
              <Grid lg={6}>
                <Card sx={{ width: '100%' }}>
                  <CardHeader subheader="" title="Dialer" />
                  <Divider />
                  <CardContent>
                      <Button disabled={dialerState} style={{marginRight:"10px",marginTop:"10px",backgroundColor:"green"}} onClick={() => changeDialerState(true)} variant="contained">Başlat</Button>
                      <Button disabled={!dialerState} style={{marginRight:"10px",marginTop:"10px",backgroundColor:"red"}} onClick={() => changeDialerState(false)} variant="contained">Durdur</Button>
                      <span style={{fontSize:"18px",verticalAlign:"-7px"}}>Durum: <b style={dialerState ? {color:"green"} : {color:"red"}}>{dialerState ? "Aktif" : "Deaktif"}</b></span>
                  </CardContent>
                  <Divider />
                </Card>
              </Grid>
            </Grid>
            <Card sx={{ width: '100%' }}>
                 <CardHeader subheader="" title="Data Listesi" />
                 <Divider />
                 <CardContent>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Data Sayısı</TableCell>
                          <TableCell>Yüklenme Tarihi</TableCell>
                          <TableCell>Detay</TableCell>
                          <TableCell>Sil</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allDataList.map((item,index) => (
                          <TableRow key={index}>
                            <TableCell>{item.dataCount}</TableCell>
                            <TableCell>{item.createDate}</TableCell>
                            <TableCell>
                              <Button onClick={() => openDetail(item.groupGuid)} variant='contained' >
                                Detay
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button onClick={() => handleDeleteGroup(item.groupGuid)} style={{backgroundColor:"red"}} variant='contained' >
                                Sil
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </CardContent>
                <Divider />
            </Card>
            <Modal
              open={modalOpen}
              onClose={handleModelClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {loading && <div style={{textAlign:"center"}} ><CircularProgress color="inherit" /></div>}
                {!loading && <TableContainer sx={{maxHeight:"70vh"}}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ad</TableCell>
                        <TableCell>Numara</TableCell>
                        <TableCell>Tc</TableCell>
                        <TableCell>Not</TableCell>
                        <TableCell>Sil</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detailList.map((item,index) => (
                        <TableRow>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.phoneNumber}</TableCell>
                          <TableCell>{item.tc}</TableCell>
                          <TableCell>{item.note}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleOneDelete(item.id)} variant='contained'>Sil</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>}
              </Box>
            </Modal>
        </>
      
  );
}
