const { data: quran } = require('./quran.json');

class SurahHandler {
  static getAllSurah() {
    return quran.map(item => {
      const surah = { ...item };
      delete surah.verses;
      delete surah.preBismillah;
      return surah;
    });
  }

  static getSurah(surahIndex) {
    const data = quran[surahIndex - 1];
    if (!data) {
      throw new Error(`Surah "${surahIndex}" is not found.`);
    }
    return data;
  }

  static getAyahFromSurah(surahIndex, ayahIndex) {
    const surah = quran[surahIndex - 1];
    if (!surah) {
      throw new Error(`Surah "${surahIndex}" is not found.`);
    }
    const ayah = surah.verses[ayahIndex - 1];
    if (!ayah) {
      throw new Error(`Ayah "${ayahIndex}" in surah "${surahIndex}" is not found.`);
    }


const surahData = { ...surah };
delete surahData.verses;
return { ...ayah, surah: surahData };
  }
}

module.exports = SurahHandler;
