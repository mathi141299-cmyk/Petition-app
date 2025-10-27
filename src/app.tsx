import { CircularProgress, ThemeProvider } from "@mui/material";
import "./App.css";
import { Suspense } from "react";
import theme from "./theme";
import routes from "./routes";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/publicRoutes";
import PrivateRoutes from "./routes/privateRoutes";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import ResponsiveDrawer from "./components/layout";
import { AppSnackBar } from "./components/shared";

function App() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <Routes>
          <Route element={<PublicRoutes isLoggedIn={isLoggedIn} />}>
            {routes().publicRoutes.map(({ path, Component }: any, index) => (
              <Route path={path} element={Component} key={index} />
            ))}
          </Route>
          <Route element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
            {routes().privateRoutes.map(({ path, Component }: any, index) => (
              <Route key={index} element={<ResponsiveDrawer />}>
                <Route path={path} element={Component} />
              </Route>
            ))}
          </Route>
        </Routes>
        <AppSnackBar />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
