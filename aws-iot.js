// AWS IoT Configuration 
AWS.config.region = 'us-east-1'; 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:ce3712e6-1f35-4315-b141-6945ff1f5eef' // dentityPoolId eka
});

// Create an IoT Data client
const iotData = new AWS.IotData({
    endpoint: 'a2kcj74481fo95-ats.iot.us-east-1.amazonaws.com', //  endpoint
    service: 'iotdata' // IoT Data
});

const thingName = "ESP32";  // IoT Thing Name eka

// Function to Fetch Real-time Data from AWS IoT
function fetchDataFromAWSIoT() {
    const params = {
        thingName: thingName
    };

    iotData.getThingShadow(params, function (err, data) {
        if (err) {
            console.log("Error fetching data from AWS IoT:", err);
        } else {
            const payload = JSON.parse(data.payload);
            console.log("AWS IoT Data:", payload);

            const sampleData = {
                timestamp: new Date().toLocaleTimeString(),
                rainfall: payload.state?.reported?.rainfall || 0,
                windSpeed: payload.state?.reported?.windSpeed || 0,
                windDirection: payload.state?.reported?.windDirection || 0,
                temperature: payload.state?.reported?.temperature || 0,
                humidity: payload.state?.reported?.humidity || 0,
                waterLevel: payload.state?.reported?.waterLevel || 0,
                predictedLevels: payload.state?.reported?.predictedLevels || 0,
                predictedReleases: payload.state?.reported?.predictedReleases || 0
            };

            // Update UI
            document.getElementById("temperature").innerText = sampleData.temperature;
            document.getElementById("humidity").innerText = sampleData.humidity;

            function updateChart(chart, value) {
                if (chart.data.labels.length > 10) {
                    chart.data.labels.shift();
                    chart.data.datasets[0].data.shift();
                }
                chart.data.labels.push(sampleData.timestamp);
                chart.data.datasets[0].data.push(value);
                chart.update();
            }

            // Update charts with real data
            updateChart(windSpeedChart, sampleData.windSpeed);
            updateChart(windDirectionChart, sampleData.windDirection);
            updateChart(waterLevelChart, sampleData.waterLevel);
            updateChart(rainfallChart, sampleData.rainfall);
            updateChart(predictedLevelsChart, sampleData.predictedLevels);
            updateChart(predictedReleasesChart, sampleData.predictedReleases);
        }
    });
}

// Fetch data every 10 seconds
setInterval(fetchDataFromAWSIoT, 10000);
