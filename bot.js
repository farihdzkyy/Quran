const { Bot, InlineKeyboard, session, InputFile, GrammyError } = require('grammy');
const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');
const HadithLibrary = require('./hadits/routers/Hadith');
const { translate } = require('bing-translate-api');
const quranApi = require('./API/routes')
const path = require('path');
const bot = new Bot("7087729295:AAGvpeRu1jmSuMlSaYNv0PDk_kaaMFLqbu4");
bot.use(session());

bot.command("start", async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || ''; // Initialize language if undefined

  if (!ctx.session.language) {
    // User has not selected a language yet
    const text = '👋 Assalamualaikum!\nHi there, nice to meet you! 🤗\nI am a telegram bot 🤖 with features to search/fetch Quran, Hadis and Prayer times. 📚⏰\nBefore we start, make sure you select the language 🌐 and calculation methods 🔢 using the buttons below!';
    const languageButton = [
      { text: "🌐 Select Language", callback_data: 'pilih_language' },
      { text: "🔢 Set Calculation Methods", callback_data: 'setmh'},
      { text: "❓ Help", callback_data: 'command' },
      { text: "🔎 About", url: 'https://t.me/nekozux' }
    ];
    const inlineKeyboard = new InlineKeyboard().row(...languageButton);
    await ctx.reply(text, { reply_markup: inlineKeyboard });
  } else {
    // User has already selected a language
    const welcomeText = '👋 Assalamualaikum!\nHi again, nice to see you! 🤗\nRemember, I am here to help you search/fetch Quran, Hadis and Prayer times. 📚⏰\nIf you want to know what commands are available from me, just click the Command button below! 🎮';
    let translatedWelcomeText = welcomeText;

    if (ctx.session.language) {
      try {
        translatedWelcomeText = await translate(welcomeText, 'en', ctx.session.language);
      } catch (error) {
        console.error('Translation error:', error);
        // Handle translation error (fallback to default text)
      }
    }

    const inlineKeyboard = new InlineKeyboard();
    const languageButton = [
      { text: '📖 Select Surah', callback_data: 'surah' },
      { text: "❓ Help", callback_data: 'command' },
      { text: "🔎 About", url: 'https://t.me/nekozux' }
    ];
    inlineKeyboard.row(...languageButton);
    await ctx.reply(translatedWelcomeText.translation, { reply_markup: inlineKeyboard });
  }
});

async function ifusernotlanguage(ctx) {
  const rawr = 'Pilih bahasa terlebih dahulu!. Klik tombol dibawah untuk memilih bahasa'
  const textkosong = await translate(rawr, 'id', 'en');
  const cinta = new InlineKeyboard();
  const aw = { text: "Select Language", callback_data: 'pilih_language' };
  cinta.row(aw);
  await bot.api.sendMessage(ctx.chat.id, textkosong.translation, { reply_markup: cinta });
}

bot.callbackQuery('setmh', async (ctx) => {
  const response = await axios.get('https://api.aladhan.com/v1/methods');
  const methods = response.data.data;
  const buttons = Object.values(methods)
    .filter(method => method.name) // Ensure the method has a name
    .map(method => ({ text: method.name, callback_data: `method_${method.id}` }));

  const inlineKeyboard = new InlineKeyboard();

  for (let i = 0; i < buttons.length; i += 3) {
    inlineKeyboard.row(...buttons.slice(i, i + 3));
  }

  await bot.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, 'Please select a date calculation method:', { reply_markup: inlineKeyboard });
});

