import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppBar, Box, Container, CssBaseline, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import { CharacterList } from "./CharacterList";
import { AudioFileList } from "./AudioFileList";
import { ExportDataset } from "./ExportDataset";
import { changeLanguage, LANGUAGES, Language } from "../utils/i18n";

// 言語表示名のマッピング
const languageLabels: Record<Language, string> = {
    [LANGUAGES.EN]: "English",
    [LANGUAGES.JA]: "日本語",
    [LANGUAGES.KO]: "한국어",
    [LANGUAGES.DE]: "Deutsch",
    [LANGUAGES.AR]: "العربية",
    [LANGUAGES.EL]: "Ελληνικά",
    [LANGUAGES.ES]: "Español",
    [LANGUAGES.FR]: "Français",
    [LANGUAGES.IT]: "Italiano",
    [LANGUAGES.LA]: "Latina",
    [LANGUAGES.MS]: "Bahasa Melayu",
    [LANGUAGES.RU]: "Русский",
    [LANGUAGES.ZH]: "中文",
    [LANGUAGES.HI]: "हिन्दी",
    [LANGUAGES.PT]: "Português",
    [LANGUAGES.ID]: "Bahasa Indonesia",
    [LANGUAGES.BN]: "বাংলা",
    [LANGUAGES.TR]: "Türkçe",
    [LANGUAGES.UR]: "اردو",
    [LANGUAGES.SW]: "Kiswahili",
    [LANGUAGES.VI]: "Tiếng Việt",
    [LANGUAGES.TA]: "தமிழ்",
    [LANGUAGES.FA]: "فارسی",
    [LANGUAGES.PA]: "ਪੰਜਾਬੀ",
    [LANGUAGES.MR]: "मराठी",
    [LANGUAGES.TE]: "తెలుగు",
    [LANGUAGES.WUU]: "吴语",
    [LANGUAGES.JV]: "Basa Jawa",
};

export const MainLayout = () => {
    const { t, i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // 言語メニューを開く
    const handleOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // 言語メニューを閉じる
    const handleCloseLanguageMenu = () => {
        setAnchorEl(null);
    };

    // 言語を変更
    const handleChangeLanguage = (language: Language) => {
        changeLanguage(language);
        handleCloseLanguageMenu();
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <CssBaseline />
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {t("app.title")}
                    </Typography>

                    <Box sx={{ ml: 2 }}>
                        <ExportDataset />
                    </Box>

                    <Box sx={{ ml: 2 }}>
                        <Tooltip title="言語を変更">
                            <IconButton size="large" aria-controls="language-menu" aria-haspopup="true" onClick={handleOpenLanguageMenu} color="inherit">
                                <LanguageIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="language-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleCloseLanguageMenu}
                            sx={{ maxHeight: 300 }}
                        >
                            {Object.values(LANGUAGES).map((lang) => (
                                <MenuItem key={lang} onClick={() => handleChangeLanguage(lang)} selected={i18n.language === lang}>
                                    {languageLabels[lang]}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 3,
                    }}
                >
                    <Box sx={{ width: { xs: "100%", md: "33.333%" } }}>
                        <CharacterList />
                    </Box>
                    <Box sx={{ width: { xs: "100%", md: "66.667%" } }}>
                        <AudioFileList />
                    </Box>
                </Box>
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 2,
                    px: 2,
                    mt: "auto",
                    backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[800]),
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        {t("app.description")}
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};
