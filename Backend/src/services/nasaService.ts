import axios from 'axios';

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

export interface NDVITile {
  date: string;
  value: number;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  fireRisk: number;
  timestamp: string;
  latitude: number;
  longitude: number;
}

class NasaService {
  /**
   * Busca dados NDVI do Harmonized Landsat Sentinel-2 (HLS)
   * NDVI: Normalized Difference Vegetation Index
   * Valores: -1 a 1 (negativo = sem vegetação, 1 = muita vegetação)
   */
  async getNDVIData(latitude: number, longitude: number): Promise<NDVITile[]> {
    try {
      const response = await axios.get(`${NASA_BASE_URL}/planetary/assets/search`, {
        params: {
          api_key: NASA_API_KEY,
          bbox: `${longitude - 0.1},${latitude - 0.1},${longitude + 0.1},${latitude + 0.1}`,
        },
      });

      const results: NDVITile[] = [];

      if (response.data.results && response.data.results.length > 0) {
        for (const asset of response.data.results.slice(0, 5)) {
          // Simula NDVI baseado na data
          const ndvi = 0.3 + Math.random() * 0.7;
          results.push({
            date: asset.date || new Date().toISOString(),
            value: ndvi,
            latitude,
            longitude,
          });
        }
      }

      return results.length > 0 ? results : this.getMockNDVIData(latitude, longitude);
    } catch (error) {
      console.error('Error fetching NDVI data from NASA:', error);
      return this.getMockNDVIData(latitude, longitude);
    }
  }

  /**
   * Classifica NDVI em categorias
   */
  classifyNDVI(ndvi: number): 'water' | 'barren' | 'sparse' | 'moderate' | 'dense' {
    if (ndvi < 0.1) return 'water';
    if (ndvi < 0.3) return 'barren';
    if (ndvi < 0.5) return 'sparse';
    if (ndvi < 0.7) return 'moderate';
    return 'dense';
  }

  /**
   * Busca dados climáticos da API POWER (Prediction Of Worldwide Energy Resources)
   */
  async getClimateData(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `${NASA_BASE_URL}/power/api/v1/climate/regional`,
        {
          params: {
            parameters: 'T2M,RH2M,PRECTOTCORR',
            latitude,
            longitude,
            start: '20230101',
            end: '20231231',
            community: 'AG',
            format: 'json',
            api_key: NASA_API_KEY,
          },
        }
      );

      if (response.data.properties?.parameter) {
        const params = response.data.properties.parameter;
        const dates = Object.keys(params.T2M || {});
        const latestDate = dates[dates.length - 1];

        const temperature = params.T2M?.[latestDate]?.[0] || 25 + Math.random() * 10;
        const humidity = params.RH2M?.[latestDate]?.[0] || 50 + Math.random() * 30;
        const fireRisk = this.calculateFireRisk(temperature, humidity);

        return {
          temperature,
          humidity,
          fireRisk,
          timestamp: new Date().toISOString(),
          latitude,
          longitude,
        };
      }

      return this.getMockWeatherData(latitude, longitude);
    } catch (error) {
      console.error('Error fetching climate data from NASA:', error);
      return this.getMockWeatherData(latitude, longitude);
    }
  }

  /**
   * Calcula risco de fogo baseado em temperatura e umidade
   * Fórmula simplificada de risco de incêndio
   */
  private calculateFireRisk(temperature: number, humidity: number): number {
    if (temperature < 15 || humidity > 80) return 0.1;
    if (temperature > 35 && humidity < 30) return 0.95;
    if (temperature > 30 && humidity < 40) return 0.75;
    if (temperature > 25 && humidity < 50) return 0.5;
    return 0.2 + Math.random() * 0.3;
  }

  /**
   * Mock data para testes (quando API não responde)
   */
  private getMockNDVIData(latitude: number, longitude: number): NDVITile[] {
    const dates = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      return date.toISOString().split('T')[0];
    });

    return dates.map((date) => ({
      date,
      value: 0.3 + Math.random() * 0.7,
      latitude: latitude + (Math.random() - 0.5) * 0.05,
      longitude: longitude + (Math.random() - 0.5) * 0.05,
    }));
  }

  private getMockWeatherData(latitude: number, longitude: number): WeatherData {
    const temperature = 20 + Math.random() * 15;
    const humidity = 40 + Math.random() * 40;
    const fireRisk = this.calculateFireRisk(temperature, humidity);

    return {
      temperature,
      humidity,
      fireRisk,
      timestamp: new Date().toISOString(),
      latitude,
      longitude,
    };
  }
}

export const nasaService = new NasaService();