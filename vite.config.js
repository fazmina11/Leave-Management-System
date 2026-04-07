import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
=======
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
})
