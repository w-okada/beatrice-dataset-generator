import { createContext, useContext, useReducer } from "react";
import { AppState, Character, AudioFile } from "../types";

// アクションタイプの定義
const ActionTypes = {
    ADD_CHARACTER: "ADD_CHARACTER",
    DELETE_CHARACTER: "DELETE_CHARACTER",
    UPDATE_CHARACTER: "UPDATE_CHARACTER",
    SELECT_CHARACTER: "SELECT_CHARACTER",
    ADD_AUDIO_FILE: "ADD_AUDIO_FILE",
    DELETE_AUDIO_FILE: "DELETE_AUDIO_FILE",
    UPDATE_AUDIO_FILE: "UPDATE_AUDIO_FILE",
} as const;

// アクションの型定義
type Action =
    | { type: typeof ActionTypes.ADD_CHARACTER; payload: { name: string } }
    | { type: typeof ActionTypes.DELETE_CHARACTER; payload: { id: string } }
    | { type: typeof ActionTypes.UPDATE_CHARACTER; payload: Character }
    | {
          type: typeof ActionTypes.SELECT_CHARACTER;
          payload: { id: string | null };
      }
    | {
          type: typeof ActionTypes.ADD_AUDIO_FILE;
          payload: { characterId: string; file: AudioFile };
      }
    | {
          type: typeof ActionTypes.DELETE_AUDIO_FILE;
          payload: { characterId: string; fileId: string };
      }
    | {
          type: typeof ActionTypes.UPDATE_AUDIO_FILE;
          payload: { characterId: string; file: AudioFile };
      };

// 初期状態
const initialState: AppState = {
    characters: [],
    selectedCharacterId: null,
};

// リデューサー
function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case ActionTypes.ADD_CHARACTER: {
            const newCharacter: Character = {
                id: crypto.randomUUID(),
                name: action.payload.name,
                audioFiles: [],
            };
            return {
                ...state,
                characters: [...state.characters, newCharacter],
            };
        }

        case ActionTypes.DELETE_CHARACTER:
            return {
                ...state,
                characters: state.characters.filter((character) => character.id !== action.payload.id),
                selectedCharacterId: state.selectedCharacterId === action.payload.id ? null : state.selectedCharacterId,
            };

        case ActionTypes.UPDATE_CHARACTER:
            return {
                ...state,
                characters: state.characters.map((character) => (character.id === action.payload.id ? action.payload : character)),
            };

        case ActionTypes.SELECT_CHARACTER:
            return {
                ...state,
                selectedCharacterId: action.payload.id,
            };

        case ActionTypes.ADD_AUDIO_FILE:
            return {
                ...state,
                characters: state.characters.map((character) =>
                    character.id === action.payload.characterId
                        ? {
                              ...character,
                              audioFiles: [...character.audioFiles, action.payload.file],
                          }
                        : character
                ),
            };

        case ActionTypes.DELETE_AUDIO_FILE:
            return {
                ...state,
                characters: state.characters.map((character) =>
                    character.id === action.payload.characterId
                        ? {
                              ...character,
                              audioFiles: character.audioFiles.filter((file) => file.id !== action.payload.fileId),
                          }
                        : character
                ),
            };

        case ActionTypes.UPDATE_AUDIO_FILE:
            return {
                ...state,
                characters: state.characters.map((character) =>
                    character.id === action.payload.characterId
                        ? {
                              ...character,
                              audioFiles: character.audioFiles.map((file) => (file.id === action.payload.file.id ? action.payload.file : file)),
                          }
                        : character
                ),
            };

        default:
            return state;
    }
}

// コンテキストの作成
type AppStateContextType = {
    state: AppState;
    addCharacter: (name: string) => void;
    deleteCharacter: (id: string) => void;
    updateCharacter: (character: Character) => void;
    selectCharacter: (id: string | null) => void;
    addAudioFile: (characterId: string, file: AudioFile) => void;
    updateAudioFile: (characterId: string, file: AudioFile) => void;
    deleteAudioFile: (characterId: string, fileId: string) => void;
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// コンテキストを使用するためのフック
export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error("useAppState must be used within an AppStateProvider");
    }
    return context;
};

// プロバイダーコンポーネント
type AppStateProviderProps = {
    children: React.ReactNode;
};

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // アクションディスパッチャー
    const addCharacter = (name: string) => {
        dispatch({ type: ActionTypes.ADD_CHARACTER, payload: { name } });
    };

    const deleteCharacter = (id: string) => {
        dispatch({ type: ActionTypes.DELETE_CHARACTER, payload: { id } });
    };

    const updateCharacter = (character: Character) => {
        dispatch({ type: ActionTypes.UPDATE_CHARACTER, payload: character });
    };

    const selectCharacter = (id: string | null) => {
        dispatch({ type: ActionTypes.SELECT_CHARACTER, payload: { id } });
    };

    const addAudioFile = (characterId: string, file: AudioFile) => {
        dispatch({
            type: ActionTypes.ADD_AUDIO_FILE,
            payload: { characterId, file },
        });
    };

    const updateAudioFile = (characterId: string, file: AudioFile) => {
        dispatch({
            type: ActionTypes.UPDATE_AUDIO_FILE,
            payload: { characterId, file },
        });
    };

    const deleteAudioFile = (characterId: string, fileId: string) => {
        dispatch({
            type: ActionTypes.DELETE_AUDIO_FILE,
            payload: { characterId, fileId },
        });
    };

    const value = {
        state,
        addCharacter,
        deleteCharacter,
        updateCharacter,
        selectCharacter,
        addAudioFile,
        updateAudioFile,
        deleteAudioFile,
    };

    return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};
