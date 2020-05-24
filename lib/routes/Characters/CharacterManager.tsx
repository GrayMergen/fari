import {
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { css, cx } from "emotion";
import React, { useState } from "react";
import { ContentEditable } from "../../components/ContentEditable/ContentEditable";
import { MagicGridContainer } from "../../components/MagicGridContainer/MagicGridContainer";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { CharacterDialog } from "./CharacterDialog";
import {
  CharacterType,
  ICharacter,
  useCharacters,
} from "./hooks/useCharacters";

export const CharacterManager: React.FC<{
  onSelection?(character: ICharacter): void;
}> = (props) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const charactersManager = useCharacters();
  const [anchorEl, setAnchorEl] = useState(null);

  const onCharacterMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <CharacterDialog
        open={!!charactersManager.state.selectedCharacter}
        character={charactersManager.state.selectedCharacter}
        onSave={(newCharacter) => {
          charactersManager.actions.close();
          charactersManager.actions.update(newCharacter);
        }}
        onDelete={() => {
          const confirmed = confirm(
            t("characters-route.delete-character-confirmation")
          );
          if (confirmed) {
            charactersManager.actions.close();
            charactersManager.actions.remove(
              charactersManager.state.selectedCharacter.id
            );
          }
        }}
        onClose={() => {
          charactersManager.actions.close();
        }}
      ></CharacterDialog>

      <Box py="1rem">
        <Grid container spacing={4} wrap="nowrap" alignItems="flex-end">
          <Grid item>
            <Typography variant="h4">{t("characters-route.title")}</Typography>
          </Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
              }}
              endIcon={<PersonAddIcon></PersonAddIcon>}
            >
              {t("characters-route.create-character")}
            </Button>
            {renderAddCharacterMenu()}
          </Grid>
        </Grid>
        <Box>
          <Typography></Typography>
        </Box>
      </Box>
      <Box py="1rem">
        <MagicGridContainer items={charactersManager.state.characters.length}>
          {charactersManager.state.characters.map((character) => {
            return renderCharacterCard(character);
          })}
        </MagicGridContainer>
      </Box>
    </>
  );

  function renderAddCharacterMenu() {
    return (
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onCharacterMenuClose}
      >
        <MenuItem
          onClick={() => {
            charactersManager.actions.add(CharacterType.CoreCondensed);
            onCharacterMenuClose();
          }}
        >
          {t("characters-route.character-type.core-condensed")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            charactersManager.actions.add(CharacterType.Accelerated);
            onCharacterMenuClose();
          }}
        >
          {t("characters-route.character-type.accelerated")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            charactersManager.actions.add(CharacterType.Custom);
            onCharacterMenuClose();
          }}
        >
          {t("characters-route.character-type.custom")}
        </MenuItem>
      </Menu>
    );
  }

  function renderCharacterCard(character: ICharacter) {
    const [firstAspect] = character.aspects;
    return (
      <Box
        key={character.id}
        className={cx(
          css({
            width: isSmall ? "100%" : "25%",
            padding: "0 .5rem 1.5rem .5rem",
          })
        )}
      >
        <Paper
          elevation={undefined}
          onClick={() => {
            if (props.onSelection) {
              props.onSelection(character);
            } else {
              charactersManager.actions.select(character);
            }
          }}
          className={css({
            "cursor": "pointer",
            "&:hover": {
              background: theme.palette.action.hover,
            },
          })}
        >
          <Box>
            <Box
              className={css({
                fontSize: "1.5rem",
                width: "100%",
                padding: "0.5rem 0",
                borderBottom: "1px solid #f0a4a4",
              })}
            >
              <Box
                p={"1rem 1rem 1rem 1rem"}
                display="flex"
                justifyContent="center"
              >
                <ContentEditable
                  value={character.name}
                  readonly
                ></ContentEditable>
              </Box>
            </Box>
            <Box
              className={css({
                fontSize: "1.1rem",
                lineHeight: "1.7rem",
                padding: "0.5rem 0",
                width: "100%",
                borderBottom: `1px solid ${theme.palette.divider}`,
              })}
            >
              <Box p="0 1rem" display="flex" justifyContent="center">
                <Typography>
                  <i>{firstAspect?.value || "..."}</i>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }
};

CharacterManager.displayName = "CharacterManager";