# FitTrack Hub

Creează o aplicație web React complet funcțională numită FitTrack, conectată la Supabase, care să reprezinte un MVP pentru evidența antrenamentelor personale.

1. Scopul aplicației

FitTrack este o aplicație simplă de fitness prin care utilizatorii își pot crea un cont, se pot autentifica și își pot înregistra antrenamentele personale.

Fiecare utilizator trebuie să poată:

să își creeze un cont;

să se autentifice;

să se deconecteze;

să adauge un antrenament nou;

să vadă lista propriilor antrenamente;

să deschidă un antrenament pentru a vedea toate detaliile;

să vadă câteva statistici simple despre activitatea sa.

Aplicația trebuie să fie un MVP simplu, modern, intuitiv și complet funcțional. Nu doresc funcționalități inutile sau prea complexe.

2. Tehnologii

Folosește:

React;

TypeScript;

React Router pentru navigare;

Supabase pentru autentificare și baza de date;

componente UI moderne și responsive;

validarea formularelor;

mesaje vizuale de succes și eroare.

Nu utiliza date mock permanente. Datele reale trebuie salvate și citite din Supabase.

3. Autentificare

Implementează autentificarea folosind Supabase Auth cu email și parolă.

Trebuie să existe:

Register

Formular cu:

nume complet;

email;

parolă;

confirmarea parolei.

Login

Formular cu:

email;

parolă.

Logout

Un buton vizibil pentru utilizatorul autentificat.

După autentificare, utilizatorul trebuie redirecționat către Dashboard.

Paginile interne ale aplicației trebuie protejate, astfel încât utilizatorii neautentificați să nu poată accesa Dashboard, lista antrenamentelor sau formularul pentru adăugarea unui antrenament.

4. Baza de date Supabase

Creează structura necesară pentru baza de date.

Tabelul profiles

Câmpuri:

id – UUID, primary key, asociat cu utilizatorul din Supabase Auth;

full_name – text;

email – text;

created_at – timestamp, implicit data curentă.

Tabelul workouts

Câmpuri:

id – UUID, primary key;

user_id – UUID, foreign key către utilizator/profil;

title – text, obligatoriu;

workout_type – text, obligatoriu;

duration – integer, durata în minute;

workout_date – date;

calories – integer, opțional;

notes – text, opțional;

created_at – timestamp, implicit data curentă.

Configurează corect relația dintre utilizatori și antrenamente.

Implementează și politicile Row Level Security (RLS) necesare astfel încât fiecare utilizator autentificat:

să își poată vedea propriul profil;

să își poată vedea doar propriile antrenamente;

să poată adăuga antrenamente doar pentru propriul cont;

să nu poată vedea sau modifica antrenamentele altor utilizatori.

5. Pagini

Aplicația trebuie să aibă următoarele pagini și navigare funcțională între ele.

Pagina 1 – Login / Register

Creează o interfață modernă pentru autentificare.

Utilizatorul trebuie să poată comuta ușor între:

Login;

Create account.

Afișează mesaje clare dacă autentificarea eșuează sau dacă înregistrarea este realizată cu succes.

Pagina 2 – Dashboard

Aceasta este pagina principală după autentificare.

Afișează:

mesaj de bun venit cu numele utilizatorului;

numărul total de antrenamente;

durata totală a antrenamentelor în minute;

totalul caloriilor arse, dacă există date;

ultimul antrenament înregistrat.

Adaugă și un buton principal:

„Adaugă antrenament”

care duce către formularul pentru adăugarea unui antrenament.

Statisticile trebuie calculate pe baza datelor reale din Supabase.

Pagina 3 – Adaugă antrenament

Creează un formular cu următoarele câmpuri:

Numele antrenamentului

input text;

obligatoriu;

exemplu: „Antrenament picioare”.

Tipul antrenamentului

dropdown/select;

obligatoriu;

opțiuni:

Forță

Cardio

Stretching

Alergare

Ciclism

Înot

Altul

Durata

număr;

exprimată în minute;

obligatoriu;

trebuie să fie mai mare decât 0.

Data antrenamentului

selector de dată;

obligatoriu.

Calorii arse

număr;

opțional.

Observații

textarea;

opțional.

Buton:

„Salvează antrenamentul”

La apăsarea butonului:

validează formularul;

