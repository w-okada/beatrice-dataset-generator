/**
 * キャラクターデータの型定義
 */
export type Character = {
    id: string;
    name: string;
    selected: boolean;
    audioFiles: AudioFile[];
};

/**
 * 音声ファイルの型定義
 */
export type AudioFile = {
    id: string;
    name: string;
    path: string;
    size: number;
    duration?: number; // 秒単位
    waveform?: number[]; // 波形データ（オプション）
};

/**
 * アプリケーションの状態の型定義
 */
export type AppState = {
    characters: Character[];
    selectedCharacterId: string | null;
};
