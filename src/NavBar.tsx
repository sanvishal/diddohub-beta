import { Button, Center } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Center gap={4} mt={4}>
      <Button onClick={() => navigate("/")} variant={location.pathname === "/" ? "solid" : "outline"}>
        Read Only
      </Button>
      <Button onClick={() => navigate("/edit")} variant={location.pathname === "/edit" ? "solid" : "outline"}>
        Edit
      </Button>
    </Center>
  );
};