// Callback query handler for selecting language
bot.callbackQuery('pilih_language', async (ctx) => {
  const inlineKeyboard = new InlineKeyboard();
  const languages = [
    { name: 'English', code: 'en' },
    { name: 'French', code: 'fr' },
    { name: 'Spanish', code: 'es' },
    { name: 'Indonesian', code: 'id' },
    { name: 'Hebrew', code: 'he' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Dutch', code: 'nl' },
    { name: 'Russian', code: 'ru' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Vietnamese', code: 'vi' },
    { name: 'Portugese', code: 'pt-PT' },
    { name: 'Malay', code: 'ms' },
    { name: 'Thai', code: 'th' },
    { name: 'Germany', code: 'de' }
  ];
  let rowButtons = [];
  languages.forEach((language, index) => {
    const languageButton = { text: language.name, callback_data: `language_${language.code}` };
    rowButtons.push(languageButton);

    // When 3 buttons have been added or it's the last language, add the row to the keyboard
    if (rowButtons.length === 3 || index === languages.length - 1) {
      inlineKeyboard.row(...rowButtons);
      rowButtons = [];  // Reset the rowButtons for the next row
    }
  });

  await ctx.editMessageText('What language you prefer?:', { reply_markup: inlineKeyboard });
});

bot.callbackQuery('pilih_language', async (ctx) => {
  const inlineKeyboard = new InlineKeyboard();
  const languages = [
    { name: 'English', code: 'en' },
    { name: 'French', code: 'fr' },
    { name: 'Spanish', code: 'es' },
    { name: 'Indonesian', code: 'id' },
    { name: 'Hebrew', code: 'he' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Dutch', code: 'nl' },
    { name: 'Russian', code: 'ru' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Vietnamese', code: 'vi' },
    { name: 'Portugese', code: 'pt-PT' },
    { name: 'Malay', code: 'ms' },
    { name: 'Thai', code: 'th' },
    { name: 'Germany', code: 'de' }
  ];

  let rowButtons = [];
  languages.forEach((language, index) => {
    const languageButton = { text: language.name, callback_data: `language_${language.code}` };
    rowButtons.push(languageButton);

    // When 3 buttons have been added or it's the last language, add the row to the keyboard
    if (rowButtons.length === 3 || index === languages.length - 1) {
      inlineKeyboard.row(...rowButtons);
      rowButtons = [];  // Reset the rowButtons for the next row
    }
  });

  await ctx.editMessageText('What language you prefer?:', { reply_markup: inlineKeyboard });
});

// Callback query handler for changing language
bot.callbackQuery(/language_(\w+)/, async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.match[1] || '';

  if (ctx.session.language) {
    await ctx.answerCallbackQuery(`Succesfully changes translated text into: ${ctx.session.language}.`);
  }
});

bot.callbackQuery("command", async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  if (!ctx.session.language) {
      ifusernotlanguage(ctx);
  } else {
    const text = '🎉 Woohoo! You\'ve discovered the command center! 🎉\n\nHere are the features you can use with this bot:\n\n' +
      '📖 /surah - Just type this and I\'ll send you a button with the Surah number. Easy peasy! 🍋\nImportant!: You need to set your language before use this command\n' +
      '📚 /h - Type this and look! You\'ll get a button with the Hadis writer\'s name. 🖋️\nImportant!: You need to set your language before use this command\n' +
      '🕹️ /sh - Want to know the prayer times for your location? Just type this command and follow the instructions. 🕌\nImportant!: You need use command /setmh for your calculation methods\n' +
      '🔍 You can also use inline queries to search for Surahs and prayer times. Just type @nekoislbot\n for use search quran ayah and surah you can type qr (surah number) (ayahs number) (language code default is en)\n and also if you want to search prayer times from your query you can type sh (city) (country) (methods. this is optional default is 3) 🚀\n\n' +
      '🕌 Also you can search prayer time with just send you location to bot!'
      'Looking for more bots? Check out @nekozux!';
    const translatedText = await translate(text, 'en', ctx.session.language);
    const inlineKeyboard = new InlineKeyboard();
    const Button = [
      { text: "🔙 Back", callback_data: 'h' },
      { text: "🔎 About", url: 'https://t.me/nekozux' }
    ];
    inlineKeyboard.row(...Button);
    await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, translatedText.translation, { reply_markup: inlineKeyboard });
  }
});

bot.command("help", async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  if (!ctx.session.language) {
      ifusernotlanguage(ctx);
  } else {
    const text = '🎉 Woohoo! You\'ve discovered the command center! 🎉\n\nHere are the features you can use with this bot:\n\n' +
      '📖 /surah - Just type this and I\'ll send you a button with the Surah number. Easy peasy! 🍋\nImportant!: You need to set your language before use this command\n' +
      '📚 /h - Type this and look! You\'ll get a button with the Hadis writer\'s name. 🖋️\nImportant!: You need to set your language before use this command\n' +
      '🕹️ /sh - Want to know the prayer times for your location? Just type this command and follow the instructions. 🕌\nImportant!: You need use command /setmh for your calculation methods\n' +
      '🔍 You can also use inline queries to search for Surahs and prayer times. Just type @nekoislbot\n for use search quran ayah and surah you can type qr (surah number) (ayahs number) (language code default is en)\n and also if you want to search prayer times from your query you can type sh (city) (country) (methods. this is optional default is 3) 🚀\n\n' +
      '🕌 Also you can search prayer time with just send you location to bot!'
      'Looking for more bots? Check out @nekozux!';
    const translatedText = await translate(text, 'en', ctx.session.language);
    const inlineKeyboard = new InlineKeyboard();
    const Button = [
      { text: "🔙 Back", callback_data: 'h' },
      { text: "🔎 About", url: 'https://t.me/nekozux' }
    ];
    inlineKeyboard.row(...Button);
    await ctx.api.sendMessage(ctx.chat.id, translatedText.translation, { reply_markup: inlineKeyboard });
  }
});

