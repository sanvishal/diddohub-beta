import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { EditorView } from "./EditorView";
import { StepDetails } from "./StepDetails";
import { NavBar } from "./NavBar";
import { ReadOnlyView } from "./ReadOnlyView";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    disableTransitionOnChange: false,
    useSystemColorMode: false,
  },
  fonts: {
    body: "Lato",
    heading: "Lato",
  },
  semanticTokens: {
    colors: {
      accent: "#226FEE",
      accentLight: "#A3D0FF",
      accentLighter: "#DCEDFF",
    },
  },
});

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <NavBar />
          <StepDetails />
          <Routes>
            <Route path="/" element={<ReadOnlyView />} />
            <Route path="edit" element={<EditorView />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
