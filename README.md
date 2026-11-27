# Baca Ceria — Fonik Bahasa Indonesia

Baca Ceria adalah permainan belajar membaca untuk anak yang baru mulai mengenal bunyi huruf dan suku kata dalam Bahasa Indonesia. Anak bisa mendengarkan contoh, menyusun kata, dan mencocokkan bacaan dengan gambar.

**[Mainkan Baca Ceria](https://iangumi.github.io/fonik/)**

## Cara bermain

Pilih tingkat **Pemula** atau **Lanjutan**, lalu pilih aktivitas. Nama aktivitas dibacakan saat dipilih jika suara aktif.

| Aktivitas | Latihan |
| --- | --- |
| **Kenal Bunyi** | Ketuk huruf atau suku kata untuk mendengar bunyinya. |
| **Dengar & Pilih** | Dengarkan bunyi, lalu pilih suku kata yang sesuai. |
| **Susun Kata** | Lihat foto benda dan urutkan potongan suku kata hingga membentuk kata. |
| **Baca Gambar** | Baca kata yang tampil, lalu pilih gambar yang cocok. |
| **Berhitung** | Pilih jawaban untuk penjumlahan hingga 10. Tingkat Lanjutan juga berisi pengurangan. Tekan **Dengarkan soal** untuk mendengar pertanyaan dalam Bahasa Indonesia. |
| **Hitung Gambar** | Ketuk gambar satu per satu dan pilih jumlahnya. Pemula menghitung 1–5 gambar dan Lanjutan hingga 10. Tekan **Dengarkan soal** untuk mendengar nama benda yang dihitung. |
| **Tebak Gambar** | Lihat satu foto, lalu ketuk salah satu dari tiga kata. Setiap kata dibacakan saat disentuh. |

Setiap sesi reguler berisi lima soal. Soal dan pilihan jawaban diacak, dan beberapa kata punya variasi gambar. Jawaban yang benar menambah bintang. Pilih **Sesi baru** untuk memulai latihan lagi.

**Latihan Lagi** muncul setelah sesi **Dengar & Pilih** jika ada bunyi yang dijawab keliru atau dibantu petunjuk. Setiap sesi ulang berisi hingga lima bunyi. Bunyi keluar dari daftar latihan setelah dijawab benar pada percobaan pertama tanpa petunjuk. Daftar latihan disimpan di browser untuk masing-masing tingkat.

**Susun Kata** memakai 14 kata bergambar dengan dua foto per kata. Saat kata yang sama muncul lagi, game memilih foto yang berbeda. **Tebak Gambar** juga memakai variasi foto. **Hitung Gambar** memakai satu benda per foto agar mudah dihitung.

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
| Bola (1) | [Soccer ball on ground.jpg](https://commons.wikimedia.org/wiki/File:Soccer_ball_on_ground.jpg) oleh Petey21 | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | Diperkecil dan dikonversi ke JPG |
| Bola (2) | [Basketball.png](https://commons.wikimedia.org/wiki/File:Basketball.png) oleh Reisio | Domain publik | Diperkecil dan dikonversi ke JPG |
| Dadu (1) | [6sided dice.jpg](https://commons.wikimedia.org/wiki/File:6sided_dice.jpg) oleh Diacritica | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | Diperkecil dan dikonversi ke JPG |
| Dadu (2) | [Dice.jpg](https://commons.wikimedia.org/wiki/File:Dice.jpg) oleh Gaz at English Wikipedia | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Diperkecil dan dikonversi ke JPG |
| Palu (1) | [Claw-hammer.jpg](https://commons.wikimedia.org/wiki/File:Claw-hammer.jpg) oleh Evan-Amos | Domain publik | Diperkecil dan dikonversi ke JPG |
| Palu (2) | [Hammer.jpg](https://commons.wikimedia.org/wiki/File:Hammer.jpg) oleh Michael Jastremski | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | Diperkecil dan dikonversi ke JPG |
| Buku (1) | [Blank books stacked on a table.jpg](https://commons.wikimedia.org/wiki/File:Blank_books_stacked_on_a_table.jpg) oleh Trey Jones | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | Diperkecil dan dikonversi ke JPG |
| Buku (2) | [Two bookshelves full of books belonging to Unitedmissionary (2010).jpg](https://commons.wikimedia.org/wiki/File:Two_bookshelves_full_of_books_belonging_to_Unitedmissionary_(2010).jpg) oleh Unitedmissionary | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | Diperkecil dan dikonversi ke JPG |
| Topi (1) | [CAPS.jpg](https://commons.wikimedia.org/wiki/File:CAPS.jpg) oleh NNU-11-Zaclee | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | Diperkecil dan dikonversi ke JPG |
| Topi (2) | [Baseball cap.png](https://commons.wikimedia.org/wiki/File:Baseball_cap.png) oleh Original photograph by TexasRebel. Derivative version by ReneeWrites | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | Diperkecil dan dikonversi ke JPG |
| Roti (1) | [Sliced Bread.jpg](https://commons.wikimedia.org/wiki/File:Sliced_Bread.jpg) oleh Gnu-Bricoleur | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | Diperkecil dan dikonversi ke JPG |
| Roti (2) | [Homemade wholemeal bread.png](https://commons.wikimedia.org/wiki/File:Homemade_wholemeal_bread.png) oleh Marius Vassnes | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | Diperkecil dan dikonversi ke JPG |
| Apel (2) | [AppleGreen.JPG](https://commons.wikimedia.org/wiki/File:AppleGreen.JPG) oleh Vicki Nunn | Domain publik | Diperkecil dan dikonversi ke JPG |
| Pisang (2) | [Banana fruit on white background.jpg](https://commons.wikimedia.org/wiki/File:Banana_fruit_on_white_background.jpg) oleh Titus Tscharntke | Domain publik | Diperkecil dan dikonversi ke JPG |
| Jeruk (2) | [Single Orange (Fruit).jpg](https://commons.wikimedia.org/wiki/File:Single_Orange_(Fruit).jpg) oleh Augustus Binu : flickr | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | Diperkecil dan dikonversi ke JPG |
| Lemon (2) | [Lemon.jpg](https://commons.wikimedia.org/wiki/File:Lemon.jpg) oleh André Karwath aka Aka | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) | Diperkecil dan dikonversi ke JPG |
| Balon (2) | [Birthday party (8637983246).jpg](https://commons.wikimedia.org/wiki/File:Birthday_party_(8637983246).jpg) oleh Newtown grafitti from Sydney, Australia | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | Diperkecil dan dikonversi ke JPG |
| Kucing (1) | [Cat August 2010-1.jpg](https://commons.wikimedia.org/wiki/File:Cat_August_2010-1.jpg) oleh Alvesgaspar | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | Diperkecil dan dikonversi ke JPG |
| Kucing (2) | [Domestic cat portrait.jpg](https://commons.wikimedia.org/wiki/File:Domestic_cat_portrait.jpg) oleh The Roving Rokibul | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | Diperkecil dan dikonversi ke JPG |
| Sepeda (1) | [Bike-side.jpg](https://commons.wikimedia.org/wiki/File:Bike-side.jpg) oleh MartinThoma | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | Diperkecil dan dikonversi ke JPG |
| Sepeda (2) | [Three rusty bicycles.jpg](https://commons.wikimedia.org/wiki/File:Three_rusty_bicycles.jpg) oleh Pratap555 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | Diperkecil dan dikonversi ke JPG |
| Telur (1) | [Chicken eggs white colour.jpg](https://commons.wikimedia.org/wiki/File:Chicken_eggs_white_colour.jpg) oleh கமல்நாத் .பெ | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | Diperkecil dan dikonversi ke JPG |
| Telur (2) | [White egg.jpg](https://commons.wikimedia.org/wiki/File:White_egg.jpg) oleh Suryachandran99 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | Diperkecil dan dikonversi ke JPG |
