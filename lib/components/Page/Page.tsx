import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Fade,
  Grid,
  Hidden,
  IconButton,
  Link,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import GitHubIcon from "@material-ui/icons/GitHub";
import MenuIcon from "@material-ui/icons/Menu";
import { css } from "emotion";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import appIcon from "../../../images/app-icon.png";
import {
  CharactersContext,
  CharactersManagerMode,
} from "../../contexts/CharactersContext/CharactersContext";
import { DarkModeContext } from "../../contexts/DarkModeContext/DarkModeContext";
import {
  ScenesContext,
  ScenesManagerMode,
} from "../../contexts/SceneContext/ScenesContext";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { env } from "../../services/injections";
import { IPossibleTranslationKeys } from "../../services/internationalization/IPossibleTranslationKeys";
import { AppLink } from "../AppLink/AppLink";
import { CookieConsent } from "../CookieConsent/CookieConsent";
import { Kofi } from "../Kofi/Kofi";

let gameIdSingleton: string | undefined = undefined;

export const Page: React.FC<{
  notFound?: JSX.Element;
  appBarActions?: JSX.Element;
  gameId?: string;
  kofi?: boolean;
}> = (props) => {
  const history = useHistory();
  const { kofi = true } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameId, setGameId] = useState(gameIdSingleton);
  const shouldDisplayRejoinButton = gameId && !props.gameId;
  const { t, i18n } = useTranslate();
  const darkModeManager = useContext(DarkModeContext);
  const scenesManager = useContext(ScenesContext);
  const charactersManager = useContext(CharactersContext);

  useEffect(() => {
    if (props.gameId) {
      setGameId(props.gameId);
      gameIdSingleton = props.gameId;
    }
  }, [props.gameId]);

  return (
    <>
      {renderHeader()}
      {renderContent()}`
    </>
  );

  function renderContent() {
    return (
      <Fade in timeout={250}>
        <div>
          <div
            className={css({
              height: "100%",
              paddingBottom: "4rem",
              minHeight: "calc(100vh - 56px)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            })}
          >
            {!!props.notFound ? (
              props.notFound
            ) : (
              <div
                className={css({
                  maxWidth: "1440px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "2rem",
                  width: "100%",
                  padding: "0 1rem",
                  flex: "1 0 auto",
                })}
              >
                {props.children}
              </div>
            )}
          </div>

          {renderFooter()}
        </div>
      </Fade>
    );
  }

  function renderFooter() {
    return (
      <Box
        className={css({
          paddingTop: "1rem",
          borderTop: "1px solid #e0e0e0",
        })}
      >
        <CookieConsent />
        <Container>
          <Grid container justify="flex-end" spacing={4} alignItems="center">
            <Grid
              item
              className={css({
                flex: "1 0 auto",
              })}
            >
              <Typography>
                <Link href="https://www.netlify.com" target="_blank">
                  This site is powered by Netlify
                </Link>
              </Typography>
            </Grid>
            {kofi && (
              <Grid item>
                <Kofi />
              </Grid>
            )}
            <Grid item>
              <Typography>
                <AppLink to="/changelog">{`v${env.version}`}</AppLink>
              </Typography>
            </Grid>
            <Grid item>
              <Select
                value={i18n.language}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value as string);
                }}
              >
                {Object.keys(i18n.options.resources!).map((language) => {
                  const shouldRenderDev =
                    language === "dev" && env.context === "localhost";
                  if (language !== "dev" || shouldRenderDev) {
                    return (
                      <MenuItem key={language} value={language}>
                        {t(
                          `common.language.${language}` as IPossibleTranslationKeys
                        )}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  function renderHeader() {
    return (
      <Box bgcolor="#fff">
        <AppBar color="inherit" position="relative">
          <Toolbar
            className={css({
              margin: "0 auto",
              maxWidth: "1440px",
              minHeight: "72px",
              width: "100%",
              padding: "1rem",
            })}
          >
            <img
              className={css({
                height: "2rem",
                paddingRight: "1rem",
                cursor: "pointer",
              })}
              onClick={() => {
                history.push("/");
              }}
              src={appIcon}
            />

            <Typography
              variant="h6"
              component="h1"
              className={css({
                paddingRight: "1rem",
                cursor: "pointer",
                userSelect: "none",
              })}
              onClick={() => {
                history.push("/");
              }}
            >
              <div
                className={css({
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "25rem",
                })}
              >
                Fari
              </div>
            </Typography>
            <Hidden smDown>{renderMenu(false)}</Hidden>

            <Hidden mdUp>
              <IconButton
                onClick={() => {
                  setMenuOpen(true);
                }}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Drawer
              anchor="bottom"
              open={menuOpen}
              onClose={() => {
                setMenuOpen(false);
              }}
            >
              <Box p="2rem">{renderMenu(true)}</Box>
            </Drawer>
            <Typography
              className={css({
                flex: "1 1 auto",
              })}
            />
            {kofi && !shouldDisplayRejoinButton && <Kofi />}
            {shouldDisplayRejoinButton && (
              <Button
                color="secondary"
                onClick={() => {
                  history.push(`/play/${gameId}`);
                }}
                variant={"outlined"}
                className={css({
                  minWidth: "10rem",
                })}
              >
                <Typography variant="button" noWrap>
                  Rejoin&nbsp;Game
                </Typography>
              </Button>
            )}
            {props.appBarActions}
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  function renderMenu(mobile: boolean) {
    const itemClass = mobile
      ? css({ textAlign: "center" })
      : css({ flex: "0 1 auto" });
    return (
      <Grid container spacing={1} justify={mobile ? "center" : undefined}>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              history.push("/");
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            {t("menu.play")}
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              scenesManager.actions.openManager(ScenesManagerMode.Redirect);
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            {t("menu.scenes")}
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              charactersManager.actions.openManager(
                CharactersManagerMode.Redirect
              );
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            {t("menu.characters")}
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              history.push("/dice");
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            {t("menu.dice")}
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              history.push("/about");
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            {t("menu.about")}
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <Button
            color="inherit"
            onClick={() => {
              window.open("https://github.com/fariapp/fari/issues/new/choose");
            }}
            variant={mobile ? "outlined" : undefined}
            fullWidth={mobile}
          >
            {t("menu.help")}
          </Button>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <IconButton
            color="inherit"
            size="small"
            className={css({
              padding: "6px 8px",
            })}
            onClick={() => {
              window.open("https://github.com/fariapp/fari");
            }}
          >
            <GitHubIcon />
          </IconButton>
        </Grid>
        <Grid item xs={8} sm={8} className={itemClass}>
          <IconButton
            color="inherit"
            size="small"
            className={css({
              padding: "6px 8px",
            })}
            onClick={() => {
              darkModeManager.actions.setDarkMode(
                !darkModeManager.state.darkMode
              );
            }}
          >
            {darkModeManager.state.darkMode ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Grid>
      </Grid>
    );
  }
};