// Callback query handler for going back
bot.callbackQuery("h", async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  const text = '👋 Assalamualaikum!\nHi there, nice to meet you! 🤗 I am Nekozu Quran And Hadis. 📚 I can help you search for Surah. 🕵️‍♀️ Just select the button below to get started! 🚀';
  const translatedText = await translate(text, 'en', ctx.session.language);
  const inlineKeyboard = new InlineKeyboard();
  const languageButton = [
    { text: "📖 Select Surah", callback_data: 'surah' },
    { text: "❓ Help", callback_data: 'command' },
    { text: "🔎 About", url: 'https://t.me/nekozux' }
  ];
  inlineKeyboard.row(...languageButton);
  await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, translatedText.translation, { reply_markup: inlineKeyboard });
});
// Command handler for "/surah"

bot.callbackQuery('surah', async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  ctx.session.page = ctx.session.page || 0; // Add a page property to the session
  try {
    if (!ctx.session.language) {
        ifusernotlanguage(ctx);
    } else {
      const response = await quranApi.getAllSurah();
      const surahList = response;
      const start = ctx.session.page * 9; // Calculate the start index based on the current page
      const end = start + 9; // Calculate the end index
      let inlineKeyboard = new InlineKeyboard();
      let row = [];
      for (let i = start; i < end && i < surahList.length; i++) {
          const surah = surahList[i];
          row.push({ text: `${surah.number}. ${surah.name.transliteration.en}`, callback_data: `surah_${surah.number}` });
          if (row.length === 3) {
            inlineKeyboard.row(...row);
            row = [];
          }
      }
      // Add any remaining buttons that didn't make up a full row
      if (row.length > 0) {
        inlineKeyboard.row(...row);
      }
      if (ctx.session.page > 0) {
        inlineKeyboard.row({ text: 'Prev', callback_data: 'prev_page' });
      }
      if (end < surahList.length) {
        inlineKeyboard.row({ text: 'Next', callback_data: 'next_page' });
      }
      const transtext = await translate('Select a Surah:', 'en', ctx.session.language);
      await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, transtext.translation, { reply_markup: inlineKeyboard });
    }
  } catch (error) {
      console.log(error)
      ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, 'Error retrieving surah list. Please try again later.');
  }
});

bot.command('surah', async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  ctx.session.page = ctx.session.page || 0; // Add a page property to the session
  try {
    if (!ctx.session.language) {
       ifusernotlanguage(ctx);
    } else {
      const response = await quranApi.getAllSurah();
      const surahList = response;
      const start = ctx.session.page * 9; // Calculate the start index based on the current page
      const end = start + 9; // Calculate the end index
      let inlineKeyboard = new InlineKeyboard();
      let row = [];
      for (let i = start; i < end && i < surahList.length; i++) {
          const surah = surahList[i];
          row.push({ text: `${surah.number}. ${surah.name.transliteration.en}`, callback_data: `surah_${surah.number}` });
          if (row.length === 3) {
            inlineKeyboard.row(...row);
            row = [];
          }
      }
      // Add any remaining buttons that didn't make up a full row
      if (row.length > 0) {
        inlineKeyboard.row(...row);
      }
      if (ctx.session.page > 0) {
        inlineKeyboard.row({ text: 'Prev', callback_data: 'prev_page' });
      }
      if (end < surahList.length) {
        inlineKeyboard.row({ text: 'Next', callback_data: 'next_page' });
      }
      const transtext = await translate('Select a Surah:', 'en', ctx.session.language);
      await ctx.reply(transtext.translation, { reply_markup: inlineKeyboard });
    }
  } catch (error) {
      console.log(error)
      ctx.reply('Error retrieving surah list. Please try again later.');
  }
});

bot.callbackQuery('prev_page', async (ctx) => {
  ctx.session.page--;
  const inlineKeyboard = await generateSurahKeyboard(ctx);
  const text = await translate('Select a Surah:', 'en', ctx.session.language);
  await ctx.editMessageText(text.translation, { reply_markup: inlineKeyboard }); // Edit the message text and reply markup
});

bot.callbackQuery('next_page', async (ctx) => {
  ctx.session.page++;
  const inlineKeyboard = await generateSurahKeyboard(ctx);
  const text = await translate('Select a Surah:', 'en', ctx.session.language);
  await ctx.editMessageText(text.translation, { reply_markup: inlineKeyboard }); // Edit the message text and reply markup
});

