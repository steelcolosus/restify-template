FROM microsoft/mssql-server-linux:latest

RUN apt-get update && apt-get install -y  \
    curl \
    apt-transport-https

# https://docs.microsoft.com/en-us/sql/connect/odbc/linux/installing-the-microsoft-odbc-driver-for-sql-server-on-linux
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql-release.list

RUN apt-get install -y locales \
    && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen

ENV PATH="/opt/mssql-tools/bin:${PATH}"

COPY entrypoint.sh /entrypoint.sh
COPY setup.sql /setup.sql
COPY configure-db.sh /configure-db.sh

RUN chmod +x entrypoint.sh
RUN chmod +x configure-db.sh


ENTRYPOINT ["./entrypoint.sh"]
CMD ["tail -f /dev/null"]

HEALTHCHECK --interval=15s CMD sqlcmd -U sa -P $SA_PASSWORD -Q "select 1" && grep -q "MSSQL CONFIG COMPLETE" ./config.log