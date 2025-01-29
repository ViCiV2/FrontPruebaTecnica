import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapDialog({ open, onClose, onSelectLocation }) {
  const [position, setPosition] = useState(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position ? <Marker position={position}></Marker> : null;
  };

  //Se usa Nominatim para obtener datos de la ubicación seleccionada esto usando el mapa leaflet
  const handleConfirm = async () => {
    if (position) {
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      );
      const data = await response.json();
      const address = {
        calle: data.address.road || "",
        numero: data.address.house_number || "",
        colonia: data.address.neighbourhood || "",
        ciudad: data.address.city || data.address.town || "",
        codigoPostal: data.address.postcode || "",
      };
      onSelectLocation(address); 
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Seleccionar Ubicación</DialogTitle>
      <DialogContent>
        <MapContainer
          center={[19.432608, -99.133209]} // Se inicia el mapa por defecto en la CDMX
          zoom={13}
          style={{ height: "400px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
