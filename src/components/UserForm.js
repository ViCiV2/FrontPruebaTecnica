import React, { useState, useEffect } from "react";
import MapDialog from "./MapDialog";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  Grid2,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function UserForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    rol: "",
    calle: "",
    numero: "",
    colonia: "",
    ciudad: "",
    codigoPostal: "",
    image: "", 
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const params = useParams();
  const [editing, setEditing] = useState(false);

  // Función para manejar la carga de imágenes
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      
      const imageUrlTemp = URL.createObjectURL(file);

     
      setFormData((prevData) => ({
        ...prevData,
        image: imageUrlTemp, 
      }));

      const formData = new FormData();
      formData.append("image", file);

      try {
        
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=198c4003a6e2c5699cb721ce90cb6a33",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        
        if (result.success) {
          const imageUrl = result.data.url; 

          
          setFormData((prevData) => ({
            ...prevData,
            image: imageUrl, 
          }));
        } else {
          console.error("Error al cargar la imagen:", result.error);
        }
      } catch (error) {
        console.error("Error en la carga de la imagen:", error);
      }
    }
  };

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Funcion que hara edicion o creacion dependiendo de la accion correspondiente
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return; 
    }
    
    const mappedData = {
      nombre: formData.nombre,
      apellido1: formData.apellidoPaterno, 
      apellido2: formData.apellidoMaterno, 
      email: formData.correo, 
      telefono: formData.telefono,
      rol: formData.rol,
      foto_url: formData.image, 
      estatus: "activo", 
      calle: formData.calle,
      colonia: formData.colonia,
      ciudad: formData.ciudad,
      cp: formData.codigoPostal,
      num_calle: formData.numero,
    };
    setLoading(true);
    if (editing) {
      console.log("Editando");
      const res = await fetch(`http://localhost:4000/users/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(mappedData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
    } else {
      const res = await fetch("http://localhost:4000/users", {
        method: "POST",
        body: JSON.stringify(mappedData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
    }
    setLoading(false);

    navigate("/");
  };

  const handleSelectLocation = (locationData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...locationData, 
    }));
  };

  //Validaciones correspondinetes al formulario
  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim())
      newErrors.nombre = "El nombre no puede estar vacío.";
    if (!formData.apellidoPaterno.trim())
      newErrors.apellidoPaterno = "El apellido paterno no puede estar vacío.";
    if (!formData.apellidoMaterno.trim())
      newErrors.apellidoMaterno = "El apellido materno no puede estar vacío.";
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo no puede estar vacío.";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "Debe ser un correo válido.";
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El número de teléfono no puede estar vacío.";
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = "Debe tener 10 dígitos.";
    }
    if (!formData.calle.trim())
      newErrors.calle = "La calle no puede estar vacía.";
    if (!formData.numero.trim())
      newErrors.numero = "El número no puede estar vacío.";
    if (!formData.colonia.trim())
      newErrors.colonia = "La colonia no puede estar vacía.";
    if (!formData.ciudad.trim())
      newErrors.ciudad = "La ciudad no puede estar vacía.";
    if (!formData.rol.trim()) 
      newErrors.rol = "Ingrese su rol";
    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = "El código postal no puede estar vacío.";
    } else if (!/^\d{5}$/.test(formData.codigoPostal)) {
      newErrors.codigoPostal = "Debe ser un código postal válido de 5 dígitos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Carga los datos al formulario a travez de la edicion, se usan manejo de estados para que se pueda discernir entre creacion o edicion 
  useEffect(() => {
    if (params.id) {
      setEditing(true);
      setLoading(true);
      fetch(`http://localhost:4000/users/${params.id}`)
        .then((response) => response.json())
        .then((data) => {
          
          setFormData({
            nombre: data.nombre,
            apellidoPaterno: data.apellido1,
            apellidoMaterno: data.apellido2,
            correo: data.email,
            telefono: data.telefono,
            rol: data.rol,
            calle: data.direccion?.calle || "",
            numero: data.direccion?.num_calle || "",
            colonia: data.direccion?.colonia || "",
            ciudad: data.direccion?.ciudad || "",
            codigoPostal: data.direccion?.cp || "",
            image: data.foto_url || "", 
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar los datos:", error);
          setLoading(false);
        });
    }
  }, [params.id]);

  return (
    <Grid2
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid2 item xs={3}>
        <Card sx={{ mt: 5, p: 2 }} style={{ padding: "1em" }}>
          {/* Vista previa de la imagen */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Avatar
              src={formData.image}
              alt="Imagen de usuario"
              sx={{
                width: 100,
                height: 100,
                border: "2px solid #1976d2",
              }}
            />
          </Box>

          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            Crear usuario
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Botón para cargar imagen */}
              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Button variant="contained" component="label" sx={{ mb: 2 }}>
                  Seleccionar imagen
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>

              {/* Campos del formulario */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  variant="filled"
                  label="Nombre"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                />
                <TextField
                  variant="filled"
                  label="Apellido paterno"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  error={!!errors.apellidoPaterno}
                  helperText={errors.apellidoPaterno}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  variant="filled"
                  label="Apellido materno"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  error={!!errors.apellidoMaterno}
                  helperText={errors.apellidoMaterno}
                />
                <TextField
                  variant="filled"
                  label="Correo electrónico"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  error={!!errors.correo}
                  helperText={errors.correo}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  variant="filled"
                  label="Número de teléfono"
                  fullWidth
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                />
                <FormControl variant="filled" fullWidth>
                  <InputLabel id="role-label" error={!!errors.rol}>Rol</InputLabel>
                  <Select
                    labelId="role-label"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    error={!!errors.rol}
                  >
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="user">Usuario</MenuItem>
                  </Select>
                  {errors.rol && <Typography color="error" variant="caption">{errors.rol}</Typography>}
                </FormControl>
              </Box>
              <Typography variant="h7" align="center" sx={{ mb: 2 }}>
                Dirección
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  variant="filled"
                  label="Calle"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="calle"
                  value={formData.calle}
                  onChange={handleChange}
                  error={!!errors.calle}
                  helperText={errors.calle}
                />
                <Box
                  sx={{
                    width: "auto",
                    height: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LocationOnIcon />}
                    sx={{ height: "auto", paddingY: "8px", width: "150px" }}
                    onClick={() => setMapOpen(true)}
                  >
                    {loading ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : (
                      "Abrir Mapa"
                    )}
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  variant="filled"
                  label="Número"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  error={!!errors.numero}
                  helperText={errors.numero}
                />
                <TextField
                  variant="filled"
                  label="Colonia"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="colonia"
                  value={formData.colonia}
                  onChange={handleChange}
                  error={!!errors.colonia}
                  helperText={errors.colonia}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  variant="filled"
                  label="Ciudad"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  error={!!errors.ciudad}
                  helperText={errors.ciudad}
                />
                <TextField
                  variant="filled"
                  label="Código postal"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  error={!!errors.codigoPostal}
                  helperText={errors.codigoPostal}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#e0e0e0", 
                    color: "#000", 
                    "&:hover": {
                      backgroundColor: "#bdbdbd", 
                    },
                  }}
                  type="button"
                  onClick={() => navigate("/")} 
                >
                  Cancelar
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {loading ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </Box>
              <MapDialog
                open={mapOpen}
                onClose={() => setMapOpen(false)}
                onSelectLocation={handleSelectLocation}
              />
            </form>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}