async function generateSurahKeyboard(ctx) {
  const response = await quranApi.getAllSurah();
  const surahList = response;
  const start = ctx.session.page * 9; // Calculate the start index based on the current page
  const end = start + 9; // Calculate the end index
  let inlineKeyboard = new InlineKeyboard();
  let row = [];
  for (let i = start; i < end && i < surahList.length; i++) {
      const surah = surahList[i];
      row.push({ text: `${surah.number}. ${surah.name.transliteration.en}`, callback_data: `surah_${surah.number}` });
      if (row.length === 3) {
        inlineKeyboard.row(...row);
        row = [];
      }
  }
  // Add any remaining buttons that didn't make up a full row
  if (row.length > 0) {
    inlineKeyboard.row(...row);
  }
  if (ctx.session.page > 0) {
    inlineKeyboard.row({ text: 'Prev', callback_data: 'prev_page' });
  }
  if (end < surahList.length) {
    inlineKeyboard.row({ text: 'Next', callback_data: 'next_page' });
  }
  return inlineKeyboard;
}

bot.callbackQuery(/surah_(\d+)/, async (ctx) => {
  const surahNumber = ctx.match[1];
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  try {
    if (!ctx.session.language) {
      const rawr = 'Pilih bahasa terlebih dahulu!. Klik tombol dibawah untuk memilih bahasa'
      const textkosong = await translate(rawr, 'id', 'en');
      const cinta = new InlineKeyboard();
      const aw = { text: "Select Language", callback_data: 'pilih_language' };
      cinta.row(aw);
      await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, textkosong.translation, { reply_markup: cinta });
      // ...
    } else {
      // Ask the user if they want the Surah as a text message or as a file
      const inlineKeyboard = new InlineKeyboard();
      inlineKeyboard.row({ text: 'Text', callback_data: `send_text_${surahNumber}` });
      inlineKeyboard.row({ text: 'File', callback_data: `send_file_${surahNumber}` });
    }
    const inlineKeyboard = new InlineKeyboard();
    inlineKeyboard.row(
      { text: 'As A Message', callback_data: `send_text_${surahNumber}` },
      { text: 'As Txt File', callback_data: `send_file_${surahNumber}` }
    );
    const messg = await translate('How would you like to receive the Surah?', 'en', ctx.session.language);
      await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, messg.translation, { reply_markup: inlineKeyboard });
  } catch (error) {
    console.log(error);
    ctx.reply('Error retrieving surah data. Please try again later.');
  }
});

bot.callbackQuery(/send_text_(\d+)/, async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  if (!ctx.session.language) {
     ifusernotlanguage(ctx);
  } else {
    const surahNumber = parseInt(ctx.match[1]);
    const ayahFrom = 1;

    const { message, ayahText, surahNumber: newSurahNumber, ayahFrom: newAyahFrom } = await generateSurahText(surahNumber, ayahFrom, ctx.session.language);

    const inlineKeyboard = new InlineKeyboard();
    inlineKeyboard.row(
      { text: 'Prev', callback_data: `prev_${newSurahNumber}_${newAyahFrom}` },
      { text: 'Audio', callback_data: `audio_${newSurahNumber}_${newAyahFrom}` },
      { text: 'Next', callback_data: `next_${newSurahNumber}_${newAyahFrom}` },
    );

    ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, message, {parse_mode: 'HTML', reply_markup: inlineKeyboard});
  }
});

bot.callbackQuery(/send_tes_(\d+)/, async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  if (!ctx.session.language) {
     ifusernotlanguage(ctx);
  } else {
    const surahNumber = parseInt(ctx.match[1]);
    const ayahFrom = 1;

    const { message, ayahText, surahNumber: newSurahNumber, ayahFrom: newAyahFrom } = await generateSurahText(surahNumber, ayahFrom, ctx.session.language);

    const inlineKeyboard = new InlineKeyboard();
    inlineKeyboard.row(
      { text: 'Prev', callback_data: `prev_${newSurahNumber}_${newAyahFrom}` },
      { text: 'Audio', callback_data: `audio_${newSurahNumber}_${newAyahFrom}` },
      { text: 'Next', callback_data: `next_${newSurahNumber}_${newAyahFrom}` },
    );

    await ctx.api.sendMessage(ctx.chat.id, message, { reply_markup: inlineKeyboard, parse_mode: 'HTML' });
  }
});

