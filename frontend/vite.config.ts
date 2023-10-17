import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
// import Legacy from '@vitejs/plugin-legacy'; // Importez le plugin
import React, { useEffect, useState } from "react";
// import million from 'million/compiler';

// https://vitejs.dev/config/

// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
   watch: {
    usePolling: true,
   },
   host: true, // Here
   strictPort: true,
   port: 5173, 
 }})

// million.vite({ auto: true }), 
// 

// export default defineConfig({
//   plugins: [
//     react(),
//     Legacy({
//       // ajoutez votre configuration ici si nécessaire
//     }),
//   ],
//   server: {
//     watch: {
//       usePolling: true,
//     },
//     host: true,
//     strictPort: true,
//     port: 5173,
//   },
// });