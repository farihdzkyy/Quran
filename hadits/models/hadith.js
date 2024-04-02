const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'books');
const allHadiths = fs.readdirSync(basePath).reduce((acc, hadith) => {
  if (hadith.endsWith('.json')) {
    const name = hadith.replace(/.json/gi, '');
    acc[name] = require(path.join(basePath, hadith));
  }
  return acc;
}, {});

const HadithModel = {
    available: () => Object.entries(allHadiths).map(([haditsName, data]) => {
    const lastHadith = data[data.length - 1];
    const lastNumber = lastHadith ? lastHadith.number : 0;
    return {
        name: `HR. ${HadithModel.beautyName(haditsName)}`,
        id: haditsName,
        available: lastNumber
        };
      }),
  getByName: (haditsName) => allHadiths[haditsName],
  getByNumberRange: (hadits, from, to) => {
    const data = [];
    if (!hadits) throw new Error(`Not Available`);
    if (from > to) {
      for (from; from >= to; from--) {
        data.push(hadits[from - 1]);
      }
    } else {
      for (from; from <= to; from++) {
        data.push(hadits[from - 1]);
      }
    }
    return data;
  },
  getByNumber: (hadits, number) => hadits.find(hadith => hadith.number === number),
  beautyName: (haditsName) => {
    const words = haditsName.split('-');
    return words.reduce((acc, word) =>
      acc + ` ${word[0].toUpperCase() + word.substr(1).toLowerCase()}`, '').trim();
  }
};

module.exports = HadithModel;