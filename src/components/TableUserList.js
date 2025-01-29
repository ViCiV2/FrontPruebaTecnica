import { useState, useEffect } from "react";
import React from "react";
import MUIDatatable from "mui-datatables";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

import { createTheme, ThemeProvider, Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";



const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function TableUserList() {

  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  
  const endpoint = "http://localhost:4000/users";

  const getData = async () => {
    await axios.get(endpoint).then((response) => {
      const data = response.data;
      console.log(data);
      setUsers(data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  
  const colums = [
    {
      name: "foto_url",
      label: "Foto",
      options: {
        customBodyRender: (value) => {
          const isImageValid =
            value && !value.includes("ERR_FILE_NOT_FOUND") && value !== "";

          return (
            <Avatar
              src={isImageValid ? value : undefined}
              alt="Foto"
              sx={{ width: 40, height: 40 }}
            >
              {!isImageValid && <PersonIcon />}
            </Avatar>
          );
        },
      },
    },
    {
      name: "nombre",
      label: "Nombre",
    },
    {
      name: "apellido1",
      label: "Apellido paterno",
    },
    {
      name: "apellido2",
      label: "Apellido materno",
    },
    {
      name: "email",
      label: "Correo electronico",
    },
    {
      name: "telefono",
      label: "Telefono",
    },
    {
      name: "rol",
      label: "Rol",
    },
    {
      name: "estatus",
      label: "Estatus",
    },
    {
      name: "acciones",
      label: "Acciones",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <IconButton
                color="primary"
                onClick={() => handleEdit(tableMeta.rowIndex)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => handleDelete(tableMeta.rowIndex)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          );
        },
        setCellProps: () => ({
          style: {
            position: "sticky",
            right: 0,
            background: darkTheme.palette.background.default,
          },
        }),
        setCellHeaderProps: () => ({
          style: {
            position: "sticky",
            right: 0,
            background: darkTheme.palette.background.default,
          },
        }),
      },
    },
  ];

  const handleEdit = (rowIndex) => {
    const user = users[rowIndex];
    navigate(`/user/${user.id}/edit`);
    
  };

  const handleDelete = (rowIndex) => {
    const user = users[rowIndex];
    const userId = user.id; 
    

   
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar al usuario ${user.nombre}?`
    );
    if (!confirmDelete) return; 

    
    axios
      .delete(`http://localhost:4000/users/${userId}`)
      .then((response) => {
        console.log("Usuario eliminado:", response.data);
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error);
        alert("Hubo un error al eliminar el usuario. Intenta nuevamente.");
      });
  };

 

  return (
    <ThemeProvider theme={darkTheme}>
      <MUIDatatable
        title={"Usuarios registrados"}
        data={users}
        columns={colums}
        options={{
          selectableRows: "none", 
          print: false
        }}
      />
    </ThemeProvider>
  );
}
