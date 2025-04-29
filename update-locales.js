const fs = require("fs");
const path = require("path");

// ロケールファイルが格納されているディレクトリのパス
const localesDir = path.join(
  __dirname,
  "beatrice-dataset-generator",
  "src",
  "locales"
);

// 既に更新済みの言語リスト
const updatedLanguages = [
  "en",
  "ja",
  "de",
  "fr",
  "zh",
  "es",
  "ko",
  "ar",
  "el",
  "it",
  "la",
  "ms",
  "pt",
  "hi",
  "ru",
];

// ディレクトリからすべてのロケールファイルを取得
const localeFiles = fs
  .readdirSync(localesDir)
  .filter((file) => file.endsWith(".json"));

// 各ロケールファイルを処理
localeFiles.forEach((file) => {
  const langCode = path.basename(file, ".json");

  // 既に更新済みの言語はスキップ
  if (updatedLanguages.includes(langCode)) {
    console.log(`${langCode} は既に更新済みです。スキップします。`);
    return;
  }

  const filePath = path.join(localesDir, file);
  let localeData;

  try {
    // ファイルを読み込み、JSONとしてパース
    const fileContent = fs.readFileSync(filePath, "utf8");
    localeData = JSON.parse(fileContent);

    // キーの更新
    if (localeData.export && localeData.export.selectCharacters) {
      // selectCharacters キーを allCharactersInfo に変更
      const selectValue = localeData.export.selectCharacters;
      localeData.export.allCharactersInfo = selectValue.replace(
        /選択|select|選択肢|seç|избери|pilih|sélection|elegir|auswähl|选择|선택|اختر|επιλέξτε|selezion|välj/i,
        "全て|all|所有|todo|全部|모든|すべて|alle|tout|todas|semua|tümü|todos|все|كل|όλ|tutt|সমস্ত|সব|सभी|তমাম"
      );
      delete localeData.export.selectCharacters;

      // noCharactersSelected キーのメッセージを更新
      if (localeData.export.noCharactersSelected) {
        // 「選択してください」→「ありません」に変更するパターン
        localeData.export.noCharactersSelected =
          localeData.export.noCharactersSelected.replace(
            /を選択|を選んで|select|choose|seçin|選擇|선택|اختر|επιλέξτε|selezion|välj|выбер|pilih/i,
            "が無い|がありません|はありません|none|no|non|没有|없습니다|لا|δεν|нет|tiada|tidak ada"
          );
      }
    }

    // 更新したデータを書き込み
    fs.writeFileSync(filePath, JSON.stringify(localeData, null, 2), "utf8");
    console.log(`${langCode} を更新しました。`);
  } catch (error) {
    console.error(`${langCode} の処理中にエラーが発生しました:`, error);
  }
});

console.log("すべてのロケールファイルの更新が完了しました。");
