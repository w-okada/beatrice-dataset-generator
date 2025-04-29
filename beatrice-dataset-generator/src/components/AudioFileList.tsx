import { useState, useRef, useCallback, DragEvent } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, PlayArrow as PlayIcon, Stop as StopIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useAppState } from "../001_AppStateProvider/AppStateContext";
import { AudioFile } from "../types";

export const AudioFileList = () => {
    const { t } = useTranslation();
    const { state, addAudioFile, deleteAudioFile, updateAudioFile } = useAppState();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileToDelete, setFileToDelete] = useState<{
        characterId: string;
        fileId: string;
    } | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // ドラッグアンドドロップ関連
    const [isDragging, setIsDragging] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // ファイル追加関連
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const uploadCancelRef = useRef<boolean>(false);

    // ページング関連
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // 選択されているキャラクター
    const selectedCharacter = state.characters.find((character) => character.id === state.selectedCharacterId);

    // ドラッグイベントハンドラー
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setIsDragging(false);

            if (!selectedCharacter) return;

            // FileListをArrayに変換し、音声ファイルのみをフィルタリング
            const droppedFiles = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("audio/"));

            if (droppedFiles.length > 0) {
                // ファイルを状態に保存してダイアログを開く
                setFilesToUpload(droppedFiles);
                setIsDialogOpen(true);
            }
        },
        [selectedCharacter]
    );

    // ファイル選択ハンドラー
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !selectedCharacter) return;

        // FileListをArrayに変換し、音声ファイルのみをフィルタリング
        const audioFiles = Array.from(files).filter((file) => file.type.startsWith("audio/"));

        console.log(`選択されたファイル数: ${audioFiles.length}`);

        if (audioFiles.length > 0) {
            // ファイルを状態に保存してダイアログを開く
            setFilesToUpload(audioFiles);
            setIsDialogOpen(true);
        }

        // ファイル入力をリセット
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ファイルの追加処理
    const processFiles = async () => {
        if (!selectedCharacter || filesToUpload.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);
        uploadCancelRef.current = false;

        const totalFiles = filesToUpload.length;
        let processedFiles = 0;

        for (const file of filesToUpload) {
            // キャンセルされた場合は処理を中断
            if (uploadCancelRef.current) {
                break;
            }

            try {
                // 既存のファイル名をチェック
                const existingFileIndex = selectedCharacter.audioFiles.findIndex((audioFile) => audioFile.name === file.name);

                // AudioFileオブジェクトを作成
                const audioFile: AudioFile = {
                    id: existingFileIndex >= 0 ? selectedCharacter.audioFiles[existingFileIndex].id : crypto.randomUUID(),
                    name: file.name,
                    path: URL.createObjectURL(file),
                    size: file.size,
                };

                // 音声の長さを取得（可能であれば）
                const audioElement = new Audio();
                audioElement.src = audioFile.path;

                await new Promise<void>((resolve) => {
                    const onLoadMetadata = () => {
                        audioFile.duration = audioElement.duration;
                        resolve();
                    };

                    const onError = () => {
                        console.error(`Failed to load audio metadata for file ${file.name}`);
                        resolve();
                    };

                    audioElement.addEventListener("loadedmetadata", onLoadMetadata, {
                        once: true,
                    });
                    audioElement.addEventListener("error", onError, { once: true });
                });

                if (existingFileIndex >= 0) {
                    // 既存のファイルを上書き
                    updateAudioFile(selectedCharacter.id, audioFile);
                } else {
                    // 新規ファイルを追加
                    addAudioFile(selectedCharacter.id, audioFile);
                }

                // 進捗状況を更新
                processedFiles++;
                setUploadProgress(Math.round((processedFiles / totalFiles) * 100));

                // 処理を少し遅らせて進捗状況がわかりやすくする
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error processing file ${file.name}:`, error);
                // エラーが発生しても進捗を更新して次のファイルの処理を継続
                processedFiles++;
                setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
            }
        }

        setIsUploading(false);
        setFilesToUpload([]);
        setIsDialogOpen(false);
    };

    // 追加のキャンセル
    const cancelUpload = () => {
        uploadCancelRef.current = true;
        setIsUploading(false);
        setFilesToUpload([]);
        setIsDialogOpen(false);
    };

    // 音声ファイルの削除確認ダイアログを開く
    const openDeleteDialog = (characterId: string, fileId: string) => {
        setFileToDelete({ characterId, fileId });
    };

    // 音声ファイルの削除を実行
    const handleDeleteFile = () => {
        if (fileToDelete) {
            deleteAudioFile(fileToDelete.characterId, fileToDelete.fileId);
            setFileToDelete(null);
        }
    };

    // ファイルサイズのフォーマット
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // 時間のフォーマット
    const formatDuration = (seconds?: number): string => {
        if (!seconds) return "--:--";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    // 音声の再生/停止
    const togglePlayAudio = (path: string, id: string) => {
        if (playingAudio === id) {
            // 再生中のオーディオを停止
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setPlayingAudio(null);
        } else {
            // 既存のオーディオを停止
            if (audioRef.current) {
                audioRef.current.pause();
            }

            // 新しいオーディオを再生
            const audio = new Audio(path);
            audio.addEventListener("ended", () => setPlayingAudio(null));
            audio.play();
            audioRef.current = audio;
            setPlayingAudio(id);
        }
    };

    // ページング処理
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (!selectedCharacter) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography sx={{ textAlign: "center", color: "text.secondary" }}>{t("audio.noCharacterSelected")}</Typography>
            </Box>
        );
    }

    // 表示する音声ファイル
    const displayedAudioFiles = selectedCharacter.audioFiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: "100%", overflow: "auto" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Typography variant="h6">{t("audio.list")}</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => fileInputRef.current?.click()}>
                    {t("audio.add")}
                </Button>
                <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="audio/*" onChange={handleFileSelect} multiple />
            </Box>

            {/* ドラッグ&ドロップエリア */}
            <Box
                sx={{
                    border: "2px dashed",
                    borderColor: isDragging ? "primary.main" : "grey.400",
                    borderRadius: 1,
                    p: 3,
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isDragging ? "rgba(63, 81, 181, 0.08)" : "transparent",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body1" align="center">
                    {t("audio.dropHere")}
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                    {t("audio.orClickToSelect")}
                </Typography>
            </Box>

            {selectedCharacter.audioFiles.length === 0 ? (
                <Typography sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>{t("audio.noFiles")}</Typography>
            ) : (
                <>
                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("audio.name")}</TableCell>
                                    <TableCell align="right">{t("audio.size")}</TableCell>
                                    <TableCell align="right">{t("audio.duration")}</TableCell>
                                    <TableCell align="center">{t("audio.actions")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedAudioFiles.map((file) => (
                                    <TableRow key={file.id}>
                                        <TableCell component="th" scope="row">
                                            {file.name}
                                        </TableCell>
                                        <TableCell align="right">{formatFileSize(file.size)}</TableCell>
                                        <TableCell align="right">{formatDuration(file.duration)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" onClick={() => togglePlayAudio(file.path, file.id)}>
                                                {playingAudio === file.id ? <StopIcon /> : <PlayIcon />}
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => openDeleteDialog(selectedCharacter.id, file.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* ページングコントロール */}
                    <TablePagination
                        component="div"
                        count={selectedCharacter.audioFiles.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage={t("common.rowsPerPage")}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
                    />
                </>
            )}

            {/* 音声ファイル削除確認ダイアログ */}
            <Dialog open={!!fileToDelete} onClose={() => setFileToDelete(null)}>
                <DialogTitle>{t("audio.delete")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t("audio.confirmDelete")}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFileToDelete(null)}>{t("common.cancel")}</Button>
                    <Button onClick={handleDeleteFile} color="error">
                        {t("common.delete")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ファイル追加ダイアログ */}
            <Dialog open={isDialogOpen} onClose={() => !isUploading && setIsDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t("audio.adding")}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom>
                        {t("audio.addingFiles", { count: filesToUpload.length })}
                    </Typography>

                    {filesToUpload.length > 0 && !isUploading && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {t("audio.selectedFilesCount", { count: filesToUpload.length })}
                            </Typography>
                            <Box sx={{ mt: 1, maxHeight: "120px", overflow: "auto" }}>
                                {filesToUpload.slice(0, 5).map((file, index) => (
                                    <Typography key={index} variant="caption" display="block">
                                        {file.name} ({formatFileSize(file.size)})
                                    </Typography>
                                ))}
                                {filesToUpload.length > 5 && (
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        {t("audio.andMoreFiles", {
                                            count: filesToUpload.length - 5,
                                        })}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

                    {isUploading && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress variant="determinate" value={uploadProgress} />
                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                {uploadProgress}% ({Math.floor((uploadProgress * filesToUpload.length) / 100)}/{filesToUpload.length})
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    {isUploading ? (
                        <Button onClick={cancelUpload} color="error">
                            {t("common.cancel")}
                        </Button>
                    ) : (
                        <>
                            <Button onClick={() => setIsDialogOpen(false)}>{t("common.cancel")}</Button>
                            <Button onClick={processFiles} color="primary" variant="contained">
                                {t("audio.add")}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};
