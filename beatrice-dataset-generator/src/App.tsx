import { ThemeProvider, createTheme } from "@mui/material";
import { AppStateProvider } from "./001_AppStateProvider/AppStateContext";
import { MainLayout } from "./components/MainLayout";
import "./utils/i18n"; // i18nの初期化

// テーマの作成
const theme = createTheme({
    palette: {
        primary: {
            main: "#3f51b5",
        },
        secondary: {
            main: "#f50057",
        },
    },
    typography: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AppStateProvider>
                <MainLayout />
            </AppStateProvider>
        </ThemeProvider>
    );
}

export default App;
