# Situs WattSettle sebagai container: npm membangun situs statis, nginx menyajikannya.
# Traefik (Easypanel) menerminasi TLS di depan, jadi tidak ada yang bicara HTTPS di sini.

FROM node:22-slim AS build
WORKDIR /app
ENV CI=true
# Dependency dulu supaya perubahan konten tidak memasang ulang seluruh pohon.
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Security header dihasilkan dari dist/_headers, berkas yang sama yang dipakai QA suite,
# supaya CSP di produksi tidak pernah menyimpang dari yang diuji. Format _headers:
# baris "/*" lalu baris "  Nama: nilai" berindentasi dua spasi.
RUN awk 'sub(/^  /,"") && /^[A-Za-z-]+:/ { \
      k = substr($0, 1, index($0, ":") - 1); \
      v = substr($0, index($0, ":") + 2); \
      gsub(/"/, "\\\"", v); \
      printf "add_header %s \"%s\" always;\n", k, v \
    }' dist/_headers > /tmp/headers.conf \
 && test -s /tmp/headers.conf

FROM nginx:alpine
COPY deploy/nginx-container.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/headers.conf /etc/nginx/conf.d/headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
    CMD wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1 || exit 1
