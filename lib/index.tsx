import { StylesProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import "flexboxgrid";
import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/AppRouter/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { History } from "./components/History/History";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import { CharactersContext, useCharacters } from "./contexts/CharactersContext";
import { DarkModeContext, useDarkMode } from "./contexts/DarkModeContext";
import "./index.css";
import { env } from "./services/injections";
import { AppDarkTheme, AppLightTheme } from "./theme";
const App: React.FC<{}> = () => {
  const darkModeManager = useDarkMode();
  const charactersManager = useCharacters();

  return (
    <DarkModeContext.Provider value={darkModeManager}>
      <CharactersContext.Provider value={charactersManager}>
        <AppProvider />
      </CharactersContext.Provider>
    </DarkModeContext.Provider>
  );
};
App.displayName = "App";

export const AppProvider: React.FC<{}> = (props) => {
  const store = useContext(DarkModeContext);
  return (
    <ThemeProvider theme={store.state.darkMode ? AppDarkTheme : AppLightTheme}>
      <StylesProvider injectFirst>
        <CssBaseline />
        <ErrorBoundary>
          <HelmetProvider>
            <BrowserRouter>
              <Helmet
                htmlAttributes={{
                  "client-build-number": env.buildNumber,
                  "client-hash": env.hash,
                  "client-context": env.context,
                }}
              />
              <ScrollToTop />
              <History />
              <AppRouter />
            </BrowserRouter>
          </HelmetProvider>
        </ErrorBoundary>
      </StylesProvider>
    </ThemeProvider>
  );
};

AppProvider.displayName = "AppProvider";

ReactDOM.render(<App />, document.getElementById("root"));
