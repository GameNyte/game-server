'use strict';

// window.onload = () => {
//   const fragment = new URLSearchParams(window.location.hash.slice(1));

//   if (fragment.has("access_token")) {
//     const accessToken = fragment.get("access_token");
//     const tokenType = fragment.get("token_type");

//     fetch('https://discordapp.com/api/users/@me', {
//       headers: {
//         authorization: `${tokenType} ${accessToken}`
//       }
//     })
//       .then(res => res.json())
//       .then(response => {
//         const { username, discriminator } = response;
//         document.getElementById('info').innerText += ` ${username}#${discriminator}`;
//       })
//       .catch(console.error);

//   }
//   else {
//     document.getElementById('login').style.display = 'block';
//   }
// }