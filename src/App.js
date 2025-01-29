import { BrowserRouter, Routes, Route } from "react-router-dom";
import TableUserList from "./components/TableUserList";
import UserFrom from "./components/UserForm";
import { Container } from "@mui/material";
import Menu from "./components/Navbar";


/*Se definen las rutas principales de navegación*/
export default function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Container>
        <Routes>
          <Route path="/" element={<TableUserList />} />
          <Route path="/user/new" element={<UserFrom />} />
          <Route path="/user/:id/edit" element={<UserFrom />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
