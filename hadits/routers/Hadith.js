const Hadith = require('../handlers/hadith');

const HadithLibrary = {
  index: () => Hadith.index(),
  getByName: (name) => Hadith.getByName(name),
  getByNumber: (name, number) => Hadith.getByNumber(name, number),
};

module.exports = HadithLibrary;