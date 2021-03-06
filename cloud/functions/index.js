const functions = require('firebase-functions');
const moment = require('moment');
require('moment-timezone');

const xlsx = require('xlsx');
const admin = require('firebase-admin');
const db = admin.initializeApp();

//  TODO: 2020년 3월 전까지 node 버전 10이상으로 업데이트 해야함. => 현재 deprecated 됨.
function getSeoulTimezoneDateFormat(format) {
  // format을 통해 특정 String으로 반환할수 있다.
  if(format) {
    return moment().tz("Asia/Seoul").format(format)
  } else {
    return moment().tz("Asia/Seoul").format();
  }
}

/**
 * 매일 0시 0분에 오늘의 성경퀴즈와, 오늘의 말씀을 업데이트하는 cron function 이다.
 * 0시 0분에 정확히 실행되지는 않으며 15초 정도의 딜레이가 있음
 * 엑셀파일에서 데이터를 파싱한뒤 firestore의 데이터를 갱신한다.
 * @type {CloudFunction<unknown>}
 */
exports.scheduledFunctionCrontab
  = functions.pubsub.schedule('51 0 * * *')
  // = functions.pubsub.schedule('11 17 * * *') // min, hour, day of month, month, day of week
  .timeZone('Asia/Seoul')
  .onRun((context) => {
    console.log('매일 오전 0시 0분에 시행됨 (한국 기준)');


    // 오늘의 퀴즈 업데이트
    const updateTodayQuiz = () => {
      // 1. xlsx에서 '성경문제' 시트를 얻어옴.
      const bibleQuiz = xlsx.readFile('xlsx/today_quiz_deploy.xlsx');
      const bibleSheet = bibleQuiz.Sheets.성경문제;

      // 2. '성경문제' 시트를 json으로 치환
      const bibleRecordsJson = xlsx.utils.sheet_to_json(bibleSheet);

      // 3. 오늘의 날짜에 해당하는 성경 구절 5개에 대한 정보를 하나의 JSON array로 저장함.
      const todayQuizArray = bibleRecordsJson.filter((item, index) => {
        const todayDateString = getSeoulTimezoneDateFormat('YYYY.MM.DD');
        return item.date === todayDateString;
      });

      const todayQuizArrayJson = {quizData: todayQuizArray};
      const todayDateString = getSeoulTimezoneDateFormat('YYYY-MM-DD');

      db.firestore().collection('todayQuiz').doc(todayDateString).set(todayQuizArrayJson).then(() => {
        console.log('오늘의 퀴즈 업데이트 완료');
      }).catch(error => {
        console.log('error occured' + error.message);
      });
    };
    updateTodayQuiz();


    // 오늘의 성경 구절 업데이트
    const updateTodayVerse = () => {
      // 1. xlsx에서 '오늘의성경' 시트를 얻어옴.
      const todayVerse = xlsx.readFile('xlsx/today_verse_deploy.xlsx');
      const todayVerseSheet = todayVerse.Sheets.오늘의구절;

      // 2. '오늘의구절' 시트를 json으로 치환
      const todayVerseJson = xlsx.utils.sheet_to_json(todayVerseSheet);

      // 3. 오늘의 구절에 해당하는 성경 구절 1개에 대한 정보를 하나의 JSON array로 저장함.
      const todayVerseArray = todayVerseJson.filter((item, index) => {
        const todayDateString = getSeoulTimezoneDateFormat('YYYY.MM.DD');
        return item.date === todayDateString;
      });

      // 4. 현재 todayVerseArray는 배열이므로 배열의 첫번째 데이터를 입력합니다.
      const todayVerseData = todayVerseArray[0];
      const todayDateString = getSeoulTimezoneDateFormat('YYYY-MM-DD');

      db.firestore().collection('todayVerse').doc(todayDateString).set(todayVerseData).then(() => {
        console.log('오늘의 성경구절 업데이트 완료');
      }).catch(error => {
        console.log('error 발생' + error.message);
      })
    };

    updateTodayVerse()
  });


// JSON Array 저장 테스트
exports.testFirestore = functions.https.onRequest((request, response) => {
  const testBibleArrayJson = {
    quizData: [
      {
        date: '2020.05.10',
        quizVerse: '욥기 3장 4절',
        quizSentence: '﻿그 날이 캄캄하였었더라면, 하나님이 위에서 돌아보지 마셨더라면, 빛도 그 날을 비취지 말았었더라면,',
        quizWord: '빛',
      },
      {
        date: '2020.05.10',
        quizVerse: '에스겔 6장 7절',
        quizSentence: '﻿또 너희 중에서 살륙을 당하여 엎드러지게 하여 너희로 나를 여호와인 줄 알게 하려 함이니라',
        quizWord: '여호와',
      },
      {
        date: '2020.05.10',
        quizVerse: '역대하 6장 10절',
        quizSentence:
          '﻿이제 여호와께서 말씀하신 대로 이루시도다 내가 여호와의 허하신 대로 내 부친 다윗을 대신하여 일어나서 이스라엘 위에 앉고 이스라엘 하나님 여호와의 이름을 위하여 전을 건축하고',
        quizWord: '이스라엘',
      },
      {
        date: '2020.05.10',
        quizVerse: '빌레몬서 1장 7절',
        quizSentence: '﻿형제여 성도들의 마음이 너로 말미암아 평안함을 얻었으니 내가 너의 사랑으로 많은 기쁨과 위로를 얻었노라',
        quizWord: '평안함',
      },
      {
        date: '2020.05.10',
        quizVerse: '유다서 1장 12절',
        quizSentence:
          '﻿저희는 기탄 없이 너희와 함께 먹으니 너희 애찬의 암초요 자기 몸만 기르는 목자요 바람에 불려가는 물 없는 구름이요 죽고 또 죽어 뿌리까지 뽑힌 열매 없는 가을 나무요',
        quizWord: '목자',
      },
    ],
  };

  db.firestore().collection('todayQuiz').doc('2020-05-05').set(testBibleArrayJson).then(() => {
    response.send('testBible Data updated');
  }).catch(error => {
    response.send('error occured' + error.message);
  });

});