salvează antrenamentul în tabelul workouts din Supabase;

asociază automat antrenamentul cu utilizatorul autentificat;

afișează un mesaj de succes;

redirecționează utilizatorul către lista antrenamentelor.

Dacă apare o eroare, afișează un mesaj clar și nu pierde valorile introduse în formular.

Pagina 4 – Antrenamentele mele

Afișează toate antrenamentele utilizatorului autentificat, citite direct din Supabase.

Pentru fiecare antrenament afișează:

titlul;

tipul;

data;

durata;

caloriile, dacă există.

Antrenamentele trebuie afișate de la cel mai recent la cel mai vechi.

Fiecare antrenament trebuie să fie într-un card sau într-un rând clar și să poată fi accesat prin click sau printr-un buton:

„Vezi detalii”

Dacă utilizatorul nu are niciun antrenament, afișează un empty state prietenos, de exemplu:

„Nu ai adăugat încă niciun antrenament.”

și un buton:

„Adaugă primul antrenament”

Pagina 5 – Detalii antrenament

Când utilizatorul selectează un antrenament din listă, deschide o pagină separată.

Afișează:

numele antrenamentului;

tipul;

data;

durata;

caloriile;

observațiile;

data la care înregistrarea a fost creată.

Datele trebuie încărcate din Supabase folosind ID-ul antrenamentului din URL.

Utilizatorul trebuie să poată accesa doar propriile antrenamente.

Adaugă un buton:

„Înapoi la antrenamente”

6. Navigare

După autentificare, aplicația trebuie să aibă un navbar sau sidebar cu:

Dashboard;

Adaugă antrenament;

Antrenamentele mele;

Logout.

Pe desktop poate fi navbar sau sidebar, iar pe mobil navigarea trebuie să fie adaptată pentru ecrane mici.

Evidențiază vizual pagina activă.

7. Design

Doresc un design modern, curat și profesional, specific unei aplicații de fitness.

Folosește:

layout aerisit;

carduri cu colțuri rotunjite;

umbre discrete;

iconițe potrivite;

tipografie modernă;

butoane clare;

spațiere consistentă;

design responsive pentru desktop, tabletă și telefon.

Poți folosi o paletă modernă bazată pe:

fundal alb sau foarte deschis;

nuanțe de verde / emerald pentru acțiunile principale;

gri închis pentru text;

culori discrete pentru carduri și statistici.

Nu exagera cu animațiile. Prioritatea este claritatea și funcționalitatea.

8. UX și stări ale aplicației

Implementează corect:

loading states în timpul încărcării datelor;

error states dacă Supabase returnează o eroare;

empty states când nu există date;

mesaje de succes după salvarea unui antrenament;

validarea formularelor;

dezactivarea butonului de submit în timpul salvării pentru a preveni salvarea duplicată.

Nu lăsa erori în consola browserului.

9. Cerințe importante

Aplicația finală trebuie să îndeplinească următoarele:

să fie o aplicație React funcțională;

să fie conectată real la Supabase;

să permită înregistrarea utilizatorilor;

să permită autentificarea;

să permită logout;

să aibă minimum 3 pagini, dar implementează paginile descrise mai sus;

să aibă navigare funcțională;

să conțină un formular pentru introducerea datelor;

formularul să salveze efectiv datele în Supabase;

datele salvate să fie afișate într-o pagină separată;

fiecare antrenament din listă să poată fi deschis într-o pagină de detalii;

fiecare utilizator să vadă doar propriile date;

să fie responsive;

să nu existe erori în consola browserului.

10. Prioritatea proiectului

Construiește mai întâi funcționalitățile esențiale și asigură-te că acestea funcționează corect:

Authentication → Supabase database → Add workout → Display workouts → Workout details → Dashboard

Nu adăuga funcționalități complexe care nu sunt necesare pentru MVP.

Dacă sunt necesare tabele, politici RLS, funcții sau alte configurări Supabase, creează configurația necesară și explică-mi clar ce trebuie să execut sau să configurez în Supabase.

La final, verifică toate paginile, navigarea, autentificarea, formularele și interogările Supabase și asigură-te că aplicația poate fi testată cap-coadă fără date mock și fără erori.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://fittrack-chita123.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b9b8672f-06ee-4989-9aae-83e4db971376).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
