function buscarClima() {
    var resultado = document.getElementById("resultado");
    var cidade = document.getElementById("cidade").value;
    var nomeCidade;
    var latitude;
    var longitude;

    if (cidade == "fortaleza") {
        nomeCidade = "Fortaleza";
        latitude = -3.73;
        longitude = -38.52;
    } else if (cidade == "juazeiro") {
        nomeCidade = "Juazeiro do Norte";
        latitude = -7.21;
        longitude = -39.31;
    } else if (cidade == "sao-paulo") {
        nomeCidade = "São Paulo";
        latitude = -23.55;
        longitude = -46.63;
    } else {
        nomeCidade = "Rio de Janeiro";
        latitude = -22.90;
        longitude = -43.20;
    }

    resultado.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Buscando dados...</p>
        </div>
    `;

    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto";

    fetch(url)
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(dados) {
            var temperatura = dados.current.temperature_2m;
            var umidade = dados.current.relative_humidity_2m;
            var vento = dados.current.wind_speed_10m;
            var codigo = dados.current.weather_code;
            var horario = dados.current.time.replace("T", " ");

            var descricao = "Tempo não informado";
            var icone = "🌡️";

            if (codigo == 0) {
                descricao = "Céu limpo";
                icone = "☀️";
            } else if (codigo == 1 || codigo == 2 || codigo == 3) {
                descricao = "Parcialmente nublado";
                icone = "⛅";
            } else if (codigo == 45 || codigo == 48) {
                descricao = "Neblina";
                icone = "🌫️";
            } else if (codigo == 51 || codigo == 53 || codigo == 55 || codigo == 61 || codigo == 63 || codigo == 65 || codigo == 80 || codigo == 81 || codigo == 82) {
                descricao = "Chuva";
                icone = "🌧️";
            } else if (codigo >= 95) {
                descricao = "Tempestade";
                icone = "⛈️";
            }

            resultado.innerHTML = `
                <div class="text-center">
                    <div class="icone-clima">${icone}</div>
                    <h2>${nomeCidade}</h2>
                    <p class="text-muted">${descricao}</p>
                    <div class="temperatura">${temperatura}°C</div>
                </div>
                <div class="row g-3 mt-3">
                    <div class="col-12 col-sm-6">
                        <div class="info-box">
                            <p>Umidade</p>
                            <strong>${umidade}%</strong>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="info-box">
                            <p>Vento</p>
                            <strong>${vento} km/h</strong>
                        </div>
                    </div>
                </div>
                <p class="text-center text-muted mt-3 mb-0">
                    Atualizado em: ${horario}
                </p>
            `;
        })
        .catch(function() {
            resultado.innerHTML = `
                <div class="alert alert-danger text-center">
                    Erro ao buscar os dados do clima.
                </div>
            `;
        });
}
