import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, TextField, Typography } from "@mui/material";
import { GetApp as DownloadIcon } from "@mui/icons-material";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useAppState } from "../001_AppStateProvider/AppStateContext";

export const ExportDataset = () => {
    const { t } = useTranslation();
    const { state } = useAppState();
    const [open, setOpen] = useState(false);
    const [exportFileName, setExportFileName] = useState("dataset");
    const [exporting, setExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    // ダイアログを開く
    const handleOpen = () => {
        setOpen(true);
    };

    // エクスポート処理
    const handleExport = async () => {
        try {
            setExporting(true);
            setExportProgress(0);

            // すべてのキャラクターをエクスポート
            const allCharacters = state.characters;

            if (allCharacters.length === 0) {
                alert(t("export.noCharactersSelected"));
                return;
            }

            const zip = new JSZip();
            const totalFiles = allCharacters.reduce((acc, character) => acc + character.audioFiles.length, 0);
            let processedFiles = 0;

            // 各キャラクターのフォルダを作成
            for (const character of allCharacters) {
                const folder = zip.folder(character.name);
                if (!folder) continue;

                // キャラクターの各音声ファイルを処理
                for (const file of character.audioFiles) {
                    try {
                        // URLからデータを取得
                        const response = await fetch(file.path);
                        const blob = await response.blob();
                        folder.file(file.name, blob);

                        // 進捗状況を更新
                        processedFiles++;
                        setExportProgress(Math.round((processedFiles / totalFiles) * 100));
                    } catch (error) {
                        console.error(`Error processing file ${file.name}:`, error);
                    }
                }
            }

            // ZIPファイルを生成して保存
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${exportFileName}.zip`);

            setOpen(false);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setExporting(false);
            setExportProgress(0);
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={handleOpen} disabled={state.characters.length === 0}>
                {t("export.button")}
            </Button>

            <Dialog open={open} onClose={() => !exporting && setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t("export.title")}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="export-filename"
                        label={t("export.filename")}
                        type="text"
                        fullWidth
                        value={exportFileName}
                        onChange={(e) => setExportFileName(e.target.value)}
                        disabled={exporting}
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle1" gutterBottom>
                        {t("export.allCharactersInfo")}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            {state.characters.length > 0 ? `${state.characters.length} ${t("character.list").toLowerCase()}` : t("character.noCharacters")}
                        </Typography>
                    </Box>

                    {exporting && (
                        <Box sx={{ width: "100%", mt: 2 }}>
                            <LinearProgress variant="determinate" value={exportProgress} />
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                {t("export.downloading")} ({exportProgress}%)
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={exporting}>
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={handleExport} color="primary" disabled={exporting || state.characters.length === 0}>
                        {t("export.button")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
