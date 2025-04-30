# Bean & Barrel

Bean & Barrel is a full-stack web application designed to help users find, review, and recommend coffee shops and bars in Boulder, Colorado. By combining user-friendly front-end design, robust back-end API management, and reliable data sources, it offers a seamless experience for discovering local beverage establishments. This project not only enhances the way people explore and support local businesses but also fosters community connection and informed decision-making.

## Members

`Betsy Molgano`,`Rona Guo`,`Yan Xia`, `Shane Wierl`, `Ziqian Wang`, `Maiqi Hou`

## Tech Stack

<div align="center">
    <div>
        <img height="100" width="100" src="https://cdn.jsdelivr.net/gh/sun0225SUN/sun0225SUN/assets/images/react.webp">
        <img heigh = "100" width = "100" src="https://user-images.githubusercontent.com/74038190/212257460-738ff738-247f-4445-a718-cdd0ca76e2db.gif">
        <img height="100" width="100" src="https://cdn.jsdelivr.net/gh/sun0225SUN/sun0225SUN/assets/images/html.webp">
        <img height="100" width="100" src="https://cdn.jsdelivr.net/gh/sun0225SUN/sun0225SUN/assets/images/cssgif.webp">
        <img height="100" width="100" src="https://cdn.jsdelivr.net/gh/sun0225SUN/sun0225SUN/assets/images/python.webp">
    </div>
    <div>
        <img heigh = "100" width = "100" src="https://private-user-images.githubusercontent.com/74038190/238200620-398b19b1-9aae-4c1f-8bc0-d172a2c08d68.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDUzNzQ5NTIsIm5iZiI6MTc0NTM3NDY1MiwicGF0aCI6Ii83NDAzODE5MC8yMzgyMDA2MjAtMzk4YjE5YjEtOWFhZS00YzFmLThiYzAtZDE3MmEyYzA4ZDY4LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA0MjMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNDIzVDAyMTczMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWRhY2Q3MzE0MzE2OGY3MDExNzJmMTQ5YzI3NGM3ZDM1YzE5NzNkYjQzMGY0YTc0YTc5MjU1OTNhNjViMjM1NzkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.QkbF_qvo0L7ctqDh7R-HqLjk24CaCHxXzcGiAYfGwDs">
        <img height="100" width="100" src="https://cdn.jsdelivr.net/gh/sun0225SUN/sun0225SUN/assets/images/vscode.webp">
        <img heigh = "100" width = "100" src="https://user-images.githubusercontent.com/74038190/212281775-b468df30-4edc-4bf8-a4ee-f52e1aaddc86.gif">
        <img height="100" width="100" src="https://cdn.jsdelivr.net/gh/sun0225SUN/sun0225SUN/assets/images/github.webp">
        <img height="100" width="100" src="https://raw.githubusercontent.com/hernandito/unRAID-Docker-Folder-Animated-Icons---Alternate-Colors/master/Pale-Collection/pale-docker.svg">
    </div>
</div>

## Demo

https://github.com/user-attachments/assets/87e79e44-1a76-445c-8b4c-d9878a45cf2f


## Notes
Before you run this program, please create `.env` in Client and Server folders

Client folder .env example
```
# Client/.env
VITE_GOOGLE_MAP_API = 'YOUR GOOGLE MAP API'
VITE_GOOGLE_MAP_ID = 'Your GOOGLE MAP ID'
```

Server folder .env example

```
GOOGLE_MAP_API = 'YOUR GOOGLE MAP API'
```

<div align="center">
    <img src="https://private-user-images.githubusercontent.com/74038190/240304586-d48893bd-0757-481c-8d7e-ba3e163feae7.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDUzNzUzMTcsIm5iZiI6MTc0NTM3NTAxNywicGF0aCI6Ii83NDAzODE5MC8yNDAzMDQ1ODYtZDQ4ODkzYmQtMDc1Ny00ODFjLThkN2UtYmEzZTE2M2ZlYWU3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA0MjMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNDIzVDAyMjMzN1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWFlOTA0OWEzZGVlYmFmNmI0NmYwZmM3MThiNzJjMTY1MDE5MDlmOWMwZmJjNmY4NmU4MzRmMDE0OTkxMjg0MWImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.-U_ajFZqj5tU-ELSRINIjNtMavpDNj7ygbGXeo4qTtI">
</div>
