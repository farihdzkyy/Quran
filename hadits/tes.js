const HadithLibrary = require('./routers/Hadith');

//HadithLibrary.index().then(result => {
    //console.log(result);
  //});
  
  // Use the getByName method
  const name = 'bukhari';
  const number = 123; // replace with the actual number you want to use
  const result = HadithLibrary.getByNumber('ahmad', '25432');
  console.log(result);

  
  // Use the getByNumber method
  //HadithLibrary.getByNumber('name', 123).then(result => {
    //console.log(result);
  //});