bot.callbackQuery(/audio_(\d+)_(\d+)/, async (ctx) => {
  const [, surahNumber, ayahFrom] = ctx.callbackQuery.data.match(/audio_(\d+)_(\d+)/);
  const audios = quranApi.getAyahFromSurah(surahNumber, ayahFrom);
  const audioUrl = audios.audio.primary;
  bot.api.sendAudio(ctx.chat.id, audioUrl);
})

bot.callbackQuery(/^(prev|next)_(\d+)_(\d+)$/, async (ctx) => {
  let [, action, surahNumber, ayahFrom] = ctx.callbackQuery.data.match(/^(prev|next)_(\d+)_(\d+)$/);

  try {
    let surahInfo = await quranApi.getSurah(surahNumber);

    if (action === 'prev') {
      if (ayahFrom > 1) {
        ayahFrom--;
      } else {
        if (surahNumber > 1) {
          surahNumber--;
          surahInfo = await quranApi.getSurah(surahNumber);
          ayahFrom = surahInfo.numberOfVerses;
        } else {
          // If we're at the first Ayah of the 1st Surah, wrap around to the last Ayah of the 114th Surah
          surahNumber = 114;
          surahInfo = await quranApi.getSurah(surahNumber);
          ayahFrom = surahInfo.numberOfVerses;
        }
      }
    } else if (action === 'next') {
      if (ayahFrom < surahInfo.numberOfVerses) {
        ayahFrom++;
      } else {
        if (surahNumber < 114) {
          surahNumber++;
          surahInfo = await quranApi.getSurah(surahNumber);
          ayahFrom = 1;
        } else {
          // If we're at the last Ayah of the 114th Surah, wrap around to the first Ayah of the 1st Surah
          surahNumber = 1;
          surahInfo = await quranApi.getSurah(surahNumber);
          ayahFrom = 1;
        }
      }
    }

    const { message } = await generateSurahText(surahNumber, ayahFrom, ctx.session.language);


    const inlineKeyboard = new InlineKeyboard();
    let buttons = [];
    
    // Only add "Prev" button if not the first surah
    if (surahNumber > 1 || ayahFrom > 1) {
      buttons.push({ text: 'Prev', callback_data: `prev_${surahNumber}_${ayahFrom}` },
      { text: 'Audio', callback_data: `audio_${surahNumber}_${ayahFrom}` });
    }
    
    // Only add "Next" button if not the last surah and last ayah
    if (surahNumber !== 114 || ayahFrom !== surahInfo.numberOfVerses) {
      buttons.push({ text: 'Next', callback_data: `next_${surahNumber}_${ayahFrom}` });
    }
    
    inlineKeyboard.row(...buttons);

    ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, message, { parse_mode: 'HTML', reply_markup: inlineKeyboard });
  } catch (error) {
    console.error('Error fetching ayah:', error);
    // Handle error gracefully
    ctx.api.editMessageText('An error occurred while retrieving the ayah. Please try again later.');
  }
});

async function generateSurahText(surahNumber, ayahFrom, language) {
  try {
    const surahawalan = await quranApi.getSurah(surahNumber);
    const ayah = await quranApi.getAyahFromSurah(surahNumber, ayahFrom);
    const maxMessageLength = 4096;

    let message = `<b>Surah: ${surahawalan.name.transliteration.en} (${surahNumber})\n</b>`;
    let ayahText = '';

    const translatedText = await translate(ayah.translation.id, 'id', language);
    const nomor = ayah.number.inSurah;
    ayahText = `${nomor}.<b>Arabic</b>\n<blockquote>${ayah.text.arab}</blockquote><b>Latin</b>\n<blockquote>${ayah.text.transliteration.en}</blockquote>\n\n<b>Translated</b>\n<blockquote>${translatedText.translation}</blockquote>\n\n`;

    if ((message + ayahText).length > maxMessageLength) {
      ayahText = ayahText.substring(0, maxMessageLength - message.length);
    }

    message += ayahText;

    return { message, ayahText, surahNumber, ayahFrom }; // Return the original variable names
  } catch (error) {
    console.error('Error generating surah text:', error);
    // Handle error gracefully
    return { message: '' };
  }
}

async function getSurahDetails(surahNumber, lang) {
  const surahawalan = await quranApi.getSurah(surahNumber); // Get the Surah
  const bismillah = surahawalan.preBismillah.text.arab;
  const name = surahawalan.name.long;
  const nameeng = surahawalan.name.transliteration.en;
  const verse = surahawalan.verses;

  let versesText = `${name}\n${nameeng}\n${bismillah}\n\n`; // Include Surah name at the top and Bismillah under it

  for (const verses of verse) {
    const translates = await translate(verses.translation.id, null, lang);
    versesText += `${verses.number.inSurah}. ${verses.text.arab}\n${verses.text.transliteration.en}\n${translates.translation}\n\n`;
  }

  return versesText;
}

