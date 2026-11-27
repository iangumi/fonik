# Baca Ceria — Fonik Bahasa Indonesia

Baca Ceria adalah permainan belajar membaca untuk anak yang baru mulai mengenal bunyi huruf dan suku kata dalam Bahasa Indonesia. Anak bisa mendengarkan contoh, menyusun kata, dan mencocokkan bacaan dengan gambar.

**[Mainkan Baca Ceria](https://iangumi.github.io/fonik/)**

## Cara bermain

Pilih tingkat **Pemula** atau **Lanjutan**, lalu pilih aktivitas. Nama aktivitas dibacakan saat dipilih jika suara aktif.

| Aktivitas | Latihan |
| --- | --- |
| **Kenal Bunyi** | Ketuk huruf atau suku kata untuk mendengar bunyinya. |
| **Dengar & Pilih** | Dengarkan bunyi, lalu pilih suku kata yang sesuai. |
| **Susun Kata** | Urutkan potongan suku kata hingga membentuk kata. |
| **Baca Gambar** | Baca kata yang tampil, lalu pilih gambar yang cocok. |
| **Berhitung** | Pilih jawaban untuk penjumlahan hingga 10. Tingkat Lanjutan juga berisi pengurangan. Tekan **Dengarkan soal** untuk mendengar pertanyaan dalam Bahasa Indonesia. |
| **Hitung Gambar** | Ketuk gambar satu per satu dan pilih jumlahnya. Pemula menghitung 1–5 gambar dan Lanjutan hingga 10. Tekan **Dengarkan soal** untuk mendengar nama benda yang dihitung. |
| **Tebak Gambar** | Lihat satu foto, lalu ketuk salah satu dari tiga kata. Setiap kata dibacakan saat disentuh. |

Setiap sesi reguler berisi lima soal. Soal dan pilihan jawaban diacak, dan beberapa kata punya variasi gambar. Jawaban yang benar menambah bintang. Pilih **Sesi baru** untuk memulai latihan lagi.

**Latihan Lagi** muncul setelah sesi **Dengar & Pilih** jika ada bunyi yang dijawab keliru atau dibantu petunjuk. Setiap sesi ulang berisi hingga lima bunyi. Bunyi keluar dari daftar latihan setelah dijawab benar pada percobaan pertama tanpa petunjuk. Daftar latihan disimpan di browser untuk masing-masing tingkat.

Di **Kenal Bunyi**, pilih **Meja** dan **Melati** untuk membandingkan bunyi **me** dengan e taling dan e pepet. Tiap tombol memutar suku kata, lalu kata utuh, dengan audio bawaan.

## Untuk orang tua

Buka panel **Untuk orang tua** di bagian bawah halaman untuk mengatur suara. Baca Ceria mengutamakan audio bawaan untuk contoh pelafalan dan suku kata dan dapat memakai suara Bahasa Indonesia dari perangkat untuk kata lain jika tersedia. Untuk mengganti suara, pilih **Bunyi yang ingin diganti**, tekan **Mulai rekam**, ucapkan bunyinya, lalu tekan **Berhenti & simpan**. Bunyi **me** lepas, **me** pada **meja**, **me** pada **melati**, dan kedua kata utuh bisa diganti secara terpisah. Gunakan **Dengar** untuk memeriksa atau **Hapus rekaman** untuk kembali ke suara bawaan.

Perekaman memerlukan izin mikrofon dan browser yang mendukungnya. Bintang dan pengaturan disimpan di browser. Rekaman juga tersimpan secara lokal di browser yang sama.

### Cadangan suara

Pilih **Unduh cadangan suara** untuk menyimpan rekaman orang tua dalam satu file JSON. Simpan file di tempat yang Anda pilih, lalu buka **Impor cadangan suara** di perangkat atau browser tujuan. Impor menambahkan rekaman yang belum ada dan mempertahankan rekaman yang sudah tersimpan. Jika ingin mengganti rekaman yang sudah ada dengan versi cadangan, hapus rekaman itu terlebih dahulu, lalu impor lagi.

## Menjalankan secara lokal

Buka [`index.html`](index.html) dari folder repositori untuk bermain. Tidak perlu memasang dependensi atau menjalankan build. Untuk perekaman mikrofon secara lokal, jalankan server berikut dan buka [localhost:8000](http://localhost:8000/).

```sh
python3 -m http.server 8000
```

## Struktur proyek

- `index.html` dan `styles.css` mengatur tampilan.
- `js/game.js` mengatur aktivitas, soal, dan bintang.
- `js/audio.js` menangani pemutaran, perekaman, dan cadangan suara.
- `js/progress.js` menyimpan daftar Latihan Lagi.
- `data/` berisi bank soal dan audio bawaan.

## Kredit foto

| Foto | Sumber dan pembuat | Lisensi | Perubahan |
| --- | --- | --- | --- |
| Apel | [Apple in lightbox](https://commons.wikimedia.org/wiki/File:Apple_in_lightbox.jpg), Slewrate | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | Diperkecil |
| Pisang | [Banana-Single](https://commons.wikimedia.org/wiki/File:Banana-Single.jpg), Evan-Amos | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Diperkecil |
| Lemon | [Whole-Lemon](https://commons.wikimedia.org/wiki/File:Whole-Lemon.jpg), Evan-Amos | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Diperkecil |
| Jeruk | [Orange-Whole-&-Split](https://commons.wikimedia.org/wiki/File:Orange-Whole-%26-Split.jpg), Evan-Amos | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Dipotong untuk menampilkan satu jeruk dan diperkecil |
| Balon | [Girl inflating a red balloon](https://commons.wikimedia.org/wiki/File:Girl_inflating_a_red_balloon.jpg), Renato Ganoza | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | Dipotong untuk menampilkan balon dan diperkecil |
