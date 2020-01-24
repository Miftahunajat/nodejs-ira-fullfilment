const { Payload } = require("dialogflow-fulfillment");
const functions = require("firebase-functions");
const cors = require("cors")({
  origin: true
});
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");
const dateformat = require("dateformat");

const { Card, Suggestion } = require("dialogflow-fulfillment");

// admin.initializeApp();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://newagent-vlmgvi.firebaseio.com"
});

const { SessionsClient } = require("dialogflow");

exports.dialogflowGateway = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const { queryInput, sessionId } = request.body;

    const sessionClient = new SessionsClient({
      credentials: serviceAccount
    });
    const session = sessionClient.sessionPath("newagent-vlmgvi", sessionId);

    const responses = await sessionClient.detectIntent({
      session,
      queryInput
    });

    const result = responses[0].queryResult;

    response.send(result);
  });
});

const { WebhookClient } = require("dialogflow-fulfillment");

exports.dialogflowWebhook = functions.https.onRequest(
  async (request, response) => {
    const agent = new WebhookClient({
      request,
      response
    });

    const result = request.body.queryResult;

    async function userOnboardingHandler(agent) {
      // Do backend stuff here
      agent.requestSource = agent.PLATFORM_UNSPECIFIED;
      const db = admin.firestore();
      const profile = db.collection("users").doc("jeffd23");

      const { hari } = result.parameters;

      agent.add(
        new Card({
          title: `Title: this is a card title`,
          imageUrl:
            "https://chordify.net/pages/wp-content/uploads/2019/08/random-chiasso-1024x683.png",
          text: `This is the body text of a card.  You can even use line\n  breaks and emoji! `,
          buttonText: "This is a button",
          buttonUrl: "https://assistant.google.com/"
        })
      );
      await profile.set({
        hari
      });
      agent.add(`Welcome aboard my friend!`);
    }

    // LINE CUTI

    async function akuSakitIntent(agent) {
      // Do backend stuff here

      agent.add(
        "Wah Ira turut sedih mendengarnya. Apakah anda ingin mengajukan cuti sakit untuk hari ini ?"
      );
      agent.add(new Suggestion("Ajukan Cuti Sakit"));
    }

    async function lihatJadwalMeetingIntent(agent) {
      //Ambil dari DB
      agent.add("Jadwal Meeting Anda adalah" + "")
      agent.add("Apakah ada yang bisa Ira bantu lagi?");
    }

    async function ajukanCutiSakit(agent) {
      // Do backend stuff here
      // const db = admin.firestore();
      // const profile = db.collection('users').doc('jeffd23');
      const datetime = new Date();

      // await profile.set({
      //   name,
      //   color
      // })

      agent.add("Apakah anda ingin menambahkan hari ini ke jatah cuti anda ? ");
      agent.add(new Suggestion("Iya"));
      agent.add(new Suggestion("Tidak"));
    }

    async function konfirmasiCutiSakit(agent) {
      const datetime = new Date();
      // agent.requestSource = agent.PLATFORM_UNSPECIFIED;

      options = ["papa", "pipi"];
      options.map(option => agent.add(new Suggestion(option)));
      let payload = new Payload(agent.LINE, {
        text:
          "Konfirmasi cuti sakit anda pada " +
          datetime +
          " sudah berhasil dibuat",
        quick_replies: options.slice(0, 5).map(option => {
          return {
            content_type: "text",
            title: option,
            payload: option
          };
        })
      });
      agent.add(payload);
    }

    async function konfirmasiBuatMeetingIntent(agent) {
      const datetime = new Date();
      // agent.requestSource = agent.PLATFORM_UNSPECIFIED;
      agent.add(
        ruangan +
        " untuk jam " +
        dateformat(time["startTime"], "H:mm") +
        "sampai jam " +
        dateformat(time["endTime"], "HH:mm") +
        " berhasil dipesan untuk meeting Anda. Terimakasih."
      );
      agent.add(payload);
    }

    async function batalBuatMeetingIntent(agent) {
      const datetime = new Date();
      // agent.requestSource = agent.PLATFORM_UNSPECIFIED;
      agent.add("Baik, Anda bisa membooking ruangan lagi nanti. Apakah ada yang bisa Ira bantu lagi?");
      agent.add(payload);
    }

    async function pengajuanCutiIntent(agent) {
      agent.add(
        "Apakah anda ingin mengajukan untuk cuti tahunan atau cuti Sakit ?"
      );
      agent.add(new Suggestion("Pengajuan Cuti Tahunan"));
      agent.add(new Suggestion("Pengajuan Cuti Sakit"));
    }

    async function ajukanCutiTahunanIntent(agent) {
      const { date, number } = result.parameters;
      agent.add(
        "Apakah anda ingin menandai " +
          formatDate(date) +
          " selama " +
          number +
          " sebagai aktifitas cuti anda"
      );
      agent.add(new Suggestion("Iya"));
      agent.add(new Suggestion("Tidak"));
    }

    async function konfirmasiPengajuanCutiTahunanIntent(agent) {
      const { date, number } = result.parameters;
      agent.add(
        "Pengajuan cuti anda pada  " +
          formatDate(date) +
          " selama " +
          number +
          " telah ditambahkan ke aktifitas cuti anda. Terimakasih."
      );
    }

    async function batalPengajuanCutiTahunanIntent(agent) {
      agent.add("Baik, pengajuan cuti Anda tidak jadi ditambahkan.");
      agent.add("Apakah ada yang bisa Ira bantu lagi?");
    }

    async function cekAbsensiIntent(agent) {
      const datetime = new Date();
      /*
      CARD
      header @nama
      body @jumlahmasuk
      body @jumlahcuti
      footer @saldocuti 
      */
      agent.add(
        "Berikut adalah absensi anda bulan " + dateformat(datetime, "mmmm")
      );
      agent.add("Apakah ada yang bisa dibantu lagi? ");
    }

    async function buatMeetingFormattedIntent(agent) {
      const datetime = new Date();
      agent.add("Ira cek dulu ketersediaan ruangannya");
      if (available) {
        agent.add(
          ruangan +
            " untuk jam " +
            dateformat(time["startTime"], "H:mm") +
            "sampai jam " +
            dateformat(time["endTime"], "HH:mm") +
            " tersedia"
        );
        agent.add("Ingin membooking sekarang ?");
        agent.add(new Suggestion("Iya"));
        agent.add(new Suggestion("Nanti Saja"));
      } else {
        agent.add("Maaf " + ruangan + " untuk jam " + time + " belum tersedia");
        agent.add("Apakah ada yang bisa dibantu lagi ? ");
      }
    }

    async function buatMeetingIntent(agent) {
      agent.add("Silahkan ajukan permintaan meeting dengan format sebagai berikut: [Meeting - Ruangan - Waktu - Jumlah Peserta Meeting] Contoh : [Meeting - Ruang C102 - Jam 14.00-16.00 - 10 orang]");
    }

    async function cekJadwalInterviewIntent(agent) {
      const { number } = result.parameters;

      //Ambil dari DB
      agent.add("Jadwal interview ID Pelamar" + number + "adalah" + "");
    }

    async function cekStatusLamaranIntent(agent) {
      const { number } = result.parameters;

      //Ambil dari DB
      agent.add("Status lamaran dari ID Pelamar" + number + ": " + "");
    }

    async function cekGajiIntent(agent) {
      //Ambil dari DB
      agent.add("Berikut ini adalah rincian gaji Anda pada bulan yang diminta" + "");
      agent.add("Apakah ada yang bisa dibantu lagi? ");
    }

    async function klaimIntent(agent) {
      agent.add(new Suggestion("Klaim Asuransi Kesehatan"));
      agent.add(new Suggestion("Klaim Biaya Perjalanan"));
      agent.add(new Suggestion("Lainnya"));
      //OCR
      agent.add("Baiklah permintaan klaim anda sedang di proses.Boleh minta foto untuk klaim nya?");
    }

    async function klaimIntent(agent) {
      //Ambil dari DB
      agent.add("Baiklah permintaan klaim anda sedang di proses.Boleh minta foto untuk klaim nya?");
    }

    async function hitungPayrollBulananIntent(agent) {
      //Ambil dari DB
      /*CARD LIST PAYROLL BULANAN
      @nama
      @gaji 
      */
      agent.add("Apakah ada yang bisa dibantu lagi?");
    }

    async function hitungPayrollPeroranganIntent(agent) {
      const { number } = result.parameters;
      
      //Ambil dari DB
      /*CARD LIST PAYROLL PERORANGAN
      header@nama
      body  @gajipokok
            @tunjangankesehatan
            @uangmakan
      footer@total
      */
      agent.add("Apakah ada yang bisa dibantu lagi?");
    }

    async function cekLowonganIntent(agent) {
      /*
      CARD LIST DAFTAR LOWONGAN 
      @Jabatan/Posisi
      @Deskripsi
      @Lokasi
      */
      //Ambil dari DB
      agent.add("Berikut ini adalah lowongan yang tersedia saat ini" + "");
      agent.add("Apakah ada yang bisa dibantu lagi? ");
    }

    function formatDate(date) {
      return dateformat(date, "dd mmmm");
    }

    let intentMap = new Map();
    intentMap.set("lihat Cuti Intent", userOnboardingHandler);
    intentMap.set("Aku Sakit Intent", akuSakitIntent);
    intentMap.set("Ajukan Cuti Sakit", ajukanCutiSakit);
    intentMap.set("Ajukan Cuti Sakit - yes", konfirmasiCutiSakit);
    intentMap.set("Pengajuan Cuti Intent", pengajuanCutiIntent);
    intentMap.set("Ajukan Cuti Tahunan Intent", ajukanCutiTahunanIntent);
    intentMap.set("Ajukan Cuti Tahunan Intent - yes", konfirmasiPengajuanCutiTahunanIntent);
    intentMap.set("Ajukan Cuti Tahunan Intent - no", batalPengajuanCutiTahunanIntent);
    intentMap.set("Cek Absensi Intent", cekAbsensiIntent);
    intentMap.set("Buat Meeting Intent", buatMeetingIntent);
    intentMap.set("Buat Meeting-Formatted Intent", buatMeetingFormattedIntent);
    intentMap.set("Buat Meeting-Formatted Intent - yes", konfirmasiBuatMeetingIntent);
    intentMap.set("Buat Meeting-Formatted Intent - no", batalBuatMeetingIntent);
    intentMap.set("Lihat Jadwal Meeting Intent", lihatJadwalMeetingIntent);
    intentMap.set("Cek Jadwal Interview Intent", cekJadwalInterviewIntent);
    intentMap.set("Cek Status Lamaran Intent", cekStatusLamaranIntent);
    intentMap.set("Cek Gaji Intent", cekGajiIntent);
    intentMap.set("Cek Lowongan Intent", cekLowonganIntent);
    intentMap.set("Hitung Payroll Bulanan", hitungPayrollBulananIntent);
    intentMap.set("Hitung Payroll Perorangan Intent", hitungPayrollPeroranganIntent);
    intentMap.set("Klaim Intent", klaimIntent);

    agent.handleRequest(intentMap);
  }
);