bot.callbackQuery(/send_file_(\d+)/, async (ctx) => {
  await ctx.answerCallbackQuery('Generating file...');
  const surahNumber = ctx.match[1] ;
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  if (!ctx.session.language) {
     ifusernotlanguage(ctx);
  } else {
    const fileName = `surah_${surahNumber}_${ctx.from.username}.txt`;
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) {
      // If the file does not exist, generate the Surah text and write it to a file
      const surahText = await getSurahDetails(surahNumber, ctx.session.language);
      fs.writeFileSync(filePath, surahText);
    }
    // Send the file to the user
    const file = new InputFile(filePath);
    await ctx.replyWithChatAction("upload_document")
    const Text = await translate('Here is the Surah as a file:', 'en', ctx.session.language);
    const replymark = new InlineKeyboard();
    replymark.row({ text: 'As A Message', callback_data: `send_tes_${surahNumber}` });
    await ctx.replyWithDocument(file, { caption: Text.translation, reply_markup: replymark });
  }
});

bot.command('setmh', async (ctx) => {
  const response = await axios.get('https://api.aladhan.com/v1/methods');
  const methods = response.data.data;
  const buttons = Object.values(methods)
    .filter(method => method.name) // Ensure the method has a name
    .map(method => ({ text: method.name, callback_data: `method_${method.id}` }));

  const inlineKeyboard = new InlineKeyboard();

  for (let i = 0; i < buttons.length; i += 3) {
    inlineKeyboard.row(...buttons.slice(i, i + 3));
  }

  await bot.api.sendMessage(ctx.chat.id, 'Please select a date calculation method:', { reply_markup: inlineKeyboard });
});


bot.callbackQuery(/method_(\w+)/, (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.method = ctx.match[1] || '';
  ctx.answerCallbackQuery(`Selected method: ${ctx.match[1]}`);
});

bot.command('sh', async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.method = ctx.session.method || '';
  if (!ctx.session.method) {
    ctx.reply('Please select a method first. /setmh');
    return;
  }
  const words = ctx.message.text.split(' ');
  const city = words.slice(-1).join(' ');
  const country = words.slice(1, -1).join(' ');
  const url = `https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${ctx.session.method}&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`;

  try {
    const response = await axios.get(url);
    const times = response.data.data;
    if (!times) {
      console.log('Error: Could not retrieve prayer times');
      ctx.reply(`Sorry, I couldn't find prayer times for ${city}, ${country}. Please make sure the city and country names are correct. try like /sh Malaysia Penang`);
      return;
    }

    const timezone = times[0].meta.timezone;
    const now = new Date();
    const options = { timeZone: timezone, hour12: false };
    const currentDate = now.toLocaleDateString('en-US', options);
    const [currentMonth, currentDay, currentYear] = currentDate.split('/').map(Number);

    let prayerTimesMessage = '';

    for (let i = 0; i < 7; i++) {
      const todayTimes = times.find(time => {
        const [day, month, year] = time.date.gregorian.date.split('-').map(Number);
        return day === currentDay + i && month === currentMonth && year === currentYear;
      });
    
      if (!todayTimes) {
        if (i === 0) {
          prayerTimesMessage += `Sorry, I couldn't find prayer times for today in ${city}, ${country} with the related calculation methods. Maybe you can change your Calculation methods?. Or try like /sh Malaysia Penang\n`;
        }
        break; // If there are no prayer times for the day, break the loop
      }
    
      prayerTimesMessage += `Prayer times for ${city} ${country} on ${todayTimes.date.readable}:\n\n${todayTimes.timings.Fajr} - Fajr\n\n${todayTimes.timings.Sunrise} - Sunrise\n\n${todayTimes.timings.Dhuhr} - Dhuhr\n\n${todayTimes.timings.Asr} - Asr\n\n${todayTimes.timings.Sunset} - Sunset\n\n${todayTimes.timings.Maghrib} - Maghrib\n\n${todayTimes.timings.Isha} - Isha\n\nTimezone: ${todayTimes.meta.timezone}\n\nWeekday: ${todayTimes.date.gregorian.weekday.en}\n\n`;
    }
    
    ctx.reply(prayerTimesMessage);
  } catch (error) {
    console.error(error);
    ctx.reply(`Sorry, I couldn't find prayer times for ${city}, ${country}. Please make sure the city and country names are correct. Or maybe have a error at system. Please wait for a while and try again`);
  }
});

