import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAppState } from "../001_AppStateProvider/AppStateContext";

export const CharacterList = () => {
    const { t } = useTranslation();
    const { state, addCharacter, deleteCharacter, selectCharacter, toggleCharacterSelection } = useAppState();

    const [newCharacterName, setNewCharacterName] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);

    // 新しいキャラクターの追加
    const handleAddCharacter = () => {
        if (newCharacterName.trim()) {
            addCharacter(newCharacterName.trim());
            setNewCharacterName("");
            setIsAddDialogOpen(false);
        }
    };

    // キャラクターの削除確認ダイアログを開く
    const openDeleteDialog = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setCharacterToDelete(id);
    };

    // キャラクターの削除を実行
    const handleDeleteCharacter = () => {
        if (characterToDelete) {
            deleteCharacter(characterToDelete);
            setCharacterToDelete(null);
        }
    };

    // キャラクターの選択
    const handleSelectCharacter = (id: string) => {
        selectCharacter(id);
    };

    // キャラクターのエクスポート選択の切り替え
    const handleToggleSelection = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        toggleCharacterSelection(id);
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Typography variant="h6">{t("character.list")}</Typography>
                <IconButton onClick={() => setIsAddDialogOpen(true)} color="primary">
                    <AddIcon />
                </IconButton>
            </Box>

            {state.characters.length === 0 ? (
                <Typography sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>{t("character.noCharacters")}</Typography>
            ) : (
                <List>
                    {state.characters.map((character) => (
                        <ListItem
                            key={character.id}
                            disablePadding
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={(e) => openDeleteDialog(character.id, e)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemButton selected={state.selectedCharacterId === character.id} onClick={() => handleSelectCharacter(character.id)}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={character.selected}
                                        onClick={(e) => handleToggleSelection(character.id, e)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText primary={character.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}

            {/* キャラクター追加ダイアログ */}
            <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
                <DialogTitle>{t("character.add")}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="character-name"
                        label={t("character.name")}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newCharacterName}
                        onChange={(e) => setNewCharacterName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddDialogOpen(false)}>{t("common.cancel")}</Button>
                    <Button onClick={handleAddCharacter} disabled={!newCharacterName.trim()}>
                        {t("common.save")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* キャラクター削除確認ダイアログ */}
            <Dialog open={!!characterToDelete} onClose={() => setCharacterToDelete(null)}>
                <DialogTitle>{t("character.delete")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t("character.confirmDelete")}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCharacterToDelete(null)}>{t("common.cancel")}</Button>
                    <Button onClick={handleDeleteCharacter} color="error">
                        {t("common.delete")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
