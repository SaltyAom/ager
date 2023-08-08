FROM debian:11.6-slim as builder

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash -s -- bun-v0.7.3

COPY package.json .
COPY bun.lockb .

RUN /root/.bun/bin/bun install --production

# ? -------------------------
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /root/.bun/bin/bun bun
COPY --from=builder /app/node_modules node_modules

COPY src src
# COPY public public
# COPY tsconfig.json .

ENV SUPABASE_URL https://upvmufxpvkpijpjjhbop.supabase.co
ENV SUPABASE_CLIENT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdm11ZnhwdmtwaWpwampoYm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE0Nzk4MzgsImV4cCI6MjAwNzA1NTgzOH0.pmWOk00q1Knl602jCE-Hp6508pSmSBwGHcuOSRsjSAw
ENV SUPABASE_SERVICE_ROLE eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdm11ZnhwdmtwaWpwampoYm9wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ3OTgzOCwiZXhwIjoyMDA3MDU1ODM4fQ.9rihJdcRbMaOrxj5EVgz23K6Xyw8xtEe1RM0xNLLvJM
ENV REPLICATE_API_TOKEN r8_0Zkd3va5nb37jEH6C6bkWwDCJsr25Ur2kSTbh

ENV ENV production
CMD ["./bun", "src/index.ts"]

EXPOSE 8080