bot.on('message:location', async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.method = ctx.session.method || '';
  if (!ctx.session.method) {
    ctx.reply('Please select a method first. /setmh');
    return;
  }

  const { latitude, longitude } = ctx.message.location;
  const now = new Date();
  const url = `https://api.aladhan.com/v1/calendar/${now.getFullYear()}/${now.getMonth() + 1}?latitude=${latitude}&longitude=${longitude}&method=${ctx.session.method}`;

  try {
    const response = await axios.get(url);
    const times = response.data.data;
    if (!times) {
      console.log('Error: Could not retrieve prayer times');
      ctx.reply(`Sorry, I couldn't find prayer times for ${city}, ${country}. Please make sure the city and country names are correct. try like /sh Malaysia Penang`);
      return;
    }

    const timezone = times[0].meta.timezone;
    const now = new Date();
    const options = { timeZone: timezone, hour12: false };
    const currentDate = now.toLocaleDateString('en-US', options);
    const [currentMonth, currentDay, currentYear] = currentDate.split('/').map(Number);

    let prayerTimesMessage = '';

    for (let i = 0; i < 7; i++) {
      const todayTimes = times.find(time => {
        const [day, month, year] = time.date.gregorian.date.split('-').map(Number);
        return day === currentDay + i && month === currentMonth && year === currentYear;
      });
    
      if (!todayTimes) {
        if (i === 0) {
          prayerTimesMessage += `Sorry, I couldn't find prayer times for today in Your location  with the related calculation methods. Maybe you can change your Calculation methods?. Or try like /sh Malaysia Penang\n`;
        }
        break; // If there are no prayer times for the day, break the loop
      }
    
      prayerTimesMessage += `Prayer times for your location on ${todayTimes.date.readable}:\n\n${todayTimes.timings.Fajr} - Fajr\n\n${todayTimes.timings.Sunrise} - Sunrise\n\n${todayTimes.timings.Dhuhr} - Dhuhr\n\n${todayTimes.timings.Asr} - Asr\n\n${todayTimes.timings.Sunset} - Sunset\n\n${todayTimes.timings.Maghrib} - Maghrib\n\n${todayTimes.timings.Isha} - Isha\n\nTimezone: ${todayTimes.meta.timezone}\n\nWeekday: ${todayTimes.date.gregorian.weekday.en}\n\n`;
    }
    
    ctx.reply(prayerTimesMessage);
  } catch (error) {
    console.error(error);
    ctx.reply(`Sorry, I couldn't find prayer times for ${city}, ${country}. Please make sure the city and country names are correct. Or maybe have a error at system. Please wait for a while and try again`);
  }
});

bot.on('inline_query', async (ctx) => {
  try {
    const query = ctx.inlineQuery.query;

    // Quran search
    if (query.startsWith('qr')) {
      const [qr, surahNumber, ayahFrom, language] = query.split(' ');

      const surahawalan = await quranApi.getSurah(surahNumber); 
      const name = surahawalan.name.transliteration.en;

      const result = await generateSurahText(surahNumber, ayahFrom, language || 'en');

      if (!result || !result.message) {
        ctx.answerInlineQuery([
          {
            type: 'article',
            id: 'query',
            title: 'Warning',
            input_message_content: {
              message_text: 'Surah, Ayah or Language not found',
              parse_mode: 'HTML'
            }
          }
        ]);
      } else {
        const { message, surahName, surahNumber: newSurahNumber, ayahFrom: newAyahFrom } = result;

        const inlineKeyboard = new InlineKeyboard();
        inlineKeyboard.row(
          { text: 'Try another surah?', switch_inline_query: "qr 4 25 my" }, 
          { text: 'Channel', url: `https://t.me/nekozux` }
        );

        ctx.answerInlineQuery([
          {
            type: 'article',
            id: 'query',
            title: `Surah: ${name}`,
            input_message_content: {
              message_text: message,
              parse_mode: 'HTML'
            },
            reply_markup: inlineKeyboard
          }
        ]);
      }

    // Prayer times search
    } else if (query.startsWith('sh')) {
      const [sh, city, country, methods] = query.split(' ');

      const method = methods || '20';
      const url = `https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;

      if(!query)
        return; 

      const response = await axios.get(url);
      const times = response.data.data;
      if (!times) {
        console.log('Error: Could not retrieve prayer times');
        ctx.answerInlineQuery([], { switch_pm_text: `Sorry, I couldn't find prayer times for ${city}, ${country}. Please make sure the city and country names are correct.`, switch_pm_parameter: 'start' });
        return;
      }

      const timezone = times[0].meta.timezone;
      const now = new Date();
      const options = { timeZone: timezone, hour12: false };
      const currentDate = now.toLocaleDateString('en-US', options);

      const [currentMonth, currentDay, currentYear] = currentDate.split('/').map(Number);

      const todayTimes = times.find(time => {
        const [day, month, year] = time.date.gregorian.date.split('-').map(Number);
        return day === currentDay && month === currentMonth && year === currentYear;
      });

      if (!todayTimes) {
        ctx.answerInlineQuery([], { switch_pm_text: `Sorry, I couldn't find prayer times for today in ${city}, ${country} with the related calculation methods. maybe you can change your Calculation methods?.`, switch_pm_parameter: 'start' });
        return;
      }

      const results = [{
        type: 'article',
        id: 'prayer_times',
        title: `Prayer times for ${city} ${country}`,
        description: `Date: ${todayTimes.date.readable}`,
        input_message_content: {
          message_text: `Prayer times for ${city} ${country}\n\nDate: ${todayTimes.date.readable}:\n\n${todayTimes.timings.Fajr} - Fajr\n\n${todayTimes.timings.Sunrise} - Sunrise\n\n${todayTimes.timings.Dhuhr} - Dhuhr\n\n${todayTimes.timings.Asr} - Asr\n\n${todayTimes.timings.Sunset} - Sunset\n\n${todayTimes.timings.Maghrib} - Maghrib\n\n${todayTimes.timings.Isha} - Isha\n\nTimezone: ${todayTimes.meta.timezone}\n\nWeekday: ${todayTimes.date.gregorian.weekday.en}`
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Channel', url: `https://t.me/nekozux` }
            ]
          ]
        }
      }];

      ctx.answerInlineQuery(results);
    } else {
      // Handle invalid query
      ctx.answerInlineQuery([
        {
          type: 'article',
          id: 'query',
          title: 'Please fill the query like qr or sh',
          input_message_content: {
            message_text: 'Invalid query. Please use the correct format. Like qr or sh. For more information, please click the button below.',
            parse_mode: 'HTML',
          },
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Help', url: 'https://t.me/nekoislbot?start=start' }
              ]
            ]
          }
        }
      ]);
    }
  } catch (error) {
    console.error('Error handling inline query:', error);
    // Handle error gracefully
    ctx.answerInlineQuery([
      {
        type: 'article',
        id: 'query',
        title: 'Error',
        input_message_content: {
          message_text: 'An error occurred while processing your request. Please try again later.',
          parse_mode: 'HTML'
        }
      }
    ]);
  }
});  
// Command handler for "/hadis"
bot.command('h', async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.language = ctx.session.language || '';
  try {
    const data = await HadithLibrary.index();
    let inlineKeyboard = new InlineKeyboard();
    data.forEach(book => {
      inlineKeyboard.row({ text: `${book.name} (${book.available})`, callback_data: `hadis_${book.id}` });
    });
    await ctx.reply('Please select a Hadith book:', { reply_markup: inlineKeyboard });
  } catch (error) {
    console.log(error);
    await ctx.reply('Error retrieving Hadith books. Please try again later.');
  }
});

bot.callbackQuery(/hadis_(\S+)/, async (ctx) => {
  const fullBookId = ctx.match[1];
  ctx.session = ctx.session || {};
  ctx.session.selectedBookId = fullBookId;
  await ctx.reply('Please type the number of the Hadith:');
});

bot.on('message', async (ctx) => {
  const selectedBookId = ctx.session.selectedBookId;
  if (!selectedBookId) return;
  ctx.session.selectedBookId = null;
  ctx.session = ctx.session || {};                      ctx.session.language = ctx.session.language || 'en';
  const hadithNumber = ctx.message.text.trim();
  if (isNaN(hadithNumber)) {
    await ctx.reply('Hadith number must be a valid number.');
    return;
  }
  try {
    const hadithData = await HadithLibrary.getByNumber(selectedBookId, hadithNumber);
    if (hadithData) {
      const arabicText = hadithData.contents.arab || 'Arabic text not available';
      const translationText = await translate(hadithData.contents.id, null, ctx.session.language)
      const message = `Hadith found:\n\n${arabicText}\n\n${translationText.translation}`;
      await ctx.reply(message);
    } else {
      await ctx.reply('Hadith number is not valid. Maybe the hadith page is not added.');
    }
  } catch (error) {
    console.log(error);
    await ctx.reply('No hadith available with that number. Please input valid number');
  }
});

bot.start();
bot.catch((err, ctx) => {
  console.error(`Error for`, err);
})
